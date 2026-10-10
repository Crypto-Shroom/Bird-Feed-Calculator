import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import { MultibirMixCalculator } from "./calculator-multi-bird";
import { isIngredientCompatible } from "./bird-safety";
import type { BirdType } from "./birds";
import { INGREDIENTS } from "./data";
import { buildBrowserOptimizerCandidates } from "./optimizer-runtime";
import { buildExactFeasibilityModel, renderOptimizerStageLp } from "./optimizer-model";

const require = createRequire(import.meta.url);
const createHighs = require("highs") as () => Promise<{
  solve: (model: string) => { Status: string; Columns: Record<string, { Primal: number }> };
}>;

const birds: BirdType[] = ["pigeon", "parrot", "african_grey", "budgie", "canary", "chicken"];
const cappedIds = Object.keys(INGREDIENTS).filter((id) => INGREDIENTS[id].maxSharePercent);

// Owner-approved 2026-10-10 (#43, #205): almond and pine nuts are capped treats.
describe("capped treats (almonds, pine nuts)", () => {
  it("has the approved caps", () => {
    expect(INGREDIENTS.almonds.maxSharePercent).toEqual({ pigeon: 2, parrot: 5, african_grey: 5, budgie: 5, chicken: 5 });
    expect(INGREDIENTS.pine_nuts.maxSharePercent).toEqual({ pigeon: 2, parrot: 5, budgie: 5, chicken: 5 });
  });

  it("offers a capped food to a bird exactly when the record has a cap for it", () => {
    for (const id of cappedIds) {
      for (const bird of birds) {
        expect([id, bird, isIngredientCompatible(id, bird)]).toEqual([id, bird, INGREDIENTS[id].maxSharePercent?.[bird] !== undefined]);
      }
    }
  });

  it("the optimizer never exceeds the cap, even when the inventory could fill the whole mix", async () => {
    const highs = await createHighs();
    const bird: BirdType = "parrot";
    const candidates = buildBrowserOptimizerCandidates({ wheat: 600, sunflower: 600, almonds: 1000 }, bird);
    expect(candidates.find(({ id }) => id === "almonds")?.maxSharePercent).toBe(5);
    const model = buildExactFeasibilityModel({
      candidates,
      requestedTargetGrams: 1000,
      macroRanges: { protein: [0, 100], carbs: [0, 100], fat: [0, 100], fiber: [0, 100] },
      categoryRanges: { grain: [0, 100], legume: [0, 100], seed: [0, 100] },
    });
    expect(model.candidates.find(({ id }) => id === "almonds")?.availableGrams).toBe(50);
    const lp = renderOptimizerStageLp(model, { sense: "maximize", objectiveName: "almonds_max", objective: "x_almonds", includeTargetRows: false, includeInclusionLinks: false });
    const solved = highs.solve(lp);
    expect(solved.Status).toBe("Optimal");
    expect(solved.Columns.x_almonds.Primal).toBeCloseTo(50, 6);
  });

  it("the optimizer applies the cap to the achievable mix when inventory is short", () => {
    const candidates = buildBrowserOptimizerCandidates({ wheat: 200, almonds: 1000 }, "pigeon");
    const model = buildExactFeasibilityModel({
      candidates,
      requestedTargetGrams: 1000,
      macroRanges: { protein: [0, 100], carbs: [0, 100], fat: [0, 100], fiber: [0, 100] },
      categoryRanges: { grain: [0, 100], legume: [0, 100], seed: [0, 100] },
    });
    // 1,200 g in stock, 1,000 g requested: the cap is 2 % of 1,000 g.
    expect(model.candidates.find(({ id }) => id === "almonds")?.availableGrams).toBe(20);
  });

  it("the greedy calculator never exceeds the cap", () => {
    const result = new MultibirMixCalculator({ wheat: 600, corn_yellow: 300, peas: 300, sunflower: 300, almonds: 1000 }, "parrot", "pet").calculate(1000);
    expect(result.mix.almonds ?? 0).toBeLessThanOrEqual(50.001);
  });

  it("is not offered to birds without a cap (canary: almonds and pine nuts, African Grey: pine nuts)", () => {
    const canary = new MultibirMixCalculator({ millet: 500, oats: 300, almonds: 200 }, "canary", "pet").calculate(500);
    expect(canary.mix.almonds).toBeUndefined();
    expect(canary.warnings.some(({ message }) => message.includes("almonds was excluded"))).toBe(true);
    const grey = new MultibirMixCalculator({ wheat: 500, sunflower: 300, pine_nuts: 200 }, "african_grey", "pet").calculate(500);
    expect(grey.mix.pine_nuts).toBeUndefined();
  });
});
