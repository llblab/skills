# Duplex Mode (`say` → `listen`)

Duplex mode combines atomic commands into a continuous voice dialogue loop.

## Protocol

1. Agent speaks response with `say`.
2. Agent immediately switches to `listen`.
3. Recognized text becomes the next user prompt.
4. Loop repeats until user says stop phrase.

## Stop Phrases

- `стоп`
- `выключи прослушивание`
- `stop listening`

## Language Alignment

Use the same language for both sides:

- `say --lang ru ...`
- `listen -l ru ...`

This improves recognition and keeps conversation coherent.
If `-l/--lang` is omitted, `listen` now falls back to `~/.pi_voice_lang`.

## Duplex Helper Script

Optional convenience wrapper:

```bash
duplex --say-lang ru -l ru "Озвучила результат. Что дальше?"
duplex -d 0 -s 1 "Слушаю без таймаута, завершаю по паузе"
duplex -p fast "Быстрый режим: минимальная задержка"
```

`duplex` internally runs `say`, then `listen`.

## Notes

- Keep spoken responses concise.
- In noisy environments increase `listen` duration and use `medium` model if needed.
- If streaming mode is unavailable, `listen` falls back automatically.
