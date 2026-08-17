import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { BIRD_CARE } from "../client/src/lib/birds.ts";

assert.equal(BIRD_CARE.pigeon.baseDiet, "Use a balanced pigeon diet with fresh produce.");
assert.equal(BIRD_CARE.pigeon.baseDiet.includes("exotics vet"), false);
assert.equal(
  BIRD_CARE.pigeon.gritBySituation?.breeding,
  "During breeding, include suitable shell grit as a calcium source.",
);

assert.equal(BIRD_CARE.parrot.baseDiet.includes("fresh vegetables and fruit"), true);
assert.equal(BIRD_CARE.african_grey.baseDiet.includes("fresh vegetables and fruit"), true);
assert.equal(BIRD_CARE.budgie.baseDiet.includes("fresh vegetables, fruit"), true);
assert.equal(BIRD_CARE.canary.baseDiet.includes("fresh vegetables, fruit"), true);
assert.equal(BIRD_CARE.chicken.baseDiet.includes("insects as occasional enrichment"), true);

const homeSource = readFileSync(resolve(import.meta.dirname, "../client/src/pages/Home.tsx"), "utf8");
assert.match(homeSource, /const gritText = care\.gritBySituation\?\.\[situation\]/);
assert.match(homeSource, /title="Grit" text=\{gritText\}/);

console.log("Care guidance checks passed.");
