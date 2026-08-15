# Release and Change-Control Rules

> **Purpose:** Preserve the project’s research, human-authored formulations, and history while making every future change understandable and reviewable.

## Non-negotiable safeguards

No contributor may delete historical files, branches, research, formulations, nutrition targets, ingredient values, herb entries, warnings, or profile copy without the product owner’s explicit written approval in the relevant pull request or issue.

Formula, ingredient, nutrition-target, herb, warning, and profile-copy changes must be proposed in a dedicated pull request. The pull request must state the exact before-and-after values or text, cite the relevant existing or newly added source, explain the expected calculator-output impact, and obtain product-owner approval before merging.

## Branch roles

| Branch or tag type | Role | Merge/deletion rule |
|---|---|---|
| `main` | Preserved historical GitHub baseline | Do not force-push or merge into it without product-owner approval. |
| `audit-safety-optimization-2026-08-14` | Audited review branch | Review only; do not merge until formula and wording reconciliation is approved. |
| `feature/<topic>` | New, isolated feature work | Merge only by pull request after required checks and product-owner approval. |
| `fix/<topic>` | Focused bug fixes | Merge only by pull request after required checks and product-owner approval. |
| `docs/<topic>` | Documentation-only improvements | Preserve technical and research context; do not rewrite historical claims without approval. |
| `v*` tag | Immutable release marker | Create only from an approved commit; never move or reuse an existing tag. |

## Pull-request rules

Every pull request should explain the user-visible change, list every file changed, state whether data/formulations were changed, and include a validation summary. The validation workflow checks TypeScript, all deterministic calculator scenarios, and the production build. A passing check means the code builds; it does not authorize a formula or research change.

For any calculation or data change, include at least one fixed inventory example with the previous and proposed outputs. If the change affects a species profile, show the output comparison for that species and situation.

## Release tags

Use release tags only after a reviewed pull request is merged or explicitly approved as a baseline. Recommended names are:

| Tag | Intended use |
|---|---|
| `v0.1-pigeon-baseline` | First preserved pigeon-only formulation baseline, if approved. |
| `v0.2-multibird-baseline` | Approved multi-bird baseline, if and when reconciliation is complete. |
| `v0.2.1` | Backward-compatible bug fix that does not change formulas or data. |
| `v0.3.0` | Approved feature milestone with release notes. |

Each tag must have release notes containing the commit, branch, user-visible change summary, validation result, known limitations, and an explicit statement about whether formulations or source data changed.

## Issue workflow

Use GitHub issues as the decision log. Suggested labels are `bug`, `feature`, `formula-review`, `data-provenance`, `research`, `documentation`, and `good-first-issue`. Before work starts, the product owner should confirm the issue goal and whether it permits a change to code only, data only, formulations, or wording.
