# Component Capability Contract

Swarm is a high-level catalog of coordination patterns. It should not depend on a concrete automation extension, command runner, tool registry, or recipe store. Instead, Swarm targets abstract component capabilities that local adapters may implement however they want.

## Boundary

- Swarm names coordination capabilities and expected semantics.
- Local adapters bind those capabilities to concrete tools, recipes, command templates, async runs, model aliases, files, or services.
- The same Swarm pattern should work if the local implementation changes, as long as the component contracts are preserved.
- Portable Swarm docs must not require a specific sibling extension or local registry layout.

## Common Component Classes

### Launcher

Starts one bounded subagent task.

- Inputs: prompt/task, model or agent selector, tool policy, optional scope.
- Output: raw branch output or artifact path.
- Failure: branch-local unless the coordinator marks it critical.
- Non-goal: synthesis or judgement across branches.

### Reviewer

Inspects a target through one declared lens.

- Inputs: scope, lens, evidence rules, output shape.
- Output: findings with evidence, risk, and recommended next action.
- Failure: branch-local for lens swarms; root-critical only for mandatory release gates.
- Non-goal: merge, rewrite, or broad refactor.

### Critic

Attacks assumptions, edge cases, and failure modes.

- Inputs: proposal/artifact, known constraints, risk lens.
- Output: objections, weak assumptions, failure scenarios, and falsification ideas.
- Non-goal: final decision authority.

### Verifier

Checks a claim or artifact against evidence.

- Inputs: claim, evidence/artifact paths, acceptance criteria.
- Output: proven, disproven, unknown, and missing evidence.
- Non-goal: replacing the merger or coordinator decision.

### Merger

Synthesizes multiple branch outputs.

- Inputs: raw outputs, merge mode, severity/risk policy.
- Output: consensus findings, minority findings, contradictions, merger-added claims, and recommended next action.
- Failure: root-critical when no coherent synthesis can be produced.
- Non-goal: inventing unsupported findings.

### Quorum

Runs the same lens/task independently across several agents or models.

- Inputs: stable prompt, model/agent pool, vote policy.
- Output: raw votes and branch outputs suitable for a merger.
- Failure: degraded branch set unless quorum minimum is not met.
- Non-goal: breadth across different lenses.

### Checkpoint

Stops for bounded coordinator input or records branch state.

- Inputs: question/status, options considered, recommended option, preserved state.
- Output: checkpoint artifact or event.
- Failure: degraded branch if same-context resume is unavailable.
- Non-goal: pretending resumability exists when the adapter cannot prove it.

### Follow-up

Continues a branch after coordinator input.

- Inputs: prior state or thread id, coordinator reply, continuation prompt.
- Output: continued branch output or degraded new-branch artifact.
- Failure: explicit degraded mode when context cannot be preserved.
- Non-goal: hidden context reconstruction.

### Judge

Evaluates report or merge quality.

- Inputs: final draft, raw outputs, judging rubric.
- Output: quality verdict, evidence-preservation issues, severity calibration notes, merge-bias risks.
- Non-goal: silently becoming another domain reviewer.

### Normalizer

Converts variable outputs into stable artifacts or event records.

- Inputs: raw output, target schema/section format.
- Output: normalized JSON, Markdown, file path, or event.
- Non-goal: changing meaning or severity.

## Mapping Swarm Shapes to Components

```text
Lens Swarm:       reviewer* → merger → judge
Quorum:           quorum → merger → judge
Research Swarm:   launcher/searcher → verifier → merger → judge
Development:      task card → launcher/implementer → verifier → integrator review
Checkpoint Flow:  reviewer/implementer → checkpoint → follow-up → normalizer
```

The component names above are abstract. A local environment can implement them with saved recipes, command templates, async sessions, shell utilities, hosted agents, or manual handoffs.

## Adapter Requirements

A local adapter should document:

- which component classes it implements;
- how inputs and outputs are represented;
- whether it supports same-context pause/resume;
- how branch-local failures are surfaced;
- where raw outputs and artifacts are stored;
- how cancellation and cleanup work;
- what model/provider names are local aliases.

Swarm should consume that adapter through capabilities, not through concrete implementation names.
