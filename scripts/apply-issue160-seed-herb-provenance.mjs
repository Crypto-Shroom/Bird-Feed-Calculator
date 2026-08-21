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
    id: "issue-160-research-log-2026",
    title: "Issue #160 seed and culinary-herb evidence research log",
    authorsOrOrganization: "Bird Feed Calculator project research record",
    publishedYear: "2026",
    sourceTier: "historical_project",
    urlOrDoi: "database/provenance/evidence/issue-160-research-log.md",
    speciesScopes: ["pigeon", "parrot", "african_grey", "budgie", "canary", "chicken"],
    permittedUse: "Documents the independently run first-pass, targeted, and specialist-database searches for the five exact Issue #160 forms, including exact-form exclusions and unresolved outcomes.",
    limitations: "It is an audit record, not an external feeding study, a safety approval, a portion, a formula, a complete ration, or a runtime decision.",
    accessedAt: date
  },
  {
    id: "hullar-1999-pigeon-feed-energy",
    title: "Studies on the Energy Content of Pigeon Feeds I. Energy Content and True Metabolizable Energy of Individual Feedstuffs",
    authorsOrOrganization: "I. Hullár; M. Meleg; S. G. Fekete; R. Romvári",
    publishedYear: "1999",
    sourceTier: "primary",
    urlOrDoi: "https://pubmed.ncbi.nlm.nih.gov/10626652/",
    speciesScopes: ["pigeon"],
    permittedUse: "Direct adult homing-pigeon trial in which individual feedstuffs, including whole sunflower and whole hemp seed, were fed alone for energy/digestibility measurement.",
    limitations: "The individual-feedstuff research context does not establish unrestricted use, a household portion, a complete ration, another seed form, or another bird species outcome.",
    accessedAt: date
  },
  {
    id: "melbourne-bird-vet-pigeon-diet-2023",
    title: "Diet for Pet Pigeons",
    authorsOrOrganization: "Melbourne Bird Veterinary Clinic",
    publishedYear: "2023",
    sourceTier: "veterinary_reference",
    urlOrDoi: "https://www.melbournebirdvet.com/post/diet-for-pet-pigeons",
    speciesScopes: ["pigeon"],
    permittedUse: "Exotics-vet pigeon guidance that names safflower in a whole-grain mix and cautions against incomplete seed/grain-only diets.",
    limitations: "Clinical guidance does not establish a universally suitable mix, household portion, complete ration, another seed preparation, or another species outcome.",
    accessedAt: date
  },
  {
    id: "aav-sunflower-seeds-2025",
    title: "Sunflower Seeds",
    authorsOrOrganization: "Association of Avian Veterinarians",
    publishedYear: "2025",
    sourceTier: "veterinary_reference",
    urlOrDoi: "https://www.aav.org/blogpost/1778905/509422/Sunflower-Seeds",
    speciesScopes: ["parrot", "psittacine"],
    permittedUse: "Professional avian-veterinary guidance on the high-fat, non-staple context of sunflower seed for companion parrots.",
    limitations: "It does not define an individual species portion, a complete ration, another seed form, or a safety outcome for pigeons, canaries, or chickens.",
    accessedAt: date
  },
  {
    id: "ullrey-1991-psittacine-seed-mixtures",
    title: "Formulated Diets versus Seed Mixtures for Psittacines",
    authorsOrOrganization: "D. E. Ullrey; M. E. Allen; D. J. Baer",
    publishedYear: "1991",
    sourceTier: "peer_reviewed_review",
    urlOrDoi: "https://pubmed.ncbi.nlm.nih.gov/1941226/",
    speciesScopes: ["parrot", "african_grey", "psittacine"],
    permittedUse: "Peer-reviewed psittacine nutrition review of commercial seed mixtures, including safflower seed composition and seed-mixture nutritional limits.",
    limitations: "A psittacine review does not establish whole-hemp evidence for the generic parrot row, a portion, a complete ration, or any non-psittacine outcome.",
    accessedAt: date
  },
  {
    id: "vca-small-psittacine-nutrition-1998",
    title: "Clinical Nutrition of Small Psittacines and Passerines",
    authorsOrOrganization: "Veterinary Clinics of North America: Exotic Animal Practice",
    publishedYear: "1998",
    sourceTier: "veterinary_reference",
    urlOrDoi: "https://doi.org/10.1053/S1055-937X(98)80002-9",
    speciesScopes: ["budgie", "small_psittacine"],
    permittedUse: "Clinical nutrition reference identifying sunflower and safflower as oilseeds and warning against single-seed diet patterns in small companion birds.",
    limitations: "It does not establish a budgie portion, a whole-hemp outcome, a complete ration, or an outcome for a different bird species.",
    accessedAt: date
  },
  {
    id: "poultry-extension-sunflower-seeds",
    title: "Sunflower Seeds in Poultry Diets",
    authorsOrOrganization: "Poultry Extension",
    publishedYear: "unknown",
    sourceTier: "veterinary_reference",
    urlOrDoi: "https://poultry.extension.org/articles/feeds-and-feeding-of-poultry/feed-ingredients-for-poultry/oilseed-meals-in-poultry-diets/sunflower-seeds-in-poultry-diets/",
    speciesScopes: ["chicken", "poultry"],
    permittedUse: "Poultry feed-ingredient context for sunflower seed in formulated chicken diets.",
    limitations: "Extension feed formulation context does not establish an unsupervised household amount, a complete ration, or any other bird species outcome.",
    accessedAt: date
  },
  {
    id: "rathaur-2023-safflower-seed-broilers",
    title: "Effect of Dietary Supplementation of Safflower (Carthamus tinctorius L.) Seed on the Growth Performance, Blood Lipid and Meat Quality of Broiler Chickens",
    authorsOrOrganization: "A. Rathaur; D. C. Rai; A. Agarwal; A. D. Tripathi",
    publishedYear: "2023",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.18805/IJAR.B-4807",
    speciesScopes: ["chicken", "broiler_chicken"],
    permittedUse: "Controlled 42-day broiler study of basal rations supplemented with 2.5%, 5%, 7.5%, or 10% safflower seed.",
    limitations: "The balanced broiler diets and study levels do not prescribe a household portion, a complete ration, an unprocessed seed-form equivalence, or an outcome for another bird species.",
    accessedAt: date
  },
  {
    id: "waterhouse-1961-budgerigar-seed-palatability",
    title: "Food Consumption and Palatability Studies in Budgerigars",
    authorsOrOrganization: "C. E. Waterhouse; L. M. Hutcheson",
    publishedYear: "1961",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.1111/j.1748-5827.1961.tb04115.x",
    speciesScopes: ["budgie"],
    permittedUse: "Direct budgerigar seed-choice evidence reporting hemp-seed consumption in a free-choice palatability study.",
    limitations: "A palatability study does not establish a safe portion, a complete ration, long-term health effect, or another species outcome.",
    accessedAt: date
  },
  {
    id: "jamas-2026-budgerigar-hernia-hemp",
    title: "Surgical Repair of True Abdominal Wall Hernias in Two Budgerigars",
    authorsOrOrganization: "Journal of Avian Medicine and Surgery authors",
    publishedYear: "2026",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.1647/AVIANMS-D-24-00056",
    speciesScopes: ["budgie"],
    permittedUse: "Direct budgerigar clinical case report in which an obese bird had an unrestricted mixed-seed diet including hemp seed and clinicians advised removal of hemp and rapeseed while restricting the diet.",
    limitations: "A two-case report with multi-seed diet and reproductive/obesity confounders does not prove hemp alone caused disease, establish a portion, or support another species.",
    accessedAt: date
  },
  {
    id: "boskovic-cabrol-2025-whole-hemp-hens",
    title: "Whole Hempseed as a Feeding Enrichment for Laying Hens: Effects on Egg Quality, Nutritional Profile and Sensory Attributes",
    authorsOrOrganization: "M. Bošković Cabrol; M. Pravato; F. Bordignon; G. Xiccato; C. Ciarelli; L. Bailoni; A. Trocino",
    publishedYear: "2025",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.1016/j.psj.2025.105483",
    speciesScopes: ["chicken", "laying_hen"],
    permittedUse: "Four-week controlled laying-hen study of whole hemp seed at 10% of average daily feed intake alongside a commercial diet.",
    limitations: "The specific legal hemp varieties, commercial-diet background, layer population, and enrichment context do not prescribe a household amount, any other hemp product, a complete ration, or another species outcome.",
    accessedAt: date
  },
  {
    id: "morakinyo-2025-basil-leaf-meal-broilers",
    title: "Comparative Evaluation of Scent (Ocimum gratissimum) and Sweet Basil (Ocimum basilicum) Leaf Meal Diets on Carcass Characteristics and Organoleptic Properties of Broiler Chickens",
    authorsOrOrganization: "O. O. Morakinyo; A. O. Akinwumi; R. A. Atandah; M. B. Daniel; T. M. Adedibu; O. M. Ogunsola",
    publishedYear: "2025",
    sourceTier: "primary",
    urlOrDoi: "http://njast.com.ng/index.php/home/article/view/461",
    speciesScopes: ["chicken", "broiler_chicken"],
    permittedUse: "Controlled broiler study of sweet-basil (Ocimum basilicum) leaf meal at 0.5, 1.0, and 1.5 g/kg in formulated diets.",
    limitations: "Leaf meal at cited experimental levels is not a household dose, a complete ration, a fresh/oil/extract equivalence, or another species outcome.",
    accessedAt: date
  },
  {
    id: "ampode-2022-oregano-powder-broilers",
    title: "Oregano (Origanum vulgare Linn.) Powder as Phytobiotic Feed Additives Improves the Growth Performance, Lymphoid Organs, and Economic Traits in Broiler Chickens",
    authorsOrOrganization: "K. M. B. Ampode; F. C. Mendoza",
    publishedYear: "2022",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.17582/journal.aavs/2022/10.2.434.441",
    speciesScopes: ["chicken", "broiler_chicken"],
    permittedUse: "Controlled 42-day broiler study of sun-dried, pulverized Origanum vulgare leaf powder incorporated into formulated diets at 1%, 3%, and 5%.",
    limitations: "The defined powder, trial diets, and poultry population do not establish a household amount, fresh/oil/extract equivalence, a complete ration, or another bird species outcome.",
    accessedAt: date
  }
];

