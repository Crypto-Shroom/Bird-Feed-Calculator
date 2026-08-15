# Issue #14 — Launch, Saved Data, and Language Plan

**Status:** Decision record for product-owner approval. This document does not deploy the calculator, add accounts, collect cookies, store user data, change formulas, or enable external credentials.

## Purpose

Issue #14 combines five future capabilities: public no-ad hosting, a dependable launch process, saved inventories and mixes, user accounts, and German/Dutch/French/Spanish language support. They should not be released in one change. The recommended approach is a staged, portable rollout that protects bird-care data and avoids exposing credentials in the browser.

## Recommended sequence

| Stage | Outcome | Owner decision required | Why it is separate |
| --- | --- | --- | --- |
| 1. Static public release | A published V3 calculator on a custom domain, with no accounts or user data | Choose a host and domain | The present calculator is a client-side React app and can be shipped independently of private data. |
| 2. Optional local saves | Browser-only saved mixes and inventories, clearly labelled as device-local | Approve local-storage scope and privacy wording | This adds convenience without collecting accounts, but it cannot sync across devices or guarantee recovery. |
| 3. Account-backed saves | Secure sign-in and private saved inventories/mixes | Approve provider, data model, privacy copy, and retention/deletion rules | This introduces personal data and must be designed with access-control rules before implementation. |
| 4. Localization foundation | Centralize interface strings, then translate German and Dutch first | Approve source-language copy and translation review process | Nutrition, safety, and herb wording needs review in every language before publishing. |
| 5. Optional automation endpoint | Owner-approved research and draft-PR workflow for Issue #20 | Approve credential owner, permissions, and explicit review gates | Repository write access must stay server-side; it must never be embedded in the static calculator. |

## Hosting options

| Option | Suitable for Stage 1 | Suitable for private accounts and saved data | Key trade-off |
| --- | --- | --- | --- |
| **GitHub Pages** | Yes. It publishes static HTML, CSS, and JavaScript from a repository and supports custom domains.[1] | No, not by itself. It has no private application backend for account data or secure write credentials. | Lowest operational overhead for a purely static release, but future private features need an additional backend. |
| **Cloudflare Pages** | Yes. It supports project custom domains; a subdomain can use a CNAME, while an apex domain requires the domain to be a Cloudflare zone.[2] | Potentially, but account data and repository automation still require a deliberately designed server-side service and secret management. | A stronger long-term route if server-side functions are later approved, but it adds provider setup. |
| **Managed full-stack app hosting** | Yes. | Yes, once a database, authentication, and server routes are explicitly enabled. | Fewer moving parts for authenticated saves, but more platform coupling and a future provider decision is still needed. |

> **Recommendation:** Approve Stage 1 as a static deployment first. Select the host only after deciding whether portability (GitHub Pages), an extensible edge platform (Cloudflare Pages), or an integrated full-stack service is more important. Do **not** deploy from this document.

## Saved inventories and mixes

For a first public version, saved inventories should remain **device-local only** unless and until account-backed storage is approved. The interface must say clearly that browser-local saves may not transfer to another device and can be lost when site data is cleared.

For account-backed saves, the minimum data model should be intentionally small:

| Record | Core fields | Access rule |
| --- | --- | --- |
| `saved_inventory` | owner ID, title, bird, profile, ingredient amounts, created/updated timestamps | Only the authenticated owner may read, edit, or delete it. |
| `saved_mix` | owner ID, title, bird, profile, target batch, calculated ingredients, nutrition snapshot, created/updated timestamps | Only the authenticated owner may read, edit, or delete it. |
| `user_preferences` | owner ID, preferred language, display preferences | Only the authenticated owner may read or edit it. |

Supabase is a candidate only, not a selected provider. Its documentation describes authentication methods and database access controlled through JWTs plus Row Level Security, while its current free tier includes a 500 MB database and pauses projects after one week of inactivity.[3] [4] That inactivity behaviour means it is suitable for an owner-approved low-cost prototype, but not a guarantee of uninterrupted service.

## Privacy and security boundaries

No account-related code should be added until the product owner approves the following in writing:

1. The exact sign-in methods, beginning with the least intrusive option.
2. The privacy notice, deletion route, data-retention period, and support contact.
3. Database access policies that ensure a user can access only their own records.
4. A statement that saved mixes are planning records, not veterinary prescriptions.
5. The handling of backups and provider downtime.

Cookies are **not** needed for Stage 1. If an authentication provider later uses session cookies or local tokens, the implementation must document that choice and show any consent or privacy notice required for the chosen jurisdiction and feature.

## Language rollout

The proposed order is **German**, then **Dutch**, followed by French and Spanish. Before the first translation branch, the app should move user-facing strings into a versioned translation dictionary. Ingredient identifiers, scientific names, protected nutrition values, and safety logic must remain locale-neutral; only display copy should translate.

Each language PR should include a bird-keeper readability check and a safety-copy review. Hard toxicity warnings must remain explicit, visually red, and semantically equivalent to the approved English wording.

## Acceptance checklist for a future implementation PR

- [ ] The product owner selected the deployment target and domain strategy.
- [ ] The static build works from a clean checkout on the selected platform.
- [ ] No secret, repository token, or private credential is present in client code or build output.
- [ ] Saved-data behaviour is either clearly browser-local or protected by approved authentication and row-level access rules.
- [ ] Delete/export behaviour and privacy wording are reviewed before accounts are enabled.
- [ ] Every translated safety message is reviewed before publication.
- [ ] The owner approves a preview before deployment or merging.

## References

[1] [GitHub Docs — What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

[2] [Cloudflare Pages Docs — Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)

[3] [Supabase — Pricing](https://supabase.com/pricing)

[4] [Supabase Docs — Auth](https://supabase.com/docs/guides/auth)
