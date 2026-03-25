---
description: Create a GitHub issue from typed user intent.
alwaysApply: true
---

# /create-issue

## Syntax
- `/create-issue <type> <text>`
- `<type>` must be one of: `feature`, `bug`, `chore`

## Title vs Body
- `Title = first line of <text>`
- `Body = the remainder of <text>` (preserve line breaks)

## Steps
1. Parse `<type>` and map it to `type:<type>` (e.g. `feature -> type:feature`).
2. Create the issue via `gh issue create`:
   - Use the parsed `Title` as `--title`
   - Use the parsed `Body` as `--body`
   - Ensure the issue is created in the current repo
3. Normalize labels after creation:
   - Add `state:created`
   - Remove any other labels matching `state:*` (keep exactly one active `state:*`)
   - Add exactly one `type:*` based on `<type>`
   - Remove any other `type:*`
4. Output to the user:
   - The created issue URL (and issue number)

## Label set (used for normalization)
- `state:created`
- `state:planned`
- `state:in-progress`
- `state:in-review`
- `state:done`
- `state:blocked`
- `type:feature`
- `type:bug`
- `type:chore`
