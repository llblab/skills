# Visual Reference Workflow

Use supplied, captured, or generated references to make art direction inspectable and implementation precise. Treat every image as evidence with a known authority boundary, not automatic truth for behavior, content, responsiveness, or code. Resolve direction through [`art-direction.md`](art-direction.md), provenance and fit through [`visual-craft.md`](visual-craft.md), and governed delivery through [`production-handoff.md`](production-handoff.md).

## Choose the Reference Role

Name what each artifact should decide:

- `Direction`: Mood, composition, typography character, palette, imagery, material, or memory hook.
- `Specification`: Inspectable layout, spacing, component anatomy, content hierarchy, and visible states intended for close implementation.
- `Comparison`: Current/proposed, variants, or before/after evidence under matched conditions.
- `Flow`: Screens or states connected by believable user or system actions.
- `Identity application`: Evidence that a brand system works across marks, UI, media, and physical or campaign contexts.

Do not generate imagery merely because tooling exists. Use references when visual uncertainty, alignment cost, or fidelity justifies them. Direct implementation remains valid for technical fixes, established systems, and small project-native changes.

## Plan a Legible Set

Plan frames from unresolved decisions rather than a fixed quota:

- `Overview`: Whole page, flow, or identity system for rhythm and continuity.
- `Region`: One section, screen, state, or component at readable scale.
- `Detail`: Typography, control, texture, logo, or asset treatment that a region cannot establish.
- `Pressure`: Narrow, short, zoomed, localized, loading, error, permission, or alternate-theme evidence.
- `Comparison`: Two states or artifacts captured under equivalent conditions.

Use one frame when it answers the question. Split a composite when text, controls, spacing, crop, or component relationships become unreadable. Preserve an overview when focused frames would hide system rhythm.

Practical starting formats:

- Web regions often read well at 16:9 or 16:10.
- Cinematic exploration may use 21:9, but implementation proof still needs representative product viewports.
- Mobile frames should preserve target screen ratio and safe areas; a device mockup is optional presentation context, not UI specification.
- Identity overviews often use 2×2, 2×3, 3×3, or horizontal strips, but panel count follows the decisions requiring proof.

Record pixel dimensions, viewport/container, device scale assumptions, content/state, crop, and frame role. Aspect-ratio labels alone do not make artifacts comparable.

## Crop or Regenerate

Crop when source resolution and surrounding context remain sufficient. Capture or generate a fresh focused frame when cropping would:

- Hide container, viewport, flow, or neighboring context needed to interpret proportions.
- Make text, controls, spacing, or grid relationships unreadable.
- Distort typography, media framing, or safe zones.
- Turn a broad concept into false pixel-level specification.
- Remove state or responsive evidence that owns the decision.

When regenerating, lock the continuity decisions and vary only the unresolved question. Preserve palette roles, type relationships, spacing rhythm, geometry, component family, imagery, platform context, and voice unless testing one of them. Keep original artifacts and prompt/version metadata until replacement review; equivalent prompts can still drift.

## Track Provenance

For every reference, record:

- Source such as user-provided, existing product, runtime capture, design file, generated concept, or third-party inspiration.
- Intended role, authority, viewport/state/content assumptions, and version or prompt when reproducibility matters.
- Ownership, license, confidentiality, approval, and reuse constraints.
- Whether visible claims, identities, metrics, testimonials, product states, and brands are verified, sample, placeholder, or unsupported.

Generated concepts must not impersonate shipped product evidence. Third-party references establish quality or pattern evidence, not permission to copy protected identity, assets, or distinctive composition.

## Extract a Reference Contract

Separate:

- `Observed`: Clearly visible or measurable.
- `Inferred`: A likely rule explaining multiple observations.
- `Unknown`: Behavior, state, breakpoint, token, content, or technical detail the artifact cannot establish.

Use this worksheet:

```text
Role and authority:
Viewport/container/state:
Observed:
Inferred:
Unknown:
First scan and action:
Grid/alignment/safe zones:
Type roles and relative scale:
Spacing relationships:
Color/material/elevation roles:
Component anatomy and visible states:
Media ratio/crop/focal point:
Continuity decisions:
Implementation risks:
Proof needed:
```

Extraction rules:

- Transcribe only readable approved text; mark uncertain OCR or generated pseudo-text unknown.
- Capture line count, relative scale, weight, measure, and rhythm before guessing font identity.
- Extract spacing relationships and repeated token candidates before invented pixel precision.
- Sample colors from multiple clean regions; separate semantic roles from generated lighting and anti-aliasing.
- Record overlays, opacity, texture, blur, and fallback assumptions independently.
- Extract only visible component anatomy and hierarchy. Mark hover, focus, loading, error, disabled, responsive behavior, API, and state ownership unknown unless established elsewhere.

Request source values, inspect runtime/code, produce a clearer frame, or preserve the unknown. Never fill ambiguity with familiar defaults merely to complete a specification.

