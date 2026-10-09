import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

import { adaptExactFeasibilityResult } from "./optimizer-adapter";
import { buildExactFeasibilityModel } from "./optimizer-model";
import { createBrowserLocalSolverExecutor } from "./optimizer-worker-executor";

const require = createRequire(import.meta.url);
const createNodeHighs = require("highs") as () => Promise<{ solve: (problem: string, options?: object) => { Status: string; ObjectiveValue: number; Columns: Record<string, { Primal: number } | undefined> } }>;

const openMacroRanges = { protein: [0, 100], carbs: [0, 100], fat: [0, 100], fiber: [0, 100] } as const;
const openCategoryRanges = { grain: [0, 100], legume: [0, 100], seed: [0, 100] } as const;

const model = buildExactFeasibilityModel({
  candidates: [
    { id: "barley", category: "grain", availableGrams: 500, nutrition: { protein: 11, carbs: 73, fat: 2, fiber: 5 }, safetyState: "eligible" },
    { id: "peas", category: "legume", availableGrams: 500, nutrition: { protein: 23, carbs: 60, fat: 1.5, fiber: 5 }, safetyState: "eligible" },
    { id: "sunflower", category: "seed", availableGrams: 500, nutrition: { protein: 20, carbs: 20, fat: 51, fiber: 9 }, safetyState: "eligible" },
  ],
  requestedTargetGrams: 1_000,
  macroRanges: openMacroRanges,
  categoryRanges: openCategoryRanges,
});

function request() {
  return { type: "solve" as const, requestId: "runtime-test", model, createdAtMs: 0 };
}

const optimalMockSolution = {
  Status: "Optimal",
  ObjectiveValue: 0,
  // HiGHS names columns exactly as the LP declares them.
  Columns: {
    x_barley: { Primal: 500 },
    x_peas: { Primal: 400 },
    x_sunflower: { Primal: 100 },
    M: { Primal: 500 },
  },
};

describe("browser-local optimizer Worker executor", () => {
  it("loads the local wasm resolver once and returns quantities read from the model's x_<id> LP columns", async () => {
    const locateFiles: string[] = [];
    let loadCount = 0;
    const executor = createBrowserLocalSolverExecutor({
      loadHighs: async ({ locateFile }) => {
        loadCount += 1;
        locateFiles.push(locateFile("highs.wasm"));
        return { solve: () => optimalMockSolution };
      },
    });

    const first = await executor(request(), { isCancelled: () => false });
    const second = await executor({ ...request(), requestId: "runtime-test-2" }, { isCancelled: () => false });

    expect(model.candidates.map(({ quantityVariable }) => quantityVariable)).toEqual(["x_barley", "x_peas", "x_sunflower"]);
    expect(first).toMatchObject({ status: "optimal", quantities: { barley: 500, peas: 400, sunflower: 100 }, solverStatus: "Optimal" });
    expect(second.status).toBe("optimal");
    expect(loadCount).toBe(1);
    expect(locateFiles[0]).toMatch(/highs\.wasm/);
  });

  it("solves a small model with real Node HiGHS through the production executor and returns finite whole grams (issue #211)", async () => {
    const executor = createBrowserLocalSolverExecutor({ loadHighs: () => createNodeHighs() });
    const result = await executor(request(), { isCancelled: () => false });

    expect(result.status).toBe("optimal");
    const quantities = model.candidates.map(({ id }) => result.quantities[id]);
    expect(quantities).toHaveLength(3);
    quantities.forEach((quantity) => {
      expect(Number.isFinite(quantity)).toBe(true);
      expect(Number.isInteger(quantity)).toBe(true);
    });
    expect(quantities.reduce((total, quantity) => total + quantity, 0)).toBe(1_000);
    expect(result.stages?.every((stage) => stage.solverStatus === "Optimal" || stage.solverStatus === "Skipped")).toBe(true);

    const adapted = adaptExactFeasibilityResult(
      { type: "result", requestId: "runtime-test", elapsedMs: 1, ...result },
      model,
      1_000,
      openMacroRanges,
      openCategoryRanges,
    );
    expect(adapted.status).toBe("feasible");
  });

  it("returns no quantities when any stage fails, times out, or reports an unsupported status", async () => {
    for (const [highsStatus, expectedStatus] of [
      // Stage 1 infeasible moves to the fallback branch; a fallback stage can never be infeasible, so this is an error.
      ["Infeasible", "error"],
      ["Time limit reached", "timeout"],
      ["Unknown", "error"],
    ] as const) {
      const executor = createBrowserLocalSolverExecutor({
        loadHighs: async () => ({ solve: () => ({ Status: highsStatus, Columns: {} }) }),
      });
      const result = await executor(request(), { isCancelled: () => false });
      expect(result.status).toBe(expectedStatus);
      expect(result.quantities).toEqual({});
    }
  });

  it("never returns a half-optimized mix when a later stage reaches the time limit", async () => {
    let calls = 0;
    const executor = createBrowserLocalSolverExecutor({
      loadHighs: async () => ({
        solve: () => {
          calls += 1;
          return calls < 3 ? optimalMockSolution : { Status: "Time limit reached", Columns: optimalMockSolution.Columns };
        },
      }),
    });
    const result = await executor(request(), { isCancelled: () => false });

    expect(result).toMatchObject({ status: "timeout", quantities: {} });
    expect(result.stages?.map(({ stage }) => stage)).toEqual(["macro_margin", "maximum_share", "meaningful_diversity"]);
  });

  it("stops with timeout once the shared stage budget is spent, even if each stage reports Optimal", async () => {
    let clock = 0;
    const executor = createBrowserLocalSolverExecutor({
      timeLimitMs: 100,
      now: () => clock,
      loadHighs: async () => ({
        solve: () => {
          clock += 40;
          return optimalMockSolution;
        },
      }),
    });
    const result = await executor(request(), { isCancelled: () => false });

    expect(result).toMatchObject({ status: "timeout", quantities: {} });
    expect(result.errorMessage).toContain("100 ms budget");
  });

  it("does not load or solve after cancellation, and stops between stages when cancelled mid-sequence", async () => {
    let loaded = false;
    const executor = createBrowserLocalSolverExecutor({
      loadHighs: async () => {
        loaded = true;
        throw new Error("should not load");
      },
    });

    await expect(executor(request(), { isCancelled: () => true })).resolves.toMatchObject({ status: "cancelled", quantities: {} });
    expect(loaded).toBe(false);

    let cancelled = false;
    let calls = 0;
    const midSequence = createBrowserLocalSolverExecutor({
      loadHighs: async () => ({
        solve: () => {
          calls += 1;
          if (calls === 2) cancelled = true;
          return optimalMockSolution;
        },
      }),
    });
    await expect(midSequence(request(), { isCancelled: () => cancelled })).resolves.toMatchObject({ status: "cancelled", quantities: {} });
    expect(calls).toBe(2);
  });
});
