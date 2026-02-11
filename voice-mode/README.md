# Voice Mode Super-Skill

Unified voice I/O skill for agents:

- `Output`: `say` (TTS)
- `Input`: `listen` (STT)
- `Duplex helper`: `duplex` (`say` → `listen` loop)

Use `say` and `listen` independently or run continuous duplex dialogue.

## Platform Support

- `Linux` (`piper`, `aplay`, `faster-whisper`, `arecord`/`pyaudio`)
- `macOS` (`piper`, `afplay`, `faster-whisper`, `sox`/`pyaudio`)

## Quick Start

```bash
"${SKILL_DIR}/scripts/bootstrap"
```

## Quick Links

- [Skill Definition](SKILL.md)
- [Project Index](AGENTS.md)
- [Documentation](docs/README.md)
- [Scripts](scripts)
