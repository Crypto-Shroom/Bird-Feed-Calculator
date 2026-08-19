# Issue #122: Constrained Mix Optimizer Specification

**Status:** Proposal for owner approval; not an implementation authorization.  
**Scope:** A deterministic, client-side calculator for real visitor inventory.  
**Non-goal:** This document does not change formulas, active ingredient eligibility, nutrient targets, safety/preparation outcomes, visitor-visible wording, Firebase configuration, Firestore region, deployment, or merge status.

## 1. Product contract

The calculator must find a **diverse, practical, and well-balanced mix from the visitor’s actual eligible stock**. It must satisfy the selected bird/profile macronutrient and category ranges whenever a feasible mix exists. If the inventory cannot satisfy those requirements jointly, it must return the closest attainable mix under a defined priority order and explain the material limits rather than presenting a locally chosen recipe as if it were optimal.

The current greedy construction cannot meet this contract. It allocates a category in fixed order, scores a 5 g or 10 g addition against an incomplete partial mix, commits the locally best ingredient, and performs no swap or backtracking pass. Issue #111 demonstrated that this can miss a same-inventory, same-category solution that meets every displayed macro range.

## 2. Data boundary: provenance is not runtime eligibility

`database/provenance/` is the canonical **evidence and review ledger**. A ledger record documents the exact food form, six-bird evidence status, sources, and limits. It is intentionally not imported by the V3 client.

The calculator currently receives candidate stock only from the visitor inventory object. It resolves each inventory key against the active `INGREDIENTS` catalog, then applies bird compatibility, toxicity, raw-food, and processing gates. A provenance review therefore does **not** automatically add a food to the calculator or to the visitor’s stock.

This separation is required. A food should pass, in order, an evidence review, an owner-approved active-data change, safety/compatibility configuration, nutrition/category data review, and UI/inventory integration before it becomes usable. **A ledger review alone is neither active-data approval nor a claim that a visitor owns the food.**

The future UI must also keep two concepts separate:

| Concept | Purpose | May seed the optimizer? |
| --- | --- | --- |
| **Recommended Formula** | Shows the owner-approved standard formula for the selected bird/profile. | No. It is explanatory reference data only. |
| **Actual Inventory** | Contains only ingredients and amounts the visitor added or explicitly imported. | Yes. It is the sole source of solver decision variables. |

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

Let `i` be an eligible ingredient and `c` a category (`grain`, `legume`, or `seed`). Let `q` be an owner-approved practical increment in grams. The initial proof of concept should evaluate 5 g and 10 g; production default must be selected only after accuracy and performance tests.

The primary quantity variable is an integer number of increments:

```text
nᵢ ∈ ℤ≥0
xᵢ = q · nᵢ grams of ingredient i
0 ≤ xᵢ ≤ availableᵢ
Σᵢ xᵢ = achievable target weight
```

`achievable target weight` is the requested amount capped by total safe eligible stock. The result must preserve the current explicit warning when the visitor does not have enough safe stock.

For each macro `m` and ingredient category `c`:

```text
macro(m) = Σᵢ xᵢ · macroᵢ(m) / Σᵢ xᵢ
category(c) = Σᵢ∈c xᵢ / Σᵢ xᵢ
```

Because the final weight is fixed, range constraints are linear after multiplying both sides by total weight. For a feasible solve, profile macro and category bounds are therefore represented directly as lower and upper linear inequalities. This is the established structure of feed formulation: exact mix weight, nutrient constraints, and ingredient-use bounds are solved jointly rather than sequentially.[1]

### 4.1 Meaningful diversity

Introduce one binary inclusion variable per eligible ingredient:

```text
zᵢ ∈ {0, 1}
q · zᵢ ≤ xᵢ ≤ min(availableᵢ, practicalMaximumᵢ) · zᵢ
```

An ingredient counts as diverse only when it has at least one meaningful increment. The owner must approve whether the minimum should be one increment or a species/profile-specific value. This prevents cosmetic 5 g or 10 g additions merely to increase a diversity count.

The initial design uses two complementary diversity measures:

1. **Meaningful ingredient count:** maximize `Σ zᵢ` after nutrition quality is settled.
2. **Concentration:** minimize `M`, with `xᵢ ≤ M · totalWeight` for all `i`, after the count is settled.

The count prevents the current one-dominant-ingredient pattern; the concentration stage prevents a 61% wheat result when a less concentrated equally valid composition exists. Diet-optimization literature similarly requires explicit acceptability or consumption bounds to avoid mathematically valid but unreasonable one-food solutions.[2]

## 5. Lexicographic solve sequence

A single weighted score is not sufficient. It obscures policy trade-offs, can allow a small diversity benefit to outweigh a material macro miss, and makes future changes hard to audit. Solve sequential stages, fixing the best result of each completed stage before moving to the next.

| Stage | Objective / rule | Why it precedes later stages |
| --- | --- | --- |
| 0 | Apply the hard gates and establish actual target weight. | Safety and inventory are never negotiated. |
| 1 | Solve the exact feasibility model: all macro and category ranges inside configured bounds. | A feasible profile-compliant mix is categorically preferable to an attractive but out-of-range mix. |
| 2A, if Stage 1 is feasible | Minimize normalized distance from macro midpoints. | Selects a balanced mix within acceptable ranges. |
| 2B, if Stage 1 is infeasible | Minimize normalized lower/upper violations across macros and categories; use a documented priority policy for macro versus category deviations. | Returns the best attainable result honestly instead of failing or using a greedy path. |
| 3 | Minimize normalized category-midpoint distance. | Preserves the selected bird’s intended broad composition after nutrition compliance. |
| 4 | Maximize meaningful ingredient count. | Improves ingredient variety only after profile quality is fixed. |
| 5 | Minimize maximum single-ingredient share `M`. | Avoids avoidable concentration among equally varied mixes. |
| 6 | Stable deterministic tie-break on the canonical sorted ingredient ID vector. | Ensures same input always yields same output. |

