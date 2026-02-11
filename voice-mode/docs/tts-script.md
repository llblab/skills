# TTS Script Guide (`say`)

`say` is the speech-output primitive of the `voice-mode` super-skill.

## Implementation

Uses [Piper](https://github.com/rhasspy/piper) for synthesis and OS-specific playback:

- `Linux`: `aplay`
- `macOS`: `afplay`

## Voice Models

Language-to-model mapping is defined in the script `MODELS` associative array.

| Lang | Model                      |
| ---- | -------------------------- |
| en   | en_US-amy-medium.onnx      |
| ru   | ru_RU-irina-medium.onnx    |
| uk   | uk_UA-lada-x_low.onnx      |
| de   | de_DE-kerstin-low.onnx     |
| fr   | fr_FR-siwis-low.onnx       |
| es   | es_ES-sharvard-medium.onnx |
| it   | it_IT-paola-medium.onnx    |
| zh   | zh_CN-huayan-medium.onnx   |
| ja   | ja_JP-amitaro-medium.onnx  |

Missing models are auto-downloaded from Hugging Face on first use.

## Execution Flow

1. Read input text (argument or piped stdin).
2. Exit immediately on empty input.
3. Resolve language (`~/.pi_voice_lang` + optional `--lang`).
4. Normalize locale-like values to short code (`ru_RU` → `ru`).
5. Download model if needed.
6. Synthesize WAV with Piper.
7. Play audio and cleanup temp file.

## Configuration

- `VOICE_DIR`: `~/piper-voices`
- `LANG_FILE`: `~/.pi_voice_lang`
- `TMP_BASE`: `${TMPDIR:-$HOME/.cache/tts}`
- temp WAV: generated via `mktemp` for race-safe parallel usage

## Usage

```bash
say "Hello, world"
echo "Привет" | say
say --lang de "Hallo Welt"
```

## Related

- [stt-script.md](./stt-script.md) — speech input
- [duplex-script.md](./duplex-script.md) — duplex loop protocol
- [SKILL.md](../SKILL.md) — full operating modes
