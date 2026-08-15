# Pigeon Seed Mix Calculator

A Python-based calculator that optimizes pigeon seed mixes based on available ingredients and specific pigeon situations (racing, breeding, molting, winter, maintenance).

## Features

- **Intelligent Mix Optimization** - Calculates the best possible mix from your available ingredients using a weighted scoring algorithm
- **Situation-Specific Profiles** - Five different nutritional profiles tailored to pigeon needs
- **Complete Nutritional Analysis** - Detailed breakdown of protein, carbohydrates, fat, and fiber
- **Warning System** - Alerts for critical deficiencies and nutritional imbalances
- **Smart Suggestions** - Actionable recommendations to improve your mix
- **Printable Recipe Cards** - Professional formatted output for easy reference
- **No External Dependencies** - Uses only Python standard library

## Quick Start

### Interactive Mode

```bash
python3 pigeon_mix_calculator.py
```

Follow the prompts to:
1. Select pigeon situation (racing, breeding, molting, winter, maintenance)
2. Enter available ingredients and amounts in grams
3. Specify desired batch size
4. Get optimized mix with recipe card

### Programmatic Use

```python
from pigeon_mix_calculator import PigeonMixCalculator

inventory = {
    "wheat": 5000,
    "corn_yellow": 3000,
    "peas": 2000,
    "safflower": 500
}

calculator = PigeonMixCalculator(inventory, situation="racing")
mix, recipe_card = calculator.calculate(target_weight=1000)
print(recipe_card)
```

## Supported Situations

1. **Maintenance/Rest** - Off-season general care (13.5-15% protein)
2. **Racing/Performance** - Training and competition (16-18% protein)
3. **Breeding/Brooding** - Egg laying and raising squabs (14-16% protein)
4. **Molting Season** - Feather renewal period (16-18% protein, high amino acids)
5. **Winter Season** - Cold weather (12-14% protein, higher fat for warmth)

## Supported Ingredients

### Grains
Wheat, Yellow Corn, White Corn, Barley, Milo, Oats

### Legumes
Peas (Field/Canada), Lentils, Beans, Mung Beans

### Seeds
Safflower, Sunflower, Linseed/Flaxseed, Hemp, Millet, Canola

## Example Output

```
═════════════════════════════════════════════════════════════════
                       PIGEON SEED MIX RECIPE CARD               
═════════════════════════════════════════════════════════════════

Situation: Racing/Performance
Total Batch Size: 1000g
Date: 2025-12-01

INGREDIENTS:
─────────────────────────────────────────────────────────────────
  Ingredient                      Amount   Percentage
─────────────────────────────────────────────────────────────────
  Wheat                            415g        41.5%
  Lentils                          277g        27.7%
  Peas                             150g        15.0%
  Barley                           102g        10.2%
  Safflower                         56g         5.6%

NUTRITIONAL ANALYSIS:
─────────────────────────────────────────────────────────────────
  Protein:          18.0%    (Target: 16.0-18.0%)
  Carbohydrates:    65.3%    (Target: 60-65%)
  Fat:               3.7%    (Target: 2.0-5.0%)
  Fiber:             5.2%    (Target: <5%)

CATEGORY BREAKDOWN:
─────────────────────────────────────────────────────────────────
  Grains:            51.7%    (Target: 40-50%)
  Legumes:           42.7%    (Target: 40-50%)
  Seeds:              5.6%    (Target: 5-10%)
```

## Files Included

- **pigeon_mix_calculator.py** - Main calculator program
- **USER_GUIDE.md** - Comprehensive user documentation
- **README.md** - This file
- **pigeon_nutrition_research.md** - Research notes and references
- **test_calculator.py** - Test scenarios and examples

## Requirements

- Python 3.11 or higher
- No external dependencies required

## Testing

Run the test suite to see example scenarios:

```bash
python3 test_calculator.py
```

This generates six test scenarios covering various situations and edge cases.

## How It Works

The calculator uses a weighted scoring algorithm that evaluates potential mixes based on:

- **Nutritional target match** (30%) - Protein alignment with target profile
- **Carbohydrate match** (25%) - Energy content optimization
- **Fat match** (15%) - Fat content for condition and warmth
- **Fiber control** (10%) - Keeping fiber low (pigeons don't utilize it well)
- **Category ratios** (15%) - Balance between grains, legumes, and seeds
- **Diversity bonus** (5%) - Rewarding variety in ingredients

The algorithm generates multiple candidate mixes and selects the one with the highest score while respecting ingredient availability constraints.

## Nutritional Basis

The calculator is based on research from:
- Racing pigeon nutritionists and veterinarians
- Commercial pigeon feed formulations
- Pigeon fancier best practices
- Scientific literature on avian nutrition

Key principles:
- Pigeons require 13.5-18% protein depending on activity
- Carbohydrates should comprise 60-70% for energy
- Fat needs vary from 2-8% based on season and activity
- Fiber should be minimized (<5%) as pigeons don't digest it well
- Yellow corn is essential for Vitamin A
- Peas are the most essential ingredient for protein and vitamins

## License

This software is provided as-is for educational and personal use.

## Contributing

Suggestions and improvements are welcome. The ingredient database can be expanded by editing the INGREDIENTS dictionary in the main Python file.

## Disclaimer

This calculator provides general guidance based on common pigeon nutrition principles. Always observe your birds' condition and consult with experienced fanciers or avian veterinarians for specific health concerns. Individual birds may have different nutritional needs based on genetics, health status, and environmental factors.

---

**Version:** 1.0  
**Created:** December 2025
