# Issue #75 — Pigeon breeding-grit and shell-calcium provenance review

**AS_OF:** 2026-08-21
**Research mode:** Lightweight, sequential fallback; public sources only.
**Scope:** The reported pigeon Breeding-profile boundary: whether the provenance record supports distinguishing shell-derived/calcareous calcium grit from redstone alone, and whether evidence supports a universal Pet/Companion “always breeding season” rule. This is a provenance-only review. It does not authorize a runtime, formula, safety-rule, nutrition, or visitor-copy change.

## P0 — Source policy and counter-review plan

The review uses public academic, official, and veterinary/welfare sources. It does not use private user data. The counter-review tests three overreaches: treating general grit as automatically sufficient calcium provision, equating redstone with a shell-calcium source without compositional evidence, and treating Pet/Companion pigeons as universally breeding without source-specific support.

## P1 — Lightweight task board

| Task | Objective | Search path | Result |
| --- | --- | --- | --- |
| A | Find direct pigeon breeding and grit/calcium evidence. | English academic pigeon breeding + grit/calcium; full-text review. | Completed with Zhu et al. and the already-registered VCA pigeon/dove source. |
| B | Test whether redstone can be equated with shell-calcium material. | German/Dutch/English pigeon-grit composition queries; official product record. | Completed with Versele Neo-Grit. The product records redstone separately from shell and calcium components. |
| C | Test the Pet/Companion “always breeding season” assertion. | Pigeon photoperiod/reproduction research; veterinary pet-bird reproductive timing; wildlife biology. | Completed with Yan et al., Merck, and ICWDM. The assertion is not supported as a universal profile rule. |
| D | Reconcile current repository implementation and historical provenance before any active change. | Canonical source ledger, care claims, active `BIRD_CARE`, and Home rendering. | Completed. The runtime general-grit line conflicts with the VCA caution; this branch does not change it. |

## P2 — First source note

