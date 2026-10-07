# Bolt Journal

## 2026-09-06 - Initial Memoization Optimization
**Learning:** In `v3-webapp/client/src/lib/herb-library-filter.ts`, `filterHerbs` performs filtering and sorting over the herb dataset. Adding memoization or optimizing array operations in React components that consume `filterHerbs` avoids unneeded work on re-renders when search or filter states remain unchanged.
**Action:** Always check expensive data operations in library filters and components for memoization opportunities.

## 2026-09-09 - MultibirMixCalculator Precision & Output Parity
**Learning:** In `v3-webapp/client/src/lib/calculator-multi-bird.ts`, greedy solver optimizations introducing floating-point tolerance bands (`1e-12`) or single-pass order changes shifted exact mix allocation tie-breaking in ~5% of multi-bird scenarios. Under AGENTS.md governance rules, any formula output or result shape deviation requires explicit product owner approval.
**Action:** Do not alter numerical ordering or introduce score tolerance thresholds in core solver algorithms without verifying 100% exact mix outputs across all profile and inventory combinations.
