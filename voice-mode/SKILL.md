---
name: voice-mode
description: "Unified voice I/O super-skill: speak via say, listen via listen, and run duplex voice dialogue."
metadata:
  version: 1.0.0
---

# Voice Mode (Super-Skill)

## Purpose

This skill unifies voice output and voice input in one place:

- `say` — text-to-speech (TTS)
- `listen` — speech-to-text (STT)
- `duplex` — helper wrapper (`say` → `listen`) built on atomic commands

Use `say` and `listen` independently, or combine them into continuous duplex dialogue.

## Atomic Commands

### 1) Speak

```bash
say "text to announce"
```

### 2) Listen

```bash
listen
```

### 3) Duplex helper (optional)

```bash
duplex "Готово. Озвучила результат. Что делаем дальше?"
```

`duplex` is only a convenience wrapper. Core protocol remains atomic: `say` then `listen`.

## Operating Modes

### Mode A: Selective Voice (default)

- Use `say` only for short, high-value moments (greeting, warning, key conclusion).
- Keep code, tables, and long technical details in text.

### Mode B: Full Voice Output (screenless)

When explicitly requested by the user:

1. Use `say` for every response.
2. Do not duplicate full spoken content in chat.
3. For code/tables: describe briefly by voice (language, purpose, size), avoid reading raw code line by line.

### Mode C: Voice Input On-Demand

- Call `listen` when the user wants to dictate the next prompt.
- `listen` prints recognized text to stdout.

### Mode D: Duplex Continuous Dialogue (say → listen)

When user enables duplex mode (e.g. "включи дуплекс", "полный голосовой режим"):

1. Speak response via `say`.
2. Immediately call `listen` (same conversation language).
3. Treat recognized text as the next user prompt.
4. Repeat loop until stop phrase: "стоп", "выключи прослушивание", "stop listening".

This is hands-free conversational flow.

### Mode E: Autonomous Voice Alerts (optional)

Short proactive announcements are allowed for:

- long-running operations,
- critical blockers/security issues,
- required confirmation to proceed safely.

Keep alerts brief and informative.

## Voice Guard + Listen Guard

Before `say`: ask if silence would hide important information. If not, do not speak.

Before `listen`: ask if voice input is actually needed right now. Do not invoke speculatively.

## Language Memory

- Preferred language is stored in `~/.pi_voice_lang`.
- Use short language codes: `ru`, `en`, `de`, ... (not `ru_RU`, `en_US`).
- In duplex mode, keep `say` and `listen -l <lang>` aligned.
- `say` auto-downloads missing Piper model on first use.

## Initialization (Linux & macOS)

Run bootstrap once:

```bash
"${SKILL_DIR}/scripts/bootstrap"
```

Bootstrap installs to `~/.local/bin`:

- `say`
- `listen`
- `listen-server`
- `duplex`

## Platform Support

- Linux: `piper` + `aplay`, `faster-whisper`, `arecord`/`pyaudio`
- macOS: `piper` + `afplay`, `faster-whisper`, `sox`/`pyaudio`
