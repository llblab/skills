---
name: release-flow
description: "Run an explicitly requested GitHub release for an authenticated ADMIN: select a fixed version-branch, dev-PR, or direct-main route and verify tags, Releases, and existing npm publication. Not feature integration, contribution-fork delivery, or generic Git operations."
---

# Release Flow

Release through the selected repository-topology route. Use an existing canonical changelog or a verified diff-derived narrative; never create a changelog.

## Eligibility Boundary

Establish eligibility before route selection or mutation. Stop further release actions on an unmet gate, failed required check, ambiguity, or unverifiable state; report completed actions and the exact blocker. Fix validation failures only when safe within release scope. No implicit route, executor, or recovery fallback is permitted.

1. Require `origin` on `github.com`, active GitHub CLI authentication, and the user identity from `gh api user --jq .login`. Auth, network, host, or repository-resolution failure means unknown eligibility; stop. Non-GitHub and merge-request workflows are out of scope.
2. Inspect `gh repo view --json nameWithOwner,owner,isFork,viewerPermission`. Require repository-scoped `ADMIN` plus explicit release intent. `WRITE`/`MAINTAIN` is insufficient; owner-login equality, organization classification, or another maintainership attestation is unnecessary.
3. Require a non-fork or explicit current-conversation classification as an independently maintained historical fork with its own release line. `isFork` is topology, not permission; age, divergence, package identity, prior releases, and permission cannot classify the workflow. Stop for an unclassified or contribution fork; record independent-fork classification in final evidence.
4. Operate only from `main`, long-lived `dev`, or a dedicated version branch exactly matching the intended manifest/changelog version: bare SemVer, `v<semver>`, or `release/<semver>`. Naming alone cannot promote feature, staging, or arbitrary integration work. Dev/version PR actions run from their selected source branch.

No automatic override applies; ineligible repositories need a project-specific release process.

## Route Selection

Select before staging, committing, pushing, PRs, tags, Releases, publication, or release-file edits:

1. Confirm `origin` and the current branch. A current dedicated version branch matching the intended version selects **version PR**, before `dev` detection: it owns the prepared tree.
2. Otherwise query local `dev` with `git show-ref --verify refs/heads/dev`. Presence selects **dev PR**; remote detection cannot relax it.
3. Only if neither applies, query `origin` directly: `git ls-remote --exit-code --heads origin refs/heads/dev`. Missing/stale tracking refs do not prove absence. Exit `0` with the ref means presence (**dev PR**); exit `2` with no match means authoritative absence (**direct-main**). Auth, authorization, network, resolution, or other failures mean unknown; stop, never infer direct-main.

Keep exactly that route throughout. Branch changes, inconvenience, conflicts, failed checks, and failed PR actions never authorize fallback.

## Validation Evidence Identity

1. Before expected topology changes, record expensive successful checks' subjects: exact tree OID for source, artifact digest for artifact/network checks, and relevant lock/toolchain/environment identities.
2. Determine sensitivity to commit SHA/parent, branch, tag, signature, timestamp, remote state, credentials, or other non-tree conditions; inspect the validation owner when unclear.
3. Reuse only when the active contract and every relevant input/condition remain equivalent. Exact tree equality preserves tree-bound build, test, lint, benchmark, and generated-artifact evidence. Squash, rebase, amend, wrapper removal, or branch rename alone never justify an expensive tree-bound rerun.
4. Rerun only invalidated commit/ref-sensitive layers. Full reruns require a changed tree, changed relevant environment authority, expired external evidence, failed/incomplete prior run, or materially unknown sensitivity after inspection.
5. Report reused evidence, original subject, equivalence proof, and narrow post-operation checks. Honor explicit repository topology-stage freshness policy despite equivalence; when revising such policy, name its commit/ref-sensitive or freshness boundary.

## Dedicated Version Branch Pre-PR Squash

A dedicated version branch may contain many atomic development commits while work remains in progress. Those commits support review, bisecting, selective removal, and recovery during development. The release PR must nevertheless expose one release commit directly above the verified `main` baseline.

Apply this section only on the version PR route, after release files and validation are complete but before opening the PR:

1. Require explicit confirmation that the operator authorizes rewriting the dedicated version branch with `--force-with-lease`. Release intent alone does not authorize rewriting a shared source branch.
2. Require no existing open PR from the version branch unless the exact PR qualifies for the separately authorized blocked-PR correction path below. Never rewrite an active or healthy review merely to tidy history.
3. Fetch `origin/main` and the version branch. Require local and remote source tips to match, except for clearly identified intentional release work. Reject conflicts, merge/rebase/cherry-pick state, dirty submodules, unrelated work, or unknown remote state.
4. Require `origin/main` to be an ancestor of the version branch. If `main` moved in content, align the version branch through a separately reviewed rebase or merge before squashing; never hide divergence inside the release commit.
5. Record the old source OID, remote source OID, and `origin/main` OID. Create a local safety ref named `archive/<sanitized-version-branch>-pre-squash-<short-oid>` at the old tip. Do not push the archive unless the operator explicitly requests a remote archive.
6. Stage only intentional release files, inspect the complete staged diff, and reject any remaining unstaged or unintended untracked content. Record the exact prepared tree from the index with `git write-tree`. `HEAD^{tree}` is not a substitute because it omits staged or unstaged release changes that are not in the old commit.
7. Soft-reset the version branch to `origin/main` without changing the prepared index, then create exactly one repository-style release commit. The resulting commit must have `origin/main` as its sole parent.
8. Verify that `HEAD^{tree}` exactly equals the recorded prepared-tree OID and that `HEAD^` equals the recorded `origin/main` OID. Inspect the full `origin/main..HEAD` diff and require a clean worktree. Apply the Validation Evidence Identity contract: carry forward prior validation when its recorded subject is this exact tree and the check is tree-bound; run only commit/ref-sensitive checks invalidated by the new identity. Rerun the full release profile only when equivalence or sensitivity cannot be established.
9. If the version branch already exists on `origin`, update only that source branch with `--force-with-lease=<branch>:<recorded-remote-oid>`. Never use a broad `--force`, never rewrite `main`, and never move a tag.
10. Open the release PR only after the remote version branch resolves to the one-commit release tip. The PR must show exactly one commit and the expected release diff against `main`.

## Blocked Version PR Correction Rewrite

An open version PR may keep its identity while its one release commit is replaced only to correct a concrete blocker discovered by that PR. This is a recovery path, not permission to rewrite healthy review history.

1. Require explicit operator authorization to force-update the exact open PR branch after the blocker is known. Standing release intent and the original pre-PR rewrite approval are insufficient; the authorization may state a reusable preference for blocked release PRs.
2. Verify the PR is open, belongs to the same repository, targets `main`, uses the current dedicated version branch, and is blocked by a failed, cancelled, timed-out, or configuration-invalid required check against its current head SHA. A pending healthy check, review inconvenience, desired cleanup, or unrelated scope growth does not qualify.
3. Require that no release tag, GitHub Release, merge, deployment, publication, or downstream release consumption refers to the current PR head. Those states make replacement categorically unsafe.
4. Inspect submitted reviews and unresolved review conversations. If human approval, requested changes, or substantive review comments exist, report that evidence and require separate confirmation that replacing the reviewed commit is intended; never silently orphan human review.
5. Fetch `origin/main` and the version branch. Require local HEAD, the PR head, and the remote branch to equal one recorded old OID; require that commit to remain the sole child of the unchanged verified `origin/main` baseline. Stop on divergence or baseline movement instead of hiding it in the correction.
6. Create a new local safety ref at the old PR head. Admit only the smallest release-scope correction and directly affected evidence or documentation, stage the complete intended tree, and inspect its diff against both the old PR head and `origin/main`.
7. Recreate exactly one repository-style release commit with the same `origin/main` parent. Verify prepared-tree equality, one-parent topology, a clean worktree, and the narrow validation invalidated by the correction. Previous failed PR evidence is not reusable; unrelated tree-bound evidence may be reused only under the Validation Evidence Identity contract.
8. Update only the exact version branch with `--force-with-lease=<branch>:<recorded-old-oid>`. Never use broad force, rewrite `main`, move a tag, or delete/recreate the PR.
9. Verify the same PR number remains open, its head equals the new commit, it still contains exactly one release commit, and GitHub registered fresh required checks for that head. Treat review and check evidence attached to the replaced OID as stale.

After a release PR merges, history cleanup is too late. This skill must never squash or force-rewrite `main` to make a completed release look cleaner. A post-merge mistake receives a new reviewed correction/hotfix; a release tag, published Release, or downstream consumption makes history rewriting categorically forbidden.

## PR Baseline Alignment

On the dev PR route, fetch `origin/main` and `origin/dev` before the hard gate, then distinguish commit topology from code state. The version PR route instead uses the stricter ancestry and one-parent contract in the pre-PR squash section:

