# AGENTS.md (voice-mode super-skill)

## Knowledge & Conventions

### Meta-Protocol Principles

- `Integrity`: Docs must match actual behavior of `say`, `listen`, `listen-server`, and the duplex agent protocol.
- `Atomic First`: Core primitives are `say` and `listen`. Duplex mode is agent orchestration (`say` → `listen`).
- `Cross-Platform`: Linux + macOS support is mandatory for all changes.
- `Offline First`: STT is local (`faster-whisper`), no cloud dependency.
- `Voice Persona`: Female TTS models by default; concise, collaborative, proactive tone.

### Operating Principles

- Keep voice output short and informative (avoid voice spam).
- In agent-driven duplex mode, synthesize the full assistant reply with `say` before `listen`; never speak only a short handoff question while leaving the real answer in chat.
- `listen` stdout = final transcription; stderr = diagnostics/partials.
- Prefer streaming mode (`listen-server` + `pyaudio`) for real-time partials.
- In duplex mode, language for `say` and `listen` should match.
- Duplex listening should default to `listen -d 0 -s 1`: no hard timeout, stop by user pause.

### Discovered Constraints

- `~/.pi_voice_lang` must store short language codes (`ru`, `en`, `de`), never locale (`ru_RU`).
- `say` models auto-download from Hugging Face into `~/.piper-voices` by default, overridable via `PIPER_VOICE_DIR`.
- Empty `say` input must exit before any model download.
- Parallel `say` calls require unique temp WAV files (`mktemp`) to avoid races.
- `curl -fSL` must be used for model downloads (fail on HTTP errors).
- faster-whisper model access is not thread-safe; server must guard transcribe calls with a lock.
- Streaming protocol marker: `STRM` header + `END\n` terminator.
- No standalone `duplex` script: the agent must repeat the `say` → `listen` loop itself.
- Duplex stop phrases must be matched after normalization of case, spacing, and punctuation.
- Never use `eval()` on user input.
- Never use bare `except:` in Python code.
- Scripts auto-install missing dependencies via `_install-deps` shared manager: pip packages (piper-tts, faster-whisper, pyaudio, numpy) install automatically; system packages (alsa-utils, sox, portaudio) install via apt/brew. Graceful text fallback only if auto-install fails. | Trigger: any voice command on a fresh system | Action: auto-install, then proceed.
- `_install-deps` uses pip install cascade: venv → `--user` → `--user --break-system-packages` (PEP 668).
- One bootstrap per skill — multiple bootstrap-* wrappers are dead weight.
- Symmetric naming in docs: `tts-script.md` ↔ `stt-script.md`.

### Critical Insights

- `Tool Shaped Voice`: speaking without informational value is noise. Every `say` must answer: _what would the user miss if this were silent?_
- `Full Answer First`: duplex UX breaks if audio contains only a transition question. The spoken channel must carry the substantive assistant response before any handoff to `listen`.
- `Listen Guard`: avoid speculative `listen` calls. Invoke only when the user wants voice input or duplex loop is active.
- `Clean merges, no aliases`: when merging skills, delete the old one entirely. Compatibility alias layers are dead code that confuses future maintenance.

### Change History

- `[Current]` Removed `scripts/duplex` and redefined duplex as a skill/agent protocol only. Bootstrap now installs only `say`, `listen`, `listen-server`, and prunes stale `~/.local/bin/duplex`. Docs were renamed from `duplex-script.md` to `duplex-mode.md`, the canonical loop now defaults to `listen -d 0 -s 1`, and stop-phrase matching is explicitly normalized. Impact: no misleading one-shot helper, clearer ownership of continuous dialogue, and more faithful hands-free behavior.
- `[Previous]` Full antifragility: `_install-deps` shared manager auto-installs all missing dependencies (piper-tts, faster-whisper, pyaudio, numpy via pip; alsa-utils, sox, portaudio via apt/brew). All scripts source it and self-heal on first run. Bootstrap rewritten to actually install deps, not just warn. `listen-server` has Python-side `_ensure_dep` auto-installer. Graceful text fallback only as last resort. Impact: voice commands work on fresh systems without manual dependency setup.
- `[Earlier]` Tuned duplex listening UX: `listen` now supports `-d 0` (no hard timeout, stop by silence), added presets (`fast|accurate|noisy`), defaults tightened (`silence=1`, `interval=2`), non-interactive partial spam suppressed, and language hint auto-falls back to/refreshes `~/.pi_voice_lang`. Impact: smoother hands-free flow with faster end-of-utterance response and adaptive language behavior.
- `[Legacy-0]` Cleaned up: removed bootstrap-say/bootstrap-listen aliases (one bootstrap), renamed `listen-script.md` → `stt-script.md` (symmetric with `tts-script.md`), deleted voice-input skill entirely (no alias stubs). Impact: single entry point, consistent naming. Insight: skill merges must be clean deletions, not indirection layers.
- `[Legacy-1]` Merged voice-input into voice-mode super-skill. Added unified bootstrap and atomic command set (`say`, `listen`) with duplex orchestration.
- `[Legacy-2]` Added language memory normalization and robust model download behavior for `say`.
