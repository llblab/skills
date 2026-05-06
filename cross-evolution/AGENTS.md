# AGENTS.md (cross-evolution)

## Knowledge & Conventions

### Meta-Protocol Principles

- 'Pragmatic HGT (Occam's Razor)': Transfer genes only when they add real value.
- 'Atomic Independence': Scripts must remain atomic. No cross-skill glue code.
- 'Agent as Orchestrator': Coordination between skills is the exclusive responsibility of the AI Agent.
- 'Fitness-Driven': Prioritize gene transfers that maximize fitness scores.

### Operating Principles

- Use `scripts/audit-genes.sh` for Mode 1 (Scan & Audit).
- `audit-genes` now auto-selects the first real skills root among `$SKILLS_HOME`, `~/.agents/skills`, the current working directory, and the local sibling directory.
- Set `NO_COLOR=1` when audit output is consumed by CI or other log processors.
- Gene registry lives in `docs/genes.md` — single source of truth (markdown table, machine-parseable).
- Recommendations are pragmatic: only suggest genes that make sense for the skill's domain.
- Discovery phase must search for repeated patterns and sync valuable candidates into "Proposed Genes".

### Discovered Constraints

- 'Complexity ≠ Value': Gene weights, fitness scores, drift detection, and conflict matrices are powerful — but only if they produce real improvements in skills. If the audit runs and generates recommendations nobody acts on, the system is a Tool Shaped Object. Ask: does this gene transfer actually prevent a bug or improve UX? | Trigger: Audit produces recommendations with no follow-up | Action: Prune genes with zero adoption. Fewer high-impact genes beat many theoretical ones.
- 'Registry Hygiene': Markdown table rows must match their header column count exactly. When moving genes between lifecycle stages (Active → Deprecated → Extinct), copy only the relevant columns for the target table, not the full Active row. | Trigger: Malformed tables in genes.md | Action: Validate table structure after any registry mutation.
- KISS: Not every skill needs every gene.
- Atomic Independence: Logic like `if command -v say` inside a script is a violation.
- Markdown table `|` conflicts with regex `|` — use `\|` in Args column, script converts via `s/\\|/|/g`.
- `awk -F ' \\| '` splits by `|` (with spaces), preserving `\|` inside regex args.
- Leading/trailing `|` in markdown rows must be stripped before field splitting.
- `xargs` eats backslashes — use `sed 's/^ *//;s/ *$//'` for trimming instead.
- `awk '/^## Section/,/^## /'` range includes the start line — use `{f=1;next}` pattern instead.
- `head -5` may miss `set -euo pipefail` if comments precede it — use `head -10`.
- Registry sync must be idempotent — candidate genes cannot be appended twice.
