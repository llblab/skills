# Conditional Style Recipes

These recipes preserve concrete construction knowledge for selected visual languages. Apply them only after the style grammar, product context, and functional floor are known. Exact values are starting ranges or implementation examples; existing tokens, brand rules, content pressure, and rendered evidence remain authoritative.

Each recipe should answer:

```text
Use when → visual invariant → construction → states → responsive behavior → performance/accessibility override → failure mode
```

## Minimal and Editorial Restraint

### Use When

Use for document-like tools, professional workflows, editorial narratives, calm product surfaces, and brands whose identity benefits from reduction. Do not equate minimal with empty, monochrome, serif, or low-density by default.

### Concrete Construction

- `Substrate`: Start with one dominant canvas and one surface step. Warm paper, cool white, dark ink, or another neutral family may work; choose from brand and content rather than a universal beige recipe.
- `Structure`: Let alignment, type, whitespace, and sparse dividers establish grouping before adding elevation.
- `Borders`: A low-contrast 1px divider often works for document-like surfaces. Increase contrast or width when the border carries interaction, focus, or high-density structure.
- `Radius`: Tight values around 4-12px can support utilitarian restraint, while sharp or softer geometry may fit the chosen grammar. Keep nested radii related.
- `Elevation`: Prefer none or one diffused level. A useful light-surface starting point is `0 2px 8px rgb(0 0 0 / 4%)`; verify that the boundary remains visible without the shadow.
- `Spacing`: Use a small base rhythm for components and larger semantic jumps between decision regions. Do not apply the same oversized section padding to every surface.
- `Typography`: A characterful sans can own UI and body roles; an editorial display face may enter headings or quotations when brand and content justify it. Keep body measure near the project-readable range and test real line endings.
- `Color`: Reserve accent for action, focus, selection, or a deliberate editorial moment. Muted pastel surfaces require their own readable foreground tokens.

Example token relationship:

```css
:root {
  --canvas: var(--color-neutral-50);
  --surface: var(--color-neutral-0);
  --ink: var(--color-neutral-950);
  --muted: var(--color-neutral-600);
  --line: color-mix(in srgb, var(--ink) 9%, transparent);
  --radius-control: 0.375rem;
  --radius-surface: 0.75rem;
  --shadow-subtle: 0 0.125rem 0.5rem rgb(0 0 0 / 4%);
}
```

`color-mix()` needs a tested fallback when the browser support contract requires one.

### Motion

- Keep hover and press feedback compact, commonly around 150-250ms.
- A small `translateY`, opacity shift, underline, or tonal change usually fits better than ambient perpetual motion.
- Use entry animation only when it establishes reading sequence. A restrained starting pattern might use 8-16px translation plus opacity with reduced-motion fallback.

### Failure Modes

- Whitespace with no stronger hierarchy.
- Muted text or pastel controls below contrast requirements.
- Every section using the same border-and-heading recipe.
- Serif or warm-neutral styling used as a shortcut for “premium.”
- Minimal chrome that removes discoverability, current state, focus, or recovery.

## Brutalist and Industrial Expression

Choose one dominant dialect rather than combining every raw or technical signifier.

### Swiss Industrial Print Dialect

Use for editorial, cultural, portfolio, developer, or campaign surfaces that benefit from exposed grid, strong type, and print-like material.

- `Substrate`: Paper-like light surface or another deliberate physical field.
- `Type`: Heavy sans display with strong scale contrast; supporting text remains readable and need not inherit all-uppercase treatment.
- `Grid`: Visible tracks, full-width rules, sharp alignment, and asymmetry should reveal structure rather than decorate empty regions.
- `Accent`: One high-energy ink or signal color can carry action and emphasis; semantic warning/error colors remain distinct when the product needs them.
- `Geometry`: Sharp corners commonly reinforce the dialect, but controls may retain project geometry when touch, platform, or component consistency requires it.

A bounded fluid display scale can begin with:

```css
.display-industrial {
  font-size: clamp(3rem, 8vw, 10rem);
  line-height: 0.92;
  letter-spacing: -0.04em;
}
```

Test long words, accents, glyph clipping, zoom, and narrow widths. The example does not justify unreadable scale or compressed line height for arbitrary copy.

### Tactical Telemetry Dialect

Use for real monitoring, operations, technical narrative, games, or speculative interfaces where instrument language matches the product.

- `Substrate`: Layered darks rather than undifferentiated black.
- `Type`: Monospace or technical sans for real identifiers, timestamps, units, code, and aligned data. Keep prose in a more readable role when needed.
- `Density`: Cluster related telemetry tightly, then preserve larger quiet zones around status, exception, and primary action.
- `Color`: Reserve luminous or signal accents for live, selected, warning, or critical meaning. Never make all text glow.
- `Symbology`: Brackets, crosshairs, bars, coordinates, revision labels, and status markers require actual information or a declared fictional narrative role.