1. Require local `dev` to equal `origin/dev` unless the only difference is the intentional release commit created later in this flow. Stop on pre-existing local/remote `dev` divergence.
2. Compare the committed trees of `dev` and `origin/main` before interpreting ahead/behind counts. Identical tree ids mean the code and version baseline already match, even when GitHub's merge commit leaves `main` one or more commits ahead of its merged `dev` parent. Keep `dev` unchanged; do not fast-forward, merge, rebase, or stash merely to copy merge-only topology back into the source branch.
3. When the trees differ and `origin/main` is not an ancestor of `dev`, inspect the direct parents of `origin/main` before classifying divergence. If one direct parent is an ancestor of `dev` and that parent's tree equals `origin/main^{tree}`, classify `origin/main` as a content-neutral PR merge wrapper around a baseline already contained in `dev`. Keep `dev` unchanged: the source branch may correctly continue from the merged PR parent without copying GitHub's merge commit back after every release.
4. When neither tree equality nor content-neutral merge-wrapper equivalence applies:
   - If `origin/main` is an ancestor of `dev`, the release branch already contains the main baseline plus newer work.
   - If `dev` is an ancestor of `origin/main`, `dev` is genuinely behind in content and must be safely aligned before release work continues.
   - If both branches contain unique commits, stop and report divergence; do not infer equivalence from versions or commit counts.
5. Tree and merge-wrapper equivalence prove baseline content equivalence, not release readiness. Version, changelog, validation, worktree intent, and all other hard gates still apply.

## Wrong-Branch Recovery

Use this recovery only when the dev PR route was selected, the current branch is `main`, and all uncommitted changes are confirmed as intentional release work. Never use it for a version PR route or from a feature, staging, detached-HEAD, conflicted, rebasing, merging, or cherry-picking state.

Before moving changes, ask for explicit confirmation because the operation changes the worktree and may expose branch divergence. Then use the smallest reversible sequence:

1. Reject mixed unrelated work, unresolved conflicts, dirty submodules, or untracked files that should not enter the release.
2. Save tracked and intended untracked changes in one uniquely named stash with `--include-untracked`. Use `git stash apply`, not `pop`, so the recovery copy remains available until transfer verification completes.
3. Fetch `origin/main` and query `origin/dev`. Require `origin/main`; stop on authentication, network, repository-resolution, or fetch failure. A missing `origin/dev` remains valid when local `dev` selected the dev PR route.
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
3. The current branch matches the selected route: the exact dedicated version branch for the version PR route, `dev` for the dev PR route, or `main` for the direct-main route.
4. Baseline alignment passes for the selected PR route: the version branch satisfies the strict `origin/main` ancestry contract before its one-parent squash, or `dev` satisfies committed-tree equality, content-neutral merge-wrapper equivalence, or `origin/main` ancestry. Commit-count-only topology never proves alignment.
5. Repository-owned tag automation has been inspected and its ownership of GitHub Release creation and npm publication is classified as automated, manual, or absent without ambiguity. Every automation-owned npm publication passes the pre-tag package-existence and version-eligibility checks below.
6. Release intent is materialized safely for the route: dev/direct-main has intentional uncommitted release files to commit, while a version branch has a complete validated prepared tree and explicit source-history rewrite approval before the pre-PR squash.
7. The package or application version is already bumped to the intended release version.
8. The user explicitly asked to run the release flow, including its external actions such as pushing, opening and merging a PR when applicable, tagging, creating a GitHub Release, or publishing.

If any criterion fails, reject the flow and stop. Do not stage, commit, push, create PRs, merge, tag, create a GitHub Release, publish, or modify release files.

If the dev PR route was selected while release work sits on `main`, do not bypass the branch gate. Run the guarded wrong-branch recovery only after its explicit confirmation; otherwise stop without moving the changes. Version-branch work never uses wrong-branch recovery.

## Direct-Main Boundary

Direct-main is a repository-shape route, not an urgency override or failure fallback. It is available only when authoritative checks confirm that both local `dev` and `origin/dev` are absent and the prepared release work is already on `main`.

A prior direct-main release, a small hotfix, urgency, PR inconvenience, branch protection failure, merge conflict, or failing checks does not permit direct-main while `dev` exists. If repository policy requires an exception despite an existing `dev`, stop and hand the request back as an out-of-scope owner decision before changing repository or release state.

Before committing on the direct-main route, fetch `origin/main` and require local `main` HEAD to equal `origin/main`. Stop on divergence, unpushed local commits, a missing `origin/main`, or a fetch failure; do not merge, rebase, reset, or pull automatically while prepared release changes are present.

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

