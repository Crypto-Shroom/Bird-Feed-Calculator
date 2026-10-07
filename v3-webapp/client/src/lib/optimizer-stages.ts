import {
  formatExpression as formatLpExpression,
  type OptimizerCategory,
  type OptimizerMacro,
  type OptimizerModel,
  type OptimizerRange,
} from "./optimizer-model";

const macroKeys: readonly OptimizerMacro[] = ["protein", "carbs", "fat", "fiber"];
const categoryKeys: readonly OptimizerCategory[] = ["grain", "legume", "seed"];

export const EXACT_SERIAL_STAGE_ORDER = [
  "macro_margin",
  "category_midpoint",
  "maximum_share",
  "meaningful_diversity",
  "quantity_tie_break",
] as const;

export type ExactSerialStage = typeof EXACT_SERIAL_STAGE_ORDER[number];

/**
 * Spec §5.2 fallback order when Stage 1 proves that no mix meets every macro and
 * category range jointly: macro deviation (2A), then category deviation (2A),
 * then macro midpoint distance (Stage 3, infeasible branch), then the shared
 * Stage 4–6 composition stages.
 */
export const FALLBACK_SERIAL_STAGE_ORDER = [
  "macro_deviation",
  "category_deviation",
  "macro_midpoint",
  "category_midpoint",
  "maximum_share",
  "meaningful_diversity",
  "quantity_tie_break",
] as const;

export type FallbackSerialStage = typeof FALLBACK_SERIAL_STAGE_ORDER[number];

export interface FallbackSerialLocks {
  macroDeviation?: number;
  categoryDeviation?: number;
  macroDistance?: number;
  categoryDistance?: number;
  maximumShareGrams?: number;
  meaningfulIngredientCount?: number;
  quantityById?: Record<string, number>;
}

export interface ExactSerialLocks {
  macroMargin?: number;
  categoryDistance?: number;
  maximumShareGrams?: number;
  meaningfulIngredientCount?: number;
  quantityById?: Record<string, number>;
}

export interface SerialObjectivePlan {
  stage: ExactSerialStage | FallbackSerialStage;
  sense: "minimize" | "maximize";
  expression: string;
  constraints: readonly string[];
}

export interface InfeasibilityEvidenceRequest {
  model: OptimizerModel;
  requestedTargetGrams: number;
  safetyExcludedIds: readonly string[];
  macroRanges: Record<OptimizerMacro, OptimizerRange>;
  categoryRanges: Record<OptimizerCategory, OptimizerRange>;
}

export interface InfeasibilityEvidence {
  requestedTargetGrams: number;
  achievableTargetGrams: number;
  stockShortfallGrams: number;
  safetyExcludedIds: readonly string[];
  hardMacroRanges: Record<OptimizerMacro, OptimizerRange>;
  hardCategoryRanges: Record<OptimizerCategory, OptimizerRange>;
  classification: "stock_limited" | "range_interaction_requires_solver";
  note: string;
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) throw new Error(`cannot format non-finite serial objective value: ${value}`);
  return Number.isInteger(value) ? String(value) : value.toFixed(9).replace(/0+$/, "").replace(/\.$/, "");
}

function lockBand(variable: string, value: number, tolerance: number, name: string): string[] {
  if (!Number.isFinite(value) || !Number.isFinite(tolerance) || tolerance < 0) {
    throw new Error(`${name} lock requires finite value and non-negative tolerance`);
  }
  return [` ${name}_lower_lock: ${variable} >= ${formatNumber(value - tolerance)}`, ` ${name}_upper_lock: ${variable} <= ${formatNumber(value + tolerance)}`];
}

type LpTerm = { coefficient: number; variable: string };

function macroTerms(model: OptimizerModel, macro: OptimizerMacro, scale = 1): LpTerm[] {
  return model.candidates.map((candidate) => ({ coefficient: scale * candidate.nutrition[macro], variable: candidate.quantityVariable }));
}

