import { describe, expect, it } from "vitest";
import { checkBirdToxicity, isIngredientCompatible } from "@/lib/bird-safety";
import { selectDiversitySuggestionCandidate } from "@/lib/diversity-suggestion";
import { INGREDIENTS } from "@/lib/data";
import { getProcessingWarning, INGREDIENTS_WITH_SAFETY_PREPARATION_WARNINGS, isToxicRaw } from "@/lib/safety";
import { BIRD_TYPES } from "@/lib/birds";

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
  it("never proposes an ingredient whose preparation carries a safety warning (#212)", () => {
    for (const name of INGREDIENTS_WITH_SAFETY_PREPARATION_WARNINGS) expect(INGREDIENTS[name]).toBeDefined();

    // Reported case: this pigeon inventory previously suggested raw-toxic adzuki beans.
    const reported = { wheat: 1000, barley: 600, corn_yellow: 200, peas: 150, safflower: 50 };
    const names = Object.keys(INGREDIENTS);
    for (const bird of BIRD_TYPES) {
      for (let offset = 0; offset < names.length; offset += 1) {
        const mix = { ...reported, [names[offset]]: 10 };
        const suggestion = selectDiversitySuggestionCandidate({ bird, formulaSource: "inventory", mix });
        if (suggestion) expect(INGREDIENTS_WITH_SAFETY_PREPARATION_WARNINGS.has(suggestion)).toBe(false);
      }
    }
  });
});