1. Inspect `git status --short --branch`, confirm the selected route, and confirm that the repository is on its required branch with only route-appropriate release state.
2. Resolve the version source under the [Version And Release Narrative Contract](#version-and-release-narrative-contract) and confirm it is already bumped to the intended release version.
3. Detect whether the repository already owns a canonical project-level changelog, normally at the root or at a documented release-history path; a nested subsystem changelog does not become the package release source merely because it exists. If a canonical changelog exists, read only the intended version section and any `Unreleased` section, beginning with the first 50 lines and expanding to section boundaries as needed. Otherwise record its absence and use the contract's temporary-narrative path. The same contract owns when subsystem history needs an update.
4. Inspect the actual release diff. For a version PR route, compare the complete version-branch tree with `origin/main` before and after the squash. For a dev PR route, compare `dev` with the `main` PR base and include staged/unstaged release files. For direct-main, inspect staged/unstaged changes against verified `main`. Apply the [Release Narrative Consolidation Rules](#release-narrative-consolidation-rules) to this evidence. When a canonical changelog exists, edit only its intended section without rewriting older history; otherwise create only temporary release notes.
5. Confirm release-note freshness. When a canonical changelog exists, its intended version section must describe the release and must not leave the same shipped changes under `Unreleased`; stop if the section is missing, ambiguous, or conflicts with diff evidence. When no canonical changelog exists, its absence is not a blocker; instead verify that the temporary release narrative covers every meaningful shipped outcome. In either case, stop if safe consolidation would require guessing which behavior ships.
6. Run the smallest meaningful validation, preferring the project release command; stop on failure that cannot be fixed safely in release scope. Record subject/environment under [Validation Evidence Identity](#validation-evidence-identity) for later reuse.
7. Stage only intentional release files and apply the [Release Commit Message Contract](#release-commit-message-contract) before any release commit is written.
8. On a version PR route, complete all release files first and then execute the dedicated pre-PR squash section; do not create a preliminary PR or a second release commit.
9. Create exactly one release commit. On a version PR route, use the one-parent commit already produced by the pre-PR squash; on dev/direct-main, create the normal release commit.
10. Continue only through the selected route:

**Version PR route**

1. Verify the remote version branch exposes the prepared one-commit release tip above `origin/main`; the pre-PR squash was completed in step 8.
2. Open a pull request from the version branch to `main`. Build the PR body from the verified release narrative and watch all checks.
3. Merge with a repository-supported method that leaves exactly one release commit directly above the verified baseline on `main`. Prefer fast-forward/rebase when it preserves the prepared commit; otherwise use squash merge, which may replace its OID but must preserve the exact prepared tree. Do not create a merge-wrapper commit for a dedicated version release.
4. After merge, switch to `main`, pull the latest state, and verify parent OID, tree OID, version, and release narrative before tagging. If repository policy cannot produce the one-commit topology, stop before merge rather than rewriting `main` afterward.

**Dev PR route**

1. Push `dev` to `origin/dev`.
2. Open a pull request from `dev` to `main`.
3. Build the PR body from the verified release narrative, using the consolidated canonical changelog section when one exists and the diff-derived temporary narrative otherwise.
4. Watch PR checks until they finish.
5. If all required checks pass, merge using the repository's established method. Prefer the repository default; if no convention is discoverable, use a normal merge commit rather than squash/rebase because it preserves the dev release commit and audit trail.
6. After merge, switch to `main` and pull the latest state.

**Direct-main route**

1.  Reconfirm immediately before push that local `dev` and `origin/dev` remain absent. Stop if either now exists or the remote check fails.
2.  Push the release commit from local `main` to `origin/main` without creating a pull request.
3.  Verify that `origin/main` resolves to the pushed local `main` commit.

### Shared Publication

After any selected route completes:

1. Confirm the version on `main` matches the intended release version and that the current `main` commit is the released commit on `origin/main`.
2. Create and push exactly one release tag for the confirmed version on the current `main` commit:

```bash
git tag v<version>
git push origin v<version>
```

If the tag already exists locally or remotely, verify it points to the current `main` commit before continuing. If an existing `v<version>` tag points anywhere else, stop and report the mismatch unless it qualifies for the explicitly authorized failed-unpublished-tag replacement path below. Never move, delete, or force-push a tag that represents any published or consumed release state.

If repository automation owns GitHub Release creation or npm publication, discover and watch every expected tag-triggered run now. Correlate each run to its recorded workflow, the exact tag, the `push` event, and the released commit SHA. Continue only after all owning runs succeed and create every expected external state. A failed or missing run is a release stop even when some external state exists; verify and report that partial state without racing it.

3. Ensure exactly one published GitHub Release exists for the confirmed tag. First determine whether the intended version is stable or a prerelease from the version and verified release narrative, then check whether a release already exists:

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

After creation or reuse, verify the release URL and latest state. For a stable release, the latest-release endpoint must resolve to the intended tag:

```bash
gh api repos/{owner}/{repo}/releases/latest --jq .tag_name
```

For a prerelease, confirm that the endpoint does not resolve to the prerelease tag. A missing latest stable release is acceptable for a prerelease-only repository.

4. Determine whether npm publication applies. Require a project-owned `package.json` with a package name and no `private: true`. If the project is not a publishable npm package, skip npm checks and publication unless a tag workflow claims npm ownership; that conflict must already have stopped the flow during automation preflight. Do not guess or trigger another registry workflow.

For an applicable npm package without automation-owned npm publication, check whether that package already exists:

```bash
npm view <package-name> version
```

Treat an explicit npm not-found response as package absence. Authentication, authorization, network, registry-resolution, and other lookup failures are not absence; stop and report them. Automation-owned npm publication already performed this lookup before the hard gate and must not defer it until after tagging.

5. Publish only when both conditions are true:
    - The package already exists on npm.
    - The `main` version matches the intended release version and is newer than the npm version established before publication.

When repository automation owns npm publication, never run `npm publish` manually. After all owning tag workflows succeed, require `npm view <package-name>@<version> version` to resolve to the intended version; stop if the package remains absent or mismatched.

When repository automation does not own npm publication and both conditions are true, run:

```bash
npm publish --access public
```

If the package does not exist or the intended version is not newer, skip publication and report the reason. New packages must never be published by this skill.

## Failed Unpublished Tag Replacement

A tag whose workflow failed before producing any release state may be replaced at the same version only as an explicitly authorized recovery. A pushed tag is not automatically a published release, but uncertainty or partial publication fails closed.

1. Require explicit operator authorization to delete and recreate the exact tag at the corrected commit. Ordinary release intent and generic retry permission are insufficient.
2. Verify the repository and tag are administered by the authenticated `ADMIN`, the tag points to one recorded old commit, and the correlated tag workflow failed before publication. Completed validation jobs may have produced only an internal candidate handoff when its exact inventory is known and no downstream network, package, attestation, deployment, or publication job consumed it successfully. Require zero network summaries, final release bundles, attestations, deployments, packages, GitHub Releases, release assets, signatures advertised as final, or other publication state for that tag and commit.
3. Inspect every workflow job and artifact plus repository releases, attestations, deployments, package registries owned by the workflow, and known downstream automation. Treat internal validation evidence as failed-run residue, never reusable release evidence for the replacement. Any other positive state or materially unavailable check makes replacement ineligible.
4. Fix the root cause through the repository's normal protected-main route. Require fresh required checks, a verified corrected `main` commit and tree, unchanged intended version, and no release tag pointing at the corrected commit yet.
5. Create a local safety ref at the old tagged commit and record the old tag object/peeled commit, failed workflow/run identity, corrected commit, and corrected tree. Do not publish the safety ref unless explicitly requested.
6. Delete only the exact remote tag with an explicit lease bound to its recorded old object, then verify remote absence. Delete the matching local tag only after confirming its old target; never use wildcard deletion or broad force.
7. Recreate the same tag once at the verified corrected `origin/main`, push it normally, and verify the remote tag resolves to that exact commit. Do not reuse, rerun, or reinterpret the failed workflow as evidence for the replacement.
8. Discover and watch a fresh tag-triggered workflow correlated to the corrected commit. Continue through ordinary artifact, attestation, GitHub Release, and publication verification only after that new run succeeds.

This recovery never applies after a network or packaging job produced an artifact, after any attestation, GitHub Release, deployment, or registry publication exists, after signing was advertised as final, or when downstream consumption is known or materially uncertain. An internal candidate handoff from an otherwise successful validation job is eligible only when every downstream release job failed or remained skipped before consuming it successfully.

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

## Release Commit Message Contract

Before committing, inspect `git log -5 --pretty=%s` (fewer if unavailable), especially prior version/release subjects. Preserve observable prefix, separator, casing, grammatical form, and theme conventions. If mixed, adapt the latest relevant subject's version/theme; do not block on mixed style alone. Stop only for a misleading subject or a version/theme that cannot be identified safely.

## PR Body Contract

For either PR route, derive the body from the sole verified release narrative. Include `## Summary` with 1–2 short paragraphs and `## Validation` naming commands/results. Start with `This release` or `This hotfix` and the primary user-visible outcome; add a useful second paragraph for safety, compatibility, or architecture impact.

- Add `## Why` for bugs, races, stale state, missing context, or confusing behavior; always include it for hotfixes.
- Add `## User-visible behavior` or `## Behavior` for operator-facing changes; `## Highlights` may suit broad feature releases.
- Add `## Changed areas` only when domain-level implementation boundaries clarify risk, not a file inventory.
- Add `## Risk Notes` for runtime, queue, rendering, locks, delivery, migrations, configuration, or external-service behavior.
- Cover every meaningful narrative group, favor exact operator verbs and concrete effects, and mention internals only to explain behavior, compatibility, or risk reduction.
- Do not paste the changelog/raw diff or use vague safety/test/version-bump filler.

A compact PR body can use this shape; expand only for the conditional sections above:

```markdown
## Summary

This release <primary user-visible outcome>.

It also <meaningful safety or compatibility impact, when relevant>.

## Validation

- <Command> — <result and relevant evidence identity>
```

Direct-main skips the PR, not the verified narrative for Release notes.

## Stop Conditions

This is a final navigation check over the gates above, not a substitute for them or a new recovery authorization. Stop further release actions and report completed state when:

- Eligibility, authenticated `ADMIN`, explicit release intent, or required fork classification is absent or cannot be verified, or automation ownership remains unclassified. Verified absence of an automation owner selects the manual executor; it is not a blocker.
- Route detection fails, an absence proof required by that route cannot be established, or the current branch no longer matches the selected route. Never fall back to direct-main or another executor.
- Baseline alignment, clean release scope, or wrong-branch transfer cannot be proved; recovery encounters mixed work, conflicts, or divergence without its separate approval.
- Direct-main does not initially equal `origin/main`, or either `dev` branch appears before push.
- The authoritative version is unclear, version sources disagree, or the release narrative is missing, stale, duplicated under `Unreleased`, or requires guessing shipped behavior. An absent canonical changelog alone is not a blocker.
- A version-branch rewrite lacks its exact authorization, encounters a non-qualifying open PR, loses prepared-tree equality or required ancestry/topology, or fails the OID-bound lease. Do not rewrite healthy review history or published/consumed release state.
- Validation cannot be fixed safely inside release scope, or required PR checks fail without an explicitly authorized bounded correction path.
- Released `main`, the remote commit, version, or existing tag disagree. A mismatched tag requires the separately authorized failed-unpublished-tag path; uncertainty or partial publication disqualifies that recovery.
- Automation fails, cannot be correlated to the exact tag/commit, or leaves missing/conflicting external state. Only the explicit zero-release-state recovery may permit tag replacement; manual publication is never an implicit fallback.
- GitHub Release creation/verification fails, an existing Release conflicts, or an applicable npm lookup/publication fails for a reason other than package absence or a non-newer version. Those two npm conditions skip manual publication, not the other release gates.

A tag push alone is not a completed release: require the matching published GitHub Release and every applicable registry result or justified skip. After merge or publication, use a new reviewed correction rather than cleaning history.

## Final Report

Report:

- Commit hash
- Eligibility evidence: GitHub repository, authenticated account, `ADMIN` permission, explicit release request, fork topology, and—when applicable—the independent-fork workflow classification
- Selected route and branch-detection evidence
- Release-narrative source: canonical changelog section or temporary diff-derived notes, including changelog-absence confirmation when applicable
- Version-route squash evidence when applicable: baseline/source old/new OIDs, local archive ref, index-derived prepared-tree OID, final tree equality, one-parent topology, exact force-with-lease result, post-merge main topology, and reused-validation subject/equivalence evidence
- Wrong-branch transfer, branch-alignment, stash cleanup, and any approved rebase/force-with-lease result when recovery ran
- PR URL, checks result, and merge status for either PR route; `Not applicable — direct-main route` otherwise
- `main` version confirmation
- Release tag push/result
- Repository release-automation classification and, for every owner, the workflow/run URL, responsibility, correlation evidence, and terminal result
- GitHub Release URL and published/prerelease/latest state
- Registry applicability and npm package existence/version check
- Publish result or publish skip reason