function categoryTerms(model: OptimizerModel, category: OptimizerCategory, scale = 1): LpTerm[] {
  return model.candidates
    .filter((candidate) => candidate.category === category)
    .map((candidate) => ({ coefficient: scale, variable: candidate.quantityVariable }));
}

/** Formats a linear row body; every term keeps its own coefficient. */
function rowExpression(terms: readonly LpTerm[]): string {
  return formatLpExpression(terms);
}

function assertPositiveWidth(range: OptimizerRange, name: string): void {
  if (!Number.isFinite(range[0]) || !Number.isFinite(range[1]) || range[1] <= range[0]) {
    throw new Error(`${name} must have a positive finite width for serial objective normalization`);
  }
}

function macroMarginConstraints(model: OptimizerModel, ranges: Record<OptimizerMacro, OptimizerRange>): string[] {
  return macroKeys.flatMap((macro) => {
    const [minimum, maximum] = ranges[macro];
    assertPositiveWidth(ranges[macro], `${macro} range`);
    const scaledWidth = model.achievableTargetGrams * (maximum - minimum);
    return [
      ` macro_margin_${macro}_lower: ${rowExpression([...macroTerms(model, macro), { coefficient: -scaledWidth, variable: "r" }])} >= ${formatNumber(model.achievableTargetGrams * minimum)}`,
      ` macro_margin_${macro}_upper: ${rowExpression([...macroTerms(model, macro), { coefficient: scaledWidth, variable: "r" }])} <= ${formatNumber(model.achievableTargetGrams * maximum)}`,
    ];
  });
}

/**
 * Category midpoint distance T (spec §4.3): |100·Cc − W·Hc| ≤ W·(Uc − Lc)·T for
 * every category. Each category term is scaled individually, so a category
 * with several ingredients is measured on its full gram total.
 */
function categoryMidpointConstraints(model: OptimizerModel, ranges: Record<OptimizerCategory, OptimizerRange>): string[] {
  return categoryKeys.flatMap((category) => {
    const [minimum, maximum] = ranges[category];
    assertPositiveWidth(ranges[category], `${category} range`);
    const midpoint = (minimum + maximum) / 2;
    const scaledWidth = model.achievableTargetGrams * (maximum - minimum);
    const scaledMidpoint = model.achievableTargetGrams * midpoint;
    return [
      ` category_distance_${category}_positive: ${rowExpression([...categoryTerms(model, category, 100), { coefficient: -scaledWidth, variable: "T" }])} <= ${formatNumber(scaledMidpoint)}`,
      ` category_distance_${category}_negative: ${rowExpression([...categoryTerms(model, category, -100), { coefficient: -scaledWidth, variable: "T" }])} <= ${formatNumber(-scaledMidpoint)}`,
    ];
  });
}

/**
 * Macro midpoint distance V for the best-attainable branch (spec §5.2 Stage 3,
 * infeasible row): |Pm − W·Hm| ≤ W·(Um − Lm)·V for every macro, the same
 * max-normalized form as the category distance T.
 */
function macroMidpointConstraints(model: OptimizerModel, ranges: Record<OptimizerMacro, OptimizerRange>): string[] {
  return macroKeys.flatMap((macro) => {
    const [minimum, maximum] = ranges[macro];
    assertPositiveWidth(ranges[macro], `${macro} range`);
    const midpoint = (minimum + maximum) / 2;
    const scaledWidth = model.achievableTargetGrams * (maximum - minimum);
    const scaledMidpoint = model.achievableTargetGrams * midpoint;
    return [
      ` macro_distance_${macro}_positive: ${rowExpression([...macroTerms(model, macro), { coefficient: -scaledWidth, variable: "V" }])} <= ${formatNumber(scaledMidpoint)}`,
      ` macro_distance_${macro}_negative: ${rowExpression([...macroTerms(model, macro, -1), { coefficient: -scaledWidth, variable: "V" }])} <= ${formatNumber(-scaledMidpoint)}`,
    ];
  });
}

