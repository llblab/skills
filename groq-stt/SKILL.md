---
name: groq-stt
description: Transcribe audio files using Groq API (Whisper).
metadata:
  version: 1.0.2
---

# Groq STT Skill

Standalone direct Node.js client for Groq's Whisper transcription API. The canonical client is `scripts/transcribe.mjs`; `scripts/transcribe.sh` is the shell entrypoint wrapper. There are no curl fallbacks or JSON parser dependencies.

## Usage

```bash
GROQ_API_KEY=xxx ./scripts/transcribe.sh audio.ogg [language] [model]
GROQ_API_KEY=xxx ./scripts/transcribe.sh --file audio.ogg --lang ru --model whisper-large-v3-turbo
```

- `language` — optional language code; omitted means provider auto-detection.
- `model` — optional; default: `whisper-large-v3-turbo`.
- Outputs only the transcription text.
- Fails fast when the file or `GROQ_API_KEY` is missing.
- Supports both positional and flag-style invocation.

## CLI Options

- `--file`, `-f` — audio file path.
- `--lang`, `--language`, `-l` — optional language code.
- `--model`, `-m` — Groq transcription model.
- `--help`, `-h` — usage.

## Dependencies

- Node.js 18+ with built-in `fetch`, `FormData`, and `Blob`.
- Internet access.

## Notes

- Default model: `whisper-large-v3-turbo`.
- Uses `response_format=text` so stdout stays clean for attachment handlers.
- Preserves positional invocation used by `transcribe_groq`: `transcribe.sh {file} {lang} {model}`.
