# Verify Gemschi

## Purpose

`verify-gemschi` validates the current GemschiHub codebase against:

- `docs/requirements/requirements.md`
- `docs/specs/index.md`
- `docs/specs/spec-*.md`

It produces a markdown report listing:

- What is verified with evidence
- What is not verified or only partially verified
- What cannot currently be verified from available evidence
- A concrete worklist for the main agent

`docs/prd/prd.md` is retired and is not part of verification input.

---

## Inputs

Required inputs:

1. Requirements document
2. Specs index and all spec files
3. Current application code (`src/**`, `functions/src/**`, relevant config)

Optional inputs:

- Existing previous verification report for regression comparison

---

## Verification Method

### Step 1: Build the checklist set

- Parse all acceptance criteria from:
  - `docs/specs/index.md` checklist
  - Any additional explicit acceptance criteria in `spec-*.md`
- Parse high-level requirement commitments from `docs/requirements/requirements.md`.

### Step 2: Map each check to implementation surfaces

For each check, identify likely evidence locations:

- Frontend behavior: `src/**`
- Backend behavior/triggering: `functions/src/**`
- Access control and writes: auth/storage enforcement paths

### Step 3: Evaluate with evidence

For every check, assign exactly one status:

- `Verified`: direct code evidence exists and matches requirement/spec intent.
- `PartiallyVerified`: some evidence exists but coverage is incomplete.
- `NotVerified`: behavior appears missing or contradicts specs.
- `Unknown`: cannot be proven from static code/docs alone.

### Step 4: Record rationale and next action

Every non-`Verified` check must include:

- Why it is not fully verified
- What to inspect or implement next
- Suggested owner surface (`frontend`, `backend`, or `docs`)

### Step 5: Summarize risk and worklist

- Provide severity-based findings (`High`, `Medium`, `Low`).
- Produce a prioritized worklist for follow-up implementation.

---

## Evidence Rules

- Never mark a check as `Verified` without explicit evidence.
- Evidence must reference concrete file paths and relevant symbols/behavior.
- If runtime behavior is required but not testable from code inspection, mark `Unknown`.
- Do not infer intent from naming alone.

---

## Report Schema

The output file must follow this structure:

1. `# Verification Report - YYYY-MM-DD`
2. `## Scope`
   - Commit/working-tree context (if available)
   - Inputs used
3. `## Summary`
   - Count by status (`Verified`, `PartiallyVerified`, `NotVerified`, `Unknown`)
4. `## Findings`
   - Grouped by spec (`spec-010` ... `spec-100`) and requirements sections
   - Each item includes:
     - Check statement
     - Status
     - Evidence
     - Gap/Reason (if not `Verified`)
     - Next action
     - Severity
5. `## Main Agent Worklist`
   - Ordered actionable tasks with owner surface
6. `## Open Verification Gaps`
   - Items requiring runtime/manual validation

---

## Output Location

- Write reports to `docs/reports/verification-YYYY-MM-DD.md`.
- One report per run date. If re-running the same day, append `-v2`, `-v3`, etc.

---

## Guardrails

- Verification is assessment-only unless explicitly asked to implement fixes.
- Do not silently rewrite requirements/spec intent.
- If requirements and specs conflict, flag the conflict in report before continuing.
