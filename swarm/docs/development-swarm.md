# Small-Team Development Swarm

Also known as `MAWP`: Multi-Agent Worktree Protocol.

Use this protocol when 2–4 implementation agents work on one project at the same time.
It is intentionally lighter than a full orchestrator runtime.

Core idea: do not block everything in advance. Isolate work surfaces, declare intent before edits, exchange context only after collisions, and merge through one integrator.

## Core Shape

```text
1 project
→ 1 shared backlog
→ 2–4 isolated worktrees or branches
→ each agent owns a small task card
→ conflicts trigger structured context exchange
→ one integrator merges
```

Agents should not mutate the same `main` checkout concurrently. Prefer isolated branches or worktrees:

```bash
git worktree add ../agent-a -b agent/a-task
git worktree add ../agent-b -b agent/b-task
git worktree add ../agent-c -b agent/c-task
```

## When To Use

Use this mode when:

- Work can be split into small file/domain scopes.
- Agents need to write code, docs, tests, or fixtures concurrently.
- A human or integrator-agent can merge patches.
- The project is not high-risk enough to justify a heavy orchestration platform.

Do not use this mode when:

- Tasks require the same public API files.
- The architecture direction is unsettled.
- The expected conflicts are semantic, not just file-level.
- No integrator is available.

## Agent Role Split

Prefer splitting agents by **mutation class**, not by unrelated features.

Stable split:

```text
Agent A: mutate behavior
Agent B: verify behavior
Agent C: describe behavior
Agent D: integrate behavior
```

Practical mappings:

- `2 agents`: implementation; tests/docs/review.
- `3 agents`: implementation; tests; docs plus review.
- `4 agents`: implementation; tests; docs/examples; integrator/refactor/audit.

Recommended roles:

- `Implementation Agent`: writes logic; avoids docs unless needed for the task.
- `Test Agent`: writes tests and may expose bugs; avoids changing production logic.
- `Docs Agent`: updates docs/spec/examples/comments; avoids code.
- `Review/Integrator Agent`: reviews patches, resolves conflicts, runs checks, and merges.

Dangerous split:

```text
Agent A: implement feature X
Agent B: implement feature Y
Agent C: refactor architecture
Agent D: clean up types
```

This creates overlapping semantic ownership. Prefer behavior/test/docs/integration separation so agents do not compete for the same memetic niche.

## Task Card

Every implementation agent gets a task card. The card is the unit of delegation.

```markdown
# Task

Goal:

- What needs to be done.

Allowed files:

- src/lib/foo.ts
- src/routes/game/+page.svelte

Avoid files:

- src/lib/shared/types.ts
- src/lib/stores/\*

Expected output:

- patch
- short summary
- tests/checks run
- touched files list
```

A task card should specify mutation zones, not just intent. The smaller the allowed file set, the less coordination machinery is needed.

Scope expansion is the main conflict generator. Agents must not opportunistically refactor unrelated code or silently edit outside the declared task. If an out-of-scope change is needed, write it as a new backlog item or ask the integrator to replan.

## Soft-Lock Manifest

For 2–4 agents, start with a simple repository-local manifest rather than a lock server.

Suggested path:

```text
.agents/locks.md
```

Example:

```markdown
# Agent Locks

## agent-a

Task: fix scheduler tests
Owns:

- pallets/aaa/src/tests/scheduler/\*
- pallets/aaa/src/mock.rs

## agent-b

Task: update fee model docs
Owns:

- docs/aaa/fees.md
- docs/aaa/spec.md

## agent-c

Task: refactor frontend card component
Owns:

- src/lib/components/Card.svelte
```

Protocol:

1. Read `.agents/locks.md` before starting.
2. Add or update your section before editing.
3. Treat `Owns:` as a soft write claim.
4. Avoid another agent's owned files unless the integrator replans.
5. On completion, remove the section or mark it done.

This manifest is weaker than the Swarm lock script but easier for humans and agents to inspect. Use the script lock protocol when automation, TTL, or conflict enforcement is needed.

## Exclusive Files

Some files create semantic conflicts even when Git merges cleanly. Require exclusive ownership for public contracts and central runtime boundaries.

Examples:

```text
src/lib/types/*
pallets/*/src/lib.rs
runtime/src/*
docs/spec/*
package.json
Cargo.toml
```

