# Firebase Hosting and Firestore Report Queue

The production site is a **static React application on Firebase Hosting**. It does not use a deployed Firebase Cloud Function for issue reporting. Its Firestore database remains in the **`eur3` European multi-region**.

## Normal deployment path

Production changes follow the GitHub-first workflow: a reviewed pull request merges into `main`, then the repository’s Firebase Hosting workflow deploys the V3 build. Do not deploy Firebase Functions as part of the normal site release.

The active Hosting configuration rewrites all paths to the React application entry point. It has **no** `/api/submit-issue` rewrite and does not route requests to the legacy `submitIssue` Cloud Function.

## In-app report flow

The report dialog keeps visitors inside the calculator wherever possible.

1. In a local or Manus development environment, the dialog may receive a valid JSON response from the local Express `/api/submit-issue` endpoint.
2. On Firebase Hosting, an unavailable API route returns the single-page application fallback rather than a GitHub issue response. The client detects that non-JSON response and writes the report to Firestore collection `reports` instead.
3. GitHub Actions workflow [`process-reports.yml`](../../.github/workflows/process-reports.yml) runs daily at **08:00 UTC** and can also be manually dispatched. It reads new Firestore reports and creates GitHub issues using the repository token.
4. If the Firestore queue cannot be used, the dialog offers a pre-filled GitHub issue link as the last fallback.

> The live production route is the Firestore queue plus the daily GitHub Actions importer. The local Express helper is for development only. The old Cloud Function source is deliberately **unrouted and unused**; do not re-enable or deploy it without a separately approved hardening and routing decision.

## Report-import configuration

The GitHub Actions importer uses two repository secrets:

| Secret | Purpose |
| --- | --- |
| `FIREBASE_SERVICE_ACCOUNT_BIRD_FOOD_CALCULATOR_25E6D` | Authenticates the daily importer to the project’s Firestore database. |
| GitHub-provided `GITHUB_TOKEN` | Creates and labels the imported GitHub issues with the workflow’s restricted `issues: write` permission. |

No GitHub App private key or Firebase Functions secret is required by the active production report flow.

## Verification

For a code change affecting reports, validate the queue parser and the production build before review:

```bash
pnpm --dir v3-webapp test:issue-submission
pnpm --dir v3-webapp build
```

Use **Run workflow** on `Process Firestore Report Queue` only when the product owner asks for an immediate import. Otherwise, leave the scheduled once-daily importer to process new reports.
