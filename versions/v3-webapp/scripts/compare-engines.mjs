import { PigeonMixCalculator } from "../client/src/lib/calculator.ts";
import { MultibirMixCalculator } from "../client/src/lib/calculator-multi-bird.ts";

const inventory = {
  wheat: 5000,
  corn_yellow: 3000,
  peas: 2000,
  lentils: 1000,
  safflower: 500,
  barley: 2000,
};

const legacy = new PigeonMixCalculator(inventory, "maintenance").calculate(1000);
const multibird = new MultibirMixCalculator(inventory, "pigeon", "maintenance").calculate(1000);

const normalize = (result) => ({
  mix: Object.fromEntries(Object.entries(result.mix).map(([name, amount]) => [name, Number(amount.toFixed(1))])),
  nutrition: Object.fromEntries(Object.entries(result.nutrition).map(([name, amount]) => [name, Number(amount.toFixed(2))])),
  categories: Object.fromEntries(Object.entries(result.categories).map(([name, amount]) => [name, Number(amount.toFixed(2))])),
  warnings: result.warnings.map((warning) => warning.message),
});

console.log(JSON.stringify({ inventory, targetWeight: 1000, legacy: normalize(legacy), multibird: normalize(multibird) }, null, 2));
