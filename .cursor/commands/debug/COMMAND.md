Run a deterministic debugging workflow for the current request.

1. Capture evidence first (logs, traces, failing tests, repro steps).
2. Route frontend fix work to `frontend-gemschi`.
3. Route backend fix work to `backend-gemschi`.
4. Route docs/runbook updates to `docs-gemschi`.
5. Report root cause, minimal fix path, verification evidence, and residual risks.
6. If the bug implies spec or requirement drift, run `verify-gemschi` and attach gaps to the fix plan.
