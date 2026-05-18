# Swarm Backlog

## Open Work

- Design and validate resumable coordinator checkpoints.
  - Priority: Medium.
  - Scope: Define a concrete local adapter that can pause a subagent, deliver a bounded Coordinator Checkpoint to the orchestrator, accept the coordinator reply, and resume the same subagent context. Keep the portable Swarm contract independent of any specific runtime.
  - Exit: One real adapter experiment proves same-context resume, or the docs record the limitation and fallback path as checkpoint artifact plus new subagent.
