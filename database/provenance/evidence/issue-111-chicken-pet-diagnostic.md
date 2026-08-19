# Issue #111 — Chicken Pet/Companion default-formula diagnostic

## Scope and non-goals

This evidence note documents the reported `Chicken` → `Pet/Companion` default-panel behavior at commit `8031b994`. It is an **evidence-only diagnostic**. It neither changes a formula nor recommends a replacement formula, active ingredient data, nutrient values, safety outcomes, eligibility, profile target, Firestore configuration, or visitor-visible wording.

The calculator already describes this result as a scratch-grain supplement estimate rather than a complete poultry ration. That boundary is consistent with poultry-extension guidance: complete feeds are intended to provide balanced diets, while scratch grains are supplementary grain mixtures that dilute or do not replace the complete ration. [1] [2]

> The University of Kentucky Poultry Extension describes scratch grains as relatively low in protein and says that, when fed with complete feed, they dilute the balanced diet. The University of Maine describes complete diets as requiring no additional supplements and identifies controlled grain feeding as a distinct system. [1] [2]

Neither source validates the application’s macro targets, static nutrient table, optimizer, or any replacement formula. They are included solely to retain the complete-ration versus scratch-supplement boundary while the reported panel mismatch is investigated.

## Reproduction

Run the tracked diagnostic from the V3 application directory:

```sh
pnpm run inspect:issue111-chicken-pet
```

The diagnostic calls the active `getProfileDefaultIngredients("chicken", "pet")` and `MultibirMixCalculator(...).calculate(1000)` paths. It also performs an independent 10 g-resolution feasibility search over the same five default inventory ingredients, while holding chicken category shares at 80% grain and 20% legume—the shares of the active result and within the configured category ranges.

| Active default inventory | Amount available to the optimizer (g) |
| --- | ---: |
| Yellow corn | 4,000 |
| Wheat | 3,000 |
| Barley | 2,000 |
| Oats | 1,000 |
| Peas | 1,000 |

## Observed panel result

The active calculation selects 400 g wheat, 370 g barley, 10 g oats, 20 g yellow corn, and 200 g peas per 1,000 g result. It has 80% grain, 20% legume, and 0% seed. The configured category ranges are 60–80% grain, 10–20% legume, and 0–10% seed, so those category shares are within the configured bounds.

| Panel metric | Active output | Configured range | Status |
| --- | ---: | ---: | --- |
| Protein | 14.38% | 12–16% | Within range |
| Carbohydrates | 69.51% | 55–70% | Within range |
| Fat | 1.99% | 3–6% | **Below range** |
| Fiber | 4.19% | 3–5% | Within range |
| Grain category | 80% | 60–80% | Within range |
| Legume category | 20% | 10–20% | Within range |
| Seed category | 0% | 0–10% | Within range |

The default inventory contains no eligible seed-category ingredient. The calculator therefore separately returns a missing `Oil seeds` category with safflower, sunflower, and flaxseed recommendations. The current result carries no warning because target-deviation advisories are deliberately not invoked by the calculator; the red missing-category panel and nutrition-card range indicators remain separate mechanisms.

## Feasibility check

The independent search found a composition using the same inventory, the same 80% grain / 20% legume category shares, and no seed ingredient that is within all four configured macro ranges at 10 g resolution:

| Ingredient | Independently feasible composition (g) |
| --- | ---: |
| Peas | 200 |
| Oats | 80 |
| Yellow corn | 360 |
| Wheat | 160 |
| Barley | 200 |

| Macro | Independently feasible result | Configured range |
| --- | ---: | ---: |
| Protein | 13.24% | 12–16% |
| Carbohydrates | 69.16% | 55–70% |
| Fat | 3.12% | 3–6% |
| Fiber | 4.00% | 3–5% |

The active result has the optimizer’s recorded macro-distance of 1.494, one target miss, and total objective score of 1.2967. The independently found composition has a lower macro-distance of 1.094 while retaining the same category shares and five ingredient types. This confirms that the current default result is not constrained to miss the configured fat range by its available inventory or category bounds. It is a reproducible optimizer-selection defect rather than only an unavoidable preset limitation.

## Decision boundary

A correction could alter the default displayed formula and the visitor-visible nutrition panel. Project governance prohibits altering human-made formulations or public copy without explicit owner approval. This diagnostic therefore makes **no runtime change**.

Before an implementation PR is authorized, the owner should choose one of the following explicit paths:

| Owner decision | Consequence |
| --- | --- |
| Authorize an optimizer correction using unchanged targets and ingredients | A future focused PR can update selection logic and add a behavior regression test; the displayed formula may change. |
| Authorize a formula change | A future focused PR can revise the standard formula only after the exact formulation and any affected visible wording are explicitly approved. |
| Retain current behavior | The reproducible defect remains documented; no formula, copy, or warning behavior changes. |

## References

[1] [Jacquie Jacob, *Feeding Chickens for Egg Production in Small and Backyard Flocks*, University of Kentucky / Poultry Extension](https://poultry.extension.org/articles/feeds-and-feeding-of-poultry/feeding-chickens-for-egg-production/)

[2] [Donna R. Coffin, *Bulletin #2222, Nutrition for Backyard Chicken Flocks in Maine*, University of Maine Cooperative Extension](https://extension.umaine.edu/publications/2222e/)
