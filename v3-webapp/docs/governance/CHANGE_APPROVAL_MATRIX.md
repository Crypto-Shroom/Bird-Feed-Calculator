# Approval Matrix: Formula, Copy, Sources, GitHub, and Deployment

**Prepared:** 14 August 2026  
**Status:** Read-only reconciliation. This document proposes no formulation, source-data, profile-name, or warning change.

> **Product-owner control:** The existing ingredient database, legacy pigeon calculator, profile targets, herb data, and original source documents remain preserved. No future formula, ingredient, nutrition target, herb record, warning, profile text, branch, or historical file may be changed or deleted without explicit product-owner approval.

## 1. What the cautious daily-feeding copy changed

The active multi-bird profile file previously displayed the following fixed daily-feeding text. During the audit, these statements were replaced by the adjacent cautious wording. The original `PROFILES` object in `client/src/lib/data.ts` remains unchanged; this table is an exact reconciliation of the active `birds.ts` UI copy.

| Bird and profile | Previous visible text | Current cautious text |
|---|---|---|
| Pigeon — Maintenance/Rest | “Feed 30-40g per bird per day. Light feeding in morning, standard mix in evening.” | “Use this planner range only as a seed/grain batch estimate. Adjust the complete diet with an avian professional according to body condition and activity.” |
| Pigeon — Racing/Competition | “Feed 40-50g per bird per day. Increase 2 weeks before races. Provide extra water.” | “Performance birds have individual energy and recovery needs. Use a veterinarian- or specialist-reviewed performance diet as the foundation.” |
| Pigeon — Breeding | “Feed 35-45g per bird per day. Ensure consistent feeding schedule.” | “Breeding birds need individually assessed mineral, energy, and amino-acid support beyond this batch estimate.” |
| Pigeon — Molting Season | “Feed 40-50g per bird per day. Increase protein during feather loss.” | “Molting support should be based on body condition and a complete diet; this seed/grain estimate does not assess amino-acid adequacy.” |
| Pigeon — Winter Season | “Feed 40-50g per bird per day. Increase fat content for body warmth.” | “Cold-weather feeding needs vary with housing, weather, activity, and body condition. Avoid increasing high-fat seeds without professional guidance.” |
| Pigeon — Pet/Companion | “Feed 25-35g per bird per day. Provide variety and enrichment.” | “Keep seeds and grains as part of a broader, balanced pigeon diet. Monitor body condition and consult an avian veterinarian for dietary changes.” |
| Parrot — Pet/Companion | “Feed 30-50g per bird per day. Provide varied diet with fresh foods.” | “Use a formulated diet as the nutritional base. Treat this mix as limited enrichment rather than a daily complete food.” |
| Parrot — Breeding | “Feed 40-60g per bird per day. Increase calcium and protein during breeding.” | “Do not use this planner to set calcium or breeding supplementation. Seek avian-veterinary guidance for breeding birds.” |
| Parrot — Molting Season | “Feed 40-60g per bird per day. Support feather growth with protein.” | “Maintain a species-appropriate complete diet during molt; this mix cannot validate amino acids, minerals, or vitamins.” |
| African Grey — Pet/Companion | “Feed 30-50g per bird per day. Monitor calcium/phosphorus ratio (1.2:1).” | “African greys are prone to calcium-related nutritional problems on seed-heavy diets. Use a formulated base diet and avian-veterinary guidance.” |
| African Grey — Breeding | “Feed 40-60g per bird per day. Maintain proper mineral balance.” | “Breeding diets require professional mineral and nutrient assessment; do not rely on this seed/grain estimate as a breeding ration.” |
| African Grey — Molting Season | “Feed 40-60g per bird per day. Support feather growth safely.” | “Maintain a formulated base diet through molt and consult an avian veterinarian for feather or health concerns.” |
| Budgie — Pet/Companion | “Feed 10-15g per bird per day. Provide fresh vegetables daily.” | “Use a species-appropriate formulated diet as the base. Keep this mix limited and provide varied fresh foods as appropriate.” |
| Budgie — Breeding | “Feed 15-20g per bird per day. Increase protein during breeding season.” | “Breeding budgies need individual veterinary assessment; this mix does not establish mineral or amino-acid adequacy.” |
| Budgie — Molting Season | “Feed 15-20g per bird per day. Support feather development.” | “Keep a nutritionally complete base diet during molt. This planner does not assess feather-supporting amino acids or micronutrients.” |
| Canary — Pet/Companion | “Feed 8-12g per bird per day. Provide variety and enrichment.” | “Use a formulated or fortified diet as the base. Treat this mix as limited enrichment, not the sole ration.” |
| Canary — Breeding | “Feed 12-16g per bird per day. Increase protein during breeding.” | “Breeding canaries need individual professional guidance; this mix does not establish egg, mineral, or amino-acid adequacy.” |
| Canary — Molting Season | “Feed 12-16g per bird per day. Support feather growth.” | “Maintain a complete base diet during molt. Use veterinary guidance for any persistent feather or health issue.” |
| Chicken — Pet/Companion | “Feed 100-150g per bird per day. Provide grit and oyster shell.” | “Use an age-appropriate complete poultry ration as the base. This planner estimates a scratch supplement, not a daily feed allowance.” |
| Chicken — Egg-laying | “Feed 120-160g per bird per day. Ensure adequate calcium for shells.” | “Laying hens require a validated complete layer ration. This scratch estimate does not assess calcium, phosphorus, vitamins, or energy.” |
| Chicken — Molting Season | “Feed 120-160g per bird per day. Support feather growth.” | “Use a complete poultry ration during molt and seek poultry-nutrition guidance before altering protein or supplement levels.” |

