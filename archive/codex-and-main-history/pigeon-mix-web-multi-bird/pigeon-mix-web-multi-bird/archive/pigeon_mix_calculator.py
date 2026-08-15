#!/usr/bin/env python3
"""
Pigeon Seed Mix Calculator
Optimizes seed mixes based on available ingredients and pigeon situation
"""

from datetime import datetime
from typing import Dict, List, Tuple
import itertools

# Ingredient database with nutritional values
INGREDIENTS = {
    # Grains
    "wheat": {"category": "grain", "protein": 13.5, "carbs": 71, "fat": 2, "fiber": 3, "notes": "Higher protein grain"},
    "corn_yellow": {"category": "grain", "protein": 9, "carbs": 74, "fat": 4.5, "fiber": 2.5, "notes": "Vitamin A source, essential"},
    "corn_white": {"category": "grain", "protein": 9, "carbs": 74, "fat": 4.5, "fiber": 2.5, "notes": "Avoid - lacks Vitamin A"},
    "barley": {"category": "grain", "protein": 11, "carbs": 73, "fat": 2, "fiber": 5, "notes": "Easily digestible"},
    "milo": {"category": "grain", "protein": 11, "carbs": 73, "fat": 3, "fiber": 2, "notes": "Similar to corn, lacks Vitamin A"},
    "oats": {"category": "grain", "protein": 13, "carbs": 66, "fat": 6, "fiber": 10, "notes": "High fiber, use sparingly"},
    
    # Legumes
    "peas": {"category": "legume", "protein": 23, "carbs": 60, "fat": 1.5, "fiber": 5, "notes": "Most essential ingredient"},
    "peas_field": {"category": "legume", "protein": 24, "carbs": 60, "fat": 1.5, "fiber": 5, "notes": "High protein"},
    "peas_canada": {"category": "legume", "protein": 24, "carbs": 60, "fat": 1.5, "fiber": 5, "notes": "High protein"},
    "lentils": {"category": "legume", "protein": 25, "carbs": 63, "fat": 1, "fiber": 8, "notes": "Very high protein"},
    "beans": {"category": "legume", "protein": 22, "carbs": 62, "fat": 1, "fiber": 6, "notes": "Must be cooked"},
    "mung_beans": {"category": "legume", "protein": 24, "carbs": 63, "fat": 1, "fiber": 7, "notes": "Safe uncooked"},
    
    # Seeds
    "safflower": {"category": "seed", "protein": 16, "carbs": 34, "fat": 38, "fiber": 9, "notes": "High fat, king of seeds"},
    "sunflower": {"category": "seed", "protein": 20, "carbs": 20, "fat": 51, "fiber": 9, "notes": "Very high fat"},
    "linseed": {"category": "seed", "protein": 18, "carbs": 29, "fat": 42, "fiber": 27, "notes": "Omega-3, feather health"},
    "flaxseed": {"category": "seed", "protein": 18, "carbs": 29, "fat": 42, "fiber": 27, "notes": "Same as linseed"},
    "hemp": {"category": "seed", "protein": 31, "carbs": 28, "fat": 49, "fiber": 4, "notes": "Omega-3 rich"},
    "millet": {"category": "seed", "protein": 11, "carbs": 73, "fat": 4, "fiber": 3, "notes": "Small seed"},
    "canola": {"category": "seed", "protein": 20, "carbs": 24, "fat": 40, "fiber": 12, "notes": "Oil seed"},
}

# Target profiles for different situations
PROFILES = {
    "maintenance": {
        "name": "Maintenance/Rest",
        "protein": (13.5, 15),
        "carbs": (60, 70),
        "fat": (2, 5),
        "fiber": (0, 5),
        "category_ratios": {"grain": (60, 70), "legume": (15, 20), "seed": (10, 15)},
        "feeding_notes": "Feed 30-40g per bird per day. Light feeding in morning, standard mix in evening."
    },
    "racing": {
        "name": "Racing/Performance",
        "protein": (16, 18),
        "carbs": (60, 65),
        "fat": (2, 5),
        "fiber": (0, 5),
        "category_ratios": {"grain": (40, 50), "legume": (40, 50), "seed": (5, 10)},
        "feeding_notes": "Feed 40-50g per bird per day. High protein for performance. Increase peas for long races."
    },
    "breeding": {
        "name": "Breeding/Brooding",
        "protein": (14, 16),
        "carbs": (60, 70),
        "fat": (3, 6),
        "fiber": (0, 5),
        "category_ratios": {"grain": (60, 65), "legume": (20, 25), "seed": (10, 15)},
        "feeding_notes": "Feed 35-45g per bird per day. Add flaxseed oil coating. Support egg production and squab growth."
    },
    "molting": {
        "name": "Molting Season",
        "protein": (16, 18),
        "carbs": (55, 65),
        "fat": (3, 6),
        "fiber": (0, 5),
        "category_ratios": {"grain": (55, 60), "legume": (25, 30), "seed": (10, 15)},
        "feeding_notes": "Feed 35-45g per bird per day. High protein for feather growth. Add brewer's yeast. Provide bathing 1-2x/week."
    },
    "winter": {
        "name": "Winter Season",
        "protein": (12, 14),
        "carbs": (65, 75),
        "fat": (5, 8),
        "fiber": (0, 5),
        "category_ratios": {"grain": (70, 75), "legume": (10, 15), "seed": (10, 15)},
        "feeding_notes": "Feed 30-40g per bird per day, twice daily. High energy for warmth. Add oil seeds (hemp, sunflower) up to 10%."
    }
}


