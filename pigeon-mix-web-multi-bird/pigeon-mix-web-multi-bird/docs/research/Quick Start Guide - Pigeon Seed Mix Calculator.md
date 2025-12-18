# Quick Start Guide - Pigeon Seed Mix Calculator

## Installation

No installation required! Just make sure you have Python 3.11 or higher installed.

Check your Python version:
```bash
python3 --version
```

## Running the Calculator

### Method 1: Interactive Mode (Recommended for Beginners)

1. Open a terminal/command prompt
2. Navigate to the folder containing `pigeon_mix_calculator.py`
3. Run:
   ```bash
   python3 pigeon_mix_calculator.py
   ```
4. Follow the prompts:
   - Select your pigeon's situation (1-5)
   - Enter ingredients one by one (format: `ingredient_name amount_in_grams`)
   - Type `done` when finished
   - Enter desired batch size (or press Enter for default 1000g)
5. View your recipe card on screen and find the saved file

### Method 2: Run Test Examples

See the calculator in action with pre-configured scenarios:
```bash
python3 test_calculator.py
```

This will generate 6 example recipe cards in the current folder.

### Method 3: Use in Your Own Python Script

```python
from pigeon_mix_calculator import PigeonMixCalculator

# Your inventory
inventory = {
    "wheat": 5000,      # 5kg wheat
    "corn": 3000,       # 3kg corn (yellow)
    "peas": 2000,       # 2kg peas
    "lentils": 1000,    # 1kg lentils
    "safflower": 500    # 500g safflower
}

# Create calculator
calc = PigeonMixCalculator(inventory, situation="racing")

# Get optimized mix for 1000g batch
mix, recipe_card = calc.calculate(target_weight=1000)

# Print recipe card
print(recipe_card)

# Save to file
with open("my_mix.txt", "w") as f:
    f.write(recipe_card)
```

## Example Interactive Session

```
═════════════════════════════════════════════════════════════════
                    PIGEON SEED MIX CALCULATOR                    
═════════════════════════════════════════════════════════════════

Select pigeon situation:
  1. Maintenance/Rest
  2. Racing/Performance
  3. Breeding/Brooding
  4. Molting Season
  5. Winter Season

Enter choice (1-5): 2

Selected: Racing/Performance

Enter your available ingredients (type 'done' when finished):
Format: ingredient_name amount_in_grams
Example: wheat 5000

Ingredient: wheat 5000
  Added: wheat - 5000g
Ingredient: yellow corn 3000
  Added: yellow corn - 3000g
Ingredient: peas 2500
  Added: peas - 2500g
Ingredient: safflower 600
  Added: safflower - 600g
Ingredient: done

Enter desired batch size in grams (default 1000): 1500

Calculating optimal mix...

[Recipe card displays here]

Recipe card saved to: pigeon_mix_racing_20251201_123456.txt
```

## Ingredient Name Tips

The calculator recognizes many variations:
- **Corn**: "corn", "yellow corn", "corn yellow", "corn_yellow"
- **Peas**: "peas", "field peas", "canada peas"
- **Flax**: "flaxseed", "linseed", "flax"

If unsure, check the USER_GUIDE.md for the complete ingredient list.

## Understanding Your Recipe Card

### Key Sections:

1. **Ingredients** - What to mix and how much
2. **Nutritional Analysis** - Protein, carbs, fat, fiber with targets
3. **Category Breakdown** - Balance of grains, legumes, seeds
4. **Feeding Instructions** - How much to feed per bird per day
5. **Notes** - Warnings and suggestions

### Warning Levels:

- **⚠ CRITICAL** - Must address (e.g., no legumes, protein too low)
- **⚡ Warning** - Should improve when possible (e.g., missing yellow corn)

## Common First-Time Questions

**Q: What units should I use?**  
A: Grams. If you have kg, multiply by 1000 (e.g., 2.5kg = 2500g)

**Q: I don't have all these ingredients. Can I still use it?**  
A: Yes! Enter only what you have. The calculator will optimize based on available ingredients and warn you about missing essentials.

**Q: Which situation should I choose?**  
A: 
- Racing season → Racing/Performance
- Raising babies → Breeding/Brooding
- After racing season (feather renewal) → Molting
- Cold months → Winter
- Everything else → Maintenance/Rest

**Q: Can I save and reuse my inventory?**  
A: The interactive mode doesn't save inventory, but you can create a Python script (see Method 3 above) to save your common inventories.

**Q: The mix uses less than I have available. Why?**  
A: The calculator optimizes for nutritional balance, not maximum usage. It may use less of certain ingredients to achieve better ratios.

## Next Steps

1. ✓ Run the calculator with your actual inventory
2. ✓ Read the warnings and suggestions carefully
3. ✓ Print or save the recipe card for reference
4. ✓ Mix your seeds according to the recipe
5. ✓ Observe your pigeons' condition and adjust as needed
6. ✓ Read USER_GUIDE.md for detailed information

## Files in This Package

- **pigeon_mix_calculator.py** - Main program (run this!)
- **QUICK_START.md** - This file
- **USER_GUIDE.md** - Detailed documentation
- **README.md** - Technical overview
- **test_calculator.py** - Example scenarios
- **pigeon_nutrition_research.md** - Research references
- **examples/** - Sample recipe cards from test runs

## Need Help?

1. Check USER_GUIDE.md for detailed explanations
2. Run test_calculator.py to see working examples
3. Look at example recipe cards in the examples/ folder

---

**Happy mixing! Your pigeons will thank you!** 🕊️
