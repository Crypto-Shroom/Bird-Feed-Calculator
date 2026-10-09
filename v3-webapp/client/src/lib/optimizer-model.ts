import { OPTIMIZER_POLICY, type OptimizerPolicy } from "./optimizer-policy";

export type OptimizerCategory = "grain" | "legume" | "seed";
export type OptimizerMacro = "protein" | "carbs" | "fat" | "fiber";

export type OptimizerRange = readonly [minimum: number, maximum: number];

export interface OptimizerCandidate {
  id: string;
  category: OptimizerCategory;
  availableGrams: number;
  nutrition: Record<OptimizerMacro, number>;
  safetyState: "eligible" | "excluded";
}

export interface OptimizerModelRequest {
  candidates: readonly OptimizerCandidate[];
  requestedTargetGrams: number;
  macroRanges: Record<OptimizerMacro, OptimizerRange>;
  categoryRanges: Record<OptimizerCategory, OptimizerRange>;
  policy?: OptimizerPolicy;
}

export interface NormalizedOptimizerCandidate extends Omit<OptimizerCandidate, "availableGrams"> {
  availableGrams: number;
  quantityVariable: string;
  meaningfulInclusionVariable?: string;
}

/**
 * Named CPLEX-LP fragments of the full-mix model. Serial stages re-render the
 * same variables and structural rows with their own objective and locks; the
 * hard macro/category target rows are kept separate so a best-attainable
 * fallback can replace them with normalized slack rows.
 */
export interface OptimizerModelSections {
  /** Exact weight and maximum-share links. */
  structuralRows: readonly string[];
  /**
   * Meaningful-inclusion links between x_i and binary z_i. Before the
   * diversity stage they never restrict x (any x has a valid z), so earlier
   * stages may omit them together with the binaries without changing the
   * feasible quantity set.
   */
  inclusionRows: readonly string[];
  /** Hard macro and category range rows (Stage 1 exact feasibility). */
  targetRows: readonly string[];
  bounds: readonly string[];
  generals: readonly string[];
  binaries: readonly string[];
}

export interface OptimizerModel {
  lp: string;
  candidates: readonly NormalizedOptimizerCandidate[];
  achievableTargetGrams: number;
  policy: OptimizerPolicy;
  macroRanges: Record<OptimizerMacro, OptimizerRange>;
  categoryRanges: Record<OptimizerCategory, OptimizerRange>;
  sections: OptimizerModelSections;
}

export interface OptimizerLpRenderRequest {
  sense: "minimize" | "maximize";
  objectiveName: string;
  objective: string;
  /** Exact-feasible stages keep the hard target rows; fallback stages omit them. */
  includeTargetRows: boolean;
  /** Include the meaningful-inclusion rows and binaries (required once diversity is optimized or locked). */
  includeInclusionLinks: boolean;
  extraRows?: readonly string[];
  extraBounds?: readonly string[];
}

const macroKeys: readonly OptimizerMacro[] = ["protein", "carbs", "fat", "fiber"];
const categoryKeys: readonly OptimizerCategory[] = ["grain", "legume", "seed"];
const identifierPattern = /^[a-z][a-z0-9_]*$/;
const numericTolerance = 1e-9;

export function formatNumber(value: number): string {
  const normalized = Math.abs(value) < numericTolerance ? 0 : value;
  if (!Number.isFinite(normalized)) throw new Error(`Cannot format non-finite model value: ${value}`);
  return Number.isInteger(normalized)
    ? String(normalized)
    : normalized.toFixed(9).replace(/0+$/, "").replace(/\.$/, "");
}

export function formatExpression(terms: ReadonlyArray<{ coefficient: number; variable: string }>): string {
  const nonZeroTerms = terms.filter(({ coefficient }) => Math.abs(coefficient) >= numericTolerance);
  if (nonZeroTerms.length === 0) return "0";

  return nonZeroTerms.map(({ coefficient, variable }, index) => {
    const absolute = formatNumber(Math.abs(coefficient));
    const prefix = index === 0 ? (coefficient < 0 ? "- " : "") : (coefficient < 0 ? " - " : " + ");
    return `${prefix}${absolute} ${variable}`;
  }).join("");
}

