import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const reviewsPath = path.join(root, 'database/provenance/food-reviews.json');
const sourcesPath = path.join(root, 'database/provenance/sources.json');
const coveragePath = path.join(root, 'database/provenance/food-coverage.json');
const today = '2026-08-20';
const reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
const sourceRegister = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));

const newSources = [
  ['liu-pigeon-whole-grains-2023','Free-Choice Feeding of Whole Grains Improves Meat Quality and Intestinal Development of Pigeon Squabs Compared with Complete Pelleted Feed','Liu et al.','2023','primary','https://doi.org/10.3390/life13030848',['pigeon'],'Controlled Columba livia whole corn and whole wheat plus pellet feeding context.','Production study; does not establish a companion-bird portion, sole diet, or other grain forms.'],
  ['hullar-pigeon-feed-energy-1999','Studies on the Energy Content of Pigeon Feeds I. Determination of Digestibility and Metabolizable Energy Content','Hullar et al.','1999','primary','https://doi.org/10.1093/ps/78.12.1757',['pigeon'],'Controlled homing-pigeon whole-grain digestion study for corn, wheat, barley, and red/white millet.','Metabolism study; not a balanced-ration, companion-care, or oat outcome.'],
  ['sales-janssens-pigeon-nutrition-2003','Nutrition of the Domestic Pigeon (Columba livia domestica)','J. Sales; G.P.J. Janssens','2003','peer_reviewed_review','https://doi.org/10.1079/WPS20030014',['pigeon'],'Domestic-pigeon whole-grain mixture and nutrition context.','Accessible abstract does not establish a whole-oat outcome.'],
  ['parrot-awareness-week-diet','Dietary Needs of Parrots','Alan K. Jones BVetMed MRCVS','unknown','owner_guidance_with_citations','https://www.parrotawarenessweek.com/diet',['parrot'],'Parrot dry-mix context naming wheat, oats, millets, and dried corn; mixed-diet warning.','General parrot guidance; not a universal species or portion approval.'],
  ['omlet-parrot-seed-guide','Seed for Parrots','Omlet','unknown','owner_guidance_with_citations','https://www.omlet.us/guide/parrots/parrot_food/seed/',['parrot'],'Parrot seed-mix context naming barley, dried corn, millet, whole oats, and wheat groats.','Owner guidance; not a complete-ration or individual-parrot approval.'],
  ['exoticdirect-budgie-food-2019','What Can Budgies Eat?','Dorothy Schwarz; ExoticDirect','2019','owner_guidance_with_citations','https://exoticdirect.co.uk/news/what-can-budgies-eat/',['budgie'],'Budgie grain context naming barley, oats, wheat, and millet; varied-diet boundary.','Does not establish whole dry corn; sweetcorn is described as a distinct cooked fresh food.'],
  ['harper-turner-canary-nutrition-2000','Nutrition and Energetics of the Canary (Serinus canarius)','E.J. Harper; C.L. Turner','2000','peer_reviewed_review','https://doi.org/10.1016/S0305-0491(00)00210-8',['canary'],'Direct canary review naming millet among preferred captive seeds.','Does not establish wheat, barley, oats, or corn forms.'],
  ['meander-canary-feeding','Feeding Your Canary','Meander Valley Vets','2012','owner_guidance_with_citations','https://www.meandervets.com.au/blog/feeding-your-canary',['canary'],'Canary varied-seed diet and millet-preference context.','Does not establish wheat, barley, oats, or whole dry corn.'],
  ['mofga-whole-grains-chickens','Feeding Whole Grains to Chickens','Diane Schivera; Maine Organic Farmers and Gardeners Association','2007','owner_guidance_with_citations','https://www.mofga.org/resources/fact-sheets/feeding-whole-grains-to-chickens/',['chicken'],'Whole-grain chicken context for corn, wheat, barley, oats, and millet with age and balanced-ration boundaries.','Extension guidance; not a complete ration or other-bird outcome.'],
  ['wilson-corn-wheat-barley-chickens-1944','Corn, Wheat, and Barley for Chickens','W.O. Wilson; South Dakota Agricultural Experiment Station','1944','primary','https://openprairie.sdstate.edu/cgi/viewcontent.cgi?article=1375&context=agexperimentsta_bulletins',['chicken'],'Chicken whole corn, wheat, and barley scratch-grain trials supplied with mash, water, oyster shell, and grit.','Historical study; not an oats/millet result or sole-grain approval.']
];
for (const [id,title,authors,publishedYear,sourceTier,urlOrDoi,speciesScopes,permittedUse,limitations] of newSources) {
  const source = {id,title,authorsOrOrganization:authors,publishedYear,sourceTier,urlOrDoi,speciesScopes,permittedUse,limitations,accessedAt:today};
  const idx = sourceRegister.sources.findIndex(s => s.id === id);
  if (idx >= 0) sourceRegister.sources[idx] = source; else sourceRegister.sources.push(source);
}

