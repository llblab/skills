# Swarm Backlog

## Open Work

No open work is actionable until a concrete resumable adapter exists.

## Blocked Work

- Design and validate resumable coordinator checkpoints.
  - Priority: Medium.
  - Blocked by: A concrete local adapter or runtime surface that can pause a subagent, deliver a bounded Coordinator Checkpoint to the orchestrator, accept a coordinator reply, and resume the same subagent context.
  - Scope: Keep the portable Swarm contract independent of any specific runtime while validating whether same-context resume is real. If resume is unavailable, use the documented fallback: checkpoint artifact, degraded branch/run, and a new subagent with the checkpoint included.
  - Exit: One real adapter experiment proves same-context resume, or the limitation is confirmed and the fallback path is treated as the supported behavior.
