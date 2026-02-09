# spec-010-seasons.md  
## GemschiHub — Seasons

## 1) Purpose

This spec defines how **seasons** work in GemschiHub.

Seasons are the **primary grouping unit** for:
- Events
- Attendance
- Results
- Statistics
- Spirit values

All other specs must follow the rules defined here.

---

## 2) Season Definition

A **season** represents a logical competitive period (e.g. “Interclub Saison 2024/2025”).

A season:
- Has a unique identity
- Contains events and data that must not mix with other seasons
- Is visible to public users

---

## 3) Core Season Rules (Global)

- Every event belongs to **exactly one season**
- Every attendance record belongs to:
  - One player
  - One event
  - One season
- Every statistic is calculated **per season**
- Spirit values are assigned **per player per season**
- Data from different seasons is **never merged or averaged**

---

## 4) Season Lifecycle

### Creation
- Seasons are created by the **Captain**
- A season must exist before events can be assigned to it

### Active Season
- Exactly **one season is active** at any given time
- The active season is:
  - The default selection for public users
  - The default target for new events

### Past Seasons
- Past seasons remain:
  - Fully readable
  - Selectable by public users
- Past seasons are **not deleted** during normal operation

---

## 5) Season Selection (Public)

Public users can:
- View the currently active season
- Switch to past seasons
- View:
  - Events
  - Player stats
  - Team stats
  - Spirit values  
  **for the selected season only**

There is no comparison view between seasons.

---

## 6) Season Assignment Rules

- Events must be explicitly assigned to a season
- Players are **not assigned to seasons** directly
- Player participation and stats are inferred from:
  - Event attendance
  - Match results
  - Spirit values  
  within the selected season

---

## 7) Season Immutability Rules

- Changing the season of an event:
  - Is allowed only by the Captain
  - Reassigns all related attendance and results to the new season
- There is no automatic data duplication between seasons

---

## 8) Error Prevention & Constraints

- An event cannot exist without a season
- Stats must not render if no season is selected
- Spirit values must not exist outside a season context

---

## 9) Out of Scope (Explicit)

This spec does NOT define:
- How seasons are displayed in the UI
- How season switching is implemented technically
- Naming conventions for seasons
- Archiving or exporting seasons

Those belong to later specs.

---

## 10) Acceptance Criteria

This spec is considered implemented when:
- Multiple seasons can exist
- Exactly one season is active
- Public users can switch seasons
- Stats, events, and Spirit values change correctly with season selection
- No data leaks between seasons
