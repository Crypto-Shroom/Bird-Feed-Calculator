import { createRequire } from "node:module";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BIRD_PROFILES, getCategoryTargets } from "./birds";
import { getProfileDefaultIngredients } from "./inventory-presets";
import { createSerialSolverExecutor, type HighsSolverLike } from "./optimizer-serial-solver";
import { OptimizerWorkerController } from "./optimizer-worker-controller";

import {
  buildBrowserOptimizerCandidates,
  createBrowserOptimizerSession,
  startBrowserLocalOptimizerSolve,
  type BrowserOptimizerWorker,
} from "./optimizer-runtime";
import {
  clearLocalOptimizerRuntimeDiagnosticsForTest,
  getLocalOptimizerRuntimeDiagnostics,
} from "./optimizer-runtime-diagnostics";

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

  /** Wire id of the n-th solve message this Worker received (0-based). */
  public solveId(index = 0): string {
    const solves = this.sent.filter((message) => (message as { type?: string }).type === "solve") as Array<{ requestId: string }>;
    return solves[index].requestId;
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
  it("records only terminal status and elapsed timing in the bounded local diagnostic buffer", async () => {
    clearLocalOptimizerRuntimeDiagnosticsForTest();
    const worker = new FakeWorker();
    const handle = startBrowserLocalOptimizerSolve(input, { createWorker: () => worker });
    worker.respond({ type: "result", requestId: worker.solveId(), status: "timeout", quantities: {}, elapsedMs: 500 });

    await handle.result;
    expect(getLocalOptimizerRuntimeDiagnostics()).toEqual([{
      status: "timeout",
      elapsedMs: 500,
    }]);
    expect(JSON.stringify(getLocalOptimizerRuntimeDiagnostics())).not.toContain("barley");
    expect(JSON.stringify(getLocalOptimizerRuntimeDiagnostics())).not.toContain(input.requestId);
  });

  it("safety-gates original catalog keys before aggregating split lentils into one canonical candidate", () => {
    const candidates = buildBrowserOptimizerCandidates({ lentils: 275, split_lentils: 125, kidney_beans: 500 }, "chicken");

    expect(candidates).toEqual([{
      id: "lentils",
      category: "legume",
      availableGrams: 400,
      nutrition: { protein: 25, carbs: 63, fat: 1, fiber: 4.3 },
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
      requestId: worker.solveId(),
      status: "optimal",
      quantities: { barley: 500, peas: 400, sunflower: 100 },
      elapsedMs: 8,
      solverStatus: "Optimal",
    });

    await expect(handle.result).resolves.toMatchObject({
      status: "feasible",
      mix: { barley: 500, peas: 400, sunflower: 100 },
      diagnostics: { requestId: input.requestId },
    });
    expect(worker.terminated).toBe(true);
  });

  it("preserves a validated non-feasible status instead of manufacturing an alternative mix", async () => {
    const worker = new FakeWorker();
    const handle = startBrowserLocalOptimizerSolve(input, { createWorker: () => worker });
    worker.respond({ type: "result", requestId: worker.solveId(), status: "timeout", quantities: {}, elapsedMs: 500, errorMessage: "time budget" });

    await expect(handle.result).resolves.toMatchObject({ status: "timeout", mix: {} });
  });

  it("sends cancellation to the Worker and accepts only its matching cancellation acknowledgement", async () => {
    const worker = new FakeWorker();
    const handle = startBrowserLocalOptimizerSolve(input, { createWorker: () => worker });
    handle.cancel();
    expect(worker.sent.at(-1)).toEqual({ type: "cancel", requestId: worker.solveId() });
    worker.respond({ type: "cancelled", requestId: worker.solveId() });

    await expect(handle.result).resolves.toMatchObject({ status: "cancelled", mix: {} });
  });

  it("solves identical-nutrition variants as one candidate and still shows each entered variant in the mix", async () => {
    const worker = new FakeWorker();
    const handle = startBrowserLocalOptimizerSolve(
      { ...input, requestId: "corn-variants", inventory: { corn_yellow: 300, maize: 300, peas: 400 } },
      { createWorker: () => worker },
    );
    const solveMessage = worker.sent[0] as { model: { candidates: Array<{ id: string; availableGrams: number }> } };
    expect(solveMessage.model.candidates.map(({ id, availableGrams }) => [id, availableGrams])).toEqual([["corn_red", 600], ["peas", 400]]);
    worker.respond({ type: "result", requestId: worker.solveId(), status: "optimal", quantities: { corn_red: 600, peas: 400 }, elapsedMs: 3 });

    await expect(handle.result).resolves.toMatchObject({ status: "feasible", mix: { corn_yellow: 300, maize: 300, peas: 400 } });
  });
});