const macroSlackVariables = macroKeys.flatMap((macro) => [`macro_under_${macro}`, `macro_over_${macro}`]);
const categorySlackVariables = categoryKeys.flatMap((category) => [`category_under_${category}`, `category_over_${category}`]);

/**
 * Normalized fallback slack rows (spec §5.1). Each slack variable is already
 * divided by its range width at weight W, so D_macro and D_category are plain
 * sums of the slack variables with unit coefficients.
 */
function fallbackSlackConstraints(model: OptimizerModel): string[] {
  const weight = model.achievableTargetGrams;
  const macroRows = macroKeys.flatMap((macro) => {
    const [minimum, maximum] = model.macroRanges[macro];
    assertPositiveWidth(model.macroRanges[macro], `${macro} range`);
    const scaledWidth = weight * (maximum - minimum);
    return [
      ` macro_slack_${macro}_lower: ${rowExpression([...macroTerms(model, macro), { coefficient: scaledWidth, variable: `macro_under_${macro}` }])} >= ${formatNumber(weight * minimum)}`,
      ` macro_slack_${macro}_upper: ${rowExpression([...macroTerms(model, macro), { coefficient: -scaledWidth, variable: `macro_over_${macro}` }])} <= ${formatNumber(weight * maximum)}`,
    ];
  });
  const categoryRows = categoryKeys.flatMap((category) => {
    const [minimum, maximum] = model.categoryRanges[category];
    assertPositiveWidth(model.categoryRanges[category], `${category} range`);
    const scaledWidth = weight * (maximum - minimum);
    return [
      ` category_slack_${category}_lower: ${rowExpression([...categoryTerms(model, category, 100), { coefficient: scaledWidth, variable: `category_under_${category}` }])} >= ${formatNumber(weight * minimum)}`,
      ` category_slack_${category}_upper: ${rowExpression([...categoryTerms(model, category, 100), { coefficient: -scaledWidth, variable: `category_over_${category}` }])} <= ${formatNumber(weight * maximum)}`,
    ];
  });
  return [...macroRows, ...categoryRows];
}

function sumExpression(variables: readonly string[]): string {
  return variables.join(" + ") || "0";
}

function meaningfulCountDefinition(model: OptimizerModel): string {
  const terms = [
    { coefficient: 1, variable: "meaningful_count" },
    ...model.candidates.flatMap((candidate) => candidate.meaningfulInclusionVariable ? [{ coefficient: -1, variable: candidate.meaningfulInclusionVariable }] : []),
  ];
  return ` meaningful_count_definition: ${rowExpression(terms)} = 0`;
}

function compositionLocks(
  model: OptimizerModel,
  locks: Pick<ExactSerialLocks, "maximumShareGrams" | "meaningfulIngredientCount" | "quantityById">,
): string[] {
  const constraints: string[] = [];
  if (locks.maximumShareGrams !== undefined) {
    constraints.push(...lockBand("M", locks.maximumShareGrams, model.policy.maximumShareToleranceGrams, "maximum_share"));
  }
  if (locks.meaningfulIngredientCount !== undefined) {
    constraints.push(meaningfulCountDefinition(model));
    constraints.push(...lockBand("meaningful_count", locks.meaningfulIngredientCount, 0, "meaningful_count"));
  }
  for (const [id, quantity] of Object.entries(locks.quantityById ?? {}).sort(([left], [right]) => left.localeCompare(right))) {
    const candidate = model.candidates.find((entry) => entry.id === id);
    if (!candidate) throw new Error(`quantity tie-break lock references non-model candidate '${id}'`);
    constraints.push(...lockBand(candidate.quantityVariable, quantity, 0, `quantity_${id}`));
  }
  return constraints;
}

/**
 * Lowest macro margin a later exact stage may accept once Stage 3 found the
 * optimum r*: r* minus the policy's margin tolerance (an absolute part in
 * normalized range-width units plus a part relative to r*), never below 0.
 * The solver's numerical lock tolerance is applied separately by the caller.
 */
