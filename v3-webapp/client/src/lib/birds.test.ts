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

  it("defines the owner-approved pigeon vegetable, fruit, safety, and source-link guidance", () => {
    const guidance = BIRD_CARE.pigeon.freshProduceGuidance;

    expect(guidance).toMatchObject({
      triggerLabel: "View suitable fresh vegetables and fruit",
      heading: "Suitable fresh vegetables and fruit for pigeons",
      introduction: "Offer fresh, washed, finely chopped or grated vegetables and small pieces of fruit in a separate dish.",
      vegetables: "Vegetables: carrot, broccoli, cauliflower, bell pepper, dandelion greens, and leafy greens such as kale, romaine, or collard greens.",
      fruits: "Small fruit portions: apple flesh with the core and seeds removed, and berries.",
      safety: "Do not offer avocado, onion, or rhubarb. Remove leftovers promptly.",
      sourcesTriggerLabel: "Sources for this guidance",
      sourcesHeading: "Sources for fresh vegetable and fruit guidance",
    });
    expect(guidance?.sources).toHaveLength(5);
    expect(guidance?.sources.map((source) => source.url)).toEqual([
      "https://vcahospitals.com/know-your-pet/pigeons-and-doves-feeding",
      "https://www.melbournebirdvet.com/post/diet-for-pet-pigeons",
      "https://www.pigeonrescue.org/birds/care/pigeon-feeding-dove-feeding/",
      "https://modernpetpigeonsociety.miraheze.org/wiki/Fruits_and_vegetables",
      "https://pigeoncaretips.com/what-do-pigeons-eat/",
    ]);
    expect(BIRD_TYPES.filter((bird) => bird !== "pigeon").every((bird) => !BIRD_CARE[bird].freshProduceGuidance)).toBe(true);
  });
});
