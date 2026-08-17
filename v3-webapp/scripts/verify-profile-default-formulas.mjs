import assert from "node:assert/strict";
import { MultibirMixCalculator } from "../client/src/lib/calculator-multi-bird.ts";
import { getProfileDefaultIngredients } from "../client/src/lib/inventory-presets.ts";
import { resolveDisplayedFormula } from "../client/src/lib/formula-display.ts";

const profileDefault = new MultibirMixCalculator(
  getProfileDefaultIngredients("pigeon", "pet"),
  "pigeon",
  "pet",
).calculate(1000);

const emptyInventoryDisplay = resolveDisplayedFormula({}, profileDefault, null);
assert.equal(emptyInventoryDisplay.source, "profile-default");
assert.equal(emptyInventoryDisplay.result, profileDefault);

const actualInventory = { wheat: 1000 };
const actualInventoryResult = new MultibirMixCalculator(actualInventory, "pigeon", "pet").calculate(1000);
const enteredInventoryDisplay = resolveDisplayedFormula(actualInventory, profileDefault, actualInventoryResult);
assert.equal(enteredInventoryDisplay.source, "inventory");
assert.equal(enteredInventoryDisplay.result, actualInventoryResult);

for (const [bird, situation] of [
  ["pigeon", "pet"],
  ["parrot", "pet"],
  ["african_grey", "pet"],
  ["budgie", "pet"],
  ["canary", "pet"],
  ["chicken", "pet"],
]) {
  const result = new MultibirMixCalculator(getProfileDefaultIngredients(bird, situation), bird, situation).calculate(1000);
  assert.ok(Object.keys(result.mix).length > 0, `${bird} profile default should produce a formula`);
}

console.log("Profile default formula checks passed.");