for (const record of sourceRecords) {
  if (!sources.sources.some((source) => source.id === record.id)) sources.sources.push(record);
}

function row(bird, outcome, sourceIds, locator, evidenceScope, rationale, followUpSearch) {
  return { bird, outcome, sourceIds, locator, evidenceScope, rationale, ...(followUpSearch ? { followUpSearch } : {}), reviewedAt: date };
}

function absence(bird, form, queryA, queryB, result) {
  return row(
    bird,
    "unresolved",
    ["issue-160-research-log-2026"],
    `Issue #160 research log: first-pass and targeted second searches for ${form}`,
    "historical_project",
    `The documented first-pass, targeted, and specialist-database searches did not establish direct ${bird}-specific evidence for ${form}. This neutral unresolved outcome records absence of sufficient direct evidence; it is not a safety approval, a toxicity finding, or a cross-species inference.`,
    { queries: [queryA, queryB], sourceIds: ["issue-160-research-log-2026"], result }
  );
}

const source = {
  log: "issue-160-research-log-2026",
  pigeon: "hullar-1999-pigeon-feed-energy",
  pigeonSafflower: "melbourne-bird-vet-pigeon-diet-2023",
  parrotSunflower: "aav-sunflower-seeds-2025",
  psittacineSeed: "ullrey-1991-psittacine-seed-mixtures",
  budgieOilseed: "vca-small-psittacine-nutrition-1998",
  chickenSunflower: "poultry-extension-sunflower-seeds",
  chickenSafflower: "rathaur-2023-safflower-seed-broilers",
  budgieHempChoice: "waterhouse-1961-budgerigar-seed-palatability",
  budgieHempCase: "jamas-2026-budgerigar-hernia-hemp",
  chickenHemp: "boskovic-cabrol-2025-whole-hemp-hens",
  chickenBasil: "morakinyo-2025-basil-leaf-meal-broilers",
  chickenOregano: "ampode-2022-oregano-powder-broilers"
};

