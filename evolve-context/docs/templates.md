# Entry Templates

Default templates for new or empty files managed by the Context Evolution Protocol.
If a file already has an established format, use **that** format instead.

## Context Template (New Index File)

Minimal starter for `AGENTS.md`. Start lean — add sections as constraints are discovered (Axiom A2).

```markdown
# Project Context

## Overall Concept

[One-sentence project purpose and architectural vision]

## Core Entities

- [Entity]: [Description with architectural significance]

## Architectural Decisions

- [Decision]: [Choice]. Rationale: [why]. Trade-offs: [what].

## Project Structure

- `/[directory]/`: [Purpose]

## Conventions

[Added as discovered — not invented upfront]

## Change History

- `[Current]` [Task]. Impact: [what changed]. Insight: [lesson learned].
```

## Index File Entry Template

For adding insights, conventions, or mistakes to `AGENTS.md` (or agent-specific alternative):

```markdown
- '[short label]': [description of insight/convention/constraint]
  - Trigger: [what caused this to be discovered]
  - Action: [what to do when this applies]
```

## Docs Index Template (`docs/README.md`)

```markdown
# Documentation Index

Living index of all documentation in the `/docs` directory.

## Documents

| Document                     | Description                                    |
| ---------------------------- | ---------------------------------------------- |
| [filename.md](./filename.md) | Brief description of what this document covers |
```

## Project Document Template

For new files in `/docs/`:

```markdown
# [Document Title]

## Overview

[1-2 sentence summary of what this document covers and why it exists.]

## [Main Sections]

[Content organized general → specific, matching project conventions.]

## Related

- [Links to related documents within /docs or external references]
```

## Change History Entry Template

```markdown
- `[Current]` [Task performed]. Impact: [what changed]. Insight: [lesson learned].
- `[Previous]` [shifts down on new entry]
- `[Legacy-0]` [shifts down]
- `[Legacy-1]` [shifts down]
- `[Legacy-2]` [oldest kept; older rotate to CHANGELOG.md]
```

Rotation rule: on new entry, Current → Previous → Legacy-0 → Legacy-1 → Legacy-2 → CHANGELOG.md.

## Changelog Template

For `CHANGELOG.md` (versioned rotation target):

```markdown
# Changelog

## [Version]

- [Change entry]
```

## Mistake Log Entry Template

```markdown
- '[mistake label]': [what went wrong]
  - Root cause: [why it happened]
  - Prevention: [rule or check to avoid recurrence]
  - Escalation level: [1-4, per Mistake Prevention Escalation ladder]
```
