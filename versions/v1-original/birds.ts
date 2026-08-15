// Bird types and profiles for multi-bird calculator

export type BirdType = "pigeon" | "parrot" | "african_grey" | "budgie" | "canary" | "chicken";

export interface BirdProfile {
  name: string;
  color: string; // Tailwind color class
  icon: string; // Lucide icon name
  description: string;
}

export interface NutritionProfile {
  name: string;
  protein: [number, number];
  carbs: [number, number];
  fat: [number, number];
  fiber: [number, number];
  category_ratios: {
    grain: [number, number];
    legume: [number, number];
    seed: [number, number];
  };
  feeding_notes: string;
}

export const BIRD_INFO: Record<BirdType, BirdProfile> = {
  pigeon: {
    name: "Pigeon",
    color: "bg-slate-500",
    icon: "Bird",
    description: "Racing pigeons, homing pigeons, and pet pigeons"
  },
  parrot: {
    name: "Parrot",
    color: "bg-green-500",
    icon: "Leaf",
    description: "Macaws, Amazons, Cockatoos, and other large parrots"
  },
  african_grey: {
    name: "African Grey",
    color: "bg-gray-600",
    icon: "Bird",
    description: "African Grey parrots (specialized nutrition)"
  },
  budgie: {
    name: "Budgie",
    color: "bg-blue-400",
    icon: "Feather",
    description: "Budgerigars and parakeets"
  },
  canary: {
    name: "Canary",
    color: "bg-yellow-400",
    icon: "Music",
    description: "Canaries and similar small songbirds"
  },
  chicken: {
    name: "Chicken",
    color: "bg-amber-600",
    icon: "Egg",
    description: "Chickens and poultry"
  }
};

// Pigeon Profiles
export const PIGEON_PROFILES: Record<string, NutritionProfile> = {
  maintenance: {
    name: "Maintenance/Rest",
    protein: [13.5, 15],
    carbs: [60, 70],
    fat: [2.5, 4],
    fiber: [0.5, 2],
    category_ratios: { grain: [50, 60], legume: [20, 30], seed: [15, 25] },
    feeding_notes: "Feed 30-40g per bird per day. Light feeding in morning, standard mix in evening."
  },
  racing: {
    name: "Racing/Competition",
    protein: [16, 18],
    carbs: [58, 68],
    fat: [4, 6],
    fiber: [0.5, 1.5],
    category_ratios: { grain: [45, 55], legume: [25, 35], seed: [15, 25] },
    feeding_notes: "High protein for muscle development. Feed 40-50g per bird daily during training season."
  },
  breeding: {
    name: "Breeding/Brooding",
    protein: [14, 16],
    carbs: [60, 68],
    fat: [3, 5],
    fiber: [0.5, 2],
    category_ratios: { grain: [50, 60], legume: [20, 30], seed: [15, 25] },
    feeding_notes: "Balanced nutrition for egg production and chick rearing. Increase calcium availability."
  },
  molting: {
    name: "Molting Season",
    protein: [16, 18],
    carbs: [58, 68],
    fat: [4, 6],
    fiber: [0.5, 1.5],
    category_ratios: { grain: [45, 55], legume: [25, 35], seed: [15, 25] },
    feeding_notes: "High protein for feather development. Rich in amino acids, especially cysteine."
  },
  winter: {
    name: "Winter Season",
    protein: [12, 14],
    carbs: [62, 72],
    fat: [5, 8],
    fiber: [0.5, 2],
    category_ratios: { grain: [50, 65], legume: [15, 25], seed: [15, 25] },
    feeding_notes: "Higher fat for warmth and energy. Provide shelter and ensure water doesn't freeze."
  },
  pet: {
    name: "Pet/Companion",
    protein: [12, 14],
    carbs: [62, 70],
    fat: [2.5, 4],
    fiber: [0.5, 2],
    category_ratios: { grain: [50, 60], legume: [20, 30], seed: [15, 25] },
    feeding_notes: "Balanced, lower-energy mix for stay-at-home pigeons. Feed 30-40g per bird daily."
  }
};

// Parrot Profiles
export const PARROT_PROFILES: Record<string, NutritionProfile> = {
  pet: {
    name: "Pet/Companion",
    protein: [10, 12],
    carbs: [60, 70],
    fat: [5, 8],
    fiber: [1, 3],
    category_ratios: { grain: [40, 50], legume: [25, 35], seed: [20, 30] },
    feeding_notes: "Balanced diet for sedentary companion parrots. Monitor fat intake to prevent obesity."
  },
  breeding: {
    name: "Breeding/Egg-laying",
    protein: [14, 16],
    carbs: [58, 68],
    fat: [6, 10],
    fiber: [1, 2],
    category_ratios: { grain: [35, 45], legume: [30, 40], seed: [20, 30] },
    feeding_notes: "Higher protein and fat for egg production and chick rearing. Ensure calcium availability."
  },
  molting: {
    name: "Molting Season",
    protein: [14, 16],
    carbs: [58, 68],
    fat: [6, 9],
    fiber: [1, 2],
    category_ratios: { grain: [35, 45], legume: [30, 40], seed: [20, 30] },
    feeding_notes: "High protein for feather development. Rich in amino acids and B vitamins."
  }
};

