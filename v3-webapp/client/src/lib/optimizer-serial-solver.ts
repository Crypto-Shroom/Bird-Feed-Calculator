import { renderOptimizerStageLp, type OptimizerModel } from "./optimizer-model";
import type { OptimizerWorkerExecutor, OptimizerWorkerExecutorResult } from "./optimizer-worker-controller";
import {
  EXACT_SERIAL_STAGE_ORDER,
  FALLBACK_SERIAL_STAGE_ORDER,
  buildExactSerialObjectivePlan,
  buildFallbackSerialObjectivePlan,
  evaluateSerialObjectives,
  type EvaluatedSerialObjectives,
  type ExactSerialLocks,
  type FallbackSerialLocks,
  type SerialObjectivePlan,
} from "./optimizer-stages";

/**
 * Serial staged solve (issue #122 spec §5.2) shared by the browser Worker
 * executor and the Node comparison harness. It contains no Vite-only imports,
 * so the exact same stage code runs in both places.
 */

export interface HighsColumnLike {
  Primal: number;
}

export interface HighsSolutionLike {
  Status: string;
  ObjectiveValue?: number;
  Columns: Record<string, HighsColumnLike | undefined>;
}

export interface HighsStageSolveOptions {
  time_limit: number;
  threads: number;
  parallel: "off";
  output_flag: false;
  log_to_console: false;
  mip_rel_gap: number;
  mip_abs_gap: number;
}

export interface HighsSolverLike {
  solve(problem: string, options: HighsStageSolveOptions): HighsSolutionLike;
}

export type SerialSolveStatus = "optimal" | "best_attainable" | "timeout" | "cancelled" | "error";
export type SerialBranch = "exact" | "fallback";

export interface SerialStageTrace {
  branch: SerialBranch;
  stage: string;
  tieBreakId?: string;
  solverStatus: string;
  objectiveValue?: number;
  elapsedMs: number;
  /**
   * Set when a quantity tie-break needs no solve: its incumbent already sits at
   * the zero lower bound, or every other quantity is locked so the exact-weight
   * row fixes it.
   */
  skipped?: "zero_incumbent" | "determined_by_weight";
}

export interface SerialStageObjectives {
  macroMargin?: number;
  macroDeviation?: number;
  categoryDeviation?: number;
  macroDistance?: number;
  categoryDistance?: number;
  maximumShareGrams?: number;
  meaningfulIngredientCount?: number;
}

export interface SerialSolveResult {
  status: SerialSolveStatus;
  quantities: Record<string, number>;
  branch?: SerialBranch;
  objectives: SerialStageObjectives;
  stages: SerialStageTrace[];
  solverStatus?: string;
  errorMessage?: string;
}

export interface SerialSolveOptions {
  /** Total in-solver budget for the whole stage sequence, not per stage. */
  timeBudgetMs: number;
  now?: () => number;
  isCancelled?: () => boolean;
  /**
   * Called between stages. The browser Worker yields a macrotask here so a
   * cancellation message or the controller's wall-clock timeout can run.
   */
  yieldBetweenStages?: () => Promise<void>;
}

class StageStop extends Error {
  public constructor(public readonly status: SerialSolveStatus, message: string, public readonly solverStatus?: string) {
    super(message);
  }
}

const infeasibleStatuses = new Set(["Infeasible", "Primal infeasible or unbounded"]);

/**
 * Stages that optimize or lock the meaningful-inclusion count and therefore
 * need the x/z link rows and binaries. Earlier stages omit them: the links
 * admit a valid z for every x, so omitting them leaves the feasible quantity
 * set and every earlier stage optimum unchanged while removing binaries.
 */
const inclusionStages = new Set<string>(["meaningful_diversity", "quantity_tie_break"]);

/** Whole grams; `+ 0` turns a solver's -0 (from -1e-9 noise) into 0. */
function roundQuantity(value: number): number {
  return Math.round(value) + 0;
}

/**
 * Runs the approved serial stage sequence. Every stage solves the complete
 * full-mix model; only explicit locks carry between stages. A result is
 * returned only after the final stage completes. If any stage hits the time
 * budget, the whole result is `timeout` with no quantities, so a partially
 * optimized mix is never presented as the optimum.
 */
