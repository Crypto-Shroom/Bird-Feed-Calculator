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
    permittedUse: "Documents the independent first-pass and targeted second-pass searches, retained source candidates, exact form boundaries, and unresolved evidence gaps for Issue #168.",
    limitations: "A research log documents the search process and evidence gaps. It is not an external scientific source and cannot convert unresolved outcomes into approval or cross-species evidence.",
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
  if (!sources.sources.some((source) => source.id === record.id)) sources.sources.push(record);
}

const birds = ["pigeon", "parrot", "african_grey", "budgie", "canary", "chicken"];
const logSource = "issue-168-research-log-2026";

function unresolvedEvidence(bird, formLabel) {
  return {
    bird,
    outcome: "unresolved",
    sourceIds: [logSource],
    locator: `Issue #168 research log: documented independent first-pass and targeted second searches for ${formLabel} and ${bird}`,
    evidenceScope: "historical_project",
    rationale: `The documented first-pass and targeted second searches did not establish direct ${bird}-specific evidence for ${formLabel}. This neutral unresolved outcome records an evidence gap only; it is not a safety approval, a toxicity finding, a preparation instruction, or a cross-species inference.`,
    followUpSearch: {
      queries: [
        `${bird} ${formLabel} veterinary`,
        `${bird} ${formLabel} feeding study`
      ],
      sourceIds: [logSource],
      result: `The targeted second-pass query set and its negative or form-limited result are documented in the Issue #168 research log; no direct ${bird}-specific ${formLabel} outcome was established.`
    },
    reviewedAt
  };
}

function review({ ingredientId, ingredientDisplayName, form, nutritionNotes, evidenceOverrides = {}, processingRule, severity = "warning" }) {
  return {
    ingredientId,
    ingredientDisplayName,
    form,
    nutrition: {
      sourceIds: [logSource],
      basis: "not asserted",
      notes: nutritionNotes
    },
    speciesEvidence: birds.map((bird) => evidenceOverrides[bird] ?? unresolvedEvidence(bird, form)),
    processing: {
      sourceIds: [logSource, ...Object.values(evidenceOverrides).flatMap((item) => item.sourceIds.filter((id) => id !== logSource))].filter((id, index, all) => all.indexOf(id) === index),
      rule: processingRule,
      severity
    },
    lastReviewedAt: reviewedAt
  };
}

