---
name: dev2main-release
description: Manage a guarded release flow that commits prepared release work on dev, opens a dev-to-main pull request with a release-focused PR summary, waits for checks, merges on success, tags, and optionally publishes an existing npm package. Use when the user asks to prepare or execute a dev→main release PR, hotfix release PR, or Dev2Main PR Summary workflow.
metadata:
  version: 1.0.18
---

# Dev2Main Release

Use this skill to run a release through a `dev` → `main` pull request with a compressed PR body derived from the release changelog.

## Hard Gate

Run release actions only when all criteria are true:

1. The current branch is `dev`.
2. There are uncommitted files intended for the release.
3. The package or application version is already bumped to the intended release version.
4. The user explicitly asked to run the release flow, including external actions such as pushing, opening a PR, merging, tagging, or publishing.

If any criterion fails, reject the flow and stop. Do not stage, commit, push, create PRs, merge, tag, publish, or modify files from this plan.

## Release Flow

After the hard gate passes:

1. Inspect `git status --short --branch` and confirm the repository is on `dev` with uncommitted release files.
2. Identify the project version source and confirm it is already bumped to the intended release version. Prefer the repository's primary manifest or release metadata, such as `package.json`, `pyproject.toml`, `Cargo.toml`, app config, or a documented version file. Do not assume npm unless the project is an npm package.
3. Read the relevant version section in `CHANGELOG.md`.
4. Confirm release-note freshness: the intended version section must exist, describe the release being shipped, and not leave those same shipped changes stranded under `Unreleased`. Stop and ask if the changelog shape is ambiguous or the intended version section is missing.
5. Run the smallest meaningful validation first. Prefer the project release validation command when available.
6. Stage only intentional release files.
7. Inspect the repository's recent commit-message style before writing the release commit message:

```bash
git log -5 --pretty=%s
```

8. Create one release commit whose format matches the discovered local style. If the recent history shows a stable release-commit pattern, adapt that pattern to the intended version and release theme. If the style is mixed or too sparse to infer confidently, use the latest relevant commit subject as the fallback style template rather than imposing this skill's example format.
9. Push `dev` to `origin/dev`.
10. Open a pull request from `dev` to `main`.
11. Build the PR body from `CHANGELOG.md`, not from memory only.
12. Watch PR checks until they finish.
13. If all required checks pass, merge the PR using the repository's established merge method. Prefer the repository default when available; otherwise infer from recent merged PRs or project convention. If no convention is discoverable, use a normal merge commit rather than squash/rebase because it preserves the dev release commit and release audit trail.
14. After a successful merge, switch the local repository to `main`.
15. Pull the latest `main` changes.
16. Confirm the version on `main` matches the intended release version.
17. Create and push exactly one release tag for the confirmed version on the current `main` commit:

```bash
git tag v<version>
git push origin v<version>
```

If the tag already exists locally or remotely, verify it points to the current `main` commit before continuing. If an existing `v<version>` tag points anywhere else, stop and report the mismatch. Do not move, delete, or force-push tags.

18. Before publishing, check whether the package already exists on npm:

```bash
npm view <package-name> version
```

19. Publish only when both conditions are true:

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

Stop without merging, tagging, or publishing when:

- Run criteria fail.
- The version source cannot be identified safely or multiple version files disagree.
- The intended changelog version section is missing, ambiguous, or still duplicated under `Unreleased`.
- Validation fails and cannot be fixed safely inside the release scope.
- PR checks fail.
- The pulled `main` version does not match the intended release version.
- The release tag exists on a different commit.
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
- npm package existence/version check
- Publish result or publish skip reason
