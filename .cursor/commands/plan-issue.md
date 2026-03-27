---
description: Create or refine an implementation plan for a GitHub issue.
alwaysApply: true
---

# /plan-issue

## Syntax
- `/plan-issue #<N>`

## Behavior
1. Read issue details and current labels.
2. If ambiguity exists, set `status:awaiting-clarification` and ask targeted questions.
3. When clear, post plan comment with:
   - Scope
   - Technical approach
   - Risks
   - Acceptance criteria mapping
4. Set status to `status:planned`.
5. Keep one active `status:*` label.

## Constraint
- Planning only. No implementation changes.
