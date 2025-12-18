#!/usr/bin/env python3
"""
Test script for Pigeon Mix Calculator
Tests various scenarios
"""

from pigeon_mix_calculator import PigeonMixCalculator

def test_scenario(name, inventory, situation, target_weight=1000):
    """Test a specific scenario"""
    print("=" * 70)
    print(f"TEST SCENARIO: {name}")
    print("=" * 70)
    print()
    
    calculator = PigeonMixCalculator(inventory, situation)
    mix, recipe_card = calculator.calculate(target_weight)
    
    print(recipe_card)
    print("\n" * 2)
    
    # Save to file
    filename = f"test_{name.lower().replace(' ', '_')}.txt"
    with open(filename, 'w') as f:
        f.write(recipe_card)
    
    return mix, recipe_card


# Test Scenario 1: Well-stocked inventory for racing
print("Running test scenarios...\n")

test_scenario(
    "Racing - Well Stocked",
    inventory={
        "wheat": 5000,
        "corn_yellow": 4000,
        "peas": 3000,
        "lentils": 2000,
        "safflower": 800,
        "barley": 3000,
        "millet": 500
    },
    situation="racing",
    target_weight=1000
)

# Test Scenario 2: Limited inventory for winter
test_scenario(
    "Winter - Limited Stock",
    inventory={
        "barley": 3000,
        "corn_yellow": 2000,
        "wheat": 1500,
        "peas": 500,
        "sunflower": 300
    },
    situation="winter",
    target_weight=1000
)

# Test Scenario 3: Molting with good variety
test_scenario(
    "Molting - Good Variety",
    inventory={
        "wheat": 4000,
        "corn_yellow": 3000,
        "peas": 3500,
        "lentils": 2000,
        "mung_beans": 1000,
        "safflower": 600,
        "linseed": 400,
        "barley": 2000
    },
    situation="molting",
    target_weight=1500
)

# Test Scenario 4: Breeding - minimal legumes (should trigger warning)
test_scenario(
    "Breeding - Low Legumes WARNING",
    inventory={
        "wheat": 5000,
        "corn_yellow": 4000,
        "barley": 3000,
        "peas": 300,  # Very low
        "safflower": 500
    },
    situation="breeding",
    target_weight=1000
)

# Test Scenario 5: Maintenance - no yellow corn (should trigger warning)
test_scenario(
    "Maintenance - No Vitamin A WARNING",
    inventory={
        "wheat": 4000,
        "barley": 3000,
        "milo": 2000,  # No Vitamin A
        "peas": 2000,
        "lentils": 1000,
        "millet": 500
    },
    situation="maintenance",
    target_weight=1000
)

# Test Scenario 6: Very limited inventory (critical warnings)
test_scenario(
    "Critical - Very Limited",
    inventory={
        "wheat": 1000,
        "corn_yellow": 800
    },
    situation="maintenance",
    target_weight=500
)

print("=" * 70)
print("All test scenarios completed!")
print("Check the generated test_*.txt files for detailed results.")
print("=" * 70)
