import { describe, expect, it } from "vitest";

import { adaptExactFeasibilityResult } from "./optimizer-adapter";
import { BIRD_PROFILES, getCategoryTargets } from "./birds";
import { INGREDIENTS } from "./data";
import { getProfileDefaultIngredients } from "./inventory-presets";
import { buildExactFeasibilityModel, type OptimizerCandidate } from "./optimizer-model";

function activeCandidate(id: string, availableGrams: number): OptimizerCandidate {
  const ingredient = INGREDIENTS[id];
  if (!ingredient) throw new Error(`missing test ingredient ${id}`);
  return {
    id,
    category: ingredient.category,
    availableGrams,
    nutrition: {
      protein: ingredient.protein,
      carbs: ingredient.carbs,
      fat: ingredient.fat,
      fiber: ingredient.fiber,
    },
    safetyState: "eligible",
  };
}

describe("non-integrated optimizer result adapter", () => {
  const bird = "chicken";
  const profile = BIRD_PROFILES[bird].profiles.pet;
  const inventory = getProfileDefaultIngredients(bird, "pet");
  const model = buildExactFeasibilityModel({
    candidates: Object.entries(inventory).map(([id, grams]) => activeCandidate(id, grams)),
    requestedTargetGrams: 1000,
    macroRanges: profile.nutrition,
    categoryRanges: getCategoryTargets(bird),
  });
  const exactRawResult = {
    type: "result" as const,
    requestId: "chicken-pet-1",
    status: "optimal" as const,
    quantities: { wheat: 200, peas: 200, oats: 200, corn_yellow: 200, barley: 200 },
    elapsedMs: 12.5,
    mipGap: 0,
    solverStatus: "Optimal",
  };

  it("validates and normalizes a real exact-feasibility result deterministically", () => {
    const adapted = adaptExactFeasibilityResult(exactRawResult, model, 1000, profile.nutrition, getCategoryTargets(bird));

    expect(adapted).toMatchObject({
      status: "feasible",
      mix: { barley: 200, corn_yellow: 200, oats: 200, peas: 200, wheat: 200 },
      nutrition: { protein: 13.9, carbs: 68.4, fat: 3.2, fiber: 5 },
      categories: { grain: 80, legume: 20, seed: 0 },
      maximumShareGrams: 200,
      meaningfulIngredientIds: ["barley", "corn_yellow", "oats", "peas", "wheat"],
      violations: [],
    });
    expect(Object.keys(adapted.mix)).toEqual(["barley", "corn_yellow", "oats", "peas", "wheat"]);
  });

  it("rejects quantities above safe stock and unknown candidate IDs", () => {
    const adapted = adaptExactFeasibilityResult({
      ...exactRawResult,
      quantities: { ...exactRawResult.quantities, peas: 1001, kidney_beans: 1 },
    }, model, 1000, profile.nutrition, getCategoryTargets(bird));

    expect(adapted.status).toBe("invalid_result");
    expect(adapted.violations).toEqual(expect.arrayContaining([
      "quantity:kidney_beans:not an eligible model candidate",
      "quantity:peas:exceeds safe available inventory",
    ]));
  });

  it("rejects fractional quantities and invalid worker diagnostics", () => {
    const fractional = adaptExactFeasibilityResult({
      ...exactRawResult,
      quantities: { ...exactRawResult.quantities, wheat: 200.5 },
    }, model, 1000, profile.nutrition, getCategoryTargets(bird));
    const invalidDiagnostics = adaptExactFeasibilityResult({
      ...exactRawResult,
      elapsedMs: -1,
    }, model, 1000, profile.nutrition, getCategoryTargets(bird));

    expect(fractional.status).toBe("invalid_result");
    expect(fractional.violations).toContain("quantity:wheat:must be whole grams");
    expect(invalidDiagnostics).toMatchObject({
      status: "invalid_result",
      violations: ["diagnostics:elapsed_ms must be finite and non-negative"],
    });
  });

  it("rejects mathematically complete output that violates configured macro ranges", () => {
    const adapted = adaptExactFeasibilityResult({
      ...exactRawResult,
      quantities: { wheat: 0, peas: 0, oats: 0, corn_yellow: 1000, barley: 0 },
    }, model, 1000, profile.nutrition, getCategoryTargets(bird));

    expect(adapted.status).toBe("invalid_result");
    expect(adapted.violations.some((violation) => violation.startsWith("macro:"))).toBe(true);
  });

  it("preserves explicit non-optimal solver states without inventing a fallback mix", () => {
    const timeout = adaptExactFeasibilityResult({
      ...exactRawResult,
      status: "timeout",
      quantities: {},
    }, model, 1000, profile.nutrition, getCategoryTargets(bird));
    const infeasible = adaptExactFeasibilityResult({
      ...exactRawResult,
      status: "infeasible",
      quantities: {},
    }, model, 1000, profile.nutrition, getCategoryTargets(bird));

    expect(timeout).toMatchObject({ status: "timeout", mix: {}, violations: [] });
    expect(infeasible).toMatchObject({ status: "infeasible", mix: {}, violations: [] });
  });
});
