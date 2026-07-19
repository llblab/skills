# Visual Identity and Assets

Use visual identity rules to keep frontend surfaces coherent across logo, colors, typography, imagery, icons, and generated assets. Align strategic voice through [`brand-messaging.md`](brand-messaging.md), composition through [`art-direction.md`](art-direction.md), and governed delivery through [`production-handoff.md`](production-handoff.md).

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

Functional UI may use lower accent ratios; dashboards should reserve strong color for status and exception. Use the palette generator and color-psychology catalog for contextual candidates; brand, culture, semantics, contrast, and rendered evidence outrank universal color associations.

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

Use the icon generator and style/library catalogs to compare candidates against product role, density, brand grammar, platform, and available dependencies.

Production rules:

- Standard viewBox: 24×24 unless compact system uses 16×16.
- Use `currentColor` for inline SVG where possible.
- Keep stroke width consistent.
- Test at 16px and 48px.
- Functional icons need accessible names or adjacent labels.
- Decorative icons stay hidden from assistive tech.

## Asset Governance

Use [`production-handoff.md`](production-handoff.md) for organization, naming, metadata, approval, platform deliverables, and release review. Identity review still verifies logo usage, palette/type/imagery coherence, responsive crop, contrast, and accessible asset treatment.
