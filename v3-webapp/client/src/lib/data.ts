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

export type { Herb } from "./herb-content";
export { HERBS_SUPPLEMENTS } from "./herb-content";

export const INGREDIENTS: Record<string, Ingredient> = {
    // ===== GRAINS (Energy Sources) =====
    "wheat": {"category": "grain", "protein": 13.5, "carbs": 71, "fat": 2, "fiber": 2.3, "notes": "Higher protein grain, improves fertility"},
    "wheat_hard_red": {"category": "grain", "protein": 13.5, "carbs": 71, "fat": 2, "fiber": 2.3, "notes": "Hard red winter wheat, higher protein"},
    "wheat_soft_red": {"category": "grain", "protein": 10.2, "carbs": 73, "fat": 2, "fiber": 2.3, "notes": "Soft red winter wheat, lower protein"},
    
    "corn_yellow": {"category": "grain", "protein": 9, "carbs": 72, "fat": 4.5, "fiber": 2.1, "notes": "High energy, rich in Vitamin A"},
    "corn_white": {"category": "grain", "protein": 9, "carbs": 72, "fat": 4.5, "fiber": 1.9, "notes": "Standard corn, good energy source"},
    "corn_red": {"category": "grain", "protein": 9, "carbs": 72, "fat": 4.5, "fiber": 2.1, "notes": "Red corn variety, similar nutrition to yellow corn"},
    "maize": {"category": "grain", "protein": 9, "carbs": 72, "fat": 4.5, "fiber": 2.1, "notes": "Corn variety, high energy"},
    "popcorn": {"category": "grain", "protein": 13, "carbs": 74, "fat": 4, "fiber": 2.1, "notes": "Popcorn is not the same as corn nutritionally."},
    
    "barley": {"category": "grain", "protein": 11, "carbs": 73, "fat": 2, "fiber": 4.5, "notes": "Easily digestible, good for winter"},
    "barley_pearled": {"category": "grain", "protein": 10, "carbs": 78, "fat": 1, "fiber": 2.0, "notes": "Lower fiber than whole barley"},
    
    "oats": {"category": "grain", "protein": 13, "carbs": 66, "fat": 6, "fiber": 12.2, "notes": "High fiber, use sparingly"},
    "oat_groats": {"category": "grain", "protein": 17, "carbs": 66, "fat": 7, "fiber": 3.6, "notes": "Hulled oats, high fiber"},
    
    "milo": {"category": "grain", "protein": 11, "carbs": 73, "fat": 3, "fiber": 2.4, "notes": "Similar to corn, lacks Vitamin A"},
    "sorghum": {"category": "grain", "protein": 11, "carbs": 73, "fat": 3, "fiber": 2.4, "notes": "Same as milo"},
    "kaffir_corn": {"category": "grain", "protein": 11, "carbs": 73, "fat": 3, "fiber": 2.4, "notes": "Type of sorghum"},
    
    "rice": {"category": "grain", "protein": 7, "carbs": 80, "fat": 0.5, "fiber": 0.4, "notes": "Low protein, high carbs"},
    "rice_brown": {"category": "grain", "protein": 8, "carbs": 77, "fat": 2.5, "fiber": 1.8, "notes": "More fiber than white rice"},
    "rice_red": {"category": "grain", "protein": 7, "carbs": 79, "fat": 2, "fiber": 1.8, "notes": "Colored rice variety"},
    
    "rye": {"category": "grain", "protein": 15, "carbs": 76, "fat": 2, "fiber": 1.9, "notes": "High fiber, use sparingly"},
    "triticale": {"category": "grain", "protein": 13, "carbs": 72, "fat": 2, "fiber": 2.4, "notes": "Wheat-rye hybrid"},
    "spelt": {"category": "grain", "protein": 15, "carbs": 70, "fat": 2.5, "fiber": 2.3, "notes": "Ancient wheat variety"},
    "buckwheat": {"category": "grain", "protein": 13, "carbs": 72, "fat": 3, "fiber": 11.1, "notes": "Pseudo-grain, high fiber"},
    
    // ===== LEGUMES (Protein Sources) =====
    "peas": {"category": "legume", "protein": 23, "carbs": 60, "fat": 1.5, "fiber": 5.2, "notes": "Most essential ingredient"},
    "peas_field": {"category": "legume", "protein": 24, "carbs": 60, "fat": 1.5, "fiber": 5.2, "notes": "Canadian field peas, high protein"},
    "peas_canada": {"category": "legume", "protein": 24, "carbs": 60, "fat": 1.5, "fiber": 5.2, "notes": "High protein variety"},
    "peas_austrian": {"category": "legume", "protein": 24, "carbs": 60, "fat": 1.5, "fiber": 5.2, "notes": "Austrian winter peas"},
    "peas_green": {"category": "legume", "protein": 23, "carbs": 60, "fat": 1.5, "fiber": 5.2, "notes": "Standard green peas"},
    "peas_maple": {"category": "legume", "protein": 25, "carbs": 60, "fat": 1.5, "fiber": 5.2, "notes": "Maple peas variety"},
    "peas_yellow": {"category": "legume", "protein": 23, "carbs": 60, "fat": 1.5, "fiber": 5.2, "notes": "Yellow split peas"},
    "split_peas": {"category": "legume", "protein": 25, "carbs": 63, "fat": 0.4, "fiber": 5.2, "notes": "Can be fed raw or cooked"},
    
    "lentils": {"category": "legume", "protein": 25, "carbs": 63, "fat": 1, "fiber": 4.3, "notes": "Very high protein, safe uncooked"},
    "lentils_red": {"category": "legume", "protein": 26, "carbs": 63, "fat": 1, "fiber": 4.3, "notes": "Red lentils"},
    "lentils_green": {"category": "legume", "protein": 25, "carbs": 63, "fat": 1, "fiber": 4.3, "notes": "Green lentils"},
    "lentils_brown": {"category": "legume", "protein": 25, "carbs": 63, "fat": 1, "fiber": 4.3, "notes": "Brown lentils"},
    "split_lentils": {"category": "legume", "protein": 25, "carbs": 63, "fat": 1, "fiber": 4.3, "notes": "Split lentils, quick cooking"},
    
    "beans": {"category": "legume", "protein": 22, "carbs": 62, "fat": 1, "fiber": 4.6, "notes": "WARNING: Check bean type - kidney, lima, fava, navy, pinto beans contain hemagglutinin (TOXIC if raw). Only feed if cooked thoroughly. Safe raw: mung, black-eyed peas, chickpeas (cooked)."},
    "mung_beans": {"category": "legume", "protein": 24, "carbs": 63, "fat": 1, "fiber": 5.7, "notes": "Safe uncooked"},
    "black_eyed_peas": {"category": "legume", "protein": 24, "carbs": 60, "fat": 1, "fiber": 5.0, "notes": "Safe dry, high protein"},
    "chickpeas": {"category": "legume", "protein": 19, "carbs": 61, "fat": 6, "fiber": 3.5, "notes": "Cooked or properly processed; high fiber"},
    "fava_beans": {"category": "legume", "protein": 26, "carbs": 58, "fat": 1.5, "fiber": 7.9, "notes": "Must be cooked"},
    "navy_beans": {"category": "legume", "protein": 22, "carbs": 60, "fat": 1.5, "fiber": 4.6, "notes": "Must be cooked"},
    "kidney_beans": {"category": "legume", "protein": 24, "carbs": 60, "fat": 1, "fiber": 4.6, "notes": "Must be cooked, toxic raw"},
    "pinto_beans": {"category": "legume", "protein": 21, "carbs": 63, "fat": 1, "fiber": 4.6, "notes": "Must be cooked"},
    "adzuki_beans": {"category": "legume", "protein": 20, "carbs": 63, "fat": 0.5, "fiber": 3.6, "notes": "TOXIC RAW — cooked or properly processed small red beans only"},
    "lima_beans": {"category": "legume", "protein": 21, "carbs": 40, "fat": 0.7, "fiber": 4.6, "notes": "Must be cooked, toxic raw"},
    "black_beans": {"category": "legume", "protein": 21, "carbs": 62, "fat": 0.9, "fiber": 4.6, "notes": "Must be cooked, toxic raw"},
    
    "vetch": {"category": "legume", "protein": 24, "carbs": 60, "fat": 1.5, "fiber": 4.1, "notes": "Feed-grade heat-treated common vetch; high protein"},
    "lupins": {"category": "legume", "protein": 36, "carbs": 40, "fat": 9, "fiber": 12.1, "notes": "Feed-grade sweet lupins only; very high protein and fiber"},
    "soybeans": {"category": "legume", "protein": 36, "carbs": 30, "fat": 20, "fiber": 5.5, "notes": "Very high protein and fat"},
    
    // ===== SEEDS (Fat and Special Nutrients) =====
    "safflower": {"category": "seed", "protein": 16, "carbs": 34, "fat": 38, "fiber": 29.5, "notes": "King of seeds, high fat"},
    "sunflower": {"category": "seed", "protein": 20, "carbs": 20, "fat": 51, "fiber": 15.9, "notes": "Very high fat, black oil preferred"},
    "sunflower_hearts": {"category": "seed", "protein": 21, "carbs": 20, "fat": 51, "fiber": 9, "notes": "Hulled sunflower"},
    
    "linseed": {"category": "seed", "protein": 18, "carbs": 29, "fat": 42, "fiber": 9.5, "notes": "Omega-3, feather health, high fiber"},
    "flaxseed": {"category": "seed", "protein": 18, "carbs": 29, "fat": 42, "fiber": 9.5, "notes": "Same as linseed"},
    
    "hemp": {"category": "seed", "protein": 31, "carbs": 28, "fat": 49, "fiber": 14.9, "notes": "Omega-3 rich, excellent"},
    "hemp_hearts": {"category": "seed", "protein": 32, "carbs": 28, "fat": 49, "fiber": 4, "notes": "Hulled hemp seeds"},
    
    "millet": {"category": "seed", "protein": 11, "carbs": 73, "fat": 4, "fiber": 6.7, "notes": "Small seed, good carbs"},
    "millet_white": {"category": "seed", "protein": 11, "carbs": 73, "fat": 4, "fiber": 6.7, "notes": "White proso millet"},
    "millet_red": {"category": "seed", "protein": 11, "carbs": 73, "fat": 4, "fiber": 6.7, "notes": "Red millet variety"},
    "millet_silver": {"category": "seed", "protein": 11, "carbs": 73, "fat": 4, "fiber": 6.7, "notes": "Silver millet"},
    
    "canola": {"category": "seed", "protein": 20, "carbs": 24, "fat": 40, "fiber": 9.3, "notes": "Rapeseed, oil seed"},
    "rapeseed": {"category": "seed", "protein": 20, "carbs": 24, "fat": 40, "fiber": 9.3, "notes": "Same as canola"},
    
    "niger": {"category": "seed", "protein": 20, "carbs": 18, "fat": 40, "fiber": 14.8, "notes": "Nyjer/thistle seed, high fat"},
    "nyjer": {"category": "seed", "protein": 20, "carbs": 18, "fat": 40, "fiber": 14.8, "notes": "Same as niger seed"},
    
    "sesame": {"category": "seed", "protein": 18, "carbs": 23, "fat": 50, "fiber": 8.6, "notes": "High fat and calcium"},
    "chia": {"category": "seed", "protein": 17, "carbs": 42, "fat": 31, "fiber": 34, "notes": "Omega-3, very high fiber"},
    "pumpkin_seeds": {"category": "seed", "protein": 30, "carbs": 10, "fat": 49, "fiber": 2.1, "notes": "Pepitas, high protein"},
    "pepitas": {"category": "seed", "protein": 30, "carbs": 10, "fat": 49, "fiber": 2.1, "notes": "Pumpkin seeds"},
    "peanuts": {"category": "seed", "protein": 26, "carbs": 16, "fat": 49, "fiber": 4.2, "notes": "Bird-feed source; high-fat treat, not a staple"},
    "peanuts_raw": {"category": "seed", "protein": 26, "carbs": 16, "fat": 49, "fiber": 4.2, "notes": "Plain bird-feed source; high-fat treat, not a staple"},
    "peanuts_roasted": {"category": "seed", "protein": 26, "carbs": 16, "fat": 49, "fiber": 4.2, "notes": "Plain bird-feed dry-roasted peanuts; high-fat treat, not a staple"},
};


export const HERB_RECOMMENDATIONS: Record<string, { recommended: string[]; notes: string }> = {
    "pet": {
        "recommended": ["chamomile", "fennel", "anise", "oregano", "thyme", "garlic_oil"],
        "notes": "Stress relief, digestive health, odor reduction, general wellness for companion birds; garlic oil is an occasional pigeon-only option"
    },
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
