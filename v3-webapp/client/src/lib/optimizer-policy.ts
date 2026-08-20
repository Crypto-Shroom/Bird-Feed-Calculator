export const OPTIMIZER_POLICY = {
  gramIncrement: 1,
  meaningfulInclusionGrams: 5,
  exactMarginTolerance: 0,
  macroDistanceTolerance: 0,
  categoryDistanceTolerance: 0,
  maximumShareToleranceGrams: 0,
  canonicalCandidateOrder: "ingredient_id_ascending",
} as const;

export type OptimizerPolicy = typeof OPTIMIZER_POLICY;
