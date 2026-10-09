import { describe, expect, it } from "vitest";

import { MultibirMixCalculator } from "./calculator-multi-bird";
import { bridgeFeasibleWorkerMixToMixResult } from "./optimizer-mix-result-bridge";

describe("Worker MixResult bridge", () => {
  const inventory = { corn_yellow: 1000, wheat: 1000, peas: 1000, kidney_beans: 500 };
  const synchronous = new MultibirMixCalculator(inventory, "chicken", "pet").calculate(1_000);

  it("recomputes suggestions and analysis from the displayed Worker mix and keeps inventory-derived warnings", () => {
    const workerMix = { corn_yellow: 800, peas: 200 };
    const result = bridgeFeasibleWorkerMixToMixResult(synchronous, workerMix, inventory, "chicken", "pet");
    const expected = new MultibirMixCalculator(inventory, "chicken", "pet").summarizeMix(workerMix);

    expect(result.mix).toEqual(workerMix);
    expect(result.targetWeight).toBe(1_000);
    expect(result.nutrition).toEqual(expected?.nutrition);
    expect(result.categories).toEqual({ grain: 80, legume: 20, seed: 0 });
    expect(result.optimization).toEqual(expected?.optimization);
    // A corn-only grain share triggers the existing pairing suggestion for the shown mix,
    // even though the synchronous mix (which also uses wheat) did not.
    expect(synchronous.mix.wheat).toBeGreaterThan(0);
    expect(synchronous.suggestions.some((suggestion) => suggestion.startsWith("Pair corn yellow"))).toBe(false);
    expect(result.suggestions).toEqual(expected?.suggestions);
    expect(result.suggestions.some((suggestion) => suggestion.startsWith("Pair corn yellow"))).toBe(true);
    // Safety exclusions and missing-category guidance depend on inventory, not quantities.
    expect(result.warnings).toEqual(synchronous.warnings);
    expect(result.warnings.some(({ message }) => message.startsWith("kidney beans was excluded"))).toBe(true);
    expect(result.missingIngredients).toEqual(synchronous.missingIngredients);
  });

  it("keeps the synchronous result when the Worker total differs, so the scaled-weight notice cannot misdescribe the mix", () => {
    const result = bridgeFeasibleWorkerMixToMixResult(synchronous, { corn_yellow: 600, peas: 300 }, inventory, "chicken", "pet");

    expect(result).toBe(synchronous);
  });

  it("does not change the synchronous calculator output when summarizing its own mix", () => {
    const summary = new MultibirMixCalculator(inventory, "chicken", "pet").summarizeMix(synchronous.mix);

    expect(summary).toEqual({
      nutrition: synchronous.nutrition,
      categories: synchronous.categories,
      optimization: synchronous.optimization,
      suggestions: synchronous.suggestions,
    });
  });
});
