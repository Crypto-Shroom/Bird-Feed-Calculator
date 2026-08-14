import { BIRD_PROFILES } from "../client/src/lib/birds.ts";
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

console.log(`Verified ${scenarios} bird/situation scenarios and raw-legume exclusion.`);
