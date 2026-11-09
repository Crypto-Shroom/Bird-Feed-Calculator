import type { BirdType } from "./birds";

/**
 * Share of the whole diet (percent) that the calculator's mix may make up, for the birds whose nutrition ranges describe
 * the whole diet. Sources: Brightsmith 2012 (Amazon parrots: about 18% seed mix in the diet was acceptable on calcium and
 * most nutrients) for parrots and African Greys; Oregon State PNW 477 (scratch about 10-15% of daily intake, top of the
 * range used) for chickens. Birds that live mainly on a seed mix (pigeon, budgie, canary) are not listed.
 */
export const MIX_SHARE_OF_DIET_PERCENT: Partial<Record<BirdType, number>> = {
  parrot: 18,
  african_grey: 18,
  chicken: 15,
};

export type RestOfDietNeed =
  | { kind: "range"; min: number; max: number }
  | { kind: "upTo"; max: number }
  | { kind: "exceeded" };

/**
 * What the rest of the diet must supply (percent of the rest) so that mix and rest together land in the whole-diet target.
 * `mixValue` is the nutrient percent of the mix; `mixSharePercent` is the mix's share of the whole diet.
 */
export function restOfDietNeed(target: [number, number], mixValue: number, mixSharePercent: number): RestOfDietNeed {
  const share = mixSharePercent / 100;
  const restShare = 1 - share;
  const min = (target[0] - share * mixValue) / restShare;
  const max = (target[1] - share * mixValue) / restShare;
  if (max < 0) return { kind: "exceeded" };
  if (min <= 0) return { kind: "upTo", max };
  return { kind: "range", min, max };
}
