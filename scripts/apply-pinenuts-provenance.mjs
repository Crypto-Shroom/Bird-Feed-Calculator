import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const provenance = resolve(root, "database/provenance");
const date = "2026-10-09";

function load(name) {
  return JSON.parse(readFileSync(resolve(provenance, name), "utf8"));
}

function save(name, value) {
  writeFileSync(resolve(provenance, name), `${JSON.stringify(value, null, 2)}\n`);
}

const sources = load("sources.json");
const foodReviews = load("food-reviews.json");

const newSources = [
  {
    id: "theparrotclub-pinenut-warning-2015",
    title: "Word Of Warning On Pinenuts",
    authorsOrOrganization: "CaptainHowdy; The Parrot Club",
    publishedYear: "2015",
    sourceTier: "owner_guidance_with_citations",
    urlOrDoi: "https://theparrotclub.co.uk/community/index.php?threads/word-of-warning-on-pinenuts.15095/",
    speciesScopes: [
      "parrot",
      "psittacine"
    ],
    permittedUse: "Avicultural community guidance documenting mechanical lower-mandible shell wedging/entrapment hazard in parrots and Aspergillus fungal risk from in-shell pine nuts.",
    limitations: "Community discussion forum; does not establish controlled feeding trials, nutrient composition, or universal serving sizes.",
    accessedAt: date
  }
];

for (const record of newSources) {
  if (!sources.sources.some((source) => source.id === record.id)) {
    sources.sources.push(record);
  }
}

