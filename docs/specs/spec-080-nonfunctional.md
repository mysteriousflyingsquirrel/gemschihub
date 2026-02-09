# spec-080-nonfunctional.md
## GemschiHub — Non-Functional Requirements

## 1) Purpose

This spec defines the **non-functional requirements** for GemschiHub.

It covers:
- Performance
- Availability
- Security basics
- Data persistence
- Platform constraints

This spec does not define infrastructure or deployment tooling in detail.

---

## 2) Performance

- GemschiHub must load and be usable on:
  - Desktop browsers
  - Mobile browsers (Android and iOS)
- Initial page load should be fast enough for casual use.
- Navigation between pages must feel responsive.
- Heavy computations (e.g. statistics aggregation) must not block the UI.

No hard performance metrics (e.g. ms thresholds) are required at this stage.

---

## 3) Availability

- GemschiHub is a **best-effort application**.
- Temporary unavailability is acceptable.
- There is no requirement for:
  - Offline-first behavior
  - Guaranteed uptime
  - High-availability clustering

---

## 4) Data Persistence

- Data must persist across page reloads and browser restarts.
- Data loss must not occur during normal usage.
- The system must support migration from local storage to a backend in the future.

---

## 5) Security (Basic)

- Public users:
  - Have read-only access
  - Do not authenticate
- The Captain:
  - Authenticates to access admin functionality
- Admin-only functionality must not be accessible to public users.

Advanced security topics (rate limiting, encryption at rest, etc.) are out of scope.

---

## 6) Notifications Platform Constraints

- Push notifications must comply with:
  - Android browser Web Push requirements
  - iOS PWA Web Push limitations (iOS 16.4+)
- Notification delivery is best-effort.

---

## 7) Browser & Platform Support

- Supported environments:
  - Modern desktop browsers (Chrome, Edge, Firefox, Safari)
  - Mobile browsers on Android
  - Safari on iOS (PWA installed)

Older browsers are not explicitly supported.

---

## 8) Accessibility & UX Basics

- Text must be readable on mobile and desktop.
- Interactive elements must be usable via touch and mouse.
- No formal accessibility certification (WCAG) is required.

---

## 9) Maintainability

- The system should be:
  - Modular
  - Understandable
  - Easy to extend
- Specs are the authoritative source for behavior.

---

## 10) Out of Scope (Explicit)

This spec does NOT define:
- Deployment pipelines
- Hosting providers
- CI/CD
- Monitoring or logging systems
- Backup strategies

---

## 11) Acceptance Criteria

This spec is implemented when:
- The app is usable on desktop and mobile
- Data persists correctly
- Admin access is protected
- Notifications respect platform constraints
