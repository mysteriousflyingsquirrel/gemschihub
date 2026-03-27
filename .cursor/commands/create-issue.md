---
description: Create a standardized GitHub issue with type and initial status labels.
alwaysApply: true
---

# /create-issue

## Syntax
- `/create-issue <type> <title>`
- `<type>`: `feature` | `bug` | `chore`

## Behavior
1. Create issue with provided title.
2. Apply one type label: `type:<type>`.
3. Apply initial status label: `status:needs-plan`.
4. Ensure only one `type:*` and one `status:*` label remain.

## Required issue fields
- Problem / goal
- Expected outcome
- Acceptance criteria
- Constraints
- Context
