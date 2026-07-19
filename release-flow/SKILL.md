---
name: release-flow
description: Select and run a guarded release flow for a non-fork GitHub repository owned by the authenticated user, using a dev-to-main pull request when a local or origin dev branch exists and otherwise releasing directly from main before tagging, creating the matching GitHub Release, and optionally publishing an existing npm package. Use when the owner explicitly asks to release their GitHub repository; do not use for contributor, organization, feature-branch integration, or non-GitHub workflows.
metadata:
  version: 1.1.0
---

# Release Flow

Use this skill to select and run the release path that matches an eligible owner-controlled GitHub repository: a guarded `dev` → `main` pull request when `dev` exists, or a guarded direct-`main` release when it does not. Release notes and PR text come from the canonical project changelog when one already exists; otherwise they come from a verified, outcome-focused release narrative derived from the actual release diff. This skill never creates a changelog.

## Eligibility Boundary

Establish eligibility before selecting a branch route or changing repository state.

1. Confirm that `origin` resolves to a repository on `github.com`. Non-GitHub hosts and merge-request-based workflows are outside this skill.
2. Confirm active GitHub CLI authentication and identify the authenticated user with `gh api user --jq .login`. Authentication, network, host, and repository-resolution failures make eligibility unknown; stop.
3. Inspect the repository with `gh repo view --json nameWithOwner,owner,isFork,viewerPermission`.
4. Require all of the following:
   - The repository owner login exactly matches the authenticated user login.
   - `isFork` is `false`.
   - `viewerPermission` is `ADMIN`.
5. Stop when the repository belongs to an organization or another user, is a fork, or ownership cannot be verified. Do not treat write access, maintain access, prior releases, or contributor status as ownership.
6. Exclude feature, staging, release-candidate, and other integration-branch workflows. This skill may operate only from `dev` or `main`; it never promotes an arbitrary current branch. On the PR route, `main` is allowed only as the source of the guarded wrong-branch recovery below, and all release actions must ultimately run from `dev`.

These boundaries do not gain an automatic override. An ineligible repository needs its own project-specific release process.

## Route Selection

Select the route before staging, committing, pushing, opening a PR, tagging, creating a GitHub Release, publishing, or modifying release files.

1. Confirm that the repository has an `origin` remote.
2. Check for a local `dev` branch with `git show-ref --verify refs/heads/dev`. If it exists, select the PR route; remote `dev` detection cannot make the route less strict.
3. Only when local `dev` is absent, query `origin` directly for `refs/heads/dev`, for example with `git ls-remote --exit-code --heads origin refs/heads/dev`. Do not infer remote absence from a missing or stale `origin/dev` remote-tracking ref.
4. For `git ls-remote --exit-code`, treat exit status `2` with no matching ref as authoritative absence. Treat exit status `0` with the ref as presence. Authentication, authorization, network, repository-resolution, and other failures make route selection unknown; stop instead of choosing direct-main.
5. Select exactly one route:
   - **PR route:** Local `dev` exists, or local `dev` is absent and `origin/dev` exists.
   - **Direct-main route:** Local `dev` is absent and the authoritative query confirms that `origin/dev` is absent.

Once selected, keep that route for the entire run. A branch-state change, inconvenience, conflict, failed check, or failed PR action must not trigger fallback to the other route.

## Wrong-Branch Recovery

Use this recovery only when the PR route was selected, the current branch is `main`, and all uncommitted changes are confirmed as intentional release work. Never use it from a feature, staging, release-candidate, detached-HEAD, conflicted, rebasing, merging, or cherry-picking state.

Before moving changes, ask for explicit confirmation because the operation changes the worktree and may expose branch divergence. Then use the smallest reversible sequence:

