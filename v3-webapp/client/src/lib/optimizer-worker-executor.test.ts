import { describe, expect, it } from "vitest";

import { buildExactFeasibilityModel } from "./optimizer-model";
import { createBrowserLocalSolverExecutor } from "./optimizer-worker-executor";

const model = buildExactFeasibilityModel({
  candidates: [
    { id: "barley", category: "grain", availableGrams: 500, nutrition: { protein: 11, carbs: 73, fat: 2, fiber: 5 }, safetyState: "eligible" },
    { id: "peas", category: "legume", availableGrams: 500, nutrition: { protein: 23, carbs: 60, fat: 1.5, fiber: 5 }, safetyState: "eligible" },
    { id: "sunflower", category: "seed", availableGrams: 500, nutrition: { protein: 20, carbs: 20, fat: 51, fiber: 9 }, safetyState: "eligible" },
  ],
  requestedTargetGrams: 1_000,
  macroRanges: { protein: [0, 100], carbs: [0, 100], fat: [0, 100], fiber: [0, 100] },
  categoryRanges: { grain: [0, 100], legume: [0, 100], seed: [0, 100] },
});

function request() {
  return { type: "solve" as const, requestId: "runtime-test", model, createdAtMs: 0 };
}

describe("browser-local optimizer Worker executor", () => {
  it("loads the local wasm resolver once and returns named raw quantities for an optimal solve", async () => {
    const locateFiles: string[] = [];
    let loadCount = 0;
    const executor = createBrowserLocalSolverExecutor({
      loadHighs: async ({ locateFile }) => {
        loadCount += 1;
        locateFiles.push(locateFile("highs.wasm"));
        return {
          solve: () => ({
            Status: "Optimal",
            Columns: {
              barley: { Primal: 500 },
              peas: { Primal: 400 },
              sunflower: { Primal: 100 },
            },
          }),
        };
      },
    });

    const first = await executor(request(), { isCancelled: () => false });
    const second = await executor({ ...request(), requestId: "runtime-test-2" }, { isCancelled: () => false });

    expect(first).toMatchObject({ status: "optimal", quantities: { barley: 500, peas: 400, sunflower: 100 }, solverStatus: "Optimal" });
    expect(second.status).toBe("optimal");
    expect(loadCount).toBe(1);
    expect(locateFiles[0]).toMatch(/highs\.wasm/);
  });

  it("maps infeasible, bounded-time, and unsupported solver statuses without manufacturing quantities", async () => {
    for (const [highsStatus, expectedStatus] of [
      ["Infeasible", "infeasible"],
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

  it("does not load or solve after cancellation", async () => {
    let loaded = false;
    const executor = createBrowserLocalSolverExecutor({
      loadHighs: async () => {
        loaded = true;
        throw new Error("should not load");
      },
    });

    await expect(executor(request(), { isCancelled: () => true })).resolves.toMatchObject({ status: "cancelled", quantities: {} });
    expect(loaded).toBe(false);
  });
});
