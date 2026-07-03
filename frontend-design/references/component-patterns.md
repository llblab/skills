# Component Patterns

Reusable component decisions should be explicit: anatomy, variants, sizes, states, accessibility, content behavior, and responsive behavior.

## Button

### Anatomy

`[leading icon] label [trailing icon/loading]`

### Variants

| Variant | Use |
|---|---|
| Primary | Main action on the surface |
| Secondary | Safe alternate action |
| Outline | Tertiary action where hierarchy should remain light |
| Ghost | Low-emphasis toolbar/menu action |
| Link | Navigation or inline action |
| Destructive | Dangerous or irreversible action |

### States

- Default, hover, active, focus, disabled, loading.
- Loading prevents duplicate submit and keeps label width stable when possible.
- Icon-only buttons require accessible names.
- Minimum practical target: 44×44px for touch-heavy contexts.

## Input and Textarea

### Anatomy

`Label → control → helper/error text`

### Rules

- Visible label; placeholder is an example.
- Error state includes message and recovery.
- Focus ring is obvious.
- Disabled and read-only are visually distinct.
- Use semantic input type and autocomplete.
- Textarea can grow or show count/limit when content length matters.

## Select, Combobox, Checkbox, Radio, Switch

- Native semantics or equivalent keyboard behavior.
- Label remains clickable where appropriate.
- Current value is visible.
- Error text is associated with the control group.
- Switch is for immediate binary settings; checkbox is for selection/confirmation.
- Radio is for mutually exclusive choices where options should be visible.

## Card

### Use

Group related content or create a clickable summary.

### Anatomy

`Header → title/metadata → content → footer/actions`

### Rules

- Entire card clickable only when it has one destination/action.
- Interactive cards need focus and hover states.
- Avoid nested competing click targets.
- Use consistent padding and title hierarchy.
- Empty card states should explain missing content.

## Dialog / Modal / Drawer

- Has title and optional description.
- Focus enters on open and returns on close.
- Escape/close affordance exists unless flow is intentionally blocking.
- Destructive confirmation separates cancel and destructive action.
- Long content scrolls inside a predictable region.
- Mobile may prefer drawer/sheet when the action is contextual.

## Table

### Core

- Header labels are clear and sticky when useful.
- Numeric columns align by decimal/right edge.
- Rows have hover/focus/selected states.
- Empty, loading, filtered-empty, and error states are distinct.
- Sorting and filtering controls reveal active state.

### Dense Table

- Use compact row height only with readable typography.
- Keep primary row action discoverable.
- Bulk selection needs count and undo/recovery for risky actions.
- Horizontal overflow should be intentional and managed.

## Navigation

- Current location is visible.
- Top-level items are few and stable.
- Mobile navigation preserves primary actions.
- Breadcrumbs help deep hierarchies.
- Tabs switch peer views; they should not act like arbitrary links unless the project pattern does.
- Back path preserves filters, scroll, and open context when useful.

## Badge / Status Pill

- Use for state, category, count, or small metadata.
- Status colors need text/icon support.
- Avoid overusing badges until everything looks equally important.
- Define severity/status vocabulary: neutral, info, success, warning, danger, pending.

## Alert / Toast

| Pattern | Use |
|---|---|
| Inline alert | Persistent issue tied to a surface |
| Toast | Temporary confirmation or non-blocking info |
| Banner | System-wide or page-wide status |
| Modal alert | Blocking, rare, high consequence |

Rules:

- Alerts explain impact and next action.
- Toasts do not steal focus.
- Critical errors should not auto-disappear.
- Success toasts should include undo when action is reversible.

## Empty State

- State what is missing.
- Say why it matters.
- Offer the next best action.
- Show an example only when it helps comprehension.
- Avoid cute illustrations that replace useful guidance.

## Skeleton / Loading

- Match the final layout shape to prevent shift.
- Use progress when duration or steps are known.
- Avoid indefinite spinners for long waits without explanation.
- Keep existing data visible during background refresh when possible.

## Search and Filters

- Search input remains visible for search-first products.
- Active filters are visible and removable.
- Filtered-empty state differs from true-empty state.
- Provide clear reset.
- For large datasets, debounce input and show loading/freshness.

## Pricing Card

- Plans are comparable by same rows/order.
- Recommended plan is highlighted once.
- Price, period, limits, and CTA are close.
- Feature availability must be scannable.
- Hidden fees or vague limits damage trust.

## Metric Card

- Label, value, unit, trend, timeframe.
- Trend color needs arrow/text support.
- Include freshness if realtime or delayed.
- Use tabular numerals.
- Avoid animating numbers when precision matters during reading.
