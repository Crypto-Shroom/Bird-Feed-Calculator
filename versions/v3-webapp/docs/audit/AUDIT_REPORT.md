# Multi-Bird Mix Planner: Quality Audit

**Audit date:** 14 August 2026  
**Author:** Manus AI

> **Scope boundary:** This application estimates the macronutrient composition and category balance of a seed/grain batch. It is not a complete-diet formulation system, diagnostic tool, treatment plan, or substitute for an avian veterinarian or poultry-nutrition professional.

## Executive assessment

The active preview is now a materially stronger baseline than the supplied GitHub repository. The running application is a managed WebDev project whose original checkpoint is dated **16 February 2026**; the GitHub repository’s latest commit is dated **18 December 2025**. They are not connected to the same Git remote, so work in the active preview has **not** been automatically pushed to GitHub.

The original implementation provided a useful mix-planning interface, but it overclaimed certainty: it labelled seed mixes as “precision nutrition,” used hard-coded analysis values, allowed safety logic to diverge between the picker and optimizer, and treated the same result as though it were sufficient evidence of a complete ration. The revised application is now deterministic, has shared safety checks, exposes target misses as advisories, and explicitly frames each mode according to its appropriate role.

| Area | Audit result | Current status |
|---|---|---|
| Active project vs. supplied GitHub repository | Active project is newer and contains the working six-bird UI; GitHub has an older, nested copy and is not the active remote. | **Use the active preview as the baseline.** |
| Calculation engine | The interface now uses `MultibirMixCalculator`, which produces repeatable results without randomized scoring. | **Corrected and tested.** |
| Ingredient safety | Picker and optimizer share a conservative processing-status rule; raw soybeans and unverified legumes are blocked. | **Corrected and tested.** |
| Complete-diet claims | Companion-bird and chicken modes now state that the planner estimates a seed/grain or scratch supplement, not a complete ration. | **Corrected.** |
| Nutrient database | Data remains a static in-code lookup table with no source provenance, micronutrients, digestibility, or energy metadata. | **Important limitation remains.** |
| Automated coverage | A deterministic smoke test covers 21 bird/situation combinations and raw-legume exclusion. | **Added.** |

## Repository comparison

The active project uses a managed S3-backed remote and was based on checkpoint `611601e` before this audit. The supplied repository uses `https://github.com/Crypto-Shroom/Bird-Feed-Calculator.git` and its most recent commit is `476ec59`. The GitHub repository contains a deeply nested multi-bird project copy rather than a cleanly maintained mirror of the active WebDev project.

| Comparison point | Active project | Supplied GitHub repository |
|---|---|---|
| Latest baseline commit | 16 February 2026 | 18 December 2025 |
| Connected remote | Managed WebDev storage | GitHub |
| Six-bird selection interface | Present and live | Present in a nested historical copy |
| Current safety corrections | Present in the working tree | Not present |
| Automated calculator check | Present as `pnpm test:calculator` | Not present in the reviewed copy |

**Conclusion:** do not replace the active project with the GitHub repository. If GitHub should become the canonical backup or collaboration repository, export the current audited project first and then push a deliberate, reviewed snapshot; it should not be assumed to have received these changes.

## Architecture review

The live page previously calculated results with the legacy pigeon-only calculator while also rendering multi-bird controls. The page is now wired only to `MultibirMixCalculator`, with bird profile, category-target, and care-guidance data coming from `birds.ts`. The redesigned engine follows one data flow:

1. The picker separates eligible items from blocked items using bird compatibility, species toxicity, raw-toxicity, and processing-status checks.
2. The calculator applies those same checks again, so manually retained unsafe inventory cannot leak into a formula.
3. A deterministic greedy optimizer scores weighted macronutrient and category estimates, constrained by available inventory and batch size.
4. The result reports the actual batch total and produces warnings rather than silently claiming compliance when profile ranges cannot be achieved.

This is a maintainable improvement, but the model is still **an estimator**, not a least-cost or nutrient-complete formulation solver. The current data model captures only protein, carbohydrate, fat, fiber, and broad grain/legume/seed categories. It does not capture calcium, phosphorus, amino acids, vitamins, trace minerals, dry matter, metabolizable energy, digestibility, cultivar, product form, or laboratory source. Consequently, no formula should be described as nutritionally complete on the basis of the present data.

## Content and safety review

