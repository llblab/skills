# Surface Patterns

Use these patterns to route frontend design decisions by surface type.

## Landing Pages

### Hero-Centric

Use when the offer is simple and first impression matters.

- Full-width hero with one strong promise.
- Subhead clarifies audience and outcome.
- One primary CTA above the fold.
- Product visual, proof point, or atmospheric brand asset supports the claim.
- Avoid secondary navigation noise near conversion.

### Conversion-Optimized

Use for signups, waitlists, lead capture, pricing, checkout starts.

- Single primary CTA repeated at natural decision points.
- Minimal form fields.
- Trust signals close to risk points.
- Social proof before final CTA.
- Loading, success, and error states are designed.

### Feature-Rich Showcase

Use when users need to understand a multi-capability product.

- Problem/solution framing.
- Feature grid with consistent icon language.
- Alternating sections for rhythm.
- Comparison table when alternatives matter.
- Interactive demo or screenshot where useful.

### Storytelling-Driven

Use for mission, premium products, creative work, fundraising, launches.

- Chapter-like structure.
- Visual progression and emotional arc.
- Pull quotes, metrics, timeline, before/after.
- Pattern breaks at key turning points.
- Final CTA resolves the story.

## Dashboards and Admin

### Operational Dashboard

- Status first: health, alerts, tasks, exceptions.
- Primary action is close to the status it affects.
- Live indicators show freshness and connection state.
- Alerts are ranked by severity and actionability.
- Empty and offline states are operational, not decorative.

### Analytics Dashboard

- KPI row gives summary.
- Filters are persistent and visible.
- Charts answer specific questions.
- Drill-down preserves context and back path.
- Export/share affordance exists when data leaves the screen.

### Data-Dense Admin

- Compact rhythm, strong alignment, low ornament.
- Tables support sorting, filtering, pagination/virtualization.
- Bulk actions are clear and reversible.
- Row states: selected, hovered, disabled, error, pending.
- Details open inline, drawer, or route depending on complexity.

## Forms and Flows

### Short Form

- One column by default.
- 3-5 fields if possible.
- Submit label names the action.
- Inline validation after intent.
- Success state tells what happens next.

### Long Form

- Sections follow user mental model.
- Progress and save state are visible.
- Back/forward preserves input.
- Complex fields have helper text.
- Review step before irreversible submit.

### Destructive Flow

- Make consequence explicit.
- Separate destructive action spatially and visually.
- Use confirmation, typed confirmation, or undo depending on severity.
- Preserve audit/context after action.

## Marketing Assets in Frontend Code

### Banner / Hero Asset

- Safe central content zone.
- One message, one CTA.
- Strong crop behavior at target sizes.
- High contrast text treatment over imagery.
- File/export dimensions documented when generating assets.

### Social/Ad Creative

- Platform size changes composition, not just scaling.
- Headline remains readable at thumbnail size.
- Text burden stays low.
- Brand mark position is consistent.
- CTA is visible but not cluttered.

## Slides and Presentation UI

- One idea per slide/viewport.
- Large readable type; avoid paragraph slides.
- Use layout archetypes: title, problem, solution, feature grid, metric hero, comparison, timeline, testimonial, pricing, CTA.
- Alternate density and emotion to avoid monotony.
- Charts need labels, not just pretty shapes.
- Navigation/progress should be visible when presentation is interactive.

## Product Category Routing

| Category | Pattern Bias | Visual Bias | Must Have |
|---|---|---|---|
| B2B SaaS | Hero + proof + feature showcase | Trust, clarity, restrained polish | Case studies, ROI, integration clarity |
| Finance/Crypto | Dashboard + trust surfaces | High contrast, status clarity, security language | Fees, risk, transaction state, auditability |
| Healthcare/Public | Accessible direct flows | Calm, high contrast, readable | Privacy, safety, keyboard/screen reader support |
| Creative/Portfolio | Storytelling | Expressive type, motion, artifact focus | Work samples, process, contact |
| E-commerce | Product showcase + conversion | Product imagery, clear price/stock | Trust, shipping/returns, cart state |
| Productivity | Operational flow | Efficient, low friction, keyboard-friendly | Shortcuts, quick actions, preserved state |
| Education | Progress and clarity | Friendly, structured, encouraging | Progress, feedback, next lesson/action |
| Monitoring/Ops | Realtime dashboard | Dense, severity-coded, stable | Alerts, freshness, recovery path |
