# Duplex Mode (`say` → `listen`)

Duplex mode is an agent orchestration protocol built on top of `say` and `listen`.
There is no dedicated `duplex` shell script in this skill.

## Protocol

1. Agent generates the full response.
2. Agent speaks the full response with `say`.
3. Agent immediately switches to `listen -d 0 -s 1`.
4. Recognized text becomes the next user prompt.
5. Loop repeats until the user says a stop phrase intent.

## Stop Phrases

Normalize case, whitespace, and punctuation before matching.
Prefer intent matching over exact string equality.

- `стоп`
- `выключи прослушивание`
- `выключи дуплекс`
- `stop listening`

## Language Alignment

Use the same language for both sides:

- `say --lang ru ...`
- `listen -l ru ...`

This improves recognition and keeps the dialogue coherent.
If `-l/--lang` is omitted, `listen` falls back to `~/.pi_voice_lang`.

## Atomic Command Pattern

```bash
say --lang ru "<spoken reply in the conversation language>"
listen -l ru -d 0 -s 1
```

The agent owns the loop. The scripts only provide the atomic voice primitives.

## Canonical Agent Loop

```text
loop:
  answer = full assistant reply
  say --lang <lang> "<answer>"
  heard = listen -l <lang> -d 0 -s 1
  if heard matches a normalized stop phrase intent:
    break
```

## Agent Orchestration Rule

For LLM-driven duplex conversations, the audio channel must contain the same substantive answer the assistant is giving the user.

Correct flow:

1. Model writes the full answer
2. `say "<full answer>"`
3. `listen -d 0 -s 1`

Incorrect flow:

1. Model keeps the real answer only in chat
2. `say "What should we do next?"`
3. `listen -d 0 -s 1`

The second pattern creates split-brain UX and must not be used.

## Notes

- Keep spoken responses concise.
- Duplex should default to no hard timeout and stop by silence unless the user asks for a different capture window.
- In noisy environments increase the silence threshold or switch to a larger Whisper model if needed.
- Continuous duplex is an agent behavior, not a shell helper.
