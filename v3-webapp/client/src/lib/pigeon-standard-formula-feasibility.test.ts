import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import { BIRD_PROFILES, getCategoryTargets } from "./birds";
import { INGREDIENTS } from "./data";
import { getProfileDefaultIngredients } from "./inventory-presets";
import { buildExactFeasibilityModel, type OptimizerCandidate } from "./optimizer-model";

const require = createRequire(import.meta.url);
const createHighs = require("highs") as () => Promise<{ solve: (model: string) => { Status: string } }>;

function candidatesFor(situation: string): OptimizerCandidate[] {
  return Object.entries(getProfileDefaultIngredients("pigeon", situation)).map(([id, availableGrams]) => ({
    id,
    category: INGREDIENTS[id].category,
    availableGrams,
    nutrition: {
      protein: INGREDIENTS[id].protein,
      carbs: INGREDIENTS[id].carbs,
      fat: INGREDIENTS[id].fat,
      fiber: INGREDIENTS[id].fiber,
    },
    safetyState: "eligible",
  }));
}

// Guards against a profile's own nutrient targets contradicting its mix targets, which previously left
// racing, molting, winter and pet without any valid mix (issue #247).
describe("pigeon standard formulas can meet their own targets", () => {
  it.each(["maintenance", "racing", "breeding", "molting", "winter", "pet"])("%s has a feasible mix on its standard ingredient list", async (situation) => {
    const highs = await createHighs();
    const model = buildExactFeasibilityModel({
      candidates: candidatesFor(situation),
      requestedTargetGrams: 1000,
      macroRanges: BIRD_PROFILES.pigeon.profiles[situation].nutrition,
      categoryRanges: getCategoryTargets("pigeon"),
    });
    expect(highs.solve(model.lp).Status).toBe("Optimal");
  });

  it("keeps the widened carbohydrate and fat ranges for racing, molting, winter and pet", () => {
    const { racing, molting, winter, pet } = BIRD_PROFILES.pigeon.profiles;
    expect([racing.nutrition.carbs, racing.nutrition.fat]).toEqual([[58, 68], [4, 6]]);
    expect([molting.nutrition.carbs, molting.nutrition.fat]).toEqual([[58, 68], [4, 6]]);
    expect([winter.nutrition.carbs, winter.nutrition.fat]).toEqual([[62, 72], [5, 8]]);
    expect([pet.nutrition.carbs, pet.nutrition.fat]).toEqual([[60, 70], [2.5, 5]]);
  });
});
