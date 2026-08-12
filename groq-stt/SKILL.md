---
name: groq-stt
description: Transcribe audio files using Groq API (Whisper).
---

# Groq STT Skill

Standalone direct Node.js client for Groq's Whisper transcription API. The canonical client is `scripts/transcribe.mjs`; `scripts/transcribe.sh` is the shell entrypoint wrapper. There are no curl fallbacks or JSON parser dependencies.

## Usage

```bash
GROQ_API_KEY=xxx ./scripts/transcribe.sh audio.ogg [language] [model] [diarize]
GROQ_API_KEY=xxx ./scripts/transcribe.sh --file audio.ogg --lang ru --model whisper-large-v3-turbo --diarize true
```

- `language` — optional language code; omitted means provider auto-detection.
- `model` — optional; default: `whisper-large-v3-turbo`.
- `diarize` — optional boolean; default: `false`.
- Outputs plain transcription text, or timestamped speaker segments when diarization is enabled.
- Fails fast when the file or `GROQ_API_KEY` is missing.
- Supports both positional and flag-style invocation.

## CLI Options

- `--file`, `-f` — audio file path.
- `--lang`, `--language`, `-l` — optional language code.
- `--model`, `-m` — Groq transcription model.
- `--diarize`, `-d` — `true` to label speaker segments; default: `false`.
- `--help`, `-h` — usage.

## Dependencies

- Node.js 18+ with built-in `fetch`, `FormData`, and `Blob`.
- Internet access.

## Notes

- Default model: `whisper-large-v3-turbo`.
- Uses `response_format=text` for plain output and `verbose_json` for diarized output.
- Diarization preserves Groq's `speaker` labels without guessing or merging speakers.
- Preserves positional invocation used by `transcribe_groq`: `transcribe.sh {file} {lang} {model} {diarize}`.
