import { adaptExactFeasibilityResult, type AdaptedOptimizerResult } from "./optimizer-adapter";
import { checkBirdToxicity, isIngredientCompatible } from "./bird-safety";
import type { BirdType } from "./birds";
import { INGREDIENTS } from "./data";
import { explainBestAttainable } from "./optimizer-explain";
import { allocateCanonicalMixToInventoryForms } from "./optimizer-form-allocation";
import { canonicalizeOptimizerCandidates } from "./optimizer-ingredient-identity";
import { buildExactFeasibilityModel, type OptimizerCategory, type OptimizerMacro, type OptimizerModel, type OptimizerRange } from "./optimizer-model";
import { BROWSER_WORKER_RESPONSE_TIMEOUT_MS } from "./optimizer-policy";
import type { OptimizerWorkerRawResult, OptimizerWorkerResponse } from "./optimizer-protocol";
import { recordOptimizerRuntimeDiagnostic } from "./optimizer-runtime-diagnostics";
import { isToxicRaw, requiresVerifiedProcessing } from "./safety";

export interface BrowserOptimizerSolveInput {
  requestId: string;
  bird: BirdType;
  inventory: Readonly<Record<string, number>>;
  requestedTargetGrams: number;
  macroRanges: Record<OptimizerMacro, OptimizerRange>;
  categoryRanges: Record<OptimizerCategory, OptimizerRange>;
}

export interface BrowserOptimizerWorker {
  postMessage(message: unknown): void;
  terminate(): void;
  onmessage: ((event: { data: unknown }) => void) | null;
  onerror: ((event: { message?: string }) => void) | null;
}

export interface BrowserOptimizerRuntimeOptions {
  /**
   * The Worker session to run in. Omitted: the page-wide shared session, which
   * keeps one Worker (and its loaded HiGHS instance) alive across solves.
   */
  session?: BrowserOptimizerSession;
  /**
   * Test/harness hook: run this one solve in a private session around a Worker
   * from this factory, and terminate that Worker when the solve settles.
   */
  createWorker?: () => BrowserOptimizerWorker;
}

export interface BrowserOptimizerSolveHandle {
  result: Promise<AdaptedOptimizerResult>;
  cancel(): void;
}

export interface BrowserOptimizerSessionRun {
  result: Promise<OptimizerWorkerRawResult>;
  cancel(): void;
}

/**
 * One long-lived optimizer Worker shared by successive solves, so HiGHS and
 * its WebAssembly module load once per page instead of once per edit.
 */
export interface BrowserOptimizerSession {
  run(requestId: string, model: OptimizerModel): BrowserOptimizerSessionRun;
  /** Terminates the Worker (if any) and settles every pending solve as cancelled. */
  dispose(): void;
}

export interface BrowserOptimizerSessionOptions {
  createWorker?: () => BrowserOptimizerWorker;
  /** Main-thread guard; see BROWSER_WORKER_RESPONSE_TIMEOUT_MS. */
  responseTimeoutMs?: number;
}

function createDefaultWorker(): BrowserOptimizerWorker {
  return new Worker(new URL("./optimizer-worker.ts", import.meta.url), { type: "module" }) as unknown as BrowserOptimizerWorker;
}

interface PendingSessionRequest {
  requestId: string;
  resolve(raw: OptimizerWorkerRawResult): void;
  timer: ReturnType<typeof setTimeout>;
}

/**
 * Creates a Worker session. Each solve gets a unique wire id, so a late answer
 * for a superseded or cancelled solve can never settle a newer one. The
 * Worker is created lazily and replaced only after it errors or stops
 * answering; cancellation is forwarded to the Worker, which stops at its next
 * stage boundary and acknowledges.
 */
