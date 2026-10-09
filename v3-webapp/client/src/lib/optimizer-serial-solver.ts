import { renderOptimizerStageLp, type OptimizerModel } from "./optimizer-model";
import type { OptimizerWorkerExecutor, OptimizerWorkerExecutorResult } from "./optimizer-worker-controller";
import {
  EXACT_SERIAL_STAGE_ORDER,
  FALLBACK_SERIAL_STAGE_ORDER,
  buildExactSerialObjectivePlan,
  buildFallbackSerialObjectivePlan,
  evaluateSerialObjectives,
  macroMarginLockFloor,
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
/** `small_inclusion_resolve` marks stages of the one re-solve without sub-threshold ingredients. */
export type SerialPass = "primary" | "small_inclusion_resolve";

export interface SmallInclusionResolve {
  /** Ingredients above 0 g but below the meaningful-inclusion threshold in the primary mix, fixed to 0 g. */
  removedIds: string[];
  /** Whether the re-solved mix replaced the primary mix. */
  accepted: boolean;
  reason?: string;
}

export interface SerialStageTrace {
  branch: SerialBranch;
  stage: string;
  tieBreakId?: string;
  pass?: Exclude<SerialPass, "primary">;
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
  maximumShareGrams?: number;
  meaningfulIngredientCount?: number;
  smallestMeaningfulGrams?: number;
}

export interface SerialSolveResult {
  status: SerialSolveStatus;
  quantities: Record<string, number>;
  branch?: SerialBranch;
  objectives: SerialStageObjectives;
  stages: SerialStageTrace[];
  solverStatus?: string;
  errorMessage?: string;
  smallInclusion?: SmallInclusionResolve;
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
const inclusionStages = new Set<string>(["meaningful_diversity", "smallest_meaningful_amount", "quantity_tie_break"]);

/** Whole grams; `+ 0` turns a solver's -0 (from -1e-9 noise) into 0. */
function roundQuantity(value: number): number {
  return Math.round(value) + 0;
}

interface SequenceOutcome {
  branch: SerialBranch;
  quantities: Record<string, number>;
  objectives: SerialStageObjectives;
}

/**
 * Returns why a small-inclusion re-solve may not replace the primary mix, or
 * undefined when it may. The re-solved mix must stay on the same branch and
 * still satisfy every lock the primary sequence set, each with its own
 * documented tolerance: it may not lose more macro margin (or, on the
 * fallback branch, any macro/category deviation) than the primary locks
 * allowed, nor have a worse balance, larger maximum share, or fewer
 * meaningful ingredients than those locks permitted.
 */
function smallInclusionRejection(model: OptimizerModel, primary: SequenceOutcome, resolved: SequenceOutcome): string | undefined {
  if (resolved.branch !== primary.branch) return `branch changed from ${primary.branch} to ${resolved.branch}`;
  const policy = model.policy;
  const lockTolerance = policy.solverLockTolerance;
  const evaluated = evaluateSerialObjectives(model, resolved.quantities);
  const locked = primary.objectives;
  const checks: Array<[string, boolean]> = [];
  if (primary.branch === "exact") {
    checks.push(["macro margin", evaluated.macroMargin >= macroMarginLockFloor(policy, locked.macroMargin ?? 0) - lockTolerance - 1e-9]);
  } else {
    checks.push(["macro deviation", evaluated.macroDeviation <= (locked.macroDeviation ?? 0) + lockTolerance + 1e-9]);
    checks.push(["category deviation", evaluated.categoryDeviation <= (locked.categoryDeviation ?? 0) + lockTolerance + 1e-9]);
  }
  checks.push(["maximum share", evaluated.maximumShareGrams <= (locked.maximumShareGrams ?? 0) + policy.maximumShareToleranceGrams]);
  checks.push(["meaningful ingredient count", evaluated.meaningfulIngredientCount >= (locked.meaningfulIngredientCount ?? 0)]);
  checks.push(["smallest meaningful amount", evaluated.smallestMeaningfulGrams >= (locked.smallestMeaningfulGrams ?? 0)]);
  const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
  return failed.length ? `worsens ${failed.join(", ")} beyond its tolerance` : undefined;
}

/**
 * Runs the approved serial stage sequence. Every stage solves the complete
 * full-mix model; only explicit locks carry between stages. A result is
 * returned only after the final stage completes. If any stage of the primary
 * sequence hits the time budget, the whole result is `timeout` with no
 * quantities, so a partially optimized mix is never presented as the optimum.
 *
 * Small-inclusion pass: the solver has no hard minimum amount. When the
 * primary mix contains an ingredient above 0 g but below the
 * meaningful-inclusion threshold, the whole sequence is re-solved once, within
 * the same time budget, with those ingredients fixed to 0 g. The re-solved mix
 * replaces the primary one only when it completes and passes
 * `smallInclusionRejection`; otherwise (including a re-solve timeout) the
 * primary mix is kept.
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
  const tolerance = model.policy.solverLockTolerance;
  let currentBranch: SerialBranch | undefined;
  let currentObjectives: SerialStageObjectives = {};
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

  const runSequence = async (pass: SerialPass, fixedZeroIds: readonly string[]): Promise<SequenceOutcome> => {
    const objectives: SerialStageObjectives = {};
    currentObjectives = objectives;
    currentBranch = undefined;
    const fixedZeroRows = fixedZeroIds.map((id) => {
      const candidate = model.candidates.find((entry) => entry.id === id);
      if (!candidate) throw new Error(`small-inclusion re-solve references non-model candidate '${id}'`);
      return ` small_inclusion_zero_${id}: ${candidate.quantityVariable} = 0`;
    });

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
        extraRows: [...plan.constraints, ...fixedZeroRows],
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
        ...(pass !== "primary" ? { pass } : {}),
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
          stages.push({
            branch: stageBranch,
            stage: tieBreakStage,
            tieBreakId: candidate.id,
            ...(pass !== "primary" ? { pass } : {}),
            solverStatus: "Skipped",
            elapsedMs: 0,
            skipped,
          });
          continue;
        }
        const solution = await solveStage(stageBranch, buildPlan(quantityById, candidate.id), candidate.id);
        requireOptimal(solution, `${tieBreakStage}:${candidate.id}`);
        current = readQuantities(solution);
        quantityById[candidate.id] = roundQuantity(current[candidate.id]);
      }
      return quantityById;
    };

    // Stages 1 and 3 (feasible row) are solved together: maximizing r under the
    // hard macro/category rows is infeasible exactly when Stage 1 is infeasible.
    const exactPlan = buildExactSerialObjectivePlan(model, EXACT_SERIAL_STAGE_ORDER[0], model.macroRanges, model.categoryRanges);
    const feasibility = await solveStage("exact", exactPlan);

    if (feasibility.Status === "Optimal") {
      currentBranch = "exact";
      const ranges = [model.macroRanges, model.categoryRanges] as const;
      const locks: ExactSerialLocks = {};
      objectives.macroMargin = Math.max(0, optimizedValue(feasibility, "macro_margin", "macroMargin").value);
      locks.macroMargin = Math.max(0, macroMarginLockFloor(model.policy, objectives.macroMargin) - tolerance);

      const share = await solveStage("exact", buildExactSerialObjectivePlan(model, "maximum_share", ...ranges, locks));
      objectives.maximumShareGrams = optimizedValue(share, "maximum_share", "maximumShareGrams").value;
      locks.maximumShareGrams = objectives.maximumShareGrams;

      const diversity = await solveStage("exact", buildExactSerialObjectivePlan(model, "meaningful_diversity", ...ranges, locks));
      objectives.meaningfulIngredientCount = optimizedValue(diversity, "meaningful_diversity", "meaningfulIngredientCount").value;
      locks.meaningfulIngredientCount = objectives.meaningfulIngredientCount;

      const chunks = await solveStage("exact", buildExactSerialObjectivePlan(model, "smallest_meaningful_amount", ...ranges, locks));
      const chunksResult = optimizedValue(chunks, "smallest_meaningful_amount", "smallestMeaningfulGrams");
      objectives.smallestMeaningfulGrams = chunksResult.value;
      locks.smallestMeaningfulGrams = objectives.smallestMeaningfulGrams;

      const quantities = await quantityTieBreak("exact", chunksResult.quantities, (quantityById, id) => (
        buildExactSerialObjectivePlan(model, "quantity_tie_break", ...ranges, { ...locks, quantityById: { ...quantityById } }, id)
      ));
      return { branch: "exact", quantities, objectives };
    }
    if (!infeasibleStatuses.has(feasibility.Status)) {
      throw new StageStop("error", `Feasibility stage returned unsupported HiGHS status '${feasibility.Status}'`, feasibility.Status);
    }

    currentBranch = "fallback";
    const locks: FallbackSerialLocks = {};
    const [macroStage, categoryStage, shareStage, diversityStage, chunksStage] = FALLBACK_SERIAL_STAGE_ORDER;

    const macro = await solveStage("fallback", buildFallbackSerialObjectivePlan(model, macroStage, locks));
    objectives.macroDeviation = optimizedValue(macro, macroStage, "macroDeviation").value;
    locks.macroDeviation = objectives.macroDeviation;

    const category = await solveStage("fallback", buildFallbackSerialObjectivePlan(model, categoryStage, locks));
    objectives.categoryDeviation = optimizedValue(category, categoryStage, "categoryDeviation").value;
    locks.categoryDeviation = objectives.categoryDeviation;

    const share = await solveStage("fallback", buildFallbackSerialObjectivePlan(model, shareStage, locks));
    objectives.maximumShareGrams = optimizedValue(share, shareStage, "maximumShareGrams").value;
    locks.maximumShareGrams = objectives.maximumShareGrams;

    const diversity = await solveStage("fallback", buildFallbackSerialObjectivePlan(model, diversityStage, locks));
    objectives.meaningfulIngredientCount = optimizedValue(diversity, diversityStage, "meaningfulIngredientCount").value;
    locks.meaningfulIngredientCount = objectives.meaningfulIngredientCount;

    const chunks = await solveStage("fallback", buildFallbackSerialObjectivePlan(model, chunksStage, locks));
    const chunksResult = optimizedValue(chunks, chunksStage, "smallestMeaningfulGrams");
    objectives.smallestMeaningfulGrams = chunksResult.value;
    locks.smallestMeaningfulGrams = objectives.smallestMeaningfulGrams;

    const quantities = await quantityTieBreak("fallback", chunksResult.quantities, (quantityById, id) => (
      buildFallbackSerialObjectivePlan(model, "quantity_tie_break", { ...locks, quantityById: { ...quantityById } }, id)
    ));
    return { branch: "fallback", quantities, objectives };
  };

  const failure = (error: StageStop): SerialSolveResult => ({
    status: error.status,
    quantities: {},
    ...(currentBranch ? { branch: currentBranch } : {}),
    objectives: currentObjectives,
    stages,
    solverStatus: error.solverStatus ?? lastSolverStatus,
    errorMessage: error.message,
  });

  let primary: SequenceOutcome;
  try {
    primary = await runSequence("primary", []);
  } catch (error) {
    if (error instanceof StageStop) return failure(error);
    throw error;
  }

  let final = primary;
  let smallInclusion: SmallInclusionResolve | undefined;
  const smallIds = model.candidates
    .filter(({ id }) => primary.quantities[id] > 0 && primary.quantities[id] < model.policy.meaningfulInclusionGrams)
    .map(({ id }) => id);
  if (smallIds.length > 0) {
    try {
      const resolved = await runSequence("small_inclusion_resolve", smallIds);
      const rejection = smallInclusionRejection(model, primary, resolved);
      if (!rejection) final = resolved;
      smallInclusion = { removedIds: smallIds, accepted: !rejection, ...(rejection ? { reason: rejection } : {}) };
    } catch (error) {
      if (!(error instanceof StageStop)) throw error;
      if (error.status === "cancelled") return failure(error);
      smallInclusion = { removedIds: smallIds, accepted: false, reason: `re-solve ${error.status}: ${error.message}` };
    }
  }

  return {
    status: final.branch === "exact" ? "optimal" : "best_attainable",
    quantities: final.quantities,
    branch: final.branch,
    objectives: final.objectives,
    stages,
    solverStatus: lastSolverStatus,
    ...(smallInclusion ? { smallInclusion } : {}),
  };
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
      ...(outcome.smallInclusion ? { smallInclusion: outcome.smallInclusion } : {}),
      ...(outcome.solverStatus ? { solverStatus: outcome.solverStatus } : {}),
      ...(outcome.errorMessage ? { errorMessage: outcome.errorMessage } : {}),
    };
  };
}
