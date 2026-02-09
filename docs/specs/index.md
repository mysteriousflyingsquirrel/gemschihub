# GemschiHub — Specs Index

All specifications for GemschiHub, listed in dependency order.

| # | Spec | Purpose |
|---|------|---------|
| 010 | [spec-010-seasons.md](./spec-010-seasons.md) | Defines seasons as the primary grouping unit for all data |
| 020 | [spec-020-events.md](./spec-020-events.md) | Defines event types (Training, Interclub, Spirit) and attendance |
| 030 | [spec-030-roster-players.md](./spec-030-roster-players.md) | Defines team roster, player profiles, and Spirit values |
| 040 | [spec-040-interclub-results.md](./spec-040-interclub-results.md) | Defines Interclub match structure, scoring, and participation |
| 050 | [spec-050-statistics.md](./spec-050-statistics.md) | Defines seasonal statistics and Gemschi Score composition |
| 060 | [spec-060-notifications.md](./spec-060-notifications.md) | Defines push notification triggers and platform constraints |
| 070 | [spec-070-admin-management.md](./spec-070-admin-management.md) | Defines Captain admin scope and authority boundaries |
| 080 | [spec-080-nonfunctional.md](./spec-080-nonfunctional.md) | Defines performance, availability, security, and platform support |
| 090 | [spec-090-authentication.md](./spec-090-authentication.md) | Defines Firebase Auth for Captain login and authorization model |
| 100 | [spec-100-data-storage.md](./spec-100-data-storage.md) | Defines data persistence, storage abstraction, and integrity rules |

---

## Spec Compliance Checklist

### spec-010-seasons
- [ ] Multiple seasons can exist
- [ ] Exactly one season is active at a time
- [ ] Public users can switch seasons via selector
- [ ] Stats, events, and Spirit values change with season selection
- [ ] No data leaks between seasons

### spec-020-events
- [ ] Captain can create/edit/delete Training events
- [ ] Captain can create/edit/delete Interclub events
- [ ] Captain can create/edit/delete Spirit events
- [ ] Every event is assigned to exactly one season
- [ ] Public users can view event lists and details per season
- [ ] Attendance exists for all event types and is visible publicly
- [ ] Public users cannot modify events, scores, or attendance

### spec-030-roster-players
- [ ] Public roster is visible
- [ ] Each player has a public profile with profile picture support
- [ ] Player data persists across seasons
- [ ] Seasonal Spirit values can be edited by the Captain
- [ ] Historical player data remains visible after removal
- [ ] Only one Captain role at a time

### spec-040-interclub-results
- [ ] Captain can enter Singles and Doubles results
- [ ] Match status updates correctly (Offen/Am Spielen/Gespielt)
- [ ] Total score aggregates to max 9 points
- [ ] Player participation is correctly recorded
- [ ] Public users can view match results and status
- [ ] Instagram link field on Interclub events

### spec-050-statistics
- [ ] Seasonal player stats are visible
- [ ] Seasonal team stats are visible
- [ ] Gemschi Score is shown per player per season
- [ ] Stats update when underlying data changes
- [ ] No cross-season stat aggregation

### spec-060-notifications
- [ ] Users can receive push notifications on supported platforms
- [ ] Notifications are sent for all event types (upcoming + start)
- [ ] Interclub live updates trigger notifications
- [ ] Notifications respect platform constraints (iOS PWA)
- [ ] FCM integration is functional

### spec-070-admin-management
- [ ] Captain can manage all mutable data
- [ ] All admin actions respect season and data integrity rules
- [ ] Public users cannot perform admin actions

### spec-080-nonfunctional
- [ ] App is usable on desktop and mobile
- [ ] Data persists correctly across reloads
- [ ] Admin access is protected
- [ ] Notifications respect platform constraints

### spec-090-authentication
- [ ] Public users can use the app without login
- [ ] Captain can log in via Firebase Auth
- [ ] Admin access granted only when email is in CAPTAIN_EMAILS allowlist
- [ ] Admin routes and writes are blocked for non-admin users
- [ ] Logout returns app to public mode

### spec-100-data-storage
- [ ] All core data persists across reloads
- [ ] Admin changes are durable
- [ ] Public users cannot write data
- [ ] Storage implementation can be swapped without rewriting domain logic
