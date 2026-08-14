// Design contract: nutrition is presented as a transparent seed/grain mix estimate, never as a complete veterinary diet.
import { INGREDIENTS, type Ingredient } from "./data";
import {
  BIRD_PROFILES,
  getCategoryTargets,
  type BirdType,
  type NutritionTarget,
} from "./birds";
import { checkBirdToxicity, isIngredientCompatible } from "./bird-safety";
import { getPreparationInstructions, getProcessingWarning, grainNeedsPairing, isToxicRaw, requiresVerifiedProcessing } from "./safety";

export interface MixWarning {
  level: "CRITICAL" | "WARNING";
  message: string;
}

export interface MissingIngredient {
  category: string;
  reason: string;
  recommendations: string[];
}

export interface HerbRecommendation {
  name: string;
  benefits: string[];
  dosage: string;
  frequency: string;
  notes: string;
}

export interface MixResult {
  mix: Record<string, number>;
  nutrition: NutritionSummary;
  categories: CategorySummary;
  warnings: MixWarning[];
  suggestions: string[];
  herbRecommendations: HerbRecommendation[];
  herbPurpose: string;
  missingIngredients?: MissingIngredient[];
  targetWeight: number;
}

export interface NutritionSummary {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface CategorySummary {
  grain: number;
  legume: number;
  seed: number;
}

interface AvailableIngredient extends Ingredient {
  name: string;
  amount: number;
}

const CATEGORY_RECOMMENDATIONS: Record<Ingredient["category"], string[]> = {
  grain: ["wheat", "barley", "oats"],
  legume: ["peas", "lentils", "mung beans"],
  seed: ["safflower", "sunflower", "flaxseed"],
};

const nutritionKeys: Array<keyof NutritionSummary> = ["protein", "carbs", "fat", "fiber"];
const categoryKeys: Array<keyof CategorySummary> = ["grain", "legume", "seed"];

export class MultibirMixCalculator {
  constructor(
    private readonly inventory: Record<string, number>,
    private readonly bird: BirdType,
    private readonly situation: string,
  ) {}

  calculate(targetWeight: number): MixResult {
    const profile = BIRD_PROFILES[this.bird].profiles[this.situation];
    if (!profile) {
      return this.emptyResult(targetWeight, [{ level: "CRITICAL", message: "The selected bird situation is not available." }]);
    }

    const warnings: MixWarning[] = [];
    const eligible = this.getEligibleIngredients(warnings);
    const missingIngredients = this.detectMissingCategories(eligible);

    missingIngredients.forEach((missing) => {
      warnings.push({ level: "WARNING", message: `${missing.category}: ${missing.reason}` });
    });

    if (eligible.length === 0) {
      return this.emptyResult(targetWeight, warnings.length ? warnings : [{ level: "CRITICAL", message: "Add at least one compatible, safely prepared ingredient." }], missingIngredients);
    }

    const availableWeight = eligible.reduce((total, ingredient) => total + ingredient.amount, 0);
    const actualTarget = Math.min(Math.max(0, targetWeight), availableWeight);
    if (actualTarget < targetWeight) {
      warnings.push({ level: "WARNING", message: `Only ${Math.round(availableWeight)}g of eligible inventory is available, so the recipe is scaled to that amount.` });
    }

    const mix = this.optimizeMix(eligible, actualTarget, profile.nutrition);
    const nutrition = this.calculateNutrition(mix);
    const categories = this.calculateCategoryRatios(mix);
    const suggestions = this.buildSuggestions(mix, nutrition, categories, profile.nutrition);

    this.addTargetWarnings(nutrition, categories, profile.nutrition, warnings);

    return {
      mix,
      nutrition,
      categories,
      warnings,
      suggestions,
      herbRecommendations: [],
      herbPurpose: "Therapeutic herb dosages are intentionally not provided. Discuss supplements with an avian veterinarian.",
      missingIngredients: missingIngredients.length ? missingIngredients : undefined,
      targetWeight: actualTarget,
    };
  }

