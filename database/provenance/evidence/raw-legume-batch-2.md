# Raw Legume Batch 2 — Five Food/Form Reviews

> **Provenance-only boundary.** This batch records evidence for five protected historical raw-legume forms. It does **not** alter calculator outcomes, active inventory options, recommended formulas, safety-copy wording, nutrient values, Firestore behavior, or visitor-visible instructions.

## Scope and completion standard

This batch completes the six-bird evidence records for **raw dried lima beans**, **raw dried fava/broad beans**, **raw dried black beans**, **raw dried pinto beans**, and **raw dried navy beans**. Each review is limited to the named raw dried form. Cooked, soaked, sprouted, canned, fermented, milled, and processed bean forms remain distinct.

Every food/form received a first species-specific search for every supported bird. Where that first pass did not establish a direct outcome, a second targeted search using additional terminology and source types was recorded in [`issue-145-research-log.md`](./issue-145-research-log.md). A subsequent compound-level pigeon applicability review is recorded in [`issue-145-pigeon-compound-research.md`](./issue-145-pigeon-compound-research.md); it preserves all five raw-dried pigeon outcomes as unresolved because it found no exact pigeon raw-form exposure outcome. Results are incorporated in `food-reviews.json` and linked from the protected raw-legume coverage ledger.

| Food/form | Pigeon | Parrot | African Grey | Budgie | Canary | Chicken |
| --- | --- | --- | --- | --- | --- | --- |
| Raw dried lima beans | `unresolved` | `requires_preparation` | `requires_preparation` | `requires_preparation` | `requires_preparation` | `requires_preparation` |
| Raw dried fava/broad beans | `unresolved` | `requires_preparation` | `requires_preparation` | `requires_preparation` | `requires_preparation` | `limited` |
| Raw dried black beans | `unresolved` | `requires_preparation` | `requires_preparation` | `requires_preparation` | `requires_preparation` | `unresolved` |
| Raw dried pinto beans | `unresolved` | `requires_preparation` | `requires_preparation` | `requires_preparation` | `requires_preparation` | `requires_preparation` |
| Raw dried navy beans | `unresolved` | `requires_preparation` | `requires_preparation` | `requires_preparation` | `requires_preparation` | `requires_preparation` |

## Evidence assessment

For **pigeons**, neither the direct VCA pigeon/dove guidance nor Palomacy’s pigeon-feeding guidance identifies any of these exact raw dried bean forms. A renewed source audit did locate direct primary crop-content evidence that free-ranging feral pigeons consumed **broad beans (*Vicia faba*)** in a field-foraging context.[6] However, that study does not identify bean maturity or processing, so it cannot establish the distinct **raw dried** fava/broad-bean form. The new source is retained as auditable context, but all five pigeon rows remain **unresolved**: the renewed searches found no accessible exact pigeon/form evidence for lima, fava, black, pinto, or navy beans. No row is inferred from a parrot or chicken source.

For the general **parrot** record, For the Birds Parrot Rescue & Sanctuary names lima, fava, pinto, and navy beans in its preparation-bound legume guidance. Black beans are separately bounded by Kiwi’s New Life Bird Rescue, which requires dried beans to be rehydrated and fully cooked and cooled and lists black beans only in a cooked-legume recipe. These are `requires_preparation` outcomes, not raw-form approvals or recipe instructions.[1] [2]

For **African Greys**, **budgies**, and **canaries**, the corresponding VCA species pages frame beans as cooked food. The canary page names lima and navy beans under cooked beans; targeted searches for the other exact forms did not provide a stronger species-specific raw-form source. The records therefore retain a conservative `requires_preparation` boundary without claiming a cooking method, quantity, formula, or complete diet.[3] [4] [5]

The **chicken** rows reflect direct poultry evidence rather than companion-bird extrapolation. Raw lima-bean broiler-starter diets hindered growth and were associated with serious histopathological changes, while the soaked/boiled comparator was excepted, supporting `requires_preparation`.[7] Raw pinto-bean studies likewise report poorer growth or performance for raw/non-heated diets and better outcomes with processing.[8] [9] Raw navy-bean meal depressed body weight and produced pancreatic changes in chicks, supporting `requires_preparation`.[10]

