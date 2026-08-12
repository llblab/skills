# AGENTS.md (groq-stt)

## Knowledge & Conventions

### Operating Principles

- Keep `scripts/transcribe.mjs` canonical: standalone direct Node.js client only, no curl fallback or JSON parser dependency.
- Keep `scripts/transcribe.sh` as a thin Bash wrapper that only delegates to `scripts/transcribe.mjs`.
- `scripts/transcribe.mjs` must output only plain transcription text or requested diarized transcript text on stdout.
- Never print `GROQ_API_KEY` or request headers in diagnostics.
- Validate arguments and credentials before invoking the Groq API.
- Preserve positional invocation for `transcribe_groq`: `transcribe.sh {file} {lang} {model} {diarize}`.

### Discovered Constraints

- STT tools are often called from attachment handlers; noisy stdout pollutes the user turn.
- Use `response_format=text` for plain output and `verbose_json` only for diarized output.
- Groq diarized segments expose speaker labels in the `speaker` field.
