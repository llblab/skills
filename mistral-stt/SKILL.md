---
name: mistral-stt
description: Transcribe audio files using Mistral AI Voxtral.
---

# Mistral STT Skill

Standalone direct Node.js client for Mistral's Voxtral transcription API. The canonical client is `scripts/transcribe.mjs`; `scripts/transcribe.sh` is the shell entrypoint wrapper. There are no curl fallbacks or Python parser dependencies.

## Usage

```bash
MISTRAL_API_KEY=xxx ./scripts/transcribe.sh audio.ogg [language] [model] [diarize]
MISTRAL_API_KEY=xxx ./scripts/transcribe.sh --file audio.ogg --lang ru --model voxtral-mini-latest --diarize true
```

- `language` — optional; omitted means provider auto-detection.
- `model` — optional; default: `voxtral-mini-latest`.
- `diarize` — optional boolean; default: `false`.
- Outputs plain transcription text, or timestamped speaker segments when diarization is enabled.
- Fails fast when the file or `MISTRAL_API_KEY` is missing.
- Supports both positional and flag-style invocation.

## CLI Options

- `--file`, `-f` — audio file path.
- `--lang`, `--language`, `-l` — optional language code.
- `--model`, `-m` — Mistral transcription model.
- `--diarize`, `-d` — `true` to label speaker segments; default: `false`.
- `--help`, `-h` — usage.

## Dependencies

- Node.js 18+ with built-in `fetch`, `FormData`, and `Blob`.
- Internet access.

## Notes

- Default model: `voxtral-mini-latest`.
- Diarization preserves Mistral's `speaker_id` values without guessing or merging speakers.
- Parses Mistral JSON and keeps stdout limited to the requested transcript format.
- Preserves positional invocation used by `transcribe_mistral`: `transcribe.sh {file} {lang} {model} {diarize}`.
