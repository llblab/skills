# Changelog

## 1.5.1

- `JSON-First Validation`: Bash and Node validators now emit stable JSON by default while preserving explicit `--text` output and the existing `--json` alias. Impact: agent, recipe, and CI callers receive machine-readable results without extra flags.

## 1.0.20

- `Protocol Cohesion`: Consolidated the operating kernel, deep protocols, templates, project context, and human entrypoint around one context ownership model. Impact: activation, routing, reconciliation, and validation now form one proportional workflow without duplicated ceremony.
- `Self-Reference`: Added the skill's own completed-history surface and expanded regression coverage to validate both the fixture and the skill root across Bash and Node runtimes. Impact: the skill now exercises the context graph it prescribes.
