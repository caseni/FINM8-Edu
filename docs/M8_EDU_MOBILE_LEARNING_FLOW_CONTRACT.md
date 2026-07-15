# M8 Learn — Mobile learning flow contract

The lesson, practical task, and quiz form one continuous three-stage learning flow.

## Orientation

- Lesson content identifies itself as stage 1/3.
- Practical tasks use a persistent stage 2/3 header.
- Quizzes use a persistent stage 3/3 header.
- Every stage offers a 44 pt exit target without requiring a scroll gesture.
- Stage labels are localized; internal enum values are never shown to learners.

## Slide navigation

- Moving forward or backward resets the next slide to its top.
- The primary action remains in the bottom thumb zone.
- Back and continue actions remain at least 52 pt tall.
- Slide progress and the current slide count stay visible above the content.

## Integrity

- Exit controls do not mark a lesson, task, quiz, review, or challenge complete.
- Flow orientation does not alter checkpoints, scoring, mastery, XP, badges, or prerequisites.
- Review previews return to the Review Center; normal learning exits to the learning home.

## Device review gate

On narrow iOS and Android viewports, verify long slides, visual slides, long answer choices, revealed quiz explanations, keyboard focus, safe areas, and the exit target. Confirm that switching slides never opens the new slide at the previous slide's scroll depth.
