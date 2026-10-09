export const OPTIMIZER_POLICY = {
  gramIncrement: 1,
  meaningfulInclusionGrams: 5,
  /**
   * Diversity tolerance band (owner rule: "under equally valuable mixes
   * regarding the equilibrium walls, prioritize those that have a more diverse
   * mix"). With every lock exact, the later stages almost never have a choice,
   * so the meaningful-diversity stage cannot act. These named tolerances treat
   * mixes within a small band of each optimum as equally valuable:
   *
   * - `exactMarginTolerance` (ε_r, absolute, in normalized range widths) and
   *   `exactMarginRelativeTolerance` (share of r*): the macro-margin lock is
   *   r ≥ r* − ε_r − 0.10·r*, so a feasible mix keeps at least 90% of the best
   *   achievable distance from every macro range wall. It never permits a
   *   macro or category range miss: the hard range rows stay in every stage.
   * - `maximumShareToleranceGrams` (τ_M): allowance on the largest single
   *   ingredient amount.
   *
   * The best-attainable deviation locks (D_macro, then D_category) stay exact:
   * they are the approved fallback priority, not a balance preference. There
   * are no midpoint stages (owner decision 2026-10-07, #234): the configured
   * ranges are the only macro and category guidance.
   * Values were chosen with the tolerance sweep in
   * scripts/compare-optimizer-vs-greedy.mjs (see
   * docs/optimization/issue-211-optimizer-comparison.md).
   */
  exactMarginTolerance: 0,
  exactMarginRelativeTolerance: 0.1,
  maximumShareToleranceGrams: 25,
  canonicalCandidateOrder: "ingredient_id_ascending",
  /**
   * Documented solver feasibility tolerance (spec §5.2, Stage 2A) applied when a
   * continuous stage optimum (macro margin r, slack totals)
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
/**
 * Main-thread guard for the reused Worker. The Worker's own wall timeout can
 * only fire between solver stages; if no answer arrives within this time the
 * Worker is presumed stuck inside one HiGHS call, so it is terminated and the
 * next request starts a fresh Worker. It is deliberately longer than the
 * in-Worker wall timeout so that guard normally answers first.
 */
export const BROWSER_WORKER_RESPONSE_TIMEOUT_MS = 2_500;
