import type { BirdType, SituationProfile } from "../lib/birds";
import type { SupportedLanguage } from "./index";

/** German and Dutch wording for a profile's name, feeding note and context note (#302, #274). English stays in birds.ts. */
export interface ProfileText {
  name: string;
  feedingNotes: string;
  contextNote?: string;
}

type ProfileTexts = Partial<Record<BirdType, Record<string, ProfileText>>>;

const DE_PROFILE_TEXT: ProfileTexts = {
  pigeon: {
    maintenance: {
      name: "Erhaltung/Ruhe",
      feedingNotes: "Füttere 30-40 g pro Vogel und Tag. Morgens leicht füttern, abends die Standardmischung.",
      contextNote: "Nutze diesen Bereich des Rechners nur als Mengenschätzung für eine Samen-/Getreidemischung. Passe die gesamte Fütterung mit einem Exoten-Tierarzt an Körperkondition und Aktivität an.",
    },
    racing: {
      name: "Rennen/Wettkampf",
      feedingNotes: "Füttere 40-50 g pro Vogel und Tag. Erhöhe die Menge 2 Wochen vor den Rennen. Sorge für zusätzliches Wasser.",
      contextNote: "Leistungstauben haben individuelle Energie- und Erholungsbedürfnisse. Nutze als Grundlage ein von einem Tierarzt oder Fachleuten geprüftes Leistungsfutter.",
    },
    breeding: {
      name: "Zucht",
      feedingNotes: "Füttere 35-45 g pro Vogel und Tag. Achte auf einen gleichmäßigen Fütterungsrhythmus.",
      contextNote: "Zuchttiere brauchen über diese Mengenschätzung hinaus eine individuell beurteilte Versorgung mit Mineralstoffen, Energie und Aminosäuren.",
    },
    molting: {
      name: "Mauserzeit",
      feedingNotes: "Füttere 40-50 g pro Vogel und Tag. Erhöhe den Eiweißanteil während des Federwechsels.",
      contextNote: "Die Unterstützung in der Mauser sollte sich an der Körperkondition und einer vollständigen Ernährung orientieren; diese Samen-/Getreideschätzung bewertet nicht, ob die Aminosäurenversorgung ausreicht.",
    },
    winter: {
      name: "Winterzeit",
      feedingNotes: "Füttere 40-50 g pro Vogel und Tag. Erhöhe den Fettanteil für die Körperwärme.",
      contextNote: "Der Futterbedarf bei Kälte hängt von Unterbringung, Wetter, Aktivität und Körperkondition ab. Erhöhe fettreiche Samen nicht ohne fachliche Beratung.",
    },
    pet: {
      name: "Heimtier/Begleiter",
      feedingNotes: "Füttere 25-35 g pro Vogel und Tag. Sorge für Abwechslung und Beschäftigung.",
      contextNote: "Halte Samen und Getreide als Teil einer breiteren, ausgewogenen Taubenernährung. Beobachte die Körperkondition und frage bei Änderungen der Fütterung einen Exoten-Tierarzt.",
    },
  },
  parrot: {
    pet: {
      name: "Heimtier/Begleiter",
      feedingNotes: "Füttere 30-50 g pro Vogel und Tag. Biete eine abwechslungsreiche Ernährung mit Frischfutter an.",
      contextNote: "Nutze ein Fertigfutter als Ernährungsgrundlage. Behandle diese Mischung als begrenzte Beschäftigung und nicht als tägliches Alleinfutter.",
    },
    breeding: {
      name: "Zucht",
      feedingNotes: "Füttere 40-60 g pro Vogel und Tag. Erhöhe Kalzium und Eiweiß während der Zucht.",
      contextNote: "Nutze diesen Rechner nicht, um Kalzium oder Zuchtzusätze festzulegen. Hole bei Zuchtvögeln den Rat eines Exoten-Tierarztes ein.",
    },
    molting: {
      name: "Mauserzeit",
      feedingNotes: "Füttere 40-60 g pro Vogel und Tag. Unterstütze das Federwachstum mit Eiweiß.",
      contextNote: "Halte während der Mauser eine artgerechte, vollständige Ernährung ein; diese Mischung kann Aminosäuren, Mineralstoffe oder Vitamine nicht beurteilen.",
    },
  },
  african_grey: {
    pet: {
      name: "Heimtier/Begleiter",
      feedingNotes: "Graupapageien neigen bei samenreicher Ernährung zu kalziumbedingten Ernährungsproblemen. Nutze ein Fertigfutter als Grundlage und den Rat eines Exoten-Tierarztes.",
    },
    breeding: {
      name: "Zucht",
      feedingNotes: "Zuchtfutter erfordert eine fachliche Beurteilung von Mineralstoffen und Nährstoffen; verlasse dich nicht auf diese Samen-/Getreideschätzung als Zuchtration.",
    },
    molting: {
      name: "Mauserzeit",
      feedingNotes: "Halte während der Mauser ein Fertigfutter als Grundlage bei und frage bei Problemen mit Federn oder Gesundheit einen Exoten-Tierarzt.",
    },
  },
  budgie: {
    pet: {
      name: "Heimtier/Begleiter",
      feedingNotes: "Füttere 10-15 g pro Vogel und Tag. Biete täglich frisches Gemüse an.",
      contextNote: "Nutze ein artgerechtes Fertigfutter als Grundlage. Halte diese Mischung begrenzt und biete je nach Bedarf abwechslungsreiches Frischfutter an.",
    },
    breeding: {
      name: "Zucht",
      feedingNotes: "Füttere 15-20 g pro Vogel und Tag. Erhöhe das Eiweiß während der Zuchtzeit.",
      contextNote: "Zuchtwellensittiche brauchen eine individuelle Beurteilung durch einen Exoten-Tierarzt; diese Mischung belegt keine ausreichende Versorgung mit Mineralstoffen oder Aminosäuren.",
    },
    molting: {
      name: "Mauserzeit",
      feedingNotes: "Füttere 15-20 g pro Vogel und Tag. Unterstütze die Federentwicklung.",
      contextNote: "Halte während der Mauser eine nährstoffmäßig vollständige Grundernährung ein. Dieser Rechner bewertet keine Aminosäuren oder Mikronährstoffe für die Federn.",
    },
  },
  canary: {
    pet: {
      name: "Heimtier/Begleiter",
      feedingNotes: "Füttere 8-12 g pro Vogel und Tag. Sorge für Abwechslung und Beschäftigung.",
      contextNote: "Nutze ein Fertigfutter oder angereichertes Futter als Grundlage. Behandle diese Mischung als begrenzte Beschäftigung, nicht als alleinige Ration.",
    },
    breeding: {
      name: "Zucht",
      feedingNotes: "Füttere 12-16 g pro Vogel und Tag. Erhöhe das Eiweiß während der Zucht.",
      contextNote: "Zuchtkanarien brauchen individuelle fachliche Beratung; diese Mischung belegt keine ausreichende Versorgung mit Ei-, Mineral- oder Aminosäurebausteinen.",
    },
    molting: {
      name: "Mauserzeit",
      feedingNotes: "Füttere 12-16 g pro Vogel und Tag. Unterstütze das Federwachstum.",
      contextNote: "Halte während der Mauser eine vollständige Grundernährung ein. Frage bei anhaltenden Problemen mit Federn oder Gesundheit einen Exoten-Tierarzt.",
    },
  },
  chicken: {
    pet: {
      name: "Heimtier/Begleiter",
      feedingNotes: "Füttere 100-150 g pro Vogel und Tag. Biete Grit und Austernschalen an.",
      contextNote: "Nutze ein altersgerechtes Alleinfutter für Hühner als Grundlage. Dieser Rechner schätzt eine Körnermischung als Ergänzung, keine tägliche Futtermenge.",
    },
    egg_laying: {
      name: "Legephase",
      feedingNotes: "Füttere 120-160 g pro Vogel und Tag. Sorge für ausreichend Kalzium für die Eierschalen.",
      contextNote: "Legehennen brauchen ein geprüftes vollständiges Legefutter. Diese Körnerschätzung bewertet weder Kalzium, Phosphor, Vitamine noch Energie.",
    },
    molting: {
      name: "Mauserzeit",
      feedingNotes: "Füttere 120-160 g pro Vogel und Tag. Unterstütze das Federwachstum.",
      contextNote: "Nutze während der Mauser ein vollständiges Hühnerfutter und frage einen Exoten-Tierarzt, bevor du Eiweiß- oder Zusatzstoffmengen änderst.",
    },
  },
};

