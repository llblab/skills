# Redesign and Existing-Surface Evolution

Treat redesign as constrained system evolution, not permission to replace a working product with a preferred aesthetic. Preserve proven identity, behavior, and operational contracts unless the brief explicitly changes them. Use [`visual-reference-workflow.md`](visual-reference-workflow.md) for matched before/after evidence and [`visual-craft.md`](visual-craft.md) for final fit and provenance review.

## Classify the Change

Choose the smallest honest mode before editing:

- `Targeted evolution`: Modernize or repair a surface while preserving its information architecture, brand recognition, behavior, and content model.
- `Approved overhaul`: Introduce a new visual language while preserving product behavior and every contract not explicitly included in the overhaul.
- `Greenfield`: Use only when no meaningful existing surface exists or replacement scope is explicit.

If preserve versus overhaul would lead to materially different work and the brief does not decide it, ask one focused question. Do not silently interpret “improve,” “modernize,” or “make premium” as overhaul approval.

## Establish the Baseline

Inspect the existing surface before proposing a direction:

- `Product path`: Primary tasks, conversion paths, navigation, page hierarchy, deep links, and recovery routes.
- `Visual system`: Brand assets, typography, palette, spacing, radii, icon language, imagery, elevation, motion, and signature compositions.
- `Content`: Voice, terminology, information hierarchy, real content extremes, localization pressure, and legally required copy.
- `Behavior`: Interaction states, keyboard behavior, focus lifecycle, validation, preserved state, permissions, loading, error, and empty conditions.
- `Integration contracts`: Routes, anchors, form names and payloads, analytics events, selectors used by tests or automation, metadata, structured data, consent, and external embeds.
- `Technical shape`: Framework, component ownership, styling method, tokens, dependencies, responsive strategy, performance constraints, and known workarounds.
- `Evidence`: Existing screenshots at representative widths and states, current validation, accessibility wins and failures, and measured performance when available.

Separate what users recognize or depend on from what merely happens to exist. Mark each meaningful element as `preserve`, `evolve`, `replace`, or `unknown` before broad visual changes.

## Preservation Boundary

Do not change these silently:

- URL structure, route slugs, anchors, navigation labels, or task order.
- Form field names, payload shape, validation timing, autofill semantics, or submission behavior.
- Analytics events, automation selectors, integration hooks, or permission behavior.
- Logo, wordmark, established brand assets, approved terminology, or content voice.
- Legal, privacy, consent, accessibility, localization, or structured-data contracts.
- Functional behavior that users, tests, or downstream systems already rely on.

When a requested visual improvement pressures one of these contracts, surface the trade-off and obtain explicit scope before changing it. Preserve existing accessibility and performance strengths even when the surrounding design needs repair.

## Diagnose Before Replacing

Tie every proposed change to observed evidence:

1. Identify the user or system consequence, not only the visual symptom.
2. Locate the smallest owning layer such as content, token, component, layout, interaction, or page composition.
3. Distinguish a repeated system defect from a local exception.
4. Preserve recognizable strengths and remove only patterns that obstruct comprehension, use, adaptation, or the approved direction.
5. Prefer targeted correction over framework migration, wholesale component replacement, or unrelated content rewriting.

A redesign should not erase product memory merely to look newer. Novelty earns its place by improving the governing question, primary path, system coherence, or measurable quality floor.

## Sequence by Value and Risk

Use this default order, skipping layers that evidence does not implicate:

1. Repair semantics, accessibility, broken states, responsive failures, and behavior regressions.
2. Clarify information hierarchy, task order, copy, and persistent context.
3. Normalize typography, color roles, spacing rhythm, and foundational tokens.
4. Correct repeated component and layout contracts.
5. Add product-specific art direction, imagery, material, and motivated motion.
6. Recompose major page regions only when lower-risk changes cannot satisfy the brief.

Keep each slice reviewable. Do not bundle a visual refresh with route, data, state, framework, or content-model changes unless the approved outcome requires them.

## Prove Preservation and Improvement

Compare before and after under the same evidence conditions:

- Representative wide, intermediate, narrow, zoomed, and component-container widths.
- Primary flow plus loading, empty, partial, error, permission, disabled, focus, reduced-motion, and long/localized content states.
- Existing behavior, accessibility, integration, and project-native validation.
- Scan path, brand recognition, task completion, responsive phase changes, and the approved memory hook.
- Metadata, analytics, routes, anchors, and form contracts when touched.

Document intentional contract changes and unavailable proof. A redesign remains incomplete when the new surface looks stronger but preservation of critical behavior or integration contracts has not been verified.
