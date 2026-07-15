---
name: dev2main-release
description: Manage a guarded release flow that commits prepared release work on dev, opens a dev-to-main pull request with a release-focused PR summary, waits for checks, merges on success, tags, creates the matching GitHub Release, and optionally publishes an existing npm package. Use when the user asks to prepare or execute a dev→main release PR, hotfix release PR, or Dev2Main PR Summary workflow.
metadata:
  version: 1.0.21
---

# Dev2Main Release

Use this skill to run a release through a `dev` → `main` pull request with a compressed PR body derived from the release changelog.

## Hard Gate

Run release actions only when all criteria are true:

1. The current branch is `dev`.
2. There are uncommitted files intended for the release.
3. The package or application version is already bumped to the intended release version.
4. The user explicitly asked to run the release flow, including external actions such as pushing, opening a PR, merging, tagging, creating a GitHub Release, or publishing.

If any criterion fails, reject the flow and stop. Do not stage, commit, push, create PRs, merge, tag, create a GitHub Release, publish, or modify files from this plan.

## Direct-Main Boundary

This skill owns only the guarded `dev` → `main` release path. A request to commit, tag, release, or publish directly from `main` does not satisfy the hard gate and must not be reinterpreted as this flow.

Direct-main publishing remains a separate explicit owner override outside this skill. It requires its own current-state audit, validation, and confirmation of every external action; prior use, urgency, a missing `dev` branch, or a small hotfix does not make it the fallback path here. Do not provide or execute a partial direct-main variant from this plan.

A hotfix handled by this skill must still start from `dev`, contain prepared uncommitted release files and an already-bumped version, and pass through a `dev` → `main` pull request. If repository policy requires a direct-main exception, stop and hand the request back as an out-of-scope owner decision before changing repository or release state.

## Release Flow

After the hard gate passes:

1. Inspect `git status --short --branch` and confirm the repository is on `dev` with uncommitted release files.
2. Identify the project version source and confirm it is already bumped to the intended release version. Prefer the repository's primary manifest or release metadata, such as `package.json`, `pyproject.toml`, `Cargo.toml`, app config, or a documented version file. Do not assume npm unless the project is an npm package.
3. Locate and read the intended version section and any `Unreleased` section in `CHANGELOG.md`; do not load the complete changelog by default. For topmost sections, begin with the first 50 lines and expand each relevant section only to its boundary when necessary.
4. Before consolidating, inspect the actual release diff against the PR base, including staged and unstaged changes, and consult relevant tests or documentation when they establish shipped behavior. Then group repeated development evidence and intermediate implementation chronology into outcome-focused bullets while preserving user-visible behavior, safety and compatibility contracts, migrations, known limitations, and meaningful operator evidence. Remove fixed-then-reworked mechanics, repeated gate runs, superseded findings, and other pre-release process residue that does not describe the shipped state. Do not rewrite older release history as part of this step.
5. Confirm release-note freshness: the intended version section must exist, describe the release being shipped, and not leave those same shipped changes stranded under `Unreleased`. Stop and ask if the changelog shape is ambiguous, the intended version section is missing, the changelog conflicts with release-diff evidence, or safe consolidation would require guessing which behavior actually ships.
6. Run the smallest meaningful validation first. Prefer the project release validation command when available.
7. Stage only intentional release files.
8. Inspect the repository's recent commit-message style before writing the release commit message:

```bash
git log -5 --pretty=%s
```

9. Create one release commit whose format matches the discovered local style. If the recent history shows a stable release-commit pattern, adapt that pattern to the intended version and release theme. If the style is mixed or too sparse to infer confidently, use the latest relevant commit subject as the fallback style template rather than imposing this skill's example format.
10. Push `dev` to `origin/dev`.
11. Open a pull request from `dev` to `main`.
12. Build the PR body from the consolidated release section in `CHANGELOG.md`, not from memory or pre-consolidation notes.
13. Watch PR checks until they finish.
14. If all required checks pass, merge the PR using the repository's established merge method. Prefer the repository default when available; otherwise infer from recent merged PRs or project convention. If no convention is discoverable, use a normal merge commit rather than squash/rebase because it preserves the dev release commit and release audit trail.
15. After a successful merge, switch the local repository to `main`.
16. Pull the latest `main` changes.
17. Confirm the version on `main` matches the intended release version.
18. Create and push exactly one release tag for the confirmed version on the current `main` commit:

