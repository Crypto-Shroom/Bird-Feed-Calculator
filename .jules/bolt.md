# Bolt Journal

## 2026-09-06 - Initial Memoization Optimization
**Learning:** In `v3-webapp/client/src/lib/herb-library-filter.ts`, `filterHerbs` performs filtering and sorting over the herb dataset. Adding memoization or optimizing array operations in React components that consume `filterHerbs` avoids unneeded work on re-renders when search or filter states remain unchanged.
**Action:** Always check expensive data operations in library filters and components for memoization opportunities.

## 2026-09-17 - Herb Library Memoization
**Learning:** In `v3-webapp/client/src/pages/HerbLibrary.tsx`, static collection processing (`Object.entries(HERBS_SUPPLEMENTS)`) and filter calculations were previously executed on every component render. Memoizing `herbEntries` and `visibleHerbEntries` with `useMemo` avoids redundant filtering and array sorting.
**Action:** When working on standalone library pages or views with static datasets, memoize the sorted dataset and filtered views.

## 2026-09-08 - Safety Lookup Indexing
**Learning:** `checkBirdToxicity` and `isIngredientCompatible` in `bird-safety.ts` were performing array linear scans (`.find()` and `.includes()`) on every toxicity check during calculator loops and inventory UI rendering. Pre-building `Map` and `Set` lookup indexes at module initialization converts these operations to $O(1)$ constant time with zero array allocations per lookup.
**Action:** Always index small static lookup datasets into Map/Set lookup indexes when they are repeatedly queried in hot loops.

## 2026-09-10 - Home View Search and UI Memoization
**Learning:** In `v3-webapp/client/src/pages/Home.tsx`, re-evaluating safety rules (`isToxicRaw`, `checkBirdToxicity`, `getProcessingWarning`, `isIngredientCompatible`) on every search bar keypress caused repeated CPU work across all dataset ingredients. Pre-classifying safety attributes per selected bird with `useMemo` reduces per-keypress work to simple string matching.
**Action:** Extract species-wide safety evaluations into a per-bird `useMemo` classifier before applying search query filters in interactive search components.

## 2026-10-11 - Greedy Calculator Step Incremental Tracking
**Learning:** In `v3-webapp/client/src/lib/calculator-multi-bird.ts`, `fillMix` was re-allocating temporary mix candidate objects and calling `calculateNutrition`, `calculateCategoryRatios`, and `objectiveScore` on every candidate step ($O(k)$ array scans and object creation inside inner loops). Maintaining running totals for protein, carbs, fat, fiber, category weights, and active ingredient counts incrementally reduces per-candidate score evaluation to $O(1)$ operations with zero intermediate allocations, yielding a ~14.5x speedup.
**Action:** In greedy allocation algorithms, maintain running total weights and nutrient sums incrementally rather than re-scanning mix arrays for every candidate evaluation step.
