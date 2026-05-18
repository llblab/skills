---
name: dev2main-release
description: Manage a guarded release flow that commits prepared release work on dev, opens a dev-to-main pull request with a release-focused PR summary, waits for checks, merges on success, tags, and optionally publishes an existing npm package. Use when the user asks to prepare or execute a dev→main release PR, hotfix release PR, or Dev2Main PR Summary workflow.
metadata:
  version: 1.0.11
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
2. Inspect the package or application version and confirm it is already bumped to the intended release version.
3. Read the relevant version section in `CHANGELOG.md`.
4. Run the smallest meaningful validation first. Prefer the project release validation command when available.
5. Stage only intentional release files.
6. Create one release commit using this format:

```text
<version>: <short release theme>, <secondary theme>
```

Example:

```text
0.8.1: outbound voice translation hotfix, queue safety
```

7. Push `dev` to `origin/dev`.
8. Open a pull request from `dev` to `main`.
9. Build the PR body from `CHANGELOG.md`, not from memory only.
10. Watch PR checks until they finish.
11. If all required checks pass, merge the PR into `main`.
12. After a successful merge, switch the local repository to `main`.
13. Pull the latest `main` changes.
14. Confirm the version on `main` matches the intended release version.
15. Create and push exactly one release tag for the confirmed version on the current `main` commit:

```bash
git tag v<version>
git push origin v<version>
```

If the tag already exists locally or remotely, verify it points to the current `main` commit before continuing. If an existing `v<version>` tag points anywhere else, stop and report the mismatch. Do not move, delete, or force-push tags.

16. Before publishing, check whether the package already exists on npm:

```bash
npm view <package-name> version
```

17. Publish only when both conditions are true:

- The package already exists on npm.
- The `main` version matches the intended release version and is newer than the npm version.

If both conditions are true, run:

```bash
npm publish --access public
```

If the package does not exist on npm, do not publish. New packages must never be published by this skill.

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