const newReviews = [
  {
    ingredientId: "pine_nuts",
    ingredientDisplayName: "Pine nuts",
    form: "plain shelled pine nut kernel, raw or dry-roasted, unsalted and unflavoured",
    lastReviewedAt: date,
    nutrition: {
      sourceIds: [
        "aav-feeding-birds-2021",
        "lafeber-nuts-for-birds-2021"
      ],
      basis: "not_applicable",
      notes: "Evidence-only review of plain shelled pine nut kernels. It does not add nutrient values or change active calculator data."
    },
    processing: {
      sourceIds: [
        "petco-pigeon-cashew-2019",
        "aav-feeding-birds-2021"
      ],
      rule: "Review plain shelled pine nut kernels only. Chop to small-seed size for pigeons because pigeons swallow seeds whole without mastication. Exclude salted, seasoned, oil-roasted, moldy, or rancid products.",
      severity: "warning"
    },
    speciesEvidence: [
      {
        bird: "pigeon",
        outcome: "limited",
        sourceIds: [
          "petco-pigeon-cashew-2019",
          "vca-pigeon-dove-feeding"
        ],
        locator: "Petco DVM pigeon mechanical size guidance; VCA pigeon/dove feeding guidance",
        evidenceScope: "species_specific",
        rationale: "Pigeons swallow seeds whole without chewing. Plain shelled pine nut kernels must be chopped to small-seed size to prevent esophageal or crop obstruction, and offered only as occasional treats.",
        reviewedAt: date,
        firstPassSearch: {
          queries: [
            "pigeon pine nut kernel feeding veterinarian"
          ],
          sourceIds: [
            "vca-pigeon-dove-feeding"
          ],
          result: "General pigeon produce/seed guidance found."
        },
        followUpSearch: {
          queries: [
            "pigeon pine nuts chopped small seed size petco Cecil",
            "pigeon shelled pine nuts treat"
          ],
          sourceIds: [
            "petco-pigeon-cashew-2019",
            "vca-pigeon-dove-feeding"
          ],
          result: "Petco DVM guidance supports small-seed-size preparation for nut meats; limited treat use."
        }
      },
      {
        bird: "parrot",
        outcome: "limited",
        sourceIds: [
          "lafeber-nuts-for-birds-2021",
          "lafeber-nut-meats-2026",
          "aav-feeding-birds-2021"
        ],
        locator: "AAV Seeds and Nuts section; Lafeber nut-meats guidance on unsalted raw or dry-roasted nuts",
        evidenceScope: "group_specific",
        rationale: "Avian veterinary guidance permits plain raw or dry-roasted unsalted nut kernels in small quantities as foraging or training treats within a predominantly pelleted diet.",
        reviewedAt: date,
        firstPassSearch: {
          queries: [
            "parrot pine nut kernel feeding veterinarian"
          ],
          sourceIds: [
            "aav-feeding-birds-2021"
          ],
          result: "Broad companion-parrot nut moderation guidance."
        },
        followUpSearch: {
          queries: [
            "parrot pine nuts Lafeber treat moderation",
            "psittacine shelled pine nuts"
          ],
          sourceIds: [
            "lafeber-nuts-for-birds-2021",
            "lafeber-nut-meats-2026"
          ],
          result: "Veterinary owner guidance supports unsalted nut kernels in small amounts."
        }
      },
      {
        bird: "african_grey",
        outcome: "limited",
        sourceIds: [
          "vca-african-grey-feeding",
          "lafeber-nuts-for-birds-2021"
        ],
        locator: "VCA African Grey feeding guidance on tree nut moderation",
        evidenceScope: "species_specific",
        rationale: "African Grey veterinary guidance supports offering a couple of tree nuts occasionally within a balanced pellet-led diet, keeping high-fat nut treats strictly limited.",
        reviewedAt: date,
        firstPassSearch: {
          queries: [
            "African Grey pine nut kernel feeding veterinary"
          ],
          sourceIds: [
            "vca-african-grey-feeding"
          ],
          result: "VCA guidance lists tree nuts in moderation."
        },
        followUpSearch: {
          queries: [
            "African Grey tree nuts VCA feeding",
            "Psittacus erithacus pine nut kernels"
          ],
          sourceIds: [
            "vca-african-grey-feeding",
            "lafeber-nuts-for-birds-2021"
          ],
          result: "African Grey guidance confirms limited high-fat nut treat use."
        }
      },
      {
        bird: "budgie",
        outcome: "unresolved",
        sourceIds: [
          "vca-budgie-feeding",
          "vca-small-psittacine-nutrition-1998"
        ],
        locator: "VCA Budgie feeding guidance; Clinical Nutrition of Small Psittacines",
        evidenceScope: "species_specific",
        rationale: "Small-psittacine clinical guidance cautions against high-fat nuts and single-seed diets. No direct budgie-specific shelled pine nut kernel trial was established.",
        reviewedAt: date,
        firstPassSearch: {
          queries: [
            "budgie pine nut kernel feeding veterinary"
          ],
          sourceIds: [
            "vca-budgie-feeding"
          ],
          result: "General budgie diet cautions found."
        },
        followUpSearch: {
          queries: [
            "budgie shelled pine nut small treat VCA",
            "Melopsittacus undulatus pine nut"
          ],
          sourceIds: [
            "vca-budgie-feeding",
            "vca-small-psittacine-nutrition-1998"
          ],
          result: "No direct budgie shelled pine nut evidence found; remains unresolved."
        }
      },
      {
        bird: "canary",
        outcome: "unresolved",
        sourceIds: [
          "vca-canary-feeding",
          "finchinfo-nutrition"
        ],
        locator: "VCA Canary feeding guidance; Finch Information Center",
        evidenceScope: "species_specific",
        rationale: "Canary guidance cautions against high-fat oilseeds and non-staple foods. No direct canary-specific shelled pine nut kernel trial was established.",
        reviewedAt: date,
        firstPassSearch: {
          queries: [
            "canary pine nut kernel feeding veterinary"
          ],
          sourceIds: [
            "vca-canary-feeding"
          ],
          result: "General canary diet cautions found."
        },
        followUpSearch: {
          queries: [
            "canary finely chopped pine nut treat",
            "Serinus canaria pine nut"
          ],
          sourceIds: [
            "vca-canary-feeding",
            "finchinfo-nutrition"
          ],
          result: "No direct canary shelled pine nut evidence found; remains unresolved."
        }
      },
      {
        bird: "chicken",
        outcome: "unresolved",
        sourceIds: [
          "merck-poultry-2024",
          "poultry-extension-scratch-2026"
        ],
        locator: "Merck Poultry requirements; Poultry Extension scratch grain guidance",
        evidenceScope: "species_specific",
        rationale: "Poultry guidance requires complete feeds as the diet base. No direct chicken-specific shelled pine nut kernel feeding trial was established.",
        reviewedAt: date,
        firstPassSearch: {
          queries: [
            "chicken pine nut kernel feeding poultry"
          ],
          sourceIds: [
            "merck-poultry-2024"
          ],
          result: "Complete feed requirements found."
        },
        followUpSearch: {
          queries: [
            "chickens shelled pine nuts treat extension",
            "Gallus gallus pine nut feed"
          ],
          sourceIds: [
            "merck-poultry-2024",
            "poultry-extension-scratch-2026"
          ],
          result: "No direct chicken shelled pine nut feeding study found; remains unresolved."
        }
      }
    ]
  },
  {
    ingredientId: "pine_nuts",
    ingredientDisplayName: "Pine nuts",
    form: "whole in-shell pine nuts, raw or dry, plain and unseasoned",
    lastReviewedAt: date,
    nutrition: {
      sourceIds: [
        "theparrotclub-pinenut-warning-2015",
        "aav-feeding-birds-2021"
      ],
      basis: "not_applicable",
      notes: "Evidence-only review of whole in-shell pine nuts. It does not add nutrient values or change active calculator data."
    },
    processing: {
      sourceIds: [
        "theparrotclub-pinenut-warning-2015",
        "petco-pigeon-cashew-2019"
      ],
      rule: "Avoid for pigeons, budgies, canaries, and chickens due to mechanical wedging, choking, or crop obstruction hazards. For medium/large parrots, offer only supervised in-shell nuts as foraging enrichment, and inspect for mold/spore contamination or lower-mandible shell entrapment.",
      severity: "warning"
    },
    speciesEvidence: [
      {
        bird: "pigeon",
        outcome: "avoid",
        sourceIds: [
          "petco-pigeon-cashew-2019",
          "vca-pigeon-dove-feeding",
          "theparrotclub-pinenut-warning-2015"
        ],
        locator: "Petco DVM pigeon mechanical size guidance; VCA pigeon/dove feeding guidance",
        evidenceScope: "species_specific",
        rationale: "Pigeons swallow seeds whole and cannot crack hard pine nut shells. Whole in-shell pine nuts present a severe crop and esophageal obstruction hazard and must be avoided.",
        reviewedAt: date,
        firstPassSearch: {
          queries: [
            "pigeon in-shell pine nut feeding"
          ],
          sourceIds: [
            "vca-pigeon-dove-feeding"
          ],
          result: "Mechanical size limits found."
        },
        followUpSearch: {
          queries: [
            "pigeon whole pine nut crop obstruction",
            "pigeon in shell nut danger"
          ],
          sourceIds: [
            "petco-pigeon-cashew-2019",
            "theparrotclub-pinenut-warning-2015"
          ],
          result: "Pigeons cannot chew or crack hard shells; avoid whole in-shell form."
        }
      },
      {
        bird: "parrot",
        outcome: "limited",
        sourceIds: [
          "theparrotclub-pinenut-warning-2015",
          "lafeber-nuts-for-birds-2021",
          "aav-feeding-birds-2021"
        ],
        locator: "The Parrot Club thread 'Word Of Warning On Pinenuts'; AAV Seeds and Nuts section",
        evidenceScope: "group_specific",
        rationale: "Medium/large parrots can crack in-shell nuts for foraging enrichment, but avicultural community and veterinary guidance documents a lower-mandible shell entrapment/wedging hazard and fungal mold risk. Offered only as a supervised, limited treat.",
        reviewedAt: date,
        firstPassSearch: {
          queries: [
            "parrot in-shell pine nut warning"
          ],
          sourceIds: [
            "theparrotclub-pinenut-warning-2015"
          ],
          result: "Documented beak entrapment hazard thread."
        },
        followUpSearch: {
          queries: [
            "theparrotclub word of warning on pinenuts",
            "parrot in shell pine nut hazard"
          ],
          sourceIds: [
            "theparrotclub-pinenut-warning-2015",
            "lafeber-nuts-for-birds-2021"
          ],
          result: "Lower-mandible shell wedging hazard verified; limited supervised treat only."
        }
      },
      {
        bird: "african_grey",
        outcome: "limited",
        sourceIds: [
          "theparrotclub-pinenut-warning-2015",
          "vca-african-grey-feeding"
        ],
        locator: "The Parrot Club thread 'Word Of Warning On Pinenuts'; VCA African Grey feeding guidance",
        evidenceScope: "species_specific",
        rationale: "African Greys can crack pine nuts in shell, but are subject to lower-mandible shell entrapment hazards, Aspergillus risks from improper storage, and high-fat moderation boundaries.",
        reviewedAt: date,
        firstPassSearch: {
          queries: [
            "African Grey in-shell pine nut feeding"
          ],
          sourceIds: [
            "vca-african-grey-feeding"
          ],
          result: "VCA tree nut moderation context."
        },
        followUpSearch: {
          queries: [
            "African Grey pine nut shell wedging",
            "Psittacus erithacus in-shell pine nuts"
          ],
          sourceIds: [
            "theparrotclub-pinenut-warning-2015",
            "vca-african-grey-feeding"
          ],
          result: "African Grey in-shell pine nut use requires supervision and strict moderation."
        }
      },
      {
        bird: "budgie",
        outcome: "avoid",
        sourceIds: [
          "vca-budgie-feeding",
          "vca-small-psittacine-nutrition-1998"
        ],
        locator: "VCA Budgie feeding guidance; Clinical Nutrition of Small Psittacines",
        evidenceScope: "species_specific",
        rationale: "Budgies have small beaks incapable of cracking hard pine nut shells. Whole in-shell pine nuts present a choking and feeding hazard and are avoided.",
        reviewedAt: date,
        firstPassSearch: {
          queries: [
            "budgie in-shell pine nut feeding"
          ],
          sourceIds: [
            "vca-budgie-feeding"
          ],
          result: "Small-beak diet limitations found."
        },
        followUpSearch: {
          queries: [
            "budgie whole pine nut beak size",
            "Melopsittacus undulatus in-shell nuts"
          ],
          sourceIds: [
            "vca-budgie-feeding",
            "vca-small-psittacine-nutrition-1998"
          ],
          result: "Whole in-shell pine nuts cannot be cracked by budgies; avoid."
        }
      },
      {
        bird: "canary",
        outcome: "avoid",
        sourceIds: [
          "vca-canary-feeding",
          "finchinfo-nutrition"
        ],
        locator: "VCA Canary feeding guidance; Finch Information Center",
        evidenceScope: "species_specific",
        rationale: "Canaries are small passerines incapable of cracking hard pine nut shells. Whole in-shell pine nuts present a mechanical choking hazard and are avoided.",
        reviewedAt: date,
        firstPassSearch: {
          queries: [
            "canary in-shell pine nut feeding"
          ],
          sourceIds: [
            "vca-canary-feeding"
          ],
          result: "Small-beak diet limitations found."
        },
        followUpSearch: {
          queries: [
            "canary whole pine nut beak size",
            "Serinus canaria in-shell nuts"
          ],
          sourceIds: [
            "vca-canary-feeding",
            "finchinfo-nutrition"
          ],
          result: "Whole in-shell pine nuts cannot be cracked by canaries; avoid."
        }
      },
      {
        bird: "chicken",
        outcome: "avoid",
        sourceIds: [
          "merck-poultry-2024",
          "poultry-extension-scratch-2026"
        ],
        locator: "Merck Poultry requirements; Poultry Extension scratch grain guidance",
        evidenceScope: "species_specific",
        rationale: "Chickens swallow items whole into the crop. Whole hard in-shell pine nuts present a crop impaction and mechanical hazard, and are avoided.",
        reviewedAt: date,
        firstPassSearch: {
          queries: [
            "chicken in-shell pine nut feeding"
          ],
          sourceIds: [
            "merck-poultry-2024"
          ],
          result: "Crop impaction and complete feed context."
        },
        followUpSearch: {
          queries: [
            "chicken whole pine nut crop impaction",
            "Gallus gallus in-shell nuts"
          ],
          sourceIds: [
            "merck-poultry-2024",
            "poultry-extension-scratch-2026"
          ],
          result: "In-shell pine nuts are a mechanical hazard for chickens; avoid."
        }
      }
    ]
  }
];

for (const review of newReviews) {
  if (foodReviews.ingredientReviews.some((existing) => existing.ingredientId === review.ingredientId && existing.form === review.form)) {
    throw new Error(`Food review already exists: ${review.ingredientId}::${review.form}`);
  }
  foodReviews.ingredientReviews.push(review);
}

save("sources.json", sources);
save("food-reviews.json", foodReviews);
console.log("Pine nuts provenance records applied successfully.");
