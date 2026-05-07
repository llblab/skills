#!/usr/bin/env bash
set -euo pipefail
if [[ $# -lt 1 ]]; then
  echo "Usage: inspect-skill.sh <skill-id> [--root <skills-dir>] [--json]" >&2
  exit 1
fi
SKILL_ID="$1"
shift
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)"
exec node "$SCRIPT_DIR/audit-cross-evolution.mjs" --skill "$SKILL_ID" "$@"
