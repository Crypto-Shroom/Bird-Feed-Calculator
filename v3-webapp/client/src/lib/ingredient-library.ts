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

export type IngredientEvidenceStatus = "unresolved";

export interface IngredientLibraryEntry {
  id: string;
  ingredient: Ingredient;
  compatibleBirds: BirdType[];
  incompatibleBirds: BirdType[];
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

export function getIngredientLibraryEntries(): IngredientLibraryEntry[] {
  return Object.entries(INGREDIENTS)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([id, ingredient]) => ({
      id,
      ingredient,
      compatibleBirds: SUPPORTED_INGREDIENT_LIBRARY_BIRDS.filter((bird) => isIngredientCompatible(id, bird)),
      incompatibleBirds: getIncompatibleBirds(id),
      toxicityByBird: getToxicityByBird(id),
      evidenceStatus: "unresolved",
      provenancePath: PROVENANCE_PATH,
    }));
}

export function getIngredientLibraryEntry(id: string): IngredientLibraryEntry | undefined {
  return getIngredientLibraryEntries().find((entry) => entry.id === id);
}
