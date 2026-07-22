---
name: re-review
description: Evidence-grounded review for code, diffs, PRs, documents, plans, specs, and architecture. Use for evidence review, review, code review, quick review, sanity check, quality check, architecture review, production readiness, security review, scaling review, document review, evaluate, or check.
metadata:
  version: 1.2.1
---

# Re-Review

One careful reviewer. Fast when scope is small, deep when risk is high, decision-grade when architecture is the target. For high-stakes or ambiguous work, the reviewer can temporarily simulate multiple independent lenses, then synthesize only evidence-backed claims.

## Boundaries

This skill may read code, tests, diffs, docs, logs, configs, local validation output, cited sources, and user-provided evidence.
This skill may run non-destructive inspection commands, linters, tests, and diff commands.
This skill may write a review document only when the user explicitly asks for a file artifact.
This skill must not edit implementation, rewrite tests, commit, push, publish, deploy, or post external comments.
This is a review, not a fix. Findings first; remediation starts only after the user asks.

## Modes

- **Quick** — Sanity check for small diffs. One pass, strongest 1-5 findings, no broad scan.
- **Focused** — Default mode for diffs, PRs, files, documents, plans, specs, and modules.
- **Architecture** — Platform, directory, scaling readiness, migration, CTO handoff, or production readiness. Use the 90/10 architecture lens.
- **High-stakes** — Security, money, auth, data loss, privacy, migrations, or irreversible decisions.
- **Verification** — Re-review prior findings, review comments, or requested changes against a revised artifact or diff.
- **Multi-lens** — Optional pattern for high-risk or broad reviews: run 3-5 independent cognitive lenses before synthesis.
- **Fact-check** — Verify specific claims against provided or inspectable evidence, sources, logs, docs, or code.

If the mode is ambiguous and no safe default exists, ask the user to choose Quick, Focused, Architecture, or Verification.

## Phase 1: Scope

**Entry**: The user asked for a review or provided a target.

Determine target and mode:

- No target means current branch diff.
- PR URL or number means PR diff.
- File path means that file plus call sites and tests.
- Directory path means architecture or module review.
- Markdown plan, spec, brainstorm, or ADR means document review.

Gather minimum context:

1. Read project instructions such as `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, or `GEMINI.md` when present.
2. Inspect git status and diff when reviewing current work.
3. Read implementation and tests together when code is in scope.
4. Read related docs, plans, schemas, routes, configs, and call sites when they affect correctness.
5. Identify risk areas such as auth, secrets, validation, money, migrations, concurrency, privacy, and external APIs.
6. For architecture mode, identify team constraints, target scale, deployment shape, and critical flows.
7. For verification mode, identify the original findings or requested changes, the claimed fixes, and the revised artifact or diff.
8. For multi-lens mode, choose only lenses that fit the risk: security, correctness, tests, architecture, operations, UX, economics, migration, or devil's advocate.

**Exit**: Scope, mode, conventions, and risk areas are known.

## Phase 2: Inspect

**Entry**: Scope is known.

Review from evidence, not impressions.

For code, inspect:

- Correctness, edge cases, invariants, state transitions, and error handling.
- Security, auth, authorization, input validation, secrets, injection, CSRF, SSRF, and rate limits.
- Tests, meaningful assertions, negative paths, integration seams, fixtures, and false confidence.
- Simplicity, YAGNI, one-use abstractions, dead branches, duplicated logic, and misleading names.
- Maintainability, dependency direction, coupling, ownership, public contracts, and migration safety.
- Performance, N plus one behavior, blocking work, memory growth, query shape, and hot paths.

For documents, inspect:

- Why the decision exists, not only what will be done.
- Scope, non-goals, constraints, acceptance criteria, and rejection criteria.
- Risks, trade-offs, migration plan, rollback plan, and open questions.
- Whether an autonomous implementer could start safely from the document.
- Whether subjective work has references, anti-references, and preview gates.
- Whether factual claims trace to evidence and disclose uncertainty.

For architecture, inspect:

- System map: entrypoints, runtimes, data stores, queues, external services, auth boundaries, deployment, and ownership.
- Claims versus code: verify README, docs, issue claims, and audit claims against implementation.
- Critical flows: trace the top user, money, auth, data, and background-job flows end-to-end.
- Failure modes: what is persisted, what is lost, how retry works, and how manual recovery works.
- Production readiness: observability, alerts, logs, backups, rollback, admin path, CI, and environment separation.
- Scaling bottlenecks: connection pools, queues, synchronous external calls, hot queries, CPU work, and single points of failure.
- Team fit: a correct recommendation that the team cannot operate is not a good recommendation.

For verification, inspect:

- Each original finding or requested change against the revised code, document, or artifact.
- Whether the claimed fix exists, whether it addresses the failure scenario, and whether it adds regressions.
- Residual issues, partially addressed items, and new issues introduced by the revision.
- Evidence for every status: verified, partially verified, not verified, obsolete, or not checkable.

For fact-checking or evidence review, inspect:

- The exact claim, its scope, and its implied confidence.
- The cited or available evidence, including primary source preference when available.
- Source quality, recency, independence, conflicts of interest, and whether evidence actually supports the claim.
- Contradictory evidence and plausible alternative explanations.
- Whether missing evidence makes the claim unsupported rather than merely uncertain.

**Exit**: Candidate findings exist with supporting evidence.

## Architecture 90/10 Lens

Use this when Architecture mode is active. Do enough to make decisions without turning the review into a full consulting engagement.

1. Map the current system from code, configs, and docs.
2. Verify claims against implementation. Docs are leads, not truth.
3. Trace the top three critical flows end-to-end.
4. For each critical flow, identify persisted state, lost state, retry path, and manual recovery.
5. Find bottlenecks and single points of failure.
6. Check minimum production readiness: errors, alerts, logs, backups, rollback, admin path, CI, and environment separation.
7. Convert major choices into ADR candidates with 2-4 options and one recommended minimum.
8. Sequence work into the first safe slice, next slices, and external gates.

## Evidence and Fact-Check Lens

Use this when the review depends on external sources, citations, claims, logs, measurements, or research-like evidence.

Rules:

1. Every important factual claim needs traceable evidence or an explicit uncertainty label.
2. Primary sources beat summaries; independent corroboration beats repeated copies of the same claim.
3. Source quality matters: peer-reviewed or official records, reputable primary data, reproducible logs, then gray literature or commentary.
4. Contradictions must be disclosed, not averaged away.
5. A source can prove existence without proving interpretation; check what the evidence actually supports.
6. Gray zone is not verified. If required evidence is missing, say `Not verified` or `Not checkable` and name the missing evidence.

Useful output statuses:

- **Supported** — Evidence directly supports the claim.
- **Partially supported** — Evidence supports a narrower claim or leaves a material gap.
- **Contradicted** — Evidence conflicts with the claim.
- **Not verified** — Evidence was sought but does not establish the claim.
- **Not checkable** — Evidence is unavailable in the current scope.

For claim-heavy documents, include an evidence map only for material claims; do not turn small reviews into bibliography work.

## Verification Re-Review Lens

Use this when the user asks whether fixes, revisions, or responses addressed earlier findings.

Build a compact traceability matrix using one bullet per original item:

```markdown
- **[VR-1] Original item**: <finding or requested change>
  - Claimed fix: <summary or none>
  - Evidence checked: <files, lines, commands, quoted text>
  - Status: <Verified | Partially verified | Not verified | Obsolete | Not checkable>
  - Residual risk: <remaining concern or none>
```

Allowed statuses:

- **Verified** — The failure scenario is addressed with supporting evidence.
- **Partially verified** — Some evidence supports the fix, but a gap remains.
- **Not verified** — The claimed fix is absent or does not address the issue.
- **Obsolete** — The original item no longer applies because the surrounding design changed.
- **Not checkable** — Required evidence is unavailable; explain exactly what is missing.

Do not rubber-stamp. A re-review must independently inspect the revised artifact, not only the response or summary.

## Multi-Lens Review Pattern

Use this only when risk or breadth justifies it. Choose the smallest useful lens set.

Common lenses:

- **Correctness** — Invariants, edge cases, state transitions, and data contracts.
- **Security** — Auth, authorization, secrets, injection, privacy, and abuse paths.
- **Tests** — Meaningful assertions, negative paths, integration seams, and false confidence.
- **Architecture** — Ownership, dependency direction, public contracts, migration safety, and operability.
- **Operations** — Logs, alerts, recovery, rollback, background work, queues, and manual intervention.
- **UX / Operator UX** — Error clarity, affordances, defaults, and human recovery paths.
- **Economics** — Cost, latency, quota, support burden, and operational leverage.
- **Devil's Advocate** — Strongest counter-argument, hidden assumptions, cherry-picking, overgeneralization, and "so what?" test.

Rules:

1. Lenses inspect independently before synthesis.
2. Duplicate findings are merged, not counted as stronger unless the evidence differs.
3. Synthesis cannot fabricate claims; every final finding must trace to evidence or a lens note.
4. Devil's Advocate critical issues cannot be silently downgraded; either preserve them or explain why evidence disproves them.
5. Disclose confidence and blind spots when scope, time, tooling, or missing files limit the review.

## Artifact Mode

Use artifact mode when the user asks for a file, the review is a handoff, or findings exceed what fits cleanly in chat.
Do not write artifacts by default. If useful but not requested, offer it.

Default paths:

- Focused review: `docs/reviews/YYYY-MM-DD-<slug>.md`
- Architecture review: `docs/reviews/YYYY-MM-DD-architecture-<slug>.md`
- Existing project convention wins over defaults.

Artifact structure:

```markdown
# Review: <scope>

