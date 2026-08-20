import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const provenance = resolve(root, "database/provenance");
const date = "2026-08-20";

function load(name) {
  return JSON.parse(readFileSync(resolve(provenance, name), "utf8"));
}

function save(name, value) {
  writeFileSync(resolve(provenance, name), `${JSON.stringify(value, null, 2)}\n`);
}

const sources = load("sources.json");
const sourceId = "dilks-1975-feral-pigeon-broad-beans";
if (!sources.sources.some((source) => source.id === sourceId)) {
  sources.sources.push({
    id: sourceId,
    title: "Diet of Feral Pigeons (Columba livia) in Hawke's Bay, New Zealand",
    authorsOrOrganization: "P. J. Dilks",
    publishedYear: "1975",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.1080/00288233.1975.10430391",
    speciesScopes: ["pigeon", "columbiformes", "feral_pigeon"],
    permittedUse: "Direct crop-content observation in free-ranging feral pigeons, including the named consumption of broad beans (Vicia faba) in a field-foraging context.",
    limitations: "The observational study does not identify processing, establish safety, prescribe a companion-pigeon amount or formula, or support another bean species or bird species.",
    accessedAt: date
  });
}

const foodReviews = load("food-reviews.json");
const fava = foodReviews.ingredientReviews.find(
  (review) => review.ingredientId === "fava_beans" && review.form === "raw dried fava beans",
);
if (!fava) throw new Error("Missing raw dried fava bean review");
const pigeon = fava.speciesEvidence.find((entry) => entry.bird === "pigeon");
if (!pigeon) throw new Error("Missing fava pigeon evidence row");
pigeon.outcome = "unresolved";
pigeon.sourceIds = [sourceId, "vca-pigeon-dove-feeding", "palomacy-pigeon-feeding-2026"];
pigeon.locator = "Dilks (1975) abstract, Results, Figure 1, Table 1, and ‘Other food’ section naming broad beans (Vicia faba) in free-ranging pigeon crop contents; VCA and Palomacy pigeon-feeding guidance";
pigeon.evidenceScope = "species_specific";
pigeon.rationale = "Direct primary crop-content evidence identifies broad beans (Vicia faba) in free-ranging feral-pigeon diets, but does not identify bean maturity or processing and therefore cannot establish this distinct raw dried form. VCA and Palomacy do not resolve that form boundary. The raw dried fava-bean outcome remains unresolved rather than converting form-unspecified field consumption into a raw-dried approval, safety claim, or formula rule.";
pigeon.reviewedAt = date;

if (!fava.processing.sourceIds.includes(sourceId)) fava.processing.sourceIds.push(sourceId);
fava.processing.rule = "Keep raw dried fava/broad beans distinct from fresh, soaked, sprouted, cooked, canned, fermented, milled, or manufactured forms. Direct feral-pigeon crop-content evidence identifies broad beans (Vicia faba) but not their maturity or processing, so the raw dried pigeon row remains unresolved. Companion-bird records require preparation; chicken evidence is bounded to cited controlled poultry studies. This evidence-only record does not approve runtime use, a formula, a portion, or a complete ration.";
fava.lastReviewedAt = date;

save("sources.json", sources);
save("food-reviews.json", foodReviews);
console.log("Issue #145 pigeon follow-up applied.");
