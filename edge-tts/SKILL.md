---
name: edge-tts
description: Synthesize speech from text through Microsoft Edge TTS; save audio, subtitles, or boundary metadata, or play locally. Not audio transcription.
---

# Edge TTS

Direct Node.js client for Microsoft Edge's online TTS service. The canonical client is `scripts/say.mjs`; `scripts/say.sh` is the shell entrypoint wrapper. There are no Python, CLI-wrapper, or legacy shell fallbacks.

## Usage

```bash
./scripts/say.sh "Привет" ru +30%             # Synthesize and play with an available local MP3 player
./scripts/say.sh "Привет" ru 1 /tmp/hello.mp3 # Save MP3; numeric rate multiplier is supported
./scripts/say.sh "Привет" ru +30% /tmp/a.mp3 /tmp/a.jsonl
./scripts/say.sh --text "Hello" --lang en --write-media /tmp/hello.mp3
./scripts/say.sh --file input.txt --voice ru-RU-SvetlanaNeural --write-media out.mp3 --write-subtitles out.srt
./scripts/say.sh --list-voices
```

## CLI Options

- `--text`, `--file` — text source; `-` means stdin for files.
- `--lang`, `--voice` — language shortcut or explicit voice.
- `--rate`, `--volume`, `--pitch` — Edge prosody controls.
- `--boundary` — `SentenceBoundary` or `WordBoundary`.
- `--write-media` — MP3 output path; `-` means stdout.
- `--write-subtitles` — SRT output path; `-` means stderr.
- `--write-metadata` — JSONL boundary metadata output path.
- `--list-voices` — direct voice list request.

## Playback

Playback runs in background only when no media output path is provided. The client auto-detects a local MP3 player and removes the temp file after playback when the player is blocking.

Default candidates:

- Cross-platform if installed: `ffplay`, `mpv`, `vlc`/`cvlc`.
- Linux/BSD extras: `mpg123`.
- On macOS: `afplay`.
- Windows default fallback: the system-registered MP3 app through PowerShell `Start-Process`.

If no player exists, generation is still available through `--write-media`; the agent can then play the MP3 with any system-specific tool. Windows default-app playback uses delayed temp cleanup because registered apps usually detach immediately.

## Dependencies

- Node.js 18+.
- A local MP3 player only for direct playback mode.
- Internet access.

## Notes

- Built-in language shortcuts: en, ru, de, fr, es, it, zh, ja.
- Default rate: +30%.
- Rate/volume accept Edge percent strings and numeric multipliers: `1` = `+100%`, `0.8` = `+80%`, `-0.5` = `-50%`.
- The script implements direct TLS/WebSocket handshake, MUID, Sec-MS-GEC, MP3 streaming, boundary metadata, subtitles, and voice listing.
