import { createRequire } from "node:module";
import { beforeAll, describe, expect, it } from "vitest";

import { BIRD_PROFILES, getCategoryTargets, type BirdType, type NutritionTarget } from "./birds";
import { adaptExactFeasibilityResult } from "./optimizer-adapter";
import { OPTIMIZER_FALLBACK_COPY, formatOptimizerFallbackMiss } from "./optimizer-copy";
import { explainBestAttainable } from "./optimizer-explain";
import { buildExactFeasibilityModel, type OptimizerModel } from "./optimizer-model";
import { buildBrowserOptimizerCandidates } from "./optimizer-runtime";
import { solveSerialStages, type HighsSolverLike } from "./optimizer-serial-solver";

const require = createRequire(import.meta.url);
const createNodeHighs = require("highs") as () => Promise<HighsSolverLike>;

// The pigeon/pet fixtures below need a scenario with no valid mix. Pigeon pet became feasible when #248 widened its fat
// ceiling, so they pin the earlier ceiling (2.5-4%) explicitly instead of relying on the live profile.
const PET_FAT_BEFORE_248: Partial<NutritionTarget> = { fat: [2.5, 4] };

function modelFor(bird: BirdType, situation: string, inventory: Record<string, number>, macroOverride: Partial<NutritionTarget> = {}): OptimizerModel {
  return buildExactFeasibilityModel({
    candidates: buildBrowserOptimizerCandidates(inventory, bird),
    requestedTargetGrams: 1_000,
    macroRanges: { ...BIRD_PROFILES[bird].profiles[situation].nutrition, ...macroOverride },
    categoryRanges: getCategoryTargets(bird),
  });
}

describe("best-attainable fallback explanation", () => {
  let highs: HighsSolverLike;
  beforeAll(async () => {
    highs = await createNodeHighs();
  });

  const solveFallback = async (bird: BirdType, situation: string, inventory: Record<string, number>, macroOverride: Partial<NutritionTarget> = {}) => {
    const model = modelFor(bird, situation, inventory, macroOverride);
    const result = await solveSerialStages(highs, model, { timeBudgetMs: 30_000 });
    expect(result.status).toBe("best_attainable");
    return { model, result, explanation: explainBestAttainable({ model, mix: result.quantities, requestedTargetGrams: 1_000, safetyExcludedIds: [] }) };
  };

  it("names exactly the ranges the fallback mix misses, matching the adapter's range check", async () => {
    const { model, result, explanation } = await solveFallback("pigeon", "pet", { wheat: 1_000, corn_yellow: 1_000, peas: 1_000, safflower: 1_000 }, PET_FAT_BEFORE_248);
    const adapted = adaptExactFeasibilityResult(
      { type: "result", requestId: "pigeon-pet", status: "best_attainable", quantities: result.quantities, elapsedMs: 1 },
      model,
      1_000,
      model.macroRanges,
      model.categoryRanges,
    );

    expect(explanation.misses.length).toBeGreaterThan(0);
    expect(explanation.misses.map(({ kind, key }) => `${kind}:${key}`)).toEqual(adapted.rangeMisses?.map((miss) => miss.split(":").slice(0, 2).join(":")));
    for (const miss of explanation.misses) {
      const [minimum, maximum] = miss.range;
      expect(miss.direction === "below" ? miss.value < minimum : miss.value > maximum).toBe(true);
    }
    expect(explanation.evidence).toMatchObject({ achievableTargetGrams: 1_000, stockShortfallGrams: 0, classification: "range_interaction_requires_solver" });
  });

  it("proves 'no ingredient reaches' and 'not enough stock' only from the safe inventory", async () => {
    // Only grains: every one is above the pigeon/pet carb maximum, and there are no legumes or seeds at all.
    const { explanation } = await solveFallback("pigeon", "pet", { wheat: 1_000, corn_yellow: 1_000 });
    const byKey = Object.fromEntries(explanation.misses.map((miss) => [miss.key, miss]));

    expect(byKey.carbs).toMatchObject({ kind: "macro", direction: "above", reason: "no_ingredient_reaches" });
    expect(byKey.legume).toMatchObject({ kind: "category", direction: "below", reason: "not_enough_stock" });
    expect(byKey.seed).toMatchObject({ kind: "category", direction: "below", reason: "not_enough_stock" });
    expect(byKey.grain).toMatchObject({ kind: "category", direction: "above", reason: "not_enough_stock" });
  });

  it("marks a range as 'not together' when the inventory could meet it alone", async () => {
    const { explanation } = await solveFallback("pigeon", "pet", { wheat: 1_000, corn_yellow: 1_000, peas: 1_000, safflower: 1_000 }, PET_FAT_BEFORE_248);
    const seed = explanation.misses.find(({ key }) => key === "seed");
    expect(seed).toMatchObject({ direction: "below", reason: "not_together" });
  });

  it("detects a macro limited by stock rather than by any single ingredient", () => {
    // Pigeon/racing needs at least 16% protein; peas (23%) could reach it, but only 30 g are in stock.
    const model = modelFor("pigeon", "racing", { wheat: 1_000, corn_yellow: 1_000, peas: 30 });
    const mix = { corn_red: 0, peas: 30, wheat: 970 };
    const protein = explainBestAttainable({ model, mix, requestedTargetGrams: 1_000, safetyExcludedIds: [] }).misses.find(({ key }) => key === "protein");
    expect(protein).toMatchObject({ direction: "below", reason: "not_enough_stock" });
  });
});

describe("draft fallback notice copy", () => {
  it("keeps every notice string in one draft constant and formats one plain sentence per missed range", () => {
    expect(OPTIMIZER_FALLBACK_COPY.approvalStatus).toBe("draft-awaiting-owner-approval");
    expect(formatOptimizerFallbackMiss({ kind: "macro", key: "carbs", direction: "above", value: 71, range: [60, 70], reason: "no_ingredient_reaches" }))
      .toBe("Carbs (above range): all of your ingredients are too high in carbs.");
    expect(formatOptimizerFallbackMiss({ kind: "macro", key: "protein", direction: "below", value: 13, range: [16, 18], reason: "not_enough_stock" }))
      .toBe("Protein (below range): you don't have enough of the ingredients that are high in protein.");
    expect(formatOptimizerFallbackMiss({ kind: "category", key: "legume", direction: "below", value: 0, range: [15, 25], reason: "not_enough_stock" }))
      .toBe("Legumes (below range): you don't have enough legumes in your inventory.");
    expect(formatOptimizerFallbackMiss({ kind: "category", key: "seed", direction: "below", value: 0, range: [5, 15], reason: "not_together" }))
      .toBe("Oily seeds (below range): with the available ingredients it is not possible to get a perfect distribution.");
  });

  it("uses no avian, poultry, or veterinary terminology", () => {
    expect(JSON.stringify(OPTIMIZER_FALLBACK_COPY)).not.toMatch(/avian|poultry|veterinar/i);
  });
});
