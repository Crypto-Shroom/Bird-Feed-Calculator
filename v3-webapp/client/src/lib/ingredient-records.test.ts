import { describe, expect, it } from "vitest";
import { INGREDIENTS } from "./ingredient-records";
import baselineFixture from "./ingredient-records-baseline.fixture.json";

describe("Ingredient Records Parity & Completeness Tests", () => {
  it("adapter output deep-equals frozen baseline fixture for all 73 ingredients", () => {
    expect(INGREDIENTS).toEqual(baselineFixture);
    expect(Object.keys(INGREDIENTS)).toHaveLength(73);
  });

  it("every record fulfills completeness requirements", () => {
    const validCategories = new Set(["grain", "legume", "seed"]);
    const idPattern = /^[a-z0-9_]+$/;

    for (const [id, record] of Object.entries(INGREDIENTS)) {
      // Validate ID pattern
      expect(id).toMatch(idPattern);

      // Validate category
      expect(validCategories.has(record.category)).toBe(true);

      // Validate protein, carbs, fat, fiber are finite numbers in range 0–100
      for (const field of ["protein", "carbs", "fat", "fiber"] as const) {
        const val = record[field];
        expect(typeof val).toBe("number");
        expect(Number.isFinite(val)).toBe(true);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(100);
      }

      // Validate notes string is non-empty
      expect(typeof record.notes).toBe("string");
      expect(record.notes.trim().length).toBeGreaterThan(0);
    }
  });
});
