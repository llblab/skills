# AGENTS.md (evolve-context)

## Knowledge & Conventions

### Meta-Protocol Principles

- 'Self-Reference': This skill must validate its own documentation using its own scripts.
- 'Cross-Platform': Scripts must support both Linux and MacOS.
- 'Self-Enhancement': Protocols anticipate and facilitate their own evolution.
- 'Workflow Stratification': Preparation → execution → reflection → documentation.

### Operating Principles

- Use `validate-context` for all documentation audits.
- Use `scripts/self-test` (33 assertions) to verify skill integrity after changes.
- Maintain the three-layer architecture: Root README → Docs Index → Project Docs.
- SKILL.md stays compact (~160 lines); detailed protocols live in `docs/protocols.md`.
- CHANGELOG.md tracks version history; keep in sync with SKILL.md frontmatter version.

### Discovered Constraints

- 'Farmville Trap': If the protocol generates more documentation updates than actually prevented mistakes, it has become a Tool Shaped Object — the feeling of work without real output. Measure value by errors avoided, not files touched. | Trigger: Post-task protocol fires but produces no actionable insight | Action: Skip the update. Silence is a valid output.
- 'Progressive Disclosure over Always-On': ALWAYS_ON mode costs agent attention on every turn even when irrelevant. Prefer POST_TASK as default — load context only when the task warrants it, not preemptively. Inspired by pi's philosophy: <1000 tokens system prompt beats 18k. | Trigger: Agent tracking overhead exceeds insight value | Action: Default to POST_TASK; use ALWAYS_ON only when explicitly requested.
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

- `[Current]` Applied article insights: Farmville Trap guard (skip empty updates), Progressive Disclosure default (POST_TASK over ALWAYS_ON), Tool Shaped Object awareness. Impact: SKILL.md activation modes reordered, POST_TASK becomes default. Insight: protocols that measure activity instead of prevented errors become Farmville.
- `[Previous]` Added self-test (32 assertions). Impact: full validation pipeline for skill integrity.
- `[Legacy-0]` Fixed "Core structure" check: accepts skill-style AGENTS.md sections. Impact: validator no longer false-positives on skill repos.
- `[Legacy-1]` Major refactor: SKILL.md 573→161 lines, protocols extracted to docs/protocols.md. Impact: reduced token cost of skill loading by 70%.
- `[Legacy-2]` Fixed: grep -P, anchor underscores, LaTeX false positives, ERR trap. Impact: cross-platform reliability on macOS.
