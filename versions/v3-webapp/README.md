# V3 Active Web Application

This is the active six-bird Bird Feed Calculator application. It supports Pigeon, Parrot, African Grey, Budgie, Canary, and Chicken profiles, inventory-aware recipe estimates, safety guidance, enrichment details, and provenance records.

## Commands

```bash
pnpm install
pnpm dev
pnpm check
pnpm test:calculator
pnpm build
```

| Area | Location |
|---|---|
| Main interface | `client/src/pages/Home.tsx` |
| Active calculator | `client/src/lib/calculator-multi-bird.ts` |
| Ingredients and herbs | `client/src/lib/data.ts` |
| Profiles and targets | `client/src/lib/birds.ts` |
| Safety and preparation | `client/src/lib/safety.ts`, `client/src/lib/bird-safety.ts` |
| Calculator scenarios | `scripts/verify-calculator.mjs` |
| Evidence and governance | `docs/` |

The legacy pigeon-only calculator remains at `client/src/lib/calculator.ts` for comparison; the live interface uses the multi-bird calculator.

## License

Owner-authored project material is licensed under the repository-root [PolyForm Noncommercial License 1.0.0](../../LICENSE.md). Third-party dependencies and external materials remain under their own terms.
