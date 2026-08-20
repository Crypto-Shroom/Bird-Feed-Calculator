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

export interface OptimizerModel {
  lp: string;
  candidates: readonly NormalizedOptimizerCandidate[];
  achievableTargetGrams: number;
  policy: OptimizerPolicy;
}

const macroKeys: readonly OptimizerMacro[] = ["protein", "carbs", "fat", "fiber"];
const categoryKeys: readonly OptimizerCategory[] = ["grain", "legume", "seed"];
const identifierPattern = /^[a-z][a-z0-9_]*$/;
const numericTolerance = 1e-9;

function formatNumber(value: number): string {
  const normalized = Math.abs(value) < numericTolerance ? 0 : value;
  if (!Number.isFinite(normalized)) throw new Error(`Cannot format non-finite model value: ${value}`);
  return Number.isInteger(normalized)
    ? String(normalized)
    : normalized.toFixed(9).replace(/0+$/, "").replace(/\.$/, "");
}

function formatExpression(terms: ReadonlyArray<{ coefficient: number; variable: string }>): string {
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

  const lines = ["Minimize", " exact_feasibility: 0", "Subject To"];
  lines.push(` exact_weight: ${formatExpression(candidates.map(({ quantityVariable }) => ({ coefficient: 1, variable: quantityVariable })))} = ${formatNumber(achievableTargetGrams)}`);

  for (const macro of macroKeys) {
    const [minimum, maximum] = request.macroRanges[macro];
    const expression = formatExpression(candidates.map(({ nutrition, quantityVariable }) => ({ coefficient: nutrition[macro], variable: quantityVariable })));
    lines.push(` ${macro}_minimum: ${expression} >= ${formatNumber(minimum * achievableTargetGrams)}`);
    lines.push(` ${macro}_maximum: ${expression} <= ${formatNumber(maximum * achievableTargetGrams)}`);
  }

  for (const category of categoryKeys) {
    const [minimum, maximum] = request.categoryRanges[category];
    const expression = formatExpression(candidates.filter((candidate) => candidate.category === category).map(({ quantityVariable }) => ({ coefficient: 1, variable: quantityVariable })));
    lines.push(` ${category}_minimum: ${expression} >= ${formatNumber((minimum / 100) * achievableTargetGrams)}`);
    lines.push(` ${category}_maximum: ${expression} <= ${formatNumber((maximum / 100) * achievableTargetGrams)}`);
  }

  for (const candidate of candidates) {
    lines.push(` maximum_share_${candidate.id}: ${candidate.quantityVariable} - M <= 0`);
    if (candidate.meaningfulInclusionVariable) {
      const inactiveMaximum = policy.meaningfulInclusionGrams - policy.gramIncrement;
      const activeAllowance = candidate.availableGrams - policy.meaningfulInclusionGrams + policy.gramIncrement;
      lines.push(` meaningful_lower_${candidate.id}: ${candidate.quantityVariable} - ${formatNumber(policy.meaningfulInclusionGrams)} ${candidate.meaningfulInclusionVariable} >= 0`);
      lines.push(` meaningful_upper_${candidate.id}: ${candidate.quantityVariable} - ${formatNumber(activeAllowance)} ${candidate.meaningfulInclusionVariable} <= ${formatNumber(inactiveMaximum)}`);
    }
  }

  lines.push("Bounds");
  for (const candidate of candidates) lines.push(` 0 <= ${candidate.quantityVariable} <= ${formatNumber(candidate.availableGrams)}`);
  lines.push(` 0 <= M <= ${formatNumber(achievableTargetGrams)}`);
  lines.push("Generals");
  lines.push(...candidates.map(({ quantityVariable }) => ` ${quantityVariable}`));
  const meaningfulVariables = candidates.flatMap(({ meaningfulInclusionVariable }) => meaningfulInclusionVariable ? [meaningfulInclusionVariable] : []);
  if (meaningfulVariables.length > 0) {
    lines.push("Binaries");
    lines.push(...meaningfulVariables.map((variable) => ` ${variable}`));
  }
  lines.push("End");

  return { lp: lines.join("\n"), candidates, achievableTargetGrams, policy };
}
