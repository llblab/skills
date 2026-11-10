---
name: active-drying
description: Active, evidence-driven project refinement in two modes — proactive complexity control during growth and postactive refinement after it. Use for active-drying, drying, post-growth cleanup, architectural distillation, semantic density, or making a project leaner and more elegant beyond DRY. Examines models, decomposition, ownership, state, APIs, dependencies, runtime work, tests, tooling and docs to reduce total complexity and the cost of change without weakening useful behavior or guarantees.
---

# Active Drying

Expose the project's muscle: useful behavior, explicit invariants and clear ownership. Remove accidental mass and reshape what remains so that each concept does more useful work with less machinery. Deduplication is the floor, not the goal.

The target is **less total complexity per unit of useful capability**, not fewer lines. Semantic density means that a reader can recover the important behavior and invariants from fewer independent concepts and fewer places. It does not mean compressed syntax, hidden conventions or clever code.

Ask both: **“Does this earn its place?”** and **“What representation or boundary would make the same capability clearer, safer and cheaper to change?”**

## Scope and Composition

This skill supplies an optimization lens, not new authority. The active execution contract still owns permissions, scope, validation and stopping. Architecture, interface, security, media and other domain guidance retain their own constraints. Review-only work remains review-only; a simplification finding is not permission to implement it.

- Preserve required behavior, public contracts, data, compatibility, accessibility, security, failure handling and operational guarantees unless the user explicitly authorizes a change. Distinguish cleanup from product removal or migration.
- Preserve unrelated work and user-owned changes. An authorized source refactor is not permission for destructive working-tree cleanup, history rewrites or data deletion.
- Compose through evidence and owned responsibilities, not a hard-coded roster of sibling skills. Use the applicable architecture, implementation, review and context workflows; do not duplicate their protocols or weaken their required checks.
- A growth workflow still owns its goal, backlog, sequencing and continuation. Active Drying can refine a completed slice or constrain a current one; it does not create a second scheduler, endless cleanup loop or parallel backlog.
- Follow the project's existing documentation and packaging conventions. Do not replace removed code with a larger process, framework or report system.

## Operating Modes

Select from the user's intent; state the mode only when it prevents ambiguity.

- **Proactive guard (during growth)**: Apply the same questions to the current design or diff before unnecessary complexity lands. Prefer the simpler adequate model now. Stay within the feature's affected closure; do not derail delivery into unrelated cleanup or reopen settled decisions without new evidence.
- **Postactive refinement (after growth)**: Inspect the requested project or subsystem, find where growth left duplication, weak models, accidental coupling or unnecessary work, and implement the strongest justified improvements when authorized. Work in coherent, independently verifiable slices, not a repository-wide rewrite.

An audit or review request applies either lens without mutations. A direct request to dry or refine authorizes scoped implementation, not removal of required capabilities. If no target is given, use the active project's current work as the initial boundary and state that scope rather than assuming every repository is in play.

## 1. Establish What Must Survive

Read project instructions, current work, relevant plans and the implementation before diagnosing bloat. Trace the affected behavior through its callers, contracts, configuration, tests and operational paths. For a project-wide request, map the major responsibility areas before choosing the first slice; deep inspection follows actual dependencies.

Establish a compact baseline:

- **Useful capability**: What do users, callers and operators rely on?
- **Invariants**: Which safety properties, edge cases, error behavior, compatibility and performance budgets must survive?
- **Ownership and authority**: Where are state, policy, lifecycle and public contracts defined? Which copies are authoritative versus derived?
- **Pressure**: What concretely makes this harder to understand, change, validate, run or operate than it needs to be?
- **Evidence boundary**: What can be inspected and validated now, and what remains unknown?

Do not infer dead code from one search with no hits. Check exports, dynamic registration, configuration, serialization, generated consumers, platform/feature variants and supported external use where relevant. One visible caller does not make a public contract private. Unknown usage is a reason to investigate or defer, not a deletion proof.

## 2. Examine Structure, Not Just Repetition

Apply every relevant lens within the declared scope. Record a material opportunity, an explicit reason to keep the existing shape, or a validation gap. “Not inspected” is not “clean.” This is a reasoning checklist, not a requirement to produce a document per lens.

