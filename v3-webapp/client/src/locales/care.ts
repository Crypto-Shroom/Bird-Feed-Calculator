import type { BirdType, BirdCareGuidance } from "../lib/birds";
import { BIRD_CARE } from "../lib/birds";
import type { SupportedLanguage } from "./index";

const DE_BIRD_CARE: Record<BirdType, BirdCareGuidance> = {
  pigeon: {
    scope: "Eine Mengenschätzung für eine Taubensamen- und Getreidemischung; sie bewertet keine Vitamine, Mineralstoffe, Aminosäuren oder Energiedichte.",
    baseDiet: "Nutze eine ausgewogene Taubennahrung mit Frischfutter.",
    water: "Sorge dafür, dass jederzeit sauberes, frisches Wasser zur Verfügung steht.",
    grit: "Tauben brauchen Magenkiesel (Grit), um Samen und Getreide richtig zu verdauen.",
    gritBySituation: {
      breeding: "Biete während der Zucht geeigneten Muschelgrit als Kalziumquelle an.",
    },
    light: "Sorge bei Wohnungsvögeln für sicheres natürliches Tageslicht oder ein artgerechtes vogelspezifisches UVB-System mit einem schattigen Rückzugsort.",
    freshProduce: "Biete eine Vielfalt an gewaschenem, fein gehacktem Blattgemüse und Gemüse wie Karotte in einem separaten Napf an. Füge kleinere Obstportionen wie Apfel hinzu und entferne Reste zügig; halte Frischfutter getrennt von der Trockenmischung.",
    freshProduceGuidance: {
      triggerLabel: "Geeignetes frisches Gemüse und Obst anzeigen",
      heading: "Geeignetes frisches Gemüse und Obst für Tauben",
      introduction: "Biete frisches, gewaschenes, fein gehacktes oder geraspeltes Gemüse und kleine Obststücke in einem separaten Napf an.",
      vegetables: "Gemüse: Karotte, Brokkoli, Blumenkohl, Paprika, Löwenzahn und Blattgemüse wie Grünkohl, Römersalat oder Blattkohl.",
      fruits: "Kleine Obstportionen: Apfelfleisch ohne Kerngehäuse und Kerne sowie Beeren.",
      safety: "Biete keine Avocado, Zwiebel oder Rhabarber an. Entferne Reste zügig.",
      sourcesTriggerLabel: "Quellen für diese Empfehlungen",
      sourcesHeading: "Quellen für Empfehlungen zu frischem Gemüse und Obst",
      sources: BIRD_CARE.pigeon.freshProduceGuidance!.sources,
    },
  },
  parrot: {
    scope: "Eine Samen- und Getreidemischung zur Beschäftigung, keine vollständige Nahrung für Papageien.",
    baseDiet: "Nutze ein artgerechtes Pelletfutter als nährstoffhaltige Basis, mit frischem Gemüse und Obst sowie nur wenigen Samen oder Nüssen.",
    water: "Sorge dafür, dass jederzeit sauberes, frisches Wasser zur Verfügung steht.",
    grit: "Gib Papageien nicht routinemäßig Magenkiesel (Grit), außer ein Exoten-Tierarzt empfiehlt es ausdrücklich.",
    light: "Sorge bei Wohnungsvögeln für sicheres natürliches Tageslicht oder ein artgerechtes vogelspezifisches UVB-System mit einem schattigen Rückzugsort.",
  },
  african_grey: {
    scope: "Eine Samen- und Getreidemischung zur Beschäftigung, keine vollständige Nahrung für Graupapageien.",
    baseDiet: "Nutze ein artgerechtes Pelletfutter als nährstoffhaltige Basis, mit frischem Gemüse und Obst. Graupapageien benötigen bei Fragen zu Kalzium und Vitamin D die Beratung durch einen Exoten-Tierarzt.",
    water: "Sorge dafür, dass jederzeit sauberes, frisches Wasser zur Verfügung steht.",
    grit: "Gib nicht routinemäßig Magenkiesel (Grit), außer ein Exoten-Tierarzt empfiehlt es ausdrücklich.",
    light: "Sorge bei Wohnungsvögeln für sicheres natürliches Tageslicht oder ein artgerechtes vogelspezifisches UVB-System mit einem schattigen Rückzugsort.",
  },
  budgie: {
    scope: "Eine Samen- und Getreidemischung zur Beschäftigung, keine vollständige Nahrung für Wellensittiche.",
    baseDiet: "Nutze ein artgerechtes Pelletfutter als nährstoffhaltige Basis, zusammen mit frischem Gemüse, Obst und einer begrenzten Menge Samen.",
    water: "Sorge dafür, dass jederzeit sauberes, frisches Wasser zur Verfügung steht.",
    grit: "Gib nicht routinemäßig Magenkiesel (Grit), außer ein Exoten-Tierarzt empfiehlt es ausdrücklich.",
    light: "Sorge bei Wohnungsvögeln für sicheres natürliches Tageslicht oder ein artgerechtes vogelspezifisches UVB-System mit einem schattigen Rückzugsort.",
  },
  canary: {
    scope: "Eine Samen- und Getreidemischung zur Beschäftigung, keine vollständige Nahrung für Kanarienvögel.",
    baseDiet: "Nutze ein artgerechtes Pellet- oder angereichertes Futter als nährstoffhaltige Basis, mit frischem Gemüse, Obst und einer begrenzten Menge Samen.",
    water: "Sorge dafür, dass jederzeit sauberes, frisches Wasser zur Verfügung steht.",
    grit: "Gib nicht routinemäßig Magenkiesel (Grit), außer ein Exoten-Tierarzt empfiehlt es ausdrücklich.",
    light: "Sorge bei Wohnungsvögeln für sicheres natürliches Tageslicht oder ein artgerechtes vogelspezifisches UVB-System mit einem schattigen Rückzugsort.",
  },
  chicken: {
    scope: "Eine Ergänzungsmischung aus Körnerfutter, keine vollständige Geflügelration. Halte Körnerfutter und andere Leckerlis auf einem kleinen Anteil der täglichen Futteraufnahme.",
    baseDiet: "Nutze ein alters- und leistungsgerechtes Alleinfutter für Geflügel als nährstoffhaltige Basis, mit Insekten als gelegentliche Beschäftigung. Legehennen benötigen ein geprüftes Legemehl oder Legefutter.",
    water: "Stelle kontinuierlich sauberes, frisches Wasser bereit; der Wasserzugang beeinflusst die Futteraufnahme und Eierproduktion stark.",
    grit: "Biete unlöslichen Magenkiesel (Grit) nur an, wenn ganze Körner oder Samen gefüttert werden und die Vögel keinen geeigneten Grit vom Boden aufnehmen können. Muschelschalen sind kein Ersatz für Magenkiesel.",
    light: "Sorge bei Wohnungsvögeln für sicheres natürliches Tageslicht oder ein artgerechtes vogelspezifisches UVB-System mit einem schattigen Rückzugsort.",
  },
};