class PigeonMixCalculator:
    def __init__(self, inventory: Dict[str, float], situation: str = "maintenance"):
        """
        Initialize calculator with inventory and situation
        
        Args:
            inventory: Dict of ingredient_name: amount_in_grams
            situation: One of 'maintenance', 'racing', 'breeding', 'molting', 'winter'
        """
        self.inventory = {k.lower(): v for k, v in inventory.items()}
        self.situation = situation.lower()
        self.profile = PROFILES.get(self.situation, PROFILES["maintenance"])
        self.warnings = []
        self.suggestions = []
        
    def normalize_ingredient_name(self, name: str) -> str:
        """Try to match ingredient name to database"""
        name = name.lower().strip()
        
        # Direct match
        if name in INGREDIENTS:
            return name
            
        # Fuzzy matching
        if "yellow" in name and "corn" in name:
            return "corn_yellow"
        if "white" in name and "corn" in name:
            return "corn_white"
        if "corn" in name:
            return "corn_yellow"  # Default to yellow
        if "flax" in name:
            return "flaxseed"
        if "field" in name and "pea" in name:
            return "peas_field"
        if "canada" in name and "pea" in name:
            return "peas_canada"
        if "pea" in name:
            return "peas"
        if "mung" in name:
            return "mung_beans"
        if "bean" in name:
            return "beans"
        if "lentil" in name:
            return "lentils"
        if "sunflower" in name:
            return "sunflower"
        if "safflower" in name:
            return "safflower"
        if "linseed" in name or "linum" in name:
            return "linseed"
            
        return name
    
    def get_available_ingredients(self) -> Dict[str, dict]:
        """Get available ingredients from inventory"""
        available = {}
        for name, amount in self.inventory.items():
            normalized = self.normalize_ingredient_name(name)
            if normalized in INGREDIENTS and amount > 0:
                available[normalized] = {
                    **INGREDIENTS[normalized],
                    "available": amount
                }
        return available
    
    def calculate_nutrition(self, mix: Dict[str, float]) -> Dict[str, float]:
        """Calculate nutritional values for a mix"""
        total_weight = sum(mix.values())
        if total_weight == 0:
            return {"protein": 0, "carbs": 0, "fat": 0, "fiber": 0}
        
        nutrition = {"protein": 0, "carbs": 0, "fat": 0, "fiber": 0}
        
        for ingredient, amount in mix.items():
            if ingredient in INGREDIENTS:
                weight_ratio = amount / total_weight
                nutrition["protein"] += INGREDIENTS[ingredient]["protein"] * weight_ratio
                nutrition["carbs"] += INGREDIENTS[ingredient]["carbs"] * weight_ratio
                nutrition["fat"] += INGREDIENTS[ingredient]["fat"] * weight_ratio
                nutrition["fiber"] += INGREDIENTS[ingredient]["fiber"] * weight_ratio
        
        return nutrition
    
    def calculate_category_ratios(self, mix: Dict[str, float]) -> Dict[str, float]:
        """Calculate category ratios for a mix"""
        total_weight = sum(mix.values())
        if total_weight == 0:
            return {"grain": 0, "legume": 0, "seed": 0}
        
        categories = {"grain": 0, "legume": 0, "seed": 0}
        
        for ingredient, amount in mix.items():
            if ingredient in INGREDIENTS:
                category = INGREDIENTS[ingredient]["category"]
                categories[category] += amount
        
        # Convert to percentages
        return {cat: (amt / total_weight) * 100 for cat, amt in categories.items()}
    
    def score_mix(self, mix: Dict[str, float]) -> float:
        """Score a mix based on how well it matches target profile"""
        nutrition = self.calculate_nutrition(mix)
        categories = self.calculate_category_ratios(mix)
        
        # Protein score
        target_protein = sum(self.profile["protein"]) / 2
        protein_score = max(0, 1 - abs(nutrition["protein"] - target_protein) / target_protein)
        
        # Carbs score
        target_carbs = sum(self.profile["carbs"]) / 2
        carbs_score = max(0, 1 - abs(nutrition["carbs"] - target_carbs) / target_carbs)
        
        # Fat score
        target_fat = sum(self.profile["fat"]) / 2
        fat_score = max(0, 1 - abs(nutrition["fat"] - target_fat) / target_fat)
        
        # Fiber score (lower is better, penalize if over 5%)
        fiber_score = 1.0 if nutrition["fiber"] < 5 else max(0, 1 - (nutrition["fiber"] - 5) / 5)
        
        # Category ratio score
        category_score = 0
        for cat, (min_ratio, max_ratio) in self.profile["category_ratios"].items():
            target_ratio = (min_ratio + max_ratio) / 2
            actual_ratio = categories.get(cat, 0)
            category_score += max(0, 1 - abs(actual_ratio - target_ratio) / target_ratio)
        category_score /= 3  # Average across 3 categories
        
        # Diversity bonus
        diversity_score = min(1.0, len(mix) / 5)  # Reward up to 5 ingredients
        
        # Total score
        total_score = (
            protein_score * 0.30 +
            carbs_score * 0.25 +
            fat_score * 0.15 +
            fiber_score * 0.10 +
            category_score * 0.15 +
            diversity_score * 0.05
        )
        
        return total_score
    
    def generate_mix_candidates(self, available: Dict[str, dict], target_weight: float = 1000) -> List[Dict[str, float]]:
        """Generate candidate mixes to evaluate"""
        candidates = []
        ingredient_names = list(available.keys())
        
        # Try different combinations
        for n_ingredients in range(min(3, len(ingredient_names)), min(8, len(ingredient_names)) + 1):
            for combo in itertools.combinations(ingredient_names, n_ingredients):
                # Generate several ratio variations for this combination
                for _ in range(10):
                    mix = {}
                    remaining = target_weight
                    
                    for i, ing in enumerate(combo):
                        if i == len(combo) - 1:
                            # Last ingredient gets remainder
                            amount = min(remaining, available[ing]["available"])
                        else:
                            # Random proportion
                            import random
                            max_amount = min(remaining * 0.7, available[ing]["available"])
                            amount = random.uniform(remaining * 0.05, max_amount)
                        
                        mix[ing] = amount
                        remaining -= amount
                    
                    # Normalize to target weight
                    actual_total = sum(mix.values())
                    if actual_total > 0:
                        scale = min(target_weight / actual_total, 1.0)
                        mix = {k: v * scale for k, v in mix.items()}
                        
                        # Check if we have enough of each ingredient
                        if all(mix[ing] <= available[ing]["available"] for ing in mix):
                            candidates.append(mix)
        
        return candidates
    
    def optimize_mix(self, target_weight: float = 1000) -> Dict[str, float]:
        """Find the best mix from available ingredients"""
        available = self.get_available_ingredients()
        
        if not available:
            return {}
        
        # Generate candidates
        candidates = self.generate_mix_candidates(available, target_weight)
        
        if not candidates:
            # Fallback: use all available ingredients proportionally
            total_available = sum(ing["available"] for ing in available.values())
            scale = min(target_weight / total_available, 1.0)
            return {name: data["available"] * scale for name, data in available.items()}
        
        # Score and select best
        best_mix = max(candidates, key=self.score_mix)
        return best_mix
    
    def check_warnings(self, mix: Dict[str, float]):
        """Generate warnings based on mix composition"""
        self.warnings = []
        available = self.get_available_ingredients()
        nutrition = self.calculate_nutrition(mix)
        categories = self.calculate_category_ratios(mix)
        
        # Critical warnings
        if categories.get("legume", 0) < 5:
            self.warnings.append(("CRITICAL", "No legumes in mix - essential for protein and vitamins!"))
        
        if categories.get("grain", 0) < 30:
            self.warnings.append(("CRITICAL", "Insufficient grains - essential for energy!"))
        
        if nutrition["protein"] < 10:
            self.warnings.append(("CRITICAL", f"Protein too low ({nutrition['protein']:.1f}%) - minimum 10% needed"))
        
        if nutrition["protein"] > 20:
            self.warnings.append(("CRITICAL", f"Protein too high ({nutrition['protein']:.1f}%) - can stress kidneys"))
        
        if nutrition["fiber"] > 7:
            self.warnings.append(("CRITICAL", f"Fiber too high ({nutrition['fiber']:.1f}%) - pigeons don't utilize fiber well"))
        
        if len(mix) <= 2:
            self.warnings.append(("CRITICAL", "Very limited diversity - need at least 3-4 ingredients"))
        
        # Advisory warnings
        if "corn_yellow" not in mix and "corn_yellow" not in available:
            self.warnings.append(("WARNING", "No yellow corn - risk of Vitamin A deficiency"))
        
        if categories.get("seed", 0) < 3 and nutrition["fat"] < 3:
            self.warnings.append(("WARNING", "No oil seeds - fat content may be low"))
        
        if len(mix) < 4:
            self.warnings.append(("WARNING", "Limited diversity - consider adding more ingredients"))
        
        # Check against target profile
        target_protein = sum(self.profile["protein"]) / 2
        if abs(nutrition["protein"] - target_protein) / target_protein > 0.15:
            self.warnings.append(("WARNING", f"Protein ({nutrition['protein']:.1f}%) differs from target ({target_protein:.1f}%) by >15%"))
    
    def generate_suggestions(self, mix: Dict[str, float]):
        """Generate suggestions for improving the mix"""
        self.suggestions = []
        available = self.get_available_ingredients()
        nutrition = self.calculate_nutrition(mix)
        categories = self.calculate_category_ratios(mix)
        
        # Suggest adding missing categories
        if categories.get("legume", 0) < 15:
            legumes_available = [name for name, data in available.items() 
                               if data["category"] == "legume" and name not in mix]
            if legumes_available:
                self.suggestions.append(f"Add {legumes_available[0]} to increase protein and legume content")
        
        if categories.get("seed", 0) < 5 and self.situation in ["breeding", "molting", "winter"]:
            seeds_available = [name for name, data in available.items() 
                             if data["category"] == "seed" and name not in mix]
            if seeds_available:
                self.suggestions.append(f"Add {seeds_available[0]} to increase fat content (important for {self.situation})")
        
        # Suggest yellow corn if missing
        if "corn_yellow" not in mix and "corn_yellow" in available:
            self.suggestions.append("Add yellow corn for Vitamin A (essential nutrient)")
        
        # Suggest reducing high-fiber ingredients
        if nutrition["fiber"] > 5:
            high_fiber = [(ing, INGREDIENTS[ing]["fiber"]) for ing in mix 
                         if INGREDIENTS[ing]["fiber"] > 7]
            if high_fiber:
                worst = max(high_fiber, key=lambda x: x[1])
                self.suggestions.append(f"Reduce {worst[0]} to lower fiber content")
        
        # Situation-specific suggestions
        if self.situation == "racing" and categories.get("legume", 0) < 35:
            self.suggestions.append("For racing, increase peas/legumes to 40-50% for better performance")
        
        if self.situation == "winter" and nutrition["fat"] < 5:
            self.suggestions.append("For winter, add more oil seeds (hemp, sunflower) for warmth")
        
        if self.situation == "molting" and nutrition["protein"] < 16:
            self.suggestions.append("For molting, increase protein to 16%+ with more legumes")
    
    def format_recipe_card(self, mix: Dict[str, float]) -> str:
        """Generate a printable recipe card"""
        nutrition = self.calculate_nutrition(mix)
        categories = self.calculate_category_ratios(mix)
        total_weight = sum(mix.values())
        
        card = []
        card.append("═" * 65)
        card.append("        PIGEON SEED MIX RECIPE CARD".center(65))
        card.append("═" * 65)
        card.append("")
        card.append(f"Situation: {self.profile['name']}")
        card.append(f"Total Batch Size: {total_weight:.0f}g")
        card.append(f"Date: {datetime.now().strftime('%Y-%m-%d')}")
        card.append("")
        
        card.append("INGREDIENTS:")
        card.append("─" * 65)
        card.append(f"  {'Ingredient':<25} {'Amount':>12} {'Percentage':>12}")
        card.append("─" * 65)
        
        for ingredient in sorted(mix.keys()):
            amount = mix[ingredient]
            percentage = (amount / total_weight) * 100
            display_name = ingredient.replace("_", " ").title()
            card.append(f"  {display_name:<25} {amount:>10.0f}g {percentage:>11.1f}%")
        
        card.append("")
        card.append("NUTRITIONAL ANALYSIS:")
        card.append("─" * 65)
        
        p_min, p_max = self.profile["protein"]
        c_min, c_max = self.profile["carbs"]
        f_min, f_max = self.profile["fat"]
        
        card.append(f"  Protein:        {nutrition['protein']:>6.1f}%    (Target: {p_min:.1f}-{p_max:.1f}%)")
        card.append(f"  Carbohydrates:  {nutrition['carbs']:>6.1f}%    (Target: {c_min:.0f}-{c_max:.0f}%)")
        card.append(f"  Fat:            {nutrition['fat']:>6.1f}%    (Target: {f_min:.1f}-{f_max:.1f}%)")
        card.append(f"  Fiber:          {nutrition['fiber']:>6.1f}%    (Target: <5%)")
        
        card.append("")
        card.append("CATEGORY BREAKDOWN:")
        card.append("─" * 65)
        
        for cat, (min_r, max_r) in self.profile["category_ratios"].items():
            actual = categories.get(cat, 0)
            card.append(f"  {cat.title()+'s:':<16} {actual:>6.1f}%    (Target: {min_r:.0f}-{max_r:.0f}%)")
        
        card.append("")
        card.append("FEEDING INSTRUCTIONS:")
        card.append("─" * 65)
        for line in self.profile["feeding_notes"].split(". "):
            card.append(f"  • {line.strip()}")
        
        if self.warnings or self.suggestions:
            card.append("")
            card.append("NOTES:")
            card.append("─" * 65)
            
            for level, warning in self.warnings:
                prefix = "⚠ CRITICAL:" if level == "CRITICAL" else "⚡ Warning:"
                card.append(f"  {prefix} {warning}")
            
            if self.suggestions:
                card.append("")
                card.append("  Suggestions for improvement:")
                for suggestion in self.suggestions:
                    card.append(f"  • {suggestion}")
        
        card.append("")
        card.append("═" * 65)
        
        return "\n".join(card)
    
    def calculate(self, target_weight: float = 1000) -> Tuple[Dict[str, float], str]:
        """
        Main calculation method
        
        Args:
            target_weight: Desired batch size in grams
            
        Returns:
            (mix_dict, recipe_card_string)
        """
        mix = self.optimize_mix(target_weight)
        self.check_warnings(mix)
        self.generate_suggestions(mix)
        recipe_card = self.format_recipe_card(mix)
        
        return mix, recipe_card


