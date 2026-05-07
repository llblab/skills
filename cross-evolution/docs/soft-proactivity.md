# Soft Proactivity Standard

Soft proactivity lets cross-evolution notice evolutionary pressure without turning into an autonomous refactoring bulldozer.

Core rule:

> Detect freely, suggest often, mutate narrowly, never farm scores.

## Purpose

Use this standard when a skill, gene, registry, or local research artifact changes.

Soft proactivity should help the agent:

- Notice portable lessons while they are fresh
- Preserve useful observations near the skill ecosystem
- Suggest valuable gene transfer without forcing uniformity
- Keep machine state and human docs aligned
- Avoid score-driven or checklist-driven mutation

## Proactivity Levels

### Level 1: Passive Radar

The agent may run observation tools and report signals.

Allowed actions:

- Run ecosystem audit
- Inspect one changed skill
- Inspect one relevant gene
- Compare obvious before/after signals if available
- Report new detected genes, missing genes, stale docs, or registry mismatch

Not allowed:

- Editing skill instructions
- Declaring genes
- Writing ignored recommendations

### Level 2: Nudge Mode

The agent may propose a specific evolutionary action.

Allowed actions:

- Suggest a candidate gene
- Suggest a gene transfer into one skill
- Suggest an ignored recommendation with a reason
- Suggest retiring or narrowing a shallow gene
- Ask for confirmation when semantic mutation is needed

A nudge must include:

- The observed pressure
- The proposed action
- Why it is portable
- Why it is not score farming

### Level 3: Safe Micro-Mutations

The agent may make narrow, low-risk maintenance edits when intent is clear.

Allowed actions:

- Sync `genes.json` naming with docs
- Add or update human docs for an already accepted gene
- Add local observations to `.cross-evolution.json`
- Fix stale script names, file names, or compatibility wording
- Record an ignored recommendation after explicit user direction

Not allowed without confirmation:

- Rewriting `SKILL.md` semantics
- Adding mandatory workflow steps to unrelated skills
- Promoting a repeated surface feature into an active gene
- Applying a gene across many skills at once

### Level 4: Confirmed Evolution

The agent may mutate skill instructions after confirmation or a direct user request.

Allowed actions:

- Add a gene to `genes.json`
- Update `docs/genes.md`
- Mutate one target skill to adopt a gene
- Add `.cross-evolution.json` declarations or ignored recommendations
- Update backlog/changelog/context files

Required checks:

- The change solves a real observed problem
- The pattern is project-neutral or local-only by design
- The recipient skill remains self-contained
- The change does not exist only to improve fitness

## Submode: Horizontal Gene Transfer

Horizontal Gene Transfer Mode is a bounded soft-proactivity submode for moving one gene-meme from a donor context into one recipient skill.

This submode is itself a gene-meme: it is a transmissible pattern for safe gene transfer.

Use it when the agent notices that a skill, standard, or recent interaction carries a gene-meme that could solve a real problem elsewhere.

Required shape:

```text
Donor → Gene-meme → Recipient → Expected behavior change → Stop condition
```

Allowed actions:

- Identify the donor skill, standard, or local lesson
- Identify exactly one candidate gene-meme
- Identify exactly one recipient skill
- Explain why the recipient has real pressure for the transfer
- Propose a narrow mutation or `.cross-evolution.json` observation
- Stop after one transfer unless the user explicitly asks for broader propagation

Required guardrails:

- Do not transfer only to improve fitness
- Do not copy donor wording blindly
- Re-express the gene in the recipient's own purpose and vocabulary
- Preserve recipient independence and transportability
- Prefer `ignoredRecommendations` when the fit is weak

Stop and ask before:

- Applying the same gene to multiple skills
- Rewriting a recipient's core contract
- Introducing project-specific or sibling-skill references
- Promoting a one-off lesson into a global active gene

## Evolution Journal

When a useful lesson appears but should not immediately mutate a skill, record it as a local observation.

Example:

```json
{
  "kind": "lesson",
  "text": "Context-local files should avoid redundant domain prefixes when directory ownership is clear.",
  "candidateGene": "context-scoped-naming",
  "decision": "adopted"
}
```

Use `decision` values such as:

- `adopted`
- `ignored`
- `watch`
- `needs-review`

Do not store transient dashboard noise.

## Stop Conditions

Stop and ask before continuing when:

- Multiple skills would be semantically rewritten
- A proposed gene is only a file/script/docs presence check
- The mutation would name concrete projects, private repos, or sibling skills
- The user has not confirmed a broad propagation
- The main justification is fitness improvement

## Minimal Workflow

```text
Audit → Notice → Nudge → Micro-mutate if safe → Confirm semantic changes
```

For command-line use:

```bash
scripts/audit-cross-evolution.sh --root ~/.agents/skills
scripts/inspect-skill.sh <skill> --root ~/.agents/skills
scripts/inspect-gene.sh <gene> --root ~/.agents/skills
```
