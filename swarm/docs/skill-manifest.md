# Minimal Skill Manifest Candidate

This is a design note, not an implementation commitment.

Swarm does not need a broad manifest platform today. If a future `skill.json` emerges, it should start with only fields needed by real swarm adapters, self-tests, docs, and optional tool declarations.

## Candidate Shape

```json
{
  "name": "swarm",
  "version": "1.0.0",
  "description": "Portable subagent orchestration protocol",
  "entrypoints": {
    "skill": "SKILL.md",
    "context": "AGENTS.md",
    "readme": "README.md",
    "backlog": "BACKLOG.md",
    "changelog": "CHANGELOG.md"
  },
  "docs": [
    "docs/README.md",
    "docs/adapters.md",
    "docs/development-swarm.md"
  ],
  "selfTests": [
    "scripts/_self-test.mjs"
  ],
  "scripts": [
    {
      "name": "swarm-lock",
      "path": "scripts/swarm-lock.mjs",
      "purpose": "Scoped lock helper"
    }
  ],
  "optionalTools": [
    {
      "name": "swarm_review",
      "contract": "single subagent review"
    },
    {
      "name": "swarm_quorum",
      "contract": "independent review quorum"
    }
  ]
}
```

## Field Rationale

- `name`, `version`, `description`: human and registry identity.
- `entrypoints`: stable navigation for agents and local package tooling.
- `docs`: explicit documentation resources for adapter UIs or audits.
- `selfTests`: private smoke tests that prove the skill has not regressed.
- `scripts`: atomic local utilities shipped by the skill.
- `optionalTools`: abstract tool contracts that local adapters may bind.

## Non-Goals

Do not include these until there is strong pressure:

- Model aliases or provider names.
- Concrete local tool registry syntax.
- Runtime job orchestration details.
- Cross-skill dependency declarations.
- Auto-install behavior.
- Prompt-template language that assumes one agent harness.

## Unresolved Questions

- Should a manifest be shared across all skills or remain skill-local?
- Should optional tool contracts be machine-readable enough for auto-registration?
- How should manifests represent generated docs or examples without becoming stale?
- Should self-tests be allowed to mutate temporary state, or must they be read-only?
- How should manifest versions relate to `SKILL.md` metadata versions?

## Adoption Gate

Create an actual `skill.json` only when at least two independent skills or adapters need the same manifest fields. Until then, this note is sufficient.
