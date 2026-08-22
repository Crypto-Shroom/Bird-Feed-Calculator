import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sourcesPath = path.join(root, "provenance", "sources.json");
const reviewsPath = path.join(root, "provenance", "food-reviews.json");
const reviewedAt = "2026-08-22";

const sources = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));
const reviews = JSON.parse(fs.readFileSync(reviewsPath, "utf8"));

const sourceRecords = [
  {
    id: "issue-171-research-log-2026",
    title: "Issue #171 seven dry-grain evidence research log",
    authorsOrOrganization: "Bird Feed Calculator project research",
    publishedYear: "2026",
    sourceTier: "historical_project",
    urlOrDoi: "database/provenance/evidence/issue-171-research-log.md",
    speciesScopes: ["pigeon", "parrot", "african_grey", "budgie", "canary", "chicken"],
    permittedUse: "Documents independent first-pass and targeted second-pass searches for all 42 bird/form pairs, full-source verification, source-access limits, counter-review, and explicitly labelled related-species reasoning for Issue #171.",
    limitations: "The research log is an audit trail, not an external feeding study. It cannot silently approve an ingredient, establish a dose, formula, complete ration, medical claim, runtime approval, or a materially different preparation.",
    accessedAt: reviewedAt,
  },
  {
    id: "shultz-grau-zweigart-1953-pigeon-milo",
    title: "Studies in Pigeon Nutrition: Addition of Vitamin Supplements to Commercial Pigeon Ration Investigated for Effect on Squab Production",
    authorsOrOrganization: "Fred T. Shultz; C. R. Grau; Phyllis Zweigart; University of California",
    publishedYear: "1953",
    sourceTier: "primary",
    urlOrDoi: "https://californiaagriculture.org/article/114458-studies-in-pigeon-nutrition-addition-of-vitamin-supplements-to-commercial-pigeon-ration-investigated-for-effect-on-squab-production.pdf",
    speciesScopes: ["pigeon", "columbiformes"],
    permittedUse: "Direct whole-grain domestic-pigeon mixed-ration context that names kafir and milo among the basal ration ingredients.",
    limitations: "The historical White King pigeon production trial included multiple grains, grit, supplements, and molasses. It does not establish a household amount, complete ration, another species, a different sorghum preparation, or unrestricted use.",
    accessedAt: reviewedAt,
  },
  {
    id: "mchargue-roy-1931-pigeon-polished-rice",
    title: "The Effect of a Diet of Polished Rice on the Mineral Content of the Carcasses of Pigeons",
    authorsOrOrganization: "J. S. McHargue; W. R. Roy",
    publishedYear: "1931",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.1152/ajplegacy.1931.99.1.221",
    speciesScopes: ["pigeon", "columbiformes"],
    permittedUse: "Identifies a historical pigeon study of a polished-rice diet and establishes the exact polished/white-rice material distinction.",
    limitations: "The accessible record does not establish a balanced or safe companion-pigeon diet, an amount, a result for brown or paddy rice, a complete ration, or an outcome for another bird species.",
    accessedAt: reviewedAt,
  },
  {
    id: "darwati-2010-local-pigeon-brown-rice",
    title: "Productivity, Repeatability of Productive and Reproductive Traits of Local Pigeon",
    authorsOrOrganization: "S. Darwati; H. Martojo; C. Sumantri; D. T. H. Sihombing; A. Mardiastuti",
    publishedYear: "2010",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.14710/jitaa.35.4.268-274",
    speciesScopes: ["pigeon", "columba_livia"],
    permittedUse: "Direct local-pigeon feeding trial context for a ration comprising 50% corn, 30% commercial broiler-finisher feed, and 20% brown rice.",
    limitations: "The study is a defined adult local-pigeon production ration. It does not make 20% a visitor formula, establish stand-alone feeding, validate white rice, or establish a result for another bird species.",
    accessedAt: reviewedAt,
  },
  {
    id: "savas-2007-pigeon-triticale",
    title: "Effect of Beak Length on Feed Intake in Pigeons (Columba livia f. domestica)",
    authorsOrOrganization: "T. Savas; C. Konyali; G. Das; I. Y. Yurtman",
    publishedYear: "2007",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.1017/S0962728600030955",
    speciesScopes: ["pigeon", "columba_livia"],
    permittedUse: "Direct domestic-pigeon study context whose indexed diet description identifies triticale grain mixed with wheat grain.",
    limitations: "The study investigates beak length and feed intake, not nutritional adequacy, portion, complete-ration design, another species, or a different triticale form.",
    accessedAt: reviewedAt,
  },
  {
    id: "phoenix-landing-parrot-nutrition-2026",
    title: "Food and Nutrition for Parrots",
    authorsOrOrganization: "Phoenix Landing Foundation",
    publishedYear: "unknown",
    sourceTier: "owner_guidance_with_citations",
    urlOrDoi: "https://www.phoenixlanding.org/nutrition.html",
    speciesScopes: ["parrot", "psittacine", "companion_bird"],
    permittedUse: "Direct generic companion-parrot guidance that says grains can be fed dry and explicitly names brown rice, buckwheat/groats, spelt, and rye within a varied diet.",
    limitations: "Non-clinical welfare-organisation guidance. It does not provide a dose, formula, complete ration, African-Grey-specific result, medical claim, runtime approval, white-rice result, or evidence for a different grain form.",
    accessedAt: reviewedAt,
  },
  {
    id: "poultry-extension-rye-diets-2026",
    title: "Rye in Poultry Diets",
    authorsOrOrganization: "Jacquie Jacob, DVM, PhD; University of Kentucky / Poultry Extension",
    publishedYear: "unknown",
    sourceTier: "owner_guidance_with_citations",
    urlOrDoi: "https://poultry.extension.org/articles/feeds-and-feeding-of-poultry/feed-ingredients-for-poultry/cereals-in-poultry-diets/rye-in-poultry-diets/",
    speciesScopes: ["chicken", "poultry"],
    permittedUse: "Chicken guidance for rye grain in formulated diets, including the growing-bird exclusion, layer timing/inclusion boundary, arabinoxylan concern, and ergot contamination risk.",
    limitations: "Poultry guidance does not establish companion-bird suitability, a complete ration, a household amount, or use of contaminated rye.",
    accessedAt: reviewedAt,
  },
  {
    id: "poultry-extension-triticale-diets-2026",
    title: "Triticale in Poultry Diets",
    authorsOrOrganization: "Jacquie Jacob, DVM, PhD; University of Kentucky / Poultry Extension",
    publishedYear: "unknown",
    sourceTier: "owner_guidance_with_citations",
    urlOrDoi: "https://poultry.extension.org/articles/feeds-and-feeding-of-poultry/feed-ingredients-for-poultry/cereals-in-poultry-diets/triticale-in-poultry-diets-2/",
    speciesScopes: ["chicken", "poultry"],
    permittedUse: "Chicken/poultry feed context for triticale as a wheat-rye hybrid, including inclusion-level, enzyme, and non-starch-polysaccharide boundaries.",
    limitations: "Poultry feed guidance does not establish companion-bird suitability, a household amount, a complete ration, or use of a different grain form.",
    accessedAt: reviewedAt,
  },
  {
    id: "poultry-extension-spelt-diets-2026",
    title: "Spelt Wheat in Poultry Diets",
    authorsOrOrganization: "Jacquie Jacob, DVM, PhD; University of Kentucky / Poultry Extension",
    publishedYear: "unknown",
    sourceTier: "owner_guidance_with_citations",
    urlOrDoi: "https://poultry.extension.org/articles/feeds-and-feeding-of-poultry/feed-ingredients-for-poultry/cereals-in-poultry-diets/spelt-wheat-in-poultry-diets/",
    speciesScopes: ["chicken", "poultry"],
    permittedUse: "Chicken/poultry context for spelt grain, retained hulls, and the reported chick/poult growth and feed-efficiency boundary.",
    limitations: "Limited animal-feed evidence does not establish a companion-bird outcome, a household amount, a complete ration, or a different spelt preparation.",
    accessedAt: reviewedAt,
  },
  {
    id: "poultry-extension-buckwheat-diets-2026",
    title: "Buckwheat in Poultry Diets",
    authorsOrOrganization: "Jacquie Jacob, DVM, PhD; University of Kentucky / Poultry Extension",
    publishedYear: "unknown",
    sourceTier: "owner_guidance_with_citations",
    urlOrDoi: "https://poultry.extension.org/articles/feeds-and-feeding-of-poultry/feed-ingredients-for-poultry/cereals-in-poultry-diets/buckwheat-in-poultry-diets/",
    speciesScopes: ["chicken", "poultry"],
    permittedUse: "Chicken/poultry feed context for buckwheat, its protease-inhibitor/tannin boundary, high-inclusion feed-efficiency issue, and outdoor-poultry fagopyrin/UV boundary.",
    limitations: "The page does not treat buckwheat herb/green material as equivalent to hulled groats, and it does not establish a companion-bird outcome, a household amount, or a complete ration.",
    accessedAt: reviewedAt,
  },
  {
    id: "fernandes-2013-whole-sorghum-broilers",
    title: "The Use of Whole Grain Sorghum in Broiler Feeds",
    authorsOrOrganization: "Evandro Abreu Fernandes; Welder Jorge Santana Pereira; Leandro Hackenhaar; Ricardo Moreira Rodrigues; Raonilson Viana Terra",
    publishedYear: "2013",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.1590/S1516-635X2013000300008",
    speciesScopes: ["chicken", "broiler_chicken"],
    permittedUse: "Direct broiler study of ground, 50% whole, and 100% whole sorghum in nutritionally matched feeds, including the whole-grain age boundary.",
    limitations: "The study used formulated broiler feeds and ground pre-starter rations through day 8. It does not establish a household amount, a complete ration, another species, or a different sorghum product.",
    accessedAt: reviewedAt,
  },
  {
    id: "nanto-hara-2021-brown-rice-broilers",
    title: "Effects of Dietary Brown Rice on the Growth Performance, Systemic Oxidative Status, and Splenic Inflammatory Responses of Broiler Chickens under Chronic Heat Stress",
    authorsOrOrganization: "Fumika Nanto-Hara; Haruhiko Ohtsu; Makoto Yamazaki; Tatsuya Hirakawa; Kan Sato; Hitoshi Murakami",
    publishedYear: "2021",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.2141/jpsa.0200063",
    speciesScopes: ["chicken", "broiler_chicken"],
    permittedUse: "Direct Ross-308 broiler evidence for unpolished brown rice in a corn-replacement, soybean-meal, vitamin-and-mineral formulated diet under thermoneutral and heat-stress conditions.",
    limitations: "The defined complete study diet does not establish a household amount, a complete ration made from brown rice alone, another rice form, or another bird species outcome.",
    accessedAt: reviewedAt,
  },
  {
    id: "dilks-1975-feral-pigeon-broad-beans",
    title: "Diet of Feral Pigeons (Columba livia) in Hawke's Bay, New Zealand",
    authorsOrOrganization: "P. J. Dilks",
    publishedYear: "1975",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.1080/00288233.1975.10430391",
    speciesScopes: ["pigeon", "columbiformes", "feral_pigeon"],
    permittedUse: "Direct crop-content observation in free-ranging feral pigeons, including named field consumption of broad beans and ryecorn (Secale cereale).",
    limitations: "The observational study does not identify processing, establish safety, prescribe a companion-pigeon amount or formula, establish nutritional adequacy, or support another bird species.",
    accessedAt: reviewedAt,
  },
  {
    id: "ullrey-1991-psittacine-seed-mixtures",
    title: "Formulated Diets versus Seed Mixtures for Psittacines",
    authorsOrOrganization: "D. E. Ullrey; M. E. Allen; D. J. Baer",
    publishedYear: "1991",
    sourceTier: "peer_reviewed_review",
    urlOrDoi: "https://doi.org/10.1093/jn/121.suppl_11.S193",
    speciesScopes: ["parrot", "african_grey", "psittacine"],
    permittedUse: "Peer-reviewed psittacine nutrition review identifying buckwheat among common commercial seed-mixture ingredients and documenting seed-mixture nutritional limitations.",
    limitations: "The review does not establish an individual species portion, a complete ration, a medical result, a different buckwheat form, or an outcome for non-psittacines.",
    accessedAt: reviewedAt,
  },
  {
    id: "omlet-parakeet-food-list-2026",
    title: "Parakeet Food List",
    authorsOrOrganization: "Omlet",
    publishedYear: "2026",
    sourceTier: "owner_guidance_with_citations",
    urlOrDoi: "https://www.omlet.us/guide/parakeets/parakeet_food/food_list/",
    speciesScopes: ["budgie", "parakeet"],
    permittedUse: "Budgie/parakeet food-form guidance that explicitly names fresh, threshed/hulled rye and whole buckwheat among parakeet-friendly grains and distinguishes them from cooked or processed forms.",
    limitations: "Owner guidance rather than a controlled feeding study; it cannot approve a complete ration, establish a quantity, establish a result for another species, or make a different preparation equivalent.",
    accessedAt: reviewedAt,
  },
];

