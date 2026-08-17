# Protected Historical Baseline

The following files are preserved in the repository and remain the protected original research corpus for reconciliation. They are the source of project intent and must be traced before a later change alters existing nutrition values, formulas, safety rules, compatibility, or public wording.

| Repository file | Original domain | Ledger source ID | Notes |
|---|---|---|---|
| [`v1-original/pigeon_nutrition_research.md`](../../v1-original/pigeon_nutrition_research.md) | Pigeon nutrition targets and feeding context | `historical-pigeon-research-2025` | Load-bearing pigeon-only research. |
| [`v1-original/toxic_legumes_research.md`](../../v1-original/toxic_legumes_research.md) | Raw-legume safety and preparation | `historical-raw-legume-2025` | Preserved claim set, explicitly flagged as requiring stronger source-level review. |
| [`v1-original/expanded_ingredients.py`](../../v1-original/expanded_ingredients.py) | Original nutrient catalog | `historical-pigeon-research-2025` | Data-lineage comparison reference; not a per-value citation source. |
| [`v2-vite-fix/RESEARCH_REFERENCES.md`](../../v2-vite-fix/RESEARCH_REFERENCES.md) | December 2025 reference list | `historical-pigeon-research-2025` | Early named source index. |
| [`v2-vite-fix/bird_nutrition_research.md`](../../v2-vite-fix/bird_nutrition_research.md) | Original multi-bird profiles, hazards, and compatibility notes | `historical-manus-multibird-2025` | Corresponds to the owner-recovered Manus research. |
| [`v2-vite-fix/pigeon_nutrition_research.md`](../../v2-vite-fix/pigeon_nutrition_research.md) | Pigeon-specific research preserved in later local workspace | `historical-pigeon-research-2025` | Cross-check against pigeon-only material. |
| [`v2-vite-fix/toxic_legumes_research.md`](../../v2-vite-fix/toxic_legumes_research.md) | Raw-legume safety preserved in later local workspace | `historical-raw-legume-2025` | Same limitation applies: research quality must be assessed, not assumed. |
| [Recovered Manus `bird_nutrition_research.md`](https://manus.im/share/file/2afc85ee-4513-4e12-a705-2c3156d0813c) | Original Manus multi-bird research | `historical-manus-multibird-2025` | Independently confirms the original Manus research stream. |

## Governing interpretation

The baseline governs **what must be preserved and reconciled**, not automatic acceptance of every historical statement. Where a later source is stronger or more specific, the ledger records both rather than erasing the historical entry. A future owner-reviewed PR decides any live outcome.

This protects against both failure modes: silently retaining an unsupported historical claim and silently deleting a researched historical claim because it was not represented in a current implementation file.
