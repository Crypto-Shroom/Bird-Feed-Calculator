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
  nutrition: NutritionTarget;
}

export interface BirdProfile {
  name: string;
  color: string;
  icon: string;
  description: string;
  profiles: Record<string, SituationProfile>;
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
        description: 'Specialized nutrition for kidney health',
        feedingNotes: 'Feed 30-50g per bird per day. Monitor calcium/phosphorus ratio (1.2:1).',
        nutrition: {
          protein: [10, 14],
          carbs: [50, 65],
          fat: [5, 10],
          fiber: [2, 4],
        },
      },
      breeding: {
        name: 'Breeding',
        description: 'Enhanced nutrition with kidney support',
        feedingNotes: 'Feed 40-60g per bird per day. Maintain proper mineral balance.',
        nutrition: {
          protein: [12, 15],
          carbs: [48, 62],
          fat: [6, 10],
          fiber: [2, 4],
        },
      },
      molting: {
        name: 'Molting Season',
        description: 'High protein with kidney support',
        feedingNotes: 'Feed 40-60g per bird per day. Support feather growth safely.',
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
