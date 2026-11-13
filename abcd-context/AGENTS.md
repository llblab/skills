# ABCd Context Maintenance

## Meta-Protocol Principles

- Keep portable context rules independent of project stacks and local overlays. Use [SKILL.md](./SKILL.md) for the operating kernel and [docs/protocols.md](./docs/protocols.md) for resolution/lifecycle detail; do not mirror them here.
- Preserve the self-reference graph: README entrypoints, durable maintenance rules, real open work, completed history, and indexed docs have distinct ownership. The regression suite validates both the fixture and this skill root.

## Operating Principles

- Keep `scripts/validate-context.mjs` the sole supported implementation, using Node path resolution and no platform-specific shell utilities. Audit with it and regress with `scripts/_self-test.mjs`.
- Preserve underscores in GitHub-style heading anchors and validate line-reference bounds.
- Skip link scanning above the configured byte threshold, not surrounding graph validation.
- Fail blank separators inside continuous multiline/nested lists; ignore fences and bounded-scan exclusions.
- Require compact table delimiters with exactly three hyphens and one space inside pipes; rows over 120 characters warn, not fail.
- Accept both numbered mature-project and compact durable sections.
- Emit concise human-readable checks and a summary; `NO_COLOR=1` suppresses color.
