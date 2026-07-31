# `validate-context` Design

## Purpose

`validate-context` supplies structural evidence for the ABCd graph. It checks ownership surfaces, navigation, links, drift signals, and Markdown shape. It cannot prove that documentation claims match implementation; the full audit keeps that manual responsibility explicit.

## Runtime

`scripts/validate-context.mjs` is the single supported implementation. It runs on the supported Node runtime and prints classic human-readable validation logs by default.

## Root Resolution

Resolution order:

1. Explicit `project-root` argument.
2. `VALIDATE_CONTEXT_ROOT`.
3. Current working directory.

A missing or non-directory root fails before validation.

## Checks

1. `Durable file detection — Error`: Finds `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, or `CONTEXT.md`.
2. `Root README connectivity — Warning`: Checks references to the durable file, canonical open work, completed history, and docs index when present.
3. `Core durable structure — Warning`: Accepts numbered mature-project sections or compact skill-style meta/operating sections.
4. `Root state split — Warning`: Detects the canonical plan, completed-history surface, delivery history inside the durable file, and obvious backlog/changelog label drift.
5. `Relative links and anchors — Error`: Validates Markdown links outside fenced code blocks, including heading anchors and GitHub-style line-reference bounds.
6. `README reachability — Warning`: Finds subtree README files with no inbound Markdown link.
7. `Meta-protocol presence — Warning`: Checks the durable file for `Meta-Protocol Principles`.
8. `Bloat signals — Warning`: Reports low information density or sparse structure in the durable file.
9. `LaTeX in docs — Error`: Flags LaTeX commands unsupported by ordinary GitHub Markdown rendering.
10. `Markdown shape — Warning`: Detects definition-list tables and optional over-width table rows.
11. `Freshness — Warning`: Reports durable files older than 30 days.
12. `Docs directory — Warning`: Checks for `/docs`.
13. `Docs index coverage — Warning`: Detects docs missing from `docs/README.md` and indexed files that do not exist.

## Severity Contract

- `Pass`: The structural check found no issue.
- `Info`: Evidence or an intentionally skipped bounded check.
- `Warning`: Potential drift requiring judgment; warnings do not change exit status.
- `Error`: Broken structural invariant or invalid invocation; errors return exit `1`.

Exit `0` never means the context is factually correct. It means automated checks found no errors.

## Link Validation

The validator scans Markdown under the project root while excluding common generated, dependency, cache, and vendor directories. It ignores links inside fenced code blocks.

It handles anchor-only, relative-file, file-plus-anchor, and GitHub line-reference links. Heading anchors use GitHub-style normalization while preserving underscores. Line references must point to existing lines.

Files larger than `ABCD_MARKDOWN_LINK_SCAN_MAX_BYTES`, default `262144`, skip link scanning and emit an info item instead of spending unbounded time on generated or reference dumps.

## Root State Drift

The validator prefers `BACKLOG.md` but accepts `TODO.md`, `PLAN.md`, and `ROADMAP.md` with a warning.

It warns when:

- The durable file contains a `Change History` section while `CHANGELOG.md` exists.
- An unchecked backtick-labelled backlog slice also appears in `CHANGELOG.md`.

These checks identify suspicious duplication; they do not prove semantic completion.

## Bloat Signals

The validator avoids a hard file-length limit. It checks independent signals:

- `Low information density`: Structural elements make up less than 40% of nonblank lines.
- `Sparse structure`: The file averages more than 15 lines per heading.

Signals suggest consolidation; they do not replace judgment.

## Markdown Shape

Shape checks remain heuristic and project-tunable.

- `ABCD_MARKDOWN_SHAPE_CHECKS=0` disables them.
- Width warnings remain disabled by default.
- `--table-width N` or `--table-max-width N` enables width warnings.
- `ABCD_TABLE_WIDTH_WARN_THRESHOLD=N` enables the same threshold from the environment.
- `ABCD_TABLE_HARD_MAX_WIDTH=N` remains a compatibility alias.
- Each contiguous table emits at most one width warning.
- Common two-column definition-table headers trigger a recommendation to use label bullets.

## Human-Readable Output

Validation prints each check and a summary by default. `NO_COLOR=1` disables ANSI color for CI or captured logs. There is no JSON output mode.

## Regression Contract

`scripts/_self-test.mjs` verifies the Node validator against:

1. `fixtures/abcd-project`, through both environment and explicit-root resolution.
2. The `abcd-context` skill root.
3. A missing path, which must fail clearly.
4. The removed `--json` option, which must fail clearly.
5. A temporary fixture with an out-of-range line reference, which must fail clearly.

The fixture remains linked from [its README](../fixtures/abcd-project/README.md).

## Usage

```bash
# Current project
node /path/to/skill/scripts/validate-context.mjs

# Explicit root
node /path/to/skill/scripts/validate-context.mjs /path/to/project

# Optional table width evidence
node /path/to/skill/scripts/validate-context.mjs --table-width 120 /path/to/project

# Skill regression suite
node /path/to/skill/scripts/_self-test.mjs
```

## Related

- [SKILL.md](../SKILL.md) — operating kernel
- [protocols.md](./protocols.md) — reconciliation and consolidation rules
- [templates.md](./templates.md) — starter and restructuring shapes
