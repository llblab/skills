# AGENTS.md (edge-tts)

## Knowledge & Conventions

### Operating Principles

- Keep `scripts/say.mjs` canonical: direct Node.js client only, no Python package, no wrapper script, no CLI fallback.
- Keep playback non-blocking: synthesis may block, playback must run in background.
- In playback mode, print only the spoken text to stdout; send diagnostics to stderr.
- Preserve stdin support for text so callers can pipe generated responses.
- Preserve positional invocation for `say_edge`: `say.mjs {text} {lang} {rate}`.

### Playback Policy

- Do not hard-require FFmpeg/`ffplay`; it is just one possible MP3 player.
- Auto-detect blocking players in this order: `ffplay`, `mpv`, `vlc`, `cvlc`, `mpg123`, `afplay`.
- On Windows, if no explicit player is installed, use the system-registered MP3 app via PowerShell `Start-Process`.
- If no local player exists, generate MP3 with `--write-media` and let the agent choose an environment-specific playback command.
- `ffplay` is required only if it is the selected playback command; saving MP3, subtitles, metadata, and voice listing must work without it.

### Discovered Constraints

- Direct Edge binary websocket payload data begins immediately after the declared header bytes; do not skip an extra CRLF after the binary header.
- MP3 output should start with a valid frame sync such as `ff f3`; missing sync means audio chunks were sliced incorrectly.
