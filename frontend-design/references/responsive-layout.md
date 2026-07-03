# Responsive Layout

Responsive design is not breakpoint decoration; it is preserving task clarity across device, density, input method, and content length.

## Mobile-First Model

- Base layout should work on narrow screens.
- Add columns, density, sidebars, and persistent navigation at larger widths.
- Primary actions remain reachable and visible.
- Content order follows user priority, not desktop visual symmetry.

## Breakpoint Thinking

Use project breakpoints, but reason through these zones:

| Zone | Typical Width | Design Question |
|---|---:|---|
| Compact | 320-480 | What is essential? |
| Phone | 480-767 | Can controls be operated comfortably? |
| Tablet | 768-1023 | Should layout split or remain single-flow? |
| Laptop | 1024-1279 | Does navigation/sidebar appear? |
| Desktop | 1280+ | How is empty space controlled? |
| Wide | 1536+ | Are max widths and density intentional? |

## Fluid Techniques

- `clamp()` for type, spacing, and widths.
- `minmax()` for grids.
- `auto-fit` / `auto-fill` for card grids.
- Container queries when component context matters more than viewport.
- `max-width` for readable prose.
- `min-width: 0` on flex/grid children that need to truncate/wrap.
- `aspect-ratio` for media and cards.
- `dvh/svh/lvh` for mobile viewport height issues.

## Common Patterns

### Sidebar App

- Mobile: top bar + drawer or stacked nav.
- Tablet: collapsible sidebar or top tabs.
- Desktop: persistent sidebar.
- Preserve current location and active filters.

### Card Grid

- Mobile: 1 column.
- Tablet: 2 columns.
- Desktop: 3-4 columns depending content.
- Cards equal height only when comparison benefits.

### Hero

- Mobile: message first, visual below or background cropped safely.
- Desktop: split, layered, or full-bleed composition.
- CTA remains visible after headline/subhead.

### Table

Options by content:

- Horizontal scroll for true tabular comparison.
- Card rows for mobile operational lists.
- Column hiding only for low-priority columns.
- Detail drawer for row expansion.
- Sticky first column for wide comparison.

### Forms

- Mobile: single column.
- Desktop: group related short fields in rows if scanning improves.
- Keep labels close to inputs.
- Avoid side-by-side fields that wrap unpredictably.

## Mobile Interaction

- Touch targets: 44×44px practical minimum.
- Space adjacent controls.
- Avoid hover-only disclosure.
- Keep destructive controls away from primary thumb path when possible.
- Fixed bottom actions need safe-area padding and content bottom padding.

## Overflow Rules

- Prefer wrapping for prose and labels.
- Use truncation for dense tables only with access to full value.
- Avoid fixed heights for dynamic content.
- Test long words, URLs, translated labels, and user-generated names.
- Design empty and max-content states, not only ideal state.

## Responsive QA

- 320px width smoke test.
- 375/390px phone test.
- 768px tablet test.
- 1024px laptop test.
- 1440px desktop test.
- Long content and localization test.
- Touch-only path test.
- Keyboard path test.
