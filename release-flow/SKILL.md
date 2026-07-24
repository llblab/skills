---
name: release-flow
description: Select and run a guarded release flow for a GitHub repository administered by the authenticated user, including organization repositories and independently maintained historical forks, using a dev-to-main pull request when a local or origin dev branch exists and otherwise releasing directly from main before coordinating repository-owned tag automation or creating the matching GitHub Release and optionally publishing an existing npm package. Use when the user explicitly asks to release and GitHub reports ADMIN permission; do not use for contribution forks, feature-branch integration, or non-GitHub workflows.
---

# Release Flow

Use this skill to select and run the release path that matches an eligible GitHub repository administered by the authenticated user: a guarded `dev` → `main` pull request when `dev` exists, or a guarded direct-`main` release when it does not. Release notes and PR text come from the canonical project changelog when one already exists; otherwise they come from a verified, outcome-focused release narrative derived from the actual release diff. This skill never creates a changelog.

## Eligibility Boundary

Establish eligibility before selecting a branch route or changing repository state.

1. Confirm that `origin` resolves to a repository on `github.com`. Non-GitHub hosts and merge-request-based workflows are outside this skill.
2. Confirm active GitHub CLI authentication and identify the authenticated user with `gh api user --jq .login`. Authentication, network, host, and repository-resolution failures make eligibility unknown; stop.
3. Inspect the repository with `gh repo view --json nameWithOwner,owner,isFork,viewerPermission`.
4. Require `viewerPermission: ADMIN`. Treat this repository-scoped permission, together with the user's explicit release request required by the hard gate, as sufficient release authority. Do not require owner-login equality, organization classification, or a second maintainership attestation. `WRITE` or `MAINTAIN` alone remains insufficient for this generic flow.
5. Require the repository to be either not a fork, or explicitly classified as an independently maintained historical fork with its own release line rather than a contribution fork whose changes should flow through an upstream pull request.
6. Treat `isFork` as a topology fact, not an automatic permission failure. For a fork, require explicit workflow classification in the current conversation before any release mutation; repository age, divergence, package identity, prior releases, or permission level cannot establish whether work should ship independently or flow upstream. Record that classification in the final eligibility evidence.
7. Stop when the authenticated user lacks `ADMIN`, repository access cannot be verified, or a fork remains unclassified or serves an upstream-contribution workflow. Do not add a separate ownership or organization-maintainership confirmation gate after an explicit release request.
8. Exclude feature, staging, release-candidate, and other integration-branch workflows. This skill may operate only from `dev` or `main`; it never promotes an arbitrary current branch. On the PR route, `main` is allowed only as the source of the guarded wrong-branch recovery below, and all release actions must ultimately run from `dev`.

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

## PR Baseline Alignment

On the PR route, fetch `origin/main` and `origin/dev` before the hard gate, then distinguish commit topology from code state:

1. Require local `dev` to equal `origin/dev` unless the only difference is the intentional release commit created later in this flow. Stop on pre-existing local/remote `dev` divergence.
2. Compare the committed trees of `dev` and `origin/main` before interpreting ahead/behind counts. Identical tree ids mean the code and version baseline already match, even when GitHub's merge commit leaves `main` one or more commits ahead of its merged `dev` parent. Keep `dev` unchanged; do not fast-forward, merge, rebase, or stash merely to copy merge-only topology back into the source branch.
3. When the trees differ and `origin/main` is not an ancestor of `dev`, inspect the direct parents of `origin/main` before classifying divergence. If one direct parent is an ancestor of `dev` and that parent's tree equals `origin/main^{tree}`, classify `origin/main` as a content-neutral PR merge wrapper around a baseline already contained in `dev`. Keep `dev` unchanged: the source branch may correctly continue from the merged PR parent without copying GitHub's merge commit back after every release.
4. When neither tree equality nor content-neutral merge-wrapper equivalence applies:
   - If `origin/main` is an ancestor of `dev`, the release branch already contains the main baseline plus newer work.
   - If `dev` is an ancestor of `origin/main`, `dev` is genuinely behind in content and must be safely aligned before release work continues.
   - If both branches contain unique commits, stop and report divergence; do not infer equivalence from versions or commit counts.
