# Voice Mode Super-Skill

Offline-first voice I/O skill for agents:

- `Output`: `say` (TTS)
- `Input`: `listen` (STT)
- `Duplex mode`: agent-level orchestration (`say` → `listen`) built on the atomic scripts

Speech recognition runs locally via `faster-whisper`, and speech synthesis uses local `piper` models after the initial voice download.

Use `say` and `listen` independently or let the agent run continuous duplex dialogue.

## Platform Support

- `Linux` (`piper`, `aplay`, `faster-whisper`, `arecord`/`pyaudio`)
- `macOS` (`piper`, `afplay`, `faster-whisper`, `sox`/`pyaudio`)

## Quick Start

```bash
"${SKILL_DIR}/scripts/_bootstrap"
```

## Quick Links

- [Skill Definition](SKILL.md)
- [Project Index](AGENTS.md)
- [Documentation](docs/README.md)
- [Scripts](scripts)
