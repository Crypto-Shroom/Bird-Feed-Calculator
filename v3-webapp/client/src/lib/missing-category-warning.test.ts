import { describe, expect, it } from "vitest";
import { MultibirMixCalculator } from "./calculator-multi-bird";

const grainOnlyInventory = { wheat: 1000, millet: 500 };

function missingCategories(bird: "pigeon" | "budgie" | "canary") {
  const result = new MultibirMixCalculator({ ...grainOnlyInventory }, bird, "pet").calculate(1000);
  return (result.missingIngredients ?? []).map((item) => item.category);
}

describe("missing essential ingredient categories", () => {
  it("does not call legumes essential for budgie and canary, whose legume minimum is 0", () => {
    expect(missingCategories("budgie")).not.toContain("Legumes");
    expect(missingCategories("canary")).not.toContain("Legumes");
  });

  it("still reports missing legumes for pigeon, whose legume minimum is above 0", () => {
    expect(missingCategories("pigeon")).toContain("Legumes");
  });
});
