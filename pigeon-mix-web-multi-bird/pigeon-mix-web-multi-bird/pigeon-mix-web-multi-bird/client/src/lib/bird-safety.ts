// Bird-specific safety and toxicity information

import { BirdType } from "./birds";

export interface ToxicFood {
  name: string;
  toxin: string;
  message: string;
  severity: "warning" | "critical";
}

export const BIRD_TOXIC_FOODS: Record<BirdType, Record<string, ToxicFood>> = {
  pigeon: {
    kidney_beans: {
      name: "Kidney Beans",
      toxin: "Hemagglutinin (Lectin)",
      message: "Can only be fed if cooked. Danger of death of the bird.",
      severity: "critical",
    },
    lima_beans: {
      name: "Lima Beans",
      toxin: "Hemagglutinin (Lectin)",
      message: "Can only be fed if cooked. Danger of death of the bird.",
      severity: "critical",
    },
    fava_beans: {
      name: "Fava Beans",
      toxin: "Hemagglutinin (Lectin)",
      message: "Can only be fed if cooked. Danger of death of the bird.",
      severity: "critical",
    },
    navy_beans: {
      name: "Navy Beans",
      toxin: "Hemagglutinin (Lectin)",
      message: "Can only be fed if cooked. Danger of death of the bird.",
      severity: "critical",
    },
    pinto_beans: {
      name: "Pinto Beans",
      toxin: "Hemagglutinin (Lectin)",
      message: "Can only be fed if cooked. Danger of death of the bird.",
      severity: "critical",
    },
    bean: {
      name: "Bean (generic)",
      toxin: "Hemagglutinin (Lectin)",
      message:
        "Check if the type of bean contains hemagglutinin. Only safe if cooked.",
      severity: "warning",
    },
  },
  parrot: {
    avocado: {
      name: "Avocado",
      toxin: "Persin",
      message: "Pit, skin, and flesh are toxic. Can be lethal within minutes.",
      severity: "critical",
    },
    chocolate: {
      name: "Chocolate",
      toxin: "Theobromine",
      message: "Toxic to parrots. Can cause tremors, seizures, and death.",
      severity: "critical",
    },
    salt: {
      name: "Salt",
      toxin: "Sodium",
      message:
        "Excessive salt can cause kidney damage and electrolyte imbalance.",
      severity: "warning",
    },
    onion: {
      name: "Onion",
      toxin: "Thiosulfates",
      message: "Damages red blood cells and causes hemolytic anemia.",
      severity: "critical",
    },
    garlic: {
      name: "Garlic",
      toxin: "Thiosulfates",
      message: "Similar to onions; damages red blood cells.",
      severity: "critical",
    },
    xylitol: {
      name: "Xylitol",
      toxin: "Artificial Sweetener",
      message: "Causes rapid insulin release and hypoglycemia. Can be fatal.",
      severity: "critical",
    },
    caffeine: {
      name: "Caffeine",
      toxin: "Methylxanthine",
      message: "Stimulant toxin; causes cardiac arrhythmias and seizures.",
      severity: "critical",
    },
  },
  african_grey: {
    avocado: {
      name: "Avocado",
      toxin: "Persin",
      message: "Pit, skin, and flesh are toxic. Can be lethal within minutes.",
      severity: "critical",
    },
    chocolate: {
      name: "Chocolate",
      toxin: "Theobromine",
      message:
        "Toxic to African Greys. Can cause tremors, seizures, and death.",
      severity: "critical",
    },
    salt: {
      name: "Salt",
      toxin: "Sodium",
      message: "African Greys are sensitive to salt. Can cause kidney damage.",
      severity: "warning",
    },
    onion: {
      name: "Onion",
      toxin: "Thiosulfates",
      message: "Damages red blood cells and causes hemolytic anemia.",
      severity: "critical",
    },
    garlic: {
      name: "Garlic",
      toxin: "Thiosulfates",
      message: "Similar to onions; damages red blood cells.",
      severity: "critical",
    },
    xylitol: {
      name: "Xylitol",
      toxin: "Artificial Sweetener",
      message: "Causes rapid insulin release and hypoglycemia. Can be fatal.",
      severity: "critical",
    },
    caffeine: {
      name: "Caffeine",
      toxin: "Methylxanthine",
      message: "Stimulant toxin; causes cardiac arrhythmias and seizures.",
      severity: "critical",
    },
  },
  budgie: {
    avocado: {
      name: "Avocado",
      toxin: "Persin",
      message: "Toxic to budgies. Can cause death.",
      severity: "critical",
    },
    chocolate: {
      name: "Chocolate",
      toxin: "Theobromine",
      message: "Even small amounts can be fatal to budgies.",
      severity: "critical",
    },
    salt: {
      name: "Salt",
      toxin: "Sodium",
      message: "Budgies are sensitive to salt; causes kidney damage.",
      severity: "warning",
    },
    onion: {
      name: "Onion",
      toxin: "Thiosulfates",
      message: "Toxic to budgies; causes hemolytic anemia.",
      severity: "critical",
    },
    garlic: {
      name: "Garlic",
      toxin: "Thiosulfates",
      message: "Toxic to budgies; similar effects to onions.",
      severity: "critical",
    },
    xylitol: {
      name: "Xylitol",
      toxin: "Artificial Sweetener",
      message: "Can be fatal to budgies.",
      severity: "critical",
    },
    caffeine: {
      name: "Caffeine",
      toxin: "Methylxanthine",
      message: "Even small amounts can cause cardiac issues in budgies.",
      severity: "critical",
    },
  },
  canary: {
    avocado: {
      name: "Avocado",
      toxin: "Persin",
      message: "Toxic to canaries. Can cause death.",
      severity: "critical",
    },
    chocolate: {
      name: "Chocolate",
      toxin: "Theobromine",
      message: "Even small amounts can be fatal to canaries.",
      severity: "critical",
    },
    salt: {
      name: "Salt",
      toxin: "Sodium",
      message: "Canaries are sensitive to salt.",
      severity: "warning",
    },
    onion: {
      name: "Onion",
      toxin: "Thiosulfates",
      message: "Toxic to canaries.",
      severity: "critical",
    },
    garlic: {
      name: "Garlic",
      toxin: "Thiosulfates",
      message: "Toxic to canaries.",
      severity: "critical",
    },
    xylitol: {
      name: "Xylitol",
      toxin: "Artificial Sweetener",
      message: "Can be fatal to canaries.",
      severity: "critical",
    },
    caffeine: {
      name: "Caffeine",
      toxin: "Methylxanthine",
      message: "Can cause cardiac issues in canaries.",
      severity: "critical",
    },
  },
  chicken: {
    avocado: {
      name: "Avocado",
      toxin: "Persin",
      message: "Toxic to chickens; causes heart damage and respiratory issues.",
      severity: "critical",
    },
    chocolate: {
      name: "Chocolate",
      toxin: "Theobromine",
      message: "Toxic to chickens in large quantities.",
      severity: "warning",
    },
    moldy_food: {
      name: "Moldy Food",
      toxin: "Mycotoxins",
      message: "Can cause serious illness or death in chickens.",
      severity: "critical",
    },
    salt: {
      name: "Salt",
      toxin: "Sodium",
      message: "Excessive salt can cause kidney damage in chickens.",
      severity: "warning",
    },
    onion: {
      name: "Onion",
      toxin: "Thiosulfates",
      message: "Can cause hemolytic anemia in chickens.",
      severity: "warning",
    },
    garlic: {
      name: "Garlic",
      toxin: "Thiosulfates",
      message: "Can cause hemolytic anemia in chickens.",
      severity: "warning",
    },
  },
};

