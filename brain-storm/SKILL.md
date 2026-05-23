---
name: brain-storm
description: Collaborative idea-to-design and inquiry protocol. Use for product/architecture exploration, research-style question shaping, feature design, standards, specs, UX concepts, module boundaries, and non-trivial behavior changes when uncertainty matters.
metadata:
  version: 1.0.13
---

# Brain Storm

Turn rough ideas into clear, implementation-ready designs or research-ready inquiry briefs through lightweight collaborative exploration.

This skill is intentionally independent. It does not require or name any other skill, project, repository, framework, or workflow. It composes by producing clean design truth that surrounding processes can store, review, plan, or implement in their own way.

## Purpose

Use this skill when the useful next step is clarification rather than immediate execution:

- New feature or behavior design
- Architecture or module-boundary choices
- Standards / protocol drafting
- Product or ecosystem-shaping decisions
- UI/UX concept exploration
- Research-style inquiry shaping before evidence collection
- Literature, market, policy, or technical exploration when the question is still vague
- Scope decomposition before implementation
- Risky changes where intent and constraints matter more than speed

Do not use it as bureaucracy for obvious mechanical edits, typo fixes, direct user-specified changes, or emergency fixes with clear acceptance criteria. For small work, a two-sentence design note is enough.

## Core Contract

Brainstorming produces one of:

1. A concise approved direction
2. A written design/specification
3. A research or exploration brief
4. A decomposed set of smaller slices
5. A decision to stop or defer

Implementation may begin once design uncertainty for the current slice is resolved. Approval can be explicit (`yes`, `approved`, `do it`) or implicit when the user directly asks to implement the proposed direction.

## Operating Principles

- Ask only what changes the design.
- Prefer one question at a time.
- Prefer multiple-choice questions when they reduce friction.
- Lead with the recommended option after enough context is known.
- Keep alternatives concrete and trade-off based.
- Use the smallest design artifact that preserves shared understanding.
- Separate portable mechanism from product-specific content.
- Treat durable context, documentation, and open-work state as part of design truth.
- Avoid speculative architecture. Add complexity only when a discovered constraint earns it.
- Preserve local vocabulary instead of importing new ontology unnecessarily.
- If the user has a vague interest rather than a clear question, guide first instead of producing an unwanted report.
- Treat claims, assumptions, and evidence needs as design material; do not invent certainty before investigation.

## Composition Contract

This skill should fit into any surrounding workflow without knowing its names.

### Context systems

If the repository has a living context protocol, align with it before designing and leave outputs in the expected places. Typical durable surfaces are:

- Contributor/agent instructions for durable rules
- Backlog/roadmap for open work
- Changelog/history for completed delivery
- Root and subtree README files for human navigation
- Documentation indexes and subsystem docs for contracts and architecture

Brainstorming decides what should exist; the local context protocol decides where that truth belongs.

### Implementation workflows

After design acceptance, hand off to the local implementation workflow. Do not prescribe a specific planning or coding skill. The next step may be a plan, a small patch, a prototype, a review, or a backlog item depending on project norms.

### Review workflows

When the design is risky, broad, or security-sensitive, request an evidence-grounded review before implementation. A good review handoff names the artifact, assumptions, alternatives rejected, and open risks.

### Execution loops

When the accepted direction contains many small tasks, define stop conditions and let the local execution process iterate. Brainstorming should not become the execution loop itself.

## Inquiry Lens

Use this when the user is exploring a topic, policy, technical direction, market, literature area, or problem space and the right question is not yet clear. Brainstorm is a form of research when it shapes inquiry before evidence collection.

Guide toward:

- Research or exploration question
- Scope boundaries and non-goals
- Known assumptions and uncertainty
- Evidence needed to answer the question
- Likely source classes or stakeholders
- Contradictions to look for
- Decision the research should support
- Stop condition for "enough research"

Prefer Socratic guidance when the user expresses uncertainty. Ask genuine questions that expose assumptions; do not lead the user to a predetermined conclusion. Good layers are:

