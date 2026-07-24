---
name: gcfmos
description: Use automatically in any active software project, even when installed globally, to detect new or reshaped feature work and permissionlessly create, evolve, split, merge, and retire project-local Feature Meta-Organ Skills.
---

# GCFMOS

GCFMOS is the **Genesis Creator of Feature Meta-Organ Skill**: a system-level, auto-activating generator and gardener of project-local delivery organs.

When discoverable by the agent, GCFMOS is active in every project the agent works on. It does not need to live in the repository, be named by the user, or be invoked as a command. Project work plus a detectable feature is enough.

An **FMOS** (**Feature Meta-Organ Skill**) is a compact delivery organ for one evolving feature. It keeps the feature moving across repository reality, decisions, slices, evidence, handoffs, and completion. It owns the delivery feedback loop, not the code, specification, backlog, or project history.

## Standing Mandate

GCFMOS continuously applies this loop during active project work:

```text
detect project → detect feature → reuse or spawn FMOS
  → let FMOS drive delivery → evolve, merge, split, or retire
```

Re-evaluate whenever work enters a repository, a new feature appears, scope changes materially, an implementation exposes a distinct delivery loop, or a handoff would otherwise lose context. Do not wait for an `EPIC` label or a request to create a skill.

A global or project installation grants standing permission for local, reversible FMOS lifecycle edits in every detected project. Absence from the repository is not an opt-out. Only an explicit user or project instruction to disable or constrain GCFMOS overrides this mandate.

GCFMOS acts only while an agent is already working. It claims no daemon or hidden background process. Credentials, publication, releases, purchases, account changes, and other irreversible external effects keep their normal approval gates.

## Kernel

Preserve these invariants:

1. **Spawn by default.** When a feature probably needs continuity across multiple meaningful steps, create a minimal FMOS early; deletion is cheaper than repeatedly reconstructing the feature.
2. **Keep truth with the project.** Code, tests, specifications, plans, issues, architecture, commands, and history remain canonical. An FMOS links to and may update those surfaces through normal project work; it does not clone them.
3. **One organ, one loop.** One materially distinct feature-delivery feedback loop gets one FMOS. Reuse, split, and merge by function, not by naming similarity.
4. **Act without ceremony.** Do not ask for confirmation before creating, refining, registering, merging, or retiring a local FMOS when the change is reversible and project-consistent.
5. **Preserve direction.** Current user intent outranks project instructions; project truth owners outrank FMOS method. Use judgment inside those boundaries instead of converting every ambiguity into a question.
6. **Keep memory bounded.** Promote durable knowledge to its canonical owner and delete stale working memory.
7. **Keep roles directional.** GCFMOS creates and gardens FMOS organs. An FMOS drives one feature and never governs GCFMOS or spawns siblings itself.

## Project Discovery

Before spawning, discover enough of the host to act correctly:

- Project root and active instructions;
- Local skill or extension location and discovery mechanism;
- Canonical plan, issue, roadmap, or other open-work surface;
- Owning specification, architecture, code, tests, and release history;
- Shared commands, validators, and nearby successful skills.

Infer conventions from the repository. Do not ask where to place an FMOS when the answer is discoverable. If the project has no skill convention, use the smallest discoverable local form, normally `.agents/skills/<name>/SKILL.md`, without inventing a second planning or registry system.

Generated FMOS organs always live in the owning project, even when GCFMOS is installed globally. A repository-local GCFMOS may adapt the system installation to that host, but local presence is optional. Project-specific paths, commands, and policy stay in the project or child FMOS, not in the portable parent.

## Feature Detection

A feature deserves an FMOS when it forms a coherent outcome with its own recurring delivery loop. Strong signals include:

- A named feature, capability, migration, integration, release outcome, or coherent objective inferred from repository work;
- Multiple implementation slices, subsystems, sessions, or agents;
- Feature-specific sequencing, validation, safety, evidence, or handoff pressure;
- Recurring reasoning that would otherwise be reconstructed;
- A working model richer than one backlog item but smaller than a project-wide method.

Skip only obvious one-shot edits, isolated mechanical changes, unactionable ideas, and work already fully governed by an existing organ or capability skill. Uncertainty favors a small FMOS, not a permission prompt.

Before materialization, name the loop in one sentence. Its material identity is:

```text
feature scope + trigger + truth owners + delivery loop + decisive gates + retirement condition
```

## Reuse and Proliferation

Search existing skills, especially those marked `fmos: true`, before creating another organ.

- Reuse an FMOS when the identity and feedback loop match.
- Refine it when the same feature exposes a recurring missing route or decision rule.
- Compose a capability skill when the missing method belongs across features.
- Split when one organ now contains independently triggered loops or different gates.
- Merge when two organs converge on the same material identity.
- Spawn immediately when a new feature has a distinct loop and no clear home.

