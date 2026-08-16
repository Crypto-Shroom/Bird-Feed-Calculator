# Multi-Bird Seed Mix Calculator - Setup Guide

## Overview

The **Pigeon Mix Web - Multi-Bird Edition** is a comprehensive seed mix calculator supporting 6 bird species with bird-specific nutrition profiles, ingredient compatibility checking, and safety warnings.

## Features

- **6 Bird Species**: Pigeon, Parrot, African Grey, Budgie, Canary, Chicken
- **Bird-Specific Profiles**: Different nutrition targets for each bird and situation
- **Smart Ingredient Filtering**: Compatible ingredients prioritized, incompatible shown with warnings
- **Safety Warnings**: Toxic food alerts, hemagglutinin warnings for raw beans
- **Herb Recommendations**: Bird and situation-specific supplements with dosages
- **Nutrition Analysis**: Color-coded summary with helpful hints
- **Preparation Instructions**: Clear guidance on ingredient preparation
- **Water & Grit Reminders**: Bird-specific recommendations

## Installation

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### Steps

1. **Extract the archive**
   ```bash
   unzip pigeon-mix-web-multi-bird.zip
   cd pigeon-mix-web-multi-bird
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open in browser**
   - Local: `http://localhost:3000`
   - Network: Check terminal output for network URL

## Usage

### Selecting a Bird
1. Click one of the colored bird tiles at the top (Pigeon, Parrot, African Grey, Budgie, Canary, Chicken)
2. The entire calculator updates to show bird-specific options

### Configuring Your Flock
1. Select the current situation from the dropdown (e.g., Maintenance, Racing, Breeding, Molting)
2. Set target batch size in grams (default: 1000g)
3. View water and grit recommendations for your bird

### Adding Ingredients
1. Use the search box in the ingredient dropdown to find items
2. Compatible ingredients appear first
3. Incompatible ingredients appear in a grayed "Not Recommended" section
4. Enter the amount in grams you have available
5. Click "Add Ingredient" button

### Viewing Results
1. **Recommended Formula**: Shows the optimized mix with amounts
2. **Preparation Notes**: Lists any special preparation needed
3. **Nutritional Details**: Breakdown of protein, carbs, fat, fiber
4. **Detailed Analysis**: Profile description and feeding notes

### Understanding Colors
- **Green/Blue**: Nutrition values within target range ✓
- **Red**: Nutrition values outside target range ⚠️
- Click the **?** icon for explanations

### Safety Warnings
- **Red alerts**: Toxic foods (e.g., hemagglutinin in raw beans)
- **Orange alerts**: Incompatible ingredients for selected bird
- **Yellow alerts**: Missing ingredient categories

## Project Structure

```
pigeon-mix-web-multi-bird/
├── client/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── data.ts              # Ingredient database
│   │   │   ├── birds.ts             # Bird profiles & info
│   │   │   ├── bird-safety.ts       # Toxicity & compatibility
│   │   │   ├── calculator-multi-bird.ts  # Calculator logic
│   │   │   └── safety.ts            # Safety utilities
│   │   ├── pages/
│   │   │   └── Home.tsx             # Main calculator UI
│   │   ├── components/              # UI components
│   │   └── index.css                # Global styles
│   └── public/
│       └── images/                  # Hero and visual assets
├── server/                          # Backend (placeholder)
├── shared/                          # Shared types (placeholder)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Supported Birds & Profiles

### Pigeon (6 profiles)
- Maintenance/Rest
- Racing/Competition
- Breeding
- Molting
- Winter
- Pet/Companion

### Parrot (3 profiles)
- Pet/Companion
- Breeding
- Molting

### African Grey (3 profiles)
- Pet/Companion (specialized for kidney health)
- Breeding
- Molting

### Budgie (3 profiles)
- Pet/Companion
- Breeding
- Molting

### Canary (3 profiles)
- Pet/Companion
- Breeding
- Molting

### Chicken (3 profiles)
- Pet/Companion
- Egg-laying
- Molting

## Ingredient Database

The calculator includes 60+ pigeon-safe ingredients:

**Grains**: Wheat, barley, oats, corn (yellow & red), rice, millet, sorghum
**Legumes**: Peas, lentils, mung beans, chickpeas, black-eyed peas
**Seeds**: Sunflower, safflower, hemp, flaxseed, peanuts (raw & roasted)
**Toxic Legumes** (marked with warnings): Kidney beans, lima beans, fava beans, navy beans, pinto beans

## Herb Recommendations

Each bird and situation has specific herb recommendations with:
- Recommended dosage
- Frequency of use
- Health benefits
- Special notes

Examples:
- **Pigeon (Pet)**: Anise (odor reduction), Chamomile (calming), Fennel, Oregano, Thyme
- **Parrot (Pet)**: Basil, Oregano, Thyme, Ginger
- **Chicken (Egg-laying)**: Oregano, Thyme, Garlic powder, Cayenne

## Safety Features

### Toxic Food Detection
- **Hemagglutinin**: Raw kidney beans, lima beans, fava beans, navy beans, pinto beans
- **Avocado**: Persin toxin (all birds)
- **Chocolate**: Theobromine (all birds)
- **Caffeine**: All birds
- **Onions/Garlic**: Thiosulfates (all birds)
- **Salt**: Excess sodium (all birds)

### Grain Compatibility
- Warns if corn is the only grain
- Suggests pairing with wheat, barley, or oats
- Ensures nutritional balance

### Missing Ingredient Detection
- Warns if critical categories are missing (grains, legumes, seeds)
- Suggests compatible alternatives
- Provides specific recommendations

## Troubleshooting

### Dev server won't start
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### TypeScript errors
```bash
# Check for compilation errors
pnpm check

# Build the project
pnpm build
```

### Port already in use
The dev server will automatically try the next available port (3001, 3002, etc.)

## Building for Production

```bash
# Build static files
pnpm build

# Start production server
pnpm start
```

## Research & References

The calculator is based on:
- Merck Veterinary Manual - Avian Nutrition
- Racing Pigeon Nutritionists and Veterinarians
- Commercial Pigeon Feed Formulations
- Pigeon Fancier Best Practices
- Scientific Literature on Avian Nutrition

## Support & Customization

To customize for your needs:

1. **Add new ingredients**: Edit `client/src/lib/data.ts`
2. **Modify nutrition targets**: Edit `client/src/lib/birds.ts`
3. **Add new birds**: Extend `BirdType` and add profiles in `birds.ts`
4. **Change styling**: Edit `client/src/index.css` (Tailwind tokens)

## License

MIT

## Version

v2.0 - Multi-Bird Edition (December 2025)
