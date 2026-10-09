# Pigeon Nutrition Targets Comparison (V0 Original vs Current V3)

No values are changed by this document. The product owner decides each difference separately.

Note: V0 used one fiber value for all profiles (0–5). The current fiber values come from #239 (2026-10-08).

## Profiles Comparison

### 1. Maintenance / Rest

| Nutrient | V0 original | V1 research | Pre-audit config | Current V3 | Same as V0? |
| --- | --- | --- | --- | --- | --- |
| protein | 13.5–15 | 13.5–15 (line 6, 145) | 13.5–15 | 13.5–15 | yes |
| carbs | 60–70 | 60–70 (line 7) | 60–70 | 60–70 | yes |
| fat | 2–5 | 2–5 (line 8) | 2.5–4 | 2.5–4 | no |
| crude fibre | 0–5 | <5 (line 9) | 0.5–2 | 0–5 | yes |
| grain % | 60–70 | 60–70 (line 48) | — | 55–70 | no |
| legume % | 15–20 | 15–20 (line 49) | — | 15–25 | no |
| seed % | 10–15 | 10–15 (line 50) | — | 5–15 | no |

### 2. Racing / Competition

| Nutrient | V0 original | V1 research | Pre-audit config | Current V3 | Same as V0? |
| --- | --- | --- | --- | --- | --- |
| protein | 16–18 | 17.5 (line 6, 52, 65, 85, 136) | 16–18 | 16–18 | yes |
| carbs | 60–65 | ~62 (line 54, 138) | 58–68 | 55–65 | no |
| fat | 2–5 | — | 4–6 | 3–5 | no |
| crude fibre | 0–5 | — | 0.5–1.5 | 0–5 | yes |
| grain % | 40–50 | — | — | 55–70 | no |
| legume % | 40–50 | 50 (line 53, 86, 137) | — | 15–25 | no |
| seed % | 5–10 | — | — | 5–15 | no |

### 3. Breeding / Brooding

| Nutrient | V0 original | V1 research | Pre-audit config | Current V3 | Same as V0? |
| --- | --- | --- | --- | --- | --- |
| protein | 14–16 | 15 (line 66, 73, 128) | 14–16 | 14–16 | yes |
| carbs | 60–70 | — | 60–68 | 58–68 | no |
| fat | 3–6 | — | 3–5 | 3–4.5 | no |
| crude fibre | 0–5 | — | 0.5–2 | 0–5 | yes |
| grain % | 60–65 | — | — | 55–70 | no |
| legume % | 20–25 | — | — | 15–25 | no |
| seed % | 10–15 | — | — | 5–15 | no |

### 4. Molting Season

| Nutrient | V0 original | V1 research | Pre-audit config | Current V3 | Same as V0? |
| --- | --- | --- | --- | --- | --- |
| protein | 16–18 | 16 (line 102) | 16–18 | 16–18 | yes |
| carbs | 55–65 | — | 58–68 | 55–65 | yes |
| fat | 3–6 | — | 4–6 | 3.5–5 | no |
| crude fibre | 0–5 | — | 0.5–1.5 | 0–5 | yes |
| grain % | 55–60 | — | — | 55–70 | no |
| legume % | 25–30 | — | — | 15–25 | no |
| seed % | 10–15 | — | — | 5–15 | no |

### 5. Winter Season

| Nutrient | V0 original | V1 research | Pre-audit config | Current V3 | Same as V0? |
| --- | --- | --- | --- | --- | --- |
| protein | 12–14 | 10 (line 119) | 12–14 | 12–14 | yes |
| carbs | 65–75 | — | 62–72 | 55–65 | no |
| fat | 5–8 | — | 5–8 | 4–6 | no |
| crude fibre | 0–5 | — | 0.5–2 | 0–5 | yes |
| grain % | 70–75 | 80 (line 116–118) | — | 55–70 | no |
| legume % | 10–15 | 10 (line 119) | — | 15–25 | no |
| seed % | 10–15 | 10 (line 120–121) | — | 5–15 | no |

### 6. Pet / Companion

