import type { OptimizerCategory, OptimizerMacro, OptimizerModel, OptimizerRange } from "./optimizer-model";

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

export interface ExactSerialLocks {
  macroMargin?: number;
  categoryDistance?: number;
  maximumShareGrams?: number;
  meaningfulIngredientCount?: number;
  quantityById?: Record<string, number>;
}

export interface SerialObjectivePlan {
  stage: ExactSerialStage;
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

function macroExpression(model: OptimizerModel, macro: OptimizerMacro): string {
  return model.candidates.map((candidate, index) => {
    const prefix = index === 0 ? "" : " + ";
    return `${prefix}${formatNumber(candidate.nutrition[macro])} ${candidate.quantityVariable}`;
  }).join("") || "0";
}

function categoryExpression(model: OptimizerModel, category: OptimizerCategory): string {
  const candidates = model.candidates.filter((candidate) => candidate.category === category);
  return candidates.map((candidate, index) => `${index === 0 ? "" : " + "}${candidate.quantityVariable}`).join("") || "0";
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
    const expression = macroExpression(model, macro);
    const width = maximum - minimum;
    const scaledWidth = model.achievableTargetGrams * width;
    return [
      ` macro_margin_${macro}_lower: ${expression} - ${formatNumber(scaledWidth)} r >= ${formatNumber(model.achievableTargetGrams * minimum)}`,
      ` macro_margin_${macro}_upper: ${expression} + ${formatNumber(scaledWidth)} r <= ${formatNumber(model.achievableTargetGrams * maximum)}`,
    ];
  });
}

function categoryMidpointConstraints(model: OptimizerModel, ranges: Record<OptimizerCategory, OptimizerRange>): string[] {
  return categoryKeys.flatMap((category) => {
    const [minimum, maximum] = ranges[category];
    assertPositiveWidth(ranges[category], `${category} range`);
    const expression = categoryExpression(model, category);
    const midpoint = (minimum + maximum) / 2;
    const scaledWidth = model.achievableTargetGrams * (maximum - minimum);
    const scaledMidpoint = model.achievableTargetGrams * midpoint;
    return [
      ` category_distance_${category}_positive: 100 ${expression} - ${formatNumber(scaledWidth)} T <= ${formatNumber(scaledMidpoint)}`,
      ` category_distance_${category}_negative: - 100 ${expression} - ${formatNumber(scaledWidth)} T <= ${formatNumber(-scaledMidpoint)}`,
    ];
  });
}

function priorExactLocks(model: OptimizerModel, locks: ExactSerialLocks): string[] {
  const constraints: string[] = [];
  if (locks.macroMargin !== undefined) {
    constraints.push(...lockBand("r", locks.macroMargin, model.policy.exactMarginTolerance, "macro_margin"));
  }
  if (locks.categoryDistance !== undefined) {
    constraints.push(...lockBand("T", locks.categoryDistance, model.policy.categoryDistanceTolerance, "category_distance"));
  }
  if (locks.maximumShareGrams !== undefined) {
    constraints.push(...lockBand("M", locks.maximumShareGrams, model.policy.maximumShareToleranceGrams, "maximum_share"));
  }
  if (locks.meaningfulIngredientCount !== undefined) {
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
 * Produces the deterministic objective and named LP rows for one exact-feasible
 * serial stage. It does not invoke a solver, Worker, or calculator runtime.
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
  switch (stage) {
    case "macro_margin":
      constraints.push(...macroMarginConstraints(model, macroRanges));
      return { stage, sense: "maximize", expression: "r", constraints };
    case "category_midpoint":
      if (locks.macroMargin === undefined) throw new Error("category midpoint stage requires a locked macro margin");
      constraints.push(...categoryMidpointConstraints(model, categoryRanges));
      return { stage, sense: "minimize", expression: "T", constraints };
    case "maximum_share":
      if (locks.macroMargin === undefined || locks.categoryDistance === undefined) {
        throw new Error("maximum-share stage requires locked macro margin and category distance");
      }
      return { stage, sense: "minimize", expression: "M", constraints };
    case "meaningful_diversity": {
      if (locks.maximumShareGrams === undefined) throw new Error("meaningful-diversity stage requires a locked maximum share");
      const indicators = model.candidates.flatMap((candidate) => candidate.meaningfulInclusionVariable ? [candidate.meaningfulInclusionVariable] : []);
      const expression = indicators.join(" + ") || "0";
      return { stage, sense: "maximize", expression, constraints };
    }
    case "quantity_tie_break": {
      if (locks.meaningfulIngredientCount === undefined) throw new Error("quantity tie-break stage requires a locked meaningful ingredient count");
      const candidate = model.candidates.find((entry) => entry.id === tieBreakId);
      if (!candidate) throw new Error("quantity tie-break stage requires one canonical model candidate id");
      return { stage, sense: "minimize", expression: candidate.quantityVariable, constraints };
    }
  }
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
