# Canonical Six-Bird Provenance Ledger

This directory is the canonical, reviewable provenance layer for the Bird Feed Calculator. It exists because a catalog of nutrient values and visible warning text is **not** sufficient provenance. Every future runtime claim must trace to a record here before it may change calculator behaviour.

The first ledger release is intentionally **no-runtime-change**. It preserves original research intent, establishes a structured source register, and records the limits of the historical compatibility claims. It does not modify the calculator’s existing formulas, nutrition values, compatibility outcomes, safety rules, UI copy, or deployment.

## Files

| File | Purpose | Status |
|---|---|---|
| [`sources.json`](./sources.json) | Machine-readable source register with stable IDs, source tier, scope, and locators. | Seeded from recovered historical research and verified sources. |
| [`historical-claims.json`](./historical-claims.json) | Protected record of what the original project research asserted, including its limitations. | Seeded; not a runtime adapter. |
| [`SCHEMA.md`](./SCHEMA.md) | Required shape for every future source, profile, ingredient, processing, safety, herb, and six-bird evidence row. | Governing policy. |
| [`HISTORICAL_BASELINE.md`](./HISTORICAL_BASELINE.md) | Crosswalk to the preserved pre-GitHub project files and recovered Manus research. | Governing historical-intent index. |
| [`food-reviews.json`](./food-reviews.json) | Future per-food, per-form, six-bird outcomes. | Empty by design until each review is evidenced. |
| [`profile-claims.json`](./profile-claims.json) | Read-only historical-versus-current profile target reconciliation rows. | Seeded with configuration snapshots; scientific reconciliation remains pending. |

## Non-negotiable rules

| Rule | Meaning |
|---|---|
| **Six entries, every food** | A food record must contain one review entry for Pigeon, Parrot, African Grey, Budgie, Canary, and Chicken. |
| **Form matters** | Raw, cooked, sprouted, roasted, dried, oil, powder, and other forms are distinct evidence records. |
| **No silent default** | A missing evidence row remains `unresolved`; no runtime code may interpret it as allowed, prohibited, or irrelevant. |
| **Source scope is explicit** | Every citation must say whether it is species-specific, group-specific, related-species, or historical-project evidence. |
| **Historical research is preserved** | Original Manus and pre-GitHub research determines what must be reconciled; it is not discarded merely because the current code lacks a citation field. |
| **No hidden behaviour change** | The ledger is data governance. Runtime adapters, formulas, safety rules, and public wording change only in separate owner-approved PRs. |

## Evidence outcomes

| Outcome | Definition | Runtime implication before a separate approval PR |
|---|---|---|
| `allowed` | Evidence supports the named food form for the named species in the described role. | None. |
| `limited` | Evidence supports use only with limits, preparation, or context. | None. |
| `avoid` | Evidence indicates the item should generally not be suggested. | None. |
| `requires_preparation` | The item is only suitable after specific verified processing. | None. |
| `prohibited` | Evidence supports an explicit safety exclusion. | None. |
| `unresolved` | Evidence is absent, conflicting, historical-only, or not sufficient for the owner’s six-bird standard. | None. |

> The ledger records evidence and gaps. It does **not** silently change the live app when a source is added, corrected, or still missing.

## Review workflow

1. Add or improve the source entry in `sources.json`.
2. Add one ingredient/form record containing exactly six species evidence rows.
3. Reference source IDs and exact locators for every row.
4. Run `pnpm test:provenance` from the repository root.
5. Open a focused PR that explains what the ledger records and explicitly confirms whether runtime behaviour or public text changes. If runtime behaviour changes, it belongs in a **separate** owner-approved PR.

## Initial source register

| Source ID | Primary coverage | Evidence tier |
|---|---|---|
| `historical-manus-multibird-2025` | Recovered original multi-bird research | Historical project evidence |
| `historical-pigeon-research-2025` | Original pigeon nutrition/formulation research | Historical project evidence |
| `historical-raw-legume-2025` | Original raw-legume safety research | Historical project evidence; weak source quality flagged |
| `finchinfo-nutrition` | Canary/finch/passserine nutrition context | Owner guidance with cited research |
| `merck-columbiformes-2025` | Pigeon and dove nutrition | Peer-reviewed veterinary reference |
| `sales-janssens-2003` | Domestic pigeon nutrition review | Peer-reviewed review |
| `merck-psittacines-2025` | Parrot, African Grey, Budgie nutrition | Peer-reviewed veterinary reference |
| `koutsos-2001-psittacines` | Psittacine diet physiology/method | Peer-reviewed review |
| `peron-grosset-2013` | Adult psittacine diet limitations | Peer-reviewed review |
| `vca-african-grey-feeding` | African Grey companion-care context | Veterinary owner guidance |
| `merck-poultry-2024` | Chicken nutrition requirements | Peer-reviewed veterinary reference |
| `nas-poultry-2026` | Chicken nutrition book | National Academies consensus report |
| `clinical-avian-medicine-2006` | Cross-species nutrition, toxicology, pigeon, galliform, and canary/finch chapters | Academic veterinary book |
| `historical-preaudit-profile-config` | Preserved pre-audit multi-bird profile configuration | Historical project configuration |
| `runtime-v3-profile-config` | Current V3 `birds.ts` profile configuration | Runtime configuration snapshot |

The detailed machine-readable entries, scopes, URLs, and limitations are in [`sources.json`](./sources.json).
