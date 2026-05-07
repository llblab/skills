---
name: swarm
description: Subagent orchestration with scoped locks and quorum consensus. Use for multi-model review, parallel scoped work, delegated audit, and coordinated subagent execution.
metadata:
  version: 1.0.9
---

# Swarm

Subagent orchestration: delegated review, quorum consensus, scoped locks, clean-context merge, and post-merge review.

## Purpose

Run subagents safely and predictably through reusable orchestration contracts.

Swarm is independent. It must not require concrete sibling skill names, private repositories, local model aliases, or a specific tool registry layout. Local agents may bind the contracts to their own tools, command templates, model names, and review protocols.

## Core Concepts

- `Orchestrator`: Main agent. Coordinates subagents, owns safety, and writes final artifacts.
- `Subagent`: Bounded delegated model call for review, audit, merge, or scoped implementation.
- `Scope`: File, directory, module, or logical domain that a subagent operates on.
- `Lock`: Read or write ownership of a scope for bounded time.
- `Quorum`: Multiple independent subagents reviewing the same target.
- `Merger`: Clean-context fifth subagent that synthesizes raw quorum outputs.
- `Reviewer`: Post-merge reviewer that checks report quality, not the original domain by default.
- `Job Adapter`: Local async binding that starts, tracks, lists, tails, and cancels swarm jobs through a generic job runtime.
- `Template Job`: A local async envelope around a command-template swarm composer or utility. It owns lifecycle and observability, not swarm semantics.

## Tool Contracts

These are abstract tool contracts. Register them in whatever local tool layer exists. Concrete syntax is an adapter detail outside this skill.

- `swarm_review`: single subagent review.
- `swarm_quorum`: multi-model independent review.
- `swarm_claim`: acquire a scoped read/write lock.
- `swarm_release`: release a scoped lock.
- `swarm_merge`: synthesize raw quorum outputs.
- `swarm_post_merge_review`: review the merged report quality.

## File Handoff

Prefer path handoff over attachment syntax. Put the target path directly in the subagent prompt:

```text
Review this local file: /path/to/file.md. First read it from disk.
```

Attachment syntax is optional local optimization, not a swarm contract. Path handoff keeps the skill portable across wrappers without attachment arguments.

## `swarm_review`

Single subagent review.

`Inputs`:

- `scope`: file path, directory, module, or logical domain.
- `model`: model identifier in the local environment.
- `prompt`: optional review lens or task-specific instructions.
- `thinking`: optional reasoning depth.
- `tools`: optional local tool allowlist.
- `timeout`: timeout in seconds.

`Behavior`:

1. Optionally claim a read lock for the scope.
2. Spawn one subagent with a prompt that includes the scope path.
3. Require the subagent to read the target from disk before judging it.
4. Return the subagent's raw output.
5. Release the lock if one was claimed.

`Reference prompt`:

```text
Review this local scope: <scope>.
First read it from disk.
Use the local review protocol if available.
Report white spots, contradictions, evidence, and risks.
```

## Async Job Adapter

Async job management is an adapter concern, not a portable Swarm script requirement. A template job is the preferred mental model when the local runtime supports it: command-template execution plus a thin detached lifecycle envelope.

- `start`: Launch a swarm job in the background and return job metadata.
- `status`: Report whether the job is running, done, degraded, or failed.
- `tail`: Show recent structured job events or raw logs.
- `list`: Show known jobs.
- `cancel`: Stop an owned running job when the adapter can prove pid ownership.

`Purpose`: Keep the user interface responsive while reviewers, merger, and post-merge reviewer run. Generic job state belongs to a local job runtime; swarm-specific execution stays in atomic utilities or command-template composition.

`Progress contract`: async jobs should expose structured state such as `progress.json`, `events.jsonl`, logs, and final result metadata. Local tools should read these files through job-runtime verbs instead of scraping process output.

`Minimum state`: an adapter should expose `job_id`, `status`, timestamps, state directory or output directory, recent events, stdout/stderr logs, and final result metadata.