```bash
git tag v<version>
git push origin v<version>
```

If the tag already exists locally or remotely, verify it points to the current `main` commit before continuing. If an existing `v<version>` tag points anywhere else, stop and report the mismatch. Do not move, delete, or force-push tags.

19. Create exactly one published GitHub Release for the confirmed tag. First determine whether the intended version is stable or a prerelease from the version and changelog, then check whether a release already exists:

```bash
gh release view v<version> --json tagName,isDraft,isPrerelease,publishedAt,url
```

Treat the release as absent only when GitHub explicitly reports that `v<version>` has no release, such as an HTTP 404 or `release not found`. Authentication, authorization, network, rate-limit, repository-resolution, and other CLI/API failures are not absence; stop and report them instead of attempting creation.

If no release exists, create it with the existing tag, the changelog release heading as its title, and release-focused notes derived from that changelog section.

For a normal stable release:

```bash
gh release create v<version> --verify-tag --latest --title "<changelog release heading without Markdown prefix>" --notes-file <release-notes-file>
```

For an explicit prerelease:

```bash
gh release create v<version> --verify-tag --prerelease --latest=false --title "<changelog release heading without Markdown prefix>" --notes-file <release-notes-file>
```

If a release already exists, verify that `tagName` equals `v<version>`, `isDraft` is false, `publishedAt` is present, and `isPrerelease` matches the intended stable/prerelease state. Reuse it instead of creating a duplicate. If any field conflicts, stop and report the mismatch; do not silently edit, delete, or replace it.

After creation or reuse, verify latest state. For a stable release, the latest-release endpoint must resolve to the intended tag:

```bash
gh api repos/{owner}/{repo}/releases/latest --jq .tag_name
```

For a prerelease, confirm that the endpoint does not resolve to the prerelease tag. A missing latest stable release is acceptable for a prerelease-only repository.

20. Before publishing, check whether the package already exists on npm:

```bash
npm view <package-name> version
```

21. Publish only when both conditions are true:

- The package already exists on npm.
- The `main` version matches the intended release version and is newer than the npm version.

If both conditions are true, run:

```bash
npm publish --access public
```

If the package does not exist on npm, do not publish. New packages must never be published by this skill.

## Version And Changelog Contract

The version source is project-local. For npm packages use `package.json` and lockfiles when present. For Python, Rust, mobile, or custom apps, use the manifest or release metadata that the repository treats as authoritative. If multiple version files exist, they must agree before release actions continue.

The changelog must have a section for the intended version before the release flow starts. The section should contain the release changes being shipped. `Unreleased` may remain as an empty placeholder, but it must not still contain the same shipped changes after they have been assigned to the version section.

Treat the intended release section as a pre-release working set until the release gate. Development may accumulate focused implementation findings, smoke evidence, and corrective iterations there, but the release flow must consolidate them into the smallest truthful set of outcome-focused entries before commit, PR, tag, and release-note generation. Preserve distinct shipped domains and safety guarantees; remove chronology and superseded intermediate state. Consolidation means semantic compression, not vague summarization.

## GitHub Release Contract

The GitHub Release and Git tag are one release unit. A successful tag push is not a completed release until a matching published GitHub Release exists.

- Derive the title from the changelog heading by removing the Markdown prefix, for example `## 0.4.0: Bounded Worker Meta-Protocol` becomes `0.4.0: Bounded Worker Meta-Protocol`.
- Derive notes from the matching changelog section. Compress when needed, but cover every meaningful release group and do not include older version sections.
- Use the already-pushed `v<version>` tag; never create a second tag through release creation.
- Mark a normal stable release as latest with `--latest`. Mark an explicit prerelease with `--prerelease --latest=false`; never promote a prerelease to latest.
- Verify the resulting release URL, tag, published state, prerelease state, and latest state before continuing to registry publication.

