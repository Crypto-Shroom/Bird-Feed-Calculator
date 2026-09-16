import { checkBirdToxicity, isIngredientCompatible } from "@/lib/bird-safety";
import type { BirdType } from "@/lib/birds";
import type { MixResult } from "@/lib/calculator-multi-bird";
import { INGREDIENTS } from "@/lib/data";
import type { FormulaSource } from "@/lib/formula-display";
import { getProcessingWarning, isToxicRaw } from "@/lib/safety";

/**
 * Performance optimization:
 * For a given bird species, the set of compatible, safe candidate ingredients in INGREDIENTS
 * is static. We memoize this per bird to avoid iterating all ingredients, executing
 * 4 safety check functions per ingredient, and sorting the array on every candidate selection pass.
 */
const compatibleCandidatesCache = new Map<BirdType, string[]>();

function getCompatibleCandidatesForBird(bird: BirdType): string[] {
  let cached = compatibleCandidatesCache.get(bird);
  if (!cached) {
    cached = Object.keys(INGREDIENTS)
      .filter(
        (name) =>
          isIngredientCompatible(name, bird) &&
          !isToxicRaw(name) &&
          !checkBirdToxicity(name, bird) &&
          !getProcessingWarning(name),
      )
      .sort();
    compatibleCandidatesCache.set(bird, cached);
  }
  return cached;
}

export function selectDiversitySuggestionCandidate({
  bird,
  formulaSource,
  mix,
  missingIngredients,
}: {
  bird: BirdType;
  formulaSource: FormulaSource;
  mix: Record<string, number>;
  missingIngredients?: MixResult["missingIngredients"];
}): string | null {
  if (formulaSource !== "inventory" || missingIngredients?.length || !Object.keys(mix).length) return null;

  const compatible = getCompatibleCandidatesForBird(bird);
  const candidates = compatible.filter((name) => !mix[name]);

  if (!candidates.length) return null;

  const mixFingerprint = Object.entries(mix)
    .filter(([, amount]) => amount > 0)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, amount]) => `${name}:${amount}`)
    .join("|");
  const candidateIndex = stableHash(`${bird}|${mixFingerprint}`) % candidates.length;

  return candidates[candidateIndex];
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
