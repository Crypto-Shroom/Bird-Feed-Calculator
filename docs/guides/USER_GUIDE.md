# Pigeon Seed Mix Calculator - User Guide

## Overview

The Pigeon Seed Mix Calculator is a Python program that helps you create optimal seed mixes for your pigeons based on available ingredients and their specific needs (racing, breeding, molting, winter, or maintenance).

> Location: `python-package/pigeon_mix_calculator/` — run commands from that folder so local imports resolve cleanly.

## Features

✓ **Optimized Mix Calculations** - Automatically calculates the best possible mix from your available ingredients  
✓ **Situation-Specific Profiles** - Tailored nutritional targets for racing, breeding, molting, winter, and maintenance  
✓ **Nutritional Analysis** - Complete breakdown of protein, carbohydrates, fat, and fiber  
✓ **Warning System** - Alerts you to critical deficiencies or imbalances  
✓ **Smart Suggestions** - Recommendations to improve your mix  
✓ **Printable Recipe Cards** - Professional formatted output you can save and print  

## Quick Start

### Running the Interactive Program

```bash
python3 pigeon_mix_calculator.py
```

The program will guide you through:
1. Selecting your pigeon's situation (racing, breeding, molting, winter, maintenance)
2. Entering your available ingredients and amounts
3. Specifying desired batch size
4. Generating an optimized mix with recipe card

### Example Session

```
Select pigeon situation:
  1. Maintenance/Rest
  2. Racing/Performance
  3. Breeding/Brooding
  4. Molting Season
  5. Winter Season

Enter choice (1-5): 2

Enter your available ingredients (type 'done' when finished):
Format: ingredient_name amount_in_grams

Ingredient: wheat 5000
  Added: wheat - 5000g
Ingredient: corn 3000
  Added: corn - 3000g
Ingredient: peas 2000
  Added: peas - 2000g
Ingredient: safflower 500
  Added: safflower - 500g
Ingredient: done

Enter desired batch size in grams (default 1000): 1500

Calculating optimal mix...
```

## Supported Ingredients

### Grains (Energy Sources)
- **Wheat** - Higher protein grain, improves fertility
- **Corn (Yellow)** - Essential for Vitamin A, primary energy source
- **Corn (White)** - Avoid if possible, lacks Vitamin A
- **Barley** - Easily digestible, good energy
- **Milo** - Similar to corn, lacks Vitamin A
- **Oats** - High fiber, use sparingly

### Legumes (Protein Sources)
- **Peas** - Most essential ingredient, high protein and vitamins
- **Peas (Field/Canada)** - High protein varieties
- **Lentils** - Very high protein
- **Beans** - Must be cooked (except peas, lentils, mung beans)
- **Mung Beans** - Safe uncooked

### Seeds (Fat and Special Nutrients)
- **Safflower** - "King of seeds", high fat
- **Sunflower** - Very high fat
- **Linseed/Flaxseed** - Omega-3, feather health
- **Hemp** - Omega-3 rich
- **Millet** - Small seed
- **Canola** - Oil seed

## Pigeon Situations Explained

### 1. Maintenance/Rest
**When to use:** Off-season, general care  
**Target nutrition:** 13.5-15% protein, 60-70% carbs, 2-5% fat  
**Mix composition:** 60-70% grains, 15-20% legumes, 10-15% seeds  
**Feeding:** 30-40g per bird per day

### 2. Racing/Performance
**When to use:** Training and racing season  
**Target nutrition:** 16-18% protein, 60-65% carbs, 2-5% fat  
**Mix composition:** 40-50% grains, 40-50% legumes, 5-10% seeds  
**Feeding:** 40-50g per bird per day  
**Special note:** Increase peas for long races (300+ miles)

### 3. Breeding/Brooding
**When to use:** Egg laying and raising squabs  
**Target nutrition:** 14-16% protein, 60-70% carbs, 3-6% fat  
**Mix composition:** 60-65% grains, 20-25% legumes, 10-15% seeds  
**Feeding:** 35-45g per bird per day  
**Special additions:** Flaxseed oil coating, whey protein

### 4. Molting Season
**When to use:** During feather renewal (typically after racing season)  
**Target nutrition:** 16-18% protein (high), 55-65% carbs, 3-6% fat  
**Mix composition:** 55-60% grains, 25-30% legumes, 10-15% seeds  
**Feeding:** 35-45g per bird per day  
**Special needs:** Sulphur amino acids for feather growth, brewer's yeast  
**Care:** Provide bathing opportunities 1-2x per week

### 5. Winter Season
**When to use:** Cold weather months  
**Target nutrition:** 12-14% protein, 65-75% carbs, 5-8% fat (higher for warmth)  
**Mix composition:** 70-75% grains, 10-15% legumes, 10-15% seeds  
**Feeding:** 30-40g per bird per day, twice daily  
**Special needs:** Up to 30% more energy for body heat  
**Recommended:** Add oil seeds (hemp, sunflower) up to 10%

## Understanding the Recipe Card

### Ingredients Section
Shows each ingredient with amount in grams and percentage of total mix.

### Nutritional Analysis
Displays actual values vs. target ranges for:
- **Protein** - For muscle, tissue repair, feather growth
- **Carbohydrates** - Primary energy source
- **Fat** - Energy reserves, warmth, feather condition
- **Fiber** - Should be low (<5%) as pigeons don't utilize it well