  private emptyResult(targetWeight: number, warnings: MixWarning[], missingIngredients?: MissingIngredient[]): MixResult {
    return {
      mix: {},
      nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0 },
      categories: { grain: 0, legume: 0, seed: 0 },
      warnings,
      suggestions: [],
      herbRecommendations: [],
      herbPurpose: "Therapeutic herb dosages are intentionally not provided. Discuss supplements with an avian veterinarian.",
      missingIngredients,
      targetWeight,
    };
  }

  private getEligibleIngredients(warnings: MixWarning[]): AvailableIngredient[] {
    const eligible: AvailableIngredient[] = [];

    Object.entries(this.inventory).forEach(([name, amount]) => {
      const ingredient = INGREDIENTS[name];
      if (!ingredient || !Number.isFinite(amount) || amount <= 0) return;

      const toxicity = checkBirdToxicity(name, this.bird);
      const rawToxicity = isToxicRaw(name);
      const requiresProcessing = requiresVerifiedProcessing(name);

      if (!isIngredientCompatible(name, this.bird) || toxicity || rawToxicity || requiresProcessing) {
        const reason = toxicity?.description || rawToxicity?.message || getProcessingWarning(name) || "it is not compatible with the selected bird";
        warnings.push({ level: "CRITICAL", message: `${name.replace(/_/g, " ")} was excluded: ${reason}.` });
        return;
      }

      eligible.push({ name, amount, ...ingredient });
    });

    return eligible;
  }

  private detectMissingCategories(ingredients: AvailableIngredient[]): MissingIngredient[] {
    const present = new Set(ingredients.map((ingredient) => ingredient.category));
    return categoryKeys
      .filter((category) => !present.has(category))
      .map((category) => ({
        category: category === "seed" ? "Oil seeds" : `${category[0].toUpperCase()}${category.slice(1)}s`,
        reason: category === "grain"
          ? "No eligible grains are available — grains are essential for energy and carbohydrates."
          : category === "legume"
            ? "No eligible legumes are available — legumes are essential for protein and amino acids."
            : "No eligible oil seeds are available — oil seeds contribute fat and ingredient diversity.",
        recommendations: CATEGORY_RECOMMENDATIONS[category],
      }));
  }

  private optimizeMix(
    ingredients: AvailableIngredient[],
    targetWeight: number,
    target: NutritionTarget,
  ): Record<string, number> {
    const remaining = new Map(ingredients.map((ingredient) => [ingredient.name, ingredient.amount]));
    const mix: Record<string, number> = {};
    const step = targetWeight <= 500 ? 5 : 10;
    let mixedWeight = 0;

    while (mixedWeight < targetWeight - 0.001) {
      const amountToAdd = Math.min(step, targetWeight - mixedWeight);
      let winner: AvailableIngredient | null = null;
      let bestScore = Number.NEGATIVE_INFINITY;

      ingredients.forEach((ingredient) => {
        const remainingAmount = remaining.get(ingredient.name) || 0;
        if (remainingAmount <= 0) return;
        const addAmount = Math.min(amountToAdd, remainingAmount);
        const candidate = { ...mix, [ingredient.name]: (mix[ingredient.name] || 0) + addAmount };
        const score = this.scoreMix(candidate, target);

        if (score > bestScore || (score === bestScore && winner && ingredient.name.localeCompare(winner.name) < 0)) {
          bestScore = score;
          winner = ingredient;
        }
      });

      const selected = winner as AvailableIngredient | null;
      if (!selected) break;

      const addAmount = Math.min(amountToAdd, remaining.get(selected.name) || 0);
      mix[selected.name] = (mix[selected.name] || 0) + addAmount;
      remaining.set(selected.name, (remaining.get(selected.name) || 0) - addAmount);
      mixedWeight += addAmount;
    }

    return mix;
  }

