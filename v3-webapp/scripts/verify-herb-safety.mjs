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
  }
}

for (const allium of ["garlic_powder", "garlic_oil"]) {
  if (HERB_EVIDENCE[allium]?.eligibility !== "eligible") {
    throw new Error(`${allium} must remain eligible for the approved pigeon formulation`);
  }
  if (!isHerbEligibleForBird(allium, "pigeon")) {
    throw new Error(`${allium} must be eligible for pigeons`);
  }
  for (const bird of BIRD_TYPES.filter((bird) => bird !== "pigeon")) {
    if (isHerbEligibleForBird(allium, bird)) {
      throw new Error(`${allium} must not be eligible outside the approved pigeon formulation`);
    }
  }
}

const pigeonMaintenance = getEligibleHerbNames(HERB_RECOMMENDATIONS.maintenance.recommended, "pigeon");
const pigeonRacing = getEligibleHerbNames(HERB_RECOMMENDATIONS.racing.recommended, "pigeon");
const pigeonPet = getEligibleHerbNames(HERB_RECOMMENDATIONS.pet.recommended, "pigeon");
if (!pigeonMaintenance.includes("garlic_powder")) {
  throw new Error("pigeon maintenance must retain garlic powder");
}
if (!pigeonRacing.includes("garlic_oil")) {
  throw new Error("pigeon racing must retain garlic oil");
}
if (!pigeonPet.includes("garlic_oil")) {
  throw new Error("pigeon Pet/Companion must retain garlic oil as an occasional option");
}
for (const bird of BIRD_TYPES.filter((bird) => bird !== "pigeon")) {
  const nonPigeonPet = getEligibleHerbNames(HERB_RECOMMENDATIONS.pet.recommended, bird);
  if (nonPigeonPet.includes("garlic_oil")) {
    throw new Error(`Pet/Companion must not automatically suggest garlic oil for ${bird}`);
  }
}

console.log(`Verified evidence and automatic-suggestion safety for ${Object.keys(HERBS_SUPPLEMENTS).length} herb and supplement records across ${BIRD_TYPES.length} bird types.`);
