# Catalog Routing

Use this index after the operating kernel identifies the task's relevant lenses. Load the smallest useful slice. Catalog rows provide evidence and candidates; `generate_design_brief.mjs` owns synthesis into one direction.

## Default Route

1. Use the sequential operating kernel in `SKILL.md`; the first unresolved stage owns the next decision.
2. Run `node scripts/generate_design_brief.mjs "<product surface constraints>"` for a new direction or meaningful redesign.
3. Read one primary reference for that unresolved decision. Add another only for a material cross-domain risk.
4. Use a specialist generator only when its narrow decision affects the result.
5. Implement through project-native conventions.
6. Run `node scripts/check_catalog.mjs` when this skill changes and `node scripts/validate_frontend_design.mjs <path>` when frontend files change.
7. Complete comprehension and visual proof from `SKILL.md` when rendering tools are available.

Do not add another catalog merely to expand option count. Improve synthesis, repair schema drift, or enrich an existing layer first.

## Catalog Evolution Contract

`check_catalog.mjs` separates structural compatibility from row completeness:

- `Required columns` protect fields consumed by routing or generators. Additional columns remain compatible and need no registry ceremony.
- `Routing-critical values` must exist on every row because empty identity, keyword, or decision fields make ranking or output dishonest. Other declared columns may remain empty when their evidence is genuinely optional.
- `New catalog`: Register its required columns and routing-critical values. Add a smoke path only when it introduces a generator entrypoint.
- `Optional → required`: Backfill existing rows first, then promote the field into the routing-critical contract.
- `Rename or removal`: Ship the new column alongside the old one, update readers to accept both during one migration window, migrate data, then remove the old column and contract. Never combine reader breakage and column removal in one step.
- `Failure focus`: The validator reports missing structure immediately and bounds repeated row failures per catalog with a suppression count.

This path keeps additive evolution cheap while making compatibility breaks explicit.

## Reference Catalog

| Reference | Primary use |
| --- | --- |
| [`art-direction.md`](art-direction.md) | Concept, typography, color, composition, material, motion, anti-slop craft |
| [`style-recipes.md`](style-recipes.md) | Conditional Minimal/Editorial, Brutalist/Industrial, and Soft/Tactile construction details, values, effects, overrides, failure modes |
| [`motion-recipes.md`](motion-recipes.md) | Engine selection, continuous input, reveal, press, magnetic, layout, sticky-stack, horizontal-pan, overlay, ambient, lifecycle, transparency, performance recipes |
| [`redesign.md`](redesign.md) | Existing-surface modes, baseline capture, preservation boundaries, risk-ordered evolution, before/after proof |
| [`visual-reference-workflow.md`](visual-reference-workflow.md) | Reference roles, frame planning, crop/regeneration, provenance, extraction, continuity, media, flows, identity boards, implementation boundary, anti-drift proof |
| [`visual-craft.md`](visual-craft.md) | Typography and glyph fit, first-view composition, CTA/control alignment, section rhythm, shape/palette coherence, copy/data sweep |
| [`information-presentation.md`](information-presentation.md) | User questions, presentation modes, hierarchy, scan paths, comparison, disclosure, state, evidence, uncertainty, comprehension proof |
| [`ux-production-checklist.md`](ux-production-checklist.md) | Accessibility, interaction, responsive behavior, performance, forms, navigation, states |
| [`design-system.md`](design-system.md) | Foundation selection, official ecosystems, mixing/adoption boundaries, tokens, themes, variants, component contracts, validation |
| [`design-specification.md`](design-specification.md) | Durable design transfer with authority, rule strength, document/rule/token/component/state/responsive/motion templates, anti-pattern encoding, handoff, portability, and change discipline |
| [`component-patterns.md`](component-patterns.md) | Buttons, inputs, cards, dialogs, tables, navigation, alerts, empty states |
| [`data-visualization.md`](data-visualization.md) | Charts, metrics, dashboard questions, scale integrity, accessible data UI |
| [`brand-messaging.md`](brand-messaging.md) | Voice, positioning, proof, CTA, persuasive interface copy |
| [`visual-identity-assets.md`](visual-identity-assets.md) | Logo, palette, typography, imagery, icons, asset organization |
| [`responsive-layout.md`](responsive-layout.md) | Intrinsic sizing, content/container constraints, semantic phase changes, overflow, and responsive proof |
| [`production-handoff.md`](production-handoff.md) | Approval, asset governance, naming, metadata, release handoff |

