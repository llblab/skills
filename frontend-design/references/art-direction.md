# Art Direction

Use art direction to make an interface feel authored rather than assembled. Choose one concept, then let typography, color, composition, material, and motion express the same idea. Ground expression in [`brand-messaging.md`](brand-messaging.md) and [`visual-identity-assets.md`](visual-identity-assets.md) when product voice or approved identity governs the direction.

## Direction Brief

- `Product metaphor`: Machine, archive, studio, cockpit, marketplace, ledger, gallery, ritual, playground, control room, instrument, map, document, organism.
- `Emotional target`: Trust, speed, precision, calm, power, delight, mystery, luxury, urgency, transparency, craft, authority.
- `Density`: Sparse, editorial, operational, information-dense, immersive, kiosk-like.
- `Energy`: Static, restrained, tactile, cinematic, kinetic, real-time.
- `Memory hook`: One thing the user remembers: a layout move, material, type treatment, animation, icon language, or interaction.

## Style Grammar Contract

A style family is a connected grammar, not a preset bundle or list of fashionable values. Translate the chosen concept across these axes:

- `Substrate and material`: Flat field, paper, glass, metal, ink, light, soft volume, terminal, or image-led atmosphere.
- `Geometry`: Sharp, restrained, rounded, pill, modular, irregular, layered, or visibly gridded forms.
- `Typography`: Role contrast, weight, measure, case, tracking, numeral treatment, and display/body relationship.
- `Composition and density`: Alignment, grid visibility, whitespace, compartmentalization, overlap, and information pressure.
- `Color and contrast`: Dominant surfaces, accent scarcity, semantic color, tonal range, and non-color meaning.
- `Depth and detail`: Border, elevation, texture, grain, dividers, icon language, and image treatment.
- `Motion`: Static restraint, tactile feedback, mechanical transition, soft continuity, or cinematic choreography with reduced-motion behavior.

For each axis, record:

1. `Invariant`: The smallest decision required for the direction to remain recognizable.
2. `Range`: Legitimate variation needed by hierarchy, state, content, and responsive pressure.
3. `Contradiction`: A move that would introduce a competing visual language.
4. `Functional override`: Accessibility, semantics, performance, platform, or task evidence that outranks the aesthetic rule.

Use one dominant grammar. A secondary dialect may appear only at a real boundary such as marketing versus product, editorial content versus controls, or a deliberate campaign moment. Share semantic tokens and identity across that boundary; do not alternate styles section by section.

Implement the grammar through roles and relationships rather than copied hex values, fonts, radii, or animation recipes. Existing brand and project tokens win when they can express the intended relationship. A named style never grants permission to replace the stack, invent assets or data, weaken focus, hide state, or force decoration onto every component.

## Style Families

| Family | Use For | Core Moves | Risks |
|---|---|---|---|
| Minimal / Swiss | Tools, docs, professional flows | Grid, high contrast, whitespace, strong type hierarchy | Sterile if no product-specific detail |
| Editorial | Narratives, reports, brand pages | Large typography, asymmetric grids, pull quotes, strong rhythm | Breaks down if content is too dynamic |
| Brutalist | Counterculture, dev tools, bold media | Stark borders, raw blocks, primary colors, visible structure | Can feel hostile or unserious |
| Industrial / Utilitarian | Admin, ops, logistics, finance | Dense grids, labels, status colors, precise alignment | Can become joyless |
| Luxury / Refined | Premium commerce, hospitality, identity | Slow rhythm, restrained palette, serif/display type, tactile material | Low contrast, too much empty prestige |
| Cybernetic / Retro-future | Crypto, games, monitoring, agentic systems | Dark surfaces, signal lines, glow, monospaced accents, status motion | Neon cliché, poor readability |
| Organic / Biophilic | Health, climate, food, wellness | Earth palette, soft geometry, natural texture, breathing space | Muddy hierarchy |
| Playful / Clay | Learning, onboarding, consumer fun | Rounded volume, pastel contrast, bouncy feedback, friendly icons | Childish if used for serious domains |
| Glass / Aurora | Hero surfaces, premium dashboards | Translucency, mesh gradients, layered blur, luminous accents | Contrast/performance issues |
| Data-dense | Analytics, monitoring, admin | Compact cards, tables, filters, sparklines, status hierarchy | Decoration competes with data |

## Focused Grammar Boundaries

### Minimal and Editorial Restraint

Minimalism removes decisions that do not help comprehension, identity, or action; it does not prescribe white backgrounds, a particular serif, enormous spacing, or visual emptiness.

- Let typography, alignment, measure, and whitespace carry hierarchy before adding containers or effects.
- Give every remaining line, label, border, card, and accent a clear role.
- Use sparse color and depth intentionally, but preserve semantic states and visible interaction boundaries.
- Scale whitespace from content relationships and task pressure rather than applying one oversized section rhythm everywhere.
- A minimal surface still needs complete states, evidence, imagery when the product requires it, and enough character to belong to this product.

