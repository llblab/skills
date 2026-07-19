# Design System Discipline

A frontend design should produce reusable decisions, not isolated decoration. Use system thinking at the smallest scale that helps the project, and choose foundations from product constraints rather than aesthetic resemblance. Use [`component-patterns.md`](component-patterns.md) for concrete anatomy and [`design-specification.md`](design-specification.md) when decisions need durable transfer.

## Select the Foundation

1. Inspect the installed framework, components, tokens, styling, accessibility primitives, and ownership conventions.
2. Identify platform, host-product, regulatory, brand, and ecosystem constraints.
3. Choose the existing system, an official ecosystem system, accessible primitives, open-code components, a general framework, or custom project-native components.
4. Verify package availability, maintenance, framework/version compatibility, license, bundle/runtime cost, and official documentation.
5. Adopt one ownership model and connect it through semantic tokens and narrow wrappers.

Do not replace a functioning system to restyle one page or add a second foundation for one missing component when the current owner can extend safely.

### Foundation Types

- `Existing project system`: Default. Extend documented variants/composition and fix repeated defects at their owner.
- `Official full system`: Use when ecosystem alignment, host integration, compliance, or user familiarity has product value. Follow official packages and theming APIs rather than recreating components from screenshots.
- `Accessible primitives`: Use when the project owns styling but needs robust dialog, menu, popover, select, tab, or related behavior. Preserve focus, keyboard, portal, dismissal, and labeling contracts.
- `Open-code components`: Copied source becomes project code. Normalize tokens, variants, tests, and dependencies; track upstream accessibility/security fixes intentionally.
- `General framework`: Suitable when team familiarity, speed, and breadth matter. Customize through supported variables before overrides.
- `Custom project-native`: Use when existing foundations cannot express required behavior, brand, performance, or platform contracts. Budget accessibility, states, tests, docs, and maintenance.

### Official Ecosystem Candidates

Prefer official systems when the product lives in their ecosystem:

| Product/ecosystem | Candidate | Typical reason |
|---|---|---|
| Microsoft enterprise | Fluent UI | Microsoft interaction, tokens, accessibility, enterprise breadth |
| Google/Android/Material | Material implementation | Platform familiarity, theming, established behavior |
| IBM enterprise/analytics | Carbon | Dense enterprise and data patterns |
| Shopify admin app | Polaris | Host consistency and app expectations |
| Atlassian/Jira | Atlassian Design System | Host integration and familiar behavior |
| GitHub/developer | Primer | Developer-product and GitHub-adjacent patterns |
| UK public service | GOV.UK Frontend | Tested public-service conventions |
| US public service | USWDS | Federal/public conventions and accessibility |

Package families such as `@fluentui/*`, `@material/*`, `@carbon/*`, `@atlaskit/*`, `@primer/*`, `govuk-frontend`, and `uswds` are discovery vocabulary, not lockfile instructions. Verify current official installation and requirements.

### System Versus Aesthetic

Glass, bento, brutalism, editorial, soft/tactile, dark tech, and kinetic type are visual grammars, not component systems. Express them through project tokens, composition, typography, media, variants, material, and motion. Do not claim an unofficial visual effect as an official platform implementation.

### Mixing Boundary

Avoid multiple full systems inside one interaction domain. Mixing may fit explicit micro-frontend ownership, a documented migration, or one narrow primitive that does not introduce competing theme/behavior.

When approved, define token/theme bridge, typography/icons, focus/portal/overlay/layer coordination, reset/global styles, duplicate dependency cost, and migration or maintenance owner.

Record adoption:

```markdown
Foundation and type:
Product/ecosystem reason:
Alternatives considered:
Installed/verified version:
Theming/token bridge:
Component owner:
Accessibility retained:
Bundle/runtime impact:
Known gaps:
Validation/upgrade owner:
```

## Token Layers

```text
Primitive tokens → raw values
Semantic tokens → purpose aliases
Component tokens → component contracts
```

### Primitive

```css
--color-slate-950: #020617;
--color-amber-500: #f59e0b;
--space-4: 1rem;
--radius-md: 0.5rem;
--duration-fast: 150ms;
```

### Semantic

```css
--color-background: var(--color-slate-950);
--color-foreground: #f8fafc;
--color-primary: var(--color-amber-500);
--color-border: rgb(248 250 252 / 14%);
--color-focus: var(--color-amber-500);
```

### Component

```css
--button-bg: var(--color-primary);
--button-fg: var(--color-background);
--button-radius: var(--radius-md);
--button-duration: var(--duration-fast);
```

Tokenize values that repeat, express meaning/state, need theming, define a component, or will be tuned together. Keep one-off artwork local.

## Naming and Themes

Prefer semantic local names:

```text
--{category}-{role}-{variant}-{state}
--color-primary-hover
--space-section-lg
--button-bg-disabled
--input-border-error
```

Use product prefixes only at external package/API boundaries or established project namespaces.

Theme overrides belong at semantic tokens, not component internals:

```css
:root {
  --color-background: #fff;
  --color-foreground: #101014;
}

.dark {
  --color-background: #101014;
  --color-foreground: #f7f3ea;
}
```

## Component Contract

Every reusable component defines:

- Anatomy/slots and semantic element.
- Finite variants and sizes tied to product need.
- Default, hover, active, focus, disabled, loading, selected, error, and other owned states.
- Role, label, keyboard, focus, announcement, and recovery behavior.
- Long/localized/missing content and media behavior.
- Useful minimum/preferred/maximum, wrapping, overflow, and responsive phase changes.
- Tokens consumed and supported extension/composition boundary.

```markdown
| State | Visual change | Interaction | Accessibility |
|---|---|---|---|
| Default | Base tokens | Operable | Name/role exposed |
| Hover | Minor emphasis | Fine pointer | No access dependency |
| Active | Pressed feedback | Immediate | Persistent state exposed when relevant |
| Focus | Strong focus token | Keyboard visible | Contrast and order verified |
| Disabled | Reduced affordance | Not operable | Correct disabled semantics |
| Loading | Stable progress | Duplicate blocked | Status announced when material |
| Error | Error role + message | Recovery available | Message associated |
```

Delete irrelevant rows and add states only when the component owns them.

## Spacing, Density, Elevation, and Motion

- Use a project rhythm such as 4px or 8px; dense tools may use smaller steps while marketing often needs larger semantic jumps.
- Preserve more space around decisions than supporting detail.
- Align labels, controls, and numeric columns by shared tracks.
- Define a small layer/elevation scale for background, surfaces, sticky controls, popovers, dialogs, and critical overlays.
- Layer names beat arbitrary z-index values.
- Keep one or two motion curves per product unless motion itself is a brand language.
- Typical motion roles include instant/direct feedback, fast hover/press, normal expand/collapse, and slower non-blocking scene transitions.

## Foundation and System Validation

- Confirm imports exist and docs match the installed major version.
- Verify token/theme integration without global leakage.
- Render component states, long content, narrow/wide containers, and supported themes.
- Test keyboard, focus return, labeling, dismissal, portals, overlays, and server/client or hydration boundaries.
- Measure bundle impact and avoid duplicated icon, motion, styling, or primitive packages.
- Confirm licensing and host-platform requirements.
- Document intentional deviations from official guidance.

## Review

- Does one foundation own each interaction domain?
- Are repeated decisions tokenized without tokenizing every artistic detail?
- Do semantic roles remain separate even when they share primitives?
- Are variants finite and meaningful?
- Do state treatments and accessibility behavior remain consistent?
- Can themes swap through semantic values?
- Does component structure document ownership and extension?
- Is the system smaller than the product rather than a second product inside it?
