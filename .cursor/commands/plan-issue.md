---
description: Plan a GitHub issue and post a structured plan comment.
alwaysApply: true
---

# /plan-issue

## Syntax
- `/plan-issue #<N>`

## Model requirement (mandatory)

Planning MUST be executed using the **highest reasoning model available** in Cursor. There are **no exceptions**: do not substitute a faster or cheaper model for `/plan-issue`. If model selection is unclear, choose the most capable reasoning option offered.

## Steps
1. Extract the GitHub issue number `<N>`.
2. Fetch issue details (and relevant comments/labels) using `gh issue view <N>`.
3. Read the repository before proposing a plan:
   - identify impacted files
   - identify affected spec/requirements modules
   - identify risks and failure modes
4. Produce a markdown plan comment in this exact structure:
   - `## Plan`
   - `## Affected Files`
   - `## Documentation Impact`
   - `## Open Questions`
   - `## Risks`
5. Post the plan comment to the issue using `gh issue comment <N> --body "<markdown>"`.
6. Update issue labels after posting:
   - add `state:planned`
   - remove any other `state:*` labels

## Labels set (used for normalization)
- state labels:
  - `state:created`
  - `state:planned`
  - `state:in-progress`
  - `state:in-review`
  - `state:done`
  - `state:blocked`