| Nutrient | V0 original | V1 research | Pre-audit config | Current V3 | Same as V0? |
| --- | --- | --- | --- | --- | --- |
| protein | — | — | 12–14 | 12–14 | no |
| carbs | — | — | 62–70 | 60–70 | no |
| fat | — | — | 2.5–4 | 2.5–4 | no |
| crude fibre | — | — | 0.5–2 | 0–5 | no |
| grain % | — | — | — | 55–70 | no |
| legume % | — | — | — | 15–25 | no |
| seed % | — | — | — | 5–15 | no |

## Summary of Differences (Current V3 ≠ V0)

The following list identifies every row where Current V3 differs from V0 original, along with the source files and line numbers for both values:

- **Maintenance fat**:
  - V0 original: `(2, 5)` in `v0-python-only/pigeon_mix_calculator.py:45` (and `2-5%` in `v0-python-only/calculator_design.md:24`)
  - Current V3: `[2.5, 4]` in `v3-webapp/client/src/lib/birds.ts:76`
- **Maintenance grain %**:
  - V0 original: `(60, 70)` in `v0-python-only/pigeon_mix_calculator.py:47` (and `60-70%` in `v0-python-only/calculator_design.md:26`)
  - Current V3: `[55, 70]` in `v3-webapp/client/src/lib/birds.ts:364`
- **Maintenance legume %**:
  - V0 original: `(15, 20)` in `v0-python-only/pigeon_mix_calculator.py:47` (and `15-20%` in `v0-python-only/calculator_design.md:26`)
  - Current V3: `[15, 25]` in `v3-webapp/client/src/lib/birds.ts:364`
- **Maintenance seed %**:
  - V0 original: `(10, 15)` in `v0-python-only/pigeon_mix_calculator.py:47` (and `10-15%` in `v0-python-only/calculator_design.md:26`)
  - Current V3: `[5, 15]` in `v3-webapp/client/src/lib/birds.ts:364`

- **Racing carbs**:
  - V0 original: `(60, 65)` in `v0-python-only/pigeon_mix_calculator.py:53` (and `~62%` in `v0-python-only/calculator_design.md:30`)
  - Current V3: `[55, 65]` in `v3-webapp/client/src/lib/birds.ts:87`
- **Racing fat**:
  - V0 original: `(2, 5)` in `v0-python-only/pigeon_mix_calculator.py:54` (and `2-5%` in `v0-python-only/calculator_design.md:31`)
  - Current V3: `[3, 5]` in `v3-webapp/client/src/lib/birds.ts:88`
- **Racing grain %**:
  - V0 original: `(40, 50)` in `v0-python-only/pigeon_mix_calculator.py:56` (and `40-50%` in `v0-python-only/calculator_design.md:33`)
  - Current V3: `[55, 70]` in `v3-webapp/client/src/lib/birds.ts:364`
- **Racing legume %**:
  - V0 original: `(40, 50)` in `v0-python-only/pigeon_mix_calculator.py:56` (and `40-50%` in `v0-python-only/calculator_design.md:33`)
  - Current V3: `[15, 25]` in `v3-webapp/client/src/lib/birds.ts:364`
- **Racing seed %**:
  - V0 original: `(5, 10)` in `v0-python-only/pigeon_mix_calculator.py:56` (and `5-10%` in `v0-python-only/calculator_design.md:33`)
  - Current V3: `[5, 15]` in `v3-webapp/client/src/lib/birds.ts:364`

- **Breeding carbs**:
  - V0 original: `(60, 70)` in `v0-python-only/pigeon_mix_calculator.py:62` (and `60-70%` in `v0-python-only/calculator_design.md:37`)
  - Current V3: `[58, 68]` in `v3-webapp/client/src/lib/birds.ts:99`
- **Breeding fat**:
  - V0 original: `(3, 6)` in `v0-python-only/pigeon_mix_calculator.py:63` (and `3-6%` in `v0-python-only/calculator_design.md:38`)
  - Current V3: `[3, 4.5]` in `v3-webapp/client/src/lib/birds.ts:100`
- **Breeding grain %**:
  - V0 original: `(60, 65)` in `v0-python-only/pigeon_mix_calculator.py:65` (and `60-65%` in `v0-python-only/calculator_design.md:40`)
  - Current V3: `[55, 70]` in `v3-webapp/client/src/lib/birds.ts:364`
