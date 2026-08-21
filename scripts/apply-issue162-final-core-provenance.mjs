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
const coverage = load("food-coverage.json");

const sourceRecords = [
  {
    id: "issue-162-research-log-2026",
    title: "Issue #162 final core-compatibility evidence research log",
    authorsOrOrganization: "Bird Feed Calculator project research record",
    publishedYear: "2026",
    sourceTier: "historical_project",
    urlOrDoi: "database/provenance/evidence/issue-162-research-log.md",
    speciesScopes: ["pigeon", "parrot", "african_grey", "budgie", "canary", "chicken"],
    permittedUse: "Documents independent first-pass, targeted second-search, specialist-source, and form-reconciliation work for the six exact Issue #162 forms, including exact-form exclusions and neutral unresolved outcomes.",
    limitations: "It is an audit record, not an external feeding study, a safety approval, a portion, a formula, a complete ration, or a runtime decision.",
    accessedAt: date
  },
  {
    id: "creswell-1981-raw-mung-broilers",
    title: "Nutritional Evaluation of Mung Beans (Phaseolus aureus) for Young Broiler Chickens",
    authorsOrOrganization: "David C. Creswell",
    publishedYear: "1981",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.3382/ps.0601905",
    speciesScopes: ["chicken", "broiler_chicken"],
    permittedUse: "Controlled young-broiler trials of raw or boiled mung beans replacing soybean meal in corn-based diets at graded levels up to 20% or 40%.",
    limitations: "The formulated corn-based diets with added oil, methionine, and lysine do not prescribe household feeding, a complete ration, another mung form, or an outcome for another bird species.",
    accessedAt: date
  },
  {
    id: "hejdysz-2017-raw-pea-broilers",
    title: "Influence of graded inclusion of raw and extruded pea (Pisum sativum L.) meal on the performance and nutrient digestibility of broiler chickens",
    authorsOrOrganization: "M. Hejdysz; S. A. Kaczmarek; M. Adamski; A. Rutkowski",
    publishedYear: "2017",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.1016/j.anifeedsci.2017.05.016",
    speciesScopes: ["chicken", "broiler_chicken"],
    permittedUse: "Controlled Ross 308 broiler comparison of raw ground pea meal and extruded pea meal at 100–500 g/kg diet, including performance and digestibility outcomes.",
    limitations: "The raw meal and formulated trial diets do not establish household feeding, a complete ration, a different pea preparation, or an outcome for another bird species.",
    accessedAt: date
  },
  {
    id: "yalcin-2020-dried-thymus-vulgaris-hens",
    title: "Effects of dried thyme (Thymus vulgaris L.) leaves on performance, some egg quality traits and immunity in laying hens",
    authorsOrOrganization: "Sakine Yalçın; Handan Eser; İlyas Onbaşılar; Suzan Yalçın",
    publishedYear: "2020",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.33988/auvfd.677150",
    speciesScopes: ["chicken", "laying_hen"],
    permittedUse: "Controlled 16-week laying-hen study of dried and ground Thymus vulgaris leaves at 1% and 2% of formulated diets.",
    limitations: "The defined dried/ground leaf form, poultry population, and trial diets do not prescribe a household amount, a complete ration, another preparation, or an outcome for another bird species.",
    accessedAt: date
  },
  {
    id: "saeed-2024-dried-parsley-broilers",
    title: "Effects of Dried Local Parsley on Carcass Characteristics of Broiler Chicks (Ross 308)",
    authorsOrOrganization: "Rozhgar Baiz Saeed",
    publishedYear: "2024",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.58928/ku24.15425",
    speciesScopes: ["chicken", "broiler_chicken"],
    permittedUse: "Controlled Ross 308 broiler study of dried local parsley in a basal diet at three stated treatment levels, reporting carcass and meat-composition outcomes.",
    limitations: "The study’s local-parsley reporting and controlled basal-diet context do not establish unrestricted feeding, a household amount, a complete ration, another parsley preparation, or an outcome for another bird species.",
    accessedAt: date
  }
];

for (const record of sourceRecords) {
  if (!sources.sources.some((source) => source.id === record.id)) sources.sources.push(record);
}

const budgieLegumeSource = sources.sources.find((source) => source.id === "exoticdirect-budgie-chickpeas-2019");
if (budgieLegumeSource) {
  budgieLegumeSource.permittedUse = "Budgie-specific care guidance that explicitly lists chickpeas, green peas, lentils, and mung beans as suitable legumes that must not ever be fed raw, and identifies sprouted legumes as the offered form.";
  budgieLegumeSource.limitations = "Non-clinical care guidance; it does not establish a controlled feeding result, a preparation protocol, a portion, a complete ration, a different food form, or any other bird species outcome.";
  budgieLegumeSource.accessedAt = date;
}