### Brutalist and Industrial Expression

Rawness should reveal structure or express a credible product metaphor, not simulate importance through arbitrary noise.

- Choose the substrate and operational metaphor coherently, such as print-like structure, exposed web construction, or telemetry, instead of mixing every brutalist signifier.
- Use strong grid, type, border, and contrast relationships while preserving reading order, keyboard operation, target size, and responsive reflow.
- Keep dense metadata real and useful. Do not invent coordinates, revision strings, system status, legal marks, warning symbols, or machine labels as decoration.
- Texture, scanlines, dithering, and degradation remain optional atmosphere. They must not obscure content, create false state, or impose continuous rendering cost.
- Sharp geometry and abrupt motion can support the grammar, but focus, feedback, error, and recovery must remain unmistakable.

### Soft and Tactile Depth

Softness comes from coherent light, tonal separation, comfortable geometry, and calm motion rather than maximum blur, nested shells, or rounded treatment everywhere.

- Define one light direction and a small elevation scale; shadows and highlights should explain layer ownership or interaction.
- Preserve contrast with borders, tonal steps, focus rings, labels, and state changes. Never rely on shadow alone to communicate a control boundary.
- Reserve nested enclosures for real containment or material metaphor. Avoid card-inside-card depth that obscures information hierarchy.
- Let radius follow component role and nesting while sharing a clear family relationship.
- Use tactile motion for cause, feedback, and continuity. Do not animate every element merely to make the interface feel expensive.
- Blur, grain, and translucent material require performance, fallback, and reduced-transparency consideration.

Concrete construction details and bounded value examples: [`style-recipes.md`](style-recipes.md).

## Typography

- Use type as architecture: display, heading, body, label, data/mono.
- Body text starts from readability; personality can live in headings, labels, numerals, and spacing.
- Keep line length comfortable: ~35-60 chars mobile, ~60-75 desktop.
- Use tabular numerals for metrics, prices, timers, and aligned tables.
- Prefer wrapping over truncation; when truncating, provide full text through expansion, title, tooltip, or detail view.
- Avoid making the whole interface one generic sans voice. If font choice is constrained, use scale, weight, case, tracking, and layout for character.

## Color

- Choose dominant surfaces first, then accents. A palette is not a bag of equal colors.
- Define semantic roles: background, foreground, surface, border, muted, primary, accent, danger, warning, success, focus.
- Functional colors need non-color support: text, icon, shape, label, position, or pattern.
- Bright palettes need discipline: 1-2 dominant accents, neutral support, clear contrast pairs.
- Dark UI should use layered darks, not pure black everywhere; reserve glow and saturation for status or focus.
- Light UI needs depth through border, shadow, tonal surfaces, and spacing, not random grey cards.

## Composition

- Build hierarchy from size, weight, proximity, alignment, and contrast before decoration.
- Use consistent grid logic, then break it deliberately for emphasis.
- Group related controls and content by proximity; separate unrelated concepts with whitespace or rule lines.
- For marketing pages, sequence emotion: problem → shift → proof → action.
- For tools, sequence operation: status → exception → primary action → details → history.
- Respect visual safe zones in heroes/banners; keep essential text away from crowded edges.

## Material and Detail

- Texture, blur, shadow, borders, gradients, and grain must explain the concept.
- Use shadows as elevation language, not decoration. Define a small elevation scale.
- Use borders for structure, surfaces for grouping, and background treatments for atmosphere.
- Decorative elements should never obscure reading, focus, or tap targets.
- Icon language should stay consistent: stroke width, corner style, filled/outline mode, perspective.

## Motion

- Motion should indicate cause/effect, hierarchy, continuity, feedback, or reward.
- Prefer transform and opacity; avoid layout-triggering animation for frequent motion.
- Microinteractions: ~100-250ms. Larger transitions: ~250-500ms. Cinematic moments can be slower only when non-blocking.
- Exit should usually be faster than enter.
- Stagger lists by small increments; avoid slow ornamental sequences that block reading.
- Respect reduced motion. Provide instant or subtle alternatives.

Concrete engine selection, continuous-input, reveal, press, magnetic, shared-layout, sticky-stack, horizontal-pan, overlay, ambient, transparency, lifecycle, and performance recipes: [`motion-recipes.md`](motion-recipes.md).

## Anti-Slop Checklist

- Is the style specific to this product, not a generic SaaS template?
- Is there one memorable move?
- Do color, type, layout, and motion tell the same story?
- Does decoration improve comprehension or feeling?
- Are default cards/buttons visually transformed by system decisions, not random effects?
- Can the aesthetic survive real content, long strings, empty states, and mobile width?
