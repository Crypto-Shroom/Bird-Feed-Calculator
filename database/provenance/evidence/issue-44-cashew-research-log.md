# Issue #44 — Cashew Six-Bird Evidence Research Log

**Status:** Evidence-only provenance research log; unresolved rows stay explicit.
**As of:** 2026-08-19 (ledger `lastReviewedAt`).
Relates to #44.
**Scope:** Commercially prepared edible cashew kernel, evaluated for two distinct exact forms:
1. `plain raw cashew kernel, unsalted, unflavoured, and shell-free`
2. `plain dry-roasted cashew kernel, unsalted, unflavoured, and shell-free`

**Non-goals:** Evidence-only research record. It does not add an active ingredient catalog item, nutrient row, optimizer choice, inventory default, safety rule, or visitor-facing wording to `v3-webapp/client/src/lib/data.ts` or `v3-webapp/client/src/lib/safety.ts`.

---

## P0 — Source Governance & Safety Boundaries

Every source cited here is registered in `database/provenance/sources.json`, and every outcome and source ID below mirrors the two cashew records in `database/provenance/food-reviews.json`. The research covers commercially prepared edible kernels only. Shell-on or unprocessed cashew material is excluded.

### Processing & Form Exclusions
- **In scope:** Shell-free, unsalted, unflavoured, plain raw or plain dry-roasted cashew kernels. The ledger's pigeon preparation rule is chopping to small-seed size.
- **Excluded:** Shell-on or unprocessed cashew material, oil-roasted or fried, seasoned, chocolate-coated, damaged, moldy or rancid nuts, oversized pieces, and cashew-only diets (the ledger's processing rules). Cashew reject meal is not the exact whole-kernel form (see P3).

---

## P1 — Six-Bird Task Board & Form Matrices

### Form 1: Plain Raw Cashew Kernel (Unsalted, Unflavoured, Shell-Free)

| Bird | First-Pass Search Path | Targeted Follow-Up Search | Outcome | Primary Source IDs & Locator |
| --- | --- | --- | --- | --- |
| **Pigeon** | Not recorded in the ledger (`firstPassSearch` is null) | `pigeon cashew raw dry roasted unsalted veterinarian`, `pigeon cashew kernel chopped small veterinary`, `Taube Cashewkerne roh geröstet ungesalzen Fütterung` | `limited` | `petco-pigeon-cashew-2019`, `vca-pigeon-dove-feeding`, `stadttaubenhilfe-crop-obstruction`, `tiermedizinportal-avian-obstipation-2022` — Petco veterinarian Q&A: chop cashew pieces to small-seed size to avoid esophageal obstruction; VCA pigeon/dove small-beak and manageable-piece guidance. |
| **Parrot** | Not recorded in the ledger (`firstPassSearch` is null) | `parrot cashew raw dry roasted unsalted veterinarian`, `cashew kernel parrot treat raw unsalted`, `Papagei Cashewkerne roh geröstet ungesalzen` | `limited` | `aav-feeding-birds-2021`, `lafeber-nut-meats-2026` — Lafeber parrot nut-meats answer on raw or dry-roasted unsalted nuts; AAV general nut moderation guidance. |
| **African Grey** | Not recorded in the ledger (`firstPassSearch` is null) | `African Grey cashew raw dry roasted unsalted veterinarian`, `African Grey cashew kernel treat avian vet`, `Graupapagei Cashewkerne roh geröstet ungesalzen` | `unresolved` | `vca-african-grey-feeding`, `merck-psittacines-2025` — VCA African Grey tree-nut guidance; Merck psittacine nutrition and species-variation sections. General guidance does not establish the exact commercially prepared cashew form or a species-specific portion. |
| **Budgie** | Not recorded in the ledger (`firstPassSearch` is null) | `budgie cashew raw dry roasted unsalted veterinarian`, `budgerigar cashew kernel treat avian vet`, `Wellensittich Cashewkerne roh geröstet ungesalzen` | `unresolved` | `merck-psittacines-2025`, `aav-feeding-birds-2021` — Merck psittacine species-variation sections; AAV general companion-parrot nut guidance. Does not establish commercially prepared cashew kernel for budgies. |
| **Canary** | Not recorded in the ledger (`firstPassSearch` is null) | `canary cashew raw dry roasted unsalted veterinarian`, `canary bird cashew kernel treat avian vet`, `Kanarienvogel Cashewkerne roh geröstet ungesalzen` | `unresolved` | `finchinfo-nutrition` — Finch Information Center canary/passerine nutrition context. Does not name cashew or establish this form. |
| **Chicken** | Not recorded in the ledger (`firstPassSearch` is null) | `chicken cashew kernel raw dry roasted unsalted poultry study`, `chicken whole cashew nuts feeding backyard poultry`, `Hühner Cashewkerne roh geröstet ungesalzen Fütterung` | `unresolved` | `akande-cashew-reject-meal-2015`, `merck-poultry-2024` — Akande et al. laying-hen study of full-fat and defatted cashew reject meal in formulated diets; Merck poultry nutrient-balance context. Concerns processed reject meal, not whole kernels. |

---

### Form 2: Plain Dry-Roasted Cashew Kernel (Unsalted, Unflavoured, Shell-Free)

| Bird | First-Pass Search Path | Targeted Follow-Up Search | Outcome | Primary Source IDs & Locator |
| --- | --- | --- | --- | --- |
| **Pigeon** | Not recorded in the ledger (`firstPassSearch` is null) | `pigeon cashew raw dry roasted unsalted veterinarian`, `pigeon cashew kernel chopped small veterinary`, `Taube Cashewkerne roh geröstet ungesalzen Fütterung` | `unresolved` | `merck-columbiformes-2025`, `griffin-dean-cashew-2017` — Merck pigeon/dove diet sections; Griffin & Dean raw/dry-roasted product distinction. No pigeon-specific dry-roasted cashew feeding evidence found. |
| **Parrot** | Not recorded in the ledger (`firstPassSearch` is null) | `parrot cashew raw dry roasted unsalted veterinarian`, `cashew kernel parrot treat raw unsalted`, `Papagei Cashewkerne roh geröstet ungesalzen` | `limited` | `aav-feeding-birds-2021`, `lafeber-nut-meats-2026`, `swicegood-nuts-birds-2000`, `griffin-dean-cashew-2017` — Lafeber parrot nut-meats answer explicitly accepting dry-roasted unsalted nuts in moderation; AAV small nut-piece enrichment guidance. |
| **African Grey** | Not recorded in the ledger (`firstPassSearch` is null) | `African Grey cashew raw dry roasted unsalted veterinarian`, `African Grey cashew kernel treat avian vet`, `Graupapagei Cashewkerne roh geröstet ungesalzen` | `unresolved` | `vca-african-grey-feeding`, `griffin-dean-cashew-2017` — VCA African Grey guidance on limited tree nuts and avoiding oil-cooked foods; Griffin & Dean dry-roasted product definition. |
| **Budgie** | Not recorded in the ledger (`firstPassSearch` is null) | `budgie cashew raw dry roasted unsalted veterinarian`, `budgerigar cashew kernel treat avian vet`, `Wellensittich Cashewkerne roh geröstet ungesalzen` | `unresolved` | `merck-psittacines-2025`, `griffin-dean-cashew-2017` — Merck psittacine species-variation sections; Griffin & Dean dry-roasted product definition. |
| **Canary** | Not recorded in the ledger (`firstPassSearch` is null) | `canary cashew raw dry roasted unsalted veterinarian`, `canary bird cashew kernel treat avian vet`, `Kanarienvogel Cashewkerne roh geröstet ungesalzen` | `unresolved` | `finchinfo-nutrition`, `griffin-dean-cashew-2017` — Finch Information Center canary/passerine nutrition context; Griffin & Dean dry-roasted product definition. |
| **Chicken** | Not recorded in the ledger (`firstPassSearch` is null) | `chicken cashew kernel raw dry roasted unsalted poultry study`, `chicken whole cashew nuts feeding backyard poultry`, `Hühner Cashewkerne roh geröstet ungesalzen Fütterung` | `unresolved` | `akande-cashew-reject-meal-2015`, `merck-poultry-2024`, `griffin-dean-cashew-2017` — Akande et al. cashew reject-meal laying-hen study; Merck poultry nutrient-balance context; Griffin & Dean dry-roasted product definition. |

---

## P2 — Key Registered Sources (titles as in `sources.json`)

1. `akande-cashew-reject-meal-2015`: "Cashew reject meal in diets of laying chickens: nutritional and economic suitability"
2. `lafeber-nut-meats-2026`: "Nut Meats"
3. `petco-pigeon-cashew-2019`: "Is it safe to feed my pigeon cashew nuts? How should I prepare them?"
4. `griffin-dean-cashew-2017`: "Nutrient Composition of Raw, Dry-Roasted, and Skin-On Cashew Nuts"
5. `aav-feeding-birds-2021`: "Feeding Birds"
6. `vca-african-grey-feeding`: "African Grey Parrots - Feeding"
7. `merck-psittacines-2025`: "Nutrition in Psittacines"
8. `finchinfo-nutrition`: "Nutritional Requirements"

---

## P3 — Counter-Review & Verification

1. **Chicken Cashew Reject Meal vs. Whole Kernels:** Akande et al. evaluated full-fat and defatted cashew reject meal in formulated laying-hen diets. The register limitation states that reject meal is not the exact commercially prepared whole-kernel form and does not establish companion-bird suitability or whole-cashew treat portions, so both chicken rows stay unresolved.
2. **Raw vs. Dry-Roasted Distinction:** Raw and dry-roasted cashews are distinct food forms. Parrot guidance (Lafeber) supports raw or dry-roasted unsalted nuts in moderation as limited treats, with no universal portion established. Pigeon guidance (Petco) supports small-seed-size preparation for cashew and gives the pigeon raw row `limited`; it does not establish dry-roasted cashew, so the pigeon dry-roasted row stays `unresolved`.
3. **No Active Code / Data Alteration:** This research log provides provenance traceability. No active ingredient catalog (`data.ts`), safety rules (`safety.ts`), or target profiles (`birds.ts`) are changed.