function row(bird, outcome, sourceIds, locator, evidenceScope, rationale, followUpSearch) {
  return { bird, outcome, sourceIds, locator, evidenceScope, rationale, ...(followUpSearch ? { followUpSearch } : {}), reviewedAt: date };
}

function absence(bird, form, queryA, queryB, result, extraSourceIds = [], extraLocator = "") {
  return row(
    bird,
    "unresolved",
    ["issue-162-research-log-2026", ...extraSourceIds],
    `Issue #162 research log: first-pass and targeted second searches for ${form}${extraLocator ? `; ${extraLocator}` : ""}`,
    "historical_project",
    `The documented first-pass and targeted second searches did not establish direct ${bird}-specific evidence for ${form}. This neutral unresolved outcome records absence of sufficient direct evidence; it is not a safety approval, a toxicity finding, or a cross-species inference.`,
    { queries: [queryA, queryB], sourceIds: ["issue-162-research-log-2026", ...extraSourceIds], result }
  );
}

function findReview(ingredientId, form) {
  const review = foodReviews.ingredientReviews.find((candidate) => candidate.ingredientId === ingredientId && candidate.form === form);
  if (!review) throw new Error(`Missing food review: ${ingredientId}::${form}`);
  return review;
}

function replaceEvidence(review, bird, next) {
  const index = review.speciesEvidence.findIndex((entry) => entry.bird === bird);
  if (index === -1) throw new Error(`Missing ${bird} evidence row for ${review.ingredientId}::${review.form}`);
  review.speciesEvidence[index] = next;
}

const source = {
  log: "issue-162-research-log-2026",
  budgieLegumes: "exoticdirect-budgie-chickpeas-2019",
  mungChicken: "creswell-1981-raw-mung-broilers",
  peaChicken: "hejdysz-2017-raw-pea-broilers",
  thymeChicken: "yalcin-2020-dried-thymus-vulgaris-hens",
  parsleyChicken: "saeed-2024-dried-parsley-broilers",
  chickpeaChicken: "danek-majewska-2021-raw-chickpea-broilers",
  canary: "vca-canary-feeding",
  pigeon: "vca-pigeon-dove-feeding"
};

const lentil = findReview("lentils", "raw dried lentil seeds");
lentil.lastReviewedAt = date;
lentil.processing.sourceIds = [...new Set([...lentil.processing.sourceIds, source.log])];
lentil.processing.rule = "A mechanically split raw dried lentil inherits this raw dried base record. Keep materially processed lentils—dehulled, soaked, cooked, sprouted, fermented, milled into flour, or manufactured products—distinct. Companion-bird records require preparation; chicken evidence is limited to cited balanced broiler-ration context; pigeon evidence remains limited to named dried-lentil owner guidance. This evidence-only record does not approve runtime use, a formula, a portion, or a complete ration.";

const mung = findReview("mung_beans", "raw dried mung beans");
mung.nutrition.sourceIds = [source.mungChicken];
mung.nutrition.notes = "Evidence-only review of the raw dried mung-bean form. It does not add a nutrient value, a dry-mix instruction, or a complete-ration claim.";
replaceEvidence(mung, "budgie", row(
  "budgie",
  "requires_preparation",
  [source.budgieLegumes],
  "ExoticDirect What can budgies eat?: legumes section explicitly naming mung beans among foods that must not ever be fed raw",
  "species_specific",
  "Budgie-specific care guidance explicitly lists mung beans among legumes that must not ever be fed raw and recommends sprouted legumes. This establishes a preparation boundary only; it does not prescribe a process, portion, formula use, or complete ration."
));
replaceEvidence(mung, "chicken", row(
  "chicken",
  "limited",
  [source.mungChicken],
  "Creswell: young broiler trials of raw or boiled mung beans replacing soybean meal at graded levels up to 20% or 40% in corn-based diets",
  "species_specific",
  "The direct broiler trials support raw mung beans only in their cited formulated corn-based diets with added oil, methionine, and lysine. They do not establish unrestricted feeding, a household amount, a complete ration, or another species outcome."
));
mung.processing.sourceIds = [...new Set([...mung.processing.sourceIds, source.budgieLegumes, source.mungChicken, source.log])];
mung.processing.rule = "Keep raw dried mung beans distinct from sprouted mung beans, cooked mung beans, mung flour, and residues. Companion-bird records require preparation; chicken evidence is limited to cited formulated broiler-ration context; pigeon evidence is limited to named mung-bean owner guidance. This record does not approve runtime use, a formula, a portion, or a complete ration.";
mung.lastReviewedAt = date;

