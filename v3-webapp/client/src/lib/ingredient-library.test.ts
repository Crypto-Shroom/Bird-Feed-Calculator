import { describe, expect, it } from "vitest";
import {
  getIngredientLibraryEntries,
  getIngredientLibraryEntry,
  SUPPORTED_INGREDIENT_LIBRARY_BIRDS,
} from "./ingredient-library";
import { INGREDIENTS } from "./data";

describe("ingredient library contract", () => {
  it("represents every existing ingredient without changing the catalog", () => {
    const entries = getIngredientLibraryEntries();
    expect(entries).toHaveLength(Object.keys(INGREDIENTS).length);
    expect(entries.map((entry) => entry.id)).toEqual([...Object.keys(INGREDIENTS)].sort());
  });

  it("uses the explicit six-bird order for compatibility reporting", () => {
    const wheat = getIngredientLibraryEntry("wheat");
    expect(wheat?.compatibleBirds).toEqual([...SUPPORTED_INGREDIENT_LIBRARY_BIRDS]);
    expect(wheat?.incompatibleBirds).toEqual([]);
  });

  it("preserves explicit raw-toxicity warnings and bird-specific warnings", () => {
    const adzuki = getIngredientLibraryEntry("adzuki_beans");
    const kidneyBeans = getIngredientLibraryEntry("kidney_beans");
    expect(adzuki?.ingredient.notes).toContain("TOXIC RAW");
    expect(kidneyBeans?.toxicityByBird.pigeon?.severity).toBe("FATAL");
    expect(kidneyBeans?.toxicityByBird.parrot?.description).toContain("Raw kidney beans");
  });

  it("does not infer evidence approval when the food review ledger is unresolved", () => {
    const entries = getIngredientLibraryEntries();
    expect(entries.every((entry) => entry.evidenceStatus === "unresolved")).toBe(true);
    expect(entries.every((entry) => entry.provenancePath === "database/provenance/food-reviews.json")).toBe(true);
  });
});
