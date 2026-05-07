# AGENTS.md (cross-evolution)

## Knowledge & Conventions

### Meta-Protocol Principles

- 'Pragmatic HGT (Occam's Razor)': Transfer genes only when they add real value.
- 'Gene == Meme': In cross-evolution, a gene is a transmissible meme. It must carry meaning, change behavior, survive transport, and have a recognizable absent failure mode. This equivalence is itself a gene-meme: a transmissible standard for deciding what counts as evolutionary material.
- 'Memetic Recombination': Any gene-meme can be decomposed, recombined, and composed to seek emergent properties and new gene-memes; prefer this over blind copying when patterns interact.
- 'Horizontal Gene Transfer Mode': In soft proactivity, transfer at most one gene-meme from one donor to one recipient before stopping, unless the user explicitly asks for broader propagation. This mode is itself a gene-meme.
- 'Deep Gene Standard': Genes are transportable emergent meme-atoms that change skill cognition, operation, composition, or graceful degradation. Shallow file-presence features are observations, not true genes.
- 'Atomic Independence': Skills and scripts must remain atomic. No cross-skill glue code, hard-coded sibling skill names, concrete project names, private repository names, or stack-specific mirrors inside reusable skill text.
- 'Agent as Orchestrator': Coordination between skills is the exclusive responsibility of the AI Agent.
- 'Generic Synergy': Skills should complement each other through project-neutral contracts, lenses, vocabulary, and handoff shapes rather than naming each other directly.
- 'Fitness as Signal': Prioritize real evolutionary pressure; fitness scores are observation hints, not optimization targets.
- 'Soft Proactivity': Detect freely, suggest often, mutate narrowly, never farm scores. Use `docs/soft-proactivity.md` for proactive boundaries.
- 'Portable Standards': Promote repeated practices into transportable standards when they can serve multiple projects or skills; skills count as projects when they own protocols, docs, artifacts, or release discipline.
- 'Meta-Protocoling': Preserve the process behind the process through explicit meta-comments and meta-protocols when a rule needs intent, scope, evolution, or degradation guidance.
- 'Skill Root Cleanliness': The skills root must not contain Markdown control files such as `AGENTS.md`, `BACKLOG.md`, `CHANGELOG.md`, or `README.md`; pi treats root Markdown files as candidate skills and reports `description is required` conflicts.

### Operating Principles

- Prefer JSON-first observation scripts for Mode 1: `scripts/audit-cross-evolution.sh`, `scripts/inspect-skill.sh`, and `scripts/inspect-gene.sh`.
- Keep `scripts/audit-genes.sh` only as a compatibility wrapper around the JSON-first observer.
- Set `NO_COLOR=1` when audit output is consumed by CI or other log processors.
- The gene registry lives in local `genes.json`; `docs/genes.md` explains meanings and protocol for humans.
- Recommendations are pragmatic: only suggest genes that make sense for the skill's domain.
- Gene discovery is agent-led: repeated patterns become candidates only after the depth gate, then enter `genes.json` with human-readable explanation in `docs/genes.md`.

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
