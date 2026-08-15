# Active Data Catalog

This folder is the navigation point for the **active V3 data model**. It does not duplicate runtime data, so updates cannot silently drift between a catalog copy and the calculator.

| Data domain | Canonical V3 location | Contents |
|---|---|---|
| Ingredients and herbs | [`../versions/v3-webapp/client/src/lib/data.ts`](../versions/v3-webapp/client/src/lib/data.ts) | Ingredient macros/categories/notes, legacy pigeon data, and herb recommendations. |
| Bird profiles and targets | [`../versions/v3-webapp/client/src/lib/birds.ts`](../versions/v3-webapp/client/src/lib/birds.ts) | Six species, situations, nutrition/category targets, feeding and care copy. |
| Bird-specific safety | [`../versions/v3-webapp/client/src/lib/bird-safety.ts`](../versions/v3-webapp/client/src/lib/bird-safety.ts) | Compatibility and species-specific toxicity rules. |
| Shared safety and preparation | [`../versions/v3-webapp/client/src/lib/safety.ts`](../versions/v3-webapp/client/src/lib/safety.ts) | Hard raw-toxicity exclusions, preparation instructions, and source/treat guidance. |
| Research and provenance | [`../versions/v3-webapp/docs/provenance/`](../versions/v3-webapp/docs/provenance/) | Evidence records, processing reviews, and source notes. |
| Product governance | [`../versions/v3-webapp/docs/governance/`](../versions/v3-webapp/docs/governance/) | Product-owner approval and change-control records. |

> This catalog is intentionally for seed, herb, nutrition, safety, and provenance data. It does not define future user profiles, saved recipes, or account data.

## Data-change rule

Do not change a human-authored ingredient value, nutrition target, profile name, feeding recommendation, herb formulation, or safety eligibility without product-owner approval and an accompanying provenance or governance record.
