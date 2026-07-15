# UX Production Checklist

This is the production floor for frontend design. Art direction can be bold; the interface still has to work under pressure.

## Accessibility

- Use semantic elements before ARIA.
- Keep heading order logical; one main h1 per page/screen where possible.
- Every input has a visible label or persistent equivalent.
- Icon-only controls have accessible names.
- Meaningful images have useful alt text; decorative images are hidden from assistive tech.
- Focus states are visible and not removed.
- Keyboard order follows visual/task order.
- Modals trap focus, expose title/description, and restore focus on close.
- Normal text contrast targets 4.5:1; large text and UI boundaries target 3:1 where practical.
- Do not communicate state by color alone.
- Respect `prefers-reduced-motion`.
- Provide skip links or landmarks for long pages/app shells.

## Touch and Interaction

- Primary touch targets should be at least 44×44px where practical.
- Keep at least 8px spacing between adjacent touch targets.
- Do not rely on hover for critical actions.
- Provide pressed, hover, focus, disabled, loading, selected, and error states.
- Give feedback within ~100ms for direct manipulation.
- Keep destructive actions visually separated and confirmed or undoable.
- Disabled controls should explain unavailable actions when the reason is not obvious.
- Gesture actions need visible alternatives.

## Intrinsic and Responsive Layout

- Start from content, container, and task-order constraints rather than a desktop or device snapshot.
- Define useful minimum, preferred, and maximum sizes for important regions and components.
- Decide explicitly what flows, stays fixed, wraps, overflows, or triggers a semantic phase change.
- Use `min-content`, `max-content`, `fit-content()`, `minmax()`, `clamp()`, wrapping, and bounded measures where they encode the contract.
- Let reusable components respond to their containers; reserve viewport queries for page- and environment-level behavior.
- Add breakpoints where hierarchy or operation actually fails, not because a device taxonomy prescribes them.
- Prevent unintended horizontal scroll without hiding evidence of a broken layout through blanket clipping.
- Avoid fixed pixel heights for content that can localize, wrap, or grow.
- Preserve primary actions, readable measure, safe areas, and touch operation under narrow conditions.
- Test intermediate widths, narrow and wide component containers, zoom, long words, translated strings, empty data, and overflow lists.

## Performance

- Prefer CSS for effects and state transitions.
- Animate transform and opacity for frequent animation.
- Reserve dimensions for images, videos, charts, and async cards.
- Lazy-load below-fold media; keep hero media optimized.
- Avoid large animation libraries for small interactions.
- Use virtualization or pagination for long lists/tables.
- Batch layout reads/writes; avoid scroll handlers that force reflow.
- Provide skeletons or stable placeholders for waits over ~300ms.
- Avoid blocking the main thread during interaction.

## Forms

- Use visible labels; placeholders are examples.
- Keep helper text close to the field.
- Validate after user intent: blur, submit, or meaningful pause.
- Show errors near the relevant field and explain how to fix them.
- Focus the first invalid field after submit.
- Preserve user input on errors, navigation, and retry when feasible.
- Use semantic input types and autocomplete.
- Mark required fields clearly.
- Group related fields with fieldsets or visual sections.
- For long forms, show progress and allow back navigation.

## Feedback States

| State | Required Design |
|---|---|
| Loading | Stable space, spinner/skeleton/progress, disabled duplicate submission |
| Empty | Plain explanation, next action, example if useful |
| Error | Cause, recovery action, retry/contact path, preserved context |
| Success | Confirmation, next step, undo where relevant |
| Disabled | Visual affordance plus reason when non-obvious |
| Offline/slow | Degraded mode, retry, saved draft when useful |
| Permission denied | Explain missing permission and request path |

## Navigation

- Current location is visible.
- Back behavior is predictable and preserves state.
- Key screens are deep-linkable where the app model supports it.
- Search/filter state survives navigation when useful.
- Mobile navigation keeps top-level choices limited and obvious.
- Breadcrumbs help when hierarchy is deeper than two levels.
- Escape/close routes exist for modals, drawers, and multi-step flows.
- Avoid nested scroll traps.

## Content and Copy

- Primary action labels use verbs.
- Error text says what happened and how to recover.
- Empty states avoid blame and give next steps.
- Tooltips supplement; they do not hide essential information.
- Labels beat icons for unfamiliar actions.
- Use consistent terminology across controls, headers, and docs.

## QA Pass

- Keyboard-only pass.
- Mobile narrow-width pass.
- Long-content pass.
- Empty/error/loading pass.
- Reduced-motion pass.
- Contrast pass.
- Screen reader smoke pass for important flows.
- Performance smoke pass for animation and scroll.
