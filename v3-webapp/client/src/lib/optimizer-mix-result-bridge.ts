import type { BirdType } from "./birds";
import { MultibirMixCalculator, type MixResult } from "./calculator-multi-bird";

const weightTolerance = 1e-9;

/**
 * Replaces the synchronous mix with a strictly validated Worker mix (a
 * `feasible` mix, or the `best_attainable` fallback when no mix meets every
 * range) and
 * recomputes every mix-derived field from that mix, so the analysis shown
 * beside it describes the mix actually shown:
 *
 * - `nutrition`, `categories`, `optimization`, and `suggestions` come from the
 *   calculator's own helpers and existing suggestion wording, applied to the
 *   Worker mix (no new visitor copy).
 * - `warnings` and `missingIngredients` depend only on the entered inventory
 *   (safety exclusions, missing categories, and the "scaled to available
 *   inventory" notice), never on the chosen quantities, so they are kept. The
 *   scaled-weight notice is only valid while both paths use the same total, so
 *   a Worker mix whose total differs from the synchronous target is rejected
 *   and the synchronous result is kept.
 * - `herbRecommendations` and `herbPurpose` are profile guidance and are kept.
 */
export function bridgeFeasibleWorkerMixToMixResult(
  fallback: MixResult,
  workerMix: Readonly<Record<string, number>>,
  inventory: Readonly<Record<string, number>>,
  bird: BirdType,
  situation: string,
): MixResult {
  const mix = Object.fromEntries(Object.entries(workerMix).filter(([, grams]) => Number.isFinite(grams) && grams > 0));
  const targetWeight = Object.values(mix).reduce((total, grams) => total + grams, 0);
  if (!targetWeight || Math.abs(targetWeight - fallback.targetWeight) > weightTolerance) return fallback;

  const summary = new MultibirMixCalculator({ ...inventory }, bird, situation).summarizeMix(mix);
  if (!summary) return fallback;
  return {
    ...fallback,
    mix,
    targetWeight,
    ...summary,
  };
}
