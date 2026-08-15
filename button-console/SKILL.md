---
name: button-console
description: Turns terminal programs, filesystem navigation, system inspection, and operator workflows into contextual agent-generated button interfaces while preserving full or faithfully adapted console output. Use when a user asks for controls, menus, navigation, actions, or an operating-system/CLI interface through Telegram or another prompt-button transport.
---

# Button Console

Build a temporary, truthful button interface over terminal and operating-system capabilities. The agent remains the interpreter and safety boundary; buttons are contextual prompts, not a second shell, static application, or hidden automation daemon.

## Concept

Use this interaction loop:

```text
User intent → narrow inspection/action → console evidence → mobile-readable output → contextual buttons → next user intent
```

Each response is one generated screen. Regenerate the controls from current evidence after every action rather than maintaining a parallel navigation model.

## Core Contract

- Inspect reality before rendering a menu whose entries depend on current state.
- Use the system's normal console programs as capability owners.
- Preserve console truth. Show complete output when it is reasonably sized; otherwise adapt it without changing material facts and provide pagination or drill-down buttons.
- Make every button prompt self-contained: name the exact target, requested operation, output expectation, and relevant safety restriction.
- Treat button clicks as user requests subject to the same authority, safety, and validation rules as typed requests.
- Never infer permission for a destructive, privileged, credential-bearing, external, or irreversible action merely because a button exists.
- Do not read secrets just to populate navigation. File names and metadata may be listed when safe; contents require a justified request and applicable authorization.
- Never place secret values, credentials, private keys, tokens, cookies, or sensitive file contents in labels, prompts, or console output.

## Screen Model

A screen normally contains:

1. A short title naming the current target.
2. Console output or a faithful adaptation.
3. Optional provenance such as path, command class, timestamp, exit status, or truncation note when useful.
4. Buttons for likely next actions.
5. A Back or Up action when navigating a hierarchy.
6. A Refresh action when the underlying state may change.

Do not add decorative controls with no likely use. Prefer 4–12 high-value buttons. Split larger sets into categories or pages.

## Console Fidelity

### Complete output

Use complete output when it fits comfortably in one response and does not expose sensitive data. Preserve:

- Ordering
- Names and identifiers
- Numeric values and units
- Warnings and errors
- Exit status when failure matters

A code block is appropriate when formatting is semantically meaningful. A compact list is appropriate when the console output is already a simple directory or record listing.

### Adapted output

Adapt output for a small screen when it is long, noisy, repetitive, or poorly formatted. Adaptation may:

- Replace columns with labeled records
- Normalize human-readable sizes
- Group entries by type
- Collapse repeated successful lines
- Show a bounded head/tail or ranked subset
- Translate labels into the user's language

Adaptation must not:

- Convert failure into success
- Omit a material warning
- Change values, ordering claims, or identities
- Present a filtered subset as complete
- Hide truncation or filtering

State the adaptation explicitly, for example: `Показаны 20 из 184 записей, по размеру`. Offer `Next`, `Previous`, `Show all`, `Raw output`, or a narrower filter when useful.

## Filesystem Navigation

- Resolve the requested path before listing it.
- List directories without reading file contents.
- Include all ordinary entries unless the user requested a filter.
- Do not silently omit an entry merely because it appears sensitive; show its name when listing is safe, but label or handle it conservatively.
- For hidden directories, default to names and metadata only.
- Use exact paths in button prompts so the next turn does not depend on fragile conversational inference.
- Keep `Up`, `Home`, and `Refresh` available where useful.
- For files, offer safe operations first: metadata, preview when non-sensitive, attach/send, or open with an appropriate local application.

Never expose credential-file contents through a preview button. Examples include `*.keys`, private SSH keys, credential stores, wallet material, browser profiles, cookies, and token-bearing configuration.

## System and Process Controls

Safe read-only controls may directly request:

- System status, uptime, load, memory, temperatures, and disk use
- Process ranking and service status
- Network interface and connectivity status
- Application discovery
- Logs with bounded scope and secret redaction

Mutating controls must identify the exact effect and require appropriate authorization. Use a two-stage flow for high-impact actions:

1. An action button opens a confirmation screen with consequences and current target.
2. A distinctly labeled confirmation button requests the exact operation.

This applies to shutdown, reboot, process termination, package removal, file deletion, permission changes, service mutation, disk operations, and similar actions. Use danger styling when the transport supports it. Re-check the target immediately before execution and report the resulting console evidence.

## Button Generation

When Telegram button actions are available, emit top-level hidden `telegram_button` comments using the bridge contract. If syntax or delivery behavior is uncertain, read the Telegram bridge help before responding.

Example:

```html
<!-- telegram_button: {"label":"📂 Downloads","prompt":"Show the current contents of /home/user/Downloads without reading file contents, then provide contextual navigation buttons."} -->
```

Button prompts must:

- Use an absolute or unambiguous target where possible.
- Describe one coherent intent.
- Preserve the user's language.
- State important exclusions such as `do not read secret files`.
- Request a fresh listing after mutations.
- Avoid embedding volatile output that should instead be re-inspected.

Labels should be short, distinct, and scannable. Emoji are optional semantic markers, not decoration. Do not rely on color alone.

If the transport has no buttons, render the same interface as a numbered choice list and accept the number or label as the next request.

## Action Procedure

1. Identify the current target and requested capability.
2. Classify the action as read-only, ordinary mutation, privileged, destructive, secret-bearing, or external.
3. Run the narrowest console inspection needed for a truthful screen.
4. Check exit status and stderr; do not build a success menu from failed evidence.
5. Render complete or explicitly adapted output.
6. Generate only context-relevant next-action buttons.
7. On the next turn, inspect again when freshness matters and execute only the newly authorized action.
8. Report outcome evidence, then regenerate the screen from retained reality.

## Failure and Empty States

- If a command fails, show the concise error and offer diagnosis, retry, Back, or a narrower action.
- If a directory is empty, say so and still offer Up, Home, and Refresh.
- If a target disappeared, do not reuse stale buttons as evidence; return to its nearest valid parent.
- If access is denied, do not escalate privileges automatically. Offer a safe explanation or an explicit privileged path when permitted.
- If output may contain secrets, stop before displaying it and offer metadata-only or redacted alternatives.

## Quality Check

Before sending a screen, verify:

- The displayed state comes from current console evidence.
- Complete versus filtered output is labeled honestly.
- No ordinary entry was accidentally omitted from navigation.
- No secret value appears in text or button payloads.
- Every button has a valid, self-contained next intent.
- Destructive actions lead to confirmation rather than immediate execution.
- Back/Up and Refresh exist when they materially improve navigation.
- The response remains readable on a mobile screen.