function assertRange(range: OptimizerRange, name: string): void {
  const [minimum, maximum] = range;
  if (!Number.isFinite(minimum) || !Number.isFinite(maximum) || minimum > maximum) {
    throw new Error(`${name} must be a finite ascending range`);
  }
}

function assertPolicy(policy: OptimizerPolicy): void {
  if (!Number.isInteger(policy.gramIncrement) || policy.gramIncrement <= 0) {
    throw new Error("optimizer gram increment must be a positive whole number");
  }
  if (!Number.isInteger(policy.meaningfulInclusionGrams) || policy.meaningfulInclusionGrams < policy.gramIncrement) {
    throw new Error("meaningful inclusion must be a whole number at least as large as the gram increment");
  }
}

function normalizeCandidates(candidates: readonly OptimizerCandidate[], policy: OptimizerPolicy): readonly NormalizedOptimizerCandidate[] {
  const ids = new Set<string>();
  return [...candidates]
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((candidate) => {
      if (!identifierPattern.test(candidate.id)) throw new Error(`candidate id '${candidate.id}' is not a safe canonical identifier`);
      if (ids.has(candidate.id)) throw new Error(`candidate id '${candidate.id}' is duplicated`);
      ids.add(candidate.id);
      if (candidate.safetyState !== "eligible") throw new Error(`candidate '${candidate.id}' did not pass the safety gate`);
      if (!Number.isFinite(candidate.availableGrams) || candidate.availableGrams < 0) {
        throw new Error(`candidate '${candidate.id}' has invalid available grams`);
      }

      for (const macro of macroKeys) {
        if (!Number.isFinite(candidate.nutrition[macro])) throw new Error(`candidate '${candidate.id}' has invalid ${macro} nutrition`);
      }

      const availableGrams = Math.floor(candidate.availableGrams / policy.gramIncrement) * policy.gramIncrement;
      const quantityVariable = `x_${candidate.id}`;
      return {
        ...candidate,
        availableGrams,
        quantityVariable,
        ...(availableGrams >= policy.meaningfulInclusionGrams ? { meaningfulInclusionVariable: `z_${candidate.id}` } : {}),
      };
    });
}

