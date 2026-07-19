---
name: bits-ui
description: Build, refactor, review, or debug Svelte 5 components that use Bits UI primitives. Use when working with bits-ui dialogs, popovers, dropdowns, comboboxes, selects, tabs, date/time controls, menus, tooltips, portals, render delegation, or Bits UI type helpers.
metadata:
  version: 1.1.0
---

# Bits UI Skill

Use this skill whenever the task involves `bits-ui`, Svelte 5 headless UI primitives, or components that wrap Bits UI.

Bits UI is a headless Svelte 5 component library. It owns accessibility, keyboard behavior, focus management, ARIA contracts, compound-component state, and portal/floating mechanics. The app owns visual style, copy, data loading, persistence, and domain policy.

## Required Documentation Lookup

Before implementing or reviewing a Bits UI component, read the local docs that match the surface. Resolve paths relative to this skill directory.

Always start with these when the task is non-trivial:

- `intro/getting-started.md` — installation, import shape, basic compound components.
- `intro/state-management.md` — `bind:` and function bindings.
- `intro/styling.md` — class/style props, data attributes, CSS variables, mount-state attributes.
- `intro/child-snippet.md` — render delegation, custom elements, floating content wrapper rules.
- `intro/ref.md` — `bind:ref` and delegated refs.

Read additional docs as needed:

- `intro/transitions.md` for Svelte transitions, `forceMount`, and animated content.
- `intro/dates.md` for calendar/date/time controls and `@internationalized/date` values.
- `utilities/merge-props.md` when composing wrappers or chaining event handlers.
- `utilities/portal.md` for portal targets/stacking behavior.
- `utilities/bits-config.md` for global Bits configuration.
- `type-helpers/*.md` when typing wrapper props.
- `components/<component>.md` for every primitive being used.

Component docs live in `components/`, for example:

- Overlay/floating: `dialog.md`, `alert-dialog.md`, `popover.md`, `tooltip.md`, `dropdown-menu.md`, `context-menu.md`, `link-preview.md`.
- Selection: `select.md`, `combobox.md`, `radio-group.md`, `checkbox.md`, `switch.md`, `toggle.md`, `toggle-group.md`.
- Layout/navigation: `tabs.md`, `accordion.md`, `collapsible.md`, `navigation-menu.md`, `menubar.md`, `toolbar.md`, `separator.md`, `scroll-area.md`, `pagination.md`.
- Date/time: `calendar.md`, `date-field.md`, `date-picker.md`, `date-range-field.md`, `date-range-picker.md`, `range-calendar.md`, `time-field.md`, `time-range-field.md`.
- Feedback/inputs: `progress.md`, `meter.md`, `slider.md`, `rating-group.md`, `pin-input.md`, `avatar.md`, `aspect-ratio.md`, `label.md`, `button.md`, `command.md`.

## Implementation Contract

1. **Use compound structure exactly.** Import from `bits-ui` and compose the documented `Root`, `Trigger`, `Portal`, `Content`, `Item`, `Group`, etc. parts. Do not skip required structure for accessibility.
2. **Keep Bits headless.** Pass Tailwind/classes, style props, or data-attribute styles from the app/component layer. Do not expect Bits UI to provide app styling.
3. **Prefer wrappers for repeated patterns.** If the same Dialog/Popover/Select/Menu shape appears repeatedly, create a local wrapper that hides mechanical Bits wiring but still exposes useful props/snippets.
4. **Preserve app architecture.** Place wrappers in the appropriate UI/domain/feature layer. Generic Bits wrappers belong in shared UI; entity-specific composition belongs in the owning domain/feature.
5. **Expose controlled state when useful.** Use `bind:open`, `bind:value`, `bind:checked`, etc. for simple state. Use Svelte function bindings for validation, business rules, transformations, or external stores.
6. **Use exported types.** Type wrapper props with `Dialog.RootProps`, `Combobox.ContentProps`, etc. Use Bits type helpers (`WithoutChild`, `WithoutChildren`, `WithoutChildrenOrChild`, `WithElementRef`) when removing/overriding snippets or exposing refs.
7. **Do not break refs.** If using `bind:ref`, pass custom `id` to the Bits component, not directly to the delegated child element.
8. **Do not fight internal handlers.** Use `mergeProps` when composing user props with internal props/handlers/classes/styles. Remember that event handlers chain and `event.preventDefault()` stops later event handlers.

