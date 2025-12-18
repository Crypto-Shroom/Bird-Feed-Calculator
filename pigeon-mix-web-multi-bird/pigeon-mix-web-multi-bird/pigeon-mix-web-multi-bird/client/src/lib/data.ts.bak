// Expanded Ingredient Database for Pigeon Mix Calculator
// Includes all pigeon-safe grains, legumes, seeds, and herbs/supplements

export interface Ingredient {
  category: "grain" | "legume" | "seed";
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  notes: string;
}

export interface Herb {
  category: "herb_seed" | "herb_spice" | "herb_dried" | "liquid_supplement" | "powder_supplement";
  benefits: string[];
  dosage_per_kg: string;
  frequency: string;
  notes: string;
}

export const INGREDIENTS: Record<string, Ingredient> = {
    // ===== GRAINS (Energy Sources) =====
    "wheat": {"category": "grain", "protein": 13.5, "carbs": 71, "fat": 2, "fiber": 3, "notes": "Higher protein grain, improves fertility"},
    "wheat_hard_red": {"category": "grain", "protein": 13.5, "carbs": 71, "fat": 2, "fiber": 3, "notes": "Hard red winter wheat, higher protein"},
    "wheat_soft_red": {"category": "grain", "protein": 10.2, "carbs": 73, "fat": 2, "fiber": 3, "notes": "Soft red winter wheat, lower protein"},
    
    "corn_yellow": {"category": "grain", "protein": 9, "carbs": 74, "fat": 4.5, "fiber": 2.5, "notes": "Vitamin A source, essential"},
    "corn_white": {"category": "grain", "protein": 9, "carbs": 74, "fat": 4.5, "fiber": 2.5, "notes": "Avoid - lacks Vitamin A"},
    "maize": {"category": "grain", "protein": 9, "carbs": 74, "fat": 4.5, "fiber": 2.5, "notes": "Same as corn, prefer yellow"},
    "popcorn": {"category": "grain", "protein": 13, "carbs": 74, "fat": 4, "fiber": 15, "notes": "High fiber, use sparingly"},
    
    "barley": {"category": "grain", "protein": 11, "carbs": 73, "fat": 2, "fiber": 5, "notes": "Easily digestible, good for winter"},
    "barley_pearled": {"category": "grain", "protein": 10, "carbs": 78, "fat": 1, "fiber": 3.5, "notes": "Lower fiber than whole barley"},
    
    "oats": {"category": "grain", "protein": 13, "carbs": 66, "fat": 6, "fiber": 10, "notes": "High fiber, use sparingly"},
    "oat_groats": {"category": "grain", "protein": 17, "carbs": 66, "fat": 7, "fiber": 10, "notes": "Hulled oats, high fiber"},
    
    "milo": {"category": "grain", "protein": 11, "carbs": 73, "fat": 3, "fiber": 2, "notes": "Similar to corn, lacks Vitamin A"},
    "sorghum": {"category": "grain", "protein": 11, "carbs": 73, "fat": 3, "fiber": 2, "notes": "Same as milo"},
    "kaffir_corn": {"category": "grain", "protein": 11, "carbs": 73, "fat": 3, "fiber": 2, "notes": "Type of sorghum"},
    
    "rice": {"category": "grain", "protein": 7, "carbs": 80, "fat": 0.5, "fiber": 1, "notes": "Low protein, high carbs"},
    "rice_brown": {"category": "grain", "protein": 8, "carbs": 77, "fat": 2.5, "fiber": 3.5, "notes": "More fiber than white rice"},
    "rice_red": {"category": "grain", "protein": 7, "carbs": 79, "fat": 2, "fiber": 2, "notes": "Colored rice variety"},
    
    "rye": {"category": "grain", "protein": 15, "carbs": 76, "fat": 2, "fiber": 15, "notes": "High fiber, use sparingly"},
    "triticale": {"category": "grain", "protein": 13, "carbs": 72, "fat": 2, "fiber": 4, "notes": "Wheat-rye hybrid"},
    "spelt": {"category": "grain", "protein": 15, "carbs": 70, "fat": 2.5, "fiber": 11, "notes": "Ancient wheat variety"},
    "buckwheat": {"category": "grain", "protein": 13, "carbs": 72, "fat": 3, "fiber": 10, "notes": "Pseudo-grain, high fiber"},
    
    // ===== LEGUMES (Protein Sources) =====
    "peas": {"category": "legume", "protein": 23, "carbs": 60, "fat": 1.5, "fiber": 5, "notes": "Most essential ingredient"},
    "peas_field": {"category": "legume", "protein": 24, "carbs": 60, "fat": 1.5, "fiber": 5, "notes": "Canadian field peas, high protein"},
    "peas_canada": {"category": "legume", "protein": 24, "carbs": 60, "fat": 1.5, "fiber": 5, "notes": "High protein variety"},
    "peas_austrian": {"category": "legume", "protein": 24, "carbs": 60, "fat": 1.5, "fiber": 5, "notes": "Austrian winter peas"},
    "peas_green": {"category": "legume", "protein": 23, "carbs": 60, "fat": 1.5, "fiber": 5, "notes": "Standard green peas"},
    "peas_maple": {"category": "legume", "protein": 25, "carbs": 60, "fat": 1.5, "fiber": 5, "notes": "Maple peas variety"},
    "peas_yellow": {"category": "legume", "protein": 23, "carbs": 60, "fat": 1.5, "fiber": 5, "notes": "Yellow split peas"},
    
    "lentils": {"category": "legume", "protein": 25, "carbs": 63, "fat": 1, "fiber": 8, "notes": "Very high protein, safe uncooked"},
    "lentils_red": {"category": "legume", "protein": 26, "carbs": 63, "fat": 1, "fiber": 8, "notes": "Red lentils"},
    "lentils_green": {"category": "legume", "protein": 25, "carbs": 63, "fat": 1, "fiber": 8, "notes": "Green lentils"},
    "lentils_brown": {"category": "legume", "protein": 25, "carbs": 63, "fat": 1, "fiber": 8, "notes": "Brown lentils"},
    
    "beans": {"category": "legume", "protein": 22, "carbs": 62, "fat": 1, "fiber": 6, "notes": "Must be cooked (except safe varieties)"},
    "mung_beans": {"category": "legume", "protein": 24, "carbs": 63, "fat": 1, "fiber": 7, "notes": "Safe uncooked"},
    "black_eyed_peas": {"category": "legume", "protein": 24, "carbs": 60, "fat": 1, "fiber": 6, "notes": "Safe dry, high protein"},
    "chickpeas": {"category": "legume", "protein": 19, "carbs": 61, "fat": 6, "fiber": 12, "notes": "Must be cooked, high fiber"},
    "fava_beans": {"category": "legume", "protein": 26, "carbs": 58, "fat": 1.5, "fiber": 9, "notes": "Must be cooked"},
    "navy_beans": {"category": "legume", "protein": 22, "carbs": 60, "fat": 1.5, "fiber": 10, "notes": "Must be cooked"},
    "kidney_beans": {"category": "legume", "protein": 24, "carbs": 60, "fat": 1, "fiber": 7, "notes": "Must be cooked, toxic raw"},
    "pinto_beans": {"category": "legume", "protein": 21, "carbs": 63, "fat": 1, "fiber": 9, "notes": "Must be cooked"},
    "adzuki_beans": {"category": "legume", "protein": 20, "carbs": 63, "fat": 0.5, "fiber": 7, "notes": "Small red beans"},
    
    "vetch": {"category": "legume", "protein": 24, "carbs": 60, "fat": 1.5, "fiber": 6, "notes": "Common vetch, high protein"},
    "lupins": {"category": "legume", "protein": 36, "carbs": 40, "fat": 9, "fiber": 19, "notes": "Very high protein, high fiber"},
    "soybeans": {"category": "legume", "protein": 36, "carbs": 30, "fat": 20, "fiber": 9, "notes": "Very high protein and fat"},
    
    // ===== SEEDS (Fat and Special Nutrients) =====
    "safflower": {"category": "seed", "protein": 16, "carbs": 34, "fat": 38, "fiber": 9, "notes": "King of seeds, high fat"},
    "sunflower": {"category": "seed", "protein": 20, "carbs": 20, "fat": 51, "fiber": 9, "notes": "Very high fat, black oil preferred"},
    "sunflower_hearts": {"category": "seed", "protein": 21, "carbs": 20, "fat": 51, "fiber": 9, "notes": "Hulled sunflower"},
    
    "linseed": {"category": "seed", "protein": 18, "carbs": 29, "fat": 42, "fiber": 27, "notes": "Omega-3, feather health, high fiber"},
    "flaxseed": {"category": "seed", "protein": 18, "carbs": 29, "fat": 42, "fiber": 27, "notes": "Same as linseed"},
    
    "hemp": {"category": "seed", "protein": 31, "carbs": 28, "fat": 49, "fiber": 4, "notes": "Omega-3 rich, excellent"},
    "hemp_hearts": {"category": "seed", "protein": 32, "carbs": 28, "fat": 49, "fiber": 4, "notes": "Hulled hemp seeds"},
    
    "millet": {"category": "seed", "protein": 11, "carbs": 73, "fat": 4, "fiber": 3, "notes": "Small seed, good carbs"},
    "millet_white": {"category": "seed", "protein": 11, "carbs": 73, "fat": 4, "fiber": 3, "notes": "White proso millet"},
    "millet_red": {"category": "seed", "protein": 11, "carbs": 73, "fat": 4, "fiber": 3, "notes": "Red millet variety"},
    "millet_silver": {"category": "seed", "protein": 11, "carbs": 73, "fat": 4, "fiber": 3, "notes": "Silver millet"},
    
    "canola": {"category": "seed", "protein": 20, "carbs": 24, "fat": 40, "fiber": 12, "notes": "Rapeseed, oil seed"},
    "rapeseed": {"category": "seed", "protein": 20, "carbs": 24, "fat": 40, "fiber": 12, "notes": "Same as canola"},
    
    "niger": {"category": "seed", "protein": 20, "carbs": 18, "fat": 40, "fiber": 13, "notes": "Nyjer/thistle seed, high fat"},
    "nyjer": {"category": "seed", "protein": 20, "carbs": 18, "fat": 40, "fiber": 13, "notes": "Same as niger seed"},
    
    "sesame": {"category": "seed", "protein": 18, "carbs": 23, "fat": 50, "fiber": 12, "notes": "High fat and calcium"},
    "chia": {"category": "seed", "protein": 17, "carbs": 42, "fat": 31, "fiber": 34, "notes": "Omega-3, very high fiber"},
    "pumpkin_seeds": {"category": "seed", "protein": 30, "carbs": 10, "fat": 49, "fiber": 6, "notes": "Pepitas, high protein"},
    "pepitas": {"category": "seed", "protein": 30, "carbs": 10, "fat": 49, "fiber": 6, "notes": "Pumpkin seeds"},
    "peanuts": {"category": "seed", "protein": 26, "carbs": 16, "fat": 49, "fiber": 9, "notes": "High protein and fat, good energy source"},
    "peanuts_raw": {"category": "seed", "protein": 26, "carbs": 16, "fat": 49, "fiber": 9, "notes": "Raw peanuts, unsalted"},
    "peanuts_roasted": {"category": "seed", "protein": 26, "carbs": 16, "fat": 49, "fiber": 9, "notes": "Roasted unsalted peanuts"},
};

