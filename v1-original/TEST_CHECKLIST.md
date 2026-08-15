# Multi-Bird Calculator - Comprehensive Test Checklist

## Requirements from User Feedback

### 1. Inventory Search in Dropdown
- [ ] Search box is INSIDE the dropdown (not next to it)
- [ ] Search filters compatible ingredients first
- [ ] Incompatible ingredients appear in grayed-out section below
- [ ] Search works in real-time as user types

### 2. Nutrition Summary Color Logic with Hints
- [ ] Green/blue for values within target range
- [ ] Red for values outside target range
- [ ] Question mark circle icon on each nutrition card
- [ ] Clicking icon reveals helpful hint/explanation
- [ ] Color logic is intuitive (green=good, red=bad)

### 3. Pet/Stay at Home Pigeon Profile
- [ ] Profile exists for pigeons
- [ ] Has appropriate nutrition targets
- [ ] Has herb recommendations including aniseed
- [ ] Shows in situation dropdown

### 4. Water and Grit Recommendations
- [ ] Separated into two distinct sections
- [ ] Located in flock profile section (under target batch size)
- [ ] Shows fresh water requirements
- [ ] Shows grit requirements with explanation

### 5. Preparation Instructions
- [ ] NOT displayed as separate column in mix table
- [ ] Shown in brackets after ingredient name in inventory
- [ ] Mentioned below recommended formula if needed
- [ ] Clear and actionable (e.g., "shell removal", "hull on")

### 6. Detailed Analysis Tab
- [ ] Profile description box is BELOW breakdown and nutritional details
- [ ] NOT above them
- [ ] Explains key decisions for the profile
- [ ] Shows feeding notes and targets

### 7. Toxic Legume Warnings (Hemagglutinin)
- [ ] Red alert appears when toxic legume is added to inventory
- [ ] Inventory field turns red/red-transparent
- [ ] Shows warning: "WARNING contains X is toxic. Can only be fed if cooked. Danger of death of the bird."
- [ ] Covers: kidney beans, lima beans, fava beans, navy beans, pinto beans
- [ ] Generic "beans" entry has disclaimer to check if type contains hemagglutinin

### 8. Corn-Only Grain Warning
- [ ] Warning appears if corn is the ONLY grain
- [ ] Suggests adding wheat, barley, or oats
- [ ] Explains why other grains are needed

### 9. Multi-Bird Support - CRITICAL
- [ ] Bird selector tiles at TOP of page (Pigeon, Parrot, African Grey, Budgie, Canary, Chicken)
- [ ] Tiles are colored and clickable
- [ ] Clicking bird tile updates EVERYTHING below
- [ ] Each bird has distinct color
- [ ] Selected bird is highlighted/scaled up

### 10. Bird-Specific Profiles
- [ ] **Pigeon**: Maintenance, Racing, Breeding, Molting, Winter, Pet (6 profiles)
- [ ] **Parrot**: Pet, Breeding, Molting (3 profiles)
- [ ] **African Grey**: Pet, Breeding, Molting (3 profiles - specialized nutrition)
- [ ] **Budgie**: Pet, Breeding, Molting (3 profiles)
- [ ] **Canary**: Pet, Breeding, Molting (3 profiles)
- [ ] **Chicken**: Pet, Egg-laying, Molting (3 profiles)
- [ ] Profiles update when bird is changed
- [ ] Situation dropdown only shows profiles for selected bird

### 11. Ingredient Compatibility
- [ ] Dropdown shows ONLY compatible ingredients for selected bird
- [ ] Search can reveal incompatible ingredients (grayed out)
- [ ] Selecting incompatible ingredient shows warning
- [ ] Warning explains it's not ideal for this bird
- [ ] Inventory shows warning badge for incompatible ingredients

### 12. Bird-Specific Toxicity
- [ ] Different toxic foods for each bird
- [ ] Toxic foods show red alerts in inventory
- [ ] Alerts explain toxin name and danger
- [ ] Logic follows same pattern as pigeon hemagglutinin warnings
- [ ] Covers: avocado, chocolate, caffeine, onions, garlic, salt, etc.

### 13. Herb Recommendations
- [ ] Different herbs per bird
- [ ] Different herbs per situation (pet, breeding, molting)
- [ ] Pet pigeon includes aniseed for odor reduction
- [ ] Shows dosage and frequency
- [ ] Shows benefits and notes

### 14. Missing Ingredient Warnings
- [ ] Warns if critical ingredient category is missing
- [ ] Shows what needs to be bought
- [ ] Provides specific recommendations
- [ ] Example: "Only corn, peas, lentils" → warns about missing grains
- [ ] Suggests compatible alternatives

### 15. Grain Compatibility Logic
- [ ] Corn alone triggers warning
- [ ] Suggests pairing with wheat/barley/oats
- [ ] Other single grains may be acceptable (wheat alone is OK)
- [ ] Logic is bird-specific

### 16. Research Citations
- [ ] Sources cited in documentation
- [ ] At least 1-2 literature references provided
- [ ] Explains basis for nutrition targets
- [ ] References avian nutrition research

### 17. Ingredient Database
- [ ] 60+ pigeon-safe ingredients
- [ ] Ingredients marked as compatible/incompatible per bird
- [ ] All toxic legumes marked with warnings
- [ ] Preparation instructions included
- [ ] Peanuts available (raw, roasted)
- [ ] Red corn available

### 18. Original Pigeon Version Preserved
- [ ] `/pigeon-mix-web/` folder untouched
- [ ] Original pigeon calculator still works
- [ ] Multi-bird version in separate `/pigeon-mix-web-multi-bird/` folder

---

## Test Execution Log

### Test 1: Bird Selector UI
**Date**: [To be filled]
**Result**: PASS / FAIL
**Notes**: 

### Test 2: Pigeon Profiles
**Date**: [To be filled]
**Result**: PASS / FAIL
**Notes**: 

### Test 3: Parrot Profiles
**Date**: [To be filled]
**Result**: PASS / FAIL
**Notes**: 

### Test 4: Ingredient Filtering
**Date**: [To be filled]
**Result**: PASS / FAIL
**Notes**: 

### Test 5: Toxic Food Warnings
**Date**: [To be filled]
**Result**: PASS / FAIL
**Notes**: 

### Test 6: Herb Recommendations
**Date**: [To be filled]
**Result**: PASS / FAIL
**Notes**: 

### Test 7: Missing Ingredients Detection
**Date**: [To be filled]
**Result**: PASS / FAIL
**Notes**: 

### Test 8: Nutrition Color Logic
**Date**: [To be filled]
**Result**: PASS / FAIL
**Notes**: 

### Test 9: Preparation Instructions Display
**Date**: [To be filled]
**Result**: PASS / FAIL
**Notes**: 

### Test 10: Water/Grit Recommendations
**Date**: [To be filled]
**Result**: PASS / FAIL
**Notes**: 
