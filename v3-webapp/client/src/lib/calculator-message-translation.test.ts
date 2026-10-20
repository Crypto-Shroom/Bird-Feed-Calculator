import { describe, expect, it } from "vitest";
import { MultibirMixCalculator } from "./calculator-multi-bird";
import { formatOptimizerFallbackMiss, formatOptimizerFallbackMissTranslated } from "./optimizer-copy";
import type { FallbackRangeMiss } from "./optimizer-explain";
import { getNestedTranslation, interpolate, translations, type SupportedLanguage } from "../locales";

const translator = (language: SupportedLanguage) => (key: string, params?: Record<string, string | number>) => {
  const text = getNestedTranslation(translations[language], key);
  if (text === undefined) throw new Error(`missing key ${key} in ${language}`);
  return interpolate(text, params);
};

const macroReasons = ["no_ingredient_reaches", "not_enough_stock", "not_together"] as const;
const categoryReasons = ["not_enough_stock", "not_together"] as const;
const directions = ["below", "above"] as const;

const allMisses: FallbackRangeMiss[] = [
  ...(["protein", "carbs", "fat", "fiber"] as const).flatMap((key) =>
    directions.flatMap((direction) => macroReasons.map((reason) => ({ kind: "macro" as const, key, direction, value: 1, range: [0, 1] as const, reason }))),
  ),
  ...(["grain", "legume", "seed"] as const).flatMap((key) =>
    directions.flatMap((direction) => categoryReasons.map((reason) => ({ kind: "category" as const, key, direction, value: 1, range: [0, 1] as const, reason }))),
  ),
];

describe("closest-possible-mix sentences", () => {
  it("the English dictionary reproduces the existing English sentences exactly", () => {
    for (const miss of allMisses) {
      expect(formatOptimizerFallbackMissTranslated(miss, translator("en"))).toBe(formatOptimizerFallbackMiss(miss));
    }
  });

  it.each(["de", "nl"] as const)("%s has a complete sentence for every kind of missed range", (language) => {
    for (const miss of allMisses) {
      const sentence = formatOptimizerFallbackMissTranslated(miss, translator(language));
      expect(sentence).not.toMatch(/[{}]/);
      expect(sentence).not.toBe(formatOptimizerFallbackMiss(miss));
    }
  });
});

describe("calculator warnings carry a language-neutral code", () => {
  it("scaled-to-inventory warning", () => {
    const result = new MultibirMixCalculator({ wheat: 100 }, "pigeon", "pet").calculate(1000);
    const warning = result.warnings.find(({ code }) => code === "scaled_to_inventory");
    expect(warning?.params).toEqual({ grams: 100 });
    expect(warning?.message).toContain("Only 100g of eligible inventory");
  });

  it("excluded warning with a data reason keeps the English reason as a parameter", () => {
    const result = new MultibirMixCalculator({ wheat: 500, kidney_beans: 200 }, "pigeon", "pet").calculate(500);
    const warning = result.warnings.find(({ code }) => code === "excluded");
    expect(warning?.params?.ingredient).toBe("kidney_beans");
    expect(String(warning?.params?.reason).length).toBeGreaterThan(10);
  });

  it("excluded warning for an ingredient that is simply not offered to the bird", () => {
    const result = new MultibirMixCalculator({ millet: 500, almonds: 200 }, "canary", "pet").calculate(500);
    const warning = result.warnings.find(({ code }) => code === "excluded_incompatible");
    expect(warning?.params).toEqual({ ingredient: "almonds" });
  });

  it.each(["de", "nl"] as const)("%s has a sentence for every warning code", (language) => {
    const t = translator(language);
    for (const sentence of [
      t("warnings.situationUnavailable"),
      t("warnings.needIngredient"),
      t("warnings.scaledToInventory", { grams: 100 }),
      t("warnings.shareLimited", { grams: 100 }),
      t("warnings.excluded", { ingredient: "x", reason: "y" }),
      t("warnings.excludedIncompatible", { ingredient: "x" }),
    ]) expect(sentence).not.toMatch(/[{}]/);
  });
});
