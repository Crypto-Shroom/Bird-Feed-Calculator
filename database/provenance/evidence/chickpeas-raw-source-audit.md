# Raw Dried Chickpeas — Source Audit

**Audit date:** 18 August 2026

This audit covers every source previously attached to the raw-dried-chickpea record, each newly registered source, and the additional candidates discovered during the evidence search. It distinguishes usable evidence from historical, inaccessible, or insufficient material. No runtime behavior is changed by this documentation.

## Sources used in the final record

| Source ID | Source | Audit result | Permitted use in the final record |
| --- | --- | --- | --- |
| `vca-pigeon-dove-feeding` | VCA, *Feeding Pigeons and Doves* | The source permits small quantities of wholesome human food within a balanced pigeon/dove diet, but does not name chickpeas. | Pigeon-specific companion-diet context only; paired with chickpea processing evidence to classify raw dried chickpeas as `requires_preparation`. |
| `vca-meyers-parrot-feeding` | VCA, *Feeding Meyer’s Parrots* | The source permits small quantities of wholesome human food within a balanced Meyer’s-parrot diet, but does not name chickpeas. | Group-specific companion-parrot context only; paired with chickpea processing evidence to classify raw dried chickpeas as `requires_preparation`. |
| `vca-african-grey-feeding` | VCA, *African Grey Parrots – Feeding* | The source names chickpeas and separately names cooked beans in an African Grey fresh-food list. It does not endorse raw dried chickpeas. | African Grey-specific basis for `requires_preparation`, paired with chickpea processing evidence. |
| `vca-budgie-feeding` | VCA, *Budgies – Feeding* | The source lists cooked beans but not chickpeas or raw dried legumes. | Budgie diet context; paired with the direct budgie raw-chickpea source. |
| `vca-canary-feeding` | VCA, *Canaries – Feeding* | The source lists chickpeas under “cooked beans.” | Canary-specific basis for `requires_preparation`, paired with chickpea processing evidence. |
| `eorganic-chickpeas-poultry-2014` | Jacob, *Including Chickpeas in Organic Poultry Diets* | The source identifies chickpea antinutritional factors and says heat treatment inactivates most; it provides poultry-feed context. | Chickpea-specific processing boundary; not a suitability finding for a different bird. |
| `danek-majewska-2021-raw-chickpea-broilers` | Danek-Majewska et al. (2021), *Animals* | Direct primary study of raw chickpea seed protein in a 42-day Ross 308 male-broiler compound-feed experiment. | Chicken `limited` outcome only, strictly within the studied formulated-ration context. |
| `exoticdirect-budgie-chickpeas-2019` | ExoticDirect, *What can budgies eat?* | The source explicitly lists chickpeas among foods suitable for budgies but not to feed raw. It lacks named clinical authors and an evidence list. | Budgie `requires_preparation` boundary only; it does not set a cooking method, portion, formula inclusion, or complete ration. |

## Previously attached historical source

| Source ID | Audit result | Decision |
| --- | --- | --- |
| `historical-raw-legume-2025` | The preserved original research says raw chickpeas are “generally safe raw” but notes some sources recommend cooking. It names only broad source classes—The Spruce Pets, avian rescue organizations, and pigeon forums—and provides no stable citation/locator for the chickpea assertion. | Preserved for historical provenance but not used to determine any current outcome. |

## Additional candidates searched and excluded

| Candidate | Audit result | Exclusion reason |
| --- | --- | --- |
| Palomacy Facebook post, “Can I feed chickpeas to pigeons?” | Accessible only as a title with a login wall; no answer or citations were available. | Search snippet and inaccessible text are not evidence. |
| PetCraft, “Cooking Beans for Parrots” | Page presented a robot challenge; the underlying text could not be verified. | The source cannot be relied on when its content is unavailable. |
| BSAVA, *Birds: biology and husbandry* | The public preview confirms a bird-husbandry chapter but does not expose the claimed chickpea wording. | Full-text claim not verified; not used. |
| Merck Veterinary Manual, *Management of Pet Birds* | The page provides general pet-bird management but no explicit chickpea or legume entry. | It does not support a raw-chickpea outcome. |

## Review conclusion

The final record retains **two `unresolved` outcomes**: pigeon and parrot. Their existing sources provide only general diet context and do not name chickpeas or raw pulses, so a poultry processing source cannot fill the gap. African Grey, budgie, and canary are `requires_preparation`, a conservative raw-form boundary rather than a food approval. Chicken remains `limited` to the cited controlled broiler-ration study. No cross-species suitability, runtime behavior, formula, inventory instruction, preparation method, or visitor-visible copy has been introduced.
