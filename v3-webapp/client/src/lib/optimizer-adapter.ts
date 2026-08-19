import type { OptimizerCategory, OptimizerMacro, OptimizerModel, OptimizerRange } from "./optimizer-model";
import type { OptimizerWorkerRawResult } from "./optimizer-protocol";

const macroKeys: readonly OptimizerMacro[] = ["protein", "carbs", "fat", "fiber"];
const categoryKeys: readonly OptimizerCategory[] = ["grain", "legume", "seed"];
const numericTolerance = 1e-6;

export type OptimizerAdapterStatus = "feasible" | "infeasible" | "timeout" | "cancelled" | "solver_error" | "invalid_result";

export interface OptimizerAdapterDiagnostics {
  requestId: string;
  solverStatus?: string;
  elapsedMs: number;
  mipGap?: number;
  requestedTargetGrams: number;
  achievableTargetGrams: number;
  inventoryCapped: boolean;
}

export interface AdaptedOptimizerResult {
  status: OptimizerAdapterStatus;
  mix: Record<string, number>;
  nutrition?: Record<OptimizerMacro, number>;
  categories?: Record<OptimizerCategory, number>;
  maximumShareGrams?: number;
  meaningfulIngredientIds?: string[];
  diagnostics: OptimizerAdapterDiagnostics;
  violations: string[];
}

function emptyResult(
  status: OptimizerAdapterStatus,
  raw: OptimizerWorkerRawResult,
  model: OptimizerModel,
  requestedTargetGrams: number,
  violations: string[] = [],
): AdaptedOptimizerResult {
  return {
    status,
    mix: {},
    diagnostics: {
      requestId: raw.requestId,
      solverStatus: raw.solverStatus,
      elapsedMs: raw.elapsedMs,
      mipGap: raw.mipGap,
      requestedTargetGrams,
      achievableTargetGrams: model.achievableTargetGrams,
      inventoryCapped: model.achievableTargetGrams < requestedTargetGrams,
    },
    violations,
  };
}

function calculateNutrition(model: OptimizerModel, mix: Record<string, number>): Record<OptimizerMacro, number> {
  return Object.fromEntries(macroKeys.map((macro) => [
    macro,
    model.candidates.reduce((total, candidate) => total + candidate.nutrition[macro] * mix[candidate.id], 0) / model.achievableTargetGrams,
  ])) as Record<OptimizerMacro, number>;
}

function calculateCategories(model: OptimizerModel, mix: Record<string, number>): Record<OptimizerCategory, number> {
  return Object.fromEntries(categoryKeys.map((category) => [
    category,
    model.candidates
      .filter((candidate) => candidate.category === category)
      .reduce((total, candidate) => total + mix[candidate.id], 0) / model.achievableTargetGrams * 100,
  ])) as Record<OptimizerCategory, number>;
}

function rangeViolations<T extends string>(summary: Record<T, number>, ranges: Record<T, OptimizerRange>, prefix: string): string[] {
  return (Object.keys(ranges) as T[]).flatMap((key) => {
    const [minimum, maximum] = ranges[key];
    const value = summary[key];
    return value < minimum - numericTolerance || value > maximum + numericTolerance
      ? [`${prefix}:${key}:${value.toFixed(6)} outside ${minimum}-${maximum}`]
      : [];
  });
}

/**
 * Validates an exact-feasibility result from an eventual Worker without importing
 * calculator runtime modules or manufacturing fallback explanations.
 */
export function adaptExactFeasibilityResult(
  raw: OptimizerWorkerRawResult,
  model: OptimizerModel,
  requestedTargetGrams: number,
  macroRanges: Record<OptimizerMacro, OptimizerRange>,
  categoryRanges: Record<OptimizerCategory, OptimizerRange>,
): AdaptedOptimizerResult {
  if (!Number.isFinite(raw.elapsedMs) || raw.elapsedMs < 0) {
    return emptyResult("invalid_result", raw, model, requestedTargetGrams, ["diagnostics:elapsed_ms must be finite and non-negative"]);
  }
  if (raw.status === "infeasible") return emptyResult("infeasible", raw, model, requestedTargetGrams);
  if (raw.status === "timeout") return emptyResult("timeout", raw, model, requestedTargetGrams);
  if (raw.status === "cancelled") return emptyResult("cancelled", raw, model, requestedTargetGrams);
  if (raw.status === "error") return emptyResult("solver_error", raw, model, requestedTargetGrams, raw.errorMessage ? [`solver:${raw.errorMessage}`] : []);

  const candidateIds = model.candidates.map(({ id }) => id);
  const unexpectedIds = Object.keys(raw.quantities).filter((id) => !candidateIds.includes(id)).sort();
  const mix = Object.fromEntries(model.candidates.map(({ id }) => [id, raw.quantities[id] ?? 0]));
  const violations = unexpectedIds.map((id) => `quantity:${id}:not an eligible model candidate`);

  model.candidates.forEach((candidate) => {
    const quantity = mix[candidate.id];
    if (!Number.isFinite(quantity)) violations.push(`quantity:${candidate.id}:must be finite`);
    else if (Math.abs(quantity - Math.round(quantity)) > numericTolerance) violations.push(`quantity:${candidate.id}:must be whole grams`);
    else if (quantity < -numericTolerance) violations.push(`quantity:${candidate.id}:must be non-negative`);
    else if (quantity > candidate.availableGrams + numericTolerance) violations.push(`quantity:${candidate.id}:exceeds safe available inventory`);
  });

  const total = Object.values(mix).reduce((sum, quantity) => sum + quantity, 0);
  if (Math.abs(total - model.achievableTargetGrams) > numericTolerance) {
    violations.push(`weight:${total.toFixed(6)} does not equal achievable target ${model.achievableTargetGrams}`);
  }
  if (violations.length > 0) return emptyResult("invalid_result", raw, model, requestedTargetGrams, violations);

  const nutrition = calculateNutrition(model, mix);
  const categories = calculateCategories(model, mix);
  violations.push(...rangeViolations(nutrition, macroRanges, "macro"));
  violations.push(...rangeViolations(categories, categoryRanges, "category"));
  if (violations.length > 0) return emptyResult("invalid_result", raw, model, requestedTargetGrams, violations);

  const maximumShareGrams = Math.max(...Object.values(mix));
  const meaningfulIngredientIds = model.candidates
    .filter((candidate) => mix[candidate.id] >= model.policy.meaningfulInclusionGrams)
    .map(({ id }) => id);

  return {
    status: "feasible",
    mix,
    nutrition,
    categories,
    maximumShareGrams,
    meaningfulIngredientIds,
    diagnostics: {
      requestId: raw.requestId,
      solverStatus: raw.solverStatus,
      elapsedMs: raw.elapsedMs,
      mipGap: raw.mipGap,
      requestedTargetGrams,
      achievableTargetGrams: model.achievableTargetGrams,
      inventoryCapped: model.achievableTargetGrams < requestedTargetGrams,
    },
    violations: [],
  };
}