export interface IngredientCompatibility {
  compatible_with: BirdType[];
  incompatible_with: BirdType[];
  notes?: string;
}

// Ingredient compatibility mapping
export const INGREDIENT_COMPATIBILITY: Record<string, IngredientCompatibility> =
  {
    wheat: {
      compatible_with: [
        "pigeon",
        "parrot",
        "african_grey",
        "budgie",
        "canary",
        "chicken",
      ],
      incompatible_with: [],
      notes: "Safe for all birds",
    },
    corn_yellow: {
      compatible_with: [
        "pigeon",
        "parrot",
        "african_grey",
        "budgie",
        "canary",
        "chicken",
      ],
      incompatible_with: [],
      notes: "Good source of Vitamin A",
    },
    corn_red: {
      compatible_with: [
        "pigeon",
        "parrot",
        "african_grey",
        "budgie",
        "canary",
        "chicken",
      ],
      incompatible_with: [],
      notes: "Alternative to yellow corn",
    },
    peas_green: {
      compatible_with: [
        "pigeon",
        "parrot",
        "african_grey",
        "budgie",
        "canary",
        "chicken",
      ],
      incompatible_with: [],
      notes: "Excellent protein source",
    },
    lentils: {
      compatible_with: [
        "pigeon",
        "parrot",
        "african_grey",
        "budgie",
        "canary",
        "chicken",
      ],
      incompatible_with: [],
      notes: "Safe legume for all birds",
    },
    kidney_beans: {
      compatible_with: [],
      incompatible_with: [
        "pigeon",
        "parrot",
        "african_grey",
        "budgie",
        "canary",
        "chicken",
      ],
      notes: "TOXIC RAW - Contains hemagglutinin. Must be cooked.",
    },
    lima_beans: {
      compatible_with: [],
      incompatible_with: [
        "pigeon",
        "parrot",
        "african_grey",
        "budgie",
        "canary",
        "chicken",
      ],
      notes: "TOXIC RAW - Contains hemagglutinin. Must be cooked.",
    },
    sunflower_seeds: {
      compatible_with: [
        "pigeon",
        "parrot",
        "african_grey",
        "budgie",
        "canary",
        "chicken",
      ],
      incompatible_with: [],
      notes: "High in fat; use in moderation for sedentary birds",
    },
    safflower_seeds: {
      compatible_with: [
        "pigeon",
        "parrot",
        "african_grey",
        "budgie",
        "canary",
        "chicken",
      ],
      incompatible_with: [],
      notes: "Good oil seed",
    },
    hemp_seeds: {
      compatible_with: [
        "pigeon",
        "parrot",
        "african_grey",
        "budgie",
        "canary",
        "chicken",
      ],
      incompatible_with: [],
      notes: "Nutritious but high in fat",
    },
    peanuts: {
      compatible_with: ["pigeon", "parrot", "african_grey"],
      incompatible_with: ["budgie", "canary", "chicken"],
      notes: "Too large for small birds; risk of aflatoxin contamination",
    },
    peanuts_raw: {
      compatible_with: ["pigeon", "parrot", "african_grey"],
      incompatible_with: ["budgie", "canary", "chicken"],
      notes: "Risk of aflatoxin; roasted preferred",
    },
    peanuts_roasted: {
      compatible_with: ["pigeon", "parrot", "african_grey"],
      incompatible_with: ["budgie", "canary", "chicken"],
      notes: "Safer than raw; still high in fat",
    },
  };

export function isIngredientCompatible(
  ingredient: string,
  bird: BirdType,
): boolean {
  const compat = INGREDIENT_COMPATIBILITY[ingredient];
  if (!compat) return true; // Assume compatible if not specified
  return compat.compatible_with.includes(bird);
}

export function getIncompatibilityReason(
  ingredient: string,
  bird: BirdType,
): string | null {
  const compat = INGREDIENT_COMPATIBILITY[ingredient];
  if (!compat) return null;

  if (compat.incompatible_with.includes(bird)) {
    return compat.notes || "Not recommended for this bird species";
  }
  return null;
}

export function getToxicFoodForBird(
  ingredient: string,
  bird: BirdType,
): ToxicFood | null {
  const toxics = BIRD_TOXIC_FOODS[bird];
  if (!toxics) return null;

  // Try direct match
  if (toxics[ingredient]) return toxics[ingredient];

  // Try partial match (e.g., "kidney_beans" matches "kidney beans")
  const normalized = ingredient.toLowerCase().replace(/\s+/g, "_");
  if (toxics[normalized]) return toxics[normalized];

  return null;
}
