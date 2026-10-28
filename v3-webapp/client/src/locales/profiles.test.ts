import { describe, expect, it } from "vitest";
import { BIRD_PROFILES, BIRD_TYPES } from "../lib/birds";
import { DE_PROFILE_TEXT, NL_PROFILE_TEXT, getProfileText } from "./profiles";

const numbers = (text: string) => (text.match(/\d+(?:-\d+)?/g) ?? []).join("|");

describe("profile text translations", () => {
  const languages = [["de", DE_PROFILE_TEXT], ["nl", NL_PROFILE_TEXT]] as const;

  for (const [language, texts] of languages) {
    describe(language, () => {
      it("covers every bird and situation, with a context note exactly where English has one", () => {
        for (const bird of BIRD_TYPES) {
          const english = BIRD_PROFILES[bird].profiles;
          expect(Object.keys(texts[bird] ?? {}).sort()).toEqual(Object.keys(english).sort());
          for (const [situation, profile] of Object.entries(english)) {
            const translated = texts[bird]![situation];
            expect(Boolean(translated.contextNote)).toBe(Boolean(profile.contextNote));
          }
        }
      });

      it("keeps every feeding amount from the English note", () => {
        for (const bird of BIRD_TYPES) {
          for (const [situation, profile] of Object.entries(BIRD_PROFILES[bird].profiles)) {
            expect(numbers(texts[bird]![situation].feedingNotes)).toBe(numbers(profile.feedingNotes));
          }
        }
      });

      it("keeps the exotics vet referral wherever English has one", () => {
        for (const bird of BIRD_TYPES) {
          for (const [situation, profile] of Object.entries(BIRD_PROFILES[bird].profiles)) {
            const english = `${profile.feedingNotes} ${profile.contextNote ?? ""}`.includes("exotics vet");
            const translated = `${texts[bird]![situation].feedingNotes} ${texts[bird]![situation].contextNote ?? ""}`;
            if (english) expect(translated).toMatch(language === "de" ? /Exoten-Tierarzt/ : /dierenarts voor exoten/);
          }
        }
      });
    });
  }

  it("returns the English profile text unchanged for English", () => {
    const profile = BIRD_PROFILES.pigeon.profiles.pet;
    expect(getProfileText("pigeon", "pet", profile, "en")).toEqual({ name: profile.name, feedingNotes: profile.feedingNotes, contextNote: profile.contextNote });
  });
});
