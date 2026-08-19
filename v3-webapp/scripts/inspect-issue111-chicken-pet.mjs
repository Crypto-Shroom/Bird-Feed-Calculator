import { BIRD_PROFILES, getCategoryTargets } from "../client/src/lib/birds.ts";
import { MultibirMixCalculator } from "../client/src/lib/calculator-multi-bird.ts";
import { getProfileDefaultIngredients } from "../client/src/lib/inventory-presets.ts";
import { INGREDIENTS } from "../client/src/lib/data.ts";

const nutritionKeys = ["protein", "carbs", "fat", "fiber"];

function nutritionForMix(mix) {
  const total = Object.values(mix).reduce((sum, amount) => sum + amount, 0);
  return Object.fromEntries(
    nutritionKeys.map((key) => [
      key,
      Object.entries(mix).reduce((sum, [ingredient, amount]) => sum + INGREDIENTS[ingredient][key] * amount, 0) / total,
    ]),
  );
}

function macroDistance(nutrition, targets) {
  return nutritionKeys.reduce((sum, key) => {
    const [min, max] = targets[key];
    return sum + Math.abs(nutrition[key] - (min + max) / 2) / Math.max(0.5, max - min);
  }, 0);
}

function findTargetCompliantPresetMix(inventory, targets) {
  const feasible = [];
  for (let peas = 100; peas <= 200; peas += 10) {
    for (let oats = 0; oats <= 800 - peas; oats += 10) {
      for (let corn = 0; corn <= 800 - peas - oats; corn += 10) {
        for (let wheat = 0; wheat <= 800 - peas - oats - corn; wheat += 10) {
          const barley = 1000 - peas - oats - corn - wheat;
          if (barley < 0 || barley > inventory.barley || peas > inventory.peas || oats > inventory.oats || corn > inventory.corn_yellow || wheat > inventory.wheat) continue;
          const mix = { peas, oats, corn_yellow: corn, wheat, barley };
          const nutrition = nutritionForMix(mix);
          if (nutritionKeys.every((key) => nutrition[key] >= targets[key][0] && nutrition[key] <= targets[key][1])) {
            feasible.push({ mix, nutrition, macroDistance: macroDistance(nutrition, targets) });
          }
        }
      }
    }
  }
  return feasible.sort((left, right) => left.macroDistance - right.macroDistance)[0] || null;
}


const bird = "chicken";
const situation = "pet";
const targetWeight = 1000;
const inventory = getProfileDefaultIngredients(bird, situation);
const profile = BIRD_PROFILES[bird].profiles[situation];
const result = new MultibirMixCalculator(inventory, bird, situation).calculate(targetWeight);
const targetCompliantPresetMix = findTargetCompliantPresetMix(inventory, profile.nutrition);

console.log(
  JSON.stringify(
    {
      bird,
      situation,
      targetWeight,
      inventory,
      targetRanges: profile.nutrition,
      categoryTargets: getCategoryTargets(bird),
      mix: result.mix,
      nutrition: result.nutrition,
      categories: result.categories,
      optimization: result.optimization,
      warnings: result.warnings,
      missingIngredients: result.missingIngredients,
      suggestions: result.suggestions,
      targetCompliantPresetMix,
    },
    null,
    2,
  ),
);
