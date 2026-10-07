import { describe, expect, it } from "vitest";
import { getPreparationExportLines } from "./safety";

describe("downloaded recipe preparation guidance (#213)", () => {
  it("marks safety-relevant preparation as WARNING with the bird guidance and safety note", () => {
    const lines = getPreparationExportLines(["wheat", "adzuki_beans", "safflower"], "budgie");

    expect(lines).toEqual([
      "",
      "PREPARATION INSTRUCTIONS AND WARNINGS",
      "WARNING – adzuki beans: Soak, then boil until completely soft; drain and cool before feeding",
      "  Offer cooked adzuki beans finely chopped or mashed in a suitable small-bird portion.",
      "  RAW ADZUKI BEANS ARE TOXIC. Soak and boil until completely soft before feeding; never offer raw or undercooked beans.",
      "safflower: Feed whole with hull intact",
    ]);
  });

  it("adds nothing when no ingredient has preparation guidance", () => {
    expect(getPreparationExportLines(["wheat", "barley"], "pigeon")).toEqual([]);
  });
});
