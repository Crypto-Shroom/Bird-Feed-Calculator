# Issue #125 — constrained-solver proof of concept

**Status:** Development-only validation artifact. It is not a runtime integration authorization.

## Scope

This proof of concept adds a development-only `highs@1.15.2` dependency, its MIT license record, and `pnpm --dir v3-webapp test:constrained-solver-poc`. The script builds CPLEX-LP models from real active catalog data, real bird/profile ranges, and the existing safety gates. It does not import the solver into the client, change the calculator, modify a formula, or render new visitor-facing text.

## Evidence exercised

| Check | Evidence |
| --- | --- |
| Pinned solver and license | `highs@1.15.2`, package metadata license `MIT`. |
| Independent global-objective reference | A two-ingredient, 10 g integer corpus is exhaustively enumerated and must agree with the model’s minimum possible maximum share. |
| Issue #111 real-data scenario | The active Chicken/Pet starter-inventory fixture is solved at 1 g resolution, with exact 1,000 g weight, stock caps, active macro ranges, and active category ranges as simultaneous constraints. |
| Active profile fixture corpus | Every current bird/profile starter fixture is classified as exact-feasible or infeasible. Exact solutions must meet every active macro/category range and stock cap. The fixtures are test inputs only; they are not visitor inventory. |
| Determinism | The identical model solves five times to the same gram-level quantity vector; reversing inventory-key order preserves the canonical candidate set. |
| Safety gate | Raw-unsafe kidney beans and soybeans are excluded before model construction, even though they could change nutrient availability. |
| Runtime-catalog reconciliation | The harness explicitly records the active `split_lentils` row as a legume with 25% protein, 63% carbohydrates, 1% fat, and 8% fibre. It does not treat a provenance-only conclusion as a substitute for the active catalog inspection. |

## Explicit limitations

The proof of concept does **not** test a browser Worker, persistent Worker lifecycle, cancellation, timeout, incumbent handling, mobile browsers, bundle size, full all-bird/profile corpus, or cross-browser behavior. It implements only exact feasibility and globally minimized maximum share. The approved serial macro-margin, category-midpoint, meaningful-diversity, fallback, and canonical quantity-vector stages are intentionally deferred until this first slice is reviewed.

The active catalog presently contains the distinct key `split_lentils` with values matching `lentils`. This proof of concept does not alter that active data. A later runtime adapter must canonicalize purely mechanical whole/split forms so they cannot manufacture diversity; that boundary is recorded as a separate active-data review item rather than silently corrected here.

## Owner decision boundary

A passing proof-of-concept test establishes only that the isolated model can solve the stated fixed corpus. It does not authorize a runtime calculator replacement or visible behavior change. Any such transition must first show the required full acceptance corpus, browser-Worker evidence, outputs for all affected scenarios, and exact owner-approved public wording.
