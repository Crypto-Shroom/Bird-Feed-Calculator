import type { OptimizerWorkerCancelRequest, OptimizerWorkerRawResult, OptimizerWorkerRequest, OptimizerWorkerResponse, OptimizerWorkerSolveRequest } from "./optimizer-protocol";

export interface OptimizerWorkerExecutorResult {
  status: OptimizerWorkerRawResult["status"];
  quantities: Record<string, number>;
  mipGap?: number;
  solverStatus?: string;
  errorMessage?: string;
}

export interface OptimizerWorkerExecutionContext {
  isCancelled(): boolean;
}

export type OptimizerWorkerExecutor = (
  request: OptimizerWorkerSolveRequest,
  context: OptimizerWorkerExecutionContext,
) => Promise<OptimizerWorkerExecutorResult>;

export interface OptimizerWorkerTransport {
  postMessage(message: OptimizerWorkerResponse): void;
}

export interface OptimizerWorkerScopeLike extends OptimizerWorkerTransport {
  addEventListener(type: "message", listener: (event: { data: unknown }) => void): void;
}

interface ActiveRequest {
  cancelled: boolean;
  timedOut: boolean;
  timeoutHandle: ReturnType<typeof setTimeout>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSolveRequest(value: unknown): value is OptimizerWorkerSolveRequest {
  return isRecord(value)
    && value.type === "solve"
    && typeof value.requestId === "string"
    && value.requestId.length > 0
    && isRecord(value.model)
    && typeof value.createdAtMs === "number";
}

function isCancelRequest(value: unknown): value is OptimizerWorkerCancelRequest {
  return isRecord(value)
    && value.type === "cancel"
    && typeof value.requestId === "string"
    && value.requestId.length > 0;
}

function elapsedSince(startedAtMs: number): number {
  return Math.max(0, Date.now() - startedAtMs);
}

export class OptimizerWorkerController {
  private readonly activeRequests = new Map<string, ActiveRequest>();

  public constructor(
    private readonly transport: OptimizerWorkerTransport,
    private readonly execute: OptimizerWorkerExecutor,
    private readonly timeoutMs: number,
  ) {
    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new Error("worker timeout must be a positive finite number");
  }

  public receive(message: unknown): void {
    if (isCancelRequest(message)) {
      this.cancel(message.requestId);
      return;
    }
    if (isSolveRequest(message)) {
      void this.start(message);
      return;
    }
    this.transport.postMessage({
      type: "result",
      requestId: "invalid-request",
      status: "error",
      quantities: {},
      elapsedMs: 0,
      errorMessage: "Malformed optimizer worker message",
    });
  }

  public cancel(requestId: string): void {
    const active = this.activeRequests.get(requestId);
    if (!active) return;
    active.cancelled = true;
    clearTimeout(active.timeoutHandle);
    this.activeRequests.delete(requestId);
    this.transport.postMessage({ type: "cancelled", requestId });
  }

  public dispose(): void {
    Array.from(this.activeRequests.keys()).forEach((requestId) => this.cancel(requestId));
  }

  private async start(request: OptimizerWorkerSolveRequest): Promise<void> {
    if (this.activeRequests.has(request.requestId)) {
      this.transport.postMessage({
        type: "result",
        requestId: request.requestId,
        status: "error",
        quantities: {},
        elapsedMs: 0,
        errorMessage: "Duplicate optimizer worker request id",
      });
      return;
    }

    const startedAtMs = Date.now();
    const active: ActiveRequest = {
      cancelled: false,
      timedOut: false,
      timeoutHandle: setTimeout(() => {
        const current = this.activeRequests.get(request.requestId);
        if (!current || current.cancelled) return;
        current.timedOut = true;
        this.activeRequests.delete(request.requestId);
        this.transport.postMessage({
          type: "result",
          requestId: request.requestId,
          status: "timeout",
          quantities: {},
          elapsedMs: elapsedSince(startedAtMs),
          errorMessage: "Optimizer worker proof-of-concept timeout",
        });
      }, this.timeoutMs),
    };
    this.activeRequests.set(request.requestId, active);

    try {
      const outcome = await this.execute(request, { isCancelled: () => active.cancelled || active.timedOut });
      if (active.cancelled || active.timedOut || this.activeRequests.get(request.requestId) !== active) return;
      clearTimeout(active.timeoutHandle);
      this.activeRequests.delete(request.requestId);
      this.transport.postMessage({
        type: "result",
        requestId: request.requestId,
        elapsedMs: elapsedSince(startedAtMs),
        ...outcome,
      });
    } catch (error) {
      if (active.cancelled || active.timedOut || this.activeRequests.get(request.requestId) !== active) return;
      clearTimeout(active.timeoutHandle);
      this.activeRequests.delete(request.requestId);
      this.transport.postMessage({
        type: "result",
        requestId: request.requestId,
        status: "error",
        quantities: {},
        elapsedMs: elapsedSince(startedAtMs),
        errorMessage: error instanceof Error ? error.message : "Unknown optimizer worker error",
      });
    }
  }
}

export function installOptimizerWorkerScope(scope: OptimizerWorkerScopeLike, controller: OptimizerWorkerController): void {
  scope.addEventListener("message", (event) => controller.receive(event.data as OptimizerWorkerRequest));
}
