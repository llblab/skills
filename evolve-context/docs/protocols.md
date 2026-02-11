# Protocols Reference

Detailed protocol specifications for the Context Evolution Protocol.
For the compact version, see [SKILL.md](../SKILL.md).

## Session Initialization

### Phase 1: Discovery

Execute at every session start in strict order:

```
1. LOCATE index file in project root (AGENTS.md | CLAUDE.md | CODEX.md | GEMINI.md | CONTEXT.md)
2. IF FOUND → verify structural currency via mandatory sections:
   - Overall Concept
   - Pre-Task Preparation Protocol
   - Task Completion Protocol
   - Change History
3. IF NOT FOUND → proceed to Phase 2: Action Strategy
```

### Phase 2: Action Strategy

```
CURRENT STRUCTURE FOUND:
  → Load context, report adherence to protocols

OUTDATED STRUCTURE FOUND:
  → Migrate content to current template non-destructively
  → Preserve architectural wisdom while updating framework
  → Replace file, report evolution completion

NO FILE FOUND:
  → Analyze project structure
  → Create context using Context Template (see templates.md)
  → Request project concept statement for population
```

---

## Target Detection & Adaptation

### Index File Resolution

```
ON PROJECT INIT:
  SCAN project root for index file:
    1. AGENTS.md   → use as index
    2. CLAUDE.md   → use as index
    3. CONTEXT.md  → use as index
    4. None found  → create AGENTS.md (universal default for agent instructions)

  DETECT index file format:
    - Read existing structure, headings, conventions
    - ADAPT entry format to match existing style
    - NEVER impose a foreign structure on existing file
```

### Docs Index Resolution

```
ON PROJECT INIT:
  CHECK /docs/README.md existence:
    EXISTS  → read, parse structure, build mental map of all project docs
    MISSING → create with initial structure (see templates.md)
```

### Adaptation Rules

- 'Respect what exists.' Read current format before writing.
- 'Match tone and structure.' Bullets → bullets. Tables → tables.
- 'Extend, don't reformat.' Add entries in the style already established.
- 'If file is empty or new:' use the entry templates defined in `templates.md` as defaults.

---

## During-Task Tracking

> Passive. Zero overhead. Captures raw material for post-task.

Track in working memory:

```yaml
_task_tracking:
  surprises: [] # Unexpected behaviors
  decisions: [] # Choices made and why
  mistakes_avoided: [] # Past insights that helped
  new_constraints: [] # Boundaries discovered
  patterns_noticed: [] # Recurring themes
  docs_stale: [] # /docs entries that need update
  docs_missing: [] # Documentation that should exist but doesn't
  docs_duplicated: [] # Documentation that overlaps with other docs
  architectural_impact: [] # Changes affecting project structure or decisions
```

---

## Post-Task Protocol (Full)

> 'MANDATORY.' Executes before delivering final result.

```
STEP 1: EVALUATE — Is there anything worth capturing?
  Filter: Will this help future tasks? Would forgetting this cause a repeated mistake?
  If nothing passes filter → SKIP to STEP 6

STEP 2: ROUTE — Where does each insight belong?
  Process knowledge → index file (Layer 1)
  Domain knowledge  → /docs (Layer 3)
  Architectural wisdom → index file (Architectural Decisions section)
  Use routing decision tree from SKILL.md

STEP 3: CHECK DUPLICATES — Does this knowledge already exist?
  If yes → ENHANCE existing entry (don't create new)
  If no  → CREATE new entry

STEP 4: WRITE — Update target file(s)
  Index file → match existing format (see Adaptation Rules)
  /docs      → find appropriate doc or create new one

STEP 5: CONSOLIDATE — Deduplicate and merge
  a. If new doc content overlaps with existing doc:
     → Merge into the more appropriate file
     → Remove the weaker duplicate
     → Update /docs/README.md to reflect the change
  b. If section > 10 entries → consolidate tactical → strategic

STEP 6: SYNC DOCS INDEX — /docs/README.md maintenance
  [ ] Every .md file in /docs/ is listed in /docs/README.md
  [ ] Every link in /docs/README.md points to an existing file
  [ ] New docs created in this task are indexed
  [ ] Removed/merged docs are de-indexed
  [ ] Descriptions in index match current doc content

STEP 7: MANDATORY CONTEXT EVOLUTION
  [ ] Analyze architectural impact of changes
  [ ] Update index file sections for currency
  [ ] Add substantive Change History entry
  [ ] Maintain maximum entry limit (rotate to CHANGELOG.md)

STEP 8: VALIDATE — run validate-context
  RUN bash "${SKILL_DIR}/scripts/validate-context" from project working directory
  Skip if no docs/index/readme evolution occurred in this task (pure code-only change)
  IF errors:
    → AUTO-FIX obvious issues (renamed files, moved docs, typos in anchors)
    → ASK USER for ambiguous cases (missing target, multiple candidates)
  IF warnings:
    → NOTE for potential future action
  [ ] Script exits with 0 (all checks passed)
  [ ] No duplicate information across layers
  [ ] New entries match existing file format
  [ ] General → specific structure maintained
```