1. Reject mixed unrelated work, unresolved conflicts, dirty submodules, or untracked files that should not enter the release.
2. Save tracked and intended untracked changes in one uniquely named stash with `--include-untracked`. Use `git stash apply`, not `pop`, so the recovery copy remains available until transfer verification completes.
3. Fetch `origin/main` and query `origin/dev`. Require `origin/main`; stop on authentication, network, repository-resolution, or fetch failure. A missing `origin/dev` remains valid when local `dev` selected the PR route.
4. Switch to local `dev`, or create it to track `origin/dev` when only the remote branch exists.
5. When `origin/dev` exists, bring local `dev` to it only with a fast-forward. Stop if local and remote `dev` have diverged; do not discard either history.
6. Compare `dev` with `origin/main` by ancestry, not by an informal measure of how far it has fallen behind:
   - If `origin/main` is already an ancestor of `dev`, keep `dev` unchanged.
   - If `dev` is an ancestor of `origin/main`, fast-forward `dev` to `origin/main`.
   - If both branches contain unique commits, classify them as diverged. Do not rebase automatically.
7. For diverged branches, report the commit ranges and ask separately before rebasing `dev` onto `origin/main`. Create a temporary backup ref first. Never force-push rewritten `dev` history as an implicit part of release approval; require separate explicit authorization and use only `--force-with-lease` if approved.
8. Apply the saved stash with index state preserved. Stop on conflicts, leave the stash intact, and report recovery instructions rather than attempting broad conflict resolution.
9. Verify that the transferred diff matches the saved release work and that no unrelated files appeared. Continue only when the worktree now represents the intended release on `dev`.
10. Keep the stash until the release commit contains the verified transferred changes. Then drop only that exact recovery stash.

After successful recovery, re-enter the normal hard gate on `dev`. Recovery never permits direct-main and never counts as authorization for rebase, force-push, or conflict resolution.

## Hard Gate

Run release actions only when all criteria are true:

1. Repository eligibility and ownership were verified without ambiguity.
2. Route selection completed without ambiguity.
3. The current branch matches the selected route: `dev` for the PR route or `main` for the direct-main route.
4. There are uncommitted files intended for the release.
5. The package or application version is already bumped to the intended release version.
6. The user explicitly asked to run the release flow, including its external actions such as pushing, opening and merging a PR when applicable, tagging, creating a GitHub Release, or publishing.

If any criterion fails, reject the flow and stop. Do not stage, commit, push, create PRs, merge, tag, create a GitHub Release, publish, or modify release files.

If the PR route was selected while release work sits on `main`, do not bypass the branch gate. Run the guarded wrong-branch recovery only after its explicit confirmation; otherwise stop without moving the changes.

## Direct-Main Boundary

Direct-main is a repository-shape route, not an urgency override or failure fallback. It is available only when authoritative checks confirm that both local `dev` and `origin/dev` are absent and the prepared release work is already on `main`.

A prior direct-main release, a small hotfix, urgency, PR inconvenience, branch protection failure, merge conflict, or failing checks does not permit direct-main while `dev` exists. If repository policy requires an exception despite an existing `dev`, stop and hand the request back as an out-of-scope owner decision before changing repository or release state.

Before committing on the direct-main route, fetch `origin/main` and require local `main` HEAD to equal `origin/main`. Stop on divergence, unpushed local commits, a missing `origin/main`, or a fetch failure; do not merge, rebase, reset, or pull automatically while prepared release changes are present.

The direct-main route retains every shared release safeguard: current-state audit, release-narrative freshness, validation, intentional staging, repository-style release commit, push verification, version confirmation, immutable tag checks, GitHub Release verification, and guarded registry publication.

## Release Flow

After the hard gate passes:

