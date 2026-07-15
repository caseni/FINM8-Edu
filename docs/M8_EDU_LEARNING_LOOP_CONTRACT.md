# M8 EDU Learning Loop Contract

## Completion truth

A micro-lesson is complete only after the learner:

1. reaches the end of the lesson slides;
2. passes the practical evidence task;
3. passes the lesson quiz.

Viewing slides alone is not completion. Starting an assessment does not unlock a
module challenge. `completedLessonIds` therefore represents a completed learning
loop, not content exposure.

## Progression

- A module challenge unlocks only when every prerequisite lesson has completed
  its learning loop.
- Failed tasks and quizzes can be retried without losing progress or receiving a
  penalty.
- XP events remain idempotent; retrying completed evidence cannot farm XP.
- Badges are evaluated only after the evidence required by their definition is
  stored.

## Feedback

- Correct and incorrect states use text and symbols as well as color.
- Every quiz answer reveals an explanation before the next question.
- Failure language invites review and retry; it does not create shame or urgency.

## Review isolation

Development review routes may preview slides, tasks, quizzes, and challenges,
but never write completion, XP, mastery, streak, or badge state.
