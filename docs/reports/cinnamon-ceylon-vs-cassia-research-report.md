# Research Report: Ceylon Cinnamon vs. Cassia Cinnamon & Coumarin Content in Avian Diets

## Executive Summary

This report evaluates an information feedback report submitted regarding the **Herbs & Supplements** entry for **Cinnamon** in the Bird Feed Calculator.

**Feedback Report Summary:**
> *Location:* Herbs & Supplements → Bird: Pigeon → Profile: Pet/Companion
> *Observation:* "If given to birds, Ceylon cinnamon is preferred. Common Cassia cinnamon contains higher levels of coumarin, which can be harsh or toxic in large quantities."
> *Requirement:* "This report requires research before any nutrition value, herb record, safety rule, compatibility decision, or user-facing guidance can change."

In accordance with repository governance and human-authoring rules, **no active runtime data, nutrient targets, herb records, or user-facing strings are modified in this PR**. This document provides the scientific background, codebase audit, and proposed wording options for explicit product-owner review and decision.

---

## Codebase Audit

Currently, cinnamon is defined and tested across three primary locations in the repository:

1. **`database/herb-content.mts`** (Canonical Herb Database):
   ```typescript
   cinnamon: {
     category: "herb_spice",
     benefits: ["Antimicrobial", "Antifungal", "Circulation"],
     dosage_per_kg: "0.5-1g",
     frequency: "2-3 times per week",
     notes: "Ground cinnamon, improves circulation",
   }
   ```

2. **`database/herb-provenance.mts`** (Evidence & Eligibility Registry):
   ```typescript
   cinnamon: eligible(
     ["hartady2021", "dardouri2025"],
     "Poultry evidence exists; concentrated oils are not interchangeable with food-grade spice powder."
   )
   ```

3. **`v3-webapp/client/src/lib/herb-content-baseline.fixture.json`**:
   Contains frozen baseline fixture matching `database/herb-content.mts`.

4. **`v3-webapp/client/src/lib/herb-content.test.ts`**:
   Enforces deep-equality parity between `HERBS_SUPPLEMENTS` in `database/herb-content.mts` and `herb-content-baseline.fixture.json`.

---

## Scientific & Toxicological Literature Review

### 1. Botanical Differences & Coumarin Concentration

* **Ceylon Cinnamon (*Cinnamomum verum* / *Cinnamomum zeylanicum*):**
  Known as "true cinnamon," Ceylon cinnamon contains only trace amounts of coumarin (typically **0.005–0.015 g/kg** or ~5–15 mg/kg).

* **Cassia Cinnamon (*Cinnamomum cassia* / *Cinnamomum aromaticum*):**
  Common commercial cinnamon (Chinese/Indonesian Cassia) contains substantially higher concentrations of coumarin, ranging from **1.0 to 12.0 g/kg** (up to 1% by weight, or 1,000–12,000 mg/kg).

### 2. Coumarin Toxicity & Avian Physiology

* **Mechanism of Action:** Coumarin (1,2-benzopyrone) is a naturally occurring aromatic compound that undergoes metabolic bioactivation in the liver. High oral intake in monogastric animals causes hepatotoxicity and can induce renal strain.
* **Avian Sensitivity:** While birds metabolize dietary polyphenols efficiently, high levels of coumarin present in Cassia cinnamon increase the potential cumulative liver burden, particularly in small companion birds or when supplements are administered regularly over prolonged periods.
* **Current Dosage Context:** The calculator recommends **0.5–1g per kg feed**, 2–3 times per week. At 1g/kg feed, Cassia cinnamon adds ~1–12 mg coumarin per kg feed, whereas Ceylon cinnamon adds only ~0.005–0.015 mg coumarin per kg feed. While 1g/kg Cassia is generally below acute toxic thresholds for poultry, Ceylon cinnamon eliminates coumarin exposure almost entirely.

---

## Proposed Options for Product-Owner Decision

To address the information report, three options are presented for product-owner review:

### Option A: Maintain Current Copy (Status Quo)
* **`notes`:** `"Ground cinnamon, improves circulation"`
* **Rationale:** Current dosage (0.5–1g/kg feed) is low and within general dietary spice margins. No code or fixture changes needed.

### Option B: Clarify Variety Recommendation (Recommended)
* **`notes`:** `"Ground Ceylon cinnamon preferred (low coumarin); improves circulation"`
* **Rationale:** Clearly guides bird keepers toward the safer Ceylon variety without altering dosage, eligibility, or safety warning classifications.
* **Files to Update if Approved:** `database/herb-content.mts` and `v3-webapp/client/src/lib/herb-content-baseline.fixture.json`.

### Option C: Expanded Safety Caution Note
* **`notes`:** `"Ground Ceylon cinnamon preferred; avoid Cassia due to coumarin levels"`
* **Rationale:** Explicitly warns against Cassia cinnamon, offering maximum risk precaution for companion bird owners.

---

## Decision Boundary Compliance

As required by governance policies:
* **No code changes** have been made to `database/herb-content.mts` or `v3-webapp/client/src/lib/herb-content-baseline.fixture.json`.
* **No safety rules** or eligibility classifications have been modified.
* All existing tests continue to pass against the baseline fixtures.
