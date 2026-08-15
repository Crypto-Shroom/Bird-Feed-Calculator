# Ingredient Catalog Reconciliation

**Status:** Completed 2026-08-15. This is a preservation and comparison record, not approval to change formulation data.

## Result

The active V3 catalog is **not smaller** than the historical expanded reference. The apparent reduction came from an old README that listed a short illustrative subset of ingredients rather than the complete database.

| Preserved source | Grain, legume, and seed records | Herb and supplement records | Total compared records | Relationship to V3 |
|---|---:|---:|---:|---|
| V0 original standalone Python | 19 | — | 19 | Every V0 ingredient is present in V3. |
| V1 expanded Python reference | Combined records | Combined records | 89 | Every historical V1 item is present in V3. |
| Prior-main nested web catalog | 70 | 26 | 96 | Active V3 retains this catalog and adds the owner-approved popcorn record. |
| **Active V3 catalog** | **71** | **26** | **97** | Canonical active catalog. |

The V3 additions beyond the V1 expanded reference are `black_beans`, `corn_red`, `lima_beans`, `peanuts`, `peanuts_raw`, `peanuts_roasted`, `split_lentils`, and `split_peas`.

## One historical record to review

The product owner approved popcorn as its own active grain record on 2026-08-15 using the preserved historical values: 13% protein, 74% carbohydrates, 4% fat, and 15% fiber. The inventory picker and selected-inventory card display the exact note: **“Popcorn is not the same as corn nutritionally.”** It is categorized as a grain, but is not an alias for yellow corn or maize.

## Method

[`tools/compare-ingredient-history.mjs`](tools/compare-ingredient-history.mjs) compares exact identifiers from the original Python files, V1, V2, prior-main archive, and active V3. It is intentionally read-only and does not alter source data.