export async function solveSerialStages(
  solver: HighsSolverLike,
  model: OptimizerModel,
  options: SerialSolveOptions,
): Promise<SerialSolveResult> {
  const now = options.now ?? (() => Date.now());
  const isCancelled = options.isCancelled ?? (() => false);
  const startedAt = now();
  const stages: SerialStageTrace[] = [];
  const objectives: SerialStageObjectives = {};
  const tolerance = model.policy.solverLockTolerance;
  let branch: SerialBranch | undefined;
  let lastSolverStatus: string | undefined;

  if (!Number.isFinite(options.timeBudgetMs) || options.timeBudgetMs <= 0) {
    throw new Error("serial solver time budget must be positive and finite");
  }

  const readQuantities = (solution: HighsSolutionLike): Record<string, number> => Object.fromEntries(
    model.candidates.map(({ id, quantityVariable }) => {
      const value = solution.Columns[quantityVariable]?.Primal;
      if (value === undefined || !Number.isFinite(value)) {
        throw new StageStop("error", `HiGHS returned no finite value for column '${quantityVariable}'`, solution.Status);
      }
      return [id, value];
    }),
  );

  const solveStage = async (stageBranch: SerialBranch, plan: SerialObjectivePlan, tieBreakId?: string): Promise<HighsSolutionLike> => {
    if (isCancelled()) throw new StageStop("cancelled", "Optimizer solve was cancelled");
    const remainingMs = options.timeBudgetMs - (now() - startedAt);
    if (remainingMs <= 0) throw new StageStop("timeout", `Serial solve exceeded its ${options.timeBudgetMs} ms budget before stage '${plan.stage}'`);

    const lp = renderOptimizerStageLp(model, {
      sense: plan.sense,
      objectiveName: `stage_${plan.stage}`,
      objective: plan.expression,
      includeTargetRows: stageBranch === "exact",
      includeInclusionLinks: inclusionStages.has(plan.stage),
      extraRows: plan.constraints,
    });
    const stageStartedAt = now();
    const solution = solver.solve(lp, {
      time_limit: Math.max(remainingMs, 1) / 1_000,
      threads: 1,
      parallel: "off",
      output_flag: false,
      log_to_console: false,
      mip_rel_gap: model.policy.mipRelativeGap,
      mip_abs_gap: model.policy.mipAbsoluteGap,
    });
    lastSolverStatus = solution.Status;
    stages.push({
      branch: stageBranch,
      stage: plan.stage,
      ...(tieBreakId ? { tieBreakId } : {}),
      solverStatus: solution.Status,
      ...(solution.Status === "Optimal" && Number.isFinite(solution.ObjectiveValue) ? { objectiveValue: solution.ObjectiveValue } : {}),
      elapsedMs: now() - stageStartedAt,
    });

    if (options.yieldBetweenStages) await options.yieldBetweenStages();
    if (isCancelled()) throw new StageStop("cancelled", "Optimizer solve was cancelled", solution.Status);
    if (solution.Status === "Time limit reached") {
      throw new StageStop("timeout", `Stage '${plan.stage}' reached the solver time limit`, solution.Status);
    }
    return solution;
  };

  const requireOptimal = (solution: HighsSolutionLike, stage: string): void => {
    if (solution.Status !== "Optimal") {
      throw new StageStop("error", `Stage '${stage}' returned unsupported HiGHS status '${solution.Status}'`, solution.Status);
    }
  };

  /**
   * Returns the stage's optimum evaluated exactly on the returned whole-gram
   * mix. Locking this value (plus the documented lock tolerance) keeps the
   * incumbent, and therefore the true optimum, feasible for later stages.
   */
  const optimizedValue = <K extends keyof EvaluatedSerialObjectives>(solution: HighsSolutionLike, stage: string, key: K): {
    value: EvaluatedSerialObjectives[K];
    quantities: Record<string, number>;
  } => {
    requireOptimal(solution, stage);
    const quantities = Object.fromEntries(Object.entries(readQuantities(solution)).map(([id, grams]) => [id, roundQuantity(grams)]));
    return { value: evaluateSerialObjectives(model, quantities)[key], quantities };
  };

  /**
   * Stage 6: serial quantity-vector tie-break in canonical id order. The
   * current incumbent always satisfies every lock, so an ingredient whose
   * incumbent is already zero is at its lower bound and is locked without a
   * solve, and the last ingredient is fixed by the exact-weight row once every
   * other quantity is locked. Locks are whole grams.
   */
  const quantityTieBreak = async (
    stageBranch: SerialBranch,
    incumbent: Record<string, number>,
    buildPlan: (quantityById: Record<string, number>, tieBreakId: string) => SerialObjectivePlan,
  ): Promise<Record<string, number>> => {
    const quantityById: Record<string, number> = {};
    let current = incumbent;
    const tieBreakStage = EXACT_SERIAL_STAGE_ORDER[4];
    for (let index = 0; index < model.candidates.length; index += 1) {
      const candidate = model.candidates[index];
      const incumbentQuantity = roundQuantity(current[candidate.id]);
      const skipped = incumbentQuantity === 0
        ? "zero_incumbent" as const
        : index === model.candidates.length - 1 ? "determined_by_weight" as const : undefined;
      if (skipped) {
        quantityById[candidate.id] = incumbentQuantity;
        stages.push({ branch: stageBranch, stage: tieBreakStage, tieBreakId: candidate.id, solverStatus: "Skipped", elapsedMs: 0, skipped });
        continue;
      }
      const solution = await solveStage(stageBranch, buildPlan(quantityById, candidate.id), candidate.id);
      requireOptimal(solution, `${tieBreakStage}:${candidate.id}`);
      current = readQuantities(solution);
      quantityById[candidate.id] = roundQuantity(current[candidate.id]);
    }
    return quantityById;
  };

  try {
    // Stages 1 and 3 (feasible row) are solved together: maximizing r under the
    // hard macro/category rows is infeasible exactly when Stage 1 is infeasible.
    const exactPlan = buildExactSerialObjectivePlan(model, EXACT_SERIAL_STAGE_ORDER[0], model.macroRanges, model.categoryRanges);
    const feasibility = await solveStage("exact", exactPlan);

    let finalQuantities: Record<string, number>;
    if (feasibility.Status === "Optimal") {
      branch = "exact";
      const ranges = [model.macroRanges, model.categoryRanges] as const;
      const locks: ExactSerialLocks = {};
      objectives.macroMargin = Math.max(0, optimizedValue(feasibility, "macro_margin", "macroMargin").value);
      locks.macroMargin = Math.max(0, objectives.macroMargin - tolerance);

      const category = await solveStage("exact", buildExactSerialObjectivePlan(model, "category_midpoint", ...ranges, locks));
      objectives.categoryDistance = optimizedValue(category, "category_midpoint", "categoryDistance").value;
      locks.categoryDistance = objectives.categoryDistance + tolerance;

      const share = await solveStage("exact", buildExactSerialObjectivePlan(model, "maximum_share", ...ranges, locks));
      objectives.maximumShareGrams = optimizedValue(share, "maximum_share", "maximumShareGrams").value;
      locks.maximumShareGrams = objectives.maximumShareGrams;

      const diversity = await solveStage("exact", buildExactSerialObjectivePlan(model, "meaningful_diversity", ...ranges, locks));
      const diversityResult = optimizedValue(diversity, "meaningful_diversity", "meaningfulIngredientCount");
      objectives.meaningfulIngredientCount = diversityResult.value;
      locks.meaningfulIngredientCount = objectives.meaningfulIngredientCount;

      finalQuantities = await quantityTieBreak("exact", diversityResult.quantities, (quantityById, id) => (
        buildExactSerialObjectivePlan(model, "quantity_tie_break", ...ranges, { ...locks, quantityById: { ...quantityById } }, id)
      ));
    } else if (infeasibleStatuses.has(feasibility.Status)) {
      branch = "fallback";
      const locks: FallbackSerialLocks = {};
      const [macroStage, categoryStage, macroMidpointStage, categoryMidpointStage, shareStage, diversityStage] = FALLBACK_SERIAL_STAGE_ORDER;

      const macro = await solveStage("fallback", buildFallbackSerialObjectivePlan(model, macroStage, locks));
      objectives.macroDeviation = optimizedValue(macro, macroStage, "macroDeviation").value;
      locks.macroDeviation = objectives.macroDeviation;

      const category = await solveStage("fallback", buildFallbackSerialObjectivePlan(model, categoryStage, locks));
      objectives.categoryDeviation = optimizedValue(category, categoryStage, "categoryDeviation").value;
      locks.categoryDeviation = objectives.categoryDeviation;

      const macroMidpoint = await solveStage("fallback", buildFallbackSerialObjectivePlan(model, macroMidpointStage, locks));
      objectives.macroDistance = optimizedValue(macroMidpoint, macroMidpointStage, "macroDistance").value;
      locks.macroDistance = objectives.macroDistance;

      const categoryMidpoint = await solveStage("fallback", buildFallbackSerialObjectivePlan(model, categoryMidpointStage, locks));
      objectives.categoryDistance = optimizedValue(categoryMidpoint, categoryMidpointStage, "categoryDistance").value;
      locks.categoryDistance = objectives.categoryDistance;

      const share = await solveStage("fallback", buildFallbackSerialObjectivePlan(model, shareStage, locks));
      objectives.maximumShareGrams = optimizedValue(share, shareStage, "maximumShareGrams").value;
      locks.maximumShareGrams = objectives.maximumShareGrams;

      const diversity = await solveStage("fallback", buildFallbackSerialObjectivePlan(model, diversityStage, locks));
      const diversityResult = optimizedValue(diversity, diversityStage, "meaningfulIngredientCount");
      objectives.meaningfulIngredientCount = diversityResult.value;
      locks.meaningfulIngredientCount = objectives.meaningfulIngredientCount;

      finalQuantities = await quantityTieBreak("fallback", diversityResult.quantities, (quantityById, id) => (
        buildFallbackSerialObjectivePlan(model, "quantity_tie_break", { ...locks, quantityById: { ...quantityById } }, id)
      ));
    } else {
      throw new StageStop("error", `Feasibility stage returned unsupported HiGHS status '${feasibility.Status}'`, feasibility.Status);
    }

    return {
      status: branch === "exact" ? "optimal" : "best_attainable",
      quantities: finalQuantities,
      branch,
      objectives,
      stages,
      solverStatus: lastSolverStatus,
    };
  } catch (error) {
    if (error instanceof StageStop) {
      return {
        status: error.status,
        quantities: {},
        ...(branch ? { branch } : {}),
        objectives,
        stages,
        solverStatus: error.solverStatus ?? lastSolverStatus,
        errorMessage: error.message,
      };
    }
    throw error;
  }
}

