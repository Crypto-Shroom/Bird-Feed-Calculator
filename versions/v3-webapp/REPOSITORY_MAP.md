# Bird Feed Calculator Repository Map

**Purpose:** This map explains which parts of the repository are active, which are preserved for compatibility/history, and how changes should move toward `main` without deleting or overwriting prior work.

## Branch policy

| Branch or reference | Role | Allowed action |
|---|---|---|
| [`main`](https://github.com/Crypto-Shroom/Bird-Feed-Calculator/tree/main) | **GitHub’s default branch** and public baseline. It contains historical work that has not yet been reconciled with the active audited calculator. | Do not force-push, delete, or merge into it without product-owner approval and a reviewed pull request. |
| [`audit-safety-optimization-2026-08-14`](https://github.com/Crypto-Shroom/Bird-Feed-Calculator/tree/audit-safety-optimization-2026-08-14) | **Active development/audit branch.** This is where the multi-bird calculator, validation workflow, audit records, approved copy restoration, and follow-up documentation are being maintained. | Commit small, explained changes; validate locally and through the workflow; do not merge without approval. |
| Historical pull-request branches | Preserved implementation history from earlier repository restructuring. | Keep intact. Treat them as reference material until a deliberately reviewed consolidation says otherwise. |

> **Current rule:** `main` is the canonical public branch, but the audit branch is the active working baseline. They must be reconciled through a reviewable pull request; neither branch should overwrite the other.

## Why the branches cannot be fast-forwarded

The audit branch and `main` have independent commits. A direct fast-forward is therefore impossible: it would either discard current-main history or omit audit-branch work. The safe path is to create a dedicated reconciliation pull request, preserve both histories, resolve each conflict explicitly, and show the resulting calculator fixtures before any merge. This is a version-control issue, not evidence that either branch is inherently “worse.”

## Recommended reconciliation sequence

| Step | Action | Safeguard |
|---|---|---|
| 1 | Inspect the current `main` diff against the audit branch and identify overlapping files. | No files are deleted or changed. |
| 2 | Create a **new reconciliation branch** from the current `main`. | The historical branches remain untouched. |
| 3 | Bring in the audit changes in small, documented groups: calculator/UI, safety data, tests/CI, then documentation. | Each group can be reviewed and reverted independently. |
| 4 | Run `pnpm check`, `pnpm test:calculator`, and `pnpm build`; compare fixed pigeon fixtures. | Prevents a silent formula or build regression. |
| 5 | Open a pull request to `main` with the conflict decisions, output changes, and release notes. | Product owner reviews before merge. |
| 6 | Merge only after explicit product-owner approval. | No casual or automatic merge. |

## Project layout

| Path | Responsibility | Notes |
|---|---|---|
| `client/src/pages/Home.tsx` | Main calculator experience. | Bird selector, profile/situation controls, inventory, warnings, batch output, enrichment, analysis, and recipe export. |
| `client/src/lib/data.ts` | Human-authored ingredient database, legacy pigeon profiles, and herb data. | Treat numeric values, profile names, feeding guidance, and herb recommendations as protected product data. |
| `client/src/lib/birds.ts` | Active six-bird profiles, targets, daily-feeding/context notes, and care display data. | Pigeon, Parrot, African Grey, Budgie, Canary, and Chicken. |
| `client/src/lib/bird-safety.ts` | Bird-specific toxicity and compatibility rules. | Used alongside shared safety rules. |
| `client/src/lib/safety.ts` | Shared raw-toxicity rules, processing review filter, preparation instructions, and disclaimer text. | Explicit raw-toxicity records are distinct from amber review items. |
| `client/src/lib/calculator-multi-bird.ts` | Active deterministic, inventory-aware multi-bird calculator. | This is the calculator called by the live page. |
| `client/src/lib/calculator.ts` | Preserved legacy pigeon-only calculator. | Retained for comparison and historical continuity; do not delete. |
| `scripts/verify-calculator.mjs` | Deterministic smoke tests. | Validates 21 bird/situation scenarios and raw-legume exclusion. |
| `scripts/benchmark-engines.mjs` | Legacy-versus-multi-bird benchmark. | Supports the documented engine comparison; it does not change formulas. |
| `.github/workflows/validate.yml` | Pull-request validation workflow. | Runs type-checking, smoke tests, and production build. |
| `docs/architecture/` | Architecture records and proposals. | Includes benchmark and approval-only optimizer brief. |
| `docs/provenance/` | Source/evidence and change-control records. | Evidence files explain audit-review decisions without silently altering live data. |
| `docs/governance/` | Release and change-control rules. | Human-made formulations require product-owner approval. |
| `client/`, `server/`, `shared/` | Current static-app structure and compatibility stubs. | `server/` and `shared/` are retained template compatibility areas, not the active calculator’s data source. |

## Quality gates

| Gate | Command or record | When it must pass |
|---|---|---|
| Type safety | `pnpm check` | Before any pull request. |
| Calculator behaviour | `pnpm test:calculator` | Before any pull request; extend fixtures for logic changes. |
| Production build | `pnpm build` | Before any pull request. |
| Formula/product control | [`docs/governance/RELEASES_AND_CHANGE_CONTROL.md`](docs/governance/RELEASES_AND_CHANGE_CONTROL.md) | Before changing targets, values, names, feeding notes, safety rules, or herb data. |
| Engine evidence | [`docs/architecture/CALCULATION_ENGINE_BENCHMARK.md`](docs/architecture/CALCULATION_ENGINE_BENCHMARK.md) | Before replacing or materially changing the active calculation path. |

## Repository history to retain

The existing pull-request history includes earlier restructuring work, and [Issue #6](https://github.com/Crypto-Shroom/Bird-Feed-Calculator/issues/6) records a real user who worked through a development-server incompatibility to run the calculator. The issue confirms public interest in a low-friction hosted version; it should remain part of the repository’s history rather than being closed or rewritten as part of housekeeping.

## Operating rules

No tracked repository content is deleted without explicit product-owner approval. Human-authored nutrient values, targets, names, feeding recommendations, ingredient notes, and herb formulations are never changed merely as part of an audit or refactor. Any future ingredient submission/provenance layer must add reviewable records around the existing database rather than overwriting it.
