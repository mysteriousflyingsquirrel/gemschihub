---
name: backend-gemschi-skill
description: Backend implementation quality skill for GemschiHub Cloud Functions. Use for backend logic, validation, and safe boundary handling in functions.
---

# Backend Gemschi Skill

Deliver safe backend changes with explicit validation and error-path rigor.

## Allowed Scope
- `functions/**`
- `firebase.json` when required by backend task

## Forbidden Scope
- `src/**`
- Frontend runtime implementation work

## When To Use
- Cloud Function implementation or fixes.
- Notification/event-processing logic changes.
- Backend verification and regression checks.

## Required Sources
- `.cursor/rules/core.mdc`
- `.cursor/rules/clanker-orchestration.mdc`
- `docs/requirements/requirements.md`
- `docs/specs/`

## Instructions
1. Restate backend scope and risk profile.
2. Validate external payloads and assumptions explicitly.
3. Keep business logic in `functions/src/**`.
4. Avoid silent failures; make error behavior explicit.
5. If frontend work is needed, hand off to `frontend-gemschi`.

## Output Template
- Plan
- Files Changed
- Validation / Error Checks
- Risks / Follow-ups
