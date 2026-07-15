# M8 EDU Resume Contract

## Goal

Leaving a lesson must not force the learner to repeat completed steps or skip
unfinished evidence. M8 EDU stores one checkpoint per unfinished lesson.

## Checkpoint stages

- `lesson`: last viewed slide index;
- `task`: practical evidence task is next;
- `quiz`: lesson quiz is next.

The home mission and module lesson row route to the stored stage. A completed
lesson clears its checkpoint.

## Safety

- Checkpoints never grant XP, mastery, completion, challenge access, or badges.
- A checkpoint is navigation state, not achievement evidence.
- Review mode neither reads a learner checkpoint as its start position nor
  writes a new checkpoint.
- Resetting local progress clears every checkpoint.

## Future compatibility

The standalone persisted store owns checkpoints until FINM8 account sync is
introduced. The checkpoint shape is intentionally small and can later be moved
to a user-scoped sync adapter without changing lesson content.
