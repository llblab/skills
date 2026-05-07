# Gene Registry Notes

The machine-readable registry lives in [`../genes.json`](../genes.json).

This document explains the gene model for humans. It is no longer a wide machine-parsed table.

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
