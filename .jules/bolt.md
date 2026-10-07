# Bolt Journal

## 2026-09-06 - Initial Memoization Optimization
**Learning:** In `v3-webapp/client/src/lib/herb-library-filter.ts`, `filterHerbs` performs filtering and sorting over the herb dataset. Adding memoization or optimizing array operations in React components that consume `filterHerbs` avoids unneeded work on re-renders when search or filter states remain unchanged.
**Action:** Always check expensive data operations in library filters and components for memoization opportunities.

## 2026-09-06 - Memoizing Guided Browsing Subcomponents in High-Frequency Parents
**Learning:** Auxiliary subcomponents like `PersonalizedSupplementMix` placed within high-frequency re-rendering parent components (`Home.tsx`) suffer redundant re-renders on every parent state change (e.g., slider tweaks or ingredient searches). Wrapping them with `React.memo` and refactoring chained array filters into single-pass loops in `useMemo` avoids DOM diffing and intermediate array allocations.
**Action:** Always memoize leaf and section components rendered inside state-heavy views like `Home.tsx`.

## 2026-09-10 - Home View Search and UI Memoization
**Learning:** In `v3-webapp/client/src/pages/Home.tsx`, re-evaluating safety rules (`isToxicRaw`, `checkBirdToxicity`, `getProcessingWarning`, `isIngredientCompatible`) on every search bar keypress caused repeated CPU work across all dataset ingredients. Pre-classifying safety attributes per selected bird with `useMemo` reduces per-keypress work to simple string matching.
**Action:** Extract species-wide safety evaluations into a per-bird `useMemo` classifier before applying search query filters in interactive search components.
