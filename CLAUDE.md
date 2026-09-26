# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Read `AGENTS.md` first.** It holds the binding rules for this repository: which folders are preserved, which data is protected, the issue/PR requirements, the "exotics vet" wording, and the evidence-research rules. This file does not repeat those rules. It covers commands and architecture.

## Repository layout in one line

Active work lives in `v3-webapp/` (the six-bird React app: pigeon, parrot, African Grey, budgie, canary, chicken). The canonical research/provenance data is in `database/`. `v0-python-only/`, `v1-original/`, `v2-vite-fix/` and `archive/` are frozen history, so never edit them.

## Commands

Use pnpm 10.4.1 (the version pinned in `packageManager`). Node 22 runs in CI. Run commands from the repo root with `--dir v3-webapp`, or from inside `v3-webapp/`.

```bash
pnpm --dir v3-webapp install --frozen-lockfile
pnpm --dir v3-webapp dev              # Vite web on :3000 + Express API on :3001 (/api proxied)
pnpm --dir v3-webapp check            # tsc --noEmit (tests excluded from tsconfig)
pnpm --dir v3-webapp test:calculator  # deterministic smoke test: every bird × situation, raw-legume exclusion
pnpm --dir v3-webapp test:herb-safety
pnpm --dir v3-webapp test:care-guidance
pnpm --dir v3-webapp build            # vite → dist/public, esbuild server → dist/index.js
pnpm test:provenance                  # (repo root) validates database/provenance ledger + provenance-ledger.test.ts
```

CI (`.github/workflows/validate.yml`) runs `check`, `test:calculator`, `test:care-guidance`, `test:provenance`, and `build` on every PR. Before opening a PR, AGENTS.md also requires `test:herb-safety`.

Tests come in two kinds:
- `scripts/verify-*.mjs` are plain assertion scripts run with `tsx` (`test:calculator`, `test:herb-safety`, `test:inventory-presets`, `test:profile-default-formulas`, `test:care-guidance`, `test:constrained-solver-poc`, `test:issue-submission`, `test:github-app`).
- Vitest unit tests sit next to the code as `client/src/lib/*.test.ts`. To run one file: `pnpm --dir v3-webapp exec vitest run client/src/lib/<name>.test.ts`. The `test:optimizer-*` scripts are shortcuts for this (they pass a path filter). Server tests: `test:server` (`vitest.server.config.ts`). Script tests: `test:report-queue` (`scripts/vitest.config.ts`).

## Architecture

**Data flow: Research → `database/` → runtime data → calculator → website.** `governance/ARCHITECTURE.md` explains this in detail. A provenance record in `database/provenance/*.json` documents evidence. It does **not** change calculator behaviour. A runtime change is a separate step that needs owner approval.

- `database/provenance/` holds `sources.json` (the source register), `food-reviews.json` (one food/form per record, each with six explicit bird rows that point to source IDs), `historical-claims.json`, `care-claims.json`, and `profile-claims.json`. `SCHEMA.md` describes them, and `database/tools/validate-provenance-ledger.mjs` validates them. `database/herb-provenance.mts` is imported into the app through `client/src/lib/herb-evidence.ts`. `tsconfig.json` includes `../database/**/*.ts` for this reason.
- The runtime data modules in `v3-webapp/client/src/lib/` are **protected product data**:
  - `data.ts`: `INGREDIENTS`, herbs, `HERB_RECOMMENDATIONS`
  - `birds.ts`: `BIRD_PROFILES`, situations, targets, care copy
  - `safety.ts`: shared raw-toxicity rules, `isToxicRaw`, `requiresVerifiedProcessing`, preparation text
  - `bird-safety.ts`: species-specific toxicity and compatibility

  `ingredient-library.ts` is a read-only adapter that lets product code see database evidence.
- **There are two calculation paths.** Both are wired in `client/src/pages/Home.tsx`:
  1. `calculator-multi-bird.ts` (`MultibirMixCalculator`, with the typo in its name) is the deterministic, inventory-aware calculator. It always runs, and `verify-calculator.mjs` tests it.
  2. The optimizer is a browser-local HiGHS (WASM) LP solve inside a Web Worker. Home calls `optimizer-runtime.ts`. That filters candidates through the safety modules, canonicalizes ingredient identity (`optimizer-ingredient-identity`), and builds the model (`optimizer-model`). The model is posted to `optimizer-worker.ts`, which runs it through the controller and executor. The result comes back through `optimizer-adapter` and `optimizer-form-allocation` (mapping back to the inventory forms the user entered), then `optimizer-mix-result-bridge` converts it into the same `MixResult` shape. Specs are in `docs/optimization/`.
  - `calculator.ts` is the preserved legacy pigeon-only engine, kept for comparison. Do not delete it.
- The UI is React 19 + Vite + Tailwind 4 + shadcn/Radix (`client/src/components/ui/`), with `wouter` routing (`/`, `/herbs`). Path aliases: `@/` → `client/src/`, `@shared/` → `shared/`. The Vite root is `client/`.
- **Issue reporting from the app.** The Express server `server/index.ts` exposes `POST /api/submit-issue` and uses `server/github.ts` to create GitHub issues. Production hosting is Firebase: `firebase-deploy.yml` deploys on pushes to `main` and serves `dist/public` as an SPA. `functions/src/index.ts` is the Firebase counterpart, a separate npm package with its own lockfile. It uses GitHub App auth and a Firestore report queue, which `process-reports.yml` and `scripts/process-reports.mjs` drain once a day.
- `*.bak` files (`data.ts.bak`, `Home.tsx.bak`) are preserved backups. They are not imported. Leave them alone.

## Further docs

`v3-webapp/REPOSITORY_MAP.md` (branch policy and quality gates), `v3-webapp/docs/governance/` (change control), `v3-webapp/docs/provenance/` (long-form evidence notes), `database/README.md` (data catalog).
