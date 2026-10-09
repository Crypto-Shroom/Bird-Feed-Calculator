import { describe, expect, it } from "vitest";
import { de } from "../locales/de";
import { en } from "../locales/en";
import { nl } from "../locales/nl";
import { getNestedTranslation, interpolate, translations } from "../locales";

function getAllKeys(obj: Record<string, any>, prefix = ""): string[] {
  let keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys = keys.concat(getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

describe("i18n localization foundation", () => {
  const enKeys = getAllKeys(en);

  it("contains identical key structure across English, German, and Dutch", () => {
    const deKeys = getAllKeys(de);
    const nlKeys = getAllKeys(nl);

    expect(deKeys.sort()).toEqual(enKeys.sort());
    expect(nlKeys.sort()).toEqual(enKeys.sort());
  });

  it("interpolates parameters correctly", () => {
    const result = interpolate("Profile standard formula for {bird} — {profile}", {
      bird: "Pigeon",
      profile: "Pet/Companion",
    });
    expect(result).toBe("Profile standard formula for Pigeon — Pet/Companion");
  });

  it("preserves explicit toxic legume warnings in every locale", () => {
    const requiredLegumes = ["kidney", "lima", "fava", "navy", "pinto", "black"];

    for (const [langCode, locale] of Object.entries(translations)) {
      const toxicWarning = locale.safetyBanner.toxicLegumes;
      expect(toxicWarning).toBeDefined();

      // Ensure every toxic legume is explicitly mentioned in the warning text for all locales
      if (langCode === "en") {
        for (const legume of requiredLegumes) {
          expect(toxicWarning.toLowerCase()).toContain(legume);
        }
      } else if (langCode === "de") {
        expect(toxicWarning.toLowerCase()).toContain("kidneybohnen");
        expect(toxicWarning.toLowerCase()).toContain("limabohnen");
        expect(toxicWarning.toLowerCase()).toContain("saubohnen");
        expect(toxicWarning.toLowerCase()).toContain("weiße bohnen");
        expect(toxicWarning.toLowerCase()).toContain("pintobohnen");
        expect(toxicWarning.toLowerCase()).toContain("schwarze bohnen");
      } else if (langCode === "nl") {
        expect(toxicWarning.toLowerCase()).toContain("nierbonen");
        expect(toxicWarning.toLowerCase()).toContain("limabonen");
        expect(toxicWarning.toLowerCase()).toContain("tuinbonen");
        expect(toxicWarning.toLowerCase()).toContain("witte bonen");
        expect(toxicWarning.toLowerCase()).toContain("pintobonen");
        expect(toxicWarning.toLowerCase()).toContain("zwarte bonen");
      }
    }
  });

  it("preserves raw adzuki bean toxicity warning in every locale", () => {
    for (const [, locale] of Object.entries(translations)) {
      const adzukiWarning = locale.inventory.adzukiWarning;
      expect(adzukiWarning).toBeDefined();
      expect(adzukiWarning).toContain("ADZUKI");
      expect(adzukiWarning.toLowerCase()).toMatch(/toxic|giftig/);
    }
  });

  it("uses exotics vet terminology in every locale", () => {
    expect(en.safetyBanner.exoticsVetCare.toLowerCase()).toContain("exotics vet");
    expect(de.safetyBanner.exoticsVetCare.toLowerCase()).toContain("exoten-tierarzt");
    expect(nl.safetyBanner.exoticsVetCare.toLowerCase()).toContain("dierenarts voor exoten");
  });

  it("returns nested translation paths correctly", () => {
    expect(getNestedTranslation(en, "nav.title")).toBe("Precision Nutrition for All Birds");
    expect(getNestedTranslation(de, "nav.title")).toBe("Präzisionsernährung für alle Vögel");
    expect(getNestedTranslation(nl, "nav.title")).toBe("Precisievoeding voor alle vogels");
  });
});
