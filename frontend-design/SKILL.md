---
name: frontend-design
description: Integrated frontend design judgment for user-facing web and app interfaces plus visual frontend artifacts including landing pages, websites, homepages, pages, screens, dashboards, admin panels, forms, modals, components, cards, tables, heroes, banners, onboarding, slides, marketing sections, HTML and CSS layouts, Tailwind styling, themes, typography, palettes, spacing, motion, responsive behavior, accessibility, UX polish, visual redesign, frontend design review, and production-grade design systems. Relevant whenever work changes how an interface looks, feels, reads, or is operated, including small implementation tasks on visible UI. Uses a connected product surface system UX art direction validation lens rather than isolated styling advice.
metadata:
  version: 1.2.1
---

# Frontend Design

Create frontend work that feels authored, presents information in task-shaped form, adapts intrinsically to content and containers, remains usable under pressure, and extends as a coherent system. Fit the current project stack and conventions.

## Activate

Use this skill whenever work changes how a user-facing surface looks, feels, reads, moves, or operates. This includes pages, components, navigation, dashboards, forms, dialogs, tables, charts, landing pages, banners, slides, accessibility, responsive behavior, themes, states, design systems, and visual review. Treat visible UI coding as design work even when the request sounds small.

On activation, start unless a product or visual decision blocks every safe path. Preserve existing behavior and brand unless the task explicitly changes them.

## Outcome Contract

Every meaningful result should be:

- `Comprehensible`: The governing question, hierarchy, evidence, uncertainty, and next action form a clear scan path.
- `Distinctive`: One product-specific art direction and memory hook replace interchangeable UI.
- `Usable`: The primary path remains semantic, accessible, intrinsically adaptive, state-complete, and recoverable.
- `Systematic`: Repeated decisions use canonical terms, semantic tokens, finite variants, and reusable contracts.
- `Production-grade`: Implementation follows project architecture, handles real content and edge states, and carries proportional proof.

## Sequential Operating Kernel

Resolve these stages in order. The first unresolved stage is the next design decision. Do not reopen an upstream decision unless project evidence invalidates it.

### 1. Inspect

Read project instructions, the changed surface, adjacent components, tokens, styles, brand assets, content, behavior, and available runtime. Reuse the current framework, primitives, naming, and architecture.

For an existing surface, classify the work as targeted evolution or an explicitly approved overhaul before editing. Establish the baseline and mark meaningful product, brand, behavior, accessibility, integration, and technical contracts as preserve, evolve, replace, or unknown. Do not treat a visual improvement request as silent permission to change routes, information architecture, analytics, form contracts, content voice, or proven behavior.

Output: known constraints → relevant existing decisions → preservation boundary and redesign mode when applicable.

Deep detail: [`references/redesign.md`](references/redesign.md).

### 2. Frame

State the smallest useful brief:

- `Purpose and audience`: The outcome, user, frequency, device/context, and task pressure.
- `Governing question`: What the surface must help the user understand, decide, or do.
- `Constraints`: Brand, stack, accessibility, performance, localization, data/content extremes, container contexts, and scope.
- `Success`: The observable primary path and proof required.

Output: context → primary task → governing question.

### 3. Present Information

Choose the primary `operational`, `analytical`, `transactional`, `narrative`, `reference`, or `exploratory` mode. Classify orientation, status, priority, evidence, uncertainty, freshness, action, risk, recovery, and supporting detail. Decide:

- What appears first and remains visible.
- What groups, sequences, or compares on shared structure.
- What can move behind progressive disclosure without hiding trust or safety context.
- How density changes with task pressure.
- How loading, empty, partial, stale, error, permission, and long/localized content preserve orientation and recovery.

Prefer tables for aligned comparison, lists for sequences and queues, timelines for ordered events, split views for browse-and-inspect, and cards only for genuinely bounded units.

Output: presentation mode → first scan → persistent context → evidence/disclosure/recovery contract.

Deep detail: [`references/information-presentation.md`](references/information-presentation.md).

### 4. Direct the Experience

Choose one visual concept and one memory hook. Make typography, palette, composition, material, icon language, imagery, and motion express that direction while supporting the information contract. Name meaningful rejected alternatives when evidence exposes a real trade-off; never blend catalog candidates by default.

When supplied, captured, or generated imagery governs the direction, name each reference's role and provenance before implementation. Extract observed, inferred, and unknown decisions into a reference contract; use focused frames when compression hides detail, maintain a continuity ledger across a set, and never let an image silently invent behavior, content truth, responsive rules, or technical architecture.

Output: chosen direction → memory hook → visual-system implications → reference contract when applicable.

Deep detail: [`references/art-direction.md`](references/art-direction.md) and [`references/visual-reference-workflow.md`](references/visual-reference-workflow.md).

### 5. Set the UX and Intrinsic Floor

