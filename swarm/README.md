# Swarm

Portable protocol for subagent orchestration: focused cognitive lenses, scoped locks, quorum review, clean-context merge, post-merge review, and async adapter contracts.

## Start Here

- [Skill Protocol](./SKILL.md)
- [Project Context](./AGENTS.md)
- [Open Backlog](./BACKLOG.md)
- [Changelog](./CHANGELOG.md)
- [Documentation](./docs/README.md)
- [Adapter Usage](./docs/adapters.md)
- [Small-Team Development Swarm](./docs/development-swarm.md)
- [Minimal Skill Manifest Candidate](./docs/skill-manifest.md)

## Core Model

```text
one agent        = one focused lens
many lenses      = stronger judgement
parallel lenses  = faster wall-clock work
lens swarm       = different lenses for breadth
quorum           = one lens, independent judges for confidence
swarm semantics  = quorum, locks, merge discipline
command template = local execution shape
template job     = local async lifecycle envelope
task card        = bounded implementation assignment
integrator       = one actor that merges isolated branches/worktrees
```

Swarm stays portable by describing contracts, not concrete tool registries, local model aliases, or `pi -p` runners. Local adapters may bind those contracts to command templates, template jobs, or registered tools.

For 2–4 implementation agents, use MAWP: isolated branches/worktrees, task cards with allowed/avoided files, optional `.agents/locks.md`, bounded conflict reports, and one integrator merge. Prefer behavior/test/docs/integration role separation and forbid silent scope expansion.
