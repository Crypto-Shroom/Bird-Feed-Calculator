# Bolt Journal

## 2026-09-06 - Initial Memoization Optimization
**Learning:** In `v3-webapp/client/src/lib/herb-library-filter.ts`, `filterHerbs` performs filtering and sorting over the herb dataset. Adding memoization or optimizing array operations in React components that consume `filterHerbs` avoids unneeded work on re-renders when search or filter states remain unchanged.
**Action:** Always check expensive data operations in library filters and components for memoization opportunities.

## 2026-09-08 - Safety Lookup Indexing
**Learning:** `checkBirdToxicity` and `isIngredientCompatible` in `bird-safety.ts` were performing array linear scans (`.find()` and `.includes()`) on every toxicity check during calculator loops and inventory UI rendering. Pre-building `Map` and `Set` lookup indexes at module initialization converts these operations to $O(1)$ constant time with zero array allocations per lookup.
**Action:** Always index small static lookup datasets into Map/Set lookup indexes when they are repeatedly queried in hot loops.