5. Tree and merge-wrapper equivalence prove baseline content equivalence, not release readiness. Version, changelog, validation, worktree intent, and all other hard gates still apply.

## Wrong-Branch Recovery

Use this recovery only when the PR route was selected, the current branch is `main`, and all uncommitted changes are confirmed as intentional release work. Never use it from a feature, staging, release-candidate, detached-HEAD, conflicted, rebasing, merging, or cherry-picking state.

Before moving changes, ask for explicit confirmation because the operation changes the worktree and may expose branch divergence. Then use the smallest reversible sequence:

1. Reject mixed unrelated work, unresolved conflicts, dirty submodules, or untracked files that should not enter the release.
2. Save tracked and intended untracked changes in one uniquely named stash with `--include-untracked`. Use `git stash apply`, not `pop`, so the recovery copy remains available until transfer verification completes.
3. Fetch `origin/main` and query `origin/dev`. Require `origin/main`; stop on authentication, network, repository-resolution, or fetch failure. A missing `origin/dev` remains valid when local `dev` selected the PR route.
4. Switch to local `dev`, or create it to track `origin/dev` when only the remote branch exists.
5. When `origin/dev` exists, bring local `dev` to it only with a fast-forward. Stop if local and remote `dev` have diverged; do not discard either history.
6. Compare the committed tree ids before ancestry:
   - If `dev^{tree}` equals `origin/main^{tree}`, keep `dev` unchanged. This is the normal GitHub PR merge topology where `main` contains the merged dev commit plus a merge commit but no newer code; do not fast-forward merge-only history back into `dev`.
   - Otherwise, if one direct parent of `origin/main` is an ancestor of `dev` and that parent tree equals `origin/main^{tree}`, keep `dev` unchanged. The latest main commit is a content-neutral PR merge wrapper around a baseline already contained in the continuing dev line.
   - Otherwise, if `origin/main` is already an ancestor of `dev`, keep `dev` unchanged.
   - Otherwise, if `dev` is an ancestor of `origin/main`, fast-forward `dev` to `origin/main` because the content genuinely differs.
   - If both branches contain unique commits and neither equivalence rule applies, classify them as diverged. Do not rebase automatically.
7. For diverged branches, report the commit ranges and ask separately before rebasing `dev` onto `origin/main`. Create a temporary backup ref first. Never force-push rewritten `dev` history as an implicit part of release approval; require separate explicit authorization and use only `--force-with-lease` if approved.
8. Apply the saved stash with index state preserved. Stop on conflicts, leave the stash intact, and report recovery instructions rather than attempting broad conflict resolution.
9. Verify that the transferred diff matches the saved release work and that no unrelated files appeared. Continue only when the worktree now represents the intended release on `dev`.
10. Keep the stash until the release commit contains the verified transferred changes. Then drop only that exact recovery stash.

After successful recovery, re-enter the normal hard gate on `dev`. Recovery never permits direct-main and never counts as authorization for rebase, force-push, or conflict resolution.

## Hard Gate

Run release actions only when all criteria are true:

1. Repository eligibility, authenticated `ADMIN` permission, and explicit release intent were verified without ambiguity.
2. Route selection completed without ambiguity.
3. The current branch matches the selected route: `dev` for the PR route or `main` for the direct-main route.
4. PR-route baseline alignment passes by committed-tree equality, content-neutral merge-wrapper equivalence, or `origin/main` ancestry of `dev`; commit-count-only merge topology never fails this gate.
5. Repository-owned tag automation has been inspected and its ownership of GitHub Release creation and npm publication is classified as automated, manual, or absent without ambiguity. Every automation-owned npm publication passes the pre-tag package-existence and version-eligibility checks below.
6. There are uncommitted files intended for the release.
7. The package or application version is already bumped to the intended release version.
8. The user explicitly asked to run the release flow, including its external actions such as pushing, opening and merging a PR when applicable, tagging, creating a GitHub Release, or publishing.

