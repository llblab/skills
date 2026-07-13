---
name: frontend-design
description: Integrated frontend design judgment for user-facing web and app interfaces plus visual frontend artifacts including landing pages, websites, homepages, pages, screens, dashboards, admin panels, forms, modals, components, cards, tables, heroes, banners, onboarding, slides, marketing sections, HTML and CSS layouts, Tailwind styling, themes, typography, palettes, spacing, motion, responsive behavior, accessibility, UX polish, visual redesign, frontend design review, and production-grade design systems. Relevant whenever work changes how an interface looks, feels, reads, or is operated, including small implementation tasks on visible UI. Uses a connected product surface system UX art direction validation lens rather than isolated styling advice.
metadata:
  version: 1.0.20
---

# Frontend Design

Create frontend work that feels authored, remains usable under pressure, adapts across devices, and extends as a coherent system. Fit the current project stack and conventions. Treat technology as delivery medium; the durable skill is connected product judgment, art direction, UX craft, systematic implementation, and visual proof.

## Use When

Use for work that changes how a user-facing surface looks, feels, moves, reads, or operates:

- Pages, components, layouts, navigation, dashboards, forms, modals, tables, cards, charts, landing pages, marketing sections, heroes, banners, slides, and app screens.
- Visual redesign, UX improvement, accessibility fixes, responsive behavior, states, dark mode, theming, tokenization, frontend polish, and design review.

Treat the skill as active even when the user frames visible UI work as a small coding task. Do not wait for the word "design."

## Activation and Default Action

Strong triggers include:

- `Surface nouns`: Landing, website, homepage, page, screen, dashboard, admin, form, modal, component, card, table, banner, hero, slide, flow, onboarding.
- `Quality verbs`: Design, redesign, polish, improve, make beautiful, make professional, make responsive, make accessible, present, showcase, explain visually.
- `UX implementation`: HTML/CSS layout, Tailwind classes, theme, tokens, typography, palette, spacing, animation, dark mode, mobile layout.

On activation:

1. Frame the smallest useful brief: purpose, audience, tone, differentiator, constraints.
2. Sweep the connected coverage model and load only relevant catalog slices.
3. Choose one direction; do not dump unrelated style, palette, or typography candidates into the result.
4. Implement semantic markup, responsive behavior, accessible interaction, complete states, and named system decisions.
5. Run project-native checks, targeted heuristic evidence, and the visual proof loop when tools permit.

Ask only when a visual or product decision genuinely blocks safe progress. Otherwise choose a coherent local direction and state it briefly.

## Catalog Routing

Detailed reference, data, script, intent, surface, product, problem, and workflow routing lives in [`references/catalog-routing.md`](references/catalog-routing.md).

Default tools:

```bash
python scripts/generate_design_brief.py "<product surface constraints>"
python scripts/search_frontend_design.py "<targeted uncertainty>"
python scripts/validate_frontend_design.py <changed-frontend-path>
python scripts/check_catalog.py
```

Use `generate_design_brief.py` for meaningful new directions and redesigns. It must synthesize one chosen direction, not substitute search results for judgment. Specialist generators provide evidence for narrower decisions.

Catalog growth is frozen by default: do not add another catalog until existing data converges into useful decisions, schema checks pass, and the missing information cannot fit an existing layer.

## Core Contract

Every result should be:

- `Distinctive`: A clear product-specific point of view, not interchangeable UI.
- `Usable`: The primary path is obvious, responsive, accessible, and recoverable.
- `Production-grade`: Real states, semantics, edge cases, maintainable code, and project-native implementation.
- `Systematic`: Intentional values, canonical terms, finite variants, reusable decisions, and consistent behavior.
- `Contextual`: Shaped by product, audience, brand, task pressure, content, input mode, and device reality.
- `Proven`: Checked statically and visually to the extent local tools allow; limitations are explicit.

## Connected Coverage Model

Treat frontend design as one decision system. For every meaningful task, sweep these lenses before selecting references or scripts:

1. `Product and audience`: Who uses the surface, under what pressure, and what outcome should happen next?
2. `Surface and structure`: What artifact is this, what task order fits it, and what information must remain visible?
3. `Message and hierarchy`: What is the primary claim or action, what proof/context supports it, and how quickly can users scan it?
4. `Art direction and identity`: What one visual concept, memory hook, palette, type mood, icon language, material, and motion system make it authored?
5. `Interaction and UX floor`: What states, semantics, accessibility, responsive behavior, input modes, performance, and feedback must not fail?
6. `System and handoff`: What tokens, variants, naming, reusable contracts, edge cases, validation, and evidence keep it maintainable?

Load a slice when its lens affects outcome or risk. Skip it only when genuinely irrelevant. Prefer connected decisions: color should support hierarchy, art direction, contrast, state semantics, and tokens at once.

## Design Decision Chain

A meaningful brief or implementation should resolve this chain:

```text
Context
→ Primary user task
→ Surface structure
→ Message hierarchy
→ One chosen art direction
→ One memory hook
→ Palette / type / material decisions
→ Component and state contracts
→ Responsive transformation
→ Validation evidence
```

When alternatives matter, name why they were rejected. Do not blend multiple directions merely because the catalog returned them.

## Operating Flow