const wholeSeedForm = (name) => `whole dry ${name}, plain, unsalted, and unflavoured`;
const driedLeafForm = (name) => `dried culinary ${name} leaf, plain and unsalted`;

function limited(bird, sourceIds, locator, evidenceScope, rationale) {
  return row(bird, "limited", sourceIds, locator, evidenceScope, rationale);
}

const sunflowerForm = wholeSeedForm("sunflower seed");
const safflowerForm = wholeSeedForm("safflower seed");
const hempForm = wholeSeedForm("hemp seed");
const basilForm = driedLeafForm("basil");
const oreganoForm = driedLeafForm("oregano");

const reviews = [
  {
    ingredientId: "sunflower",
    ingredientDisplayName: "Sunflower Seeds",
    form: sunflowerForm,
    nutrition: { sourceIds: [source.pigeon, source.parrotSunflower, source.chickenSunflower], basis: "not_applicable", notes: "Evidence-only review of whole dry, plain, unsalted, unflavoured sunflower seed. It does not add nutrient values, change active data, or claim an inventory formula." },
    speciesEvidence: [
      limited("pigeon", [source.pigeon], "Hullár et al.: adult homing pigeons received whole sunflower as an individual feedstuff for energy/digestibility measurement", "species_specific", "The direct pigeon study establishes ingestion/digestibility context for whole sunflower seed only. It does not justify unrestricted or staple-diet use, a portion, a complete ration, or another species outcome."),
      limited("parrot", [source.parrotSunflower], "AAV Sunflower Seeds guidance on high-fat, non-staple context for companion parrots", "group_specific", "Professional avian-veterinary guidance treats sunflower seed as high-fat and unsuitable as a staple. It supports limited companion-parrot context only, not a portion, complete ration, or individual-species approval."),
      limited("african_grey", [source.parrotSunflower], "AAV Sunflower Seeds guidance; Issue #160 log African-Grey source reconciliation", "group_specific", "The direct general parrot high-fat warning is retained as group-specific context, not as a distinct African-Grey feeding trial. It supports a limited outcome only and does not create a portion or complete ration."),
      limited("budgie", [source.budgieOilseed], "Clinical Nutrition of Small Psittacines and Passerines: oilseed and single-seed-diet caution", "group_specific", "Small-psittacine clinical nutrition identifies sunflower as an oilseed and warns against single-seed diet patterns. This supports a limited context, not a budgie portion, complete ration, or other species outcome."),
      absence("canary", sunflowerForm, "Serinus canaria sunflower seed diet study", "canary whole sunflower seed avian veterinary diet", "No direct canary whole-sunflower source with an exact form and diet outcome was established after the documented searches."),
      limited("chicken", [source.chickenSunflower], "Poultry Extension: Sunflower Seeds in Poultry Diets", "species_specific", "Poultry feed-ingredient guidance supports whole sunflower only in formulated chicken-diet context. It does not prescribe a household amount, a complete ration, or another species outcome.")
    ],
    processing: { sourceIds: [source.pigeon, source.parrotSunflower, source.chickenSunflower], rule: "Keep whole dry sunflower seed distinct from kernels/hearts, meal, cake, oil, sprouts, roasted, salted, flavoured, and mould-contaminated products. This evidence-only review does not approve runtime use, an inventory entry, a portion, a formula, or a complete ration.", severity: "warning" },
    lastReviewedAt: date
  },
  {
    ingredientId: "safflower",
    ingredientDisplayName: "Safflower Seeds",
    form: safflowerForm,
    nutrition: { sourceIds: [source.pigeonSafflower, source.psittacineSeed, source.chickenSafflower], basis: "not_applicable", notes: "Evidence-only review of whole dry, plain, unsalted, unflavoured safflower seed. It does not add nutrient values, change active data, or claim an inventory formula." },
    speciesEvidence: [
      limited("pigeon", [source.pigeonSafflower], "Melbourne Bird Veterinary Clinic Diet for Pet Pigeons: safflower named in a whole-grain mix with complete-diet caution", "species_specific", "Exotics-vet pigeon guidance includes safflower only in a bounded whole-grain mix and cautions against incomplete seed/grain-only diets. It supports limited context, not a portion, formula, or complete ration."),
      limited("parrot", [source.psittacineSeed], "Ullrey et al.: safflower seed composition within psittacine seed-mixture nutrition review", "group_specific", "The psittacine review documents safflower in commercial seed-mixture context and the limits of seed mixtures. It supports limited group context, not a portion, complete ration, or another species outcome."),
      limited("african_grey", [source.psittacineSeed], "Ullrey et al.: African Grey scope and safflower analysis within psittacine seed-mixture review", "species_specific", "The review includes African Grey scope and safflower seed mixture context but does not provide an individual feeding prescription. It supports limited context only, not a portion or complete ration."),
      limited("budgie", [source.budgieOilseed], "Clinical Nutrition of Small Psittacines and Passerines: safflower oilseed context", "group_specific", "Small-psittacine clinical nutrition identifies safflower as an oilseed and cautions against single-seed diet patterns. It supports limited context, not a budgie portion, complete ration, or another species outcome."),
      absence("canary", safflowerForm, "Serinus canaria safflower seed diet study", "canary whole safflower seed veterinary nutrition", "The documented searches did not yield an inspected direct domestic-canary whole-safflower outcome with a verified form boundary."),
      limited("chicken", [source.chickenSafflower], "Rathaur et al.: 42-day broiler trial with 2.5%–10% safflower seed in balanced starter/finisher diets", "species_specific", "The direct broiler study supports safflower only within its cited balanced-diet and inclusion-level context. It does not prescribe a household portion, a complete ration, or another species outcome.")
    ],
    processing: { sourceIds: [source.pigeonSafflower, source.psittacineSeed, source.chickenSafflower], rule: "Keep whole dry safflower seed distinct from dehulled/decorticated material, meal, cake, oil, sprouts, roasted, salted, flavoured, and mould-contaminated products. This evidence-only review does not approve runtime use, an inventory entry, a portion, a formula, or a complete ration.", severity: "warning" },
    lastReviewedAt: date
  },
  {
    ingredientId: "hemp",
    ingredientDisplayName: "Hemp Seeds",
    form: hempForm,
    nutrition: { sourceIds: [source.pigeon, source.budgieHempChoice, source.budgieHempCase, source.chickenHemp], basis: "not_applicable", notes: "Evidence-only review of whole dry, plain, unsalted, unflavoured hemp seed. It does not add nutrient values, change active data, or claim an inventory formula." },
    speciesEvidence: [
      limited("pigeon", [source.pigeon], "Hullár et al.: adult homing pigeons received whole hemp as an individual feedstuff for energy/digestibility measurement", "species_specific", "The direct pigeon study establishes whole-hemp ingestion/digestibility context only. It does not establish unrestricted or staple use, a portion, a complete ration, or another species outcome."),
      absence("parrot", hempForm, "psittacine whole hemp seed digestibility feeding trial", "parrot Cannabis sativa in-shell seed diet veterinary", "No direct generic companion-parrot in-shell whole-hemp trial was found; African-Grey and budgerigar evidence was not applied to the generic parrot row."),
      absence("african_grey", hempForm, "Psittacus erithacus whole hemp seed digestibility", "African Grey hemp seed nutrition research", "The first-pass lead was not retained as an inspected, registered source with an exact whole-seed form boundary, so the African-Grey row remains neutral rather than upgrading an unverified lead."),
      limited("budgie", [source.budgieHempChoice, source.budgieHempCase], "Waterhouse and Hutcheson free-choice hemp consumption; 2026 clinical case diet history and restriction advice", "species_specific", "Direct budgerigar palatability evidence establishes hemp consumption, while the clinical case places hemp in a high-energy mixed-seed restriction context. Together they support limited context only, not causation, a portion, a complete ration, or another species outcome."),
      absence("canary", hempForm, "Serinus canaria hemp seed diet study", "domestic canary hemp seed veterinary nutrition", "The documented searches did not yield an inspected direct domestic-canary whole-hemp outcome with a verified form boundary."),
      limited("chicken", [source.chickenHemp], "Bošković Cabrol et al.: 4-week laying-hen trial of whole hemp seed at 10% of average daily feed intake alongside commercial diet", "species_specific", "The direct laying-hen study supports whole hemp only in its named commercial-diet and legal-variety enrichment context. It does not prescribe a household amount, a complete ration, a different hemp product, or another species outcome.")
    ],
    processing: { sourceIds: [source.pigeon, source.budgieHempCase, source.chickenHemp], rule: "Keep whole dry hemp seed distinct from hulled hearts, meal, cake, oil, sprouts, extracts, products with cannabinoids, roasted, salted, flavoured, and mould-contaminated products. This evidence-only review does not approve runtime use, an inventory entry, a portion, a formula, or a complete ration.", severity: "warning" },
    lastReviewedAt: date
  },
  {
    ingredientId: "basil",
    ingredientDisplayName: "Basil",
    form: basilForm,
    nutrition: { sourceIds: [source.log, source.chickenBasil], basis: "not_applicable", notes: "Evidence-only review of dried culinary sweet-basil leaf. It does not add nutrient values, change active data, or claim an inventory formula." },
    speciesEvidence: [
      absence("pigeon", basilForm, "Columba livia Ocimum basilicum dried leaf feed", "pigeon basil leaf powder nutrition study", "No direct pigeon dried sweet-basil leaf source was established; basil seed and non-pigeon evidence were excluded as wrong forms or species."),
      absence("parrot", basilForm, "psittacine Ocimum basilicum dried leaf feeding", "parrot sweet basil leaf powder safety study", "No direct generic companion-parrot dried sweet-basil leaf source was established; care-list claims and non-psittacine evidence were excluded."),
      absence("african_grey", basilForm, "Psittacus erithacus Ocimum basilicum dried leaf", "African Grey basil leaf feeding study", "No direct African-Grey dried sweet-basil leaf source was established; generic parrot guidance was not applied to the species row."),
      absence("budgie", basilForm, "Melopsittacus undulatus Ocimum basilicum dried leaf", "budgie sweet basil leaf feeding study", "No direct budgerigar dried sweet-basil leaf source was established; Ocimum tenuiflorum and fresh-leaf results were excluded as botanical/form mismatches."),
      absence("canary", basilForm, "Serinus canaria Ocimum basilicum dried leaf", "domestic canary sweet basil leaf feeding study", "No direct domestic-canary dried sweet-basil leaf source was established after targeted and specialist searches."),
      limited("chicken", [source.chickenBasil], "Morakinyo et al.: sweet-basil leaf meal at 0.5, 1.0, and 1.5 g/kg in formulated broiler diets", "species_specific", "The direct broiler trial supports dried sweet-basil leaf meal only at studied formulated-diet levels. It does not prescribe a household portion, a complete ration, a fresh/oil/extract equivalence, or another species outcome.")
    ],
    processing: { sourceIds: [source.log, source.chickenBasil], rule: "Keep dried culinary sweet-basil leaf distinct from fresh basil, seeds, essential oil, extracts, tinctures, tea, blends, salted, flavoured, or mould-contaminated products. This evidence-only review does not approve runtime use, an inventory entry, a portion, a formula, or a complete ration.", severity: "warning" },
    lastReviewedAt: date
  },
  {
    ingredientId: "oregano",
    ingredientDisplayName: "Oregano",
    form: oreganoForm,
    nutrition: { sourceIds: [source.log, source.chickenOregano], basis: "not_applicable", notes: "Evidence-only review of dried culinary Origanum vulgare leaf. It does not add nutrient values, change active data, or claim an inventory formula." },
    speciesEvidence: [
      absence("pigeon", oreganoForm, "Columba livia Origanum vulgare dried leaf powder diet", "pigeon oregano leaf powder feeding study", "No direct pigeon dried Origanum vulgare source was established; the accessible pigeon Origanum majorana powder trial and oregano extracts were excluded as botanical/preparation mismatches."),
      absence("parrot", oreganoForm, "psittacine Origanum vulgare dried leaf feeding", "parrot oregano leaf powder safety study", "No direct generic companion-parrot dried oregano leaf source was established; generic care claims and essential-oil evidence were excluded."),
      absence("african_grey", oreganoForm, "Psittacus erithacus Origanum vulgare dried leaf", "African Grey oregano leaf feeding study", "No direct African-Grey dried oregano leaf source was established; generic parrot guidance was not applied to the species row."),
      absence("budgie", oreganoForm, "Melopsittacus undulatus Origanum vulgare dried leaf", "budgie oregano leaf feeding study", "No direct budgerigar dried oregano leaf source was established; generic and essential-oil material was excluded."),
      absence("canary", oreganoForm, "Serinus canaria Origanum vulgare dried leaf", "domestic canary oregano leaf feeding study", "No direct domestic-canary dried oregano leaf source was established after targeted and specialist searches."),
      limited("chicken", [source.chickenOregano], "Ampode and Mendoza: sun-dried, pulverized Origanum vulgare leaf powder at 1%, 3%, and 5% in 42-day broiler rations", "species_specific", "The direct broiler study supports sun-dried oregano leaf powder only in its cited trial-diet context. It does not prescribe a household portion, a complete ration, a fresh/oil/extract equivalence, or another species outcome.")
    ],
    processing: { sourceIds: [source.log, source.chickenOregano], rule: "Keep dried culinary Origanum vulgare leaf distinct from sweet marjoram, fresh oregano, essential oil, extracts, tinctures, tea, blends, salted, flavoured, or mould-contaminated products. This evidence-only review does not approve runtime use, an inventory entry, a portion, a formula, or a complete ration.", severity: "warning" },
    lastReviewedAt: date
  }
];

