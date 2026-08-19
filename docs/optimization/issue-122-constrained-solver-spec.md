# Issue #122: Constrained Mix Optimizer Specification

**Status:** Proposal for owner approval; not an implementation authorization.  
**Scope:** A deterministic, client-side calculator for real visitor inventory.  
**Non-goal:** This document does not change formulas, active ingredient eligibility, nutrient targets, safety/preparation outcomes, visitor-visible wording, Firebase configuration, Firestore region, deployment, or merge status.

## 1. Product contract

The calculator must find a **diverse, practical, and well-balanced mix from the visitor’s actual eligible stock**. It must satisfy the selected bird/profile macronutrient and category ranges whenever a feasible mix exists. If the inventory cannot satisfy those requirements jointly, it must return the closest attainable mix under a defined priority order and explain the material limits rather than presenting a locally chosen recipe as if it were optimal.

The current greedy construction cannot meet this contract. It allocates a category in fixed order, scores a 5 g or 10 g addition against an incomplete partial mix, commits the locally best ingredient, and performs no swap or backtracking pass. Issue #111 demonstrated that this can miss a same-inventory, same-category solution that meets every displayed macro range.

The current output is **repeatable**, but not globally optimized. It first alphabetically sorts the eligible inventory, creates four local category-share plans, fills `grain → legume → seed` one increment at a time, and resolves score ties by ingredient ID. The local `candidates` variable is simply the four completed trial mixes built from those plans; it does **not** import foods and it does not represent all feasible combinations. The final sort chooses the lowest score among those four greedy paths. Determinism is useful for reproducibility, but it cannot repair a locally committed allocation or prove that the result is the best complete mix.

## 2. Data boundary: provenance is not runtime eligibility

`database/provenance/` is the canonical **evidence and review ledger**. A ledger record documents the exact food form, six-bird evidence status, sources, and limits. It is intentionally not imported by the V3 client.

The calculator currently receives candidate stock only from the visitor inventory object. It resolves each inventory key against the active `INGREDIENTS` catalog, then applies bird compatibility, toxicity, raw-food, and processing gates. A provenance review therefore does **not** automatically add a food to the calculator or to the visitor’s stock.

This separation is required. A food should pass, in order, an evidence review, an owner-approved active-data change, safety/compatibility configuration, nutrition/category data review, and UI/inventory integration before it becomes usable. **A ledger review alone is neither active-data approval nor a claim that a visitor owns the food.**

### 2.1 Active ingredient catalog policy

The active food catalog and the visitor inventory are different things. The food catalog is the set of owner-approved, searchable items the planner understands; the visitor inventory is the subset and quantity that the visitor says they have. A reviewed food should become a catalog item only after the owner approves its exact active form, nutrition/category data, safety behavior, and any visible presentation. It must never be silently inserted into a visitor’s inventory.

Herbs and supplements already have a separate active catalog: `HERBS_SUPPLEMENTS`, backed for eligibility by `database/herb-provenance.mts`, and surfaced in the Herb Library and Personalized Supplement Mix. They are intentionally not `INGREDIENTS` for the grain/legume/seed macronutrient optimizer: their recorded forms, doses, and purposes are different from a kilogram-scale energy/protein mix. The desired policy is therefore:

| Item type | When it becomes catalog-visible | Where it belongs | May enter the macronutrient mix solver? |
| --- | --- | --- | --- |
| Food/feed ingredient | After evidence review **and** separate owner approval of active form, nutrition/category data, safety behavior, and UI integration. | Active food catalog; visitor can add it to actual inventory. | Yes, only after the visitor adds actual stock and all hard gates pass. |
| Herb or supplement | After evidence review **and** owner approval of its active herb record, bird eligibility, and display/dose data. | Herb & Supplement catalog; a future separate “my supplements” list may track possession. | No, unless a separate owner-approved change establishes that exact form as a gram-scale feed ingredient with nutrition/category and safety evidence. |

