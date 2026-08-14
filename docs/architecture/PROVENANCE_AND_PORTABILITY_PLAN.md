# Provenance and Portability Plan

> **Status:** Design only. This plan does not change any formulation, ingredient value, profile, warning, herb record, or user data.

## Product goals

The next version should preserve the existing calculator and its research history, allow a user to save private recipes and inventories, and make every future nutrition-data change auditable. The GitHub repository should become the canonical source of code and documentation, while the hosting and database can be replaced without losing ownership of the project.

## Additive provenance layer

The current `data.ts` remains the source of calculator values until the product owner explicitly approves a change. A separate provenance registry adds evidence and review state **alongside** those records.

| Record | Purpose | Changes an existing value? |
|---|---|---|
| `ingredient_provenance` | Associates an ingredient key with source links, product form, nutrient basis, review date, and confidence note. | No. |
| `profile_provenance` | Associates a bird/profile target with the current research reference and approval record. | No. |
| `herb_provenance` | Records source status, intended scope, and review notes for the preserved herb recommendation fields. | No. |
| `ingredient_submissions` | Stores a user-proposed food, its form, species, evidence links, and review status. | No. |
| `review_decisions` | Records the reviewer, decision, rationale, affected records, and approved pull request. | No. |

### User-submission workflow

1. A user proposes an ingredient and provides the exact food form, label or supplier information, species context, and optional evidence links.
2. The submission is marked `proposed`; it cannot affect calculations.
3. A reviewer checks identity, form, safety, nutrition basis, and sources. Automated research assistance may prepare a review packet but cannot approve, publish, or modify a calculator record on its own.
4. The product owner reviews the packet and either rejects it, requests clarification, or authorizes a pull request that adds a documented record.
5. The pull request shows the precise data diff and test impact. Only an approved merge makes the ingredient available to the calculator.

## Portable application architecture

| Layer | Recommendation | Why it remains portable |
|---|---|---|
| Source control | GitHub repository with protected `main`, pull requests, validation checks, and release tags. | The project history, documentation, and deployment configuration remain independently owned. |
| Frontend | Existing React/Vite application. | Static frontend can run on many hosts without a rewrite. |
| Application API | Small TypeScript backend with documented REST endpoints for recipes, inventories, submissions, and review decisions. | Avoids binding business logic directly to a hosting provider. |
| Database | Managed PostgreSQL with export capability and daily backups. | Relational data, user records, and provenance tables can be exported and moved. |
| Authentication | Standard email/OAuth authentication owned by the selected provider, with account deletion/export controls. | Supports private saved recipes without inventing an insecure custom identity system. |
| Files | Object storage for ingredient labels or evidence uploads, linked by database records. | Keeps files out of the source repository and supports future migration. |

## Hosting choices to decide before implementation

| Choice | Suitable use | Supports saved recipes and inventories? | Operations burden |
|---|---|---:|---|
| GitHub Pages | Public, static read-only calculator. | No; browser-only local storage is possible but not shared or recoverable. | Low. |
| Managed full-stack host plus managed PostgreSQL | Public app with user accounts, saved data, provenance submissions, and review workflow. | Yes. | Low to moderate. |
| Self-hosted Raspberry Pi | Learning project or private/home use with full control. | Yes, but requires database, backups, DNS, TLS, uptime, security updates, and recovery work. | High. |

### Recommended decision path

Use GitHub as the canonical source and choose a managed full-stack host plus a managed PostgreSQL database for the public product. It gives the project durable hosting and private saved data without requiring a home server to remain online. GitHub Pages may still host a separate read-only demo, but it is not the primary product path when user accounts and saved inventories are required.

## Required approval gates

Before implementation, the product owner must approve:

1. The hosting and database provider pair.
2. Whether users can save data anonymously, with email login, or with OAuth login.
3. The data-retention and account-deletion policy.
4. The reviewer role and exact approval authority for user-submitted ingredients.
5. The migration plan for the current repository and existing research documents.
