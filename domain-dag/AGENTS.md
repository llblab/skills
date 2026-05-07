# AGENTS.md (domain-dag)

## Knowledge & Conventions

### Meta-Protocol Principles

- 'Domain Ownership': Every durable responsibility should have a single owning source module or package.
- 'Acyclic Direction': Local source imports should form a directed acyclic graph.
- 'Composition Boundary': Entrypoints compose ports and runtimes; domain modules do not import entrypoints.
- 'Transportability': The skill and validator must avoid project-specific names, absolute local paths, and external dependencies.

### Operating Principles

- Use `scripts/validate-domain-dag.sh` for graph audits.
- Prefer config-driven project rules over hard-coded repository assumptions.
- Treat cycles and reverse entrypoint imports as hard failures.
- Treat generic shared-bucket names as warnings unless a project config upgrades them.
- Add custom layer and forbidden-edge rules only for discovered project constraints.

### Discovered Constraints

- Shared-bucket names are heuristic, not proof of bad architecture.
  - Trigger: `utils`, `types`, `shared`, or similar names appear.
  - Action: Audit ownership and either move content to an owner or allow the exception.
- Header labels are a navigation aid, not the graph itself.
  - Trigger: A project lacks module headers but has clean boundaries.
  - Action: Warn by default; use strict/config only when headers are adopted standard.
- Layer checks must be opt-in.
  - Trigger: Generic validation across unknown projects.
  - Action: Validate universal graph invariants by default; enforce local direction only from config.
