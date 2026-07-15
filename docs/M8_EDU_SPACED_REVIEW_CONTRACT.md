# M8 EDU Spaced Review Contract

## Selection

The review queue contains skills whose `reviewDueAt` is in the past. The weakest
due skill is considered first. Within that skill, M8 EDU selects a completed
lesson for active recall.

## Review behavior

- A review opens the lesson quiz directly; it does not replay every slide.
- Failed reviews update assessment evidence and schedule an earlier next review.
- Passed reviews update mastery and schedule the next interval from the score.
- The first passed review for a lesson may award `review_completed` XP.
- The XP event is idempotent, so repeating the same lesson cannot farm XP.

## Boundaries

- Review never changes lesson completion or module challenge prerequisites.
- Review is based on learning evidence, not market activity or trading results.
- Development Review Center previews remain separate and write no review data.
