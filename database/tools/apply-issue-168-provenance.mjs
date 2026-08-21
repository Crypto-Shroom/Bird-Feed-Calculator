import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sourcesPath = path.join(root, "provenance", "sources.json");
const reviewsPath = path.join(root, "provenance", "food-reviews.json");
const reviewedAt = "2026-08-21";

const sources = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));
const reviews = JSON.parse(fs.readFileSync(reviewsPath, "utf8"));

const sourceRecords = [
  {
    id: "issue-168-research-log-2026",
    title: "Issue #168 six-form bird evidence research log",
    authorsOrOrganization: "Bird Feed Calculator project research",
    publishedYear: "2026",
    sourceTier: "historical_project",
    urlOrDoi: "database/provenance/evidence/issue-168-research-log.md",
    speciesScopes: ["pigeon", "parrot", "african_grey", "budgie", "canary", "chicken"],
    permittedUse: "Documents the independent first-pass and targeted second-pass searches, retained source candidates, form-continuity reconciliation, and explicitly labelled shared-ingredient inference rationale for Issue #168.",
    limitations: "A research log documents search process, evidence gaps, and the limits of a stated inference. It is not an external scientific source, cannot silently approve an ingredient, and cannot establish a dose, formula, complete ration, medical use, runtime approval, or a different preparation.",
    accessedAt: reviewedAt
  },
  {
    id: "wsu-extension-common-bean-varieties-2026",
    title: "Dry Bean Varieties for Niche Markets in the USA",
    authorsOrOrganization: "Washington State University Vegetable Research and Extension",
    publishedYear: "2026",
    sourceTier: "primary",
    urlOrDoi: "https://vegetables.wsu.edu/dry-bean-varieties-for-niche-markets-in-the-usa/",
    speciesScopes: ["plant_taxonomy", "phaseolus_vulgaris"],
    permittedUse: "Supports the botanical identity boundary: the University extension list states that its listed market classes are common beans, Phaseolus vulgaris L., and includes Great Northern, Small White/Navy, White Kidney/Cannellini, and Pinto classes.",
    limitations: "A plant-variety source does not independently establish bird suitability, a safety outcome, preparation method, portion, formula, complete ration, or an outcome for a different bean species or a materially different product.",
    accessedAt: reviewedAt
  },
  {
    id: "el-ghamry-karosah-2020-pigeon-chamomile-flowers",
    title: "Effect Of Some Feed additives (Yeast, Fenugreek seeds and Chamomile flowers) On Some Behavioral patterns and Productive Performance In Pigeons (Columba livia domestica)",
    authorsOrOrganization: "E. H. El-ghamry and M. M. Karosah",
    publishedYear: "2020",
    sourceTier: "primary",
    urlOrDoi: "https://bvmj.journals.ekb.eg/article_116443.html",
    speciesScopes: ["pigeon"],
    permittedUse: "Supports that a controlled pigeon study assessed chamomile flowers as a dietary feed additive in domestic pigeons.",
    limitations: "The study context does not establish a household serving amount, a complete ration, medical use, a formula, unrestricted use, an oil/extract outcome, or a result for another bird species.",
    accessedAt: reviewedAt
  },
  {
    id: "al-kaisse-khalel-2011-broiler-chamomile-flowers",
    title: "The Potency of Chamomile Flowers (Matericaria chamomilla L.) as Feed Supplements (Growth Promoters) on Productive Performance and Hematological Parameters Constituents of Broiler",
    authorsOrOrganization: "Galib A. M. Al-Kaisse and Eman K. Khalel",
    publishedYear: "2011",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.3923/ijps.2011.726.729",
    speciesScopes: ["chicken"],
    permittedUse: "Supports a bounded broiler-ration finding for dried, milled chamomile flowers at defined trial inclusion levels.",
    limitations: "It does not establish a visitor household amount, a complete ration, medical benefit, unrestricted use, an oil/extract outcome, or a result for other birds.",
    accessedAt: reviewedAt
  },
  {
    id: "al-sagan-2020-broiler-fennel-seed-powder",
    title: "Effects of Fennel Seed Powder Supplementation on Growth Performance, Carcass Characteristics, Meat Quality, and Economic Efficiency of Broilers under Thermoneutral and Chronic Heat Stress Conditions",
    authorsOrOrganization: "Ahmed A. Al-Sagan, Shady Khalil, Elsayed O. S. Hussein, and Youssef A. Attia",
    publishedYear: "2020",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.3390/ani10020206",
    speciesScopes: ["chicken"],
    permittedUse: "Supports a bounded broiler-ration finding for experimentally ground fennel seed powder at specified inclusion levels and environmental conditions.",
    limitations: "It does not establish a household serving amount, unrestricted use of whole seed, a complete ration, medical treatment, oil/extract equivalence, or a result for another bird species.",
    accessedAt: reviewedAt
  },
  {
    id: "ghonime-2025-broiler-fennel-seed-meal",
    title: "Evaluation of fennel seed meal in broiler chickens' diets: impacts on performance, carcass traits, digestive enzymes, intestinal microbiota, blood metabolites, and economic feasibility",
    authorsOrOrganization: "Mohammed E. Ghonime et al.",
    publishedYear: "2025",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.5194/aab-68-531-2025",
    speciesScopes: ["chicken"],
    permittedUse: "Supports a bounded broiler-ration finding for fennel seed meal in formulated diets.",
    limitations: "The meal was obtained after oil extraction and ground. It cannot establish a household serving amount, ordinary whole-seed equivalence, unrestricted use, a complete ration, therapeutic use, or another bird species outcome.",
    accessedAt: reviewedAt
  }
];

