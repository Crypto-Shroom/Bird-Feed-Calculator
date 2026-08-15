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
  optimization: OptimizationSummary;
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

export interface OptimizationSummary {
  total: number;
  macroDistance: number;
  categoryDistance: number;
  diversityPenalty: number;
  targetMisses: number;
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
    const optimization = this.objectiveScore(mix, profile.nutrition);
    const suggestions = this.buildSuggestions(mix, nutrition, categories, profile.nutrition);

    return {
      mix,
      nutrition,
      categories,
      warnings,
      suggestions,
      herbRecommendations: [],
      herbPurpose: "Therapeutic herb dosages are intentionally not provided. Discuss supplements with an exotics vet.",
      missingIngredients: missingIngredients.length ? missingIngredients : undefined,
      targetWeight: actualTarget,
      optimization,
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
      herbPurpose: "Therapeutic herb dosages are intentionally not provided. Discuss supplements with an exotics vet.",
      missingIngredients,
      targetWeight,
      optimization: { total: 0, macroDistance: 0, categoryDistance: 0, diversityPenalty: 0, targetMisses: 0 },
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

      const compatible = isIngredientCompatible(name, this.bird);
      if (!compatible || toxicity || rawToxicity || requiresProcessing) {
        const birdGuidance = getPreparationInstructions(name)?.birdGuidance?.[this.bird];
        const reason = toxicity?.description || rawToxicity?.message || getProcessingWarning(name) || birdGuidance || "it is not compatible with the selected bird";
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
    const sortedIngredients = [...ingredients].sort((left, right) => left.name.localeCompare(right.name));
    const plans = this.createFeasibleCategoryPlans(sortedIngredients, targetWeight);
    const candidates = plans.map((plan) => this.buildCandidate(sortedIngredients, targetWeight, target, plan));

    return candidates
      .sort((left, right) => this.compareCandidates(left, right, target))[0] || {};
  }

  private createFeasibleCategoryPlans(ingredients: AvailableIngredient[], targetWeight: number): CategorySummary[] {
    const targets = getCategoryTargets(this.bird);
    const capacity = categoryKeys.reduce((summary, category) => {
      summary[category] = ingredients
        .filter((ingredient) => ingredient.category === category)
        .reduce((total, ingredient) => total + ingredient.amount, 0) / targetWeight * 100;
      return summary;
    }, { grain: 0, legume: 0, seed: 0 } as CategorySummary);

    const priorities: Array<keyof CategorySummary | null> = [null, "grain", "legume", "seed"];
    return priorities.map((priority) => {
      const plan = { grain: 0, legume: 0, seed: 0 } as CategorySummary;

      categoryKeys.forEach((category) => {
        if (capacity[category] > 0) {
          plan[category] = Math.min(targets[category][0], capacity[category]);
        }
      });

      let remaining = 100 - Object.values(plan).reduce((total, value) => total + value, 0);
      while (remaining > 0.001) {
        const viable = categoryKeys.filter((category) => capacity[category] - plan[category] > 0.001);
        if (!viable.length) break;

        const selected = [...viable].sort((left, right) => {
          const leftScore = this.categoryAllocationScore(left, plan[left], targets[left], priority);
          const rightScore = this.categoryAllocationScore(right, plan[right], targets[right], priority);
          return rightScore - leftScore || left.localeCompare(right);
        })[0];
        const increment = Math.min(1, remaining, capacity[selected] - plan[selected]);
        plan[selected] += increment;
        remaining -= increment;
      }

      return plan;
    });
  }

  private categoryAllocationScore(
    category: keyof CategorySummary,
    current: number,
    target: [number, number],
    priority: keyof CategorySummary | null,
  ): number {
    const [min, max] = target;
    const midpoint = (min + max) / 2;
    const range = Math.max(1, max - min);
    const midpointNeed = (midpoint - current) / range;
    const withinMaximum = current < max ? 1 : 0;
    const priorityBonus = priority === category ? 0.45 : 0;
    return midpointNeed + withinMaximum + priorityBonus;
  }

  private buildCandidate(
    ingredients: AvailableIngredient[],
    targetWeight: number,
    target: NutritionTarget,
    plan: CategorySummary,
  ): Record<string, number> {
    const remaining = new Map(ingredients.map((ingredient) => [ingredient.name, ingredient.amount]));
    const mix: Record<string, number> = {};

    categoryKeys.forEach((category) => {
      const requestedWeight = targetWeight * (plan[category] / 100);
      this.fillMix(mix, remaining, ingredients.filter((ingredient) => ingredient.category === category), requestedWeight, target, plan, targetWeight);
    });

    const unfilledWeight = targetWeight - Object.values(mix).reduce((total, amount) => total + amount, 0);
    if (unfilledWeight > 0.001) {
      this.fillMix(mix, remaining, ingredients, unfilledWeight, target, plan, targetWeight);
    }

    return mix;
  }

  private fillMix(
    mix: Record<string, number>,
    remaining: Map<string, number>,
    choices: AvailableIngredient[],
    requestedWeight: number,
    target: NutritionTarget,
    categoryPlan: CategorySummary,
    targetWeight: number,
  ) {
    const step = targetWeight <= 500 ? 5 : 10;
    let added = 0;

    while (added < requestedWeight - 0.001) {
      const amountToAdd = Math.min(step, requestedWeight - added);
      const winner = choices
        .filter((ingredient) => (remaining.get(ingredient.name) || 0) > 0)
        .map((ingredient) => {
          const addAmount = Math.min(amountToAdd, remaining.get(ingredient.name) || 0);
          const candidate = { ...mix, [ingredient.name]: (mix[ingredient.name] || 0) + addAmount };
          return { ingredient, addAmount, score: this.selectionScore(candidate, target, categoryPlan) };
        })
        .sort((left, right) => left.score - right.score || left.ingredient.name.localeCompare(right.ingredient.name))[0];

      if (!winner) break;
      mix[winner.ingredient.name] = (mix[winner.ingredient.name] || 0) + winner.addAmount;
      remaining.set(winner.ingredient.name, (remaining.get(winner.ingredient.name) || 0) - winner.addAmount);
      added += winner.addAmount;
    }
  }

  private selectionScore(mix: Record<string, number>, target: NutritionTarget, categoryPlan: CategorySummary): number {
    const objective = this.objectiveScore(mix, target);
    const categories = this.calculateCategoryRatios(mix);
    const planDistance = categoryKeys.reduce((total, category) => total + Math.abs(categories[category] - categoryPlan[category]) / 100, 0);
    return objective.macroDistance * 0.7 + planDistance * 0.25 + objective.diversityPenalty * 0.05;
  }

  private compareCandidates(left: Record<string, number>, right: Record<string, number>, target: NutritionTarget): number {
    const leftScore = this.objectiveScore(left, target);
    const rightScore = this.objectiveScore(right, target);
    const scoreDifference = leftScore.total - rightScore.total;
    if (Math.abs(scoreDifference) > 1e-9) return scoreDifference;

    const macroDifference = leftScore.macroDistance - rightScore.macroDistance;
    if (Math.abs(macroDifference) > 1e-9) return macroDifference;

    const categoryDifference = leftScore.categoryDistance - rightScore.categoryDistance;
    if (Math.abs(categoryDifference) > 1e-9) return categoryDifference;

    return this.mixSignature(left).localeCompare(this.mixSignature(right));
  }

  private objectiveScore(mix: Record<string, number>, target: NutritionTarget): OptimizationSummary {
    const nutrition = this.calculateNutrition(mix);
    const categories = this.calculateCategoryRatios(mix);
    const categoryTargets = getCategoryTargets(this.bird);

    const macroDistance = nutritionKeys.reduce((total, key) => {
      const [min, max] = target[key];
      const midpoint = (min + max) / 2;
      const width = Math.max(0.5, max - min);
      return total + Math.abs(nutrition[key] - midpoint) / width;
    }, 0);

    const categoryDistance = categoryKeys.reduce((total, key) => {
      const [min, max] = categoryTargets[key];
      const midpoint = (min + max) / 2;
      const width = Math.max(1, max - min);
      return total + Math.abs(categories[key] - midpoint) / width;
    }, 0);

    const targetMisses = nutritionKeys.filter((key) => nutrition[key] < target[key][0] || nutrition[key] > target[key][1]).length
      + categoryKeys.filter((key) => categories[key] < categoryTargets[key][0] || categories[key] > categoryTargets[key][1]).length;
    const diversityPenalty = 1 - Math.min(1, Object.keys(mix).length / Math.min(5, Math.max(1, Object.keys(this.inventory).length)));

    return {
      macroDistance,
      categoryDistance,
      targetMisses,
      diversityPenalty,
      total: macroDistance * 0.55 + categoryDistance * 0.25 + diversityPenalty * 0.1 + targetMisses * 0.1,
    };
  }

  private mixSignature(mix: Record<string, number>): string {
    return Object.entries(mix)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([name, amount]) => `${name}:${amount.toFixed(3)}`)
      .join("|");
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

  // Preserved audit analysis helper. It is intentionally not invoked by the restored
  // pre-audit interface: nutrition cards show ranges and the red missing-category
  // panel shows actionable shortages without creating new target-deviation advisories.
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
      suggestions.push("Reduce oil seeds or high-fat ingredients if your exotics vet agrees that the fat estimate is too high.");
    }

    return suggestions;
  }

  getPreparationInstructions(ingredientName: string): string | undefined {
    return getPreparationInstructions(ingredientName)?.preparation;
  }
}
