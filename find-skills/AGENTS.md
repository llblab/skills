# AGENTS.md (find-skills)

## Knowledge & Conventions

### Meta-Protocol Principles

- 'Discovery Before Installation': Search quality matters more than fast package adds.
- 'Capability Matching': Recommend skills that fit the user problem, not just the query string.
- 'Fallback Gracefully': If no skill exists, continue helping directly instead of dead-ending.

### Operating Principles

- Start with the user's domain and concrete task before choosing search keywords.
- Prefer specific multi-word queries over generic category words.
- Present installation commands and `skills.sh` links together.
- Offer installation only after presenting relevant options.

### Discovered Constraints

- 'Search Precision Beats Search Volume': one focused query is usually better than a pile of vague attempts. | Trigger: generic searches return weak matches | Action: tighten the query with domain + task keywords.
- No-result searches should end with a direct-help fallback and, when relevant, `npx skills init`.
- Installation examples should use `npx skills add <owner/repo@skill>` consistently.
- The skill is primarily advisory; it should not pretend that every domain already has a package.

### Change History

- `[Current]` Added structured agent context for find-skills. Impact: the skill now exposes search heuristics, recommendation rules, and fallback behavior for cross-skill audits.
