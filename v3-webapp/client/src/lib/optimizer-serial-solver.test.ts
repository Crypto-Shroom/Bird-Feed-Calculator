import { createRequire } from "node:module";
import { beforeAll, describe, expect, it } from "vitest";

import { BIRD_PROFILES, getCategoryTargets, type BirdType } from "./birds";
import { INGREDIENTS } from "./data";
import { getProfileDefaultIngredients } from "./inventory-presets";
import { adaptExactFeasibilityResult } from "./optimizer-adapter";
import { buildExactFeasibilityModel, type OptimizerCandidate, type OptimizerModel } from "./optimizer-model";
import { solveSerialStages, type HighsSolverLike } from "./optimizer-serial-solver";
import { evaluateSerialObjectives } from "./optimizer-stages";

const require = createRequire(import.meta.url);
const createNodeHighs = require("highs") as () => Promise<HighsSolverLike>;

const macroKeys = ["protein", "carbs", "fat", "fiber"] as const;
const categoryKeys = ["grain", "legume", "seed"] as const;

function candidate(id: string, availableGrams: number): OptimizerCandidate {
  const ingredient = INGREDIENTS[id];
  if (!ingredient) throw new Error(`missing test ingredient ${id}`);
  return {
    id,
    category: ingredient.category,
    availableGrams,
    nutrition: { protein: ingredient.protein, carbs: ingredient.carbs, fat: ingredient.fat, fiber: ingredient.fiber },
    safetyState: "eligible",
  };
}

function profileModel(bird: BirdType, situation: string, inventory: Record<string, number>, targetGrams: number): OptimizerModel {
  return buildExactFeasibilityModel({
    candidates: Object.entries(inventory).map(([id, grams]) => candidate(id, grams)),
    requestedTargetGrams: targetGrams,
    macroRanges: BIRD_PROFILES[bird].profiles[situation].nutrition,
    categoryRanges: getCategoryTargets(bird),
  });
}

/** Every whole-gram vector over the model candidates that sums to W within stock. */
function enumerateMixes(model: OptimizerModel): number[][] {
  const mixes: number[][] = [];
  const walk = (index: number, remaining: number, prefix: number[]): void => {
    const current = model.candidates[index];
    if (index === model.candidates.length - 1) {
      if (remaining <= current.availableGrams) mixes.push([...prefix, remaining]);
      return;
    }
    for (let grams = 0; grams <= Math.min(remaining, current.availableGrams); grams += 1) walk(index + 1, remaining - grams, [...prefix, grams]);
  };
  walk(0, model.achievableTargetGrams, []);
  return mixes;
}

interface ReferenceOutcome {
  branch: "exact" | "fallback";
  quantities: Record<string, number>;
  optimum: { margin?: number; macroDeviation?: number; categoryDeviation?: number; maximum: number; meaningful: number; smallest: number };
}

/**
 * Independent lexicographic reference for spec §5.2, written directly from the
 * definitions (no LP): it scores every complete mix and filters stage by stage,
 * keeping every mix within each stage's documented policy tolerance, then
 * applies the small-inclusion re-solve rule.
 */