  private scoreMix(mix: Record<string, number>, target: NutritionTarget): number {
    const nutrition = this.calculateNutrition(mix);
    const categories = this.calculateCategoryRatios(mix);
    const categoryTargets = getCategoryTargets(this.bird);
    const totalWeight = Object.values(mix).reduce((total, amount) => total + amount, 0);

    const nutritionPenalty = nutritionKeys.reduce((total, key) => {
      const [min, max] = target[key];
      const midpoint = (min + max) / 2;
      const width = Math.max(0.5, max - min);
      return total + Math.abs(nutrition[key] - midpoint) / width;
    }, 0);

    const categoryPenalty = categoryKeys.reduce((total, key) => {
      const [min, max] = categoryTargets[key];
      const midpoint = (min + max) / 2;
      const deficit = totalWeight > 20 && categories[key] < min ? (min - categories[key]) * 0.18 : 0;
      return total + Math.abs(categories[key] - midpoint) * 0.03 + deficit;
    }, 0);

    const varietyBonus = Math.min(0.25, Object.keys(mix).length * 0.04);
    return varietyBonus - nutritionPenalty - categoryPenalty;
  }

  private calculateNutrition(mix: Record<string, number>): NutritionSummary {
    const totalWeight = Object.values(mix).reduce((total, amount) => total + amount, 0);
    if (!totalWeight) return { protein: 0, carbs: 0, fat: 0, fiber: 0 };

    return nutritionKeys.reduce((nutrition, key) => {
      nutrition[key] = Object.entries(mix).reduce((total, [name, amount]) => total + (INGREDIENTS[name]?.[key] || 0) * amount, 0) / totalWeight;
      return nutrition;
    }, { protein: 0, carbs: 0, fat: 0, fiber: 0 } as NutritionSummary);
  }

  private calculateCategoryRatios(mix: Record<string, number>): CategorySummary {
    const totalWeight = Object.values(mix).reduce((total, amount) => total + amount, 0);
    if (!totalWeight) return { grain: 0, legume: 0, seed: 0 };

    return Object.entries(mix).reduce((categories, [name, amount]) => {
      const category = INGREDIENTS[name]?.category;
      if (category) categories[category] += (amount / totalWeight) * 100;
      return categories;
    }, { grain: 0, legume: 0, seed: 0 } as CategorySummary);
  }

  private addTargetWarnings(
    nutrition: NutritionSummary,
    categories: CategorySummary,
    target: NutritionTarget,
    warnings: MixWarning[],
  ) {
    nutritionKeys.forEach((key) => {
      const [min, max] = target[key];
      if (nutrition[key] < min || nutrition[key] > max) {
        warnings.push({
          level: "WARNING",
          message: `${key[0].toUpperCase()}${key.slice(1)} is ${nutrition[key].toFixed(1)}% (estimate target: ${min}-${max}%).`,
        });
      }
    });

    const categoryTargets = getCategoryTargets(this.bird);
    categoryKeys.forEach((key) => {
      const [min, max] = categoryTargets[key];
      if (categories[key] < min || categories[key] > max) {
        warnings.push({
          level: "WARNING",
          message: `${key[0].toUpperCase()}${key.slice(1)} ratio is ${categories[key].toFixed(1)}% (estimate range: ${min}-${max}%).`,
        });
      }
    });
  }

  private buildSuggestions(
    mix: Record<string, number>,
    nutrition: NutritionSummary,
    categories: CategorySummary,
    target: NutritionTarget,
  ): string[] {
    const suggestions = ["Use this as a mix estimate only. A complete diet also requires micronutrient, amino-acid, and energy validation."];
    const grains = Object.keys(mix).filter((name) => INGREDIENTS[name]?.category === "grain");

    if (grains.length === 1 && grainNeedsPairing(grains[0])) {
      suggestions.push(`Pair ${grains[0].replace(/_/g, " ")} with another grain such as wheat, barley, or oats for greater ingredient diversity.`);
    }
    if (nutrition.protein < target.protein[0] && categories.legume < getCategoryTargets(this.bird).legume[1]) {
      suggestions.push("Consider a compatible, safely prepared protein ingredient only after confirming its processing and suitability for your bird.");
    }
    if (nutrition.fat > target.fat[1]) {
      suggestions.push("Reduce oil seeds or high-fat ingredients if your avian or poultry professional agrees that the fat estimate is too high.");
    }

    return suggestions;
  }

  getPreparationInstructions(ingredientName: string): string | undefined {
    return getPreparationInstructions(ingredientName)?.preparation;
  }
}
