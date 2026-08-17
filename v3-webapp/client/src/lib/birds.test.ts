import { describe, expect, it } from "vitest";
import { BIRD_CARE, BIRD_TYPES } from "./birds";

describe("canonical bird care guidance", () => {
  it("provides the approved indoor-light care note for each supported bird", () => {
    const approvedLightText = "For indoor birds, provide safe natural daylight or a species-appropriate avian UVB setup with a shaded retreat.";

    expect(BIRD_TYPES.map((bird) => BIRD_CARE[bird].light)).toEqual(
      BIRD_TYPES.map(() => approvedLightText),
    );
  });

  it("keeps the approved pigeon fresh-produce guidance canonical and excludes it from other birds", () => {
    expect(BIRD_CARE.pigeon.freshProduce).toBe(
      "Offer a variety of washed, finely chopped leafy greens and vegetables such as carrot in a separate dish. Add smaller fruit portions, including apple, and remove leftovers promptly; keep fresh foods separate from the dry mix.",
    );
    expect(BIRD_TYPES.filter((bird) => bird !== "pigeon").every((bird) => !BIRD_CARE[bird].freshProduce)).toBe(true);
  });
});