const newReviews = [
  review({
    ingredientId: "great_northern_white_beans",
    ingredientDisplayName: "Great Northern white beans",
    form: "raw dried Great Northern white beans, plain and unseasoned",
    nutritionNotes: "No nutrient claim is asserted in this provenance-only review. The review concerns the exact raw dried bean form and evidence gaps.",
    processingRule: "This evidence-only record does not approve raw dried Great Northern white beans for runtime use, stock inventory, a formula, a portion, a preparation method, or a complete ration. The exact species/form outcomes remain unresolved after documented first-pass and targeted second searches.",
  }),
  review({
    ingredientId: "cannellini_white_beans",
    ingredientDisplayName: "Cannellini white beans",
    form: "raw dried cannellini white beans, plain and unseasoned",
    nutritionNotes: "No nutrient claim is asserted in this provenance-only review. The review concerns the exact raw dried bean form and evidence gaps.",
    processingRule: "This evidence-only record does not approve raw dried cannellini white beans for runtime use, stock inventory, a formula, a portion, a preparation method, or a complete ration. The exact species/form outcomes remain unresolved after documented first-pass and targeted second searches.",
  }),
  review({
    ingredientId: "chamomile",
    ingredientDisplayName: "Chamomile",
    form: "plain dried culinary chamomile flower",
    nutritionNotes: "No nutrient claim is asserted in this provenance-only review. It distinguishes the ordinary dried culinary flower from tea, extracts, oils, and therapeutic preparations.",
    evidenceOverrides: {
      pigeon: {
        bird: "pigeon",
        outcome: "limited",
        sourceIds: ["el-ghamry-karosah-2020-pigeon-chamomile-flowers"],
        locator: "Study title and abstract: domestic pigeons (Columba livia domestica) and chamomile flowers assessed as feed additives",
        evidenceScope: "species_specific",
        rationale: "The direct pigeon study supports only a bounded controlled feed-additive context for chamomile flowers. It does not establish a household amount, a formula, therapeutic use, a complete ration, oil/extract equivalence, or another bird outcome.",
        reviewedAt
      },
      chicken: {
        bird: "chicken",
        outcome: "limited",
        sourceIds: ["al-kaisse-khalel-2011-broiler-chamomile-flowers"],
        locator: "Abstract and methods: 250 broilers received basal diets plus 0.25%, 0.50%, 0.75%, or 1% dried milled chamomile-flower powder for six weeks",
        evidenceScope: "species_specific",
        rationale: "The direct broiler study supports only its defined balanced-ration context using dried milled flower material. It does not establish an unrestricted household amount, a complete ration, therapeutic use, oil/extract equivalence, or another bird outcome.",
        reviewedAt
      }
    },
    processingRule: "Treat this review as ordinary dried culinary flower only. Tea, extracts, oils, tinctures, blends, medicinal dosing, salted or flavoured products, and mould-contaminated material remain distinct. This record does not approve runtime inventory use, a formula, a portion, or a complete ration.",
  }),
  review({
    ingredientId: "lavender",
    ingredientDisplayName: "Lavender",
    form: "plain dried culinary lavender flower",
    nutritionNotes: "No nutrient claim is asserted in this provenance-only review. It distinguishes the ordinary dried culinary flower from oils, diffusers, extracts, and aromatic products.",
    processingRule: "Essential oil, diffusers, spray, extracts, tinctures, blends, and scented/aromatic products remain distinct from this dried culinary-flower form. This evidence-only record does not approve runtime inventory use, a formula, a portion, or a complete ration; all exact outcomes remain unresolved.",
  }),
  review({
    ingredientId: "fennel",
    ingredientDisplayName: "Fennel",
    form: "plain dried culinary fennel seed",
    nutritionNotes: "No nutrient claim is asserted in this provenance-only review. It distinguishes the dry culinary seed from essential oil, extracts, tea, and other concentrated preparations.",
    evidenceOverrides: {
      chicken: {
        bird: "chicken",
        outcome: "limited",
        sourceIds: ["al-sagan-2020-broiler-fennel-seed-powder", "ghonime-2025-broiler-fennel-seed-meal"],
        locator: "Al-Sagan et al.: ground fennel seed powder at 0%, 1.6%, and 3.2% in Ross-308 broiler diets from day 19–41; Ghonime et al.: fennel seed meal at 5%, 10%, and 20% in formulated broiler diets",
        evidenceScope: "species_specific",
        rationale: "The direct chicken studies support only their defined formulated-ration contexts using ground seed powder or seed meal. They do not establish a household amount, unrestricted whole-seed use, a complete ration, medical use, essential-oil equivalence, or another bird outcome.",
        reviewedAt
      }
    },
    processingRule: "This record is limited to plain dried culinary fennel seed. Oil, extract, tea, and other concentrated preparations remain distinct. The chicken evidence is restricted to study-specific ground-seed/meal formulated diets and does not approve runtime inventory use, a formula, a portion, or a complete ration.",
  }),
  review({
    ingredientId: "ginger",
    ingredientDisplayName: "Ginger",
    form: "plain fresh culinary ginger root",
    nutritionNotes: "No nutrient claim is asserted in this provenance-only review. It distinguishes the fresh culinary root from powders, tea, extracts, oils, and therapeutic preparations.",
    processingRule: "This evidence-only record does not approve fresh ginger root for runtime use, stock inventory, a formula, a portion, medical dosing, or a complete ration. Powders, tea, extracts, oils, and other processed preparations remain distinct; all exact species/form outcomes remain unresolved after documented searches.",
  })
];

for (const record of newReviews) {
  const existingIndex = reviews.ingredientReviews.findIndex((item) => item.ingredientId === record.ingredientId && item.form === record.form);
  if (existingIndex >= 0) reviews.ingredientReviews.splice(existingIndex, 1, record);
  else reviews.ingredientReviews.push(record);
}

fs.writeFileSync(sourcesPath, `${JSON.stringify(sources, null, 2)}\n`);
fs.writeFileSync(reviewsPath, `${JSON.stringify(reviews, null, 2)}\n`);
console.log(`Added/updated ${newReviews.length} reviews and ${sourceRecords.length} source records.`);
