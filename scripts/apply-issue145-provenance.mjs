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
const foodReviews = load("food-reviews.json");
const coverage = load("food-coverage.json");

const sourceRecords = [
  {
    id: "kiwis-bird-rescue-diet-2026",
    title: "Diet and Chop Recipes",
    authorsOrOrganization: "Kiwi's New Life Bird Rescue",
    publishedYear: "unknown",
    sourceTier: "owner_guidance_with_citations",
    urlOrDoi: "https://www.kiwisnewlifebirdrescue.org/programs",
    speciesScopes: ["companion_bird"],
    permittedUse: "Companion-bird rescue guidance that requires dried beans to be rehydrated and fully cooked and cooled; its recipe identifies black beans only as cooked legumes.",
    limitations: "Rescue guidance is not a controlled feeding study. It does not define a species-specific amount, a complete ration, a universal cooking protocol, or an outcome for a different bird species.",
    accessedAt: date
  },
  {
    id: "ologhobo-1993-raw-limabean-chicks",
    title: "Toxicity of Raw Limabeans (Phaseolus lunatus L.) and Limabean Fractions for Growing Chicks",
    authorsOrOrganization: "A. D. Ologhobo; D. F. Apata; A. Oyejide; O. Akinpelu",
    publishedYear: "1993",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.1080/00071669308417606",
    speciesScopes: ["chicken", "broiler_chicken"],
    permittedUse: "Controlled four-week broiler-starter evidence for raw lima beans and soaked/boiled comparison diets, including growth and organ-histology outcomes.",
    limitations: "The study does not establish a home feeding method, a universally safe inclusion rate, a complete ration, or suitability for another supported bird.",
    accessedAt: date
  },
  {
    id: "arija-2006-raw-extruded-pinto-chicks",
    title: "Nutritional Evaluation of Raw and Extruded Kidney Bean (Phaseolus vulgaris L. var. Pinto) in Chicken Diets",
    authorsOrOrganization: "I. Arija; C. Centeno; A. Viveros; A. Brenes; F. Marzo; J. C. Illera; G. Silvan",
    publishedYear: "2006",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.1093/ps/85.4.635",
    speciesScopes: ["chicken", "broiler_chicken"],
    permittedUse: "Controlled 0–21-day broiler evidence comparing raw and extruded pinto-kidney-bean inclusion at 100, 200, and 300 g/kg.",
    limitations: "This broiler study does not establish an unsupervised household method, universal inclusion rate, complete ration, or any other species outcome.",
    accessedAt: date
  },
  {
    id: "bhave-1964-nonheated-pinto-chicks",
    title: "A Comparison of Feeding Heated and Non Heated Pinto Bean Meal to Broiler-Strain Chicks",
    authorsOrOrganization: "G. V. Bhave; Kansas State University",
    publishedYear: "1964",
    sourceTier: "primary",
    urlOrDoi: "https://krex.k-state.edu/bitstreams/4e22ae54-f61a-4d26-b382-86c899692ca7/download",
    speciesScopes: ["chicken", "broiler_chicken"],
    permittedUse: "Controlled broiler-strain-chick comparison of heated and non-heated pinto-bean meal, including raw-meal growth findings.",
    limitations: "A historical thesis with study-specific diets; it does not prescribe a household preparation method, a current formula, or another species outcome.",
    accessedAt: date
  },
  {
    id: "hewitt-1973-raw-navy-chicks",
    title: "A Comparison of Fractions Prepared from Navy (Haricot) Beans (Phaseolus vulgaris L.) in Diets for Germ-free and Conventional Chicks",
    authorsOrOrganization: "D. Hewitt; M. E. Coates; M. L. Kakade; I. E. Liener",
    publishedYear: "1973",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.1079/BJN19730118",
    speciesScopes: ["chicken", "chick"],
    permittedUse: "Direct conventional- and germ-free-chick comparison of raw and heated navy-bean meal, including body-weight and pancreatic outcomes.",
    limitations: "The controlled chick study does not provide a home feeding method, a complete ration, a universal inclusion rate, or evidence for another supported bird.",
    accessedAt: date
  },
  {
    id: "rubio-1990-raw-autoclaved-faba-broilers",
    title: "The Utilization of Raw and Autoclaved Faba Beans (Vicia faba L., var. minor) and Faba Bean Fractions in Diets for Growing Broiler Chickens",
    authorsOrOrganization: "L. A. Rubio; A. Brenes; M. Castaño",
    publishedYear: "1990",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.1079/BJN19900130",
    speciesScopes: ["chicken", "broiler_chicken"],
    permittedUse: "Direct growing-broiler comparison of raw and autoclaved faba-bean diets and fractions, including body-weight and organ outcomes.",
    limitations: "The studied varieties, processing, and diet levels are specific; this is not a household rule, complete ration, or other-species evidence.",
    accessedAt: date
  },
  {
    id: "mateos-puchal-1981-raw-broad-bean-broilers",
    title: "Raw Broad Beans (Vicia faba L.) as an Energy and Protein Source for Broiler Chicks",
    authorsOrOrganization: "G. G. Mateos; F. Puchal",
    publishedYear: "1981",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.3382/ps.0602486",
    speciesScopes: ["chicken", "broiler_chicken"],
    permittedUse: "Direct broiler-chick study of raw broad beans at defined dietary inclusion levels.",
    limitations: "The study’s defined formulated diets cannot set a household amount, a complete ration, or an outcome for a different species.",
    accessedAt: date
  }
];

