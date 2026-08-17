# Owner-approved research and draft-PR workflow

This document records the approval boundary for reports queued from the calculator. It is a governance contract for future automation; it does not authorize a branch, pull request, merge, deployment, formulation change, ingredient change, safety change, or public-facing copy change by itself.

## Two independent gates

| State | Required label state | Permitted action |
|---|---|---|
| Submitted | No approval label | Keep the report queued for owner review. |
| Research approved | `APPROVED` | Perform the requested research and publish cited findings as an issue comment or report. Do not change repository data. |
| Implementation approved | `APPROVED` and `second approval label` | A separately scoped draft pull request may be created after the research output is reviewed. The draft remains unmerged until the product owner approves it in Manus chat. |

The labels are intentionally evaluated case-insensitively, and unrelated labels do not satisfy either gate. The implementation guard is exposed in `scripts/research-approval.mjs` and covered by `scripts/research-approval.test.ts`.

## Existing queue boundary

The daily Firestore queue processor may create a GitHub issue for a newly submitted report. That intake step is not research approval and must not be interpreted as permission to modify canonical database files, formulas, safety rules, or user-visible copy. Research and implementation remain human-reviewable follow-up steps.

## Owner decision requested

Please review this guard and the linked PR. If approved, a later change may integrate the guard into an explicitly authorized research or draft-PR worker. This PR itself does not create branches or pull requests automatically, and it will not be merged without explicit owner approval.