for (const record of sourceRecords) {
  const index = sources.sources.findIndex((source) => source.id === record.id);
  if (index >= 0) sources.sources.splice(index, 1, record);
  else sources.sources.push(record);
}

const birds = ["pigeon", "parrot", "african_grey", "budgie", "canary", "chicken"];
const logSource = "issue-168-research-log-2026";
const herbRegistrySource = "herb-provenance-registry-2026";
const commonBeanIdentitySource = "wsu-extension-common-bean-varieties-2026";
const commonBeanHazardSources = ["hewitt-1973-raw-navy-chicks", "arija-2006-raw-extruded-pinto-chicks"];

function unresolvedEvidence(bird, formLabel) {
  return {
    bird,
    outcome: "unresolved",
    sourceIds: [logSource],
    locator: `Issue #168 research log: documented independent first-pass and targeted second searches for ${formLabel} and ${bird}`,
    evidenceScope: "historical_project",
    rationale: `The documented first-pass and targeted second searches did not establish direct ${bird}-specific evidence for ${formLabel}, and the retained sources did not meet the owner-confirmed standard for an explicit ingredient-level inference. This neutral unresolved outcome records an evidence gap only; it is not a safety approval, a toxicity finding, a preparation instruction, or a silent cross-species inference.`,
    followUpSearch: {
      queries: [`${bird} ${formLabel} veterinary`, `${bird} ${formLabel} feeding study`],
      sourceIds: [logSource],
      result: `The targeted second-pass query set and its negative or form-limited result are documented in the Issue #168 research log; no direct ${bird}-specific ${formLabel} outcome or defensible ingredient-level inference was established.`
    },
    reviewedAt
  };
}

function commonBeanEvidence(bird, beanLabel, birdContextSource, birdContextLocator) {
  return {
    bird,
    outcome: "requires_preparation",
    sourceIds: [commonBeanIdentitySource, ...commonBeanHazardSources, birdContextSource],
    locator: `WSU Extension: Great Northern, navy, cannellini/white kidney, and pinto are listed common-bean (Phaseolus vulgaris L.) market classes; Hewitt and Arija: raw navy/pinto Phaseolus-vulgaris material in chick diets; ${birdContextLocator}`,
    evidenceScope: "related_species",
    rationale: `${beanLabel} is a raw dried Phaseolus-vulgaris common-bean market class. The retained raw-navy and raw-pinto chick studies establish a preparation boundary for raw Phaseolus-vulgaris material, and ${birdContextLocator} provides the closest retained ${bird} bean context. Because direct ${bird}-specific evidence for this exact white-bean market class was not found, this is an explicitly labelled ingredient-level inference from the shared botanical identity, raw dried exposure, and raw-common-bean antinutritional boundary. It supports preparation required only; it does not establish a method, portion, formula, complete ration, medical use, runtime approval, or a different bean species/form.`,
    reviewedAt
  };
}