### Approval choices for daily-feeding copy

1. **Restore all previous fixed-amount copy exactly.**
2. **Keep the cautious wording exactly as written.**
3. **Create a hybrid:** retain the original amounts and add one short qualification below them.
4. **Approve line-by-line:** choose the wording separately for any bird/profile.

No daily-feeding text has been restored yet.

## 2. Exact warning behavior and wording changes

### Preserved legacy warning text

The legacy `PigeonMixCalculator` and its data remain unchanged. Its visible warnings were:

| Condition | Legacy wording |
|---|---|
| Missing category | `Missing {category}: {reason}` with `CRITICAL` severity. |
| No legumes in generated mix | `No legumes in mix - essential for protein!` |
| Low grain share | `Insufficient grains - essential for energy!` |
| Low protein | `Protein too low ({value}%)` |
| High fiber | `Fiber too high ({value}%)` |
| No yellow corn / maize | `No yellow corn - risk of Vitamin A deficiency` |
| Missing grains detail | `No grains available - these are essential for energy and carbohydrates` |
| Missing legumes detail | `No legumes available - these are essential for protein and amino acids` |
| Missing seeds detail | `No oil seeds available - important for fat content and feather health` |

### Current active multi-bird warning text

The active `MultibirMixCalculator` currently produces these messages:

| Condition | Current wording |
|---|---|
| Invalid profile | `The selected bird situation is not available.` |
| No eligible inventory | `Add at least one compatible, safely prepared ingredient.` |
| Ineligible ingredient | `{ingredient} was excluded: {reason}.` with `CRITICAL` severity. |
| Missing category | `{Category}: No eligible {category} ingredients are available for this batch estimate.` with `WARNING` severity. |
| Short inventory | `Only {available}g of eligible inventory is available, so the recipe is scaled to that amount.` |
| Macro target miss | `{Nutrient} is {value}% (estimate target: {minimum}-{maximum}%).` |
| Category target miss | `{Category} ratio is {value}% (estimate range: {minimum}-{maximum}%).` |
| Only corn/milo-type grain | `Pair {grain} with another grain such as wheat, barley, or oats for greater ingredient diversity.` |
| Low protein suggestion | `Consider a compatible, safely prepared protein ingredient only after confirming its processing and suitability for your bird.` |
| High-fat suggestion | `Reduce oil seeds or high-fat ingredients if your avian or poultry professional agrees that the fat estimate is too high.` |
| Inventory alert | `Excluded from the formula: {reason}.` |
| Safety footer | `Raw beans and soybeans are not offered by the selector and are excluded if already in inventory. If processing status is uncertain, do not use the ingredient.` |