1. Inspect `git status --short --branch`, confirm the selected route, and confirm that the repository is on its required branch with uncommitted release files.
2. Identify the project version source and confirm it is already bumped to the intended release version. Prefer the repository's primary manifest or release metadata, such as `package.json`, `pyproject.toml`, `Cargo.toml`, app config, or a documented version file. Do not assume npm unless the project is an npm package.
3. Detect whether the repository already owns a canonical project-level changelog, normally at the root or at a documented release-history path. If it exists, read only the intended version section and any `Unreleased` section, beginning with the first 50 lines and expanding to section boundaries as needed. If no canonical project changelog exists, record that fact and continue without creating one. A nested subsystem changelog does not become the package release source merely because it exists; update it only when that subsystem has meaningful shipped changes and repository convention assigns history there. A synchronized version bump alone does not require a subsystem changelog entry.
4. Inspect the actual release diff. For the PR route, compare `dev` with the `main` PR base and include staged and unstaged changes. For the direct-main route, inspect all staged and unstaged changes against the verified `main` HEAD. Group repeated development evidence and intermediate chronology into outcome-focused bullets while preserving user-visible behavior, safety and compatibility contracts, migrations, known limitations, and meaningful operator evidence. Remove fixed-then-reworked mechanics, repeated gate runs, superseded findings, and other process residue that does not describe the shipped state. When a canonical changelog exists, consolidate its intended release section without rewriting older history. When none exists, create only a temporary release narrative or notes file for the PR/GitHub Release; do not add a changelog to the repository.
5. Confirm release-note freshness. When a canonical changelog exists, its intended version section must describe the release and must not leave the same shipped changes under `Unreleased`; stop if the section is missing, ambiguous, or conflicts with diff evidence. When no canonical changelog exists, its absence is not a blocker; instead verify that the temporary release narrative covers every meaningful shipped outcome. In either case, stop if safe consolidation would require guessing which behavior ships.
6. Run the smallest meaningful validation first. Prefer the project release validation command when available.
7. Stage only intentional release files.
8. Inspect the repository's recent commit-message style before writing the release commit message:

```bash
git log -5 --pretty=%s
```

9. Create one release commit whose format matches the discovered local style. If the recent history shows a stable release-commit pattern, adapt that pattern to the intended version and release theme. If the style is mixed or too sparse to infer confidently, use the latest relevant commit subject as the fallback style template rather than imposing this skill's example format.
10. Continue only through the selected route:

**PR route**

1.  Push `dev` to `origin/dev`.
2.  Open a pull request from `dev` to `main`.
3.  Build the PR body from the verified release narrative, using the consolidated canonical changelog section when one exists and the diff-derived temporary narrative otherwise.
4.  Watch PR checks until they finish.
5.  If all required checks pass, merge the PR using the repository's established merge method. Prefer the repository default when available; otherwise infer from recent merged PRs or project convention. If no convention is discoverable, use a normal merge commit rather than squash/rebase because it preserves the dev release commit and release audit trail.
6.  After a successful merge, switch the local repository to `main` and pull the latest `main` changes.

**Direct-main route**

1.  Reconfirm immediately before push that local `dev` and `origin/dev` remain absent. Stop if either now exists or the remote check fails.
2.  Push the release commit from local `main` to `origin/main` without creating a pull request.
3.  Verify that `origin/main` resolves to the pushed local `main` commit.

4.  Confirm the version on `main` matches the intended release version and that the current `main` commit is the released commit on `origin/main`.
5.  Create and push exactly one release tag for the confirmed version on the current `main` commit:

```bash
git tag v<version>
git push origin v<version>
```

If the tag already exists locally or remotely, verify it points to the current `main` commit before continuing. If an existing `v<version>` tag points anywhere else, stop and report the mismatch. Do not move, delete, or force-push tags.

13. Create exactly one published GitHub Release for the confirmed tag. First determine whether the intended version is stable or a prerelease from the version and verified release narrative, then check whether a release already exists:

```bash
gh release view v<version> --json tagName,isDraft,isPrerelease,publishedAt,url
```

Treat the release as absent only when GitHub explicitly reports that `v<version>` has no release, such as an HTTP 404 or `release not found`. Authentication, authorization, network, rate-limit, repository-resolution, and other CLI/API failures are not absence; stop and report them instead of attempting creation.

If no release exists, create it with the existing tag, a release title derived from the canonical changelog heading when available or `<version>: <concise release theme>` otherwise, and notes derived from the verified release narrative.

For a normal stable release:

