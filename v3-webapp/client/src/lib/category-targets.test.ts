import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import { BIRD_PROFILES, BIRD_TYPES, DEFAULT_CATEGORY_TARGETS, getCategoryTargets } from "./birds";
import { MultibirMixCalculator } from "./calculator-multi-bird";
import { INGREDIENTS } from "./data";
import { getProfileDefaultIngredients } from "./inventory-presets";
import { buildExactFeasibilityModel, type OptimizerCandidate } from "./optimizer-model";

const require = createRequire(import.meta.url);
const createHighs = require("highs") as () => Promise<{ solve: (model: string) => { Status: string } }>;

const PIGEON_HIGH_LEGUME = { grain: [40, 50], legume: [40, 50], seed: [5, 10] };
const SHARED_PIGEON = { grain: [55, 70], legume: [15, 25], seed: [5, 15] };
const categoryKeys = ["grain", "legume", "seed"] as const;

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

describe("per-profile mix (grain / legume / seed) targets", () => {
  it("keeps today's per-bird mix target for every profile except pigeon racing and molting", () => {
    for (const bird of BIRD_TYPES) {
      for (const situation of Object.keys(BIRD_PROFILES[bird].profiles)) {
        const overridden = bird === "pigeon" && (situation === "racing" || situation === "molting");
        if (overridden) continue;
        expect(getCategoryTargets(bird, situation), `${bird}/${situation}`).toEqual(DEFAULT_CATEGORY_TARGETS[bird]);
      }
    }
  });

  it("gives pigeon racing and molting the high-legume mix target (issue #247)", () => {
    expect(getCategoryTargets("pigeon", "racing")).toEqual(PIGEON_HIGH_LEGUME);
    expect(getCategoryTargets("pigeon", "molting")).toEqual(PIGEON_HIGH_LEGUME);
  });

  it("leaves the shared pigeon default and the situation-less call unchanged", () => {
    expect(DEFAULT_CATEGORY_TARGETS.pigeon).toEqual(SHARED_PIGEON);
    expect(getCategoryTargets("pigeon")).toEqual(SHARED_PIGEON);
    expect(getCategoryTargets("pigeon", "unknown-situation")).toEqual(SHARED_PIGEON);
    for (const situation of ["maintenance", "breeding", "winter", "pet"]) {
      expect(getCategoryTargets("pigeon", situation)).toEqual(SHARED_PIGEON);
    }
  });

  it("makes the exact optimizer model feasible for the standard racing and molting formulas, which the shared target did not", async () => {
    const highs = await createHighs();
    for (const situation of ["racing", "molting"]) {
      const build = (categoryRanges: typeof SHARED_PIGEON | ReturnType<typeof getCategoryTargets>) => buildExactFeasibilityModel({
        candidates: candidatesFor(situation),
        requestedTargetGrams: 1000,
        macroRanges: BIRD_PROFILES.pigeon.profiles[situation].nutrition,
        categoryRanges,
      });
      expect(highs.solve(build(getCategoryTargets("pigeon", situation)).lp).Status, `${situation} with its own mix target`).toBe("Optimal");
      expect(highs.solve(build(SHARED_PIGEON).lp).Status, `${situation} with the shared mix target`).not.toBe("Optimal");
    }
  });

  it("makes the greedy fallback calculator land inside the racing and molting mix targets for the standard formulas", () => {
    for (const situation of ["racing", "molting"]) {
      const result = new MultibirMixCalculator(getProfileDefaultIngredients("pigeon", situation), "pigeon", situation).calculate(1000);
      const mixTargets = getCategoryTargets("pigeon", situation);
      const detail = `${situation} mix=${JSON.stringify(result.mix)} categories=${JSON.stringify(result.categories)}`;

      // Only the mix targets are asserted: this fallback engine can slightly overshoot a nutrient range
      // (racing fibre 5.48% against 0-5%, molting protein 18.26% against 16-18%); the exact optimizer
      // above is the engine that finds the fully feasible mix.
      for (const key of categoryKeys) {
        expect(result.categories[key], `${key}: ${detail}`).toBeGreaterThanOrEqual(mixTargets[key][0] - 0.001);
        expect(result.categories[key], `${key}: ${detail}`).toBeLessThanOrEqual(mixTargets[key][1] + 0.001);
      }
      expect(result.warnings.filter((warning) => /ratio is/.test(warning.message)), detail).toEqual([]);
    }
  });
});