export type HighsSolverLoader = () => Promise<HighsSolverLike>;

export interface SerialSolverExecutorOptions {
  loadSolver: HighsSolverLoader;
  /** Total in-solver budget for the full stage sequence of one request. */
  timeLimitMs: number;
  now?: () => number;
  yieldBetweenStages?: () => Promise<void>;
}

const yieldToEventLoop = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Creates the Worker executor around the serial stage sequence. The solver is
 * loaded once and reused; if HiGHS throws, the cached instance is discarded so
 * the next request starts from a fresh module rather than a corrupted heap.
 */
export function createSerialSolverExecutor(options: SerialSolverExecutorOptions): OptimizerWorkerExecutor {
  if (!Number.isFinite(options.timeLimitMs) || options.timeLimitMs <= 0) throw new Error("browser solver time limit must be positive and finite");
  let solverPromise: Promise<HighsSolverLike> | undefined;

  return async (request, context): Promise<OptimizerWorkerExecutorResult> => {
    if (context.isCancelled()) return { status: "cancelled", quantities: {}, errorMessage: "Optimizer solve was cancelled before execution" };

    solverPromise ??= options.loadSolver();
    const solver = await solverPromise;
    if (context.isCancelled()) return { status: "cancelled", quantities: {}, errorMessage: "Optimizer solve was cancelled before execution" };

    let outcome: SerialSolveResult;
    try {
      outcome = await solveSerialStages(solver, request.model, {
        timeBudgetMs: options.timeLimitMs,
        now: options.now,
        isCancelled: context.isCancelled,
        yieldBetweenStages: options.yieldBetweenStages ?? yieldToEventLoop,
      });
    } catch (error) {
      solverPromise = undefined;
      return {
        status: "error",
        quantities: {},
        errorMessage: error instanceof Error ? error.message : "Unknown serial solver error",
      };
    }

    return {
      status: outcome.status,
      quantities: outcome.status === "optimal" || outcome.status === "best_attainable" ? outcome.quantities : {},
      stages: outcome.stages,
      objectives: outcome.objectives,
      ...(outcome.solverStatus ? { solverStatus: outcome.solverStatus } : {}),
      ...(outcome.errorMessage ? { errorMessage: outcome.errorMessage } : {}),
    };
  };
}