export function createBrowserOptimizerSession(options: BrowserOptimizerSessionOptions = {}): BrowserOptimizerSession {
  const createWorker = options.createWorker ?? createDefaultWorker;
  const responseTimeoutMs = options.responseTimeoutMs ?? BROWSER_WORKER_RESPONSE_TIMEOUT_MS;
  if (!Number.isFinite(responseTimeoutMs) || responseTimeoutMs <= 0) throw new Error("worker response timeout must be positive and finite");
  const pending = new Map<string, PendingSessionRequest>();
  let worker: BrowserOptimizerWorker | undefined;
  let sequence = 0;

  const settle = (wireId: string, raw: OptimizerWorkerRawResult): void => {
    const entry = pending.get(wireId);
    if (!entry) return;
    pending.delete(wireId);
    clearTimeout(entry.timer);
    entry.resolve({ ...raw, requestId: entry.requestId });
  };

  const settleAll = (status: OptimizerWorkerRawResult["status"], message: string): void => {
    Array.from(pending.keys()).forEach((wireId) => settle(wireId, rawResult(wireId, status, message)));
  };

  const discardWorker = (): void => {
    const current = worker;
    worker = undefined;
    if (!current) return;
    current.onmessage = null;
    current.onerror = null;
    current.terminate();
  };

  const ensureWorker = (): BrowserOptimizerWorker => {
    if (worker) return worker;
    const created = createWorker();
    created.onmessage = (event) => {
      if (worker !== created) return;
      const response = event.data as OptimizerWorkerResponse;
      if (response && typeof response === "object" && response.type === "cancelled" && typeof response.requestId === "string") {
        settle(response.requestId, rawResult(response.requestId, "cancelled"));
        return;
      }
      if (isRawResult(response)) settle(response.requestId, response);
    };
    created.onerror = (event) => {
      if (worker !== created) return;
      discardWorker();
      settleAll("error", event.message || "Browser optimizer worker error");
    };
    worker = created;
    return created;
  };

  return {
    run(requestId, model) {
      sequence += 1;
      const wireId = `${requestId}#${sequence}`;
      let resolveResult: (raw: OptimizerWorkerRawResult) => void = () => undefined;
      const result = new Promise<OptimizerWorkerRawResult>((resolve) => {
        resolveResult = resolve;
      });
      let target: BrowserOptimizerWorker;
      try {
        target = ensureWorker();
      } catch (error) {
        resolveResult(rawResult(requestId, "error", error instanceof Error ? error.message : "Browser optimizer worker could not start"));
        return { result, cancel: () => undefined };
      }
      pending.set(wireId, {
        requestId,
        resolve: resolveResult,
        timer: setTimeout(() => {
          if (!pending.has(wireId)) return;
          // The Worker has not answered at all: presume it is stuck in one long
          // solver call, replace it, and release every solve still waiting on it.
          discardWorker();
          settle(wireId, rawResult(wireId, "timeout", "Optimizer worker did not respond in time"));
          settleAll("cancelled", "Optimizer worker was restarted");
        }, responseTimeoutMs),
      });
      target.postMessage({ type: "solve", requestId: wireId, model, createdAtMs: Date.now() });
      return {
        result,
        cancel: () => {
          if (!pending.has(wireId) || worker !== target) return;
          target.postMessage({ type: "cancel", requestId: wireId });
        },
      };
    },
    dispose() {
      discardWorker();
      settleAll("cancelled", "Optimizer session was disposed");
    },
  };
}

let sharedSession: BrowserOptimizerSession | undefined;

/** The page-wide session used by Home.tsx: one Worker, one HiGHS load. */
export function getSharedBrowserOptimizerSession(): BrowserOptimizerSession {
  sharedSession ??= createBrowserOptimizerSession();
  return sharedSession;
}

function rawResult(
  requestId: string,
  status: OptimizerWorkerRawResult["status"],
  errorMessage?: string,
): OptimizerWorkerRawResult {
  return {
    type: "result",
    requestId,
    status,
    quantities: {},
    elapsedMs: 0,
    ...(errorMessage ? { errorMessage } : {}),
  };
}

function isRawResult(value: unknown): value is OptimizerWorkerRawResult {
  return typeof value === "object"
    && value !== null
    && (value as { type?: unknown }).type === "result"
    && typeof (value as { requestId?: unknown }).requestId === "string"
    && typeof (value as { status?: unknown }).status === "string"
    && typeof (value as { elapsedMs?: unknown }).elapsedMs === "number"
    && typeof (value as { quantities?: unknown }).quantities === "object";
}

/**
 * Builds Worker candidates from actual entered inventory only. Safety gates run
 * on each original catalog key before aliases aggregate, so canonicalization
 * cannot elevate a disallowed form into a safe solver candidate.
 */
