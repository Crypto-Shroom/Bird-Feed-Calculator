import { BIRD_PROFILES, getCategoryTargets, type BirdType, type NutritionTarget } from "./birds";
import type { MixResult, NutritionSummary, CategorySummary } from "./calculator-multi-bird";
import { INGREDIENTS } from "./data";

const nutritionKeys: Array<keyof NutritionSummary> = ["protein", "carbs", "fat", "fiber"];
const categoryKeys: Array<keyof CategorySummary> = ["grain", "legume", "seed"];

function calculateNutrition(mix: Readonly<Record<string, number>>): NutritionSummary {
  const totalWeight = Object.values(mix).reduce((total, amount) => total + amount, 0);
  if (!totalWeight) return { protein: 0, carbs: 0, fat: 0, fiber: 0 };
  return nutritionKeys.reduce((summary, key) => {
    summary[key] = Object.entries(mix).reduce((total, [id, amount]) => total + (INGREDIENTS[id]?.[key] || 0) * amount, 0) / totalWeight;
    return summary;
  }, { protein: 0, carbs: 0, fat: 0, fiber: 0 } as NutritionSummary);
}

function calculateCategories(mix: Readonly<Record<string, number>>): CategorySummary {
  const totalWeight = Object.values(mix).reduce((total, amount) => total + amount, 0);
  if (!totalWeight) return { grain: 0, legume: 0, seed: 0 };
  return Object.entries(mix).reduce((summary, [id, amount]) => {
    const category = INGREDIENTS[id]?.category;
    if (category) summary[category] += amount / totalWeight * 100;
    return summary;
  }, { grain: 0, legume: 0, seed: 0 } as CategorySummary);
}

function calculateOptimization(
  mix: Readonly<Record<string, number>>,
  inventory: Readonly<Record<string, number>>,
  target: NutritionTarget,
  bird: BirdType,
) {
  const nutrition = calculateNutrition(mix);
  const categories = calculateCategories(mix);
  const categoryTargets = getCategoryTargets(bird);
  const macroDistance = nutritionKeys.reduce((total, key) => {
    const [minimum, maximum] = target[key];
    return total + Math.abs(nutrition[key] - (minimum + maximum) / 2) / Math.max(0.5, maximum - minimum);
  }, 0);
  const categoryDistance = categoryKeys.reduce((total, key) => {
    const [minimum, maximum] = categoryTargets[key];
    return total + Math.abs(categories[key] - (minimum + maximum) / 2) / Math.max(1, maximum - minimum);
  }, 0);
  const targetMisses = nutritionKeys.filter((key) => nutrition[key] < target[key][0] || nutrition[key] > target[key][1]).length
    + categoryKeys.filter((key) => categories[key] < categoryTargets[key][0] || categories[key] > categoryTargets[key][1]).length;
  const diversityPenalty = 1 - Math.min(1, Object.keys(mix).length / Math.min(5, Math.max(1, Object.keys(inventory).length)));
  return {
    macroDistance,
    categoryDistance,
    targetMisses,
    diversityPenalty,
    total: macroDistance * 0.55 + categoryDistance * 0.25 + diversityPenalty * 0.1 + targetMisses * 0.1,
  };
}

/**
 * Keeps all synchronous safety metadata and approved guidance while replacing
 * only the formula-derived fields with a strictly validated feasible Worker mix.
 */
export function bridgeFeasibleWorkerMixToMixResult(
  fallback: MixResult,
  workerMix: Readonly<Record<string, number>>,
  inventory: Readonly<Record<string, number>>,
  bird: BirdType,
  situation: string,
): MixResult {
  const target = BIRD_PROFILES[bird].profiles[situation]?.nutrition;
  if (!target) return fallback;
  const mix = Object.fromEntries(Object.entries(workerMix).filter(([, grams]) => Number.isFinite(grams) && grams > 0));
  const targetWeight = Object.values(mix).reduce((total, grams) => total + grams, 0);
  if (!targetWeight) return fallback;
  return {
    ...fallback,
    mix,
    targetWeight,
    nutrition: calculateNutrition(mix),
    categories: calculateCategories(mix),
    optimization: calculateOptimization(mix, inventory, target, bird),
  };
}
