---
name: frontend-gemschi-skill
description: Frontend implementation quality skill for GemschiHub React UI. Use for UI behavior, UX states, and frontend boundary-safe delivery in src.
---

# Frontend Gemschi Skill

Deliver production-grade frontend changes with explicit UX quality checks.

## Allowed Scope
- `src/**`

## Forbidden Scope
- `functions/**`
- Backend runtime implementation work

## When To Use
- Frontend implementation requests.
- UI/UX refinement and interaction fixes.
- Frontend quality validation after UI edits.

## Required Sources
- `.cursor/rules/core.mdc`
- `.cursor/rules/clanker-orchestration.mdc`
- `docs/requirements/requirements.md`
- `docs/specs/`

## Instructions
1. Restate frontend scope and UX intent before editing.
2. Implement the smallest viable UI change first.
3. Cover loading, error, and empty states where relevant.
4. Preserve accessibility and responsive behavior.
5. If backend changes are needed, hand off to `backend-gemschi`.

## Output Template
- Plan
- Files Changed
- UX/State Validation
- Risks / Follow-ups
