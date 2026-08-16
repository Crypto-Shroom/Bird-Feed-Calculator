import { BIRD_TYPES } from "../client/src/lib/birds.ts";
import { HERB_RECOMMENDATIONS, HERBS_SUPPLEMENTS } from "../client/src/lib/data.ts";
import { HERB_EVIDENCE, getEligibleHerbNames, isHerbEligibleForBird } from "../client/src/lib/herb-evidence.ts";

for (const [name, herb] of Object.entries(HERBS_SUPPLEMENTS)) {
  if (!HERB_EVIDENCE[name]) {
    throw new Error(`${name} has no herb evidence record`);
  }
  if (HERB_EVIDENCE[name].eligibility === "eligible" && HERB_EVIDENCE[name].sourceIds.length === 0) {
    throw new Error(`${name} is eligible for automatic suggestions without an academic source link`);
  }
}

for (const [profile, recommendation] of Object.entries(HERB_RECOMMENDATIONS)) {
  for (const bird of BIRD_TYPES) {
    const automaticNames = getEligibleHerbNames(recommendation.recommended, bird);
    for (const name of automaticNames) {
      if (!isHerbEligibleForBird(name, bird)) {
        throw new Error(`${profile} would automatically suggest ${name} for ${bird} despite its evidence or safety status`);
      }
    }
    for (const allium of ["garlic_powder", "garlic_oil"]) {
      if (automaticNames.includes(allium)) {
        throw new Error(`${profile} would automatically suggest ${allium} for ${bird}`);
      }
    }
  }
}

for (const allium of ["garlic_powder", "garlic_oil"]) {
  if (HERB_EVIDENCE[allium]?.eligibility !== "do_not_suggest") {
    throw new Error(`${allium} must remain excluded from automatic herb suggestions`);
  }
  for (const bird of BIRD_TYPES) {
    if (isHerbEligibleForBird(allium, bird)) {
      throw new Error(`${allium} must not be eligible for ${bird}`);
    }
  }
}

console.log(`Verified evidence and automatic-suggestion safety for ${Object.keys(HERBS_SUPPLEMENTS).length} herb and supplement records across ${BIRD_TYPES.length} bird types.`);
