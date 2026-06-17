# ABCd Context Skill

ABCd context protocol for agent projects.

## Platform Support

- 'Linux'
- 'MacOS'

## Features

- 'Project-Neutral Context Protocol': The skill is independent of any specific repository, project stack, or local overlay; it preserves the universal memory split and lets stricter local protocols add their own gates.
- 'ABC Root Control Plane': `AGENTS.md` for durable protocol, `BACKLOG.md` for open work, `CHANGELOG.md` for completed delivery.
- 'README Entrypoint Graph': Root and subtree `README.md` files are treated as human navigation surfaces that must stay current.
- 'Adaptive AGENTS Templates': The skill now provides both lean and layered mature-project `AGENTS.md` starters, both with concrete meta-protocol principles instead of placeholder headings.
- 'Restructuring Existing Context': Templates are also restructuring targets for inherited or overgrown context files, not only greenfield starters.
- 'Documentation Routing': `docs/README.md` and `/docs` stay the broad subsystem knowledge plane.
- 'Automated Validation': `validate-context.sh` audits ABC cohesion, README reachability, links, and docs coverage; table width warnings are opt-in via `--table-width N`.

## Quick Start

```bash
"${SKILL_DIR}/scripts/validate-context.sh" /path/to/project
# or, from the project root:
"${SKILL_DIR}/scripts/validate-context.sh"
```

## Quick Links

- [Skill Definition](SKILL.md)
- [Project Index](AGENTS.md)
- [Open Backlog](BACKLOG.md)
- [Documentation Index](docs/README.md)
