# Information Presentation

Information presentation turns raw content, data, state, evidence, uncertainty, and available actions into a task-shaped interface before visual styling begins.

```text
raw information → user question → decision or action → hierarchy → scan path → disclosure → composition
```

A surface succeeds when users can find what changed, understand what it means, judge whether to trust it, and choose the next action without reconstructing the system from fragments.

## Start From the User Question

Name the question the surface must answer. Examples:

- `Operational`: What needs attention now, why, and what can I do?
- `Analytical`: What changed, compared with what, and what explains it?
- `Transactional`: What am I committing to, what will happen, and can I recover?
- `Narrative`: What should I understand or believe, what proves it, and what follows?
- `Reference`: Where am I, what does this mean, and how do I apply it?
- `Exploratory`: What options exist, how do they differ, and how can I narrow them?

Do not choose cards, tables, charts, or sections until the governing question and expected decision become explicit.

## Information Grammar

Classify every meaningful item by role:

- `Orientation`: Location, scope, subject, selected entity, active filters, or timeframe.
- `Status`: Current condition, progress, health, availability, or completion.
- `Priority`: What deserves attention first and why.
- `Evidence`: Fact, metric, source, example, proof, or explanation supporting a claim.
- `Uncertainty`: Estimate, confidence, missing data, assumption, or unresolved state.
- `Freshness`: When information was produced or last updated.
- `Action`: Available next step and expected result.
- `Risk`: Consequence, permission, cost, irreversibility, or safety boundary.
- `Recovery`: Undo, retry, edit, cancel, support, or return path.
- `Detail`: Supporting information that can remain secondary until requested.

If an item has no role, remove it, rename it, or justify why it occupies attention.

## Presentation Modes

Choose one primary mode per decision region. A surface may contain several regions, but each region should train one reading behavior.

### Operational

Lead with status, exception, ownership, freshness, and recovery. Keep actions close to the state they affect. Optimize for repeated scanning and interruption.

### Analytical

Lead with the question, comparison frame, baseline, timeframe, and material delta. Show explanatory detail after the result, not before it.

### Transactional

Lead with the commitment, required inputs, price or consequence, validation, and next step. Preserve entered state and make reversal boundaries explicit.

### Narrative

Lead with one claim or turning point at a time. Sequence context → tension → mechanism → evidence → resolution → action. Pattern breaks should mark conceptual changes, not decorate scroll length.

### Reference

Lead with identity, purpose, syntax or anatomy, and the smallest useful example. Keep definitions close to use and preserve stable navigation.

### Exploratory

Lead with available dimensions, filters, comparison criteria, and current selection. Preserve context while users narrow or branch.

## Hierarchy and Scan Paths

Design the reading order in semantic tiers:

1. `Orient`: What surface or object am I viewing?
2. `Decide`: What matters now or what question receives an answer?
3. `Act`: What can or must I do next?
4. `Verify`: What evidence, source, timeframe, or explanation supports this?
5. `Explore`: What secondary detail or alternate path remains available?
6. `Recover`: What happens when data, permissions, or actions fail?

Common scan paths:

- `Triage`: Severity → impact → owner → action → detail.
- `Compare`: Criteria → baseline → differences → trade-off → choice.
- `Execute`: Goal → required input → validation → commitment → confirmation.
- `Learn`: Claim → model → example → boundary → application.
- `Browse`: Category → result set → differentiators → detail → return context.

Visual order, DOM order, keyboard order, and spoken reading order should preserve the same task logic.

## Comparison Contract

Comparison requires shared structure, not merely adjacent containers:

- Use the same criteria, order, units, timeframe, and baseline.
- Align equivalent values and labels.
- Mark missing or inapplicable values explicitly.
- Separate difference from judgment: show what changed before declaring better or worse.
- Keep the decision-driving differences visible; defer exhaustive detail.
- On narrow containers, stack by criterion or preserve a scrollable comparison table without losing labels and identity.

