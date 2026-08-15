# Bird Feed Calculator

This repository seperates and preserves different stages of the development. From V0 as Pigeon-only Python program to V3, which is the Version which is being prepared for Website release.

## Welcome to the Bird Feeder REPO

This is a friendly home for the Bird Feed Calculator: a project that helps keepers make sense of the seeds, grains, legumes, and supplements they have available. The goal is not to replace experience with birds; it is to make the planning process clearer, safer, and easier to review.

If you are visiting to use or improve the current calculator, choose **V3** below. If you are curious about how the project grew from its earlier pigeon-only Python program, V0 through V2 are kept as readable historical milestones. The `archive/` folder keeps older incomplete imports available for reference without putting them in the normal path.

> **New here?** Start with [`v3-webapp/README.md`](v3-webapp/README.md). It explains the current calculator in bird-keeper language and shows how to work through a mix.

| Path | Role | Use it for |
|---|---|---|
| [`v0-python-only/`](v0-python-only/) | Preserved original Python-era calculator material (`24aa9c35`). | Use via CLI. |
| [`v1-original/`](v1-original/) | Exact original uploaded snapshot (`24aa9c35`). | Historical V1 reference. |
| [`v2-vite-fix/`](v2-vite-fix/) | Exact snapshot after the Vite fix (`60037b5a`). | Historical V2 reference. |
| [`v3-webapp/`](v3-webapp/) | **Active six-bird web application** from the approved audit branch. | Development, testing, and releases. |
| [`database/`](database/) | Catalog for active seed, herb, nutrition, safety, and provenance data. | Data stewardship. |
| [`archive/`](archive/) | Preserved partial Codex imports and prior main cleanup artifacts. | Historical reference only. |

## Run V3

```bash
pnpm install --dir v3-webapp
pnpm --dir v3-webapp dev
pnpm --dir v3-webapp check
pnpm --dir v3-webapp test:calculator
pnpm --dir v3-webapp build
```

> V0, V1, V2, and the historical archive are preserved snapshots. Do not overwrite or delete them as part of ordinary V3 work.

## Working together

This repository is meant to stay understandable for keepers as well as technical contributors. When suggesting a change, explain what it will mean for a person feeding their birds. Do not silently change ingredient values, nutrition targets, profile names, feeding information, herb guidance, or safety wording: those are reviewed project records.

For a small improvement, start a focused issue or branch and describe the change plainly. For any change to nutrition or safety information, include the exact before-and-after wording or values so the product owner can review it comfortably.

## License

Owner-authored project material is licensed under the [Bird Feed Calculator Noncommercial License 1.0](LICENSE.md). It permits non-commercial use while reserving commercial licensing to the copyright holder, applies to V0 through V3 repository distributions, uses German governing law and Spanish court venue, and leaves third-party dependencies and external materials under their own terms.

## ⚖️ License & Commercial Restrictions

This project is protected under the custom **Bird Feed Calculator Noncommercial License 1.0**, a modified non-commercial license informed by PolyForm-style terms.

- **Free Use:** Allowed for personal, educational, research, government, and non-profit projects as described in the [full license](LICENSE.md).
- **Commercial Restrictions:** Monetization of any kind—including **ad-supported traffic**, paywalls, subscription services, paid distributions, commercial hosting, corporate sponsorships, or commercial consulting—is strictly prohibited without a separate written commercial license agreement from the copyright holder.
- **Governing Terms:** The license uses German governing law and Spanish court venue; see the full license for all exclusions, conditions, and definitions.