const rows = {
  wheat: {name:'Wheat',form:'whole dry grain, threshed/hulled where applicable',outcomes:[
    ['pigeon','limited',['liu-pigeon-whole-grains-2023'],'Controlled whole-wheat-plus-pellet pigeon feeding supports only a limited mixed-production context; not a sole diet or companion-ration instruction.'],
    ['parrot','limited',['parrot-awareness-week-diet'],'Direct parrot care guidance names wheat in traditional dry seed mixes while warning that a single mix is not balanced; limited varied-mix context only.'],
    ['african_grey','unresolved',['vca-african-grey-feeding'],'African-Grey guidance gives a balanced seed/pellet boundary but does not establish exact whole dry wheat.'],
    ['budgie','limited',['exoticdirect-budgie-food-2019'],'Direct budgie care guidance names wheat among grains within a varied diet; it is not a complete-ration or portion claim.'],
    ['canary','unresolved',['meander-canary-feeding'],'Canary sources establish varied seed context but not exact whole dry wheat after two searches.'],
    ['chicken','limited',['mofga-whole-grains-chickens','wilson-corn-wheat-barley-chickens-1944'],'Whole-wheat chicken evidence is limited to age-aware balanced rations with supplemental nutrition, not wheat alone.']
  ]},
  barley: {name:'Barley',form:'whole dry barley grain, non-pearled',outcomes:[
    ['pigeon','limited',['hullar-pigeon-feed-energy-1999'],'Controlled pigeon whole-barley metabolism evidence supports only a limited experimental grain context.'],
    ['parrot','limited',['omlet-parrot-seed-guide'],'Parrot care guidance names barley in varied seed mixes; it is not complete nutrition.'],
    ['african_grey','unresolved',['vca-african-grey-feeding'],'No exact African-Grey/non-pearled-barley outcome was found after two searches.'],
    ['budgie','limited',['exoticdirect-budgie-food-2019'],'Budgie care guidance names barley among grains within a varied diet.'],
    ['canary','unresolved',['meander-canary-feeding'],'No exact canary/non-pearled-barley outcome was found after two searches.'],
    ['chicken','limited',['mofga-whole-grains-chickens','wilson-corn-wheat-barley-chickens-1944'],'Whole-barley chicken evidence is limited to balanced, age-aware ration contexts.']
  ]},
  oats: {name:'Oats',form:'whole dry oat grain',outcomes:[
    ['pigeon','unresolved',['sales-janssens-pigeon-nutrition-2003'],'The targeted pigeon search did not establish a whole-dry-oat outcome; whole-grain generality and other-grain trials are not substituted.'],
    ['parrot','limited',['omlet-parrot-seed-guide'],'Parrot care guidance names whole oats in varied seed mixes; it is not complete nutrition.'],
    ['african_grey','unresolved',['vca-african-grey-feeding'],'No exact African-Grey/whole-oat outcome was found after two searches.'],
    ['budgie','limited',['exoticdirect-budgie-food-2019'],'Budgie care guidance names oats among grains within a varied diet.'],
    ['canary','unresolved',['meander-canary-feeding'],'No exact canary/whole-oat outcome was found after two searches.'],
    ['chicken','limited',['mofga-whole-grains-chickens'],'Whole-oat chicken guidance is limited to age-aware balanced-ration context.']
  ]},
  millet: {name:'Millet',form:'whole dry seed',outcomes:[
    ['pigeon','limited',['hullar-pigeon-feed-energy-1999'],'Controlled pigeon whole red/white millet metabolism evidence supports only a limited experimental grain context.'],
    ['parrot','limited',['parrot-awareness-week-diet','omlet-parrot-seed-guide'],'Parrot care guidance names millets in varied dry seed mixes; it is not complete nutrition.'],
    ['african_grey','unresolved',['vca-african-grey-feeding'],'No exact African-Grey/whole-millet outcome was found after two searches.'],
    ['budgie','limited',['vca-budgie-feeding','exoticdirect-budgie-food-2019'],'Budgie sources name millet and require a varied, non-seed-only diet.'],
    ['canary','limited',['harper-turner-canary-nutrition-2000','meander-canary-feeding'],'Direct canary sources name millet while requiring varied seed/balanced-diet context.'],
    ['chicken','limited',['mofga-whole-grains-chickens'],'Whole-millet chicken guidance is limited to balanced-ration context.']
  ]},
  corn: {name:'Corn',form:'whole dry maize/corn kernel, cultivar/color unspecified',outcomes:[
    ['pigeon','limited',['liu-pigeon-whole-grains-2023','hullar-pigeon-feed-energy-1999'],'Controlled pigeon whole-corn studies support only a limited mixed/experimental grain context.'],
    ['parrot','limited',['parrot-awareness-week-diet','omlet-parrot-seed-guide'],'Parrot care guidance names dried corn in varied dry seed mixes; it is not complete nutrition.'],
    ['african_grey','unresolved',['vca-african-grey-feeding'],'African-Grey guidance names corn broadly but does not establish the distinct whole dry kernel form.'],
    ['budgie','unresolved',['exoticdirect-budgie-food-2019'],'Budgie care guidance distinguishes sweetcorn cooked fresh food; it does not establish whole dry corn kernels.'],
    ['canary','unresolved',['meander-canary-feeding'],'No exact canary/whole-dry-corn outcome was found after two searches.'],
    ['chicken','limited',['mofga-whole-grains-chickens','wilson-corn-wheat-barley-chickens-1944'],'Whole-corn chicken evidence is limited to balanced ration or scratch-grain contexts with supplemental nutrition.']
  ]}
};

