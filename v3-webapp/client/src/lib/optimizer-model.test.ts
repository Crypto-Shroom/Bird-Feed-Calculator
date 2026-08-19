import { describe, expect, it } from "vitest";
import { createRequire } from "node:module";

import { BIRD_PROFILES, getCategoryTargets } from "./birds";
import { INGREDIENTS } from "./data";
import { getProfileDefaultIngredients } from "./inventory-presets";
import { buildExactFeasibilityModel, type OptimizerCandidate } from "./optimizer-model";
import { OPTIMIZER_POLICY } from "./optimizer-policy";

const require = createRequire(import.meta.url);
const createHighs = require("highs") as () => Promise<{ solve: (model: string) => { Status: string; Columns: Record<string, { Primal: number }> } }>;

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

describe("pure constrained optimizer model", () => {
  const bird = "chicken";
  const profile = BIRD_PROFILES[bird].profiles.pet;
  const inventory = getProfileDefaultIngredients(bird, "pet");
  const candidates = Object.entries(inventory).map(([id, grams]) => activeCandidate(id, grams));

  it("uses the owner-approved, named, one-gram proof-of-concept policy", () => {
    expect(OPTIMIZER_POLICY).toMatchObject({
      gramIncrement: 1,
      meaningfulInclusionGrams: 5,
      exactMarginTolerance: 0,
      maximumShareToleranceGrams: 0,
      canonicalCandidateOrder: "ingredient_id_ascending",
    });
  });

  it("builds byte-identical LP text from reordered active candidates", () => {
    const direct = buildExactFeasibilityModel({
      candidates,
      requestedTargetGrams: 1000,
      macroRanges: profile.nutrition,
      categoryRanges: getCategoryTargets(bird),
    });
    const reordered = buildExactFeasibilityModel({
      candidates: [...candidates].reverse(),
      requestedTargetGrams: 1000,
      macroRanges: profile.nutrition,
      categoryRanges: getCategoryTargets(bird),
    });

    expect(direct.lp).toBe(reordered.lp);
    expect(direct.candidates.map(({ id }) => id)).toEqual(["barley", "corn_yellow", "oats", "peas", "wheat"]);
    expect(direct.achievableTargetGrams).toBe(1000);
    expect(direct.lp).toContain("exact_weight:");
    expect(direct.lp).toContain("protein_minimum:");
    expect(direct.lp).toContain("seed_minimum:");
    expect(direct.lp).toContain("maximum_share_wheat:");
    expect(direct.lp).toContain("meaningful_lower_wheat:");
  });

  it("produces a real active-data LP that the pinned HiGHS development solver accepts", async () => {
    const model = buildExactFeasibilityModel({
      candidates,
      requestedTargetGrams: 1000,
      macroRanges: profile.nutrition,
      categoryRanges: getCategoryTargets(bird),
    });
    const highs = await createHighs();
    const solution = highs.solve(model.lp);
    expect(solution.Status).toBe("Optimal");

    const quantities = model.candidates.map(({ quantityVariable }) => solution.Columns[quantityVariable]?.Primal ?? Number.NaN);
    expect(quantities.every(Number.isInteger)).toBe(true);
    expect(quantities.reduce((sum, quantity) => sum + quantity, 0)).toBe(1000);
    model.candidates.forEach((candidate, index) => {
      expect(quantities[index]).toBeLessThanOrEqual(candidate.availableGrams);
    });
  });

  it("caps the model at the safely available whole-gram inventory total", () => {
    const model = buildExactFeasibilityModel({
      candidates: [activeCandidate("wheat", 400.9), activeCandidate("peas", 299.8)],
      requestedTargetGrams: 1000,
      macroRanges: profile.nutrition,
      categoryRanges: getCategoryTargets(bird),
    });

    expect(model.achievableTargetGrams).toBe(699);
    expect(model.lp).toContain("exact_weight: 1 x_peas + 1 x_wheat = 699");
    expect(model.lp).toContain("0 <= x_wheat <= 400");
  });

  it("rejects non-canonical identifiers, fractional target requests, excluded candidates, and invalid ranges", () => {
    expect(() => buildExactFeasibilityModel({
      candidates: [{ ...activeCandidate("wheat", 1000), id: "wheat-id" }],
      requestedTargetGrams: 1000,
      macroRanges: profile.nutrition,
      categoryRanges: getCategoryTargets(bird),
    })).toThrow("safe canonical identifier");
    expect(() => buildExactFeasibilityModel({
      candidates: [activeCandidate("wheat", 1000)],
      requestedTargetGrams: 1000.5,
      macroRanges: profile.nutrition,
      categoryRanges: getCategoryTargets(bird),
    })).toThrow("align to the configured gram increment");
    expect(() => buildExactFeasibilityModel({
      candidates: [{ ...activeCandidate("kidney_beans", 1000), safetyState: "excluded" }],
      requestedTargetGrams: 1000,
      macroRanges: profile.nutrition,
      categoryRanges: getCategoryTargets(bird),
    })).toThrow("did not pass the safety gate");
    expect(() => buildExactFeasibilityModel({
      candidates: [activeCandidate("wheat", 1000)],
      requestedTargetGrams: 1000,
      macroRanges: { ...profile.nutrition, protein: [15, 10] },
      categoryRanges: getCategoryTargets(bird),
    })).toThrow("protein range");
  });
});
