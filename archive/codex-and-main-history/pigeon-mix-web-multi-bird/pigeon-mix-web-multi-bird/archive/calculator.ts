
export interface MixResult {
  mix: Record<string, number>;
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };