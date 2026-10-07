import type { OptimizerModel } from "./optimizer-model";
import type { SerialStageObjectives, SerialStageTrace, SmallInclusionResolve } from "./optimizer-serial-solver";

export interface OptimizerWorkerSolveRequest {
  type: "solve";
  requestId: string;
  model: OptimizerModel;
  createdAtMs: number;
}

export interface OptimizerWorkerCancelRequest {
  type: "cancel";
  requestId: string;
}

export type OptimizerWorkerRequest = OptimizerWorkerSolveRequest | OptimizerWorkerCancelRequest;

/**
 * `optimal`: every serial stage completed on the exact-feasible branch.
 * `best_attainable`: Stage 1 proved that no mix meets every range jointly, and
 * every fallback stage completed. `infeasible` remains for single-model callers.
 */
export type OptimizerRawStatus = "optimal" | "best_attainable" | "infeasible" | "timeout" | "cancelled" | "error";

export interface OptimizerWorkerRawResult {
  type: "result";
  requestId: string;
  status: OptimizerRawStatus;
  quantities: Record<string, number>;
  elapsedMs: number;
  mipGap?: number;
  solverStatus?: string;
  errorMessage?: string;
  /** Per-stage audit trace: stage, HiGHS status, objective value, and time. */
  stages?: SerialStageTrace[];
  /** The locked optimum of each completed stage. */
  objectives?: SerialStageObjectives;
  /** Outcome of the one re-solve without sub-threshold ingredients, when it ran. */
  smallInclusion?: SmallInclusionResolve;
}

export interface OptimizerWorkerCancelled {
  type: "cancelled";
  requestId: string;
}

export type OptimizerWorkerResponse = OptimizerWorkerRawResult | OptimizerWorkerCancelled;