The catalog should therefore contain approved ingredient requests after their evidence and active-data path completes. An exact food form should become a selectable active catalog item after its six-bird evidence review, active nutrition/category record, compatibility/safety configuration, and explicit owner approval are complete. It must still remain absent from visitor stock until the visitor adds it.

### 2.2 Single primary mix panel

The owner requires **one primary mix panel**, not a separately displayed Recommended Formula field. The panel has two states:

| Panel state | What the visitor sees in the same mix panel | What the calculator may use |
| --- | --- | --- |
| No actual inventory | The selected bird/profile’s standard formula as the initial recommended mix. Its presentation must make clear that it is a standard reference, not claimed visitor stock. | No visitor-stock calculation is performed. |
| Actual inventory present | The optimized inventory-based mix replaces the standard reference in that same panel. | Only the visitor’s safe eligible stock. |

The current screen still initializes and resets inventory from profile-specific starter presets. That is not the desired final contract: it can make a standard formula look like visitor stock. The future reviewed UI change must start actual inventory empty, retain the existing single mix-panel location, show the selected bird/profile standard formula there until stock is added, and switch that same panel to the inventory-based result only after stock exists. Exact public wording remains a separate owner-approved copy decision.

## 3. Required inputs and safety gates

For each calculation request, derive the candidate set from the selected bird, profile, target weight, and actual inventory.

| Gate | Rule | Result when failed |
| --- | --- | --- |
| Active catalog | The inventory key must map to an owner-approved active ingredient record. | Ignore the key; record an internal validation reason. |
| Positive finite stock | Amount must be finite and greater than zero. | Exclude. |
| Bird compatibility | Ingredient must be compatible with the selected bird. | Exclude with the existing explicit safety reason. |
| Toxicity | Ingredient must not have an active toxicity exclusion. | Exclude with the existing explicit safety reason. |
| Form and processing | Ingredient must not be raw-unsafe or require processing that has not been verified. | Exclude with the existing explicit safety reason. |
| Availability | Selected amount must not exceed visitor stock. | Hard model bound. |

No optimizer objective, however attractive the nutrition score, may reintroduce an excluded ingredient. This is a hard feasibility boundary, not a trade-off.

## 4. Mathematical model

Let `i` be an eligible ingredient and `c` a category (`grain`, `legume`, or `seed`). Let `q` be the computation increment in grams. The initial proof of concept uses **`q = 1 g`**. The validated requested weight must be a non-negative multiple of `q`; display and export rounding are separate owner-approved presentation decisions.

For each safe active inventory record, first truncate stock to a quantity that can be represented exactly:

```text
Aᵢ = floor(availableᵢ / q) × q
W = min(requestedWeight, Σᵢ Aᵢ)
```

`W` is the **achievable target weight** and is the exact total-weight equality used by every model stage. This definition is required, not illustrative. With the first proof-of-concept `q = 1 g`, `Aᵢ` and `W` are whole grams. A request that is not a multiple of `q` is rejected before solving rather than silently rounded inside the model.

The primary quantity variable is an integer number of increments:

```text
nᵢ ∈ ℤ≥0
xᵢ = q · nᵢ grams of ingredient i
0 ≤ xᵢ ≤ Aᵢ
Σᵢ xᵢ = W
```

The result must preserve the current explicit warning when `W < requestedWeight` because safe eligible stock is insufficient.

For each macro `m` and ingredient category `c`:

```text
macro(m) = Σᵢ xᵢ · macroᵢ(m) / Σᵢ xᵢ
category(c) = Σᵢ∈c xᵢ / Σᵢ xᵢ
```

Because the final weight is fixed, range constraints are linear after multiplying both sides by total weight. For a feasible solve, profile macro and category bounds are therefore represented directly as lower and upper linear inequalities. This is the established structure of feed formulation: exact mix weight, nutrient constraints, and ingredient-use bounds are solved jointly rather than sequentially.[1]

### 4.1 Meaningful diversity and concentration

Computation precision and meaningful diversity are separate policies. The first proof of concept computes every quantity at `q = 1 g`, but it uses a provisional **meaningful-inclusion threshold `d = 5 g`**. The local Canary/Breeding test demonstrated why: a 1 g threshold inserts cosmetic 1 g canola, while 5 g preserves the same profile-compliant mix without falsely counting it as diversity. The full corpus may support changing `d`, but it must never default to `q` merely because the solver computes at `q`.

