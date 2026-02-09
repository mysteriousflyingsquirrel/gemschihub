# spec-040-interclub-results.md
## GemschiHub — Interclub Results & Match Scoring

## 1) Purpose

This spec defines how **Interclub match results** are structured, entered, and interpreted in GemschiHub.

It covers:
- Match structure (Singles / Doubles)
- Participation vs attendance
- Score lifecycle
- What data feeds into statistics

This spec does **not** define UI layout or statistical formulas.

---

## 2) Interclub Match Context

- Interclub results exist **only** within:
  - An Interclub event
  - A specific season
- Only the **Captain** may enter or edit Interclub results.

---

## 3) Match Structure

Each Interclub match consists of:
- **6 Singles games**
- **3 Doubles games**

Total games per match: **9**

---

## 4) Game Structure

Each game (Singles or Doubles):
- Is played as **best-of-3 sets**
- A game is won when:
  - A player / pair wins **2 sets**
- Set scores are recorded as:
  - Our score vs opponent score

A game may exist in:
- Not started
- In progress
- Completed

---

## 5) Participation Model

### Attendance vs Participation
- **Attendance**: Player was present at the Interclub event
- **Participation**: Player actively played in Singles and/or Doubles games

Rules:
- A player may attend but not participate
- Only attending players may be assigned to games
- Participation is recorded per game

---

## 6) Score Aggregation

### Game Result
- Each completed game contributes:
  - **1 point** to the winner
- Incomplete games do not contribute points

### Match Result
- Total match score:
  - Our points vs opponent points
  - Maximum score: **9 points**

---

## 7) Match Status Lifecycle

Each Interclub event has a **match status**:

- **Offen**
  - No completed games
- **Am Spielen**
  - At least 1 completed game
  - Fewer than 9 completed games
- **Gespielt**
  - All 9 games completed

Match status is derived from game completion state.

---

## 8) Editing & Corrections

- The Captain may:
  - Enter results incrementally
  - Edit results at any time
- Editing a game result:
  - Updates aggregated scores
  - Updates player participation data
  - Updates derived statistics

There is no audit log requirement at this level.

---

## 9) Public Visibility

Public users can view:
- Match status
- Final score
- List of attending players
- Game-level results (Singles / Doubles)

Public users cannot:
- Edit any result data

---

## 10) Data Integrity Rules

- A game cannot be assigned to a non-attending player
- A Doubles game must have exactly **two players per side**
- A Singles game must have exactly **one player per side**
- Total completed games must not exceed 9

---

## 11) Out of Scope (Explicit)

This spec does NOT define:
- UI for result entry
- Validation of real-world badminton rules
- Tie-break rules within sets
- Statistical calculations (see `spec-060-statistics.md`)

---

## 12) Acceptance Criteria

This spec is implemented when:
- Captain can enter Singles and Doubles results
- Match status updates correctly
- Total score aggregates to max 9 points
- Player participation is correctly recorded
- Public users can view match results and status
