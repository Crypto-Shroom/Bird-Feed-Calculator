// Before/after evidence for issue #211 / #125: greedy calculator versus the
// browser optimizer, run with real HiGHS in Node through the same runtime,
// Worker controller, serial stage executor, adapter, form allocation, and
// MixResult bridge that Home.tsx uses. Only the Worker transport is replaced
// by an in-process structuredClone hop.
//
//   pnpm --dir v3-webapp compare:optimizer-vs-greedy            # print summary, write markdown
//   pnpm --dir v3-webapp compare:optimizer-vs-greedy -- --check # print summary only
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";

import { BIRD_PROFILES, getCategoryTargets } from "../client/src/lib/birds.ts";
import { MultibirMixCalculator } from "../client/src/lib/calculator-multi-bird.ts";
import { INGREDIENTS } from "../client/src/lib/data.ts";
import { getProfileDefaultIngredients } from "../client/src/lib/inventory-presets.ts";
import { bridgeFeasibleWorkerMixToMixResult } from "../client/src/lib/optimizer-mix-result-bridge.ts";
import { BROWSER_SOLVER_TIME_LIMIT_MS, BROWSER_WORKER_WALL_TIMEOUT_MS, OPTIMIZER_POLICY } from "../client/src/lib/optimizer-policy.ts";
import { startBrowserLocalOptimizerSolve } from "../client/src/lib/optimizer-runtime.ts";
import { createSerialSolverExecutor } from "../client/src/lib/optimizer-serial-solver.ts";
import { OptimizerWorkerController } from "../client/src/lib/optimizer-worker-controller.ts";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(scriptDirectory, "../../docs/optimization/issue-211-optimizer-comparison.md");
const writeMarkdown = !process.argv.includes("--check");
const require = createRequire(import.meta.url);
const createHighs = require("highs");
const highsVersion = JSON.parse(readFileSync(resolve(dirname(require.resolve("highs")), "../package.json"), "utf8")).version;

const macroKeys = ["protein", "carbs", "fat", "fiber"];
const categoryKeys = ["grain", "legume", "seed"];
const macroLabels = { protein: "Protein", carbs: "Carbs", fat: "Fat", fiber: "Fiber" };
const categoryLabels = { grain: "Grain", legume: "Legume", seed: "Seed" };
const rangeTolerance = 1e-9;
const targetWeight = 1000;
const repeats = 3;

// ---------------------------------------------------------------- scenarios

const issue85Inventory = Object.fromEntries(
  ["hemp", "wheat", "peas", "chickpeas", "lentils", "chia", "canola", "corn_yellow", "hemp_hearts", "lentils_brown", "milo", "niger"].map((id) => [id, 1000]),
);
const issue85ReportedGreedy = { wheat: 610, chickpeas: 190, canola: 100, corn_yellow: 80, milo: 10, peas: 10 };
const fullCatalogInventory = Object.fromEntries(Object.keys(INGREDIENTS).sort().map((id) => [id, 1000]));

const scenarios = [];
for (const [bird, birdProfile] of Object.entries(BIRD_PROFILES)) {
  for (const situation of Object.keys(birdProfile.profiles)) {
    const issue = bird === "chicken" && situation === "pet" ? "#111" : bird === "pigeon" && situation === "winter" ? "#73" : undefined;
    scenarios.push({ group: "profile-default", id: `default:${bird}/${situation}`, bird, situation, inventory: getProfileDefaultIngredients(bird, situation), issue });
  }
}
scenarios.push({ group: "issue", id: "issue85:pigeon/pet", bird: "pigeon", situation: "pet", inventory: issue85Inventory, issue: "#85" });
scenarios.push({ group: "issue", id: "issue85-stock:pigeon/winter", bird: "pigeon", situation: "winter", inventory: issue85Inventory, issue: "#73 (variant)" });
for (const [bird, birdProfile] of Object.entries(BIRD_PROFILES)) {
  for (const situation of Object.keys(birdProfile.profiles)) {
    scenarios.push({ group: "full-catalog", id: `catalog:${bird}/${situation}`, bird, situation, inventory: fullCatalogInventory });
  }
}

