# Bird Feed Calculator

This repository preserves the calculator’s history without treating cleanup artifacts as complete releases.

| Path | Role | Use it for |
|---|---|---|
| [`versions/v0-python-only/`](versions/v0-python-only/) | Preserved original Python-era calculator material (`24aa9c35`). | Historical V0 reference. |
| [`versions/v1-original/`](versions/v1-original/) | Exact original uploaded snapshot (`24aa9c35`). | Historical V1 reference. |
| [`versions/v2-vite-fix/`](versions/v2-vite-fix/) | Exact snapshot after the Vite fix (`60037b5a`). | Historical V2 reference. |
| [`versions/v3-webapp/`](versions/v3-webapp/) | **Active six-bird web application** from the approved audit branch. | Development, testing, and releases. |
| [`database/`](database/) | Catalog for active seed, herb, nutrition, safety, and provenance data. | Data stewardship. |
| [`archive/codex-and-main-history/`](archive/codex-and-main-history/) | Preserved partial Codex imports and prior main cleanup artifacts. | Historical reference only. |

## Run V3

```bash
pnpm install --dir versions/v3-webapp
pnpm --dir versions/v3-webapp dev
pnpm --dir versions/v3-webapp check
pnpm --dir versions/v3-webapp test:calculator
pnpm --dir versions/v3-webapp build
```

> V0, V1, V2, and the historical archive are preserved snapshots. Do not overwrite or delete them as part of ordinary V3 work.

## License

Owner-authored project material is licensed under the [Bird Feed Calculator Noncommercial License 1.0](LICENSE.md). It permits non-commercial use while reserving commercial licensing to the copyright holder, applies to V0 through V3 repository distributions, uses German governing law and Spanish court venue, and leaves third-party dependencies and external materials under their own terms.

## ⚖️ License & Commercial Restrictions

This project is protected under the custom **Bird Feed Calculator Noncommercial License 1.0**, a modified non-commercial license informed by PolyForm-style terms.

- **Free Use:** Allowed for personal, educational, research, government, and non-profit projects as described in the [full license](LICENSE.md).
- **Commercial Restrictions:** Monetization of any kind—including **ad-supported traffic**, paywalls, subscription services, paid distributions, commercial hosting, corporate sponsorships, or commercial consulting—is strictly prohibited without a separate written commercial license agreement from the copyright holder.
- **Governing Terms:** The license uses German governing law and Spanish court venue; see the full license for all exclusions, conditions, and definitions.
