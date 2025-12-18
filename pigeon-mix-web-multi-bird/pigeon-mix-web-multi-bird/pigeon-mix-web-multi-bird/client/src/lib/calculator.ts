import { INGREDIENTS, PROFILES, HERB_RECOMMENDATIONS, HERBS_SUPPLEMENTS } from "./data";

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
  missingIngredients?: Array<{ category: string; reason: string; recommendations: string[] }>;
}

export class PigeonMixCalculator {
  private inventory: Record<string, number>;
  private situation: string;
  private profile: any;

  constructor(inventory: Record<string, number>, situation: string = "maintenance") {
    this.inventory = inventory;
    this.situation = situation;
    this.profile = PROFILES[situation as keyof typeof PROFILES] || PROFILES["maintenance"];
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

  private calculateCategoryRatios(mix: Record<string, number>) {
    const totalWeight = Object.values(mix).reduce((a, b) => a + b, 0);
    if (totalWeight === 0) return { grain: 0, legume: 0, seed: 0 };

    const categories = { grain: 0, legume: 0, seed: 0 };

    for (const [ingredient, amount] of Object.entries(mix)) {
      if (ingredient in INGREDIENTS) {
        const category = INGREDIENTS[ingredient].category;
        categories[category] += amount;
      }
    }

    return {
      grain: (categories.grain / totalWeight) * 100,
      legume: (categories.legume / totalWeight) * 100,
      seed: (categories.seed / totalWeight) * 100,
    };
  }

  private scoreMix(mix: Record<string, number>) {
    const nutrition = this.calculateNutrition(mix);
    const categories = this.calculateCategoryRatios(mix);

    const targetProtein = (this.profile.protein[0] + this.profile.protein[1]) / 2;
    const proteinScore = Math.max(0, 1 - Math.abs(nutrition.protein - targetProtein) / targetProtein);

    const targetCarbs = (this.profile.carbs[0] + this.profile.carbs[1]) / 2;
    const carbsScore = Math.max(0, 1 - Math.abs(nutrition.carbs - targetCarbs) / targetCarbs);

    const targetFat = (this.profile.fat[0] + this.profile.fat[1]) / 2;
    const fatScore = Math.max(0, 1 - Math.abs(nutrition.fat - targetFat) / targetFat);

    const fiberScore = nutrition.fiber < 5 ? 1.0 : Math.max(0, 1 - (nutrition.fiber - 5) / 5);

    let categoryScore = 0;
    for (const [cat, range] of Object.entries(this.profile.category_ratios)) {
      const targetRatio = ((range as number[])[0] + (range as number[])[1]) / 2;
      const actualRatio = categories[cat as keyof typeof categories] || 0;
      categoryScore += Math.max(0, 1 - Math.abs(actualRatio - targetRatio) / targetRatio);
    }
    categoryScore /= 3;

    const diversityScore = Math.min(1.0, Object.keys(mix).length / 5);

    return (
      proteinScore * 0.30 +
      carbsScore * 0.25 +
      fatScore * 0.15 +
      fiberScore * 0.10 +
      categoryScore * 0.15 +
      diversityScore * 0.05
    );
  }

  private detectMissingIngredients(available: Array<any>): Array<{ category: string; reason: string; recommendations: string[] }> {
    const missing: Array<{ category: string; reason: string; recommendations: string[] }> = [];
    const byCategory: Record<string, number> = { grain: 0, legume: 0, seed: 0 };
    const categoryRecommendations: Record<string, string[]> = {
      grain: ["Wheat", "Barley", "Oats", "Corn (yellow)", "Rice"],
      legume: ["Peas", "Lentils", "Mung beans", "Black-eyed peas"],
      seed: ["Safflower", "Sunflower", "Hemp", "Flaxseed", "Peanuts"]
    };

    available.forEach(ing => {
      byCategory[ing.category] += ing.amount;
    });

    // Check for critical missing categories
    if (byCategory.grain === 0) {
      missing.push({
        category: "Grains",
        reason: "No grains available - these are essential for energy and carbohydrates",
        recommendations: categoryRecommendations.grain
      });
    }

    if (byCategory.legume === 0) {
      missing.push({
        category: "Legumes",
        reason: "No legumes available - these are essential for protein and amino acids",
        recommendations: categoryRecommendations.legume
      });
    }

    if (byCategory.seed === 0) {
      missing.push({
        category: "Seeds/Oil Sources",
        reason: "No oil seeds available - important for fat content and feather health",
        recommendations: categoryRecommendations.seed
      });
    }

    return missing;
  }

    public calculate(targetWeight: number = 1000): MixResult {
    // Simple optimization: try to use available ingredients proportionally first
    // In a real web app, we might want to use a more complex solver or WebAssembly
    // but for this demo, a weighted distribution based on category targets is a good start
    
    const available = Object.entries(this.inventory)
      .filter(([_, amount]) => amount > 0)
      .map(([name, amount]) => ({ name, amount, ...INGREDIENTS[name] }));

    const missingIngredients = this.detectMissingIngredients(available);

    if (available.length === 0) {
      return {
        mix: {},
        nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0 },
        categories: { grain: 0, legume: 0, seed: 0 },
        warnings: [],
        suggestions: [],
        herbRecommendations: [],
        herbPurpose: ""
      };
    }

    // Heuristic distribution
    let mix: Record<string, number> = {};
    let remainingWeight = targetWeight;
    
    // Group by category
    const byCategory: Record<string, typeof available> = { grain: [], legume: [], seed: [] };
    available.forEach(ing => {
      if (byCategory[ing.category]) byCategory[ing.category].push(ing);
    });

    // Allocate based on profile targets
    for (const [cat, range] of Object.entries(this.profile.category_ratios)) {
      const targetPct = ((range as number[])[0] + (range as number[])[1]) / 2;
      const targetCatWeight = targetWeight * (targetPct / 100);
      
      const catIngredients = byCategory[cat];
      if (catIngredients && catIngredients.length > 0) {
        const weightPerIng = targetCatWeight / catIngredients.length;
        catIngredients.forEach(ing => {
          // Cap at available amount
          const amount = Math.min(weightPerIng, ing.amount);
          mix[ing.name] = amount;
        });
      }
    }

    // Fill remainder proportionally if needed
    const currentWeight = Object.values(mix).reduce((a, b) => a + b, 0);
    if (currentWeight < targetWeight) {
      const scale = targetWeight / currentWeight;
      // Check limits
      let canScale = true;
      for (const [name, amount] of Object.entries(mix)) {
        if (amount * scale > this.inventory[name]) {
          canScale = false;
          break;
        }
      }
      
      if (canScale) {
        for (const name in mix) {
          mix[name] *= scale;
        }
      }
    }

    const nutrition = this.calculateNutrition(mix);
    const categories = this.calculateCategoryRatios(mix);
    
    // Generate warnings
    const warnings: Array<{ level: "CRITICAL" | "WARNING"; message: string }> = [];
    
    // Add missing ingredient warnings
    if (missingIngredients.length > 0) {
      missingIngredients.forEach(missing => {
        warnings.push({
          level: "CRITICAL",
          message: `Missing ${missing.category}: ${missing.reason}`
        });
      });
    }
    
    if (categories.legume < 5) warnings.push({ level: "CRITICAL", message: "No legumes in mix - essential for protein!" });
    if (categories.grain < 30) warnings.push({ level: "CRITICAL", message: "Insufficient grains - essential for energy!" });
    if (nutrition.protein < 10) warnings.push({ level: "CRITICAL", message: `Protein too low (${nutrition.protein.toFixed(1)}%)` });
    if (nutrition.fiber > 7) warnings.push({ level: "CRITICAL", message: `Fiber too high (${nutrition.fiber.toFixed(1)}%)` });
    
    if (!mix["corn_yellow"] && !mix["maize"]) warnings.push({ level: "WARNING", message: "No yellow corn - risk of Vitamin A deficiency" });
    
    // Generate suggestions
    const suggestions: string[] = [];
    if (categories.legume < 15) suggestions.push("Add more peas or lentils to increase protein");
    if (this.situation === "winter" && nutrition.fat < 5) suggestions.push("Add hemp or sunflower seeds for winter warmth");
    if (!mix["corn_yellow"]) suggestions.push("Add yellow corn for Vitamin A");

    // Herb recommendations
    const herbRecs = HERB_RECOMMENDATIONS[this.situation as keyof typeof HERB_RECOMMENDATIONS];
    const herbList = herbRecs ? herbRecs.recommended.map(name => {
      const h = HERBS_SUPPLEMENTS[name];
      return {
        name: name.replace(/_/g, " "),
        benefits: h.benefits,
        dosage: h.dosage_per_kg,
        frequency: h.frequency,
        notes: h.notes
      };
    }) : [];

    return {
      mix,
      nutrition,
      categories,
      warnings,
      suggestions,
      herbRecommendations: herbList,
      herbPurpose: herbRecs ? herbRecs.notes : "",
      missingIngredients: missingIngredients.length > 0 ? missingIngredients : undefined
    };
  }
}