describe("best-attainable runtime result", () => {
  it("returns the fallback mix in the visitor's variants with a proven explanation of every missed range", async () => {
    const worker = new FakeWorker();
    const handle = startBrowserLocalOptimizerSolve({
      requestId: "pigeon-grains",
      bird: "pigeon",
      inventory: { wheat: 600, corn_yellow: 400 },
      requestedTargetGrams: 1_000,
      macroRanges: BIRD_PROFILES.pigeon.profiles.pet.nutrition,
      categoryRanges: getCategoryTargets("pigeon"),
    }, { createWorker: () => worker });
    worker.respond({ type: "result", requestId: worker.solveId(), status: "best_attainable", quantities: { corn_red: 400, wheat: 600 }, elapsedMs: 5 });

    const result = await handle.result;
    expect(result).toMatchObject({ status: "best_attainable", mix: { corn_yellow: 400, wheat: 600 } });
    expect(result.fallbackExplanation?.misses.map(({ key, reason }) => `${key}:${reason}`)).toEqual(expect.arrayContaining([
      "carbs:no_ingredient_reaches",
      "legume:not_enough_stock",
      "seed:not_enough_stock",
    ]));
  });
});

describe("reused browser optimizer Worker session", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const optimal = (worker: FakeWorker, index: number) => worker.respond({
    type: "result",
    requestId: worker.solveId(index),
    status: "optimal",
    quantities: { barley: 500, peas: 400, sunflower: 100 },
    elapsedMs: 4,
  });

  it("keeps one Worker (and its loaded solver) alive across successive solves", async () => {
    const workers: FakeWorker[] = [];
    const session = createBrowserOptimizerSession({ createWorker: () => { const worker = new FakeWorker(); workers.push(worker); return worker; } });

    const first = startBrowserLocalOptimizerSolve({ ...input, requestId: "first" }, { session });
    optimal(workers[0], 0);
    await expect(first.result).resolves.toMatchObject({ status: "feasible", diagnostics: { requestId: "first" } });
    const second = startBrowserLocalOptimizerSolve({ ...input, requestId: "second" }, { session });
    optimal(workers[0], 1);
    await expect(second.result).resolves.toMatchObject({ status: "feasible", diagnostics: { requestId: "second" } });

    expect(workers).toHaveLength(1);
    expect(workers[0].terminated).toBe(false);
    session.dispose();
    expect(workers[0].terminated).toBe(true);
  });

  it("gives every solve a unique wire id so a late answer for a superseded solve cannot settle the newer one", async () => {
    const worker = new FakeWorker();
    const session = createBrowserOptimizerSession({ createWorker: () => worker });
    const stale = startBrowserLocalOptimizerSolve({ ...input, requestId: "same" }, { session });
    stale.cancel();
    const fresh = startBrowserLocalOptimizerSolve({ ...input, requestId: "same" }, { session });
    expect(worker.solveId(0)).not.toBe(worker.solveId(1));

    // The superseded solve's answer arrives after the new request was sent.
    worker.respond({ type: "result", requestId: worker.solveId(0), status: "timeout", quantities: {}, elapsedMs: 9 });
    let freshSettled = false;
    void fresh.result.then(() => { freshSettled = true; });
    await Promise.resolve();
    await Promise.resolve();
    expect(freshSettled).toBe(false);

    optimal(worker, 1);
    await expect(fresh.result).resolves.toMatchObject({ status: "feasible", mix: { barley: 500, peas: 400, sunflower: 100 } });
    await expect(stale.result).resolves.toMatchObject({ status: "timeout" });
  });

  it("forwards cancellation to the shared Worker without terminating it", async () => {
    const worker = new FakeWorker();
    const session = createBrowserOptimizerSession({ createWorker: () => worker });
    const handle = startBrowserLocalOptimizerSolve(input, { session });
    handle.cancel();
    expect(worker.sent.at(-1)).toEqual({ type: "cancel", requestId: worker.solveId() });
    worker.respond({ type: "cancelled", requestId: worker.solveId() });

    await expect(handle.result).resolves.toMatchObject({ status: "cancelled", mix: {} });
    expect(worker.terminated).toBe(false);
  });

  it("replaces a Worker that stops answering and fails its pending solves as a timeout", async () => {
    vi.useFakeTimers();
    const workers: FakeWorker[] = [];
    const session = createBrowserOptimizerSession({
      createWorker: () => { const worker = new FakeWorker(); workers.push(worker); return worker; },
      responseTimeoutMs: 2_000,
    });
    const stuck = startBrowserLocalOptimizerSolve(input, { session });
    vi.advanceTimersByTime(2_000);

    await expect(stuck.result).resolves.toMatchObject({ status: "timeout", mix: {} });
    expect(workers[0].terminated).toBe(true);
    // A late answer from the replaced Worker is ignored.
    workers[0].respond({ type: "result", requestId: workers[0].solveId(), status: "optimal", quantities: {}, elapsedMs: 1 });

    const next = startBrowserLocalOptimizerSolve(input, { session });
    expect(workers).toHaveLength(2);
    optimal(workers[1], 0);
    await expect(next.result).resolves.toMatchObject({ status: "feasible" });
  });

  it("replaces the Worker after a Worker error and settles its pending solves as solver errors", async () => {
    const workers: FakeWorker[] = [];
    const session = createBrowserOptimizerSession({ createWorker: () => { const worker = new FakeWorker(); workers.push(worker); return worker; } });
    const failed = startBrowserLocalOptimizerSolve(input, { session });
    workers[0].onerror?.({ message: "wasm trap" });

    await expect(failed.result).resolves.toMatchObject({ status: "solver_error", violations: ["solver:wasm trap"] });
    expect(workers[0].terminated).toBe(true);
    const next = startBrowserLocalOptimizerSolve(input, { session });
    expect(workers).toHaveLength(2);
    optimal(workers[1], 0);
    await expect(next.result).resolves.toMatchObject({ status: "feasible" });
  });

  it("solves repeatedly through one real Worker controller and one HiGHS load, and still honours cancellation", async () => {
    const require = createRequire(import.meta.url);
    const highs = await (require("highs") as () => Promise<HighsSolverLike>)();
    let loads = 0;
    let created = 0;
    const executor = createSerialSolverExecutor({ loadSolver: async () => { loads += 1; return highs; }, timeLimitMs: 30_000 });
    const createWorker = (): BrowserOptimizerWorker => {
      created += 1;
      const worker: BrowserOptimizerWorker = {
        onmessage: null,
        onerror: null,
        postMessage: (message) => setTimeout(() => controller.receive(structuredClone(message)), 0),
        terminate: () => controller.dispose(),
      };
      const controller = new OptimizerWorkerController(
        { postMessage: (response) => setTimeout(() => worker.onmessage?.({ data: structuredClone(response) }), 0) },
        executor,
        30_000,
      );
      return worker;
    };
    const session = createBrowserOptimizerSession({ createWorker, responseTimeoutMs: 30_000 });
    const chickenPet = {
      requestId: "chicken-pet",
      bird: "chicken" as const,
      inventory: getProfileDefaultIngredients("chicken", "pet"),
      requestedTargetGrams: 1_000,
      macroRanges: BIRD_PROFILES.chicken.profiles.pet.nutrition,
      categoryRanges: getCategoryTargets("chicken"),
    };

    const first = await startBrowserLocalOptimizerSolve(chickenPet, { session }).result;
    const second = await startBrowserLocalOptimizerSolve(chickenPet, { session }).result;
    const cancelled = startBrowserLocalOptimizerSolve(chickenPet, { session });
    cancelled.cancel();

    expect(first.status).toBe("feasible");
    expect(second.mix).toEqual(first.mix);
    await expect(cancelled.result).resolves.toMatchObject({ status: "cancelled" });
    expect(created).toBe(1);
    expect(loads).toBe(1);
    session.dispose();
  });
});
