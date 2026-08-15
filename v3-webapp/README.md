# Bird Feed Calculator — V3

Welcome. This is the current multi-bird version of the Bird Feed Calculator, made for keepers who want a clearer way to plan a seed and grain mix from the ingredients they already have.

V3 supports **Pigeon, Parrot, African Grey, Budgie, Canary, and Chicken**. It brings together bird-specific profiles, ingredient compatibility checks, red toxicity warnings, preparation reminders, nutrition estimates, and herb information in one place.

## What you can do here

The calculator starts with your own inventory. Add the ingredients and amounts you have available, choose your bird and current situation, and it will produce a practical batch estimate from that inventory.

| Step | What to do |
|---|---|
| 1. Choose your bird | Select the bird you are feeding, then select its current situation. Pet/Companion opens first where that option exists. |
| 2. Add what you have | Enter the ingredients and amounts available to you. Incompatible items are not offered, and hard raw-toxicity issues are shown clearly in red. |
| 3. Review the mix | Read the recommended formula, estimated nutrition, category balance, preparation information, and any missing-ingredient notes. |
| 4. Use your judgement | Treat the result as a planning tool. Observe your birds, offer fresh water and appropriate grit, and contact an exotics vet when a bird is unwell. |

## A note about safe feeding

This planner helps organise seed and grain mixes; it does not replace appropriate complete feeding, careful observation, or individual care. Preparation reminders matter: some legumes require the correct feed-grade processing, and raw kidney beans, lima beans, fava beans, navy beans, and pinto beans must never be fed.

The calculator intentionally keeps a clear distinction between **critical safety warnings**, ordinary preparation guidance, and mix recommendations. If an ingredient does not appear for a chosen bird, use the inventory search to see whether it is incompatible or needs special handling.

## Helpful places in this repository

| Looking for… | Start here |
|---|---|
| The calculator itself | `client/src/pages/Home.tsx` |
| Ingredient and herb information | `client/src/lib/data.ts` |
| Bird profiles and care guidance | `client/src/lib/birds.ts` |
| Compatibility, toxicity, and preparation rules | `client/src/lib/bird-safety.ts` and `client/src/lib/safety.ts` |
| Research and evidence notes | `docs/provenance/` |
| A technical check of the calculator | `scripts/verify-calculator.mjs` |

## If you are helping improve the calculator

Please keep changes easy to review. The nutrition targets, ingredient values, profile wording, feeding information, and safety rules are important project records. Propose any change to them clearly, including the exact wording or values and the reason for the change, before treating it as part of the live planner.

## For local setup

If someone is helping run or develop the website locally, these commands are available:

```bash
pnpm install
pnpm dev
pnpm check
pnpm test:calculator
pnpm build
```

## License

Owner-authored project material is licensed under the repository-root [Bird Feed Calculator Noncommercial License 1.0](../LICENSE.md). Third-party dependencies and external materials remain under their own terms.
