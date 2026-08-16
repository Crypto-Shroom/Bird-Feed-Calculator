// Multi-bird seed mix calculator supporting all bird types

import { INGREDIENTS, HERB_RECOMMENDATIONS } from "./data";
import { BirdType, ALL_PROFILES, getProfilesForBird } from "./birds";
import { BIRD_TOXIC_FOODS, isIngredientCompatible } from "./bird-safety";

export interface MixResult {
  mix: Record<string, number>;
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  categories: {
    grain: number;
    legume: number;
    seed: number;
  };
  warnings: Array<{ level: "CRITICAL" | "WARNING"; message: string }>;
  suggestions: string[];
  herbRecommendations: Array<{
    name: string;
    benefits: string[];
    dosage: string;
    frequency: string;
    notes: string;
  }>;
  herbPurpose: string;
  missingIngredients?: Array<{
    category: string;
    reason: string;
    recommendations: string[];
  }>;
}

export class MultibirMixCalculator {
  private inventory: Record<string, number>;
  private situation: string;
  private bird: BirdType;
  private profile: any;

  constructor(
    inventory: Record<string, number>,
    situation: string = "maintenance",
    bird: BirdType = "pigeon",
  ) {
    this.inventory = inventory;
    this.situation = situation;
    this.bird = bird;

    const birdProfiles = getProfilesForBird(bird);
    this.profile = birdProfiles[situation] || Object.values(birdProfiles)[0];
  }

  private calculateNutrition(mix: Record<string, number>) {
    const totalWeight = Object.values(mix).reduce((a, b) => a + b, 0);
    if (totalWeight === 0) return { protein: 0, carbs: 0, fat: 0, fiber: 0 };

    const nutrition = { protein: 0, carbs: 0, fat: 0, fiber: 0 };

    for (const [ingredient, amount] of Object.entries(mix)) {
      if (ingredient in INGREDIENTS) {
        const weightRatio = amount / totalWeight;
        nutrition.protein += INGREDIENTS[ingredient].protein * weightRatio;
        nutrition.carbs += INGREDIENTS[ingredient].carbs * weightRatio;
        nutrition.fat += INGREDIENTS[ingredient].fat * weightRatio;
        nutrition.fiber += INGREDIENTS[ingredient].fiber * weightRatio;
      }
    }

    return nutrition;
  }

  private calculateCategories(mix: Record<string, number>) {
    const totalWeight = Object.values(mix).reduce((a, b) => a + b, 0);
    if (totalWeight === 0) return { grain: 0, legume: 0, seed: 0 };

    const categories = { grain: 0, legume: 0, seed: 0 };

    for (const [ingredient, amount] of Object.entries(mix)) {
      if (ingredient in INGREDIENTS) {
        const weightRatio = amount / totalWeight;
        const ing = INGREDIENTS[ingredient];
        if (ing.category === "grain") categories.grain += weightRatio;
        else if (ing.category === "legume") categories.legume += weightRatio;
        else if (ing.category === "seed") categories.seed += weightRatio;
      }
    }

    return categories;
  }

  private checkGrainCompatibility(mix: Record<string, number>): string[] {
    const grains = Object.entries(mix)
      .filter(([ing]) => INGREDIENTS[ing]?.category === "grain")
      .map(([ing]) => ing);

    const suggestions: string[] = [];

    // Check if only corn is present
    if (grains.length === 1 && grains[0].includes("corn")) {
      suggestions.push(
        "Corn is the only grain in your mix. Consider adding wheat, barley, or oats for better nutritional balance and essential nutrients.",
      );
    }

    return suggestions;
  }

  private checkMissingCategories(mix: Record<string, number>) {
    const hasGrain = Object.keys(mix).some(
      (ing) => INGREDIENTS[ing]?.category === "grain",
    );
    const hasLegume = Object.keys(mix).some(
      (ing) => INGREDIENTS[ing]?.category === "legume",
    );
    const hasSeed = Object.keys(mix).some(
      (ing) => INGREDIENTS[ing]?.category === "seed",
    );

    const missing: Array<{
      category: string;
      reason: string;
      recommendations: string[];
    }> = [];

    if (!hasGrain) {
      missing.push({
        category: "Grains",
        reason: "Grains provide essential carbohydrates and energy",
        recommendations: [
          "wheat",
          "barley",
          "oats",
          "corn_yellow",
          "corn_red",
        ] as string[],
      });
    }

    if (!hasLegume) {
      missing.push({
        category: "Legumes",
        reason: "Legumes provide protein and essential amino acids",
        recommendations: [
          "peas_green",
          "lentils",
          "mung_beans",
          "chickpeas",
        ] as string[],
      });
    }

    if (!hasSeed) {
      missing.push({
        category: "Seeds",
        reason: "Seeds provide healthy fats and micronutrients",
        recommendations: [
          "sunflower_seeds",
          "safflower_seeds",
          "hemp_seeds",
        ] as string[],
      });
    }

    return missing;
  }