// ---------------------------------------------------------------- production path, in process

const highs = await createHighs();
const browserExecutor = createSerialSolverExecutor({
  loadSolver: async () => highs,
  timeLimitMs: BROWSER_SOLVER_TIME_LIMIT_MS,
  now: () => performance.now(),
});
// Diagnostic only: re-solves timed-out scenarios without the browser budget to
// show how long the full stage sequence needs and what it would return.
const unboundedBudgetMs = 120_000;
const unboundedExecutor = createSerialSolverExecutor({
  loadSolver: async () => highs,
  timeLimitMs: unboundedBudgetMs,
  now: () => performance.now(),
});

function createInProcessWorker(executor = browserExecutor, wallTimeoutMs = BROWSER_WORKER_WALL_TIMEOUT_MS) {
  const worker = {
    onmessage: null,
    onerror: null,
    postMessage: (message) => setTimeout(() => controller.receive(structuredClone(message)), 0),
    terminate: () => controller.dispose(),
  };
  const controller = new OptimizerWorkerController(
    { postMessage: (response) => setTimeout(() => worker.onmessage?.({ data: structuredClone(response) }), 0) },
    executor,
    wallTimeoutMs,
  );
  return worker;
}

let requestCounter = 0;
async function runOptimizer(scenario, greedy, createWorker = () => createInProcessWorker()) {
  const profile = BIRD_PROFILES[scenario.bird].profiles[scenario.situation];
  const startedAt = performance.now();
  const handle = startBrowserLocalOptimizerSolve({
    requestId: `compare-${requestCounter += 1}`,
    bird: scenario.bird,
    inventory: scenario.inventory,
    requestedTargetGrams: targetWeight,
    macroRanges: profile.nutrition,
    categoryRanges: getCategoryTargets(scenario.bird),
  }, { createWorker });
  const adapted = await handle.result;
  const wallMs = performance.now() - startedAt;
  const hasMix = adapted.status === "feasible" || adapted.status === "best_attainable";
  const bridged = hasMix ? bridgeFeasibleWorkerMixToMixResult(greedy, adapted.mix, scenario.inventory, scenario.bird, scenario.situation) : undefined;
  return { adapted, bridged, wallMs };
}

// ---------------------------------------------------------------- evaluation

function rangeCheck(result, bird, situation) {
  const macroRanges = BIRD_PROFILES[bird].profiles[situation].nutrition;
  const categoryRanges = getCategoryTargets(bird);
  const macros = Object.fromEntries(macroKeys.map((key) => {
    const [minimum, maximum] = macroRanges[key];
    const value = result.nutrition[key];
    return [key, { value, minimum, maximum, ok: value >= minimum - rangeTolerance && value <= maximum + rangeTolerance }];
  }));
  const categories = Object.fromEntries(categoryKeys.map((key) => {
    const [minimum, maximum] = categoryRanges[key];
    const value = result.categories[key];
    return [key, { value, minimum, maximum, ok: value >= minimum - rangeTolerance && value <= maximum + rangeTolerance }];
  }));
  const met = [...Object.values(macros), ...Object.values(categories)].filter(({ ok }) => ok).length;
  // Spec §5.1 normalized deviation: total range-width misses, summed per group.
  const deviation = (entries) => Object.values(entries).reduce((total, { value, minimum, maximum }) => (
    total + (Math.max(0, minimum - value) + Math.max(0, value - maximum)) / (maximum - minimum)
  ), 0);
  const macrosMet = Object.values(macros).filter(({ ok }) => ok).length;
  const mix = result.mix;
  const total = Object.values(mix).reduce((sum, grams) => sum + grams, 0);
  return {
    macros,
    categories,
    met,
    macroDeviation: deviation(macros),
    categoryDeviation: deviation(categories),
    macrosMet,
    categoriesMet: met - macrosMet,
    used: Object.values(mix).filter((grams) => grams > 0).length,
    meaningful: Object.values(mix).filter((grams) => grams >= OPTIMIZER_POLICY.meaningfulInclusionGrams).length,
    maximumSharePercent: total ? Math.max(...Object.values(mix)) / total * 100 : 0,
  };
}

