import { adaptExactFeasibilityResult, type AdaptedOptimizerResult } from "./optimizer-adapter";
import { checkBirdToxicity, isIngredientCompatible } from "./bird-safety";
import type { BirdType } from "./birds";
import { INGREDIENTS } from "./data";
import { canonicalizeOptimizerCandidates } from "./optimizer-ingredient-identity";
import { buildExactFeasibilityModel, type OptimizerCategory, type OptimizerMacro, type OptimizerRange } from "./optimizer-model";
import type { OptimizerWorkerRawResult, OptimizerWorkerResponse } from "./optimizer-protocol";
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
  createWorker?: () => BrowserOptimizerWorker;
}

export interface BrowserOptimizerSolveHandle {
  result: Promise<AdaptedOptimizerResult>;
  cancel(): void;
}

function createDefaultWorker(): BrowserOptimizerWorker {
  return new Worker(new URL("./optimizer-worker.ts", import.meta.url), { type: "module" }) as unknown as BrowserOptimizerWorker;
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
 * Creates but does not automatically invoke the browser-local solver. Home.tsx
 * continues using its present synchronous calculator output until a later,
 * separately reviewed display-integration change calls this adapter.
 */
export function startBrowserLocalOptimizerSolve(
  input: BrowserOptimizerSolveInput,
  options: BrowserOptimizerRuntimeOptions = {},
): BrowserOptimizerSolveHandle {
  const candidates = buildBrowserOptimizerCandidates(input.inventory, input.bird);
  const model = buildExactFeasibilityModel({
    candidates,
    requestedTargetGrams: input.requestedTargetGrams,
    macroRanges: input.macroRanges,
    categoryRanges: input.categoryRanges,
  });
  const worker = (options.createWorker ?? createDefaultWorker)();
  let settled = false;

  let resolveResult: (result: AdaptedOptimizerResult) => void = () => undefined;
  const result = new Promise<AdaptedOptimizerResult>((resolve) => {
    resolveResult = resolve;
  });

  const finish = (raw: OptimizerWorkerRawResult): void => {
    if (settled) return;
    settled = true;
    worker.terminate();
    resolveResult(adaptExactFeasibilityResult(
      raw,
      model,
      input.requestedTargetGrams,
      input.macroRanges,
      input.categoryRanges,
    ));
  };

  worker.onmessage = (event) => {
    const response = event.data as OptimizerWorkerResponse;
    if (response.type === "cancelled" && response.requestId === input.requestId) {
      finish(rawResult(input.requestId, "cancelled"));
      return;
    }
    if (isRawResult(response) && response.requestId === input.requestId) finish(response);
  };
  worker.onerror = (event) => finish(rawResult(input.requestId, "error", event.message || "Browser optimizer worker error"));
  worker.postMessage({
    type: "solve",
    requestId: input.requestId,
    model,
    createdAtMs: Date.now(),
  });

  return {
    result,
    cancel: () => {
      if (settled) return;
      worker.postMessage({ type: "cancel", requestId: input.requestId });
    },
  };
}