export const HERBS_SUPPLEMENTS: Record<string, Herb> = {
    // ===== HERBS & SPICES (Health Benefits) =====
    "anise": {
        "category": "herb_seed",
        "benefits": ["Respiratory health", "Digestion", "Antimicrobial"],
        "dosage_per_kg": "2-5g",
        "frequency": "2-3 times per week",
        "notes": "Aniseed, good for respiratory system"
    },
    "fennel": {
        "category": "herb_seed",
        "benefits": ["Digestion", "Respiratory", "Anti-inflammatory"],
        "dosage_per_kg": "2-5g",
        "frequency": "2-3 times per week",
        "notes": "Fennel seeds, aids digestion"
    },
    "nigella": {
        "category": "herb_seed",
        "benefits": ["Immunity", "Antimicrobial", "Antioxidant"],
        "dosage_per_kg": "1-3g",
        "frequency": "2-3 times per week",
        "notes": "Black cumin/black seed, immune booster"
    },
    "cumin": {
        "category": "herb_spice",
        "benefits": ["Digestion", "Antimicrobial", "Antioxidant"],
        "dosage_per_kg": "1-2g",
        "frequency": "2-3 times per week",
        "notes": "Ground cumin, digestive aid"
    },
    "coriander": {
        "category": "herb_seed",
        "benefits": ["Digestion", "Antimicrobial", "Cooling"],
        "dosage_per_kg": "2-4g",
        "frequency": "2-3 times per week",
        "notes": "Coriander seeds, cooling effect"
    },
    "fenugreek": {
        "category": "herb_seed",
        "benefits": ["Digestion", "Immunity", "Anti-inflammatory"],
        "dosage_per_kg": "2-4g",
        "frequency": "2-3 times per week",
        "notes": "Fenugreek seeds, digestive tonic"
    },
    "oregano": {
        "category": "herb_dried",
        "benefits": ["Antimicrobial", "Antifungal", "Respiratory"],
        "dosage_per_kg": "1-2g",
        "frequency": "2-3 times per week",
        "notes": "Dried oregano, strong antimicrobial"
    },
    "thyme": {
        "category": "herb_dried",
        "benefits": ["Respiratory", "Antimicrobial", "Antifungal"],
        "dosage_per_kg": "1-2g",
        "frequency": "2-3 times per week",
        "notes": "Dried thyme, respiratory support"
    },
    "basil": {
        "category": "herb_dried",
        "benefits": ["Antimicrobial", "Antioxidant", "Anti-inflammatory"],
        "dosage_per_kg": "1-2g",
        "frequency": "2-3 times per week",
        "notes": "Dried basil, general health"
    },
    "cinnamon": {
        "category": "herb_spice",
        "benefits": ["Antimicrobial", "Antifungal", "Circulation"],
        "dosage_per_kg": "0.5-1g",
        "frequency": "2-3 times per week",
        "notes": "Ground cinnamon, improves circulation"
    },
    "ginger": {
        "category": "herb_spice",
        "benefits": ["Digestion", "Anti-inflammatory", "Immunity"],
        "dosage_per_kg": "0.5-1g",
        "frequency": "2-3 times per week",
        "notes": "Ground ginger, digestive and immune support"
    },
    "turmeric": {
        "category": "herb_spice",
        "benefits": ["Anti-inflammatory", "Antioxidant", "Immunity"],
        "dosage_per_kg": "0.5-1g",
        "frequency": "2-3 times per week",
        "notes": "Ground turmeric, powerful anti-inflammatory"
    },
    "garlic_powder": {
        "category": "herb_spice",
        "benefits": ["Antimicrobial", "Immunity", "Circulation"],
        "dosage_per_kg": "1-2g",
        "frequency": "Once a week",
        "notes": "Natural antibiotic, use fresh garlic oil if available"
    },
    "clove": {
        "category": "herb_spice",
        "benefits": ["Antimicrobial", "Antifungal", "Pain relief"],
        "dosage_per_kg": "0.25-0.5g",
        "frequency": "1-2 times per week",
        "notes": "Ground clove, very strong, use sparingly"
    },
    "rosemary": {
        "category": "herb_dried",
        "benefits": ["Antioxidant", "Circulation", "Respiratory"],
        "dosage_per_kg": "1-2g",
        "frequency": "2-3 times per week",
        "notes": "Dried rosemary, antioxidant rich"
    },
    "mint": {
        "category": "herb_dried",
        "benefits": ["Digestion", "Cooling", "Respiratory"],
        "dosage_per_kg": "1-2g",
        "frequency": "2-3 times per week",
        "notes": "Dried mint/peppermint, cooling digestive aid"
    },
    "chamomile": {
        "category": "herb_dried",
        "benefits": ["Calming", "Anti-inflammatory", "Digestion"],
        "dosage_per_kg": "1-2g",
        "frequency": "2-3 times per week",
        "notes": "Dried chamomile flowers, calming effect"
    },
    "neem": {
        "category": "herb_dried",
        "benefits": ["Antimicrobial", "Antiparasitic", "Immunity"],
        "dosage_per_kg": "0.5-1g",
        "frequency": "Once a week",
        "notes": "Neem leaves, strong antiparasitic"
    },
    
    // ===== LIQUID SUPPLEMENTS =====
    "apple_cider_vinegar": {
        "category": "liquid_supplement",
        "benefits": ["Gut health", "pH balance", "Antimicrobial"],
        "dosage_per_kg": "5-10ml per liter water",
        "frequency": "2-3 times per week",
        "notes": "Use raw with 'the mother', probiotic"
    },
    "garlic_oil": {
        "category": "liquid_supplement",
        "benefits": ["Antimicrobial", "Immunity", "Circulation"],
        "dosage_per_kg": "Few drops per kg feed",
        "frequency": "Once a week",
        "notes": "Natural antibiotic, very effective"
    },
    "hemp_oil": {
        "category": "liquid_supplement",
        "benefits": ["Omega-3", "Feather health", "Anti-inflammatory"],
        "dosage_per_kg": "5-10ml per kg feed",
        "frequency": "2-3 times per week",
        "notes": "Rich in omega fatty acids"
    },
    "cod_liver_oil": {
        "category": "liquid_supplement",
        "benefits": ["Vitamin D", "Omega-3", "Immunity"],
        "dosage_per_kg": "5ml per kg feed",
        "frequency": "Winter: 3-4 times per week",
        "notes": "Essential for winter, vitamin D source"
    },
    "linseed_oil": {
        "category": "liquid_supplement",
        "benefits": ["Omega-3", "Feather health", "Breeding"],
        "dosage_per_kg": "5-10ml per kg feed",
        "frequency": "Breeding/molting: 3-4 times per week",
        "notes": "Flaxseed oil, coat feed for breeding"
    },
    
    // ===== OTHER SUPPLEMENTS =====
    "brewers_yeast": {
        "category": "powder_supplement",
        "benefits": ["B vitamins", "Amino acids", "Minerals"],
        "dosage_per_kg": "5-10g",
        "frequency": "Molting: daily, otherwise 2-3x per week",
        "notes": "Essential during molting for feather growth"
    },
    "elderberry_extract": {
        "category": "liquid_supplement",
        "benefits": ["Immunity", "Antiviral", "Antioxidant"],
        "dosage_per_kg": "5-10ml per liter water",
        "frequency": "2-3 times per week",
        "notes": "One of the best immune boosters"
    },
    "probiotics": {
        "category": "powder_supplement",
        "benefits": ["Gut health", "Digestion", "Immunity"],
        "dosage_per_kg": "As per product instructions",
        "frequency": "Daily or as directed",
        "notes": "Beneficial bacteria for gut health"
    },
};

