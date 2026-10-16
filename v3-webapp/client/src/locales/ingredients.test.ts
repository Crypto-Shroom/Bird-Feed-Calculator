import { describe, expect, it } from "vitest";
import { INGREDIENTS } from "../lib/ingredient-records";
import { INGREDIENT_NAMES, getIngredientName } from "./ingredients";

describe("ingredient display names", () => {
  const ids = Object.keys(INGREDIENTS).sort();

  it.each(["de", "nl"] as const)("%s has a name for every ingredient and no extra ids", (language) => {
    expect(Object.keys(INGREDIENT_NAMES[language]).sort()).toEqual(ids);
  });

  it.each(["de", "nl"] as const)("%s names are not English copies and are unique", (language) => {
    const names = ids.map((id) => getIngredientName(id, language));
    expect(new Set(names.map((name) => name.toLowerCase())).size).toBe(ids.length);
    for (const id of ids) expect(getIngredientName(id, language)).not.toBe(id.replace(/_/g, " "));
  });

  it("English keeps the id with spaces and unknown ids fall back to it", () => {
    expect(getIngredientName("black_eyed_peas", "en")).toBe("black eyed peas");
    expect(getIngredientName("mystery_seed", "de")).toBe("mystery seed");
  });
});