export function buildBrowserOptimizerCandidates(
  inventory: Readonly<Record<string, number>>,
  bird: BirdType,
) {
  const safeCandidates = Object.entries(inventory)
    .sort(([left], [right]) => left.localeCompare(right))
    .flatMap(([id, availableGrams]) => {
      const ingredient = INGREDIENTS[id];
      if (!ingredient || !Number.isFinite(availableGrams) || availableGrams <= 0) return [];
      if (
        !isIngredientCompatible(id, bird)
        || checkBirdToxicity(id, bird)
        || isToxicRaw(id)
        || requiresVerifiedProcessing(id)
      ) {
        return [];
      }
      return [{
        id,
        category: ingredient.category,
        availableGrams: Math.floor(availableGrams),
        nutrition: {
          protein: ingredient.protein,
          carbs: ingredient.carbs,
          fat: ingredient.fat,
          fiber: ingredient.fiber,
        },
        safetyState: "eligible" as const,
      }];
    });

  return canonicalizeOptimizerCandidates(safeCandidates);
}

/**
 * Starts one browser-local serial staged solve. Home.tsx shows its synchronous
 * calculator output first and replaces it only with a validated `feasible` or
 * `best_attainable` result for the same inputs; every other status keeps the
 * synchronous mix.
 */
export function startBrowserLocalOptimizerSolve(
  input: BrowserOptimizerSolveInput,
  options: BrowserOptimizerRuntimeOptions = {},
): BrowserOptimizerSolveHandle {
  const startedAtMs = Date.now();
  let model: OptimizerModel;
  let eligibleSourceIds: ReadonlySet<string>;
  try {
    const candidates = buildBrowserOptimizerCandidates(input.inventory, input.bird);
    eligibleSourceIds = new Set(candidates.flatMap(({ sourceIngredientIds }) => sourceIngredientIds));
    model = buildExactFeasibilityModel({
      candidates,
      requestedTargetGrams: input.requestedTargetGrams,
      macroRanges: input.macroRanges,
      categoryRanges: input.categoryRanges,
    });
  } catch (error) {
    const elapsedMs = Date.now() - startedAtMs;
    const result: AdaptedOptimizerResult = {
      status: "solver_error",
      mix: {},
      diagnostics: {
        requestId: input.requestId,
        elapsedMs,
        requestedTargetGrams: input.requestedTargetGrams,
        achievableTargetGrams: 0,
        inventoryCapped: true,
      },
      violations: [error instanceof Error ? `setup:${error.message}` : "setup:unknown error"],
    };
    recordOptimizerRuntimeDiagnostic({ status: result.status, elapsedMs });
    return { result: Promise.resolve(result), cancel: () => undefined };
  }

  const privateSession = !options.session && options.createWorker
    ? createBrowserOptimizerSession({ createWorker: options.createWorker })
    : undefined;
  const session = options.session ?? privateSession ?? getSharedBrowserOptimizerSession();
  const run = session.run(input.requestId, model);

  const result = run.result.then((raw) => {
    privateSession?.dispose();
    const adapted = adaptExactFeasibilityResult(
      raw,
      model,
      input.requestedTargetGrams,
      input.macroRanges,
      input.categoryRanges,
    );
    const allocated = adapted.status === "feasible" || adapted.status === "best_attainable"
      ? (() => {
        try {
          const fallbackExplanation = adapted.status === "best_attainable"
            ? explainBestAttainable({
              model,
              mix: adapted.mix,
              requestedTargetGrams: input.requestedTargetGrams,
              safetyExcludedIds: Object.keys(input.inventory).filter((id) => !eligibleSourceIds.has(id)),
            })
            : undefined;
          return {
            ...adapted,
            mix: allocateCanonicalMixToInventoryForms(adapted.mix, input.inventory, eligibleSourceIds),
            ...(fallbackExplanation ? { fallbackExplanation } : {}),
          };
        } catch (error) {
          return {
            ...adapted,
            status: "invalid_result" as const,
            mix: {},
            violations: [...adapted.violations, error instanceof Error ? `source_form_allocation:${error.message}` : "source_form_allocation:unknown error"],
          };
        }
      })()
      : adapted;
    recordOptimizerRuntimeDiagnostic({
      status: allocated.status,
      elapsedMs: allocated.diagnostics.elapsedMs,
    });
    return allocated;
  });

  return { result, cancel: run.cancel };
}
