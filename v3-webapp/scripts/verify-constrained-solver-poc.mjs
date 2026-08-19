import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { performance } from "node:perf_hooks";

import { BIRD_PROFILES, getCategoryTargets } from "../client/src/lib/birds.ts";
import { checkBirdToxicity, isIngredientCompatible } from "../client/src/lib/bird-safety.ts";
import { INGREDIENTS } from "../client/src/lib/data.ts";
import { getProfileDefaultIngredients } from "../client/src/lib/inventory-presets.ts";
import { isToxicRaw, requiresVerifiedProcessing } from "../client/src/lib/safety.ts";

const require = createRequire(import.meta.url);
const createHighs = require("highs");

const macroKeys = ["protein", "carbs", "fat", "fiber"];
const categoryKeys = ["grain", "legume", "seed"];
const epsilon = 1e-6;

function formatNumber(value) {
  const normalized = Math.abs(value) < epsilon ? 0 : value;
  return Number.isInteger(normalized) ? String(normalized) : normalized.toFixed(9).replace(/0+$/, "").replace(/\.$/, "");
}

function lpExpression(terms) {
  const nonZeroTerms = terms.filter(({ coefficient }) => Math.abs(coefficient) >= epsilon);
  if (nonZeroTerms.length === 0) return "0";

  return nonZeroTerms
    .map(({ coefficient, variable }, index) => {
      const absolute = formatNumber(Math.abs(coefficient));
      const prefix = index === 0 ? (coefficient < 0 ? "- " : "") : (coefficient < 0 ? " - " : " + ");
      return `${prefix}${absolute} ${variable}`;
    })
    .join("");
}

function canonicalEligibleInventory(inventory, bird) {
  return Object.entries(inventory)
    .sort(([left], [right]) => left.localeCompare(right))
    .flatMap(([name, amount]) => {
      const ingredient = INGREDIENTS[name];
      if (!ingredient || !Number.isFinite(amount) || amount <= 0) return [];
      if (
        !isIngredientCompatible(name, bird)
        || checkBirdToxicity(name, bird)
        || isToxicRaw(name)
        || requiresVerifiedProcessing(name)
      ) {
        return [];
      }

      return [{ name, amount: Math.floor(amount), ...ingredient }];
    });
}

function buildConcentrationModel({ ingredients, targetWeight, nutritionTarget, categoryTarget }) {
  const lines = ["Minimize", " maximum_share: M", "Subject To"];
  lines.push(` exact_weight: ${lpExpression(ingredients.map(({ name }) => ({ coefficient: 1, variable: name })))} = ${formatNumber(targetWeight)}`);

  for (const { name } of ingredients) {
    lines.push(` maximum_${name}: ${name} - M <= 0`);
  }

  if (nutritionTarget) {
    for (const macro of macroKeys) {
      const terms = ingredients.map(({ name, [macro]: value }) => ({ coefficient: value, variable: name }));
      const [minimum, maximum] = nutritionTarget[macro];
      lines.push(` ${macro}_minimum: ${lpExpression(terms)} >= ${formatNumber(minimum * targetWeight)}`);
      lines.push(` ${macro}_maximum: ${lpExpression(terms)} <= ${formatNumber(maximum * targetWeight)}`);
    }
  }

  if (categoryTarget) {
    for (const category of categoryKeys) {
      const terms = ingredients
        .filter((ingredient) => ingredient.category === category)
        .map(({ name }) => ({ coefficient: 1, variable: name }));
      const [minimum, maximum] = categoryTarget[category];
      lines.push(` ${category}_minimum: ${lpExpression(terms)} >= ${formatNumber((minimum / 100) * targetWeight)}`);
      lines.push(` ${category}_maximum: ${lpExpression(terms)} <= ${formatNumber((maximum / 100) * targetWeight)}`);
    }
  }

  lines.push("Bounds");
  for (const { name, amount } of ingredients) {
    lines.push(` 0 <= ${name} <= ${formatNumber(amount)}`);
  }
  lines.push(` 0 <= M <= ${formatNumber(targetWeight)}`);
  lines.push("Generals");
  lines.push(...ingredients.map(({ name }) => ` ${name}`));
  lines.push("End");

  return lines.join("\n");
}

function readMix(solution, ingredients) {
  assert.equal(solution.Status, "Optimal", `expected an optimal proof-of-concept solve, received ${solution.Status}`);
  return Object.fromEntries(
    ingredients.map(({ name }) => {
      const value = solution.Columns[name]?.Primal;
      assert.ok(Number.isFinite(value), `missing finite primal value for ${name}`);
      assert.ok(Math.abs(value - Math.round(value)) < epsilon, `${name} was not solved at a whole-gram increment`);
      return [name, Math.round(value)];
    }),
  );
}