For an ingredient with `Aᵢ ≥ d`, introduce a binary indicator that is exactly linked to whether its completed-mix amount reaches the threshold:

```text
zᵢ ∈ {0, 1}
d · zᵢ ≤ xᵢ
xᵢ ≤ (d − q) + (Aᵢ − d + q) · zᵢ
```

For `Aᵢ < d`, do not create a diversity binary; the ingredient may still be used for nutrition up to `Aᵢ`, but cannot count as meaningful diversity. This removes `practicalMaximumᵢ` entirely from the first proof of concept.

The model measures two complementary dimensions from the start of every **completed** mix:

1. **Meaningful ingredient count:** `Σ zᵢ`.
2. **Concentration:** `M` in grams, with `xᵢ ≤ M` for all `i`; the reported largest-share percentage is `100 × M / W`.

Concentration is not a late cosmetic tie-break. `xᵢ`, `zᵢ`, and `M` exist together in **every full-mix model**; the solver never locks a partial recipe and adjusts it afterward. Diet-optimization literature similarly requires explicit acceptability or consumption bounds to avoid mathematically valid but unreasonable one-food solutions.[2]

### 4.2 Normalized macro safety margin (Chebyshev center)

For an exact-feasible mix, introduce one continuous variable `r ≥ 0`: the smallest normalized clearance from **any macro bound**. For each macro `m`, with percentage bounds `Lₘ` and `Uₘ`, and completed-mix macro percentage `pₘ = Pₘ / W`, enforce:

```text
(pₘ − Lₘ) / (Uₘ − Lₘ) ≥ r
(Uₘ − pₘ) / (Uₘ − Lₘ) ≥ r
```

After multiplying by `W × (Uₘ − Lₘ)`, these are linear constraints suitable for HiGHS:

```text
Pₘ − W × (Uₘ − Lₘ) × r ≥ W × Lₘ
Pₘ + W × (Uₘ − Lₘ) × r ≤ W × Uₘ
```

Maximizing `r` finds the **Chebyshev center of the feasible macro region**: the complete recipe whose nearest macro boundary is as far away as possible after each macro is normalized by its own allowed width. A result of `r = 0.1382`, for example, has at least 13.82% of every macro range width between it and its closest macro limit.

Category bounds remain hard feasibility constraints but are **not included in `r`**. The local active Chicken/Pet test proved why: its safe inventory can meet category targets only at 80% grain, 20% legume, and 0% seed, so including category clearance forces a meaningless `r = 0` even while a positive macro safety margin exists.

### 4.3 Hard category ranges and soft midpoint preference

The configured category ranges are the governing recipe-shape rules. For every category `c`, the completed mix must satisfy `L𝚌 ≤ C𝚌 / W ≤ U𝚌`. A category midpoint is **not** a new target, safety rule, or additional range. It is only a later preference applied after safety gates, actual-stock caps, macro constraints, the retained macro-margin band, and these existing hard category ranges are all satisfied.

When more than one remaining mix is valid, define midpoint `H𝚌 = (L𝚌 + U𝚌) / 2` and normalized midpoint distance `d𝚌 = |(C𝚌 / W) − H𝚌| / (U𝚌 − L𝚌)`. Stage 4 minimizes `T = max(d𝚌)` across grain, legume, and seed. This selects the most evenly close category shape without ever allowing a mix outside its configured range. If inventory forces an allowed boundary, such as 80% grain / 20% legume / 0% seed for Chicken/Pet, the solver retains that boundary honestly; it does not manufacture an ingredient or break a macro constraint merely to approach a midpoint.

The production model solves this margin directly as an integer MIP. A continuous LP upper bound may be retained in the test/reference harness, but it is not a required production stage: direct 1 g MIP maximization yields the actual achievable `r` and avoids an additional solve plus an arbitrary continuous-to-integer tolerance.