1. Clarify the interest or decision.
2. Probe assumptions and definitions.
3. Ask what evidence would change the answer.
4. Explore alternative perspectives or counter-examples.
5. Convert the insight into a bounded question, plan, or next slice.

A compact inquiry brief can use:

```markdown
## Inquiry Brief

Question:
Scope:
Assumptions:
Evidence needed:
Likely sources or probes:
Counter-questions:
Decision this supports:
Next slice:
```

Do not run a full research pipeline inside brainstorming. If the question is now clear and the user wants evidence, hand off to the local research, review, or implementation workflow.

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

## Process

### 1. Orient

Read the nearest relevant project context before proposing design:

- Local contributor instructions
- Backlog or roadmap
- Root README and relevant subtree README files
- Documentation index and relevant docs
- Recent delivery history when shipped baseline matters
- Existing code only when implementation constraints shape the design

For small or conversational work, summarize only the relevant facts. Do not dump context.

### 2. Classify Scope

Classify the request:

```text
Tiny:        obvious design, compact note enough
Small:       one feature/module, few choices
Medium:      needs alternatives and a short spec
Large:       decompose into slices before designing slice 1
Ambiguous:   ask one blocking question first
```

If the request spans independent subsystems, decompose before designing details.

### 3. Clarify

Ask one useful question at a time until the main uncertainty is resolved.

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

### 4. Offer Approaches

Present 2–3 approaches when real trade-offs exist.

For each approach include:

- What it optimizes
- What it costs
- When it fails

Lead with your recommendation.

Compact format:

```text
Recommendation: B.

A. Minimal patch — fastest, but narrow.
B. Modular contract — slightly more work, best future fit.
C. Platform layer — powerful, premature unless X is true.
```

### 5. Present Design

Scale the design to the work.

Cover only relevant sections:

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

Ask for approval when the next step would commit the design into durable docs, backlog, or implementation.

### 6. Choose Artifact

Pick the smallest durable artifact that matches the project:

- No artifact: ephemeral clarification only
- Inquiry brief: research-style question, assumptions, evidence needs, and next probe
- Backlog item: future work only
- Short doc section: small standard/behavior update
- Full spec/design doc: medium or large design
- Architecture/decision note: durable trade-off or boundary decision

Follow existing project naming and location conventions. Do not force a new spec directory. Do not commit unless the user or repository workflow requires it.

### 7. Self-Review

Before handing off, check:

- No `TBD` / vague placeholders unless intentionally marked open
- No contradiction with existing project docs
- Scope is implementable as one slice, or explicitly decomposed
- Terminology matches local vocabulary
- Optional vs mandatory modules are labeled honestly
- Data/state ownership is clear
- Validation path is named

### 8. Handoff

End with the next concrete step:

- “Approve this direction and I’ll implement it.”
- “I’ll add this to the backlog.”
- “I’ll draft the documentation section.”
- “Next step is a focused implementation plan.”
- “Next step is evidence review before implementation.”

## Design Quality Heuristics

A good brainstormed design is:

- Easy to remove if wrong
- Easy to test in isolation
- Honest about ownership
- Honest about what is optional
- Small enough to ship
- Compatible with existing project memory
- Clear about what it refuses to solve

Warning signs:

- New ontology for one local edge case
- Hidden indexer or service dependency
- Optional module presented as framework core
- Callback/action ownership unclear
- “Generic platform” proposed before a second real user exists
- Design doc duplicates facts already owned elsewhere
- Backlog closes work that only docs discussed but implementation did not land

## Visual Aids

Use visual aids only when the decision is genuinely visual: UI layouts, diagrams, flows, spatial comparisons, or architecture maps.

Do not interrupt text-first brainstorming with visual tooling for conceptual choices.

If a local visual companion exists, offer it once before using it:

```text
Some of this may be easier with diagrams or mockups. Want a visual companion, or should we keep it text-only?
```

If no such tool exists, use concise ASCII diagrams or Markdown sketches.
