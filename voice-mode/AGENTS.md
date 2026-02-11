# AGENTS.md (voice-mode super-skill)

## Knowledge & Conventions

### Meta-Protocol Principles

- `Integrity`: Docs must match actual behavior of `say`, `listen`, `listen-server`, and `duplex`.
- `Atomic First`: Core primitives are `say` and `listen`. Duplex mode is orchestration (`say` → `listen`).
- `Cross-Platform`: Linux + macOS support is mandatory for all changes.
- `Offline First`: STT is local (`faster-whisper`), no cloud dependency.
- `Voice Persona`: Female TTS models by default; concise, collaborative, proactive tone.

### Operating Principles

- Keep voice output short and informative (avoid voice spam).
- `listen` stdout = final transcription; stderr = diagnostics/partials.
- Prefer streaming mode (`listen-server` + `pyaudio`) for real-time partials.
- Fallback mode (`arecord`/`sox`) must remain functional.
- In duplex mode, language for `say` and `listen` should match.

### Discovered Constraints

- `~/.pi_voice_lang` must store short language codes (`ru`, `en`, `de`), never locale (`ru_RU`).
- `say` models auto-download from Hugging Face into `~/piper-voices`.
- Empty `say` input must exit before any model download.
- Parallel `say` calls require unique temp WAV files (`mktemp`) to avoid races.
- `curl -fSL` must be used for model downloads (fail on HTTP errors).
- faster-whisper model access is not thread-safe; server must guard transcribe calls with a lock.
- Streaming protocol marker: `STRM` header + `END\n` terminator.
- Never use `eval()` on user input.
- Never use bare `except:` in Python code.
- One bootstrap per skill — multiple bootstrap-\* wrappers are dead weight.
- Symmetric naming in docs: `tts-script.md` ↔ `stt-script.md`.

### Critical Insights

- `Tool Shaped Voice`: speaking without informational value is noise. Every `say` must answer: _what would the user miss if this were silent?_
- `Listen Guard`: avoid speculative `listen` calls. Invoke only when the user wants voice input or duplex loop is active.
- `Clean merges, no aliases`: when merging skills, delete the old one entirely. Compatibility alias layers are dead code that confuses future maintenance.

### Change History

- `[Current]` Tuned duplex listening UX: `listen/duplex` now support `-d 0` (no hard timeout, stop by silence), added presets (`fast|accurate|noisy`), defaults tightened (`silence=1`, `interval=2`), non-interactive partial spam suppressed, and language hint auto-falls back to/refreshes `~/.pi_voice_lang`. Impact: smoother hands-free flow with faster end-of-utterance response and adaptive language behavior.
- `[Previous]` Cleaned up: removed bootstrap-say/bootstrap-listen aliases (one bootstrap), renamed listen-script.md → stt-script.md (symmetric with tts-script.md), deleted voice-input skill entirely (no alias stubs). Impact: single entry point, consistent naming. Insight: skill merges must be clean deletions, not indirection layers.
- `[Legacy-0]` Merged voice-input into voice-mode super-skill. Added unified bootstrap and atomic command set (`say`, `listen`) with duplex orchestration.
- `[Legacy-1]` Added language memory normalization and robust model download behavior for `say`.
- `[Legacy-2]` Added real-time streaming STT with partial results via persistent `listen-server`.
