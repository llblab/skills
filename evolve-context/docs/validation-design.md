# Validation Design — `validate-context`

## Overview

`validate-context` is the automated documentation health checker for the Context Evolution Protocol.
It validates structural integrity, link health, and content quality of project documentation.

## Checks Performed

| #   | Check                    | Type    | Description                                                                        |
| --- | ------------------------ | ------- | ---------------------------------------------------------------------------------- |
| 1   | Index file detection     | Error   | Scans for `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, or `CONTEXT.md`       |
| 2   | Core structure           | Warning | Verifies numbered section headings (`## 1.`, `## 2.`, etc.)                        |
| 3   | Change History           | Warning | Checks for a Change History section in the index file                              |
| 4   | Link validation          | Error   | Validates all relative links in all `.md` files, skipping code blocks              |
| 5   | Meta-Protocol Principles | Warning | Checks for Meta-Protocol Principles section in index file                          |
| 6   | Bloat analysis           | Mixed   | Heuristic analysis of index file health (density, section sizes, etc.)             |
| 7   | LaTeX detection          | Error   | Flags LaTeX syntax in `/docs/'` (GitHub doesn't render it)                         |
| 8   | Freshness                | Warning | Checks index file modification age (>30 days = stale)                              |
| 9   | Docs directory           | Warning | Verifies `/docs` directory exists                                                  |
| 10  | Docs index coverage      | Warning | Detects orphans (undocumented files) and phantoms (dead links) in `docs/README.md` |
| 11  | README connectivity      | Warning | Verifies README links to `docs/README.md` and references the index file            |

## Bloat Heuristics

Instead of a hardcoded line limit, the script uses four independent signals:

1. 'Low information density' (<40% structural elements) — verbose prose needs consolidation
2. 'Disproportionate sections' (>2× average section size, minimum 20 lines) — specific section needs trimming
3. 'Change History overflow' (>5 entries) — rotation needed
4. 'Sparse structure' (>15 lines per heading) — reorganization needed

Verdict:

- 0 signals → healthy
- 1-2 signals → consolidation recommended (warning)
- 3+ signals → garbage collection mandatory (error)

## Link Validation Details

- Parses markdown link patterns (square brackets + parenthesized URL) from files
- Skips links inside fenced code blocks (``` regions)
- Handles anchor-only links (`#heading`), file links, and file+anchor links
- Supports GitHub-style line references (`#L10`, `#L10-L20`)
- Converts headings to GitHub-style anchors for validation (lowercase, special chars removed, spaces → dashes)
- Reports file path and line number for each broken link
- Scans all `.md` files under project root, excluding common generated/vendor paths
- Uses UTF-8 locale when available (`en_US.UTF-8` or `C.UTF-8`), with safe `C` fallback

Excluded paths (matched by directory name at any nesting depth):

- `node_modules`
- `target`
- `build`
- `dist`
- `vendor`
- `obj`
- `out`
- `bin`
- `bower_components`
- `site-packages`
- `coverage`
- `Pods`
- `.git`
- `.cache`
- `.github`
- `.idea`
- `.next`
- `.pytest_cache`
- `.tox`
- `.venv`
- `.vscode`
- `venv`
- `temp`
- `tmp`
- `docs/_build` (path-specific)

## Usage

```bash
# From project root (human-readable)
bash /path/to/skill/scripts/validate-context

# Machine-readable JSON output
bash /path/to/skill/scripts/validate-context --json

# With custom project root
VALIDATE_CONTEXT_ROOT=/path/to/project bash /path/to/skill/scripts/validate-context
```

## Exit Codes

- `0` — all checks passed (warnings are acceptable)
- `1` — one or more errors detected, manual intervention required

## Related

- [SKILL.md](../SKILL.md) — full protocol specification (Tooling section)
- [templates.md](./templates.md) — entry templates referenced during post-task protocol
