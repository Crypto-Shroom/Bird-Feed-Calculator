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

## Review focus

- Flag inconsistencies between active code, visible safety warnings, and keeper-facing documentation.
- Flag changes that weaken raw-toxicity warnings, obscure required preparation, or silently alter protected data or profile wording.
- Flag attempted edits to V0–V2 or `archive/` that are not explicitly preservation-only.
- Keep review feedback focused on consequential, repository-specific issues. Leave formatting and deterministic checks to automated validation.
