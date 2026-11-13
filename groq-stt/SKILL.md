---
name: groq-stt
description: Transcribe audio files through Groq Whisper, optionally preserving provider speaker labels. Use when the request, established workflow, or configuration selects Groq. Ask only if the provider remains unresolved; not speech synthesis.
---

# Groq STT Skill

Standalone direct Node.js client for Groq's Whisper transcription API. The canonical client is `scripts/transcribe.mjs`; `scripts/transcribe.sh` is the shell entrypoint wrapper. There are no curl fallbacks or JSON parser dependencies.

## Usage

```bash
GROQ_API_KEY=xxx ./scripts/transcribe.sh audio.ogg [language] [model] [diarize]
GROQ_API_KEY=xxx ./scripts/transcribe.sh --file audio.ogg --lang ru --model whisper-large-v3-turbo --diarize true
```

- Outputs plain transcription text, or timestamped speaker segments when diarization is enabled.
- Fails fast when the file or `GROQ_API_KEY` is missing.

## CLI Options

- `--file`, `-f` — audio file path.
- `--lang`, `--language`, `-l` — optional language code; omitted means provider auto-detection.
- `--model`, `-m` — Groq transcription model; default: `whisper-large-v3-turbo`.
- `--diarize`, `-d` — `true` to label speaker segments; default: `false`.
- `--help`, `-h` — usage.

## Dependencies

- Node.js 18+ with built-in `fetch`, `FormData`, and `Blob`.
- Internet access.

## Notes

- Diarization preserves Groq's `speaker` labels without guessing or merging speakers.
