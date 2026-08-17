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

const sourceTiers = new Set([
  "primary",
  "systematic_review",
  "peer_reviewed_review",
  "veterinary_reference",
  "academic_book",
  "owner_guidance_with_citations",
  "historical_project",
  "runtime_configuration",
]);

const outcomes = new Set([
  "allowed",
  "limited",
  "avoid",
  "requires_preparation",
  "prohibited",
  "unresolved",
]);

const evidenceScopes = new Set([
  "species_specific",
  "group_specific",
  "related_species",
  "historical_project",
]);

const profileClaimKinds = new Set([
  "protected_historical_configuration",
  "runtime_configuration_snapshot",
]);

const profileReconciliationStatuses = new Set([
  "matches_pre_audit_configuration",
  "differs_from_pre_audit_configuration",
]);

function readJson(fileName) {
  return JSON.parse(readFileSync(resolve(provenanceDirectory, fileName), "utf8"));
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateSourceReferences(sourceIds, sourceIndex, context, errors) {
  if (!Array.isArray(sourceIds) || sourceIds.length === 0) {
    errors.push(`${context} must reference at least one source ID.`);
    return;
  }

  for (const sourceId of sourceIds) {
    if (!sourceIndex.has(sourceId)) {
      errors.push(`${context} references unknown source ID '${sourceId}'.`);
    }
  }
}

function validateSources(sources, errors) {
  const index = new Map();
  const requiredFields = [
    "id",
    "title",
    "authorsOrOrganization",
    "publishedYear",
    "sourceTier",
    "urlOrDoi",
    "permittedUse",
    "limitations",
    "accessedAt",
  ];

  for (const source of sources) {
    for (const field of requiredFields) {
      if (!isNonEmptyString(source[field])) {
        errors.push(`Source '${source.id ?? "<missing id>"}' is missing '${field}'.`);
      }
    }

    if (index.has(source.id)) {
      errors.push(`Source ID '${source.id}' is duplicated.`);
    }

    if (!sourceTiers.has(source.sourceTier)) {
      errors.push(`Source '${source.id}' has unsupported source tier '${source.sourceTier}'.`);
    }

    if (!Array.isArray(source.speciesScopes) || source.speciesScopes.length === 0) {
      errors.push(`Source '${source.id}' must declare at least one species scope.`);
    }

    index.set(source.id, source);
  }

  return index;
}

function validateHistoricalClaims(claims, sourceIndex, errors) {
  for (const claim of claims) {
    if (!isNonEmptyString(claim.id) || !isNonEmptyString(claim.status)) {
      errors.push("Every historical claim must have an ID and status.");
    }

    validateSourceReferences(
      claim.sourceIds,
      sourceIndex,
      `Historical claim '${claim.id ?? "<missing id>"}'`,
      errors,
    );
  }
}

function validateFoodReviews(reviews, sourceIndex, errors) {
  for (const review of reviews) {
    if (!isNonEmptyString(review.ingredientId) || !isNonEmptyString(review.form)) {
      errors.push("Every food review must have an ingredient ID and one explicit form.");
    }

    const evidence = review.speciesEvidence;
    if (!Array.isArray(evidence) || evidence.length !== requiredBirds.length) {
      errors.push(`Food review '${review.ingredientId}' must contain exactly six species evidence rows.`);
      continue;
    }

    const birds = evidence.map((entry) => entry.bird);
    const uniqueBirds = new Set(birds);
    if (uniqueBirds.size !== requiredBirds.length || requiredBirds.some((bird) => !uniqueBirds.has(bird))) {
      errors.push(`Food review '${review.ingredientId}' must cover pigeon, parrot, African Grey, budgie, canary, and chicken exactly once.`);
    }

    for (const entry of evidence) {
      const context = `Food review '${review.ingredientId}' for '${entry.bird ?? "<missing bird>"}'`;
      if (!outcomes.has(entry.outcome)) {
        errors.push(`${context} has unsupported outcome '${entry.outcome}'.`);
      }
      if (!evidenceScopes.has(entry.evidenceScope)) {
        errors.push(`${context} has unsupported evidence scope '${entry.evidenceScope}'.`);
      }
      if (!isNonEmptyString(entry.locator) || !isNonEmptyString(entry.rationale) || !isNonEmptyString(entry.reviewedAt)) {
        errors.push(`${context} must include a locator, rationale, and review date.`);
      }
      validateSourceReferences(entry.sourceIds, sourceIndex, context, errors);
    }
  }
}

function validateProfileClaims(claims, sourceIndex, errors) {
  const claimIndex = new Map();

  for (const claim of claims) {
    const context = `Profile claim '${claim.id ?? "<missing id>"}'`;
    for (const field of ["id", "claimKind", "bird", "profile", "profileName", "nutrient", "unit", "locator", "evidenceScope", "reconciliationStatus", "comparedClaimId", "reviewedAt"]) {
      if (!isNonEmptyString(claim[field])) {
        errors.push(`${context} must include '${field}'.`);
      }
    }

    if (claimIndex.has(claim.id)) {
      errors.push(`${context} has a duplicated ID.`);
    }
    claimIndex.set(claim.id, claim);

    if (!profileClaimKinds.has(claim.claimKind)) {
      errors.push(`${context} has unsupported claim kind '${claim.claimKind}'.`);
    }
    if (!evidenceScopes.has(claim.evidenceScope)) {
      errors.push(`${context} has unsupported evidence scope '${claim.evidenceScope}'.`);
    }
    if (!profileReconciliationStatuses.has(claim.reconciliationStatus)) {
      errors.push(`${context} has unsupported reconciliation status '${claim.reconciliationStatus}'.`);
    }
    if (!Array.isArray(claim.range) || claim.range.length !== 2 || !claim.range.every((value) => typeof value === "number")) {
      errors.push(`${context} must include a two-value numeric range.`);
    }
    validateSourceReferences(claim.sourceIds, sourceIndex, context, errors);
  }

  for (const claim of claims) {
    const counterpart = claimIndex.get(claim.comparedClaimId);
    const context = `Profile claim '${claim.id ?? "<missing id>"}'`;
    if (!counterpart) {
      errors.push(`${context} must point to an existing paired claim.`);
      continue;
    }
    if (counterpart.comparedClaimId !== claim.id) {
      errors.push(`${context} must be reciprocally linked to its paired claim.`);
    }
    if (counterpart.bird !== claim.bird || counterpart.profile !== claim.profile || counterpart.nutrient !== claim.nutrient) {
      errors.push(`${context} must pair with the same bird, profile, and nutrient.`);
    }
    if (counterpart.reconciliationStatus !== claim.reconciliationStatus) {
      errors.push(`${context} and its paired claim must share a reconciliation status.`);
    }
  }
}

const errors = [];
const sourceLedger = readJson("sources.json");
const historicalLedger = readJson("historical-claims.json");
const foodLedger = readJson("food-reviews.json");
const profileLedger = readJson("profile-claims.json");

if (sourceLedger.schemaVersion !== 1 || historicalLedger.schemaVersion !== 1 || foodLedger.schemaVersion !== 1 || profileLedger.schemaVersion !== 1) {
  errors.push("All ledger JSON files must declare schemaVersion 1.");
}

const sourceIndex = validateSources(sourceLedger.sources, errors);
validateHistoricalClaims(historicalLedger.claims, sourceIndex, errors);
validateFoodReviews(foodLedger.ingredientReviews, sourceIndex, errors);
validateProfileClaims(profileLedger.profileClaims, sourceIndex, errors);

if (errors.length > 0) {
  console.error("Provenance ledger validation failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Provenance ledger validation passed.");
console.log(`- ${sourceLedger.sources.length} source records`);
console.log(`- ${historicalLedger.claims.length} protected historical claims`);
console.log(`- ${foodLedger.ingredientReviews.length} food reviews (each future review requires six explicit species rows)`);
console.log(`- ${profileLedger.profileClaims.length} profile claim records`);