### Grid-Line Technique

A parent background plus a 1px grid gap can create continuous dividers without doubled borders:

```css
.telemetry-grid {
  display: grid;
  gap: 1px;
  background: var(--grid-line);
}

.telemetry-grid > * {
  min-inline-size: 0;
  background: var(--surface);
}
```

Use real borders when cells need independent focus, selection, error, or print behavior.

### Texture and Degradation

Halftone, dither, grain, and scanlines can reinforce print or display substrate. Keep them isolated and non-interactive:

```css
.scanline-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent 0 2px,
    rgb(0 0 0 / 8%) 2px 4px
  );
}
```

Bound opacity, test text contrast, and disable the effect when it harms performance, forced colors, screenshots, or reading. A fixed full-screen texture still carries compositing cost; do not assume it is free.

### Motion

Mechanical feedback may use fast, stepped, or abrupt transitions, but never remove acknowledgement of input or state change. Keep critical status motion non-blocking and provide reduced-motion and non-motion equivalents.

### Failure Modes

- Fake telemetry, meaningless warning stripes, arbitrary legal marks, or random machine strings.
- All-uppercase microtype that destroys scan speed.
- Rawness used to excuse poor semantics, broken responsiveness, or inaccessible controls.
- Scanlines, glow, or noise reducing legibility or frame rate.
- Print and terminal dialects mixed without a real product boundary.

## Soft and Tactile Depth

### Use When

Use for consumer, health, creative, premium product, or focused interaction surfaces where calm material depth supports confidence and touch. Avoid it for dense comparison or critical workflows when depth reduces contrast or scan speed.

### Light and Elevation

Choose one light direction and a small elevation system. A soft raised surface may combine a highlight, ambient shadow, and contact shadow:

```css
.surface-raised {
  border: 1px solid color-mix(in srgb, var(--surface-fg) 8%, transparent);
  background: var(--surface);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 18%),
    0 2px 6px rgb(0 0 0 / 6%),
    0 18px 42px -24px rgb(0 0 0 / 24%);
}
```

Tune shadow hue and opacity against the real canvas. Preserve a border, tonal step, or another non-shadow boundary for high contrast and forced colors.

### Concentric Nested Surfaces

Use a double-bezel or nested shell only when the component represents real containment, hardware, media framing, or a control island.

```css
.shell {
  --shell-gap: 0.375rem;
  --shell-radius: 1.5rem;
  padding: var(--shell-gap);
  border-radius: var(--shell-radius);
}

.shell > .core {
  border-radius: max(0px, calc(var(--shell-radius) - var(--shell-gap)));
}
```

The radius relationship preserves concentric curves. Do not apply nested shells to every card, field, and section.

### Interaction and Motion

- Press feedback can begin around `translateY(1px)` or `scale(0.98)` when it does not blur text or move adjacent layout.
- A responsive ease such as `cubic-bezier(0.32, 0.72, 0, 1)` can support sheets and large transitions. Use shorter standard curves for direct controls.
- Spring values such as stiffness `100` and damping `20` describe one medium-weight starting feel, not a universal token. Tune by travel distance, mass metaphor, interruption, and platform.
- Animate internal icon or highlight movement only when it reinforces action direction or state.
- Large blur, backdrop filtering, grain, and ambient layers require bounded area, fallback, and runtime inspection on representative hardware.

### Translucent Material

For glass-like surfaces:

- Establish a real background layer to refract.
- Pair transparency with a subtle border and tonal fallback.
- Verify text and controls when blur is unsupported or reduced.
- Keep material hierarchy finite; glass nested inside glass quickly loses boundaries.
- Do not use translucency where changing imagery makes contrast unpredictable.

### Failure Modes

- Shadow-only controls that disappear in high contrast or bright conditions.
- Every object receiving large radius, blur, nested shell, and spring motion.
- Conflicting light directions or shadow colors.
- Softness that obscures selected, disabled, error, or focus state.
- Expensive filters attached to large scrolling content.

## Cross-Recipe Conflict Check

Before applying any recipe:

1. Confirm that it supports the chosen dominant style grammar.
2. Map its values to existing semantic and component tokens.
3. Test default, focus, disabled, loading, error, and selected states.
4. Test narrow containers, zoom, long content, reduced motion, forced colors, and relevant themes.
5. Remove details that imitate another style family without serving information, action, or the memory hook.
6. Document deliberate deviations where project or platform contracts override the recipe.
