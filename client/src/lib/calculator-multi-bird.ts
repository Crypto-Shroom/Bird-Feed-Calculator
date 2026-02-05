// Multi-bird calculator with bird-specific logic
import type { BirdType } from './birds';
import { BIRD_PROFILES, getSituationProfile } from './birds';
import { checkBirdToxicity, isIngredientCompatible } from './bird-safety';
import { INGREDIENTS } from './data';

export interface InventoryItem {
  name: string;
  amount: number;
  category: string;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface MixItem {
  name: string;
  amount: number;
  percentage: number;
  category: string;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  preparation?: string;
}

export interface NutritionAnalysis {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface OptimizedMix {
  items: MixItem[];
  totalWeight: number;
  nutrition: NutritionAnalysis;
  warnings: string[];
  missingIngredients: string[];
}

export interface ToxicInfo {
  isToxic: boolean;
  toxin?: string;
  severity?: string;
  message?: string;
}

export class MultibirMixCalculator {
  private bird: BirdType;
  private situation: string;

  constructor(bird: BirdType, situation: string) {
    this.bird = bird;
    this.situation = situation;
  }

  setBird(bird: BirdType) {
    this.bird = bird;
  }

  setSituation(situation: string) {
    this.situation = situation;
  }

  calculateMix(inventory: InventoryItem[], targetWeight: number): OptimizedMix {
    const profile = getSituationProfile(this.bird, this.situation);
    if (!profile) {
      return {
        items: [],
        totalWeight: 0,
        nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0 },
        warnings: ['Invalid situation profile'],
        missingIngredients: [],
      };
    }

    const warnings: string[] = [];
    const missingIngredients: string[] = [];

    // Check for missing ingredient categories
    const hasGrains = inventory.some(i => i.category === 'grain');
    const hasLegumes = inventory.some(i => i.category === 'legume');
    const hasSeeds = inventory.some(i => i.category === 'seed');

    if (!hasGrains) {
      missingIngredients.push('grains');
      warnings.push(`Missing grains - essential for ${this.bird} nutrition`);
    }
    if (!hasLegumes) {
      missingIngredients.push('legumes');
      warnings.push(`Missing legumes - essential for ${this.bird} nutrition`);
    }
    if (!hasSeeds) {
      missingIngredients.push('seeds');
      warnings.push(`Missing seeds - essential for ${this.bird} nutrition`);
    }

    // Check for corn-only grain
    const grainTypes = inventory.filter(i => i.category === 'grain').map(i => i.name);
    if (grainTypes.length === 1 && grainTypes[0] === 'corn_yellow') {
      warnings.push(`Corn alone doesn't provide complete nutrition for ${this.bird}s - pair with wheat, barley, or oats`);
    }

    // Optimize mix using weighted scoring
    const optimized = this.optimizeMix(inventory, profile.nutrition, targetWeight);

    return {
      items: optimized,
      totalWeight: optimized.reduce((sum, item) => sum + item.amount, 0),
      nutrition: this.calculateNutrition(optimized),
      warnings,
      missingIngredients,
    };
  }

  private optimizeMix(
    inventory: InventoryItem[],
    targetNutrition: any,
    targetWeight: number
  ): MixItem[] {
    const currentNutrition = this.calculateNutrition(inventory);
    const mix: MixItem[] = [];
    let totalWeight = 0;

    // Score each ingredient based on how well it fills nutritional gaps
    const scores = inventory.map(item => {
      const proteinGap = Math.max(0, targetNutrition.protein[1] - currentNutrition.protein);
      const carbsGap = Math.max(0, targetNutrition.carbs[1] - currentNutrition.carbs);
      const fatGap = Math.max(0, targetNutrition.fat[1] - currentNutrition.fat);

      const score =
        (item.protein * proteinGap * 0.4) +
        (item.carbs * carbsGap * 0.3) +
        (item.fat * fatGap * 0.2) +
        (Math.random() * 0.1); // Diversity factor

      return { item, score };
    });

    // Sort by score and select items until target weight reached
    scores
      .sort((a, b) => b.score - a.score)
      .forEach(({ item }) => {
        if (totalWeight < targetWeight) {
          const amountToAdd = Math.min(item.amount, targetWeight - totalWeight);
          mix.push({
            name: item.name,
            amount: amountToAdd,
            percentage: (amountToAdd / targetWeight) * 100,
            category: item.category,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
            fiber: item.fiber,
            preparation: this.getPreparationInstructions(item.name),
          });
          totalWeight += amountToAdd;
        }
      });

    return mix;
  }

  private calculateNutrition(items: InventoryItem[] | MixItem[]): NutritionAnalysis {
    const totalWeight = items.reduce((sum, item) => sum + item.amount, 0);

    if (totalWeight === 0) {
      return { protein: 0, carbs: 0, fat: 0, fiber: 0 };
    }

    const nutrition = items.reduce(
      (acc, item) => ({
        protein: acc.protein + (item.protein * item.amount) / 100,
        carbs: acc.carbs + (item.carbs * item.amount) / 100,
        fat: acc.fat + (item.fat * item.amount) / 100,
        fiber: acc.fiber + (item.fiber * item.amount) / 100,
      }),
      { protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );

    return {
      protein: (nutrition.protein / totalWeight) * 100,
      carbs: (nutrition.carbs / totalWeight) * 100,
      fat: (nutrition.fat / totalWeight) * 100,
      fiber: (nutrition.fiber / totalWeight) * 100,
    };
  }

  checkToxicity(ingredientName: string): ToxicInfo {
    const toxic = checkBirdToxicity(ingredientName, this.bird);
    if (toxic) {
      return {
        isToxic: true,
        toxin: toxic.toxin,
        severity: toxic.severity,
        message: `WARNING: Contains ${toxic.toxin} is toxic to ${this.bird}s. Severity: ${toxic.severity}. ${toxic.description}`,
      };
    }
    return { isToxic: false };
  }

  checkCompatibility(ingredientName: string): boolean {
    return isIngredientCompatible(ingredientName, this.bird);
  }

  getPreparationInstructions(ingredientName: string): string | undefined {
    const ingredient = INGREDIENTS[ingredientName as keyof typeof INGREDIENTS];
    if (ingredient && 'preparation' in ingredient) {
      return (ingredient as any).preparation;
    }
    return undefined;
  }

  getHerbRecommendations(): any[] {
    // This would be populated from HERB_RECOMMENDATIONS in data.ts
    // filtered by bird and situation
    return [];
  }
}

export function createCalculator(bird: BirdType, situation: string): MultibirMixCalculator {
  return new MultibirMixCalculator(bird, situation);
}
