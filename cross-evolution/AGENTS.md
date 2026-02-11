# AGENTS.md (cross-evolution)

## Knowledge & Conventions

### Meta-Protocol Principles

- 'Pragmatic HGT (Occam's Razor)': Transfer genes only when they add real value.
- 'Atomic Independence': Scripts must remain atomic. No cross-skill glue code.
- 'Agent as Orchestrator': Coordination between skills is the exclusive responsibility of the AI Agent.
- 'Fitness-Driven': Prioritize gene transfers that maximize fitness scores.

### Operating Principles

- Use `scripts/audit-genes` for Mode 1 (Scan & Audit).
- Use `scripts/self-test` (37 assertions) to verify skill integrity after changes.
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

### Change History

- `[Current]` Applied article insights: Complexity≠Value guard, Registry Hygiene constraint. Fixed broken genes.md tables (Deprecated/Extinct/Conflicts had malformed rows). Impact: gene registry now structurally valid; audit-genes won't choke on corrupt rows. Insight: when audit produces recommendations nobody acts on, the system is a Tool Shaped Object.
- `[Previous]` Added self-test (30 assertions). Impact: full validation pipeline for audit-genes and registry integrity.
- `[Legacy-0]` Added cross-platform (uname) + error-handling (trap ERR) to audit-genes. Impact: scripts work reliably on macOS.
- `[Legacy-1]` Full redesign: genes.conf → docs/genes.md with lifecycle, fitness, drift, conflicts. Impact: single source of truth in markdown, machine-parseable.
- `[Legacy-2]` Fixed markdown table parsing: strip leading/trailing pipes before awk split. Impact: eliminated field misalignment in audit output.
