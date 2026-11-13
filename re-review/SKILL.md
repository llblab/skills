---
name: re-review
description: Evidence-grounded review of code, diffs, PRs, documents, plans, specifications, and architecture, including quick sanity reviews, readiness assessments, fact-checks, and verification of prior fixes. Owns the review process and evidence-backed verdict; domain criteria may complement it. Report findings without automatic remediation.
---

# Re-Review

## Review-Only Boundary

Read artifacts, call sites, tests, docs, logs, configs, cited sources, and supplied evidence. Run non-destructive inspection, lint, tests, and diff commands. Write a review file only when explicitly requested. Do not edit implementation or tests, commit, push, publish, deploy, or post external comments. Remediation requires a user request and exits review mode.

## Scope

Choose the smallest sufficient mode:

- **Quick**: Small diff, one pass, strongest 1–5 findings, no broad scan.
- **Focused**: Default artifact/module review.
- **Architecture**: System readiness, scaling, migration, or architecture handoff.
- **High-stakes**: Security, money, auth, data loss, privacy, migrations, irreversible decisions; add an independent second or available subagent pass and reconcile by evidence.
- **Verification**: Prior findings against a revised artifact.
- **Fact-check**: Material claims against inspectable evidence.

A quick review stays near the changed flow and its immediate failure boundaries. A focused review follows affected callers, contracts, and tests; architecture mode widens to critical system flows. High stakes increase the required evidence, not the number of cosmetic findings. Mode labels are not extra phases that every review must traverse.

Add independent lenses only when risk or breadth repays them. If ambiguity leaves no safe default, ask for the mode.

Resolve the target:

- No target: Current branch diff.
- PR URL or number: That PR's diff.
- File path: The file plus relevant call sites and tests.
- Directory: Module or architecture review.
- Markdown plan, specification, brainstorm, or ADR: Document review.

Gather the minimum context that can change the verdict:

1. Read applicable project instructions, including local review or validation requirements.
2. Inspect status and diff when reviewing current work. Separate the proposed changes from unrelated work already present.
3. Read implementation and tests together when code is in scope.
4. Inspect related documentation, plans, schemas, routes, configuration, and callers when they affect correctness.
5. Identify trust boundaries and risk areas: auth, secrets, validation, money, migrations, concurrency, privacy, and external APIs.
6. For architecture, establish team constraints, target scale, deployment shape, and critical flows.
7. For verification, identify original findings, claimed fixes, and the revised artifact or diff.
8. For multiple lenses, choose only those that cover consequential uncertainty in the target.

Do not expand to a repository-wide audit merely because more files are available. The target and risk determine the inspection boundary.

## Inspect

For code, check:

- Correctness, edge cases, invariants, state transitions, and errors.
- Auth/authorization, secrets/privacy, input validation, injection, CSRF, SSRF, rate limits, and abuse paths.
- Assertions, negative paths, fixtures, integration seams, and false confidence.
- Dead work, one-use abstractions, duplication, misleading names, ownership, coupling, public contracts, and migration safety.
- N+1 queries, blocking work, query shape, hot paths, memory, latency, quota, and cost where relevant.

For simplification, trace the real flow first. Report an exact cut and simpler replacement: omit unnecessary work, inline one-use indirection, reuse local paths, prefer native/standard-library capability, then installed dependencies before custom machinery. Do not flag complexity that earns safety, correctness, operability, accessibility, or an explicit requirement.

For documents, inspect:

- Why the decision exists, not only what will be done.
- Scope, non-goals, constraints, acceptance criteria, and rejection criteria.
- Risks, trade-offs, migration plan, rollback plan, and open questions.
- Whether an autonomous implementer could start safely from the document.
- Whether subjective work has references, anti-references, and preview gates.
- Whether factual claims trace to evidence and disclose uncertainty.

### Architecture Lens

Use in architecture mode; inspect enough to support decisions without turning the review into a consulting engagement.

1. Map entrypoints, runtimes, stores, queues, external services, auth boundaries, deployment, and ownership from code, configs, and docs.
2. Verify claims against implementation. Docs are leads, not truth.
3. Trace the top three critical flows end-to-end.
4. For each critical flow, identify persisted state, lost state, retry path, and manual recovery.
5. Find bottlenecks and single points of failure: connection pools, queues, synchronous external calls, hot queries, and CPU work.
6. Check minimum production readiness: errors, alerts, logs, backups, rollback, admin path, CI, and environment separation.
7. Convert major choices into ADR candidates with 2-4 options and one recommended minimum.
8. Sequence work into the first safe slice, next slices, and external gates.

### Evidence Lens

Check the evidence behind each material claim:

1. Identify its exact scope and implied confidence; require traceable support or an explicit uncertainty label.
2. Prefer primary sources to summaries and independent corroboration to repeated copies of one claim.
3. Assess source quality, recency, and conflicts of interest: official or peer-reviewed records, primary data, reproducible logs, then commentary.
4. Disclose contradictions and plausible alternative explanations rather than averaging them away.
5. A source can establish existence without establishing interpretation. Check what it actually proves.
6. Missing required evidence is not verification. Name what is missing and use the appropriate status below.

Use these claim statuses:

- **Supported**: Evidence directly supports the claim.
- **Partially supported**: Only a narrower claim or a material gap remains.
- **Contradicted**: Evidence conflicts with the claim.
- **Not verified**: Evidence was sought but does not establish the claim.
- **Not checkable**: Evidence is unavailable in scope; name what is missing.

Map only material claims; a small review does not need bibliography work.

### Verification Lens

For each original item, preserve traceability to the claimed fix and inspected evidence:

```markdown
- **[VR-1] Original item**: <finding or requested change>
  - Claimed fix: <summary or none>
  - Evidence checked: <files, lines, commands, or quoted text>
  - Status: <one of the statuses below>
  - Residual risk: <remaining concern or none>
```

Use these statuses:

- **Verified**: Evidence addresses the failure scenario.
- **Partially verified**: Some support, but a gap remains.
- **Not verified**: The fix is absent or does not address the issue.
- **Obsolete**: Surrounding design changed so the item no longer applies.
- **Not checkable**: Required evidence is unavailable; name it.

Inspect the revised artifact independently of its author's response. Check the original failure and revision-induced regressions.

### Multiple Lenses

Use the smallest useful set; broad high-risk work may justify 3–5 independent lenses:

- **Correctness**: Invariants, edge cases, state transitions, and data contracts.
- **Security**: Auth, authorization, secrets, injection, privacy, and abuse paths.
- **Tests**: Meaningful assertions, negative paths, integration seams, and false confidence.
- **Architecture**: Ownership, dependency direction, public contracts, migration safety, and operability.
- **Operations**: Logs, alerts, recovery, rollback, background work, queues, and manual intervention.
- **UX / Operator UX**: Error clarity, affordances, defaults, and human recovery paths.
- **Economics**: Cost, latency, quota, support burden, and operational leverage.
- **Devil's Advocate**: Strongest counterargument, hidden assumptions, cherry-picking, overgeneralization, and the “so what?” test.

Inspect independently before synthesis. Merge duplicate findings; agreement is stronger only with different evidence. Every final claim must trace to evidence or a lens note. Preserve adversarial critical findings unless evidence disproves them and explain that decision. Disclose confidence and blind spots from scope, time, tooling, or missing files.

## Challenge

For every candidate finding, establish:

1. A real failure, risk, or decision gap—not preference.
2. A concrete triggering scenario.
3. Supporting evidence and what would disprove it.
4. Honest severity.
5. A suggested direction the intended team can operate within its constraints.

Drop findings that fail the challenge; label uncertainty rather than inventing confidence. Deduplicate and rank survivors.

A useful finding connects mechanism to consequence:

```markdown
- **[CRIT-1]** `src/auth/session.ts#42` — The code parses `expiresAt` but never compares it with the current time. A replayed expired cookie remains accepted until key rotation. Reject expired sessions before returning them.
```

This is an illustrative shape, not a finding to reuse. “Auth looks risky” lacks an evidenced mechanism and failure scenario. If the relevant validation lives elsewhere, trace it before claiming it is missing.

## Report and Stop

Give a clear verdict appropriate to the question: approve, approve with notes, request changes, ready, needs refinement, fit with gaps, or not ready. Lead with the strongest issues; each finding needs a location, evidence, failure scenario, and suggested direction.

- **Critical**: Likely bug, vulnerability, data loss, broken invariant, failed migration, or release blocker.
- **Suggestion**: Real improvement with a non-blocking trade-off.
- **Observation**: Useful context; include nits only when they prevent confusion.
- **Document gap**: Missing contract/criterion and why it matters.

Omit empty sections and style preferences masquerading as blockers. If none survive, say no issues found and identify what was checked. Never invent findings to appear useful.

Include checked files/commands, assumptions, uncertainty, and evidence type for major claims. Add system maps, ADR candidates, failure modes, readiness risks, and execution order only for architecture scope. For an explicitly requested artifact, follow project convention; otherwise default to `docs/reviews/YYYY-MM-DD-<slug>.md` (architecture slug when applicable). Do not create a file merely because findings are long or a handoff would benefit.

For a handoff, use the smallest useful shape:

```text
Verdict:
Findings: location → evidence → failure scenario → suggested direction
Verification: original item → claimed fix → checked evidence → status → residual risk
Limits: uninspected areas, unavailable evidence, and assumptions
```

Use findings or verification entries as the task requires, not both automatically. For a clean review, say that no issues survived the challenge and name the checked scope; do not imply universal correctness.

Offer a useful next step—remediate, discuss, plan, capture a recurring lesson, or stop—without executing it. Review ends at the verdict; fixes require authorization.
