# Ingredient Catalog Reconciliation

**Status:** Completed 2026-08-15. This is a preservation and comparison record, not approval to change formulation data.

## Result

The active V3 catalog is **not smaller** than the historical expanded reference. The apparent reduction came from an old README that listed a short illustrative subset of ingredients rather than the complete database.

| Preserved source | Grain, legume, and seed records | Herb and supplement records | Total compared records | Relationship to V3 |
|---|---:|---:|---:|---|
| V0 original standalone Python | 19 | — | 19 | Every V0 ingredient is present in V3. |
| V1 expanded Python reference | Combined records | Combined records | 89 | V3 contains every historical item except `popcorn`; it adds eight ingredient records. |
| Prior-main nested web catalog | 70 | 26 | 96 | Exact match to active V3. |
| **Active V3 catalog** | **70** | **26** | **96** | Canonical active catalog. |

The V3 additions beyond the V1 expanded reference are `black_beans`, `corn_red`, `lima_beans`, `peanuts`, `peanuts_raw`, `peanuts_roasted`, `split_lentils`, and `split_peas`.

## One historical record to review

`popcorn` exists in the V1 expanded Python reference but is not a separate V3 ingredient record. It has **not** been restored automatically because adding it would change the current human-made data catalog.

Popcorn is a type of maize, so it belongs to the same broad **grain** category as corn and maize. It is **not**, however, an equal nutritional alias within the preserved database: the historical popcorn record is 13% protein, 74% carbohydrates, 4% fat, and 15% fiber, whereas active V3 yellow corn and maize are 9% protein, 72% carbohydrates, 4.5% fat, and 2% fiber. The historical record therefore models popcorn as a higher-fiber ingredient, not ordinary corn. No formulation data has changed.

| Option | Effect |
|---|---|
| Leave V3 unchanged | Preserve the current active catalog; do not claim that popcorn is nutritionally identical to yellow corn or maize. |
| Add a separate popcorn entry | Requires owner approval of its nutrition values, preparation note, category, and species compatibility. |
| Add an inventory-only alias | Allow an unseasoned popcorn-kernel entry to map to a separately documented conservative profile; this still requires owner approval because it affects calculator input behaviour. |

## Method

[`../scripts/compare-ingredient-history.mjs`](../scripts/compare-ingredient-history.mjs) compares exact identifiers from the original Python files, V1, V2, prior-main archive, and active V3. It is intentionally read-only and does not alter source data.
