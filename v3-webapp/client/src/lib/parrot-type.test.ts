import { describe, expect, it } from "vitest";
import { BIRD_PROFILES, getSituationNutrition, PARROT_TYPES, type BirdType } from "./birds";
import { MultibirMixCalculator } from "./calculator-multi-bird";
import { getProfileDefaultIngredients } from "./inventory-presets";

describe("parrot feeding type", () => {
  it("lists the four types with the general one first", () => {
    expect(PARROT_TYPES).toEqual(["general", "granivore", "frugivore", "nectarivore"]);
  });

  it("changes only the granivore parrot's protein range, and not for breeding", () => {
    for (const situation of Object.keys(BIRD_PROFILES.parrot.profiles)) {
      const general = BIRD_PROFILES.parrot.profiles[situation].nutrition;
      expect(getSituationNutrition("parrot", situation, "general")).toEqual(general);
      expect(getSituationNutrition("parrot", situation, "frugivore")).toEqual(general);
      // Breeding keeps the general protein range; the other situations get the granivore 10-14.
      expect(getSituationNutrition("parrot", situation, "granivore")).toEqual(situation === "breeding" ? general : { ...general, protein: [10, 14] });
    }
  });

  it("never changes another bird, whatever type is passed", () => {
    for (const bird of Object.keys(BIRD_PROFILES).filter((b) => b !== "parrot") as BirdType[]) {
      for (const situation of Object.keys(BIRD_PROFILES[bird].profiles)) {
        for (const type of PARROT_TYPES) {
          expect(getSituationNutrition(bird, situation, type)).toEqual(BIRD_PROFILES[bird].profiles[situation].nutrition);
        }
      }
    }
  });

  it("gives the same mix as before for the general type and for the pigeon", () => {
    for (const [bird, situation] of [["pigeon", "maintenance"], ["parrot", "pet"]] as const) {
      const inventory = getProfileDefaultIngredients(bird, situation);
      const withoutType = new MultibirMixCalculator(inventory, bird, situation).calculate(1000);
      const withType = new MultibirMixCalculator(inventory, bird, situation, "general").calculate(1000);
      expect(withType.mix).toEqual(withoutType.mix);
      expect(withType.nutrition).toEqual(withoutType.nutrition);
    }
  });
});
