# Verification Report - 2026-03-04

## Scope

- Verification mode: static code and docs audit (no runtime execution)
- Inputs:
  - `docs/requirements/requirements.md`
  - `docs/specs/index.md`
  - `docs/specs/spec-*.md`
  - `src/**`
  - `functions/src/**`

## Summary

- `Verified`: 25
- `PartiallyVerified`: 20
- `NotVerified`: 5
- `Unknown`: 0

## Findings

### Requirements (high-level)

- Single source of truth for team data -> `PartiallyVerified`  
  Evidence: `src/contexts/*` and Firestore usage show centralized data model; write protection for public users is not proven without storage rules.  
  Next action: verify and version storage security rules.
- Public read-only access + Captain full management -> `PartiallyVerified`  
  Evidence: `src/App.tsx`, `src/components/ProtectedRoute.tsx`, `src/pages/Admin.tsx`.  
  Gap: client-side gating is present; backend/storage write enforcement for non-admin is not proven.  
  Next action: enforce/verify Firestore rules and callable authz checks.
- Three event types + attendance + season binding -> `Verified`  
  Evidence: `src/types/event.ts`, `src/contexts/EventsContext.tsx`, `src/contexts/AttendanceContext.tsx`.
- Interclub scoring feeds stats -> `Verified`  
  Evidence: `src/types/event.ts`, `src/hooks/useStatistics.ts`.
- Push notifications for event lifecycle/live updates -> `PartiallyVerified`  
  Evidence: `functions/src/checkEventReminders.ts`, `functions/src/onEventUpdated.ts`, `src/services/notifications.ts`.  
  Gap: exact "start-of-event" trigger not explicit.

### spec-010-seasons

- Multiple seasons can exist -> `Verified`  
  Evidence: `src/contexts/SeasonsContext.tsx` (`addSeason`, listener list).
- Exactly one season is active at a time -> `Verified`  
  Evidence: `src/contexts/SeasonsContext.tsx` (`setActiveSeason` batch toggles all).
- Public users can switch seasons via selector -> `Verified`  
  Evidence: `src/components/SeasonSelector.tsx`, `src/components/Sidebar.tsx`.
- Stats, events, and Spirit values change with season selection -> `Verified`  
  Evidence: `src/contexts/EventsContext.tsx`, `src/contexts/AttendanceContext.tsx`, `src/contexts/SpiritContext.tsx`, `src/hooks/useStatistics.ts`.
- No data leaks between seasons -> `PartiallyVerified`  
  Evidence: client-side filtering by `selectedSeasonId`.  
  Gap: server-side/query-level isolation enforcement is not demonstrated.

### spec-020-events

- Captain can create/edit/delete Training events -> `PartiallyVerified`  
  Evidence: `src/pages/Admin.tsx`, `src/contexts/EventsContext.tsx`.  
  Gap: storage-level admin-only enforcement not proven.
- Captain can create/edit/delete Interclub events -> `PartiallyVerified`  
  Evidence: `src/pages/Admin.tsx`, `src/contexts/EventsContext.tsx`.  
  Gap: same as above.
- Captain can create/edit/delete Spirit events -> `PartiallyVerified`  
  Evidence: `src/pages/Admin.tsx`, `src/contexts/EventsContext.tsx`.  
  Gap: same as above.
- Every event is assigned to exactly one season -> `Verified`  
  Evidence: `src/pages/Admin.tsx` (event creation requires `selectedSeasonId`), `src/types/event.ts` (`seasonId` required).
- Public users can view event lists and details per season -> `Verified`  
  Evidence: `src/pages/Events.tsx`, `src/contexts/EventsContext.tsx`.
- Attendance exists for all event types and is visible publicly -> `PartiallyVerified`  
  Evidence: `src/contexts/AttendanceContext.tsx`, `src/pages/Events.tsx` (attendees shown in modal).  
  Gap: "exists for all events" depends on admin input; no automatic completeness check.
- Public users cannot modify events, scores, or attendance -> `NotVerified`  
  Evidence: UI blocks edits (`src/App.tsx`, admin route).  
  Gap: no verified storage rules proving non-admin writes are rejected.

### spec-030-roster-players

- Public roster is visible -> `Verified`  
  Evidence: `src/pages/Spieler.tsx`.
