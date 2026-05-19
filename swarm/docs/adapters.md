# Adapter Usage

Swarm is portable protocol text plus atomic reference utilities. Local tool
systems may bind the protocol to command templates, registered tools, or
async runs, but the skill must not depend on a specific tool registry or
`pi -p` runner.

## Tool Adapter Example

Local environments may expose adapters similar to these:

- `async_run action=start`: Start a registered composer or inline command template through a generic async runtime.
- `async_run action=status`: Read structured run state and progress.
- `async_run action=tail`: Show recent structured events or raw logs.
- `async_run action=list`: List known runs.
- `async_run action=cancel`: Cancel an owned run when pid ownership is verified.
- `swarm_quorum`: Local synchronous quorum adapter, commonly implemented as a command-template composer.
- `swarm_quorum_fake`: Local fake adapter for tests, if the environment wants one.

`async_run` and `swarm_quorum` are example adapter names, not Swarm requirements. The portable contract is the action set plus inspectable state. Prefer the async-run path for long-running or parallel agentic work, so the orchestrator stays responsive and terminal events drive follow-up inspection.

## Portable Utilities

The portable script set is intentionally narrow:

- `scripts/swarm-lock.mjs`: Lock helper for local adapters and self-tests.
- `scripts/_self-test.mjs`: Smoke test for lock behavior and script-boundary drift.

A real `pi -p` quorum runner is not portable enough to live in this skill. Keep it in local tool configuration or in a local adapter package.

## Command-Template Composer Example

A local adapter can express reviewer fanout directly with command-template
composition. Swarm scripts then stay utility primitives, while adapter policy
lives in the local binding layer:

```json
{
  "description": "Run parallel Swarm-style reviewers and merge their reports",
  "args": ["scope", "prompt", "merger_model=openai-codex/gpt-5.5"],
  "template": [
    "mkdir -p {out_dir}",
    {
      "parallel": true,
      "template": [
        "pi -p --model openai-codex/gpt-5.5 --thinking off --tools read,bash \"Review {scope}. {prompt}\"",
        "pi -p --model openai-codex/gpt-5.4 --thinking off --tools read,bash \"Review {scope}. {prompt}\"",
        "pi -p --model deepseek/deepseek-v4-pro --thinking off --tools read,bash \"Review {scope}. {prompt}\""
      ]
    },
    "pi -p --model {merger_model} --thinking medium --no-tools \"Merge these review reports from stdin.\""
  ]
}
```

This composer is a compact sync path that demonstrates the synergy between local orchestration bindings and atomic Swarm utilities. When work is long-running, parallel, user-visible, or likely to outlive the current turn, wrap the same composer or quorum utility in a generic async run instead of adding a broad coordination script to this skill.

## Async Quorum Example

A local generic async runtime can start a registered composer or a quorum utility as a detached async run. Read this as command-template execution plus a thin async envelope, not as a second workflow language:

```json
{
  "action": "start",
  "run_id": "spec-review",
  "values": {
    "prompt": "Review for contradictions and growth risks.",
    "scope": "docs/spec.md"
  },
  "template": [
    "node scripts/swarm-lock.mjs claim --scope docs/spec.md --mode read --ttl 300",
    {
      "parallel": true,
      "template": [
        {
          "label": "gpt-5.5",
          "timeout": 300000,
          "template": "pi -p --model openai-codex/gpt-5.5 --tools read,bash \"Review docs/spec.md\""
        },
        {
          "label": "gpt-5.4",
          "timeout": 300000,
          "template": "pi -p --model openai-codex/gpt-5.4 --tools read,bash \"Review docs/spec.md\""
        }
      ]
    },
    "node scripts/swarm-lock.mjs release --scope docs/spec.md"
  ]
}
```

## Sync Quorum Binding

For blocking review, register a local command-template composer that launches reviewers and a merger directly. Keep model aliases and `pi -p` syntax in that local adapter instead of this portable skill.

## Fake Regression Binding

For regression tests, create a local fake adapter or use command-template dry runs. The portable self-test validates only the script boundary and lock helper.

## Lock Helper Example

```bash
node scripts/swarm-lock.mjs claim --scope docs/spec.md --mode read --ttl 300
node scripts/swarm-lock.mjs status --scope docs/spec.md
node scripts/swarm-lock.mjs release --scope docs/spec.md
```

## Boundaries

- Adapter names are local conveniences, not swarm protocol requirements.
- Model names are local aliases, not portable skill vocabulary.
- Raw outputs and manifests should be retained until the merged report is
  accepted.
- Async runs own lifecycle and observability; command templates own execution shape. Do not move model policy or broad coordination back into Swarm scripts.
