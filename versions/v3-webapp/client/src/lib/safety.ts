// Safety warnings and ingredient preparation notes
// This module handles toxic ingredient detection and safety information
import type { BirdType } from "./birds";

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
  birdGuidance?: Partial<Record<BirdType, string>>;
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
  "black_eyed_peas"
]);

// These ingredients must not be treated as ready-to-feed on the basis of a name alone.
// Feed-grade processing, cultivar, and inclusion rate require professional confirmation.
export const INGREDIENTS_REQUIRING_VERIFIED_PROCESSING = new Set([
  "beans",
  "black_beans",
  "fava_beans",
  "kidney_beans",
  "lima_beans",
  "navy_beans",
  "pinto_beans",
  "soybeans",
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
    notes: "Use fresh, plain, unsalted bird-feed peanuts from a reputable aflatoxin-controlled source. Discard damaged, musty, or mouldy nuts. High-fat treat; the calculator balances it when other inventory is available."
  },
  "peanuts_raw": {
    name: "Raw Peanuts",
    preparation: "Remove shells before feeding",
    notes: "Use fresh, plain, unsalted bird-feed peanuts from a reputable aflatoxin-controlled source. Discard damaged, musty, or mouldy nuts. High-fat treat; the calculator balances it when other inventory is available."
  },
  "peanuts_roasted": {
    name: "Roasted Peanuts",
    preparation: "Remove shells before feeding",
    notes: "Use fresh, plain, unsalted dry-roasted bird-feed peanuts from a reputable aflatoxin-controlled source. Discard damaged, musty, or mouldy nuts. High-fat treat; the calculator balances it when other inventory is available."
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
  },
  "chickpeas": {
    name: "Chickpeas",
    preparation: "Soak, then boil until completely soft; drain and cool before feeding",
    notes: "Cooked or properly processed chickpeas only. Their antinutritional factors are reduced by heat treatment.",
    birdGuidance: {
      pigeon: "Offer cooked chickpeas whole or split, mixed with the usual grain/seed formula.",
      chicken: "Offer cooked chickpeas as a limited part of a balanced poultry ration, not as a sole protein source.",
      parrot: "Offer only cooked, plain, soft chickpeas; never salted or seasoned.",
      african_grey: "Offer only cooked, plain, soft chickpeas; never salted or seasoned.",
      budgie: "Offer cooked chickpeas finely chopped or mashed in a suitable small-bird portion.",
      canary: "Offer cooked chickpeas finely chopped or mashed in a suitable small-bird portion."
    }
  },
  "adzuki_beans": {
    name: "Adzuki Beans",
    preparation: "Soak, then boil until completely soft; drain and cool before feeding",
    notes: "Soaking and cooking reduce phytic acid, tannins, and trypsin-inhibitor activity in adzuki beans.",
    birdGuidance: {
      pigeon: "Offer cooked adzuki beans whole or split, mixed with the usual grain/seed formula.",
      chicken: "Offer cooked adzuki beans as a limited part of a balanced poultry ration.",
      parrot: "Offer only cooked, plain, soft adzuki beans; never salted or seasoned.",
      african_grey: "Offer only cooked, plain, soft adzuki beans; never salted or seasoned.",
      budgie: "Offer cooked adzuki beans finely chopped or mashed in a suitable small-bird portion.",
      canary: "Offer cooked adzuki beans finely chopped or mashed in a suitable small-bird portion."
    }
  },
  "lupins": {
    name: "Lupins",
    preparation: "Use only feed-grade sweet lupins (low-alkaloid); do not use bitter garden lupins",
    notes: "Sweet lupins are the low-alkaloid feed type. Bitter lupins can contain high alkaloid levels and must not be used.",
    birdGuidance: {
      pigeon: "Use only verified feed-grade sweet lupins in the dry mix.",
      chicken: "Use only verified feed-grade sweet lupins in a balanced poultry ration.",
      parrot: "Offer only a prepared feed-grade sweet-lupin product suitable for companion birds.",
      african_grey: "Offer only a prepared feed-grade sweet-lupin product suitable for companion birds.",
      budgie: "Use only a finely prepared feed-grade sweet-lupin product suitable for small birds.",
      canary: "Use only a finely prepared feed-grade sweet-lupin product suitable for small birds."
    }
  },
  "vetch": {
    name: "Common Vetch",
    preparation: "Use feed-grade common vetch that has been heat-treated; do not feed raw vetch seed",
    notes: "Common vetch contains antinutritional factors. Heat treatment improves usable inclusion in poultry diets.",
    birdGuidance: {
      pigeon: "Use only feed-grade, heat-treated common vetch as part of a mixed formula.",
      chicken: "Use only feed-grade, heat-treated common vetch at a limited inclusion within a balanced poultry ration.",
      parrot: "Do not add common vetch to a companion-parrot seed mix; use an appropriate formulated diet instead.",
      african_grey: "Do not add common vetch to an African-grey seed mix; use an appropriate formulated diet instead.",
      budgie: "Do not add common vetch to a budgie seed mix.",
      canary: "Do not add common vetch to a canary seed mix."
    }
  }
};

// Disclaimer text
export const SAFETY_DISCLAIMER = `
⚠️ **IMPORTANT SAFETY REMINDERS:**
- **Fresh Water**: Always provide clean, fresh water available at all times
- **Grit**: Pigeons need grit to properly digest seeds and grains
- **Toxic Legumes**: Never feed raw kidney beans, lima beans, fava beans, navy beans, or pinto beans - they contain deadly toxins
- **Preparation**: Follow preparation instructions for each ingredient carefully
- **Exotics Vet Care**: If your pigeon shows signs of illness, contact an exotics vet immediately
`;

// Check if an ingredient is toxic when raw
export function isToxicRaw(ingredientName: string): ToxicIngredient | null {
  return TOXIC_INGREDIENTS[ingredientName] || null;
}

// Check if a legume is safe to feed raw
export function isSafeRawLegume(ingredientName: string): boolean {
  return SAFE_RAW_LEGUMES.has(ingredientName);
}

export function requiresVerifiedProcessing(ingredientName: string): boolean {
  return INGREDIENTS_REQUIRING_VERIFIED_PROCESSING.has(ingredientName);
}

export function getProcessingWarning(ingredientName: string): string | null {
  if (!requiresVerifiedProcessing(ingredientName)) return null;
  return "Excluded until feed-grade processing, cultivar, and safe inclusion guidance are confirmed.";
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