Protect, in order:

1. Semantics, keyboard access, visible focus, labels, contrast, non-color meaning, and reduced motion.
2. Task order, comfortable targets, feedback, preserved state, and recovery.
3. Content/container constraints: useful minimum, preferred, and maximum sizes; flow, wrap, fixed, overflow, and semantic phase-change behavior.
4. Performance: stable async space, optimized media, minimal JS, and transform/opacity motion.
5. Forms, navigation, data displays, and interaction states relevant to the task.

Let reusable components adapt to their containers. Use viewport breakpoints for page/environment behavior and only where continuous adaptation no longer preserves meaning. Never infer successful responsive behavior from desktop and mobile snapshots alone.

Output: accessibility/state contract → intrinsic layout contract → exact failure points that require phase changes.

Deep detail: [`references/ux-production-checklist.md`](references/ux-production-checklist.md) and [`references/responsive-layout.md`](references/responsive-layout.md).

### 6. Systematize and Implement

Map repeated decisions to semantic tokens, finite variants, component contracts, and canonical names. Keep one-off artwork local. Use semantic markup and the smallest sufficient project-native code. Add JavaScript only for real behavior; prefer CSS for layout, visual effects, and simple motion.

Keep destructive actions spatially and semantically separate. Do not introduce a second metaphor, accent system, icon language, or motion language that weakens the chosen direction.

When decisions must transfer across agents, design tools, surfaces, or implementation phases, encode them as a scoped design specification. Pair descriptive intent with semantic roles, bounded constraints, authoritative values only when established, and an explicit proof path. Keep tool-specific syntax subordinate to project-owned contracts.

Output: maintainable implementation whose structure expresses the prior contracts → portable design specification when the decisions require durable transfer.

Deep detail: [`references/design-system.md`](references/design-system.md), [`references/design-specification.md`](references/design-specification.md), and [`references/component-patterns.md`](references/component-patterns.md).

### 7. Prove

Run project-native type, lint, test, and build checks first; use heuristic scripts as evidence, never as visual proof. When rendering tools exist:

1. Render the narrowest supported, intermediate, desktop/wide, and relevant narrow/wide component-container contexts.
2. Exercise the primary flow and relevant loading, empty, partial, stale, error, permission, disabled, focus, zoom, reduced-motion, overflow, and localized/long-content states.
3. Run a five-second comprehension pass: identify orientation, primary status or claim, next action, evidence, uncertainty, and recovery without designer explanation.
4. Inspect scan path, comparison, disclosure, spacing, typography, contrast, cropping, targets, motion, and the chosen memory hook.
5. Run an authenticity sweep across repeated layout grammar, decorative labels, CTA intent, visible copy, factual-looking data, proof, assets, and product previews. Remove unsupported specificity and distinguish verified, derived, sample, placeholder, and unsupported content.
6. Correct the strongest comprehension, authenticity, or craft gap, rerender, and preserve useful evidence.

State explicitly when runnable, visual, or provenance proof remains unavailable. Static inspection cannot prove rendered quality, intrinsic behavior, or factual authenticity.

Output: static evidence → comprehension evidence → authenticity evidence → visual evidence → known limitations.

Deep detail: [`references/visual-craft.md`](references/visual-craft.md).

### 8. Hand Off

Report the chosen direction, meaningful trade-offs, changed contracts, checks run, visual evidence, and unavailable validation. The work is complete only when a maintainer can extend it naturally and users retain task clarity across real states and content pressure.

## Decision Ledger

For meaningful new work or redesigns, keep this compact ledger in reasoning or the generated brief:

```text
Context: <product, audience, pressure, constraints>
Information: <question, mode, first scan, persistent evidence/action>
Direction: <concept, memory hook, rejected conflict>
UX/layout: <accessibility, states, intrinsic constraints, phase changes>
System: <tokens, variants, component ownership>
Proof: <static, comprehension, visual, limitations>
Next: <first unresolved stage>
```

## Catalog and Tool Routing

Detailed routing lives in [`references/catalog-routing.md`](references/catalog-routing.md). Load the smallest useful context: use the operating kernel, then the primary reference for the unresolved decision; add a second reference or specialist generator only when a material cross-domain risk requires it.

```bash
node scripts/generate_design_brief.mjs "<product surface constraints>"
node scripts/search_frontend_design.mjs "<targeted uncertainty>"
node scripts/validate_frontend_design.mjs <changed-frontend-path>
node scripts/check_catalog.mjs
```

Use the design brief generator for a meaningful new direction or redesign. It should synthesize one direction with evidence, conflicts, uncertainty, rejected alternatives, and the canonical decision ledger rather than return ranked options. Specialist generators support narrower decisions.

Catalog growth remains frozen by default. Improve synthesis or an existing data layer before adding another catalog.
