# Profile Research: Diamond Dove / Diamond Pigeon (*Geopelia cuneata*) and Columbidae Subspecies/Species Requirements

No runtime code, active targets, ingredient libraries, or calculator profiles are changed by this research log. Any future profile additions or runtime adjustments require explicit Product Owner approval.

---

## Executive Summary & Research Request Context

This evidence research log evaluates nutritional targets, suitability, physical safety boundaries, and source support for **Diamond Doves / Diamond Pigeons (*Geopelia cuneata*)** in response to the profile research queued request:

> *"[Profile research] Pigeon: Bird: Diamond Pigeon / Diamond Dove / Dove / etc. Suggested profile name: Diamond Pigeon / Diamond Dove / Dove / etc. Intended use, life stage, or condition: But actually, its more like subspecies with different requirements rather than different profiles. Research request: Please research nutrition targets, suitability, safety boundaries, and source support before any calculator profile is added."*

---

## 1. Taxonomic Identity & Species vs. Subspecies Distinction

1. **Taxonomic Classification**:
   - **Diamond Dove (*Geopelia cuneata*)**: A distinct, small species in the family Columbidae (native to Australia).
   - **Domestic Pigeon / Homing Pigeon (*Columba livia domestica*)**: A distinct genus and much larger species in the family Columbidae.
   - **Conclusion**: Diamond Doves and domestic pigeons are **separate species** belonging to different genera (*Geopelia* vs. *Columba*), not subspecies of *Columba livia*.

2. **Morphological Differences and Body Weight**:
   - **Diamond Dove (*Geopelia cuneata*)**: Average body mass of **25 to 35 grams** (approx. 30g). Small, delicate bill structure.
   - **Domestic Pigeon (*Columba livia*)**: Average body mass of **300 to 500+ grams**. Stout, strong beak capable of consuming whole corn kernels, large field peas, tick beans, and broad beans.

3. **Columbid Subspecies vs. Species Profile Considerations**:
   - The user query notes: *"But actually, its more like subspecies with different requirements rather than different profiles."*
   - **Finding**: While all granivorous Columbids share similar core physiological traits (producing crop milk for squabs, unhulled seed digestion in the muscular gizzard, inability to ferment crude fiber efficiently), their **dietary requirements differ fundamentally by seed particle size** rather than merely macronutrient percentages.
   - Domestic pigeon seed mixes contain large grains (corn, peas, tick beans) that pose **severe mechanical choking and crop impaction risks** to small species like Diamond Doves.

---

## 2. Seed Size, Particle Constraints, and Physical Safety Boundaries

1. **Particle Size Limits for *Geopelia cuneata***:
   - Diamond Doves are strict small-seed granivores. Their small gape and bill restrict them to seed diameters under **2.5 – 3.5 mm**.
   - **Suitable seed types**: Red, white, proso, foxtail, and Japanese millets, canary seed, sesame seed, panicum, and finely cracked/crushed seeds.
   - **Unsuitable / Hazardous feed items**: Whole corn, whole peas, whole chickpea/garbanzo beans, tick beans, whole fava beans, large sunflower seeds, whole almonds, or unchopped nuts.

2. **Grit and Mineral Requirements**:
   - **Insoluble Digestive Grit**: Fine flint or quartz grit (0.5 – 1.5 mm diameter) is required for grinding small unhulled seeds in the gizzard. Large pigeon grit sizes are unusable and dangerous.
   - **Soluble Calcium**: Finely ground oyster shell, calcium carbonate, or eggshell meal is essential, particularly for breeding/laying females (Columbids lay 2-egg clutches frequently).

3. **Hard Toxicity Warnings (Applies to all Columbids)**:
   - Raw dried legumes (kidney, lima, fava, navy, pinto, black beans) are toxic due to lectins/phytohemagglutinin and trypsin inhibitors.
   - Avocado, chocolate, caffeine, alcohol, fruit pits/apple seeds, and moldy feeds are strictly prohibited.

---

## 3. Nutritional Targets for Diamond Doves (*Geopelia cuneata*)

Based on avian veterinary references (Merck Veterinary Manual - *Nutrition in Pigeons and Doves*; Clinical Avian Medicine; Sales & Janssens 2003):

| Nutrient Parameter | Maintenance Target Range | Breeding / Molting Range | Notes & Source Basis |
| --- | --- | --- | --- |
| **Crude Protein** | 11.5% – 13.5% | 14.0% – 16.0% | Lower baseline protein requirement than growing broilers; excessive protein elevates renal uric acid burden. |
| **Crude Fat** | 3.0% – 5.0% | 4.5% – 6.5% | Oilseeds (sesame, Niger, flax) must be strictly moderated to prevent hepatic lipidosis (fatty liver disease) in caged/aviary birds. |
| **Carbohydrates** | 60.0% – 70.0% | 58.0% – 68.0% | Starch-rich small grains (millets, canary seed) serve as primary metabolizable energy. |
| **Crude Fiber** | 0.0% – 4.0% | 0.0% – 4.0% | Columbids lack functional cecal fermentation; fiber above 5% reduces energy digestibility. |

---

## 4. Evaluation & Guidance for Calculator Engine Integration

1. **Current V3 Architecture Limitation**:
   - Active work in `v3-webapp/client/src/lib/birds.ts` currently supports six species: `pigeon`, `parrot`, `african_grey`, `budgie`, `canary`, and `chicken`.
   - The active `pigeon` profile assumes domestic pigeon (*Columba livia*) ingredient availability (including large peas and grains).

2. **Risk Analysis for Profile Addition**:
   - If "Diamond Dove" or "Diamond Pigeon" were added under the existing domestic `pigeon` category without a seed-size filter, the optimizer or multi-bird calculator could allocate large legumes (e.g. green peas, chickpea, field peas) that present choking or impaction hazards for a 30g bird.

3. **Recommendations for the Product Owner**:
   - **Option A (Recommended)**: Do not add a separate "Diamond Pigeon" profile to the domestic pigeon engine until an ingredient size-filtering property (e.g., `maxParticleSizeMm` or `suitableForSmallColumbids`) is implemented in `data.ts`.
   - **Option B (Alternative)**: If a Diamond Dove profile is added in the future, it must be created as a separate species entry (`diamond_dove`) with its own restricted ingredient catalog consisting exclusively of small seeds (millets, canary seed, sesame, fine crushed grit).

---

## 5. Source Register & References

1. **Merck Veterinary Manual (2025)**: *Nutrition in Pigeons and Doves (Columbiformes)*, by Joeke Nijboer, PhD & Anouk Fens, MSc.
2. **Sales & Janssens (2003)**: *Nutrition of the domestic pigeon (Columba livia domestica)*, World's Poultry Science Journal, DOI: 10.1079/WPS20030014.
3. **Harrison & Lightfoot (2006)**: *Clinical Avian Medicine*, Spix Publishing.
4. **VCA Animal Hospitals (2025)**: *Feeding Pigeons and Doves*, by Gregory Rich, DVM et al.
