import { INGREDIENTS } from "./data";
import type { OptimizerCandidate, OptimizerMacro } from "./optimizer-model";

/**
 * Solver identities intentionally differ from selectable catalog keys only where
 * the owner has approved an evidence-backed physical-form alias. Catalog keys
 * are retained so existing inventory and visible-library behavior do not move.
 */
export const SOLVER_CANONICAL_INGREDIENT_IDS: Readonly<Record<string, string>> = {
  split_lentils: "lentils",
};

export interface CanonicalOptimizerCandidate extends OptimizerCandidate {
  sourceIngredientIds: readonly string[];
}

function assertCatalogIngredient(id: string): NonNullable<typeof INGREDIENTS[string]> {
  const ingredient = INGREDIENTS[id];
  if (!ingredient) throw new Error(`optimizer candidate '${id}' is not an active catalog ingredient`);
  return ingredient;
}

function nutritionFor(id: string): Record<OptimizerMacro, number> {
  const ingredient = assertCatalogIngredient(id);
  return {
    protein: ingredient.protein,
    carbs: ingredient.carbs,
    fat: ingredient.fat,
    fiber: ingredient.fiber,
  };
}

export function resolveSolverCanonicalIngredientId(id: string): string {
  return SOLVER_CANONICAL_INGREDIENT_IDS[id] ?? id;
}

/**
 * Converts already safety-gated active inventory candidates into unique solver
 * candidates. An alias never contributes a second diversity binary or quantity
 * vector dimension; its actual stock remains part of the canonical stock cap.
 */
export function canonicalizeOptimizerCandidates(
  candidates: readonly OptimizerCandidate[],
): readonly CanonicalOptimizerCandidate[] {
  const aggregated = new Map<string, CanonicalOptimizerCandidate>();

  for (const candidate of candidates) {
    if (candidate.safetyState !== "eligible") {
      throw new Error(`optimizer candidate '${candidate.id}' did not pass the safety gate before canonicalization`);
    }
    if (!Number.isFinite(candidate.availableGrams) || candidate.availableGrams < 0) {
      throw new Error(`optimizer candidate '${candidate.id}' has invalid available grams`);
    }

    const canonicalId = resolveSolverCanonicalIngredientId(candidate.id);
    const canonicalIngredient = assertCatalogIngredient(canonicalId);
    const existing = aggregated.get(canonicalId);
    const nextSourceIds = Array.from(new Set([...(existing?.sourceIngredientIds ?? []), candidate.id])).sort();
    aggregated.set(canonicalId, {
      id: canonicalId,
      category: canonicalIngredient.category,
      availableGrams: (existing?.availableGrams ?? 0) + candidate.availableGrams,
      nutrition: nutritionFor(canonicalId),
      safetyState: "eligible",
      sourceIngredientIds: nextSourceIds,
    });
  }

  return Array.from(aggregated.values()).sort((left, right) => left.id.localeCompare(right.id));
}
