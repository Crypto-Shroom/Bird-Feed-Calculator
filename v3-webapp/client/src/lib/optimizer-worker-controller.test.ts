import { afterEach, describe, expect, it, vi } from "vitest";

import { OptimizerWorkerController, type OptimizerWorkerTransport } from "./optimizer-worker-controller";

const request = {
  type: "solve" as const,
  requestId: "request-1",
  model: { lp: "Minimize\n proof: 0\nEnd", candidates: [], achievableTargetGrams: 1, policy: { gramIncrement: 1, meaningfulInclusionGrams: 5, exactMarginTolerance: 0, macroDistanceTolerance: 0, categoryDistanceTolerance: 0, maximumShareToleranceGrams: 0, canonicalCandidateOrder: "ingredient_id_ascending" as const } },
  createdAtMs: 0,
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((nextResolve) => { resolve = nextResolve; });
  return { promise, resolve };
}

describe("isolated optimizer worker lifecycle controller", () => {
  afterEach(() => vi.useRealTimers());

  it("posts one deterministic terminal optimal response", async () => {
    const messages: unknown[] = [];
    const controller = new OptimizerWorkerController(
      { postMessage: (message) => messages.push(message) },
      async () => ({ status: "optimal", quantities: { wheat: 1 }, solverStatus: "Optimal", mipGap: 0 }),
      100,
    );

    controller.receive(request);
    await Promise.resolve();

    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({ type: "result", requestId: "request-1", status: "optimal", quantities: { wheat: 1 } });
  });

  it("posts cancellation once and suppresses a late solver completion", async () => {
    const messages: unknown[] = [];
    const pending = deferred<{ status: "optimal"; quantities: Record<string, number> }>();
    const controller = new OptimizerWorkerController(
      { postMessage: (message) => messages.push(message) },
      async () => pending.promise,
      100,
    );

    controller.receive(request);
    controller.receive({ type: "cancel", requestId: "request-1" });
    pending.resolve({ status: "optimal", quantities: { wheat: 1 } });
    await Promise.resolve();

    expect(messages).toEqual([{ type: "cancelled", requestId: "request-1" }]);
  });

  it("returns explicit malformed and duplicate-request errors", async () => {
    const messages: unknown[] = [];
    const pending = deferred<{ status: "optimal"; quantities: Record<string, number> }>();
    const controller = new OptimizerWorkerController(
      { postMessage: (message) => messages.push(message) },
      async () => pending.promise,
      100,
    );

    controller.receive({ not: "a request" });
    controller.receive(request);
    controller.receive(request);
    controller.cancel("request-1");

    expect(messages).toEqual([
      expect.objectContaining({ requestId: "invalid-request", status: "error", errorMessage: "Malformed optimizer worker message" }),
      expect.objectContaining({ requestId: "request-1", status: "error", errorMessage: "Duplicate optimizer worker request id" }),
      { type: "cancelled", requestId: "request-1" },
    ]);
  });

  it("posts an explicit timeout and suppresses a late worker completion", async () => {
    vi.useFakeTimers();
    const messages: unknown[] = [];
    const pending = deferred<{ status: "optimal"; quantities: Record<string, number> }>();
    const transport: OptimizerWorkerTransport = { postMessage: (message) => messages.push(message) };
    const controller = new OptimizerWorkerController(transport, async () => pending.promise, 10);

    controller.receive(request);
    await vi.advanceTimersByTimeAsync(10);
    pending.resolve({ status: "optimal", quantities: { wheat: 1 } });
    await Promise.resolve();

    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({ type: "result", requestId: "request-1", status: "timeout", quantities: {} });
  });
});
