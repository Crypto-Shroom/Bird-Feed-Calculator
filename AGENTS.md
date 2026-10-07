# Bird Feed Calculator Repository Guidance

## Scope and preserved history

- **Active work belongs in `v3-webapp/`.** This is the current six-bird web application.
- `v0-python-only/`, `v1-original/`, `v2-vite-fix/`, and `archive/` are preserved historical records. Do not delete, overwrite, reformat, or casually modernize them.
- Never delete repository material without the product owner’s explicit approval.

## Product and data governance

- Do not change human-made ingredient values, nutrition targets, profile names, feeding recommendations, herb benefits, dosages, frequencies, safety rules, or preparation guidance without the product owner approving the exact proposed change.
- Treat the pre-audit visible baseline as the default. Keep approved user-facing behavior unless the product owner explicitly requests a change.
- Use **“exotics vet”** in user-facing language rather than avian, poultry, or veterinary terminology.
- Keep Pet/Companion as the opening profile wherever that profile exists.
- Keep critical hard-toxicity warnings explicit and prominent. When a keeper-facing document enumerates a hard-toxicity list, verify it matches the active safety rules; currently this includes raw kidney beans, lima beans, fava beans, navy beans, pinto beans, and black beans.

## How to make changes

- Prefer focused branches and pull requests for ordinary V3 changes. Use a direct commit to `main` only when the product owner explicitly approves that exception.
- Explain user-visible effects in plain language. For any proposed nutrition, safety, or formulation change, show the exact before-and-after wording or values before implementation.
- Link every substantive change to an existing GitHub issue or create a focused issue before implementation. A substantive change includes user-visible behaviour, formulation or safety data, deployment, automation, documentation policy, or repository structure. Trivial typo corrections and routine branch maintenance may be handled without a new issue when they have no such impact.
- Each pull request must include `Closes #<issue>` or `Relates to #<issue>`, a concise scope and user-impact summary, validation performed, implementation decisions, and any follow-up deliberately left out of scope.
- Use normal developer comments to log meaningful milestones: implementation handoff, review findings, owner-approved merge, deployment outcome, and any blocker. Keep comments specific and readable; do not add unrelated process commentary to feature PRs.
- Run the relevant checks before opening a pull request: `pnpm --dir v3-webapp check`, `pnpm --dir v3-webapp test:calculator`, `pnpm --dir v3-webapp test:herb-safety`, and `pnpm --dir v3-webapp build` when applicable.
- Do not merge a pull request without explicit product-owner approval.

## Team roles and delegation

