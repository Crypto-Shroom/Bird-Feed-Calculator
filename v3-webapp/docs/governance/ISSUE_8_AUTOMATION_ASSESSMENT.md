# Issue #8 — Ingredient Suggestions and In-App Reporting: Automation Assessment

**Status:** Assessment only. No automation is enabled and no credentials have been created or exposed.

## Product Requirement

When the calculator search has no compatible match, the interface should offer **Suggest to add**. The submitted request must identify the ingredient, selected bird, current profile, and the user’s own note. It must become a GitHub issue that says research is required. A visible **Report wrong info / issue** entry point should also be present at the bottom of the Optimized Mix, Herbs & Supplements, and Detailed Analysis tabs.

The user also wants a subsequent research and proposed-change flow, but no formulation, safety rule, nutrition value, or herb data may change without explicit owner approval.

## Feasible Approaches

| Approach | What the visitor experiences | Security and ownership | Cost | Setup complexity |
| --- | --- | --- | --- |
| **GitHub issue form link** | The button opens a structured GitHub form with the ingredient prefilled. The visitor submits it in GitHub. | No credential in the calculator. The form can apply a label and assign the owner by default. | Free. | Low. |
| **Website form plus server-side GitHub App** | The visitor submits the request without leaving the calculator. The server creates the GitHub issue and returns its link. | A least-privilege GitHub App credential stays only on the server. The public browser never receives it. | The issue-creation path itself has no per-request platform fee; hosting use may apply. | Medium. |
| **Issue-triggered research draft** | A submission opens an issue, then an automated workflow creates a research report after an owner approval label is applied. | The workflow only reads the issue and posts a draft report. It must not modify nutrition or safety data. | GitHub Actions execution is available within the repository plan; any AI research service or agent execution can carry its own usage cost. | Medium. |
| **Owner-approved draft pull request** | After the research report is reviewed and an owner applies a second approval label, the agent prepares a branch and PR for review. Nothing is merged automatically. | The automation receives only the repository permissions required to create a branch, commit, and PR. Every data or formula change remains subject to the normal owner review and merge process. | Depends on the selected research and coding agent. | High. |

## Recommended Staged Design

The safe, incremental route is to begin with a **GitHub issue form link**. GitHub issue forms support validated fields, default labels, and default assignees, so a submission can be standardized without placing a GitHub credential in the public browser.[1]

The button should prefill the ingredient name, selected bird, profile, page context, and a statement such as: “Research is required before adding or changing any ingredient record, safety rule, nutritional value, or recommendation.” A GitHub issue form then assigns the owner and applies a `needs-research` label.

Next, a repository workflow can react to an issue opened or labeled event. GitHub documents the `issues` event, including `opened` and `labeled`, as supported workflow triggers when the workflow is present on the default branch.[2] The workflow should only start research when an owner applies a deliberate `research-approved` label. It should post a sourced draft report to the issue and apply `research-draft-ready`; it must not modify source files or open a pull request at that stage.

Only after the owner reviews that report and applies `draft-pr-approved` should a separate agent prepare a focused branch and pull request. The branch must follow the existing repository naming rules (`kb/` for data and evidence work; `ui/` for interface work; `app/` for calculation behavior), run the full validation suite, and leave the PR unmerged for the owner.

## Why the Public Frontend Must Not Hold a Token

The static calculator is downloadable by every visitor. A personal access token or any long-lived GitHub credential embedded in browser JavaScript would be exposed and could be abused to create, modify, or delete repository content. The existing session-level GitHub connection is intentionally not a website credential and must never be used for public website requests.

If a seamless in-app submission form is later approved, the correct alternative is a server-side endpoint authenticated with a repository-scoped GitHub App. GitHub Apps can be restricted to the needed repository and permissions, and their installation tokens expire after one hour.[3] For the proposed endpoint, **Issues: Read and write** is sufficient; it should not receive Contents or Pull requests permission.

## Safeguards Required Before Automation

| Control | Required behavior |
| --- | --- |
| Public-input handling | Validate length and characters, rate-limit submissions, reject HTML/script payloads, and log only the information needed for the issue. |
| Issue creation | Always state the user request, calculator context, and the explicit requirement for research. Never claim that a suggested ingredient is safe or appropriate. |
| Research gate | Run only after an owner applies `research-approved`; create a cited report, not a data change. |
| Change gate | Require a separate `draft-pr-approved` label before any branch or PR is created. |
| Repository authority | Never merge automatically. Preserve the current branch and PR workflow, required checks, and product-owner approval. |
| Credential scope | Store credentials only as protected secrets; use a least-privilege, repository-scoped GitHub App rather than a broad personal token. |

## Deliberately Deferred

The FAQ remains deferred. It should be added only once real, recurring user questions exist, as directed by the product owner.

## References

[1] [GitHub Docs — Syntax for issue forms](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms)

[2] [GitHub Docs — Events that trigger workflows](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows)

[3] [GitHub Docs — Authenticating as a GitHub App installation](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/authenticating-as-a-github-app-installation)