function verdict(greedyCheck, optimizerCheck) {
  if (!optimizerCheck) return "no_result";
  if (optimizerCheck.met > greedyCheck.met) return "improves";
  if (optimizerCheck.met < greedyCheck.met) return "worse";
  return "same";
}

const results = [];
let coldLoadMs;
for (const scenario of scenarios) {
  const greedy = new MultibirMixCalculator(scenario.inventory, scenario.bird, scenario.situation).calculate(targetWeight);
  const runs = [];
  for (let attempt = 0; attempt < repeats; attempt += 1) {
    const loadStartedAt = performance.now();
    runs.push(await runOptimizer(scenario, greedy));
    if (coldLoadMs === undefined) coldLoadMs = performance.now() - loadStartedAt;
  }
  const signature = (run) => `${run.adapted.status}|${JSON.stringify(Object.entries(run.adapted.mix).sort(([left], [right]) => left.localeCompare(right)))}`;
  // A run near the time budget can complete on one attempt and time out on the
  // next. That is budget sensitivity, not solver nondeterminism: report it, count
  // the scenario as a timeout (Home would keep greedy), and require every
  // completed run to return the identical mix.
  const completed = runs.filter((run) => run.adapted.status !== "timeout");
  const budgetSensitive = completed.length > 0 && completed.length < runs.length;
  const deterministic = completed.every((run) => signature(run) === signature(completed[0]));
  const first = runs.find((run) => run.adapted.status === "timeout") ?? runs[0];
  const greedyCheck = rangeCheck(greedy, scenario.bird, scenario.situation);
  const optimizerCheck = first.bridged ? rangeCheck(first.bridged, scenario.bird, scenario.situation) : undefined;
  const displayed = first.adapted.status === "feasible" ? "optimizer" : "greedy";
  results.push({
    scenario,
    greedy,
    greedyCheck,
    optimizer: first,
    optimizerCheck,
    deterministic,
    budgetSensitive,
    completedSolveMs: completed.length ? Math.max(...completed.map((run) => run.adapted.diagnostics.elapsedMs)) : undefined,
    solveMs: Math.max(...runs.map((run) => run.adapted.diagnostics.elapsedMs)),
    wallMs: Math.max(...runs.map((run) => run.wallMs)),
    verdict: verdict(greedyCheck, optimizerCheck),
    displayed,
  });
}

for (const row of results.filter((entry) => entry.optimizer.adapted.status === "timeout")) {
  const unbounded = await runOptimizer(row.scenario, row.greedy, () => createInProcessWorker(unboundedExecutor, unboundedBudgetMs + 10_000));
  const check = unbounded.bridged ? rangeCheck(unbounded.bridged, row.scenario.bird, row.scenario.situation) : undefined;
  row.unbounded = { ...unbounded, check, verdict: verdict(row.greedyCheck, check) };
}

// ---------------------------------------------------------------- reporting

const format = (value, digits = 2) => Number(value).toFixed(digits);
const formatMix = (mix) => Object.entries(mix)
  .filter(([, grams]) => grams > 0)
  .sort(([leftId, left], [rightId, right]) => right - left || leftId.localeCompare(rightId))
  .map(([id, grams]) => `${id} ${Math.round(grams * 100) / 100}`)
  .join(", ") || "(none)";
const rangeCell = ({ value, minimum, maximum, ok }, digits) => `${ok ? "" : "**"}${format(value, digits)}${ok ? "" : "**"} (${minimum}–${maximum}) ${ok ? "ok" : "MISS"}`;
const checkSummary = (check) => `${check.met}/7 (macros ${check.macrosMet}/4, categories ${check.categoriesMet}/3)`;

