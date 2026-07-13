# Production Handoff and Asset Governance

Frontend design work often produces artifacts beyond code: tokens, screenshots, banners, logos, copy, presentation surfaces, icons, and image assets. Treat handoff as part of design quality.

## Approval Checklist

Before an asset or UI surface is considered ready:

- `Purpose`: Serves the stated goal and audience.
- `Brand`: Uses approved/local direction for logo, palette, type, imagery, tone, and terminology.
- `Accessibility`: Contrast, focus, alt text, labels, reading order, and non-color indicators checked.
- `Responsive`: Works at target widths and crops safely.
- `Content`: Copy is proofread, voice-consistent, and CTA is clear.
- `Technical`: Correct format, dimensions, size, naming, metadata, and optimization.
- `Legal/compliance`: Licensed assets, no misleading claims, required disclosures/terms/privacy links where relevant.
- `Versioning`: Final file and previous variants are distinguishable.

## Asset Organization

Recommended project-neutral structure:

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
  banners/
    social/
    web/
    email/
  presentations/
  generated/
    YYYYMMDD/
```

For larger design-heavy projects, add metadata:

```text
.assets/
  manifest.json
  tags.json
  versions/
  metadata/
```

## Naming

Use stable, searchable names:

```text
{type}_{campaign-or-context}_{description}_{YYYYMMDD}_{variant}.{ext}
```

Examples:

- `logo_evergreen_horizontal-full-color_20260701.svg`
- `banner_agent-os_linkedin-header_20260701_dark.png`
- `icon_dashboard_chart-bar_20260701_outline.svg`
- `hero_atmo-network_landing_20260701_mobile.webp`

## Metadata Fields

Useful manifest fields:

- `id`
- `name`
- `type`
- `path`
- `dimensions`
- `fileSize`
- `mimeType`
- `tags`
- `status`: draft, review, approved, archived
- `source`: human, generated, screenshot, export, upload
- `version`
- `createdAt`
- `approvedAt`

## Platform Handoff

| Surface | Minimum Handoff |
|---|---|
| Web UI | Code, tokens, state notes, responsive notes, accessibility notes |
| Banner/social | PNG/WebP export, source markup/design, dimensions, safe-zone note |
| Icon | SVG, size test at 16/24/48px, accessibility role/name guidance |
| Logo usage | Variant, clear space, min size, background compatibility |
| Presentation | HTML/PDF/source, fonts, chart data/source notes |
| Data viz | Chart type, data assumptions, axis/scale notes, accessible summary |

## Release Review

- Run relevant script checks: contrast, UX checklist, validator, catalog search.
- Verify no temporary/generated junk is committed unless intentionally part of the artifact.
- Confirm file names and paths match project convention.
- Include short rationale for non-obvious visual decisions.
- Document known trade-offs and future improvements.
