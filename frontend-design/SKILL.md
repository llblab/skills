---
name: frontend-design
description: Integrated frontend design judgment for user-facing web and app interfaces plus visual frontend artifacts including landing pages, websites, homepages, pages, screens, dashboards, admin panels, forms, modals, components, cards, tables, heroes, banners, onboarding, slides, marketing sections, HTML and CSS layouts, Tailwind styling, themes, typography, palettes, spacing, motion, responsive behavior, accessibility, UX polish, visual redesign, frontend design review, and production-grade design systems. Relevant whenever work changes how an interface looks, feels, reads, or is operated, including small implementation tasks on visible UI. Uses a connected product surface system UX art direction validation lens rather than isolated styling advice.
metadata:
  version: 1.0.19
---

# Frontend Design

Create frontend work that is visually distinctive, usable, accessible, responsive, maintainable, and coherent as a design system. Fit the current project stack and conventions. Treat technology as the delivery medium; the durable skill is art direction, UX judgment, interface craft, and systematic implementation.

## Use When

Use for work that changes how an interface looks, feels, moves, reads, or is operated:

- Pages, components, layouts, navigation, dashboards, forms, modals, tables, cards, charts, landing pages, marketing sections, heroes, banners, slides, and app screens.
- Visual redesign, UX improvement, accessibility fixes, responsive behavior, state design, dark mode, theming, tokenization, frontend polish, and design review.

## Activation Heuristics

Treat this skill as active when the requested artifact is a user-facing surface, even if the user frames it as a small coding task.

Strong triggers:

- Surface nouns: landing, website, homepage, page, screen, dashboard, admin, form, modal, component, card, table, banner, hero, slide, presentation, flow, onboarding.
- Quality verbs: design, redesign, polish, improve, make beautiful, make professional, make responsive, make accessible, present, showcase, explain visually.
- Implementation nouns that affect UX directly: HTML/CSS layout, Tailwind classes, theme, tokens, typography, palette, spacing, animation, dark mode, mobile layout.

Default action on trigger:

1. Frame the smallest useful design brief before editing: purpose, audience, tone, differentiator, constraints.
2. Load only the relevant catalog slices for the surface and risk.
3. Implement with semantic markup, responsive behavior, accessible focus/contrast, and named visual decisions.
4. Validate with the available local checks when files are changed.

Do not wait for the user to say "design" when the artifact itself is a design surface. Ask only when a visual direction is genuinely blocking; otherwise choose a coherent local direction and state it briefly.

## Catalog Index

Load only the slices needed for the task. Treat this skill as a multidimensional index: route by **intent**, **surface**, **product category**, **design problem**, **artifact**, or **validation need**.

### Reference Catalog

| Reference                               | Use For                                                                           |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| `references/art-direction.md`           | Visual styles, typography, color, composition, material, motion, anti-slop craft  |
| `references/ux-production-checklist.md` | Accessibility, interaction, responsive, performance, forms, navigation, states    |
| `references/design-system.md`           | Tokens, themes, variants, component contracts, naming discipline                  |
| `references/surface-patterns.md`        | Landing pages, dashboards, admin, forms, banners, slides, marketing surfaces      |
| `references/component-patterns.md`      | Buttons, inputs, cards, dialogs, tables, navigation, badges, alerts, empty states |
| `references/data-visualization.md`      | Charts, metrics, dashboards, comparison, forecast, realtime, accessible data UI   |
| `references/brand-messaging.md`         | Voice, positioning, proof, CTA, persuasive UI copy                                |
| `references/visual-identity-assets.md`  | Logo, palette, typography, icons, asset organization                              |
| `references/responsive-layout.md`       | Breakpoint thinking, layout adaptation, overflow, mobile interaction              |
| `references/production-handoff.md`      | Approval, asset governance, naming, metadata, release handoff                     |
| `references/terminology.md`             | Canonical style/system terms and key distinctions                                 |

### Data Catalog

