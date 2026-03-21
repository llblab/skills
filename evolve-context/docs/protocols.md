# Protocols Reference

Supplementary protocols for the Context Evolution Protocol.
For the compact version, see [SKILL.md](../SKILL.md).

## Adaptation Rules

When writing to any managed file:

- **Respect what exists.** Read current format before writing.
- **Match tone and structure.** Bullets → bullets. Tables → tables.
- **Extend, don't reformat.** Add entries in the style already established.
- **If file is empty or new:** use templates from [`templates.md`](./templates.md).

## Index File Resolution

Default: `AGENTS.md`. The validator also recognizes `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `CONTEXT.md` as alternatives for agent-specific projects.

Detection: scan project root for the first match. If none found, create `AGENTS.md`.

## Canonical Plan File Resolution

Use exactly one canonical open-work file: `TODO.md`, `PLAN.md`, or `ROADMAP.md`.

Rules:

- If exactly one exists, use it
- If multiple exist, use the one actively maintained for open work
- Do not duplicate backlog state across multiple plan files
- If no plan file exists, do not invent one unless project conventions permit it

This file is the source of truth for what remains open. Code, docs, and changelog updates do not implicitly close plan items.

## Context Lifecycle Management

### Growth Control Pipeline

```
Discovery → Active Entry → Consolidation → Strategic Pattern → Archive
```

## Backlog Coherence Protocol

When post-task review reveals that implementation reality and the canonical plan disagree, repair the plan in the same pass.

### Allowed backlog transitions

| Transition        | Use when                                                                  |
| ----------------- | ------------------------------------------------------------------------- |
| `Close`           | The item's exit criteria are satisfied in reality                         |
| `Narrow`          | Part landed; the item should now describe only the remaining work         |
| `Split`           | One vague item turned into multiple concrete executable slices            |
| `Retarget`        | The original wording no longer matches the actual remaining work          |
| `Defer`           | The item remains valid but is no longer the best next slice               |
| `Move to gated`   | The remaining work now depends on an external condition or approval       |
| `Move to blocked` | The work is still desired but currently blocked by another unresolved gap |

### Rules

- Epics may remain in the plan, but active execution should be represented by at least one concrete next slice
- If a completed slice was not explicitly listed before work began, add or retarget the relevant item before finishing the pass
- If a docs/architecture update changes the true exit criteria of an item, update the item — do not leave stale wording
- Evergreen maintenance disciplines belong in durable instructions or docs, not as perpetually open checkboxes
- Prefer refining existing items over creating near-duplicates

### Garbage Collection

Triggered by heuristic signals from `validate-context`, not hardcoded limits.
3+ bloat signals → mandatory GC. 1–2 signals → consolidation at agent discretion.

### Consolidation Triggers

| Signal                                   | Action                                              |
| ---------------------------------------- | --------------------------------------------------- |
| 3+ entries describe same pattern         | Extract strategic pattern, archive tactical entries |
| Entry unreferenced in 10+ tasks          | Archive or remove                                   |
| Two sections overlap >50%                | Merge, redirect references                          |
| Section exceeds 10 entries               | Split by abstraction or consolidate                 |
| Mistake repeated despite insight         | Escalate (see ladder below)                         |
| `/docs` entry contradicts implementation | Flag for update or rewrite                          |
| Two `/docs` files cover same topic       | Merge, update index                                 |
| `/docs` file not in README.md            | Add to index immediately                            |
| README.md link points to missing file    | Create file or remove dead link                     |

### Mistake Prevention Escalation

```
Level 1: Insight logged in index file
  ↓ repeated
Level 2: Convention with emphasis
  ↓ repeated
Level 3: Hard rule with validation step
  ↓ repeated
Level 4: Structural change (tooling, automation)
```

### Documentation Consolidation Protocol

When duplicate documentation is detected:

1. Identify overlapping documents
2. Determine the better home (more specific name, more established, better location)
3. Merge content: preserve unique info, resolve contradictions (newer = truth)
4. Delete or deprecate the weaker document
5. Update `/docs/README.md` and cross-references

### Change History Rotation

When Change History exceeds 5 entries:
Oldest entry rotates to `CHANGELOG.md`. Shift labels: Current → Previous → Legacy-0 → Legacy-1 → Legacy-2.

## Validation Checklist (ON_REQUEST mode)

Run `validate-context` first — it automates link, structural, and bloat checks.
Manual-only items the script cannot verify:

- [ ] No information duplicated across layers
- [ ] Entries match existing file style
- [ ] General → specific structure maintained
- [ ] No stale entries (unreferenced for 10+ tasks)
- [ ] No repeated mistakes without escalation
- [ ] Canonical plan file reflects reality for touched work
- [ ] No completed slice still appears open with stale pre-iteration wording
- [ ] Open epics still expose a concrete next slice where active execution is expected

## Related

- [SKILL.md](../SKILL.md) — compact skill definition
- [templates.md](./templates.md) — entry templates
- [validation-design.md](./validation-design.md) — validator design
