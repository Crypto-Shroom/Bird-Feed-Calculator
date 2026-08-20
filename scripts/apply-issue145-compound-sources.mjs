import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const provenance = resolve(root, "database/provenance");
const sourcePath = resolve(provenance, "sources.json");
const sources = JSON.parse(readFileSync(sourcePath, "utf8"));
const date = "2026-08-20";

const additions = [
  {
    id: "adebo-2023-lima-bean-review",
    title: "A Review on the Potential Food Application of Lima Beans (Phaseolus lunatus L.), an Underutilized Crop",
    authorsOrOrganization: "Janet Adeyinka Adebo",
    publishedYear: "2023",
    sourceTier: "peer_reviewed_review",
    urlOrDoi: "https://doi.org/10.3390/app13031996",
    speciesScopes: ["lima_beans", "phaseolus_lunatus"],
    permittedUse: "Maps source-specific antinutritional compounds reported for Phaseolus lunatus, including cyanide-producing glucosides, lectins, trypsin inhibitors, tannins, phytate, and oxalate.",
    limitations: "Does not study pigeons, define a pigeon dose, or establish a pigeon safety, processing, or formula outcome.",
    accessedAt: date,
  },
  {
    id: "lessire-2017-fava-vicine-hens",
    title: "Effects of Faba Beans with Different Concentrations of Vicine and Convicine on Egg Production, Egg Quality and Red Blood Cells in Laying Hens",
    authorsOrOrganization: "M. Lessire et al.",
    publishedYear: "2017",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.1017/S1751731116002688",
    speciesScopes: ["chicken", "fava_beans", "vicia_faba"],
    permittedUse: "Documents vicine/convicine exposure and red-cell findings in laying hens; identifies the fava-specific compound concern.",
    limitations: "Does not study pigeons or establish any pigeon response, dose, safety rule, or raw-dried fava outcome.",
    accessedAt: date,
  },
  {
    id: "baghshani-2009-pigeon-rhodanese",
    title: "Comparison of Rhodanese Distribution in Different Tissues of Japanese Quail, Partridge, and Pigeon",
    authorsOrOrganization: "Hasan Baghshani and Mahmoud Aminlari",
    publishedYear: "2009",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.1007/s00580-008-0781-8",
    speciesScopes: ["pigeon", "columba_livia"],
    permittedUse: "Documents tissue distribution of the cyanide-related enzyme rhodanese in adult pigeons.",
    limitations: "No cyanide or lima-bean exposure, dose, clinical endpoint, tolerance threshold, processing condition, or raw-dried bean outcome was tested.",
    accessedAt: date,
  },
  {
    id: "agboola-2006-pigeon-cyanide-enzymes",
    title: "Activities of Thiosulphate and 3-Mercaptopyruvate-cyanide-sulphurtransferases in Poultry Birds and the Fruit Bat",
    authorsOrOrganization: "Femi Kayode Agboola, Bamidele Sanya Fagbohunka, and Gbenga Adebola Adenuga",
    publishedYear: "2006",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.3923/jbs.2006.833.839",
    speciesScopes: ["pigeon", "chicken", "duck"],
    permittedUse: "Documents rhodanese and 3-mercaptopyruvate sulfurtransferase activity in pigeon tissues.",
    limitations: "No raw lima-bean feeding, cyanogenic-glycoside dose, cyanide tolerance threshold, clinical outcome, processing condition, or raw-dried bean outcome was tested.",
    accessedAt: date,
  },
  {
    id: "ji-2022-pigeon-phosphorus",
    title: "Influence of Dietary Phosphorus Concentrations on the Performance of Rearing Pigeons (Columba livia), and Bone Properties of Squabs",
    authorsOrOrganization: "Feng Ji et al.",
    publishedYear: "2022",
    sourceTier: "primary",
    urlOrDoi: "https://doi.org/10.1016/j.psj.2022.101744",
    speciesScopes: ["pigeon", "columba_livia"],
    permittedUse: "Provides pigeon-specific dietary phosphorus context and describes plant-feed phosphorus as largely phytate-bound in the study background.",
    limitations: "Does not measure raw bean phytate or tannin, compare bean forms, or establish a pigeon safety or suitability outcome for any raw dried bean.",
    accessedAt: date,
  },
];

for (const addition of additions) {
  const existing = sources.sources.find((source) => source.id === addition.id);
  if (existing) Object.assign(existing, addition);
  else sources.sources.push(addition);
}

writeFileSync(sourcePath, `${JSON.stringify(sources, null, 2)}\n`);
console.log(`Registered ${additions.length} compound-review sources.`);