---

## Context Lifecycle Management

### Growth Control Pipeline

```
Discovery → Active Entry → Consolidation Queue → Strategic Pattern → Archive
```

### Garbage Collection Triggers

GC is triggered by 'heuristic signals' from `validate-context`, not by a hardcoded line count.
The script detects bloat through:

- 'Low density' (<40% structural elements) → verbose prose needs consolidation
- 'Disproportionate sections' (>2× average) → specific section needs trimming
- 'Change History overflow' (>5 entries) → rotation needed
- 'Sparse structure' (>15 lines/heading) → reorganization needed

When the script reports '3+ bloat signals', garbage collection is mandatory.
When it reports '1-2 signals', consolidation is recommended at agent discretion.

### Consolidation Triggers & Actions

| Signal                                    | Action                                              |
| ----------------------------------------- | --------------------------------------------------- |
| 3+ entries describe same pattern          | Extract strategic pattern, archive tactical entries |
| Entry not referenced in 10+ tasks         | Move to archive section or remove                   |
| Two sections overlap >50%                 | Merge, redirect references                          |
| Section exceeds 10 entries                | Split by abstraction or consolidate                 |
| Mistake repeated despite existing insight | ESCALATE (see ladder below)                         |
| `/docs` entry contradicts implementation  | Flag for update or rewrite                          |
| Two `/docs` files cover same topic        | Merge into better-suited file, update index         |
| `/docs` file not in README.md             | Add to index immediately                            |
| README.md link points to missing file     | Create file or remove dead link                     |
| validate-context reports bloat signals    | Run garbage collection on flagged sections          |

### Mistake Prevention Escalation

```
Level 1: Insight logged in index file
  ↓ mistake repeated
Level 2: Convention added to index file with emphasis
  ↓ mistake repeated
Level 3: Hard rule with validation step
  ↓ mistake repeated
Level 4: Structural change (tooling, automation, pre-commit hook)
```

### Documentation Consolidation Protocol

> Triggered when duplicate documentation is detected.

```
1. IDENTIFY the two (or more) overlapping documents
2. DETERMINE which file is the better home:
   - More specific filename? → winner
   - More established (older, more referenced)? → winner
   - Better location in /docs structure? → winner
3. MERGE content from weaker → stronger document
   - Preserve all unique information
   - Resolve contradictions (newer = truth unless explicitly overridden)
4. DELETE or DEPRECATE the weaker document
5. UPDATE /docs/README.md:
   - Remove entry for deleted doc
   - Update description for merged doc
6. UPDATE any cross-references in index file or other docs
```

---

## Self-Evolution Rules

### This Skill File

- Updated when operational protocols prove inefficient
- Changes require: observed problem → proposed fix → validation criteria
- Version bump on structural changes

### Change History Rotation

When Change History exceeds 5 entries:

1. Move `[Legacy-2]` entry into `CHANGELOG.md`, grouped by version
2. Shift all entries down: Current → Previous → Legacy-0 → Legacy-1 → Legacy-2
3. Insert new entry as `[Current]`
4. Ensure `CHANGELOG.md` is linked from `README.md` if it exists

---

## Validation Checklist (ON_REQUEST mode)

> Run `validate-context` first — it automates link, structural, and bloat checks.
> Below are 'manual-only' items the script cannot verify.

- [ ] No information duplicated across layers
- [ ] Entries match existing file style (tone, format)
- [ ] General → specific structure maintained
- [ ] No stale entries (unreferenced for 10+ tasks)
- [ ] No repeated mistakes without escalation

## Related

- [SKILL.md](../SKILL.md) — compact skill definition
- [templates.md](./templates.md) — entry templates
- [validation-design.md](./validation-design.md) — validator design
