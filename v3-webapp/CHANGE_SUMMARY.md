# Change Summary for Product-Owner Review

**How to use this file:** Read this first. It is the short approval summary; detailed evidence, architecture, and Git history remain in `docs/` only when you want more detail.

| Review point | Current state | Owner action |
|---|---|---|
| Optimizer | Two-stage deterministic optimizer is implemented: it establishes feasible category plans first, then ranks candidates by macro fit, category fit, diversity, and unmet-target count. | Test it with your normal inventories and report any formula you would change. |
| Formula data | No ingredient nutrition value, bird target, profile name, or feeding recommendation changed. | None. |
| Pending ingredients | Chickpeas, adzuki beans, sweet lupins, and heat-treated common vetch are back in the calculator with practical preparation guidance. | Check the preparation wording in the app for the birds you keep. |
| Safety | Explicit raw-toxicity exclusions remain blocked and red. | None. |
| Interface | Pre-audit labels, colours, warning presentation, daily copy, and herb detail are preserved. | Flag any visible wording or styling that still differs from your expected baseline. |
| Repository workflow | Future pull requests now require a concise owner summary, preserved-data declaration, validation results, and an explicit approval request. | None. |

## This change in one sentence

The calculator now has the approved optimizer and useful ingredient-preparation messages while preserving the human-made formulation data and restored interface baseline.
