import { describe, expect, it } from "vitest";
import { HERBS_SUPPLEMENTS } from "./herb-content";
import { HERB_EVIDENCE } from "./herb-evidence";
import { HERB_RECOMMENDATIONS } from "./data";
import baselineFixture from "./herb-content-baseline.fixture.json";

describe("Herb Content Parity Tests", () => {
  it("adapter output deep-equals frozen baseline fixture for all 26 herbs", () => {
    expect(HERBS_SUPPLEMENTS).toEqual(baselineFixture);
    expect(Object.keys(HERBS_SUPPLEMENTS)).toHaveLength(26);
  });

  it("herb name sets of herb-content.mts and herb-provenance.mts are identical", () => {
    const contentKeys = Object.keys(HERBS_SUPPLEMENTS).sort();
    const evidenceKeys = Object.keys(HERB_EVIDENCE).sort();

    expect(contentKeys).toEqual(evidenceKeys);
  });

  it("every name in HERB_RECOMMENDATIONS exists in content records", () => {
    const recommendedHerbNames = new Set(
      Object.values(HERB_RECOMMENDATIONS).flatMap((rec) => rec.recommended)
    );

    for (const name of recommendedHerbNames) {
      expect(HERBS_SUPPLEMENTS).toHaveProperty(name);
    }
  });
});
