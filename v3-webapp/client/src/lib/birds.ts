// Bird types and profiles for multi-bird calculator
export type BirdType = 'pigeon' | 'parrot' | 'african_grey' | 'budgie' | 'canary' | 'chicken';

export interface NutritionTarget {
  protein: [number, number]; // [min, max]
  carbs: [number, number];
  fat: [number, number];
  fiber: [number, number];
}

export interface SituationProfile {
  name: string;
  description: string;
  feedingNotes: string;
  contextNote?: string;
  nutrition: NutritionTarget;
}

export interface BirdProfile {
  name: string;
  color: string;
  icon: string;
  description: string;
  profiles: Record<string, SituationProfile>;
}

export interface CategoryTargets {
  grain: [number, number];
  legume: [number, number];
  seed: [number, number];
}

export interface BirdCareGuidance {
  scope: string;
  baseDiet: string;
  water: string;
  grit: string;
  gritBySituation?: Partial<Record<string, string>>;
}

export const BIRD_PROFILES: Record<BirdType, BirdProfile> = {
  pigeon: {
    name: 'Pigeon',
    color: 'bg-slate-500',
    icon: '🕊️',
    description: 'Racing pigeons, homing pigeons, and companion pigeons',
    profiles: {
      maintenance: {
        name: 'Maintenance/Rest',
        description: 'Light feeding for resting periods',
        feedingNotes: 'Feed 30-40g per bird per day. Light feeding in morning, standard mix in evening.',
        contextNote: 'Use this planner range only as a seed/grain batch estimate. Adjust the complete diet with an exotics vet according to body condition and activity.',
        nutrition: {
          protein: [13.5, 15],
          carbs: [60, 70],
          fat: [2.5, 4],
          fiber: [0.5, 2],
        },
      },
      racing: {
        name: 'Racing/Competition',
        description: 'High-energy mix for racing and performance',
        feedingNotes: 'Feed 40-50g per bird per day. Increase 2 weeks before races. Provide extra water.',
        contextNote: 'Performance birds have individual energy and recovery needs. Use a veterinarian- or specialist-reviewed performance diet as the foundation.',
        nutrition: {
          protein: [16, 18],
          carbs: [55, 65],
          fat: [3, 5],
          fiber: [0.5, 1.5],
        },
      },
      breeding: {
        name: 'Breeding',
        description: 'Balanced nutrition for breeding pairs',
        feedingNotes: 'Feed 35-45g per bird per day. Ensure consistent feeding schedule.',
        contextNote: 'Breeding birds need individually assessed mineral, energy, and amino-acid support beyond this batch estimate.',
        nutrition: {
          protein: [14, 16],
          carbs: [58, 68],
          fat: [3, 4.5],
          fiber: [0.5, 2],
        },
      },
      molting: {
        name: 'Molting Season',
        description: 'High protein for feather growth',
        feedingNotes: 'Feed 40-50g per bird per day. Increase protein during feather loss.',
        contextNote: 'Molting support should be based on body condition and a complete diet; this seed/grain estimate does not assess amino-acid adequacy.',
        nutrition: {
          protein: [16, 18],
          carbs: [55, 65],
          fat: [3.5, 5],
          fiber: [0.5, 1.5],
        },
      },
      winter: {
        name: 'Winter Season',
        description: 'Higher fat for warmth and energy',
        feedingNotes: 'Feed 40-50g per bird per day. Increase fat content for body warmth.',
        contextNote: 'Cold-weather feeding needs vary with housing, weather, activity, and body condition. Avoid increasing high-fat seeds without professional guidance.',
        nutrition: {
          protein: [12, 14],
          carbs: [55, 65],
          fat: [4, 6],
          fiber: [0.5, 2],
        },
      },
      pet: {
        name: 'Pet/Companion',
        description: 'Balanced nutrition for indoor companion pigeons',
        feedingNotes: 'Feed 25-35g per bird per day. Provide variety and enrichment.',
        contextNote: 'Keep seeds and grains as part of a broader, balanced pigeon diet. Monitor body condition and consult an exotics vet for dietary changes.',
        nutrition: {
          protein: [12, 14],
          carbs: [60, 70],
          fat: [2.5, 4],
          fiber: [1, 2.5],
        },
      },
    },
  },
  parrot: {
    name: 'Parrot',
    color: 'bg-green-500',
    icon: '🦜',
    description: 'African Grey, Amazons, Macaws, Cockatoos, and other parrots',
    profiles: {
      pet: {
        name: 'Pet/Companion',
        description: 'Balanced nutrition for companion parrots',
        feedingNotes: 'Feed 30-50g per bird per day. Provide varied diet with fresh foods.',
        contextNote: 'Use a formulated diet as the nutritional base. Treat this mix as limited enrichment rather than a daily complete food.',
        nutrition: {
          protein: [10, 15],
          carbs: [50, 65],
          fat: [5, 12],
          fiber: [2, 4],
        },
      },
      breeding: {
        name: 'Breeding',
        description: 'Enhanced nutrition for breeding pairs',
        feedingNotes: 'Feed 40-60g per bird per day. Increase calcium and protein during breeding.',
        contextNote: 'Do not use this planner to set calcium or breeding supplementation. Seek guidance from an exotics vet for breeding birds.',
        nutrition: {
          protein: [12, 16],
          carbs: [48, 62],
          fat: [6, 12],
          fiber: [2, 4],
        },
      },
      molting: {
        name: 'Molting Season',
        description: 'High protein for feather regeneration',
        feedingNotes: 'Feed 40-60g per bird per day. Support feather growth with protein.',
        contextNote: 'Maintain a species-appropriate complete diet during molt; this mix cannot validate amino acids, minerals, or vitamins.',
        nutrition: {
          protein: [14, 18],
          carbs: [45, 60],
          fat: [6, 12],
          fiber: [2, 4],
        },
      },
    },
  },
  african_grey: {
    name: 'African Grey',
    color: 'bg-gray-600',
    icon: '🦜',
    description: 'African Grey Parrots (Congo and Timneh)',
    profiles: {
      pet: {
        name: 'Pet/Companion',
        description: 'Seed and grain enrichment for companion African greys',
        feedingNotes: 'African greys are prone to calcium-related nutritional problems on seed-heavy diets. Use a formulated base diet and guidance from an exotics vet.',
        nutrition: {
          protein: [10, 14],
          carbs: [50, 65],
          fat: [5, 10],
          fiber: [2, 4],
        },
      },
      breeding: {
        name: 'Breeding',
        description: 'Seed and grain enrichment during breeding',
        feedingNotes: 'Breeding diets require professional mineral and nutrient assessment; do not rely on this seed/grain estimate as a breeding ration.',
        nutrition: {
          protein: [12, 15],
          carbs: [48, 62],
          fat: [6, 10],
          fiber: [2, 4],
        },
      },
      molting: {
        name: 'Molting Season',
        description: 'Seed and grain enrichment during molt',
        feedingNotes: 'Maintain a formulated base diet through molt and consult an exotics vet for feather or health concerns.',
        nutrition: {
          protein: [13, 16],
          carbs: [45, 60],
          fat: [6, 10],
          fiber: [2, 4],
        },
      },
    },
  },
  budgie: {
    name: 'Budgie',
    color: 'bg-blue-400',
    icon: '🐦',
    description: 'Budgerigars and small parakeets',
    profiles: {
      pet: {
        name: 'Pet/Companion',
        description: 'Balanced nutrition for active budgies',
        feedingNotes: 'Feed 10-15g per bird per day. Provide fresh vegetables daily.',
        contextNote: 'Use a species-appropriate formulated diet as the base. Keep this mix limited and provide varied fresh foods as appropriate.',
        nutrition: {
          protein: [12, 14],
          carbs: [55, 70],
          fat: [5, 10],
          fiber: [2, 4],
        },
      },
      breeding: {
        name: 'Breeding',
        description: 'Enhanced nutrition for breeding pairs',
        feedingNotes: 'Feed 15-20g per bird per day. Increase protein during breeding season.',
        contextNote: 'Breeding budgies need individual assessment by an exotics vet; this mix does not establish mineral or amino-acid adequacy.',
        nutrition: {
          protein: [14, 16],
          carbs: [50, 65],
          fat: [6, 10],
          fiber: [2, 4],
        },
      },
      molting: {
        name: 'Molting Season',
        description: 'High protein for feather growth',
        feedingNotes: 'Feed 15-20g per bird per day. Support feather development.',
        contextNote: 'Keep a nutritionally complete base diet during molt. This planner does not assess feather-supporting amino acids or micronutrients.',
        nutrition: {
          protein: [15, 17],
          carbs: [48, 62],
          fat: [6, 10],
          fiber: [2, 4],
        },
      },
    },
  },
  canary: {
    name: 'Canary',
    color: 'bg-yellow-400',
    icon: '🐤',
    description: 'Canaries and other small songbirds',
    profiles: {
      pet: {
        name: 'Pet/Companion',
        description: 'Balanced nutrition for singing canaries',
        feedingNotes: 'Feed 8-12g per bird per day. Provide variety and enrichment.',
        contextNote: 'Use a formulated or fortified diet as the base. Treat this mix as limited enrichment, not the sole ration.',
        nutrition: {
          protein: [12, 14],
          carbs: [60, 72],
          fat: [4, 8],
          fiber: [2, 4],
        },
      },
      breeding: {
        name: 'Breeding',
        description: 'Enhanced nutrition for breeding season',
        feedingNotes: 'Feed 12-16g per bird per day. Increase protein during breeding.',
        contextNote: 'Breeding canaries need individual professional guidance; this mix does not establish egg, mineral, or amino-acid adequacy.',
        nutrition: {
          protein: [14, 16],
          carbs: [55, 68],
          fat: [5, 9],
          fiber: [2, 4],
        },
      },
      molting: {
        name: 'Molting Season',
        description: 'High protein for feather regeneration',
        feedingNotes: 'Feed 12-16g per bird per day. Support feather growth.',
        contextNote: 'Maintain a complete base diet during molt. Consult an exotics vet for any persistent feather or health issue.',
        nutrition: {
          protein: [15, 17],
          carbs: [52, 65],
          fat: [5, 9],
          fiber: [2, 4],
        },
      },
    },
  },
  chicken: {
    name: 'Chicken',
    color: 'bg-orange-500',
    icon: '🐔',
    description: 'Backyard chickens and poultry',
    profiles: {
      pet: {
        name: 'Pet/Companion',
        description: 'Balanced nutrition for backyard chickens',
        feedingNotes: 'Feed 100-150g per bird per day. Provide grit and oyster shell.',
        contextNote: 'Use an age-appropriate complete poultry ration as the base. This planner estimates a scratch supplement, not a daily feed allowance.',
        nutrition: {
          protein: [12, 16],
          carbs: [55, 70],
          fat: [3, 6],
          fiber: [3, 5],
        },
      },
      egg_laying: {
        name: 'Egg-laying',
        description: 'High protein for consistent egg production',
        feedingNotes: 'Feed 120-160g per bird per day. Ensure adequate calcium for shells.',
        contextNote: 'Laying hens require a validated complete layer ration. This scratch estimate does not assess calcium, phosphorus, vitamins, or energy.',
        nutrition: {
          protein: [16, 18],
          carbs: [50, 65],
          fat: [4, 7],
          fiber: [3, 5],
        },
      },
      molting: {
        name: 'Molting Season',
        description: 'High protein for feather regeneration',
        feedingNotes: 'Feed 120-160g per bird per day. Support feather growth.',
        contextNote: 'Use a complete poultry ration during molt and seek poultry-nutrition guidance before altering protein or supplement levels.',
        nutrition: {
          protein: [16, 18],
          carbs: [50, 65],
          fat: [4, 7],
          fiber: [3, 5],
        },
      },
    },
  },
};

