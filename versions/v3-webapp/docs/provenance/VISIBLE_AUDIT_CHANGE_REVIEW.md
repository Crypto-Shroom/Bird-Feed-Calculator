# Visible Audit Change Review

**Status:** Restoration ledger. This record compares the current six-bird interface to the preserved pre-audit page (`611601e`) and makes the pre-audit visual/copy baseline the default. It does **not** change ingredient values, targets, feeding formulations, safety eligibility, or calculator logic.

## Restoration rule

> If an audit changed visible wording, colour treatment, labels, or layout without a specific product-owner approval, restore the preserved interface by default. Retain only changes that were explicitly approved, required for the six-bird engine, or necessary to avoid reintroducing a known non-calculated claim.

## Automatically restored in this pass

| Interface area | Restored baseline | Status |
|---|---|---|
| Formula-table category badges | Grain = amber, legume = emerald, seed = stone. | Restored. |
| Analysis category bars | Grain = amber, legume = emerald, seed = stone. | Restored. |
| Nutrition cards | The original multi-colour progress-bar treatment and “Carbs” label. | Restored. |
| Formula warning cards | Original left-border treatment and `Critical Issue`/`Advisory` headings. | Restored. |
| Missing-category panel | Original red “Missing Essential Ingredients” presentation, while retaining the approved explicit reasons such as grains being essential for energy and carbohydrates. | Restored. |
| Batch and tab labels | `Optimized Mix`, `Herbs & Supplements`, `Detailed Analysis`, and `Recommended Formula`. | Restored. |
| Pigeon profile panel | Original description, daily-feeding copy, water/grit presentation, and smaller contextual note. | Restored earlier; retained. |
| Footer reminder | Original “Important Safety Reminders” form, with the requested `exotics vet` terminology. | Restored. |
| Audit-only explanatory panel | “What this result means” panel. | Removed; it was new audit copy without product-owner approval. |

## Intentionally retained visible changes

| Change | Reason for retaining it | Product-owner action needed |
|---|---|---|
| Six-bird selector and species-specific situations | This is the approved multi-bird product capability, not an audit-only visual change. | None. |
| Searchable compatible/incompatible ingredient picker | The product owner specifically values the inventory flow and explicit red toxicity messages. | None. |
| Explicit raw-toxicity blocking, including the red black-bean message | This is an approved safety behaviour. | None. |
| Ingredient preparation labels in the inventory and formula output | This was explicitly requested. | None. |
| Herb benefits, dosage, frequency, and notes | This display was explicitly restored at product-owner request. | None. |
| Deterministic multi-bird engine and practical analysis suggestions | The product owner approved retaining the multi-bird engine. The older analysis panel contained non-calculated static values (for example, a fixed energy-density number), which must not be restored as if they were current formula results. | None for the present implementation; optimizer redesign remains separately approval-gated. |
| Functional recipe export | This is an additive, working feature; the preserved button did not export. | Confirm whether you wish to retain it. |

## Remaining approval choice

The only intentionally retained, non-required interface change in this list is the functional **Export recipe** button. It does not modify the formula and can remain as a practical addition, or it can be removed if strict pre-audit visual parity is preferred.

## Future-change control

Any future audit must append a row to this ledger before changing user-visible copy, colours, alerts, tabs, headings, or layout. The row must state whether the change has product-owner approval. If it does not, the default outcome is restoration rather than reframing.
