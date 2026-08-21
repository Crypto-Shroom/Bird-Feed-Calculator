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

## Source-reconciled verification

- Before stating a repository-backed fact, reconcile the active runtime source, relevant provenance records, and applicable tests or generated artifacts. If those layers conflict, report the exact conflict rather than treating one layer as authoritative by assumption.
- Before stating a non-repository factual claim, perform an appropriate external-source check and cite the source where the claim is presented. Do not infer catalog, schema, runtime, or evidence state from a single inspectable layer.

## Evidence-research persistence

- Review every proposed food **and exact food form** across pigeon, parrot, African Grey, budgie, canary, and chicken before proposing any active-data change. Keep unresolved evidence explicit; it is a current evidence state, not a reason to stop researching.
- Before beginning external evidence research, identify and read the most relevant installed research or domain skill. If no category-specific skill exists, use the dedicated research workflow: establish the exact species/form question, search broadly across credible source types and relevant languages, open and read full source content rather than relying on snippets, assess author/publisher and evidence quality, record every search path and limitation, and then make only the narrowest supported claim. A search-result snippet, generic “bird-safe” list, retailer claim, forum, or uncited owner guide is never sufficient by itself for an authoritative conclusion.
- Continue seeking direct, form-specific evidence for unresolved rows before final handoff. Search English sources and, where useful, Dutch and German material for pigeon or corvid context and Spanish material for parrot-style birds. Record the source boundary for every row. Do not infer a bird outcome merely by analogy from another species; a cross-species conclusion is permitted only when a cited, authoritative scientific-consensus source explicitly establishes the relevant principle across the birds in scope, with its limits recorded and any species-specific evidence taking priority.
- Keep provenance-only research separate from runtime ingredients, formulas, inventory behavior, safety rules, and visitor-facing wording. A ledger record does not authorize a calculator change.

## Concrete review communication

- Explain review findings in plain, concrete terms. State the exact file, field, string, value, or behavior that changed; distinguish a validation result from a review-quality concern and distinguish runtime impact from governance-only impact.
- Do not hide a specific change behind abstract labels such as "formatting churn", "dependency risk", or "clean". Name the concrete before-and-after change and why it matters to the owner’s review decision.
