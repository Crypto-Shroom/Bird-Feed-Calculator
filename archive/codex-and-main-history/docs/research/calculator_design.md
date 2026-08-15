# Pigeon Seed Mix Calculator - Design Document

## Overview
A Python-based calculator that optimizes pigeon seed mixes based on available ingredients, target nutritional ratios, and pigeon situation (racing, breeding, molting, winter, maintenance).

## Core Components

### 1. Ingredient Database
Each ingredient will have:
- Name
- Category (grain, legume, seed)
- Protein %
- Carbohydrate %
- Fat %
- Fiber %
- Special properties (e.g., Vitamin A source, omega-3, etc.)

### 2. Target Profiles
Different situations require different nutritional targets:

**Maintenance (Standard)**
- Protein: 13.5-15%
- Carbohydrates: 60-70%
- Fat: 2-5%
- Fiber: <5%
- Category ratios: Grains 60-70%, Legumes 15-20%, Seeds 10-15%

**Racing**
- Protein: 17.5%
- Carbohydrates: ~62%
- Fat: 2-5%
- Fiber: <5%
- Category ratios: Grains 40-50%, Legumes 40-50%, Seeds 5-10%

**Breeding/Brooding**
- Protein: 15%
- Carbohydrates: 60-70%
- Fat: 3-6%
- Fiber: <5%
- Category ratios: Grains 60-65%, Legumes 20-25%, Seeds 10-15%

**Molting**
- Protein: 16%+ (emphasis on sulphur amino acids)
- Carbohydrates: 55-65%
- Fat: 3-6%
- Fiber: <5%
- Category ratios: Grains 55-60%, Legumes 25-30%, Seeds 10-15%

**Winter**
- Protein: 12-14%
- Carbohydrates: 65-75%
- Fat: 5-8% (higher for warmth)
- Fiber: <5%
- Category ratios: Grains 70-75%, Legumes 10-15%, Seeds 10-15%

### 3. Optimization Algorithm

**Approach**: Weighted scoring system with constraints

**Steps**:
1. Parse user inventory (ingredient name + amount in grams)
2. Select target profile based on pigeon situation
3. Calculate all possible mixes within constraints
4. Score each mix based on:
   - Nutritional target match (protein, carbs, fat, fiber)
   - Category ratio match (grains, legumes, seeds)
   - Ingredient diversity (prefer variety)
   - Special ingredient bonuses (e.g., yellow corn for Vitamin A)
5. Select best-scoring mix
6. Generate warnings for missing components
7. Provide suggestions for improvement

**Constraints**:
- Use only available ingredients
- Respect maximum amounts available
- Ensure minimum diversity (at least 3 different ingredients if possible)
- Meet critical minimums (e.g., must have at least one legume)

**Scoring Formula**:
```
Total Score = 
  (Protein Match Score × 0.30) +
  (Carb Match Score × 0.25) +
  (Fat Match Score × 0.15) +
  (Fiber Match Score × 0.10) +
  (Category Ratio Score × 0.15) +
  (Diversity Bonus × 0.05)
```

Match scores calculated as: `1 - (abs(actual - target) / target)`

### 4. Warning System

**Critical Warnings** (show in red):
- No legumes available (essential for protein)
- No grains available (essential for energy)
- Protein <10% or >20%
- Fiber >7%
- Only 1-2 ingredients available

**Advisory Warnings** (show in yellow):
- Missing yellow corn (Vitamin A deficiency risk)
- No seeds/oils (fat may be low)
- Limited diversity (<4 ingredients)
- Nutritional targets off by >15%

### 5. Suggestion System

**Improvement Suggestions**:
- "Add [ingredient] to increase protein by X%"
- "Add [ingredient] to improve category balance"
- "Consider adding yellow corn for Vitamin A"
- "Mix is too high in fiber - reduce [ingredient]"
- "For [situation], consider increasing [category]"

### 6. Recipe Card Generator

**Output Format** (printable):
```
═══════════════════════════════════════════════
        PIGEON SEED MIX RECIPE CARD
═══════════════════════════════════════════════

Situation: [Racing/Breeding/Molting/Winter/Maintenance]
Total Batch Size: [XXX]g
Date: [YYYY-MM-DD]

INGREDIENTS:
─────────────────────────────────────────────
  Ingredient          Amount      Percentage
─────────────────────────────────────────────
  [Name]              [XXX]g         [XX]%
  [Name]              [XXX]g         [XX]%
  ...

NUTRITIONAL ANALYSIS:
─────────────────────────────────────────────
  Protein:            [XX.X]%    (Target: [XX]%)
  Carbohydrates:      [XX.X]%    (Target: [XX-XX]%)
  Fat:                [XX.X]%    (Target: [X-X]%)
  Fiber:              [XX.X]%    (Target: <5%)

CATEGORY BREAKDOWN:
─────────────────────────────────────────────
  Grains:             [XX]%      (Target: [XX-XX]%)
  Legumes:            [XX]%      (Target: [XX-XX]%)
  Seeds:              [XX]%      (Target: [XX-XX]%)

FEEDING INSTRUCTIONS:
─────────────────────────────────────────────
  [Situation-specific feeding guidelines]

NOTES:
─────────────────────────────────────────────
  [Warnings and suggestions]

═══════════════════════════════════════════════
```

## Implementation Strategy

### Phase 1: Core Calculator
- Ingredient database with nutritional values
- Target profile definitions
- Basic optimization algorithm
- Console-based input/output

### Phase 2: Enhanced Features
- Warning system
- Suggestion engine
- Recipe card formatting
- File export (text/PDF)

### Phase 3: User Interface
- Interactive CLI with menus
- Inventory management
- Batch size scaling
- Save/load configurations

## Technical Specifications

**Language**: Python 3.11
**Dependencies**: 
- Standard library only for core functionality
- Optional: reportlab or fpdf2 for PDF export
- Optional: tabulate for formatted tables

**Input Format**:
```python
inventory = {
    "wheat": 5000,  # grams
    "corn": 3000,
    "peas": 2000,
    "lentils": 1000,
    "safflower": 500
}
```

**Output**: 
- Console display with formatted tables
- Text file recipe card
- Optional PDF recipe card