Reuse compresses the graph; it does not suppress justified proliferation. Do not use numerical similarity thresholds. State the concrete overlap or separation.

Immediately before writing, re-read the project and current FMOS set. If another agent created an equivalent organ, converge on one and preserve only genuinely distinct method or insight.

## FMOS Creation

Use a compact role-first name, normally `<feature>-delivery`. Every FMOS must begin with this frontmatter:

```yaml
---
name: <feature>-delivery
description: <one-sentence feature-delivery responsibility>
fmos: true
---
```

`fmos: true` is the stable discovery marker. Do not omit it.

The body should contain only what helps the organ act:

```markdown
# <Feature> Delivery

Canonical work: <stable link, issue, plan section, or exact outcome>

## Mission and Scope

## Truth Owners

## Delivery Loop

## Evidence and Gates

## Working Memory and Handoff

## Evolution and Retirement
```

Adapt or collapse sections freely. A useful FMOS establishes:

- The feature outcome and exclusion boundary;
- Canonical surfaces and shared capabilities it must consult;
- The recurring loop by which it selects, executes, validates, and reconciles work;
- Feature-specific evidence, gates, failure modes, and handoff rules;
- Its completion and retirement condition.

Do not copy task lists, specifications, commands, implementation maps, generated values, or release history into the FMOS. Link to their owners and keep the organ procedural.

Create and register the FMOS in the same change when the host has an index. Seed it from current repository reality, not an abstract template. Then activate it and continue the feature work that triggered genesis. Run the host validator when available; otherwise verify that the metadata parses, the organ is discoverable, links and owners are intelligible, `fmos: true` is present, and no shadow backlog or duplicate truth surface was created.

## FMOS Operating Contract

An FMOS should behave as an autonomous feature-local controller:

```text
read current reality
  → refresh the feature model
    → choose the highest-leverage next slice
      → implement or route through project capabilities
        → validate and interpret evidence
          → reconcile canonical surfaces
            → continue, hand off, or close
```

On activation, it reads the user's current direction, relevant project truth, prior evidence, and its own bounded working memory. It then acts on the feature rather than merely describing a plan.

It may choose the next slice using declared goals, dependencies, risk reduction, unlock value, reversibility, and validation cost. It may make ordinary reversible implementation and sequencing decisions without approval. Ask only when a required choice carries a material irreversible effect, external authority, unavailable credential, or genuinely underdetermined product commitment that project evidence cannot resolve.

The FMOS keeps completion conditions visible, updates canonical plans or documentation when repository evidence changes them, and prefers closing the active feature over unrelated polish when user direction allows. It stops when the outcome closes, a real gate blocks progress, or the user redirects work.

An FMOS may improve its own method after a slice when a recurring ambiguity, dead end, unsafe shortcut, missing route, or evidence mistake would otherwise recur. It may not absorb unrelated project coordination or become a general workflow engine.

## Working Memory

Create `INSIGHTS.md` only when the feature benefits from temporary pre-consolidation memory. Keep entries terse:

```text
finding → evidence → delivery consequence → destination or retirement condition
```

Suitable entries include falsified assumptions, unresolved design pressure, recurring traps, cross-slice dependencies, and evidence gaps. Exclude raw logs, transcripts, commit diaries, copied tasks, current hashes, and stable facts already owned elsewhere.

After meaningful slices, promote mature truth to specifications, architecture, backlog, code, tests, or release history, then prune the entry. The file should remain readable as one checkpoint.

## Gardening

During project work, GCFMOS scans the active FMOS set and applies lifecycle changes without ceremony:

- **Refine** when evidence improves one feature loop.
- **Split** when one FMOS hides multiple independently activated loops.
- **Merge** duplicates or converged organs.
- **Generalize** a method only after concrete cross-feature reuse appears.
- **Retire** an FMOS when its feature closes and no distinct ongoing delivery or operations loop remains.

At retirement, move remaining truth to canonical owners, promote or delete working memory, remove the FMOS, and update discovery surfaces in the same change. Do not preserve dead organs as trophies, and do not create separate organ registries, wisdom stores, synchronization ledgers, or TTL machinery when the host already provides ownership surfaces.

GCFMOS may refine its own portable creation and lifecycle method when repeated real-world friction exposes a better rule. It must not absorb child feature knowledge or hardcode one project's topology.

## Completion Signal

Report lifecycle work compactly: which feature loop was detected, whether an FMOS was reused or created, where it lives, what canonical surfaces it follows, and what validation or gate remains. Do not turn the report into another planning artifact.