```bash
gh release create v<version> --verify-tag --latest --title "<release title>" --notes-file <release-notes-file>
```

For an explicit prerelease:

```bash
gh release create v<version> --verify-tag --prerelease --latest=false --title "<release title>" --notes-file <release-notes-file>
```

If a release already exists, verify that `tagName` equals `v<version>`, `isDraft` is false, `publishedAt` is present, and `isPrerelease` matches the intended stable/prerelease state. Reuse it instead of creating a duplicate. If any field conflicts, stop and report the mismatch; do not silently edit, delete, or replace it.

After creation or reuse, verify latest state. For a stable release, the latest-release endpoint must resolve to the intended tag:

```bash
gh api repos/{owner}/{repo}/releases/latest --jq .tag_name
```

For a prerelease, confirm that the endpoint does not resolve to the prerelease tag. A missing latest stable release is acceptable for a prerelease-only repository.

14. Determine whether npm publication applies. Require a project-owned `package.json` with a package name and no `private: true`. If the project is not a publishable npm package, skip registry checks and publication; do not guess another registry workflow.

For an applicable npm package, check whether that package already exists:

```bash
npm view <package-name> version
```

Treat an explicit npm not-found response as package absence. Authentication, authorization, network, registry-resolution, and other lookup failures are not absence; stop and report them.

15. Publish only when both conditions are true:

- The package already exists on npm.
- The `main` version matches the intended release version and is newer than the npm version.

If both conditions are true, run:

```bash
npm publish --access public
```

If the package does not exist or the intended version is not newer, skip publication and report the reason. New packages must never be published by this skill.

## Version And Release Narrative Contract

The version source is project-local. For npm packages use `package.json` and lockfiles when present. For Python, Rust, mobile, or custom apps, use the manifest or release metadata that the repository treats as authoritative. If multiple version files exist, they must agree before release actions continue.

A canonical project changelog is optional. When one already exists, its intended version section is the persistent release-narrative source and must contain the shipped changes; `Unreleased` may remain empty but must not duplicate them. When no canonical project changelog exists, do not create one and do not treat absence as a release failure. Build a temporary release narrative from verified repository evidence instead.

Nested changelogs retain subsystem ownership. Do not add entries merely because package-wide versions move synchronously; update a nested changelog only for meaningful shipped behavior in that subsystem and only when local convention uses that history surface.

Treat an existing intended version section or temporary release narrative as a pre-release working set. Consolidate it into the smallest truthful set of outcome-focused entries before commit, PR, tag, and GitHub Release generation. Preserve distinct shipped domains and safety guarantees; remove chronology and superseded intermediate state. Consolidation means semantic compression, not vague summarization.

## Release Narrative Consolidation Rules

The release narrative records the final shipped state, not the path taken to reach it. Changelogs when present, backlogs, plans, review notes, test logs, diffs, and intermediate notes are evidence inputs rather than text to preserve verbatim.

Before creating the release commit:

1. Compare the narrative with the actual release diff and behavior established by tests, contracts, and user-facing documentation. Repository reality wins over narrative chronology.
2. Group related entries by final user, operator, compatibility, safety, or developer outcome. Prefer one strong entry per distinct shipped outcome over one entry per commit, file, correction, or work session.
3. State what changed and why it matters in the released version. Keep concrete behavior, affected users, migrations, compatibility boundaries, security properties, operational consequences, and known limitations when relevant.
4. Collapse implementation iterations into their final result. Remove investigation trails, attempted approaches, fixed-then-reworked mechanics, temporary regressions, repeated validation runs, review-response chronology, and superseded design details.
5. Omit file-by-file inventories, test counts, command transcripts, version-bump bookkeeping, and internal refactors unless they explain a meaningful public contract, compatibility effect, operational risk, or maintainability boundary relevant to consumers.
6. Do not copy completed backlog items or mini-essays. Reconcile backlog state according to repository convention, but write the release narrative independently from verified shipped outcomes.
7. Keep each entry concise enough to scan and complete enough to stand alone. Do not compress distinct risks or behavior domains into vague claims such as “improved stability” or “various fixes.”
8. Read the result as if no implementation diary existed. If it cannot explain the release truthfully on its own, refine it before continuing.

