import { describe, expect, it } from "vitest";

import { allocateCanonicalMixToInventoryForms } from "./optimizer-form-allocation";

describe("canonical optimizer form allocation", () => {
  it("keeps a single actual source form when that is all the visitor entered", () => {
    expect(allocateCanonicalMixToInventoryForms({ lentils: 125 }, { split_lentils: 125 })).toEqual({ split_lentils: 125 });
  });

  it("allocates a canonical lentil quantity proportionally across whole and split stock with deterministic integer remainder", () => {
    expect(allocateCanonicalMixToInventoryForms({ lentils: 201 }, { lentils: 275, split_lentils: 125 })).toEqual({ lentils: 138, split_lentils: 63 });
  });

  it("does not exceed actual form stock or manufacture an unentered form", () => {
    const result = allocateCanonicalMixToInventoryForms({ lentils: 399 }, { lentils: 275, split_lentils: 125 });
    expect(result.lentils).toBeLessThanOrEqual(275);
    expect(result.split_lentils).toBeLessThanOrEqual(125);
    expect(result).not.toHaveProperty("red_lentils");
    expect(Object.values(result).reduce((total, grams) => total + grams, 0)).toBe(399);
  });

  it("rejects a canonical quantity that cannot be restored within actual source stock", () => {
    expect(() => allocateCanonicalMixToInventoryForms({ lentils: 401 }, { lentils: 275, split_lentils: 125 })).toThrow("exceeds actual source-form stock");
  });

  it("splits a merged corn quantity across the visitor's actual corn variants in proportion to their stock", () => {
    expect(allocateCanonicalMixToInventoryForms({ corn_red: 300, wheat: 700 }, { corn_yellow: 600, maize: 200, wheat: 1_000 }))
      .toEqual({ corn_yellow: 225, maize: 75, wheat: 700 });
  });

  it("never allocates to an inventory variant outside the safety-gated source set", () => {
    expect(allocateCanonicalMixToInventoryForms({ peanuts: 40 }, { peanuts: 100, peanuts_raw: 100 }, new Set(["peanuts"])))
      .toEqual({ peanuts: 40 });
  });
});
