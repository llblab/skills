# AGENTS.md (brain-storm)

## Knowledge & Conventions

### Purpose Boundary

- The skill turns uncertainty into design direction, not implementation work.
- It should stay useful across repositories, teams, and domains without assuming any specific project memory system or sibling skill library.

### Independence Rules

- Keep reusable instructions project-neutral and self-contained.
- Do not hard-code sibling skill names, concrete project names, private repository names, or local stack mirrors.
- Express adaptation as generic lenses: context, portability, modularity, ownership, review, validation, and handoff.

### Operating Principles

- Use the smallest design artifact that preserves shared understanding.
- Ask only questions that can change the design.
- Prefer optional module boundaries over forcing every useful idea into mandatory core.
- Preserve local project vocabulary when operating inside a repository; do not import new ontology unless it solves a real ambiguity.
