---
name: minimal-sufficient-work
description: MSW — Necessity, evidence, scope, and local-termination protocol for software work. Use during implementation, debugging, refactoring, test changes, code review, review remediation, configuration, build, CI, schemas, migrations, and validation. Bind the active contract before mutation; admit only work whose omission leaves an obligation unmet or insufficiently evidenced; execute reliable deletion-minimal acts; stop when the final retained state verifies the local contract.
---

# MSW — Minimal Sufficient Work

Use MSW to govern work admission, evidence, retained-state minimality, and local termination for the active software task. It does not select later work, prescribe technical methods, or define authority precedence.

MSW means **Minimal Sufficient Work**, not *Minimum*. Omission and deletion can establish that no known remaining act is necessary and no known retained change is removable within the inspected relevant closure. It cannot establish that no radically different, globally smaller solution exists.

In this skill, **verified** means sufficiently evidenced for the active contract and inspected relevant closure. It does not mean mathematical certainty.

Applicable authorities govern the outcome, obligations, constraints, permissions, safety boundaries, technical method, required evidence, and exact limits; MSW never overrides them. Recommendations, stylistic aspirations, examples, and numeric heuristics create no obligation or limit unless an applicable authority gives them normative force.

## Authority and Evidence

Resolve authority using the precedence supplied by the execution environment and the governed artifact. MSW does not define, replace, or reorder that precedence.

Classify each source by function rather than form:

- **Authority** defines an obligation, constraint, permission, safety boundary, required artifact, proof requirement, or exact limit.
- **Evidence** supports or falsifies a claim about an obligation.
- A source may serve as authority, evidence, or both when the governing context gives it those roles.

An observation may reveal an applicable authority or a preservation duty. It does not become authority merely because it was observed.

**Attended** means a task owner can answer within the current execution. **Unattended** means no such answer is available before the execution must terminate.

When authorities materially conflict:

- Proceed with a safe useful subset only when the conflict cannot affect that subset.
- In attended work, request the missing owner decision when the conflict blocks further safe progress.
- In unattended work, halt `BLOCKED` and report the conflicting authorities and the unresolved choice.

## Kernel

```text
A ← resolve applicable authorities using externally supplied precedence
C ← bind(active outcome, A)
E ← inspect relevant closure(C)

loop:
    C ← amend only from:
         - an authoritative change;
         - a newly discovered applicable authority; or
         - a preservation duty entailed by existing authority
           and concrete evidence
    record every contract delta

    O ← obligations(C) not sufficiently evidenced by fresh E

    if O = ∅:
        R ← retained changes known removable while preserving C
             and all evidence required in the final state

        if R = ∅:
            halt VERIFIED

        delete R
        E ← refresh only evidence invalidated by deletion
        continue

    K ← material candidate claims against O from:
         - open obligations;
         - observed failures; and
         - externally supplied claims

    D ← adjudicate K as:
         ADMITTED | REJECTED | DUPLICATE | UNRESOLVED

    X ← obligations in O for which an ADMITTED claim provides:
         - an authorized executable closing act; or
         - an authorized executable evidence-producing act

    if X = ∅:
        halt BLOCKED with open obligations and exact blockers

    W ← a reliable deletion-minimal act set derived from ADMITTED claims
         whose successful execution would close or adjudicate X

    w ← the next dependency-ready act in W
    execute w within C and A
    E ← refresh the affected relevant closure and evidence

on an applicable external execution bound before the local fixed point:
    halt FUSED

on explicit external stop or redirect:
    halt EXTERNAL_STOP

report
