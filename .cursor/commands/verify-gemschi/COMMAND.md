Run a deterministic requirements/spec verification workflow for GemschiHub.

1. Delegate execution to `verify-gemschi`.
2. Read `docs/verify-gemschi.md` and follow it strictly.
3. Load verification inputs:
   - `docs/requirements/requirements.md`
   - `docs/specs/index.md`
   - `docs/specs/spec-*.md`
   - Relevant implementation files in `src/**` and `functions/src/**`
4. Evaluate every checklist item and assign exactly one status:
   - `Verified`, `PartiallyVerified`, `NotVerified`, or `Unknown`
5. Require explicit evidence for any `Verified` claim.
6. For every non-`Verified` item, include reason, severity, and next action.
7. Write output to `docs/reports/verification-YYYY-MM-DD.md` (or `-vN` for reruns).
8. End with a prioritized “Main Agent Worklist” grouped by owner surface (`frontend`, `backend`, `docs`).