- **Capabilities and paths**: Is one useful outcome spread across competing implementations, half-retired paths or unnecessary intermediate stages? Can one supported path replace them without losing a distinct promise?
- **Duplication and commonality**: Is the same rule maintained independently, or does similar syntax represent different policies? Consolidate shared meaning at its owner, not merely matching lines. A little local repetition can cost less than coupling things that evolve independently.
- **Domain model**: Can a better representation eliminate branches, flags, sentinel values, conversion ladders or invalid states? Encode a real invariant once instead of repeatedly repairing symptoms. Keep genuinely different concepts distinct.
- **State and lifecycle**: Which state is authoritative, derived, cached or duplicated? Can derivation remove synchronization and invalidation work? Keep caches, persistence and redundancy that serve demonstrated latency, recovery or correctness needs.
- **Decomposition and ownership**: Do boundaries follow independent reasons to change, or incidental file structure? Would merging reveal one cohesive responsibility? Would extraction isolate a real invariant, policy or dependency? Count coupling and change spread, not files.
- **Contracts and variation**: Do parameters, callbacks, exports, flags and configuration describe real supported variation? Could a narrower contract or finite set of variants replace a generic mechanism? Preserve public compatibility and operational escape hatches that still have a job.
- **Abstractions and dependencies**: Which wrappers, adapters, registries, frameworks or libraries remove more complexity than they introduce? Prefer existing native capabilities where they fit. Do not replace a mature dependency with home-grown machinery merely to reduce dependency count.
- **Data and execution flow**: Can an algorithm, query, representation or pipeline remove repeated work, allocation, I/O, conversion or coordination? Improve the actual path rather than shifting cost to callers, startup, memory, build time or another service.
- **Failure and operations**: Are validation, retries, fallbacks, logging and recovery located at the correct boundary? Remove duplicate work only after proving it redundant; preserve trust-boundary checks, useful context, idempotency and diagnosability.
- **Tests and evidence**: Does coverage express the current invariants, meaningful input classes and supported regressions, or mirror obsolete implementation structure? Consolidate redundant fixtures only when equivalent protection remains. Never simplify by deleting failing checks or lowering the bar.
- **Tooling, configuration and docs**: Can a canonical source replace hand-synced scripts, settings, generated artifacts or contradictory instructions? Remove stale paths only with their consumers accounted for. Keep setup, delivery and recovery discoverable.
- **User and operator surfaces**: Is complexity merely pushed onto the person using the system? Simplify task order, concepts and states without hiding errors, removing access, changing product behavior or replacing an established design system gratuitously.

Inspect interactions between lenses: deduplicating code can worsen ownership; caching can reduce runtime work while increasing state complexity; a smaller API can move branching into every caller. Optimize the whole affected path, not one file's appearance.

## 3. Admit Only Demonstrable Improvements

For each serious candidate, identify:

- **Pressure and location**: The observed duplication, coupling, ambiguity, work or maintenance burden.
- **Simpler shape**: The specific cut, merge, representation change, extraction, reuse or algorithmic change; compare it with leaving the code alone.
- **Preservation**: The behavior and guarantees that must remain, including who consumes the old shape.
- **Net gain**: Which concepts, independent decisions, state copies, dependency edges, update sites or runtime work disappear, and what new costs appear?
- **Falsification**: The check, traced call path, representative change or measurement that could show the replacement is wrong or not simpler.

Keep this implicit for obvious local changes. Use a short note for material architecture or performance trade-offs, not a mandatory scoring sheet.

Prefer high-leverage changes at the owning model or boundary over many symptom edits. Deletion, inlining and reuse are often the first moves; decomposition, stronger types or a small explicit adapter may legitimately add lines while removing distributed complexity. Do not stop at DRY if a better representation can remove the reason the duplicated logic exists.

Treat elegance as a hypothesis. A candidate earns implementation only when structural evidence or measurement supports a net gain and the active contract permits it. No-op is a valid winner. Unresolved public-consumer, data or safety questions block that candidate, not every unrelated safe improvement.

### Decomposition Test

Before adding or removing a boundary, answer:

