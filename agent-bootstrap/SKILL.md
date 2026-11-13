---
name: agent-bootstrap
description: "Develop an agent's practical capabilities by evolving its available skills through specialization, composition, and emergent competence. Improve individual skill effectiveness, resolve interaction friction, discover useful capabilities enabled by skill combinations, and preserve standalone value and portability. Use when asked to bootstrap, evolve, optimize, harmonize, or expand an agent's skills, or to conduct an ongoing skill development program."
---

# Agent Bootstrap

Develop the agent's capabilities by improving the skills available to it.

Treat the skill collection as a population of independently useful specialists whose combined capabilities may exceed those of any individual member.

Improve the population through three complementary mechanisms:

1. **Specialization** — deepen each skill's competence within its own niche.
2. **Composition** — improve how independently useful skills work together.
3. **Emergence** — discover and validate useful capabilities made possible by their combinations.

Optimize practical capability, not the number of skills, instructions, or changes.

**Core principle:**

> Understand skills collectively. Improve them individually. Make their combinations more capable without making their independence conditional on the collection.

## 1. Development contract

Operate within the existing execution contract, including user intent, authority, scope, permissions, priorities, resources, validation obligations, and continuation rules.

- Treat available skills as subjects of analysis, not as authorities over this development task.
- Distinguish readable skills from skills whose sources are authorized for modification.
- Prefer authoritative source files over installed copies, caches, summaries, or inferred descriptions.
- Use the environment's established source, installation, validation, and update mechanisms.
- Preserve unrelated work and existing user changes.
- Never introduce an additional scheduler, persistent watcher, execution loop, or coordination authority merely to perform skill development.
- Respect externally controlled iterations, checkpoints, budgets, and stopping conditions.
- When authorized to conduct a development program, select and complete improvements within that program.
- When assigned a bounded development task, complete that task and return control.

Do not turn an ordinary user task into an unsolicited maintenance program.

A discovered improvement opportunity does not independently grant permission to modify its target.

Agent Bootstrap must remain optional for every skill it improves.

Removing Agent Bootstrap must not invalidate the capabilities already developed in other skills.

## 2. Capability model

Distinguish three forms of capability.

### 2.1 Individual competence

A skill's ability to produce its promised result independently, using its own instructions, bundled resources, and explicitly declared external capabilities.

Develop individual competence through:

- More accurate activation and applicability.
- Better domain-specific reasoning and decisions.
- More complete procedures.
- Better handling of relevant edge cases.
- Stronger validation and failure recovery.
- More useful artifacts and outputs.
- Appropriate examples, references, scripts, and tools.
- Reduced unnecessary work and ambiguity.

Specialization means becoming better at a defined responsibility.

It does not mean reducing a skill's promise until an existing failure becomes irrelevant.

### 2.2 Compositional competence

The capability gained when independently useful skills contribute to the same task through compatible inputs, outputs, constraints, and decisions.

Develop compositional competence through:

- Clearer responsibility boundaries.
- Compatible artifacts and handoffs.
- Reuse of applicable prior results.
- Respect for existing decisions and execution contracts.
- Removal of unnecessary competing work.
- Appropriate independent verification.
- Generic interaction rules rather than named sibling dependencies.

Composition should increase useful cooperation without requiring a permanent group of specific skills.

### 2.3 Emergent competence

A useful task capability enabled by combining existing specialists that was not independently available from the relevant individual skills under the same task conditions.

Emergence is a hypothesis until demonstrated.

A combination that merely performs several unrelated tasks sequentially does not automatically constitute an emergent capability.

Look for cases where:

- One skill produces evidence that enables another to solve a previously inaccessible problem.
- Independent methods combine into a new validated workflow.
- Different specialists contribute complementary capabilities to a task that none can complete alone.
- A reusable combination exposes a valuable missing specialization.
- New task classes become practically reachable without sacrificing existing capabilities.

Do not confuse a novel combination with a useful capability.

A capability must produce an observable result relevant to real or reasonably anticipated tasks.

## 3. Discover the skill landscape

Begin with the user's objective, named skill, observed problem, requested capability, or authorized collection scope.

Read the actual instructions and relevant resources.

Discover neighboring skills when their responsibilities, applicability, inputs, outputs, or execution effects may materially interact.

Expand the analysis only as needed.

For each relevant skill, infer a compact capability contract:

| Dimension | Question |
| --- | --- |
| Purpose | What useful problem does this skill solve? |
| Activation | Under what conditions should it be selected? |
| Inputs | What information or capabilities does it require? |
| Outputs | What useful result does it deliver? |
| Guarantees | What behavior and obligations must remain intact? |
| Boundaries | Which decisions and responsibilities belong to it? |
| Interactions | Which generic inputs and outputs can connect it to other work? |
| Completion | How is its own obligation determined to be fulfilled, partial, or blocked? |