- Each player has a public profile with profile picture support -> `PartiallyVerified`  
  Evidence: profile rendering in `src/pages/Spieler.tsx`, `profilePictureUrl` in `src/types/player.ts`.  
  Gap: profile picture upload/change flow is not evident in current admin form.
- Player data persists across seasons -> `Verified`  
  Evidence: players are global in `src/contexts/PlayersContext.tsx` and not season-scoped.
- Seasonal Spirit values can be edited by the Captain -> `Verified`  
  Evidence: `src/pages/Admin.tsx` (spirit sliders), `src/contexts/SpiritContext.tsx` (`setPlayerSpirit`).
- Historical player data remains visible after removal -> `PartiallyVerified`  
  Evidence: soft delete (`isActive=false`) in `src/contexts/PlayersContext.tsx`.  
  Gap: some public history views depend on active player list; historical rendering may be incomplete.
- Only one Captain role at a time -> `Verified`  
  Evidence: role demotion logic in `src/contexts/PlayersContext.tsx`.

### spec-040-interclub-results

- Captain can enter Singles and Doubles results -> `PartiallyVerified`  
  Evidence: results modal and save flow in `src/pages/Admin.tsx`.  
  Gap: backend/storage authorization not proven.
- Match status updates correctly (Offen/Am Spielen/Gespielt) -> `Verified`  
  Evidence: `deriveMatchStatus` in `src/types/event.ts`, recompute in `src/contexts/EventsContext.tsx`.
- Total score aggregates to max 9 points -> `Verified`  
  Evidence: fixed 6 singles + 3 doubles factories and score aggregation in `src/types/event.ts`.
- Player participation is correctly recorded -> `PartiallyVerified`  
  Evidence: player assignment fields in results UI (`src/pages/Admin.tsx`).  
  Gap: no explicit persistent participation model beyond game assignment; "attending only" guard is UI-level.
- Public users can view match results and status -> `Verified`  
  Evidence: `src/pages/Events.tsx` modal sections for match status, totals, singles, doubles.
- Instagram link field on Interclub events -> `Verified`  
  Evidence: set in admin event list (`src/pages/Admin.tsx`), displayed in event details (`src/pages/Events.tsx`).

### spec-050-statistics

- Seasonal player stats are visible -> `Verified`  
  Evidence: `src/pages/Spieler.tsx`, `src/hooks/useStatistics.ts`.
- Seasonal team stats are visible -> `NotVerified`  
  Evidence: no team stats presentation found in `src/pages/*` (current `Verfassung` page is static text).  
  Next action: add a team statistics surface backed by `useStatistics().teamStats`.
- Gemschi Score is shown per player per season -> `Verified`  
  Evidence: `src/pages/Spieler.tsx`, `src/hooks/useStatistics.ts`.
- Stats update when underlying data changes -> `Verified`  
  Evidence: derived stats depend on reactive contexts in `src/hooks/useStatistics.ts`.
- No cross-season stat aggregation -> `Verified`  
  Evidence: season-filtered inputs from contexts before stats computation.

### spec-060-notifications

- Users can receive push notifications on supported platforms -> `PartiallyVerified`  
  Evidence: `src/services/notifications.ts`, `src/components/NotificationPrompt.tsx`, `src/components/ForegroundNotifications.tsx`.  
  Gap: platform matrix (especially iOS PWA behavior) not runtime-verified.
- Notifications are sent for all event types (upcoming + start) -> `PartiallyVerified`  
  Evidence: reminders in `functions/src/checkEventReminders.ts` include all event types.  
  Gap: explicit "event start" trigger timing not clearly implemented as separate start event.
- Interclub live updates trigger notifications -> `Verified`  
  Evidence: `functions/src/onEventUpdated.ts`.
- Notifications respect platform constraints (iOS PWA) -> `PartiallyVerified`  
  Evidence: client uses standard web push path only.  
  Gap: no explicit platform-constraint enforcement/telemetry.
- FCM integration is functional -> `PartiallyVerified`  
  Evidence: FCM setup and callable/trigger send paths in `src/services/notifications.ts` and `functions/src/*.ts`.  
  Gap: no runtime test evidence in this audit.

### spec-070-admin-management

- Captain can manage all mutable data -> `PartiallyVerified`  
  Evidence: admin surface in `src/pages/Admin.tsx` covers seasons/events/attendance/results/players/spirit/info.  
  Gap: some constraints (season-delete guards, full profile media management) are incomplete.
