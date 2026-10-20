import type { FallbackRangeMiss } from "./optimizer-explain";

/**
 * DRAFT visitor-facing wording for the best-attainable (fallback) mix notice.
 * Not yet approved by the product owner: every string the notice can show is
 * in this one object so it can be reviewed and changed in one place.
 *
 * The range labels reuse the existing on-screen labels (the Protein/Carbs/Fat/
 * Fiber cards and the Grains/Legumes/Seeds category bars). The reasons only
 * restate facts proven by optimizer-explain.ts; they make no nutrition claim.
 */
export const OPTIMIZER_FALLBACK_COPY = {
  approvalStatus: "draft-awaiting-owner-approval",
  title: "Closest possible mix",
  intro: "No mix of your current ingredients meets every target range, so this is the closest one possible with your inventory.",
  missesHeading: "Ranges it cannot meet:",
  macroLabels: { protein: "Protein", carbs: "Carbs", fat: "Fat", fiber: "Fiber" },
  categoryLabels: { grain: "Grains", legume: "Legumes", seed: "Oily seeds" },
  miss: { below: "{label} (below range)", above: "{label} (above range)" },
  reasons: {
    macro: {
      no_ingredient_reaches: {
        below: "none of your ingredients is high enough in {nutrient}",
        above: "all of your ingredients are too high in {nutrient}",
      },
      not_enough_stock: {
        below: "you don't have enough of the ingredients that are high in {nutrient}",
        above: "you don't have enough of the ingredients that are low in {nutrient}",
      },
      not_together: "with the available ingredients it is not possible to get a perfect distribution",
    },
    category: {
      not_enough_stock: {
        below: "you don't have enough {category} in your inventory",
        above: "you don't have enough of the other ingredient types to balance them",
      },
      not_together: "with the available ingredients it is not possible to get a perfect distribution",
    },
  },
} as const;

function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

/** One plain sentence for one missed range, e.g. "Protein (below range): none of your ingredients is high enough in protein." */
export function formatOptimizerFallbackMiss(miss: FallbackRangeMiss): string {
  const copy = OPTIMIZER_FALLBACK_COPY;
  if (miss.kind === "macro") {
    const label = copy.macroLabels[miss.key];
    const reason = miss.reason === "not_together" ? copy.reasons.macro.not_together : copy.reasons.macro[miss.reason][miss.direction];
    return `${fill(copy.miss[miss.direction], { label })}: ${fill(reason, { nutrient: label.toLowerCase() })}.`;
  }
  const label = copy.categoryLabels[miss.key];
  const reason = miss.reason === "not_together" ? copy.reasons.category.not_together : copy.reasons.category.not_enough_stock[miss.direction];
  return `${fill(copy.miss[miss.direction], { label })}: ${fill(reason, { category: label.toLowerCase() })}.`;
}

type Translate = (key: string, params?: Record<string, string | number>) => string;

/**
 * The same sentence as formatOptimizerFallbackMiss, built from the German or Dutch dictionary. Every key is
 * written out in full so the unused-key test can see it.
 */
export function formatOptimizerFallbackMissTranslated(miss: FallbackRangeMiss, t: Translate): string {
  const below = miss.direction === "below";
  if (miss.kind === "macro") {
    const label = miss.key === "protein" ? t("fallback.protein") : miss.key === "carbs" ? t("fallback.carbs") : miss.key === "fat" ? t("fallback.fat") : t("fallback.fiber");
    const nutrient = miss.key === "protein" ? t("fallback.nutrientProtein") : miss.key === "carbs" ? t("fallback.nutrientCarbs") : miss.key === "fat" ? t("fallback.nutrientFat") : t("fallback.nutrientFiber");
    const reason = miss.reason === "not_together"
      ? t("fallback.notTogether")
      : miss.reason === "no_ingredient_reaches"
        ? (below ? t("fallback.macroNoIngredientBelow", { nutrient }) : t("fallback.macroNoIngredientAbove", { nutrient }))
        : (below ? t("fallback.macroStockBelow", { nutrient }) : t("fallback.macroStockAbove", { nutrient }));
    return `${below ? t("fallback.below", { label }) : t("fallback.above", { label })}: ${reason}.`;
  }
  const label = miss.key === "grain" ? t("calculator.grains") : miss.key === "legume" ? t("calculator.legumes") : t("calculator.seeds");
  const category = miss.key === "grain" ? t("fallback.categoryGrain") : miss.key === "legume" ? t("fallback.categoryLegume") : t("fallback.categorySeed");
  const reason = miss.reason === "not_together"
    ? t("fallback.notTogether")
    : (below ? t("fallback.categoryStockBelow", { category }) : t("fallback.categoryStockAbove"));
  return `${below ? t("fallback.below", { label }) : t("fallback.above", { label })}: ${reason}.`;
}
