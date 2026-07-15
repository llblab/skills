# Intrinsic and Responsive Layout

Intrinsic design treats layout as a law of emergence rather than a set of viewport snapshots. Content, container, and constraints should determine composition while art direction supplies deliberate hierarchy and character.

## Core Model

```text
content + container + constraints → layout
```

Do not begin with device categories and retrofit content into them. Begin with the task order and each region's spatial contract:

- `Minimum`: Smallest size that preserves meaning and operation.
- `Preferred`: Size range where hierarchy and composition work naturally.
- `Maximum`: Point after which expansion weakens reading, grouping, or art direction.
- `Fluid`: Values or regions that may continuously grow or shrink.
- `Fixed`: Controls, measures, or relationships that should remain stable.
- `Wrap`: Content that may create another line, row, or track.
- `Overflow`: Explicit behavior for content that cannot fit.
- `Phase change`: Structural transition required when continuous adaptation no longer preserves meaning.

## Layout Ownership

- Page composition owns global task order, major regions, and broad navigation changes.
- Components own adaptation to their local container when reuse can place them in different contexts.
- Content owns pressure: localization, user data, labels, media ratios, and dynamic state determine where a composition fails.
- Breakpoints mark observed semantic failure points, not assumed device classes.
- Project breakpoints remain valid when they approximate a real phase change; do not invent arbitrary values when established tokens already express it safely.

Prefer container queries for reusable components and viewport queries for page- or environment-level behavior. Avoid making an internal component infer its available space from the viewport.

## Intrinsic CSS Primitives

- `min-content`, `max-content`, and `fit-content()` for content-informed sizing.
- `min()`, `max()`, and `clamp()` for bounded fluid values.
- `minmax()` with Grid for explicit track contracts.
- `repeat(auto-fit, ...)` when available space should determine track count.
- Flex wrapping when items should preserve useful minimums and continue on another line.
- Container queries when component context matters more than viewport width.
- `max-width` or logical `max-inline-size` for readable prose and intentionally bounded regions.
- `min-width: 0` or `min-inline-size: 0` on flex/grid children that need to wrap or truncate.
- `aspect-ratio`, `object-fit`, and explicit crop intent for media.
- `dvh`, `svh`, and `lvh` for mobile viewport-height behavior where supported.

Use fluid primitives to encode a real range, not to make every value continuously variable.

## Semantic Phase Changes

Keep adaptation continuous until the task or hierarchy requires a structural transition. Add a breakpoint or container query when evidence shows one of these failures:

- Primary action loses prominence or reachability.
- Navigation no longer fits or remains operable.
- Comparison ceases to scan as a coherent row or grid.
- Reading measure becomes too narrow or too wide.
- Controls wrap into ambiguous groups.
- Media overwhelms or detaches from its message.
- Density prevents reliable targeting or interpretation.

Choose the smallest transition that repairs the failure. Do not redesign the whole surface merely because one region needs a new arrangement.

## Pattern Contracts

### App Shell

- Preserve current location, primary navigation, active context, and recovery paths.
- Let navigation move from persistent to collapsible only when its useful minimum no longer fits.
- Keep content regions intrinsically shrinkable; avoid fixed shell dimensions that force accidental page overflow.

### Card Collection

- Define the card's useful minimum from its content and actions.
- Let available container space determine track count with `minmax()` and `auto-fit` when equal tracks fit the hierarchy.
- Use deliberate spans or fixed composition when art direction requires asymmetry; intrinsic design does not mandate generic card grids.
- Equalize heights only when comparison benefits.

### Hero

- Protect message order and CTA visibility before preserving decorative composition.
- Bound readable text measure and define intentional media cropping.
- Recompose when text and media can no longer coexist without weakening the primary claim.

### Table

Choose from the data relationship, not a mobile convention:

- Horizontal scroll for true tabular comparison.
- Priority columns plus detail disclosure when some fields remain secondary.
- Card or record layout for operational lists that do not require cross-row comparison.
- Sticky identifiers for wide comparisons where row identity must survive scrolling.

### Form

- Let labels, help, validation, and localization determine field minimums.
- Group short related fields only while their labels and errors fit without ambiguity.
- Return to a single flow when parallel fields lose clear reading order.

## Content Pressure

Test the layout with:

- Long and short localized labels.
- Long words, URLs, user names, and unbroken identifiers.
- Empty, loading, error, stale, and maximum-data states.
- Missing, portrait, landscape, and unexpectedly cropped media.
- Large text and browser zoom.
- Keyboard, touch, pointer, and reduced-motion input conditions.

Prefer wrapping for prose and labels. Use truncation only when the complete value remains available. Avoid fixed content heights unless clipping or scrolling forms part of the explicit interaction contract.

## Art Direction Boundary

Intrinsic design does not mean generic fluidity. Preserve authored composition through bounded measures, intentional asymmetry, stable anchors, controlled density, and explicit phase changes. Constraints carry the art direction across unknown content and containers; they do not replace it.

## Visual Proof

1. Render the narrowest supported viewport and representative desktop/wide contexts.
2. Sweep intermediate widths rather than checking only named devices.
3. Render reusable components in narrow and wide containers independent of the page viewport.
4. Exercise long/localized content, zoom, overflow, and relevant states.
5. Identify the exact width or content pressure where hierarchy or operation fails.
6. Add or adjust a constraint or semantic phase change, then repeat the sweep.

Record unavailable browser or container-level proof explicitly. Static inspection cannot prove intrinsic behavior.
