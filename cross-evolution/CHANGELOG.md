# Changelog

## Unreleased

- `Release`: Synchronized all skill `SKILL.md` metadata versions to `1.0.6`. Impact: the skill library stays on one coherent release line.
- `Atomic Independence`: Expanded the contract from script-only isolation to reusable-skill portability: no hard-coded sibling skills, concrete projects, private repositories, or stack mirrors inside portable skill text. Impact: cross-evolution now protects skill independence at the instruction layer as well as the script layer.
- `Gene Registry`: Added the active `portable-skill` gene for detecting project-neutral, self-contained skill instructions. Impact: audits can now reward reusable skills that compose through neutral contracts and lenses instead of direct stack coupling.
- `Docs`: Updated README and operational context around generic synergy and adaptation-by-pritirka. Impact: the skill explains how to transfer useful patterns without mirroring local project context.
- `Audit UX`: Replaced the wide Gene × Skill matrix with decomposed Gene Coverage and Skill Gene Profiles sections. Impact: audit structure stays readable in narrow terminals and long skill/gene lists remain easier to track.
- `Gene Concept`: Reframed genes as deep transportable emergent meme-atoms rather than shallow file/script presence checks. Impact: future evolution should optimize for meaningful skill behavior, composition, and graceful degradation instead of checklist compliance.
- `Architecture Direction`: Documented a JSON-first target model with a machine-readable gene registry, skill-local research artifacts, markdown explanations, and narrow observation scripts. Impact: cross-evolution now has a clearer path away from wide central markdown tables.
- `JSON Observer`: Added local `genes.json`, skill-local `.cross-evolution.json` artifacts for cross-evolution and brainstorming, plus `audit-cross-evolution.sh`, `inspect-skill.sh`, and `inspect-gene.sh`. Impact: agents can inspect deep gene coverage and skill profiles without relying on the transitional markdown table registry.
- `Registry Migration`: Retired the wide machine-parsed markdown gene tables in favor of the JSON registry and human-readable `docs/genes.md` notes; legacy `audit-genes.sh` now delegates to the JSON-first observer. Impact: shallow file-presence genes are no longer active registry truth, and the observation surface stays narrow.
- `Observer UX`: Added filter-aware output for skill/gene inspection and a review queue for unignored missing genes. Impact: focused inspection no longer prints unrelated sections, while ecosystem audit gives the agent a concrete next-review list without reintroducing a wide matrix.
- `Naming Discipline`: Renamed `cross-evolution.genes.json` to local `genes.json`. Impact: the registry avoids redundant domain prefixes when file ownership is already clear from directory context.
