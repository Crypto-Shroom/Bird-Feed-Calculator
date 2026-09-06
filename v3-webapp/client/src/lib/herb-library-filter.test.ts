import { describe, expect, it } from "vitest";
import { HERBS_SUPPLEMENTS } from "@/lib/data";
import { filterHerbLibraryEntries, type HerbLibraryEntry } from "@/lib/herb-library-filter";

const libraryEntries = Object.entries(HERBS_SUPPLEMENTS)
  .filter(([name]) => name !== "apple_cider_vinegar")
  .sort(([left], [right]) => left.localeCompare(right)) as HerbLibraryEntry[];

const namesFor = (bird: Parameters<typeof filterHerbLibraryEntries>[1]) =>
  filterHerbLibraryEntries(libraryEntries, bird).map(([name]) => name);

describe("filterHerbLibraryEntries", () => {
  it("preserves the complete unfiltered library by default", () => {
    expect(filterHerbLibraryEntries(libraryEntries, "all")).toEqual(libraryEntries);
  });

  it("uses the canonical pigeon-only garlic eligibility without manufacturing compatibility for other birds", () => {
    const pigeonNames = namesFor("pigeon");
    const parrotNames = namesFor("parrot");

    expect(pigeonNames).toEqual(expect.arrayContaining(["garlic_powder", "garlic_oil"]));
    expect(parrotNames).not.toEqual(expect.arrayContaining(["garlic_powder", "garlic_oil"]));
  });

  it("does not present reference-only entries as automatically compatible for a selected bird", () => {
    expect(namesFor("pigeon")).not.toContain("cumin");
    expect(namesFor("chicken")).not.toContain("cod_liver_oil");
  });
});
