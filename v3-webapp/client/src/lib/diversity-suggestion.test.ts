import { describe, expect, it } from "vitest";
import { checkBirdToxicity, isIngredientCompatible } from "@/lib/bird-safety";
import { selectDiversitySuggestionCandidate } from "@/lib/diversity-suggestion";
import { getProcessingWarning, isToxicRaw } from "@/lib/safety";

describe("selectDiversitySuggestionCandidate", () => {
  const mix = { corn_yellow: 600, peas: 250, safflower: 150 };

  it("suppresses the banner candidate while the profile-default formula is displayed", () => {
    expect(
      selectDiversitySuggestionCandidate({
        bird: "pigeon",
        formulaSource: "profile-default",
        mix,
      }),
    ).toBeNull();
  });

  it("returns a stable safe candidate that is absent from an actual inventory calculation", () => {
    const first = selectDiversitySuggestionCandidate({ bird: "pigeon", formulaSource: "inventory", mix });
    const second = selectDiversitySuggestionCandidate({ bird: "pigeon", formulaSource: "inventory", mix });

    expect(first).toBe(second);
    expect(first).not.toBeNull();
    expect(mix[first as keyof typeof mix]).toBeUndefined();
    expect(isIngredientCompatible(first as string, "pigeon")).toBe(true);
    expect(isToxicRaw(first as string)).toBeFalsy();
    expect(checkBirdToxicity(first as string, "pigeon")).toBeNull();
    expect(getProcessingWarning(first as string)).toBeFalsy();
  });

  it("suppresses the candidate when the completed mix reports missing ingredients", () => {
    expect(
      selectDiversitySuggestionCandidate({
        bird: "pigeon",
        formulaSource: "inventory",
        mix,
        missingIngredients: ["safe grain"],
      }),
    ).toBeNull();
  });
});