If any criterion fails, reject the flow and stop. Do not stage, commit, push, create PRs, merge, tag, create a GitHub Release, publish, or modify release files.

If the PR route was selected while release work sits on `main`, do not bypass the branch gate. Run the guarded wrong-branch recovery only after its explicit confirmation; otherwise stop without moving the changes.

## Direct-Main Boundary

Direct-main is a repository-shape route, not an urgency override or failure fallback. It is available only when authoritative checks confirm that both local `dev` and `origin/dev` are absent and the prepared release work is already on `main`.

A prior direct-main release, a small hotfix, urgency, PR inconvenience, branch protection failure, merge conflict, or failing checks does not permit direct-main while `dev` exists. If repository policy requires an exception despite an existing `dev`, stop and hand the request back as an out-of-scope owner decision before changing repository or release state.

Before committing on the direct-main route, fetch `origin/main` and require local `main` HEAD to equal `origin/main`. Stop on divergence, unpushed local commits, a missing `origin/main`, or a fetch failure; do not merge, rebase, reset, or pull automatically while prepared release changes are present.

The direct-main route retains every shared release safeguard: current-state audit, release-narrative freshness, validation, intentional staging, repository-style release commit, push verification, version confirmation, immutable tag checks, GitHub Release verification, and guarded registry publication.

## Repository-Owned Release Automation

Inspect the intended tagged commit before the hard gate for active repository workflows, normally under `.github/workflows`, that trigger on version-tag pushes. Classify ownership by behavior rather than filename:

1. Read each candidate workflow far enough to verify its trigger and release actions. A `push.tags` trigger alone does not own publication.
2. Classify **GitHub Release automation** only when the workflow creates or publishes a release, for example through `gh release create`, a release-creation action, or an authenticated GitHub Releases API call.
3. Classify **npm automation** separately from GitHub Release creation. Different actions may belong to different workflows. Tag-triggered publication to any registry other than npm is outside this generic skill; stop before tag creation and use a project-specific release process.
4. Treat commented commands, docs, artifact uploads, changelog generation, and tag-only validation as non-owners. Stop before tag creation when workflow semantics remain ambiguous; do not race an uncertain automation owner.
5. Record every owning workflow path, trigger, exact responsibilities, and expected run identity. Reinspect the committed workflow definitions before tagging; stop if they differ materially from the classified worktree versions.

Before the hard gate, preflight every automation-owned npm publication:

- Require a project-owned `package.json` with a package name and no `private: true`.
- Query `npm view <package-name> version`. Treat only an explicit npm not-found response as package absence; authentication, authorization, network, registry-resolution, and other failures are unknown states.
- Require the package to already exist and the intended version to be newer than the published version. Stop before commit or tag when either condition fails; triggering repository automation does not override the rule that this skill never publishes a new or non-newer package.
- Verify from workflow semantics that the intended tag would publish that package and version. Stop when package selection, version derivation, registry target, or publication conditions remain ambiguous.

When repository automation owns an action:

- Push the tag exactly once, then discover every expected workflow run for that exact tag, `push` event, and released commit SHA. Allow a bounded registration delay; do not interpret a briefly absent run as permission for manual fallback.
- Watch each owning run to terminal state. Do not manually perform any action classified as automation-owned while its run remains pending, succeeds, or fails.
- On success, verify each resulting GitHub Release and/or npm state using the same contracts as manual publication.
- If any owning run fails, remains uncorrelated, or omits its expected external state, stop and report the completed tag plus all run results. Never create a competing Release or publish manually as an implicit recovery; fix/rerun the repository workflow or obtain an explicit project-specific recovery decision.

When no workflow owns an action, retain the manual path below. Automation detection changes the executor, never the required final verification.

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

