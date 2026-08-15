# Bird Feed Calculator

This repository preserves the calculator’s development history while keeping the current web application easy to find and run.

| Folder | Role | Start here when you need |
|---|---|---|
| [`versions/v1-original/`](versions/v1-original/) | Preserved original uploaded project snapshot. | Historical reference only. |
| [`versions/v2-vite-fix/`](versions/v2-vite-fix/) | Preserved snapshot after the Vite plugin fix. | Historical reference only. |
| [`versions/v3-webapp/`](versions/v3-webapp/) | **Active six-bird web application.** | Development, tests, documentation, and releases. |
| [`database/`](database/) | Catalog of seed, herb, nutrition, safety, and provenance data. | Understanding the active data architecture. |

## Run the active V3 application

```bash
pnpm install --dir versions/v3-webapp
pnpm --dir versions/v3-webapp dev
```

Run validation with:

```bash
pnpm --dir versions/v3-webapp check
pnpm --dir versions/v3-webapp test:calculator
pnpm --dir versions/v3-webapp build
```

> The version folders are additive historical snapshots. Do not delete or overwrite them as part of ordinary calculator development.

## Change control

The active application has explicit release and product-owner approval rules in [`versions/v3-webapp/docs/governance/RELEASES_AND_CHANGE_CONTROL.md`](versions/v3-webapp/docs/governance/RELEASES_AND_CHANGE_CONTROL.md). Formula targets, ingredient values, profile names, feeding recommendations, and safety eligibility require product-owner approval.
