# spec-030-roster-players.md
## GemschiHub — Team Roster & Player Profiles

## 1) Purpose

This spec defines how the **team roster** and **player profiles** work in GemschiHub, including:
- Persistent player identity
- Public player profiles
- Season-linked player data
- Captain-only player management

This spec does not define UI layout or stat calculations.

---

## 2) Team Scope

- GemschiHub manages **exactly one team**:
  - **Team name:** Chnebel Gemscheni
- All players belong to this team.
- There is no multi-team support.

---

## 3) Player Identity (Global)

- A **player** is a persistent entity across all seasons.
- Players are **not created per season**.
- A player may:
  - Participate in zero, one, or multiple seasons
  - Have different stats and Spirit values per season

---

## 4) Player Profile (Public View)

Each player profile must expose the following public information:

### Identity
- Full name
- Nickname / Alias (optional)
- Profile picture

### Role & Classification
- Role:
  - Spieler
  - Captain
  - CEO of Patchio
- Gemschigrad
- Klassierung

### Introduction
- Short free-text introduction

---

## 5) Player Stats (Season-Based)

- Player statistics are always shown **in the context of a selected season**.
- No cross-season aggregation is allowed.

### Stat Inputs (Conceptual)
Player stats are derived from:
- Interclub attendance
- Training attendance
- Spirit event attendance
- Interclub match participation and results
- Spirit value (manual input)

> Exact stat formulas are defined in `spec-060-statistics.md`.

---

## 6) Spirit Value (Per Player, Per Season)

- Spirit is:
  - A numeric value
  - Assigned per player per season
- Spirit is:
  - Manually editable by the Captain
  - Publicly visible
- Spirit has no automated derivation.

---

## 7) Player Management (Captain)

Only the Captain can manage players.

### Captain Capabilities
- Add new players
- Edit existing players
- Remove players from the roster
- Upload / change player profile pictures
- Edit player roles, Gemschigrad, Klassierung, and introduction
- Edit Spirit values per season

### Constraints
- There may be **only one Captain** at any given time.
- Assigning the Captain role to a player removes it from the previous Captain.

---

## 8) Player Removal Rules

- Removing a player:
  - Removes them from the active roster
  - Does **not** delete historical data
- Past season stats and attendance remain visible for historical accuracy.

---

## 9) Permissions

- Public users:
  - Can view roster and player profiles
  - Can view seasonal stats
- Public users cannot:
  - Edit player data
  - Edit Spirit values
  - Upload images

---

## 10) Out of Scope (Explicit)

This spec does NOT define:
- Image storage or file size limits
- UI presentation of player cards or modals
- Exact stat calculations
- Ranking or sorting rules

---

## 11) Acceptance Criteria

This spec is implemented when:
- A public roster is visible
- Each player has a public profile with picture
- Player data persists across seasons
- Seasonal Spirit values can be edited by the Captain
- Historical player data remains visible after removal