| Data                                | Use For                                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `data/terminology.csv`              | Canonical terms, aliases, definitions, and naming notes for consistent search/output                        |
| `data/style-matrix.csv`             | Curated compact style vocabulary, fit, core moves, risks, implementation checks                             |
| `data/style-catalog.csv`            | Extended style catalog with colors, effects, accessibility, mobile, conversion, technical checks            |
| `data/product-patterns.csv`         | Curated compact product-category pattern routing and must-have/avoid guidance                               |
| `data/product-ui-patterns.csv`      | Extended product-type routing: style, landing pattern, dashboard style, palette, UX priorities              |
| `data/product-reasoning.csv`        | Product category → recommended pattern, style priority, color mood, typography mood, effects, anti-patterns |
| `data/ux-guidelines.csv`            | Detailed UX issue matrix: accessibility, touch, performance, layout, forms, navigation, motion              |
| `data/app-interface-guidelines.csv` | App interface issues and platform behavior guidance                                                         |
| `data/landing-patterns.csv`         | Landing page structures, section order, CTA placement, conversion optimization                              |
| `data/copy-formulas.csv`            | Compact headline, section, CTA, persuasion, proof, urgency formulas                                         |
| `data/slide-copy.csv`               | Extended slide/presentation copy formulas and emotion triggers                                              |
| `data/banner-specs.csv`             | Social/web/banner dimensions, aspect ratios, safe zones                                                     |
| `data/icon-styles.csv`              | Compact icon style vocabulary, stroke/fill rules, usage checks                                              |
| `data/icon-library-map.csv`         | Icon categories, names, keywords, libraries, usage, best fit                                                |
| `data/icon-generation-styles.csv`   | Icon generation style specs: stroke, fill, best fit, keywords                                               |
| `data/color-psychology.csv`         | Compact color signals, industry fit, cautions, pairings                                                     |
| `data/logo-styles.csv`              | Logo style vocabulary, symbols, colors, typography, effects                                                 |
| `data/logo-color-palettes.csv`      | Logo palette candidates with primary/secondary/accent/background                                            |
| `data/logo-industries.csv`          | Industry-specific logo style, symbols, mood, and color guidance                                             |
| `data/identity-deliverables.csv`    | Identity/CIP deliverables, dimensions, formats, logo placement                                              |
| `data/identity-industries.csv`      | Industry-specific identity package direction                                                                |
| `data/identity-styles.csv`          | Identity style systems, materials, finishes, typography                                                     |
| `data/identity-mockup-contexts.csv` | Mockup scene contexts, lighting, environment, props                                                         |
| `data/product-color-palettes.csv`   | Product-type palettes with foreground/background/on-color roles                                             |
| `data/typography-pairings.csv`      | Font pairings by mood, product fit, scale, weights, accessibility notes                                     |
| `data/chart-selection.csv`          | Chart choice by data type, use case, volume, accessibility                                                  |
| `data/slide-charts.csv`             | Presentation chart types and slide-specific chart guidance                                                  |
| `data/slide-strategies.csv`         | Deck structures, audience, tone, emotion arc, slide order                                                   |
| `data/slide-layouts.csv`            | Slide/page layout patterns, zones, visual weight, CTA placement                                             |
| `data/slide-layout-logic.csv`       | Goal/emotion → layout direction, visual weight, pattern breaking                                            |
| `data/slide-typography.csv`         | Typography scale by content type for presentation/hero surfaces                                             |
| `data/slide-color-logic.csv`        | Emotion → background, text, accent, gradient, card style                                                    |
| `data/slide-backgrounds.csv`        | Background image categories, overlays, text placement                                                       |

Data layers are intentional, not accidental duplicates:

- **Compact curated tables** (`*-matrix`, `*-patterns`, `copy-formulas`, `icon-styles`, `color-psychology`) are fast defaults for direct use.
- **Extended catalogs** (`*-catalog`, `product-*`, `ux-guidelines`, `typography-pairings`) provide broader search space and edge cases.
- **Surface-specific tables** (`slide-*`, `banner-specs`, `chart-selection`) specialize generic rules for exact artifacts.
- **Identity tables** (`logo-*`, `identity-*`) support brand asset work without requiring generation tools.
- Prefer generator scripts over manually juggling overlapping tables; scripts merge compact and extended layers where useful.

### Script Catalog

