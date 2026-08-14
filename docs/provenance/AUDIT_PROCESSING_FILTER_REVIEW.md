# Audit Processing-Filter Review

**Status:** Review completed and product-owner direction implemented. Ingredient nutrition values, bird targets, profile names, and feeding recommendations remain unchanged.

## Finding

The audit introduced a global `INGREDIENTS_REQUIRING_VERIFIED_PROCESSING` filter. Because the active calculator treats every member of that set as ineligible, it overrode existing project entries that labelled black-eyed peas, chickpeas, and adzuki beans as safe raw. The filter therefore changed live calculator behavior without changing the original ingredient records.

## Restriction categories

| Ingredient group | Current audit filter effect | Review finding |
|---|---|---|
| Kidney, lima, fava, navy, pinto, and black beans | Blocked before calculation. | Retain hard raw-toxicity rule. These are already covered by explicit raw-toxicity records. |
| Soybeans | Blocked before calculation. | Retain processing rule. University of Georgia poultry guidance states raw soybeans contain antinutritional factors and require controlled processing. |
| Generic `beans` | Blocked before calculation. | Retain a specific-type requirement; an unspecified bean cannot be safely classified. |
| Black-eyed peas / cowpeas | Eligible. | Restored after review; no audit-created hard exclusion remains. |
| Chickpeas | Eligible with a cooked-or-properly-processed instruction. | The app gives selected-bird preparation guidance rather than an audit holding message. |
| Adzuki beans | Eligible with a cooked-or-properly-processed instruction. | The app gives selected-bird preparation guidance based on soaking/heat-processing evidence. |
| Lupins | Eligible as feed-grade low-alkaloid sweet lupins only. | Bitter or unidentified garden lupins are excluded by the preparation requirement. |
| Common vetch | Eligible as feed-grade heat-treated common vetch for pigeon/chicken context; excluded for companion parrots and small birds. | The app shows the product-form restriction and bird-specific message. |

## Evidence records added

The evidence records now support the implemented practical preparation messages.

| Ingredient | Evidence record | Implemented state |
|---|---|---|
| Chickpeas | [Chickpeas review](./evidence/chickpeas.md) | Cooked or properly processed; selected-bird preparation note displayed. |
| Adzuki beans | [Adzuki-beans review](./evidence/adzuki-beans.md) | Cooked or properly processed; selected-bird preparation note displayed. |
| Lupins | [Lupins review](./evidence/lupins.md) | Feed-grade low-alkaloid sweet lupins only. |
| Vetch | [Vetch review](./evidence/vetch.md) | Feed-grade heat-treated common vetch for pigeon/chicken context; companion-bird exclusion retained. |

## Correction principle

Only explicit raw-toxicity records create an automatic red exclusion. Preparation, cultivar, and bird-specific context are displayed directly in the ingredient and formula guidance; companion-bird vetch exclusion remains an explicit species-specific rule.

## Sources

1. [University of Georgia: Antinutritional Factors in Soybeans](https://poultry.caes.uga.edu/extension/poultry-nutrition/soybeans/antinutritional-factors.html)
2. [eOrganic / University of Kentucky: Including Chickpeas in Organic Poultry Diets](https://eorganic.org/pages/70243/including-chickpeas-in-organic-poultry-diets)
3. [University of Kentucky: Legumes in Poultry Feed](https://poultry.extension.org/articles/feeds-and-feeding-of-poultry/feed-ingredients-for-poultry/legumes-in-poultry-feed/)