For `best_attainable` fallback, `r` is not presented as an exact-feasible safety margin. The locked normalized macro/category slack values remain the authoritative deficit/excess measure.

## 5. Bounded global solve sequence

A single weighted score is not sufficient. It obscures policy trade-offs, can allow a small diversity benefit to outweigh a material macro miss, and makes future changes hard to audit. Conversely, generating an entire multiobjective integer Pareto front for every browser interaction is unnecessarily expensive. The production approach uses a bounded **epsilon/lexicographic sequence of globally solved full-mix models**. Every stage uses the same `x`, `z`, and `M` variables; it never carries forward a partially constructed recipe.[8]

### 5.1 Exact normalized fallback slack definitions

Let a macro `m` have configured percentage bounds `Lₘ` and `Uₘ`, and completed-mix activity `Pₘ = Σᵢ xᵢ × macroᵢ(m)`. Let a category `c` have percentage bounds `L𝚌` and `U𝚌`, and gram activity `C𝚌 = Σᵢ∈c xᵢ`. Define non-negative lower and upper slack variables:

```text
p⁻ₘ = max(0, Lₘ × W − Pₘ)       p⁺ₘ = max(0, Pₘ − Uₘ × W)
c⁻𝚌 = max(0, L𝚌 × W / 100 − C𝚌) c⁺𝚌 = max(0, C𝚌 − U𝚌 × W / 100)

D_macro    = Σₘ (p⁻ₘ + p⁺ₘ) / (W × (Uₘ − Lₘ))
D_category = Σ𝚌 (c⁻𝚌 + c⁺𝚌) / (W × (U𝚌 − L𝚌) / 100)
```

The denominators are the target-range width at the current achievable weight `W`. Each term is dimensionless; a one-range-width macro miss and a one-range-width category miss have the same normalized magnitude within their respective objective. The model implements each `max` expression with the corresponding non-negative linear slack inequalities, not nonlinear arithmetic.

### 5.2 Serial full-mix stages

| Stage | Full-mix objective / rule | Lock before later stages |
| --- | --- | --- |
| 0 | Apply hard gates and calculate `Aᵢ` and `W` exactly. | Safety, processing, active-catalog validity, and actual stock are never negotiated. |
| 1 | Solve global exact feasibility: total `W`, stock caps, macro ranges, category ranges, inclusion links, and maximum-share links. | If optimal, every macro/category slack is zero. |
| 2A, only if Stage 1 is infeasible | Minimize `D_macro`; record `D_macro*`. Then add `D_macro = D_macro*` and minimize `D_category`; record `D_category*`. | Add **both** `D_macro = D_macro*` and `D_category = D_category*` to every later fallback stage. Mathematical locks are exact; implementation uses only documented solver feasibility tolerance and records it. |
| 2B, if Stage 1 is feasible | Set `D_macro = 0` and `D_category = 0`. | Carry both zero locks forward. |
| 3, if Stage 1 is feasible | Maximize normalized macro safety margin `r`; record `r*`. | Add `r ≥ r* − ε_r`; first proof-of-concept default is `ε_r = 0`. |
| 3, if Stage 1 is infeasible | Under both locked fallback slack values, minimize normalized macro-midpoint distance; record `macroBest`. | Add `macroDistance ≤ macroBest + ε_macro`. `r` is not treated as a feasible safety margin. |
| 4 | Among mixes that retain the existing hard category ranges and all prior locks, minimize `T`, the maximum normalized distance from the configured grain, legume, and seed midpoints; record `categoryBest`. | Add `categoryDistance ≤ categoryBest + ε_category`. The midpoint is a soft preference only; it never overrides a configured range, macro constraint, stock cap, or safety gate. |
| 5A | Minimize maximum ingredient amount `M` under all retained slack, margin, and balance locks; record `M*`. | Add `M ≤ M* + τ_M`; first proof-of-concept default is `τ_M = 0 g`. |
| 5B | Maximize `Σ zᵢ` under all prior locks. | Lock the resulting inclusion count exactly. |
| 6 | Apply serial quantity-vector tie-break to the remaining full-mix solutions. For canonically sorted ingredient IDs `i₁…iₙ`, minimize `xᵢ₁`, lock it, then minimize `xᵢ₂`, lock it, and continue through `xᵢₙ`. | This is collision-free because it compares the full ordered quantity vector component by component, rather than using an alphabetical weighted score. |

