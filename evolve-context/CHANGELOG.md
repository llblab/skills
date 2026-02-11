# Changelog

## 1.0.0

- Structural cleanup: protocols.md 261→90 lines, removed Session Initialization ceremony, During-Task YAML tracking, Post-Task Protocol Full (now inline in SKILL.md)
- Context Template made minimal and A2-aligned: removed 9 Meta-Protocol Principles, Pre/Post-Task protocols from template
- Full post-task steps inlined in SKILL.md (no external link dependency)
- Index file naming: `AGENTS.md` primary, alternatives listed as fallback
- Added discovered constraints: A2-templates, self-contradiction, LLM YAML fiction, ceremonial formalization
- protocols.md now contains only delta: adaptation rules, lifecycle management, validation checklist

## 0.4.0

- Added self-test script (32 assertions)
- Fixed "Core structure sections missing" false positive for skill AGENTS.md
- Core structure check now accepts both `## 1.` and skill-style key sections

## 0.3.0

- Major refactor: SKILL.md compressed from 573 to 161 lines
- Detailed protocols extracted to `docs/protocols.md`
- Introduced light/full post-task protocol tiers (3 vs 8 steps)
- Added `--json` output mode to `validate-context`
- Fixed `grep -P` → `grep -oE` for macOS compatibility
- Fixed `heading_to_anchor` to preserve underscores (GitHub compat)
- Fixed LaTeX detection false positives on shell variables like `$HOME`
- Fixed Change History regex matching `[[ ]]` syntax in constraints
- Added ERR trap for runtime crash diagnostics
- Added `docs/protocols.md` — full protocol specifications

## 0.2.0

- Three-layer architecture (README → Index → Docs)
- `validate-context` with 10+ checks
- Bloat analysis with heuristic signals
- Entry templates extracted to `docs/templates.md`
- Anchor validation for GitHub-style headings

## 0.1.0

- Initial release of the Context Evolution Protocol skill
