import { BIRD_PROFILES } from "../client/src/lib/birds.ts";
import { MultibirMixCalculator } from "../client/src/lib/calculator-multi-bird.ts";
import { getProfileDefaultIngredients } from "../client/src/lib/inventory-presets.ts";

const bird = "chicken";
const situation = "pet";
const targetWeight = 1000;
const inventory = getProfileDefaultIngredients(bird, situation);
const calculator = new MultibirMixCalculator(inventory, bird, situation);
const profile = BIRD_PROFILES[bird].profiles[situation];
const warnings = [];
const eligible = calculator.getEligibleIngredients(warnings);
const plans = calculator.createFeasibleCategoryPlans(eligible, targetWeight);
const targetCompliantMix = {
  peas: 200,
  oats: 80,
  corn_yellow: 360,
  wheat: 160,
  barley: 200,
};

const categoryKeys = ["grain", "legume", "seed"];

function summarizeMix(mix) {
  return {
    mix,
    nutrition: calculator.calculateNutrition(mix),
    categories: calculator.calculateCategoryRatios(mix),
    objective: calculator.objectiveScore(mix, profile.nutrition),
  };
}

function traceGreedyAllocation(plan, allocationOrder = categoryKeys) {
  const remaining = new Map(eligible.map((ingredient) => [ingredient.name, ingredient.amount]));
  const mix = {};
  const runs = [];

  for (const category of allocationOrder) {
    const choices = eligible.filter((ingredient) => ingredient.category === category);
    const requestedWeight = targetWeight * (plan[category] / 100);
    let added = 0;

    while (added < requestedWeight - 0.001) {
      const amountToAdd = Math.min(10, requestedWeight - added);
      const scoredChoices = choices
        .filter((ingredient) => (remaining.get(ingredient.name) || 0) > 0)
        .map((ingredient) => {
          const addAmount = Math.min(amountToAdd, remaining.get(ingredient.name) || 0);
          const candidate = { ...mix, [ingredient.name]: (mix[ingredient.name] || 0) + addAmount };
          return { ingredient, addAmount, score: calculator.selectionScore(candidate, profile.nutrition, plan) };
        })
        .sort((left, right) => left.score - right.score || left.ingredient.name.localeCompare(right.ingredient.name));
      const winner = scoredChoices[0];
      if (!winner) break;

      const lastRun = runs.at(-1);
      if (lastRun?.category === category && lastRun.ingredient === winner.ingredient.name) {
        lastRun.endWeight = added + winner.addAmount;
      } else {
        runs.push({
          category,
          startWeight: added,
          endWeight: added + winner.addAmount,
          ingredient: winner.ingredient.name,
          scoreAtRunStart: winner.score,
          alternativesAtRunStart: scoredChoices.map(({ ingredient, score }) => ({ ingredient: ingredient.name, score })),
        });
      }

      mix[winner.ingredient.name] = (mix[winner.ingredient.name] || 0) + winner.addAmount;
      remaining.set(winner.ingredient.name, (remaining.get(winner.ingredient.name) || 0) - winner.addAmount);
      added += winner.addAmount;
    }
  }

  const grainRuns = runs.filter((run) => run.category === "grain");
  const grainSelectionCounts = Object.fromEntries(
    Object.entries(
      grainRuns.reduce((counts, run) => {
        counts[run.ingredient] = (counts[run.ingredient] || 0) + (run.endWeight - run.startWeight);
        return counts;
      }, {}),
    ).sort(([left], [right]) => left.localeCompare(right)),
  );
  const grainOnlyMix = Object.fromEntries(
    Object.entries(mix).filter(([ingredient]) => eligible.find((candidate) => candidate.name === ingredient)?.category === "grain"),
  );

  return {
    runs,
    concise: {
      firstGrainStep: grainRuns[0],
      lastGrainStep: grainRuns.at(-1),
      grainSelectionCounts,
      grainOnly: summarizeMix(grainOnlyMix),
      final: summarizeMix(mix),
    },
    ...summarizeMix(mix),
  };
}

const candidateSummaries = plans.map((plan, index) => ({
  index,
  plan,
  ...summarizeMix(calculator.buildCandidate(eligible, targetWeight, profile.nutrition, plan)),
}));
const active = calculator.calculate(targetWeight);
const allocationTrace = traceGreedyAllocation(plans[0]);
const reverseAllocationTrace = traceGreedyAllocation(plans[0], ["legume", "grain", "seed"]);

console.log(
  JSON.stringify(
    {
      input: { bird, situation, targetWeight, inventory, profileNutrition: profile.nutrition, eligibleWarnings: warnings },
      eligible: eligible.map(({ name, amount, category, protein, carbs, fat, fiber }) => ({ name, amount, category, protein, carbs, fat, fiber })),
      plans,
      candidateSummaries,
      allocationTrace: {
        categoryOrder: categoryKeys,
        concise: allocationTrace.concise,
        fullRunCount: allocationTrace.runs.length,
      },
      reverseAllocationTrace: {
        categoryOrder: ["legume", "grain", "seed"],
        concise: reverseAllocationTrace.concise,
        fullRunCount: reverseAllocationTrace.runs.length,
      },
      active: {
        ...summarizeMix(active.mix),
        missingIngredients: active.missingIngredients,
      },
      targetCompliantMix: summarizeMix(targetCompliantMix),
    },
    null,
    2,
  ),
);
