---
description: Implement an approved issue and move status through execution.
alwaysApply: true
---

# /implement-issue

## Syntax
- `/implement-issue #<N>`

## Gate
1. Issue must have `status:approved-for-implementation`.
2. If not approved, stop and return to planning/approval.

## Behavior
1. Set `status:in-implementation`.
2. Implement approved scope only.
3. Open/update PR and set `status:in-review`.
4. Ensure one active `status:*` label.

## Delivery
- Include `Closes #<N>` in PR body.
- Update docs if behavior changed.