// African Grey Profiles (more specialized)
export const AFRICAN_GREY_PROFILES: Record<string, NutritionProfile> = {
  pet: {
    name: "Pet/Companion",
    protein: [12, 14],
    carbs: [58, 68],
    fat: [6, 9],
    fiber: [1, 3],
    category_ratios: { grain: [35, 45], legume: [30, 40], seed: [20, 30] },
    feeding_notes: "African Greys are sensitive to nutritional imbalances. Provide varied diet with nuts."
  },
  breeding: {
    name: "Breeding/Egg-laying",
    protein: [15, 17],
    carbs: [56, 66],
    fat: [7, 11],
    fiber: [1, 2],
    category_ratios: { grain: [30, 40], legume: [35, 45], seed: [20, 30] },
    feeding_notes: "Higher protein and fat for breeding success. Monitor calcium levels carefully."
  },
  molting: {
    name: "Molting Season",
    protein: [15, 17],
    carbs: [56, 66],
    fat: [7, 10],
    fiber: [1, 2],
    category_ratios: { grain: [30, 40], legume: [35, 45], seed: [20, 30] },
    feeding_notes: "Premium nutrition during molt. African Greys are prone to feather plucking if stressed."
  }
};

// Budgie Profiles
export const BUDGIE_PROFILES: Record<string, NutritionProfile> = {
  pet: {
    name: "Pet/Companion",
    protein: [11, 13],
    carbs: [62, 72],
    fat: [7, 10],
    fiber: [1, 2],
    category_ratios: { grain: [45, 55], legume: [20, 30], seed: [20, 30] },
    feeding_notes: "Small portions suitable for budgies. Provide fresh vegetables daily."
  },
  breeding: {
    name: "Breeding/Egg-laying",
    protein: [13, 15],
    carbs: [60, 70],
    fat: [8, 12],
    fiber: [1, 2],
    category_ratios: { grain: [40, 50], legume: [25, 35], seed: [20, 30] },
    feeding_notes: "Higher nutrition during breeding season. Budgies have high metabolic rates."
  },
  molting: {
    name: "Molting Season",
    protein: [13, 15],
    carbs: [60, 70],
    fat: [8, 11],
    fiber: [1, 2],
    category_ratios: { grain: [40, 50], legume: [25, 35], seed: [20, 30] },
    feeding_notes: "Support feather regrowth with protein-rich foods. Budgies molt twice yearly."
  }
};

// Canary Profiles
export const CANARY_PROFILES: Record<string, NutritionProfile> = {
  pet: {
    name: "Pet/Companion",
    protein: [12, 14],
    carbs: [64, 74],
    fat: [8, 11],
    fiber: [1, 2],
    category_ratios: { grain: [50, 60], legume: [15, 25], seed: [20, 30] },
    feeding_notes: "Canaries prefer small seeds. Provide niger seed and canary seed as staples."
  },
  breeding: {
    name: "Breeding/Egg-laying",
    protein: [14, 16],
    carbs: [62, 72],
    fat: [9, 13],
    fiber: [1, 2],
    category_ratios: { grain: [45, 55], legume: [20, 30], seed: [20, 30] },
    feeding_notes: "Breeding canaries need soft foods and high nutrition. Provide egg food regularly."
  },
  molting: {
    name: "Molting Season",
    protein: [14, 16],
    carbs: [62, 72],
    fat: [9, 12],
    fiber: [1, 2],
    category_ratios: { grain: [45, 55], legume: [20, 30], seed: [20, 30] },
    feeding_notes: "Support molt with protein and minerals. Canaries molt once yearly in late summer."
  }
};

// Chicken Profiles
export const CHICKEN_PROFILES: Record<string, NutritionProfile> = {
  pet: {
    name: "Pet/Companion",
    protein: [14, 16],
    carbs: [58, 68],
    fat: [4, 7],
    fiber: [3, 6],
    category_ratios: { grain: [60, 70], legume: [15, 25], seed: [10, 20] },
    feeding_notes: "Balanced maintenance diet for backyard chickens. Provide grit and oyster shells."
  },
  "egg-laying": {
    name: "Egg-laying",
    protein: [16, 18],
    carbs: [56, 66],
    fat: [5, 8],
    fiber: [3, 6],
    category_ratios: { grain: [55, 65], legume: [20, 30], seed: [10, 20] },
    feeding_notes: "Higher protein for consistent egg production. Ensure adequate calcium for shells."
  },
  molting: {
    name: "Molting Season",
    protein: [17, 19],
    carbs: [54, 64],
    fat: [5, 8],
    fiber: [3, 6],
    category_ratios: { grain: [50, 60], legume: [25, 35], seed: [10, 20] },
    feeding_notes: "High protein during molt to support feather regrowth. Molt lasts 8-12 weeks."
  }
};

export const ALL_PROFILES: Record<BirdType, Record<string, NutritionProfile>> = {
  pigeon: PIGEON_PROFILES,
  parrot: PARROT_PROFILES,
  african_grey: AFRICAN_GREY_PROFILES,
  budgie: BUDGIE_PROFILES,
  canary: CANARY_PROFILES,
  chicken: CHICKEN_PROFILES
};

export function getProfilesForBird(bird: BirdType): Record<string, NutritionProfile> {
  return ALL_PROFILES[bird] || PIGEON_PROFILES;
}
