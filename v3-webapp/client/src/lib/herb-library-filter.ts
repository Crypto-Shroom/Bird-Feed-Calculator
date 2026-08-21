import type { Herb } from "@/lib/data";
import { isHerbEligibleForBird, type HerbBirdKey } from "@/lib/herb-evidence";

export type HerbLibraryBirdFilter = "all" | HerbBirdKey;
export type HerbLibraryEntry = [string, Herb];

export const HERB_LIBRARY_BIRD_FILTERS = [
  "pigeon",
  "parrot",
  "african_grey",
  "budgie",
  "canary",
  "chicken",
] as const satisfies readonly HerbBirdKey[];

/**
 * Keeps the default library browse view intact while deriving a selected-bird
 * view exclusively from the canonical automatic-suggestion eligibility record.
 */
export function filterHerbLibraryEntries(
  entries: readonly HerbLibraryEntry[],
  bird: HerbLibraryBirdFilter,
): HerbLibraryEntry[] {
  if (bird === "all") {
    return [...entries];
  }

  return entries.filter(([name]) => isHerbEligibleForBird(name, bird));
}
