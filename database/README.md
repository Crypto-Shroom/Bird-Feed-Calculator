# Active Data Catalog

This catalog identifies the active V3 data sources and stores shared, human-reviewable provenance where a single canonical record is required.

| Data domain | Canonical V3 location | Content |
|---|---|---|
| Ingredients and herbs | [`../v3-webapp/client/src/lib/data.ts`](../v3-webapp/client/src/lib/data.ts) | Ingredient values, categories, preparation notes, legacy pigeon data, and herbs. |
| Bird profiles and targets | [`../v3-webapp/client/src/lib/birds.ts`](../v3-webapp/client/src/lib/birds.ts) | Species, situations, nutrition/category targets, and care copy. |
| Bird-specific safety | [`../v3-webapp/client/src/lib/bird-safety.ts`](../v3-webapp/client/src/lib/bird-safety.ts) | Compatibility and species-specific toxicity rules. |
| Shared safety and preparation | [`../v3-webapp/client/src/lib/safety.ts`](../v3-webapp/client/src/lib/safety.ts) | Raw-toxicity exclusions and preparation guidance. |
| Herb provenance and compatibility | [`herb-provenance.mts`](herb-provenance.mts) | Canonical academic-source registry, evidence scope, and bird-aware automatic-suggestion eligibility. The V3 application imports this file through its stable herb-evidence adapter. |
| Supporting evidence notes | [`../v3-webapp/docs/provenance/`](../v3-webapp/docs/provenance/) | Long-form evidence and review records. |
| Catalog history | [`CATALOG_RECONCILIATION.md`](CATALOG_RECONCILIATION.md) | V0/V1/V2/prior-main/V3 ingredient and herb coverage comparison. |

This directory is for seed, herb, nutrition, safety, and provenance data. It does not define future user accounts, saved recipes, or user profiles.
