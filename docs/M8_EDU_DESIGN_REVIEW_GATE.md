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

## 2A. Learning-copy hierarchy

Beginner lesson surfaces have different jobs. They must not all restate the same
sentence.

- The lesson title names the topic or asks one simple question.
- The hook creates curiosity with one short question or everyday situation.
- The explanation answers that question in plain language.
- The infographic demonstrates the mechanism; it does not echo the paragraph.
- The misconception corrects one specific wrong idea.
- The takeaway compresses the lesson into one short memory line.
- Two consecutive surfaces must not repeat the same sentence with slightly
  different wording.
- In currently hard-gated beginner sections (Markets + Money/Economy): objective <= 16 words,
  hook <= 14, explanation <= 40, misconception <= 24, takeaway <= 12.
- Technical terminology appears only after the plain-language meaning is clear.

## 2B. Code-infographic quality

Code-drawn visuals are held to the same teaching standard as generated editorial
images.

- A custom infographic needs a machine-readable teaching brief before it is
  treated as an accepted fallback.
- The visual must encode a relationship: comparison, sequence, cause/effect,
  matching, trade-off, or before/after. A row of generic icons by itself is not
  a teaching mechanism.
- Cards carry short meaning labels when the distinction itself is the lesson.
- The slide owns the explanation; the infographic owns the visual proof.
- Summary visuals must not repeat the takeaway as a second headline or rule.
- Mobile and desktop screenshots are reviewed separately.
- Visual QA screenshots are evidence that the infographic renders correctly,
  but a human design review still checks hierarchy, meaning, polish, and
  whether the visual looks template-like.

Current hard-gate rollout covers the six beginner Markets lessons and the six
Money/Economy lessons. Charts and Risk are added only after their copy and
infographic families are cleaned.

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
