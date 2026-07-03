# Visual Identity and Assets

Use visual identity rules to keep frontend surfaces coherent across logo, colors, typography, imagery, icons, and generated assets.

## Identity Elements

| Element | Decisions |
|---|---|
| Logo | Primary, secondary, icon mark, reversed, monochrome, clear space, minimum size |
| Palette | Primary, secondary, neutral, semantic, accent ratios |
| Typography | Display, heading, body, label, mono/data, scale, weights, line heights |
| Imagery | Subject, lighting, crop, filters, texture, realism/illustration level |
| Icons | Stroke/fill style, corner radius, size grid, metaphors, animation readiness |
| Layout | Grid, density, whitespace, alignment, responsive behavior |

## Logo Usage

- Use the correct logo variant for space and background.
- Keep clear space around the logo; a practical minimum is the mark height or a stable token.
- Do not stretch, recolor, rotate, add effects, crop, or place on busy backgrounds without treatment.
- Minimum digital sizes: full logo ~120px wide; icon-only 24-32px depending on detail.
- Use SVG for frontend where possible; PNG only for raster/fallback contexts.
- For co-branding, equalize visual weight, not raw pixel width.

## Color Palette Structure

```text
Primary 1-2 colors      → main brand / CTA / emphasis
Secondary 2-3 colors    → accents / illustrations / supporting visuals
Neutrals 3-5 colors     → text / surfaces / borders / shadows
Semantic colors         → success / warning / error / info / focus
```

Useful ratio for brand-heavy surfaces:

- Primary/dominant: 60-70%.
- Secondary/support: 20-30%.
- Accent: 5-10%.

Functional UI may use lower accent ratios; dashboards should reserve strong color for status and exception.

## Color Psychology Quick Map

| Color | Signals | Common Fit | Caution |
|---|---|---|---|
| Blue | Trust, stability, professionalism | Finance, healthcare, tech, corporate | Can feel generic |
| Red | Energy, urgency, danger | Food, sports, alerts, sales | Avoid casual use in healthcare/finance |
| Green | Growth, health, sustainability | Eco, wellness, finance growth, success | Red/green alone fails accessibility |
| Gold/Yellow | Warmth, luxury, optimism, attention | Premium, food, energy | Low contrast on white |
| Purple | Creativity, mystery, premium | Beauty, creative, AI/tech | Overused in generic AI UI |
| Orange | Friendly, active, confident | Retail, sport, food, youth | Can feel cheap if overused |
| Black | Sophistication, power, authority | Luxury, fashion, premium tech | Heavy if no contrast rhythm |
| White | Clarity, simplicity, cleanliness | Healthcare, modern, spacious UI | Empty if hierarchy is weak |

## Typography Specs

- Body minimum: 16px for normal reading.
- Small text: 14px for secondary UI, avoid for long content.
- Captions: 12px only when low importance and accessible.
- Headings: line-height 1.1-1.3.
- Body: line-height 1.5-1.75.
- All-caps labels need letter spacing.
- Long-form text max width: ~65-75ch.
- Use tabular numerals for metrics and tables.

## Icon System

| Style | Best For |
|---|---|
| Outlined | General UI, settings, navigation |
| Filled/Glyph | Compact nav, active states |
| Duotone | Marketing, onboarding, feature cards |
| Thin | Luxury, editorial |
| Bold | Hero areas, high-impact actions |
| Rounded | Friendly, health, education |
| Sharp | Technical, finance, enterprise |
| Pixel | Retro/gaming |
| Hand-drawn | Artisan/creative |
| Isometric | Docs, explainers, infographics |

Icon rules:

- Standard viewBox: 24×24 unless compact system uses 16×16.
- Use `currentColor` for inline SVG where possible.
- Keep stroke width consistent.
- Test at 16px and 48px.
- Functional icons need accessible names or adjacent labels.
- Decorative icons stay hidden from assistive tech.

## Asset Organization

```text
assets/
  logos/
    full-horizontal/
    icon-only/
    monochrome/
  icons/
  images/
    hero/
    product/
    avatars/
  social/
  presentations/
```

Naming:

`{purpose}-{variant}-{size}.{ext}`

Examples:

- `logo-full-color.svg`
- `hero-dashboard-dark-1920x1080.webp`
- `banner-linkedin-cybernetic-1584x396.png`

## Asset Review

- Correct format and dimensions.
- Accessible contrast with overlaid text.
- Logo clear space and minimum size preserved.
- Image crop works at responsive breakpoints.
- File size appropriate for web delivery.
- Alt text or decorative handling defined.
- Style matches brand voice and surface purpose.