| Script                                                        | Use For                                                                                  |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `scripts/search_frontend_design.py <query>`                   | Search all references/data quickly; expands terminology aliases                          |
| `scripts/lookup_term.py <query>`                              | Lookup canonical term, aliases, definition, and naming notes                             |
| `scripts/generate_design_brief.py <query>`                    | Route product/style into a compact implementation brief                                  |
| `scripts/extract_brand_context.py <brand.md>`                 | Extract portable brand context from markdown guidelines                                  |
| `scripts/generate_tokens.py --starter`                        | Generate CSS variables from starter or token JSON                                        |
| `scripts/validate_frontend_design.py <path>`                  | Heuristic validation for accessibility, tokens, responsive, motion basics                |
| `scripts/contrast_check.py <fg> <bg>`                         | WCAG contrast ratio check                                                                |
| `scripts/generate_banner_brief.py <surface> <type> <message>` | Banner/hero brief from target surface and dimensions                                     |
| `scripts/generate_copy_formula.py <query>`                    | Copy formula lookup for headlines, sections, CTAs, persuasion                            |
| `scripts/generate_slide_brief.py <query>`                     | Slide, presentation, and section-layout brief from strategy/layout/copy/color/chart data |
| `scripts/generate_palette_brief.py <query>`                   | Product palette, semantic colors, and color psychology guidance                          |
| `scripts/generate_typography_brief.py <query>`                | Font pairing, mood, scale, and readability guidance                                      |
| `scripts/generate_chart_brief.py <query>`                     | Chart/data visualization selection and accessibility guidance                            |
| `scripts/generate_icon_brief.py <query>`                      | Icon style and icon-library candidate guidance                                           |
| `scripts/generate_logo_brief.py <query>`                      | Logo style, palette, industry, symbol, and scalability guidance                          |
| `scripts/generate_identity_brief.py <query>`                  | Identity package/CIP deliverables, style, mockup, and handoff guidance                   |
| `scripts/generate_component_brief.py <component>`             | Component anatomy, variants, states, accessibility, and UX checks                        |
| `scripts/generate_ux_checklist.py <query>`                    | Targeted UX checklist from UX/app-interface matrices                                     |

## Routing Index

### By Intent

| User Intent                     | Load                                                                                  | Optional Script                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Build a new UI/page/component   | `art-direction`, `ux-production-checklist`, `component-patterns`, `responsive-layout` | `generate_design_brief.py`                                                     |
| Redesign or polish UI           | `art-direction`, `ux-production-checklist`, `design-system`                           | `search_frontend_design.py polish`                                             |
| Create design direction         | `art-direction`, `brand-messaging`, `visual-identity-assets`                          | `generate_design_brief.py`                                                     |
| Make it production-grade        | `ux-production-checklist`, `responsive-layout`, `component-patterns`                  | `validate_frontend_design.py`                                                  |
| Build or refactor design system | `design-system`, `component-patterns`, `visual-identity-assets`                       | `generate_tokens.py`                                                           |
| Brand-aware implementation      | `brand-messaging`, `visual-identity-assets`, `art-direction`                          | `extract_brand_context.py`                                                     |
| Landing/marketing conversion    | `surface-patterns`, `brand-messaging`, `art-direction`                                | `generate_copy_formula.py`                                                     |
| Dashboard/data UI               | `data-visualization`, `surface-patterns`, `component-patterns`                        | `generate_design_brief.py dashboard`                                           |
| Banner/hero/social asset        | `surface-patterns`, `visual-identity-assets`, `art-direction`                         | `generate_banner_brief.py`                                                     |
| Accessibility/responsive review | `ux-production-checklist`, `responsive-layout`                                        | `generate_ux_checklist.py`, `validate_frontend_design.py`, `contrast_check.py` |

### By Surface

| Surface                  | Primary References                                                               | Data                                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Landing page             | `surface-patterns`, `brand-messaging`, `art-direction`                           | `copy-formulas`, `style-matrix`, `product-patterns`                                                  |
| Dashboard/admin          | `surface-patterns`, `data-visualization`, `component-patterns`                   | `product-patterns`, `style-matrix`                                                                   |
| Form/flow                | `ux-production-checklist`, `component-patterns`, `responsive-layout`             | `product-patterns`                                                                                   |
| Component library        | `component-patterns`, `design-system`, `ux-production-checklist`                 | `generate_component_brief.py`, `style-matrix`                                                        |
| Hero/banner/social       | `visual-identity-assets`, `surface-patterns`, `art-direction`                    | `banner-specs`, `copy-formulas`, `color-psychology`                                                  |
| Presentation/slides      | `surface-patterns`, `brand-messaging`, `data-visualization`                      | `slide-strategies`, `slide-layouts`, `slide-copy`, `slide-color-logic`, `slide-charts`               |
| Chart/report             | `data-visualization`, `ux-production-checklist`, `brand-messaging`               | `product-patterns`, `color-psychology`                                                               |
| Navigation/app shell     | `component-patterns`, `responsive-layout`, `ux-production-checklist`             | `product-patterns`                                                                                   |
| Brand asset/icon/logo UI | `visual-identity-assets`, `art-direction`, `design-system`, `production-handoff` | `generate_logo_brief.py`, `generate_icon_brief.py`, `logo-styles`, `icon-styles`, `color-psychology` |
| Identity package / CIP   | `visual-identity-assets`, `brand-messaging`, `production-handoff`                | `generate_identity_brief.py`, `identity-deliverables`, `identity-styles`, `identity-industries`      |

### By Product Category

Start with `data/product-patterns.csv`, then load references by pattern bias:

