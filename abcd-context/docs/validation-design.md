# `validate-context` Design

## Purpose

`validate-context` supplies structural evidence for the ABCd graph. It checks ownership surfaces, navigation, links, drift signals, and Markdown shape. It cannot prove that documentation claims match implementation; the full audit keeps that manual responsibility explicit.

## Runtimes

- `scripts/validate-context.sh`: Inspectable Bash implementation for Linux and macOS.
- `scripts/validate-context.mjs`: Node implementation and portable path for environments without Bash.

Given the same root and environment, both runtimes should return the same pass/fail class and warning/error counts. Any unexplained difference in a core check is a parity bug.

## Root Resolution

Resolution order:

1. Explicit `project-root` argument.
2. `VALIDATE_CONTEXT_ROOT`.
3. Current working directory.

A missing or non-directory root fails before validation.

## Checks

1. `Durable file detection — Error`: Finds `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, or `CONTEXT.md`.
2. `Root README connectivity — Warning`: Checks links/references to the durable file, canonical open work, completed history, and docs index when present.
3. `Core durable structure — Warning`: Accepts numbered mature-project sections or compact skill-style meta/operating sections.
4. `Root state split — Warning`: Detects the canonical plan, completed-history surface, delivery history inside the durable file, and obvious backlog/changelog label drift.
5. `Relative links and anchors — Error`: Validates Markdown links outside fenced code blocks.
6. `README reachability — Warning`: Finds subtree README files with no inbound Markdown link.
7. `Meta-protocol presence — Warning`: Checks the durable file for `Meta-Protocol Principles`.
8. `Bloat signals — Mixed`: Reports information density, disproportionate sections, and sparse structure.
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

- Scans Markdown under the project root while excluding common generated, dependency, cache, and vendor directories.
- Ignores links inside fenced code blocks.
- Handles anchor-only, relative file, file-plus-anchor, and GitHub line-reference links.
- Normalizes headings to GitHub-style anchors while preserving underscores.
- Records linked files to evaluate subtree README reachability.
- Skips files larger than `ABCD_MARKDOWN_LINK_SCAN_MAX_BYTES`, default `262144`, and emits an info item instead of spending unbounded time on generated/reference dumps.

## Root State Drift

The validator prefers `BACKLOG.md` but accepts `TODO.md`, `PLAN.md`, and `ROADMAP.md` with a warning.

It warns when:

- The durable file contains a `Change History` section while `CHANGELOG.md` exists.
- An unchecked backtick-labelled backlog slice also appears in `CHANGELOG.md`.

These checks identify suspicious duplication; they do not prove semantic completion.

## Bloat Signals

The validator avoids a hard file-length limit. It counts independent signals:

- `Low information density`: Structural elements make up less than 40% of nonblank lines.
- `Disproportionate section`: A section exceeds twice the average section size and 20 lines.
- `Sparse structure`: The file averages more than 15 lines per heading.

Interpretation:

- Zero signals: No automated bloat concern.
- One or two signals: Consolidation recommended.
- Three or more signals: Validation error; garbage collection needed.

## Markdown Shape

Shape checks remain heuristic and project-tunable.

- `ABCD_MARKDOWN_SHAPE_CHECKS=0` disables them.
- Width warnings remain disabled by default.
- `--table-width N` or `--table-max-width N` enables width warnings.
- `ABCD_TABLE_WIDTH_WARN_THRESHOLD=N` enables the same threshold from the environment.
- `ABCD_TABLE_HARD_MAX_WIDTH=N` remains a compatibility alias.
- Each contiguous table emits at most one width warning.
- Common two-column definition-table headers trigger a recommendation to use label bullets.

## Machine Output

- `--json` returns `passed`, `errors`, `warnings`, and ordered `items`.
- `NO_COLOR=1` removes ANSI output from human-readable logs.
- Summary keys and exit behavior form compatibility surfaces for CI and agent callers.

## Regression Contract

`scripts/_self-test.mjs` runs both runtimes against:

1. `fixtures/abcd-project`, which should produce zero warnings and zero errors.
2. The `abcd-context` skill root, which should validate the protocol's own context graph with zero warnings and zero errors.
3. A missing path, which both runtimes must reject clearly.

The test asserts runtime exit status, key checks, warning/error parity, and self-reference. The fixture remains linked from [its README](../fixtures/abcd-project/README.md).

## Usage

```bash
# Current project
bash /path/to/skill/scripts/validate-context.sh
node /path/to/skill/scripts/validate-context.mjs

# Explicit root
bash /path/to/skill/scripts/validate-context.sh /path/to/project
node /path/to/skill/scripts/validate-context.mjs /path/to/project

# Machine output
bash /path/to/skill/scripts/validate-context.sh --json /path/to/project

# Optional table width evidence
bash /path/to/skill/scripts/validate-context.sh --table-width 120 /path/to/project
```

## Related

- [SKILL.md](../SKILL.md) — operating kernel
- [protocols.md](./protocols.md) — reconciliation and consolidation rules
- [templates.md](./templates.md) — starter and restructuring shapes
