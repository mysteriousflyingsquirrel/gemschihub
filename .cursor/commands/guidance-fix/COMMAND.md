Run a deterministic AI-guidance maintenance workflow.

1. Apply `docs-gemschi-skill` for markdown guidance updates.
2. Identify whether the issue is in `.cursor/rules/`, `.cursor/skills/`, or `.cursor/agents/`.
3. If implementation-quality guidance is affected, apply `frontend-gemschi-skill` or `backend-gemschi-skill` by surface.
4. Keep updates minimal, explicit, and aligned to `.cursor/rules/core.mdc`, `.cursor/rules/clanker-orchestration.mdc`, `docs/requirements/requirements.md`, and `docs/specs/`.
5. Prefer activation clarity: use `alwaysApply` only for core gates, and use `globs` for file-scoped rules.
6. Report exactly what changed, why, interaction effects, and residual risks.