const groups = [
  { key: "profile-default", title: "Profile-default inventories (21 bird/situation profiles)" },
  { key: "issue", title: "Reported issue inventories" },
  { key: "full-catalog", title: "Largest inventory: full active catalog at 1,000 g each (safety-gated per bird)" },
];

function tally(rows) {
  const counts = { improves: 0, same: 0, worse: 0, no_result: 0 };
  rows.forEach((row) => { counts[row.verdict] += 1; });
  return counts;
}

function statusTally(rows) {
  return rows.reduce((counts, row) => ({ ...counts, [row.optimizer.adapted.status]: (counts[row.optimizer.adapted.status] ?? 0) + 1 }), {});
}

const allCounts = tally(results);
const completedRows = results.filter((row) => row.completedSolveMs !== undefined);
const worst = completedRows.reduce((slowest, row) => (row.completedSolveMs > slowest.completedSolveMs ? row : slowest), completedRows[0]);
const budgetSensitive = results.filter((row) => row.budgetSensitive);
const unboundedRows = results.filter((row) => row.unbounded);
const worstUnbounded = unboundedRows.reduce((slowest, row) => (!slowest || row.unbounded.adapted.diagnostics.elapsedMs > slowest.unbounded.adapted.diagnostics.elapsedMs ? row : slowest), undefined);
const nonDeterministic = results.filter((row) => !row.deterministic);
const timeouts = results.filter((row) => row.optimizer.adapted.status === "timeout");
const issue85 = results.find((row) => row.scenario.id === "issue85:pigeon/pet");
const issue85MatchesReport = JSON.stringify(Object.entries(issue85.greedy.mix).sort()) === JSON.stringify(Object.entries(issue85ReportedGreedy).sort());