Do not convert genuine comparison into unrelated cards that force users to remember values across the page.

## Progressive Disclosure

Disclosure should reduce cognitive load without hiding risk or required context.

Keep visible:

- Primary status or claim.
- Current scope and active filters.
- Decision-driving evidence.
- Material risk, cost, uncertainty, and freshness.
- Primary action and recovery route.

Defer:

- Rare configuration.
- Exhaustive history.
- Secondary metadata.
- Expert detail that does not change the immediate decision.

Never defer information users need to judge whether an action remains safe or trustworthy.

## State, Evidence, and Uncertainty

- Pair status with meaning and consequence: `Sync delayed by 12 minutes; reports may omit recent events.`
- Put provenance near contested or high-stakes claims.
- Distinguish observed, calculated, estimated, predicted, and unavailable values.
- Show timeframe and comparison baseline beside deltas.
- Explain partial data and how it changes interpretation.
- Use confidence ranges or explicit uncertainty language instead of false precision.
- Keep stale data visible when it remains useful, but mark freshness and recovery.
- Do not use color, animation, or iconography as the only carrier of state.

## Density

Density follows task pressure, frequency, and information relationships.

- High-frequency operational work benefits from compact alignment, stable positions, and keyboard efficiency.
- High-stakes or unfamiliar work needs more explanation, confirmation, and recovery context.
- Narrative and persuasive work needs rhythm and selective emphasis, not uniform sparsity.
- Dense does not mean small. Preserve readable type, target size, grouping, and whitespace between semantic regions.
- Sparse does not mean clear. Empty space cannot repair missing hierarchy or vague labels.

Change density by preserving semantic groups, not by uniformly shrinking or enlarging every value.

## Avoid Card-First Design

Cards work when they express a real unit with its own identity, boundary, or action. Do not use them as the default answer to information architecture.

Prefer:

- Lists for sequences, queues, and repeated records.
- Tables for aligned comparison.
- Definition layouts for label/value reference.
- Timelines for ordered events.
- Split panes for browse-and-inspect workflows.
- Inline disclosure for local explanation.
- Continuous editorial flow for narrative.
- Directly labeled plots for quantitative relationships.

Use borders, surfaces, and containers only when they clarify ownership, grouping, interaction, or depth.

## Intrinsic Composition

Information structure determines intrinsic layout constraints:

- Decision-driving labels and values define useful minimum widths.
- Comparison defines shared tracks and alignment.
- Reading measure defines maximum width.
- Priority determines what wraps, moves, remains fixed, or receives a semantic phase change.
- Localization, zoom, missing data, long identifiers, and uncertainty ranges provide real content pressure.

Do not derive information hierarchy from a desktop screenshot and then attempt to preserve it through shrinking.

## Agent Output Contract

Before styling or implementing a meaningful surface, state the smallest useful presentation contract:

```markdown
User question: <what the surface must answer>
Presentation mode: <operational | analytical | transactional | narrative | reference | exploratory>
First scan: <orientation → decision → action>
Persistent context: <scope, status, filters, timeframe, risk>
Evidence: <proof, source, comparison, freshness, uncertainty>
Disclosure: <visible now vs available on demand>
Recovery: <error, undo, retry, return path>
```

Omit labels that carry no decision value, but resolve the underlying questions.

## Comprehension Proof

Rendering proof should test understanding, not only visual polish:

1. In a five-second scan, can a reviewer identify the surface, primary status or claim, and next action?
2. Can the governing user question be answered without opening irrelevant detail?
3. Can equivalent options or values be compared without memory work?
4. Are source, timeframe, freshness, and uncertainty visible where they affect trust?
5. Do loading, empty, partial, stale, error, and permission states preserve orientation and recovery?
6. At narrow and intermediate containers, does task order survive without hiding decision-critical information?
7. With localization, zoom, and long content, do labels remain meaningful and relationships remain legible?

If the answer depends on explanation from the designer, the surface has not yet proved comprehension.
