// Expanded Ingredient Database for Pigeon Mix Calculator
// Includes all pigeon-safe grains, legumes, seeds, and herbs/supplements

export type { Ingredient } from "./ingredient-records";
export { INGREDIENTS } from "./ingredient-records";

export type { Herb } from "./herb-content";
export { HERBS_SUPPLEMENTS } from "./herb-content";

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
