# Visual Craft and Fit Checks

Use these checks after information, behavior, and art-direction decisions exist. They turn recurring production details into contextual review evidence without forcing one aesthetic onto every surface. Judge coherence against [`art-direction.md`](art-direction.md), pressure against [`responsive-layout.md`](responsive-layout.md), and reference fidelity against [`visual-reference-workflow.md`](visual-reference-workflow.md).

## Evidence and Authenticity

Every prominent element should trace to a user task, content relationship, product state, existing brand or behavior, declared prototype need, chosen art direction, or tested functional constraint. Remove elements with no traceable reason before decorating them differently.

Classify factual-looking content before presentation:

- `Verified`: Supplied by the project, user, trusted source, or inspected runtime.
- `Derived`: Calculated from verified inputs with a known method and timeframe.
- `Sample`: Intentionally fictional prototype data, identified through project context or fixtures.
- `Placeholder`: A visible slot awaiting real content or assets.
- `Unsupported`: A claim, metric, testimonial, customer mark, certification, identity, event, or status without evidence.

Never make unsupported content look verified through precise numbers, realistic names, timestamps, versions, stock counters, quotes, logos, or operational telemetry. Remove it, label it as sample, use an explicit placeholder, or request real input. Keep source, timeframe, freshness, uncertainty, and proof near claims where they affect trust.

For assets and product evidence:

- Prefer approved brand assets, product captures, photography, illustration, and real states when available.
- Generated or stock assets may establish direction but must not impersonate customers, team members, product capability, or a shipped interface.
- Use a real component preview, verified screenshot, clearly illustrative concept, or placeholder instead of decorative fake dashboards and terminals that viewers could read as proof.
- Verify customer marks, testimonials, awards, certifications, press mentions, and usage metrics.
- Record source, license, rights, crop behavior, loading cost, fallback, and accurate alt/decorative treatment.

A conceptual surface may remain fictional, but it must not blur concept and evidence.

## Typography Fit

### Display Composition

Treat display type, container measure, adjacent media, and viewport height as one composition.

- Test the real headline at target font, weight, width, and language instead of sizing from placeholder length.
- Keep line breaks intentional at representative widths; avoid one stranded word, a weak final line, or a headline that competes with the primary visual for the same space.
- Use `text-wrap: balance` or `pretty` as progressive enhancement when it improves the tested result, not as a substitute for suitable copy, measure, and scale.
- Prefer fluid bounded scale such as `clamp()` when the type should adapt continuously; add a phase change when composition, not font size, must change.
- Do not lock editorial line breaks with `<br>` when localization or responsive content must reflow. Use authored breaks only when the copy and language remain controlled.

A two-line hero may provide useful discipline for short marketing copy, but it is not a universal invariant. The real requirement is a clear first scan without clipping, crowding, or losing the primary action.

### Glyph and Line-Box Safety

Inspect actual glyphs at every used weight and style:

- Italic and display glyphs with ascenders, descenders, swashes, or variable-font extremes can escape a tight line box. Test strings containing `f`, `g`, `j`, `p`, `q`, and `y` plus accented characters relevant to supported locales.
- Check `line-height`, block padding, overflow, masks, gradient clipping, and transformed wrappers together. Never hide overflow around text until glyph clearance is proven.
- Underlines, focus indicators, selection, and text decoration must remain visible around descenders.
- Verify font loading and fallback metrics; a polished primary font that causes layout shift or clips during fallback remains a production defect.

### Body, Labels, and Data

- Keep prose measure readable and let labels wrap when meaning survives; do not shrink text to preserve a decorative layout.
- Test compact metadata at zoom and on low-density displays. Small uppercase text with wide tracking can lose words, hierarchy, and localization capacity.
- Use tabular figures where numeric alignment supports comparison. Use monospace only when its rhythm or semantics helps; do not turn all numbers monospace as a style reflex.
- Preserve full values through wrapping, disclosure, tooltip, accessible name, or detail view when truncation is necessary.

## First-View and Hero Fit

For landing, campaign, onboarding, and other first-impression surfaces:

- Identify the minimum first-view payload such as product identity, primary claim, essential context, primary action, and one visual or proof element when needed.
- Render the shortest supported viewport as well as a representative laptop and wide context. Browser chrome, safe areas, zoom, and wrapped text reduce usable height.
- Keep the primary claim and action discoverable without stuffing every trust signal, feature, price, metric, or navigation choice into the first view.
- Move secondary proof below the opening region when it competes with comprehension. Keep it near enough to support the next decision.
- Plan headline scale and media scale together. When one grows, verify that the other still has a meaningful role and crop.
- Use `dvh`/`svh` or intrinsic minimums when full-height treatment matters; never crop content merely to achieve a perfect viewport screenshot.

