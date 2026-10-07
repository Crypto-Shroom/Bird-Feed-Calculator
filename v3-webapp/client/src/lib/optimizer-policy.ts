export const OPTIMIZER_POLICY = {
  gramIncrement: 1,
  meaningfulInclusionGrams: 5,
  exactMarginTolerance: 0,
  macroDistanceTolerance: 0,
  categoryDistanceTolerance: 0,
  maximumShareToleranceGrams: 0,
  canonicalCandidateOrder: "ingredient_id_ascending",
  /**
   * Documented solver feasibility tolerance (spec §5.2, Stage 2A) applied when a
   * continuous stage optimum (macro margin r, slack totals, midpoint distances)
   * is locked for later stages. It is a numerical allowance for the LP text and
   * HiGHS row tolerance, not a policy relaxation; integer locks stay exact.
   */
  solverLockTolerance: 1e-7,
  /**
   * HiGHS MIP gap settings for every serial stage. A zero relative gap makes
   * each stage prove its own optimum (within the absolute gap) before it is
   * locked, so later stages never build on a merely near-optimal incumbent.
   */
  mipRelativeGap: 0,
  mipAbsoluteGap: 1e-7,
} as const;

export type OptimizerPolicy = typeof OPTIMIZER_POLICY;

/** Total in-solver budget for the complete serial stage sequence of one request. */
export const BROWSER_SOLVER_TIME_LIMIT_MS = 500;
/** Independent Worker wall-clock guard, including the first HiGHS wasm load. */
export const BROWSER_WORKER_WALL_TIMEOUT_MS = 1_000;