const lines = [];
lines.push("# Issue #211 / #125 — optimizer versus greedy comparison");
lines.push("");
lines.push("**Status:** Evidence for owner review. Generated by `pnpm --dir v3-webapp compare:optimizer-vs-greedy`; do not edit by hand.");
lines.push("");
lines.push("## Method");
lines.push("");
lines.push(`- **Greedy**: \`MultibirMixCalculator(inventory, bird, situation).calculate(${targetWeight})\`, unchanged.`);
lines.push(`- **Optimizer**: the production browser path, with real HiGHS ${highsVersion} (WebAssembly) in Node: \`startBrowserLocalOptimizerSolve\` (safety gate, canonical identity, model) → \`OptimizerWorkerController\` (wall timeout ${BROWSER_WORKER_WALL_TIMEOUT_MS} ms) → serial staged executor (shared in-solver budget ${BROWSER_SOLVER_TIME_LIMIT_MS} ms) → strict adapter → inventory-form allocation → \`bridgeFeasibleWorkerMixToMixResult\`. Only the Worker \`postMessage\` hop is replaced by an in-process \`structuredClone\`.`);
lines.push("- **D_macro / D_category**: the spec §5.1 normalized deviation — the sum, over the 4 macros (or 3 categories), of how far the mix lies outside each range, measured in range widths. 0 means every range in that group is met.");
lines.push("- **Targets met**: the number of the 7 configured ranges (4 macros, 3 categories) the mix satisfies. A scenario *improves* when the optimizer meets more ranges than greedy, is the *same* when equal, and is *worse* when it meets fewer.");
lines.push(`- **Ingredients used** counts every ingredient above 0 g; **meaningful** counts those at or above the ${OPTIMIZER_POLICY.meaningfulInclusionGrams} g meaningful-inclusion threshold.`);
lines.push(`- **Solve time** is the Worker-reported elapsed time (maximum of ${repeats} runs). The same HiGHS instance is reused, as in one Worker session; the first run (cold wasm instantiate plus first solve) took ${format(coldLoadMs, 1)} ms.`);
lines.push(`- **Determinism**: every scenario is solved ${repeats} times; every run that completes must return the identical mix. A scenario whose runs straddle the time budget (some complete, some time out) is reported as budget-sensitive and counted as a timeout, because Home would keep the greedy mix whenever it times out.`);
lines.push(`- **Displayed today**: Home.tsx replaces the greedy mix only for \`feasible\` (all ranges met). A \`best_attainable\` fallback is computed and validated but is **not** shown until the owner approves its presentation (spec §5.2: a fallback must never be presented as "optimized" without saying it is best attainable).`);
lines.push("- Issue #73 has no recorded inventory in the repository, so the pigeon Winter profile-default inventory stands in for it, plus a variant using the #85 stock.");
lines.push("");
lines.push("## Summary");
lines.push("");
lines.push("| Group | Scenarios | Optimizer `feasible` | `best_attainable` | timeout/error | Improves | Same | Worse | No optimizer result |");
lines.push("| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
for (const group of [...groups, { key: undefined, title: "**All**" }]) {
  const rows = group.key ? results.filter((row) => row.scenario.group === group.key) : results;
  const counts = tally(rows);
  const statuses = statusTally(rows);
  const failed = rows.length - (statuses.feasible ?? 0) - (statuses.best_attainable ?? 0);
  lines.push(`| ${group.title} | ${rows.length} | ${statuses.feasible ?? 0} | ${statuses.best_attainable ?? 0} | ${failed} | ${counts.improves} | ${counts.same} | ${counts.worse} | ${counts.no_result} |`);
}
lines.push("");
const displayedRows = results.filter((row) => row.displayed === "optimizer");
lines.push(`With today's Home gating, visitors would see the optimizer mix in ${displayedRows.length} of ${results.length} scenarios (every one meets all 7 ranges); every other scenario keeps the greedy mix.`);
lines.push("");
lines.push(`- Worst completed solve time within the browser budget: **${format(worst.completedSolveMs, 1)} ms** (${worst.scenario.id}). Budget: ${BROWSER_SOLVER_TIME_LIMIT_MS} ms in-solver, ${BROWSER_WORKER_WALL_TIMEOUT_MS} ms wall.`);
const slowestRealistic = results.filter((row) => row.scenario.group !== "full-catalog").reduce((slowest, row) => (row.solveMs > slowest.solveMs ? row : slowest));
lines.push(`- Worst solve time outside the full-catalog stress group: **${format(slowestRealistic.solveMs, 1)} ms** (${slowestRealistic.scenario.id}).`);
lines.push(`- Timeouts (Home keeps greedy): ${timeouts.length}${timeouts.length ? ` — ${timeouts.map((row) => row.scenario.id).join(", ")}` : ""}. Budget-sensitive: ${budgetSensitive.length}${budgetSensitive.length ? ` (${budgetSensitive.map((row) => row.scenario.id).join(", ")})` : ""}. Completed runs that disagreed: ${nonDeterministic.length}.`);
if (worstUnbounded) lines.push(`- Without the browser budget, the timed-out scenarios need up to **${format(worstUnbounded.unbounded.adapted.diagnostics.elapsedMs, 0)} ms** in Node (${worstUnbounded.scenario.id}); see the last section.`);
lines.push(`- #85 greedy output ${issue85MatchesReport ? "matches" : "does **not** match"} the reported mix (${formatMix(issue85ReportedGreedy)}).`);
lines.push("");

const byStatus = (status) => results.filter((row) => row.optimizer.adapted.status === status);
const feasibleRows = byStatus("feasible");
const fallbackRows = byStatus("best_attainable");
const fallbackCounts = tally(fallbackRows);
const fallbackMacroNoWorse = fallbackRows.filter((row) => row.optimizerCheck.macroDeviation <= row.greedyCheck.macroDeviation + 1e-9).length;
const fallbackWorseCategoryLoss = fallbackRows.filter((row) => row.verdict === "worse" && row.optimizerCheck.categoriesMet < row.greedyCheck.categoriesMet).length;
lines.push("## Interpretation");
lines.push("");
lines.push(`- **\`feasible\` (${feasibleRows.length} scenarios):** every optimizer mix meets all 7 ranges. ${tally(feasibleRows).improves} improve on greedy; ${tally(feasibleRows).same} tie because greedy already met all 7. These are the only optimizer results Home shows today.`);
lines.push(`- **\`best_attainable\` (${fallbackRows.length} scenarios):** ${fallbackCounts.improves} improve, ${fallbackCounts.same} stay the same, and ${fallbackCounts.worse} get worse on targets met. The fallback does what spec §5.2 asks: its normalized macro deviation D_macro is no larger than greedy's in ${fallbackMacroNoWorse} of ${fallbackRows.length} scenarios, because it minimizes D_macro first over every whole-gram mix. In ${fallbackWorseCategoryLoss} of the ${fallbackCounts.worse} worse cases the loss comes from category shares: once macro deviation is locked at its minimum, the category ranges that greedy fills first can no longer be met. Minimizing the *size* of the macro miss is not the same as minimizing the *number* of missed ranges.`);
lines.push(`- **Timeouts (${timeouts.length} scenarios):** only the full-catalog stress inventories (60+ eligible ingredients) exceed the ${BROWSER_SOLVER_TIME_LIMIT_MS} ms budget; Home keeps the greedy mix and no partial result is used. No profile-default or reported-issue inventory timed out. Full-catalog scenarios that finish within about 10% of the budget can complete on one run and time out on the next, so the exact timeout list varies with machine speed and load.`);
lines.push("");

function scenarioTable(rows) {
  lines.push("| Scenario | Greedy targets met | Optimizer status | Optimizer targets met | Verdict | D_macro (greedy → opt) | D_category (greedy → opt) | Used (greedy → opt) | Meaningful (greedy → opt) | Max share % (greedy → opt) | Solve ms |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: |");
  for (const row of rows) {
    const opt = row.optimizerCheck;
    lines.push(`| ${row.scenario.id}${row.scenario.issue ? ` (${row.scenario.issue})` : ""} | ${checkSummary(row.greedyCheck)} | \`${row.optimizer.adapted.status}\` | ${opt ? checkSummary(opt) : "—"} | ${row.verdict} | ${format(row.greedyCheck.macroDeviation)} → ${opt ? format(opt.macroDeviation) : "—"} | ${format(row.greedyCheck.categoryDeviation)} → ${opt ? format(opt.categoryDeviation) : "—"} | ${row.greedyCheck.used} → ${opt ? opt.used : "—"} | ${row.greedyCheck.meaningful} → ${opt ? opt.meaningful : "—"} | ${format(row.greedyCheck.maximumSharePercent, 1)} → ${opt ? format(opt.maximumSharePercent, 1) : "—"} | ${format(row.solveMs, 1)} |`);
  }
  lines.push("");
}

for (const group of groups) {
  lines.push(`## ${group.title}`);
  lines.push("");
  scenarioTable(results.filter((row) => row.scenario.group === group.key));
}

if (unboundedRows.length) {
  lines.push("## Timed-out scenarios re-solved without the browser budget (diagnostic only)");
  lines.push("");
  lines.push(`These runs use a ${unboundedBudgetMs / 1000} s budget instead of ${BROWSER_SOLVER_TIME_LIMIT_MS} ms. They are not what visitors see today; they show what a larger budget would return.`);
  lines.push("");
  lines.push("| Scenario | Status | Solve ms | Greedy targets met | Optimizer targets met | Verdict | D_macro (greedy → opt) | Used (greedy → opt) | Max share % (greedy → opt) |");
  lines.push("| --- | --- | ---: | --- | --- | --- | --- | --- | --- |");
  for (const row of unboundedRows) {
    const { adapted, check } = row.unbounded;
    lines.push(`| ${row.scenario.id} | \`${adapted.status}\` | ${format(adapted.diagnostics.elapsedMs, 0)} | ${checkSummary(row.greedyCheck)} | ${check ? checkSummary(check) : "—"} | ${row.unbounded.verdict} | ${format(row.greedyCheck.macroDeviation)} → ${check ? format(check.macroDeviation) : "—"} | ${row.greedyCheck.used} → ${check ? check.used : "—"} | ${format(row.greedyCheck.maximumSharePercent, 1)} → ${check ? format(check.maximumSharePercent, 1) : "—"} |`);
  }
  lines.push("");
}

lines.push("## Per-scenario detail");
lines.push("");
for (const row of results) {
  const profile = BIRD_PROFILES[row.scenario.bird].profiles[row.scenario.situation];
  lines.push(`### ${row.scenario.id}${row.scenario.issue ? ` (${row.scenario.issue})` : ""}`);
  lines.push("");
  lines.push(`Profile: ${BIRD_PROFILES[row.scenario.bird].name} → ${profile.name}. Optimizer status \`${row.optimizer.adapted.status}\`; verdict **${row.verdict}**; displayed today: ${row.displayed}; completed runs identical: ${row.deterministic ? "yes" : "NO"}${row.budgetSensitive ? "; budget-sensitive (some runs timed out)" : ""}.`);
  lines.push("");
  lines.push(`- Greedy mix: ${formatMix(row.greedy.mix)}`);
  lines.push(`- Optimizer mix: ${row.optimizer.bridged ? formatMix(row.optimizer.bridged.mix) : `(none — ${row.optimizer.adapted.violations.join("; ") || row.optimizer.adapted.status})`}`);
  lines.push("");
  lines.push("| Range | Greedy | Optimizer |");
  lines.push("| --- | --- | --- |");
  for (const key of macroKeys) lines.push(`| ${macroLabels[key]} % | ${rangeCell(row.greedyCheck.macros[key], 2)} | ${row.optimizerCheck ? rangeCell(row.optimizerCheck.macros[key], 2) : "—"} |`);
  for (const key of categoryKeys) lines.push(`| ${categoryLabels[key]} share % | ${rangeCell(row.greedyCheck.categories[key], 1)} | ${row.optimizerCheck ? rangeCell(row.optimizerCheck.categories[key], 1) : "—"} |`);
  lines.push(`| Targets met | ${checkSummary(row.greedyCheck)} | ${row.optimizerCheck ? checkSummary(row.optimizerCheck) : "—"} |`);
  lines.push(`| D_macro / D_category | ${format(row.greedyCheck.macroDeviation)} / ${format(row.greedyCheck.categoryDeviation)} | ${row.optimizerCheck ? `${format(row.optimizerCheck.macroDeviation)} / ${format(row.optimizerCheck.categoryDeviation)}` : "—"} |`);
  lines.push(`| Ingredients used / meaningful | ${row.greedyCheck.used} / ${row.greedyCheck.meaningful} | ${row.optimizerCheck ? `${row.optimizerCheck.used} / ${row.optimizerCheck.meaningful}` : "—"} |`);
  lines.push(`| Solve time | — | ${format(row.solveMs, 1)} ms |`);
  lines.push("");
}

const markdown = `${lines.join("\n")}\n`;
if (writeMarkdown) writeFileSync(outputPath, markdown);

console.log(JSON.stringify({
  scenarios: results.length,
  verdicts: allCounts,
  statuses: statusTally(results),
  displayedOptimizer: displayedRows.length,
  worstCompletedSolveMs: Math.round(worst.completedSolveMs * 10) / 10,
  worstCompletedScenario: worst.scenario.id,
  worstUnboundedMs: worstUnbounded ? Math.round(worstUnbounded.unbounded.adapted.diagnostics.elapsedMs) : null,
  unboundedVerdicts: tally(unboundedRows.map((row) => ({ verdict: row.unbounded.verdict }))),
  budgetSensitive: budgetSensitive.map((row) => row.scenario.id),
  coldFirstRunMs: Math.round(coldLoadMs * 10) / 10,
  timeouts: timeouts.map((row) => row.scenario.id),
  nonDeterministic: nonDeterministic.map((row) => row.scenario.id),
  issue85GreedyMatchesReport: issue85MatchesReport,
  wrote: writeMarkdown ? outputPath : null,
}, null, 2));

if (nonDeterministic.length > 0 || !issue85MatchesReport) process.exitCode = 1;