1. `Inspect`: Read project instructions, existing components, tokens, styles, brand assets, content, behavior, and relevant reference implementation.
2. `Frame`: State purpose, audience, tone, differentiator, constraints, success path, and assumptions.
3. `Sweep`: Use the coverage model to identify relevant lenses and likely blind spots.
4. `Synthesize`: Choose one connected direction and memory hook; resolve conflicts among catalog candidates.
5. `Set UX floor`: Define semantics, accessibility, responsive behavior, performance, navigation, forms, feedback, and required states.
6. `Systematize`: Map repeated decisions to semantic tokens, finite variants, component contracts, and canonical names.
7. `Implement`: Follow project-native architecture and use the smallest sufficient code.
8. `Validate statically`: Run project type/lint/test commands and targeted heuristic evidence. Treat heuristics as review aids, not proof by themselves.
9. `Prove visually`: Render representative compact and desktop widths plus important states; compare them against hierarchy, chosen direction, memory hook, component contracts, and responsive intent.
10. `Iterate and hand off`: Correct visible drift, rerun affected checks, and report evidence, trade-offs, and unavailable validation.

## Design Brief

Before building, identify the smallest useful brief:

- `Purpose`: What problem does the surface solve, and what should the user do next?
- `Audience`: Who uses it, how often, on what device, and under what pressure?
- `Tone`: Choose one decisive direction such as editorial, industrial, cybernetic, refined, playful, utilitarian, organic, or calm institutional.
- `Differentiator`: What single visual or interaction idea makes the result memorable?
- `Constraints`: Existing stack, brand, accessibility, data density, performance, localization, responsive targets, content, and implementation scope.

If brand guidance exists, obey it. If not, create a lightweight local direction: palette roles, typography mood, density, motion language, and one visual metaphor. Preserve existing behavior unless the task explicitly changes it.

## Decision Priority

1. `Accessibility`: Semantics, keyboard access, visible focus, contrast, labels, reduced motion, screen-reader meaning.
2. `Task and interaction`: Clear primary path, comfortable targets, feedback, complete states, no critical hover-only behavior.
3. `Performance`: Minimal unnecessary JS, stable async space, optimized media, transform/opacity motion.
4. `Product and style fit`: Visual language matches audience, brand, task seriousness, and content.
5. `Responsive transformation`: Priority survives compact layouts without accidental overflow or hidden essentials.
6. `Typography and color`: Readable scales, semantic roles, accessible pairs, truthful data/status encoding.
7. `Forms and recovery`: Visible labels, errors near cause, preserved input, retry/undo/escape paths.
8. `Navigation and state`: Predictable back behavior, current location, preserved context, deep links where useful.
9. `Motion`: Meaningful, interruptible, restrained, and reduced-motion aware.
10. `Charts and data`: Question-led selection, direct labels, truthful scales, freshness, non-color meaning.

## Implementation Principles

- Use the project's current framework, component primitives, style system, file structure, and naming conventions.
- Keep markup semantic: buttons are buttons, links are links, headings form a hierarchy, and inputs have labels.
- Prefer CSS for visual effects and simple motion; add JS only for real behavior.
- Design loading, empty, error, success, disabled, selected, stale/offline, overflow, long text, compact width, and keyboard focus where relevant.
- Keep one icon language and use SVG or the project icon set for functional controls.
- Separate destructive actions visually, spatially, and semantically from primary actions.
- For dense tools, prioritize scanning, grouping, alignment, freshness, and input efficiency over decoration.
- For expressive surfaces, match implementation complexity to the chosen idea and content reality.
- Tokenize repeated semantic decisions; keep one-off artwork local.
- Avoid adding a second metaphor, accent system, or motion language that weakens the chosen direction.

## Visual Proof Loop

When browser, preview, screenshot, or equivalent rendering tools are available:

1. Render at representative compact and desktop widths; add tablet/wide views when layout behavior changes there.
2. Exercise the primary flow plus loading, empty, error, disabled, long-content, overflow, focus, and reduced-motion states relevant to the change.
3. Inspect hierarchy, alignment, spacing, typography, contrast, cropping, touch targets, overflow, state clarity, and motion.
4. Compare the render with the chosen direction and memory hook. Remove generic or conflicting moves.
5. Correct the strongest visible gap, rerender, and preserve screenshots or equivalent evidence when useful.

If rendering tools or runnable project state are unavailable, say so explicitly. Do not imply visual validation from static inspection alone.

## Final Review

Before presenting or committing, verify:

1. `Concept`: One clear aesthetic idea and memory hook, not default UI with decoration.
2. `Fit`: Tone and structure match product, audience, content, and task seriousness.
3. `Hierarchy`: Primary action/status and key information become obvious quickly.
4. `Accessibility`: Semantics, focus, contrast, labels, input modes, and reduced motion are covered.
5. `Responsive`: Compact and desktop renders preserve task priority without accidental overflow.
6. `States`: Relevant loading, empty, error, disabled, success, focus, stale, long-content, and overflow states work.
7. `System`: Repeated values are semantic tokens; variants and component contracts remain finite and consistent.
8. `Craft`: Rendered spacing, alignment, typography, color, imagery, and motion support the chosen direction.
9. `Originality`: The result avoids interchangeable AI/SaaS clichés and conflicting visual metaphors.
10. `Maintainability`: The next maintainer can extend the implementation naturally.
11. `Evidence`: Project checks ran; heuristic findings were reviewed; representative visual proof exists or its absence is explicit.