export function macroMarginLockFloor(policy: OptimizerModel["policy"], optimum: number): number {
  const allowance = policy.exactMarginTolerance + policy.exactMarginRelativeTolerance * Math.max(0, optimum);
  if (!Number.isFinite(allowance) || allowance < 0) throw new Error("macro margin tolerance must be finite and non-negative");
  return Math.max(0, optimum - allowance);
}

function priorExactLocks(model: OptimizerModel, locks: ExactSerialLocks): string[] {
  const constraints: string[] = [];
  if (locks.macroMargin !== undefined) {
    // The value is already the tolerance floor (see macroMarginLockFloor); r may
    // be anywhere at or above it, so only the lower side is locked.
    if (!Number.isFinite(locks.macroMargin)) throw new Error("macro_margin lock requires a finite value");
    constraints.push(` macro_margin_lower_lock: r >= ${formatNumber(locks.macroMargin)}`);
  }
  if (locks.categoryDistance !== undefined) {
    constraints.push(...lockBand("T", locks.categoryDistance, model.policy.categoryDistanceTolerance, "category_distance"));
  }
  constraints.push(...compositionLocks(model, locks));
  return constraints;
}

/**
 * Produces the deterministic objective and named LP rows for one exact-feasible
 * serial stage. It does not invoke a solver, Worker, or calculator runtime.
 *
 * A locked stage value is only meaningful together with the rows that define
 * it, so the defining rows for r (macro margin) and T (category distance) are
 * re-emitted in every later stage that carries their lock.
 */
export function buildExactSerialObjectivePlan(
  model: OptimizerModel,
  stage: ExactSerialStage,
  macroRanges: Record<OptimizerMacro, OptimizerRange>,
  categoryRanges: Record<OptimizerCategory, OptimizerRange>,
  locks: ExactSerialLocks = {},
  tieBreakId?: string,
): SerialObjectivePlan {
  const constraints = [...priorExactLocks(model, locks)];
  if (stage === "macro_margin" || locks.macroMargin !== undefined) constraints.push(...macroMarginConstraints(model, macroRanges));
  if (stage === "category_midpoint" || locks.categoryDistance !== undefined) constraints.push(...categoryMidpointConstraints(model, categoryRanges));
  switch (stage) {
    case "macro_margin":
      return { stage, sense: "maximize", expression: "r", constraints };
    case "category_midpoint":
      if (locks.macroMargin === undefined) throw new Error("category midpoint stage requires a locked macro margin");
      return { stage, sense: "minimize", expression: "T", constraints };
    case "maximum_share":
      if (locks.macroMargin === undefined || locks.categoryDistance === undefined) {
        throw new Error("maximum-share stage requires locked macro margin and category distance");
      }
      return { stage, sense: "minimize", expression: "M", constraints };
    case "meaningful_diversity":
      if (locks.maximumShareGrams === undefined) throw new Error("meaningful-diversity stage requires a locked maximum share");
      return { stage, sense: "maximize", expression: meaningfulIndicatorExpression(model), constraints };
    case "quantity_tie_break":
      return { stage, sense: "minimize", expression: tieBreakExpression(model, locks, tieBreakId), constraints };
  }
}

function meaningfulIndicatorExpression(model: OptimizerModel): string {
  return sumExpression(model.candidates.flatMap((candidate) => candidate.meaningfulInclusionVariable ? [candidate.meaningfulInclusionVariable] : []));
}

function tieBreakExpression(model: OptimizerModel, locks: { meaningfulIngredientCount?: number }, tieBreakId: string | undefined): string {
  if (locks.meaningfulIngredientCount === undefined) throw new Error("quantity tie-break stage requires a locked meaningful ingredient count");
  const candidate = model.candidates.find((entry) => entry.id === tieBreakId);
  if (!candidate) throw new Error("quantity tie-break stage requires one canonical model candidate id");
  return candidate.quantityVariable;
}

