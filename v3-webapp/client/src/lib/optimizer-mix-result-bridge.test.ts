import { describe, expect, it } from "vitest";

import { MultibirMixCalculator } from "./calculator-multi-bird";
import { bridgeFeasibleWorkerMixToMixResult } from "./optimizer-mix-result-bridge";

describe("feasible Worker MixResult bridge", () => {
  it("replaces only formula-derived fields while preserving synchronous warnings, suggestions, and missing-category guidance", () => {
    const inventory = { barley: 700, peas: 300 };
    const synchronous = new MultibirMixCalculator(inventory, "chicken", "pet").calculate(1_000);
    const result = bridgeFeasibleWorkerMixToMixResult(synchronous, { barley: 600, peas: 300 }, inventory, "chicken", "pet");

    expect(result.mix).toEqual({ barley: 600, peas: 300 });
    expect(result.targetWeight).toBe(900);
    expect(result.warnings).toEqual(synchronous.warnings);
    expect(result.suggestions).toEqual(synchronous.suggestions);
    expect(result.missingIngredients).toEqual(synchronous.missingIngredients);
  });
});
