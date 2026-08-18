# Ingredient-library contract

This contract defines the non-runtime foundation for the future general ingredient library tracked by [Issue #81](https://github.com/Crypto-Shroom/Bird-Feed-Calculator/issues/81) and child issue [#112](https://github.com/Crypto-Shroom/Bird-Feed-Calculator/issues/112).

## Runtime adapter boundary

`v3-webapp/client/src/lib/ingredient-library.ts` adapts the existing `INGREDIENTS` catalog and canonical safety helpers for a future reference page. It does not add, remove, or reinterpret ingredient records. The adapter exposes the existing macro values and notes, non-approval safety-model statuses, explicit toxicity warnings, the provenance file path, and an evidence status.

The adapter reports the six supported birds in this exact order. These are the supported evidence keys, not a compatibility approval list:

| Key | Bird |
|---|---|
| `pigeon` | Pigeon |
| `parrot` | Parrot |
| `african_grey` | African Grey |
| `budgie` | Budgie |
| `canary` | Canary |
| `chicken` | Chicken |

## Evidence rule

The adapter exposes `evidenceStatus: "ledger_only"` to make clear that it is a projection boundary, not an approval source. It does not expose `compatibleBirds` and does not interpret the absence of a safety warning as suitability. Its safety-model field distinguishes only `explicitly_excluded` from `not_explicitly_excluded`.

The first evidence batch now records the `wheat` ingredient in one distinct `whole dry grain, threshed/hulled where applicable` form. The six rows are intentionally mixed: budgie and chicken have limited, source-backed form/context outcomes, while pigeon, parrot, African Grey, and canary remain `unresolved` because the reviewed sources do not establish that exact food/form outcome. This is research evidence only; it does not change runtime behavior.

A future evidence implementation must preserve the ledger rules in [`README.md`](./README.md) and [`SCHEMA.md`](./SCHEMA.md): forms remain distinct, each food review contains one row for every supported bird, and every row cites a source and locator. A source for one bird or species group must not silently establish suitability for another bird.

## Safety boundary

The safety-model statuses and warnings are read from the existing `bird-safety.ts` module. This preserves explicit raw-toxicity warnings, including the raw adzuki warning, and does not change the calculator’s eligibility or formula behavior. No user-visible library page or copy is included in this contract; a later UI PR requires separate owner approval of its wording and must consume completed ledger evidence rather than infer suitability.
