# Listen Script Guide (`listen`, `listen-server`)

`listen` is the speech-input primitive of the `voice-mode` super-skill.

## Overview

`listen` records microphone audio and transcribes speech using `faster-whisper`.

Modes:

1. `Streaming mode` (preferred): when `listen-server` is running.
2. `File fallback mode`: direct recording + transcription when server/streaming is unavailable.

Output behavior:
- interactive TTY: shows live partials on stderr
- non-interactive environments: suppresses partial spam, prints final transcript only
- if `--lang` is omitted, `listen` uses `~/.pi_voice_lang` and refreshes it from detected language

## Streaming Architecture

```text
Microphone → pyaudio → raw PCM → Unix socket → listen-server
                                                  ↓ (every N sec)
                                            partial JSON lines
                                                  ↓ (on END)
                                            final JSON line
```

### Stream protocol (client → server)

1. 4-byte header: `STRM`
2. JSON config line: `{ "lang": null, "interval": 2 }\n`
3. Raw PCM int16 mono 16kHz chunks
4. End marker: `END\n`

### Stream protocol (server → client)

- Partial updates: `{ "partial": "text so far..." }\n`
- Final result: `{ "text": "final text", "lang": "en" }\n`

## Fallback Mode

```text
Microphone → arecord/sox → WAV → faster-whisper → text
```

Used when `listen-server` is absent or `pyaudio` is unavailable.

## Silence Detection

- Streaming: RMS energy threshold (~300 for int16)
- macOS fallback: sox silence params
- Whisper-level: `vad_filter=True` (Silero VAD)

## Transcription Settings

- Engine: `faster-whisper` (`compute_type="int8"`)
- `beam_size=5`
- `vad_filter=True`
- Default model: `small`

## Typical Usage

```bash
# one-shot
listen
listen -d 15 -l ru

# no hard timeout: stop by silence pause
listen -d 0 -s 1

# presets
listen -p fast       # tiny model, low latency
listen -p accurate   # medium model, better accuracy

# start persistent server for real-time partials
nohup listen-server start --model small &
listen -i 2
```

## Related

- [duplex-script.md](./duplex-script.md) — automatic `say` → `listen` loop
- [tts-script.md](./tts-script.md) — speech output side
- [SKILL.md](../SKILL.md) — full operating modes
