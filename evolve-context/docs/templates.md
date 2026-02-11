# Entry Templates

Default templates for new or empty files managed by the Context Evolution Protocol.
If a file already has an established format, use 'that' format instead.

## Context Template (New Index File)

For creating a new `AGENTS.md` from scratch in a project:

```markdown
# Project Context

## Meta-Protocol Principles

Living protocol for continuous self-improvement and knowledge evolution:

1. Mandatory Enhancement: Every task ends with context updates
2. Protocol Evolution: Rules improve when better workflows emerge
3. Context Optimization: Prevent growth through cleanup protocols
4. Knowledge Consolidation: Preserve insights from rotated entries
5. Single Source Authority: Create navigation, not duplication
6. Wisdom Distillation: Transform experiences into architectural guidance
7. Decreasing Abstraction: Organize general → specific
8. Garbage Collection: Audit and remove obsolete information
9. Evolutionary Design: Build protocols for their own enhancement

## 1. Overall Concept

[One-sentence project purpose and architectural vision]

## 2. Core Entities

- [Entity]: [Description with architectural significance]

## 3. Architectural Decisions

- [Decision]: [Implementation choice]
  - Rationale: [Why this approach]
  - Trade-offs: [What was sacrificed/gained]

## 4. Project Structure

- `/[directory]/`: [Purpose and architectural role]

## 5. Development Conventions

- [Convention]: [Description with reasoning]

## 6. Pre-Task Preparation Protocol

Step 1: Load `/docs/README.md` for documentation architecture
Step 2: Integrate entity-specific documentation for task context
Step 3: Verify alignment with architectural decisions and conventions
Step 4: Document knowledge gaps for future enhancement

## 7. Task Completion Protocol

Step 1: Verify architectural consistency (sections 3-5)
Step 2: Execute quality validation
Step 3: Update `/docs/README.md` guides for affected entities
Step 4: Mandatory Context Evolution

## 8. Change History

- `[Current]` [Task]. Impact: [what changed]. Insight: [lesson learned].
- `[Previous]` [shifts down on new entry]
- `[Legacy-0]` [shifts down]
- `[Legacy-1]` [shifts down]
- `[Legacy-2]` [oldest kept; older rotate to CHANGELOG.md]
```

## Index File Entry Template

For adding insights, conventions, or mistakes to `AGENTS.md` / `CLAUDE.md` / `CODEX.md` / `GEMINI.md` / `CONTEXT.md`:

```markdown
- '[short label]': [description of insight/convention/constraint]
  - Trigger: [what caused this to be discovered]
  - Action: [what to do when this applies]
  - Validation: [how to verify it was applied correctly]
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

For new files in `/docs/'`:

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

For the Change History section in index files:

```markdown
- `[Current]` [Task performed]. Impact: [what changed architecturally]. Insight: [lesson learned].
- `[Previous]` [Previous current entry shifts here]
- `[Legacy-0]` [Previous previous entry shifts here]
- `[Legacy-1]` [And so on]
- `[Legacy-2]` [Oldest kept entry; older ones rotate to CHANGELOG.md]
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
