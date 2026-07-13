# Catalog Routing

Use this index after the operating kernel identifies the task's relevant lenses. Load the smallest useful slice. Catalog rows provide evidence and candidates; `generate_design_brief.py` owns synthesis into one direction.

## Default Route

1. Run `scripts/generate_design_brief.py "<product surface constraints>"` for a new direction or meaningful redesign.
2. Read the primary reference for the surface or risk.
3. Use a specialist generator only when its decision materially affects the result.
4. Implement through project-native conventions.
5. Run `scripts/check_catalog.py` when this skill changes and `scripts/validate_frontend_design.py <path>` when frontend files change.
6. Complete the visual proof loop from `SKILL.md` when rendering tools are available.

Do not add another catalog merely to expand option count. Improve synthesis, repair schema drift, or enrich an existing layer first.

## Reference Catalog

| Reference | Primary use |
| --- | --- |
| `art-direction.md` | Concept, typography, color, composition, material, motion, anti-slop craft |
| `ux-production-checklist.md` | Accessibility, interaction, responsive behavior, performance, forms, navigation, states |
| `design-system.md` | Tokens, themes, variants, component contracts, naming |
| `surface-patterns.md` | Landing pages, dashboards, admin, forms, banners, slides |
| `component-patterns.md` | Buttons, inputs, cards, dialogs, tables, navigation, alerts, empty states |
| `data-visualization.md` | Charts, metrics, dashboard questions, scale integrity, accessible data UI |
| `brand-messaging.md` | Voice, positioning, proof, CTA, persuasive interface copy |
| `visual-identity-assets.md` | Logo, palette, typography, imagery, icons, asset organization |
| `responsive-layout.md` | Layout transformation, overflow, compact interaction, breakpoint reasoning |
| `production-handoff.md` | Approval, asset governance, naming, metadata, release handoff |
| `terminology.md` | Canonical style and system vocabulary |

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
| `generate_design_brief.py <query>` | Synthesize one chosen direction, decision chain, rejected alternatives, contracts, risks, and validation plan |
| `search_frontend_design.py <query>` | Search all references and data with terminology expansion |
| `lookup_term.py <query>` | Resolve canonical term, aliases, definition, and naming notes |
| `generate_component_brief.py <component>` | Component anatomy, variants, states, accessibility, content behavior |
| `generate_ux_checklist.py <query>` | Targeted UX and app-interface checks |
| `generate_palette_brief.py <query>` | Palette candidates and semantic color guidance |
| `generate_typography_brief.py <query>` | Font pairing, mood, scale, and readability evidence |
| `generate_chart_brief.py <query>` | Chart selection and accessible data-display guidance |
| `generate_copy_formula.py <query>` | Headline, section, CTA, persuasion, and proof formulas |
| `generate_banner_brief.py <surface> <type> <message>` | Dimensions, safe zones, composition, and export brief |
| `generate_slide_brief.py <query>` | Strategy, layout, copy, color, type, chart, and background evidence |
| `generate_icon_brief.py <query>` | Icon style and library candidates |
| `generate_logo_brief.py <query>` | Logo style, palette, industry, symbol, and scalability evidence |
| `generate_identity_brief.py <query>` | Identity package deliverables, style, mockup, and handoff evidence |
| `extract_brand_context.py <brand.md>` | Extract portable brand constraints from guidelines |
| `generate_tokens.py --starter` | Generate starter CSS variables or flatten token JSON |
| `contrast_check.py <fg> <bg>` | Calculate WCAG contrast ratio |
| `validate_frontend_design.py <path>` | Produce heuristic frontend evidence; not a compiler or visual review |
| `check_catalog.py` | Validate catalog schemas, required values, and generator smoke paths |

## Route by Intent

| Intent | Primary references | Optional scripts |
| --- | --- | --- |
| New UI, page, or component | `art-direction`, `ux-production-checklist`, `component-patterns`, `responsive-layout` | `generate_design_brief.py`, `generate_component_brief.py` |
| Redesign or polish | `art-direction`, `ux-production-checklist`, `design-system` | `generate_design_brief.py`, targeted search |
| Production hardening | `ux-production-checklist`, `responsive-layout`, `component-patterns` | validator, UX checklist, contrast check |
| Design system work | `design-system`, `component-patterns`, `visual-identity-assets` | token and component generators |
| Brand-aware implementation | `brand-messaging`, `visual-identity-assets`, `art-direction` | brand extraction, design brief |
| Landing or conversion | `surface-patterns`, `brand-messaging`, `art-direction` | design brief, copy formula |
| Dashboard or data UI | `data-visualization`, `surface-patterns`, `component-patterns` | design brief, chart brief |
| Banner, hero, or social asset | `surface-patterns`, `visual-identity-assets`, `art-direction` | banner, palette, typography briefs |
| Accessibility or responsive review | `ux-production-checklist`, `responsive-layout` | UX checklist, validator, contrast check |
| Identity, icon, or logo | `visual-identity-assets`, `brand-messaging`, `production-handoff` | icon, logo, identity briefs |

## Route by Surface

- `Landing page`: Surface patterns, messaging, art direction; copy, style, and product routing data.
- `Dashboard/admin`: Surface patterns, data visualization, components; product and style routing data.
- `Form/flow`: UX checklist, components, responsive layout; product patterns.
- `Component library`: Components, design system, UX checklist; component generator and style matrix.
- `Hero/banner/social`: Identity assets, surface patterns, art direction; banner specs, copy, color psychology.
- `Presentation/slides`: Surface patterns, messaging, data visualization; slide strategy/layout/copy/color/chart data.
- `Chart/report`: Data visualization, UX checklist, messaging; chart selection and product patterns.
- `Navigation/app shell`: Components, responsive layout, UX checklist; product patterns.
- `Identity package`: Identity assets, messaging, production handoff; logo, identity, icon data.

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
| Generic appearance | Art direction, identity assets | Style matrix and synthesized brief |
| Weak hierarchy | Art direction, surface patterns, components | Search `hierarchy` |
| Poor conversion | Messaging, surface patterns | Copy formulas and landing patterns |
| Inconsistent UI | Design system, components | Tokens and component brief |
| Accessibility risk | UX checklist, responsive layout | Validator, UX checklist, contrast check |
| Mobile breakage | Responsive layout, components | Validator plus compact render |
| Confusing data | Data visualization, messaging | Chart brief |
| Brand mismatch | Messaging, identity assets | Brand extraction |
| Palette uncertainty | Identity assets, art direction | Palette brief and contrast check |
| Typography uncertainty | Identity assets, art direction | Typography brief |
| Icon uncertainty | Identity assets, components | Icon brief |
| Handoff uncertainty | Production handoff, UX checklist | Validator and explicit evidence package |
| Naming uncertainty | Terminology | Term lookup |

## Workflow Stages

1. `Discovery`: Identify purpose, audience, surface, task pressure, brand, stack, and constraints.
2. `Synthesis`: Generate or write one chosen direction and decision chain.
3. `Structure`: Apply surface, hierarchy, responsive, and component contracts.
4. `System`: Map repeated decisions to semantic tokens and finite variants.
5. `Implementation`: Follow project-native architecture and styling conventions.
6. `Static validation`: Run project checks, targeted heuristic evidence, and catalog integrity when relevant.
7. `Visual proof`: Render representative sizes and states, compare against the chosen direction, fix drift, and record evidence.