### Approval choices for warnings

1. **Restore legacy pigeon warning copy when Pigeon is selected; retain multi-bird warnings for all other species.**
2. **Keep the current multi-bird warning copy.**
3. **Use legacy warning titles and current safety/compatibility checks.**
4. **Approve a line-by-line hybrid.**

No warning text will be changed without selecting one of these options or providing replacement wording.

## 3. Exact formula-engine difference

The previous active page imported both calculators but actually used `PigeonMixCalculator`, regardless of the multi-bird tile selection. The bird tiles changed profile copy and menus, but the calculated batch was generated from the legacy pigeon `PROFILES` data.

| Dimension | Previous active `PigeonMixCalculator` | Current active `MultibirMixCalculator` |
|---|---|---|
| Profile source | `PROFILES` in `data.ts`, which is pigeon-focused. | `BIRD_PROFILES` in `birds.ts`, selected by bird and situation. |
| Formula allocation | Takes the midpoint of each legacy category range; divides that category’s target weight equally between all available ingredients in the category; caps by inventory; scales only if all allocated items can scale. | Builds the batch in 5g or 10g increments. For each increment it evaluates every eligible ingredient and chooses the candidate with the best current score. |
| Score basis | `scoreMix()` exists with protein/carbs/fat/fiber/category/diversity weights, but the active legacy `calculate()` method does **not call it**. | Scores distance from the selected bird/profile macronutrient midpoint, distance from bird category targets, a deficit penalty, and a small variety bonus. |
| Bird specificity | Not used for the active formula. | Used in the active formula and in compatibility filtering. |
| Safety filtering | Legacy calculator relies on the inventory supplied by the interface. | Excludes incompatible, species-toxic, raw-toxic, and processing-dependent ingredients before calculation. |
| Repeatability | Deterministic in the actual active legacy page. | Deterministic, with alphabetical tie-breaking. |

The separate, unused old `calculator-multi-bird.ts` contained a `Math.random() * 0.1` diversity tie-breaker. That was not the actual calculation path used by the pre-audit page.

**Formula decision:** You approved continuing with the new multi-bird engine in principle. No numeric nutrition target, ingredient value, or human-authored formulation was changed by the engine switch itself; however, the batch outputs can differ because the engine and category-allocation method differ.

## 4. Existing source base and provenance enhancement

