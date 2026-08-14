# Optimizer Improvement Brief

**Status:** **Approved and implemented on the audit branch.** The implementation does not change ingredient values, profile targets, feeding recommendations, or the explicit raw-toxicity exclusions.

## Purpose

The active multi-bird engine is the appropriate base because it preserves inventory limits, applies the ingredient-safety layer, reports shortages, and gives warnings for unmet nutrient and category conditions. Its documented weakness is that the current one-step score gives the selected profile’s macro midpoint more influence than category balance, which can leave a feasible category underrepresented. [1]

> **Product-owner decision:** Approved. The active engine now uses the two-stage deterministic model described below, with the existing product data preserved.

## Proposed two-stage model

| Stage | Responsibility | Non-negotiable conditions | Output |
|---|---|---|---|
| **1. Feasibility** | Identify the set of possible batch candidates. | Never exceed available inventory; reject raw-toxic and species-incompatible ingredients; retain every existing preparation/processing decision; report missing categories and impossible targets rather than silently pretending they are achievable. | A traceable set of feasible candidates and their explicit unmet conditions. |
| **2. Ranking** | Select the best feasible candidate in a stable, explainable way. | Deterministic tie-breaking; no hidden randomization; no changes to supplied macro values, profile ranges, or category ranges. | One recommended batch plus a score breakdown that explains why it won. |

## Candidate-ranking objective

The ranking stage compares candidates with a documented weighted objective, not with an opaque “best” label. The implemented weights are recorded below and the returned calculation result includes its score components for testing and future presentation work.

| Objective component | Measure | Desired behaviour |
|---|---|---|
| **Macro distance** | Distance from the selected profile’s protein, carbohydrate, fat, and fibre ranges or midpoints. | Prefer a candidate closer to the selected profile when other conditions are comparable. |
| **Category distance** | Distance from the selected bird’s grain, legume, and oil-seed ranges. | Prefer a candidate that fulfils the category architecture instead of solving macros by overusing one category. |
| **Diversity** | Count and proportional use of eligible ingredients, subject to inventory and category constraints. | Reward sensible variety only after safety and target constraints are considered; never force unnecessary ingredients. |
| **Warning penalty** | Number and severity of unavoidable target-miss or shortage warnings. | Prefer a candidate with fewer or less severe unmet conditions, while still displaying all remaining warnings. |

The implemented objective weights are **55% macro distance, 25% category distance, 10% diversity penalty, and 10% unmet-target count**. Candidate construction is category-feasible first; ingredient selection within each category is then ranked for macro fit and proportional variety. Alphabetical mix signatures break exact ties.

## Required safeguards

The implementation must preserve the following behaviours. It must not convert an information warning into a safety exemption, substitute ingredients absent from inventory, or claim nutrient adequacy that the engine cannot calculate. It must use a stable alphabetical tie-breaker after objective ties so identical settings always return the same result.

| Safeguard | Acceptance test |
|---|---|
| **Inventory integrity** | No ingredient amount exceeds the supplied inventory in every fixture. |
| **Safety integrity** | Raw-toxic and species-incompatible ingredients never appear in a formula; the existing explicit warnings remain visible. |
| **Transparency** | The returned result records macro distance, category distance, diversity contribution, and any unmet constraint. |
| **No silent regression** | The 21 existing smoke-test scenarios still pass. |
| **Pigeon continuity** | Fixed pigeon profile/inventory fixtures are compared against both the present multi-bird engine and the preserved legacy engine before review. |
| **No unapproved formulation change** | A pull request presents every changed fixture output and is reviewed before merging. |

## Implemented sequence

The implementation adds a score-breakdown type, creates feasible category plans before candidate ranking, uses stable tie-breaking, and extends the smoke test to verify determinism, inventory ceilings, and feasible pigeon category targets. The calculator path remains inventory-aware and preserves its warning layer.

## Explicit non-goals

This proposal does not choose new nutrition targets, alter ingredient macronutrient data, reinterpret the processing filter, replace human-authored feeding notes, generate new veterinary advice, or create a user-submission/provenance workflow. Those are separate decisions.

## References

[1] [Calculation Engine Benchmark](./CALCULATION_ENGINE_BENCHMARK.md)
