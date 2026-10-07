# Bolt Journal

## 2026-09-06 - Initial Memoization Optimization
**Learning:** In `v3-webapp/client/src/lib/herb-library-filter.ts`, `filterHerbs` performs filtering and sorting over the herb dataset. Adding memoization or optimizing array operations in React components that consume `filterHerbs` avoids unneeded work on re-renders when search or filter states remain unchanged.
**Action:** Always check expensive data operations in library filters and components for memoization opportunities.

## 2026-09-19 - Static Situation Lookup Optimization in `birds.ts`
**Learning:** `getAvailableSituations(bird)` was executing `Object.keys(BIRD_PROFILES[bird].profiles)` on every call, allocating new string arrays and causing referential instability in React hooks/effects. Pre-computing a static `AVAILABLE_SITUATIONS_BY_BIRD` lookup map provides O(1) performance with zero array allocations and stable references.
**Action:** Always pre-compute static record keys for constant dataset configurations rather than calling `Object.keys()` repeatedly during render or calculation cycles.

## 2026-09-10 - Home View Search and UI Memoization
**Learning:** In `v3-webapp/client/src/pages/Home.tsx`, re-evaluating safety rules (`isToxicRaw`, `checkBirdToxicity`, `getProcessingWarning`, `isIngredientCompatible`) on every search bar keypress caused repeated CPU work across all dataset ingredients. Pre-classifying safety attributes per selected bird with `useMemo` reduces per-keypress work to simple string matching.
**Action:** Extract species-wide safety evaluations into a per-bird `useMemo` classifier before applying search query filters in interactive search components.