Veterinary guidance consistently indicates that all-seed diets are nutritionally incomplete for companion birds. The MSD Veterinary Manual explains that seeds should not make up most of a pet bird’s diet and that seed-based diets have calcium-to-phosphorus and amino-acid deficiencies.[1] [2] VCA similarly advises that seed mixes for pigeons and doves are deficient in calcium, vitamin A, and other nutrients, and recommends pellets as a substantial dietary component.[3]

Chicken mode required the clearest correction. Extension guidance identifies complete layer feed as the nutritional base for laying hens; layer feed typically contains approximately 16% protein and 3–4% calcium. Scratch grain is an optional supplement that should be fed sparingly, rather than substituted for a complete ration.[4] [5]

| Correction applied | Why it matters |
|---|---|
| Replaced “Precision Nutrition” language with a seed/grain batch-estimate boundary. | Macronutrients alone do not establish complete-diet adequacy. |
| Reframed parrots, African greys, budgies, and canaries as seed/grain enrichment modes. | Companion birds require a formulated diet plus appropriate fresh foods; seed should not be the primary diet.[1] |
| Reframed chicken mode as a scratch-grain supplement. | Whole grains or scratch do not supply the complete nutrient profile of a validated poultry ration.[4] |
| Removed therapeutic herb/supplement recommendations and water-additive dosing. | Supplements in water can reduce water intake or degrade; veterinary review is appropriate for individual supplementation.[6] |
| Blocked raw soybeans and unverified legumes by default. | Soybeans and other legumes can have processing-dependent antinutritional factors; safe use depends on feed-grade processing and professional formulation.[7] [8] |
| Replaced pigeon-only water, grit, and medical wording with bird-specific guidance. | Grit needs and diet foundations differ by bird type. |

The current toxicity information should continue to be treated as a conservative exclusion system, not a comprehensive toxicology database. Avocado, chocolate, caffeine, alcohol, onions/garlic, and some fruit pits/seeds are established hazards for pet birds; product content should keep directing potential poisonings to a veterinarian or poison-control resource rather than offering treatment instructions.[2] [9]

## Interface and accessibility review

The redesigned interface now uses reader-facing bird names, labelled inputs, `aria-pressed` state on bird tiles, tooltips/labels that explain nutrition status, and a picker with embedded search. It presents green only for in-range estimates and red for out-of-range estimates. It also exports a plain-text batch card that includes the scope boundary and all active warnings.

The user experience now prioritizes honest feedback. For example, the default pigeon inventory produces a visible advisory when estimated fiber, grain, or seed ratios are outside the selected profile’s modeled range; it does not mask those misses with “high efficiency” or a fabricated energy-density value.

## Reconciliation with the original requested features

The following table records the effect of the audit on the features you explicitly requested. Most were retained or strengthened. Three areas were deliberately narrowed because the previous wording or behavior could imply a medical or nutritionally complete recommendation beyond what the data can support.

| Original requested feature | Current status | What changed |
|---|---|---|
| Six selectable species | Retained | Pigeon, Parrot, African Grey, Budgie, Canary, and Chicken remain selectable. Labels are now reader-facing rather than raw identifiers. |
| Bird-specific profiles and chicken egg-laying mode | Retained | All situations remain. Fixed daily gram instructions were removed because they were not sourced or individualized. |
| Compatible-first picker with a separate incompatible section | Strengthened | Search now lives inside the picker. Unsafe, processing-dependent, and species-incompatible options appear in a non-selectable section with a reason. |
| Toxic legume warnings and preparation guidance | Strengthened | Unsafe inventory remains red and is now excluded from the formula. Raw soybeans and additional processing-dependent legumes are also blocked. |
| Bird-specific toxicity checks | Retained and strengthened | The picker and optimizer apply the same checks, preventing a manual inventory item from bypassing the UI. |
| Green/red nutrition status with explanation hints | Retained | In-range estimates are green; out-of-range estimates are red. Info hints describe the displayed estimate range. |
| Bracketed preparation instructions and detailed list below formula | Retained | Both are present: bracketed preparation notes in inventory and a preparation section under the formula. |
| Separate water and grit guidance | Retained and corrected | Guidance now changes by bird type. Chicken mode distinguishes insoluble grit from oyster shell. |
| Herb recommendations by species and situation | **Deliberately removed** | Therapeutic herb, supplement, and water-dosage recommendations were replaced with an enrichment boundary because their claims and doses were not supported by reliable species-specific evidence. |
| Grain compatibility warning | Retained | The calculator flags a mix with only a grain that should be paired and suggests additional grain diversity. |
| Detailed analysis below breakdown | Retained and corrected | It now explains the actual deterministic calculation and no longer displays hard-coded “high efficiency” or energy values. |
| Research citations | Retained and expanded | Cited research notes and this audit report are included in the project documentation. |
| Original pigeon-only version | Preserved | The older implementation was not deleted; the active interface is simply routed through the multi-bird engine. |
| Multi-bird preview | Retained | The current active preview is the multi-bird planner. |

