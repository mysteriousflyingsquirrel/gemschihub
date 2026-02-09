# spec-070-admin-management.md
## GemschiHub — Admin (Captain) Management

## 1) Purpose

This spec defines **what the Admin (Captain)** can manage in GemschiHub and the **authority boundaries** of those actions.

It covers:
- Admin scope and permissions
- Management of seasons, events, players, results, attendance, and Spirit
- Global constraints for admin actions

This spec does not define UI layouts or workflows in detail.

---

## 2) Admin Role Definition

- There is **exactly one Admin role**:
  - **Captain**
- The Captain is the **single authoritative operator** of GemschiHub.
- All mutable data originates from Captain actions.

---

## 3) Season Management

The Captain can:
- Create seasons
- Set exactly one season as **active**
- Change the active season
- Reassign events to a different season

Constraints:
- Seasons cannot be deleted if they contain events
- Only one season can be active at any time

---

## 4) Event Management

The Captain can:
- Create events of type:
  - Training
  - Interclub
  - Spirit
- Edit event details (date, time, location, title, season)
- Delete events

Interclub-specific:
- Update match status
- Enter and edit game results
- Trigger live updates via score changes

Constraints:
- Events must always belong to a season
- Deleting an event removes all associated data

---

## 5) Attendance Management

The Captain can:
- Mark attendance for any event
- Edit attendance retroactively
- View attendance summaries per event and season

Constraints:
- Attendance cannot exist without an event
- Attendance is always tied to a season via the event

---

## 6) Player Management

The Captain can:
- Add new players
- Edit player identity and metadata
- Upload and change profile pictures
- Remove players from the active roster

Constraints:
- Removing a player does not delete historical data
- There may be only one Captain at a time

---

## 7) Spirit Management

The Captain can:
- Set and edit **Spirit values per player per season**
- Adjust Spirit values at any time

Constraints:
- Spirit values must always belong to a season
- Spirit values are authoritative and not auto-derived

---

## 8) Result Management (Interclub)

The Captain can:
- Enter Singles and Doubles results
- Edit results at any time
- Correct mistakes retroactively

Constraints:
- Only attending players may be assigned to games
- A match cannot exceed 9 completed games

---

## 9) Notification Authority

- All notifications originate from:
  - Event lifecycle changes
  - Captain-triggered updates (scores, match status)
- Public users cannot trigger notifications

---

## 10) Data Integrity Rules

Admin actions must respect:
- Season boundaries
- Attendance vs participation rules
- Single Captain authority
- No cross-season data mixing

---

## 11) Out of Scope (Explicit)

This spec does NOT define:
- Admin UI layout or navigation
- Undo/redo behavior
- Audit logs or change history
- Permission delegation

---

## 12) Acceptance Criteria

This spec is implemented when:
- The Captain can manage all mutable data
- All admin actions respect season and data integrity rules
- Public users cannot perform admin actions
