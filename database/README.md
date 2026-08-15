# Active Data Catalog

This catalog points to the active V3 data sources without duplicating them.

| Data domain | Canonical V3 location | Content |
|---|---|---|
| Ingredients and herbs | [`../versions/v3-webapp/client/src/lib/data.ts`](../versions/v3-webapp/client/src/lib/data.ts) | Ingredient values, categories, preparation notes, legacy pigeon data, and herbs. |
| Bird profiles and targets | [`../versions/v3-webapp/client/src/lib/birds.ts`](../versions/v3-webapp/client/src/lib/birds.ts) | Species, situations, nutrition/category targets, and care copy. |
| Bird-specific safety | [`../versions/v3-webapp/client/src/lib/bird-safety.ts`](../versions/v3-webapp/client/src/lib/bird-safety.ts) | Compatibility and species-specific toxicity rules. |
| Shared safety and preparation | [`../versions/v3-webapp/client/src/lib/safety.ts`](../versions/v3-webapp/client/src/lib/safety.ts) | Raw-toxicity exclusions and preparation guidance. |
| Provenance | [`../versions/v3-webapp/docs/provenance/`](../versions/v3-webapp/docs/provenance/) | Evidence and review records. |

This directory is for seed, herb, nutrition, safety, and provenance data. It does not define future user accounts, saved recipes, or user profiles.