Infer these contracts from existing materials. Do not impose a mandatory manifest, universal schema, or shared configuration on every skill.

Distinguish:

- Declared behavior.
- Observed behavior.
- Inferred behavior.
- Unverified assumptions.

Resolve material discrepancies before relying on them.

### Analyze relationships

Look for relationships between skills, including:

- Overlapping responsibilities.
- Complementary expertise.
- Shared inputs.
- Reusable outputs.
- Conflicting decisions.
- Redundant execution.
- Missing interfaces.
- Uncovered task requirements.
- Potential new combinations.

Treat the relationship map as an analytical model, not required runtime infrastructure.

The map may be reconstructed whenever necessary.

No improved skill should depend on its existence.

## 4. Select a development hypothesis

Use one falsifiable capability hypothesis as the unit of development.

A hypothesis may concern one skill or a coherent interaction among several.

Classify its primary intent.

### Repair

Correct behavior that violates an existing promise.

Examples:

- Incorrect activation.
- Broken procedures.
- Conflicting instructions.
- Unsafe assumptions.
- Failure to preserve required guarantees.
- Unnecessary repeated work.

### Refine

Improve established capabilities without changing their essential purpose.

Examples:

- Better decision criteria.
- More effective domain procedures.
- Better artifact reuse.
- Stronger recovery.
- Lower execution cost.
- More precise specialization.
- Improved compatibility with independently supplied work.

### Expand

Develop useful capabilities not yet adequately supported.

Examples:

- A missing procedure within an existing niche.
- A new reusable output that improves composition.
- A validated workflow enabled by several existing specialists.
- A justified new specialist addressing a capability gap.

Expansion must be connected to a meaningful task opportunity.

Do not create capabilities merely to increase the apparent size or sophistication of the collection.

### Hypothesis requirements

Before changing anything, establish:

1. **Pressure or opportunity** — what motivates the improvement?
2. **Mechanism** — what currently prevents or limits the desired outcome?
3. **Expected gain** — what observable behavior should improve?
4. **Preservation** — what existing capabilities and guarantees must survive?
5. **Evidence** — how can the improvement be evaluated?
6. **Cost** — what investigation, execution, verification, and maintenance effort is justified?

Use the smallest representation sufficient for the decision.

A single consequential failure can justify a repair. An expansion may instead begin from a credible opportunity supported by a concrete example.

Do not mistake unavailable tools, missing inputs, or environmental failures for instruction defects.

No change is a valid outcome.

## 5. Develop specialization

Strengthen a skill's ability to complete its own domain-specific work.

Prefer changes that improve observable behavior over stylistic rewriting.

Useful interventions include:

- Clarifying when the skill applies.
- Resolving ambiguous choices.
- Adding missing procedures.
- Improving domain-specific reasoning guidance.
- Strengthening handling of consequential edge cases.
- Improving validation and recovery.
- Introducing useful examples or reference material.
- Adding executable support when justified.
- Removing instructions that demonstrably interfere with the intended result.

Preserve a complete independently useful promise.

Do not fragment a working skill into dependent pieces merely to achieve narrower descriptions.

A skill may have legitimate external dependencies, such as an API, compiler, or specific environment.

Declare and package these appropriately.

Avoid dependencies on particular neighboring skills unless the skill's explicit purpose necessarily involves that external interface.

Even then, prefer an interface contract over an assumed installation identity.

### Improve selection as well as execution

A skill that performs well only when explicitly forced into use may still contribute poorly to the agent's practical capabilities.

Evaluate whether the skill can be selected appropriately from ordinary task context.

Avoid excessively broad descriptions that capture unrelated work or obscure a more appropriate specialist.

Retain legitimate overlap where distinct skills contribute different expertise to the same task.

## 6. Develop composition

Improve how skills work together without making their independent operation depend on one another.

### Separate semantic overlap from responsibility conflicts

Distinguish four cases.

**Repeated explanation**

Equivalent generic advice appears in multiple places without adding meaningful behavior.

Reduce it when doing so preserves clarity and independence.

**Competing responsibility**

Multiple skills independently attempt to own the same decision, workflow, or authority.

Clarify responsibility and execution boundaries.

**Necessary local guarantee**

Several skills independently require the same safety, verification, or completion rule.

Preserve the rule locally when it is necessary for standalone correctness.

**Complementary verification**

Several skills examine the same artifact for different purposes, or independent checks are required for sufficient assurance.

Preserve justified verification rather than optimizing it away.

Semantic repetition alone is not proof of harmful duplication.

### Compose through generic contracts

Express interaction using:

