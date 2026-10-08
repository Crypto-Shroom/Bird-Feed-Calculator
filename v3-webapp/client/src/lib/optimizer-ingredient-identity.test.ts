import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { BIRD_PROFILES, getCategoryTargets } from "./birds";
import { INGREDIENTS } from "./data";
import {
  IDENTICAL_NUTRITION_GROUPS,
  assertCanonicalFormNutritionParity,
  canonicalizeOptimizerCandidates,
  resolveSolverCanonicalIngredientId,
} from "./optimizer-ingredient-identity";
import { buildExactFeasibilityModel, type OptimizerCandidate } from "./optimizer-model";

const rootPath = resolve(import.meta.dirname, "../../../../");

function candidate(id: string, availableGrams: number, safetyState: OptimizerCandidate["safetyState"] = "eligible"): OptimizerCandidate {
  const ingredient = INGREDIENTS[id];
  if (!ingredient) throw new Error(`missing active ingredient ${id}`);
  return {
    id,
    category: ingredient.category,
    availableGrams,
    nutrition: { protein: ingredient.protein, carbs: ingredient.carbs, fat: ingredient.fat, fiber: ingredient.fiber },
    safetyState,
  };
}

describe("canonical optimizer ingredient identity", () => {
  it("reconciles the active split-lentil key with the provenance inherited-mechanical-form record", () => {
    const provenance = JSON.parse(readFileSync(resolve(rootPath, "database/provenance/food-reviews.json"), "utf8")) as {
      ingredientReviews: Array<{ ingredientId: string; formAttributes?: { model: string; attribute: string; supportedValues: string[]; inherits: string[] } }>;
    };
    const lentilReview = provenance.ingredientReviews.find((review) => review.ingredientId === "lentils");

    expect(INGREDIENTS.split_lentils).toMatchObject({
      category: INGREDIENTS.lentils.category,
      protein: INGREDIENTS.lentils.protein,
      carbs: INGREDIENTS.lentils.carbs,
      fat: INGREDIENTS.lentils.fat,
      fiber: INGREDIENTS.lentils.fiber,
    });
    expect(INGREDIENTS.split_lentils.notes).not.toBe(INGREDIENTS.lentils.notes);
    expect(lentilReview?.formAttributes).toMatchObject({
      model: "inherited_mechanical_form",
      attribute: "split",
      supportedValues: ["whole", "split"],
      inherits: ["nutrition", "speciesEvidence"],
    });
    expect(resolveSolverCanonicalIngredientId("split_lentils")).toBe("lentils");
    expect(resolveSolverCanonicalIngredientId("lentils")).toBe("lentils");
    expect(resolveSolverCanonicalIngredientId("wheat")).toBe("wheat");
    expect(resolveSolverCanonicalIngredientId("peas")).toBe("peas");
    expect(() => assertCanonicalFormNutritionParity("split_lentils", "lentils")).not.toThrow();
  });

  it("canonicalizes split_lentils to lentils even when whole lentils are not in inventory", () => {
    const canonical = canonicalizeOptimizerCandidates([
      candidate("split_lentils", 150),
    ]);

    expect(canonical).toEqual([{
      id: "lentils",
      category: "legume",
      availableGrams: 150,
      nutrition: { protein: 25, carbs: 63, fat: 1, fiber: 4.3 },
      safetyState: "eligible",
      sourceIngredientIds: ["split_lentils"],
    }]);
  });

  it("aggregates whole and split actual stock under one canonical solver candidate", () => {
    const canonical = canonicalizeOptimizerCandidates([
      candidate("split_lentils", 125),
      candidate("lentils", 275),
    ]);

    expect(canonical).toEqual([{
      id: "lentils",
      category: "legume",
      availableGrams: 400,
      nutrition: { protein: 25, carbs: 63, fat: 1, fiber: 4.3 },
      safetyState: "eligible",
      sourceIngredientIds: ["lentils", "split_lentils"],
    }]);
  });

  it("produces one quantity and diversity dimension rather than artificial alias diversity", () => {
    const bird = "chicken";
    const profile = BIRD_PROFILES[bird].profiles.pet;
    const candidates = canonicalizeOptimizerCandidates([
      candidate("split_lentils", 125),
      candidate("lentils", 275),
      candidate("wheat", 600),
    ]);
    const model = buildExactFeasibilityModel({
      candidates,
      requestedTargetGrams: 1_000,
      macroRanges: profile.nutrition,
      categoryRanges: getCategoryTargets(bird),
    });

    expect(model.candidates.map((entry) => entry.id)).toEqual(["lentils", "wheat"]);
    expect(model.lp).toContain("x_lentils");
    expect(model.lp).toContain("z_lentils");
    expect(model.lp).not.toContain("split_lentils");
  });

  it("does not use canonicalization to bypass a failed safety gate", () => {
    expect(() => canonicalizeOptimizerCandidates([candidate("split_lentils", 125, "excluded")])).toThrow("did not pass the safety gate");
  });

  it("throws an error when candidate has invalid available grams", () => {
    const invalidCandidate = {
      ...candidate("split_lentils", 100),
      availableGrams: -10,
    };
    expect(() => canonicalizeOptimizerCandidates([invalidCandidate])).toThrow("invalid available grams");
  });

  it("derives identical-nutrition groups from the catalog by exact equality of category and macros", () => {
    const signature = (id: string) => {
      const { category, protein, carbs, fat, fiber } = INGREDIENTS[id];
      return [category, protein, carbs, fat, fiber];
    };
    expect(IDENTICAL_NUTRITION_GROUPS).toContainEqual(["corn_red", "corn_white", "corn_yellow", "maize"]);
    expect(IDENTICAL_NUTRITION_GROUPS).toContainEqual(["lentils", "lentils_brown", "lentils_green", "split_lentils"]);

    const grouped = new Set(IDENTICAL_NUTRITION_GROUPS.flat());
    for (const group of IDENTICAL_NUTRITION_GROUPS) {
      expect(group.length).toBeGreaterThan(1);
      expect([...group]).toEqual([...group].sort());
      for (const id of group) expect(signature(id)).toEqual(signature(group[0]));
    }
    // No two ungrouped catalog keys share an exact signature, and no group could absorb an ungrouped key.
    const ungroupedSignatures = Object.keys(INGREDIENTS).filter((id) => !grouped.has(id)).map((id) => JSON.stringify(signature(id)));
    expect(new Set(ungroupedSignatures).size).toBe(ungroupedSignatures.length);
    for (const group of IDENTICAL_NUTRITION_GROUPS) expect(ungroupedSignatures).not.toContain(JSON.stringify(signature(group[0])));
    expect(resolveSolverCanonicalIngredientId("maize")).toBe("corn_red");
    expect(resolveSolverCanonicalIngredientId("corn_yellow")).toBe("corn_red");
    expect(resolveSolverCanonicalIngredientId("corn_red")).toBe("corn_red");
  });

  it("merges identical-nutrition variants into one solver candidate with their combined stock", () => {
    const canonical = canonicalizeOptimizerCandidates([
      candidate("corn_yellow", 600),
      candidate("maize", 400),
      candidate("wheat", 500),
    ]);

    expect(canonical.map(({ id, availableGrams, sourceIngredientIds }) => ({ id, availableGrams, sourceIngredientIds }))).toEqual([
      { id: "corn_red", availableGrams: 1_000, sourceIngredientIds: ["corn_yellow", "maize"] },
      { id: "wheat", availableGrams: 500, sourceIngredientIds: ["wheat"] },
    ]);
    expect(canonical[0].nutrition).toEqual({ protein: 9, carbs: 72, fat: 4.5, fiber: 2 });
  });
});