for (const record of sourceRecords) {
  const index = sources.sources.findIndex((source) => source.id === record.id);
  if (index >= 0) sources.sources.splice(index, 1, record);
  else sources.sources.push(record);
}

const birds = ["pigeon", "parrot", "african_grey", "budgie", "canary", "chicken"];
const logSource = "issue-171-research-log-2026";
const targetContexts = {
  pigeon: ["merck-columbiformes-2025", "Merck Veterinary Manual pigeon/dove nutrition context"],
  parrot: ["merck-psittacines-2025", "Merck Veterinary Manual psittacine nutrition context"],
  african_grey: ["vca-african-grey-feeding", "VCA African Grey pellet-led diet and seed-limit context"],
  budgie: ["vca-budgie-feeding", "VCA budgie pellet-led diet and seed-limit context"],
  canary: ["vca-canary-feeding", "VCA canary balanced-diet and seed-limit context"],
  chicken: ["merck-poultry-2024", "Merck poultry complete-ration and life-stage context"],
};

function limited({ bird, sourceIds, locator, evidenceScope = "species_specific", rationale, outcome = "allowed" }) {
  return { bird, outcome, sourceIds, locator, evidenceScope, rationale, reviewedAt };
}

function inferredLimited({ bird, form, evidenceSourceId, evidenceLocator, evidenceSummary, outcome = "allowed" }) {
  const [targetSourceId, targetContext] = targetContexts[bird];
  return limited({
    bird,
    sourceIds: [evidenceSourceId, targetSourceId, logSource],
    locator: `${evidenceLocator}; ${targetContext}; Issue #171 research log counter-review and documented targeted search`,
    evidenceScope: "related_species",
    rationale: `This is an explicitly labelled related-species inference for ${bird}, not direct ${bird}-specific research. ${evidenceSummary} The shared material is ${form}; the inference does not transfer a dose, formula, complete ration, therapeutic effect, runtime approval, or another preparation. ${targetContext} supplies the target-bird diet boundary, while direct evidence for this exact form in ${bird} remains unproven. The resulting outcome is ${outcome} for ordinary dietary use only, subject to the stated material and diet boundaries.`,
    outcome,
  });
}

