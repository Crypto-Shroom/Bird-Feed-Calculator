import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const provenance = resolve(root, "database/provenance");
const foodReviewPath = resolve(provenance, "food-reviews.json");
const sourcePath = resolve(provenance, "sources.json");
const date = "2026-08-20";
const decisionUrl = "https://github.com/Crypto-Shroom/Bird-Feed-Calculator/issues/145#issuecomment-5355227897";
const policySourceId = "issue-145-owner-pigeon-raw-bean-precaution-2026-08-20";

const policySource = {
  id: policySourceId,
  title: "Owner-approved precautionary pigeon policy for five raw dried bean forms",
  authorsOrOrganization: "Bird Feed Calculator product owner",
  publishedYear: "2026",
  sourceTier: "owner_approved_policy",
  urlOrDoi: decisionUrl,
  speciesScopes: ["pigeon"],
  permittedUse: "Records the owner's explicit precautionary decision to classify raw dried lima, fava, black, pinto, and navy beans as avoid for pigeons because compound concerns exist and safe pigeon use has not been clearly established.",
  limitations: "This is a product safety-policy decision, not external proof of pigeon toxicity, a raw-bean feeding study, a preparation method, a nutrition value, a runtime formula rule, or a decision about another species or bean form.",
  accessedAt: date,
};

const targets = new Map([
  ["raw dried lima beans", { displayName: "lima beans", concerns: "cyanide-producing glucosides and other raw-legume antinutritional compounds" }],
  ["raw dried fava beans", { displayName: "fava beans", concerns: "vicine/convicine and other fava-bean antinutritional compounds" }],
  ["raw dried black beans", { displayName: "black beans", concerns: "common-bean lectins, trypsin inhibitors, phytate, tannins, and related compounds" }],
  ["raw dried pinto beans", { displayName: "pinto beans", concerns: "common-bean lectins, trypsin inhibitors, phytate, tannins, and related compounds" }],
  ["raw dried navy beans", { displayName: "navy beans", concerns: "common-bean lectins, trypsin inhibitors, phytate, tannins, and related compounds" }],
]);

const sources = JSON.parse(readFileSync(sourcePath, "utf8"));
const existingPolicySource = sources.sources.find((source) => source.id === policySourceId);
if (existingPolicySource) Object.assign(existingPolicySource, policySource);
else sources.sources.push(policySource);
writeFileSync(sourcePath, `${JSON.stringify(sources, null, 2)}\n`);

const foodReviews = JSON.parse(readFileSync(foodReviewPath, "utf8"));
for (const review of foodReviews.ingredientReviews) {
  const target = targets.get(review.form);
  if (!target) continue;

  const pigeon = review.speciesEvidence.find((entry) => entry.bird === "pigeon");
  if (!pigeon) throw new Error(`Expected a pigeon row for ${review.ingredientId}::${review.form}`);

  pigeon.outcome = "avoid";
  pigeon.sourceIds = [...new Set([...pigeon.sourceIds, policySourceId])];
  pigeon.locator = `Owner-approved precautionary policy in Issue #145 comment #issuecomment-5355227897; retained direct pigeon context and Issue #145 evidence/compound-research logs for raw dried ${target.displayName}`;
  pigeon.evidenceScope = "owner_approved_policy";
  pigeon.rationale = `Owner-approved precautionary safety policy: ${target.concerns} are documented concerns, while safe pigeon use of this exact raw dried form has not been clearly established. The underlying direct pigeon evidence remains incomplete—no pigeon raw-form feeding or toxicology outcome was found—so this avoid classification is a conservative owner decision, not a claim that pigeon toxicity has been directly demonstrated. It does not approve a preparation method, portion, formula, complete ration, runtime use, another bean form, or another bird.`;
  pigeon.reviewedAt = date;

  review.ownerPolicy = {
    policySourceId,
    policyType: "precautionary_avoid",
    authority: "product_owner",
    decisionDate: date,
    decisionUrl,
    rejectionNote: `Avoid for pigeons: raw dried ${target.displayName} have documented compound concerns, while safe pigeon use of this exact raw dried form has not been clearly established. This is a precautionary owner policy, not a claim of directly demonstrated pigeon toxicity.`,
    boundary: "Applies only to the pigeon outcome for this exact raw dried form. It preserves the underlying direct-evidence limitation and does not change another species, food form, active catalog entry, nutrient value, formula, calculation behavior, warning UI, or public copy.",
  };

  review.processing.sourceIds = [...new Set([...review.processing.sourceIds, policySourceId])];
  review.processing.rule = `Keep ${review.form} distinct from soaked, sprouted, cooked, canned, fermented, milled, or manufactured forms. The pigeon raw-dried form is avoid under the owner-approved precautionary policy; its underlying direct evidence gap remains recorded. Companion-bird records require preparation; chicken evidence remains bounded to cited controlled poultry studies. This evidence-only record does not approve runtime use, a formula, a portion, or a complete ration.`;
}

writeFileSync(foodReviewPath, `${JSON.stringify(foodReviews, null, 2)}\n`);
console.log(`Applied owner-approved pigeon avoid policy to ${targets.size} raw dried bean forms.`);
