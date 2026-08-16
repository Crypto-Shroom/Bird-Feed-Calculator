import type { MixResult } from "@/lib/calculator-multi-bird";

export type FormulaSource = "profile-default" | "inventory";

export function resolveDisplayedFormula(
  inventory: Record<string, number>,
  profileDefaultResult: MixResult,
  inventoryResult: MixResult | null,
): { result: MixResult; source: FormulaSource } {
  if (Object.keys(inventory).length === 0 || !inventoryResult) {
    return { result: profileDefaultResult, source: "profile-default" };
  }

  return { result: inventoryResult, source: "inventory" };
}