export const HERB_RECOMMENDATIONS: Record<string, { recommended: string[]; notes: string }> = {
    "maintenance": {
        "recommended": ["apple_cider_vinegar", "garlic_powder", "oregano"],
        "notes": "Basic immune support and gut health"
    },
    "racing": {
        "recommended": ["ginger", "turmeric", "garlic_oil", "hemp_oil"],
        "notes": "Anti-inflammatory, circulation, energy support"
    },
    "breeding": {
        "recommended": ["linseed_oil", "fenugreek", "fennel", "brewers_yeast"],
        "notes": "Reproductive health, egg production, chick development"
    },
    "molting": {
        "recommended": ["brewers_yeast", "hemp_oil", "nigella", "elderberry_extract"],
        "notes": "Feather growth, amino acids, immune support during stress"
    },
    "winter": {
        "recommended": ["cod_liver_oil", "cinnamon", "ginger", "garlic_oil"],
        "notes": "Vitamin D, warmth, circulation, immunity"
    }
};

export const PROFILES: Record<string, any> = {
    "pet": {
        "name": "Pet/Stay-at-Home",
        "protein": [12, 14],
        "carbs": [65, 75],
        "fat": [2, 4],
        "fiber": [0, 5],
        "category_ratios": {"grain": [65, 75], "legume": [15, 20], "seed": [5, 10]},
        "feeding_notes": "Feed 25-35g per bird per day. Balanced nutrition for sedentary birds. Variety helps prevent boredom.",
        "description": "For companion pigeons that don't fly or race. Focus on balanced nutrition and variety to maintain health and prevent behavioral issues."
    },
    "maintenance": {
        "name": "Maintenance/Rest",
        "protein": [13.5, 15],
        "carbs": [60, 70],
        "fat": [2, 5],
        "fiber": [0, 5],
        "category_ratios": {"grain": [60, 70], "legume": [15, 20], "seed": [10, 15]},
        "feeding_notes": "Feed 30-40g per bird per day. Light feeding in morning, standard mix in evening.",
        "description": "For resting birds between seasons. Balanced nutrition maintains health without excess energy stimulation."
    },
    "racing": {
        "name": "Racing/Performance",
        "protein": [16, 18],
        "carbs": [60, 65],
        "fat": [2, 5],
        "fiber": [0, 5],
        "category_ratios": {"grain": [40, 50], "legume": [40, 50], "seed": [5, 10]},
        "feeding_notes": "Feed 40-50g per bird per day. High protein for performance. Increase peas for long races.",
        "description": "For racing pigeons during training and competition. High protein and legumes build muscle and endurance."
    },
    "breeding": {
        "name": "Breeding/Brooding",
        "protein": [14, 16],
        "carbs": [60, 70],
        "fat": [3, 6],
        "fiber": [0, 5],
        "category_ratios": {"grain": [60, 65], "legume": [20, 25], "seed": [10, 15]},
        "feeding_notes": "Feed 35-45g per bird per day. Add flaxseed oil coating. Support egg production and squab growth.",
        "description": "For breeding pairs and brooding birds. Supports egg production, fertility, and healthy squab development."
    },
    "molting": {
        "name": "Molting Season",
        "protein": [16, 18],
        "carbs": [55, 65],
        "fat": [3, 6],
        "fiber": [0, 5],
        "category_ratios": {"grain": [55, 60], "legume": [25, 30], "seed": [10, 15]},
        "feeding_notes": "Feed 35-45g per bird per day. High protein for feather growth. Add brewer's yeast. Provide bathing 1-2x/week.",
        "description": "For molting birds shedding old feathers. High protein and amino acids support rapid feather regeneration."
    },
    "winter": {
        "name": "Winter Season",
        "protein": [12, 14],
        "carbs": [65, 75],
        "fat": [5, 8],
        "fiber": [0, 5],
        "category_ratios": {"grain": [70, 75], "legume": [10, 15], "seed": [10, 15]},
        "feeding_notes": "Feed 30-40g per bird per day, twice daily. High energy for warmth. Add oil seeds (hemp, sunflower) up to 10%.",
        "description": "For cold weather survival. High carbs and fats provide extra calories to maintain body temperature."
    }
};