const NL_BIRD_CARE: Record<BirdType, BirdCareGuidance> = {
  pigeon: {
    scope: "Een batchschatting voor een zaden- en graanmengsel voor duiven; het beoordeelt geen vitamines, mineralen, aminozuren of energiedichtheid.",
    baseDiet: "Gebruik een gebalanceerde duivenvoeding met verse groenten en fruit.",
    water: "Zorg altijd voor schoon, vers water dat te allen tijde beschikbaar is.",
    grit: "Duiven hebben maagkiezel (grit) nodig om zaden en granen goed te verteren.",
    gritBySituation: {
      breeding: "Bied tijdens de kweek geschikte schelpencalcium/schelpengrit aan als calciumbron.",
    },
    light: "Zorg bij binnenvogels voor veilig natuurlijk daglicht of een soortspecifieke UVB-lamp voor vogels met een schaduwrijke schuilplaats.",
    freshProduce: "Bied een variatie aan gewassen, fijngehakte bladgroenten en groenten zoals wortel aan in een afzonderlijk bakje. Voeg kleinere porties fruit toe, waaronder appel, en verwijder restjes snel; houd vers voer gescheiden van de droge mix.",
    freshProduceGuidance: {
      triggerLabel: "Bekijk geschikte verse groenten en fruit",
      heading: "Geschikte verse groenten en fruit voor duiven",
      introduction: "Bied verse, gewassen, fijngehakte of geraspte groenten en kleine stukjes fruit aan in een afzonderlijk bakje.",
      vegetables: "Groenten: wortel, broccoli, bloemkool, paprika, paardenbloemblad en bladgroenten zoals boerenkool, Romeinse sla of bladcavit.",
      fruits: "Kleine porties fruit: vruchtvlees van appel zonder klokhuis en zaden, en bessen.",
      safety: "Bied geen avocado, ui of rabarber aan. Verwijder restjes snel.",
      sourcesTriggerLabel: "Bronnen voor dit advies",
      sourcesHeading: "Bronnen voor advies over verse groenten en fruit",
      sources: BIRD_CARE.pigeon.freshProduceGuidance!.sources,
    },
  },
  parrot: {
    scope: "Een zaden- en graanmengsel ter verrijking, geen complete voeding voor papegaaien.",
    baseDiet: "Gebruik een soortspecifieke geformuleerde voeding als nutritionele basis, met verse groenten en fruit, en slechts een beperkte hoeveelheid zaden of noten.",
    water: "Zorg altijd voor schoon, vers water dat te allen tijde beschikbaar is.",
    grit: "Geef papegaaien niet routinematig maagkiezel (grit), tenzij een dierenarts voor exoten dit specifiek aanbeveelt.",
    light: "Zorg bij binnenvogels voor veilig natuurlijk daglicht of een soortspecifieke UVB-lamp voor vogels met een schaduwrijke schuilplaats.",
  },
  african_grey: {
    scope: "Een zaden- en graanmengsel ter verrijking, geen complete voeding voor grijze roodstaarten.",
    baseDiet: "Gebruik een soortspecifieke geformuleerde voeding als nutritionele basis, met verse groenten en fruit. Grijze roodstaarten hebben bij vragen over calcium en vitamine D begeleiding nodig van een dierenarts voor exoten.",
    water: "Zorg altijd voor schoon, vers water dat te allen tijde beschikbaar is.",
    grit: "Geef niet routinematig maagkiezel (grit), tenzij een dierenarts voor exoten dit specifiek aanbeveelt.",
    light: "Zorg bij binnenvogels voor veilig natuurlijk daglicht of een soortspecifieke UVB-lamp voor vogels met een schaduwrijke schuilplaats.",
  },
  budgie: {
    scope: "Een zaden- en graanmengsel ter verrijking, geen complete voeding voor parkieten.",
    baseDiet: "Gebruik een soortspecifieke geformuleerde voeding als nutritionele basis, samen met verse groenten, fruit en een beperkte hoeveelheid zaden.",
    water: "Zorg altijd voor schoon, vers water dat te allen tijde beschikbaar is.",
    grit: "Geef niet routinematig maagkiezel (grit), tenzij een dierenarts voor exoten dit specifiek aanbeveelt.",
    light: "Zorg bij binnenvogels voor veilig natuurlijk daglicht of een soortspecifieke UVB-lamp voor vogels met een schaduwrijke schuilplaats.",
  },
  canary: {
    scope: "Een zaden- en graanmengsel ter verrijking, geen complete voeding voor kanaries.",
    baseDiet: "Gebruik een soortspecifieke geformuleerde of verrijkte voeding als nutritionele basis, met verse groenten, fruit en een beperkte hoeveelheid zaden.",
    water: "Zorg altijd voor schoon, vers water dat te allen tijde beschikbaar is.",
    grit: "Geef niet routinematig maagkiezel (grit), tenzij een dierenarts voor exoten dit specifiek aanbeveelt.",
    light: "Zorg bij binnenvogels voor veilig natuurlijk daglicht of een soortspecifieke UVB-lamp voor vogels met een schaduwrijke schuilplaats.",
  },
  chicken: {
    scope: "Een aanvullend graanmengsel (strooivoer), geen complete pluimveeratio. Houd strooivoer en andere traktaties beperkt tot een klein deel van de dagelijkse inname.",
    baseDiet: "Gebruik een aan de leeftijd en productie aangepaste complete pluimveevoeding als nutritionele basis, met insecten als incidentele verrijking. Legkippen hebben een gevalideerde legkorrel of legmeel nodig.",
    water: "Zorg continu voor schoon, vers water; toegang tot water heeft een grote invloed op de voerinname en eierproductie.",
    grit: "Bied alleen onoplosbare maagkiezel aan als je hele granen of zaden voert en de vogels geen geschikte kiezel uit de grond kunnen halen. Oesterschelp is geen vervanging voor maagkiezel.",
    light: "Zorg bij binnenvogels voor veilig natuurlijk daglicht of een soortspecifieke UVB-lamp voor vogels met een schaduwrijke schuilplaats.",
  },
};

export function getBirdCare(bird: BirdType, language: SupportedLanguage): BirdCareGuidance {
  if (language === "de") {
    return DE_BIRD_CARE[bird];
  }
  if (language === "nl") {
    return NL_BIRD_CARE[bird];
  }
  return BIRD_CARE[bird];
}
