import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "../..");
const provenanceDirectory = resolve(repositoryRoot, "database/provenance");
const requiredBirds = [
  "pigeon",
  "parrot",
  "african_grey",
  "budgie",
  "canary",
  "chicken",
];

function readJson(fileName) {
  return JSON.parse(
    readFileSync(resolve(provenanceDirectory, fileName), "utf8"),
  );
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function reviewKey(review) {
  return `${review.ingredientId}::${review.form}`;
}

function hasCompleteSixBirdCoverage(review) {
  const birds = review.speciesEvidence?.map((entry) => entry.bird) ?? [];
  return (
    birds.length === requiredBirds.length &&
    requiredBirds.every(
      (bird) => birds.filter((entry) => entry === bird).length === 1,
    )
  );
}

const historicalLedger = readJson("historical-claims.json");
const foodLedger = readJson("food-reviews.json");
const coverageLedger = readJson("food-coverage.json");
const historicalClaimsById = new Map(
  historicalLedger.claims.map((claim) => [claim.id, claim]),
);
const reviewsByKey = new Map(
  foodLedger.ingredientReviews.map((review) => [reviewKey(review), review]),
);
const errors = [];
const trackedItemIds = new Set();
const coverageRows = [];

if (
  coverageLedger.schemaVersion !== 1 ||
  !Array.isArray(coverageLedger.claimCoverage)
) {
  errors.push(
    "Food coverage ledger must declare schemaVersion 1 and a claimCoverage array.",
  );
}

for (const coverage of coverageLedger.claimCoverage ?? []) {
  const historicalClaim = historicalClaimsById.get(coverage.historicalClaimId);
  if (!historicalClaim) {
    errors.push(
      `Coverage entry references unknown historical claim '${coverage.historicalClaimId ?? "<missing>"}'.`,
    );
    continue;
  }

  if (
    !Array.isArray(coverage.trackedItems) ||
    coverage.trackedItems.length === 0
  ) {
    errors.push(
      `Coverage entry '${coverage.historicalClaimId}' must list at least one tracked food/form item.`,
    );
    continue;
  }

  let mappedItems = 0;
  for (const item of coverage.trackedItems) {
    const context = `Coverage item '${item.id ?? "<missing>"}' for '${coverage.historicalClaimId}'`;
    if (
      !isNonEmptyString(item.id) ||
      !isNonEmptyString(item.displayName) ||
      !isNonEmptyString(item.historicalForm)
    ) {
      errors.push(
        `${context} must include an ID, display name, and historical form.`,
      );
    }
    if (trackedItemIds.has(item.id)) {
      errors.push(`${context} duplicates a tracked item ID.`);
    }
    trackedItemIds.add(item.id);

    if (!Array.isArray(item.linkedFoodReviewKeys)) {
      errors.push(`${context} must include linkedFoodReviewKeys as an array.`);
      continue;
    }

    if (item.linkedFoodReviewKeys.length > 0) mappedItems += 1;
    for (const linkedKey of item.linkedFoodReviewKeys) {
      const linkedReview = reviewsByKey.get(linkedKey);
      if (!linkedReview) {
        errors.push(`${context} links unknown food review '${linkedKey}'.`);
      } else if (!hasCompleteSixBirdCoverage(linkedReview)) {
        errors.push(
          `${context} links '${linkedKey}', which does not have complete six-bird evidence coverage.`,
        );
      }
    }
  }

  coverageRows.push({
    historicalClaimId: coverage.historicalClaimId,
    trackedItems: coverage.trackedItems.length,
    mappedItems,
  });
}

if (errors.length > 0) {
  console.error("Food provenance coverage validation failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const totalTrackedItems = coverageRows.reduce(
  (total, row) => total + row.trackedItems,
  0,
);
const mappedItems = coverageRows.reduce(
  (total, row) => total + row.mappedItems,
  0,
);
const existingCompleteReviews = foodLedger.ingredientReviews.filter(
  hasCompleteSixBirdCoverage,
).length;

console.log("Food provenance coverage report");
console.log(`- Historical claims in Issue #92 scope: ${coverageRows.length}`);
console.log(`- Tracked historical food/form items: ${totalTrackedItems}`);
console.log(`- Items linked to complete six-bird reviews: ${mappedItems}`);
console.log(
  `- Items awaiting a complete six-bird review: ${totalTrackedItems - mappedItems}`,
);
console.log(
  `- Existing complete food reviews outside this tracked scope: ${existingCompleteReviews - mappedItems}`,
);
for (const row of coverageRows) {
  console.log(
    `- ${row.historicalClaimId}: ${row.mappedItems}/${row.trackedItems} items linked`,
  );
}
