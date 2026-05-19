# Changelog

## 1.0.12 - 2026-05-19

- `Validator Path Argument` Added explicit project-root argument support to the Bash and Node validators, including missing-path failures, self-test coverage, and usage docs. Impact: callers can run `validate-context.sh /path/to/project` without relying on `cwd` or `VALIDATE_CONTEXT_ROOT`.
- `Recipe Binding` Added `recipes/validate-context.json` with a relative `../scripts/validate-context.mjs` template. Impact: agents can bind the validator as a portable pi-auto-tools recipe without hard-coded local skill paths.

## 1.0.9 - 2026-05-07

- `Dual Runtime Validator` Added `scripts/validate-context.mjs` as a Node.js twin for `validate-context.sh` and updated the regression test to run both with warning/error parity. Impact: ABCd validation now has a Windows-friendly runtime path and interchangeable core implementations.
- `Overlay Coexistence` Documented how ABCd hands off to stricter project-local overlays without duplicating their rules. Impact: portable context validation can compose with repository-specific gates cleanly.
- `Validator Fixture` Added an ABCd-style fixture project and `scripts/_self-test.mjs` regression test. Impact: validator checks now have a reusable preferred-root-shape test target.
- `Root Drift Validation` Added `validate-context.sh` detection for unchecked backlog slice labels that also appear in `CHANGELOG.md`. Impact: ABCd can now catch obvious open/completed state drift beyond file-presence checks.
- `Markdown Shape Validation` Added configurable `validate-context.sh` warnings for wide Markdown table rows and definition-list style tables. Impact: ABCd can now automate the compact-table/definition-list documentation rule without hardcoding project-local style overlays.
- `Release` Synchronized ABCd Context metadata to `1.0.9` as part of the skill-library release. Impact: the skill remains on the shared release line.
- `Skill Identity` Finalized the rename from `evolve-context` to `abcd-context`. Impact: the skill name now matches the ABCd memory architecture.
- `Skill Portability` Tightened the skill description and README around project-neutral, independent context maintenance. Impact: ABCd remains reusable while local overlays can compose without being mirrored into the skill.
