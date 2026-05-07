# Gene Registry Notes

The machine-readable registry lives in [`../genes.json`](../genes.json).

This document explains the gene model for humans. It is no longer a wide machine-parsed table.

## Gene == Meme

In cross-evolution, `gene` and `meme` are equivalent terms.

A gene is a transmissible meme carried by skills. It must carry meaning, change behavior, survive transport, and have a recognizable failure mode when absent.

A standard can also be a gene-meme when it is transportable and changes behavior. The `gene == meme` rule is itself a gene-meme: it is a transmissible standard for deciding what counts as evolutionary material.

Because gene == meme, a gene can be decomposed into smaller meaning-bearing parts, recombined with other genes, and composed into higher-order protocols. The purpose is not taxonomy for its own sake; the purpose is discovering new emergent properties and new gene-memes.

Do not promote a checklist item, file convention, or local implementation detail into a gene unless it also behaves like a portable meme.

## What Counts As A Gene

A gene is a deep, transportable, emergent meme-atom that changes a skill's cognition, operation, composition, or graceful degradation.

A valid gene should satisfy most of these checks:

- It changes behavior, not only file layout.
- It transfers across domains without naming a concrete project.
- It has a recognizable failure mode when absent.
- A skill can adopt it partially without losing its own purpose.
- It makes the skill more valuable, not merely more compliant.
- If deprecated, it leaves clearer boundaries rather than dead ceremony.

Superficial affordances such as `has docs`, `has changelog`, `has script`, or `has test command` are observations or evidence fields. They are not genes by themselves.

## Active Deep Genes

### `atomic-independence`

Reusable skill instructions stay self-contained and avoid hard-coded sibling skills, concrete projects, private repositories, or stack mirrors.

Absent failure mode: the skill becomes brittle glue for one local stack and cannot travel cleanly to another context.

### `portability-lens`

The skill separates transportable mechanism from local product, project, or stack-specific context before evolving instructions.

Absent failure mode: local lessons are mirrored into reusable text and silently narrow the skill's audience.

### `observation-over-score`

Metrics and recommendations are treated as signals for agent judgment, not targets to maximize.

Absent failure mode: the ecosystem optimizes dashboards and checklists instead of meaningful skill evolution.

### `progressive-disclosure`

The skill starts with the smallest useful contract and adds ceremony only when discovered constraints earn it.

Absent failure mode: the skill becomes overdesigned, hard to activate, and slower than the work it was meant to improve.

### `graceful-degradation`

The skill defines how to narrow, defer, stop, or degrade without leaving dead ceremony or false success.

Absent failure mode: when constraints appear, the skill either keeps pretending to work or collapses without preserving useful boundaries.

### `context-scoped-naming`

Names avoid redundant domain prefixes when directory, package, or protocol context already makes ownership clear.

Absent failure mode: the skill multiplies entities, smears domain boundaries, and makes local artifacts look globally distinct when they are only context-local.

Recommendation mode: optional/reward-only. Adopt it when a skill owns local artifacts or naming conventions that risk redundant domain prefixes; do not add boilerplate naming prose just to improve fitness.

### `portable-standards`

Repeated practice is codified as a transportable standard when it can serve multiple projects or skills. Skills are treated as projects when they own protocols, docs, artifacts, or release discipline.

Absent failure mode: useful lessons stay implicit, local, and non-transferable, so each project or skill rediscovers the same operating rules from scratch.

Recommendation mode: optional/reward-only. Adopt it when a practice has enough shape to become a standard; do not standardize one-off habits.

### `meta-protocoling`

The skill uses explicit meta-comments or meta-protocols to name the process behind the process: why a rule exists, when it applies, and how it should evolve or degrade.

Absent failure mode: agents follow rituals without understanding intent, so protocols drift into dead ceremony, hidden coupling, or unreviewable habits.

Recommendation mode: optional/reward-only. Adopt it when a protocol needs self-explanation; do not add meta-layer prose to trivial instructions.

### `gene-meme-equivalence`

The system treats a gene as a transmissible meme: standards, protocols, and practices become genes only when they carry meaning, change behavior, survive transport, and expose an absent failure mode.

Absent failure mode: the registry confuses local conventions or checklist features for true evolutionary material, so transfer produces ceremony instead of transmissible capability.

Recommendation mode: optional/reward-only. Adopt it in meta-evolution contexts; do not force ordinary task skills to discuss memes.

### `memetic-recombination`

Any gene-meme may be decomposed into smaller meaning-bearing parts, recombined with other genes, or composed into higher-order protocols to produce emergent properties and new gene-memes.

Absent failure mode: genes are treated as static labels, so the ecosystem can only copy or delete them instead of discovering new capabilities through composition and recombination.

Recommendation mode: optional/reward-only. Adopt it in meta-evolution contexts where gene interaction, conflict, or composition is part of the work.

### `horizontal-gene-transfer-mode`

Soft proactivity can enter a bounded submode that looks for one valuable gene-meme transfer from a donor skill or standard into one recipient skill without forcing broad propagation.

Absent failure mode: useful gene-memes remain isolated in their origin context, or the opposite failure occurs: broad propagation copies them into unrelated skills as score-farming ceremony.

Recommendation mode: optional/reward-only. Adopt it in skills or standards that intentionally move patterns between contexts.

## Skill-Local Research Artifacts

Each skill may carry `.cross-evolution.json`.

Use it for meaningful local research artifacts:

- Declared genes that are intentionally present even if auto-detection is weak
- Ignored recommendations with reasons
- Observations and local constraints
- Known conflicts or intentional absences
- Last reviewed / observed timestamps

Do not store transient dashboard noise just because it was measured once.

## Observation Scripts

```bash
scripts/audit-cross-evolution.sh --root ~/.agents/skills
scripts/inspect-skill.sh brainstorming --root ~/.agents/skills
scripts/inspect-gene.sh atomic-independence --root ~/.agents/skills
```

Legacy `scripts/audit-genes.sh` now delegates to the JSON-first observer.

## Lifecycle

```text
Proposed → Active → Deprecated → Extinct
```

Lifecycle is a human decision assisted by observation scripts. The agent should not promote shallow repeated features just because they are easy to detect.
