# Bolt Journal

## 2026-09-06 - Initial Memoization Optimization
**Learning:** In `v3-webapp/client/src/lib/herb-library-filter.ts`, `filterHerbs` performs filtering and sorting over the herb dataset. Adding memoization or optimizing array operations in React components that consume `filterHerbs` avoids unneeded work on re-renders when search or filter states remain unchanged.
**Action:** Always check expensive data operations in library filters and components for memoization opportunities.

## 2026-09-09 - MultibirMixCalculator Loop Allocation Optimization
**Learning:** In `v3-webapp/client/src/lib/calculator-multi-bird.ts`, `MultibirMixCalculator` performs hundreds of greedy allocation steps per calculation. Replacing per-evaluation object spreads `{ ...mix }` and array filter/sort passes with in-place mutation/reversion, and unifying nutrition and category ratio accumulation into a single zero-allocation pass (`calculateMetrics`) reduces execution time by ~44% (~6.19ms -> ~3.45ms per calculation).
**Action:** In inner greedy solver loops, avoid allocating new candidate objects or mapping/filtering arrays on every step; mutate and revert in place and compute multi-metric summaries in a single pass.