function directLimited({ bird, form, sourceIds, locator, scope = "species_specific", evidenceSummary, outcome = "allowed" }) {
  return limited({
    bird,
    sourceIds: [...sourceIds, logSource],
    locator: `${locator}; Issue #171 full-source verification and counter-review`,
    evidenceScope: scope,
    rationale: `${evidenceSummary} This supports ${outcome} ordinary dietary use of ${form} only within the cited context and stated boundaries. It does not establish a dose, visitor formula, complete ration, medical use, runtime/inventory approval, another species, or a different preparation.`,
    outcome,
  });
}

const forms = {
  sorghum: "whole dry sorghum / milo grain, plain and unseasoned",
  whiteRice: "plain dry white rice grain, uncooked and unseasoned",
  brownRice: "plain dry brown rice grain, uncooked and unseasoned",
  rye: "whole dry rye grain, plain and unseasoned",
  triticale: "whole dry triticale grain, plain and unseasoned",
  spelt: "whole dry spelt grain, plain and unseasoned",
  buckwheat: "whole dry buckwheat groats/seed, plain and unseasoned",
};

function review({ ingredientId, ingredientDisplayName, form, overrides, processingRule }) {
  return {
    ingredientId,
    ingredientDisplayName,
    form,
    nutrition: {
      sourceIds: [logSource],
      basis: "not_asserted",
      notes: "Evidence-only provenance record. It does not add or revise a nutrient value, active ingredient catalogue entry, inventory item, formula, profile, runtime compatibility rule, or visitor-visible copy.",
    },
    speciesEvidence: birds.map((bird) => overrides[bird]),
    processing: {
      sourceIds: [...new Set([logSource, ...Object.values(overrides).flatMap((entry) => entry.sourceIds)])],
      rule: processingRule,
      severity: "warning",
    },
    lastReviewedAt: reviewedAt,
  };
}