## Release Commit Message Contract

The release commit subject is a repository-local convention, not a universal template.

Before committing, inspect recent history with `git log -5 --pretty=%s` (or fewer commits if the repository has fewer). Infer the broad subject style from nearby commits, especially prior release/version commits when present. Preserve observable conventions such as version prefixing, separators, casing, imperative vs noun-phrase wording, and whether a secondary theme is included.

Examples of adaptation, not mandatory formats:

- Recent: `0.8.1: outbound voice translation hotfix, queue safety` -> next release may use `<version>: <theme>, <secondary theme>`.
- Recent: `release: 0.8.1` -> next release may use `release: <version>`.
- Recent: `v0.8.1` -> next release may use `v<version>`.

If no stable pattern can be inferred, use the latest relevant commit subject as the fallback style template and adapt only the version/theme content. Do not stop solely because the style is mixed; stop only when the commit subject would be misleading or the release version/theme cannot be identified safely.

## PR Body Contract

The PR body must include at minimum:

```md
## Summary

This release <primary release outcome from CHANGELOG.md>.

It also <secondary behavior/safety/compatibility outcome from CHANGELOG.md>.

## Validation

- <Validation command> — <result>
```

Prefer this fuller shape when the changelog has enough substance:

```md
## Summary

This release <primary release outcome from CHANGELOG.md>.

It also <secondary behavior/safety/compatibility outcome from CHANGELOG.md>.

## Why

<One short paragraph explaining the user/operator problem solved. Omit only when obvious. For hotfixes, include this section.>

## User-visible behavior

- <User-facing change>
- <Operational or safety behavior>
- <Compatibility or UI behavior>

## Changed areas

- `<domain/file>`: <review-relevant implementation summary>
- Docs/package metadata: <docs/version summary>

## Risk Notes

- <Runtime, queue, rendering, lock, config, migration, external-service risk and mitigation, or `No migration/config changes required.`>

## Validation

- <Validation command> — <result>
```

## PR Writing Rules

- Start `## Summary` with 1-2 short release paragraphs, not only bullets.
- First paragraph starts with `This release` or `This hotfix` and names the primary user-visible behavior.
- Second paragraph, when useful, explains the main safety, compatibility, or architecture impact.
- Add `## Why` when the release fixes a bug, race, stale state, missing context, or confusing behavior. Hotfixes must include it.
- Add `## User-visible behavior` or `## Behavior` for operator-facing behavior changes.
- Add `## Highlights` for broad feature releases where bullet scanning is better than a long changed-area list.
- Add `## Changed areas` only when implementation boundaries help reviewers understand risk. Group by domain, not every file.
- Add `## Risk Notes` for runtime, queue, rendering, locks, delivery, migrations, config, or external-service behavior.
- Cover every meaningful changelog group/change in compressed form.
- Keep wording release-focused and user-facing where possible.
- Mention implementation-only items only when they explain behavior, compatibility, or risk reduction.
- Do not paste the full changelog.
- Avoid vague filler bullets such as “improves safety”, “updates tests”, or “bumps version” unless they name concrete behavior, risk reduction, or package version.
- Prefer exact operator verbs: “clears”, “preserves”, “blocks”, “forwards”, “retries”, “falls back”, “renders”, “strips”, “uploads”.

## Stop Conditions

Stop further release actions and report the state already completed when:

- Run criteria fail.
- The version source cannot be identified safely or multiple version files disagree.
- The intended changelog version section is missing, ambiguous, or still duplicated under `Unreleased`.
- Validation fails and cannot be fixed safely inside the release scope.
- PR checks fail.
- The pulled `main` version does not match the intended release version.
- The release tag exists on a different commit.
- GitHub Release creation or verification fails, or an existing release conflicts with the confirmed tag/version state.
- The npm package does not exist.
- The `main` version is not newer than the npm version.

## Final Report

Report:

- Commit hash
- PR URL
- Checks result
- Merge status
- `main` version confirmation
- Release tag push/result
- GitHub Release URL and published/prerelease/latest state
- npm package existence/version check
- Publish result or publish skip reason
