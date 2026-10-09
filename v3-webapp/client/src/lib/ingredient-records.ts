// The canonical ingredient database lives at repository root in database/ingredient-records.mts.
// This app adapter exists to provide a stable import path for V3 UI and test consumers.
export { INGREDIENTS } from "../../../../database/ingredient-records.mts";
export type { Ingredient } from "../../../../database/ingredient-records.mts";
