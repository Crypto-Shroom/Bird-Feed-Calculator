import assert from "node:assert/strict";
import { getStarterInventory } from "../client/src/lib/inventory-presets.ts";

const pigeonPet = getStarterInventory("pigeon", "pet");
assert.deepEqual(pigeonPet, {
  wheat: 5000,
  corn_yellow: 3000,
  peas: 2000,
  lentils: 1000,
  safflower: 500,
  barley: 2000,
});

const pigeonRacing = getStarterInventory("pigeon", "racing");
assert.notDeepEqual(pigeonPet, pigeonRacing, "profiles must preserve distinct standard inventories");

pigeonPet.wheat = 1;
assert.equal(
  getStarterInventory("pigeon", "pet").wheat,
  5000,
  "reset inventories must be fresh copies rather than mutable shared presets",
);

assert.deepEqual(
  getStarterInventory("chicken", "unknown-profile"),
  getStarterInventory("chicken", "pet"),
  "unsupported profile values must fall back to a safe standard inventory",
);

console.log("Inventory preset checks passed.");
