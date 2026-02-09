# spec-060-notifications.md
## GemschiHub — Push Notifications

## 1) Purpose

This spec defines **push notification behavior** in GemschiHub.

It covers:
- Supported platforms
- Notification triggers
- Scope and constraints

This spec does not define UI wording in detail or implementation-specific APIs.

---

## 2) Supported Platforms

GemschiHub supports push notifications on:

- **Android**
  - Via standard Web Push in modern browsers

- **iOS**
  - Via Web Push **only when GemschiHub is installed as a PWA**
  - Requires:
    - Add to Home Screen
    - iOS 16.4 or newer

---

## 3) Permission Model

- Notification permission must be explicitly granted by the user
- Permission is requested using the standard browser prompt
- No custom permission UI is required

There are no user-specific notification settings.

---

## 4) Notification Scope

Notifications are:
- Informational only
- Broadcast-style (not personalized)
- Related exclusively to events

---

## 5) Notification Triggers (All Event Types)

For **all event types** (Training, Interclub, Spirit):

- Upcoming event reminder
- Event start notification

---

## 6) Interclub-Specific Notifications

For **Interclub events only**, additional notifications may be sent:

- Match start
- Live match updates (e.g. score changes)
- Match completion

These notifications reflect **Captain-entered updates**.

---

## 7) Timing Rules

- Upcoming event notifications are sent within a configurable time window before the event
- Event start notifications are sent at or near the event start time
- Live updates are sent immediately after relevant changes

Exact timing configuration is implementation-defined.

---

## 8) Authority & Triggers

- Notifications are triggered by:
  - Event lifecycle changes
  - Captain actions (e.g. score updates)
- Public users cannot trigger notifications

---

## 9) Failure Handling

- Notification delivery is best-effort
- Failed deliveries are not retried indefinitely
- No user-visible error is required if notification delivery fails

---

## 10) Out of Scope (Explicit)

This spec does NOT define:
- Notification wording or localization
- Opt-in/out preferences
- Analytics or delivery confirmation
- Fallback channels (email, SMS)

---

## 11) Acceptance Criteria

This spec is implemented when:
- Users can receive push notifications on supported platforms
- Notifications are sent for all event types
- Interclub live updates trigger notifications
- Notifications respect platform constraints
