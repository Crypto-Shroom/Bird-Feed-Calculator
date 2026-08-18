# Ingredient-library contract

This contract defines the non-runtime foundation for the future general ingredient library tracked by [Issue #81](https://github.com/Crypto-Shroom/Bird-Feed-Calculator/issues/81) and child issue [#112](https://github.com/Crypto-Shroom/Bird-Feed-Calculator/issues/112).

## Runtime adapter boundary

`v3-webapp/client/src/lib/ingredient-library.ts` adapts the existing `INGREDIENTS` catalog and canonical safety helpers for a future reference page. It does not add, remove, or reinterpret ingredient records. The adapter exposes the existing macro values and notes, compatibility outcomes, explicit toxicity warnings, the provenance file path, and an evidence status.

The adapter reports the six supported birds in this exact order:

| Key | Bird |
|---|---|
| `pigeon` | Pigeon |
| `parrot` | Parrot |
| `african_grey` | African Grey |
| `budgie` | Budgie |
| `canary` | Canary |
| `chicken` | Chicken |

## Evidence rule

Every current adapter entry is marked `unresolved` because `database/provenance/food-reviews.json` is intentionally empty until each food/form has six explicit, sourced species rows. The adapter must not convert a missing row into an allowed, prohibited, or irrelevant outcome.

A future evidence implementation must preserve the ledger rules in [`README.md`](./README.md) and [`SCHEMA.md`](./SCHEMA.md): forms remain distinct, each food review contains one row for every supported bird, and every row cites a source and locator. A source for one bird or species group must not silently establish suitability for another bird.

## Safety boundary

Compatibility and warnings are read from the existing `bird-safety.ts` module. This preserves explicit raw-toxicity warnings, including the raw adzuki warning, and does not change the calculator’s eligibility or formula behavior. No user-visible library page or copy is included in this contract; a later UI PR requires separate owner approval of its wording.