1. **Owner**: Can the resulting responsibility be named precisely, with explicit exclusions?
2. **Locality**: Will an actual supported change or invariant require fewer coordinated edits or less cross-boundary knowledge?
3. **Interface**: Is the boundary narrower and more stable than the internals it hides? Passing most of the host's state and callbacks is usually relocation, not separation.
4. **Direction**: Does dependency flow stay clear and acyclic, without reach-through into composition roots or a new shared bucket?
5. **Economics**: Does isolation, reuse, testing or clarity repay the navigation, wiring and indirection it introduces now?

A second consumer is one justification, not the only one: isolation of an existing safety rule, volatile dependency or independent lifecycle can also earn a boundary. A long file alone cannot. Merge units that always change together when the split adds no useful protection. Do not force domain and orchestration concerns together merely to reduce file count.

## 4. Refine in Verifiable Slices

Choose a coherent slice with a clear preservation boundary and decisive validation. Batch low-coupling improvements when they share that boundary; sequence changes whose correctness depends on one another. Do not mix speculative redesign, formatting churn and unrelated repairs into the slice.

- Reuse already-valid analysis, decisions and validation. Refresh only what the change invalidates.
- Prefer incremental transformations that keep the project runnable. A broader refactor is justified only when smaller cuts cannot remove the observed cause.
- Update callers, tests, configuration and documentation affected by the new shape. Remove superseded scaffolding and stale alternatives when their retirement is authorized; do not leave two competing sources of truth.
- In guard mode, compare the proposed addition with a simpler adequate form before introducing a new abstraction, state owner, dependency, extension point or configuration knob. New machinery should name the present requirement it satisfies, not hypothetical future flexibility.
- If verification rejects a transformation, revise or undo only that task's change. A cleaner-looking diff does not excuse altered semantics or weaker guarantees.

Do not apply a fixed deletion percentage, line budget, abstraction quota, number of passes or mandatory new dependency. No minification, code golf, opaque metaprogramming, universal helper, one-class-per-file rule or architecture for its own sake.

## 5. Prove Preservation and Net Gain

Use the applicable implementation's required checks and native evidence methods. Do not impose a new test framework on work whose owning workflow uses other validation. Green checks alone do not establish architectural improvement; structural arguments alone do not establish behavioral preservation.

Check both sides:

- **Preservation**: Exercise the relevant accepted/rejected inputs, edge states, errors, compatibility, side effects and lifecycle behavior. Follow contracts through call sites; add the smallest missing regression protection when the owning workflow permits and requires it. Disclose pre-existing failures and remaining uncertainty.
- **Structural gain**: Show a concrete before/after: several independent policy decisions become one owner, synchronized fields become a derivation, a change touches one boundary instead of several, or an unnecessary stage disappears. Check that complexity did not move into configuration, generated code, callers or operations.
- **Performance gain**: When claiming speed, memory, I/O, startup, build or bundle improvement, measure a representative workload against a comparable baseline and note trade-offs. Do not call fewer lines or a plausible complexity estimate a measured speedup.
- **Comprehension**: Walk a real use case and one relevant change through the retained design. Can the reader locate the policy, understand state transitions and see failures without chasing aliases or hidden conventions? Clear explicit code beats a denser puzzle.

Use independent review for consequential changes when useful and available, especially to challenge accidental contract loss and complexity relocation. Reconcile evidence, not votes. Update existing context surfaces where reality changed; do not create documentation ceremony merely to celebrate a refactor.

## Stop and Handoff

Stop at an evidenced local fixed point: the completed slice preserves its obligations, its retained changes have a concrete net benefit, and no known in-scope candidate can currently be justified and safely validated at worthwhile cost. Do not keep renaming or reshuffling a sound design because another arrangement is possible.

When a task bound, missing evidence or required owner decision prevents further work, report that limit rather than claiming the whole project is dry. A long-running caller decides whether another slice should run; this skill does not schedule itself.

Report only useful signal:

- **Scope and mode**: What was examined; explicitly distinguish a slice from a project-wide assessment.
- **Before → after**: The material structural improvements and why the result is easier to understand or change. Counts can support the explanation, not substitute for it.
- **Preserved and checked**: Retained contracts, validation run and remaining limits; separate measured runtime gains from structural gains.
- **Kept or deferred**: Important complexity that still earns its place, or a candidate blocked by evidence, compatibility or scope.

If nothing should change, say so with the decisive reason. Successful drying can leave more explicit code and fewer concepts; it never requires a smaller diff statistic at the expense of a stronger project.