`Terminal statuses`: `done`, `failed`, `timeout`, and `cancelled` are terminal. `running` and `degraded` are observable non-terminal states.

`Cancellation boundary`: cancel only an owned running job when pid ownership or runtime ownership can be verified. Stale pid reuse must fail closed.

`Reference binding`: Use a local generic job runtime or tool registry adapter. If the local runtime exposes a single action tool, bind these verbs as actions rather than adding more Swarm scripts. Swarm scripts themselves should stay atomic and narrowly specialized.

## `swarm_quorum`

Multi-model review by independent subagents.

`Inputs`:

- `scope`: target path or domain.
- `models`: 2-6 model identifiers.
- `prompt`: shared review lens.
- `thinking`: per-model or shared reasoning depth.
- `timeout`: per-subagent or whole-quorum timeout.
- `merge_mode`: merge behavior, default `consensus-first`.
- `merger_model`: explicit model for the clean merger.

`Behavior`:

1. Claim a shared read lock when the target is local and stable.
2. Spawn one subagent per model concurrently unless a local rate limit requires throttling.
3. Give every subagent the same target path and review lens.
4. Preserve every raw output.
5. Release the lock.
6. Run a clean-context merger subagent.
7. Store or return the merged report.
8. Optionally run post-merge review.

`Reference binding`: Implement this contract through a local adapter such as a command-template composer, registered tool, or template job. The portable Swarm skill intentionally does not ship a `pi -p` quorum runner.

`Serious quorum rule`: For high-stakes review, the merger is not the current orchestrator. The merger is a fifth clean-context subagent.

## Lock Protocol

Locks prevent subagents from interfering with shared scopes. Locks are optional for read-only review, but required for concurrent mutation.

### Lock Fields

- `scope`: Scope identifier, usually a path or domain label.
- `owner`: Subagent or quorum run that owns the lock.
- `type`: `read` or `write`.
- `acquired`: Acquisition time.
- `ttl`: Time-to-live in seconds.
- `expires`: Expiry time derived from acquisition plus TTL.

### Conflict Rules

- `read` request with no lock: allow.
- `read` request with existing `read`: allow.
- `read` request with existing `write`: conflict unless stale.
- `write` request with no lock: allow.
- `write` request with existing `read` or `write`: conflict unless stale.

### Lifecycle

1. `acquire`: prune stale locks, then check conflicts.
2. `hold`: run the bounded subagent task.
3. `release`: remove the entry.
4. `expire`: any later lock operation may prune stale entries.

`TTL rule`: Every lock must have a TTL. A lock without expiry is invalid.

`Reference implementation`: `scripts/swarm-lock.mjs` exposes `claim`, `release`, `status`, and `prune` commands for local adapters and tests.

## Validation

After changing Swarm scripts or adapter contracts, run:

```bash
node scripts/_self-test.mjs
```

This is the required smoke gate for lock behavior and for preserving the script boundary: no broad coordinator and no `pi -p`-coupled quorum runner in portable Swarm scripts.

## Merge Protocol

The merger is not a passive formatter. The merger is the final synthesis agent and can materially affect the output by choosing labels, grouping findings, deciding severity, preserving minority signals, and adding grounded judgement.

`Merger influence`: High.

`Merger role`: Read all raw outputs, deduplicate, rank, preserve dissent, and produce one decision-grade artifact. The merger may add its own finding only as `merger finding` and only when grounded in evidence.

`Merger isolation`: For serious quorum work, the merger should be a dedicated clean-context subagent with explicit model, thinking level, and minimal access. The orchestrator provides the input bundle and writes the final artifact after the merger returns.

`Orchestrator merge exception`: The orchestrator may merge quick, low-stakes, or exploratory quorum runs. The report must say the merge was not isolated.

### Merge Parameters

