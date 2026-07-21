# M8 Learn — Mobile action safety contract

Primary learning actions must be safe under rapid taps, delayed screen transitions, and one-handed use.

## Submission integrity

- A quiz result can be submitted only once per rendered attempt.
- A passed practical task can complete only once per rendered attempt.
- The primary action becomes disabled immediately when final completion begins.
- Visual disabled state and accessibility disabled state must remain aligned.
- Submission guards must not change scoring, answer explanations, passing thresholds, XP idempotency, or retry rules.

## Challenge escape

- Challenge tasks and the final quiz must always expose the same 44 pt exit control as the standard lesson flow.
- Exiting a challenge never awards XP, a badge, or completion evidence.
- Native back gestures may remain disabled where they could bypass flow safeguards, but the visible exit control must remain reachable without scrolling.

## Mobile review gate

Test rapid repeated taps on final task and quiz actions, slow navigation transitions, screen-reader disabled announcements, challenge task exit, challenge quiz exit, and return to the module. Confirm there is no duplicate mastery attempt, XP event, badge award, or navigation action.
