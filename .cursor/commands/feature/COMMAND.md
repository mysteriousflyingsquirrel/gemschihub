Run a deterministic feature-delivery workflow for the current request.

1. Route docs/spec/guidance markdown work to `docs-gemschi`.
2. Route frontend/UI implementation to `frontend-gemschi`.
3. Route backend/cloud-function implementation to `backend-gemschi`.
4. For mixed work, split by surface and delegate each slice to the matching agent.
5. Require explicit evidence for completion claims.
6. If a full requirements/spec compliance audit is requested, run `verify-gemschi`.
