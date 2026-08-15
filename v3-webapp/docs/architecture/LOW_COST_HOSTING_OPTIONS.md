# Low-Cost Hosting and Private-Data Options

**Status:** Decision document only. No host, database, account, or deployment has been created.

## Requirements

The public calculator needs a durable URL independent of the current development platform, a pathway to private saved recipes and inventories, and a deployment workflow connected to GitHub. The project should start at zero or very low cost, avoid requiring a home server, and remain portable.

| Option | Initial cost | Private saved recipes and inventories | Main trade-off |
|---|---:|---|---|
| **Cloudflare Pages + Workers + D1** | $0 within free limits | Yes, after adding authentication and application tables. | D1 uses SQLite semantics; migrating later requires planned data export/import. |
| **Static host + browser-only storage** | $0 | Only on the user’s current browser; no cross-device recovery or account data. | Does not meet the durable saved-data goal. |
| **Static host + Supabase Free** | $0 within free limits | Yes, with Postgres, authentication, and row-level access controls. | Free projects pause after one week of inactivity and do not include automatic backups. |
| **Self-hosted Raspberry Pi** | Potentially $0 if hardware and internet already exist | Yes. | You operate security updates, TLS, power/network uptime, backups, and recovery. |

## Current free-tier facts

Cloudflare’s Workers Free plan includes D1 with 5 million rows read/day, 100,000 rows written/day, and 5 GB total storage. It does not charge for idle capacity, but daily limits stop database queries when exceeded.

Supabase Free currently includes 500 MB database size, 50,000 monthly active users, 1 GB file storage, and 5 GB egress. Free projects pause after one week of inactivity and automatic backups are not included. Its database is standard Postgres and its Auth product integrates with row-level security.

## Recommended low-cost sequence

1. **Canonical source:** Keep GitHub as the source of truth, with the current review branch and validation workflow.
2. **Public beta at $0:** Deploy the Vite frontend to Cloudflare Pages. Do not add user data until ownership and privacy choices are approved.
3. **Saved-data beta at $0:** Add Supabase Free for Postgres and authentication, with strict row-level security. Implement saved recipes and inventories before community submissions.
4. **Backup before dependency:** Add an automated database export to a product-owner-controlled storage location before inviting users to store important information; the free database tier has no automatic backups.
5. **Paid migration only when justified:** Upgrade only after actual user activity or inactivity pausing becomes a material problem.

## Product-owner decisions needed

| Decision | Recommended starting answer |
|---|---|
| Public site host | Cloudflare Pages. |
| User-data database and authentication | Supabase Free, with a planned export/backup process. |
| Account model | Start with email magic-link or email/password accounts; avoid anonymous data for saved recipes. |
| Community submissions | Add only after saved recipes work, with submissions isolated from production calculator data. |
| Raspberry Pi | Keep as a learning/self-hosting option, not the first public deployment. |

## References

1. [Cloudflare D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing/)
2. [Supabase Pricing](https://supabase.com/pricing)
3. [Supabase Database Overview](https://supabase.com/docs/guides/database/overview)
4. [Supabase Auth Overview](https://supabase.com/docs/guides/auth)