## Data Layers

- `Compact routing`: `style-matrix.csv`, `product-patterns.csv`, `copy-formulas.csv`, `icon-styles.csv`, `color-psychology.csv`.
- `Extended evidence`: `style-catalog.csv`, `product-ui-patterns.csv`, `product-reasoning.csv`, `product-color-palettes.csv`, `typography-pairings.csv`, `ux-guidelines.csv`, `app-interface-guidelines.csv`.
- `Surface-specific`: `landing-patterns.csv`, `banner-specs.csv`, `chart-selection.csv`, and `slide-*.csv`.
- `Identity`: `logo-*.csv`, `identity-*.csv`, `icon-library-map.csv`, `icon-generation-styles.csv`.
- `Vocabulary`: `terminology.csv` expands aliases and preserves canonical output names.

Compact and extended layers intentionally overlap. Use compact data for routing and extended data as evidence. Never present independently ranked rows as if they already formed a coherent design.

## Script Catalog

| Script | Use |
| --- | --- |
| `generate_design_brief.mjs <query>` | Synthesize one chosen direction, decision chain, rejected alternatives, contracts, risks, and validation plan |
| `search_frontend_design.mjs <query>` | Search all references and data with terminology expansion |
| `lookup_term.mjs <query>` | Resolve canonical term, aliases, definition, and naming notes |
| `generate_component_brief.mjs <component>` | Component anatomy, variants, states, accessibility, content behavior |
| `generate_ux_checklist.mjs <query>` | Targeted UX and app-interface checks |
| `generate_palette_brief.mjs <query>` | Palette candidates and semantic color guidance |
| `generate_typography_brief.mjs <query>` | Font pairing, mood, scale, and readability evidence |
| `generate_chart_brief.mjs <query>` | Chart selection and accessible data-display guidance |
| `generate_copy_formula.mjs <query>` | Headline, section, CTA, persuasion, and proof formulas |
| `generate_banner_brief.mjs <surface> <type> <message>` | Dimensions, safe zones, composition, and export brief |
| `generate_slide_brief.mjs <query>` | Strategy, layout, copy, color, type, chart, and background evidence |
| `generate_icon_brief.mjs <query>` | Icon style and library candidates |
| `generate_logo_brief.mjs <query>` | Logo style, palette, industry, symbol, and scalability evidence |
| `generate_identity_brief.mjs <query>` | Identity package deliverables, style, mockup, and handoff evidence |
| `extract_brand_context.mjs <brand.md>` | Extract portable brand constraints from guidelines |
| `generate_tokens.mjs --starter` | Generate starter CSS variables or flatten token JSON |
| `contrast_check.mjs <fg> <bg>` | Calculate WCAG contrast ratio |
| `validate_frontend_design.mjs <path>` | Produce heuristic frontend evidence; not a compiler or visual review |
| `check_catalog.mjs` | Validate catalog schemas, required values, and generator smoke paths |

## Route by Intent

| Intent | Start with | Add only for this risk | Optional scripts |
| --- | --- | --- | --- |
| New UI, page, or component | `information-presentation` | `art-direction` for a new visual language; `component-patterns` for reusable anatomy; UX/layout references for exposed risk | Design brief, component brief |
| Redesign or polish | `redesign` | `visual-craft` for production fit; `information-presentation` when hierarchy changes; `art-direction` for a new visual language; `design-system` when repeated decisions drift | Design brief, targeted search |
| Visual reference, screenshot, or generated concept | `visual-reference-workflow` | `art-direction` for direction; `visual-craft` for proof/provenance risk; `responsive-layout` for uncaptured widths | Design brief, targeted search |
| Production hardening | `ux-production-checklist` | `responsive-layout` for intrinsic failures; `component-patterns` for state contracts | Validator, UX checklist, contrast check |
| Design system work | `design-system` | `design-specification` for durable transfer; `component-patterns` for anatomy; `visual-identity-assets` for brand primitives | Token and component generators |
| Design specification or agent/tool handoff | `design-specification` | `design-system` for token/component ownership; `production-handoff` for deliverables; visual-reference workflow for reference evidence | Design brief, token and component generators |
| Brand-aware implementation | `brand-messaging` | `visual-identity-assets` for assets; `art-direction` for composition | Brand extraction, design brief |
| Landing or conversion | `information-presentation` | `brand-messaging` for persuasion; `art-direction` for a new direction; landing-pattern data for section evidence | Design brief, copy formula |
| Dashboard or data UI | `information-presentation` | `data-visualization` for quantitative questions; components for structural uncertainty | Design brief, chart brief |
| Banner, hero, or social asset | `visual-identity-assets` | `art-direction` for concept; `brand-messaging` for message/CTA | Banner, palette, typography briefs |
| Accessibility or responsive review | `ux-production-checklist` | `responsive-layout` for content/container failures; `motion-recipes` for motion/input/lifecycle risk | UX checklist, validator, contrast check |
| Identity, icon, or logo | `visual-identity-assets` | `brand-messaging` for positioning; `production-handoff` for release governance | Icon, logo, identity briefs |