- All admin actions respect season and data integrity rules -> `PartiallyVerified`  
  Evidence: many season-bound writes exist; match score/status recomputation exists.  
  Gap: no hard guard against deleting seasons with existing events; attendance vs participation integrity largely UI-level.
- Public users cannot perform admin actions -> `NotVerified`  
  Evidence: route/UI guard exists.  
  Gap: write-layer enforcement not proven.

### spec-080-nonfunctional

- App is usable on desktop and mobile -> `Verified`  
  Evidence: responsive classes and mobile/desktop variants in `src/pages/Events.tsx`, `src/pages/Spieler.tsx`, `src/components/Sidebar.tsx`.
- Data persists correctly across reloads -> `Verified`  
  Evidence: Firestore-backed listeners and CRUD contexts in `src/contexts/*`.
- Admin access is protected -> `PartiallyVerified`  
  Evidence: auth and route guard in `src/contexts/AuthContext.tsx`, `src/components/ProtectedRoute.tsx`.  
  Gap: fallback "allow any authenticated user if allowlist empty" weakens strictness.
- Notifications respect platform constraints -> `PartiallyVerified`  
  Evidence: push implementation exists.  
  Gap: no explicit enforcement/testing evidence for iOS PWA-only behavior.

### spec-090-authentication

- Public users can use the app without login -> `Verified`  
  Evidence: public routes in `src/App.tsx`.
- Captain can log in via Firebase Auth -> `Verified`  
  Evidence: `src/contexts/AuthContext.tsx`, `src/pages/Login.tsx`, `src/firebase/firebaseConfig.ts`.
- Admin access granted only when email is in CAPTAIN_EMAILS allowlist -> `Verified`  
  Evidence: allowlist parsing and admin check in `src/contexts/AuthContext.tsx`.
- Admin routes and writes are blocked for non-admin users -> `PartiallyVerified`  
  Evidence: route blocking via `src/components/ProtectedRoute.tsx`.  
  Gap: write blocking at storage/backend level not proven.
- Logout returns app to public mode -> `Verified`  
  Evidence: `logout()` + redirect in `src/components/Sidebar.tsx`.

### spec-100-data-storage

- All core data persists across reloads -> `PartiallyVerified`  
  Evidence: Firestore persistence for key domains in `src/contexts/*`.  
  Gap: profile image storage flow/evidence is incomplete.
- Admin changes are durable -> `PartiallyVerified`  
  Evidence: writes use Firestore CRUD APIs in context providers.  
  Gap: durability not runtime-validated in this audit.
- Public users cannot write data -> `NotVerified`  
  Evidence: no Firestore rules file or other write-policy artifact found in repo.
- Storage implementation can be swapped without rewriting domain logic -> `NotVerified`  
  Evidence: `src/storage/StorageService.ts` abstraction exists but app domain contexts directly use Firestore APIs.  
  Next action: introduce repository/data-access layer used by contexts.

## Main Agent Worklist

1. **Backend (High)** Add and enforce Firestore security rules proving non-admin write rejection and admin-only writes.
2. **Backend (High)** Tighten callable authorization (`sendNotification`) to Captain allowlist, not only authenticated user.
3. **Frontend (High)** Implement team statistics UI surface to satisfy `spec-050` team stats visibility.
4. **Frontend/Backend (High)** Ensure event deletion handles dependent attendance/results consistently with spec expectations.
5. **Docs (Medium)** Update `docs/specs/index.md` checklist wording (`CAPTAIN_EMAILS` vs single-email phrasing) to match implemented allowlist behavior.
6. **Frontend (Medium)** Add explicit profile picture upload/change flow and evidence path.
7. **Architecture (Medium)** Introduce storage abstraction usage for domain contexts (not only notification local flags).
8. **QA (Medium)** Add runtime verification for iOS PWA push constraints and event-start notification timing.

## Open Verification Gaps

- Runtime-only behaviors not proven by static read:
  - Push delivery reliability across Android/iOS PWA
  - End-to-end authz enforcement under real Firestore rules
  - Data durability under network interruptions
- Recommended follow-up: run manual E2E checklist against this report and promote `PartiallyVerified`/`Unknown` items to `Verified` only with execution evidence.
