# spec-050-statistics.md
## GemschiHub — Statistics & Gemschi Score

## 1) Purpose

This spec defines **what statistics exist** in GemschiHub and **how they are composed conceptually**.

It covers:
- Player statistics (seasonal)
- Team statistics (seasonal)
- Gemschi Score composition

This spec intentionally avoids UI details and exact formulas.

---

## 2) General Rules

- All statistics are:
  - **Season-based**
  - Read-only for public users
- Statistics are recalculated whenever:
  - Interclub results change
  - Attendance changes
  - Spirit values are updated

Only the **Captain** can modify underlying inputs.

---

## 3) Player Statistics (Seasonal)

Each player has a statistics view **per season**.

### Stat Categories (Conceptual)

Player statistics are derived from:

1. **Interclub Attendance**
   - Presence at Interclub events

2. **Training Attendance**
   - Presence at Training events

3. **Spirit Event Attendance**
   - Presence at Spirit events

4. **Interclub Performance**
   - Singles games played / won
   - Doubles games played / won

5. **Spirit Value**
   - Manual numeric value set by the Captain

---

## 4) Gemschi Score

### Definition
The **Gemschi Score** is a composite seasonal score representing:
- Sporting contribution
- Participation
- Team spirit

### Properties
- Calculated per player per season
- Publicly visible
- Derived from weighted player statistics

### Authority
- Inputs come from:
  - Attendance
  - Match results
  - Spirit value
- The Spirit component is **manual and authoritative**

> Exact weighting and formulas are defined in a later spec or configuration.

---

## 5) Team Statistics (Seasonal)

Team-level statistics are aggregated per season from:
- Interclub match results
- Player participation
- Attendance metrics

Examples (non-exhaustive):
- Matches played
- Matches won / lost
- Total Interclub points
- Average Gemschi Score

---

## 6) Update Behavior

- Changing any underlying data:
  - Attendance
  - Match results
  - Spirit values  
  triggers a statistics refresh for the affected season.

There is no requirement for real-time recalculation guarantees.

---

## 7) Public Visibility

Public users can view:
- Player stats per season
- Team stats per season
- Gemschi Score per player per season

Public users cannot:
- Edit or influence stats

---

## 8) Data Consistency Rules

- Stats must not exist without a season context
- Stats must not combine data from different seasons
- Removed players retain historical stats

---

## 9) Out of Scope (Explicit)

This spec does NOT define:
- Exact formulas or weights
- UI charts or visualizations
- Ranking or sorting rules
- Exporting statistics

---

## 10) Acceptance Criteria

This spec is implemented when:
- Seasonal player stats are visible
- Seasonal team stats are visible
- Gemschi Score is shown per player per season
- Stats update when underlying data changes