function calculateNutrition(mix) {
  const total = Object.values(mix).reduce((sum, amount) => sum + amount, 0);
  return Object.fromEntries(
    macroKeys.map((macro) => [
      macro,
      Object.entries(mix).reduce((sum, [name, amount]) => sum + INGREDIENTS[name][macro] * amount, 0) / total,
    ]),
  );
}

function calculateCategories(mix) {
  const total = Object.values(mix).reduce((sum, amount) => sum + amount, 0);
  return Object.fromEntries(
    categoryKeys.map((category) => [
      category,
      Object.entries(mix)
        .filter(([name]) => INGREDIENTS[name].category === category)
        .reduce((sum, [, amount]) => sum + amount, 0) / total * 100,
    ]),
  );
}

function assertRangeSummary(summary, target, label) {
  for (const [key, [minimum, maximum]] of Object.entries(target)) {
    assert.ok(
      summary[key] >= minimum - epsilon && summary[key] <= maximum + epsilon,
      `${label} ${key}=${summary[key]} was outside ${minimum}-${maximum}`,
    );
  }
}

function bruteForceTwoIngredientMaximumShare(targetWeight) {
  let best = Infinity;
  for (let first = 0; first <= targetWeight; first += 1) {
    const second = targetWeight - first;
    best = Math.min(best, Math.max(first, second));
  }
  return best;
}

const highs = await createHighs();

// Reference agreement: a tiny exhaustive corpus proves that the LP model's global
// maximum-share objective matches an independently enumerated integer optimum.
const toyIngredients = [
  { name: "barley", amount: 10, ...INGREDIENTS.barley },
  { name: "wheat", amount: 10, ...INGREDIENTS.wheat },
];
const toySolution = highs.solve(buildConcentrationModel({ ingredients: toyIngredients, targetWeight: 10 }));
const toyMix = readMix(toySolution, toyIngredients);
const toyMaximum = Math.max(...Object.values(toyMix));
assert.equal(toyMaximum, bruteForceTwoIngredientMaximumShare(10), "HiGHS and exhaustive integer reference disagreed on the toy concentration optimum");

// Real active-data corpus: the reported Chicken/Pet inventory is globally solved
// with all active macro and category bounds jointly present.
const bird = "chicken";
const situation = "pet";
const requestedWeight = 1000;
const starterInventory = getProfileDefaultIngredients(bird, situation);
const profile = BIRD_PROFILES[bird].profiles[situation];
const categoryTarget = getCategoryTargets(bird);
const eligible = canonicalEligibleInventory(starterInventory, bird);
assert.deepEqual(eligible.map(({ name }) => name), ["barley", "corn_yellow", "oats", "peas", "wheat"]);

const realModel = buildConcentrationModel({
  ingredients: eligible,
  targetWeight: requestedWeight,
  nutritionTarget: profile.nutrition,
  categoryTarget,
});
const timings = [];
let realMix;
for (let iteration = 0; iteration < 5; iteration += 1) {
  const startedAt = performance.now();
  const solution = highs.solve(realModel);
  timings.push(performance.now() - startedAt);
  const mix = readMix(solution, eligible);
  if (iteration === 0) {
    realMix = mix;
  } else {
    assert.deepEqual(mix, realMix, "identical constrained-solver inputs produced a different result");
  }
}

assert.equal(Object.values(realMix).reduce((sum, amount) => sum + amount, 0), requestedWeight, "real-data solve did not preserve exact target weight");
for (const { name, amount } of eligible) {
  assert.ok(realMix[name] <= amount, `${name} exceeded actual inventory`);
}
assertRangeSummary(calculateNutrition(realMix), profile.nutrition, "real-data macro");
assertRangeSummary(calculateCategories(realMix), categoryTarget, "real-data category");
assert.equal(Math.max(...Object.values(realMix)), 200, "real-data global concentration optimum should retain the documented 200g maximum share");

// Canonical ordering is deliberate: reordering a visitor inventory object cannot
// change the pure proof-of-concept model or silently add a separately named form.
const reorderedInventory = Object.fromEntries(Object.entries(starterInventory).reverse());
assert.deepEqual(
  canonicalEligibleInventory(reorderedInventory, bird).map(({ name }) => name),
  eligible.map(({ name }) => name),
  "reordered inventory keys changed the canonical candidate set",
);

// Safety gates remain upstream and absolute. The proof-of-concept receives only
// safe active-catalog candidates, even when unsafe entries would alter nutrition.
const safetyFixture = canonicalEligibleInventory(
  { wheat: 1000, peas: 1000, kidney_beans: 1000, soybeans: 1000 },
  bird,
);
assert.deepEqual(safetyFixture.map(({ name }) => name), ["peas", "wheat"], "raw-unsafe legumes reached the constrained-solver candidate set");

