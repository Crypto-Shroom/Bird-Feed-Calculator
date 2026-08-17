# Provenance Ledger Schema

## Source record

Every reusable source is defined once in `sources.json`.

| Field | Required | Description |
|---|---:|---|
| `id` | Yes | Stable lowercase identifier used by all evidence records. |
| `title` | Yes | Source title. |
| `authorsOrOrganization` | Yes | Named authors or responsible organization. |
| `publishedYear` | Yes | Publication/update year; `unknown` is permitted only for protected historical project files. |
| `sourceTier` | Yes | `primary`, `systematic_review`, `peer_reviewed_review`, `veterinary_reference`, `academic_book`, `owner_guidance_with_citations`, or `historical_project`. |
| `urlOrDoi` | Yes | Stable public URL or DOI; repository-relative path for protected project evidence. |
| `speciesScopes` | Yes | Species or species groups the source actually covers. |
| `permittedUse` | Yes | What the source can substantiate. |
| `limitations` | Yes | What it cannot substantiate or where extrapolation would be unsafe. |
| `accessedAt` | Yes | ISO date when the source was checked. |

## Food review record

`food-reviews.json` will contain an `ingredientReviews` array. Each record has:

```json
{
  "ingredientId": "example",
  "ingredientDisplayName": "Example food",
  "form": "raw",
  "nutrition": {
    "sourceIds": ["source-id"],
    "basis": "as_fed",
    "notes": "Analytical basis and preparation notes."
  },
  "speciesEvidence": [
    {
      "bird": "pigeon",
      "outcome": "unresolved",
      "sourceIds": ["source-id"],
      "locator": "Chapter or exact section",
      "evidenceScope": "historical_project",
      "rationale": "Why the evidence supports this outcome or remains unresolved.",
      "reviewedAt": "2026-08-17"
    }
  ],
  "processing": {
    "sourceIds": ["source-id"],
    "rule": "Preparation requirement, if any.",
    "severity": "warning"
  },
  "lastReviewedAt": "2026-08-17"
}
```

### Food-record invariants

| Invariant | Requirement |
|---|---|
| Bird coverage | `speciesEvidence` contains exactly six rows: `pigeon`, `parrot`, `african_grey`, `budgie`, `canary`, and `chicken`. |
| Form distinction | A record applies to one food form only. Raw and cooked beans, garlic powder and garlic oil, or whole and crushed foods cannot share an undifferentiated record. |
| Citation | Every species row names at least one source ID and a non-empty locator. |
| Explicit evidence scope | Every row uses one of `species_specific`, `group_specific`, `related_species`, or `historical_project`. |
| Honest gaps | `unresolved` is valid and required when current evidence does not meet the six-bird standard. |
| No inferred approval | A source written for pigeons cannot silently permit the food for parrots, African Greys, budgies, canaries, or chickens. |

## Profile claim record

`profile-claims.json` will contain `profileClaims`. Each profile range must list its exact bird, profile name, nutrient, numeric range, source IDs, locator, evidence scope, and historical-to-active reconciliation status.

The ledger does not decide which historical or current target is correct. It records their sources and differences so the owner can approve a later runtime decision.

## Historical claim record

`historical-claims.json` protects original research intent. It is allowed to contain historical claims that do **not** meet current source quality requirements, provided it labels them `historical_claim_only` or `unresolved` and names the limitation. These records never become a runtime rule merely by existing.