  private checkBirdCompatibility(
    mix: Record<string, number>,
  ): Array<{ level: "CRITICAL" | "WARNING"; message: string }> {
    const warnings: Array<{ level: "CRITICAL" | "WARNING"; message: string }> =
      [];
    const toxics = BIRD_TOXIC_FOODS[this.bird];

    for (const ingredient of Object.keys(mix)) {
      // Check if ingredient is toxic for this bird
      if (toxics && toxics[ingredient]) {
        const toxic = toxics[ingredient];
        warnings.push({
          level: "WARNING",
          message: `${toxic.name} contains ${toxic.toxin}. ${toxic.message}`,
        });
      }

      // Check if ingredient is incompatible with this bird
      if (!isIngredientCompatible(ingredient, this.bird)) {
        warnings.push({
          level: "WARNING" as const,
          message: `${ingredient.replace(/_/g, " ")} is not recommended for ${this.bird}. Consider using compatible alternatives.`,
        });
      }
    }

    return warnings;
  }

  private getHerbRecommendations() {
    // Return empty array for now - herb recommendations will be populated from data.ts
    return [];
  }

  calculate(targetWeight: number = 1000): MixResult {
    if (Object.keys(this.inventory).length === 0) {
      return {
        mix: {},
        nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0 },
        categories: { grain: 0, legume: 0, seed: 0 },
        warnings: [
          {
            level: "WARNING",
            message: "Add ingredients to your inventory to calculate a mix",
          },
        ],
        suggestions: [],
        herbRecommendations: [],
        herbPurpose: "",
      };
    }

    // Calculate optimal mix
    const mix = this.optimizeMix(targetWeight);
    const nutrition = this.calculateNutrition(mix);
    const categories = this.calculateCategories(mix);
    const warnings = this.checkBirdCompatibility(mix);
    const suggestions = this.checkGrainCompatibility(mix);
    const missingIngredients = this.checkMissingCategories(this.inventory);
    const herbRecommendations = this.getHerbRecommendations();

    // Add warnings for missing categories
    if (missingIngredients.length > 0) {
      for (const missing of missingIngredients) {
        warnings.push({
          level: "WARNING",
          message: `Missing ${missing.category.toLowerCase()}: ${missing.reason}. Consider adding: ${missing.recommendations.join(", ")}`,
        });
      }
    }

    // Check nutrition targets
    const [proteinMin, proteinMax] = this.profile.protein;
    const [carbsMin, carbsMax] = this.profile.carbs;
    const [fatMin, fatMax] = this.profile.fat;
    const [fiberMin, fiberMax] = this.profile.fiber;

    if (nutrition.protein < proteinMin) {
      suggestions.push(
        `Protein is below target (${nutrition.protein.toFixed(1)}% vs ${proteinMin}% minimum). Add more legumes.`,
      );
    }
    if (nutrition.carbs < carbsMin) {
      suggestions.push(`Carbs are below target. Add more grains.`);
    }
    if (nutrition.fat > fatMax) {
      suggestions.push(
        `Fat is above target (${nutrition.fat.toFixed(1)}% vs ${fatMax}% maximum). Reduce oil seeds.`,
      );
    }

    return {
      mix,
      nutrition,
      categories,
      warnings,
      suggestions,
      herbRecommendations,
      herbPurpose: `Supplements for ${this.profile.name}`,
      missingIngredients:
        missingIngredients.length > 0 ? missingIngredients : undefined,
    };
  }

  private optimizeMix(targetWeight: number = 1000): Record<string, number> {
    const mix: Record<string, number> = {};
    const totalInventory = Object.values(this.inventory).reduce(
      (a, b) => a + b,
      0,
    );

    if (totalInventory === 0) return mix;

    // Score each ingredient based on profile targets
    const scores: Record<string, number> = {};

    for (const [ingredient, available] of Object.entries(this.inventory)) {
      if (!(ingredient in INGREDIENTS)) continue;

      // Skip if not compatible with this bird
      if (!isIngredientCompatible(ingredient, this.bird)) {
        scores[ingredient] = 0;
        continue;
      }

      const ing = INGREDIENTS[ingredient];
      let score = 1;

      // Prefer ingredients that match category ratios
      const [grainMin, grainMax] = this.profile.category_ratios.grain;
      const [legumeMin, legumeMax] = this.profile.category_ratios.legume;
      const [seedMin, seedMax] = this.profile.category_ratios.seed;

      if (ing.category === "grain") score *= 1.2;
      if (ing.category === "legume") score *= 1.1;
      if (ing.category === "seed") score *= 1.0;

      // Prefer ingredients closer to protein target
      const [proteinMin, proteinMax] = this.profile.protein;
      const proteinTarget = (proteinMin + proteinMax) / 2;
      score *= 1 + (1 - Math.abs(ing.protein - proteinTarget) / 20);

      // Penalize toxic or incompatible ingredients
      if (BIRD_TOXIC_FOODS[this.bird]?.[ingredient]) score *= 0;
      if (!isIngredientCompatible(ingredient, this.bird)) score *= 0;

      scores[ingredient] = score * available;
    }

    // Distribute mix based on scores
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    if (totalScore === 0) {
      // If no compatible ingredients, return empty
      return mix;
    }

    for (const [ingredient, score] of Object.entries(scores)) {
      if (score > 0) {
        mix[ingredient] = Math.round((score / totalScore) * totalInventory);
      }
    }

    return mix;
  }
}
