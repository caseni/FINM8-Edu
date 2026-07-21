# M8 Learn — Offline progress and save-confidence contract

M8 Learn is offline-first at this phase: lessons and learning progress are stored on the current device. Cloud account sync is not part of this contract and must not be implied by the interface.

## Local persistence

- Progress writes are serialized so a slower older write cannot overwrite a newer learning state.
- The latest failed payload remains available for an explicit retry.
- A retry repeats the latest local-device write only; it never awards XP, completes a lesson, or re-runs scoring.
- Existing progression idempotency remains the authority for XP, badges, challenges, and completion evidence.
- A storage failure must not reset, replace, or silently clear the in-memory learning state.

## User feedback

- “Saving” and “Saved on this device” are brief, non-blocking mobile notices.
- “Saved” must never be described as cloud sync.
- A save error remains visible and explains that the user should retry before closing the app.
- The retry control must meet the 44 pt mobile touch target and expose button semantics.
- Save feedback uses an accessibility live region and cannot rely on color alone.

## Scope boundary

- Static lesson content remains available without a network request after the app bundle is installed.
- Server sync, account reconciliation, multi-device conflict resolution, and background queues require a future authenticated backend phase.
- No screen may promise automatic cloud synchronization until that backend exists and is independently validated.

## Review gate

Test rapid consecutive progress updates, an older slow write followed by a newer write, a rejected device-storage write, retry success, retry failure, app navigation while saving, and screen-reader announcements. Confirm that the final stored payload is the newest state and that no retry changes XP or learning evidence.