function referenceSerialOptimum(model: OptimizerModel, fixedZero: readonly string[] = []): ReferenceOutcome {
  const W = model.achievableTargetGrams;
  const policy = model.policy;
  const tolerance = 1e-7;
  const zeroIndexes = model.candidates.flatMap(({ id }, index) => fixedZero.includes(id) ? [index] : []);
  const scored = enumerateMixes(model).filter((mix) => zeroIndexes.every((index) => mix[index] === 0)).map((mix) => {
    const percent = (macro: (typeof macroKeys)[number]) => mix.reduce((total, grams, index) => total + grams * model.candidates[index].nutrition[macro], 0) / W;
    const share = (category: (typeof categoryKeys)[number]) => mix.reduce((total, grams, index) => total + (model.candidates[index].category === category ? grams : 0), 0) / W * 100;
    const macroValues = macroKeys.map((macro) => ({ value: percent(macro), range: model.macroRanges[macro] }));
    const categoryValues = categoryKeys.map((category) => ({ value: share(category), range: model.categoryRanges[category] }));
    const deviation = (entries: typeof macroValues) => entries.reduce((total, { value, range: [lower, upper] }) => total + (Math.max(0, lower - value) + Math.max(0, value - upper)) / (upper - lower), 0);
    const meaningfulGrams = mix.filter((grams, index) => model.candidates[index].availableGrams >= model.policy.meaningfulInclusionGrams && grams >= model.policy.meaningfulInclusionGrams);
    return {
      mix,
      macroDeviation: deviation(macroValues),
      categoryDeviation: deviation(categoryValues),
      margin: Math.min(...macroValues.map(({ value, range: [lower, upper] }) => Math.min(value - lower, upper - value) / (upper - lower))),
      maximum: Math.max(...mix),
      meaningful: meaningfulGrams.length,
      smallest: meaningfulGrams.length ? Math.min(...meaningfulGrams) : 0,
    };
  });

  type Scored = (typeof scored)[number];
  const keepBest = (pool: Scored[], key: (entry: Scored) => number, sense: "min" | "max", slack = 0) => {
    const values = pool.map(key);
    const best = values.reduce((left, right) => sense === "min" ? Math.min(left, right) : Math.max(left, right));
    return { best, pool: pool.filter((entry) => sense === "min" ? key(entry) <= best + slack + tolerance : key(entry) >= best - slack - tolerance) };
  };

  const exact = scored.filter((entry) => entry.macroDeviation <= 1e-9 && entry.categoryDeviation <= 1e-9);
  let pool: Scored[];
  let branch: "exact" | "fallback";
  const optimum: Partial<ReferenceOutcome["optimum"]> = {};
  if (exact.length > 0) {
    branch = "exact";
    const margin = keepBest(exact, (entry) => entry.margin, "max");
    optimum.margin = Math.max(0, margin.best);
    const floor = Math.max(0, optimum.margin - policy.exactMarginTolerance - policy.exactMarginRelativeTolerance * optimum.margin);
    pool = exact.filter((entry) => entry.margin >= floor - tolerance);
  } else {
    branch = "fallback";
    let step = keepBest(scored, (entry) => entry.macroDeviation, "min");
    optimum.macroDeviation = step.best;
    step = keepBest(step.pool, (entry) => entry.categoryDeviation, "min");
    optimum.categoryDeviation = step.best;
    pool = step.pool;
  }
  let step = keepBest(pool, (entry) => entry.maximum, "min", policy.maximumShareToleranceGrams);
  optimum.maximum = step.best;
  step = keepBest(step.pool, (entry) => entry.meaningful, "max");
  optimum.meaningful = step.best;
  step = keepBest(step.pool, (entry) => entry.smallest, "max");
  optimum.smallest = step.best;
  pool = step.pool;
  model.candidates.forEach((_, index) => {
    pool = keepBest(pool, (entry) => entry.mix[index], "min").pool;
  });
  const outcome: ReferenceOutcome = {
    branch,
    quantities: Object.fromEntries(model.candidates.map(({ id }, index) => [id, pool[0].mix[index]])),
    optimum: optimum as ReferenceOutcome["optimum"],
  };
  if (fixedZero.length > 0) return outcome;

  const small = model.candidates.filter(({ id }) => outcome.quantities[id] > 0 && outcome.quantities[id] < policy.meaningfulInclusionGrams).map(({ id }) => id);
  if (small.length === 0) return outcome;
  const zeroed = model.candidates.map(({ id }) => id).filter((id) => small.includes(id));
  if (enumerateMixes(model).every((mix) => model.candidates.some(({ id }, index) => zeroed.includes(id) && mix[index] !== 0))) return outcome;
  const resolved = referenceSerialOptimum(model, zeroed);
  const evaluated = scored.find((entry) => model.candidates.every(({ id }, index) => entry.mix[index] === resolved.quantities[id]))!;
  const locked = outcome.optimum;
  const slack = tolerance + 1e-9;
  const accepted = resolved.branch === outcome.branch
    && (outcome.branch === "exact"
      ? evaluated.margin >= Math.max(0, locked.margin! - policy.exactMarginTolerance - policy.exactMarginRelativeTolerance * locked.margin!) - slack
      : evaluated.macroDeviation <= locked.macroDeviation! + slack
        && evaluated.categoryDeviation <= locked.categoryDeviation! + slack)
    && evaluated.maximum <= locked.maximum + policy.maximumShareToleranceGrams
    && evaluated.meaningful >= locked.meaningful
    && evaluated.smallest >= locked.smallest;
  return accepted ? resolved : outcome;
}