const NL_PROFILE_TEXT: ProfileTexts = {
  pigeon: {
    maintenance: {
      name: "Onderhoud/Rust",
      feedingNotes: "Voer 30-40 g per vogel per dag. 's Ochtends licht voeren, 's avonds de standaardmix.",
      contextNote: "Gebruik dit bereik van de rekenmachine alleen als hoeveelheidsschatting voor een zaden-/granenmix. Pas het volledige rantsoen samen met een dierenarts voor exoten aan op lichaamsconditie en activiteit.",
    },
    racing: {
      name: "Wedstrijd/Competitie",
      feedingNotes: "Voer 40-50 g per vogel per dag. Verhoog de hoeveelheid 2 weken voor de wedstrijden. Zorg voor extra water.",
      contextNote: "Prestatiedieren hebben een eigen energie- en herstelbehoefte. Gebruik als basis een door een dierenarts of specialist beoordeeld prestatievoer.",
    },
    breeding: {
      name: "Fokken",
      feedingNotes: "Voer 35-45 g per vogel per dag. Houd een vast voerschema aan.",
      contextNote: "Fokvogels hebben naast deze hoeveelheidsschatting individueel beoordeelde ondersteuning nodig met mineralen, energie en aminozuren.",
    },
    molting: {
      name: "Ruiseizoen",
      feedingNotes: "Voer 40-50 g per vogel per dag. Verhoog het eiwit tijdens het verlies van veren.",
      contextNote: "Ondersteuning in de rui moet gebaseerd zijn op lichaamsconditie en een volledig rantsoen; deze zaden-/granenschatting beoordeelt niet of de aminozuurvoorziening voldoende is.",
    },
    winter: {
      name: "Wintertijd",
      feedingNotes: "Voer 40-50 g per vogel per dag. Verhoog het vetgehalte voor lichaamswarmte.",
      contextNote: "De voerbehoefte bij koud weer hangt af van huisvesting, weer, activiteit en lichaamsconditie. Verhoog vetrijke zaden niet zonder professioneel advies.",
    },
    pet: {
      name: "Huisdier/Gezelschap",
      feedingNotes: "Voer 25-35 g per vogel per dag. Zorg voor afwisseling en bezigheid.",
      contextNote: "Houd zaden en granen een onderdeel van een bredere, evenwichtige duivenvoeding. Let op de lichaamsconditie en raadpleeg een dierenarts voor exoten bij veranderingen in het voer.",
    },
  },
  parrot: {
    pet: {
      name: "Huisdier/Gezelschap",
      feedingNotes: "Voer 30-50 g per vogel per dag. Zorg voor gevarieerde voeding met vers voer.",
      contextNote: "Gebruik een samengesteld volledig voer als voedingsbasis. Zie deze mix als beperkte verrijking en niet als dagelijks volledig voer.",
    },
    breeding: {
      name: "Fokken",
      feedingNotes: "Voer 40-60 g per vogel per dag. Verhoog calcium en eiwit tijdens het fokken.",
      contextNote: "Gebruik deze rekenmachine niet om calcium of aanvullingen voor het fokken vast te stellen. Vraag bij fokvogels advies aan een dierenarts voor exoten.",
    },
    molting: {
      name: "Ruiseizoen",
      feedingNotes: "Voer 40-60 g per vogel per dag. Ondersteun de groei van veren met eiwit.",
      contextNote: "Houd tijdens de rui een soortgeschikt volledig rantsoen aan; deze mix kan aminozuren, mineralen of vitamines niet beoordelen.",
    },
  },
  african_grey: {
    pet: {
      name: "Huisdier/Gezelschap",
      feedingNotes: "Grijze roodstaartpapegaaien krijgen bij zaadrijke voeding sneller voedingsproblemen door calciumtekort. Gebruik een samengesteld basisvoer en het advies van een dierenarts voor exoten.",
    },
    breeding: {
      name: "Fokken",
      feedingNotes: "Fokvoeding vraagt om een professionele beoordeling van mineralen en voedingsstoffen; vertrouw niet op deze zaden-/granenschatting als fokrantsoen.",
    },
    molting: {
      name: "Ruiseizoen",
      feedingNotes: "Houd tijdens de rui een samengesteld basisvoer aan en raadpleeg een dierenarts voor exoten bij problemen met veren of gezondheid.",
    },
  },
  budgie: {
    pet: {
      name: "Huisdier/Gezelschap",
      feedingNotes: "Voer 10-15 g per vogel per dag. Geef dagelijks verse groenten.",
      contextNote: "Gebruik een soortgeschikt samengesteld voer als basis. Houd deze mix beperkt en geef zo nodig gevarieerd vers voer.",
    },
    breeding: {
      name: "Fokken",
      feedingNotes: "Voer 15-20 g per vogel per dag. Verhoog het eiwit in het fokseizoen.",
      contextNote: "Fokparkieten moeten individueel worden beoordeeld door een dierenarts voor exoten; deze mix toont niet aan dat mineralen of aminozuren voldoende zijn.",
    },
    molting: {
      name: "Ruiseizoen",
      feedingNotes: "Voer 15-20 g per vogel per dag. Ondersteun de ontwikkeling van veren.",
      contextNote: "Houd tijdens de rui een voedingsmatig volledige basisvoeding aan. Deze rekenmachine beoordeelt geen aminozuren of micronutriënten die de veren ondersteunen.",
    },
  },
  canary: {
    pet: {
      name: "Huisdier/Gezelschap",
      feedingNotes: "Voer 8-12 g per vogel per dag. Zorg voor afwisseling en bezigheid.",
      contextNote: "Gebruik een samengesteld of verrijkt voer als basis. Zie deze mix als beperkte verrijking, niet als enige ration.",
    },
    breeding: {
      name: "Fokken",
      feedingNotes: "Voer 12-16 g per vogel per dag. Verhoog het eiwit tijdens het fokken.",
      contextNote: "Fokkanaries hebben individuele professionele begeleiding nodig; deze mix toont niet aan dat ei-, mineralen- of aminozuurbehoeften gedekt zijn.",
    },
    molting: {
      name: "Ruiseizoen",
      feedingNotes: "Voer 12-16 g per vogel per dag. Ondersteun de groei van veren.",
      contextNote: "Houd tijdens de rui een volledig basisrantsoen aan. Raadpleeg een dierenarts voor exoten bij aanhoudende problemen met veren of gezondheid.",
    },
  },
  chicken: {
    pet: {
      name: "Huisdier/Gezelschap",
      feedingNotes: "Voer 100-150 g per vogel per dag. Zorg voor grit en oesterschelpen.",
      contextNote: "Gebruik een op de leeftijd afgestemd volledig kippenvoer als basis. Deze rekenmachine schat een aanvullende korrelmix, geen dagelijkse voerhoeveelheid.",
    },
    egg_laying: {
      name: "Legperiode",
      feedingNotes: "Voer 120-160 g per vogel per dag. Zorg voor voldoende calcium voor de eierschalen.",
      contextNote: "Leghennen hebben een gevalideerd volledig legvoer nodig. Deze korrelschatting beoordeelt calcium, fosfor, vitamines en energie niet.",
    },
    molting: {
      name: "Ruiseizoen",
      feedingNotes: "Voer 120-160 g per vogel per dag. Ondersteun de groei van veren.",
      contextNote: "Gebruik tijdens de rui een volledig kippenvoer en vraag advies aan een dierenarts voor exoten voordat je eiwit- of supplementniveaus wijzigt.",
    },
  },
};

const PROFILE_TEXT: Partial<Record<SupportedLanguage, ProfileTexts>> = { de: DE_PROFILE_TEXT, nl: NL_PROFILE_TEXT };

/** Localized name, feeding note and context note for a profile; English (and any gap) falls back to the profile itself. */
export function getProfileText(bird: BirdType, situation: string, profile: SituationProfile, language: SupportedLanguage): ProfileText {
  const translated = PROFILE_TEXT[language]?.[bird]?.[situation];
  return {
    name: translated?.name ?? profile.name,
    feedingNotes: translated?.feedingNotes ?? profile.feedingNotes,
    contextNote: translated ? translated.contextNote : profile.contextNote,
  };
}

export { DE_PROFILE_TEXT, NL_PROFILE_TEXT };