for (const record of sourceRecords) {
  if (!sources.sources.some((source) => source.id === record.id)) sources.sources.push(record);
}

const ftb = sources.sources.find((source) => source.id === "ftb-legume-safety-2018");
if (ftb) {
  ftb.permittedUse = "Parrot-rescue preparation guidance that identifies lentils, mung beans, sweet/green peas, lima beans, fava beans, pinto beans, and navy beans as forms requiring sprouting or full cooking before offering.";
  ftb.limitations = "Rescue owner guidance, not a controlled feeding trial. It does not establish a preparation method, portion, complete ration, runtime approval, or outcome for pigeons, African Greys, budgies, canaries, or chickens.";
  ftb.accessedAt = date;
}

function row(bird, outcome, sourceIds, locator, evidenceScope, rationale) {
  return { bird, outcome, sourceIds, locator, evidenceScope, rationale, reviewedAt: date };
}

const pigeonUnresolved = (display) => row(
  "pigeon",
  "unresolved",
  ["vca-pigeon-dove-feeding", "palomacy-pigeon-feeding-2026"],
  "VCA Feeding Pigeons and Doves and Palomacy pigeon-feeding guidance; Issue #145 first-pass and targeted second-search log for raw dried " + display,
  "species_specific",
  "Neither direct pigeon source names raw dried " + display + " or establishes its preparation boundary. The documented first and targeted second searches yielded no accessible exact pigeon/form evidence, so this row remains unresolved without using another bird’s evidence."
);

const parrotCooked = (display) => row(
  "parrot",
  "requires_preparation",
  ["ftb-legume-safety-2018"],
  "For the Birds Legume Safety Warning, preparation list naming " + display + " among beans to sprout or fully cook",
  "group_specific",
  "Parrot-rescue guidance names " + display + " within a preparation-bound bean list. It does not establish raw dried use, a method, a portion, a formula, a complete ration, or any other species outcome."
);

const parrotBlackCooked = row(
  "parrot",
  "requires_preparation",
  ["kiwis-bird-rescue-diet-2026"],
  "Kiwi’s New Life Bird Rescue Diet and Chop Recipes: dried beans must be rehydrated and fully cooked and cooled; black beans appear only in the cooked-legume recipe",
  "group_specific",
  "Companion-bird rescue guidance frames black beans only as cooked legumes and requires dried beans to be rehydrated and fully cooked and cooled. This is a preparation boundary only; it does not establish a formula, amount, complete ration, or another species outcome."
);

