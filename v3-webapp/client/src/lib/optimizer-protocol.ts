import type { OptimizerModel } from "./optimizer-model";

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

export type OptimizerRawStatus = "optimal" | "infeasible" | "timeout" | "cancelled" | "error";

export interface OptimizerWorkerRawResult {
  type: "result";
  requestId: string;
  status: OptimizerRawStatus;
  quantities: Record<string, number>;
  elapsedMs: number;
  mipGap?: number;
  solverStatus?: string;
  errorMessage?: string;
}

export interface OptimizerWorkerCancelled {
  type: "cancelled";
  requestId: string;
}

export type OptimizerWorkerResponse = OptimizerWorkerRawResult | OptimizerWorkerCancelled;