| Role | Who | Responsibility |
|---|---|---|
| Product owner | Repository owner | Sets priorities, approves protected-data and wording changes, approves every merge and deletion. |
| Senior developer | Claude Code | Reviews all PRs, writes focused issue specs for delegated work, integrates and validates changes, reports findings to the owner. |
| Medior developer | Manus | Larger research or implementation tasks. Credits are limited, so Manus tasks are routed only through the product owner; other agents propose a Manus task to the owner instead of starting one. |
| Junior developer | Jules | Focused, well-specified code tasks. Bolt (Jules's scheduled performance task) proposes small optimizations. |

Rules for delegated work, especially Jules:

- A Jules task starts when the `jules` label is added to an issue; the issue body is the whole specification. Only label a focused issue that states the exact files, acceptance criteria, and checks to run. Never label a parent issue, an issue whose work has already merged, or a research issue that needs new external sources.
- Before starting, check that the issue's work is not already on `main` or in an open PR. If it is, comment on the issue instead of opening a PR.
- Do not open a PR with no file changes. Use `Relates to #<issue>` when the PR does not finish the whole issue; `Closes`/`Fixes` would close it on merge.
- Do not commit build output (`v3-webapp/dist/`), and do not touch V0–V2 or `archive/`.
- A performance change must keep calculator output identical. Do not change tie-breaking, rounding, or the result shape.
- Never invent a source title, author, portion size, or claim. Provenance text must match `database/provenance/sources.json` and `food-reviews.json` exactly.

## Review focus

- Flag inconsistencies between active code, visible safety warnings, and keeper-facing documentation.
- Flag changes that weaken raw-toxicity warnings, obscure required preparation, or silently alter protected data or profile wording.
- Flag attempted edits to V0–V2 or `archive/` that are not explicitly preservation-only.
- Keep review feedback focused on consequential, repository-specific issues. Leave formatting and deterministic checks to automated validation.

## Source-reconciled verification

- Before stating a repository-backed fact, reconcile the active runtime source, relevant provenance records, and applicable tests or generated artifacts. If those layers conflict, report the exact conflict rather than treating one layer as authoritative by assumption.
- Before stating a non-repository factual claim, perform an appropriate external-source check and cite the source where the claim is presented. Do not infer catalog, schema, runtime, or evidence state from a single inspectable layer.

## Evidence-research persistence

- Review every proposed food **and exact food form** across pigeon, parrot, African Grey, budgie, canary, and chicken before proposing any active-data change. Keep unresolved evidence explicit; it is a current evidence state, not a reason to stop researching.
- Before beginning external evidence research, identify and read the most relevant installed research or domain skill. For multi-source provenance research in a Manus session, use the saved `deep-research` skill first; follow its source governance, evidence mapping, counter-review, and full-source requirements, using its sequential fallback when parallel subagents are unavailable. If no category-specific skill exists, establish the exact species/form question, search broadly across credible source types and relevant languages, open and read full source content rather than relying on snippets, assess author/publisher and evidence quality, record every search path and limitation, and then make only the narrowest supported claim. A search-result snippet, generic “bird-safe” list, retailer claim, forum, or uncited owner guide is never sufficient by itself for an authoritative conclusion.
- Continue seeking direct, form-specific evidence for unresolved rows before final handoff. Search English sources and, where useful, Dutch and German material for pigeon or corvid context and Spanish material for parrot-style birds. Record the source boundary for every row. Do not infer a bird outcome merely by analogy from another species; a cross-species conclusion is permitted only when a cited, authoritative scientific-consensus source explicitly establishes the relevant principle across the birds in scope, with its limits recorded and any species-specific evidence taking priority.
- Keep provenance-only research separate from runtime ingredients, formulas, inventory behavior, safety rules, and visitor-facing wording. A ledger record does not authorize a calculator change.

## Concrete review communication

- Explain review findings in plain, concrete terms. State the exact file, field, string, value, or behavior that changed; distinguish a validation result from a review-quality concern and distinguish runtime impact from governance-only impact.
- Do not hide a specific change behind abstract labels such as "formatting churn", "dependency risk", or "clean". Name the concrete before-and-after change and why it matters to the owner’s review decision.

## Commands

Use pnpm 10.4.1 (pinned in `packageManager`); CI uses Node 22. Run commands from the repository root with `--dir v3-webapp`, or from inside `v3-webapp/`.

```bash
pnpm --dir v3-webapp install --frozen-lockfile
pnpm --dir v3-webapp dev              # Vite web on :3000 + Express API on :3001 (/api proxied)
pnpm --dir v3-webapp check            # tsc --noEmit (test files are excluded from tsconfig)
pnpm --dir v3-webapp test:calculator  # every bird × situation, raw-legume exclusion
pnpm --dir v3-webapp test:herb-safety
pnpm --dir v3-webapp test:care-guidance
pnpm --dir v3-webapp exec vitest run  # all unit tests in client/src/lib/*.test.ts
pnpm --dir v3-webapp build            # vite → dist/public, esbuild server → dist/index.js
pnpm test:provenance                  # (repository root) provenance ledger validation and tests
```

- CI (`.github/workflows/validate.yml`) runs `check`, `test:calculator`, `test:care-guidance`, `test:provenance`, and `build`. It does not yet run the Vitest unit tests, so run them yourself.
- `scripts/verify-*.mjs` are plain assertion scripts run with `tsx`.
- Vitest unit tests sit next to the code as `client/src/lib/*.test.ts`. Run one with `pnpm --dir v3-webapp exec vitest run client/src/lib/<name>.test.ts`. Server and script tests have their own configs: `test:server` and `test:report-queue`.

## Architecture

The data flow is **Research → `database/` → runtime data → calculator → website** (see `governance/ARCHITECTURE.md`). A provenance record documents evidence only. Changing calculator behaviour is a separate step that needs owner approval.

- **`database/provenance/`** holds `sources.json` (the source register) and `food-reviews.json` (one record per exact food form, with six bird rows that point to source IDs). It also holds `historical-claims.json`, `care-claims.json`, and `profile-claims.json`. `SCHEMA.md` describes the files, and `database/tools/validate-provenance-ledger.mjs` validates them. The app imports `database/herb-provenance.mts` through `client/src/lib/herb-evidence.ts`.
- **Protected runtime data** lives in `v3-webapp/client/src/lib/`:
  - `data.ts`: ingredients and herbs
  - `birds.ts`: profiles, targets, and care copy
  - `safety.ts`: shared raw-toxicity and preparation rules
  - `bird-safety.ts`: species toxicity and compatibility
- **There are two calculation paths**, both wired in `client/src/pages/Home.tsx`:
  1. `calculator-multi-bird.ts` (`MultibirMixCalculator`) is the deterministic, greedy, inventory-aware calculator. It always runs.
  2. The optimizer is a browser-local HiGHS (WASM) solve in a Web Worker. The path is `optimizer-runtime.ts` (safety gating, identity canonicalization, model build) → `optimizer-worker.ts` → `optimizer-adapter` / `optimizer-form-allocation` → `optimizer-mix-result-bridge`, which returns the same `MixResult` shape. Specs are in `docs/optimization/`.

  `calculator.ts` is the preserved legacy pigeon-only engine; keep it.
- **UI**: React 19, Vite (root `client/`), Tailwind 4, shadcn/Radix, `wouter` routes `/` and `/herbs`. Path aliases: `@/` → `client/src/`, `@shared/` → `shared/`.
- **In-app issue reports**: `server/index.ts` (`POST /api/submit-issue`, through `server/github.ts`). In production, `functions/src/index.ts` (a separate npm package) and a Firestore queue take this role; `process-reports.yml` drains the queue daily. Firebase Hosting deploys `dist/public` on every push to `main` (`firebase-deploy.yml`).