const greyCooked = (display) => row(
  "african_grey",
  "requires_preparation",
  ["vca-african-grey-feeding"],
  "VCA African Grey suggested-food table: ‘cooked beans (various types)’",
  "species_specific",
  "African-Grey-specific veterinary guidance presents beans as cooked, not as raw dried " + display + ". This supports a preparation boundary only; it does not establish a method, portion, formula, or complete ration."
);

const budgieCooked = (display) => row(
  "budgie",
  "requires_preparation",
  ["vca-budgie-feeding"],
  "VCA Budgies suitable-food table: ‘cooked beans (various)’",
  "species_specific",
  "Budgie-specific veterinary guidance presents beans as cooked, not as raw dried " + display + ". This supports a preparation boundary only; it does not establish a method, portion, formula, or complete ration."
);

const canaryCooked = (display, named) => row(
  "canary",
  "requires_preparation",
  ["vca-canary-feeding"],
  named ? "VCA Canaries suitable-food table listing " + display + " under ‘cooked beans’" : "VCA Canaries suitable-food table: ‘cooked beans’",
  "species_specific",
  named ? "Canary-specific veterinary guidance explicitly lists " + display + " under cooked beans, not as raw dried food. This supports a preparation boundary only; it does not establish a method, portion, formula, or complete ration." : "Canary-specific veterinary guidance presents beans as cooked, not as raw dried " + display + ". The targeted search found no higher-quality exact-form source, so this bounded preparation outcome does not establish a method, portion, formula, or complete ration."
);

const chickenLima = row(
  "chicken",
  "requires_preparation",
  ["ologhobo-1993-raw-limabean-chicks"],
  "Ologhobo et al. abstract: four-week broiler-starter trial comparing raw and soaked/boiled lima-bean diets, growth, and organ outcomes",
  "species_specific",
  "The direct broiler study reports severely hindered growth and serious histopathological changes with raw lima-bean diets, while the soaked/boiled comparison was excepted. This establishes a preparation boundary only; it does not prescribe a household method, portion, formula, or complete ration."
);

const chickenFava = row(
  "chicken",
  "limited",
  ["mateos-puchal-1981-raw-broad-bean-broilers", "rubio-1990-raw-autoclaved-faba-broilers"],
  "Mateos and Puchal defined low-inclusion raw broad-bean broiler diets; Rubio et al. raw-versus-autoclaved faba-bean broiler diets",
  "species_specific",
  "Direct broiler studies show that raw fava/broad-bean outcomes depend on the defined balanced diet, inclusion level, and processing: one reports defined low-inclusion use, while the raw-versus-autoclaved study reports poorer outcomes at higher raw inclusion. This supports limited controlled-ration context only, not a home-feeding rule, complete ration, or other-species outcome."
);

const chickenBlack = row(
  "chicken",
  "unresolved",
  ["merck-poultry-2024"],
  "Merck Nutritional Requirements of Poultry complete-ration boundary; Issue #145 first-pass and targeted second-search log for raw dried black beans",
  "species_specific",
  "The documented first and targeted second searches found no accessible direct chicken study of the exact raw dried black-bean form; the accessible broiler black-bean source used boiled beans. Merck supplies only the complete-ration boundary, so the exact raw form remains unresolved rather than being inferred from pinto, kidney, or cooked black beans."
);

const chickenPinto = row(
  "chicken",
  "requires_preparation",
  ["arija-2006-raw-extruded-pinto-chicks", "bhave-1964-nonheated-pinto-chicks"],
  "Arija et al. 0–21-day raw-versus-extruded pinto-kidney-bean broiler trial; Bhave heated-versus-non-heated pinto-bean-meal broiler-strain-chick thesis",
  "species_specific",
  "Two direct chicken studies report poorer growth or performance with raw/non-heated pinto-bean diets and improvement with processing. This establishes a preparation boundary only; it does not prescribe a household method, portion, formula, or complete ration."
);