function entry(bird,outcome,sourceIds,rationale) {
  return {bird,outcome,sourceIds,locator:'See Issue #150 evidence log for the source-specific form boundary and first-/second-pass search record.',evidenceScope: bird === 'parrot' ? 'group_specific' : 'species_specific',rationale,reviewedAt:today};
}
for (const [ingredientId,row] of Object.entries(rows)) {
  const review = {ingredientId,ingredientDisplayName:row.name,form:row.form,nutrition:{sourceIds:[],basis:'not_applicable',notes:'Evidence-only record. It does not alter active catalog nutrition, calculator runtime behavior, formula ingredients, or inventory.'},speciesEvidence:row.outcomes.map(x=>entry(...x)),processing:{sourceIds:[],rule:'Keep this exact whole dry form distinct from fresh, cooked, rolled, cracked, ground, popped, pearled, sprouted, or otherwise processed forms. Do not treat any single grain as complete nutrition.',severity:'warning'},lastReviewedAt:today};
  const i = reviews.ingredientReviews.findIndex(x=>x.ingredientId===ingredientId && x.form===row.form);
  if (i>=0) reviews.ingredientReviews[i]=review; else reviews.ingredientReviews.push(review);
  for (const claim of coverage.claimCoverage) for (const item of claim.trackedItems) if (item.id===ingredientId) item.linkedFoodReviewKeys=[`${ingredientId}::${row.form}`];
}
fs.writeFileSync(reviewsPath, JSON.stringify(reviews,null,2)+'\n');
fs.writeFileSync(sourcesPath, JSON.stringify(sourceRegister,null,2)+'\n');
fs.writeFileSync(coveragePath, JSON.stringify(coverage,null,2)+'\n');
console.log('Applied Issue #150 provenance records, sources, and coverage links.');