const gardenPeas = findReview("garden_peas", "raw mature dried garden peas");
gardenPeas.nutrition.sourceIds = [source.peaChicken];
gardenPeas.nutrition.notes = "Evidence-only review of raw mature dried garden peas. It does not add a nutrient value, a dry-mix instruction, or a complete-ration claim.";
replaceEvidence(gardenPeas, "budgie", row(
  "budgie",
  "requires_preparation",
  [source.budgieLegumes],
  "ExoticDirect What can budgies eat?: legumes section explicitly naming green peas among foods that must not ever be fed raw",
  "species_specific",
  "Budgie-specific care guidance explicitly lists green peas among legumes that must not ever be fed raw and recommends sprouted legumes. This establishes a preparation boundary only; it does not prescribe a process, portion, formula use, or complete ration."
));
replaceEvidence(gardenPeas, "chicken", row(
  "chicken",
  "limited",
  [source.peaChicken],
  "Hejdysz et al.: Ross 308 broiler comparison of raw ground pea meal and extruded pea meal at 100–500 g/kg diet",
  "species_specific",
  "The direct broiler study supports raw pea meal only in cited formulated diets and identifies better performance and digestibility after extrusion. It does not establish unrestricted feeding, a household amount, a complete ration, or another species outcome."
));
gardenPeas.processing.sourceIds = [...new Set([...gardenPeas.processing.sourceIds, source.budgieLegumes, source.peaChicken, source.log])];
gardenPeas.processing.rule = "Keep raw mature dried garden peas distinct from fresh green peas, split peas, cooked peas, sprouts, meal, and extruded pea. Companion-bird records require preparation; chicken evidence is limited to cited raw-pea broiler-ration context; pigeon evidence is limited to named dried-pea owner guidance. This record does not approve runtime use, a formula, a portion, or a complete ration.";
gardenPeas.lastReviewedAt = date;

const chickpeas = findReview("chickpeas", "raw dried seeds");
chickpeas.nutrition.sourceIds = [source.chickpeaChicken];
replaceEvidence(chickpeas, "pigeon", absence(
  "pigeon",
  "raw dried chickpea seeds",
  "Columba livia domestica Cicer arietinum raw seed feeding",
  "pigeon raw dried chickpeas avian veterinary nutrition",
  "The targeted search did not establish direct pigeon raw-dried chickpea ingestion, digestibility, safety, or preparation evidence; general chickpea chemistry and chicken trials were excluded from the pigeon outcome.",
  [source.pigeon],
  "VCA pigeon/dove general people-food guidance is retained only as a non-specific boundary"
));
replaceEvidence(chickpeas, "budgie", row(
  "budgie",
  "requires_preparation",
  [source.budgieLegumes],
  "ExoticDirect What can budgies eat?: legumes section explicitly naming chickpeas among foods that must not ever be fed raw",
  "species_specific",
  "Budgie-specific care guidance explicitly lists chickpeas among legumes that must not ever be fed raw and recommends sprouted legumes. This establishes a preparation boundary only; it does not prescribe a process, portion, formula use, or complete ration."
));
replaceEvidence(chickpeas, "chicken", row(
  "chicken",
  "limited",
  [source.chickpeaChicken],
  "Danek-Majewska et al.: raw unprocessed chickpea seed substituted for 50% of soybean-meal protein in Ross 308 grower/finisher diets",
  "species_specific",
  "The direct broiler study supports raw chickpea only in its defined balanced grower/finisher diets. It does not establish unrestricted feeding, a household amount, a complete ration, or another species outcome."
));
chickpeas.processing.sourceIds = [...new Set([...chickpeas.processing.sourceIds, source.budgieLegumes, source.log])];
chickpeas.processing.rule = "Parrot, African Grey, budgie, and canary records require preparation before use. Pigeon remains unresolved after documented first-pass and targeted searches. Chicken evidence is limited to controlled formulated-ration context. This evidence record does not approve a preparation method, runtime use, formula inclusion, portion, or complete ration.";
chickpeas.lastReviewedAt = date;