| ID | Source | Type / accessibility | Exact finding | Use and limitation |
| --- | --- | --- | --- | --- |
| `zhu2025-tarim-pigeon-grit` | Zhu et al., *Investigation of the reproductive behavior of Tarim pigeons*, *Archives Animal Breeding* 68 (2025), 395–407. [DOI](https://doi.org/10.5194/aab-68-395-2025) | Academic / public | In the discussion, the authors state that ingested grit may provide minerals such as calcium and that choosing **calcareous grit** is especially important while birds are laying eggs. Their observed Tarim-pigeon breeding groups consumed grit more frequently after the first 10 days of the nurturing period than during incubation. | This is direct pigeon breeding-context evidence for a calcareous-grit boundary. It does not identify a particular commercial redstone product, establish a dosage, or justify an always-breeding classification for all pet pigeons. |
| `versele-neogrit-composition-2026` | Versele, *Colombine Neo-Grit* product record. [Product page](https://www.versele.com/en/de/colombine/products/colombine-neogrit) | Official manufacturer / public | The pigeon grit composition lists **redstone**, oyster shells, seashells, sea-algae calcium, flint grit, and flint stones as separate components; its declared calcium is 18.1%. | This independently confirms that, for this pigeon-specific complete grit product, redstone and shell/calcium components are distinct listed materials. It does not establish that every redstone-containing product has the same composition or that redstone alone supplies equivalent calcium. |
| `merck-pet-bird-reproduction-2026` | Hoppes, *Reproductive Diseases of Pet Birds*, Merck Veterinary Manual, reviewed September 2021 and updated May 2026. [Veterinary guidance](https://www.merckvetmanual.com/exotic-and-laboratory-animals/pet-birds/reproductive-diseases-of-pet-birds) | Veterinary reference / public | The manual states that captive and pet birds can breed at any time according to environmental factors such as photoperiod, nutritional status, and mate or nest cues. It also describes calcium stored in female bones for later eggshell production. | This supports rejecting a universal, unconditional “Pet/Companion is always breeding season” mapping. It is a general pet-bird source, not a pigeon-only protocol, so it cannot by itself decide pigeon profile behavior or a specific calcium product. |
| `vca-pigeon-dove-feeding` | Rich, Hess, and Axelson; VCA Animal Hospitals, *Feeding Pigeons and Doves*. [Veterinary guidance](https://vcahospitals.com/know-your-pet/pigeons-and-doves-feeding) | Veterinary owner guidance / public | The page states that the need for gravel/grit is controversial for pigeons and doves, but says a small amount of crushed eggshell or **digestible oyster-shell grit** may aid food breakdown and serve as a calcium source. It warns that excessive grit can cause gastrointestinal problems and specifies digestible oyster shell. | This is direct pigeon/dove guidance supporting a cautious shell-calcium boundary and contradicts a categorical mechanical-digestion claim. It does not make a breeding-specific quantity recommendation or resolve product composition beyond digestible oyster shell. |
| `yan2024-white-king-pigeon-photoperiod` | Yan et al., *Effect of different photoperiodic programs from rearing period on the reproductive performance and hormone secretion of White King pigeons*, *Poultry Science* 103 (2024), 103544. [DOI](https://doi.org/10.1016/j.psj.2024.103544) | Academic / public | In domestic White King pigeons, varying rearing and laying photoperiod programs changed age at first egg, egg production, fertility, and reproductive hormone patterns. The authors report that a prior short photoperiod followed by 16 h light during laying improved reproductive performance under their commercial-study conditions. | This is direct species-specific evidence that pigeon reproductive state is light-program dependent. It does not prescribe household lighting, define a Pet/Companion profile, or justify a universal continuous-breeding assumption. |
| `icwdm-pigeon-biology-2026` | Internet Center for Wildlife Damage Management, *Pigeon Biology*. [Research-based reference](https://icwdm.org/species/birds/pigeons/pigeon-biology/) | University wildlife-management reference / public | The reference says pigeon breeding may occur in all seasons but reports peak reproduction in spring and fall; it also states that pigeons mate year-round while most broods are raised in spring and summer above freezing conditions. | This is direct pigeon context supporting the narrower conclusion that year-round potential does not equal a universal, continuously active breeding state. It is wildlife-management material rather than companion-pigeon clinical guidance and cannot define a Pet/Companion care profile. |

## Research status

The targeted follow-up sources support a narrow provenance conclusion: a shell/calcium component is a distinct concept from redstone in a pigeon-specific complete-grit composition, and both pet-bird veterinary guidance and direct domestic-pigeon research treat reproductive activity as condition-dependent rather than automatically universal. They remain insufficient to prescribe a product, quantity, home-lighting program, or visitor-visible wording. A counter-review and repository-baseline reconciliation remain required.

### Access note

The browser reached a verification page for the candidate White King pigeon photoperiod study at [PMC10900098](https://pmc.ncbi.nlm.nih.gov/articles/PMC10900098/); its accessible full text was subsequently extracted and checked. It is now recorded above as reviewed evidence.

## P3 — Citation registry and source governance

| ID | Source type | Accessibility | Authority | Task | Status |
| --- | --- | --- | ---: | --- | --- |
| `zhu2025-tarim-pigeon-grit` | Academic primary research | public | 9/10 | A | Approved |
| `vca-pigeon-dove-feeding` | Veterinary owner guidance | public | 8/10 | A/D | Approved; pre-existing registry record reconfirmed |
| `versele-neogrit-composition-2026` | Official manufacturer record | public | 7/10 | B | Approved only for its named product composition |
| `yan2024-white-king-pigeon-photoperiod` | Academic primary research | public | 9/10 | C | Approved |
| `merck-pet-bird-reproduction-2026` | Veterinary reference | public | 9/10 | C | Approved only for general captive-pet-bird context |
| `icwdm-pigeon-biology-2026` | University wildlife-management reference | public | 8/10 | C | Approved only for population biology context |

**Registry check:** 6 approved sources across 5 domains. Two of six are official or university sources, meeting the lightweight source-diversity threshold. No private or user-owned source was used.

## P6 — Counter-review and reconciliation

| Issue found | Evidence | Consequence for this branch |
| --- | --- | --- |
| The active runtime says pigeons need grit to digest seeds and grains, while VCA says grit’s mechanical need is controversial and cautions against excess. | `v3-webapp/client/src/lib/birds.ts`; `vca-pigeon-dove-feeding` | Explicit conflict recorded; no runtime wording changed in this provenance-only branch. |
| A product that contains redstone may also contain shell, calcium, and flint components, so the source does not prove that redstone itself is nutritionally equivalent to — or insufficient relative to — shell calcium. | `versele-neogrit-composition-2026` | Do not make a categorical “normal redstone is not enough” claim or prescribe a product. |
| Pigeons may breed in all seasons, but direct pigeon photoperiod research and wildlife biology show condition and seasonal effects. | `yan2024-white-king-pigeon-photoperiod`; `icwdm-pigeon-biology-2026`; `merck-pet-bird-reproduction-2026` | Reject an unconditional Pet/Companion-is-always-breeding mapping. |

**Counter-review result:** 3 material limitations found; all are carried into the care-claim rationale and copy boundary.
