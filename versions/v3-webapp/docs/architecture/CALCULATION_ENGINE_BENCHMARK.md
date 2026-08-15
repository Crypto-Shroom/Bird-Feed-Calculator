# Calculation Engine Benchmark

**Status:** Evidence record. This benchmark does not select or modify a formula policy.

## Accuracy criteria

An inventory-aware calculator should, in order: never exceed inventory, explicitly scale down when inventory is insufficient, exclude hard safety failures, match the selected profile’s macronutrient and category targets as closely as possible, and warn clearly about every unmet condition.

## Test scenarios

The benchmark compared the legacy pigeon calculator and active multi-bird calculator with the same pigeon-maintenance inventory and batch size in four scenarios: balanced inventory, limited inventory, grain-only inventory, and high-fat inventory.

| Scenario | Better macro midpoint match | Better category midpoint match | Better inventory/warning behavior |
|---|---|---|---|
| Balanced inventory | Multi-bird | Legacy | Multi-bird reports three actual target misses; legacy reports none. |
| Limited inventory | Tie | Tie | Multi-bird explicitly scales the recipe to 400g and reports macro misses; legacy returns 400g but omits the shortage warning. |
| Grain-only inventory | Multi-bird | Tie | Multi-bird reports every macro and category miss; legacy reports only missing legumes/oil seeds and low legumes. |
| High-fat inventory | Multi-bird | Legacy | Multi-bird reports fat-related category/macro issues; legacy reports only missing yellow corn. |

## Interpretation

The active multi-bird engine is stronger for inventory awareness, safety integration, and warning completeness. Its current weakness is category control: it gives macro matching more influence than category targets, so it can underuse oil seeds or overuse grains even when a more balanced feasible formula exists.

The legacy engine preserves category midpoint allocation but does not use its own `scoreMix()` function in the live calculation path. It therefore cannot react intelligently to the nutritional differences between available ingredients and can silently return an undersized or poorly matched batch.

## Recommendation awaiting approval

Retain the multi-bird engine as the base, then improve it with a two-stage deterministic optimizer:

1. Enforce hard inventory, species-safety, and eligible-category constraints.
2. Rank feasible formula candidates by a documented weighted objective that balances macro distance, category distance, diversity, and warning minimization.

The revised engine should be accepted only if fixed inventory fixtures show it improves or matches the legacy result on the agreed criteria, and every changed pigeon output is shown in a pull request before merge.
