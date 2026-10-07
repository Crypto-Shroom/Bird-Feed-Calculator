import type { OptimizerCategory, OptimizerMacro, OptimizerModel, OptimizerRange } from "./optimizer-model";
import { buildInfeasibilityEvidence, type InfeasibilityEvidence } from "./optimizer-stages";

const macroKeys: readonly OptimizerMacro[] = ["protein", "carbs", "fat", "fiber"];
const categoryKeys: readonly OptimizerCategory[] = ["grain", "legume", "seed"];
const rangeTolerance = 1e-6;

/**
 * Why one configured range is missed by a `best_attainable` mix. Each reason is
 * proven from the safe eligible inventory alone; nothing is inferred.
 *
 * - `no_ingredient_reaches` (macros only): every eligible ingredient is itself
 *   below the minimum (or above the maximum), so no blend can reach the range.
 * - `not_enough_stock`: the range is unreachable within the available grams:
 *   for a macro, even filling the batch with the eligible ingredients richest
 *   (or poorest) in it, up to their stock, stays outside; for a category, its
 *   own stock is below the minimum share, or the other categories' stock is
 *   too small to keep it under the maximum share.
 * - `not_together`: neither of the above holds. Stage 1 proved that no mix
 *   meets every range at once, and the solver kept this range missed because
 *   meeting it would cost a higher-priority range (macros before categories).
 */
export type FallbackMissReason = "no_ingredient_reaches" | "not_enough_stock" | "not_together";

export type FallbackRangeMiss =
  | { kind: "macro"; key: OptimizerMacro; direction: "below" | "above"; value: number; range: OptimizerRange; reason: FallbackMissReason }
  | { kind: "category"; key: OptimizerCategory; direction: "below" | "above"; value: number; range: OptimizerRange; reason: Exclude<FallbackMissReason, "no_ingredient_reaches"> };

export interface BestAttainableExplanation {
  misses: FallbackRangeMiss[];
  evidence: InfeasibilityEvidence;
}

export interface BestAttainableExplanationRequest {
  model: OptimizerModel;
  /** The validated canonical solver mix (model candidate ids), before form allocation. */
  mix: Readonly<Record<string, number>>;
  requestedTargetGrams: number;
  safetyExcludedIds: readonly string[];
}

/** Highest (or lowest) macro percentage any whole batch of weight W can reach within stock (continuous bound). */
function extremeMacroPercent(model: OptimizerModel, macro: OptimizerMacro, direction: "highest" | "lowest"): number {
  const ordered = model.candidates
    .filter(({ availableGrams }) => availableGrams > 0)
    .sort((left, right) => direction === "highest" ? right.nutrition[macro] - left.nutrition[macro] : left.nutrition[macro] - right.nutrition[macro]);
  let remaining = model.achievableTargetGrams;
  let total = 0;
  for (const candidate of ordered) {
    const grams = Math.min(remaining, candidate.availableGrams);
    total += grams * candidate.nutrition[macro];
    remaining -= grams;
    if (remaining <= 0) break;
  }
  return total / model.achievableTargetGrams;
}

/**
 * Lists every configured macro and category range the fallback mix misses,
 * with a proven reason for each, plus the existing pre-solve infeasibility
 * evidence. It returns data only; visitor wording lives in optimizer-copy.ts.
 */
export function explainBestAttainable(request: BestAttainableExplanationRequest): BestAttainableExplanation {
  const { model, mix } = request;
  const weight = model.achievableTargetGrams;
  const stocked = model.candidates.filter(({ availableGrams }) => availableGrams > 0);
  const misses: FallbackRangeMiss[] = [];

  for (const macro of macroKeys) {
    const [minimum, maximum] = model.macroRanges[macro];
    const value = model.candidates.reduce((total, candidate) => total + candidate.nutrition[macro] * (mix[candidate.id] ?? 0), 0) / weight;
    if (value >= minimum - rangeTolerance && value <= maximum + rangeTolerance) continue;
    const direction = value < minimum ? "below" as const : "above" as const;
    const values = stocked.map(({ nutrition }) => nutrition[macro]);
    let reason: FallbackMissReason = "not_together";
    if (direction === "below" ? Math.max(...values) < minimum - rangeTolerance : Math.min(...values) > maximum + rangeTolerance) {
      reason = "no_ingredient_reaches";
    } else if (direction === "below"
      ? extremeMacroPercent(model, macro, "highest") < minimum - rangeTolerance
      : extremeMacroPercent(model, macro, "lowest") > maximum + rangeTolerance) {
      reason = "not_enough_stock";
    }
    misses.push({ kind: "macro", key: macro, direction, value, range: model.macroRanges[macro], reason });
  }

  for (const category of categoryKeys) {
    const [minimum, maximum] = model.categoryRanges[category];
    const grams = model.candidates.reduce((total, candidate) => total + (candidate.category === category ? mix[candidate.id] ?? 0 : 0), 0);
    const value = grams / weight * 100;
    if (value >= minimum - rangeTolerance && value <= maximum + rangeTolerance) continue;
    const direction = value < minimum ? "below" as const : "above" as const;
    const ownStock = stocked.reduce((total, candidate) => total + (candidate.category === category ? candidate.availableGrams : 0), 0);
    const otherStock = stocked.reduce((total, candidate) => total + (candidate.category === category ? 0 : candidate.availableGrams), 0);
    const stockShort = direction === "below"
      ? ownStock / weight * 100 < minimum - rangeTolerance
      : otherStock / weight * 100 < 100 - maximum - rangeTolerance;
    misses.push({ kind: "category", key: category, direction, value, range: model.categoryRanges[category], reason: stockShort ? "not_enough_stock" : "not_together" });
  }

  return {
    misses,
    evidence: buildInfeasibilityEvidence({
      model,
      requestedTargetGrams: request.requestedTargetGrams,
      safetyExcludedIds: request.safetyExcludedIds,
      macroRanges: model.macroRanges,
      categoryRanges: model.categoryRanges,
    }),
  };
}
