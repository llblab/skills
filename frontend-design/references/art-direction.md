# Art Direction

Use art direction to make an interface feel authored rather than assembled. Choose one concept, then let typography, color, composition, material, and motion express the same idea.

## Direction Brief

- `Product metaphor`: Machine, archive, studio, cockpit, marketplace, ledger, gallery, ritual, playground, control room, instrument, map, document, organism.
- `Emotional target`: Trust, speed, precision, calm, power, delight, mystery, luxury, urgency, transparency, craft, authority.
- `Density`: Sparse, editorial, operational, information-dense, immersive, kiosk-like.
- `Energy`: Static, restrained, tactile, cinematic, kinetic, real-time.
- `Memory hook`: One thing the user remembers: a layout move, material, type treatment, animation, icon language, or interaction.

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

## Anti-Slop Checklist

- Is the style specific to this product, not a generic SaaS template?
- Is there one memorable move?
- Do color, type, layout, and motion tell the same story?
- Does decoration improve comprehension or feeling?
- Are default cards/buttons visually transformed by system decisions, not random effects?
- Can the aesthetic survive real content, long strings, empty states, and mobile width?