- `merger_model`: Explicit synthesis model. Required for quorum reports.
- `merger_context`: Clean or inherited context. Default `clean` for serious quorum.
- `merger_tools`: Tool access granted to merger. Prefer none if raw text is embedded; otherwise read-only access to raw outputs.
- `merger_thinking`: Reasoning depth. Use `medium` normally, `high` for architecture, security, money, governance, migrations, or specs.
- `merge_mode`: Synthesis style. Default `consensus-first`.
- `consensus_threshold`: Votes needed to promote. Use `3/4` for critical promotion and `2/4` for major discussion by default.
- `minority_policy`: Treatment of unique findings. Preserve high-impact, evidence-backed minority findings.
- `attribution`: Which model found what. Required for quorum reports.
- `raw_retention`: Keep raw outputs until the final report is accepted.

### Merge Modes

- `faithful`: Minimal editing; preserves subagent wording and uncertainty.
- `consensus-first`: Groups by agreement and preserves dissent separately.
- `risk-first`: Promotes high-impact minority findings even without consensus.
- `design-synthesis`: Converts findings into decisions and repair order.

### Merge Guardrails

- Preserve raw outputs until the final report is accepted.
- Do not hide model disagreement.
- Do not drop high-impact minority findings only for lack of consensus.
- Do not over-promote repeated low-value nitpicks.
- Keep model attribution for every major finding.
- Keep merger identity explicit: model, context, thinking, and tools.
- Separate `consensus finding`, `minority finding`, and `merger finding`.
- Separate current-quorum votes from prior-run corroboration.

## Post-Merge Review

Run a reviewer on the merged report when the output will drive code, architecture, security, money, governance, migrations, or specifications.

`Purpose`: Review the review. The reviewer checks whether the merger preserved evidence, ranked severity honestly, avoided hallucinated synthesis, kept minority high-impact findings, and produced an actionable artifact.

`Reviewer input`:

- target scope
- raw subagent outputs
- merged report
- merge parameters
- intended use of the report

`Reviewer output`: Meta-findings about report quality, not a second domain review unless explicitly requested.

### Post-Merge Review Lens

- `Evidence`: Does each major finding trace to raw outputs or clearly marked merger evidence?
- `Severity`: Are labels justified by failure impact?
- `Consensus`: Was agreement counted honestly?
- `Purity`: Is current quorum separate from prior context?
- `Minority`: Were unique high-impact findings preserved?
- `Bias`: Did the merger impose an unsupported narrative?
- `Actionability`: Are repair order, scope, and gates named?
- `Consistency`: Do maps, headers, and attribution agree?
- `Compression`: Were caveats or disagreements lost?

### Post-Merge Decisions

- `Accept`: Report is decision-grade.
- `Accept with notes`: Report is useful, with caveats.
- `Revise merge`: Rerun merger with adjusted parameters.
- `Rerun quorum`: Raw outputs are too weak, divergent, or under-scoped.
- `Escalate`: Run cross-merge with another clean merger.

## Error Handling

- `LOCK_CONFLICT`: Retry, back off, or choose another scope.
- `SUBAGENT_TIMEOUT`: Keep partial results and release locks by TTL.
- `MODEL_FAILURE`: Continue with fewer votes and mark degraded quorum.
- `MERGE_FAILURE`: Return `INSUFFICIENT_DATA` or rerun merger.
- `REVIEW_FAILURE`: Keep merged report and mark post-review missing.

## Composition Contract

This skill composes with capabilities, not concrete sibling skills:

- local tool registry for reusable command-template adapters
- local review and implementation protocols
- scoped lock standard with TTL
- subagent runner with file-read access
- artifact writer owned by the orchestrator

Do not make swarm depend on a specific sibling skill, repository, model alias, or tool registry. The orchestrator may tell subagents to use the local review protocol when one exists.

## Portability Lens

- `Lock protocol`: Mandatory kernel.
- `Quorum review`: Optional capability.
- `Clean merger`: Mandatory for serious quorum.
- `Post-merge review`: Required for high-stakes outputs.
- `Command templates`: Local adapter.
- `Test scripts`: Protocol validation aid.

Operational tools should be registered at runtime through the local tool layer. Ad-hoc shell orchestration is acceptable only as an experiment or fallback. See [`docs/adapters.md`](./docs/adapters.md) for local adapter examples.