const newReviews = [
  review({
    ingredientId: "sorghum_milo",
    ingredientDisplayName: "Sorghum / milo",
    form: forms.sorghum,
    overrides: {
      pigeon: directLimited({ bird: "pigeon", form: forms.sorghum, sourceIds: ["shultz-grau-zweigart-1953-pigeon-milo"], locator: "Shultz, Grau and Zweigart: basal whole-grain ration lists 30% kafir and milo", evidenceSummary: "A direct domestic-pigeon production study used kafir and milo in a multi-grain ration with grit and supplements." }),
      parrot: inferredLimited({ bird: "parrot", form: forms.sorghum, evidenceSourceId: "shultz-grau-zweigart-1953-pigeon-milo", evidenceLocator: "Shultz, Grau and Zweigart: whole-grain pigeon basal ration lists kafir and milo", evidenceSummary: "The direct source establishes whole milo exposure in pigeons, with no adverse ingredient-specific finding reported in that mixed-ration context." }),
      african_grey: inferredLimited({ bird: "african_grey", form: forms.sorghum, evidenceSourceId: "shultz-grau-zweigart-1953-pigeon-milo", evidenceLocator: "Shultz, Grau and Zweigart: whole-grain pigeon basal ration lists kafir and milo", evidenceSummary: "The direct source establishes whole milo exposure in pigeons, with no African-Grey trial, quantity, or complete-diet evidence." }),
      budgie: inferredLimited({ bird: "budgie", form: forms.sorghum, evidenceSourceId: "shultz-grau-zweigart-1953-pigeon-milo", evidenceLocator: "Shultz, Grau and Zweigart: whole-grain pigeon basal ration lists kafir and milo", evidenceSummary: "The direct source establishes whole milo exposure in pigeons; the target context confirms a seed-eating budgie diet structure but not sorghum-specific captive use." }),
      canary: inferredLimited({ bird: "canary", form: forms.sorghum, evidenceSourceId: "shultz-grau-zweigart-1953-pigeon-milo", evidenceLocator: "Shultz, Grau and Zweigart: whole-grain pigeon basal ration lists kafir and milo", evidenceSummary: "The direct source establishes whole milo exposure in pigeons; the canary source supplies only balanced-diet/seed context, not a sorghum-specific trial." }),
      chicken: directLimited({ bird: "chicken", form: forms.sorghum, sourceIds: ["fernandes-2013-whole-sorghum-broilers", "merck-poultry-2024"], locator: "Fernandes et al.: whole-sorghum treatments and conclusion; Merck poultry complete-ration context", evidenceSummary: "A 2,400-bird broiler trial tested 50% and 100% whole sorghum after a ground-grain pre-starter phase and found no performance detriment in its formulated-feed context." }),
    },
    processingRule: "Keep whole dry sorghum/milo distinct from flour, syrup, cooked, soaked, sprouted, fermented, flavoured, salted, and mould-contaminated products. Study-based rows remain part-of-varied/balanced-diet evidence only; this record does not approve an amount, formula, complete ration, or runtime use.",
  }),
  review({
    ingredientId: "white_rice",
    ingredientDisplayName: "White rice",
    form: forms.whiteRice,
    overrides: {
      pigeon: directLimited({ bird: "pigeon", form: forms.whiteRice, sourceIds: ["mchargue-roy-1931-pigeon-polished-rice"], locator: "McHargue and Roy: title and article record identify a pigeon polished-rice diet", evidenceSummary: "The historical pigeon experiment identifies polished rice, which matches white-rice processing but was an exclusive-diet mineral-content study rather than a balanced-ration trial." }),
      parrot: inferredLimited({ bird: "parrot", form: forms.whiteRice, evidenceSourceId: "mchargue-roy-1931-pigeon-polished-rice", evidenceLocator: "McHargue and Roy: pigeon polished-rice diet", evidenceSummary: "The direct source establishes the exact polished-rice material in pigeons, but its exclusive-diet design supplies no parrot amount or nutritional-adequacy evidence." }),
      african_grey: inferredLimited({ bird: "african_grey", form: forms.whiteRice, evidenceSourceId: "mchargue-roy-1931-pigeon-polished-rice", evidenceLocator: "McHargue and Roy: pigeon polished-rice diet", evidenceSummary: "The direct source establishes the exact polished-rice material in pigeons; the African-Grey source requires a pellet-led, balanced diet and does not directly name white rice." }),
      budgie: inferredLimited({ bird: "budgie", form: forms.whiteRice, evidenceSourceId: "mchargue-roy-1931-pigeon-polished-rice", evidenceLocator: "McHargue and Roy: pigeon polished-rice diet", evidenceSummary: "The direct source establishes the exact polished-rice material in pigeons; no budgie white-rice study or amount was located after two searches." }),
      canary: inferredLimited({ bird: "canary", form: forms.whiteRice, evidenceSourceId: "mchargue-roy-1931-pigeon-polished-rice", evidenceLocator: "McHargue and Roy: pigeon polished-rice diet", evidenceSummary: "The direct source establishes the exact polished-rice material in pigeons; no canary white-rice study or amount was located after two searches." }),
      chicken: inferredLimited({ bird: "chicken", form: forms.whiteRice, evidenceSourceId: "mchargue-roy-1931-pigeon-polished-rice", evidenceLocator: "McHargue and Roy: pigeon polished-rice diet", evidenceSummary: "The direct source establishes polished-rice material in pigeons. The separately inspected paddy-rice study is expressly excluded because paddy, brown, and polished white rice are materially distinct." }),
    },
    processingRule: "This record is confined to intact plain dry polished white rice. Do not substitute brown rice, paddy/rough rice, rice bran, rice meal, crushed rice, flour, cooked rice, puffed rice, seasoned rice, fermented products, or mould-contaminated material. The historical pigeon study must not be treated as nutritional-completeness evidence or as a complete ration instruction.",
  }),
  review({
    ingredientId: "brown_rice",
    ingredientDisplayName: "Brown rice",
    form: forms.brownRice,
    overrides: {
      pigeon: directLimited({ bird: "pigeon", form: forms.brownRice, sourceIds: ["darwati-2010-local-pigeon-brown-rice"], locator: "Darwati et al.: JKM ration is 50% corn, 30% commercial feed, and 20% brown rice", evidenceSummary: "A 15-pair local-pigeon study tested brown rice within a defined corn/commercial-feed mixed ration." }),
      parrot: directLimited({ bird: "parrot", form: forms.brownRice, sourceIds: ["phoenix-landing-parrot-nutrition-2026", "merck-psittacines-2025"], locator: "Phoenix Landing 'Grains' section lists brown rice and states grains can be fed dry; Merck psittacine nutrition context", scope: "group_specific", evidenceSummary: "Generic companion-parrot guidance explicitly names dry-capable brown rice in a varied diet and is constrained by psittacine seed-diet limitations." }),
      african_grey: directLimited({ bird: "african_grey", form: forms.brownRice, sourceIds: ["vca-african-grey-feeding"], locator: "VCA African Grey suggested food-items table lists brown rice; Seeds and Pelleted Diets sections", evidenceSummary: "Species-specific exotics-vet guidance lists brown rice within a pellet-led diet and warns against predominantly seed-based feeding." }),
      budgie: directLimited({ bird: "budgie", form: forms.brownRice, sourceIds: ["vca-budgie-feeding"], locator: "VCA Budgies suitable fruits-and-vegetables table lists rice (brown); Pelleted Diets and Seeds sections", evidenceSummary: "Species-specific exotics-vet guidance lists brown rice while requiring a pellet-led varied diet and rejecting seed-only feeding." }),
      canary: inferredLimited({ bird: "canary", form: forms.brownRice, evidenceSourceId: "darwati-2010-local-pigeon-brown-rice", evidenceLocator: "Darwati et al.: controlled pigeon JKM mixed ration includes brown rice", evidenceSummary: "The direct pigeon trial establishes plain brown rice in a mixed ration; the target canary guidance gives the balanced-diet boundary but does not directly name dry brown rice." }),
      chicken: directLimited({ bird: "chicken", form: forms.brownRice, sourceIds: ["nanto-hara-2021-brown-rice-broilers", "merck-poultry-2024"], locator: "Nanto-Hara et al.: brown-rice diet composition and broiler outcomes; Merck poultry complete-ration context", evidenceSummary: "A controlled Ross-308 study tested unpolished brown rice in a soybean-meal, vitamin-and-mineral complete diet under thermoneutral and heat-stress conditions." }),
    },
    processingRule: "Keep plain dry unpolished brown rice distinct from polished white rice, paddy/rough rice, rice bran, flour, cooked rice, puffed rice, seasoned rice, fermented products, and rancid or mould-contaminated material. Evidence is bounded to varied or formulated diets, never a stand-alone ration or runtime instruction.",
  }),
  review({
    ingredientId: "rye",
    ingredientDisplayName: "Rye",
    form: forms.rye,
    overrides: {
      pigeon: directLimited({ bird: "pigeon", form: forms.rye, sourceIds: ["dilks-1975-feral-pigeon-broad-beans"], locator: "Dilks: crop-content table and rye/ryecorn discussion identify Secale cereale consumption", evidenceSummary: "Year-round crop-content observation documents feral Columba livia consuming ryecorn from newly sown crops." }),
      parrot: directLimited({ bird: "parrot", form: forms.rye, sourceIds: ["phoenix-landing-parrot-nutrition-2026", "merck-psittacines-2025"], locator: "Phoenix Landing 'Grains' and soaking sections list rye and state grains can be fed dry; Merck psittacine nutrition context", scope: "group_specific", evidenceSummary: "Generic companion-parrot guidance explicitly names rye in its dry-capable grain guidance and places it within a varied diet." }),
      african_grey: inferredLimited({ bird: "african_grey", form: forms.rye, evidenceSourceId: "phoenix-landing-parrot-nutrition-2026", evidenceLocator: "Phoenix Landing 'Grains' section lists rye and says grains can be fed dry", evidenceSummary: "The direct generic-parrot source names the same dry rye form, while African-Grey-specific guidance requires a pellet-led balanced diet and provides no rye-specific trial." }),
      budgie: directLimited({ bird: "budgie", form: forms.rye, sourceIds: ["omlet-parakeet-food-list-2026", "vca-budgie-feeding"], locator: "Omlet 'Parakeet Grains' and 'Parakeet-Friendly Grains' sections name fresh threshed/hulled rye; VCA budgie nutrition context", evidenceSummary: "Budgie/parakeet guidance names rye as a fresh threshed/hulled grain and distinguishes it from cooked or processed forms; veterinary context retains the mixed/pellet-led boundary." }),
      canary: inferredLimited({ bird: "canary", form: forms.rye, evidenceSourceId: "dilks-1975-feral-pigeon-broad-beans", evidenceLocator: "Dilks: field consumption of Secale cereale ryecorn by feral Columba livia", evidenceSummary: "The direct pigeon observation establishes clean rye grain consumption; canary guidance supplies balanced-diet/seed context but no rye-specific trial, and poultry arabinoxylan findings are not transferred." }),
      chicken: directLimited({ bird: "chicken", form: forms.rye, sourceIds: ["poultry-extension-rye-diets-2026", "merck-poultry-2024"], locator: "University of Kentucky 'Including Rye in Poultry Diets' section; Merck poultry complete-ration context", evidenceSummary: "Chicken guidance excludes rye for growing birds, permits it for layers only after peak production and below 40% of diet, and requires clean grain because ergot may be highly toxic.", outcome: "limited" }),
    },
    processingRule: "Keep clean whole dry rye distinct from sprouted, fermented, milled/flour, cooked, flavoured, salted, and mould- or ergot-contaminated products. The chicken row has life-stage and inclusion boundaries; no row establishes an unrestricted or complete-ration use.",
  }),
  review({
    ingredientId: "triticale",
    ingredientDisplayName: "Triticale",
    form: forms.triticale,
    overrides: {
      pigeon: directLimited({ bird: "pigeon", form: forms.triticale, sourceIds: ["savas-2007-pigeon-triticale"], locator: "Savas et al. indexed diet-composition description: wheat and triticale grain mixed on a fresh-weight basis", evidenceSummary: "A domestic-pigeon study used triticale grain with wheat while investigating feeding behaviour and beak-length welfare, not diet adequacy." }),
      parrot: inferredLimited({ bird: "parrot", form: forms.triticale, evidenceSourceId: "savas-2007-pigeon-triticale", evidenceLocator: "Savas et al. indexed diet-composition description: wheat and triticale grain", evidenceSummary: "The direct pigeon study establishes the same dry hybrid grain in an observed diet but does not supply generic-parrot triticale research or a quantity." }),
      african_grey: inferredLimited({ bird: "african_grey", form: forms.triticale, evidenceSourceId: "savas-2007-pigeon-triticale", evidenceLocator: "Savas et al. indexed diet-composition description: wheat and triticale grain", evidenceSummary: "The direct pigeon study establishes the same dry hybrid grain; African-Grey guidance supplies only the target balanced-diet boundary, not a triticale trial." }),
      budgie: inferredLimited({ bird: "budgie", form: forms.triticale, evidenceSourceId: "savas-2007-pigeon-triticale", evidenceLocator: "Savas et al. indexed diet-composition description: wheat and triticale grain", evidenceSummary: "The direct pigeon study establishes the same dry hybrid grain; no budgie triticale trial, constituent threshold, or amount was located after two searches." }),
      canary: inferredLimited({ bird: "canary", form: forms.triticale, evidenceSourceId: "savas-2007-pigeon-triticale", evidenceLocator: "Savas et al. indexed diet-composition description: wheat and triticale grain", evidenceSummary: "The direct pigeon study establishes the same dry hybrid grain; canary guidance supplies balanced-diet context, not a triticale trial or amount." }),
      chicken: directLimited({ bird: "chicken", form: forms.triticale, sourceIds: ["poultry-extension-triticale-diets-2026", "merck-poultry-2024"], locator: "University of Kentucky 'Triticale in Poultry Diets' inclusion/enzyme discussion; Merck poultry complete-ration context", evidenceSummary: "Chicken guidance describes triticale as a wheat-rye hybrid and gives inclusion-level, non-starch-polysaccharide, and enzyme boundaries in formulated poultry diets." }),
    },
    processingRule: "Keep whole dry triticale distinct from wheat, rye, flour, cooked, soaked, sprouted, fermented, flavoured, salted, and mould-contaminated products. Do not presume that results for either parent grain are results for triticale, and do not treat it alone as a complete ration.",
  }),
  review({
    ingredientId: "spelt",
    ingredientDisplayName: "Spelt",
    form: forms.spelt,
    overrides: {
      pigeon: inferredLimited({ bird: "pigeon", form: forms.spelt, evidenceSourceId: "poultry-extension-spelt-diets-2026", evidenceLocator: "University of Kentucky 'Spelt Wheat in Poultry Diets' grain and hull/feed-efficiency discussion", evidenceSummary: "The direct chicken/poult guidance establishes spelt grain in animal-feed context and retains a hull/feed-efficiency boundary; no pigeon spelt study survived source verification." }),
      parrot: directLimited({ bird: "parrot", form: forms.spelt, sourceIds: ["phoenix-landing-parrot-nutrition-2026", "merck-psittacines-2025"], locator: "Phoenix Landing 'Grains' and soaking sections list spelt and state grains can be fed dry; Merck psittacine nutrition context", scope: "group_specific", evidenceSummary: "Generic companion-parrot guidance explicitly names spelt in dry-capable grain guidance and limits it to a varied diet." }),
      african_grey: inferredLimited({ bird: "african_grey", form: forms.spelt, evidenceSourceId: "phoenix-landing-parrot-nutrition-2026", evidenceLocator: "Phoenix Landing 'Grains' section lists spelt and states grains can be fed dry", evidenceSummary: "The direct generic-parrot source identifies the same spelt form; the African-Grey source supplies a pellet-led dietary boundary but no spelt-specific trial." }),
      budgie: inferredLimited({ bird: "budgie", form: forms.spelt, evidenceSourceId: "phoenix-landing-parrot-nutrition-2026", evidenceLocator: "Phoenix Landing 'Grains' section lists spelt and states grains can be fed dry", evidenceSummary: "The direct generic-parrot source identifies the same dry spelt form; no budgie spelt study was recovered after the replacement search." }),
      canary: inferredLimited({ bird: "canary", form: forms.spelt, evidenceSourceId: "poultry-extension-spelt-diets-2026", evidenceLocator: "University of Kentucky 'Spelt Wheat in Poultry Diets' grain/hull and chick/poult context", evidenceSummary: "The direct poultry source identifies spelt grain and its retained-hull/feed-efficiency boundary; the archived canary source is sprouted-only and is not substituted for this dry record." }),
      chicken: directLimited({ bird: "chicken", form: forms.spelt, sourceIds: ["poultry-extension-spelt-diets-2026", "merck-poultry-2024"], locator: "University of Kentucky 'Spelt Wheat in Poultry Diets' grain, hull, chick/poult and feed-efficiency discussion; Merck poultry context", evidenceSummary: "Chicken/poult guidance identifies spelt grain and reports no significant growth difference in early studies but reduced feed efficiency, with hull and formulation boundaries." }),
    },
    processingRule: "Keep whole dry spelt grain distinct from wheat, flour, cooked, soaked, sprouted, fermented, flavoured, salted, and mould-contaminated products. The canary sprouted-mix lead does not establish dry spelt. Every row remains a bounded varied/formulated-diet outcome only.",
  }),
  review({
    ingredientId: "buckwheat",
    ingredientDisplayName: "Buckwheat",
    form: forms.buckwheat,
    overrides: {
      pigeon: inferredLimited({ bird: "pigeon", form: forms.buckwheat, evidenceSourceId: "poultry-extension-buckwheat-diets-2026", evidenceLocator: "University of Kentucky 'Buckwheat in Poultry Diets' feed-ingredient, antinutrient, and outdoor-poultry discussion", evidenceSummary: "The direct chicken source establishes buckwheat as a formulated-feed ingredient with explicit high-inclusion and outdoor UV/fagopyrin limits; no inspectable pigeon groat study was recovered." }),
      parrot: directLimited({ bird: "parrot", form: forms.buckwheat, sourceIds: ["ullrey-1991-psittacine-seed-mixtures", "merck-psittacines-2025"], locator: "Ullrey et al. abstract identifies buckwheat among common commercial psittacine seed-mixture ingredients; Merck psittacine nutrition context", scope: "group_specific", evidenceSummary: "A peer-reviewed psittacine review names buckwheat in commercial seed mixtures while documenting their nutritional inadequacy; the evidence therefore supports ordinary use only within a varied diet, not as a complete ration." }),
      african_grey: inferredLimited({ bird: "african_grey", form: forms.buckwheat, evidenceSourceId: "ullrey-1991-psittacine-seed-mixtures", evidenceLocator: "Ullrey et al. abstract identifies buckwheat in common commercial psittacine seed mixtures", evidenceSummary: "The direct psittacine source identifies buckwheat, but not an African-Grey-specific dose or trial; the African-Grey source supplies the pellet-led balanced-diet limit." }),
      budgie: directLimited({ bird: "budgie", form: forms.buckwheat, sourceIds: ["omlet-parakeet-food-list-2026", "vca-budgie-feeding"], locator: "Omlet 'Parakeet Grains' and 'Parakeet-Friendly Grains' sections name whole buckwheat; VCA budgie nutrition context", evidenceSummary: "Budgie/parakeet guidance explicitly names whole buckwheat while veterinary guidance retains the pellet-led and seed-only-diet limits." }),
      canary: inferredLimited({ bird: "canary", form: forms.buckwheat, evidenceSourceId: "poultry-extension-buckwheat-diets-2026", evidenceLocator: "University of Kentucky 'Buckwheat in Poultry Diets' feed-ingredient and fagopyrin/outdoor boundary", evidenceSummary: "The direct poultry source identifies buckwheat and its relevant constituent/husbandry limits; the archived canary source covers only a sprouted mix and is not treated as dry-form proof." }),
      chicken: directLimited({ bird: "chicken", form: forms.buckwheat, sourceIds: ["poultry-extension-buckwheat-diets-2026", "merck-poultry-2024"], locator: "University of Kentucky 'Buckwheat in Poultry Diets' use-in-poultry-diets section; Merck poultry complete-ration context", evidenceSummary: "Chicken guidance identifies buckwheat feed-use context, protease inhibitors/tannins, reduced feed efficiency at high inclusion, and a maximum 30% outdoor-poultry boundary because of fagopyrin/UV sensitivity.", outcome: "limited" }),
    },
    processingRule: "This record is for plain whole dry buckwheat groats/seed only. Do not equate it with buckwheat leaves, flowers, sprouts, flour, cooked groats, flavoured/salted products, or mould-contaminated material. The record preserves the separate outdoor-poultry fagopyrin boundary and never approves a complete ration or runtime use.",
  }),
];

for (const record of newReviews) {
  const index = reviews.ingredientReviews.findIndex((item) => item.ingredientId === record.ingredientId && item.form === record.form);
  if (index >= 0) reviews.ingredientReviews.splice(index, 1, record);
  else reviews.ingredientReviews.push(record);
}

fs.writeFileSync(sourcesPath, `${JSON.stringify(sources, null, 2)}\n`);
fs.writeFileSync(reviewsPath, `${JSON.stringify(reviews, null, 2)}\n`);
console.log(`Added or updated ${newReviews.length} Issue #171 food reviews and ${sourceRecords.length} source records.`);
