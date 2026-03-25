# Workflow Cheatsheet

Minimal day-to-day guide for the GemschiHub workflow.

## 0) One-Time Setup (labels)

Create state labels once in GitHub (if missing):

```bash
gh label create "state:created" --color "D4C5F9" --description "Issue is created"
gh label create "state:planned" --color "BFD4F2" --description "Issue has approved plan"
gh label create "state:in-progress" --color "FBCA04" --description "Issue is being implemented"
gh label create "state:in-review" --color "5319E7" --description "Issue has open PR"
gh label create "state:done" --color "0E8A16" --description "Issue is completed"
gh label create "state:blocked" --color "B60205" --description "Issue is blocked"
```

## 1) Create Issue

Prompt:

```text
Create an issue: <raw user request>
```

Expected:
- issue is created via GitHub
- label set to `state:created`

## 2) Plan Issue

Prompt:

```text
Plan issue #<N>
```

Planning priority:
- planning is the most important quality gate
- use the highest-reasoning model available
- do deeper analysis here than during implementation

Plan comment format must include:
- `## Plan`
- `## Affected Files`
- `## Documentation Impact`
- `## Open Questions`
- `## Risks`

Expected:
- plan posted as GitHub comment
- label set to `state:planned`

## 3) Implement Issue

Prompt:

```text
Implement issue #<N>
```

Branch/PR freshness check (before coding):
1. check whether current branch PR is open or already merged/closed
2. if merged/closed, create a new feature branch from latest `master`
3. use a new PR for the new work (do not append commits to old merged PR branches)

Expected sequence:
1. use latest approved plan from issue comments
2. move label to `state:in-progress`
3. create feature branch
4. implement only planned scope
5. open PR with `Closes #<N>`
6. set label to `state:in-review`

## 4) Documentation Gate (required)

Documentation is part of done.

When behavior, requirements, or acceptance criteria change, update:
- `docs/requirements/requirements.md`
- `docs/specs/spec-*.md`
- `docs/specs/index.md` (if coverage/index changes)

Every PR must include:

```md
## Documentation Impact
- <updated doc paths>
```

Or:

```md
## Documentation Impact
- No doc changes needed: <short reason>
```

`state:done` is allowed only after:
- PR merged/closed
- documentation impact requirement satisfied

## 5) Tiny Direct Implement

Allowed only for very small, obvious, low-risk changes.

Still required:
- feature branch
- PR
- include `Closes #<N>` when issue exists

## 6) Ask-Only Mode

Prompt:

```text
Ask about repo: <question>
```

Expected:
- repository-aware answers
- no code changes unless explicitly requested

## 7) Useful Commands

Check issue + comments:

```bash
gh issue view <N> --comments
```

Set issue state:

```bash
gh issue edit <N> --add-label "state:planned" --remove-label "state:created"
gh issue edit <N> --add-label "state:in-progress" --remove-label "state:planned"
gh issue edit <N> --add-label "state:in-review" --remove-label "state:in-progress"
gh issue edit <N> --add-label "state:done" --remove-label "state:in-review"
```

Open PR:

```bash
gh pr create --title "<title>" --body "<body>"
```
