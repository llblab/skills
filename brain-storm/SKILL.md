---
name: brain-storm
description: Collaboratively resolve open product, architecture, protocol, or UX decisions into approved designs or bounded inquiry briefs. Use when intent, alternatives, or acceptance criteria remain unsettled, including revisions of an existing proposal; skip settled mechanical work.
---

# Brain Storm

Resolve uncertainty into an approved direction, design/specification, inquiry brief, smaller slices, or a stop/defer decision. Do not impose ceremony on obvious edits, direct settled changes, or emergency fixes with clear acceptance criteria; two sentences may suffice.

## Ownership and Boundaries

- Decide what should exist; the local context protocol owns where durable rules, open work, history, navigation, and contracts belong. Align with it without duplicating facts.
- Produce a self-contained handoff, not dependencies on named skills, projects, stacks, or workflows. Use generic lenses and interfaces.
- After acceptance, hand off to the local implementation process. Implementation may start when uncertainty for the current slice is resolved and approval is explicit or the user asks to implement the proposed direction.
- For risky, broad, or security-sensitive designs, request evidence-grounded review before implementation; name the artifact, assumptions, rejected alternatives, and open risks.
- For many small tasks, define stop conditions and let the existing execution process iterate. Do not become a second execution loop.
- Do not invent evidence or speculative architecture. Add complexity only for discovered constraints. Guide a vague interest before producing an unwanted report.

## Orient

Read the nearest relevant project context before proposing design:

- Local contributor instructions
- Backlog or roadmap
- Root README and relevant subtree README files
- Documentation index and relevant docs
- Recent delivery history when shipped baseline matters
- Existing code only when implementation constraints shape the design

For small or conversational work, summarize only the relevant facts. Do not dump context.

## Classify Scope

Classify the request:

```text
Tiny:        obvious design, compact note enough
Small:       one feature/module, few choices
Medium:      needs alternatives and a short spec
Large:       decompose into slices before designing slice 1
Ambiguous:   ask one blocking question first
```

If the request spans independent subsystems, decompose before designing details.

## Clarify

Ask one question at a time, only when its answer can change the design. Prefer multiple-choice questions when they reduce friction. Stop when the main uncertainty is resolved.

Prefer questions about:

- Goal / success criteria
- User or operator workflow
- Hard constraints
- Ownership boundary
- Data/state lifecycle
- Safety and rollback
- What must be portable vs product-specific
- The decision the inquiry should support
- What evidence would confirm, weaken, or falsify the current direction

Skip questions when the user already gave enough constraints for a safe first design.

## Inquiry Lens

Shape inquiry before collecting evidence. Use genuine Socratic questions, not a predetermined conclusion:

1. Clarify the interest or decision and probe definitions/assumptions.
2. Ask what evidence would change the answer; explore alternatives and counterexamples.
3. Bound the question, non-goals, uncertainty, needed evidence, likely sources/stakeholders, contradictions to seek, supported decision, next probe, and “enough research” stop condition.

A compact inquiry brief can use this shape; omit fields already settled in the surrounding context:

```text
Question:
Scope and non-goals:
Assumptions:
Evidence needed and likely sources:
Counter-question:
Decision this supports:
Next probe and stop condition:
```

For example, “Should this work offline?” first needs a bounded user scenario: viewing cached records, editing them, or resolving concurrent edits imply different evidence and contracts. Ask which action must survive lost connectivity before proposing a sync architecture.

Once the question is clear and evidence is requested, hand off; do not run a full research pipeline inside brainstorming.

## Portability Lens

When designing for systems intended to be reused, forked, extended, or installed in multiple contexts, classify each idea:

- Mandatory kernel: required for the base system to function
- Optional module: useful but disableable/omittable
- Reference implementation: example/default, not a universal mandate
- Tooling/operations: helps build, launch, observe, or maintain
- Product-specific layer: belongs to a particular downstream instance

