import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { BIRD_PROFILES, getCategoryTargets } from "./birds";
import { INGREDIENTS } from "./data";
import { canonicalizeOptimizerCandidates, resolveSolverCanonicalIngredientId } from "./optimizer-ingredient-identity";
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
      nutrition: { protein: 25, carbs: 63, fat: 1, fiber: 8 },
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
});