export const BIRD_TYPES: BirdType[] = ['pigeon', 'parrot', 'african_grey', 'budgie', 'canary', 'chicken'];

export const DEFAULT_CATEGORY_TARGETS: Record<BirdType, CategoryTargets> = {
  pigeon: { grain: [55, 70], legume: [15, 25], seed: [5, 15] },
  parrot: { grain: [35, 55], legume: [15, 30], seed: [5, 15] },
  african_grey: { grain: [35, 55], legume: [15, 30], seed: [5, 15] },
  budgie: { grain: [45, 65], legume: [5, 15], seed: [10, 20] },
  canary: { grain: [45, 65], legume: [5, 15], seed: [10, 20] },
  chicken: { grain: [60, 80], legume: [10, 20], seed: [0, 10] },
};

export const BIRD_CARE: Record<BirdType, BirdCareGuidance> = {
  pigeon: {
    scope: 'A batch estimate for a pigeon seed and grain mix; it does not assess vitamins, minerals, amino acids, or energy density.',
    baseDiet: 'Use a balanced pigeon diet with fresh produce.',
    water: 'Always provide clean, fresh water available at all times.',
    grit: 'Pigeons need grit to properly digest seeds and grains.',
    gritBySituation: {
      breeding: 'During breeding, include suitable shell grit as a calcium source.',
    },
  },
  parrot: {
    scope: 'A seed and grain enrichment mix, not a complete parrot diet.',
    baseDiet: 'Use a species-appropriate formulated diet as the nutritional base, with fresh vegetables and fruit, and only limited seeds or nuts.',
    water: 'Always provide clean, fresh water available at all times.',
    grit: 'Do not routinely add grit for parrots unless an exotics vet specifically recommends it.',
  },
  african_grey: {
    scope: 'A seed and grain enrichment mix, not a complete African grey diet.',
    baseDiet: 'Use a species-appropriate formulated diet as the nutritional base, with fresh vegetables and fruit. African greys need guidance from an exotics vet for calcium and vitamin D concerns.',
    water: 'Always provide clean, fresh water available at all times.',
    grit: 'Do not routinely add grit unless an exotics vet specifically recommends it.',
  },
  budgie: {
    scope: 'A seed and grain enrichment mix, not a complete budgie diet.',
    baseDiet: 'Use a species-appropriate formulated diet as the nutritional base, together with fresh vegetables, fruit, and limited seed.',
    water: 'Always provide clean, fresh water available at all times.',
    grit: 'Do not routinely add grit unless an exotics vet specifically recommends it.',
  },
  canary: {
    scope: 'A seed and grain enrichment mix, not a complete canary diet.',
    baseDiet: 'Use a species-appropriate formulated diet or fortified diet as the nutritional base, with fresh vegetables, fruit, and limited seed.',
    water: 'Always provide clean, fresh water available at all times.',
    grit: 'Do not routinely add grit unless an exotics vet specifically recommends it.',
  },
  chicken: {
    scope: 'A scratch-grain supplement mix, not a complete poultry ration. Keep scratch and other treats to a small share of daily intake.',
    baseDiet: 'Use an age- and production-appropriate complete poultry feed as the nutritional base, with insects as occasional enrichment. Laying hens require a validated layer ration.',
    water: 'Provide clean, fresh water continuously; water access strongly affects feed intake and egg production.',
    grit: 'Offer insoluble grit only when feeding whole grains or seeds and birds cannot obtain suitable grit from the ground. Oyster shell is not a grit substitute.',
  },
};

export function getBirdProfile(bird: BirdType): BirdProfile {
  return BIRD_PROFILES[bird];
}

export function getSituationProfile(bird: BirdType, situation: string): SituationProfile | null {
  const profile = BIRD_PROFILES[bird];
  return profile.profiles[situation] || null;
}

export function getAvailableSituations(bird: BirdType): string[] {
  return Object.keys(BIRD_PROFILES[bird].profiles);
}

export function getCategoryTargets(bird: BirdType): CategoryTargets {
  return DEFAULT_CATEGORY_TARGETS[bird];
}
