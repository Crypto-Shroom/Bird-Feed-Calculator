# Licensing and Release Audit

**Status:** Review record only. No license grant, package metadata, repository visibility, or Git tag has been changed by this audit.

> This is a working copyright and release-management analysis, not formal legal advice. A qualified intellectual-property lawyer should review the final proprietary license and contributor arrangements before commercial release.

## Bottom line

The repository is currently public and has **no detected root license file**. Under default copyright rules, that does not grant the public broad reuse rights; however, GitHub users may still view and fork a public repository under GitHub’s terms. [1] [2]

The repository therefore does **not yet meet** the product owner’s requirement that no other party should receive a commercial license to the project. The most direct path is a private repository plus a clear proprietary root license for owner-authored material, but that cannot retroactively withdraw permissions that may already have been granted by earlier public copies or MIT-labelled project files.

## Audit findings

| Area | Finding | Effect on commercial-control goal | Required decision before release |
|---|---|---|---|
| Repository visibility | The GitHub repository is public. | Anyone can view and fork it through GitHub; public history and existing copies cannot be made unseen. | Decide whether to make the repository private before the commercial release. |
| Root license | No detected root `LICENSE` file or GitHub-recognized license. | Default copyright protection applies, but the public presentation is ambiguous. | Add a reviewed proprietary `LICENSE` and a clear README notice. |
| Project package metadata | The preserved V1, V2, active V3, and archived package manifests declare `"license": "MIT"`. | MIT permits commercial use, copying, modification, and distribution of the covered code. | Do **not** release V3 commercially until the owner decides whether to replace active metadata with `UNLICENSED`/a proprietary reference and how to handle historical snapshots. |
| Historical snapshots | V0/V1/V2 are preserved records. V1 and V2 retain their original MIT metadata to remain exact snapshots. | Rewriting them would break the promised historical integrity; leaving them public preserves their existing stated permission. | Prefer a private repository if exclusive commercial control is required; do not rely on a new root notice to revoke historical permissions. |
| Third-party dependencies | Active V3 production dependencies report permissive license families: MIT, ISC, Apache-2.0, BSD, 0BSD, Unlicense, and MPL-2.0 or Apache-2.0. `khroma` is MIT upstream although its installed manifest omits a license field. [3] | These components may be commercially usable under their own licenses, but their notices and conditions must remain respected. They do not grant others a commercial license to the owner-authored project code. | Generate and ship a dependency-notices file for any public production distribution. |
| Fonts and external services | Active V3 loads Google-hosted Inter and a Manus-hosted project image. The archived tree contains three local images without source attribution. | The audit cannot prove rights ownership or redistribution scope for external/generated/archive images. | Confirm the origin and commercial-use terms of every non-owner-created image and font; add an asset provenance manifest before release. |
| Contributions and factual data | Git history contains commits by the product owner and project agents. Nutrition values and facts may have limited copyright protection as individual facts; database selection, presentation, original code, copy, branding, and assets are separate concerns. | A license alone cannot make public facts exclusive, and an owner should have clear rights from every non-owner contributor. | Confirm the service terms/ownership for agent-generated output and use a contributor agreement for future outside contributions. |

## Recommended licensing posture

| Goal | Recommended posture | Why |
|---|---|---|
| The owner alone may commercialize the app | Make the source repository private, use a proprietary/all-rights-reserved license for owner-authored project material, and grant commercial rights only through written agreements the owner controls. | This is clearer than a non-commercial public license and avoids advertising public source as reusable. |
| The public may view or contribute, but not commercially use the project | A custom proprietary contributor/reviewer agreement and a public repository may be possible, but require lawyer review and strong contributor terms. | Standard open-source licenses do not prohibit commercial use; a public non-commercial arrangement is not open source. |
| The app may be publicly used without publishing source | Publish the hosted calculator and its site terms; keep the source private. | Separates public product access from source-code reuse. |

No license can physically prevent infringement or give the owner exclusive rights over independently created software, permissively licensed dependencies, or uncopyrightable factual nutrition data. It can define the permissions the owner grants for owner-controlled material and support enforcement where applicable.

## Release-history recommendation

Use **Git tags and GitHub Releases**, but distinguish archival snapshots from actual supported releases.

| Identifier | Meaning | GitHub Release recommendation |
|---|---|---|
| `archive-v0-python` | Original Python-only pigeon calculator material. | Historical annotated tag only; do not market as a supported release. |
| `archive-v1-original-upload` | Exact original mixed/experimental upload, not a clean pigeon-only release. | Historical annotated tag only. |
| `archive-v2-vite-fix` | Exact Vite-fix snapshot of the historical upload. | Historical annotated tag only. |
| `v3.0.0` | First supported six-bird web-app baseline after Issue #10 is approved and licensing is settled. | GitHub Release with review notes, validation results, and a clear support statement. |

## Merge policy recommendation

Use a **merge commit** for PR #11 because the product owner values traceable history and the branch is a repository-structure milestone. Use **squash-and-merge** for future small, self-contained features with several work-in-progress commits. Reserve **rebase-and-merge** for a clean linear history only when the contributor understands that it rewrites branch commit IDs; do not rebase shared historical or review branches.

## References

[1] [GitHub Docs, *Licensing a repository*](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)

[2] [Choose a License, *No License*](https://choosealicense.com/no-permission/)

[3] [fabiospampinato/khroma, upstream MIT license](https://github.com/fabiospampinato/khroma)