// Broader active-profile fixture corpus: these inputs are checked-in test fixtures,
// not a claim that a visitor possesses the profile-default ingredients. This slice
// classifies only exact feasibility; best_attainable fallback is intentionally not
// implemented until its serial slack stages receive their own reviewed evidence.
const profileCorpus = { feasible: [], infeasible: [] };
for (const [profileBird, birdProfile] of Object.entries(BIRD_PROFILES)) {
  for (const [profileSituation, profileFixture] of Object.entries(birdProfile.profiles)) {
    const fixtureInventory = getProfileDefaultIngredients(profileBird, profileSituation);
    const fixtureEligible = canonicalEligibleInventory(fixtureInventory, profileBird);
    const fixtureModel = buildConcentrationModel({
      ingredients: fixtureEligible,
      targetWeight: requestedWeight,
      nutritionTarget: profileFixture.nutrition,
      categoryTarget: getCategoryTargets(profileBird),
    });
    const fixtureSolution = highs.solve(fixtureModel);
    const fixtureName = `${profileBird}/${profileSituation}`;

    if (fixtureSolution.Status === "Optimal") {
      const fixtureMix = readMix(fixtureSolution, fixtureEligible);
      assert.equal(Object.values(fixtureMix).reduce((sum, amount) => sum + amount, 0), requestedWeight, `${fixtureName} did not preserve target weight`);
      for (const { name, amount } of fixtureEligible) {
        assert.ok(fixtureMix[name] <= amount, `${fixtureName} exceeded ${name} stock`);
      }
      assertRangeSummary(calculateNutrition(fixtureMix), profileFixture.nutrition, `${fixtureName} macro`);
      assertRangeSummary(calculateCategories(fixtureMix), getCategoryTargets(profileBird), `${fixtureName} category`);
      profileCorpus.feasible.push(fixtureName);
    } else if (fixtureSolution.Status === "Infeasible") {
      profileCorpus.infeasible.push(fixtureName);
    } else {
      throw new Error(`${fixtureName} produced unsupported HiGHS status '${fixtureSolution.Status}'`);
    }
  }
}
assert.ok(profileCorpus.feasible.length > 0, "profile fixture corpus did not contain an exact-feasible scenario");
assert.ok(profileCorpus.infeasible.length > 0, "profile fixture corpus did not exercise an infeasible scenario");
assert.deepEqual(profileCorpus.feasible, ["parrot/pet", "canary/breeding", "chicken/pet"], "the active fixture feasibility baseline changed; review the runtime targets or catalog before accepting a solver comparison");
assert.equal(profileCorpus.infeasible.length, 18, "the active fixture infeasibility baseline changed; review the runtime targets or catalog before accepting a solver comparison");

const splitLentilCatalogRecord = INGREDIENTS.split_lentils;
assert.deepEqual(
  {
    category: splitLentilCatalogRecord?.category,
    protein: splitLentilCatalogRecord?.protein,
    carbs: splitLentilCatalogRecord?.carbs,
    fat: splitLentilCatalogRecord?.fat,
    fiber: splitLentilCatalogRecord?.fiber,
  },
  { category: "legume", protein: 25, carbs: 63, fat: 1, fiber: 8 },
  "the active split_lentils catalog record changed; reconcile it with the base lentils record and provenance before solver adoption",
);

console.log(JSON.stringify({
  status: "proof_of_concept_passed",
  package: { name: "highs", version: "1.15.2", license: "MIT" },
  scenario: { bird, situation, requestedWeight, eligible: eligible.map(({ name }) => name) },
  realMix,
  nutrition: calculateNutrition(realMix),
  categories: calculateCategories(realMix),
  timingMs: { min: Math.min(...timings), max: Math.max(...timings), mean: timings.reduce((sum, value) => sum + value, 0) / timings.length },
  profileFixtureCorpus: profileCorpus,
  activeCatalogBoundary: {
    splitLentils: { id: "split_lentils", ...splitLentilCatalogRecord },
    note: "The current proof of concept records this active alias/form record but does not alter it or canonicalize it in runtime.",
  },
  limitations: [
    "Node/Wasm model-only proof of concept; no browser Worker, cancellation, timeout, incumbent, bundle, or mobile-browser evidence.",
    "Tests exact feasibility and global concentration only; the approved serial margin, midpoint, meaningful-diversity, fallback, and quantity-vector stages remain unimplemented.",
    "No runtime calculator, formula, active ingredient, safety rule, visitor-visible copy, or Firebase configuration is imported or changed.",
  ],
}, null, 2));