Date: <YYYY-MM-DD>
Mode: <Quick | Focused | Architecture | High-stakes>
Verdict: <verdict>

## Executive Summary

...

## Evidence Map

...

## Findings

...

## Architecture Addendum

...

## ADR Candidates

...

## Execution Order

...

## Appendix

Checked files and commands.
```

When writing an artifact, include checked files, commands, assumptions, uncertainty, and evidence type for major claims.

## Phase 3: Challenge

**Entry**: Candidate findings exist.

Challenge every finding:

1. Is this a real failure, risk, or decision gap rather than a preference?
2. What concrete scenario triggers the problem?
3. What evidence proves it?
4. What would disprove it?
5. Is severity honest?

Drop findings that cannot survive this challenge.
Mark uncertainty explicitly instead of pretending confidence.
For high-stakes reviews, perform an independent second pass or subagent pass when available, then reconcile disagreements against evidence.

For multi-lens reviews, keep lenses independent until synthesis. Do not let one lens reference another lens's conclusion during inspection. The synthesizer may only use claims that trace to lens output, checked files, commands, logs, or quoted document evidence.

**Exit**: Findings are verified, deduplicated, and severity-ranked.

## Phase 4: Report

**Entry**: Findings are verified.

Report only useful signal. Put the most important issues first.

```markdown
## Review: <scope>

### Verdict

APPROVE / APPROVE WITH NOTES / REQUEST CHANGES / READY /
NEEDS REFINEMENT / FIT WITH GAPS / NOT READY

### Critical Issues

- **[CRIT-1]** path#line — Finding. Evidence. Failure scenario. Suggested direction.

### Suggestions

- **[SUG-1]** path#line — Improvement. Trade-off if ignored.

### Observations

- **[OBS-1]** Useful context that does not block shipping.

### Document Gaps

- **[GAP-1]** Missing contract or unclear criterion. Why it matters.

### Architecture Addendum

- System map, ADR candidates, failure modes, production readiness, risks, and execution order when architecture is in scope.
```

Omit empty sections.
If no issues are found, say so clearly and name what was checked.
Do not invent problems to look useful.

**Exit**: Review delivered with a clear verdict.

## Phase 5: Handoff

**Entry**: Review has been delivered.

Offer the next step without doing it automatically:

- Address findings.
- Discuss or challenge a finding.
- Create a fix plan.
- Capture a recurring pattern in project context.
- Stop.

If the user asks to fix issues, exit review mode and switch to the normal coding contract.

## Example

Strong finding:

```markdown
- **[CRIT-1]** `src/auth/session.ts#42` — Expired sessions are accepted because `expiresAt` is parsed but never compared. A replayed cookie remains valid until signing key rotation. Check expiry before returning the session.
```

Weak finding:

```markdown
- Auth looks risky.
```

## Severity Rules

- **Critical** — Likely bug, vulnerability, data loss, broken invariant, failed migration, or release blocker.
- **Suggestion** — Real improvement with a trade-off, but not a blocker.
- **Observation** — Useful context, pattern, or small hygiene note.

Nits belong only in Observations and only when they prevent confusion.
Do not mix style preferences with release blockers.

## Anti-Traps

- Do not trust docs over code.
- Do not trust passing tests without checking assertions.
- Do not recommend best practices that the team cannot operate.
- Do not skim high-risk paths.
- Do not hide uncertainty.

## Validation Checklist

Before final answer, verify:

- Read implementation and tests when code is in scope.
- Checked call sites and integration boundaries when relevant.
- Checked project conventions before judging style.
- Checked security and data handling for sensitive paths.
- Checked test integrity, not just coverage presence.
- Verified every Critical finding has evidence and a failure scenario.
- Checked architecture mode against system map, critical flows, failure modes, ADRs, ops readiness, and execution order.
- Wrote artifact only when explicitly requested or offered and accepted.
