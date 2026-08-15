# V3 Web Application

This is the active Bird Feed Calculator web application. It supports Pigeon, Parrot, African Grey, Budgie, Canary, and Chicken profiles, inventory-aware mix estimation, explicit safety handling, enrichment guidance, and documented provenance.

## Commands

```bash
pnpm install
pnpm dev
pnpm check
pnpm test:calculator
pnpm build
```

## Project guide

| Area | Location |
|---|---|
| Main interface | `client/src/pages/Home.tsx` |
| Active six-bird calculator | `client/src/lib/calculator-multi-bird.ts` |
| Ingredient and herb data | `client/src/lib/data.ts` |
| Bird profiles and nutrition targets | `client/src/lib/birds.ts` |
| Safety and preparation guidance | `client/src/lib/safety.ts`, `client/src/lib/bird-safety.ts` |
| Tests | `scripts/verify-calculator.mjs` |
| Governance and provenance | `docs/` |

The preserved pigeon-only calculator remains in `client/src/lib/calculator.ts` for historical comparison; the active interface uses the multi-bird calculator.
