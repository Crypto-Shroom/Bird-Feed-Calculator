import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import { BIRD_PROFILES, getCategoryTargets, type BirdType } from "./birds";
import { INGREDIENTS } from "./data";
import { getProfileDefaultIngredients } from "./inventory-presets";
import { buildExactFeasibilityModel, type OptimizerCandidate } from "./optimizer-model";

const require = createRequire(import.meta.url);
const createHighs = require("highs") as () => Promise<{ solve: (model: string) => { Status: string } }>;

function candidatesFor(bird: BirdType, situation: string): OptimizerCandidate[] {
  return Object.entries(getProfileDefaultIngredients(bird, situation)).map(([id, availableGrams]) => ({
    id,
    category: INGREDIENTS[id].category,
    availableGrams,
    nutrition: { protein: INGREDIENTS[id].protein, carbs: INGREDIENTS[id].carbs, fat: INGREDIENTS[id].fat, fiber: INGREDIENTS[id].fiber },
    safetyState: "eligible",
  }));
}

// Budgie and canary standard formulas must have a valid mix on their own ingredient lists. Their ranges follow the
// composition of commercial seed mixes (millets are grain-like seeds, legumes are rare, canaries take more oily seeds).
describe("budgie and canary standard formulas can meet their own targets", () => {
  it.each(["budgie", "canary"] as const)("%s", async (bird) => {
    const highs = await createHighs();
    for (const situation of Object.keys(BIRD_PROFILES[bird].profiles)) {
      const model = buildExactFeasibilityModel({
        candidates: candidatesFor(bird, situation),
        requestedTargetGrams: 1000,
        macroRanges: BIRD_PROFILES[bird].profiles[situation].nutrition,
        categoryRanges: getCategoryTargets(bird),
      });
      expect([bird, situation, highs.solve(model.lp).Status]).toEqual([bird, situation, "Optimal"]);
    }
  });

  it("counts millets as grains", () => {
    for (const id of ["millet", "millet_white", "millet_red", "millet_silver"]) expect(INGREDIENTS[id].category).toBe("grain");
  });
});
