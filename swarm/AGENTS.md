# AGENTS.md (swarm)

## Meta-Protocol Principles

- `Atomic Skill Boundary`: Swarm owns portable subagent coordination semantics, not local tool registries or runtime plumbing.
- `Adapter Separation`: Local adapters bind Swarm contracts to command templates, async-run lifecycles, model aliases, and tool registries.
- `Context Hygiene`: Keep durable protocol in `AGENTS.md`, open work in `BACKLOG.md`, completed delivery in `CHANGELOG.md`, and human navigation in `README.md` plus `/docs`.

## Concept

Swarm is a portable skill for safe subagent orchestration: delegated review, quorum consensus, scoped locks, clean-context merge, and post-merge review. Its core cognitive pattern is one focused subagent per lens, many independent lenses for stronger judgement, and parallel lenses for faster wall-clock execution.

## Topology

- `SKILL.md`: Portable operating protocol and abstract tool contracts.
- `AGENTS.md`: Durable local conventions and context rules.
- `BACKLOG.md`: Open work with concrete exit criteria.
- `CHANGELOG.md`: Completed delivery history.
- `docs/`: Adapter notes and local binding examples.
- `scripts/`: Atomic reference utilities and self-test only; no broad runtime coordinator and no `pi -p`-coupled quorum runner.

## Knowledge & Conventions

### Tooling Discipline

- Prefer reusable local command-template tools for swarm operations.
- Keep concrete tool registries outside this portable skill.
- Use ad-hoc shell only to prototype a template or recover from missing tooling.
- Pass files by local path in the prompt. Do not require attachment support from wrappers.
- Keep the skill independent: describe required capabilities, not concrete sibling skill names.
- `Script boundary`: Scripts in this skill must stay atomic and narrowly specialized: lock helper, self-test helper, prompt/file utility. Broad coordination, real quorum execution, async run lifecycle, model pools, and adapter policy belong in local tool config or a generic tool-runtime layer.
- `Async-run-first rule`: Any non-trivial asynchronous agentic work should prefer a local async-run adapter over blocking foreground orchestration. Start the run, return run metadata, observe status/tail/list/cancel, and react to terminal events.
- `Async run boundary`: When async swarm work is needed, prefer a local async-run adapter around an existing command-template composer or quorum utility. The async run owns lifecycle/state/logs/ambient progress; the command template owns execution shape and parallel fanout; Swarm owns quorum/lock/merge semantics.
- `Lens discipline`: Assign each subagent one narrow cognitive lens. Prefer a small set of high-value lenses over an overloaded universal prompt. The merger owns synthesis; reviewers own focused evidence.
- `Shape discipline`: Distinguish Lens Swarm from Quorum. Lens Swarm varies lenses for breadth; Quorum holds one lens constant across independent models/instances for confidence. Use Lens Swarm of Quorums only for high-stakes breadth plus confidence.
- `Work-mode discipline`: Swarm can support brainstorm, development, and review. Brainstorm swarms synthesize directions, development swarms coordinate scoped slices, and review swarms produce verdicts.
- `Small-team development swarm`: For 2–4 implementation agents, prefer MAWP — isolated worktrees/branches plus task cards and a soft-lock manifest over a broad orchestrator. One integrator owns merges.
- `Task-card discipline`: Implementation agents need mutation zones, not only goals. Every task card should name allowed files, avoided files, expected output, checks, and touched-files reporting.
- `Conflict handshake`: Agents do not negotiate freely after conflicts. Each writes a bounded conflict report; a resolver/integrator merges; original agents review affected files only.
- `Semantic conflict awareness`: Git conflicts are not the only risk. Public API, schema, package manifest, runtime root, and protocol/spec files require exclusive ownership or integrator control.
- `Mutation-class split`: Prefer implementation/test/docs/integration role separation over assigning unrelated feature work to parallel agents.
- `No silent scope expansion`: In multi-agent mode, opportunistic refactors outside the task card are conflict generators. Record out-of-scope needs as backlog/conflict notes instead.
- `Coordinator checkpoint goal`: When a subagent is blocked on a coordinator-only decision, the target pattern is pause → bounded checkpoint question → coordinator reply → same-context resume. If the local adapter cannot preserve context, write a checkpoint artifact and mark the run degraded rather than pretending continuity was preserved.

### Lock Discipline

- Always release scopes after subagent work completes. A stale lock degrades concurrency but never corrupts data.
- Prefer `read` locks when the subagent only inspects files. Reserve `write` for mutation.
- TTL must be generous enough for the subagent task but short enough to avoid deadlock: file review → 120s, code fix → 300s, quorum → 300s.

### Model Selection for Quorum

- `Default pool`: gpt-5.5 + gpt-5.4 + deepseek-v4-flash + deepseek-v4-pro + kimi-k2.6 + mistral-medium + grok-4.3.
- `Architecture review`: gpt-5.5 + gpt-5.4 + deepseek-v4-pro + kimi-k2.6.
- `Code review`: gpt-5.5 + gpt-5.4 + deepseek-v4-flash.
- `Security audit`: gpt-5.5 + deepseek-v4-pro + grok-4.3.
- `Bug investigation`: gpt-5.5 + deepseek-v4-flash + mistral-medium.
- `Constraint`: Keep concrete provider aliases in local adapters/config, not in portable skill text.

### Merger Discipline

- Merger choice is a first-class parameter. The merger can change severity, grouping, and which minority findings survive.
- For high-stakes reviews, use a dedicated clean-context merger subagent, not the current orchestrator.
- Merger identity must be explicit: model, context mode, thinking level, and tools.
- Give the merger no extra tools beyond minimal access to raw quorum outputs; final file writing belongs to the orchestrator.
- Use `consensus-first` as the default merge mode.
- Use `risk-first` when a one-off finding could represent a severe failure.
- Mark merger-added claims as `merger finding` unless they are directly supported by subagent findings.
- Run post-merge review when the report will drive code, architecture, security, money, governance, migrations, or specs.
- Post-merge review should judge report quality, evidence preservation, severity calibration, consensus purity, internal consistency, and merge bias; it should not silently become another domain review.
- Merged reports must separate current-quorum votes from previous-run corroboration.
- Severity upgrades from raw outputs must be marked by explicit merger rationale.

### When to Swarm

- `Single review`: use `swarm_review` with one capable model.
- `High-risk change`: use `swarm_quorum` with 3-4 models.
- `Ambiguous bug`: use quorum with diverse models to surface different hypotheses.
- `Parallel work`: decompose into scopes, run `swarm_review` on each in parallel with read-locks.
