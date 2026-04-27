---
name: mistral-stt
description: Transcribe audio files using Mistral AI Voxtral.
---

# Mistral STT Skill

Standalone direct Node.js client for Mistral's Voxtral transcription API. The canonical script is `scripts/transcribe.mjs`; there are no shell wrappers, curl fallbacks, or Python parser dependencies.

## Usage

```bash
MISTRAL_API_KEY=xxx ./scripts/transcribe.mjs audio.ogg [language] [model]
MISTRAL_API_KEY=xxx ./scripts/transcribe.mjs --file audio.ogg --lang ru --model voxtral-mini-latest
```

- `language` — optional; omitted means provider auto-detection.
- `model` — optional; default: `voxtral-mini-latest`.
- Outputs only the transcription text.
- Fails fast when the file or `MISTRAL_API_KEY` is missing.

## CLI Options

- `--file`, `-f` — audio file path.
- `--lang`, `--language`, `-l` — optional language code.
- `--model`, `-m` — Mistral transcription model.
- `--help`, `-h` — usage.

## Dependencies

- Node.js 18+ with built-in `fetch`, `FormData`, and `Blob`.
- Internet access.

## Notes

- Default model: `voxtral-mini-latest`.
- Parses Mistral JSON response and prints only the `text` field.
- Preserves positional invocation used by `transcribe_mistral`: `transcribe.mjs {file} {lang} {model}`.