The fallback result must expose the signed deficit or excess for each macro/category and identify the safe eligible ingredient/category capacities that prevented exact feasibility. It must never say “optimized” without indicating `feasible` versus `best_attainable`.

### 5.1 Proposed status contract

| Status | Meaning | Required result behavior |
| --- | --- | --- |
| `feasible` | A mix meets all configured macro and category bounds. | Display the mix, full score breakdown, and diversity measures. |
| `best_attainable` | No mix can meet every configured range using the safe actual stock. | Display the best balanced fallback, all misses, and constraints that limited the solve. |
| `insufficient_safe_inventory` | Eligible stock is below requested weight. | Cap weight, preserve explicit warning, then use `feasible` or `best_attainable` for the capped amount. |
| `no_eligible_ingredients` | Safety filtering leaves no stock. | Preserve critical safety message; do not run model. |
| `solver_timeout` | The solver did not prove the requested stage in its budget. | Return only an explicitly marked deterministic incumbent if it passes safety and inventory validation; otherwise return no mix. Capture diagnostics for testing. |

## 6. Solver implementation decision

The target model is a small mixed-integer linear program, not a new greedy heuristic. Binary inclusion variables are necessary for meaningful diversity; integer quantities produce practical increments. Mixed-integer programming is designed for this combination of numeric quantity and yes/no selection decisions.[3]

The recommended implementation is **stable HiGHS WebAssembly (`highs` 1.15.2, MIT)** in a dedicated Web Worker. The stable package’s one-shot API solved an isolated integer model to optimality; the persistent and extended multiobjective APIs were not exposed by that installed stable package, so the implementation should generate one named CPLEX-LP model per stage and execute the bounded stages serially. This avoids adopting the package’s prerelease extended API while still using a mature global branch-and-cut MIP solver.[5] [6]

| Implementation component | Required design |
| --- | --- |
| `optimizer-model.ts` | Pure model builder. It accepts only validated active-catalog records, actual inventory, bird/profile targets, and policy constants; it emits named LP rows/variables. |
| `optimizer-worker.ts` | Loads HiGHS once, receives serializable requests, runs bounded stages, records status/time/gap, validates the returned mix, and disposes/restarts safely on error. |
| `optimizer-policy.ts` | Contains owner-approved `q`, `d`, `ε_r`, `ε_macro`, `ε_category`, `τ_M`, time budget, solver feasibility tolerance, and serial quantity-vector tie-break policy. No hidden score weights. |
| `optimizer-explain.ts` | Derives status, range checks, macro/category misses, limiting stock, and an audit trace from the returned mix. It must never invent an explanation. |
| Main UI | Debounces inventory edits, cancels superseded worker requests, and renders only the latest validated response in the existing single mix panel. |

The use of one full-mix model per stage is intentional. It makes the policy auditable, preserves category importance, and lets concentration/diversity influence the same global quantity decisions without requiring an unbounded full Pareto-front enumeration. `glpk.js` is not the default candidate because its reviewed package is GPL-3.0, which requires a separate owner/license decision even though it supports browser LP/MILP.[7]

The Worker/HiGHS direction is **conditional, not approved merely by this specification**. It may enter a runtime proof-of-concept branch only after the declared acceptance corpus covers largest real inventories, target desktop/mobile browsers, Worker cancellation, timeout and incumbent handling, bundle impact, repeated determinism, and reference-model agreement.

### 6.1 Initial 1 g precision benchmark