for (const review of reviews) {
  if (foodReviews.ingredientReviews.some((existing) => existing.ingredientId === review.ingredientId && existing.form === review.form)) {
    throw new Error(`Food review already exists: ${review.ingredientId}::${review.form}`);
  }
  foodReviews.ingredientReviews.push(review);
}

const coreCoverage = coverage.claimCoverage.find((entry) => entry.historicalClaimId === "historical-multibird-core-compatibility-list");
if (!coreCoverage) throw new Error("Missing historical multibird core coverage group");

const coverageUpdates = new Map(reviews.map((review) => [
  ({ sunflower: "sunflower-seeds", safflower: "safflower-seeds", hemp: "hemp-seeds", basil: "basil", oregano: "oregano" })[review.ingredientId],
  `${review.ingredientId}::${review.form}`
]));

for (const item of coreCoverage.trackedItems) {
  const key = coverageUpdates.get(item.id);
  if (key) item.linkedFoodReviewKeys = [key];
}

save("sources.json", sources);
save("food-reviews.json", foodReviews);
save("food-coverage.json", coverage);
console.log("Issue #160 provenance records applied.");
console.log(`- source records: ${sources.sources.length}`);
console.log(`- food reviews: ${foodReviews.ingredientReviews.length}`);
console.log(`- updated coverage links: ${coverageUpdates.size}`);
