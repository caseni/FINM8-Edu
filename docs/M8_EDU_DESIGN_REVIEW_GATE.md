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
- Quiz feedback may be short when it is already specific and explanatory; the
  system must not pad a correct explanation by repeating the lesson takeaway or
  misconception just to satisfy a word-count target.

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
- All 26 Beginner lessons — two Prelude lessons plus the four main sections — are
  hard-gated in both Turkish and English: objective <= 16 words, hook <= 14,
  explanation <= 40, misconception <= 24, takeaway <= 12.
- Academy keeps more depth but is also hard-gated across all 10 schools / 120
  lessons: objective <= 16 words, hook <= 20, explanation <= 45,
  misconception <= 16, takeaway <= 15.
- Beginner and Academy explanation/takeaway or misconception/takeaway surfaces
  fail the gate when they repeat too much of the same wording.
- Technical terminology appears only after the plain-language meaning is clear.

## 2B. Code-infographic quality

Code-drawn visuals are held to the same teaching standard as generated editorial
images.

- A custom beginner infographic needs a machine-readable teaching brief before
  it is treated as an accepted fallback.
- The visual must encode a relationship: comparison, sequence, cause/effect,
  matching, trade-off, or before/after. A row of generic icons by itself is not
  a teaching mechanism.
- Cards carry short meaning labels when the distinction itself is the lesson.
- The slide owns the explanation; the infographic owns the visual proof.
- Summary visuals must not repeat the takeaway as a second headline or rule.
- Academy visuals are browser-gated for visible copy density: <= 24 visible
  words on a visual, and <= 18 visible words on the final summary visual.
- On the Academy summary step, visual wording and takeaway wording fail the
  browser gate when token overlap reaches 0.78 or higher. The check runs across
  all 120 Academy lessons at the 390 px mobile reference viewport.
- Mobile and desktop screenshots are reviewed separately.
- Mobile lesson composition must use the available teaching area deliberately;
  concise content should not collapse to the top and leave a large dead zone
  before the navigation controls.
- Generic investment-safety language is shown as compact educational metadata on
  the final step. It must not visually compete with the lesson takeaway or its
  teaching visual.
- Visual QA screenshots are evidence that the infographic renders correctly,
  but a human design review still checks hierarchy, meaning, polish, and
  whether the visual looks template-like.

The hard-gate rollout now covers all 26 Beginner lessons: two Prelude lessons
before the main path, then 24 lessons across Money/Economy, Markets, Charts, and
Risk & Decisions. It also covers all 120 Academy lessons across the ten schools.
New learner-facing copy must stay inside its stage-appropriate clarity budget in
both Turkish and English. Beginner fallback infographics must pass the
teaching-mechanism rules, while Academy visuals must also pass the executable
browser text-density and summary repetition checks.

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