Raw fava/broad beans are intentionally recorded as `limited` for **chicken** only, rather than universally approved or categorically excluded. The direct broiler studies demonstrate outcome sensitivity to formulation, inclusion level, and processing: lower defined dietary inclusion was reported in one study, while a raw-versus-autoclaved comparison reports poorer outcomes under higher raw inclusion. This supports only the controlled poultry-ration context and does not establish a home-feeding rule or complete ration.[11] [12] The raw dried pigeon form remains unresolved because the direct *Columba livia* observation does not identify bean maturity or processing.[6]

No accessible direct chicken study established the exact **raw dried black-bean** outcome after the required first and targeted second searches. The accessible chicken result used boiled black beans. That row remains **unresolved**; pinto, kidney, generic common-bean, or cooked-black-bean evidence is not substituted.

## What changed in the ledger

| Ledger item | Change |
| --- | --- |
| `food-reviews.json` | Added five complete six-bird raw-form records. |
| `food-coverage.json` | Linked all five corresponding historical raw-legume obligations to their complete review keys. |
| `sources.json` | Added the direct chicken study records, companion-bird black-bean preparation source, direct feral-pigeon broad-bean crop-content study, and five compound/pigeon-context sources; clarified the existing For the Birds source’s named-bean scope. |
| Research audit trail | Added `issue-145-research-log.md` with first-pass and required targeted-search outcomes, plus `issue-145-pigeon-compound-research.md` with the completed compound-level pigeon applicability assessment. |

The canonical coverage report now shows **11 of 13** raw-legume tracked items linked to complete six-bird reviews, leaving **18** total tracked food/forms awaiting review across the broader Issue #92 backlog. The remaining ten items in the historical multi-bird core list and the two raw-legume items are not represented as resolved by this batch.

## What this batch does not do

This work does not approve a raw bean for runtime use, add any ingredient to the active inventory catalog, create an inventory preset, modify a formula, infer suitability across species, prescribe cooking, change a red safety warning, or close Issue #92. Any future active-catalog change remains subject to the owner’s evidence-review → approval → active-data process.

## References

[1] [For the Birds Parrot Rescue & Sanctuary, *Legume Safety Warning*](https://www.ftbrescue.com/post/2018/01/13/legume-safety-warning)

[2] [Kiwi’s New Life Bird Rescue, *Diet and Chop Recipes*](https://www.kiwisnewlifebirdrescue.org/programs)

[3] [VCA Animal Hospitals, *African Grey Parrots – Feeding*](https://vcahospitals.com/know-your-pet/african-grey-feeding)

[4] [VCA Animal Hospitals, *Budgies – Feeding*](https://vcahospitals.com/know-your-pet/budgies-feeding)

[5] [VCA Animal Hospitals, *Canaries – Feeding*](https://vcahospitals.com/know-your-pet/canaries-feeding)

[6] [Dilks (1975), *Diet of Feral Pigeons (Columba livia) in Hawke’s Bay, New Zealand*](https://doi.org/10.1080/00288233.1975.10430391)

[7] [Ologhobo et al. (1993), *Toxicity of Raw Limabeans (Phaseolus lunatus L.) and Limabean Fractions for Growing Chicks*](https://doi.org/10.1080/00071669308417606)

[8] [Arija et al. (2006), *Nutritional Evaluation of Raw and Extruded Kidney Bean (Phaseolus vulgaris L. var. Pinto) in Chicken Diets*](https://doi.org/10.1093/ps/85.4.635)

[9] [Bhave (1964), *A Comparison of Feeding Heated and Non Heated Pinto Bean Meal to Broiler-Strain Chicks*](https://krex.k-state.edu/bitstreams/4e22ae54-f61a-4d26-b382-86c899692ca7/download)

[10] [Hewitt et al. (1973), *A Comparison of Fractions Prepared from Navy (Haricot) Beans (Phaseolus vulgaris L.) in Diets for Germ-free and Conventional Chicks*](https://doi.org/10.1079/BJN19730118)

[11] [Mateos and Puchal (1981), *Raw Broad Beans (Vicia faba L.) as an Energy and Protein Source for Broiler Chicks*](https://doi.org/10.3382/ps.0602486)

[12] [Rubio, Brenes, and Castaño (1990), *The Utilization of Raw and Autoclaved Faba Beans (Vicia faba L., var. minor) and Faba Bean Fractions in Diets for Growing Broiler Chickens*](https://doi.org/10.1079/BJN19900130)
