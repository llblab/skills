# Motion Implementation Recipes

Use motion only after purpose, interaction, layout ownership, and reduced-motion behavior are known. These recipes preserve concrete implementation details while remaining subordinate to the project stack and component architecture.

## Choose the Smallest Engine

- `CSS transitions/keyframes`: Hover, focus, press, simple enter/exit, and decorative motion with no complex orchestration.
- `Web Animations API or IntersectionObserver`: Framework-neutral reveal and bounded timeline control.
- `Project motion library`: State transitions, shared layout, gestures, and spring-driven UI when already available.
- `GSAP/ScrollTrigger or equivalent`: Pinned, scrubbed, or sequenced scroll storytelling that CSS cannot express reliably.
- `Canvas/WebGL`: Real-time scenes or 3D, isolated behind a stable semantic UI and loaded only when earned.

Do not add an engine for one small transition. When engines coexist, give each one exclusive ownership of its elements and lifecycle; never let two systems write the same transform or opacity.

## Continuous Input Boundary

Pointer position, scroll progress, drag coordinates, and other frame-rate values should not drive framework render state on every update.

- Store continuous values in motion values, refs, signals designed for frame updates, CSS custom properties, or an imperative animation timeline.
- Batch DOM reads before writes.
- Use `requestAnimationFrame` only as a bounded scheduler and cancel it during cleanup.
- Never attach an unthrottled scroll handler that reads layout and writes framework state each frame.
- Recompute geometry on relevant resize/content changes rather than on every scroll tick.

Semantic state such as `open`, `selected`, `loading`, or `expanded` still belongs to the component's normal state model. Separate meaning from interpolation.

## Reveal Recipe

Use reveal motion when sequence improves orientation or narrative. Keep content available without animation.

