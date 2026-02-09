# spec-100-data-storage.md
## GemschiHub — Data Storage & Persistence

## 1) Purpose

This spec defines **where GemschiHub data lives**, how it is persisted, and what the **source of truth** is.

It covers:
- Data ownership
- Persistence guarantees
- Current and future storage expectations

This spec intentionally avoids low-level implementation details.

---

## 2) Source of Truth

- GemschiHub has **one authoritative source of truth** for all mutable data.
- All writes originate from the **Captain (Admin)**.
- Public users never write data.

The system must ensure that:
- Admin-written data persists
- Public users cannot modify data

---

## 3) Data Domains Covered

The following data must be persisted:

- Seasons
- Events (Training, Interclub, Spirit)
- Attendance records
- Interclub match results
- Player roster and profiles
- Player profile pictures (references)
- Seasonal Spirit values
- Derived statistics inputs (not cached stats themselves)

Derived values (e.g. statistics, Gemschi Score) may be recalculated and do not need to be stored permanently.

---

## 4) Current Storage Model

### Initial Implementation
- Data may be stored using:
  - Browser-based storage (e.g. localStorage), OR
  - A backend service (e.g. Firebase)

The chosen storage must:
- Persist data across page reloads
- Persist data across browser restarts
- Preserve data integrity during normal usage

---

## 5) Future Backend Migration

GemschiHub **must be designed to allow migration** from local-only storage to a backend-based storage system.

This implies:
- Clear separation between:
  - Domain logic
  - Storage implementation
- No hard coupling of business logic to localStorage APIs

---

## 6) Data Consistency Rules

- Data must be stored **per season**, not globally.
- No cross-season data mixing is allowed.
- Deleting an entity:
  - Removes all dependent data
  - Except where explicitly forbidden (e.g. historical player stats)

---

## 7) Security Expectations

- Public users:
  - Must never be able to write persistent data
- Admin-only writes must be protected by:
  - Authentication (see `spec-090-authentication.md`)
  - Storage-level access control (where supported)

The storage layer must not trust UI checks alone.

---

## 8) Offline & Failure Behavior

- Offline usage is **not required**.
- If persistence fails:
  - The app may display an error
  - No silent data corruption is allowed
- Partial writes should be avoided.

---

## 9) Backups & Recovery

- No automated backup or restore mechanism is required.
- Manual recovery (e.g. restoring from export or backend snapshot) is acceptable.

---

## 10) Out of Scope (Explicit)

This spec does NOT define:
- Database schemas
- Indexing strategies
- Backup automation
- Data export formats
- GDPR or legal compliance processes

---

## 11) Acceptance Criteria

This spec is implemented when:
- All core data persists across reloads
- Admin changes are durable
- Public users cannot write data
- Storage implementation can be swapped without rewriting domain logic