## Maintain Continuity

For multi-frame work, lock:

```text
Identity: palette, type roles, icon/illustration language, imagery treatment
Geometry: grid, spacing rhythm, radii, borders, elevation, media ratios
Interaction: navigation model, action hierarchy, state language, motion character
Content: terminology, voice, proof status, data assumptions
Platform: viewport/container, safe areas, input mode, system conventions
Variation: what may change between regions or states and why
```

Variation should express content, task, state, or deliberate pacing. It should not silently replace the design system between frames.

## Media and Safe-Zone Recipe

Define imagery through subject, narrative role, lighting, palette, grade, texture, realism, repeated aspect ratios, crop tolerance, focal point, loading priority, format, fallback, and provenance.

```css
.media-frame {
  aspect-ratio: var(--media-ratio);
  overflow: clip;
}

.media-frame > img,
.media-frame > video {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  object-position: var(--media-focal-point, 50% 50%);
}
```

Use stable ratios inside comparable modules, not one ratio for every role. Define a phase change when mobile storytelling needs another crop. For text over media, establish a real safe zone and scrim, mask, or tonal treatment; test the most contrast-hostile frame rather than one selected still.

## Mobile Flow Recipe

Choose an iOS-oriented, Android-oriented, or cross-platform context before generating or reviewing a flow. This governs safe areas, navigation, sheets, system regions, and familiar control expectations without making appearance proof of platform correctness.

For each transition, record:

```text
prior state → user/system action → next state → persistent context → recovery/back path
```

Show enough states to prove the primary path and material validation, loading, permission, empty, error, confirmation, and recovery behavior. Avoid unrelated showcase screens.

When device mockups help presentation, keep one device style/scale, even margins, and subordinate framing. Use raw screen captures for implementation measurement because bezel and perspective distort dimensions.

## Web Section Recipe

For multi-section pages:

1. Give each section a job such as hook, explain, compare, prove, convert, or recover.
2. Keep an overview for narrative and pacing.
3. Add focused frames only where type, controls, media, or geometry need readable extraction.
4. Track composition anchor, background mode, CTA role, density, and media treatment.
5. Reject accidental repetition and unexplained system drift.
6. Preserve one primary action journey through the sequence.

A separate frame per section can improve legibility but remains a tactic, not an invariant.

## Identity Board and Logo Recipe

An identity board argues for a coherent system; one generated collage does not complete brand work. Select panels from strategy, audience, emotional promise, metaphor, marks, construction, clear space, semantic palette, typography, imagery/icons, digital UI, physical/campaign applications, and message hierarchy.

Logo exploration methods include:

- `Monogram + meaning`: An initial combined with a brand or product metaphor.
- `Product action`: An abstraction of connect, protect, build, route, compare, speak, or another core action.
- `Metaphor fusion`: A small number of meaningful ideas reduced into one mark.
- `Negative space`: A second reading that survives small sizes.
- `Construction geometry`: A repeatable grid, ratio, cut, fold, frame, orbit, or module.

Evaluate recognition, distinctiveness, balance, scalability, monochrome use, small-size legibility, background compatibility, and strategic fit. Generated marks remain concepts until originality, trademark, rights, and production-vector review. Never copy an exact mark, slogan, composition, or distinctive asset from a reference.

## Implementation Boundary

Visual references do not prove semantic markup, keyboard/focus behavior, accessible names, hidden states, intermediate widths, real content, legal claims, analytics, routes, payloads, dependency availability, performance, browser support, or architecture.

Project reality and explicit contracts outrank generated and third-party visuals. Translate reference logic into semantic tokens, intrinsic constraints, components, and project-native code rather than reproducing accidental pixels.

## Prevent Translation Drift

1. Render at the governing reference's viewport, container, content, and state.
2. Compare side by side or with overlay/diff when available.
3. Inspect first scan, region bounds, alignment, relative type scale, spacing rhythm, color roles, media crop, component treatment, and memory hook.
4. Classify differences as implementation defects, accessibility/intrinsic necessities, project constraints, or approved improvements.
5. Correct the strongest unexplained drift and rerender.
6. Continue beyond matched-frame fidelity with intermediate widths, real states, long content, alternate input, reduced motion, and performance.

Do not gain screenshot similarity through fragile absolute positioning or hidden content pressure.

## Handoff

Provide:

- Reference inventory with provenance, role, viewport/state, authority, dimensions, and approval.
- Observed, inferred, and unknown decisions plus continuity rules.
- Asset paths, formats, sizes, focal points, crop variants, safe zones, alt/decorative behavior, rights, and regeneration procedure.
- Implemented contracts and intentional deviations.
- Matched rendered comparison where tooling permits.
- Unavailable visual, behavioral, provenance, licensing, or runtime proof.

Archive or remove rejected generations so they do not become accidental source material.
