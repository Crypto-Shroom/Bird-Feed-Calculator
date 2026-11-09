import { describe, expect, it } from "vitest";
import { MIX_SHARE_OF_DIET_PERCENT, restOfDietNeed } from "./whole-diet";

describe("whole-diet gap", () => {
  it("only lists the birds whose ranges describe the whole diet", () => {
    expect(Object.keys(MIX_SHARE_OF_DIET_PERCENT).sort()).toEqual(["african_grey", "chicken", "parrot"]);
  });

  it("gives the range the rest of the diet must supply", () => {
    const need = restOfDietNeed([12, 16], 14.2, 18);
    expect(need.kind).toBe("range");
    if (need.kind === "range") {
      expect(need.min).toBeCloseTo((12 - 0.18 * 14.2) / 0.82, 6);
      expect(need.max).toBeCloseTo((16 - 0.18 * 14.2) / 0.82, 6);
    }
  });

  it("gives an upper limit when the mix already covers the minimum", () => {
    const need = restOfDietNeed([4, 12], 40, 18);
    expect(need.kind).toBe("upTo");
    if (need.kind === "upTo") expect(need.max).toBeCloseTo((12 - 0.18 * 40) / 0.82, 6);
  });

  it("says the rest cannot offset a mix that is already above the target", () => {
    expect(restOfDietNeed([4, 12], 80, 18)).toEqual({ kind: "exceeded" });
  });
});
