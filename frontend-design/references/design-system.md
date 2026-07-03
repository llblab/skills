# Design System Discipline

A frontend design should produce reusable decisions, not isolated decoration. Use system thinking at the smallest scale that helps the project.

## Token Layers

```text
Primitive tokens  → raw values
Semantic tokens   → purpose aliases
Component tokens  → component-specific contracts
```

### Primitive

Raw values without product meaning.

```css
--color-slate-950: #020617;
--color-amber-500: #f59e0b;
--space-4: 1rem;
--radius-md: 0.5rem;
--duration-fast: 150ms;
```

### Semantic

Purpose names that can theme.

```css
--color-background: var(--color-slate-950);
--color-foreground: #f8fafc;
--color-primary: var(--color-amber-500);
--color-border: rgba(248, 250, 252, 0.14);
--color-focus: var(--color-amber-500);
```

### Component

Local contracts for repeated components.

```css
--button-bg: var(--color-primary);
--button-fg: var(--color-background);
--button-radius: var(--radius-md);
--button-duration: var(--duration-fast);
```

## Tokenization Rules

Tokenize when a value:

- Repeats across surfaces.
- Expresses meaning or state.
- Needs theme switching.
- Defines a component contract.
- Is likely to be tuned by design review.

Do not tokenize every one-off artistic detail. Keep local artwork local.

## Naming

Prefer semantic names over brand/product prefixes inside local implementation.

```text
--{category}-{role}-{variant}-{state}
--color-primary-hover
--space-section-lg
--button-bg-disabled
--input-border-error
```

Use product names only at external package/API boundaries or when the project already does.

## Theme Model

Dark/light mode should override semantic tokens, not component internals.

```css
:root {
  --color-background: #ffffff;
  --color-foreground: #101014;
}
.dark {
  --color-background: #101014;
  --color-foreground: #f7f3ea;
}
```

Component tokens then inherit theme changes.

## Component Contract

Every reusable component needs:

- Anatomy: slots/regions.
- Variants: primary, secondary, destructive, outline, ghost, etc. where relevant.
- Sizes: compact, default, large, icon-only if needed.
- States: default, hover, active/pressed, focus, disabled, loading, selected, error.
- Accessibility contract: role, label, keyboard behavior, focus behavior.
- Content behavior: long text, missing icon, wrapping, truncation.
- Responsive behavior: stack, collapse, density, overflow.

## State Matrix Template

| State | Visual Change | Interaction | Accessibility |
|---|---|---|---|
| Default | Base token values | Operable | Name/role exposed |
| Hover | Minor emphasis | Pointer only | Not required for access |
| Active | Pressed feedback | Immediate | State exposed if persistent |
| Focus | Strong ring/outline | Keyboard visible | Meets contrast |
| Disabled | Reduced affordance | Not operable | `disabled`/`aria-disabled` correctly used |
| Loading | Progress indicator | Prevent duplicate action | Status announced when important |
| Error | Danger treatment + message | Recovery action | Error associated to field/control |

## Spacing and Density

- Use a base rhythm: 4px or 8px depending on project.
- Dense tools can use 4/8/12px; marketing surfaces often need 24/48/96px rhythm.
- Preserve more space around decisions than around details.
- Use consistent internal component padding.
- Align labels, controls, and numeric columns precisely.

## Elevation and Layers

Define a small z/elevation scale:

| Layer | Use |
|---|---|
| 0 | Page background |
| 1 | Cards, panels |
| 2 | Sticky bars, raised controls |
| 3 | Dropdowns, popovers |
| 4 | Modals, drawers |
| 5 | Toasts, critical alerts |

Avoid arbitrary z-index wars. Layer names beat magic numbers.

## Motion Tokens

- `--duration-instant`: 0-80ms for direct feedback.
- `--duration-fast`: 120-180ms for hover/press.
- `--duration-normal`: 200-300ms for expand/collapse.
- `--duration-slow`: 400-600ms for major scene transitions.
- Use one or two easing curves per product unless motion is a key brand language.

## Design Review for Systems

- Are repeated decisions tokenized?
- Are variants finite and meaningful?
- Do state treatments match across components?
- Can dark/light theme swap through semantics?
- Are component contracts documented by code structure or naming?
- Is the system smaller than the product, not a second product inside it?