function herbEvidence({ bird, herbName, sourceIds, direct = false, directLocator = "" }) {
  const scope = direct ? "species_specific" : "related_species";
  const locator = direct
    ? `${directLocator}; canonical herb-provenance registry ordinary-${herbName} eligibility`
    : `Canonical herb-provenance registry ordinary-${herbName} eligibility and its cited poultry/avian-herbal source context`;
  const rationale = direct
    ? `The retained direct ${bird} study and the canonical herb registry support ordinary culinary ${herbName} only as a bounded food-use context. Under the owner-confirmed ordinary-culinary-herb form-continuity boundary, fresh and dried household use are one form; oils, extracts, tinctures, teas, and other concentrated preparations remain distinct. This does not establish a dose, formula, complete ration, medical use, or runtime approval.`
    : `The canonical herb registry explicitly treats ordinary culinary ${herbName} as eligible for this supported bird. Under the owner-confirmed ordinary-culinary-herb form-continuity boundary, fresh and dried household use are one form; oils, extracts, tinctures, teas, and other concentrated preparations remain distinct. This is an explicitly labelled related-species inference from the same ordinary culinary ingredient and preparation boundary; the retained external sources remain poultry/avian-herbal context and do not establish direct ${bird}-specific dosing, a formula, a complete ration, medical use, or runtime approval.`;
  return { bird, outcome: "limited", sourceIds, locator, evidenceScope: scope, rationale, reviewedAt };
}

function review({ ingredientId, ingredientDisplayName, form, nutritionNotes, evidenceOverrides = {}, processingRule, severity = "warning" }) {
  return {
    ingredientId,
    ingredientDisplayName,
    form,
    nutrition: { sourceIds: [logSource], basis: "not asserted", notes: nutritionNotes },
    speciesEvidence: birds.map((bird) => evidenceOverrides[bird] ?? unresolvedEvidence(bird, form)),
    processing: {
      sourceIds: [logSource, ...Object.values(evidenceOverrides).flatMap((item) => item.sourceIds)].filter((id, index, all) => all.indexOf(id) === index),
      rule: processingRule,
      severity
    },
    lastReviewedAt: reviewedAt
  };
}

const beanContexts = {
  pigeon: ["vca-pigeon-dove-feeding", "VCA pigeon/dove feeding context retained as a non-specific boundary"],
  parrot: ["ftb-legume-safety-2018", "For the Birds names navy beans among beans to sprout or fully cook"],
  african_grey: ["vca-african-grey-feeding", "VCA African Grey table presents beans as cooked"],
  budgie: ["vca-budgie-feeding", "VCA budgie table presents beans as cooked"],
  canary: ["vca-canary-feeding", "VCA canary table presents beans as cooked and names navy beans under cooked beans"],
  chicken: ["hewitt-1973-raw-navy-chicks", "direct raw-navy chick study records body-weight depression and pancreatic changes"],
};

const beanOverrides = (label) => Object.fromEntries(
  birds.map((bird) => [bird, commonBeanEvidence(bird, label, ...beanContexts[bird])]),
);

const chamomileSources = [herbRegistrySource, "dardouri-2025-poultry-herbs-scoping-review", "elsabrout-2023-poultry-botanicals-review"];
const fennelSources = [herbRegistrySource, "dardouri-2025-poultry-herbs-scoping-review"];
const gingerSources = [herbRegistrySource, "elsabrout-2023-poultry-botanicals-review"];