### Category Breakdown
Shows the balance between:
- **Grains** - Energy foundation
- **Legumes** - Protein and vitamins
- **Seeds** - Fats and special nutrients

### Warnings

**CRITICAL Warnings** (require immediate attention):
- Missing essential categories (no legumes or grains)
- Protein too low (<10%) or too high (>20%)
- Fiber too high (>7%)
- Very limited diversity (≤2 ingredients)

**Advisory Warnings** (should address when possible):
- Missing yellow corn (Vitamin A risk)
- Low fat content
- Limited diversity (<4 ingredients)
- Nutritional targets off by >15%

### Suggestions
Actionable recommendations to improve your mix, such as:
- Adding specific ingredients to balance nutrition
- Reducing high-fiber ingredients
- Situation-specific adjustments

## Using the Calculator Programmatically

You can also import and use the calculator in your own Python scripts:

```python
from pigeon_mix_calculator import PigeonMixCalculator

# Define your inventory
inventory = {
    "wheat": 5000,
    "corn_yellow": 3000,
    "peas": 2000,
    "lentils": 1000,
    "safflower": 500
}

# Create calculator for racing situation
calculator = PigeonMixCalculator(inventory, situation="racing")

# Calculate optimal mix for 1500g batch
mix, recipe_card = calculator.calculate(target_weight=1500)

# Print recipe card
print(recipe_card)

# Access the mix dictionary
for ingredient, amount in mix.items():
    print(f"{ingredient}: {amount}g")

# Save to file
with open("my_racing_mix.txt", "w") as f:
    f.write(recipe_card)
```

## Tips for Best Results

1. **Use Yellow Corn** - Essential for Vitamin A, always try to include it
2. **Don't Skip Legumes** - Peas are the most essential ingredient
3. **Variety is Key** - Aim for at least 4-5 different ingredients
4. **Match the Situation** - Use the right profile for your pigeon's current needs
5. **Monitor Fiber** - Keep it under 5% for optimal digestion
6. **Adjust Seasonally** - Switch profiles as seasons and activities change
7. **Keep Records** - Save recipe cards to track what works best

## Troubleshooting

**Q: The calculator says I need more legumes, but I don't have any.**  
A: Legumes (peas, lentils) are essential for protein. You should acquire some before making a mix, or the calculator will warn you about critical deficiencies.

**Q: My mix has high fiber (>5%). What should I do?**  
A: Reduce high-fiber ingredients like oats, linseed, or safflower. The calculator will suggest which ones to reduce.

**Q: Can I use this for doves or other birds?**  
A: The calculator is optimized for pigeons. Doves have similar needs, but other birds may require different nutritional profiles.

**Q: The ingredient I have isn't recognized. What do I do?**  
A: The calculator has fuzzy matching for common variations (e.g., "yellow corn" → "corn_yellow"). If your ingredient isn't in the database, you can edit the INGREDIENTS dictionary in the Python file to add it with its nutritional values.

**Q: How do I convert kg to grams?**  
A: Multiply by 1000. For example, 2.5 kg = 2500 grams.

## Nutritional Reference

### Target Ranges Summary

| Situation   | Protein | Carbs  | Fat   | Grains | Legumes | Seeds  |
|-------------|---------|--------|-------|--------|---------|--------|
| Maintenance | 13.5-15%| 60-70% | 2-5%  | 60-70% | 15-20%  | 10-15% |
| Racing      | 16-18%  | 60-65% | 2-5%  | 40-50% | 40-50%  | 5-10%  |
| Breeding    | 14-16%  | 60-70% | 3-6%  | 60-65% | 20-25%  | 10-15% |
| Molting     | 16-18%  | 55-65% | 3-6%  | 55-60% | 25-30%  | 10-15% |
| Winter      | 12-14%  | 65-75% | 5-8%  | 70-75% | 10-15%  | 10-15% |

### Ingredient Nutritional Values (per 100g)

| Ingredient  | Category | Protein | Carbs | Fat  | Fiber | Notes                    |
|-------------|----------|---------|-------|------|-------|--------------------------|
| Wheat       | Grain    | 13.5%   | 71%   | 2%   | 3%    | Higher protein grain     |
| Corn Yellow | Grain    | 9%      | 74%   | 4.5% | 2.5%  | Vitamin A source         |
| Barley      | Grain    | 11%     | 73%   | 2%   | 5%    | Easily digestible        |
| Peas        | Legume   | 23%     | 60%   | 1.5% | 5%    | Most essential           |
| Lentils     | Legume   | 25%     | 63%   | 1%   | 8%    | Very high protein        |
| Safflower   | Seed     | 16%     | 34%   | 38%  | 9%    | King of seeds            |
| Sunflower   | Seed     | 20%     | 20%   | 51%  | 9%    | Very high fat            |
| Linseed     | Seed     | 18%     | 29%   | 42%  | 27%   | Omega-3, feather health  |

## Support and Feedback

This calculator is based on research from pigeon nutrition experts and racing pigeon fanciers. The nutritional targets are general guidelines - always observe your birds and adjust as needed based on their condition and performance.

For questions or to report issues, please refer to the research notes included with this program.

## Version Information

**Version:** 1.0  
**Last Updated:** December 2025  
**Python Version Required:** 3.11 or higher  
**Dependencies:** Standard library only (no external packages required)

---

**Happy mixing! May your pigeons thrive!** 🕊️
