import type { BirdType } from "./birds";

export interface HerbSource {
  authors: string;
  year: number;
  title: string;
  publication: string;
  url: string;
}

export type HerbEligibility = "eligible" | "library_only" | "do_not_suggest";

export interface HerbEvidence {
  eligibility: HerbEligibility;
  compatibleBirds: readonly BirdType[];
  sourceIds: readonly (keyof typeof HERB_SOURCES)[];
  scope: string;
}

const allSupportedBirds = ["pigeon", "parrot", "african_grey", "budgie", "canary", "chicken"] as const satisfies readonly BirdType[];

/**
 * Academic source registry for the herb and supplement records. The registry
 * describes the evidence scope; it does not turn poultry studies into a
 * diagnosis, treatment protocol, or validated dose for every companion bird.
 */
export const HERB_SOURCES = {
  hartady2021: {
    authors: "Hartady et al.",
    year: 2021,
    title: "Review of herbal medicine works in the avian species",
    publication: "Veterinary World",
    url: "https://doi.org/10.14202/vetworld.2021.2889-2906",
  },
  dardouri2025: {
    authors: "Dardouri et al.",
    year: 2025,
    title: "Herbs impact on poultry health and antimicrobial resistance: a scoping review with one health perspective",
    publication: "BMC Veterinary Research",
    url: "https://doi.org/10.1186/s12917-025-04760-6",
  },
  elSabrout2023: {
    authors: "El-Sabrout et al.",
    year: 2023,
    title: "Application of botanical products as nutraceutical feed additives for improving poultry health and production",
    publication: "Veterinary World",
    url: "https://doi.org/10.14202/vetworld.2023.369-379",
  },
  meradi2022: {
    authors: "Meradi et al.",
    year: 2022,
    title: "The effect of coriander, fenugreek, anise, and their combinations on growth performance in broiler chicken",
    publication: "Veterinary World",
    url: "https://doi.org/10.14202/vetworld.2022.1821-1826",
  },
  hassan2025: {
    authors: "Hassan et al.",
    year: 2025,
    title: "Herbal synergy enhances growth performance, antioxidant status, immunity, and lymphoid tissue architecture in pigeons",
    publication: "Scientific Reports",
    url: "https://doi.org/10.1038/s41598-025-26977-z",
  },
  sampath2023: {
    authors: "Sampath et al.",
    year: 2023,
    title: "The efficacy of yeast supplementation on monogastric animal health and performance: a review",
    publication: "Animals",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10608604/",
  },
  gao2021: {
    authors: "Gao et al.",
    year: 2021,
    title: "Effect of oils in feed on the production performance and egg quality of poultry: a review",
    publication: "Animals",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8698086/",
  },
  vanImmerseel2007: {
    authors: "Van Immerseel et al.",
    year: 2007,
    title: "The use of organic acids to combat Salmonella in poultry: a mechanistic explanation of the efficacy",
    publication: "Avian Pathology",
    url: "https://doi.org/10.1080/03079450600711045",
  },
  wade2004: {
    authors: "Wade and Newman",
    year: 2004,
    title: "Hemoglobinuric nephrosis and hepatosplenic erythrophagocytosis in a dusky-headed conure after ingestion of garlic",
    publication: "Journal of Avian Medicine and Surgery",
    url: "https://doi.org/10.1647/2002-030",
  },
} as const satisfies Record<string, HerbSource>;

const eligible = (sourceIds: HerbEvidence["sourceIds"], scope: string): HerbEvidence => ({
  eligibility: "eligible",
  compatibleBirds: allSupportedBirds,
  sourceIds,
  scope,
});

const libraryOnly = (sourceIds: HerbEvidence["sourceIds"], scope: string): HerbEvidence => ({
  eligibility: "library_only",
  compatibleBirds: [],
  sourceIds,
  scope,
});

const doNotSuggest = (sourceIds: HerbEvidence["sourceIds"], scope: string): HerbEvidence => ({
  eligibility: "do_not_suggest",
  compatibleBirds: [],
  sourceIds,
  scope,
});