const thymeForm = "dried culinary thyme leaf, plain and unsalted";
const parsleyForm = "dried culinary parsley leaf, plain and unsalted";
const herbReview = ({ ingredientId, ingredientDisplayName, form, chickenSource, chickenLocator, chickenRationale, botanicalBoundary }) => ({
  ingredientId,
  ingredientDisplayName,
  form,
  nutrition: {
    sourceIds: [source.log, chickenSource],
    basis: "not_applicable",
    notes: `Evidence-only review of ${form}. It does not add nutrient values, change active data, or claim an inventory formula.`
  },
  speciesEvidence: [
    absence("pigeon", form, `Columba livia ${botanicalBoundary} dried leaf diet`, `pigeon ${ingredientDisplayName.toLowerCase()} leaf powder veterinary nutrition`, `No direct pigeon ${form} ingestion evidence was established after documented first-pass and targeted second searches.`),
    absence("parrot", form, `psittacine ${botanicalBoundary} dried leaf feeding`, `parrot ${ingredientDisplayName.toLowerCase()} dried leaf avian veterinary nutrition`, `No direct generic companion-parrot ${form} ingestion evidence was established after documented first-pass and targeted second searches.`),
    absence("african_grey", form, `Psittacus erithacus ${botanicalBoundary} dried leaf feeding`, `African Grey ${ingredientDisplayName.toLowerCase()} dried leaf avian veterinary nutrition`, `No direct African-Grey ${form} ingestion evidence was established after documented first-pass and targeted second searches.`),
    absence("budgie", form, `Melopsittacus undulatus ${botanicalBoundary} dried leaf feeding`, `budgie ${ingredientDisplayName.toLowerCase()} dried leaf avian veterinary nutrition`, `No direct budgerigar ${form} ingestion evidence was established after documented first-pass and targeted second searches.`),
    absence("canary", form, `Serinus canaria ${botanicalBoundary} dried leaf feeding`, `canary ${ingredientDisplayName.toLowerCase()} dried leaf avian veterinary nutrition`, `No direct domestic-canary ${form} ingestion evidence was established after documented first-pass and targeted second searches.`, ingredientId === "parsley" ? [source.canary] : [], ingredientId === "parsley" ? "VCA canary guidance names fresh parsley as green leafy vegetable context, not dried parsley" : ""),
    row("chicken", "limited", [chickenSource], chickenLocator, "species_specific", chickenRationale)
  ],
  processing: {
    sourceIds: [source.log, chickenSource],
    rule: `Keep ${form} distinct from fresh herb, essential oil, extract, tincture, tea, blends, salted, flavoured, and mould-contaminated products. This evidence-only review does not approve runtime use, an inventory entry, a portion, a formula, or a complete ration.`,
    severity: "warning"
  },
  lastReviewedAt: date
});

const newReviews = [
  herbReview({
    ingredientId: "thyme",
    ingredientDisplayName: "Thyme",
    form: thymeForm,
    chickenSource: source.thymeChicken,
    chickenLocator: "Yalçın et al.: dried and ground Thymus vulgaris leaves at 1% and 2% of 16-week laying-hen diets",
    chickenRationale: "The direct laying-hen study supports dried culinary Thymus vulgaris leaf only at studied formulated-diet inclusion. It does not prescribe a household amount, a complete ration, a different preparation, or another species outcome.",
    botanicalBoundary: "Thymus vulgaris"
  }),
  herbReview({
    ingredientId: "parsley",
    ingredientDisplayName: "Parsley",
    form: parsleyForm,
    chickenSource: source.parsleyChicken,
    chickenLocator: "Saeed: controlled Ross 308 broiler study of dried local parsley in a basal diet at three stated treatment levels",
    chickenRationale: "The direct broiler study supports dried parsley only in cited controlled basal-diet context. It does not prescribe an unrestricted dose, a household amount, a complete ration, a different preparation, or another species outcome.",
    botanicalBoundary: "Petroselinum crispum"
  })
];

for (const review of newReviews) {
  if (foodReviews.ingredientReviews.some((existing) => existing.ingredientId === review.ingredientId && existing.form === review.form)) {
    throw new Error(`Food review already exists: ${review.ingredientId}::${review.form}`);
  }
  foodReviews.ingredientReviews.push(review);
}

const coreCoverage = coverage.claimCoverage.find((entry) => entry.historicalClaimId === "historical-multibird-core-compatibility-list");
if (!coreCoverage) throw new Error("Missing historical multibird core coverage group");

const coverageUpdates = new Map([
  ["lentils", "lentils::raw dried lentil seeds"],
  ["peas", "garden_peas::raw mature dried garden peas"],
  ["mung-beans", "mung_beans::raw dried mung beans"],
  ["chickpeas", "chickpeas::raw dried seeds"],
  ["thyme", `thyme::${thymeForm}`],
  ["parsley", `parsley::${parsleyForm}`]
]);

for (const item of coreCoverage.trackedItems) {
  const key = coverageUpdates.get(item.id);
  if (key) item.linkedFoodReviewKeys = [key];
}

save("sources.json", sources);
save("food-reviews.json", foodReviews);
save("food-coverage.json", coverage);
console.log("Issue #162 provenance records applied.");
console.log(`- source records: ${sources.sources.length}`);
console.log(`- food reviews: ${foodReviews.ingredientReviews.length}`);
console.log(`- updated coverage links: ${coverageUpdates.size}`);