def main():
    """Interactive CLI for the calculator"""
    print("=" * 65)
    print("PIGEON SEED MIX CALCULATOR".center(65))
    print("=" * 65)
    print()
    
    # Get situation
    print("Select pigeon situation:")
    for i, (key, profile) in enumerate(PROFILES.items(), 1):
        print(f"  {i}. {profile['name']}")
    
    while True:
        try:
            choice = int(input("\nEnter choice (1-5): "))
            if 1 <= choice <= 5:
                situation = list(PROFILES.keys())[choice - 1]
                break
        except ValueError:
            pass
        print("Invalid choice. Please enter 1-5.")
    
    print(f"\nSelected: {PROFILES[situation]['name']}")
    print()
    
    # Get inventory
    print("Enter your available ingredients (type 'done' when finished):")
    print("Format: ingredient_name amount_in_grams")
    print("Example: wheat 5000")
    print()
    
    inventory = {}
    while True:
        line = input("Ingredient: ").strip()
        if line.lower() == 'done':
            break
        
        parts = line.split()
        if len(parts) >= 2:
            name = " ".join(parts[:-1])
            try:
                amount = float(parts[-1])
                inventory[name] = amount
                print(f"  Added: {name} - {amount}g")
            except ValueError:
                print("  Invalid amount. Please try again.")
        else:
            print("  Invalid format. Use: ingredient_name amount")
    
    if not inventory:
        print("\nNo ingredients entered. Using example inventory.")
        inventory = {
            "wheat": 5000,
            "corn_yellow": 3000,
            "peas": 2000,
            "lentils": 1000,
            "safflower": 500,
            "barley": 2000
        }
    
    # Get target batch size
    print()
    batch_size = input("Enter desired batch size in grams (default 1000): ").strip()
    try:
        batch_size = float(batch_size) if batch_size else 1000
    except ValueError:
        batch_size = 1000
    
    # Calculate
    print("\nCalculating optimal mix...")
    print()
    
    calculator = PigeonMixCalculator(inventory, situation)
    mix, recipe_card = calculator.calculate(batch_size)
    
    # Display results
    print(recipe_card)
    
    # Save to file
    filename = f"pigeon_mix_{situation}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    with open(filename, 'w') as f:
        f.write(recipe_card)
    
    print(f"\nRecipe card saved to: {filename}")
    print()


if __name__ == "__main__":
    main()
