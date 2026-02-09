# GemschiHub — Product Requirements Document (PRD)

## 1) Product Overview

**Product name:** GemschiHub  
**Team managed:** Chnebel Gemscheni  
**Product type:** Public web application with admin backend

GemschiHub is a centralized platform to manage and present all relevant information about the team *Chnebel Gemscheni*.  
It replaces fragmented communication and manual tracking with a structured, season-based system.

---

## 2) Problem Statement

Currently, team information is scattered across:
- WhatsApp chats
- Memory / informal knowledge
- Spreadsheets or ad-hoc notes

This leads to:
- Missing or inconsistent information
- No historical transparency
- No clear seasonal overview
- High cognitive load for the Captain

---

## 3) Goals & Objectives

### Primary Goals
- Provide a **single source of truth** for the team
- Make events, results, and stats **publicly visible and transparent**
- Reduce administrative overhead for the Captain
- Preserve **team culture (“Gemschi Spirit”)** digitally

### Non-Goals
- Monetization
- Community interaction (chat, comments)
- Multi-team support
- External league system integration

---

## 4) Target Users

### Public Users
- Players
- Fans
- Friends of the team

Characteristics:
- No login
- Read-only access
- Consume information passively

### Admin User
- **Captain**
- Single authoritative user
- Manages all mutable data

---

## 5) Core Features (MVP)

### 5.1 Events
- Event types:
  - Trainings
  - Interclub matches
  - Spirit events
- All events:
  - Are season-bound
  - Track attendance
  - Are publicly visible
- Interclub events:
  - Support live score updates
  - Drive player and team statistics

---

### 5.2 Team Roster & Player Profiles
- Persistent roster for Chnebel Gemscheni
- Public player profiles include:
  - Name, nickname, role
  - Gemschigrad, Klassierung
  - Profile picture
  - Short introduction
- Seasonal stats shown per player

---

### 5.3 Statistics & Gemschi Score
- All statistics are **season-based**
- Player stats derived from:
  - Interclub attendance
  - Training attendance
  - Spirit event attendance
  - Interclub match results
  - Manual Spirit value
- **Gemschi Score**:
  - Composite seasonal score per player
  - Publicly visible
  - Spirit component is manually controlled by the Captain

---

### 5.4 Seasons
- Multiple seasons supported
- Exactly one active season at a time
- Public users can switch seasons
- No cross-season data mixing

---

### 5.5 Notifications
- Push notifications supported for:
  - All event types
  - Event start reminders
  - Live Interclub updates
- Platform support:
  - Android browsers
  - iOS via PWA (Add to Home Screen, iOS 16.4+)

---

## 6) User Experience Principles

- Language: **German**
- Tone:
  - Informal
  - Team-oriented
  - Reflects “Gemschi Spirit”
- Structure:
  - Clean
  - Predictable
  - Low cognitive load

---

## 7) Success Metrics

GemschiHub is successful if:

### Qualitative
- Captain no longer needs external tools to track events and results
- Team members and fans trust GemschiHub as the authoritative source

### Functional
- All events and results are seasonally consistent
- Stats update correctly when data changes
- Notifications are delivered on supported platforms

---

## 8) Constraints & Assumptions

- Single team only
- Single admin only
- Best-effort availability
- No real-time guarantees
- No offline-first requirement

---

## 9) Release Scope

### MVP (Initial Release)
- Seasons
- Events (Training, Interclub, Spirit)
- Attendance tracking
- Interclub scoring
- Player roster & profiles
- Seasonal statistics & Gemschi Score
- Push notifications

### Post-MVP (Explicitly Not Planned Yet)
- Multi-team support
- Monetization
- User accounts
- Community features

---

## 10) Dependencies

- Modern browser support
- PWA installation for iOS push notifications
- Admin discipline for correct data entry

---

## 11) Open Questions

- None at this stage  
(All scope decisions are locked via Requirements & Specs)

---

## 12) Status

- **Requirements:** Approved
- **Specs:** Complete
- **PRD:** Approved and aligned

GemschiHub is ready for implementation.