```css
.reveal {
  opacity: 0;
  transform: translateY(1rem);
  transition:
    opacity 500ms var(--ease-out),
    transform 500ms var(--ease-out);
}

.reveal[data-visible="true"] {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

Use `IntersectionObserver` to set visibility and disconnect it when the component is removed. Translation around 8-24px and stagger around 40-100ms provide practical starting ranges; tune from density and reading order. Do not delay access to content or replay reveals during ordinary back-and-forth scrolling unless the experience requires it.

## Press and Magnetic Feedback

### Press

A small scale or translation can communicate contact:

```css
.action:active {
  transform: translateY(1px) scale(0.99);
}
```

Preserve focus treatment and avoid moving adjacent layout. Disable or reduce the transform when it blurs small text or conflicts with native control feedback.

### Magnetic Pointer Effect

Use only for prominent low-frequency controls in pointer-rich expressive surfaces.

- Gate with `(hover: hover) and (pointer: fine)`.
- Measure the control on entry or resize, not every pointer event.
- Write pointer delta to a motion value or CSS custom property outside component render state.
- Bound travel to a small fraction of the control size.
- Spring or ease back to zero on leave, blur, cancellation, and route change.
- Disable under reduced motion and for touch/keyboard input.

Magnetic motion must not move the actual hit target away from the pointer or obscure stable focus geometry.

## Shared Layout and Reordering

Use a layout-transition facility when users need continuity across reorder, expansion, or route/state changes.

- Give stable identity only to elements that represent the same object across states.
- Keep source and destination in one lifecycle/ownership boundary.
- Preserve semantic DOM order and keyboard focus; visual interpolation must not reorder accessibility meaning.
- Avoid measuring every static child “for safety.” Opt in only moving elements.
- Handle interruption, rapid toggles, and removed items without leaving stale inline transforms.

## Sticky Stack Recipe

Start with CSS `position: sticky` when simple stacking is sufficient. Use a scroll timeline only when previous panels must transform as the next panel arrives.

Required geometry:

```text
wrapper owns total scroll range
panel trigger reaches viewport top
current panel remains pinned/sticky
next panel progress drives prior panel transform
last panel ends the sequence
```

For ScrollTrigger-style implementations:

- Start pinning when the section or panel reaches `top top`, not halfway through the viewport.
- Derive end conditions from the final panel or measured sequence length.
- Decide `pinSpacing` deliberately; disabling it changes document flow.
- Transform only opacity/scale/translation of prior panels.
- Recalculate on refresh when fonts, images, or container dimensions change.
- Scope selectors to the component and revert every trigger/timeline on cleanup.
- Provide a reduced-motion flow that renders panels as a normal readable sequence.

Do not pin long reading content, trap keyboard users, or hide the page scrollbar merely to create cinematic effect.

## Horizontal Scroll-Pan Recipe

Use vertical-to-horizontal mapping only for a sequence whose horizontal relationship matters, such as a gallery, timeline, or spatial comparison. Ordinary content should remain vertically scrollable.

Core measurement:

```js
const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
```

Timeline contract:

```text
trigger: wrapper
start: top top
end: += horizontal travel distance
pin: wrapper
animate: track x from 0 to -distance
refresh: recalculate after layout/media/font changes
```

Implementation checks:

- Keep the wrapper clipped, but do not apply blanket page overflow hiding to conceal unrelated layout bugs.
- Ensure every item remains reachable by keyboard and assistive technology in logical DOM order.
- Provide buttons, scrollbar, snap, or alternate navigation when users need direct control.
- On touch devices or reduced motion, prefer native horizontal overflow/snap or a vertical sequence.
- Cancel and rebuild the timeline when the travel distance or writing direction changes.
- Revert pinning and inline styles during cleanup.

## Sheet and Overlay Motion

- Enter from the edge or origin that explains spatial ownership.
- Keep the backdrop and panel on coordinated but separately tunable timelines.
- Exit usually completes faster than entry.
- Restore focus only after close state is committed; do not let animation delay semantic closure indefinitely.
- Support Escape, interruption, route change, and immediate reduced-motion completion.
- Animate the panel with transform and opacity; avoid height/width interpolation when intrinsic content can change.

A responsive easing such as `cubic-bezier(0.32, 0.72, 0, 1)` can suit large sheets. Short direct controls need faster feedback.

## Perpetual and Ambient Motion

Infinite motion requires a live meaning or a deliberate low-salience atmosphere.

Valid examples:

- Real connection/activity status with a non-motion indicator.
- Loading/progress state that stops when work stops.
- Media playback visualization tied to actual playback.
- One bounded ambient brand element outside reading and control regions.

Avoid decorative loops in every card, icon, or status marker. Pause offscreen work where practical, stop on hidden documents, honor reduced motion, and confirm CPU/GPU cost on representative hardware.

## Blur, Grain, and Transparency

- Bound large blur areas and avoid attaching expensive filters to long scrolling containers.
- Keep grain/noise overlays non-interactive and inspect compositing cost; fixed does not mean free.
- Provide an opaque tonal fallback when backdrop blur is unavailable.
- Respect reduced transparency where supported and ensure the fallback works without relying on that media query.

```css
.glass-surface {
  background: rgb(20 24 32 / 78%);
  border: 1px solid rgb(255 255 255 / 12%);
  backdrop-filter: blur(1rem) saturate(140%);
}

@media (prefers-reduced-transparency: reduce) {
  .glass-surface {
    background: rgb(20 24 32 / 98%);
    backdrop-filter: none;
  }
}
```

Browser support for reduced transparency remains uneven; the base style must retain contrast without it.

## Lifecycle Checklist

Every imperative animation must define:

- Owning component and scoped element references.
- Setup point after required DOM/layout exists.
- Font/media readiness assumptions.
- Resize, content, and theme refresh behavior.
- Interruption and rapid re-entry behavior.
- Reduced-motion and no-JS result.
- Cleanup for observers, listeners, frames, timers, timelines, triggers, inline styles, and global registrations when applicable.

In component frameworks, return cleanup from the owning lifecycle and avoid reading reactive state during teardown when that can retrigger or invalidate disposal.

## Performance Proof

- Animate transform and opacity for frequent visual motion.
- Use `will-change` only shortly before or during animation and remove it afterward when practical.
- Reserve media and async dimensions to prevent layout shift.
- Inspect main-thread work, dropped frames, paint, layers, and memory on representative low/medium hardware.
- Test multiple active animations together, not only each effect in isolation.
- Confirm interaction remains responsive while scroll or animation runs.

A smooth desktop recording does not prove mobile performance, input latency, cleanup, or accessibility.