Prefer designs where optional capability is modular, documented, and easy to disable. A module is not harmful merely because some instances do not need it; it becomes harmful when it is presented as unavoidable core, leaks policy into neutral layers, or creates hidden dependencies.

Useful portability questions:

- Can another instance reuse this without adopting this product's identity or politics?
- Is this mechanism, policy, content, or narrative?
- Can it be parameterized instead of hardcoded?
- Can it be disabled without breaking the base path?
- Does it create hidden infrastructure, indexer, service, or operator assumptions?
- Which document or interface becomes the source of truth?

## Extension/Platform Lens

When designing extensible systems, keep the layers distinct:

- Loader/discovery: how extensions/modules are found
- Identity: how ownership and conflicts are named
- Registry: how capabilities are registered/unregistered
- Routing: how events/actions/callbacks reach owners
- Runtime ports: what safe capabilities owners receive
- Diagnostics: how users/operators see registered state and failures
- Fallbacks: what happens when an owner is missing or stale

Prefer stable identity keys, narrow typed ports, explicit ownership, and graceful stale-state behavior. Avoid passing raw internals when a smaller port captures the real need.

Useful extension questions:

- Who owns this action/callback/event?
- What is the smallest safe capability surface?
- Is this a low-level hook or a structured UI/API surface?
- What happens when the owner disappears?
- How are conflicts diagnosed?

## Choose and Present

Present 2–3 approaches when real trade-offs exist. Lead with your recommendation and include what each option optimizes, what it costs, and when it fails. Do not generate alternatives for a settled direction.

For example, distinguish a minimal local patch from a reusable capability or platform boundary by the actual consumers and constraints, not by which option sounds more architectural. If only one path satisfies the contract without unnecessary machinery, explain that path rather than inventing a comparison.

Cover only relevant design decisions:

- Goal
- Non-goals
- Scope boundary
- Concepts / vocabulary
- Research or exploration question
- Assumptions and evidence needs
- Architecture / module ownership
- Data flow / lifecycle
- API or contract shape
- UX behavior
- Error/stale/edge behavior
- Security/capabilities
- Tests/validation
- Documentation/backlog updates
- Rollout plan

For a substantial design, a compact handoff can state:

```text
Goal and acceptance:
Non-goals and constraints:
Recommended approach and rejected alternatives:
Ownership, state lifecycle, and public contracts:
Edge behavior, safety, and rollback:
Validation and next slice:
```

A small change may need only a paragraph. Do not expand a known direction into a full specification merely to fill the outline.

Ask approval before committing a proposed design into durable docs, backlog, or implementation unless already authorized.

Choose the smallest durable artifact that fits the project:

- **No artifact**: Ephemeral clarification only.
- **Inquiry brief**: Research question, assumptions, evidence needs, and next probe.
- **Backlog item**: Future work, with truthful remaining scope.
- **Short doc section**: Small standard or behavior update.
- **Full specification**: A medium or large design that needs an implementable contract.
- **Decision note**: A durable trade-off or ownership boundary.

Follow existing naming and location conventions. Do not force a new specification directory or commit unless the user or project workflow requires it.

## Check and Handoff

Before delivery, check:

- No vague placeholders unless explicitly open; no contradictions with current project truth.
- One implementable slice or explicit decomposition, with a named validation path.
- Local vocabulary; new ontology only when it resolves real ambiguity.
- Explicit data/state ownership and honest mandatory/optional classification.
- Isolated testability, removability, and clear non-goals.

Watch for one-edge-case ontology, hidden service dependencies, optional modules promoted to core, unclear callback owners, premature platforms without a second real user, duplicated design facts, or backlog closure based only on discussion rather than implementation.

End with the next concrete step: approval, implementation planning, evidence review, an authorized doc/backlog update, or stop. Do not imply an unapproved action will happen automatically.

Use visuals only for genuinely visual decisions such as layout, flow, spatial comparison, or architecture maps. Offer an available visual companion once before use; otherwise concise ASCII/Markdown sketches suffice. Do not interrupt conceptual text-first work with visual tooling.