If repository automation owns GitHub Release creation or npm publication, discover and watch every expected tag-triggered run now. Correlate each run to its recorded workflow, the exact tag, the `push` event, and the released commit SHA. Continue only after all owning runs succeed and create every expected external state. A failed or missing run is a release stop even when some external state exists; verify and report that partial state without racing it.

13. Ensure exactly one published GitHub Release exists for the confirmed tag. First determine whether the intended version is stable or a prerelease from the version and verified release narrative, then check whether a release already exists:

```bash
gh release view v<version> --json tagName,isDraft,isPrerelease,publishedAt,url
```

Treat the release as absent only when GitHub explicitly reports that `v<version>` has no release, such as an HTTP 404 or `release not found`. Authentication, authorization, network, rate-limit, repository-resolution, and other CLI/API failures are not absence; stop and report them instead of attempting creation.

If automation owns GitHub Release creation and no release exists after its successful run, stop because automation violated its contract. Do not create the release manually.

Only when no repository workflow owns GitHub Release creation, create an absent release manually with the existing tag, a release title derived from the canonical changelog heading when available or `<version>: <concise release theme>` otherwise, and notes derived from the verified release narrative.

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

14. Determine whether npm publication applies. Require a project-owned `package.json` with a package name and no `private: true`. If the project is not a publishable npm package, skip npm checks and publication unless a tag workflow claims npm ownership; that conflict must already have stopped the flow during automation preflight. Do not guess or trigger another registry workflow.

For an applicable npm package without automation-owned npm publication, check whether that package already exists:

```bash
npm view <package-name> version
```

Treat an explicit npm not-found response as package absence. Authentication, authorization, network, registry-resolution, and other lookup failures are not absence; stop and report them. Automation-owned npm publication already performed this lookup before the hard gate and must not defer it until after tagging.

15. Publish only when both conditions are true:

- The package already exists on npm.
- The `main` version matches the intended release version and is newer than the npm version established before publication.

When repository automation owns npm publication, never run `npm publish` manually. After all owning tag workflows succeed, require `npm view <package-name>@<version> version` to resolve to the intended version; stop if the package remains absent or mismatched.

When repository automation does not own npm publication and both conditions are true, run:

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

The GitHub Release and Git tag are one release unit. A successful tag push is not a completed release until a matching published GitHub Release exists. Exactly one executor owns creation: a verified tag-triggered repository workflow when present, otherwise the manual release-flow path.

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

- GitHub hosting, authenticated `ADMIN` permission, explicit release intent, required independent-fork classification, or repository release-automation ownership cannot be verified.
- The repository is ineligible because `ADMIN` is absent, it is an unclassified or contribution fork, it uses a non-GitHub host, or it requires an integration workflow outside `dev` and `main`.
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
- Repository-owned tag automation fails, creates incomplete or conflicting external state, or cannot be correlated to the exact tag and released commit.
- GitHub Release creation or verification fails, or an existing release conflicts with the confirmed tag/version state.
- An applicable npm registry check or publication fails for reasons other than package absence or a non-newer version.

## Final Report

Report:

- Commit hash
- Eligibility evidence: GitHub repository, authenticated account, `ADMIN` permission, explicit release request, fork topology, and—when applicable—the independent-fork workflow classification
- Selected route and branch-detection evidence
- Release-narrative source: canonical changelog section or temporary diff-derived notes, including changelog-absence confirmation when applicable
- Wrong-branch transfer, branch-alignment, stash cleanup, and any approved rebase/force-with-lease result when recovery ran
- PR URL, checks result, and merge status for the PR route; `Not applicable — direct-main route` otherwise
- `main` version confirmation
- Release tag push/result
- Repository release-automation classification and, for every owner, the workflow/run URL, responsibility, correlation evidence, and terminal result
- GitHub Release URL and published/prerelease/latest state
- npm applicability and package existence/version check
- Publish result or publish skip reason
