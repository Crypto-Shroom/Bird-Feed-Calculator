import { describe, expect, it } from "vitest";

import { buildBrowserOptimizerCandidates, startBrowserLocalOptimizerSolve, type BrowserOptimizerWorker } from "./optimizer-runtime";

class FakeWorker implements BrowserOptimizerWorker {
  public readonly sent: unknown[] = [];
  public onmessage: ((event: { data: unknown }) => void) | null = null;
  public onerror: ((event: { message?: string }) => void) | null = null;
  public terminated = false;

  public postMessage(message: unknown): void {
    this.sent.push(message);
  }

  public terminate(): void {
    this.terminated = true;
  }

  public respond(data: unknown): void {
    this.onmessage?.({ data });
  }
}

const input = {
  requestId: "browser-runtime-test",
  bird: "chicken" as const,
  inventory: { barley: 500, peas: 400, sunflower: 100 },
  requestedTargetGrams: 1_000,
  macroRanges: { protein: [0, 100], carbs: [0, 100], fat: [0, 100], fiber: [0, 100] } as const,
  categoryRanges: { grain: [0, 100], legume: [0, 100], seed: [0, 100] } as const,
};

describe("browser-local optimizer runtime adapter", () => {
  it("safety-gates original catalog keys before aggregating split lentils into one canonical candidate", () => {
    const candidates = buildBrowserOptimizerCandidates({ lentils: 275, split_lentils: 125, kidney_beans: 500 }, "chicken");

    expect(candidates).toEqual([{
      id: "lentils",
      category: "legume",
      availableGrams: 400,
      nutrition: { protein: 25, carbs: 63, fat: 1, fiber: 8 },
      safetyState: "eligible",
      sourceIngredientIds: ["lentils", "split_lentils"],
    }]);
  });

  it("connects a matching Worker optimum to the strict result adapter and terminates the local Worker", async () => {
    const worker = new FakeWorker();
    const handle = startBrowserLocalOptimizerSolve(input, { createWorker: () => worker });

    const solveMessage = worker.sent[0] as { model: { candidates: Array<{ id: string }> } };
    expect(solveMessage.model.candidates.map(({ id }) => id)).toEqual(["barley", "peas", "sunflower"]);
    worker.respond({
      type: "result",
      requestId: input.requestId,
      status: "optimal",
      quantities: { barley: 500, peas: 400, sunflower: 100 },
      elapsedMs: 8,
      solverStatus: "Optimal",
    });

    await expect(handle.result).resolves.toMatchObject({ status: "feasible", mix: { barley: 500, peas: 400, sunflower: 100 } });
    expect(worker.terminated).toBe(true);
  });

  it("preserves a validated non-feasible status instead of manufacturing an alternative mix", async () => {
    const worker = new FakeWorker();
    const handle = startBrowserLocalOptimizerSolve(input, { createWorker: () => worker });
    worker.respond({ type: "result", requestId: input.requestId, status: "timeout", quantities: {}, elapsedMs: 500, errorMessage: "time budget" });

    await expect(handle.result).resolves.toMatchObject({ status: "timeout", mix: {} });
  });

  it("sends cancellation to the Worker and accepts only its matching cancellation acknowledgement", async () => {
    const worker = new FakeWorker();
    const handle = startBrowserLocalOptimizerSolve(input, { createWorker: () => worker });
    handle.cancel();
    expect(worker.sent.at(-1)).toEqual({ type: "cancel", requestId: input.requestId });
    worker.respond({ type: "cancelled", requestId: input.requestId });

    await expect(handle.result).resolves.toMatchObject({ status: "cancelled", mix: {} });
  });
});
