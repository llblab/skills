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

## Context Lifecycle Management

### Growth Control Pipeline

```
Discovery → Active Entry → Consolidation → Strategic Pattern → Archive
```

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

## Related

- [SKILL.md](../SKILL.md) — compact skill definition
- [templates.md](./templates.md) — entry templates
- [validation-design.md](./validation-design.md) — validator design
