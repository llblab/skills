#!/usr/bin/env bash
# Compatibility wrapper for the legacy audit-genes entrypoint.
# The JSON-first observer is now the canonical audit surface.
set -euo pipefail
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)"
args=()
for arg in "$@"; do
  case "$arg" in
    --no-discovery|--no-sync-discovery)
      ;;
    *)
      args+=("$arg")
      ;;
  esac
done
exec "$SCRIPT_DIR/audit-cross-evolution.sh" "${args[@]}"