Two isolated exact MIP benchmarks used the active Chicken → Pet/Companion target ranges, active category bounds, and the active five-item Chicken starter inventory at a 1,000 g target. Both jointly enforced exact macros/categories and stock limits while minimizing maximum ingredient share from the beginning. All tested increments returned the same globally balanced 200 g each of corn, wheat, barley, oats, and peas. YALPS completed 1 g at 0.347 ms median across 20 local runs; stable HiGHS 1.15.2 completed the equivalent 1 g model at 9.773 ms median, 12.357 ms mean, and 71.328 ms maximum across 20 local runs.

A 1 g model is **more computationally complex**, not less: each ingredient quantity has up to ten times as many integer levels as a 10 g model, and branch-and-cut must consider a larger discrete search space. It is more accurate because it reduces rounding restriction, but accuracy does not make the solver’s combinatorial search easier. The observed small-model timings are encouraging evidence that 1 g is practical, **not** production proof. The acceptance corpus must still test maximum real inventory size, all birds/profiles, difficult infeasible cases, browser workers, bundle impact, cancellation, and deterministic repeated execution before 1 g becomes a production commitment.

## 7. Validation and acceptance corpus

The implementation cannot be accepted based on the Chicken example alone. Create a checked-in scenario corpus and verify every solve against a reference model.

| Test family | Required assertion |
| --- | --- |
| Issue #111 — Chicken Pet/Companion | Reproduces a same-inventory feasible result within all displayed ranges; does not require a seed category when configured category bounds permit zero seed. |
| Issue #85 — large mixed pigeon stock | Uses more meaningful ingredients than the reported concentrated output whenever equally profile-compliant alternatives exist; no cosmetic additions. |
| Issue #83 — existing ingredient guidance | Suggestion logic uses normalized canonical IDs and only recommends a diversity addition when the relevant ingredient/category is absent or concentration policy calls for it. This remains a separate visible-copy review. |
| Issue #73 — pigeon Winter | Classifies the result feasible or best attainable using exact range checks and reports protein limits correctly. |
| Safety corpus | Toxic, incompatible, raw-unsafe, and processing-required stock never appears in a selected mix, even if it would solve a macro deficit. |
| Inventory corpus | No selected amount exceeds stock; result sum equals requested/capped target; duplicate or invalid amounts are deterministic. |
| Safety-margin, diversity, and concentration corpus | For feasible mixes, the global full-mix stages maximize normalized macro margin `r`, retain approved `ε_r`, apply category-balance tolerance, then minimize maximum share and maximize meaningful inclusion. For fallbacks, locked slack values replace `r`. Neither policy may create a macro/category range violation, and the audit trace identifies every retained tolerance. |
| Determinism corpus | Reordered inventory keys produce byte-equivalent normalized output. |
| Fallback corpus | Known infeasible inventory returns `best_attainable`, quantified misses, and limiting capacity explanation—not a false compliant result. |
| Differential corpus | For every scenario, a retained exact reference model and the production adapter agree on status, quantities within increment tolerance, and ordered objective values. |
| Worker and performance corpus | Benchmarks cover each supported bird/profile, the largest real actual-inventory cases, target desktop and mobile browsers, first-load and warm solves, Worker cancellation, timeout and incumbent handling, repeated determinism, and bundle impact. Define the owner-approved time and MIP-gap budget before adoption. |

Property tests should additionally assert that increasing the available amount of an eligible ingredient never reduces the feasible set, adding unsafe inventory never changes the safe candidate solution, and fixed inputs always produce fixed output.

## 8. Migration and governance plan

1. Merge only the diagnostic and specification PRs that the owner explicitly approves. They are not runtime changes.
2. Build an isolated proof-of-concept branch with no public-copy changes and no change to nutrition targets, active ingredients, or human-made standard formulas.
3. Compare solver candidates using the 1 g corpus above. Record package license, pinned version, bundle impact, worker loading, timeout behavior, cross-browser evidence, and the frontier/tolerance selection trace.
4. Present the actual behavior diff for every bird/profile default and the chosen user-supplied inventories. The owner must approve any altered output before implementation PR review.
5. Implement the owner-approved two-state behavior in the existing single mix panel: profile standard formula before actual stock, then inventory-based mix once stock exists. Obtain explicit owner approval for every changed visible string.
6. Keep existing critical safety warnings explicit and red. Do not weaken raw adzuki, raw legume, toxicity, preparation, or pigeon-only garlic boundaries.
7. Open a separate behavior-change PR, link it to Issue #122 and all related sub-tasks, provide full validation, and wait for explicit owner approval in Manus chat before merging.

