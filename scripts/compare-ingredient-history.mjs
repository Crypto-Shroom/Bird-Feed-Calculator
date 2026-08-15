import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");

const sources = [
  ["V1 standalone Python", "versions/v1-original/pigeon_mix_calculator.py", "python"],
  ["V1 expanded Python reference", "versions/v1-original/expanded_ingredients.py", "python"],
  ["V2 standalone Python", "versions/v2-vite-fix/pigeon_mix_calculator.py", "python"],
  ["Prior-main Python package", "archive/codex-and-main-history/pigeon-mix-web-multi-bird/pigeon-mix-web-multi-bird/python-package/pigeon_mix_calculator/pigeon_mix_calculator.py", "python"],
  ["Prior-main nested web ingredients", "archive/codex-and-main-history/pigeon-mix-web-multi-bird/pigeon-mix-web-multi-bird/pigeon-mix-web-multi-bird/client/src/lib/data.ts", "typescript-ingredients"],
  ["Prior-main nested web herbs", "archive/codex-and-main-history/pigeon-mix-web-multi-bird/pigeon-mix-web-multi-bird/pigeon-mix-web-multi-bird/client/src/lib/data.ts", "typescript-herbs"],
  ["V3 active ingredients", "versions/v3-webapp/client/src/lib/data.ts", "typescript-ingredients"],
  ["V3 active herbs", "versions/v3-webapp/client/src/lib/data.ts", "typescript-herbs"],
];

function extractPythonIngredientIds(source) {
  const marker = source.indexOf("INGREDIENTS = {");
  if (marker < 0) return [];
  const profileMarker = source.indexOf("PROFILES = {", marker);
  const section = source.slice(marker, profileMarker < 0 ? undefined : profileMarker);
  return [...section.matchAll(/^\s{4}["']([^"']+)["']:\s*\{\s*["']category["']:/gm)].map((match) => match[1]);
}

function extractTypeScriptIds(source, declaration) {
  const marker = source.indexOf(`export const ${declaration}`);
  if (marker < 0) return [];
  const nextSection = source.indexOf("export const ", marker + declaration.length);
  const section = source.slice(marker, nextSection < 0 ? undefined : nextSection);
  return [...section.matchAll(/^\s+(?:["']([^"']+)["']|([a-zA-Z_][\w]*)):\s*\{\s*(?:["']category["']|category):/gm)]
    .map((match) => match[1] ?? match[2]);
}

const results = sources.map(([label, relativePath, type]) => {
  const text = readFileSync(resolve(repositoryRoot, relativePath), "utf8");
  const ids = [...new Set(
    type === "python"
      ? extractPythonIngredientIds(text)
      : extractTypeScriptIds(text, type === "typescript-herbs" ? "HERBS_SUPPLEMENTS" : "INGREDIENTS"),
  )].sort();
  return { label, relativePath, ids };
});

const activeIngredients = results.find((result) => result.label === "V3 active ingredients");
const activeHerbs = results.find((result) => result.label === "V3 active herbs");
const activeCatalog = [...new Set([...activeIngredients.ids, ...activeHerbs.ids])].sort();

for (const result of results) {
  const activeComparison = result.label.includes("herbs")
    ? activeHerbs.ids
    : result.label.includes("expanded")
      ? activeCatalog
      : activeIngredients.ids;
  const comparisonName = result.label.includes("herbs")
    ? "V3 herbs"
    : result.label.includes("expanded")
      ? "V3 full catalog"
      : "V3 ingredients";
  const missingFromV3 = result.ids.filter((id) => !activeComparison.includes(id));
  const addedInV3 = activeComparison.filter((id) => !result.ids.includes(id));
  console.log(`\n${result.label}: ${result.ids.length} ingredient IDs`);
  console.log(`  Path: ${result.relativePath}`);
  console.log(`  Present here but absent from ${comparisonName} (${missingFromV3.length}): ${missingFromV3.join(", ") || "none"}`);
  console.log(`  Present in ${comparisonName} but absent here (${addedInV3.length}): ${addedInV3.join(", ") || "none"}`);
}

const expanded = results.find((result) => result.label === "V1 expanded Python reference");
console.log("\nComplete catalog reconciliation");
console.log(`  V3 active catalog: ${activeIngredients.ids.length} ingredients + ${activeHerbs.ids.length} herbs/supplements = ${activeCatalog.length} total`);
console.log(`  V1 expanded Python reference: ${expanded.ids.length} total`);
console.log(`  Historical IDs absent from V3: ${expanded.ids.filter((id) => !activeCatalog.includes(id)).join(", ") || "none"}`);
console.log(`  V3 additions beyond V1 expanded: ${activeCatalog.filter((id) => !expanded.ids.includes(id)).join(", ") || "none"}`);
