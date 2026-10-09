/**
 * Canonical herb and supplement content records database file.
 *
 * This repository-level database file is the human-reviewable source for
 * herb/supplement content records (categories, benefits, dosages, frequency, notes).
 * The V3 application imports it through client/src/lib/herb-content.ts.
 */

export interface Herb {
  category: "herb_seed" | "herb_spice" | "herb_dried" | "liquid_supplement" | "powder_supplement";
  benefits: string[];
  dosage_per_kg: string;
  frequency: string;
  notes: string;
}

export const HERBS_SUPPLEMENTS: Record<string, Herb> = {
  // ===== HERBS & SPICES (Health Benefits) =====
  anise: {
    category: "herb_seed",
    benefits: ["Respiratory health", "Digestion", "Antimicrobial", "Reduces Odor"],
    dosage_per_kg: "2-5g",
    frequency: "2-3 times per week",
    notes: "Aniseed, good for respiratory system and reduces dropping odor",
  },
  fennel: {
    category: "herb_seed",
    benefits: ["Digestion", "Respiratory", "Anti-inflammatory"],
    dosage_per_kg: "2-5g",
    frequency: "2-3 times per week",
    notes: "Fennel seeds, aids digestion",
  },
  nigella: {
    category: "herb_seed",
    benefits: ["Immunity", "Antimicrobial", "Antioxidant"],
    dosage_per_kg: "1-3g",
    frequency: "2-3 times per week",
    notes: "Black cumin/black seed, immune booster",
  },
  cumin: {
    category: "herb_spice",
    benefits: ["Digestion", "Antimicrobial", "Antioxidant"],
    dosage_per_kg: "1-2g",
    frequency: "2-3 times per week",
    notes: "Ground cumin, digestive aid",
  },
  coriander: {
    category: "herb_seed",
    benefits: ["Digestion", "Antimicrobial", "Cooling"],
    dosage_per_kg: "2-4g",
    frequency: "2-3 times per week",
    notes: "Coriander seeds, cooling effect",
  },
  fenugreek: {
    category: "herb_seed",
    benefits: ["Digestion", "Immunity", "Anti-inflammatory"],
    dosage_per_kg: "2-4g",
    frequency: "2-3 times per week",
    notes: "Fenugreek seeds, digestive tonic",
  },
  oregano: {
    category: "herb_dried",
    benefits: ["Antimicrobial", "Antifungal", "Respiratory"],
    dosage_per_kg: "1-2g",
    frequency: "2-3 times per week",
    notes: "Dried oregano, strong antimicrobial",
  },
  thyme: {
    category: "herb_dried",
    benefits: ["Respiratory", "Antimicrobial", "Antifungal"],
    dosage_per_kg: "1-2g",
    frequency: "2-3 times per week",
    notes: "Dried thyme, respiratory support",
  },
  basil: {
    category: "herb_dried",
    benefits: ["Antimicrobial", "Antioxidant", "Anti-inflammatory"],
    dosage_per_kg: "1-2g",
    frequency: "2-3 times per week",
    notes: "Dried basil, general health",
  },
  cinnamon: {
    category: "herb_spice",
    benefits: ["Antimicrobial", "Antifungal", "Circulation"],
    dosage_per_kg: "0.5-1g",
    frequency: "2-3 times per week",
    notes: "Ground cinnamon, improves circulation",
  },
  ginger: {
    category: "herb_spice",
    benefits: ["Digestion", "Anti-inflammatory", "Immunity"],
    dosage_per_kg: "0.5-1g",
    frequency: "2-3 times per week",
    notes: "Ground ginger, digestive and immune support",
  },
  turmeric: {
    category: "herb_spice",
    benefits: ["Anti-inflammatory", "Antioxidant", "Immunity"],
    dosage_per_kg: "0.5-1g",
    frequency: "2-3 times per week",
    notes: "Ground turmeric, powerful anti-inflammatory",
  },
  garlic_powder: {
    category: "herb_spice",
    benefits: ["Antimicrobial", "Immunity", "Circulation"],
    dosage_per_kg: "1-2g",
    frequency: "Once a week",
    notes: "Natural antibiotic, use fresh garlic oil if available",
  },
  clove: {
    category: "herb_spice",
    benefits: ["Antimicrobial", "Antifungal", "Pain relief"],
    dosage_per_kg: "0.25-0.5g",
    frequency: "1-2 times per week",
    notes: "Ground clove, very strong, use sparingly",
  },
  rosemary: {
    category: "herb_dried",
    benefits: ["Antioxidant", "Circulation", "Respiratory"],
    dosage_per_kg: "1-2g",
    frequency: "2-3 times per week",
    notes: "Dried rosemary, antioxidant rich",
  },
  mint: {
    category: "herb_dried",
    benefits: ["Digestion", "Cooling", "Respiratory"],
    dosage_per_kg: "1-2g",
    frequency: "2-3 times per week",
    notes: "Dried mint/peppermint, cooling digestive aid",
  },
  chamomile: {
    category: "herb_dried",
    benefits: ["Calming", "Anti-inflammatory", "Digestion"],
    dosage_per_kg: "1-2g",
    frequency: "2-3 times per week",
    notes: "Dried chamomile flowers, calming effect",
  },
  neem: {
    category: "herb_dried",
    benefits: ["Antimicrobial", "Antiparasitic", "Immunity"],
    dosage_per_kg: "0.5-1g",
    frequency: "Once a week",
    notes: "Neem leaves, strong antiparasitic",
  },

  // ===== LIQUID SUPPLEMENTS =====
  apple_cider_vinegar: {
    category: "liquid_supplement",
    benefits: ["Gut health", "pH balance", "Antimicrobial"],
    dosage_per_kg: "5-10ml per liter water",
    frequency: "2-3 times per week",
    notes: "Use raw with 'the mother', probiotic",
  },
  garlic_oil: {
    category: "liquid_supplement",
    benefits: ["Antimicrobial", "Immunity", "Circulation"],
    dosage_per_kg: "Few drops per kg feed",
    frequency: "Once a week",
    notes: "Natural antibiotic, very effective",
  },
  hemp_oil: {
    category: "liquid_supplement",
    benefits: ["Omega-3", "Feather health", "Anti-inflammatory"],
    dosage_per_kg: "5-10ml per kg feed",
    frequency: "2-3 times per week",
    notes: "Rich in omega fatty acids",
  },
  cod_liver_oil: {
    category: "liquid_supplement",
    benefits: ["Vitamin D", "Omega-3", "Immunity"],
    dosage_per_kg: "5ml per kg feed",
    frequency: "Winter: 3-4 times per week",
    notes: "Essential for winter, vitamin D source",
  },
  linseed_oil: {
    category: "liquid_supplement",
    benefits: ["Omega-3", "Feather health", "Breeding"],
    dosage_per_kg: "5-10ml per kg feed",
    frequency: "Breeding/molting: 3-4 times per week",
    notes: "Flaxseed oil, coat feed for breeding",
  },

  // ===== OTHER SUPPLEMENTS =====
  brewers_yeast: {
    category: "powder_supplement",
    benefits: ["B vitamins", "Amino acids", "Minerals"],
    dosage_per_kg: "5-10g",
    frequency: "Molting: daily, otherwise 2-3x per week",
    notes: "Essential during molting for feather growth",
  },
  elderberry_extract: {
    category: "liquid_supplement",
    benefits: ["Immunity", "Antiviral", "Antioxidant"],
    dosage_per_kg: "5-10ml per liter water",
    frequency: "2-3 times per week",
    notes: "One of the best immune boosters",
  },
  probiotics: {
    category: "powder_supplement",
    benefits: ["Gut health", "Digestion", "Immunity"],
    dosage_per_kg: "As per product instructions",
    frequency: "Daily or as directed",
    notes: "Beneficial bacteria for gut health",
  },
};
