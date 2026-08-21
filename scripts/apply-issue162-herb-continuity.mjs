import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const provenance = resolve(root, "database/provenance");
const date = "2026-08-21";

function load(name) {
  return JSON.parse(readFileSync(resolve(provenance, name), "utf8"));
}

function save(name, value) {
  writeFileSync(resolve(provenance, name), `${JSON.stringify(value, null, 2)}\n`);
}

const sources = load("sources.json");
const foodReviews = load("food-reviews.json");

const sourceRecords = [
  {
    id: "herb-provenance-registry-2026",
    title: "Canonical herb provenance and automatic-suggestion compatibility registry",
    authorsOrOrganization: "Bird Feed Calculator project",
    publishedYear: "2026",
    sourceTier: "runtime_configuration",
    urlOrDoi: "database/herb-provenance.mts",
    speciesScopes: ["pigeon", "parrot", "african_grey", "budgie", "canary", "chicken"],
    permittedUse: "Records the existing all-supported-birds eligibility policy for ordinary culinary thyme and separates ordinary herb use from essential oils and other concentrated forms.",
    limitations: "This is an active project configuration, not an external feeding study or a dose, formula, complete-ration, or product approval. It cannot be represented as direct species-specific scientific evidence.",
    accessedAt: date
  },
  {
    id: "hartady-2021-avian-herbal-medicine-review",
    title: "Review of Herbal Medicine Works in the Avian Species",
    authorsOrOrganization: "Tyagita Hartady; Mas Rizky A. A. Syamsunarno; Bambang Pontjo Priosoeryanto; S. Jasni; Roostita L. Balia",
    publishedYear: "2021",
    sourceTier: "peer_reviewed_review",
    urlOrDoi: "https://doi.org/10.14202/vetworld.2021.2889-2906",
    speciesScopes: ["chicken", "poultry"],
    permittedUse: "Poultry-oriented avian-herbal review context for ordinary thyme preparations and explicit separation from concentrated preparations.",
    limitations: "The review’s accessible framing is poultry/chicken context; it does not by itself provide an individual non-chicken dose, complete-ration instruction, or direct species-specific thyme outcome.",
    accessedAt: date
  },
  {
    id: "dardouri-2025-poultry-herbs-scoping-review",
    title: "Herbs Impact on Poultry Health and Antimicrobial Resistance: A Scoping Review with One Health Perspective",
    authorsOrOrganization: "Maha Dardouri; Meriem Maher Mtibaa; Sana Azaiez; Ahlem Mahjoub Khachroub; Wejdene Mansour",
    publishedYear: "2025",
    sourceTier: "systematic_review",
    urlOrDoi: "https://doi.org/10.1186/s12917-025-04760-6",
    speciesScopes: ["chicken", "poultry"],
    permittedUse: "Scoping review of chicken, hen, and chick studies, including ordinary thyme powder/leaf feeding context and defined poultry-study boundaries.",
    limitations: "Its inclusion criteria are poultry-only and its results do not directly establish an individual non-chicken outcome, dose, complete ration, or concentrated-product equivalence.",
    accessedAt: date
  },
  {
    id: "elsabrout-2023-poultry-botanicals-review",
    title: "Application of Botanical Products as Nutraceutical Feed Additives for Improving Poultry Health and Production",
    authorsOrOrganization: "Khalid El-Sabrout and coauthors",
    publishedYear: "2023",
    sourceTier: "peer_reviewed_review",
    urlOrDoi: "https://doi.org/10.14202/vetworld.2023.369-379",
    speciesScopes: ["chicken", "poultry"],
    permittedUse: "Poultry feed-additive review context for botanical products, including herb preparation boundaries.",
    limitations: "Poultry review context does not independently establish an individual non-chicken outcome, dose, complete ration, or essential-oil equivalence.",
    accessedAt: date
  }
];

for (const record of sourceRecords) {
  if (!sources.sources.some((source) => source.id === record.id)) sources.sources.push(record);
}

function findReview(ingredientId, form) {
  const review = foodReviews.ingredientReviews.find((candidate) => candidate.ingredientId === ingredientId && candidate.form === form);
  if (!review) throw new Error(`Missing food review: ${ingredientId}::${form}`);
  return review;
}

