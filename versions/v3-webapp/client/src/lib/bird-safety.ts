// Bird-specific toxicity and ingredient compatibility data
import type { BirdType } from './birds';

export interface ToxicFood {
  name: string;
  toxin: string;
  severity: 'FATAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

export interface IngredientCompatibility {
  ingredient: string;
  compatibleBirds: BirdType[];
  incompatibleBirds: BirdType[];
}

// Comprehensive bird-specific toxicity data
export const BIRD_TOXICITY: Record<BirdType, ToxicFood[]> = {
  pigeon: [
    {
      name: 'kidney_beans',
      toxin: 'Hemagglutinin (Lectin)',
      severity: 'FATAL',
      description: 'Raw kidney beans contain toxic lectin proteins that cause severe intestinal damage',
    },
    {
      name: 'lima_beans',
      toxin: 'Hemagglutinin (Lectin)',
      severity: 'FATAL',
      description: 'Raw lima beans contain toxic lectin proteins',
    },
    {
      name: 'fava_beans',
      toxin: 'Hemagglutinin (Lectin)',
      severity: 'FATAL',
      description: 'Raw fava beans contain toxic lectin proteins',
    },
    {
      name: 'navy_beans',
      toxin: 'Hemagglutinin (Lectin)',
      severity: 'FATAL',
      description: 'Raw navy beans contain toxic lectin proteins',
    },
    {
      name: 'pinto_beans',
      toxin: 'Hemagglutinin (Lectin)',
      severity: 'FATAL',
      description: 'Raw pinto beans contain toxic lectin proteins',
    },
    {
      name: 'avocado',
      toxin: 'Persin',
      severity: 'FATAL',
      description: 'Persin toxin damages heart and respiratory tissues',
    },
    {
      name: 'chocolate',
      toxin: 'Theobromine',
      severity: 'HIGH',
      description: 'Theobromine causes cardiac arrhythmias and tremors',
    },
    {
      name: 'caffeine',
      toxin: 'Caffeine',
      severity: 'HIGH',
      description: 'Caffeine causes cardiac stimulation and hyperactivity',
    },
    {
      name: 'onion',
      toxin: 'Thiosulfates',
      severity: 'HIGH',
      description: 'Thiosulfates damage red blood cells causing hemolytic anemia',
    },
    {
      name: 'garlic',
      toxin: 'Thiosulfates',
      severity: 'MEDIUM',
      description: 'Thiosulfates in high amounts can cause anemia',
    },
    {
      name: 'salt',
      toxin: 'Sodium',
      severity: 'MEDIUM',
      description: 'Excess sodium causes dehydration and kidney damage',
    },
  ],
  parrot: [
    {
      name: 'avocado',
      toxin: 'Persin',
      severity: 'FATAL',
      description: 'Persin toxin is highly toxic to parrots, damages heart and respiratory tissues',
    },
    {
      name: 'chocolate',
      toxin: 'Theobromine',
      severity: 'FATAL',
      description: 'Theobromine is extremely toxic to parrots',
    },
    {
      name: 'caffeine',
      toxin: 'Caffeine',
      severity: 'HIGH',
      description: 'Caffeine causes severe cardiac issues in parrots',
    },
    {
      name: 'salt',
      toxin: 'Sodium',
      severity: 'HIGH',
      description: 'Excess salt is particularly harmful to parrots',
    },
    {
      name: 'onion',
      toxin: 'Thiosulfates',
      severity: 'HIGH',
      description: 'Thiosulfates cause hemolytic anemia in parrots',
    },
    {
      name: 'garlic',
      toxin: 'Thiosulfates',
      severity: 'MEDIUM',
      description: 'Thiosulfates can damage red blood cells',
    },
    {
      name: 'kidney_beans',
      toxin: 'Hemagglutinin (Lectin)',
      severity: 'HIGH',
      description: 'Raw kidney beans are toxic to parrots',
    },
  ],
  african_grey: [
    {
      name: 'avocado',
      toxin: 'Persin',
      severity: 'FATAL',
      description: 'Persin is highly toxic to African Greys',
    },
    {
      name: 'chocolate',
      toxin: 'Theobromine',
      severity: 'FATAL',
      description: 'Theobromine is extremely toxic to African Greys',
    },
    {
      name: 'caffeine',
      toxin: 'Caffeine',
      severity: 'HIGH',
      description: 'Caffeine causes severe cardiac issues',
    },
    {
      name: 'salt',
      toxin: 'Sodium',
      severity: 'HIGH',
      description: 'Excess salt is harmful to African Greys',
    },
    {
      name: 'onion',
      toxin: 'Thiosulfates',
      severity: 'HIGH',
      description: 'Thiosulfates cause hemolytic anemia',
    },
    {
      name: 'kidney_beans',
      toxin: 'Hemagglutinin (Lectin)',
      severity: 'HIGH',
      description: 'Raw kidney beans are toxic',
    },
  ],
  budgie: [
    {
      name: 'avocado',
      toxin: 'Persin',
      severity: 'FATAL',
      description: 'Persin is highly toxic to budgies',
    },
    {
      name: 'chocolate',
      toxin: 'Theobromine',
      severity: 'FATAL',
      description: 'Theobromine is extremely toxic to budgies',
    },
    {
      name: 'caffeine',
      toxin: 'Caffeine',
      severity: 'HIGH',
      description: 'Caffeine causes severe cardiac issues in small birds',
    },
    {
      name: 'salt',
      toxin: 'Sodium',
      severity: 'HIGH',
      description: 'Excess salt is particularly harmful to budgies',
    },
    {
      name: 'onion',
      toxin: 'Thiosulfates',
      severity: 'HIGH',
      description: 'Thiosulfates cause hemolytic anemia',
    },
  ],
  canary: [
    {
      name: 'avocado',
      toxin: 'Persin',
      severity: 'FATAL',
      description: 'Persin is highly toxic to canaries',
    },
    {
      name: 'chocolate',
      toxin: 'Theobromine',
      severity: 'FATAL',
      description: 'Theobromine is extremely toxic to canaries',
    },
    {
      name: 'caffeine',
      toxin: 'Caffeine',
      severity: 'HIGH',
      description: 'Caffeine causes severe cardiac issues in small birds',
    },
    {
      name: 'salt',
      toxin: 'Sodium',
      severity: 'HIGH',
      description: 'Excess salt is particularly harmful to canaries',
    },
  ],
  chicken: [
    {
      name: 'avocado',
      toxin: 'Persin',
      severity: 'HIGH',
      description: 'Persin damages heart and respiratory tissues in chickens',
    },
    {
      name: 'chocolate',
      toxin: 'Theobromine',
      severity: 'MEDIUM',
      description: 'Theobromine causes issues in chickens',
    },
    {
      name: 'caffeine',
      toxin: 'Caffeine',
      severity: 'MEDIUM',
      description: 'Caffeine causes hyperactivity and stress',
    },
    {
      name: 'onion',
      toxin: 'Thiosulfates',
      severity: 'MEDIUM',
      description: 'Thiosulfates can cause anemia in chickens',
    },
    {
      name: 'kidney_beans',
      toxin: 'Hemagglutinin (Lectin)',
      severity: 'MEDIUM',
      description: 'Raw kidney beans should be cooked before feeding',
    },
  ],
};

// Ingredient compatibility mapping
export const INGREDIENT_COMPATIBILITY: Record<string, IngredientCompatibility> = {
  wheat: {
    ingredient: 'wheat',
    compatibleBirds: ['pigeon', 'parrot', 'african_grey', 'budgie', 'canary', 'chicken'],
    incompatibleBirds: [],
  },
  corn_yellow: {
    ingredient: 'corn_yellow',
    compatibleBirds: ['pigeon', 'parrot', 'african_grey', 'budgie', 'canary', 'chicken'],
    incompatibleBirds: [],
  },
  corn_red: {
    ingredient: 'corn_red',
    compatibleBirds: ['pigeon', 'parrot', 'african_grey', 'budgie', 'canary', 'chicken'],
    incompatibleBirds: [],
  },
  barley: {
    ingredient: 'barley',
    compatibleBirds: ['pigeon', 'parrot', 'african_grey', 'budgie', 'canary', 'chicken'],
    incompatibleBirds: [],
  },
  oats: {
    ingredient: 'oats',
    compatibleBirds: ['pigeon', 'parrot', 'african_grey', 'budgie', 'canary', 'chicken'],
    incompatibleBirds: [],
  },
  peas: {
    ingredient: 'peas',
    compatibleBirds: ['pigeon', 'parrot', 'african_grey', 'budgie', 'canary', 'chicken'],
    incompatibleBirds: [],
  },
  lentils: {
    ingredient: 'lentils',
    compatibleBirds: ['pigeon', 'parrot', 'african_grey', 'budgie', 'canary', 'chicken'],
    incompatibleBirds: [],
  },
  chickpeas: {
    ingredient: 'chickpeas',
    compatibleBirds: ['pigeon', 'parrot', 'african_grey', 'budgie', 'canary', 'chicken'],
    incompatibleBirds: [],
  },
  vetch: {
    ingredient: 'vetch',
    compatibleBirds: ['pigeon', 'chicken'],
    incompatibleBirds: ['parrot', 'african_grey', 'budgie', 'canary'],
  },
  sunflower: {
    ingredient: 'sunflower',
    compatibleBirds: ['pigeon', 'parrot', 'african_grey', 'budgie', 'canary', 'chicken'],
    incompatibleBirds: [],
  },
  safflower: {
    ingredient: 'safflower',
    compatibleBirds: ['pigeon', 'parrot', 'african_grey', 'budgie', 'canary', 'chicken'],
    incompatibleBirds: [],
  },
  peanuts: {
    ingredient: 'peanuts',
    compatibleBirds: ['pigeon', 'parrot', 'african_grey', 'budgie', 'canary', 'chicken'],
    incompatibleBirds: [],
  },
  avocado: {
    ingredient: 'avocado',
    compatibleBirds: [],
    incompatibleBirds: ['pigeon', 'parrot', 'african_grey', 'budgie', 'canary', 'chicken'],
  },
  chocolate: {
    ingredient: 'chocolate',
    compatibleBirds: [],
    incompatibleBirds: ['pigeon', 'parrot', 'african_grey', 'budgie', 'canary', 'chicken'],
  },
};

export function checkBirdToxicity(ingredientName: string, bird: BirdType): ToxicFood | null {
  const toxicFoods = BIRD_TOXICITY[bird];
  return toxicFoods.find(f => f.name === ingredientName) || null;
}

export function isIngredientCompatible(ingredientName: string, bird: BirdType): boolean {
  const compatibility = INGREDIENT_COMPATIBILITY[ingredientName];
  if (!compatibility) return true; // If not in compatibility map, assume compatible
  return compatibility.compatibleBirds.includes(bird);
}

export function getIncompatibleBirds(ingredientName: string): BirdType[] {
  const compatibility = INGREDIENT_COMPATIBILITY[ingredientName];
  if (!compatibility) return [];
  return compatibility.incompatibleBirds;
}
