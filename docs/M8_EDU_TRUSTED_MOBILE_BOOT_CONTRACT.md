# M8 Learn — Trusted mobile boot contract

The app must never render default learning progress as if it were the learner's saved state while local storage is still loading.

## Startup

- Keep the learning navigator behind a calm, branded loading state until language and progress hydration finish.
- Do not mutate XP, badges, mastery, checkpoints, streaks, profile, or prerequisites during startup.
- Do not persist temporary hydration flags with learning evidence.
- Keep startup copy short and localized for the supported learning languages.

## Recovery

- If progress storage cannot be read, do not silently continue with an empty profile.
- Tell the learner that no data was reset.
- Offer one clear, accessible retry action with a disabled state while retrying.
- Language read failure may safely fall back to the packaged default language; it must not erase the stored preference.
- A retry may re-read storage only. It must never call the local progress reset action.

## Mobile review gate

Verify cold launch, warm launch, slow storage, corrupt/unavailable progress storage, repeated retry taps, large text, screen-reader announcement, and offline launch. Confirm that no zero-XP home screen flashes before the saved state appears.
