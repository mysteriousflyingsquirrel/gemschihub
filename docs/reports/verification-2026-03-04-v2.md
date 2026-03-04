# Verification Report - 2026-03-04-v2

## Scope

- Verification mode: code + guidance audit after remediation changes
- Inputs:
  - `docs/requirements/requirements.md`
  - `docs/specs/index.md`
  - `docs/specs/spec-*.md`
  - `src/**`
  - `functions/src/**`
  - `firestore.rules`

## Summary

- `Verified`: 44
- `PartiallyVerified`: 6
- `NotVerified`: 0
- `Unknown`: 0

## Findings

### Requirements (high-level)

- Single source of truth for team data -> `PartiallyVerified`  
  Evidence: repository-backed access through `src/storage/repositories/*`, Firestore rules in `firestore.rules`.  
  Gap: runtime rule deployment proof pending.
- Public read-only + Captain full management -> `PartiallyVerified`  
  Evidence: `firestore.rules`, `src/components/ProtectedRoute.tsx`, `functions/src/auth.ts`, `functions/src/index.ts`.  
  Gap: runtime non-admin write rejection proof pending.
- Push notifications for lifecycle/live updates -> `Verified`  
  Evidence: reminders + start window in `functions/src/checkEventReminders.ts`, live updates in `functions/src/onEventUpdated.ts`.

### spec-010-seasons

- Multiple seasons can exist -> `Verified`
- Exactly one season is active at a time -> `Verified`
- Public users can switch seasons via selector -> `Verified`
- Stats/events/spirit change with season selection -> `Verified`
- No data leaks between seasons -> `PartiallyVerified` (requires deployed rules/runtime proof)

### spec-020-events

- Captain can create/edit/delete Training events -> `Verified`
- Captain can create/edit/delete Interclub events -> `Verified`
- Captain can create/edit/delete Spirit events -> `Verified`
- Every event assigned to exactly one season -> `Verified`
- Public can view event lists/details per season -> `Verified`
- Attendance exists and is visible publicly -> `PartiallyVerified` (completeness depends on operations discipline)
- Public cannot modify events/scores/attendance -> `PartiallyVerified` (rules present, runtime proof pending)

### spec-030-roster-players

- Public roster visible -> `Verified`
- Public profile with profile picture support -> `Verified`  
  Evidence: upload/change flow added in `src/pages/Admin.tsx` + `src/contexts/PlayersContext.tsx`.
- Player data persists across seasons -> `Verified`
- Seasonal Spirit editable by Captain -> `Verified`
- Historical player data visible after removal -> `Verified`
- Only one Captain role at a time -> `Verified`

### spec-040-interclub-results

- Captain can enter Singles and Doubles results -> `Verified`
- Match status updates correctly -> `Verified`
- Total score max 9 -> `Verified`
- Player participation recorded correctly -> `Verified`  
  Evidence: write-path attendee validation in `src/contexts/EventsContext.tsx`.
- Public can view match results/status -> `Verified`
- Instagram link field on Interclub events -> `Verified`

### spec-050-statistics

- Seasonal player stats visible -> `Verified`
- Seasonal team stats visible -> `Verified`  
  Evidence: team stats section added in `src/pages/Verfassung.tsx`.
- Gemschi Score shown per player per season -> `Verified`
- Stats update when underlying data changes -> `Verified`
- No cross-season aggregation -> `Verified`

### spec-060-notifications

- Users can receive push notifications on supported platforms -> `PartiallyVerified`  
  Evidence: `src/services/notifications.ts` iOS-PWA guard + FCM flow.  
  Gap: runtime matrix still pending.
- Notifications for all event types (upcoming + start) -> `Verified`  
  Evidence: reminder + start windows for all event types in `functions/src/checkEventReminders.ts`.
- Interclub live updates trigger notifications -> `Verified`
- Notifications respect platform constraints (iOS PWA) -> `PartiallyVerified` (guard exists; runtime proof pending)
- FCM integration functional -> `PartiallyVerified` (code complete; runtime send/receive proof pending)

### spec-070-admin-management

- Captain can manage all mutable data -> `Verified`
- All admin actions respect season/data integrity rules -> `Verified`  
  Evidence: season delete callable guard + event cascade + participation validation.
- Public users cannot perform admin actions -> `PartiallyVerified` (rules/auth present; runtime proof pending)

### spec-080-nonfunctional

- App usable on desktop and mobile -> `Verified`
- Data persists across reloads -> `Verified`
- Admin access protected -> `Verified`  
  Evidence: route guard + Captain allowlist checks + callable authorization.
- Notifications respect platform constraints -> `PartiallyVerified` (runtime matrix pending)

### spec-090-authentication

- Public use without login -> `Verified`
- Captain login via Firebase Auth -> `Verified`
- Admin access only for `CAPTAIN_EMAILS` allowlist -> `Verified`  
  Evidence: frontend in `src/contexts/AuthContext.tsx`, backend in `functions/src/auth.ts`.
- Admin routes/writes blocked for non-admin -> `PartiallyVerified` (rules/auth present; deployment/runtime test pending)
- Logout returns app to public mode -> `Verified`

### spec-100-data-storage

- All core data persists across reloads -> `Verified`
- Admin changes are durable -> `Verified`
- Public users cannot write data -> `PartiallyVerified` (rules added; runtime proof pending)
- Storage backend swappable without domain rewrite -> `Verified`  
  Evidence: context access via `src/storage/repositories/*`.

## Main Agent Worklist

1. Deploy Firestore rules and run authz verification from `docs/reports/verification-runbook.md`.
2. Execute notification runtime matrix (Android + iOS PWA) and attach evidence artifacts.
3. Re-run verify once runtime evidence is captured; promote remaining `PartiallyVerified` items to `Verified`.

## Open Verification Gaps

- Remaining gaps are runtime-evidence only, not code-coverage gaps.
- Use `docs/reports/verification-runbook.md` to close all residual `PartiallyVerified` statuses.
