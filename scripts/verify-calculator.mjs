import { BIRD_PROFILES, getCategoryTargets } from "../client/src/lib/birds.ts";
import { MultibirMixCalculator } from "../client/src/lib/calculator-multi-bird.ts";

const baseInventory = {
  wheat: 5000,
  barley: 3000,
  oats: 2500,
  peas: 1500,
  lentils: 1000,
  safflower: 500,
  flaxseed: 300,
};

let scenarios = 0;
for (const [bird, profile] of Object.entries(BIRD_PROFILES)) {
  for (const situation of Object.keys(profile.profiles)) {
    const result = new MultibirMixCalculator(baseInventory, bird, situation).calculate(1000);
    const total = Object.values(result.mix).reduce((sum, amount) => sum + amount, 0);
    if (!Number.isFinite(total) || Math.abs(total - 1000) > 0.001) {
      throw new Error(`${bird}/${situation}: expected a 1000g result, received ${total}g`);
    }
    if (Object.values(result.nutrition).some((value) => !Number.isFinite(value))) {
      throw new Error(`${bird}/${situation}: nutrition contains a non-finite estimate`);
    }
    scenarios += 1;
  }
}

const safetyResult = new MultibirMixCalculator({ wheat: 1000, peas: 1000, kidney_beans: 1000, soybeans: 1000 }, "chicken", "pet").calculate(500);
if ("kidney_beans" in safetyResult.mix || "soybeans" in safetyResult.mix) {
  throw new Error("raw legumes were included in a calculated mix");
}
if (!safetyResult.warnings.some((warning) => warning.level === "CRITICAL")) {
  throw new Error("raw-legume exclusion did not produce a critical warning");
}

const optimizerFirst = new MultibirMixCalculator(baseInventory, "pigeon", "maintenance").calculate(1000);
const optimizerSecond = new MultibirMixCalculator(baseInventory, "pigeon", "maintenance").calculate(1000);
if (JSON.stringify(optimizerFirst.mix) !== JSON.stringify(optimizerSecond.mix)) {
  throw new Error("optimizer returned different mixes for identical inputs");
}
if (optimizerFirst.warnings.some((warning) => warning.message.includes("estimate target") || warning.message.includes("estimate range"))) {
  throw new Error("audit-style target-deviation advisories reappeared in the restored warning baseline");
}
for (const [name, amount] of Object.entries(optimizerFirst.mix)) {
  if (amount > baseInventory[name] + 0.001) {
    throw new Error(`optimizer exceeded available inventory for ${name}`);
  }
}
const pigeonCategoryTargets = getCategoryTargets("pigeon");
for (const [category, [minimum, maximum]] of Object.entries(pigeonCategoryTargets)) {
  const actual = optimizerFirst.categories[category];
  if (actual < minimum - 0.001 || actual > maximum + 0.001) {
    throw new Error(`optimizer did not meet feasible pigeon ${category} category target: ${actual}%`);
  }
}

for (const ingredient of ["chickpeas", "adzuki_beans", "lupins", "vetch"]) {
  const preparedIngredientResult = new MultibirMixCalculator({ wheat: 1000, [ingredient]: 1000, safflower: 1000 }, "pigeon", "maintenance").calculate(500);
  if (!(ingredient in preparedIngredientResult.mix)) {
    throw new Error(`${ingredient} was not restored to the pigeon calculator after its preparation guidance was added`);
  }
}
const parrotVetchResult = new MultibirMixCalculator({ wheat: 1000, peas: 1000, safflower: 1000, vetch: 1000 }, "parrot", "pet").calculate(500);
if ("vetch" in parrotVetchResult.mix) {
  throw new Error("common vetch was included in a companion-parrot mix");
}
if (!parrotVetchResult.warnings.some((warning) => warning.message.includes("Do not add common vetch"))) {
  throw new Error("companion-bird vetch exclusion did not show the practical bird-specific message");
}

console.log(`Verified ${scenarios} bird/situation scenarios, raw-legume exclusion, deterministic output, inventory limits, feasible pigeon category targets, and restored preparation guidance.`);
