---
description: Plan a GitHub issue and post a structured plan comment.
alwaysApply: true
---

# /plan-issue

## Syntax
- `/plan-issue #<N>`

## Model requirement (mandatory)

Planning MUST be executed using the **highest reasoning model available** in Cursor. There are **no exceptions**: do not substitute a faster or cheaper model for `/plan-issue`. If model selection is unclear, choose the most capable reasoning option offered.

## Scope guardrails (mandatory)

- `/plan-issue` is **planning-only**. Do **NOT** implement issue code.
- Do **NOT** edit repository feature files while executing this command.
- Allowed actions are limited to planning-related issue operations:
  - `gh issue view <N>` (and read-only repository analysis)
  - `gh issue comment <N> --body "<markdown>"`
  - issue label normalization (`state:*`)

## Clarification-first requirement (mandatory)

- You MUST ALWAYS ask the user what they mean by the issue, even if the issue looks clear.
- You MUST ask follow-up questions until ambiguity is removed.
- You MUST provide 1..N concrete planning proposals with one recommended default.
- You MUST get user confirmation of the selected proposal before writing the final plan comment.
- If clarity is not reached, DO NOT post the final plan comment yet.

## Steps
1. Extract the GitHub issue number `<N>`.
2. Fetch issue details (and relevant comments/labels) using `gh issue view <N>`.
3. Activate **Plan Mode** behavior for this command.
4. Start a mandatory clarification loop with the user:
   - Ask: "What do you mean by this issue?" (required every run)
   - Ask only critical follow-up questions to resolve ambiguity
   - Propose one or more viable planning approaches (include a recommended default)
   - Ask the user to choose/confirm a proposal
5. Blocking condition:
   - If unresolved ambiguity remains or no proposal is confirmed, stop and continue clarification.
   - Do **NOT** post the final plan comment until the issue intent and proposal are confirmed.
6. After confirmation, read the repository before proposing a finalized plan:
   - identify impacted files
   - identify affected spec/requirements modules
   - identify risks and failure modes
7. Produce a markdown plan comment in this exact structure:
   - `## Plan`
   - `## Affected Files`
   - `## Documentation Impact`
   - `## Open Questions`
   - `## Risks`
8. Post the plan comment to the issue using `gh issue comment <N> --body "<markdown>"`.
9. Update issue labels after posting:
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
