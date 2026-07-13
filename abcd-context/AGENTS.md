# ABCd Context Project Context

## Meta-Protocol Principles

- `Self-Reference`: This skill validates its own context graph with its own runtimes and regression fixture.
- `Root State Separation`: Durable protocol, open work, completed delivery, README entrypoints, and subsystem docs keep distinct ownership.
- `Constraint-Driven Evolution`: Structure grows from observed coordination pressure, not template ceremony.
- `Project Neutrality`: Portable rules remain independent of repository stacks and local overlays.
- `Dual-Runtime Parity`: Bash and Node validators should produce the same pass/fail class and warning/error counts.
- `Cross-Platform`: Validator behavior supports Linux and macOS; Node provides the portable runtime path for other environments.

## Operating Principles

- Keep `SKILL.md` as the operating kernel; place resolution, lifecycle, and consolidation detail in `docs/protocols.md`.
- Keep `BACKLOG.md` limited to real open, gated, or blocked work and `CHANGELOG.md` limited to completed outcomes.
- Keep root `README.md` connected to `AGENTS.md`, `BACKLOG.md`, `CHANGELOG.md`, and `docs/README.md` when those surfaces exist.
- Keep subtree README entrypoints reachable once they become real human starting points.
- Use `scripts/validate-context.sh` or `scripts/validate-context.mjs` for audits and `scripts/_self-test.mjs` for runtime parity/regression.
- Treat warnings as evidence requiring judgment, not as automatic failure or automatic approval.

## Protocol Constraints

- `Farmville Guard`: Skip context mutation when it would not preserve truth, prevent drift, record meaningful delivery, or repair discoverability.
- `Activation Symmetry`: Default post-task activation performs post-task reconciliation; it must not imply retroactive pre-task ceremony.
- `Template Proportionality`: Lean projects receive lean structure; mature hierarchy requires real complexity.
- `State Ownership`: The same reality must not remain simultaneously durable, open, and completed.
- `README Continuity`: Setup, usage, topology, ownership, and same-domain entrypoint knowledge belong in the nearest relevant README.
- `Impact-Oriented History`: Delivery history records outcomes and impact rather than iteration bookkeeping.
- `Natural-Language Operation`: Do not introduce fictional YAML tracking or formalize obvious senior-engineer behavior without a non-obvious contract.
- `Local Overlay Boundary`: Project-specific release, architecture, security, and stack gates remain in local overlays.

## Validator Constraints

- `Portable File Metadata`: Use Linux/macOS-compatible `stat` fallbacks.
- `Portable Grep`: Avoid `grep -P`; use portable extended regex and text processing.
- `Anchor Parity`: Preserve underscores while normalizing GitHub-style heading anchors.
- `Safe Shell Conditions`: Under `set -e`, use `if`/`fi` or `|| true` where a false condition is expected.
- `LaTeX Precision`: Detect LaTeX commands rather than broad dollar-delimited patterns that catch shell variables.
- `Path Portability`: Avoid GNU-only `realpath --relative-to`; strip known root prefixes where safe.
- `Locale Portability`: Prefer available UTF-8 locales with a safe `C` fallback.
- `Machine Output`: Honor `NO_COLOR`; preserve stable JSON and summary fields.
- `Bounded Scanning`: Skip link scanning above the configured byte threshold while validating the surrounding graph.
- `Opt-In Width`: Warn about Markdown table width only when the caller supplies a threshold.
- `Core Shape Flexibility`: Accept both numbered mature-project sections and compact skill-style durable sections.