- **Breeding legume %**:
  - V0 original: `(20, 25)` in `v0-python-only/pigeon_mix_calculator.py:65` (and `20-25%` in `v0-python-only/calculator_design.md:40`)
  - Current V3: `[15, 25]` in `v3-webapp/client/src/lib/birds.ts:364`
- **Breeding seed %**:
  - V0 original: `(10, 15)` in `v0-python-only/pigeon_mix_calculator.py:65` (and `10-15%` in `v0-python-only/calculator_design.md:40`)
  - Current V3: `[5, 15]` in `v3-webapp/client/src/lib/birds.ts:364`

- **Molting fat**:
  - V0 original: `(3, 6)` in `v0-python-only/pigeon_mix_calculator.py:72` (and `3-6%` in `v0-python-only/calculator_design.md:45`)
  - Current V3: `[3.5, 5]` in `v3-webapp/client/src/lib/birds.ts:112`
- **Molting grain %**:
  - V0 original: `(55, 60)` in `v0-python-only/pigeon_mix_calculator.py:74` (and `55-60%` in `v0-python-only/calculator_design.md:47`)
  - Current V3: `[55, 70]` in `v3-webapp/client/src/lib/birds.ts:364`
- **Molting legume %**:
  - V0 original: `(25, 30)` in `v0-python-only/pigeon_mix_calculator.py:74` (and `25-30%` in `v0-python-only/calculator_design.md:47`)
  - Current V3: `[15, 25]` in `v3-webapp/client/src/lib/birds.ts:364`
- **Molting seed %**:
  - V0 original: `(10, 15)` in `v0-python-only/pigeon_mix_calculator.py:74` (and `10-15%` in `v0-python-only/calculator_design.md:47`)
  - Current V3: `[5, 15]` in `v3-webapp/client/src/lib/birds.ts:364`

- **Winter carbs**:
  - V0 original: `(65, 75)` in `v0-python-only/pigeon_mix_calculator.py:80` (and `65-75%` in `v0-python-only/calculator_design.md:51`)
  - Current V3: `[55, 65]` in `v3-webapp/client/src/lib/birds.ts:123`
- **Winter fat**:
  - V0 original: `(5, 8)` in `v0-python-only/pigeon_mix_calculator.py:81` (and `5-8%` in `v0-python-only/calculator_design.md:52`)
  - Current V3: `[4, 6]` in `v3-webapp/client/src/lib/birds.ts:124`
- **Winter grain %**:
  - V0 original: `(70, 75)` in `v0-python-only/pigeon_mix_calculator.py:83` (and `70-75%` in `v0-python-only/calculator_design.md:54`)
  - Current V3: `[55, 70]` in `v3-webapp/client/src/lib/birds.ts:364`
- **Winter legume %**:
  - V0 original: `(10, 15)` in `v0-python-only/pigeon_mix_calculator.py:83` (and `10-15%` in `v0-python-only/calculator_design.md:54`)
  - Current V3: `[15, 25]` in `v3-webapp/client/src/lib/birds.ts:364`
- **Winter seed %**:
  - V0 original: `(10, 15)` in `v0-python-only/pigeon_mix_calculator.py:83` (and `10-15%` in `v0-python-only/calculator_design.md:54`)
  - Current V3: `[5, 15]` in `v3-webapp/client/src/lib/birds.ts:364`

- **Pet profile (all rows)**:
  - V0 original: `—` (Pet profile had no entry in V0)
  - Current V3:
    - protein: `[12, 14]` in `v3-webapp/client/src/lib/birds.ts:134`
    - carbs: `[60, 70]` in `v3-webapp/client/src/lib/birds.ts:135`
    - fat: `[2.5, 4]` in `v3-webapp/client/src/lib/birds.ts:136`
    - crude fibre: `[0, 5]` in `v3-webapp/client/src/lib/birds.ts:137`
    - grain %: `[55, 70]` in `v3-webapp/client/src/lib/birds.ts:364`
    - legume %: `[15, 25]` in `v3-webapp/client/src/lib/birds.ts:364`
    - seed %: `[5, 15]` in `v3-webapp/client/src/lib/birds.ts:364`
