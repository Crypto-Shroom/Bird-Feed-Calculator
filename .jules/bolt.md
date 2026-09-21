# Bolt Journal

## 2026-09-06 - Initial Memoization Optimization
**Learning:** In `v3-webapp/client/src/lib/herb-library-filter.ts`, `filterHerbs` performs filtering and sorting over the herb dataset. Adding memoization or optimizing array operations in React components that consume `filterHerbs` avoids unneeded work on re-renders when search or filter states remain unchanged.
**Action:** Always check expensive data operations in library filters and components for memoization opportunities.

## 2026-09-19 - Static Situation Lookup Optimization in `birds.ts`
**Learning:** `getAvailableSituations(bird)` was executing `Object.keys(BIRD_PROFILES[bird].profiles)` on every call, allocating new string arrays and causing referential instability in React hooks/effects. Pre-computing a static `AVAILABLE_SITUATIONS_BY_BIRD` lookup map provides O(1) performance with zero array allocations and stable references.
**Action:** Always pre-compute static record keys for constant dataset configurations rather than calling `Object.keys()` repeatedly during render or calculation cycles.
