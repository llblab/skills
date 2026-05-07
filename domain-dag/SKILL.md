---
name: domain-dag
description: Validates and guides Domain DAG architecture for domain ownership, acyclic local dependency graphs, composition roots, boundary direction, and shared-bucket drift. Use when auditing, refactoring, or extending modular codebases.
metadata:
  version: 1.0.5
---

# Domain DAG

## Purpose

Maintain source code as a directed acyclic graph of cohesive domain modules.

A Domain DAG keeps architecture readable by making every module answer three questions:

1. **What does this module own?**
2. **Which lower or peer domains may it depend on?**
3. **Which responsibilities must not be pulled into it?**

## Core Model

```text
composition root
  → feature/domain modules
    → focused support domains
      → platform or standard-library boundary
```

The filesystem may stay flat. The graph is architectural, not decorative: ownership lives in module boundaries, import direction, and explicit contracts.

## Axioms

### A1: Domain Ownership

Each durable responsibility has one owning module or package. Types, constants, helpers, adapters, and state that define a responsibility live with that owner.

### A2: Directed Imports

Local imports must form a DAG. Cycles are architecture bugs because they hide ownership and make change impact non-local.

### A3: Composition Root Boundary

Entrypoints wire live ports, configuration, adapters, and domain runtimes. Domain modules must not import composition roots.

### A4: Shared Bucket Resistance

Files or folders named `types`, `constants`, `utils`, `helpers`, `shared`, or `common` are suspect. Use them only when the responsibility is genuinely cross-domain and cannot belong to a more specific owner.

### A5: Boundary Contracts Over Concrete Reach-Through

When a domain needs another domain's behavior, prefer a narrow explicit contract or port over importing broad mutable runtime state.

### A6: Progressive Disclosure

Start with the smallest useful graph. Add layers, forbidden edges, and custom checks only after real project constraints make them valuable.

## Validation

Run the bundled validator from a project root:

```bash
SKILL_DIR=/path/to/domain-dag
bash "${SKILL_DIR}/scripts/validate-domain-dag.sh" --root .
```

Useful flags:

- `--root <path>` — project root; defaults to the current directory
- `--config <path>` — JSON config; defaults to `domain-dag.config.json`, then `.domain-dag.json`
- `--strict` — treat warnings as failures
- `--json` — machine-readable output

The validator checks:

- Local source import graph has no cycles
- Domain modules do not import configured entrypoints
- Optional domain headers are present
- Shared-bucket filenames and folders are reported
- Optional flat-root, layer-order, and forbidden-edge rules hold

## Configuration

Add a project-local `domain-dag.config.json` when defaults are too broad or too narrow:

```json
{
  "sourceRoots": ["src", "lib"],
  "entrypoints": ["index.ts", "src/index.ts"],
  "requireHeaders": true,
  "headerPattern": "\\b(Domain|Domains|Zones|Owns)\\s*-\\s*\\S",
  "headerSeverity": "warn",
  "flatRoots": false,
  "sharedBucketSeverity": "warn",
  "forbiddenEdges": [
    {
      "from": "src/domain/**",
      "to": "src/app/**",
      "severity": "error",
      "message": "Domain layer must not import app layer"
    }
  ],
  "layers": [
    {
      "name": "foundation",
      "rank": 0,
      "files": ["src/platform/**"]
    },
    {
      "name": "domain",
      "rank": 1,
      "files": ["src/domain/**"]
    },
    {
      "name": "composition",
      "rank": 2,
      "files": ["src/app/**", "index.ts"]
    }
  ]
}
```

Layer rule: lower ranks must not import higher ranks. Same-rank and downward imports are allowed.

## Operating Protocol

1. Identify the composition root and domain roots
2. Build or update the ownership map
3. Run `scripts/validate-domain-dag.sh`
4. Fix hard failures before cosmetic refactors
5. Move misplaced types/constants/helpers to their owning domain
6. Replace broad concrete reach-through with narrow ports when dependency direction is wrong
7. Add custom forbidden edges only after a real boundary has been violated

## Output Policy

- **Failures**: Cycles, entrypoint reach-through, invalid configured layer edges, invalid configured forbidden edges
- **Warnings**: Missing headers, shared-bucket candidates, flat-root drift when configured as warning
- **Pass**: The checked graph is acyclic and configured boundary rules hold