/**
 * Produces one best-attainable serial stage (spec §5.1–§5.2, Stage 1
 * infeasible). The hard macro/category rows are replaced by normalized slack
 * rows; D_macro is minimized and locked before D_category, and both locks are
 * carried into every later stage together with any locked midpoint distance.
 */
export function buildFallbackSerialObjectivePlan(
  model: OptimizerModel,
  stage: FallbackSerialStage,
  locks: FallbackSerialLocks = {},
  tieBreakId?: string,
): SerialObjectivePlan {
  const tolerance = model.policy.solverLockTolerance;
  const constraints = fallbackSlackConstraints(model);
  if (locks.macroDeviation !== undefined) {
    constraints.push(upperLock(sumExpression(macroSlackVariables), locks.macroDeviation, tolerance, "macro_deviation"));
  }
  if (locks.categoryDeviation !== undefined) {
    constraints.push(upperLock(sumExpression(categorySlackVariables), locks.categoryDeviation, tolerance, "category_deviation"));
  }
  if (stage === "macro_midpoint" || locks.macroDistance !== undefined) constraints.push(...macroMidpointConstraints(model, model.macroRanges));
  if (locks.macroDistance !== undefined) constraints.push(upperLock("V", locks.macroDistance, model.policy.macroDistanceTolerance + tolerance, "macro_distance"));
  if (stage === "category_midpoint" || locks.categoryDistance !== undefined) constraints.push(...categoryMidpointConstraints(model, model.categoryRanges));
  if (locks.categoryDistance !== undefined) constraints.push(upperLock("T", locks.categoryDistance, model.policy.categoryDistanceTolerance + tolerance, "category_distance"));
  constraints.push(...compositionLocks(model, locks));

  const requireLocks = (required: ReadonlyArray<keyof FallbackSerialLocks>): void => {
    const missing = required.filter((key) => locks[key] === undefined);
    if (missing.length > 0) throw new Error(`${stage} stage requires locked ${missing.join(", ")}`);
  };

  switch (stage) {
    case "macro_deviation":
      return { stage, sense: "minimize", expression: sumExpression(macroSlackVariables), constraints };
    case "category_deviation":
      requireLocks(["macroDeviation"]);
      return { stage, sense: "minimize", expression: sumExpression(categorySlackVariables), constraints };
    case "macro_midpoint":
      requireLocks(["macroDeviation", "categoryDeviation"]);
      return { stage, sense: "minimize", expression: "V", constraints };
    case "category_midpoint":
      requireLocks(["macroDeviation", "categoryDeviation", "macroDistance"]);
      return { stage, sense: "minimize", expression: "T", constraints };
    case "maximum_share":
      requireLocks(["macroDeviation", "categoryDeviation", "macroDistance", "categoryDistance"]);
      return { stage, sense: "minimize", expression: "M", constraints };
    case "meaningful_diversity":
      requireLocks(["macroDeviation", "categoryDeviation", "macroDistance", "categoryDistance", "maximumShareGrams"]);
      return { stage, sense: "maximize", expression: meaningfulIndicatorExpression(model), constraints };
    case "quantity_tie_break":
      requireLocks(["macroDeviation", "categoryDeviation", "macroDistance", "categoryDistance", "maximumShareGrams"]);
      return { stage, sense: "minimize", expression: tieBreakExpression(model, locks, tieBreakId), constraints };
  }
}

function upperLock(expression: string, value: number, tolerance: number, name: string): string {
  if (!Number.isFinite(value) || !Number.isFinite(tolerance) || tolerance < 0) {
    throw new Error(`${name} lock requires finite value and non-negative tolerance`);
  }
  return ` ${name}_lock: ${expression} <= ${formatNumber(Math.max(0, value) + tolerance)}`;
}

