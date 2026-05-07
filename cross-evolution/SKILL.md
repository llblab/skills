---
name: cross-evolution
description: Horizontal Gene Transfer protocol for skills. Synchronizes best practices and architectural patterns across the skill library.
metadata:
  version: 1.0.6
---

# Cross-Evolution

## Purpose

Maintain a high evolutionary standard across agent skills by identifying deep transportable skill genes, preserving research artifacts, and giving the agent clear observation tools for deciding which evolutionary pressure is real.

A gene is not a superficial feature such as "has a test script" or "has a changelog". A true gene is an emergent meme-atom: a portable cognitive/operational pattern that changes how a skill thinks, acts, composes, or degrades. Good genes make skills more unique and valuable through progressive evolution, not more uniform through checklist compliance.

## Axioms

### 1. Atomic Independence (No Hard Coupling)

Skills and their scripts must be 'atomic'.

- 'FORBIDDEN': Reusable skill instructions that hard-code sibling skill names, concrete project names, private repository names, or stack-specific mirrors.
- 'FORBIDDEN': Any logic inside a skill's script that explicitly checks for or calls tools from another skill.
- 'The Agent is the Glue': Only the AI Agent is responsible for coordination.
- 'Generic Synergy': Skills compose through general contracts, lenses, vocabulary, and handoff shapes — not through direct references to each other.

### 2. Pragmatic Evolution (Occam's Razor)

- 'Just-In-Time Transfer': A gene is transferred only when it solves a recurring problem.
- 'KISS Compliance': Avoid bloating skills with genes they don't need.
- 'Fitness as Signal': Fitness scores are observation hints, never goals.
- 'Portability Guard': Before adding project-specific adaptation to a skill, lift it into a project-neutral lens or keep it in external context instead.
- 'Depth Gate': Reject shallow genes that only detect files, scripts, or documentation furniture unless they express a deeper reusable operating pattern.

### 3. Living Protocol

This skill proactively evolves itself and its gene registry upon discovering new constraints.

## Core Concepts

### Gene

A deep, transportable, emergent meme-atom that improves a skill's cognition, operation, composition, or graceful degradation.

A valid gene must satisfy most of these tests:

- Changes behavior, not only file layout
- Transfers across domains without naming a concrete project or sibling skill
- Has a recognizable failure mode when absent
- Can be adopted partially without rewriting the skill's purpose
- Makes the recipient more distinct and valuable, not merely more compliant
- Can degrade majestically: when deprecated or narrowed, it leaves behind clearer boundaries rather than dead ceremony

Genes have a 'lifecycle': `Proposed → Active → Deprecated → Extinct`.
Machine-readable registry and observation state should live in local JSON artifacts; markdown docs explain the protocol and high-level meanings.

### Horizontal Gene Transfer (HGT)

Copying a gene from a donor skill to a recipient without rewriting the recipient's core purpose.

### Gene Discovery

Scanning existing skills for repeated high-value patterns not yet represented in the registry.
If a candidate passes thresholds, it is automatically written into `docs/genes.md` under "Proposed Genes".

### Genetic Drift

Genes carried by zero skills are candidates for deprecation. After sustained non-adoption, they go extinct.

### Fitness

Quantitative health signal per skill: `earned_weight / applicable_weight × 100%`.
Domain-specific genes (recommend=`none`) only count if already present — reward, not penalty.

Fitness is not an optimization target. A low score can be correct when a skill is intentionally tiny. A high score can be unhealthy when produced by shallow or copied genes.

### Recombination

When two genes conflict in the same skill, selective pressure creates a new hybrid gene.

Recombination is preferred over checklist accumulation when two good patterns create friction.

## Target Architecture

Move the ecosystem from wide markdown tables toward observable local state:

```text
registry JSON          → machine-readable gene definitions
skill-local JSON       → research artifacts and local decisions
markdown docs          → protocol explanation and human-readable meanings
observation scripts    → audit, inspect skill, inspect gene
agent                  → final evolutionary decision-maker
```

Suggested files:

```text
genes.json                    # local machine-readable registry
.cross-evolution.json          # per skill
scripts/audit-cross-evolution.sh
scripts/audit-cross-evolution.mjs
scripts/inspect-skill.sh
scripts/inspect-gene.sh
```

Skill-local JSON should store meaningful research artifacts, not transient score noise:

- Accepted or ignored recommendations with reasons
- Manual gene declarations
- Local constraints and observations
- Last reviewed timestamp
- Known conflicts or intentional absences

## Operating Modes

### Mode 1: Scan & Audit

'Automated': `bash "${SKILL_DIR}/scripts/audit-genes.sh"`

Produces: decomposed gene coverage, per-skill gene profiles, fitness scores, genetic drift warnings, conflict alerts, recommendations, and discovered gene candidates (with registry sync).

Legacy markdown-table audit flags:

- `--no-discovery` — skip discovery phase.
- `--no-sync-discovery` — discover candidates without writing to registry.

JSON-first observation scripts:

```bash
bash "${SKILL_DIR}/scripts/audit-cross-evolution.sh" --root ~/.agents/skills
bash "${SKILL_DIR}/scripts/inspect-skill.sh" brainstorming --root ~/.agents/skills
bash "${SKILL_DIR}/scripts/inspect-gene.sh" atomic-independence --root ~/.agents/skills
```

Useful JSON-first flags:

- `--root <skills-dir>` — skills root
- `--skill <id>` — inspect one skill profile
- `--gene <id>` — inspect one gene coverage profile
- `--json` — machine-readable output
- `--write-state` — refresh `lastObserved` in skill-local `.cross-evolution.json`

### Mode 2: Mutation (Update)

Inject missing/extra genes into a target skill. Prioritize by weight × fitness impact.

'Value guard': Before transferring a gene, ask: "Does this gene solve a real problem
the skill has encountered, or are we just making the fitness number go up?" If the latter —
skip the transfer. Fitness score is a heuristic, not a goal. Optimizing the score
instead of skill quality is the Farmville trap.

### Mode 3: Speciation (Creation)

Create a new gene/skill by combining existing patterns (triggered by gene conflicts or recombination).
