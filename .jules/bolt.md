# Bolt Journal

## 2026-09-06 - Initial Memoization Optimization
**Learning:** In `v3-webapp/client/src/lib/herb-library-filter.ts`, `filterHerbs` performs filtering and sorting over the herb dataset. Adding memoization or optimizing array operations in React components that consume `filterHerbs` avoids unneeded work on re-renders when search or filter states remain unchanged.
**Action:** Always check expensive data operations in library filters and components for memoization opportunities.

## 2026-09-17 - Herb Library Memoization
**Learning:** In `v3-webapp/client/src/pages/HerbLibrary.tsx`, static collection processing (`Object.entries(HERBS_SUPPLEMENTS)`) and filter calculations were previously executed on every component render. Memoizing `herbEntries` and `visibleHerbEntries` with `useMemo` avoids redundant filtering and array sorting.
**Action:** When working on standalone library pages or views with static datasets, memoize the sorted dataset and filtered views.