- **SaaS / productivity / docs** → `surface-patterns`, `component-patterns`, `design-system`.
- **Finance / crypto / legal / healthcare / public** → `ux-production-checklist`, `brand-messaging`, `data-visualization`, `visual-identity-assets`.
- **E-commerce / marketplace / hospitality / restaurant** → `surface-patterns`, `brand-messaging`, `visual-identity-assets`.
- **Analytics / monitoring / ops** → `data-visualization`, `surface-patterns`, `responsive-layout`.
- **Creative / portfolio / games / entertainment** → `art-direction`, `surface-patterns`, `visual-identity-assets`.
- **Education / wellness / nonprofit** → `ux-production-checklist`, `brand-messaging`, `art-direction`.

### By Design Problem

| Problem                      | Load                                                                      | Data/Script                                                                    |
| ---------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Looks generic                | `art-direction`, `visual-identity-assets`                                 | `style-matrix`                                                                 |
| Weak hierarchy               | `art-direction`, `surface-patterns`, `component-patterns`                 | `search_frontend_design.py hierarchy`                                          |
| Poor conversion              | `brand-messaging`, `surface-patterns`                                     | `copy-formulas`, `generate_copy_formula.py`                                    |
| Inconsistent UI              | `design-system`, `component-patterns`                                     | `generate_tokens.py`                                                           |
| Accessibility risk           | `ux-production-checklist`, `responsive-layout`                            | `contrast_check.py`, `validate_frontend_design.py`                             |
| Mobile breaks                | `responsive-layout`, `component-patterns`                                 | `validate_frontend_design.py`                                                  |
| Data is confusing            | `data-visualization`, `brand-messaging`                                   | `search_frontend_design.py chart`                                              |
| Brand mismatch               | `brand-messaging`, `visual-identity-assets`                               | `extract_brand_context.py`                                                     |
| Asset crop/size uncertainty  | `visual-identity-assets`, `surface-patterns`                              | `banner-specs`, `generate_banner_brief.py`                                     |
| Palette uncertainty          | `visual-identity-assets`, `art-direction`                                 | `generate_palette_brief.py`, `product-color-palettes`, `color-psychology`      |
| Typography uncertainty       | `visual-identity-assets`, `art-direction`                                 | `generate_typography_brief.py`, `typography-pairings`                          |
| Chart choice uncertainty     | `data-visualization`                                                      | `generate_chart_brief.py`, `chart-selection`, `slide-charts`                   |
| Icon choice uncertainty      | `visual-identity-assets`, `component-patterns`                            | `generate_icon_brief.py`, `icon-styles`, `icon-library-map`                    |
| Logo/identity uncertainty    | `visual-identity-assets`, `brand-messaging`, `production-handoff`         | `generate_logo_brief.py`, `generate_identity_brief.py`, `logo-*`, `identity-*` |
| Handoff/approval uncertainty | `production-handoff`, `visual-identity-assets`, `ux-production-checklist` | `validate_frontend_design.py`                                                  |
| Term/name uncertainty        | `terminology`                                                             | `terminology.csv`, `lookup_term.py`                                            |

### By Workflow Stage

1. **Discovery**: `lookup_term.py` when naming is ambiguous, then `generate_design_brief.py`, `product-patterns`, `style-matrix`.
2. **Direction**: `art-direction`, `brand-messaging`, `visual-identity-assets`.
3. **Structure**: `surface-patterns`, `responsive-layout`, `component-patterns`.
4. **System**: `design-system`, `icon-styles`, `color-psychology`, `generate_tokens.py`.
5. **Implementation**: Current project conventions plus relevant surface/component references.
6. **Validation**: `ux-production-checklist`, `validate_frontend_design.py`, `contrast_check.py`.
7. **Iteration**: Search targeted weak point with `search_frontend_design.py`.

## Core Contract

Every result should be:

- **Distinctive**: A clear aesthetic point of view, not generic UI.
- **Usable**: The primary path is obvious, responsive, accessible, and recoverable.
- **Production-grade**: Real states, edge cases, semantics, maintainable code, and project-native implementation.
- **Systematic**: Intentional values, canonical terms, named patterns, reusable decisions, and consistent variants.
- **Contextual**: Shaped by the product, audience, brand, task pressure, and device reality.

## Integrated Coverage Model

This skill is one design intelligence with many lenses, not a pile of optional modules. For every meaningful task, run a quick coverage sweep across these lenses before choosing which references or scripts to load:

1. **Product and audience**: Who is the surface for, what pressure are they under, and what outcome should happen next?
2. **Surface pattern**: What kind of artifact is it, and what structure does that surface usually need?
3. **Message and hierarchy**: What is the primary claim/action, what proof supports it, and how quickly can it be scanned?
4. **Art direction and identity**: What memorable visual idea, palette, type mood, icon language, and material system make it authored?
5. **Interaction and UX floor**: What states, accessibility, responsive behavior, input mode, motion, and feedback must not fail?
6. **System and handoff**: What tokens, variants, naming, reusable pieces, validation, and edge cases keep it maintainable?

Use the sweep to prevent blind spots. Load a slice when its lens affects the outcome or risk; skip it only when it is genuinely irrelevant and the omission is intentional. Prefer connected decisions over isolated improvements: a color choice should support the art direction, copy hierarchy, accessibility, and component system at once.

## Operating Flow

1. **Frame**: Purpose, audience, tone, differentiator, constraints, success path.
2. **Sweep**: Use the integrated coverage model to identify the lenses that matter and the likely blind spots.
3. **Name precisely**: Use canonical terminology for styles, systems, surfaces, and artifacts.
4. **Choose direction**: Select a coherent art direction and interaction language.
5. **Set UX floor**: Accessibility, responsive behavior, performance, navigation, forms, states.
6. **Systematize**: Use tokens, variants, component states, naming, and theme semantics.
7. **Implement**: Use current project conventions and the smallest sufficient code.
8. **Review**: Check concept, hierarchy, accessibility, responsive behavior, states, system consistency, craft, originality, maintainability.

## Design Brief

Before building, identify the smallest useful brief:

- **Purpose**: What problem does this UI solve, and what should the user do next?
- **Audience**: Who uses it, how often, on what device, and under what pressure?
- **Tone**: Choose a decisive direction: brutal minimalism, editorial, industrial, cybernetic, luxury, playful, utilitarian, retro-futuristic, organic, calm institutional, maximalist, etc.
- **Differentiator**: What is the memorable visual or interaction idea?
- **Constraints**: Existing stack, brand, accessibility, data density, performance, localization, responsive targets, and implementation scope.

If brand guidance exists, obey it. If no brand exists, create a lightweight local direction: palette, typography mood, density, motion language, and visual metaphor.

## Design Decisions Priority

1. **Accessibility**: Semantics, keyboard access, visible focus, contrast, labels, reduced motion, screen-reader meaning.
2. **Touch and interaction**: Comfortable targets, clear pressed/loading/disabled states, no critical hover-only actions.
3. **Performance**: Minimal unnecessary JS, reserved async space, optimized media, transform/opacity animation.
4. **Style fit**: Visual language matches product, audience, and task seriousness.
5. **Responsive layout**: Mobile-first behavior, no accidental horizontal scroll, robust wrapping, readable line lengths.
6. **Typography and color**: Readable body scale, semantic color roles, accessible foreground/background pairs.
7. **Animation**: Meaningful easing, interruptible transitions, reduced-motion support.
8. **Forms and feedback**: Visible labels, helper text, inline errors, recovery paths, preserved input.
9. **Navigation**: Predictable back behavior, current location clarity, preserved state, deep-linkable flows where relevant.
10. **Charts and data**: Labels, legends, tooltips, accessible colors, truthful scale, no color-only meaning.

## Implementation Principles

- Use the project's current framework, style system, file structure, and naming conventions.
- Keep markup semantic: buttons are buttons, links are links, headings form a hierarchy, inputs have labels.
- Prefer CSS for visual effects and simple motion; add JS for real behavior.
- Design real states: loading, empty, error, success, disabled, overflow, long text, small screens, keyboard focus.
- Keep icon language consistent; use SVG/icon sets for functional icons.
- Make destructive actions visually and spatially distinct from primary actions.
- For dense tools, prioritize scanning, grouping, alignment, and input efficiency over decoration.
- For expressive surfaces, match implementation complexity to the aesthetic idea.

## Final Review

Before presenting or committing, verify:

1. **Concept**: Clear aesthetic idea, not default UI with decoration.
2. **Fit**: Tone matches product, audience, and task seriousness.
3. **Hierarchy**: Primary action and key information are obvious quickly.
4. **Accessibility**: Semantics, focus, contrast, labels, reduced motion covered.
5. **Responsive**: Content adapts without breaking or hiding essentials.
6. **States**: Loading, empty, error, disabled, focus, hover/pressed, and long-content states considered.
7. **System**: Repeated values are named or tokenized; variants are consistent.
8. **Craft**: Spacing, alignment, typography, color, and motion are tuned.
9. **Originality**: The result avoids interchangeable AI/SaaS clichés.
10. **Maintainability**: The next maintainer can extend it naturally.