export function buildExactFeasibilityModel(request: OptimizerModelRequest): OptimizerModel {
  const policy = request.policy ?? OPTIMIZER_POLICY;
  assertPolicy(policy);
  if (!Number.isFinite(request.requestedTargetGrams) || request.requestedTargetGrams < 0) {
    throw new Error("requested target grams must be finite and non-negative");
  }
  if (request.requestedTargetGrams % policy.gramIncrement !== 0) {
    throw new Error("requested target grams must align to the configured gram increment");
  }

  for (const macro of macroKeys) assertRange(request.macroRanges[macro], `${macro} range`);
  for (const category of categoryKeys) assertRange(request.categoryRanges[category], `${category} range`);

  const candidates = normalizeCandidates(request.candidates, policy);
  const availableTotal = candidates.reduce((total, candidate) => total + candidate.availableGrams, 0);
  const achievableTargetGrams = Math.min(request.requestedTargetGrams, availableTotal);

  if (achievableTargetGrams === 0) throw new Error("no positive, safe eligible inventory is available for the model");

  const exactWeightRow = ` exact_weight: ${formatExpression(candidates.map(({ quantityVariable }) => ({ coefficient: 1, variable: quantityVariable })))} = ${formatNumber(achievableTargetGrams)}`;
  const targetRows: string[] = [];

  for (const macro of macroKeys) {
    const [minimum, maximum] = request.macroRanges[macro];
    const expression = formatExpression(candidates.map(({ nutrition, quantityVariable }) => ({ coefficient: nutrition[macro], variable: quantityVariable })));
    targetRows.push(` ${macro}_minimum: ${expression} >= ${formatNumber(minimum * achievableTargetGrams)}`);
    targetRows.push(` ${macro}_maximum: ${expression} <= ${formatNumber(maximum * achievableTargetGrams)}`);
  }

  for (const category of categoryKeys) {
    const [minimum, maximum] = request.categoryRanges[category];
    const expression = formatExpression(candidates.filter((candidate) => candidate.category === category).map(({ quantityVariable }) => ({ coefficient: 1, variable: quantityVariable })));
    targetRows.push(` ${category}_minimum: ${expression} >= ${formatNumber((minimum / 100) * achievableTargetGrams)}`);
    targetRows.push(` ${category}_maximum: ${expression} <= ${formatNumber((maximum / 100) * achievableTargetGrams)}`);
  }

  const candidateRows: string[] = [];
  const shareRows: string[] = [];
  const inclusionRows: string[] = [];
  for (const candidate of candidates) {
    const shareRow = ` maximum_share_${candidate.id}: ${candidate.quantityVariable} - M <= 0`;
    candidateRows.push(shareRow);
    shareRows.push(shareRow);
    if (candidate.meaningfulInclusionVariable) {
      const inactiveMaximum = policy.meaningfulInclusionGrams - policy.gramIncrement;
      const activeAllowance = candidate.availableGrams - policy.meaningfulInclusionGrams + policy.gramIncrement;
      const links = [
        ` meaningful_lower_${candidate.id}: ${candidate.quantityVariable} - ${formatNumber(policy.meaningfulInclusionGrams)} ${candidate.meaningfulInclusionVariable} >= 0`,
        ` meaningful_upper_${candidate.id}: ${candidate.quantityVariable} - ${formatNumber(activeAllowance)} ${candidate.meaningfulInclusionVariable} <= ${formatNumber(inactiveMaximum)}`,
      ];
      candidateRows.push(...links);
      inclusionRows.push(...links);
    }
  }

  const bounds = [
    ...candidates.map((candidate) => ` 0 <= ${candidate.quantityVariable} <= ${formatNumber(candidate.availableGrams)}`),
    ` 0 <= M <= ${formatNumber(achievableTargetGrams)}`,
  ];
  const generals = candidates.map(({ quantityVariable }) => ` ${quantityVariable}`);
  const binaries = candidates.flatMap(({ meaningfulInclusionVariable }) => meaningfulInclusionVariable ? [` ${meaningfulInclusionVariable}`] : []);

  const lines = ["Minimize", " exact_feasibility: 0", "Subject To", exactWeightRow, ...targetRows, ...candidateRows, "Bounds", ...bounds, "Generals", ...generals];
  if (binaries.length > 0) lines.push("Binaries", ...binaries);
  lines.push("End");

  return {
    lp: lines.join("\n"),
    candidates,
    achievableTargetGrams,
    policy,
    macroRanges: request.macroRanges,
    categoryRanges: request.categoryRanges,
    sections: {
      structuralRows: [exactWeightRow, ...shareRows],
      inclusionRows,
      targetRows,
      bounds,
      generals,
      binaries,
    },
  };
}

/**
 * Renders one serial stage as a complete CPLEX-LP problem over the same
 * full-mix variables. It never carries a partial recipe between stages; prior
 * stage results enter only as explicit lock rows supplied by the caller.
 */
export function renderOptimizerStageLp(model: OptimizerModel, request: OptimizerLpRenderRequest): string {
  if (!identifierPattern.test(request.objectiveName)) throw new Error(`objective name '${request.objectiveName}' is not a safe identifier`);
  const lines = [
    request.sense === "maximize" ? "Maximize" : "Minimize",
    ` ${request.objectiveName}: ${request.objective}`,
    "Subject To",
    ...model.sections.structuralRows,
    ...(request.includeInclusionLinks ? model.sections.inclusionRows : []),
    ...(request.includeTargetRows ? model.sections.targetRows : []),
    ...(request.extraRows ?? []),
    "Bounds",
    ...model.sections.bounds,
    ...(request.extraBounds ?? []),
    "Generals",
    ...model.sections.generals,
  ];
  if (request.includeInclusionLinks && model.sections.binaries.length > 0) lines.push("Binaries", ...model.sections.binaries);
  lines.push("End");
  return lines.join("\n");
}