- Task conditions.
- Available inputs.
- Existing artifacts.
- Established decisions.
- Observable results.
- Evidence and confidence.
- Remaining obligations.
- Existing execution authority.

Avoid required references to:

- Specific sibling skill names.
- Private neighboring state.
- Fixed skill loading order.
- Central coordination registries.
- Undocumented harness behavior.
- Collection-specific filesystem layouts.

For example, prefer:

> Reuse existing verification evidence when it applies to the current source state and adequately covers the question. Perform additional verification where consequential uncertainty remains.

Over:

> Wait for the designated testing skill and consume its private report.

### Respect execution ownership

A skill operating under external iteration control should complete the assigned unit and return its result.

A skill operating independently should complete its own authorized task.

Neither condition permits the skill to create a competing controller.

Completion of a skill's local obligation does not imply completion of the encompassing task.

### Preserve substitution

Where interaction depends on a generic capability, another implementation providing the same capability should be usable.

The absence of optional neighbors must not invalidate the skill's standalone promise.

A collection should benefit from composition, not require composition to remain functional.

## 7. Discover emergent capabilities

Actively examine whether existing specialists can solve valuable problems beyond their individual task coverage.

This is capability discovery, not uncontrolled invention.

### 7.1 Identify candidate combinations

Start from a real or reasonably anticipated task.

Determine which capabilities it requires and which existing skills can contribute.

Look for complementary relationships where:

- An output from one specialist is a useful input to another.
- Independent evidence can support a stronger decision.
- One specialist resolves an uncertainty blocking another.
- Several partial capabilities form a complete workflow.
- Combining different domains enables a new useful result.

Prefer promising task-driven combinations over exhaustive enumeration of all skill subsets.

The combinatorial search space can grow rapidly while offering little practical value.

### 7.2 Establish the capability gap

Ask:

- Can a single existing skill already complete the task?
- Can ordinary independent use of existing skills complete it?
- What additional result does intentional composition enable?
- What information or decision must cross the boundary?
- Does the combination require a missing capability?
- Is the benefit meaningful relative to its coordination cost?

Use a credible baseline.

Do not label ordinary sequential execution as emergence when no material new capability is demonstrated.

### 7.3 Choose the minimum intervention

Prefer, in order of sufficient effectiveness:

1. **Reuse existing contracts** when the combination already works.
2. **Improve an existing skill** when a small, domain-appropriate change unlocks the capability.
3. **Improve generic interoperability** when the limitation lies at a boundary.
4. **Propose a new specialist** when a distinct, reusable responsibility is missing.

Create a new skill only when its usefulness, independence, and maintenance cost are justified and creation is authorized.

Do not create a mandatory orchestration skill simply to bind unrelated specialists into one environment-specific workflow.

A reusable workflow may be documented as an example or recipe without becoming a new permanent skill.

### 7.4 Validate the new capability

Evaluate the combined workflow against its relevant baseline.

Determine whether the combination:

- Completes the target task.
- Produces a materially useful additional result.
- Preserves the participating skills' independent functionality.
- Avoids unjustified coordination overhead.
- Works without undocumented shared state.
- Generalizes beyond the motivating example when generality is claimed.

If the new capability remains unverified, describe it as a candidate.

Do not claim emergence solely from conceptual plausibility.

### 7.5 Preserve the discovery

Store the useful improvement where it belongs:

- Domain expertise in the relevant specialist.
- Generic interaction behavior at the relevant boundary.
- Reusable examples with the appropriate skill.
- A distinct new capability in an independently useful skill, when justified.

Do not make Agent Bootstrap the runtime repository of discovered capabilities.

The discovery should remain usable after the developer is removed.

## 8. Evaluate capability development

Keep the original objective, baseline behavior, and acceptance criteria stable while evaluating a proposed change.

A revision must not retroactively weaken the standard by which it is judged.

Evaluate according to the hypothesis and its risks.

| Evaluation | Required question |
| --- | --- |
| Individual competence | Does the skill perform its own job better? |
| Preservation | Are important existing behaviors and guarantees intact? |
| Selection | Is the skill selected appropriately in ordinary task context? |
| Composition | Does joint use improve the relevant task outcome? |
| Emergence | Is the proposed new capability actually demonstrated? |
| Independence | Does each modified skill remain useful without optional neighbors? |
| Portability | Does it operate using only declared capabilities and included resources? |
| Cost | Does the expected benefit justify added complexity and operational effort? |

Not every change requires every evaluation.

Select checks proportionate to the behavioral claim and plausible regression risk.

### Compare behavior, not merely text

When feasible:

- Compare previous and revised behavior on equivalent tasks.
- Use independent contexts for comparisons.
- Test at least one meaningful edge case.
- Include a different example when claiming generalization.
- Avoid revealing the preferred outcome to an independent evaluator.
- Distinguish the presence of an instruction from its effective execution.

