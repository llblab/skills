# Swarm

Portable protocol for subagent orchestration: scoped locks, quorum review, clean-context merge, post-merge review, and async adapter contracts.

## Start Here

- [Skill Protocol](./SKILL.md)
- [Project Context](./AGENTS.md)
- [Open Backlog](./BACKLOG.md)
- [Changelog](./CHANGELOG.md)
- [Documentation](./docs/README.md)
- [Adapter Usage](./docs/adapters.md)

## Core Model

```text
swarm semantics  = quorum, locks, merge discipline
command template = local execution shape
template job     = local async lifecycle envelope
```

Swarm stays portable by describing contracts, not concrete tool registries, local model aliases, or `pi -p` runners. Local adapters may bind those contracts to command templates, template jobs, or registered tools.
