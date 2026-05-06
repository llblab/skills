# Gene Registry

Living registry of all genes in the cross-evolution ecosystem.
Parsed by `scripts/audit-genes.sh` — the markdown tables below are the single source of truth.

## Gene Lifecycle

```
  Proposed → Active → Deprecated → Extinct
                ↑          │
                └──────────┘  (reactivation if needed)
```

- 'active' — gene is detected and scored during audits
- 'deprecated' — gene still detected but flagged for removal; fitness weight = 0
- 'extinct' — gene is ignored completely; kept in registry for historical record

Genes go extinct through 'genetic drift': if no skill carries a gene for 3+ consecutive audits,
the agent should propose deprecation. After one more audit cycle with no adoption, it goes extinct.

## Proposed Genes

Genes discovered automatically by `scripts/audit-genes.sh` during discovery phase.
Promotion rule: a candidate must be present in at least 2 skills and absent from Active/Deprecated/Extinct.

| Gene ID        | Name           | Detect       | Args                   | Recommend   | Weight | Description                              | Proposed Since |
| -------------- | -------------- | ------------ | ---------------------- | ----------- | ------ | ---------------------------------------- | -------------- |
| python-tooling | Python tooling | grep_scripts | #!/usr/bin/env python3 | has_scripts | 1      | Skill provides Python automation scripts | 2026-03-10     |

## Active Genes

Detect types: `file`, `file_any` (comma-separated), `dir`, `grep_scripts` (ERE), `grep_docs` (ERE)

Recommend scopes: `all`, `has_scripts`, `none` (domain-specific)

| Gene ID        | Name               | Detect       | Args                                                         | Recommend   | Weight | Description                                 |
| -------------- | ------------------ | ------------ | ------------------------------------------------------------ | ----------- | ------ | ------------------------------------------- |
| self-docs      | Self-documentation | file         | AGENTS.md                                                    | all         | 2      | Structured self-knowledge for agent context |
| cross-platform | Cross-platform     | grep_scripts | Darwin\|macOS\|uname\|stat -f\|platform.system\|sys.platform | has_scripts | 2      | Scripts work on both Linux and macOS        |
| error-handling | Error handling     | grep_scripts | trap\|set -e\|try:\|except\|raise                            | has_scripts | 1      | Graceful failure and diagnostics in scripts |
| docs-dir       | Documentation      | dir          | docs                                                         | none        | 1      | Dedicated documentation directory           |
| changelog      | Changelog          | file         | CHANGELOG.md                                                 | none        | 1      | Versioned change history                    |
| voice          | Voice integration  | file_any     | scripts/say,scripts/say.sh                                   | none        | 1      | TTS output via voice-mode                   |

## Deprecated Genes

Genes in twilight — still detected but weight = 0. Will go extinct if not reactivated.

| Gene ID        | Name            | Reason                                                     | Deprecated Since |
| -------------- | --------------- | ---------------------------------------------------------- | ---------------- |
| ui-metadata    | UI metadata     | No skills adopted; UI integration unneeded                 | 2026-02-12       |
| lang-memory    | Language memory | No current carriers; voice language persistence not needed | 2026-04-29       |
| auto-bootstrap | Auto-bootstrap  | No current carriers; bootstrap scripts are not standard    | 2026-04-29       |

## Extinct Genes

Historical record. Not detected, not scored.

| Gene ID | Name | Cause of Extinction | Extinct Since |
| ------- | ---- | ------------------- | ------------- |

## Gene Conflicts

When two genes are incompatible in the same skill, they produce 'selective pressure'
for a new hybrid gene (recombination).

| Gene A | Gene B | Conflict | Resolution |
| ------ | ------ | -------- | ---------- |

'Conflict resolution protocol:'

1. Detect both genes present in same skill
2. Check conflict table — if conflict exists:
   - Log warning: "Conflicting genes: {A} × {B} in {skill}"
   - Suggest resolution from table
   - If resolution = `recombine:{new_gene}` → propose new gene creation
3. If no conflict registered → genes coexist peacefully

## Fitness Scoring

Each skill gets a 'fitness score' based on its gene expression:

```
fitness = (Σ weight of present genes) / (Σ weight of applicable genes) × 100
```

- 'Applicable' = genes where recommend ≠ `none`, OR gene is already present
- A gene with recommend = `none` only counts if the skill already has it (reward, not penalty)
- Deprecated genes (weight = 0) don't affect fitness

| Fitness | Rating       | Action                   |
| ------- | ------------ | ------------------------ |
| 80–100% | 🟢 Excellent | Maintain                 |
| 50–79%  | 🟡 Moderate  | Targeted HGT recommended |
| 0–49%   | 🔴 Low       | Audit required           |

## Adding a Gene

Two paths:

1. Automatic: discovery phase inserts candidate into 'Proposed Genes' table when thresholds are met.
2. Manual: add a row directly to 'Active Genes' if immediate activation is needed.

No code changes needed — `audit-genes.sh` parses this file.

## Removing a Gene

1. Move row from 'Active' to 'Deprecated' with reason and date
2. After 1 audit cycle with no adoption → move to 'Extinct'

## Related

- [SKILL.md](../SKILL.md) — cross-evolution protocol
- [AGENTS.md](../AGENTS.md) — operational knowledge
