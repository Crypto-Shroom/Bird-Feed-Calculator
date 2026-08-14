# Live Interface Observations

## 2026-08-14 preview check

The bird selector updates the profile heading, profile targets, and the generated formula when switching from pigeon to chicken. However, chicken mode continues to display pigeon-specific grit guidance in both the profile card and bottom safety block. The recipe remains a seed/grain mix while the marketing describes it as “Precision Nutrition for All Birds,” a stronger claim than the underlying data and research support.

The bird labels expose raw identifiers such as `african_grey` instead of reader-facing names. The top nutrition cards distinguish only an under-target value from an over-target value using blue/orange styling; the requested green/red semantics and explanatory hints are not present. The analysis panel also contains hard-coded “Protein Source Efficiency: High” and “Energy Density: 3200 kcal/kg,” neither of which is calculated from the selected formula.

The ingredient search field is placed beside, rather than inside, the add-ingredient dropdown. The dropdown renders a single alphabetical list that includes raw soybeans, raw kidney beans, fava beans, lima beans, and other ingredients without compatibility grouping, visual risk status, or a processing-state prompt. The code computes compatible and incompatible lists but does not render them. Bird-specific toxicity checking, grain-pairing logic, the safety-disclaimer constant, and a confirmation state are imported or declared but unused.

The “Export Recipe” button has no click handler. Selected bird tiles lack programmatic selected-state metadata, and visible labels are not associated with inputs. The production build completes, but emits a 698 KB JavaScript bundle (200 KB gzip) warning and there are no automated tests.

## Post-correction verification

The updated preview now renders reader-facing bird names, explicit scope language, green/red nutrition status text, accessible labels, and working nutrition cards. Pigeon mode produced a 1,000 g deterministic estimate with advisory warnings where the available inventory could not meet the modeled fiber and category ranges. This is preferable to silently presenting the output as fully compliant. The new picker is structured around compatible choices and blocks unsafe or species-incompatible choices from addition.

Chicken mode now correctly presents a scratch-supplement boundary, chicken-specific water and grit guidance, and a complete-ration foundation. The picker correctly moved several raw beans into a non-selectable section, but live verification found a remaining consistency gap: raw soybeans and some unverified legumes were still offered as compatible choices despite the calculator excluding them. This requires a shared processing-status rule between the picker and optimizer.

After centralizing the processing-status rule, the live picker moved raw soybeans, adzuki beans, chickpeas, black-eyed peas, lupins, vetch, and raw beans into the non-selectable section. The optimizer and picker now use the same rule, closing the previously observed inconsistency.

Final preview review confirmed the profile copy no longer supplies unsupported fixed daily quantities or medical claims. The formula continues to show explicit advisory messages for modeled target misses. The export control is enabled and invokes the recipe-download workflow for a non-empty estimate.

## Product-owner approved restoration

The Herbs/Enrichment tab was re-verified after the product owner approved restoration of the preserved herb information. It now displays the existing recommendation set, benefits, dosage, frequency, and notes—for example apple cider vinegar, garlic powder, and oregano in the maintenance profile—without changing any herb data, formulation, ingredient, or nutrition target.

## Product-owner approved copy and safety review

The live preview confirms the restored hero text, “Precision Nutrition for All Birds,” and the restored pigeon maintenance note, “Feed 30-40g per bird per day. Light feeding in morning, standard mix in evening.” The newer context note remains visibly smaller beneath it.

The ingredient picker now shows hard raw-toxicity exclusions such as black beans in a red treatment with the explicit message, “Raw black beans are TOXIC and can be fatal.” Processing-review exclusions, including black-eyed peas, remain visually separate in amber pending a product-owner-approved species-specific rule.

## Restriction correction

After reviewing the audit filter against the preserved safe-raw list, the black-eyed-pea processing exclusion was removed. The live picker now lists black-eyed peas under compatible choices for pigeon mode. Black beans remain in the hard-safety exclusion group with their explicit fatal-toxicity warning.