export const HERB_EVIDENCE: Record<string, HerbEvidence> = {
  anise: eligible(["meradi2022"], "Chicken feed trial; not a dose validation for every companion-bird species."),
  fennel: eligible(["dardouri2025"], "Poultry literature mapping; species-specific companion-bird dose evidence remains limited."),
  nigella: eligible(["elSabrout2023", "hassan2025"], "Poultry review and a pigeon mixture trial; the pigeon study tested a multi-herb blend, not nigella alone."),
  cumin: libraryOnly([], "No linked academic avian source has yet been recorded for this individual planner entry."),
  coriander: eligible(["meradi2022", "hassan2025"], "Broiler trial and pigeon mixture trial; the pigeon study tested a multi-herb blend."),
  fenugreek: eligible(["meradi2022", "elSabrout2023"], "Broiler research; not a diagnosis or a companion-bird dosing protocol."),
  oregano: eligible(["hartady2021", "dardouri2025"], "Poultry research and reviews; preserve ordinary feed use rather than therapeutic claims."),
  thyme: eligible(["hartady2021", "dardouri2025", "elSabrout2023"], "Poultry research and reviews; essential-oil concentrations should not be inferred from dried-herb records."),
  basil: libraryOnly([], "No linked academic avian source has yet been recorded for this individual planner entry."),
  cinnamon: eligible(["hartady2021", "dardouri2025"], "Poultry evidence exists; concentrated oils are not interchangeable with food-grade spice powder."),
  ginger: eligible(["elSabrout2023"], "Poultry review evidence; not a therapeutic protocol."),
  turmeric: eligible(["hartady2021", "elSabrout2023"], "Poultry review evidence; not a therapeutic protocol."),
  garlic_powder: doNotSuggest(["wade2004", "hartady2021"], "Do not automatically suggest Allium products: a companion-bird garlic toxicosis case report exists, while poultry studies do not establish safety across bird species."),
  clove: libraryOnly([], "No linked academic avian source has yet been recorded for this individual planner entry."),
  rosemary: eligible(["hartady2021", "dardouri2025"], "Poultry evidence; no individual companion-bird dose is asserted."),
  mint: eligible(["hartady2021", "dardouri2025"], "Poultry evidence; no individual companion-bird dose is asserted."),
  chamomile: eligible(["dardouri2025", "elSabrout2023"], "Poultry evidence; no individual companion-bird dose is asserted."),
  neem: libraryOnly(["hartady2021"], "Published poultry and avian literature is mixed by plant part and preparation, so it is reference-only until a species and preparation review is completed."),
  apple_cider_vinegar: libraryOnly(["vanImmerseel2007"], "Organic-acid poultry literature is not an apple-cider-vinegar-specific drinking-water protocol."),
  garlic_oil: doNotSuggest(["wade2004", "hartady2021"], "Do not automatically suggest Allium products: a companion-bird garlic toxicosis case report exists, while poultry studies do not establish safety across bird species."),
  hemp_oil: eligible(["gao2021"], "Poultry dietary-oil review; product composition and total dietary fat still require review."),
  cod_liver_oil: libraryOnly([], "No linked academic avian source has yet been recorded for this individual planner entry; vitamin A and D concentration must be product-specific."),
  linseed_oil: eligible(["gao2021"], "Poultry dietary-oil review; product composition and total dietary fat still require review."),
  brewers_yeast: eligible(["sampath2023"], "Yeast feed-additive review; follow the specific product's instructions."),
  elderberry_extract: libraryOnly([], "No linked academic avian source has yet been recorded for this individual planner entry."),
  probiotics: libraryOnly([], "Product selection and use should follow the selected product's instructions; no linked academic source has yet been recorded for this individual planner entry."),
};

export function getHerbEvidence(name: string): HerbEvidence {
  return HERB_EVIDENCE[name] ?? libraryOnly([], "No evidence record has been linked to this planner entry.");
}

export function isHerbEligibleForBird(name: string, bird: BirdType): boolean {
  const evidence = getHerbEvidence(name);
  return evidence.eligibility === "eligible" && evidence.compatibleBirds.includes(bird);
}

export function getEligibleHerbNames(recommendedNames: readonly string[], bird: BirdType): string[] {
  return recommendedNames.filter((name) => isHerbEligibleForBird(name, bird));
}