describe("serial staged optimizer with real HiGHS", () => {
  let highs: HighsSolverLike;
  beforeAll(async () => {
    highs = await createNodeHighs();
  });
  const solve = (model: OptimizerModel) => solveSerialStages(highs, model, { timeBudgetMs: 30_000 });

  // Enumerates every whole-gram mix for a reference answer. It takes a few seconds on a slow CI runner and once exceeded
  // Vitest's 5 s default (PR #251 CI), so it gets an explicit timeout instead of relying on the default.
  it("agrees with an exhaustive whole-gram lexicographic reference on both the exact and the fallback branch", async () => {
    const corpus = [
      profileModel("chicken", "pet", { barley: 20, corn_yellow: 20, oats: 20, peas: 20, wheat: 20 }, 40),
      profileModel("parrot", "pet", { corn_yellow: 30, oats: 30, peas: 30, safflower: 30, wheat: 30 }, 40),
      profileModel("pigeon", "racing", { barley: 30, corn_yellow: 30, peas: 30, safflower: 30 }, 30),
      profileModel("budgie", "pet", { canola: 10, millet: 30, oats: 30, safflower: 10 }, 30),
      profileModel("pigeon", "pet", { corn_yellow: 25, lentils: 10, peas: 25, safflower: 8, wheat: 25 }, 25),
      profileModel("canary", "breeding", { canola: 6, millet: 20, oats: 20, peas: 20, safflower: 6, wheat: 20 }, 20),
      profileModel("chicken", "egg_laying", { barley: 15, corn_yellow: 30, lentils: 15, oats: 15, peas: 15 }, 30),
      // Sensitive to the diversity tolerance band: with every lock exact the reference picks a different mix.
      profileModel("chicken", "pet", { barley: 30, corn_yellow: 30, lentils: 30, oats: 30, peas: 30, wheat: 30 }, 30),
    ];
    const branches = new Set<string>();
    for (const model of corpus) {
      const reference = referenceSerialOptimum(model);
      const result = await solve(model);
      branches.add(reference.branch);
      expect(result.status).toBe(reference.branch === "exact" ? "optimal" : "best_attainable");
      expect(result.quantities).toEqual(reference.quantities);
    }
    expect([...branches].sort()).toEqual(["exact", "fallback"]);
  }, 60_000);

  it("reproduces the documented Chicken/Pet macro margin and returns a validated, range-compliant 1 g mix", async () => {
    const model = profileModel("chicken", "pet", getProfileDefaultIngredients("chicken", "pet"), 1_000);
    const result = await solve(model);

    expect(result.status).toBe("optimal");
    expect(result.objectives.macroMargin).toBeCloseTo(0.1259, 4);
    const adapted = adaptExactFeasibilityResult(
      { type: "result", requestId: "chicken-pet", elapsedMs: 1, status: "optimal", quantities: result.quantities },
      model,
      1_000,
      model.macroRanges,
      model.categoryRanges,
    );
    expect(adapted.status).toBe("feasible");
    expect(Object.values(result.quantities).every(Number.isInteger)).toBe(true);
  });

  it("returns best_attainable with locked macro deviation before category deviation when ranges cannot all be met", async () => {
    // Racing needs at least 16% protein; with only 30 g of peas in stock no mix can reach it, so the ranges cannot all be met.
    // (The standard racing formula itself became feasible when #248 widened the pigeon carbohydrate and fat ranges.)
    const model = profileModel("pigeon", "racing", { wheat: 1_000, corn_yellow: 1_000, peas: 30 }, 1_000);
    const result = await solve(model);

    expect(result.status).toBe("best_attainable");
    expect(result.stages.filter(({ skipped }) => !skipped).map(({ stage }) => stage).slice(0, 6)).toEqual([
      "macro_margin",
      "macro_deviation",
      "category_deviation",
      "maximum_share",
      "meaningful_diversity",
      "smallest_meaningful_amount",
    ]);
    const adapted = adaptExactFeasibilityResult(
      { type: "result", requestId: "pigeon-racing", elapsedMs: 1, status: "best_attainable", quantities: result.quantities },
      model,
      1_000,
      model.macroRanges,
      model.categoryRanges,
    );
    expect(adapted.status).toBe("best_attainable");
    expect(adapted.rangeMisses?.length).toBeGreaterThan(0);
  });

  it("is deterministic for repeated solves and reordered inventory", async () => {
    const inventory = getProfileDefaultIngredients("canary", "breeding");
    const first = await solve(profileModel("canary", "breeding", inventory, 1_000));
    const second = await solve(profileModel("canary", "breeding", inventory, 1_000));
    const reordered = await solve(profileModel("canary", "breeding", Object.fromEntries(Object.entries(inventory).reverse()), 1_000));

    expect(second.quantities).toEqual(first.quantities);
    expect(reordered.quantities).toEqual(first.quantities);
    expect(JSON.stringify(Object.entries(reordered.quantities))).toBe(JSON.stringify(Object.entries(first.quantities)));
  });

  const issue85Inventory = Object.fromEntries(
    ["hemp", "wheat", "peas", "chickpeas", "lentils", "chia", "canola", "corn_yellow", "hemp_hearts", "lentils_brown", "milo", "niger"].map((id) => [id, 1_000]),
  );
  const exactPolicy = (model: OptimizerModel): OptimizerModel => ({
    ...model,
    policy: { ...model.policy, exactMarginRelativeTolerance: 0, maximumShareToleranceGrams: 0 },
  });

  it("uses the diversity tolerance band to pick a more diverse mix while keeping at least 90% of the best macro margin", async () => {
    const model = profileModel("chicken", "pet", issue85Inventory, 1_000);
    const banded = await solve(model);
    const exact = await solve(exactPolicy(model));

    expect(banded.status).toBe("optimal");
    expect(exact.status).toBe("optimal");
    const bandedValues = evaluateSerialObjectives(model, banded.quantities);
    const exactValues = evaluateSerialObjectives(model, exact.quantities);
    expect(bandedValues.meaningfulIngredientCount).toBeGreaterThan(exactValues.meaningfulIngredientCount);
    expect(bandedValues.macroMargin).toBeGreaterThanOrEqual(0.9 * exact.objectives.macroMargin! - 1e-6);
  });

  it("re-solves once without sub-threshold ingredients and keeps the re-solve only when no locked value worsens beyond its tolerance", async () => {
    const meaningful = 5;
    const accepted = await solve(profileModel("chicken", "egg_laying", { barley: 1_000, barley_pearled: 1_000, corn_yellow: 1_000, flaxseed: 1_000, oat_groats: 1_000, rice: 1_000, vetch: 1_000 }, 1_000));
    expect(accepted.smallInclusion?.accepted).toBe(true);
    expect(Object.values(accepted.quantities).every((grams) => grams === 0 || grams >= meaningful)).toBe(true);
    expect(accepted.stages.some(({ pass }) => pass === "small_inclusion_resolve")).toBe(true);

    // Parrot/Pet defaults need a few grams of wheat to reach the smallest macro deviation, so the primary mix is kept.
    const rejected = await solve(profileModel("parrot", "pet", getProfileDefaultIngredients("parrot", "pet"), 1_000));
    expect(rejected.status).toBe("best_attainable");
    expect(rejected.smallInclusion).toMatchObject({ accepted: false });
    expect(rejected.smallInclusion?.reason).toContain("macro deviation");
    expect(rejected.smallInclusion?.removedIds.every((id) => rejected.quantities[id] > 0 && rejected.quantities[id] < meaningful)).toBe(true);
  });
});
