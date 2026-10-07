import { INGREDIENTS } from "./data";
import type { OptimizerCandidate, OptimizerMacro } from "./optimizer-model";

/**
 * The optimizer only reads an ingredient's category and four macros. Catalog
 * entries whose category, protein, carbs, fat, and fiber are exactly equal are
 * therefore indistinguishable to the solver (for example corn_yellow,
 * corn_white, corn_red, and maize, or whole and split lentils). Giving each one
 * its own quantity column and diversity binary would let the solver count one
 * food twice as "diversity" and would multiply symmetric solutions.
 *
 * The groups are derived from the active catalog with an exact-equality check,
 * never from a hand-written list, so a later data change that makes two
 * variants differ automatically separates them again. The canonical solver id
 * of a group is its lexicographically smallest catalog key, which keeps the
 * earlier approved split_lentils → lentils identity unchanged. Catalog keys
 * themselves are untouched; the solver's grams are split back across the
 * visitor's actual variants afterwards (see optimizer-form-allocation.ts).
 */
function nutritionIdentityKey(id: string): string {
  const ingredient = INGREDIENTS[id];
  return JSON.stringify([ingredient.category, ingredient.protein, ingredient.carbs, ingredient.fat, ingredient.fiber]);
}

function deriveIdenticalNutritionGroups(): readonly (readonly string[])[] {
  const groups = new Map<string, string[]>();
  for (const id of Object.keys(INGREDIENTS).sort()) {
    const key = nutritionIdentityKey(id);
    groups.set(key, [...(groups.get(key) ?? []), id]);
  }
  return Array.from(groups.values()).filter((ids) => ids.length > 1).sort((left, right) => left[0].localeCompare(right[0]));
}

/** Every catalog group of two or more keys with exactly identical category and macros, each sorted by key. */
export const IDENTICAL_NUTRITION_GROUPS: readonly (readonly string[])[] = deriveIdenticalNutritionGroups();

/** Variant catalog key → canonical solver id (the group's smallest key). Canonical keys map to themselves implicitly. */
export const SOLVER_CANONICAL_INGREDIENT_IDS: Readonly<Record<string, string>> = Object.fromEntries(
  IDENTICAL_NUTRITION_GROUPS.flatMap((ids) => ids.slice(1).map((id) => [id, ids[0]])),
);

export interface CanonicalOptimizerCandidate extends OptimizerCandidate {
  sourceIngredientIds: readonly string[];
}

function assertCatalogIngredient(id: string): NonNullable<typeof INGREDIENTS[string]> {
  const ingredient = INGREDIENTS[id];
  if (!ingredient) throw new Error(`optimizer candidate '${id}' is not an active catalog ingredient`);
  return ingredient;
}

export function assertCanonicalFormNutritionParity(aliasId: string, canonicalId: string): void {
  const alias = assertCatalogIngredient(aliasId);
  const canonical = assertCatalogIngredient(canonicalId);
  if (
    alias.category !== canonical.category ||
    alias.protein !== canonical.protein ||
    alias.carbs !== canonical.carbs ||
    alias.fat !== canonical.fat ||
    alias.fiber !== canonical.fiber
  ) {
    throw new Error(`alias ingredient '${aliasId}' nutrition profile diverges from canonical ingredient '${canonicalId}'`);
  }
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
 * candidates. A variant never contributes a second diversity binary or quantity
 * vector dimension; its actual stock remains part of the canonical stock cap.
 * `sourceIngredientIds` lists only the safety-gated keys that were aggregated,
 * so form allocation can never hand grams to a variant that failed a gate.
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
    if (candidate.id !== canonicalId) {
      assertCanonicalFormNutritionParity(candidate.id, canonicalId);
    }
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
