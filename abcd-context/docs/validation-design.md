# Validation Design — `validate-context`

## Overview

`validate-context` is the automated documentation health checker for the ABCd Context protocol.
It validates root-memory integrity, README entrypoint reachability, link health, and documentation quality.

## Checks Performed

1. `Index file detection`: Error. Scans for `AGENTS.md`, `CLAUDE.md`,
   `CODEX.md`, `GEMINI.md`, or `CONTEXT.md`.
2. `README connectivity`: Warning. Verifies root `README.md` links to the
   control plane and `docs/README.md`.
3. `Core structure`: Warning. Verifies numbered project sections or skill-style
   key sections in `AGENTS.md`.
4. `Root state split`: Warning. Detects canonical open-work file,
   `CHANGELOG.md`, duplicate delivery history in `AGENTS.md`, and open backlog
   slice labels that also appear in `CHANGELOG.md`.
5. `Link validation`: Error. Validates relative links in `.md` files, skipping
   code blocks.
6. `README reachability`: Warning. Detects subtree `README.md` files with no
   inbound markdown links.
7. `Meta-Protocol`: Warning. Checks for Meta-Protocol Principles in the durable
   protocol file.
8. `Bloat analysis`: Mixed. Heuristic analysis of index-file health.
9. `LaTeX detection`: Error. Flags LaTeX syntax in `/docs` because GitHub does
   not render it.
10. `Freshness`: Warning. Checks durable protocol file modification age.
    More than 30 days is stale.
11. `Docs directory`: Warning. Verifies `/docs` directory exists.
12. `Docs index coverage`: Warning. Detects orphans and phantoms in
    `docs/README.md`.
13. `Markdown shape`: Warning. Detects wide Markdown table source rows and
    definition-list style tables that should usually be label/bullet definitions.

## Bloat Heuristics

Instead of a hardcoded line limit, the script uses independent signals:

1. 'Low information density' (<40% structural elements) — verbose prose needs consolidation
2. 'Disproportionate sections' (>2× average section size, minimum 20 lines) — specific section needs trimming
3. 'Sparse structure' (>15 lines per heading) — reorganization needed

Verdict:

- 0 signals → healthy
- 1–2 signals → consolidation recommended (warning)
- 3+ signals → garbage collection mandatory (error)

## Root State Split Details

The validator prefers the organic ABC standard but stays compatible with inherited aliases.

- `BACKLOG.md` passes as the preferred canonical open-work file
- `TODO.md`, `PLAN.md`, and `ROADMAP.md` are accepted as fallback aliases with a warning
- `CHANGELOG.md` is expected for completed delivery history
- If `AGENTS.md` still contains a `Change History` section while `CHANGELOG.md`
  exists, the validator warns about state duplication
- If an unchecked backlog slice label also appears in `CHANGELOG.md`, the
  validator warns about possible open/completed state drift

## README Reachability Details

The validator treats subtree `README.md` files as human entrypoints, not decorative files.

- Root `README.md` is exempt from inbound-link checks
- A subtree `README.md` should be linked from at least one other markdown file
- Zero inbound markdown links usually means the entrypoint is isolated and likely stale or undiscoverable

## Markdown Shape Details

Markdown shape checks are style warnings, not hard failures by default.

- `ABCD_MARKDOWN_SHAPE_CHECKS=0` disables the check for project-local overlays.
- `ABCD_TABLE_TARGET_WIDTH` sets the soft target, default `116`.
- `ABCD_TABLE_HARD_MAX_WIDTH` sets the warning threshold, default `120`.
- Wide tables are detected as contiguous Markdown table blocks outside fenced code blocks; each table emits at most one width warning with line range, max width, and affected-row count.
- Definition-list tables are detected by common two-column headers such as
  `Term/Meaning`, `Field/Description`, and `Parameter/Purpose`.

## Link Validation Details

- Parses markdown link patterns from files
- Skips links inside fenced code blocks
- Handles anchor-only links, file links, and file+anchor links
- Supports GitHub-style line references (`#L10`, `#L10-L20`)
- Converts headings to GitHub-style anchors for validation
- Reports file path and line number for each broken link
- Scans all `.md` files under project root, excluding common generated/vendor paths
- Uses UTF-8 locale when available, with safe `C` fallback

## Dual Runtime

`validate-context.sh` is the Bash implementation.
`validate-context.mjs` is the Node.js twin for cross-platform environments,
especially Windows systems where Node is more likely than Bash.

The two scripts are intended to be interchangeable for core validation. Given
the same root and environment settings, both should return the same pass/fail
class and warning/error counts. Bash remains simple and inspectable; Node
provides a portable modular path for future checks that need richer JSON,
networking, or WebSocket support.

`Parity bug`: If one runtime reports a core validation problem and the other does
not, treat it as an implementation bug unless the check is explicitly documented
as runtime-specific.

## Regression Test

`tests`: `scripts/_self-test.mjs` runs both runtimes against
[`fixtures/abcd-project`](../fixtures/abcd-project/README.md), a small ABCd-style
project with root context files, reachable docs, backlog, changelog, and compact
Markdown shape.

## Usage

```bash
# From project root (human-readable)
bash /path/to/skill/scripts/validate-context.sh

# Explicit project root
bash /path/to/skill/scripts/validate-context.sh /path/to/project

# Machine-readable JSON output
bash /path/to/skill/scripts/validate-context.sh --json /path/to/project

# Environment-root compatibility
VALIDATE_CONTEXT_ROOT=/path/to/project bash /path/to/skill/scripts/validate-context.sh
```

Root resolution order: explicit `project-root` argument, then `VALIDATE_CONTEXT_ROOT`, then current working directory. Missing or non-directory roots fail clearly before validation starts.

## Exit Codes

- `0` — all checks passed (warnings are acceptable)
- `1` — one or more errors detected, manual intervention required

## Related

- [SKILL.md](../SKILL.md) — full protocol specification
- [templates.md](./templates.md) — entry templates referenced during post-task protocol