The project already has a research foundation. GitHub’s [`docs/research/RESEARCH_REFERENCES.md`](https://github.com/Crypto-Shroom/Bird-Feed-Calculator/blob/main/docs/research/RESEARCH_REFERENCES.md) documents pigeon nutrition, veterinary, commercial-formulation, seasonal, toxic-legume, and supplement references. The existing `data.ts` is preserved and remains the authoritative internal data store.

The proposed reconciliation layer is **additive only**. It would introduce a separate record such as:

| Existing field | Additive provenance field |
|---|---|
| `wheat.protein = 13.5` | `sources: [existing research reference ID(s)]` |
| Herb dosage text | `source status`, `review date`, and `product-owner decision` |
| Profile range | `derived-from` reference(s), scope note, and approval record |
| Community ingredient suggestion | `submitted by`, proposed food form, evidence links, test result, decision, and reviewer |

No current ingredient value, source, target, or herb entry would be replaced. A submitted food would remain `proposed` until reviewed and approved in a dedicated pull request.

## 5. GitHub reconciliation and the community issue

### Why the branches cannot be casually merged

GitHub `main` is the preserved December 2025 repository structure. The managed WebDev project continued separately through a 16 February 2026 checkpoint, then the audit branch was created from that separate history. The audit branch is currently 11 commits ahead of GitHub `main` and 23 commits behind it. This is not an error; it means the two histories contain independently valuable work.

The safe reconciliation path is:

1. Keep `main` untouched.
2. Keep the audit branch untouched except for explicitly approved work.
3. Open a pull request only after creating a human-readable change ledger.
4. Review file-by-file: preserve old Python and historical material, choose the canonical web-app folder, and resolve only the intentional differences.
5. Merge only after product-owner approval and passing checks.

### The issue you remembered

You were correct. [Issue #6](https://github.com/Crypto-Shroom/Bird-Feed-Calculator/issues/6) was created by **@janedaw** on 16 July 2026. They explained that they had used GitHub Copilot to get the project running and identified the `@builder.io/vite-plugin-jsx-loc` / Vite 7 incompatibility. They said the calculator looked “amazing.” Your reply on 14 August said their comment motivated you to revive the project and that the goal had always been an app/website. You also wrote that you were impressed they got it running. This is a valuable first user signal and should be retained as part of the project story.

## 6. CI and release governance

The approved validation workflow and release-governance rules are now on the audit branch. The workflow validates TypeScript, runs all 21 calculator scenarios, and builds the production bundle. It does **not** deploy, change sources, or alter formulations.

GitHub Actions is enabled and the workflow file is present on the audit branch. Its first authoritative run will occur when GitHub schedules a branch push or a pull request using that branch; no workflow run was returned by the GitHub Actions API immediately after publication. This is a workflow-scheduling observation, not a source-code failure.

The release rules use immutable tags, require release notes, and explicitly forbid formula, data, warning, profile, or historical-file changes without product-owner approval.

## 7. Deployment options for the website

| Option | Best for | Advantages | Trade-offs | Recommendation |
|---|---|---|---|---|
| **Manus managed hosting** | The current React/Vite project and rapid iteration | Existing preview, managed TLS, checkpoints/rollback, custom domain support, no server administration. | Tied to the managed WebDev environment. | **Best immediate option.** Publish the approved version from Manus when ready. |
| **GitHub Pages** | A public, static calculator with no server or secret needs | Free for public projects, GitHub-native deployment, simple URL. | Requires a GitHub Pages build/deploy workflow and public-code exposure; no backend/API proxy. | Good later public mirror if static-only. |
| **Raspberry Pi** | Learning, home-lab control, or self-hosting | Full ownership and low running cost if hardware/network already exist. | You manage uptime, backups, updates, HTTPS, DNS, router/security, and power/network failures. | Not the first public release path. Use only if self-hosting is an intentional learning goal. |
| **Cloudflare Pages / Netlify / Vercel** | Public static deployment with GitHub-based workflow | Straightforward continuous deployment, previews, custom domains. | Another provider/account and deployment workflow to maintain. | Viable if you prefer GitHub as the operational centre. |

**Recommended sequence:** Keep Manus as the active development and first public release host. Use GitHub as the audited source-control and review system. Consider GitHub Pages or Cloudflare Pages only after the canonical repository layout and release flow are settled. Do not use the Raspberry Pi for the first public production release unless self-hosting is a primary objective.

## 8. Date and session clarification

I do not retain a complete human-chat transcript outside the inherited project record. The repository evidence shows:

| Event | Date |
|---|---|
| GitHub `main` last code update before revival | 18 December 2025 |
| Last managed WebDev checkpoint before the current work resumed | 16 February 2026 |
| Community issue opened | 16 July 2026 |
| Your reply that the project would be revived as an app/website | 14 August 2026 |

Based on the managed-project history, **16 February 2026** is the latest date I can verify for the previous work session before this resumed effort.
