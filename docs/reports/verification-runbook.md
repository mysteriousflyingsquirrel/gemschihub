# Verification Runtime Runbook

This runbook provides runtime evidence steps required to mark compliance checks as `Verified`.

## 1) Authz And Firestore Rules Proof

### Goal
Prove that public/non-admin users cannot write protected data and Captain users can.

### Steps
1. Deploy rules: `firebase deploy --only firestore:rules`.
2. Sign in as non-allowlisted user.
3. Attempt write to each protected collection (`seasons`, `events`, `attendance`, `players`, `spirit`, `settings`) from UI/devtools.
4. Confirm writes are rejected by Firestore rules.
5. Sign in as allowlisted Captain user and repeat key admin writes.
6. Confirm writes succeed for Captain.

### Evidence To Capture
- Rule deployment output
- Rejected write errors for non-admin
- Successful write confirmations for Captain

## 2) Notification Platform Matrix

### Goal
Prove platform-specific push behavior and event-trigger coverage.

### Android Browser
1. Open app in supported Android browser.
2. Enable notifications.
3. Trigger:
   - Upcoming reminder
   - Event-start notification
   - Interclub live update
4. Verify reception and payload semantics.

### iOS PWA
1. Install app via “Add to Home Screen”.
2. Open installed app (standalone mode).
3. Enable notifications.
4. Repeat trigger checks above.
5. Verify non-PWA iOS browser path shows guidance and does not falsely claim support.

## 3) Durability And Reload Checks

### Goal
Prove data durability under typical usage and transient failures.

### Steps
1. Create/edit/delete data in each mutable domain.
2. Reload app and verify persisted state consistency.
3. Restart browser and re-check.
4. Simulate temporary network interruption during write.
5. Verify no silent corruption and clear error behavior.

## 4) Completion Criteria For Re-Verification

A finding can be upgraded to `Verified` only when:
- Static code evidence exists, and
- Corresponding runtime proof from this runbook is attached where required.
