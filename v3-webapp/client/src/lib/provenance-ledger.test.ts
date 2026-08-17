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
});
