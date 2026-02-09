# spec-090-authentication.md
## GemschiHub — Admin Authentication (Captain)

## 1) Purpose

This spec defines how **Admin (Captain) login** works in GemschiHub.

GemschiHub is a public, read-only app for everyone, with a single authenticated Admin:
- **Public users:** no login
- **Captain:** login required to access admin functions

This spec defines authentication behavior and authorization rules, without tying the app to a specific UI layout.

---

## 2) Authentication Model (Option B)

GemschiHub uses **Firebase Authentication** for Admin login.

Supported login methods (initial):
- Email + password

Optional later (not required):
- Google sign-in

---

## 3) Authorization Model (Single Captain Allowlist)

There is **exactly one Admin**: the Captain.

Authorization rule:
- A logged-in user is considered **Admin** only if their email matches the configured **CAPTAIN_EMAIL** allowlist.

If a user is authenticated but not allowlisted:
- They are treated as **Public** (no admin access)

No other roles exist.

---

## 4) Routes & Access

### Public Routes
- All public pages must be accessible without login.

### Admin Routes
- Admin functionality is accessible only if:
  - User is authenticated via Firebase Auth, AND
  - User email matches CAPTAIN_EMAIL

If not authorized:
- Admin pages must not be accessible.
- The app should redirect to a public page or show a “Not authorized” state.

---

## 5) Session Behavior

- Admin session persists according to Firebase auth session persistence behavior.
- On reload:
  - If the Captain is still authenticated, admin access is restored.

Logout:
- Ends the admin session and returns the user to public state.

---

## 6) Security & Data Integrity Expectations

- Admin-only actions (CRUD for seasons, events, attendance, results, players, Spirit) must be protected by:
  - UI gating (hide admin UI)
  - Route protection (deny admin routes)
  - Data write protection (see `spec-100-data-storage.md`)

Public users must not be able to write data.

---

## 7) Error & Edge Handling

- If Firebase is unavailable:
  - Public functionality remains usable
  - Admin login may show an error state
- If authentication fails:
  - Show a clear failure message
  - No admin access is granted

---

## 8) Out of Scope (Explicit)

This spec does NOT define:
- Multi-admin support
- Admin invitation flows
- User registration for public users
- Password reset UX details
- UI design of the login page

---

## 9) Acceptance Criteria

Implemented when:
- Public users can use the app without login
- The Captain can log in via Firebase Auth
- Admin access is granted only when email matches CAPTAIN_EMAIL
- Admin routes and admin writes are blocked for non-admin users
- Logout returns the app to public mode