function row(bird, outcome, sourceIds, locator, evidenceScope, rationale) {
  return { bird, outcome, sourceIds, locator, evidenceScope, rationale, reviewedAt: date };
}

const registrySources = [
  "herb-provenance-registry-2026",
  "hartady-2021-avian-herbal-medicine-review",
  "dardouri-2025-poultry-herbs-scoping-review",
  "elsabrout-2023-poultry-botanicals-review"
];

const thyme = findReview("thyme", "dried culinary thyme leaf, plain and unsalted");
thyme.nutrition.sourceIds = registrySources;
thyme.nutrition.notes = "Evidence-only reconciliation of ordinary culinary thyme leaf. Per the existing canonical herb registry and owner-confirmed form-continuity boundary, ordinary culinary thyme leaves are treated as one food form across fresh and dried household use; essential oil, extracts, tinctures, teas, and blends remain distinct.";
thyme.speciesEvidence = [
  "pigeon", "parrot", "african_grey", "budgie", "canary", "chicken"
].map((bird) => row(
  bird,
  "limited",
  registrySources,
  "Canonical herb-provenance registry ordinary-thyme eligibility; Hartady, Dardouri, and El-Sabrout poultry/avian-herbal review contexts",
  bird === "chicken" ? "species_specific" : "related_species",
  bird === "chicken"
    ? "The canonical herb registry and direct chicken thyme literature support ordinary culinary thyme only as a bounded diet addition, not a dose, formula, complete ration, oil/extract equivalence, or unrestricted claim."
    : "The existing canonical herb registry explicitly treats ordinary culinary thyme as eligible for this supported bird. Under the owner-confirmed ordinary-culinary-herb form-continuity boundary, fresh and dried household leaf are not split into separate outcomes. The external sources remain poultry-oriented, so this limited record preserves that evidence limitation and does not claim direct species-specific research, a dose, a formula, a complete ration, or oil/extract equivalence."
));
thyme.processing.sourceIds = registrySources;
thyme.processing.rule = "Treat ordinary culinary thyme leaves as one food-form boundary across fresh and dried household use. Keep essential oil, extracts, tinctures, tea, blends, salted, flavoured, and mould-contaminated products distinct. This evidence-only reconciliation does not approve runtime inventory use, a dose, a formula, or a complete ration.";
thyme.lastReviewedAt = date;

const parsley = findReview("parsley", "dried culinary parsley leaf, plain and unsalted");
const canaryIndex = parsley.speciesEvidence.findIndex((entry) => entry.bird === "canary");
if (canaryIndex === -1) throw new Error("Missing canary parsley evidence row");
parsley.speciesEvidence[canaryIndex] = row(
  "canary",
  "limited",
  ["vca-canary-feeding"],
  "VCA Canaries – Feeding: parsley named as a green leafy vegetable offered in small pieces several times per week",
  "species_specific",
  "Veterinarian-authored canary guidance explicitly names ordinary parsley as a green leafy vegetable. Under the owner-confirmed ordinary-culinary-herb form-continuity boundary, the household dried leaf is not treated as a separate food outcome. This supports limited use only, not a dose, a formula, a complete ration, or an oil/extract equivalence."
);
parsley.nutrition.sourceIds = [...new Set([...parsley.nutrition.sourceIds, "vca-canary-feeding"])];
parsley.nutrition.notes = "Evidence-only review of ordinary culinary parsley leaf. Per the owner-confirmed form-continuity boundary, fresh and dried household leaf are treated as one food form; oils, extracts, tinctures, teas, and blends remain distinct.";
parsley.processing.sourceIds = [...new Set([...parsley.processing.sourceIds, "vca-canary-feeding"])];
parsley.processing.rule = "Treat ordinary culinary parsley leaves as one food-form boundary across fresh and dried household use. Keep essential oil, extracts, tinctures, tea, blends, salted, flavoured, and mould-contaminated products distinct. This evidence-only review does not approve runtime inventory use, a dose, a formula, or a complete ration.";
parsley.lastReviewedAt = date;

save("sources.json", sources);
save("food-reviews.json", foodReviews);
console.log("Issue #162 herb form-continuity correction applied.");
console.log(`- source records: ${sources.sources.length}`);
