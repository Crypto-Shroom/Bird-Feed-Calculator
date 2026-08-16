// Design contract: starter inventory is a profile-aware availability example, not a nutritional formulation or feeding recommendation.
import type { BirdType } from "@/lib/birds";

type Inventory = Record<string, number>;

const pigeon: Record<string, Inventory> = {
  pet: { wheat: 5000, corn_yellow: 3000, peas: 2000, lentils: 1000, safflower: 500, barley: 2000 },
  maintenance: { wheat: 5000, barley: 3000, corn_yellow: 2000, peas: 1500, safflower: 300 },
  racing: { wheat: 4000, corn_yellow: 4000, peas: 2000, barley: 1000, safflower: 750 },
  breeding: { wheat: 4000, corn_yellow: 2000, peas: 3000, lentils: 2000, barley: 1000, safflower: 500 },
  molting: { wheat: 3500, corn_yellow: 2000, peas: 3000, lentils: 2500, barley: 1000, safflower: 600 },
  winter: { wheat: 3000, corn_yellow: 4000, barley: 2000, peas: 1500, safflower: 850 },
};

const parrot: Record<string, Inventory> = {
  pet: { wheat: 2000, oats: 1500, corn_yellow: 1500, peas: 1000, safflower: 300 },
  breeding: { wheat: 2000, oats: 1500, peas: 2000, lentils: 1000, safflower: 400 },
  molting: { wheat: 1800, oats: 1500, peas: 2000, lentils: 1500, safflower: 350 },
};

const africanGrey: Record<string, Inventory> = {
  pet: { wheat: 1800, oats: 1500, corn_yellow: 1200, peas: 1000, safflower: 250 },
  breeding: { wheat: 1800, oats: 1500, peas: 1800, lentils: 1200, safflower: 350 },
  molting: { wheat: 1600, oats: 1400, peas: 1800, lentils: 1400, safflower: 300 },
};

const budgie: Record<string, Inventory> = {
  pet: { millet: 2500, oats: 1200, wheat: 1000, canola: 250, safflower: 200 },
  breeding: { millet: 2200, oats: 1200, wheat: 1000, peas: 700, canola: 300, safflower: 250 },
  molting: { millet: 2000, oats: 1400, wheat: 1000, peas: 1000, lentils: 600, canola: 250 },
};

const canary: Record<string, Inventory> = {
  pet: { millet: 2500, oats: 1200, wheat: 1000, canola: 300, safflower: 200 },
  breeding: { millet: 2200, oats: 1200, wheat: 1000, peas: 700, canola: 350, safflower: 250 },
  molting: { millet: 2100, oats: 1400, wheat: 1000, peas: 900, lentils: 600, canola: 300 },
};

const chicken: Record<string, Inventory> = {
  pet: { corn_yellow: 4000, wheat: 3000, barley: 2000, oats: 1000, peas: 1000 },
  egg_laying: { corn_yellow: 3500, wheat: 2500, barley: 1500, oats: 1000, peas: 2000, lentils: 1000 },
  molting: { corn_yellow: 3000, wheat: 2500, barley: 1500, oats: 1000, peas: 2200, lentils: 1200 },
};

const PRESETS: Record<BirdType, Record<string, Inventory>> = {
  pigeon,
  parrot,
  african_grey: africanGrey,
  budgie,
  canary,
  chicken,
};

export function getStarterInventory(bird: BirdType, situation: string): Inventory {
  const preset = PRESETS[bird][situation] || PRESETS[bird].pet || Object.values(PRESETS[bird])[0];
  return { ...preset };
}
