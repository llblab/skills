---
name: cross-evolution
description: Horizontal Gene Transfer protocol for skills. Synchronizes best practices and architectural patterns across the skill library.
metadata:
  version: 1.0.17
---

# Cross-Evolution

## Purpose

Maintain a high evolutionary standard across agent skills by identifying deep transportable skill genes, preserving research artifacts, and giving the agent clear observation tools for deciding which evolutionary pressure is real.

A gene is not a superficial feature such as "has a test script" or "has a changelog". In cross-evolution, gene == meme: a true gene is an emergent meme-atom, a portable cognitive/operational pattern that changes how a skill thinks, acts, composes, or degrades. Good genes make skills more unique and valuable through progressive evolution, not more uniform through checklist compliance.

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
- 'Execution/Envelope Separation': When a skill discovers async jobs, process managers, UI status, queues, or cancellation, first ask whether those belong in a local runtime envelope while the skill keeps only portable domain semantics.

### 3. Gene-Meme Equivalence

Within cross-evolution, `gene` and `meme` are the same class of object. A gene is accepted only when it behaves like a transmissible meme: it carries meaning, changes behavior, survives transport, and has a recognizable failure mode when absent.

A standard can be a gene-meme when it is portable and behavior-changing. The `gene == meme` rule is itself a gene-meme: a transmissible standard for deciding what counts as evolutionary material.

Because gene == meme, every gene can be decomposed into smaller meaning-bearing parts, recombined with other genes, or composed into higher-order protocols to seek new emergent properties and new gene-memes.

Do not call a checklist item, file convention, or local implementation detail a gene unless it also qualifies as a portable meme.

### 4. Living Protocol

This skill proactively evolves itself and its gene registry upon discovering new constraints. Its proactivity is soft: detect freely, suggest often, mutate narrowly, and never farm scores. See `docs/soft-proactivity.md`.

## Core Concepts

### Gene

A deep, transportable, emergent meme-atom that improves a skill's cognition, operation, composition, or graceful degradation. In this skill, gene and meme are equivalent terms; the word "gene" names a meme that can be carried by skills.

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

As soft proactivity, HGT is a bounded submode: identify one donor, one gene-meme, one recipient, the expected behavior change, and a stop condition. The HGT submode is itself a gene-meme because it is a transmissible pattern for safe gene transfer.

### Gene Discovery

Scanning existing skills for repeated high-value patterns not yet represented in the registry.
If a candidate passes the depth gate, the agent may add it to `genes.json` and explain it in `docs/genes.md`. Do not auto-promote repeated surface features just because they are easy to detect.

### Genetic Drift

Genes carried by zero skills are candidates for deprecation. After sustained non-adoption, they go extinct.

### Fitness

Quantitative health signal per skill: `earned_weight / applicable_weight × 100%`.
Domain-specific genes (recommend=`none`) only count if already present — reward, not penalty.

Fitness is not an optimization target. A low score can be correct when a skill is intentionally tiny. A high score can be unhealthy when produced by shallow or copied genes.

### Recombination

When two genes conflict in the same skill, selective pressure can create a new hybrid gene.

Recombination also applies without conflict: any gene-meme may be decomposed, recombined, or composed to search for emergent properties. The output can be a narrower sub-gene, a hybrid gene, a higher-order standard, or a new meta-protocol.

Recombination is preferred over checklist accumulation when two good patterns create friction.

## Target Architecture

Move the ecosystem from wide markdown tables toward observable local state:

```text
registry JSON        → machine-readable gene definitions
skill-local JSON     → research artifacts and local decisions
markdown docs        → protocol explanation and human-readable meanings
observation scripts  → audit, inspect skill, inspect gene
agent                → final evolutionary decision-maker
```

Suggested files:

```text
genes.json                         # local machine-readable registry
.cross-evolution.json              # per skill
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

'Automated': `bash "${SKILL_DIR}/scripts/audit-cross-evolution.sh" --root ~/.agents/skills`

Produces: decomposed gene coverage, per-skill gene profiles, and a review queue for agent judgment.

JSON-first observation scripts:

```bash
bash "${SKILL_DIR}/scripts/audit-cross-evolution.sh" --root ~/.agents/skills
bash "${SKILL_DIR}/scripts/inspect-skill.sh" brain-storm --root ~/.agents/skills
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

'Value guard': Before transferring a gene, ask: "Does this gene solve a real problem the skill has encountered, or are we just making the fitness number go up?" If the latter — skip the transfer. Fitness score is a heuristic, not a goal. Optimizing the score instead of skill quality is the Farmville trap.

### Mode 3: Speciation (Creation)

Create a new gene/skill by combining existing patterns (triggered by gene conflicts or recombination).
