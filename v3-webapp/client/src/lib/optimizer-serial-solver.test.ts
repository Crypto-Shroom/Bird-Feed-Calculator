import { createRequire } from "node:module";
import { beforeAll, describe, expect, it } from "vitest";

import { BIRD_PROFILES, getCategoryTargets, type BirdType } from "./birds";
import { INGREDIENTS } from "./data";
import { getProfileDefaultIngredients } from "./inventory-presets";
import { adaptExactFeasibilityResult } from "./optimizer-adapter";
import { buildExactFeasibilityModel, type OptimizerCandidate, type OptimizerModel } from "./optimizer-model";
import { solveSerialStages, type HighsSolverLike } from "./optimizer-serial-solver";

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

/**
 * Independent lexicographic reference for spec §5.2, written directly from the
 * definitions (no LP): it scores every complete mix and filters stage by stage.
 */
function referenceSerialOptimum(model: OptimizerModel): { branch: "exact" | "fallback"; quantities: Record<string, number> } {
  const W = model.achievableTargetGrams;
  const tolerance = 1e-7;
  const scored = enumerateMixes(model).map((mix) => {
    const percent = (macro: (typeof macroKeys)[number]) => mix.reduce((total, grams, index) => total + grams * model.candidates[index].nutrition[macro], 0) / W;
    const share = (category: (typeof categoryKeys)[number]) => mix.reduce((total, grams, index) => total + (model.candidates[index].category === category ? grams : 0), 0) / W * 100;
    const macroValues = macroKeys.map((macro) => ({ value: percent(macro), range: model.macroRanges[macro] }));
    const categoryValues = categoryKeys.map((category) => ({ value: share(category), range: model.categoryRanges[category] }));
    const deviation = (entries: typeof macroValues) => entries.reduce((total, { value, range: [lower, upper] }) => total + (Math.max(0, lower - value) + Math.max(0, value - upper)) / (upper - lower), 0);
    const midpointDistance = (entries: typeof macroValues) => Math.max(...entries.map(({ value, range: [lower, upper] }) => Math.abs(value - (lower + upper) / 2) / (upper - lower)));
    return {
      mix,
      macroDeviation: deviation(macroValues),
      categoryDeviation: deviation(categoryValues),
      margin: Math.min(...macroValues.map(({ value, range: [lower, upper] }) => Math.min(value - lower, upper - value) / (upper - lower))),
      macroDistance: midpointDistance(macroValues),
      categoryDistance: midpointDistance(categoryValues),
      maximum: Math.max(...mix),
      meaningful: mix.filter((grams, index) => model.candidates[index].availableGrams >= model.policy.meaningfulInclusionGrams && grams >= model.policy.meaningfulInclusionGrams).length,
    };
  });

  const keepBest = (pool: typeof scored, key: (entry: (typeof scored)[number]) => number, sense: "min" | "max") => {
    const values = pool.map(key);
    const best = sense === "min" ? Math.min(...values) : Math.max(...values);
    return pool.filter((entry) => sense === "min" ? key(entry) <= best + tolerance : key(entry) >= best - tolerance);
  };

  const exact = scored.filter((entry) => entry.macroDeviation <= 1e-9 && entry.categoryDeviation <= 1e-9);
  let pool: typeof scored;
  let branch: "exact" | "fallback";
  if (exact.length > 0) {
    branch = "exact";
    pool = keepBest(exact, (entry) => entry.margin, "max");
  } else {
    branch = "fallback";
    pool = keepBest(scored, (entry) => entry.macroDeviation, "min");
    pool = keepBest(pool, (entry) => entry.categoryDeviation, "min");
    pool = keepBest(pool, (entry) => entry.macroDistance, "min");
  }
  pool = keepBest(pool, (entry) => entry.categoryDistance, "min");
  pool = keepBest(pool, (entry) => entry.maximum, "min");
  pool = keepBest(pool, (entry) => entry.meaningful, "max");
  model.candidates.forEach((_, index) => {
    pool = keepBest(pool, (entry) => entry.mix[index], "min");
  });
  return { branch, quantities: Object.fromEntries(model.candidates.map(({ id }, index) => [id, pool[0].mix[index]])) };
}

describe("serial staged optimizer with real HiGHS", () => {
  let highs: HighsSolverLike;
  beforeAll(async () => {
    highs = await createNodeHighs();
  });
  const solve = (model: OptimizerModel) => solveSerialStages(highs, model, { timeBudgetMs: 30_000 });

  it("agrees with an exhaustive whole-gram lexicographic reference on both the exact and the fallback branch", async () => {
    const corpus = [
      profileModel("chicken", "pet", { barley: 20, corn_yellow: 20, oats: 20, peas: 20, wheat: 20 }, 40),
      profileModel("parrot", "pet", { corn_yellow: 30, oats: 30, peas: 30, safflower: 30, wheat: 30 }, 40),
      profileModel("pigeon", "racing", { barley: 30, corn_yellow: 30, peas: 30, safflower: 30 }, 30),
      profileModel("budgie", "pet", { canola: 10, millet: 30, oats: 30, safflower: 10 }, 30),
      profileModel("pigeon", "pet", { corn_yellow: 25, lentils: 10, peas: 25, safflower: 8, wheat: 25 }, 25),
      profileModel("canary", "breeding", { canola: 6, millet: 20, oats: 20, peas: 20, safflower: 6, wheat: 20 }, 20),
      profileModel("chicken", "egg_laying", { barley: 15, corn_yellow: 30, lentils: 15, oats: 15, peas: 15 }, 30),
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
  });

  it("reproduces the documented Chicken/Pet macro margin and returns a validated, range-compliant 1 g mix", async () => {
    const model = profileModel("chicken", "pet", getProfileDefaultIngredients("chicken", "pet"), 1_000);
    const result = await solve(model);

    expect(result.status).toBe("optimal");
    expect(result.objectives.macroMargin).toBeCloseTo(0.1382, 4);
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
    const model = profileModel("pigeon", "racing", getProfileDefaultIngredients("pigeon", "racing"), 1_000);
    const result = await solve(model);

    expect(result.status).toBe("best_attainable");
    expect(result.stages.filter(({ skipped }) => !skipped).map(({ stage }) => stage).slice(0, 7)).toEqual([
      "macro_margin",
      "macro_deviation",
      "category_deviation",
      "macro_midpoint",
      "category_midpoint",
      "maximum_share",
      "meaningful_diversity",
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
});