## Route by Surface

Read the first reference named; add later references only when the decision reaches that boundary.

- `Landing page`: `information-presentation` → messaging → art direction → landing-pattern evidence.
- `Dashboard/admin`: `information-presentation` → data visualization → components.
- `Form/flow`: `information-presentation` → UX checklist → components/responsive layout.
- `Component library`: `design-system` → components → UX checklist.
- `Hero/banner/social`: `visual-identity-assets` → art direction → messaging.
- `Presentation/slides`: `information-presentation` → messaging → data visualization.
- `Chart/report`: `data-visualization` → information presentation → UX checklist.
- `Navigation/app shell`: `component-patterns` → responsive layout → UX checklist.
- `Identity package`: `visual-identity-assets` → messaging → production handoff.

## Route by Product Pressure

- `SaaS, productivity, docs`: Favor component clarity, system consistency, preserved state, and efficient navigation.
- `Finance, crypto, legal, healthcare, public`: Lead with trust, explicit state, accessibility, auditability, risk and recovery language.
- `E-commerce, marketplace, hospitality`: Lead with product evidence, price/availability, trust near risk, and conversion continuity.
- `Analytics, monitoring, operations`: Lead with status, freshness, exceptions, filters, truthful charts, and recovery paths.
- `Creative, portfolio, games, entertainment`: Allow stronger art direction while preserving task and content clarity.
- `Education, wellness, nonprofit`: Favor approachable structure, progress, readable guidance, and supportive feedback.

## Route by Design Problem

| Problem | Load | Specialist evidence |
| --- | --- | --- |
| Generic appearance | Visual craft, art direction | Style recipes, identity assets, style matrix, and synthesized brief |
| Visual fit, rhythm, or polish defects | Visual craft | Art direction, responsive layout, provenance, and rendered comparison |
| Visual-reference ambiguity or implementation drift | Visual reference workflow | Art direction, visual craft, responsive layout, and rendered comparison |
| Weak hierarchy or unclear information | Information presentation, components | Search `hierarchy`, `scan`, `comparison`, or `disclosure` |
| Poor conversion | Messaging, information presentation | Copy formulas and landing patterns |
| Inconsistent UI | Design system, components | Foundation selection, tokens, and component brief |
| Competing or uncertain UI foundations | Design system | Component ownership, dependency, license, version, and bundle evidence |
| Design decision transfer or specification drift | Design specification | Design system, production handoff, and component brief |
| Accessibility risk | UX checklist, responsive layout | Validator, UX checklist, contrast check |
| Mobile breakage | Responsive layout, components | Validator plus compact render |
| Motion, scroll, or animation lifecycle risk | Motion recipes | UX checklist, responsive layout, runtime performance evidence |
| Confusing data | Data visualization, messaging | Chart brief |
| Brand mismatch | Messaging, identity assets | Brand extraction |
| Palette uncertainty | Identity assets, art direction | Style recipes, palette brief, and contrast check |
| Typography uncertainty | Identity assets, art direction | Style recipes and typography brief |
| Icon uncertainty | Identity assets, components | Icon brief |
| Handoff uncertainty | Production handoff, UX checklist | Validator and explicit evidence package |
| Naming uncertainty | Term lookup | `terminology.csv` aliases, definitions, and notes |
