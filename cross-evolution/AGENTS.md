# AGENTS.md (cross-evolution)

## Knowledge & Conventions

### Meta-Protocol Principles

- 'Pragmatic HGT (Occam's Razor)': Transfer genes only when they add real value.
- 'Deep Gene Standard': Genes are transportable emergent meme-atoms that change skill cognition, operation, composition, or graceful degradation. Shallow file-presence features are observations, not true genes.
- 'Atomic Independence': Skills and scripts must remain atomic. No cross-skill glue code, hard-coded sibling skill names, concrete project names, private repository names, or stack-specific mirrors inside reusable skill text.
- 'Agent as Orchestrator': Coordination between skills is the exclusive responsibility of the AI Agent.
- 'Generic Synergy': Skills should complement each other through project-neutral contracts, lenses, vocabulary, and handoff shapes rather than naming each other directly.
- 'Fitness as Signal': Prioritize real evolutionary pressure; fitness scores are observation hints, not optimization targets.

### Operating Principles

- Prefer JSON-first observation scripts for Mode 1: `scripts/audit-cross-evolution.sh`, `scripts/inspect-skill.sh`, and `scripts/inspect-gene.sh`.
- Keep `scripts/audit-genes.sh` as a legacy transitional markdown-table audit until the old registry is retired.
- `audit-genes` now auto-selects the first real skills root among `$SKILLS_HOME`, `~/.agents/skills`, the current working directory, and the local sibling directory.
- Set `NO_COLOR=1` when audit output is consumed by CI or other log processors.
- Current gene registry still lives in `docs/genes.md`, but the target architecture is JSON-first: machine-readable registry, skill-local research artifacts, markdown explanation, and observation scripts.
- Recommendations are pragmatic: only suggest genes that make sense for the skill's domain.
- Discovery phase must search for repeated patterns and sync valuable candidates into "Proposed Genes".

### Discovered Constraints

- 'Complexity ≠ Value': Gene weights, fitness scores, drift detection, and conflict checks are powerful — but only if they produce real improvements in skills. If the audit runs and generates recommendations nobody acts on, the system is a Tool Shaped Object. Ask: does this gene transfer actually prevent a bug or improve UX? | Trigger: Audit produces recommendations with no follow-up | Action: Prune genes with zero adoption. Fewer high-impact genes beat many theoretical ones.
- 'Registry Hygiene': Markdown table rows must match their header column count exactly. When moving genes between lifecycle stages (Active → Deprecated → Extinct), copy only the relevant columns for the target table, not the full Active row. | Trigger: Malformed tables in genes.md | Action: Validate table structure after any registry mutation.
- KISS: Not every skill needs every gene.
- Atomic Independence: Logic like `if command -v say` inside a script is a violation.
- Markdown table `|` conflicts with regex `|` — use `\|` in Args column, script converts via `s/\\|/|/g`.
- `awk -F ' \\| '` splits by `|` (with spaces), preserving `\|` inside regex args.
- Leading/trailing `|` in markdown rows must be stripped before field splitting.
- `xargs` eats backslashes — use `sed 's/^ *//;s/ *$//'` for trimming instead.
- `awk '/^## Section/,/^## /'` range includes the start line — use `{f=1;next}` pattern instead.
- `head -5` may miss `set -euo pipefail` if comments precede it — use `head -10`.
- Audit output should stay narrow and decomposed: prefer gene coverage plus per-skill profiles over wide Gene × Skill matrices that create unreadable long rows.
- Registry sync must be idempotent — candidate genes cannot be appended twice.
- Next architecture should preserve research artifacts in skill-local JSON instead of forcing every observation into a wide central markdown table.
- Reusable-skill adaptation means притирка, not mirroring: lift local project/stack lessons into generic portability, modularity, ownership, context, review, or execution lenses; keep concrete project facts in external context.
- Naming discipline: avoid redundant domain prefixes in local filenames when directory context already makes ownership obvious. Prefer `genes.json` inside the cross-evolution skill over `cross-evolution.genes.json`.
- Genes should make skills more unique and valuable through evolution, not more uniform through checklist compliance.
