# Design Specification Contract

A design specification transfers decisions between people, agents, design tools, surfaces, and implementation phases without reducing the system to a mood paragraph or utility-class dump. Write one when decisions must outlive the current implementation or support repeatable generation and review.

## Authority and Header

State the product/surface, audience, governing question, owner, status, covered platforms/themes/locales, upstream authorities, non-goals, known unknowns, and evidence used. Existing behavior, project architecture, approved brand guidance, accessibility, and legal contracts outrank a generated specification.

A portable Markdown artifact may start with:

```yaml
---
name: product-surface-design
status: draft
owner: design-system
version: 0.1.0
updated: YYYY-MM-DD
applies_to:
  - web-product
source_authority:
  - existing product behavior
  - approved brand guidelines
  - project tokens
supersedes: null
---
```

Use project-local identifiers. Omit fields or semantic versioning when another repository mechanism owns them.

```markdown
## Scope and Authority

Purpose:
Audience and pressure:
Governing question:
Covered surfaces:
Out of scope:
Upstream authorities:
Known unknowns:
Approval state:
```

## Precision and Rule Strength

Encode each rule at the smallest actionable precision:

1. `Intent`: User or system quality protected.
2. `Semantic role`: Where the rule applies and what it means.
3. `Constraint`: Required relationship, range, state, or boundary.
4. `Value/example`: Exact token, measurement, asset, or implementation example only when established.
5. `Proof`: How reviewers can falsify or verify it.

Label ambiguity-sensitive rules:

- `Required`: Product, accessibility, brand, platform, or system invariant.
- `Recommended`: Strong default with a contextual override.
- `Optional`: Enhancement removable without weakening the contract.
- `Prohibited`: Known failure with a reason and override owner when applicable.
- `Unknown`: Decision awaiting evidence; never disguise it as a default.

Exact values need a source or provisional label. Translate adjectives such as “clean,” “premium,” or “intuitive” into observable relationships.

### Atomic Rule

Use stable IDs only for review, automation, or cross-reference:

```markdown
### DS-ACTION-PRIMARY: Primary Action Recognition

Strength: Required
Applies to: Transactional decision regions
Intent: Keep the commitment action recognizable under content/state pressure.
Role: `action-primary`
Constraint:
- One highest-emphasis commitment action per decision region.
- Visible focus, loading, disabled, and error-adjacent behavior.
Values:
- Background: `--action-primary-bg`
- Foreground: `--action-primary-fg`
Overrides:
- Destructive confirmation uses the destructive action role.
Proof:
- Contrast, keyboard, loading-width, long-label, narrow-container, and theme passes.
```

Merge rules that always change together; split rules with different owners or proof paths.

## Specification Sections

Include only sections required by scope, preserving this ownership order.

### Context and Decision Ledger

- Purpose, audience, pressure, constraints, governing question, and success.
- Information mode, first scan, persistent context, evidence, action, and recovery.
- Chosen direction, memory hook, rejected conflict, and meaningful trade-offs.

### Style Grammar

Record substrate/material, geometry, typography, composition/density, color/contrast, depth/detail, imagery/icons, and motion where relevant.

```markdown
| Axis | Invariant | Allowed range | Contradiction | Override | Proof |
|---|---|---|---|---|---|
| Geometry | Related nested radii | Sharp controls to soft media by role | Unexplained mixed shape families | Platform behavior | Component montage |
| Motion | Tactile direct feedback | Static to restrained transition | Ornamental loops | Reduced motion/performance | Runtime pass |
```

This preserves style detail without converting taste into unscoped bans.

### Semantic Tokens

Keep primitive values, semantic roles, and component contracts separate. For each role record:

```text
name → purpose → value/reference → states/themes → contrast/fallback → owner
```

```markdown
| Token | Role | Value/reference | On-color | States/themes | Proof |
|---|---|---|---|---|---|
| `--color-canvas` | Page substrate | `var(--neutral-0)` | `--color-ink` | Theme override | Contrast sample |
| `--color-action` | Primary action/focus | Brand accent | `--color-on-action` | Hover/active/disabled | State render |
```

Do not merge brand accent, focus, selection, success, and information into one semantic token merely because they share a current primitive. Image-backed/translucent roles need a fallback substrate and worst-case contrast test.

### Typography and Content

```markdown
| Role | Family/source | Weight | Size/range | Line height | Measure/wrap | Pressure test |
|---|---|---|---|---|---|---|
| Display | Approved display family | Supported range | Bounded fluid token | Glyph-tested | Balanced when supported | Long words, accents, zoom |
| Body | Approved text family | 400-500 | Body token | Reading token | Project measure | Localization, links, lists |
| Data | UI/mono role | Supported range | Data token | Row-aligned | Tabular when compared | Signs, units, precision |
```

Record font files, licensing, loading/subsetting, and fallback metrics when they affect delivery. Also define voice, terminology, CTA grammar, proof requirements, and sample/placeholder labeling.

### Layout and Responsive Contracts

Define global task order, grid/alignment, safe areas, region ownership, useful minimum/preferred/maximum sizes, flow/fixed/wrap/overflow/crop behavior, and semantic phase changes. Separate page viewport rules from reusable component container rules.

Use widths as evidence points, not the design model:

```markdown
| Context/pressure | Evidence point | Expected contract | Phase change | Proof |
|---|---|---|---|---|
| Narrow page | Smallest supported | Primary task/action remain ordered | Navigation collapses when labels fail | Render + keyboard |
| Intermediate | Between named breakpoints | No accidental wrap/void | Grid changes at observed failure | Width sweep |
| Narrow component | Sidebar/card | Local content remains operable | Container query changes anatomy | Isolated render |
| Content pressure | Long locale, zoom, missing media | Meaning/recovery remain available | Wrap/disclose/recompose | Fixture pass |
```

Common widths such as 375, 768, 1024, and 1440px can reproduce reviews but do not replace intermediate sweeps, zoom, content extremes, and component-container testing.

### Components and States

```markdown
## Component: <Canonical Name>

Purpose and owner:
Semantic element/role:
Anatomy: slot → purpose → optionality
Variants: name → use → prohibited misuse
Sizes: name → content/target contract → container condition
Tokens: color, type, spacing, geometry, elevation, motion
Content: missing slots, long/localized text, media failure, units/dates
Responsive: minimum/preferred/maximum, wrap/overflow, phase change
Accessibility: name, keyboard, focus, announcements, errors
Extension boundary: supported composition and unsupported nesting/actions
```

```markdown
| State | Trigger | Visual | Interaction | Accessibility | Exit/recovery | Proof |
|---|---|---|---|---|---|---|
| Default | Render | Base tokens | Operable | Name/role exposed | N/A | Static + keyboard |
| Focus | Keyboard/programmatic | Focus token | Operable | Order valid | Move/activate | Keyboard pass |
| Loading | Async action | Stable progress | Duplicate blocked | Status when material | Success/error/cancel | Runtime pass |
| Error | Failure | Error near owner | Recovery available | Message associated | Correct/retry | Error flow |
```

Delete irrelevant rows; add selected, expanded, stale, offline, permission, drag, pending, or optimistic states only when owned. A visual specification must not silently redefine APIs, data, analytics, or navigation.

### Motion and Feedback

Record purpose, trigger, property, range, curve/physics, interruption/exit, reduced-motion result, and performance proof.

```markdown
| Motion | Purpose | Trigger | Property | Range | Curve | Exit | Reduced | Proof |
|---|---|---|---|---|---|---|---|---|
| Press | Feedback | Activation | Transform | 0-1px | Fast token | Reverse | Tonal only | Runtime |
| Sheet | Continuity | Open | Transform/opacity | Edge to rest | Product curve | Dismissible | Instant/fade | Device pass |
```

Static design tools may carry runtime intent but cannot prove it.

### Assets and References

Record approved logos, icons, imagery, visualizations, and generated assets with provenance, license, version, ratio/crop, alt/decorative behavior, responsive variants, and observed/inferred/unknown reference decisions.

### Validation and Handoff

Include project-native checks, accessibility/keyboard/screen-reader/zoom/reduced-motion/content-pressure evidence, narrow/intermediate/wide/container renders, provenance review, matched-reference comparison, known limitations, approval owner, and extension guidance.

```markdown
## Execution Handoff

Objective:
Artifacts to produce:
Authoritative inputs:
Required/recommended rules:
Known unknowns:
Forbidden scope changes:
Reference inventory/provenance:
Project stack/component owners:
Validation commands:
Visual/runtime proof:
Output paths/naming:
```

Do not rely on hidden prompt history or numeric mood dials. Translate them into observable grammar, component, content, and proof rules.

## Anti-Pattern Encoding

Avoid naked “never” lists. Encode trigger, failure, replacement, override, and proof:

```markdown
### AP-UNSUPPORTED-PROOF: Decorative Evidence

Trigger: Metric, testimonial, mark, certification, or preview lacks provenance.
Failure: Viewers may read fictional content as verified evidence.
Replacement: Verified content, labeled sample, explicit placeholder, or removal.
Override: Approved fictional narrative/prototype fixture with project labeling.
Proof: Provenance sweep and source inventory.
```

A prohibition without failure, replacement, boundary, and proof usually encodes preference rather than a maintainable contract.

## Portability and Change Discipline

- Use natural language plus canonical semantic names; exact values only where authoritative.
- Keep intent independent from frameworks, styling libraries, editors, and generation tools unless explicitly constrained.
- Separate static visual intent from runtime behavior.
- Name acquisition and fallback for unavailable fonts, packages, assets, or APIs.
- Treat examples as illustrative, never stronger than the semantic contract.
- Update owning rules and dependent components, states, themes, assets, and proof together.
- Mark superseded rules instead of leaving both active.
- Revalidate representative surfaces before calling changes compatible.

## Review Checklist

- Scope, authority, owner, status, and supersession are explicit.
- Exact values have sources or provisional status.
- Semantic roles remain distinct from primitives and tool syntax.
- Rule strengths and unknowns do not conflict.
- Components include only applicable states and recovery behavior.
- Responsive rules cover content/container pressure and intermediate evidence.
- Motion includes purpose, interruption, reduction, and runtime proof.
- Anti-patterns include failure, replacement, override, and proof.
- References/assets include provenance, rights, and authority.
- Another implementer can act without hidden conversation context.
- The specification stays smaller than the product and points local detail to its owner.
