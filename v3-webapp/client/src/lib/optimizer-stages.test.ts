import { describe, expect, it } from "vitest";

import { BIRD_PROFILES, getCategoryTargets } from "./birds";
import { INGREDIENTS } from "./data";
import { getProfileDefaultIngredients } from "./inventory-presets";
import { buildExactFeasibilityModel, type OptimizerCandidate } from "./optimizer-model";
import { EXACT_SERIAL_STAGE_ORDER, FALLBACK_SERIAL_STAGE_ORDER, buildExactSerialObjectivePlan, buildFallbackSerialObjectivePlan, buildInfeasibilityEvidence } from "./optimizer-stages";

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

describe("serial optimizer objective foundation", () => {
  const bird = "chicken";
  const profile = BIRD_PROFILES[bird].profiles.pet;
  const categories = getCategoryTargets(bird);
  const inventory = getProfileDefaultIngredients(bird, "pet");
  const model = buildExactFeasibilityModel({
    candidates: Object.entries(inventory).map(([id, grams]) => candidate(id, grams)),
    requestedTargetGrams: 1000,
    macroRanges: profile.nutrition,
    categoryRanges: categories,
  });

  it("emits the approved serial stage objectives and canonical locks deterministically", () => {
    expect(EXACT_SERIAL_STAGE_ORDER).toEqual(["macro_margin", "maximum_share", "meaningful_diversity", "smallest_meaningful_amount", "quantity_tie_break"]);
    const margin = buildExactSerialObjectivePlan(model, "macro_margin", profile.nutrition, categories);
    const share = buildExactSerialObjectivePlan(model, "maximum_share", profile.nutrition, categories, { macroMargin: 0.1 });
    const diversity = buildExactSerialObjectivePlan(model, "meaningful_diversity", profile.nutrition, categories, { macroMargin: 0.1, maximumShareGrams: 200 });
    const chunks = buildExactSerialObjectivePlan(model, "smallest_meaningful_amount", profile.nutrition, categories, { macroMargin: 0.1, maximumShareGrams: 200, meaningfulIngredientCount: 5 });
    const tieBreak = buildExactSerialObjectivePlan(model, "quantity_tie_break", profile.nutrition, categories, {
      macroMargin: 0.1,
      maximumShareGrams: 200,
      meaningfulIngredientCount: 5,
      smallestMeaningfulGrams: 150,
      quantityById: { barley: 200 },
    }, "corn_yellow");

    expect(margin).toMatchObject({ stage: "macro_margin", sense: "maximize", expression: "r" });
    expect(margin.constraints.find((constraint) => constraint.startsWith(" macro_margin_protein_lower:"))).toMatch(/ r >= /);
    expect(share).toMatchObject({ stage: "maximum_share", sense: "minimize", expression: "M" });
    expect(share.constraints).toContain(" macro_margin_lower_lock: r >= 0.1");
    // A locked r is only meaningful with the rows that tie it to the quantities.
    expect(share.constraints.some((row) => row.startsWith(" macro_margin_protein_lower:"))).toBe(true);
    expect(diversity.expression).toBe("z_barley + z_corn_yellow + z_oats + z_peas + z_wheat");
    expect(chunks).toMatchObject({ stage: "smallest_meaningful_amount", sense: "maximize", expression: "S" });
    expect(chunks.constraints).toContain(" smallest_meaningful_barley: 1 x_barley - 1 S - 1000 z_barley >= -1000");
    expect(chunks.constraints).toContain(" smallest_meaningful_cap: S <= 1000");
    expect(tieBreak).toMatchObject({ stage: "quantity_tie_break", sense: "minimize", expression: "x_corn_yellow" });
    expect(tieBreak.constraints).toContain(" quantity_barley_lower_lock: x_barley >= 200");
    expect(tieBreak.constraints).toContain(" smallest_meaningful_lock: S >= 150");
    expect(tieBreak.constraints.some((row) => row.startsWith(" smallest_meaningful_barley:"))).toBe(true);
  });

  it("has no midpoint stage or midpoint rows (owner decision 2026-10-07, #234)", () => {
    const stages = [...EXACT_SERIAL_STAGE_ORDER, ...FALLBACK_SERIAL_STAGE_ORDER] as string[];
    expect(stages.some((stage) => stage.includes("midpoint"))).toBe(false);
    const share = buildExactSerialObjectivePlan(model, "maximum_share", profile.nutrition, categories, { macroMargin: 0.1 });
    const fallbackShare = buildFallbackSerialObjectivePlan(model, "maximum_share", { macroDeviation: 0.25, categoryDeviation: 0.5 });
    expect([...share.constraints, ...fallbackShare.constraints].some((row) => /distance|midpoint| T | V /.test(row))).toBe(false);
  });

  it("orders the best-attainable fallback as macro deviation, then category deviation, with both locks carried forward", () => {
    expect(FALLBACK_SERIAL_STAGE_ORDER).toEqual([
      "macro_deviation",
      "category_deviation",
      "maximum_share",
      "meaningful_diversity",
      "smallest_meaningful_amount",
      "quantity_tie_break",
    ]);
    const macro = buildFallbackSerialObjectivePlan(model, "macro_deviation");
    const category = buildFallbackSerialObjectivePlan(model, "category_deviation", { macroDeviation: 0.25 });
    const share = buildFallbackSerialObjectivePlan(model, "maximum_share", { macroDeviation: 0.25, categoryDeviation: 0.5 });

    expect(macro).toMatchObject({ sense: "minimize", expression: "macro_under_protein + macro_over_protein + macro_under_carbs + macro_over_carbs + macro_under_fat + macro_over_fat + macro_under_fiber + macro_over_fiber" });
    expect(macro.constraints).toContain(" macro_slack_protein_lower: 11 x_barley + 9 x_corn_yellow + 13 x_oats + 23 x_peas + 13.5 x_wheat + 4000 macro_under_protein >= 12000");
    expect(category).toMatchObject({ sense: "minimize", expression: "category_under_grain + category_over_grain + category_under_legume + category_over_legume + category_under_seed + category_over_seed" });
    expect(category.constraints).toContain(" macro_deviation_lock: macro_under_protein + macro_over_protein + macro_under_carbs + macro_over_carbs + macro_under_fat + macro_over_fat + macro_under_fiber + macro_over_fiber <= 0.2500001");
    expect(share).toMatchObject({ sense: "minimize", expression: "M" });
    expect(share.constraints.some((row) => row.startsWith(" macro_deviation_lock:"))).toBe(true);
    expect(share.constraints.some((row) => row.startsWith(" category_deviation_lock:"))).toBe(true);
    expect(() => buildFallbackSerialObjectivePlan(model, "category_deviation")).toThrow("locked macroDeviation");
  });

  it("refuses to silently reorder or skip required serial locks", () => {
    expect(() => buildExactSerialObjectivePlan(model, "maximum_share", profile.nutrition, categories)).toThrow("locked macro margin");
    expect(() => buildExactSerialObjectivePlan(model, "meaningful_diversity", profile.nutrition, categories, { macroMargin: 0.1 })).toThrow("locked maximum share");
    expect(() => buildExactSerialObjectivePlan(model, "smallest_meaningful_amount", profile.nutrition, categories, { macroMargin: 0.1, maximumShareGrams: 200 })).toThrow("locked meaningful ingredient count");
    expect(() => buildExactSerialObjectivePlan(model, "quantity_tie_break", profile.nutrition, categories, {
      macroMargin: 0.1,
      maximumShareGrams: 200,
      meaningfulIngredientCount: 5,
      smallestMeaningfulGrams: 100,
    }, "not_in_model")).toThrow("canonical model candidate");
    expect(() => buildFallbackSerialObjectivePlan(model, "quantity_tie_break", { macroDeviation: 0, categoryDeviation: 0, maximumShareGrams: 200, meaningfulIngredientCount: 5 }, "barley"))
      .toThrow("locked smallestMeaningfulGrams");
  });

  it("reports only proven stock and safety facts before a fallback solve", () => {
    const stockLimitedModel = buildExactFeasibilityModel({
      candidates: [candidate("wheat", 100), candidate("peas", 100)],
      requestedTargetGrams: 1000,
      macroRanges: profile.nutrition,
      categoryRanges: categories,
    });
    const stockEvidence = buildInfeasibilityEvidence({
      model: stockLimitedModel,
      requestedTargetGrams: 1000,
      safetyExcludedIds: ["kidney_beans", "kidney_beans", "soybeans"],
      macroRanges: profile.nutrition,
      categoryRanges: categories,
    });
    const rangeEvidence = buildInfeasibilityEvidence({
      model,
      requestedTargetGrams: 1000,
      safetyExcludedIds: [],
      macroRanges: profile.nutrition,
      categoryRanges: categories,
    });

    expect(stockEvidence).toMatchObject({
      achievableTargetGrams: 200,
      stockShortfallGrams: 800,
      safetyExcludedIds: ["kidney_beans", "soybeans"],
      classification: "stock_limited",
    });
    expect(rangeEvidence.classification).toBe("range_interaction_requires_solver");
    expect(rangeEvidence.note).toContain("requires a solved relaxed model");
  });
});