## Child Snippet Rules

Use `child` snippets when you need scoped styles, Svelte transitions/actions, app components, or exact DOM control.

Standard delegated element:

```svelte
<Component.Part>
  {#snippet child({ props })}
    <button {...props} class="...">...</button>
  {/snippet}
</Component.Part>
```

Floating content requires a two-level structure:

```svelte
<Popover.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} class="...">...</div>
      </div>
    {/if}
  {/snippet}
</Popover.Content>
```

Rules:

- Always spread `{...props}` onto the actual interactive/content element.
- For floating content, always spread `{...wrapperProps}` onto an unstyled outer wrapper.
- Put styling, classes, transitions, and actions on the inner element, not the floating wrapper.
- Do not render extra children outside a `child` snippet and expect them to matter; delegated children are ignored.

Floating components that need the wrapper pattern include `Combobox.Content`, `DatePicker.Content`, `DateRangePicker.Content`, `DropdownMenu.Content`, `LinkPreview.Content`, `Menubar.Content`, `Popover.Content`, `Select.Content`, and `Tooltip.Content`.

## Transitions

Bits UI Svelte 5 does not use old `transition*` props. For Svelte transitions:

- Set `forceMount` on the conditionally mounted part.
- Use `child` snippet.
- Render only when `open` is true.
- For floating content, keep the required wrapper/inner split.

For CSS-only mount animations, prefer documented state attributes such as `data-starting-style` and `data-ending-style` when available.

## Styling Guidance

- Use direct `class` props for simple Tailwind styling.
- Use `data-*` selectors for consistent global styling of repeated parts.
- Use documented CSS variables for sizing/positioning, e.g. content width matching an anchor.
- Use state data attributes like `data-state="open"`, `data-state="closed"`, and `data-disabled` for state styling.
- Keep design-system tokens/classes in app wrappers, not in ad-hoc usage sites.

## Date and Time Controls

When using Calendar, DatePicker, DateField, TimeField, or range variants:

- Use `@internationalized/date` types (`CalendarDate`, `CalendarDateTime`, `ZonedDateTime`, `DateValue`) as documented.
- Install/check `@internationalized/date` if the project does not already include it.
- Treat DateValue objects as immutable; update with `.set()`, `.add()`, `.subtract()`, or `.cycle()`.
- Use `placeholder` to control initial visible date/type when no value is selected.
- Convert to native `Date` only at app boundaries where needed.

## Review Checklist

Before finishing Bits UI work, verify:

- The relevant local docs were consulted.
- Compound component structure matches the component docs.
- Keyboard/focus/ARIA behavior is not bypassed by custom DOM.
- Floating content uses Portal/Content and wrapper props correctly.
- Controlled/bindable state behaves from both internal and external updates.
- Custom event handlers are merged rather than replacing required Bits handlers.
- Styling uses classes/data attributes/CSS vars without hard-coding behavior into Bits internals.
- Wrapper props and snippets are typed with Bits exports or type helpers.
- Validation appropriate to the project was run (`npm run check`, `svelte-check`, unit tests, or the project's documented command).

## Common Pitfalls

- Styling the floating `wrapperProps` element instead of the inner content element.
- Forgetting `{...props}` in a `child` snippet.
- Setting custom `id` only on a delegated child, breaking `bind:ref` tracking.
- Using old transition props instead of `forceMount` plus snippets.
- Reimplementing keyboard navigation, focus trapping, or ARIA roles already owned by Bits UI.
- Letting domain-specific persistence or app state leak into a generic UI wrapper.