export interface EvaluatedSerialObjectives {
  /** Smallest normalized clearance from any macro bound (spec §4.2); negative when a macro is outside its range. */
  macroMargin: number;
  /** D_macro (spec §5.1). */
  macroDeviation: number;
  /** D_category (spec §5.1). */
  categoryDeviation: number;
  /** Maximum normalized macro midpoint distance (fallback Stage 3). */
  macroDistance: number;
  /** T, maximum normalized category midpoint distance (spec §4.3). */
  categoryDistance: number;
  maximumShareGrams: number;
  meaningfulIngredientCount: number;
}

/**
 * Evaluates every serial objective exactly from a whole-gram quantity vector,
 * straight from the spec definitions. Stage locks use these values rather than
 * the solver's reported objective: HiGHS may report an objective that is
 * better than the returned mix by up to its feasibility tolerance, and
 * locking that relaxed value can make the true optimum infeasible later.
 */
export function evaluateSerialObjectives(model: OptimizerModel, quantities: Readonly<Record<string, number>>): EvaluatedSerialObjectives {
  const weight = model.achievableTargetGrams;
  const grams = model.candidates.map((candidate) => {
    const value = quantities[candidate.id];
    if (value === undefined || !Number.isFinite(value)) throw new Error(`missing quantity for '${candidate.id}'`);
    return value;
  });
  const macroPercent = (macro: OptimizerMacro) => model.candidates.reduce((total, candidate, index) => total + candidate.nutrition[macro] * grams[index], 0) / weight;
  const categoryPercent = (category: OptimizerCategory) => model.candidates.reduce((total, candidate, index) => total + (candidate.category === category ? grams[index] : 0), 0) / weight * 100;
  const macros = macroKeys.map((macro) => ({ value: macroPercent(macro), range: model.macroRanges[macro] }));
  const categories = categoryKeys.map((category) => ({ value: categoryPercent(category), range: model.categoryRanges[category] }));
  const deviation = (entries: typeof macros) => entries.reduce((total, { value, range: [minimum, maximum] }) => (
    total + (Math.max(0, minimum - value) + Math.max(0, value - maximum)) / (maximum - minimum)
  ), 0);
  const midpointDistance = (entries: typeof macros) => Math.max(...entries.map(({ value, range: [minimum, maximum] }) => (
    Math.abs(value - (minimum + maximum) / 2) / (maximum - minimum)
  )));

  return {
    macroMargin: Math.min(...macros.map(({ value, range: [minimum, maximum] }) => Math.min(value - minimum, maximum - value) / (maximum - minimum))),
    macroDeviation: deviation(macros),
    categoryDeviation: deviation(categories),
    macroDistance: midpointDistance(macros),
    categoryDistance: midpointDistance(categories),
    maximumShareGrams: Math.max(0, ...grams),
    meaningfulIngredientCount: model.candidates.filter((candidate, index) => (
      candidate.meaningfulInclusionVariable !== undefined && grams[index] >= model.policy.meaningfulInclusionGrams
    )).length,
  };
}

/**
 * Returns only facts proven before a relaxed fallback solve. It deliberately
 * does not call a range interaction infeasible or compose visitor-facing copy.
 */
export function buildInfeasibilityEvidence(request: InfeasibilityEvidenceRequest): InfeasibilityEvidence {
  const stockShortfallGrams = Math.max(0, request.requestedTargetGrams - request.model.achievableTargetGrams);
  return {
    requestedTargetGrams: request.requestedTargetGrams,
    achievableTargetGrams: request.model.achievableTargetGrams,
    stockShortfallGrams,
    safetyExcludedIds: Array.from(new Set(request.safetyExcludedIds)).sort(),
    hardMacroRanges: request.macroRanges,
    hardCategoryRanges: request.categoryRanges,
    classification: stockShortfallGrams > 0 ? "stock_limited" : "range_interaction_requires_solver",
    note: stockShortfallGrams > 0
      ? "Safe eligible inventory is below the requested target; this is a proven stock limit, not a fallback explanation."
      : "Range interaction requires a solved relaxed model before any infeasibility reason can be stated.",
  };
}