The consolidated canonical section, when present, or temporary diff-derived narrative otherwise becomes the sole source for the PR body and GitHub Release notes. If repository evidence cannot establish the final shipped behavior without guessing, stop and ask instead of manufacturing a clean story.

## GitHub Release Contract

The GitHub Release and Git tag are one release unit. A successful tag push is not a completed release until a matching published GitHub Release exists.

- Derive the title from the canonical changelog heading when available by removing the Markdown prefix, for example `## 0.4.0: Bounded Worker Meta-Protocol` becomes `0.4.0: Bounded Worker Meta-Protocol`. Without a canonical changelog, use `<version>: <concise release theme>` from the verified release narrative.
- Derive notes from the verified release narrative. Compress when needed, but cover every meaningful release group and never include unrelated older history.
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

This contract applies only to the PR route. The direct-main route skips PR creation but uses the same verified release narrative for GitHub Release notes.

The PR body must include at minimum:

```md
## Summary

This release <primary outcome from the verified release narrative>.

It also <secondary behavior/safety/compatibility outcome from the verified release narrative>.

## Validation

- <Validation command> — <result>
```

Prefer this fuller shape when the release narrative has enough substance:

```md
## Summary

This release <primary outcome from the verified release narrative>.

It also <secondary behavior/safety/compatibility outcome from the verified release narrative>.

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
- Cover every meaningful release-narrative group in compressed form.
- Keep wording release-focused and user-facing where possible.
- Mention implementation-only items only when they explain behavior, compatibility, or risk reduction.
- Do not paste a full changelog or raw diff.
- Avoid vague filler bullets such as “improves safety”, “updates tests”, or “bumps version” unless they name concrete behavior, risk reduction, or package version.
- Prefer exact operator verbs: “clears”, “preserves”, “blocks”, “forwards”, “retries”, “falls back”, “renders”, “strips”, “uploads”.

## Stop Conditions

Stop further release actions and report the state already completed when:

- GitHub hosting, authenticated-user ownership, non-fork status, or repository permission cannot be verified.
- The repository is ineligible because it belongs to another user or organization, is a fork, uses a non-GitHub host, or requires an integration workflow outside `dev` and `main`.
- Route selection is ambiguous, the authoritative remote query fails, or the branch state no longer matches the selected route.
- Run criteria fail.
- Wrong-branch recovery encounters mixed work, unsafe repository state, transfer mismatch, conflicts, or branch divergence without the required separate approval.
- On the direct-main route, local `main` does not initially equal `origin/main` or either `dev` branch appears before push.
- The version source cannot be identified safely or multiple version files disagree.
- A canonical project changelog exists but its intended version section is missing, ambiguous, conflicts with release evidence, or remains duplicated under `Unreleased`.
- Validation fails and cannot be fixed safely inside the release scope.
- PR checks fail on the PR route.
- The released `main` version or commit does not match the intended local and `origin/main` state.
- The release tag exists on a different commit.
- GitHub Release creation or verification fails, or an existing release conflicts with the confirmed tag/version state.
- An applicable npm registry check or publication fails for reasons other than package absence or a non-newer version.

## Final Report

Report:

- Commit hash
- Eligibility evidence: GitHub repository, authenticated owner match, non-fork status, and permission
- Selected route and branch-detection evidence
- Release-narrative source: canonical changelog section or temporary diff-derived notes, including changelog-absence confirmation when applicable
- Wrong-branch transfer, branch-alignment, stash cleanup, and any approved rebase/force-with-lease result when recovery ran
- PR URL, checks result, and merge status for the PR route; `Not applicable — direct-main route` otherwise
- `main` version confirmation
- Release tag push/result
- GitHub Release URL and published/prerelease/latest state
- npm applicability and package existence/version check
- Publish result or publish skip reason
