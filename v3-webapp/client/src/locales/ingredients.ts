import type { SupportedLanguage } from "./index";

// Display names for the ingredient ids in database/ingredient-records.mts. The English ids stay as they are
// (protected data); this layer only decides what a visitor reads. English keeps the id with spaces.
// `kaffir_corn` is the same cereal as `sorghum` (identical values), so both read "Sorghum" (owner decision, #313).
const DE: Record<string, string> = {
  wheat: "Weizen", wheat_hard_red: "Weizen (hart, rot)", wheat_soft_red: "Weizen (weich, rot)",
  corn_yellow: "Gelber Mais", corn_white: "Weißer Mais", corn_red: "Roter Mais", maize: "Mais", popcorn: "Popcorn-Mais",
  barley: "Gerste", barley_pearled: "Perlgerste", oats: "Hafer", oat_groats: "Haferkerne",
  milo: "Milo", sorghum: "Sorghum", kaffir_corn: "Sorghum",
  rice: "Reis", rice_brown: "Naturreis", rice_red: "Roter Reis",
  rye: "Roggen", triticale: "Triticale", spelt: "Dinkel", buckwheat: "Buchweizen",
  peas: "Erbsen", peas_field: "Felderbsen", peas_canada: "Kanadische Erbsen", peas_austrian: "Österreichische Wintererbsen",
  peas_green: "Grüne Erbsen", peas_maple: "Maple-Erbsen", peas_yellow: "Gelbe Erbsen", split_peas: "Spalterbsen",
  lentils: "Linsen", lentils_red: "Rote Linsen", lentils_green: "Grüne Linsen", lentils_brown: "Braune Linsen", split_lentils: "Halbierte Linsen",
  beans: "Bohnen", mung_beans: "Mungbohnen", black_eyed_peas: "Augenbohnen", chickpeas: "Kichererbsen",
  fava_beans: "Dicke Bohnen (Favabohnen)", navy_beans: "Weiße Bohnen (Navy Beans)", kidney_beans: "Kidneybohnen",
  pinto_beans: "Pintobohnen", adzuki_beans: "Adzukibohnen", lima_beans: "Limabohnen", black_beans: "Schwarze Bohnen",
  vetch: "Wicken", lupins: "Lupinen", soybeans: "Sojabohnen",
  safflower: "Saflor", sunflower: "Sonnenblumenkerne", sunflower_hearts: "Sonnenblumenkerne (geschält)",
  linseed: "Leinsamen", flaxseed: "Flachssamen", hemp: "Hanfsamen", hemp_hearts: "Hanfsamen (geschält)",
  millet: "Hirse", millet_white: "Weiße Hirse", millet_red: "Rote Hirse", millet_silver: "Silberhirse", canary_seed: "Kanariensaat",
  canola: "Canola", rapeseed: "Rapssamen", niger: "Nigersaat", nyjer: "Nyjer-Saat", sesame: "Sesam", chia: "Chiasamen",
  pumpkin_seeds: "Kürbiskerne", pepitas: "Pepitas (Kürbiskerne)",
  peanuts: "Erdnüsse", peanuts_raw: "Rohe Erdnüsse", peanuts_roasted: "Geröstete Erdnüsse", almonds: "Mandeln", pine_nuts: "Pinienkerne",
};

const NL: Record<string, string> = {
  wheat: "Tarwe", wheat_hard_red: "Tarwe (hard, rood)", wheat_soft_red: "Tarwe (zacht, rood)",
  corn_yellow: "Gele maïs", corn_white: "Witte maïs", corn_red: "Rode maïs", maize: "Maïs", popcorn: "Popcornmaïs",
  barley: "Gerst", barley_pearled: "Parelgerst", oats: "Haver", oat_groats: "Haverkernen",
  milo: "Milo", sorghum: "Sorghum", kaffir_corn: "Sorghum",
  rice: "Rijst", rice_brown: "Bruine rijst", rice_red: "Rode rijst",
  rye: "Rogge", triticale: "Triticale", spelt: "Spelt", buckwheat: "Boekweit",
  peas: "Erwten", peas_field: "Voedererwten", peas_canada: "Canadese erwten", peas_austrian: "Oostenrijkse wintererwten",
  peas_green: "Groene erwten", peas_maple: "Maple-erwten", peas_yellow: "Gele erwten", split_peas: "Spliterwten",
  lentils: "Linzen", lentils_red: "Rode linzen", lentils_green: "Groene linzen", lentils_brown: "Bruine linzen", split_lentils: "Gesplitste linzen",
  beans: "Bonen", mung_beans: "Mungbonen", black_eyed_peas: "Zwarte-ogenbonen (black-eyed peas)", chickpeas: "Kikkererwten",
  fava_beans: "Tuinbonen (fava)", navy_beans: "Witte bonen (navy beans)", kidney_beans: "Kidneybonen",
  pinto_beans: "Pintobonen", adzuki_beans: "Adzukibonen", lima_beans: "Limabonen", black_beans: "Zwarte bonen",
  vetch: "Wikke", lupins: "Lupine", soybeans: "Sojabonen",
  safflower: "Saffloerzaad", sunflower: "Zonnebloempitten", sunflower_hearts: "Zonnebloempitten (gepeld)",
  linseed: "Lijnzaad", flaxseed: "Vlaszaad", hemp: "Hennepzaad", hemp_hearts: "Hennepzaad (gepeld)",
  millet: "Gierst", millet_white: "Witte gierst", millet_red: "Rode gierst", millet_silver: "Zilvergierst", canary_seed: "Kanariezaad",
  canola: "Canola", rapeseed: "Koolzaad", niger: "Nigerzaad", nyjer: "Nyjerzaad", sesame: "Sesamzaad", chia: "Chiazaad",
  pumpkin_seeds: "Pompoenpitten", pepitas: "Pepitas (pompoenpitten)",
  peanuts: "Pinda's", peanuts_raw: "Rauwe pinda's", peanuts_roasted: "Geroosterde pinda's", almonds: "Amandelen", pine_nuts: "Pijnboompitten",
};

export const INGREDIENT_NAMES: Record<Exclude<SupportedLanguage, "en">, Record<string, string>> = { de: DE, nl: NL };

/** The name shown to the visitor. English returns the id with spaces (shown with CSS capitalize, as before). */
export function getIngredientName(id: string, language: SupportedLanguage): string {
  if (language !== "en") {
    const translated = INGREDIENT_NAMES[language][id];
    if (translated) return translated;
  }
  return id.replace(/_/g, " ");
}
