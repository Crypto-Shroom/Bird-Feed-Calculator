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
- Run the relevant checks before opening a pull request: `pnpm check`, `pnpm test:calculator`, and `pnpm build` from the repository root.
- Do not merge a pull request without explicit product-owner approval.

## Review focus

- Flag inconsistencies between active code, visible safety warnings, and keeper-facing documentation.
- Flag changes that weaken raw-toxicity warnings, obscure required preparation, or silently alter protected data or profile wording.
- Flag attempted edits to V0–V2 or `archive/` that are not explicitly preservation-only.
- Keep review feedback focused on consequential, repository-specific issues. Leave formatting and deterministic checks to automated validation.


## Multilingual research and six-bird evidence standards

- When researching food, herb, or ingredient compatibility, never stop at a single language or preliminary pass. Search Dutch, German, and Spanish sources where they provide deeper husbandry, racing, or avian veterinary insights (e.g. Dutch/German pigeon and corvid literature, Spanish psittacine sources).
- Assess all six supported birds (pigeon, parrot, African Grey, budgie, canary, chicken) separately. Ground every species claim in primary or veterinary evidence before proposing active-data inclusion.