  return SAFE_RAW_LEGUMES.has(ingredientName);
}

// Check if a grain needs pairing
export function grainNeedsPairing(grainName: string): boolean {
  return GRAINS_NEEDING_PAIRING.has(grainName);
}

// Get recommended pairings for a grain
export function getGrainPairings(grainName: string): string[] {
  return GRAIN_PAIRINGS[grainName] || [];
}

// Get preparation instructions for an ingredient
export function getPreparationInstructions(ingredientName: string): IngredientPrep | null {
  return INGREDIENT_PREP[ingredientName] || null;
}
