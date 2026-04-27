# AGENTS.md (mistral-stt)

## Knowledge & Conventions

### Operating Principles

- Keep `scripts/transcribe.mjs` canonical: standalone direct Node.js client only, no shell wrapper, curl fallback, or Python parser dependency.
- `scripts/transcribe.mjs` must output only transcription text on stdout.
- Never print `MISTRAL_API_KEY` or request headers in diagnostics.
- Validate arguments and credentials before invoking the Mistral API.
- Preserve positional invocation for `transcribe_mistral`: `transcribe.mjs {file} {lang} {model}`.

### Discovered Constraints

- Mistral returns JSON for Voxtral transcriptions; parse the `text` field explicitly instead of passing raw JSON to callers.
- STT tools are often called from attachment handlers; noisy stdout pollutes the user turn.
