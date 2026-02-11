# AGENTS.md (evolve-context)

## Knowledge & Conventions

### Meta-Protocol Principles

- 'Self-Reference': This skill must validate its own documentation using its own scripts.
- 'Cross-Platform': Scripts must support both Linux and MacOS.
- 'Self-Enhancement': Protocols anticipate and facilitate their own evolution.
- 'Workflow Stratification': Preparation → execution → reflection → documentation.

### Operating Principles

- Use `validate-context` for all documentation audits.
- Use `scripts/_self-test` to verify skill integrity after changes.
- Maintain the three-layer architecture: Root README → Docs Index → Project Docs.
- SKILL.md stays compact; protocols.md contains only what SKILL.md does not (adaptation rules, lifecycle, validation checklist). No duplication between them.
- Full post-task steps are inline in SKILL.md, not behind a link to protocols.md.
- CHANGELOG.md tracks version history; keep in sync with SKILL.md frontmatter version.

### Discovered Constraints

- 'Farmville Trap': If the protocol generates more documentation updates than actually prevented mistakes, it has become a Tool Shaped Object. Measure value by errors avoided, not files touched. | Trigger: Post-task protocol fires but produces no actionable insight | Action: Skip the update. Silence is a valid output.
- 'Progressive Disclosure over Always-On': ALWAYS_ON mode costs agent attention on every turn even when irrelevant. Prefer POST_TASK as default. | Trigger: Agent tracking overhead exceeds insight value | Action: Default to POST_TASK; use ALWAYS_ON only when explicitly requested.
- 'A2 applies to templates': Context templates must start minimal — imposing principles and ceremony on a new project violates Axiom A2 (earned complexity). Template is a skeleton that grows with the project, not a manifesto.
- 'Self-contradiction kills trust': Absolute rules must survive contact with every other rule in the system. "Mandatory" + "skip if empty" is a contradiction — use conditional language.
- 'LLM YAML tracking is fictional': LLMs reason in natural language, not structured YAML. Tracking schemas in prompts create illusion of process. Post-task evaluation does the actual work.
- 'Ceremonial formalization': If pseudocode describes what an experienced developer would do by default (read a file, check state), the formalization adds no value. Formalize only non-obvious protocols.
- `stat` command differs between Linux (`-c %Y`) and MacOS (`-f %m`).
- `grep -P` (Perl regex) is unavailable on macOS BSD grep — use `grep -oE` + `sed` instead.
- `heading_to_anchor` must preserve underscores `_` to match GitHub's anchor generation.
- `[[ cond ]] && action` in a function with `set -e` exits on false — use `if/fi` or `|| true`.
- `\$[^$]+\$` regex false-positives on shell variables — check for LaTeX commands specifically.
- "Core structure" check now accepts both `## 1.` (project) and key sections (skill AGENTS.md).
- Change History date regex `^\s*-\s*\`\[YYYY-MM-DD\]`must not match`[[]]` bash syntax.
- `awk '/^## X/,/^## /'` range includes start line — use `{f=1;next}` to exclude it.
- Scripts use no file extension — shebangs (`#!/usr/bin/env bash`) define the interpreter.
- `realpath --relative-to` is GNU-specific — prefer path-prefix stripping for docs-relative paths.
- UTF-8 locales differ by platform (`en_US.UTF-8`, `C.UTF-8`, `C.utf8`) — include safe `C` fallback.

### Change History

- `[Current]` Structural cleanup: protocols.md 261→90 lines (removed ceremony, duplication), templates.md minimal Context Template (A2-aligned), full post-task inline in SKILL.md, version bump to 1.0.0. Impact: −50% token cost for supplementary docs; template no longer contradicts axioms. Insight: supplementary docs must contain only delta beyond the primary doc; templates must follow the same axioms as the protocol.
- `[Previous]` Applied article insights: Farmville Trap guard (skip empty updates), Progressive Disclosure default (POST_TASK over ALWAYS_ON), Tool Shaped Object awareness. Impact: SKILL.md activation modes reordered, POST_TASK becomes default. Insight: protocols that measure activity instead of prevented errors become Farmville.
- `[Legacy-0]` Added self-test (32 assertions). Impact: full validation pipeline for skill integrity.
- `[Legacy-1]` Fixed "Core structure" check: accepts skill-style AGENTS.md sections. Impact: validator no longer false-positives on skill repos.
- `[Legacy-2]` Major refactor: SKILL.md 573→161 lines, protocols extracted to docs/protocols.md. Impact: reduced token cost of skill loading by 70%.
