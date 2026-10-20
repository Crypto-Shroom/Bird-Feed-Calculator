import { describe, expect, it } from "vitest";
import { BIRD_TOXICITY } from "../lib/bird-safety";
import { INGREDIENT_PREP, TOXIC_INGREDIENTS, getProcessingWarning } from "../lib/safety";
import { SAFETY_TEXT, translateSafetyText } from "./safety";

// Every safety or preparation sentence the page can show from the safety data.
function allSafetySentences(): string[] {
  const sentences = new Set<string>();
  const add = (text: string | null | undefined) => { if (text) sentences.add(text); };
  for (const toxic of Object.values(TOXIC_INGREDIENTS)) { add(toxic.message); add(toxic.preparation); }
  for (const prep of Object.values(INGREDIENT_PREP)) {
    add(prep.preparation);
    add(prep.notes);
    for (const guidance of Object.values(prep.birdGuidance ?? {})) add(guidance);
  }
  for (const foods of Object.values(BIRD_TOXICITY)) for (const food of foods) add(food.description);
  add(getProcessingWarning("beans"));
  return [...sentences];
}

describe("German and Dutch safety and preparation sentences", () => {
  const sentences = allSafetySentences();

  it.each(["de", "nl"] as const)("%s has a sentence for everything in the safety data and nothing stale", (language) => {
    expect(Object.keys(SAFETY_TEXT[language]).sort()).toEqual([...sentences].sort());
  });

  it.each(["de", "nl"] as const)("%s keeps numbers and capitalised hazard words", (language) => {
    const numbers = (text: string) => text.match(/\d+(?:[.,-]\d+)*/g) ?? [];
    for (const english of sentences) {
      const translated = translateSafetyText(english, language);
      expect(translated).not.toBe(english);
      expect(numbers(translated)).toEqual(numbers(english));
      if (/\b[A-Z]{3,}\b/.test(english)) expect(translated).toMatch(/\b[A-ZÄÖÜ]{3,}\b/);
    }
  });

  it("English and unknown sentences are returned unchanged", () => {
    expect(translateSafetyText("Remove shells before feeding", "en")).toBe("Remove shells before feeding");
    expect(translateSafetyText("a sentence nobody wrote", "de")).toBe("a sentence nobody wrote");
  });
});
