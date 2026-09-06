import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(import.meta.dirname, "../../../..");
const provenanceDirectory = resolve(repositoryRoot, "database/provenance");

function readJson(fileName: string) {
  return JSON.parse(readFileSync(resolve(provenanceDirectory, fileName), "utf8"));
}

describe("canonical provenance ledger", () => {
  it("has a valid deterministic ledger check", () => {
    const output = execFileSync("node", ["database/tools/validate-provenance-ledger.mjs"], {
      cwd: repositoryRoot,
      encoding: "utf8",
    });

    expect(output).toContain("Provenance ledger validation passed.");
  });

  it("keeps every protected historical claim connected to a registered source", () => {
    const sources = readJson("sources.json").sources as Array<{ id: string }>;
    const historicalClaims = readJson("historical-claims.json").claims as Array<{ sourceIds: string[] }>;
    const sourceIds = new Set(sources.map((source) => source.id));

    for (const claim of historicalClaims) {
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("defines the exact six-bird review order for future ingredient evidence", () => {
    const ledger = readJson("food-reviews.json") as { requiredBirdOrder: string[] };

    expect(ledger.requiredBirdOrder).toEqual([
      "pigeon",
      "parrot",
      "african_grey",
      "budgie",
      "canary",
      "chicken",
    ]);
  });

  it("records the apple review for all six birds with limited pigeon-specific evidence", () => {
    const ledger = readJson("food-reviews.json") as {
      ingredientReviews: Array<{
        ingredientId: string;
        speciesEvidence: Array<{ bird: string; outcome: string; sourceIds: string[] }>;
      }>;
    };
    const apple = ledger.ingredientReviews.find((review) => review.ingredientId === "apple");

    expect(apple).toBeDefined();
    expect(apple?.speciesEvidence.map((entry) => entry.bird)).toEqual([
      "pigeon",
      "parrot",
      "african_grey",
      "budgie",
      "canary",
      "chicken",
    ]);
    const pigeonApple = apple?.speciesEvidence.find((entry) => entry.bird === "pigeon");
    expect(pigeonApple?.outcome).toBe("limited");
    expect(pigeonApple?.sourceIds).toContain("modern-pet-pigeon-fruits-vegetables-2026");
    expect(apple?.speciesEvidence.every((entry) => entry.sourceIds.length > 0)).toBe(true);
  });

  it("records raw dried chickpeas with explicit six-bird evidence and a historical raw-legume coverage link", () => {
    const foodLedger = readJson("food-reviews.json") as {
      ingredientReviews: Array<{
        ingredientId: string;
        form: string;
        speciesEvidence: Array<{ bird: string; outcome: string; sourceIds: string[] }>;
      }>;
    };
    const coverageLedger = readJson("food-coverage.json") as {
      claimCoverage: Array<{
        historicalClaimId: string;
        trackedItems: Array<{ id: string; linkedFoodReviewKeys: string[] }>;
      }>;
    };
    const chickpeas = foodLedger.ingredientReviews.find(
      (review) => review.ingredientId === "chickpeas" && review.form === "raw dried seeds",
    );
    const rawLegumeCoverage = coverageLedger.claimCoverage.find(
      (coverage) => coverage.historicalClaimId === "historical-raw-legume-rules",
    );
    const rawChickpeaCoverage = rawLegumeCoverage?.trackedItems.find((item) => item.id === "chickpeas-raw");

    expect(chickpeas?.speciesEvidence.map((entry) => entry.bird)).toEqual([
      "pigeon",
      "parrot",
      "african_grey",
      "budgie",
      "canary",
      "chicken",
    ]);
    expect(chickpeas?.speciesEvidence.filter((entry) => entry.outcome === "unresolved")).toHaveLength(1);
    expect(chickpeas?.speciesEvidence.filter((entry) => entry.outcome === "requires_preparation")).toHaveLength(4);
    expect(chickpeas?.speciesEvidence.find((entry) => entry.bird === "chicken")?.outcome).toBe("limited");
    expect(chickpeas?.speciesEvidence.every((entry) => entry.sourceIds.length > 0)).toBe(true);
    expect(rawChickpeaCoverage?.linkedFoodReviewKeys).toEqual(["chickpeas::raw dried seeds"]);
  });

  it("records the five-item raw-legume batch with complete six-bird evidence, coverage links, and lentil split-form inheritance", () => {
    const foodLedger = readJson("food-reviews.json") as {
      requiredBirdOrder: string[];
      ingredientReviews: Array<{
        ingredientId: string;
        form: string;
        formAttributes?: {
          model: string;
          attribute: string;
          supportedValues: string[];
          defaultValue: string;
          inherits: string[];
          materialProcessingBoundaries: string[];
        };
        speciesEvidence: Array<{ bird: string; outcome: string; sourceIds: string[] }>;
      }>;
    };
    const coverageLedger = readJson("food-coverage.json") as {
      claimCoverage: Array<{
        historicalClaimId: string;
        trackedItems: Array<{ id: string; linkedFoodReviewKeys: string[] }>;
      }>;
    };
    const expected = [
      {
        trackedItemId: "lentils-raw",
        ingredientId: "lentils",
        form: "raw dried lentil seeds",
        outcomes: ["limited", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation", "limited"],
      },
      {
        trackedItemId: "split-peas-raw",
        ingredientId: "split_peas",
        form: "raw dried split pea cotyledons",
        outcomes: ["limited", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation", "limited"],
      },
      {
        trackedItemId: "mung-beans-raw",
        ingredientId: "mung_beans",
        form: "raw dried mung beans",
        outcomes: ["limited", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation", "limited"],
      },
      {
        trackedItemId: "garden-peas-raw",
        ingredientId: "garden_peas",
        form: "raw mature dried garden peas",
        outcomes: ["limited", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation", "limited"],
      },
      {
        trackedItemId: "kidney-beans-raw",
        ingredientId: "kidney_beans",
        form: "raw dried kidney beans",
        outcomes: ["unresolved", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation"],
      },
    ];
    const rawLegumeCoverage = coverageLedger.claimCoverage.find(
      (coverage) => coverage.historicalClaimId === "historical-raw-legume-rules",
    );

    for (const expectedReview of expected) {
      const review = foodLedger.ingredientReviews.find(
        (candidate) =>
          candidate.ingredientId === expectedReview.ingredientId && candidate.form === expectedReview.form,
      );
      const trackedItem = rawLegumeCoverage?.trackedItems.find(
        (item) => item.id === expectedReview.trackedItemId,
      );

      expect(review?.speciesEvidence.map((entry) => entry.bird)).toEqual(foodLedger.requiredBirdOrder);
      expect(review?.speciesEvidence.map((entry) => entry.outcome)).toEqual(expectedReview.outcomes);
      expect(review?.speciesEvidence.every((entry) => entry.sourceIds.length > 0)).toBe(true);
      expect(trackedItem?.linkedFoodReviewKeys).toEqual([
        `${expectedReview.ingredientId}::${expectedReview.form}`,
      ]);
    }

    const lentilReview = foodLedger.ingredientReviews.find(
      (candidate) => candidate.ingredientId === "lentils" && candidate.form === "raw dried lentil seeds",
    );
    expect(lentilReview?.formAttributes).toMatchObject({
      model: "inherited_mechanical_form",
      attribute: "split",
      supportedValues: ["whole", "split"],
      defaultValue: "whole",
      inherits: ["nutrition", "speciesEvidence"],
    });
    expect(lentilReview?.formAttributes?.materialProcessingBoundaries).toEqual(
      expect.arrayContaining(["dehulled", "soaked", "cooked", "sprouted", "fermented"]),
    );
  });

  it("records the five-item raw-bean batch with exact six-bird outcomes and historical coverage links", () => {
    const foodLedger = readJson("food-reviews.json") as {
      requiredBirdOrder: string[];
      ingredientReviews: Array<{
        ingredientId: string;
        form: string;
        speciesEvidence: Array<{ bird: string; outcome: string; sourceIds: string[]; evidenceScope: string }>;
        ownerPolicy?: { policySourceId: string; policyType: string; authority: string; rejectionNote: string };
      }>;
    };
    const coverageLedger = readJson("food-coverage.json") as {
      claimCoverage: Array<{
        historicalClaimId: string;
        trackedItems: Array<{ id: string; linkedFoodReviewKeys: string[] }>;
      }>;
    };
    const expected = [
      {
        trackedItemId: "lima-beans-raw",
        ingredientId: "lima_beans",
        form: "raw dried lima beans",
        outcomes: ["avoid", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation"],
      },
      {
        trackedItemId: "fava-beans-raw",
        ingredientId: "fava_beans",
        form: "raw dried fava beans",
        outcomes: ["avoid", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation", "limited"],
      },
      {
        trackedItemId: "black-beans-raw",
        ingredientId: "black_beans",
        form: "raw dried black beans",
        outcomes: ["avoid", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation", "unresolved"],
      },
      {
        trackedItemId: "pinto-beans-raw",
        ingredientId: "pinto_beans",
        form: "raw dried pinto beans",
        outcomes: ["avoid", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation"],
      },
      {
        trackedItemId: "navy-beans-raw",
        ingredientId: "navy_beans",
        form: "raw dried navy beans",
        outcomes: ["avoid", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation"],
      },
    ];
    const rawLegumeCoverage = coverageLedger.claimCoverage.find(
      (coverage) => coverage.historicalClaimId === "historical-raw-legume-rules",
    );

    for (const expectedReview of expected) {
      const review = foodLedger.ingredientReviews.find(
        (candidate) => candidate.ingredientId === expectedReview.ingredientId && candidate.form === expectedReview.form,
      );
      const trackedItem = rawLegumeCoverage?.trackedItems.find(
        (item) => item.id === expectedReview.trackedItemId,
      );

      expect(review?.speciesEvidence.map((entry) => entry.bird)).toEqual(foodLedger.requiredBirdOrder);
      expect(review?.speciesEvidence.map((entry) => entry.outcome)).toEqual(expectedReview.outcomes);
      expect(review?.speciesEvidence.every((entry) => entry.sourceIds.length > 0)).toBe(true);
      expect(review?.speciesEvidence[0]).toMatchObject({
        outcome: "avoid",
        evidenceScope: "owner_approved_policy",
      });
      expect(review?.speciesEvidence[0].sourceIds).toContain("issue-145-owner-pigeon-raw-bean-precaution-2026-08-20");
      expect(review?.ownerPolicy).toMatchObject({
        policySourceId: "issue-145-owner-pigeon-raw-bean-precaution-2026-08-20",
        policyType: "precautionary_avoid",
        authority: "product_owner",
      });
      expect(review?.ownerPolicy?.rejectionNote).toContain("documented compound concerns");
      expect(review?.ownerPolicy?.rejectionNote).toContain("safe pigeon use");
      if (expectedReview.ingredientId === "fava_beans") {
        expect(review?.speciesEvidence[0].sourceIds).toContain("dilks-1975-feral-pigeon-broad-beans");
      }
      expect(trackedItem?.linkedFoodReviewKeys).toEqual([
        `${expectedReview.ingredientId}::${expectedReview.form}`,
      ]);
    }
  });

  it("records each new food/form review with six birds and expected outcomes", () => {
    const ledger = readJson("food-reviews.json") as {
      requiredBirdOrder: string[];
      ingredientReviews: Array<{
        ingredientId: string;
        form: string;
        speciesEvidence: Array<{ bird: string; outcome: string }>;
      }>;
    };
    const expected = [
      {
        ingredientId: "wheat",
        form: "whole dry grain, threshed/hulled where applicable",
        outcomes: ["unresolved", "unresolved", "unresolved", "limited", "unresolved", "limited"],
      },
      {
        ingredientId: "millet",
        form: "whole dry seed",
        outcomes: ["unresolved", "unresolved", "unresolved", "limited", "limited", "unresolved"],
      },
      {
        ingredientId: "peas_green",
        form: "fresh green peas, lightly cooked",
        outcomes: ["unresolved", "unresolved", "unresolved", "limited", "limited", "unresolved"],
      },
      {
        ingredientId: "chickpeas",
        form: "cooked chickpeas, plain and unsalted",
        outcomes: ["unresolved", "unresolved", "unresolved", "unresolved", "limited", "limited"],
      },
    ];

    for (const expectedReview of expected) {
      const review = ledger.ingredientReviews.find(
        (candidate) =>
          candidate.ingredientId === expectedReview.ingredientId && candidate.form === expectedReview.form,
      );
      expect(review?.form).toBe(expectedReview.form);
      expect(review?.speciesEvidence.map((entry) => entry.bird)).toEqual(ledger.requiredBirdOrder);
      expect(review?.speciesEvidence.map((entry) => entry.outcome)).toEqual(expectedReview.outcomes);
    }
  });

  it("records commercially raised live earthworms as a distinct six-bird form with two-pass evidence", () => {
    const ledger = readJson("food-reviews.json") as {
      requiredBirdOrder: string[];
      ingredientReviews: Array<{
        ingredientId: string;
        form: string;
        speciesEvidence: Array<{ bird: string; outcome: string; sourceIds: string[]; firstPassSearch?: { queries: string[] }; followUpSearch?: { queries: string[]; sourceIds: string[]; result: string } }>;
      }>;
    };
    const review = ledger.ingredientReviews.find(
      (candidate) => candidate.ingredientId === "earthworms" && candidate.form === "commercially raised live earthworms (Eisenia fetida), clean, appropriately sized, and not wild-caught or compost-contaminated",
    );
    expect(review?.speciesEvidence.map((entry) => entry.bird)).toEqual(ledger.requiredBirdOrder);
    expect(review?.speciesEvidence.map((entry) => entry.outcome)).toEqual([
      "unresolved",
      "unresolved",
      "unresolved",
      "unresolved",
      "unresolved",
      "limited",
    ]);
    expect(review?.speciesEvidence.every((entry) => entry.sourceIds.length > 0)).toBe(true);
    expect(review?.speciesEvidence.every((entry) => Boolean(entry.firstPassSearch?.queries.length))).toBe(true);
    expect(review?.speciesEvidence.every((entry) => Boolean(entry.followUpSearch?.queries.length && entry.followUpSearch.sourceIds.length && entry.followUpSearch.result.length))).toBe(true);
    expect(ledger.ingredientReviews.some((candidate) => candidate.ingredientId === "mealworms" && candidate.form === "live yellow mealworm larvae")).toBe(true);
  });

  it("records Issue #160 seed and dried-herb forms with six explicit evidence outcomes", () => {
    const ledger = readJson("food-reviews.json") as {
      requiredBirdOrder: string[];
      ingredientReviews: Array<{
        ingredientId: string;
        form: string;
        speciesEvidence: Array<{ bird: string; outcome: string; sourceIds: string[] }>;
      }>;
    };
    const expected = [
      {
        ingredientId: "sunflower",
        form: "whole dry sunflower seed, plain, unsalted, and unflavoured",
        outcomes: ["limited", "limited", "limited", "limited", "unresolved", "limited"],
      },
      {
        ingredientId: "safflower",
        form: "whole dry safflower seed, plain, unsalted, and unflavoured",
        outcomes: ["limited", "limited", "limited", "limited", "unresolved", "limited"],
      },
      {
        ingredientId: "hemp",
        form: "whole dry hemp seed, plain, unsalted, and unflavoured",
        outcomes: ["limited", "unresolved", "unresolved", "limited", "unresolved", "limited"],
      },
      {
        ingredientId: "basil",
        form: "dried culinary basil leaf, plain and unsalted",
        outcomes: ["unresolved", "unresolved", "unresolved", "unresolved", "unresolved", "limited"],
      },
      {
        ingredientId: "oregano",
        form: "dried culinary oregano leaf, plain and unsalted",
        outcomes: ["unresolved", "unresolved", "unresolved", "unresolved", "unresolved", "limited"],
      },
    ];

    for (const expectedReview of expected) {
      const review = ledger.ingredientReviews.find(
        (candidate) => candidate.ingredientId === expectedReview.ingredientId && candidate.form === expectedReview.form,
      );
      expect(review?.speciesEvidence.map((entry) => entry.bird)).toEqual(ledger.requiredBirdOrder);
      expect(review?.speciesEvidence.map((entry) => entry.outcome)).toEqual(expectedReview.outcomes);
      expect(review?.speciesEvidence.every((entry) => entry.sourceIds.length > 0)).toBe(true);
    }
  });

  it("documents two targeted queries for every Issue #160 unresolved form outcome", () => {
    const ledger = readJson("food-reviews.json") as {
      ingredientReviews: Array<{
        ingredientId: string;
        form: string;
        speciesEvidence: Array<{
          outcome: string;
          followUpSearch?: { queries: string[]; sourceIds: string[]; result: string };
        }>;
      }>;
    };
    const forms = [
      ["sunflower", "whole dry sunflower seed, plain, unsalted, and unflavoured"],
      ["safflower", "whole dry safflower seed, plain, unsalted, and unflavoured"],
      ["hemp", "whole dry hemp seed, plain, unsalted, and unflavoured"],
      ["basil", "dried culinary basil leaf, plain and unsalted"],
      ["oregano", "dried culinary oregano leaf, plain and unsalted"],
    ] as const;

    for (const [ingredientId, form] of forms) {
      const review = ledger.ingredientReviews.find(
        (candidate) => candidate.ingredientId === ingredientId && candidate.form === form,
      );
      for (const evidence of review?.speciesEvidence.filter((entry) => entry.outcome === "unresolved") ?? []) {
        expect(evidence.followUpSearch?.queries.length).toBeGreaterThanOrEqual(2);
        expect(evidence.followUpSearch?.sourceIds.length).toBeGreaterThan(0);
        expect(evidence.followUpSearch?.result.length).toBeGreaterThan(0);
      }
    }
  });

  it("closes the final six-item historical core-compatibility backlog with exact-form reviews", () => {
    const foodLedger = readJson("food-reviews.json") as {
      requiredBirdOrder: string[];
      ingredientReviews: Array<{
        ingredientId: string;
        form: string;
        speciesEvidence: Array<{
          bird: string;
          outcome: string;
          sourceIds: string[];
          followUpSearch?: { queries: string[]; sourceIds: string[]; result: string };
        }>;
      }>;
    };
    const coverageLedger = readJson("food-coverage.json") as {
      claimCoverage: Array<{
        historicalClaimId: string;
        trackedItems: Array<{ id: string; linkedFoodReviewKeys: string[] }>;
      }>;
    };
    const expected = [
      {
        trackedItemId: "lentils",
        ingredientId: "lentils",
        form: "raw dried lentil seeds",
        outcomes: ["limited", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation", "limited"],
      },
      {
        trackedItemId: "peas",
        ingredientId: "garden_peas",
        form: "raw mature dried garden peas",
        outcomes: ["limited", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation", "limited"],
      },
      {
        trackedItemId: "mung-beans",
        ingredientId: "mung_beans",
        form: "raw dried mung beans",
        outcomes: ["limited", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation", "limited"],
      },
      {
        trackedItemId: "chickpeas",
        ingredientId: "chickpeas",
        form: "raw dried seeds",
        outcomes: ["unresolved", "requires_preparation", "requires_preparation", "requires_preparation", "requires_preparation", "limited"],
      },
      {
        trackedItemId: "thyme",
        ingredientId: "thyme",
        form: "dried culinary thyme leaf, plain and unsalted",
        outcomes: ["limited", "limited", "limited", "limited", "limited", "limited"],
      },
      {
        trackedItemId: "parsley",
        ingredientId: "parsley",
        form: "dried culinary parsley leaf, plain and unsalted",
        outcomes: ["unresolved", "unresolved", "unresolved", "unresolved", "limited", "limited"],
      },
    ];
    const coreCoverage = coverageLedger.claimCoverage.find(
      (coverage) => coverage.historicalClaimId === "historical-multibird-core-compatibility-list",
    );

    for (const expectedReview of expected) {
      const review = foodLedger.ingredientReviews.find(
        (candidate) => candidate.ingredientId === expectedReview.ingredientId && candidate.form === expectedReview.form,
      );
      const trackedItem = coreCoverage?.trackedItems.find((item) => item.id === expectedReview.trackedItemId);

      expect(review?.speciesEvidence.map((entry) => entry.bird)).toEqual(foodLedger.requiredBirdOrder);
      expect(review?.speciesEvidence.map((entry) => entry.outcome)).toEqual(expectedReview.outcomes);
      expect(review?.speciesEvidence.every((entry) => entry.sourceIds.length > 0)).toBe(true);
      expect(trackedItem?.linkedFoodReviewKeys).toEqual([`${expectedReview.ingredientId}::${expectedReview.form}`]);

      for (const evidence of review?.speciesEvidence.filter((entry) => entry.outcome === "unresolved") ?? []) {
        expect(evidence.followUpSearch?.queries.length).toBeGreaterThanOrEqual(2);
        expect(evidence.followUpSearch?.sourceIds.length).toBeGreaterThan(0);
        expect(evidence.followUpSearch?.result.length).toBeGreaterThan(0);
      }
    }
  });

  it("records the walnut form with six birds and evidence-only outcomes", () => {
    const ledger = readJson("food-reviews.json") as {
      requiredBirdOrder: string[];
      ingredientReviews: Array<{
        ingredientId: string;
        form: string;
        speciesEvidence: Array<{ bird: string; outcome: string; sourceIds: string[] }>;
      }>;
    };
    const review = ledger.ingredientReviews.find(
      (candidate) => candidate.ingredientId === "walnut" && candidate.form === "plain shelled walnut kernel, raw or dry-roasted, unsalted, unflavoured, fresh, and chopped to small-seed size",
    );
    expect(review?.speciesEvidence.map((entry) => entry.bird)).toEqual(ledger.requiredBirdOrder);
    expect(review?.speciesEvidence.map((entry) => entry.outcome)).toEqual([
      "unresolved",
      "limited",
      "limited",
      "unresolved",
      "unresolved",
      "unresolved",
    ]);
    expect(review?.speciesEvidence.every((entry) => entry.sourceIds.length > 0)).toBe(true);
  });
  it("records a documented second targeted search for every walnut bird/form pair", () => {
    const ledger = readJson("food-reviews.json") as {
      ingredientReviews: Array<{
        ingredientId: string;
        form: string;
        speciesEvidence: Array<{ bird: string; followUpSearch: { queries: string[]; sourceIds: string[]; result: string } }>;
      }>;
    };
    const review = ledger.ingredientReviews.find(
      (candidate) => candidate.ingredientId === "walnut" && candidate.form === "plain shelled walnut kernel, raw or dry-roasted, unsalted, unflavoured, fresh, and chopped to small-seed size",
    );
    expect(review?.speciesEvidence).toHaveLength(6);
    expect(review?.speciesEvidence.every((entry) => entry.followUpSearch.queries.length >= 2)).toBe(true);
    expect(review?.speciesEvidence.every((entry) => entry.followUpSearch.sourceIds.length > 0)).toBe(true);
    expect(review?.speciesEvidence.every((entry) => entry.followUpSearch.result.length > 0)).toBe(true);
  });
  it("records the approved insect forms with six birds and exact outcomes", () => {
    const ledger = readJson("food-reviews.json") as {
      requiredBirdOrder: string[];
      ingredientReviews: Array<{
        ingredientId: string;
        form: string;
        speciesEvidence: Array<{ bird: string; outcome: string; sourceIds: string[] }>;
      }>;
    };
    const expected = [
      {
        ingredientId: "mealworms",
        form: "live yellow mealworm larvae",
        outcomes: ["unresolved", "unresolved", "unresolved", "unresolved", "unresolved", "limited"],
      },
      {
        ingredientId: "mealworms",
        form: "dried mealworms",
        outcomes: ["unresolved", "unresolved", "unresolved", "unresolved", "limited", "unresolved"],
      },
      {
        ingredientId: "crickets",
        form: "live commercial crickets",
        outcomes: ["unresolved", "unresolved", "unresolved", "unresolved", "unresolved", "limited"],
      },
    ];

    for (const expectedReview of expected) {
      const review = ledger.ingredientReviews.find(
        (candidate) => candidate.ingredientId === expectedReview.ingredientId && candidate.form === expectedReview.form,
      );
      expect(review?.form).toBe(expectedReview.form);
      expect(review?.speciesEvidence.map((entry) => entry.bird)).toEqual(ledger.requiredBirdOrder);
      expect(review?.speciesEvidence.map((entry) => entry.outcome)).toEqual(expectedReview.outcomes);
      expect(review?.speciesEvidence.every((entry) => entry.sourceIds.length > 0)).toBe(true);
    }
  });

  it("records the sweet-almond form with six birds and explicit cyanide boundary", () => {
    const ledger = readJson("food-reviews.json") as {
      requiredBirdOrder: string[];
      ingredientReviews: Array<{
        ingredientId: string;
        form: string;
        speciesEvidence: Array<{ bird: string; outcome: string; sourceIds: string[] }>;
        processing: { rule: string; severity: string };
      }>;
    };
    const almond = ledger.ingredientReviews.find(
      (review) => review.ingredientId === "almond" && review.form === "plain food-grade sweet almond kernel, raw or dry-roasted, unseasoned and unsalted",
    );

    expect(almond?.speciesEvidence.map((entry) => entry.bird)).toEqual(ledger.requiredBirdOrder);
    expect(almond?.speciesEvidence.map((entry) => entry.outcome)).toEqual([
      "unresolved",
      "limited",
      "limited",
      "unresolved",
      "unresolved",
      "limited",
    ]);
    expect(almond?.speciesEvidence.every((entry) => entry.sourceIds.length > 0)).toBe(true);
    expect(almond?.processing.severity).toBe("warning");
    expect(almond?.processing.rule).toContain("Bitter almonds");
    expect(almond?.processing.rule).toContain("wild almonds");
  });

  it("records raw and plain dry-roasted cashew as separate six-bird forms", () => {
    const ledger = readJson("food-reviews.json") as {
      requiredBirdOrder: string[];
      ingredientReviews: Array<{
        ingredientId: string;
        form: string;
        speciesEvidence: Array<{ bird: string; outcome: string; sourceIds: string[] }>;
        processing: { rule: string; severity: string };
      }>;
    };
    const expected = [
      {
        form: "plain raw cashew kernel, unsalted, unflavoured, and shell-free",
        outcomes: ["limited", "limited", "unresolved", "unresolved", "unresolved", "unresolved"],
      },
      {
        form: "plain dry-roasted cashew kernel, unsalted, unflavoured, and shell-free",
        outcomes: ["unresolved", "limited", "unresolved", "unresolved", "unresolved", "unresolved"],
      },
    ];

    for (const expectedForm of expected) {
      const cashew = ledger.ingredientReviews.find(
        (review) => review.ingredientId === "cashew" && review.form === expectedForm.form,
      );
      expect(cashew?.speciesEvidence.map((entry) => entry.bird)).toEqual(ledger.requiredBirdOrder);
      expect(cashew?.speciesEvidence.map((entry) => entry.outcome)).toEqual(expectedForm.outcomes);
      expect(cashew?.speciesEvidence.every((entry) => entry.sourceIds.length > 0)).toBe(true);
      expect(cashew?.processing.severity).toBe("warning");
      expect(cashew?.processing.rule).toContain("oil-roasted");
      expect(cashew?.processing.rule).toContain("small-seed");
      expect(cashew?.speciesEvidence[5].rationale).toContain("reject meal");
    }
  });

  it("records fresh plain strawberry with six direct bird/form evidence outcomes and documented targeted follow-up", () => {
    const ledger = readJson("food-reviews.json") as {
      requiredBirdOrder: string[];
      ingredientReviews: Array<{
        ingredientId: string;
        form: string;
        speciesEvidence: Array<{
          bird: string;
          outcome: string;
          sourceIds: string[];
          followUpSearch: { queries: string[]; sourceIds: string[]; result: string };
        }>;
        processing: { rule: string; severity: string };
      }>;
    };
    const strawberry = ledger.ingredientReviews.find(
      (review) => review.ingredientId === "strawberry" && review.form === "fresh plain ripe strawberry flesh, washed, leafy cap removed, unflavoured and unsweetened",
    );

    expect(strawberry?.speciesEvidence.map((entry) => entry.bird)).toEqual(ledger.requiredBirdOrder);
    expect(strawberry?.speciesEvidence.map((entry) => entry.outcome)).toEqual([
      "limited",
      "limited",
      "limited",
      "limited",
      "limited",
      "limited",
    ]);
    expect(strawberry?.speciesEvidence.every((entry) => entry.sourceIds.length > 0)).toBe(true);
    expect(strawberry?.speciesEvidence.every((entry) => entry.followUpSearch.queries.length >= 2)).toBe(true);
    expect(strawberry?.speciesEvidence.every((entry) => entry.followUpSearch.sourceIds.length > 0)).toBe(true);
    expect(strawberry?.speciesEvidence.every((entry) => entry.followUpSearch.result.length > 0)).toBe(true);
    expect(strawberry?.speciesEvidence.find((entry) => entry.bird === "pigeon")?.sourceIds).toContain("ford-columbiformes-diet-2026");
    expect(strawberry?.speciesEvidence.find((entry) => entry.bird === "chicken")?.sourceIds).toContain("chewy-chicken-strawberry-2025");
    expect(strawberry?.processing.severity).toBe("warning");
    expect(strawberry?.processing.rule).toContain("frozen");
    expect(strawberry?.processing.rule).toContain("mouldy");
  });

  it("records second targeted searches for both cashew forms", () => {
    const ledger = readJson("food-reviews.json") as { ingredientReviews: Array<{ ingredientId: string; form: string; speciesEvidence: Array<{ followUpSearch: { queries: string[]; sourceIds: string[]; result: string } }> }> };
    const forms = ledger.ingredientReviews.filter((review) => review.ingredientId === "cashew");
    expect(forms).toHaveLength(2);
    expect(forms.every((review) => review.speciesEvidence.length === 6)).toBe(true);
    expect(forms.every((review) => review.speciesEvidence.every((entry) => entry.followUpSearch.queries.length >= 2 && entry.followUpSearch.sourceIds.length > 0 && entry.followUpSearch.result.length > 0))).toBe(true);
  });

  it("keeps fresh raspberry evidence six-bird, form-bound, and honest about pigeon uncertainty", () => {
    const ledger = readJson("food-reviews.json") as {
      requiredBirdOrder: string[];
      ingredientReviews: Array<{
        ingredientId: string;
        form: string;
        speciesEvidence: Array<{
          bird: string;
          outcome: string;
          sourceIds: string[];
          followUpSearch: { queries: string[]; sourceIds: string[]; result: string };
        }>;
        processing: { severity: string; rule: string };
      }>;
    };
    const raspberry = ledger.ingredientReviews.find((review) => review.ingredientId === "raspberry");

    expect(raspberry?.form).toBe("fresh, plain, ripe raspberry flesh, washed, unflavoured and unsweetened");
    expect(raspberry?.speciesEvidence.map((entry) => entry.bird)).toEqual(ledger.requiredBirdOrder);
    expect(raspberry?.speciesEvidence.map((entry) => entry.outcome)).toEqual([
      "unresolved",
      "limited",
      "limited",
      "limited",
      "limited",
      "limited",
    ]);
    expect(raspberry?.speciesEvidence.find((entry) => entry.bird === "pigeon")?.sourceIds).toContain("issue-173-raspberry-research-log-2026");
    expect(raspberry?.speciesEvidence.find((entry) => entry.bird === "budgie")?.sourceIds).toContain("vca-budgie-feeding");
    expect(raspberry?.speciesEvidence.find((entry) => entry.bird === "chicken")?.sourceIds).toContain("vetverified-chicken-fruit-2026");
    expect(raspberry?.speciesEvidence.every((entry) => entry.followUpSearch.queries.length >= 2)).toBe(true);
    expect(raspberry?.speciesEvidence.every((entry) => entry.followUpSearch.sourceIds.length > 0)).toBe(true);
    expect(raspberry?.processing.severity).toBe("warning");
    expect(raspberry?.processing.rule).toContain("freeze-dried");
    expect(raspberry?.processing.rule).toContain("mouldy");
  });

  it("keeps light, fresh-produce, and pigeon breeding-grit care claims source-backed and non-runtime", () => {
    const ledger = readJson("care-claims.json") as {
      careClaims: Array<{
        id: string;
        implementationStatus: string;
        speciesEvidence: Array<{ bird: string; outcome: string; sourceIds: string[] }>;
        proposedCopyBoundary: string;
      }>;
    };

    expect(ledger.careClaims.map((claim) => claim.id)).toEqual([
      "light-uvb-window-calcium",
      "pigeon-fresh-produce-variety",
      "pigeon-breeding-grit-shell-calcium",
    ]);
    for (const claim of ledger.careClaims) {
      expect(claim.implementationStatus).toBe("proposed_not_runtime");
      expect(claim.speciesEvidence.every((entry) => entry.sourceIds.length > 0)).toBe(true);
    }

    const pigeonGrit = ledger.careClaims.find((claim) => claim.id === "pigeon-breeding-grit-shell-calcium");
    expect(pigeonGrit?.speciesEvidence).toHaveLength(1);
    expect(pigeonGrit?.speciesEvidence[0]).toMatchObject({ bird: "pigeon", outcome: "limited" });
    expect(pigeonGrit?.speciesEvidence[0].sourceIds).toEqual(expect.arrayContaining([
      "zhu2025-tarim-pigeon-grit",
      "vca-pigeon-dove-feeding",
      "versele-neogrit-composition-2026",
      "yan2024-white-king-pigeon-photoperiod",
      "merck-pet-bird-reproduction-2026",
      "icwdm-pigeon-biology-2026",
    ]));
    expect(pigeonGrit?.proposedCopyBoundary).toContain("must not say that all redstone is insufficient");
    expect(pigeonGrit?.proposedCopyBoundary).toContain("claim that Pet/Companion pigeons are always breeding");
    expect(pigeonGrit?.proposedCopyBoundary).toContain("does not authorize a change to the existing voluntary-use grit guidance");
  });

  it("keeps protected and runtime profile configuration claims paired without deciding which range is scientifically correct", () => {
    const ledger = readJson("profile-claims.json") as {
      profileClaims: Array<{
        id: string;
        claimKind: string;
        comparedClaimId: string;
        reconciliationStatus: string;
      }>;
    };
    const claimsById = new Map(ledger.profileClaims.map((claim) => [claim.id, claim]));

    expect(ledger.profileClaims).toHaveLength(168);
    expect(ledger.profileClaims.filter((claim) => claim.claimKind === "protected_historical_configuration")).toHaveLength(84);
    expect(ledger.profileClaims.filter((claim) => claim.claimKind === "runtime_configuration_snapshot")).toHaveLength(84);

    for (const claim of ledger.profileClaims) {
      const counterpart = claimsById.get(claim.comparedClaimId);
      expect(counterpart).toBeDefined();
      expect(counterpart?.comparedClaimId).toBe(claim.id);
      expect(counterpart?.reconciliationStatus).toBe(claim.reconciliationStatus);
    }
  });
});
