import { afterEach, describe, expect, it, vi } from "vitest";

import { installOptimizerWorkerScope, OptimizerWorkerController, type OptimizerWorkerScopeLike, type OptimizerWorkerTransport } from "./optimizer-worker-controller";

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

  it("handles executor errors and thrown exceptions deterministically", async () => {
    const messages: unknown[] = [];
    let throwError = false;
    let throwNonError = false;

    const controller = new OptimizerWorkerController(
      { postMessage: (message) => messages.push(message) },
      async () => {
        if (throwError) throw new Error("Executor crashed");
        if (throwNonError) throw "Non-error failure";
        return { status: "error", quantities: {}, errorMessage: "Solver execution error" };
      },
      100,
    );

    controller.receive(request);
    await Promise.resolve();

    throwError = true;
    controller.receive({ ...request, requestId: "request-2" });
    await Promise.resolve();

    throwError = false;
    throwNonError = true;
    controller.receive({ ...request, requestId: "request-3" });
    await Promise.resolve();

    expect(messages).toEqual([
      expect.objectContaining({ requestId: "request-1", status: "error", errorMessage: "Solver execution error" }),
      expect.objectContaining({ requestId: "request-2", status: "error", errorMessage: "Executor crashed" }),
      expect.objectContaining({ requestId: "request-3", status: "error", errorMessage: "Unknown optimizer worker error" }),
    ]);
  });

  it("supports request sequencing and requestId reuse after completion or cancellation", async () => {
    const messages: unknown[] = [];
    const controller = new OptimizerWorkerController(
      { postMessage: (message) => messages.push(message) },
      async (req) => ({ status: "optimal", quantities: { wheat: req.requestId === "req-1" ? 100 : 200 } }),
      100,
    );

    // Sequential requests req-1, req-2
    controller.receive({ ...request, requestId: "req-1" });
    await Promise.resolve();

    controller.receive({ ...request, requestId: "req-2" });
    await Promise.resolve();

    // Cancel req-3, then reuse req-3
    const pending = deferred<{ status: "optimal"; quantities: Record<string, number> }>();
    const cancelController = new OptimizerWorkerController(
      { postMessage: (message) => messages.push(message) },
      async () => pending.promise,
      100,
    );

    cancelController.receive({ ...request, requestId: "req-3" });
    cancelController.cancel("req-3");

    // Reuse req-1 on initial controller
    controller.receive({ ...request, requestId: "req-1" });
    await Promise.resolve();

    expect(messages).toEqual([
      expect.objectContaining({ requestId: "req-1", status: "optimal", quantities: { wheat: 100 } }),
      expect.objectContaining({ requestId: "req-2", status: "optimal", quantities: { wheat: 200 } }),
      { type: "cancelled", requestId: "req-3" },
      expect.objectContaining({ requestId: "req-1", status: "optimal", quantities: { wheat: 100 } }),
    ]);
  });

  it("installs event listeners on scope and dispatches incoming messages to controller", () => {
    const messages: unknown[] = [];
    let messageListener: ((event: { data: unknown }) => void) | undefined;

    const mockScope: OptimizerWorkerScopeLike = {
      addEventListener: (_type, listener) => {
        messageListener = listener as (event: { data: unknown }) => void;
      },
      postMessage: (message) => messages.push(message),
    };

    const controller = new OptimizerWorkerController(
      mockScope,
      async () => ({ status: "optimal", quantities: { corn: 50 } }),
      100,
    );

    installOptimizerWorkerScope(mockScope, controller);

    expect(messageListener).toBeDefined();
    messageListener!({ data: request });

    return Promise.resolve().then(() => {
      expect(messages).toEqual([
        expect.objectContaining({ type: "result", requestId: "request-1", status: "optimal", quantities: { corn: 50 } }),
      ]);
    });
  });

  it("cancels all active requests on dispose", () => {
    const messages: unknown[] = [];
    const controller = new OptimizerWorkerController(
      { postMessage: (message) => messages.push(message) },
      async () => new Promise(() => undefined), // never resolves
      100,
    );

    controller.receive({ ...request, requestId: "req-a" });
    controller.receive({ ...request, requestId: "req-b" });
    controller.dispose();

    expect(messages).toEqual([
      { type: "cancelled", requestId: "req-a" },
      { type: "cancelled", requestId: "req-b" },
    ]);
  });
});