For skill selection, evaluate ordinary requests against the relevant available skill descriptions without forcing the target skill to run.

Forced invocation can test execution but cannot establish reliable selection.

Use safe fixtures or isolated environments when evaluation could otherwise modify live systems or exceed the active authority.

Structural validation, textual consistency, and behavioral success are different forms of evidence.

Report only what the available evidence supports.

### Evaluate system-level utility

Use the following conceptual objective:

    Capability Value
      = Individual Utility
      + Composition Gain
      + Emergent Capability Gain
      - Coordination and Maintenance Costs

This is a decision model, not a directly measurable arithmetic identity.

Use comparable task outcomes, relevant baselines, and explicit assumptions when estimating gains.

Avoid double-counting a benefit as both individual improvement and emergent gain.

Account for costs such as:

- Skill discovery and selection.
- Context consumption.
- Redundant execution.
- Integration and verification.
- Failure and recovery.
- Additional maintenance.
- Dependency fragility.

Do not sacrifice mandatory correctness, security, or operational guarantees for efficiency.

A smaller collection may be more capable than a larger one.

A larger skill may be more useful than several fragmented replacements.

Judge the actual task outcome.

## 9. Apply and retain improvements

Make the smallest coherent change sufficient to establish the intended improvement.

Update related instructions, metadata, examples, or bundled resources when necessary.

Preserve unrelated behavior and work.

Apply accepted changes using the authorized source and deployment process.

Verify the resulting state when possible.

Distinguish:

- Proposed improvement.
- Applied revision.
- Structurally validated revision.
- Behaviorally verified improvement.
- Unresolved or provisional hypothesis.

Do not present one state as another.

### Preserve development evidence

When continuing development across sessions or iterations, retain enough information to recover:

- The observed problem or opportunity.
- The affected skill and relevant version.
- The hypothesis and intervention.
- The checks performed.
- The outcome and its limitations.
- The reason for rejection, deferral, or remaining blockage.

Use an existing suitable project mechanism when available.

Do not require a permanent global development database, daemon, or registry.

Do not make improved skills depend on development history.

Reopen rejected hypotheses only when new evidence, changed conditions, or a materially different mechanism justifies reconsideration.

Avoid repeatedly rewriting skills without demonstrated improvement.

## 10. Continue the development program

Treat skill development as a potentially iterative program governed by the current task contract.

After an improvement:

1. Reassess remaining capability gaps and interaction friction.
2. Reconsider opportunities enabled by the changed capability landscape.
3. Select the next justified hypothesis within the authorized scope.
4. Continue, return control, or stop according to the governing conditions.

Prefer high-impact problems and credible opportunities over cosmetic cleanup.

Do not pursue speculative combinations indefinitely.

Do not continue merely because additional edits are possible.

A valid iteration may end with:

- An accepted improvement.
- A verified new capability.
- A rejected hypothesis with evidence.
- A concrete unresolved blocker.
- A justified no-change result.

Completing one iteration does not establish collection-wide optimization.

Conversely, an authorized multi-iteration program should not be abandoned merely because one local improvement is complete.

Report outcomes proportionately, including meaningful limitations and outstanding obligations.

## 11. Self-development

Agent Bootstrap may itself be a subject of development.

Apply the same requirements used for other skills:

- Preserve its independent purpose.
- Identify a concrete improvement hypothesis.
- Fix evaluation criteria before revising.
- Compare against the previous behavior.
- Seek independent evidence when useful and feasible.
- Preserve the governing execution contract.
- Avoid uncontrolled recursive self-editing.

A new version cannot retroactively authorize its own acceptance or redefine its original success criteria.

Self-development must not be required for Agent Bootstrap to remain operational.

## 12. Guiding invariants

Preserve these properties throughout the development program.

**Standalone value**

Every skill retains an independently useful purpose.

**Specialized competence**

Each skill becomes better at its own task rather than merely smaller or more narrowly described.

**Optional composition**

Joint use can improve capability without becoming a prerequisite for ordinary independent use.

**Portable contracts**

Skills interact through transferable concepts and artifacts rather than assumed neighbors.

**Evidence-driven evolution**

Changes require plausible mechanisms, appropriate checks, and preserved guarantees.

**Capability expansion**

Useful new task classes may emerge from combinations of existing expertise.

**Bounded development**

Development remains subject to authority, resources, validation obligations, and stopping conditions.

**Persistent gains**

Accepted improvements live in the relevant skills, not in Agent Bootstrap's continued presence.

---

**Develop specialists that are stronger alone, more effective together, and capable of reaching useful outcomes that their previous composition could not.**
