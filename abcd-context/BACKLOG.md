# ABCd Context Backlog

> Canonical open backlog for the skill.
> Pair with `AGENTS.md` for durable protocol and `CHANGELOG.md` for completed delivery history.

## Open Backlog

- [x] `Add Node.js validator twin:` implement a modular Node.js counterpart for `validate-context.sh` so ABCd validation works on Windows and can be cross-checked against the Bash implementation.
- [x] `Automate Markdown shape validation:` extend `validate-context.sh` with checks for table overuse and wide table rows: flag definition-list tables, enforce short source rows for real tables, and keep the rule configurable for project-local style overlays.
- [x] `Add deeper validator checks for root-state drift:` detect more cases where the same completed slice appears both open in `BACKLOG.md` and delivered in `CHANGELOG.md` instead of stopping at file-presence and structural checks.
- [x] `Add an ABCd-style fixture project for validator regression tests:` move more self-test coverage out of inline heredocs and into a reusable fixture that models the preferred root standard directly.
- [x] `Document coexistence with stricter project-local overlays:` explain how `abcd-context` should hand off to repository-specific gatekeepers and alignment skills without duplicating their rules.
