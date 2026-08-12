# AGENTS.md (mistral-stt)

## Knowledge & Conventions

### Operating Principles

- Keep `scripts/transcribe.mjs` canonical: standalone direct Node.js client only, no curl fallback or Python parser dependency.
- Keep `scripts/transcribe.sh` as a thin Bash wrapper that only delegates to `scripts/transcribe.mjs`.
- `scripts/transcribe.mjs` must output only plain transcription text or requested diarized transcript text on stdout.
- Never print `MISTRAL_API_KEY` or request headers in diagnostics.
- Validate arguments and credentials before invoking the Mistral API.
- Preserve positional invocation for `transcribe_mistral`: `transcribe.sh {file} {lang} {model} {diarize}`.

### Discovered Constraints

- Mistral returns JSON for Voxtral transcriptions; parse `text` for plain output and preserve provider `speaker_id` values for diarized output.
- Do not infer, cluster, or merge speaker identities locally.
- STT tools are often called from attachment handlers; noisy stdout pollutes the user turn.