Two other behavior changes are important to call out. First, the optimiser no longer includes random scoring, so the same inputs now return the same result every time. Second, chicken egg-laying mode is intentionally treated as a **scratch-supplement** estimate rather than a homemade complete layer-ration formulation; this protects against implying that a four-macronutrient calculation can validate the calcium, phosphorus, vitamin, mineral, amino-acid, and energy needs of a laying flock.

## Verification performed

| Check | Result |
|---|---|
| TypeScript validation: `pnpm check` | Passed |
| Deterministic calculator verification: `pnpm test:calculator` | Passed for 21 bird/situation scenarios plus raw-legume exclusion |
| Final production build: `pnpm build` | Passed; Vite reported a 695 KB JavaScript bundle (200 KB gzip) warning only |
| Live preview: pigeon mode | Confirmed reader-facing labels, scope text, status colors, warnings, and batch calculation |
| Live preview: chicken mode | Confirmed chicken-specific water, grit, complete-ration, and scratch-supplement guidance |
| Live preview: ingredient picker | Confirmed compatible choices are distinct from blocked raw beans, soybeans, and processing-dependent legumes |

## Remaining limitations and recommended next work

The highest-value remaining work is to rebuild the ingredient dataset with verified provenance. Each ingredient should carry a source, publication date, species applicability, product form, processing state, nutrient basis, and laboratory or authoritative table reference. That should occur before widening formula claims or adding more target profiles.

The next technical priority is to replace the current weighted heuristic with a transparent, constraint-based solver only after the data model includes complete nutrient constraints. For chickens, any complete-ration formulation should include at least energy, protein, amino acids, calcium, phosphorus, vitamins, and minerals. For companion birds, the tool should remain an enrichment or supplemental-mix planner unless a qualified avian nutritionist supplies species-specific complete-diet requirements and ingredient data.

Finally, GitHub should be handled deliberately. The current project is **not** writing to the supplied repository. The audited version should be checkpointed first, then exported or pushed as a new reviewed commit if you choose GitHub as the canonical repository.

## References

[1] [MSD Veterinary Manual, “Feeding a Pet Bird”](https://www.merckvetmanual.com/bird-owners/choosing-and-taking-care-of-a-pet-bird/feeding-a-pet-bird)

[2] [MSD Veterinary Manual, “Nutritional Diseases of Pet Birds”](https://www.msdvetmanual.com/exotic-and-laboratory-animals/pet-birds/nutritional-diseases-of-pet-birds)

[3] [VCA Animal Hospitals, “Feeding Pigeons and Doves”](https://vcahospitals.com/know-your-pet/pigeons-and-doves-feeding)

[4] [Oregon State University Extension, “How to feed your laying hens”](https://extension.oregonstate.edu/catalog/pnw-477-how-feed-your-laying-hens)

[5] [Alabama Extension, “Feeding the Laying Hen”](https://www.aces.edu/blog/topics/farming/backyard-small-poultry-flock-management-series-feeding-the-laying-hen/)

[6] [MSD Veterinary Manual, “Nutritional Disorders of Pet Birds”](https://www.msdvetmanual.com/bird-owners/disorders-and-diseases-of-birds/nutritional-disorders-of-pet-birds)

[7] [University of Georgia Poultry Science Extension, “Antinutritional Factors”](https://poultry.caes.uga.edu/extension/poultry-nutrition/soybeans/antinutritional-factors.html)

[8] [David et al., “Feeding Value of Lupins, Field Peas, Faba Beans and Chickpeas for Poultry: An Overview,” *Animals* (2024)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10886283/)

[9] [Oregon Veterinary Medical Association, “Keep Pet Birds Safe from Common Household Toxins”](https://www.oregonvma.org/care-health/companion-animals/health-safety/keep-pet-birds-safe-from-common-household-toxins)
