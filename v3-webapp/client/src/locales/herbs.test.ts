import { describe, expect, it } from "vitest";
import { HERB_EVIDENCE } from "../../../../database/herb-provenance.mts";
import { HERB_RECOMMENDATIONS, HERBS_SUPPLEMENTS } from "../lib/data";
import { HERB_NAMES, HERB_TEXT, getHerbName, translateHerbText } from "./herbs";

// Every herb text the page can show: benefit labels, notes, dosages that contain words, evidence sentences and profile notes.
function allHerbTexts(): string[] {
  const texts = new Set<string>();
  for (const herb of Object.values(HERBS_SUPPLEMENTS)) {
    herb.benefits.forEach((benefit) => texts.add(benefit));
    texts.add(herb.notes);
    if (/[A-Za-z]{3,}/.test(herb.dosage_per_kg.replace(/\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?)?(?:g|ml)\b/g, ""))) texts.add(herb.dosage_per_kg);
  }
  for (const evidence of Object.values(HERB_EVIDENCE)) texts.add(evidence.scope);
  for (const recommendation of Object.values(HERB_RECOMMENDATIONS)) texts.add(recommendation.notes);
  return [...texts];
}

describe("German and Dutch herb names and texts", () => {
  const ids = Object.keys(HERBS_SUPPLEMENTS).sort();
  const texts = allHerbTexts();

  it.each(["de", "nl"] as const)("%s has a name for every herb and no extra ids", (language) => {
    expect(Object.keys(HERB_NAMES[language]).sort()).toEqual(ids);
  });

  it.each(["de", "nl"] as const)("%s has a sentence for every herb text and nothing stale", (language) => {
    expect(Object.keys(HERB_TEXT[language]).sort()).toEqual([...texts].sort());
  });

  it.each(["de", "nl"] as const)("%s keeps the numbers of every text", (language) => {
    const numbers = (text: string) => text.match(/\d+(?:[.,-]\d+)*/g) ?? [];
    for (const english of texts) expect(numbers(translateHerbText(english, language))).toEqual(numbers(english));
  });

  it("English and unknown text are returned unchanged", () => {
    expect(translateHerbText("Digestion", "en")).toBe("Digestion");
    expect(translateHerbText("something nobody wrote", "nl")).toBe("something nobody wrote");
    expect(getHerbName("apple_cider_vinegar", "en")).toBe("apple cider vinegar");
  });
});
