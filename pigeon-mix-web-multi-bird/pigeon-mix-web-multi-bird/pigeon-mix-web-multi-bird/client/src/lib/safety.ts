// Safety warnings and ingredient preparation notes
// This module handles toxic ingredient detection and safety information

export interface ToxicIngredient {
  name: string;
  toxin: string;
  severity: "CRITICAL" | "WARNING";
  message: string;
  preparation: string;
}

export interface IngredientPrep {
  name: string;
  preparation: string;
  notes: string;
}

// Toxic ingredients that should NEVER be fed raw
export const TOXIC_INGREDIENTS: Record<string, ToxicIngredient> = {
  "kidney_beans": {
    name: "Kidney Beans",
    toxin: "Hemagglutinin (Lectin)",
    severity: "CRITICAL",
    message: "Raw kidney beans contain hemagglutinin, a deadly toxin. MUST be thoroughly cooked before feeding.",
    preparation: "Boil for at least 30 minutes until completely soft. Raw = RISK OF DEATH."
  },
  "lima_beans": {
    name: "Lima Beans",
    toxin: "Hemagglutinin (Lectin)",
    severity: "CRITICAL",
    message: "Raw lima beans are TOXIC to pigeons and can cause severe intestinal damage.",
    preparation: "Must be thoroughly cooked. Raw = RISK OF DEATH."
  },
  "fava_beans": {
    name: "Fava Beans",
    toxin: "Hemagglutinin (Lectin)",
    severity: "CRITICAL",
    message: "Raw fava beans contain hemagglutinin. MUST be cooked before feeding.",
    preparation: "Boil thoroughly. Raw = RISK OF DEATH."
  },
  "navy_beans": {
    name: "Navy Beans",
    toxin: "Hemagglutinin (Lectin)",
    severity: "CRITICAL",
    message: "Raw navy beans are TOXIC and can be fatal to birds.",
    preparation: "Must be thoroughly cooked. Raw = RISK OF DEATH."
  },
  "pinto_beans": {
    name: "Pinto Beans",
    toxin: "Hemagglutinin (Lectin)",
    severity: "CRITICAL",
    message: "Raw pinto beans contain hemagglutinin toxin. MUST be cooked.",
    preparation: "Boil thoroughly. Raw = RISK OF DEATH."
  },
  "black_beans": {
    name: "Black Beans",
    toxin: "Hemagglutinin (Lectin)",
    severity: "CRITICAL",
    message: "Raw black beans are TOXIC and can be fatal.",
    preparation: "Must be thoroughly cooked. Raw = RISK OF DEATH."
  }
};

// Safe legumes that can be fed raw
export const SAFE_RAW_LEGUMES = new Set([
  "peas",
  "peas_field",
  "peas_canada",
  "peas_austrian",
  "peas_green",
  "peas_maple",
  "peas_yellow",
  "lentils",
  "lentils_red",
  "lentils_green",
  "lentils_brown",
  "split_peas",
  "mung_beans",
  "black_eyed_peas",
  "chickpeas",
  "adzuki_beans"
]);

// Grains that should not be the only grain in a mix
export const GRAINS_NEEDING_PAIRING = new Set([
  "corn_yellow",
  "corn_white",
  "maize",
  "popcorn",
  "milo",
  "sorghum",
  "kaffir_corn"
]);

// Recommended grain pairings
export const GRAIN_PAIRINGS: Record<string, string[]> = {
  "corn_yellow": ["wheat", "barley", "oats", "rye"],
  "corn_white": ["wheat", "barley", "oats", "rye"],
  "maize": ["wheat", "barley", "oats", "rye"],
  "milo": ["wheat", "barley", "oats", "rye"],
  "sorghum": ["wheat", "barley", "oats", "rye"],
  "kaffir_corn": ["wheat", "barley", "oats", "rye"]
};

// Ingredient preparation instructions
export const INGREDIENT_PREP: Record<string, IngredientPrep> = {
  "peanuts": {
    name: "Peanuts",
    preparation: "Remove shells before feeding",
    notes: "Feed unsalted, unsweetened peanuts only. High fat content - use sparingly."
  },
  "peanuts_raw": {
    name: "Raw Peanuts",
    preparation: "Remove shells before feeding",
    notes: "Feed unsalted raw peanuts. High fat content - use sparingly."
  },
  "peanuts_roasted": {
    name: "Roasted Peanuts",
    preparation: "Remove shells before feeding",
    notes: "Feed unsalted, unsweetened roasted peanuts. High fat content - use sparingly."
  },
  "sunflower": {
    name: "Sunflower Seeds",
    preparation: "Can feed with or without hulls",
    notes: "Hulled seeds are easier to eat. With hulls provides more fiber."
  },
  "safflower": {
    name: "Safflower Seeds",
    preparation: "Feed whole with hull intact",
    notes: "Hull provides important fiber. Pigeons love this seed."
  },
  "hemp": {
    name: "Hemp Seeds",
    preparation: "Feed whole seeds",
    notes: "Excellent source of omega-3 and omega-6 for feather health."
  },
  "flaxseed": {
    name: "Flaxseed",
    preparation: "Can feed whole or ground",
    notes: "Ground flaxseed has better absorption but oxidizes quickly - store in cool place."
  },
  "sesame": {
    name: "Sesame Seeds",
    preparation: "Feed whole with hull",
    notes: "Excellent calcium and mineral source. Hull provides fiber."
  },
  "chia": {
    name: "Chia Seeds",
    preparation: "Feed whole seeds",
    notes: "Very high fiber - use sparingly to avoid digestive issues."
  },
  "pumpkin_seeds": {
    name: "Pumpkin Seeds",
    preparation: "Feed whole or hulled",
    notes: "Whole seeds with hull provide maximum fiber. Hulled pepitas also acceptable."
  },
  "pepitas": {
    name: "Pepitas (Hulled Pumpkin Seeds)",
    preparation: "Feed as is",
    notes: "Hulled pumpkin seeds, high protein. Less fiber than whole seeds."
  }
};

// Disclaimer text
export const SAFETY_DISCLAIMER = `
⚠️ **IMPORTANT SAFETY REMINDERS:**
- **Fresh Water**: Always provide clean, fresh water available at all times
- **Grit**: Pigeons need grit to properly digest seeds and grains
- **Toxic Legumes**: Never feed raw kidney beans, lima beans, fava beans, navy beans, or pinto beans - they contain deadly toxins
- **Preparation**: Follow preparation instructions for each ingredient carefully
- **Veterinary Care**: If your pigeon shows signs of illness, contact an avian veterinarian immediately
`;

// Check if an ingredient is toxic when raw
export function isToxicRaw(ingredientName: string): ToxicIngredient | null {
  return TOXIC_INGREDIENTS[ingredientName] || null;
}

// Check if a legume is safe to feed raw
export function isSafeRawLegume(ingredientName: string): boolean {
  return SAFE_RAW_LEGUMES.has(ingredientName);
}

// Check if a grain needs pairing
export function grainNeedsPairing(grainName: string): boolean {
  return GRAINS_NEEDING_PAIRING.has(grainName);
}

// Get recommended pairings for a grain
export function getGrainPairings(grainName: string): string[] {
  return GRAIN_PAIRINGS[grainName] || [];
}

// Get preparation instructions for an ingredient
export function getPreparationInstructions(ingredientName: string): IngredientPrep | null {
  return INGREDIENT_PREP[ingredientName] || null;
}
