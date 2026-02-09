# GemschiHub — Requirements

## 1) Overview

**GemschiHub** is a public-facing web application with an admin backend used to manage and present all relevant information about the team **Chnebel Gemscheni**.

The app serves as the **single source of truth** for:
- Events (Trainings, Interclub, Spirit events)
- Team roster and player profiles
- Seasonal statistics and results
- Team culture (“Gemschi Spirit”)

GemschiHub replaces fragmented communication (WhatsApp, memory, spreadsheets) with a structured, transparent, and season-based system.

---

## 2) User Roles & Access

### Roles
- **Public**
  - Includes players, fans, friends
  - No login required
  - Read-only access
- **Admin (Captain)**
  - Authenticated user
  - Full management rights

There are **no other roles**.

### Permissions
- Public users:
  - Can view all content
  - Cannot interact or modify anything
- Captain:
  - Can create, edit, and delete all managed data
  - Is the authoritative source for scores and Spirit values

---

## 3) Core Functional Areas

### 3.1 Events

GemschiHub supports **three event types**:
1. **Trainings**
2. **Interclub matches**
3. **Spirit events**  
   (e.g. *Bierversammlung*, *Teamdynamikförderungsausflug*, *Gemschi-Skisafari-Parade*)

#### General Event Rules
- All events are:
  - Publicly visible
  - Read-only for public users
  - Season-bound
  - Attendance-tracked
- Only the Captain can manage events.

#### Trainings
- Display date, time, and location
- Attendance tracking enabled
- No scoring

#### Interclub Matches
- Represent official matchdays
- Include:
  - Date, time, location
  - Opponent
  - Match status (*Offen / Am Spielen / Gespielt*)
  - Score (when available)
- Attendance is tracked
- Captain can update scores live
- Results feed seasonal statistics

#### Spirit Events
- Represent non-sport / cultural team events
- Attendance is tracked
- No scoring
- Used for transparency and seasonal context

---

### 3.2 Team Roster & Player Profiles

- GemschiHub maintains **one team roster** for **Chnebel Gemscheni**.
- Players exist independently of seasons.
- Seasonal data is linked to players per season.

#### Player Profile (Public)
Each player profile includes:
- Name
- Nickname (Alias)
- Role (Spieler, Captain, CEO of Patchio)
- Gemschigrad
- Klassierung
- Short introduction text
- Profile picture

#### Player Management (Captain)
The Captain can:
- Add new players
- Edit all player attributes
- Remove players
- Assign and edit seasonal Spirit values

---

### 3.3 Interclub Results & Scoring

- Interclub results are entered **per Interclub event**.
- Results are **season-bound**.
- Only the Captain can enter or edit results.

#### Match Structure
- Each Interclub match consists of:
  - **6 Singles**
  - **3 Doubles**
- Each game is best-of-3 sets.
- Total match score has a maximum of **9 points**.

#### Attendance & Participation
- Attendance is tracked separately from participation.
- A player may:
  - Attend but not play
  - Play Singles, Doubles, or both

Results feed:
- Player seasonal statistics
- Team seasonal statistics
- Gemschi Score (via aggregated stats)

---

### 3.4 Seasonality & Statistics

- GemschiHub supports **multiple seasons**.
- Seasons are the primary grouping for:
  - Events
  - Attendance
  - Results
  - Statistics
  - Spirit values
- Data from different seasons is never mixed.

#### Player Statistics (Seasonal)
Derived from:
- Interclub attendance
- Training attendance
- Spirit event attendance
- Interclub match results (Singles & Doubles)
- Spirit value (manual input)

#### Team Statistics (Seasonal)
- Aggregated from Interclub results and player participation.

---

### 3.5 Spirit

- Spirit is:
  - A numeric value
  - Assigned **per player per season**
  - Manually editable by the Captain
- Spirit is:
  - Publicly visible
  - Used in player statistics
- Spirit is **not derived automatically**.

---

### 3.6 Notifications

GemschiHub **must support push notifications** for **all event types**.

#### Notification Triggers
- Upcoming events
- Start of events
- Live updates during Interclub matches  
  (e.g. *“Gemscheni just won a match!”*)

#### Platform Support
- **Android:** Web push supported in modern browsers
- **iOS:** Push supported **only when installed as a PWA (Add to Home Screen)** on **iOS 16.4+**

No user-level notification configuration is required.

---

## 4) Language & Tone

- Language: **German**
- Tone:
  - Reflects **Gemschi Spirit**
  - Informal and team-focused
- UI and structure remain clean and readable.

---

## 5) Non-Goals (Out of Scope)

GemschiHub explicitly does **not** include:
- Payments or memberships
- Chats, comments, or reactions
- External league integrations
- Multi-team or multi-club support
- User-generated content beyond attendance and stats
- Notification preferences or filtering

---

## 6) Success Criteria

GemschiHub is considered successful if:
- Public users can:
  - View events, results, and seasonal stats
  - View player profiles and Gemschi Scores
- The Captain can:
  - Maintain events and live Interclub scores
  - Maintain roster and seasonal Spirit values
- The app replaces informal and error-prone tracking methods.
