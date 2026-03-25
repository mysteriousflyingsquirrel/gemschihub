---
description: Implement a planned GitHub issue and update documentation/specs.
alwaysApply: true
---

# /implement-issue

## Syntax
- `/implement-issue #<N>`

## Gate (must-pass)
1. Fetch the issue (`gh issue view <N>`) and verify it has label `state:planned`.
2. If the issue is not in `state:planned`, stop and switch to the planning flow (`/plan-issue`).

## Source of truth (plan content)
1. Fetch issue comments.
2. Find the newest plan comment that contains `## Plan`.
3. Use that plan comment as the implementation source of truth.

## Branch / PR freshness discipline
1. Check whether the current branch has an existing PR that is `merged` or `closed`.
2. If yes, do not continue on that branch:
   - Create a new feature branch from the latest `master`.
   - Implement using a new PR for new commits.

## Implementation steps
1. Move issue label:
   - from `state:planned` to `state:in-progress`
2. Create/ensure a feature branch.
3. Implement only what is in the approved plan scope.
4. If scope must change:
   - update the plan comment first
   - then re-align implementation to the updated plan

## Documentation/spec/requirements alignment (required)
After implementing, ensure “docs are part of done”:

### Canonical doc sources
- `docs/requirements/requirements.md`
- `docs/specs/*.md` (and/or any spec files you introduced under `docs/specs/`)

### When the issue adds a new feature
- Always update at least one existing spec file.
- If no existing spec cleanly applies, create a new spec file under `docs/specs/`.
- Update the affected spec’s `Acceptance Criteria` bullets/section to cover the new behavior.
- Update `docs/requirements/requirements.md` only if the feature changes requirements-level meaning.
- Update `docs/specs` coverage to keep verification possible by ensuring acceptance criteria bullets reflect the change.

### When updating docs in the PR
In the PR body, include:
- `## Documentation Impact`
  - list updated doc file paths, or
  - `No doc changes needed: <short reason>`

## PR creation
1. Open a PR after implementation.
2. PR body must include an issue closing reference:
   - `Closes #<N>` (when an issue exists)

## Label transitions
1. Before coding: `state:in-progress`
2. After PR open: `state:in-review`
3. `state:done` is handled by the existing GitHub workflow on merge/close.
4. If blocked: set `state:blocked` and stop until unblocked.

## Required output to user
- PR URL
- Issue label transition summary
- Docs/spec paths changed (or `No doc changes needed`)