A hero need not fill the viewport, contain an image, or avoid centered composition. Choose those moves from the brief. It must establish hierarchy, preserve readable content, and survive the supported height and width range.

## Action and Form Fit

### CTA Integrity

- Give each action intent one stable verb or phrase across repeated placements unless context changes the promised result.
- Distinguish primary, secondary, tertiary, and destructive intent through more than position alone.
- Test contrast in every actual background state, including photography, gradients, hover, disabled, loading, high contrast, and theme variants.
- Keep common desktop CTA labels on one line when practical. If localization or accessibility text wraps, preserve target size, alignment, and hierarchy rather than clipping or shrinking the label.
- Avoid artificial width constraints that create narrow multi-line buttons. Shorten marketing copy when meaning remains intact; otherwise let the component grow or recompose.
- Keep loading feedback from changing the button width enough to shift adjacent controls.

### Control Alignment

- Align labels, fields, help, errors, prices, feature lists, and action rows by shared semantic tracks when users compare siblings.
- Equal height is useful when it improves comparison or action alignment; it is harmful when it creates unexplained empty space or clips dynamic content.
- Apply optical corrections to icons, play glyphs, and mixed-shape controls only after geometric alignment and at final rendered size. Keep the correction tokenized or locally documented.

## Section and Component Rhythm

Inventory the layout family of each major region before declaring a page varied or coherent.

- Repetition is valuable when users learn a repeated record, comparison, or workflow. It becomes generic when unrelated sections share the same composition merely because a component was convenient.
- Avoid long runs of alternating image/text splits, equal card rows, or identical heading stacks when the content relationship changes. Introduce a new composition only when it marks a new task, evidence type, narrative beat, or density.
- Eyebrows, badges, section numbers, and metadata should orient or classify. Remove them when location and headline already provide the same information.
- A grid should have a content-backed unit for each cell. Do not add empty cards or filler metrics to complete a fashionable shape; intentional negative space should remain spatial, not masquerade as missing content.
- Use aligned dividers sparingly. A border on every side of every row often creates more grid noise than hierarchy.
- Review the whole scroll or flow at thumbnail scale for pacing, then inspect each region at reading scale for local fit.

Do not enforce a mechanical quota for layout families, labels, or card counts. Use the inventory to expose accidental repetition and unexplained exceptions.

## Shape, Palette, and Theme Coherence

- Define the relationship between outer containers, nested surfaces, controls, and pills. Radius may vary by role, but adjacent values should look intentional and concentric where shapes nest.
- Pick the page or product accent roles before styling individual sections. New hues require semantic meaning or an explicit art-direction reason.
- Keep warm/cool neutral drift, border opacity, elevation color, and image grading under review across the whole surface, not component by component.
- Theme inversion or a strong material switch should mark a real conceptual boundary and occur with deliberate transition. Random light/dark section alternation often reads as assembled fragments.
- Shadows should share a believable light direction and elevation scale. Tinted or diffused shadows remain optional, not automatic markers of quality.
- Decorative texture, blur, glow, and grain should survive contrast and performance checks and should not become the only boundary between interactive and static regions.

## Copy and Data Sweep

After visual layout stabilizes, reread every visible string in rendered order:

- Confirm grammar, referents, terminology, action promise, recovery language, and one coherent voice register.
- Remove decorative microcopy that repeats the heading, simulates operational detail, or merely announces the design's mood.
- Verify every metric, testimonial, customer mark, stock counter, version, timestamp, specification, and comparison. Use real evidence, clearly identified sample content, or an explicit placeholder.
- Check that short copy remains truthful after truncation and that long/localized copy still preserves hierarchy.
- Review alt text and captions for invented context; they must describe the asset's actual role and content.

Apply the evidence classification above to every factual-looking string and asset; organic-looking invented detail remains invented.

## Final Craft Pass

1. Render real content and the strongest content-pressure cases.
2. Inspect typography clearance and wrapping before spacing polish.
3. Verify first-view hierarchy and CTA/form fit at width, height, zoom, and theme extremes.
4. Review section rhythm and repeated grammar across the complete surface.
5. Audit shape, palette, material, imagery, and motion coherence against the chosen style grammar.
6. Run the copy/data and provenance sweep.
7. Fix the strongest unjustified craft defect, rerender, and stop when further polish no longer changes comprehension, usability, authenticity, or the approved direction.