## 9. Owner decisions requested

Before implementation, the owner should approve these policy decisions:

| Decision | Proposed default | Why it needs owner approval |
| --- | --- | --- |
| Range priority | Macro and category bounds are jointly hard when feasible. When jointly infeasible, minimize normalized macro violation before category violation. Macros mean protein, carbohydrates, fat, and fiber; categories mean the grain, legume, and seed percentage shares. | Determines whether a nutrient miss can ever be accepted to preserve a category shape. |
| Computation increment | Use 1 g in the proof of concept. It is more accurate but expands the integer search space; isolated stable-HiGHS evidence is encouraging, and the full corpus must confirm it. | Controls numerical precision and browser time budget. |
| Meaningful inclusion | Compute at `q = 1 g`; use provisional `d = 5 g` for meaningful inclusion because the local Canary/Breeding test rejected the cosmetic 1 g alternative. Revalidate `d` across the full corpus before product adoption. | Defines “diverse” without equating numerical precision with a visitor-meaningful ingredient. |
| Macro safety margin, concentration, and diversity | For feasible mixes, directly maximize normalized macro Chebyshev margin `r`, lock `r ≥ r* − ε_r` with POC `ε_r = 0`, retain category balance, then minimize `M`, lock `M ≤ M* + τ_M` with POC `τ_M = 0 g`, and maximize meaningful inclusion. | Keeps the furthest achievable macro safety buffer ahead of composition quality without allowing category bounds to collapse that buffer to zero. |
| Solver | Use stable `highs` 1.15.2 in a dedicated browser Worker only after the declared largest-inventory, desktop/mobile, cancellation, timeout/incumbent, bundle, determinism, and reference-agreement corpus passes. | Adds an external dependency and browser execution behavior. |
| Category guidance | Enforce the existing configured grain/legume/seed ranges as hard constraints. Once those ranges and all prior rules are retained, minimize maximum normalized distance to their configured midpoints as a soft recipe-shape preference. | Uses the established category guidance without creating a new target or allowing midpoint preference to override safety, stock, macro, or range rules. |
| Missing-category guidance | Preserve the existing Missing Essential Ingredients detector unchanged. It answers whether safe eligible inventory contains any grain, legume, or seed category; it is not an equilibrium or feasibility score. | Retains the existing useful red category-availability guidance while the solver separately reports whether the exact safe inventory can satisfy all configured ranges together. |
| Single panel | Use the current mix-panel location for both the profile’s initial standard formula and the later actual-inventory mix; do not add a separate Recommended Formula field. | Preserves the owner’s requested interaction model while not misrepresenting standard formula as stock. |
| Fallback explanation | Define exact owner-approved wording only after implementation evidence exists. | Public copy requires explicit approval. |

## References

[1]: https://www.fao.org/4/x5738e/x5738e0h.htm "FAO: Linear Programming in Fish Diet Formulation"
[2]: https://pmc.ncbi.nlm.nih.gov/articles/PMC6021504/ "van Dooren (2018): A Review of the Use of Linear Programming to Optimize Diets"
[3]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10026400/ "Padovan et al. (2023): Mixed Integer Programming for Nutritional Menu Formulation"
[4]: https://github.com/IanManske/YALPS "YALPS: TypeScript LP/MILP Solver"
[5]: https://github.com/lovasoa/highs-js "highs-js: HiGHS Optimization Solver for JavaScript"
[6]: https://highs.dev/ "HiGHS: High Performance Linear Optimization Software"
[7]: https://github.com/jvail/glpk.js/ "glpk.js: Browser and Node LP/MILP Interface"
[8]: https://pmc.ncbi.nlm.nih.gov/articles/PMC8248908/ "Pappas et al. (2021): Multiobjective Optimization of Mixed-Integer Linear Programming Problems"
