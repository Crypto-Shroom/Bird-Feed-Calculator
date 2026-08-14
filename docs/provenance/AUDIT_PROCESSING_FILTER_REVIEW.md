# Audit Processing-Filter Review

**Status:** Review in progress. No ingredient eligibility, formula, nutrient value, or profile target has been changed by this document.

## Finding

The audit introduced a global `INGREDIENTS_REQUIRING_VERIFIED_PROCESSING` filter. Because the active calculator treats every member of that set as ineligible, it overrode existing project entries that labelled black-eyed peas, chickpeas, and adzuki beans as safe raw. The filter therefore changed live calculator behavior without changing the original ingredient records.

## Restriction categories

| Ingredient group | Current audit filter effect | Review finding |
|---|---|---|
| Kidney, lima, fava, navy, pinto, and black beans | Blocked before calculation. | Retain hard raw-toxicity rule. These are already covered by explicit raw-toxicity records. |
| Soybeans | Blocked before calculation. | Retain processing rule. University of Georgia poultry guidance states raw soybeans contain antinutritional factors and require controlled processing. |
| Generic `beans` | Blocked before calculation. | Retain a specific-type requirement; an unspecified bean cannot be safely classified. |
| Black-eyed peas / cowpeas | Blocked before calculation despite a legacy safe-raw entry. | Global audit filter is unsupported as a pigeon-specific hard exclusion. Poultry evidence supports conditional feed use but does not establish a fatal raw-toxicity rule. |
| Chickpeas | Blocked before calculation despite a legacy safe-raw entry. | Needs species- and inclusion-specific review. Poultry evidence shows cultivar and inclusion-rate dependence, so a global hard exclusion is broader than the evidence. |
| Adzuki beans | Blocked before calculation despite a legacy safe-raw entry. | Needs a source-mapping review; the audit did not document a new toxic basis. |
| Lupins and vetch | Blocked before calculation. | Review separately. Cultivar and toxin distinctions matter; broad automatic eligibility would be inappropriate without a species/product-form rule. |

## Correction principle

Only explicit raw-toxicity records should create an automatic red exclusion. Processing, cultivar, or inclusion-rate uncertainty should be displayed as information unless the product owner approves a species-specific exclusion rule supported by documented evidence.

## Sources

1. [University of Georgia: Antinutritional Factors in Soybeans](https://poultry.caes.uga.edu/extension/poultry-nutrition/soybeans/antinutritional-factors.html)
2. [eOrganic / University of Kentucky: Including Chickpeas in Organic Poultry Diets](https://eorganic.org/pages/70243/including-chickpeas-in-organic-poultry-diets)
3. [University of Kentucky: Legumes in Poultry Feed](https://poultry.extension.org/articles/feeds-and-feeding-of-poultry/feed-ingredients-for-poultry/legumes-in-poultry-feed/)
