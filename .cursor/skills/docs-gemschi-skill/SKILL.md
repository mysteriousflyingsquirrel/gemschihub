---
name: docs-gemschi-skill
description: Documentation and specs skill for GemschiHub markdown work. Use for requirements/spec alignment and guidance updates without runtime code changes.
---

# Docs Gemschi Skill

Maintain high-signal documentation while staying strictly markdown-only.

## Allowed Scope
- `docs/**/*.md`
- `.cursor/**/*.md`

## Forbidden Scope
- Runtime implementation in `src/**` or `functions/**`

## When To Use
- Spec drafting or refinement.
- Requirements/spec consistency updates.
- AI guidance updates in `.cursor/**`.

## Required Sources
- `.cursor/rules/core.mdc`
- `.cursor/rules/clanker-orchestration.mdc`
- `docs/requirements/requirements.md`
- `docs/specs/`

## Instructions
1. Restate intended documentation outcome and narrow scope.
2. Align terms across requirements and specs.
3. Keep acceptance criteria concrete and verifiable.
4. If runtime work is needed, hand off to frontend/backend agents.

## Output Template
- Objective
- Scope (In/Out)
- Changes Applied
- Validation Notes
- Risks / Follow-ups
