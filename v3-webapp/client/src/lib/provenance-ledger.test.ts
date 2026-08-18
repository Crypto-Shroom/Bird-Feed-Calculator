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
      const review = ledger.ingredientReviews.find((candidate) => candidate.ingredientId === expectedReview.ingredientId);
      expect(review?.form).toBe(expectedReview.form);
      expect(review?.speciesEvidence.map((entry) => entry.bird)).toEqual(ledger.requiredBirdOrder);
      expect(review?.speciesEvidence.map((entry) => entry.outcome)).toEqual(expectedReview.outcomes);
    }
  });

  it("keeps light and fresh-produce care claims source-backed and non-runtime", () => {
    const ledger = readJson("care-claims.json") as {
      careClaims: Array<{
        id: string;
        implementationStatus: string;
        speciesEvidence: Array<{ sourceIds: string[] }>;
      }>;
    };

    expect(ledger.careClaims.map((claim) => claim.id)).toEqual([
      "light-uvb-window-calcium",
      "pigeon-fresh-produce-variety",
    ]);
    for (const claim of ledger.careClaims) {
      expect(claim.implementationStatus).toBe("proposed_not_runtime");
      expect(claim.speciesEvidence.every((entry) => entry.sourceIds.length > 0)).toBe(true);
    }
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
