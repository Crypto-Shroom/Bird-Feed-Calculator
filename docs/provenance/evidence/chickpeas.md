# Chickpeas: Evidence Review

**Status:** Evidence recorded; no eligibility, safety rule, nutrient value, profile target, or formula has been changed.

## Existing project record

The data record describes chickpeas as “Must be cooked, high fiber.” In contrast, the historical safe-raw-legume set contains `chickpeas`, while the audit processing filter blocks `chickpeas` before calculation. The project therefore contains conflicting operational signals: the ingredient note calls for cooking, the legacy set calls it safe raw, and the filter prevents it from being used at all.

## External evidence

University of Kentucky poultry guidance identifies chickpeas as a potential poultry-feed ingredient, but reports antinutritional factors including protease/amylase inhibitors, lectins, tannins, and oligosaccharides. It explains that heat treatment can inactivate most of these factors, while also noting cultivar variability. In the cited chicken studies, raw chickpeas affected digestive-organ measurements at 20% inclusion and other raw-chickpea trials showed performance effects above particular inclusion levels. Extruded chickpeas supported higher inclusion in the cited research. [1]

The 2024 poultry-legume overview likewise describes antinutritional factors as a central limitation in grain-legume use and treats processing and feed formulation as relevant to practical inclusion decisions. [2]

## Interpretation for this app

The evidence does **not** support treating generic chickpeas as a hard raw-toxicity equivalent to the explicitly red-listed beans. It also does **not** support automatic eligibility for every product form, every inclusion level, or every supported bird species. The original “Must be cooked” note is more consistent with the available poultry evidence than the legacy safe-raw classification.

| Question | Evidence-based status |
|---|---|
| Is a generic raw chickpea a demonstrated fatal-toxicity case in this app’s supported species? | **No such basis was located in the reviewed sources.** |
| Is poultry-feed use documented? | **Yes, conditionally**; product form, cultivar, processing, inclusion, and balanced ration design matter. [1] [2] |
| Is a pigeon/parrot-specific raw inclusion rule documented here? | **No.** |
| Is a live rule change justified without approval? | **No.** |

## Approval-gated choices

| Choice | Live effect if approved | Recommendation status |
|---|---|---|
| **Keep the current processing filter** | Chickpeas remain excluded from automatic formula selection. | Defensible as a conservative temporary state, but the interface should not present it as a proven raw-toxicity rule. |
| **Replace the filter with an amber processing/inclusion review** | Chickpeas remain visible with the original “Must be cooked” requirement but are not silently classified as fatally toxic. | Requires product-owner decision on which bird types, product form, and message should be supported. |
| **Make chickpeas automatically eligible** | Chickpeas may enter formulas without the current processing block. | **Not recommended without species-specific preparation and inclusion criteria.** |

## References

[1] [University of Kentucky / eOrganic: Including Chickpeas in Organic Poultry Diets](https://eorganic.org/pages/70243/including-chickpeas-in-organic-poultry-diets)

[2] [David et al. (2024), *Feeding Value of Lupins, Field Peas, Faba Beans and Chickpeas for Poultry: An Overview*](https://pmc.ncbi.nlm.nih.gov/articles/PMC10886283/)
