import { INGREDIENTS, PROFILES } from "../client/src/lib/data.ts";
import { BIRD_PROFILES, getCategoryTargets } from "../client/src/lib/birds.ts";
import { PigeonMixCalculator } from "../client/src/lib/calculator.ts";
import { MultibirMixCalculator } from "../client/src/lib/calculator-multi-bird.ts";

const scenarios = [
  {
    name: "Balanced default inventory",
    inventory: { wheat: 5000, corn_yellow: 3000, peas: 2000, lentils: 1000, safflower: 500, barley: 2000 },
    targetWeight: 1000,
  },
  {
    name: "Limited inventory",
    inventory: { wheat: 250, peas: 100, safflower: 50 },
    targetWeight: 1000,
  },
  {
    name: "Grain-only inventory",
    inventory: { corn_yellow: 1000, wheat: 1000, barley: 1000 },
    targetWeight: 1000,
  },
  {
    name: "High-fat inventory",
    inventory: { wheat: 1000, peas: 1000, sunflower: 1000, safflower: 1000, hemp: 1000 },
    targetWeight: 1000,
  },
];

const nutritionKeys = ["protein", "carbs", "fat", "fiber"];
const categoryKeys = ["grain", "legume", "seed"];

function summarize(result, targets, categories) {
  const actualWeight = Object.values(result.mix).reduce((total, amount) => total + amount, 0);
  const macroDistance = nutritionKeys.reduce((total, key) => {
    const [minimum, maximum] = targets[key];
    const midpoint = (minimum + maximum) / 2;
    return total + Math.abs(result.nutrition[key] - midpoint);
  }, 0);
  const categoryDistance = categoryKeys.reduce((total, key) => {
    const [minimum, maximum] = categories[key];
    const midpoint = (minimum + maximum) / 2;
    return total + Math.abs(result.categories[key] - midpoint);
  }, 0);
  const inventoryExceeded = Object.entries(result.mix).some(([name, amount]) => amount > (currentInventory[name] || 0) + 0.0001);
  return {
    batchWeight: Number(actualWeight.toFixed(1)),
    ingredientCount: Object.keys(result.mix).length,
    macroMidpointDistance: Number(macroDistance.toFixed(2)),
    categoryMidpointDistance: Number(categoryDistance.toFixed(2)),
    inventoryExceeded,
    warningCount: result.warnings.length,
  };
}

let currentInventory = {};
const rows = [];

for (const scenario of scenarios) {
  currentInventory = scenario.inventory;
  const legacy = new PigeonMixCalculator(scenario.inventory, "maintenance").calculate(scenario.targetWeight);
  const multibird = new MultibirMixCalculator(scenario.inventory, "pigeon", "maintenance").calculate(scenario.targetWeight);
  const legacyTargets = {
    nutrition: {
      protein: PROFILES.maintenance.protein,
      carbs: PROFILES.maintenance.carbs,
      fat: PROFILES.maintenance.fat,
      fiber: PROFILES.maintenance.fiber,
    },
    categories: PROFILES.maintenance.category_ratios,
  };
  const activeTargets = {
    nutrition: BIRD_PROFILES.pigeon.profiles.maintenance.nutrition,
    categories: getCategoryTargets("pigeon"),
  };
  rows.push({
    scenario: scenario.name,
    legacyAgainstLegacyProfile: summarize(legacy, legacyTargets.nutrition, legacyTargets.categories),
    multibirdAgainstLegacyProfile: summarize(multibird, legacyTargets.nutrition, legacyTargets.categories),
    legacyAgainstActiveProfile: summarize(legacy, activeTargets.nutrition, activeTargets.categories),
    multibirdAgainstActiveProfile: summarize(multibird, activeTargets.nutrition, activeTargets.categories),
    legacyWarnings: legacy.warnings.map((warning) => warning.message),
    multibirdWarnings: multibird.warnings.map((warning) => warning.message),
  });
}

console.log(JSON.stringify(rows, null, 2));