Project-local protocol should define its own exclusive files. If a task needs one, assign it to a single agent or the integrator.

## Conflict Types

### Merge Conflict

Git cannot combine two edits to the same file.

Response:

1. Both agents produce conflict reports.
2. Resolver/integrator reads both reports.
3. Resolver merges patch.
4. Original agents review affected files only.

### Semantic Conflict

Files may merge, but meaning diverges. Example: one agent changes an API while another writes code against the old API.

Response:

1. Stop affected workers.
2. Integrator decides whether the backlog task is invalidated.
3. Split or replan before more implementation.

### Architecture Conflict

The task decomposition itself is wrong.

Response:

1. Stop workers on affected scopes.
2. Re-open planning.
3. Produce new task cards with corrected ownership.

## Conflict Handshake Protocol

Agents should not freely negotiate in long context-sharing threads. Exchange semantic deltas in a bounded format.

```markdown
# Conflict Report

Agent:
Task:
Conflicting files:

- ...

What I changed:

- ...

Why I changed it:

- ...

What I need preserved:

- ...

Can safely discard:

- ...

Suggested resolution:

- ...
```

Resolution flow:

```text
Agent A hits conflict with Agent B
→ Agent A writes Conflict Report
→ Agent B writes Conflict Report
→ Integrator/resolver reads both
→ Resolver creates merged patch
→ Original agents review only affected files
```

The goal is to exchange intent and invariants, not to let agents recursively debate.

## Scope Expansion Rule

Multi-agent work is stricter than solo work.

Required instruction for implementation agents:

```text
Do not opportunistically refactor unrelated code.
Do not modify files outside declared scope.
If you discover a needed out-of-scope change, record it as a backlog item or conflict note.
```

This is the difference between useful parallelism and diff chaos.

## Handoff Report

Each agent writes a concise handoff after finishing.

Suggested path:

```text
.agents/handoff/agent-a.md
```

Template:

```markdown
# Handoff: agent-a

Task:
Branch/worktree:

Summary:

- ...

Touched files:

- ...

Tests/checks:

- ...

Behavior changes:

- ...

Risks / follow-up:

- ...

Integrator notes:

- What must be preserved during merge.
```

Example:

```markdown
# Agent A Handoff

Task:
A1: Add tests for scheduler window expiry

Touched files:
- pallets/aaa/src/tests/scheduler/window.rs

Summary:
- Added tests for inclusive window end.
- Added test for close only when current_block > end.

Checks:
- cargo test -p pallet-aaa scheduler_window

Open questions:
- None.

Conflict notes:
- Does not touch runtime logic.
```

## Integrator Protocol

The integrator is the only actor that merges to the shared target branch.

Integrator steps:

1. Read backlog, locks, and handoffs.
2. Merge one branch at a time.
3. Resolve conflicts using conflict reports, not guesses.
4. Run the project's validation gates.
5. Ask original agents to review affected files when conflict resolution changed their work.
6. Produce final summary: merged tasks, tests, touched files, residual risks.

## Effective Protocol

```markdown
# Multi-Agent Protocol

1. Each agent MUST work in a separate branch or worktree.
2. Before editing, each agent MUST declare task, intended files, forbidden files, and expected output.
3. Agents SHOULD avoid files already claimed in `.agents/locks.md`.
4. Public API, storage, runtime, schema, and spec files require exclusive ownership.
5. Each agent MUST produce a handoff note after completion: touched files, semantic changes, checks run, unresolved risks.
6. If a conflict occurs, both agents MUST produce Conflict Reports.
7. Conflict resolution MUST preserve semantic intent, not merely compile.
8. Integrator merges patches into the shared target after checks pass.
9. No agent may silently expand task scope.
```

Context exchange rule:

```text
Before conflict: minimal shared context.
At conflict: compressed intent/diff/risk exchange.
After conflict: update backlog/locks.
```

Constant agent chat destroys independence. Conflict reports preserve the useful context without contaminating every worker.

## Minimal Directory

```text
.agents/
  backlog.md
  locks.md
  protocol.md
  handoff/
    agent-a.md
    agent-b.md
    agent-c.md
```

This directory is optional. Use it when the repository lacks an existing coordination plane. If the project already has backlog, lock, and handoff conventions, reuse them instead.