const chickenNavy = row(
  "chicken",
  "requires_preparation",
  ["hewitt-1973-raw-navy-chicks"],
  "Hewitt et al. abstract: raw and heated navy-bean meal diets in conventional and germ-free chicks",
  "species_specific",
  "The direct chick study records body-weight depression and pancreatic changes with raw navy-bean meal, with a greater final-body-weight depression in conventional chicks. This establishes a preparation boundary only; it does not prescribe a household method, portion, formula, or complete ration."
);

function review({ id, name, chicken, parrot }) {
  const display = name.toLowerCase();
  const canaryNamed = id === "lima_beans" || id === "navy_beans";
  const sourceIds = new Set([
    "vca-pigeon-dove-feeding",
    "palomacy-pigeon-feeding-2026",
    "vca-african-grey-feeding",
    "vca-budgie-feeding",
    "vca-canary-feeding",
    ...chicken.sourceIds,
    ...parrot.sourceIds
  ]);
  return {
    ingredientId: id,
    ingredientDisplayName: name,
    form: "raw dried " + display,
    nutrition: {
      sourceIds: [...chicken.sourceIds],
      basis: "not_applicable",
      notes: "Evidence-only review of raw dried " + display + ". It does not add a nutrient value, an active ingredient, a dry-mix instruction, or a complete-ration claim."
    },
    speciesEvidence: [
      pigeonUnresolved(display),
      parrot,
      greyCooked(display),
      budgieCooked(display),
      canaryCooked(display, canaryNamed),
      chicken
    ],
    processing: {
      sourceIds: [...sourceIds],
      rule: "Keep raw dried " + display + " distinct from soaked, sprouted, cooked, canned, fermented, milled, or manufactured forms. Companion-bird records require preparation; pigeon and, where documented, chicken uncertainty remain explicit; chicken evidence is otherwise bounded to cited controlled poultry studies. This evidence-only record does not approve runtime use, a formula, a portion, or a complete ration.",
      severity: "warning"
    },
    lastReviewedAt: date
  };
}

const reviews = [
  review({ id: "lima_beans", name: "Lima beans", chicken: chickenLima, parrot: parrotCooked("lima beans") }),
  review({ id: "fava_beans", name: "Fava beans", chicken: chickenFava, parrot: parrotCooked("fava beans") }),
  review({ id: "black_beans", name: "Black beans", chicken: chickenBlack, parrot: parrotBlackCooked }),
  review({ id: "pinto_beans", name: "Pinto beans", chicken: chickenPinto, parrot: parrotCooked("pinto beans") }),
  review({ id: "navy_beans", name: "Navy beans", chicken: chickenNavy, parrot: parrotCooked("navy beans") })
];

for (const reviewRecord of reviews) {
  if (foodReviews.ingredientReviews.some((existing) => existing.ingredientId === reviewRecord.ingredientId && existing.form === reviewRecord.form)) {
    throw new Error(`Food review already exists: ${reviewRecord.ingredientId}::${reviewRecord.form}`);
  }
  foodReviews.ingredientReviews.push(reviewRecord);
}

const rawLegumeCoverage = coverage.claimCoverage.find((entry) => entry.historicalClaimId === "historical-raw-legume-rules");
if (!rawLegumeCoverage) throw new Error("Missing historical raw-legume coverage group");

const coverageUpdates = new Map(reviews.map((record) => [
  record.ingredientId.replace(/_/g, "-") + "-raw",
  `${record.ingredientId}::${record.form}`
]));
for (const item of rawLegumeCoverage.trackedItems) {
  const key = coverageUpdates.get(item.id);
  if (key) item.linkedFoodReviewKeys = [key];
}

save("sources.json", sources);
save("food-reviews.json", foodReviews);
save("food-coverage.json", coverage);
console.log("Issue #145 provenance records applied.");
console.log(`- source records: ${sources.sources.length}`);
console.log(`- food reviews: ${foodReviews.ingredientReviews.length}`);
console.log(`- updated coverage links: ${coverageUpdates.size}`);
