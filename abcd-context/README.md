# ABCd Context

Portable context protocol for keeping durable rules, open work, completed delivery, human entrypoints, and project docs truthful without generating ceremonial churn.

## Context Graph

- `AGENTS.md`: Durable protocol and reusable constraints.
- `BACKLOG.md`: Canonical remaining work.
- `CHANGELOG.md`: Completed outcomes and impact.
- `README.md` tree: Human entrypoints and navigation.
- `docs/README.md` + `/docs`: Indexed subsystem and contract knowledge.

## Validation

Both runtimes implement the same core checks on Linux and macOS; Node provides the portable runtime path elsewhere.

```bash
bash ./scripts/validate-context.sh /path/to/project
node ./scripts/validate-context.mjs /path/to/project
node ./scripts/_self-test.mjs
```

Warnings require review but do not fail validation. Errors return a nonzero exit.

## Start Here

- [Skill Definition](./SKILL.md)
- [Project Context](./AGENTS.md)
- [Open Backlog](./BACKLOG.md)
- [Changelog](./CHANGELOG.md)
- [Documentation](./docs/README.md)