const newReviews = [
  review({
    ingredientId: "great_northern_white_beans",
    ingredientDisplayName: "Great Northern white beans",
    form: "raw dried Great Northern white beans, plain and unseasoned",
    nutritionNotes: "No nutrient claim is asserted in this provenance-only review. The record concerns the raw dried Phaseolus-vulgaris common-bean form and an explicit, bounded shared-ingredient preparation inference.",
    evidenceOverrides: beanOverrides("Great Northern white beans"),
    processingRule: "Raw dried Great Northern beans are a common-bean (Phaseolus vulgaris) form with an explicitly documented raw-common-bean preparation boundary. This evidence-only record requires preparation before any bird use but does not prescribe a method, portion, formula, complete ration, medical use, runtime inventory approval, or a result for a different bean species/form.",
  }),
  review({
    ingredientId: "cannellini_white_beans",
    ingredientDisplayName: "Cannellini white beans",
    form: "raw dried cannellini white beans, plain and unseasoned",
    nutritionNotes: "No nutrient claim is asserted in this provenance-only review. The record concerns the raw dried Phaseolus-vulgaris common-bean form and an explicit, bounded shared-ingredient preparation inference.",
    evidenceOverrides: beanOverrides("Cannellini white beans"),
    processingRule: "Raw dried cannellini beans are a common-bean (Phaseolus vulgaris) form with an explicitly documented raw-common-bean preparation boundary. This evidence-only record requires preparation before any bird use but does not prescribe a method, portion, formula, complete ration, medical use, runtime inventory approval, or a result for a different bean species/form.",
  }),
  review({
    ingredientId: "chamomile",
    ingredientDisplayName: "Chamomile",
    form: "ordinary culinary chamomile flower, fresh or dried, plain",
    nutritionNotes: "No nutrient claim is asserted in this provenance-only review. The owner-confirmed ordinary-culinary-herb boundary treats fresh and dried household flower as one form; tea, extracts, oils, and therapeutic preparations remain distinct.",
    evidenceOverrides: {
      pigeon: herbEvidence({ bird: "pigeon", herbName: "chamomile", sourceIds: [...chamomileSources, "el-ghamry-karosah-2020-pigeon-chamomile-flowers"], direct: true, directLocator: "Controlled domestic-pigeon chamomile-flower feed-additive study" }),
      parrot: herbEvidence({ bird: "parrot", herbName: "chamomile", sourceIds: chamomileSources }),
      african_grey: herbEvidence({ bird: "african_grey", herbName: "chamomile", sourceIds: chamomileSources }),
      budgie: herbEvidence({ bird: "budgie", herbName: "chamomile", sourceIds: chamomileSources }),
      canary: herbEvidence({ bird: "canary", herbName: "chamomile", sourceIds: chamomileSources }),
      chicken: herbEvidence({ bird: "chicken", herbName: "chamomile", sourceIds: [...chamomileSources, "al-kaisse-khalel-2011-broiler-chamomile-flowers"], direct: true, directLocator: "Broiler study using dried milled chamomile-flower powder at defined dietary inclusion levels" }),
    },
    processingRule: "Treat ordinary culinary chamomile flower as one fresh/dried household-use form. Keep tea, extracts, oils, tinctures, blends, medicinal dosing, salted or flavoured products, and mould-contaminated material distinct. This evidence-only reconciliation does not approve runtime inventory use, a formula, a portion, or a complete ration.",
  }),
  review({
    ingredientId: "lavender",
    ingredientDisplayName: "Lavender",
    form: "ordinary culinary lavender flower, fresh or dried, plain",
    nutritionNotes: "No nutrient claim is asserted in this provenance-only review. The owner-confirmed ordinary-culinary-herb boundary treats fresh and dried household flower as one form; oils, diffusers, extracts, and aromatic products remain distinct.",
    processingRule: "Treat ordinary culinary lavender flower as one fresh/dried household-use form. Essential oil, diffusers, spray, extracts, tinctures, blends, and scented/aromatic products remain distinct. This evidence-only record does not approve runtime inventory use, a formula, a portion, or a complete ration; the retained sources do not establish a defensible ingredient-level inference for any supported bird.",
  }),
  review({
    ingredientId: "fennel",
    ingredientDisplayName: "Fennel",
    form: "ordinary culinary fennel seed, fresh or dried, plain",
    nutritionNotes: "No nutrient claim is asserted in this provenance-only review. The owner-confirmed ordinary-culinary-herb boundary treats fresh and dried household seed as one form; oil, extracts, tea, and other concentrated preparations remain distinct.",
    evidenceOverrides: {
      pigeon: herbEvidence({ bird: "pigeon", herbName: "fennel", sourceIds: fennelSources }),
      parrot: herbEvidence({ bird: "parrot", herbName: "fennel", sourceIds: fennelSources }),
      african_grey: herbEvidence({ bird: "african_grey", herbName: "fennel", sourceIds: fennelSources }),
      budgie: herbEvidence({ bird: "budgie", herbName: "fennel", sourceIds: fennelSources }),
      canary: herbEvidence({ bird: "canary", herbName: "fennel", sourceIds: fennelSources }),
      chicken: herbEvidence({ bird: "chicken", herbName: "fennel", sourceIds: [...fennelSources, "al-sagan-2020-broiler-fennel-seed-powder", "ghonime-2025-broiler-fennel-seed-meal"], direct: true, directLocator: "Broiler studies using ground fennel seed powder or seed meal in defined formulated diets" }),
    },
    processingRule: "Treat ordinary culinary fennel seed as one fresh/dried household-use form. Keep oil, extract, tea, and other concentrated preparations distinct. This evidence-only reconciliation does not approve runtime inventory use, a formula, a portion, or a complete ration.",
  }),
  review({
    ingredientId: "ginger",
    ingredientDisplayName: "Ginger",
    form: "ordinary culinary ginger root, fresh or dried, plain",
    nutritionNotes: "No nutrient claim is asserted in this provenance-only review. The owner-confirmed ordinary-culinary-herb boundary treats fresh and dried household root as one form; powders, tea, extracts, oils, and therapeutic preparations remain distinct.",
    evidenceOverrides: {
      pigeon: herbEvidence({ bird: "pigeon", herbName: "ginger", sourceIds: gingerSources }),
      parrot: herbEvidence({ bird: "parrot", herbName: "ginger", sourceIds: gingerSources }),
      african_grey: herbEvidence({ bird: "african_grey", herbName: "ginger", sourceIds: gingerSources }),
      budgie: herbEvidence({ bird: "budgie", herbName: "ginger", sourceIds: gingerSources }),
      canary: herbEvidence({ bird: "canary", herbName: "ginger", sourceIds: gingerSources }),
      chicken: herbEvidence({ bird: "chicken", herbName: "ginger", sourceIds: gingerSources, direct: true, directLocator: "Canonical poultry-botanicals review context for dietary ginger" }),
    },
    processingRule: "Treat ordinary culinary ginger root as one fresh/dried household-use form. Keep powders, tea, extracts, oils, and other concentrated or therapeutic preparations distinct. This evidence-only reconciliation does not approve runtime inventory use, a formula, a portion, medical dosing, or a complete ration.",
  })
];

for (const record of newReviews) {
  const matchingIndices = reviews.ingredientReviews
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.ingredientId === record.ingredientId)
    .map(({ index }) => index)
    .reverse();
  for (const index of matchingIndices) reviews.ingredientReviews.splice(index, 1);
  reviews.ingredientReviews.push(record);
}

fs.writeFileSync(sourcesPath, `${JSON.stringify(sources, null, 2)}\n`);
fs.writeFileSync(reviewsPath, `${JSON.stringify(reviews, null, 2)}\n`);
console.log(`Added/updated ${newReviews.length} reviews and ${sourceRecords.length} source records.`);
