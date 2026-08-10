---
name: frontend-design
description: Design, implement, refactor, or review user-facing interfaces. Use whenever work changes how a web or app surface looks, reads, responds, or is operated, including components, pages, forms, dashboards, responsive behavior, accessibility, visual polish, and design systems.
---

# Frontend Design

Create interfaces that are clear, distinctive, usable, adaptive, and coherent with the product. Fit the existing stack and conventions; treat visible UI coding as design work even when the requested change is small.

## Core Loop

### 1. Inspect and Preserve

Read the changed surface, adjacent components, tokens, styles, content, behavior, and project instructions before editing.

For existing UI, preserve routes, behavior, data contracts, accessibility, content voice, and brand unless the task explicitly changes them. Reuse established primitives and patterns. Distinguish a targeted evolution from an approved redesign.

### 2. Frame the Task

Identify:

- `User and context`: Who uses this, on what device, how often, and under what pressure?
- `Governing question`: What must the surface help them understand, decide, or do?
- `Primary path`: What should they notice first, and what is the next action?
- `Constraints`: Brand, stack, accessibility, performance, localization, content extremes, and scope.

Keep this brief implicit for small changes; write it down only when it prevents ambiguity.

### 3. Shape the Information

Choose the form that matches the task:

- Tables for aligned comparison.
- Lists for sequences and queues.
- Timelines for ordered events.
- Split views for browse-and-inspect.
- Cards only for genuinely bounded units.

Make hierarchy, status, evidence, uncertainty, action, and recovery scannable. Keep critical context visible; use progressive disclosure for secondary detail, never for trust or safety information. Design loading, empty, partial, stale, error, permission, disabled, and long-content states when relevant.

### 4. Choose One Direction

Commit to one product-specific visual concept and one memorable hook. Let typography, palette, composition, material, iconography, imagery, and motion reinforce it.

Avoid generic dashboard grammar, decoration without meaning, competing accent systems, mixed icon languages, and gratuitous motion. Preserve an established direction unless change is requested. Never let a screenshot or generated image silently invent behavior, content truth, or architecture.

### 5. Protect the UX Floor

In priority order:

1. Semantic structure, keyboard access, visible focus, labels, contrast, non-color meaning, and reduced motion.
2. Clear task order, comfortable targets, feedback, preserved state, and recovery.
3. Intrinsic layout that wraps and adapts to content and containers before adding breakpoints.
4. Stable async space, optimized media, minimal JavaScript, and transform/opacity motion.

Use viewport breakpoints for page-level environment changes and container-aware behavior for reusable components. Define the exact point where a layout must change mode instead of accumulating arbitrary breakpoints.

### 6. Implement as a System

Use semantic markup and the smallest sufficient project-native code. Prefer CSS for layout and visual effects; add JavaScript only for real behavior.

Turn repeated decisions into semantic tokens, finite variants, canonical names, and reusable component contracts. Keep one-off artwork local. Separate destructive actions spatially and semantically. Do not create abstractions that a second real use has not earned.

### 7. Prove the Result

Run project-native type, lint, test, and build checks. When rendering is available:

- Inspect narrow, intermediate, and wide contexts.
- Exercise the primary flow and relevant edge states.
- Check zoom, focus, overflow, reduced motion, and long/localized content.
- Run a five-second pass: can a user identify orientation, status, next action, evidence, uncertainty, and recovery?
- Remove unsupported factual-looking content, fake proof, placeholders presented as truth, and accidental visual noise.

Fix the strongest comprehension or craft gap, then rerender. Static inspection cannot prove rendered quality; state when visual validation was unavailable.

## Completion

Report the chosen direction, changed behavior or design contracts, checks run, visual evidence, and remaining validation limits. The work is done when the primary path is clear, relevant states remain usable, the layout survives real content pressure, and a maintainer can extend the result without inventing a second system.
