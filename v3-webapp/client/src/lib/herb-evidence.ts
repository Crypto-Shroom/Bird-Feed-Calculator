// The canonical, human-reviewable evidence and compatibility database lives at
// repository root in database/herb-provenance.mts. This app adapter exists only
// to provide a stable import path for V3 UI and test consumers.
export {
  HERB_EVIDENCE,
  HERB_SOURCES,
  getEligibleHerbNames,
  getHerbEvidence,
  isHerbEligibleForBird,
} from "../../../../database/herb-provenance.mts";
export type {
  HerbBirdKey,
  HerbEligibility,
  HerbEvidence,
  HerbSource,
} from "../../../../database/herb-provenance.mts";
