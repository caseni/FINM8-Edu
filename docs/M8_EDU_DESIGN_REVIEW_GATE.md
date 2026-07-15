# M8 EDU Design Review Gate

Every design wave is reviewed before it is merged. This gate complements the
visual/motion contract and remains active until product-owner review is
available.

## 1. Product truth

- The interface does not promise behavior that is not implemented.
- Normal/Pro presentation is never described as the learner's education level.
- Learning achievements are not presented as certification or investment
  performance.
- Draft or internal migration tools do not appear in production navigation.

## 2. Beginner clarity

- Each screen has one obvious primary action.
- A new learner can identify the purpose of a card or visual within five
  seconds.
- Plain-language terms appear before abbreviations.
- Locked content explains exactly what unlocks it.
- Wrong answers teach the principle instead of merely marking failure.

## 3. Navigation and state

- The next recommended lesson is reachable in one action.
- Module progress, challenge requirements, and badge requirements use real,
  reachable IDs.
- Back, exit, retry, and completion actions lead to predictable destinations.
- Review mode never writes XP, completion, mastery, streak, or badge state.

## 4. Responsible gamification

- Rewards recognize learning evidence: lesson, task, quiz, review, or module
  completion.
- No reward is tied to trading frequency, profit, leverage, or risk-taking.
- Locked badges communicate a learnable requirement, not artificial urgency.

## 5. Accessibility and language

- Interactive elements expose button roles and disabled/expanded state where
  relevant.
- Color is not the only signal for correct, wrong, active, or locked state.
- Turkish and English modes do not mix interface copy.
- Motion can be replayed, disabled, and understood as a static state.

## 6. Technical release gate

- TypeScript check passes.
- Web export passes.
- GitHub Quality workflow passes on the unchanged PR head.
- The PR is mergeable and limited to FINM8-Edu.
- `AnalyseAgentFinal` is not modified before the approved integration phase.

## Review outcome

Each PR description records:

1. the design goal;
2. issues found during self-review;
3. corrections made before merge;
4. remaining items that require product-owner visual review.