The fallback stage must expose the signed deficit or excess for each macro/category and identify the safe eligible ingredient/category capacities that prevented exact feasibility. It must never say “optimized” without indicating `feasible` versus `best_attainable`.

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

The proof of concept should compare two implementation candidates against an identical scenario corpus:

| Candidate | Strengths | Risks / required proof |
| --- | --- | --- |
| **YALPS** | MIT license; TypeScript; browser-oriented; supports LP, integer, and mixed-integer models; designed for small problems.[4] | No native multi-objective API, so sequential model stages must be constructed and tested. Dense in-memory representation requires benchmarks using the project’s largest supported inventories. |
| **HiGHS WebAssembly** | MIT; browser-capable LP/MIP/QP; mature upstream solver capabilities; can expose infeasibility diagnostics.[5] [6] | The reviewed `highs-js` MIP/persistent API is labeled prerelease. Do not adopt until an exact pinned release, Vite asset loading, worker behavior, bundle budget, and cross-browser tests are approved. |

`glpk.js` is not the default candidate because its reviewed package is GPL-3.0, which requires a separate owner/license decision even though it supports browser LP/MILP.[7]

All solving should run in a Web Worker once a candidate meets the correctness corpus, so a slower solve cannot freeze the UI. The worker should receive serializable inputs and return a fully validated result; it must not own product rules or alter safety outcomes.

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
| Diversity corpus | A candidate with more meaningful ingredients wins only after matching all higher-priority profile objectives. |
| Concentration corpus | Among equal higher-priority solutions, the lower maximum-share mix wins. |
| Determinism corpus | Reordered inventory keys produce byte-equivalent normalized output. |
| Fallback corpus | Known infeasible inventory returns `best_attainable`, quantified misses, and limiting capacity explanation—not a false compliant result. |
| Differential corpus | For every scenario, a retained exact reference model and the production adapter agree on status, quantities within increment tolerance, and ordered objective values. |
| Performance corpus | Benchmarks cover each supported bird/profile and a realistic maximum number of actual inventory items on desktop and target mobile browsers. Define the owner-approved time budget before adoption. |

Property tests should additionally assert that increasing the available amount of an eligible ingredient never reduces the feasible set, adding unsafe inventory never changes the safe candidate solution, and fixed inputs always produce fixed output.

## 8. Migration and governance plan

1. Merge only the diagnostic and specification PRs that the owner explicitly approves. They are not runtime changes.
2. Build an isolated proof-of-concept branch with no public-copy changes and no change to nutrition targets, active ingredients, or human-made standard formulas.
3. Compare solver candidates and practical increments with the corpus above. Record package license, pinned version, bundle impact, worker loading, timeout behavior, and cross-browser evidence.
4. Present the actual behavior diff for every bird/profile default and the chosen user-supplied inventories. The owner must approve any altered output before implementation PR review.
5. Implement the actual-inventory / Recommended Formula separation as a dedicated reviewed change, with explicit owner approval for every changed visible string.
6. Keep existing critical safety warnings explicit and red. Do not weaken raw adzuki, raw legume, toxicity, preparation, or pigeon-only garlic boundaries.
7. Open a separate behavior-change PR, link it to Issue #122 and all related sub-tasks, provide full validation, and wait for explicit owner approval in Manus chat before merging.

## 9. Owner decisions requested

Before implementation, the owner should approve these policy decisions:

| Decision | Proposed default | Why it needs owner approval |
| --- | --- | --- |
| Range priority | Macro and category bounds are jointly hard when feasible; when jointly infeasible, minimize normalized macro violation before category violation. | Determines trade-off semantics. |
| Practical increment | Evaluate 5 g versus 10 g in proof of concept; select from accuracy/performance evidence. | Changes output granularity. |
| Meaningful inclusion | One practical increment initially; permit profile-specific future minimums only with evidence and approval. | Defines “diverse” in a visitor-visible result. |
| Concentration | Minimize maximum share after count and profile quality. | Determines the balance between variety and familiar staple ingredients. |
| Solver | Start proof of concept with YALPS; compare with stable HiGHS MIP if available. | Adds an external dependency and browser execution behavior. |
| Fallback explanation | Define exact owner-approved wording only after implementation evidence exists. | Public copy requires explicit approval. |

## References

[1]: https://www.fao.org/4/x5738e/x5738e0h.htm "FAO: Linear Programming in Fish Diet Formulation"
[2]: https://pmc.ncbi.nlm.nih.gov/articles/PMC6021504/ "van Dooren (2018): A Review of the Use of Linear Programming to Optimize Diets"
[3]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10026400/ "Padovan et al. (2023): Mixed Integer Programming for Nutritional Menu Formulation"
[4]: https://github.com/IanManske/YALPS "YALPS: TypeScript LP/MILP Solver"
[5]: https://github.com/lovasoa/highs-js "highs-js: HiGHS Optimization Solver for JavaScript"
[6]: https://highs.dev/ "HiGHS: High Performance Linear Optimization Software"
[7]: https://github.com/jvail/glpk.js/ "glpk.js: Browser and Node LP/MILP Interface"
