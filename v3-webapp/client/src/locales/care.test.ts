import { describe, expect, it } from "vitest";
import { BIRD_CARE, BIRD_TYPES, type BirdType } from "../lib/birds";
import { getBirdCare } from "./care";
import type { SupportedLanguage } from "./index";

describe("getBirdCare", () => {
  it("returns BIRD_CARE[bird] unchanged for 'en'", () => {
    for (const bird of BIRD_TYPES) {
      expect(getBirdCare(bird, "en")).toBe(BIRD_CARE[bird]);
    }
  });

  const languages: SupportedLanguage[] = ["de", "nl"];

  for (const lang of languages) {
    describe(`Language: ${lang}`, () => {
      for (const bird of BIRD_TYPES) {
        describe(`Bird: ${bird}`, () => {
          const enCare = BIRD_CARE[bird];
          const translatedCare = getBirdCare(bird, lang);

          it("has the exact same top-level keys as English", () => {
            expect(Object.keys(translatedCare).sort()).toEqual(Object.keys(enCare).sort());
          });

          it("has the exact same gritBySituation keys if present", () => {
            if (enCare.gritBySituation) {
              expect(translatedCare.gritBySituation).toBeDefined();
              expect(Object.keys(translatedCare.gritBySituation!).sort()).toEqual(
                Object.keys(enCare.gritBySituation!).sort()
              );
            } else {
              expect(translatedCare.gritBySituation).toBeUndefined();
            }
          });

          it("has the exact same freshProduceGuidance structure, sources count, and URLs if present", () => {
            if (enCare.freshProduceGuidance) {
              expect(translatedCare.freshProduceGuidance).toBeDefined();
              const enGuidance = enCare.freshProduceGuidance!;
              const trGuidance = translatedCare.freshProduceGuidance!;

              expect(Object.keys(trGuidance).sort()).toEqual(Object.keys(enGuidance).sort());
              expect(trGuidance.sources.length).toBe(enGuidance.sources.length);

              for (let i = 0; i < enGuidance.sources.length; i++) {
                expect(trGuidance.sources[i].url).toBe(enGuidance.sources[i].url);
                expect(trGuidance.sources[i].label).toBe(enGuidance.sources[i].label);
              }
            } else {
              expect(translatedCare.freshProduceGuidance).toBeUndefined();
            }
          });

          it("does not have any string field equal to its English string (except sources)", () => {
            expect(translatedCare.scope).not.toBe(enCare.scope);
            expect(translatedCare.baseDiet).not.toBe(enCare.baseDiet);
            expect(translatedCare.water).not.toBe(enCare.water);
            expect(translatedCare.grit).not.toBe(enCare.grit);
            expect(translatedCare.light).not.toBe(enCare.light);

            if (enCare.gritBySituation && translatedCare.gritBySituation) {
              for (const key of Object.keys(enCare.gritBySituation)) {
                expect(translatedCare.gritBySituation[key]).not.toBe(enCare.gritBySituation[key]);
              }
            }

            if (enCare.freshProduce && translatedCare.freshProduce) {
              expect(translatedCare.freshProduce).not.toBe(enCare.freshProduce);
            }

            if (enCare.freshProduceGuidance && translatedCare.freshProduceGuidance) {
              const enG = enCare.freshProduceGuidance;
              const trG = translatedCare.freshProduceGuidance;
              expect(trG.triggerLabel).not.toBe(enG.triggerLabel);
              expect(trG.heading).not.toBe(enG.heading);
              expect(trG.introduction).not.toBe(enG.introduction);
              expect(trG.vegetables).not.toBe(enG.vegetables);
              expect(trG.fruits).not.toBe(enG.fruits);
              expect(trG.safety).not.toBe(enG.safety);
              expect(trG.sourcesTriggerLabel).not.toBe(enG.sourcesTriggerLabel);
              expect(trG.sourcesHeading).not.toBe(enG.sourcesHeading);
            }
          });

          if (enCare.freshProduceGuidance) {
            it("contains avocado, onion/Zwiebel/ui, and rhubarb/Rhabarber in fresh produce safety text", () => {
              const safetyText = translatedCare.freshProduceGuidance!.safety.toLowerCase();

              if (lang === "de") {
                expect(safetyText).toContain("avocado");
                expect(safetyText).toContain("zwiebel");
                expect(safetyText).toContain("rhabarber");
              } else if (lang === "nl") {
                expect(safetyText).toContain("avocado");
                expect(safetyText).toContain("ui");
                expect(safetyText).toContain("rabarber");
              }
            });
          }
        });
      }
    });
  }
});
