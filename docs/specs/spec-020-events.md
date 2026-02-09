# spec-020-events.md
## GemschiHub — Events (Training, Interclub, Spirit)

## 1) Purpose

This spec defines how **events** work in GemschiHub, including:
- Event types (Training / Interclub / Spirit)
- Season binding
- Attendance tracking (all event types)
- What is public vs admin-managed

This spec does not define UI layouts.

---

## 2) Event Types

GemschiHub supports exactly these event types:
1. **Training**
2. **Interclub**
3. **Spirit**

Spirit events are general team events such as:
- Bierversammlung
- Teamdynamikförderungsausflug
- Gemschi-Skisafari-Parade

---

## 3) Global Event Rules

For all event types:
- Every event belongs to **exactly one season** (see `spec-010-seasons.md`)
- Events are **publicly visible**
- Public users have **read-only** access
- **Attendance is tracked** for all events
- Only the **Captain** can create, edit, or delete events

---

## 4) Event Minimum Fields (Logical, not implementation)

Every event must have, at minimum:
- **Season**
- **Type** (Training / Interclub / Spirit)
- **Title** (human-readable)
- **Start date/time**
- **Location** (optional but recommended)
- **Status** (see section 7)

Interclub events must additionally have:
- **Opponent**
- **Match status** (Offen / Am Spielen / Gespielt)
- **Score state** (may be empty when Offen)

---

## 5) Event Visibility

Public users can view:
- Event list per season
- Event details per season
- Attendance summary per event (who attended)
- For Interclub: opponent, status, score (when available)

Public users cannot:
- RSVP
- Edit attendance
- Edit scores
- Create or delete events

---

## 6) Attendance Model (All Event Types)

### Purpose
Attendance answers: **Who was present at this event?**

### Rules
- Attendance is tracked for:
  - Training events
  - Interclub events
  - Spirit events
- Attendance is always stored and displayed in the context of:
  - A specific event
  - A specific season

### Authority
- Attendance is managed exclusively by the **Captain**.
- Public users can only view attendance.

### Participation vs Attendance (Interclub only)
- **Attendance**: present at the Interclub event
- **Participation**: played singles/doubles in that Interclub event  
  (participation is defined in `spec-050-interclub-results.md`)

---

## 7) Event Status (Generic)

All events have a generic status used for display and filtering:
- **Upcoming**: event is in the future
- **Ongoing**: event time window is currently active
- **Completed**: event is in the past

Rules:
- Generic status is derived from current time and event time window
- The Captain may override status only if explicitly supported later  
  (not required in MVP)

Interclub events additionally have a **match status**:
- Offen / Am Spielen / Gespielt  
(defined in `spec-050-interclub-results.md`)

---

## 8) Notifications (Event-Related)

GemschiHub must support push notifications for all event types:
- Upcoming event reminders
- Event start notification

For Interclub events, additional notifications may exist:
- Live ticker updates  
(e.g. “Gemscheni just won a match!”)

Detailed notification triggers and wording are defined in `spec-070-notifications.md`.

---

## 9) Deletion Rules

- Only the Captain can delete events.
- Deleting an event deletes:
  - Its attendance records
  - Any attached Interclub results (if Interclub)
- No “soft delete” requirement is defined at this level.

---

## 10) Out of Scope (Explicit)

This spec does NOT define:
- UI layout (tables, calendars, cards)
- Exact data schema / field names
- Notification scheduling/logic
- Interclub scoring rules  
(see `spec-050-interclub-results.md`)

---

## 11) Acceptance Criteria

Implemented when:
- Captain can create/edit/delete events of all three types
- Every event is assigned to exactly one season
- Public users can view event lists and details per season
- Attendance exists for all event types and is visible publicly
- Public users cannot modify events, scores, or attendance
