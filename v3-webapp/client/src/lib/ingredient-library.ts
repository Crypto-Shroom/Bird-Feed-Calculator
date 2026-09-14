import { INGREDIENTS, type Ingredient } from "./data";
import {
  BIRD_TOXICITY,
  getIncompatibleBirds,
  isIngredientCompatible,
  type ToxicFood,
} from "./bird-safety";
import type { BirdType } from "./birds";

export const SUPPORTED_INGREDIENT_LIBRARY_BIRDS: readonly BirdType[] = [
  "pigeon",
  "parrot",
  "african_grey",
  "budgie",
  "canary",
  "chicken",
] as const;

export type IngredientEvidenceStatus = "ledger_only";
export type SafetyModelStatus = "explicitly_excluded" | "not_explicitly_excluded";

export interface IngredientLibraryEntry {
  id: string;
  ingredient: Ingredient;
  safetyModelStatusByBird: Record<BirdType, SafetyModelStatus>;
  toxicityByBird: Partial<Record<BirdType, ToxicFood>>;
  evidenceStatus: IngredientEvidenceStatus;
  provenancePath: string;
}

const PROVENANCE_PATH = "database/provenance/food-reviews.json";

function getToxicityByBird(name: string): Partial<Record<BirdType, ToxicFood>> {
  return Object.fromEntries(
    SUPPORTED_INGREDIENT_LIBRARY_BIRDS.flatMap((bird) => {
      const warning = BIRD_TOXICITY[bird].find((food) => food.name === name);
      return warning ? [[bird, warning]] : [];
    }),
  ) as Partial<Record<BirdType, ToxicFood>>;
}

let cachedEntries: IngredientLibraryEntry[] | null = null;
let cachedEntriesMap: Map<string, IngredientLibraryEntry> | null = null;

/**
 * Returns all ingredient library entries.
 * Optimization: Memoized at module scope to avoid re-sorting and object creation overhead on repeated invocations.
 */
export function getIngredientLibraryEntries(): IngredientLibraryEntry[] {
  if (!cachedEntries) {
    cachedEntries = Object.entries(INGREDIENTS)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([id, ingredient]) => ({
        id,
        ingredient,
        safetyModelStatusByBird: Object.fromEntries(
          SUPPORTED_INGREDIENT_LIBRARY_BIRDS.map((bird) => [
            bird,
            getIncompatibleBirds(id).includes(bird) || !isIngredientCompatible(id, bird)
              ? "explicitly_excluded"
              : "not_explicitly_excluded",
          ]),
        ) as Record<BirdType, SafetyModelStatus>,
        toxicityByBird: getToxicityByBird(id),
        evidenceStatus: "ledger_only",
        provenancePath: PROVENANCE_PATH,
      }));
  }
  return cachedEntries;
}

/**
 * Returns a specific ingredient library entry by id.
 * Optimization: Uses a cached Map for O(1) lookup speed instead of linear search O(N).
 */
export function getIngredientLibraryEntry(id: string): IngredientLibraryEntry | undefined {
  if (!cachedEntriesMap) {
    cachedEntriesMap = new Map(getIngredientLibraryEntries().map((entry) => [entry.id, entry]));
  }
  return cachedEntriesMap.get(id);
}
