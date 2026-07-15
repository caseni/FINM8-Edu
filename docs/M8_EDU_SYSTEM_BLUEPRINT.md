# M8 EDU System Blueprint

## Product direction

M8 EDU is a comprehensive financial literacy and market learning system, not a
single-topic course catalogue. A BOS lesson is the first vertical validation
slice, not the product boundary.

The system is designed to grow from one Turkish launch path into hundreds of
reviewed micro lessons connected to FINM8 Analyze, News, Portfolio, Algo, and M8
Assistant.

## Learning universe

The long-term curriculum may include:

1. Financial literacy and personal finance
2. Money, inflation, interest, and economics
3. Markets and financial instruments
4. Investing foundations
5. Chart literacy
6. Technical analysis and market structure
7. Risk and capital management
8. Portfolio management
9. Fundamental analysis
10. Crypto and on-chain literacy
11. News and macro-event literacy
12. Trading psychology and behavioral mistakes
13. Probability, statistics, and data literacy
14. Algorithmic trading and backtest literacy
15. AI-assisted analysis and evidence evaluation
16. Reading FINM8 analyses responsibly

## Atomic lessons, comprehensive paths

Each micro lesson teaches one measurable competency in three to six minutes.
Lessons are not isolated fragments. They belong to a lesson series, module,
learning path, concept graph, and skill map.

```text
Concept -> lesson series -> micro lessons -> module -> learning path
        -> competency -> practice evidence -> mastery -> review
```

Concept keys remain stable across the system. The same concept can have
foundation, intermediate, and advanced lessons with separate IDs, objectives,
tasks, and quizzes.

## Presentation mode is not learning stage

Two independent preferences are required:

- `presentationMode`: Normal or Pro; controls wording and information density.
- `learningStage`: Foundation, Intermediate, or Advanced; controls curriculum
  depth and competency expectations.

FINM8 presentation mode may suggest an initial education level but never locks
it. A Pro interface user may need a foundation lesson, while a Normal interface
user may have advanced mastery.

The education stage is selected during Learn onboarding or estimated through a
short placement check. It can be changed later without changing FINM8 analysis
presentation.

## Gamified mastery loop

```text
Learn -> practice -> demonstrate understanding -> XP/mastery
  ^                                             |
  +----------- review and next challenge <-----+
```

XP measures verified learning activity. Mastery measures demonstrated
understanding. A badge requires transparent evidence such as lesson completion,
quiz performance, practical accuracy, review, or a final challenge.

Gamification may include:

- Daily and weekly learning missions
- XP and learner levels
- Skill-map progress
- Graceful learning streaks
- Module and path challenges
- Chart, scenario, and simulation tasks
- Meaningful learning badges
- Personalized review missions

Gamification must never reward trade frequency, profit, leverage, or increased
risk. Badges are learning achievements, not certificates or professional
qualifications. Public leaderboards are outside the first release.

## Contextual FINM8 advantage

FINM8 can connect education to real product contexts without allowing education
to mutate financial truth:

- Analyze can recommend a lesson for a misunderstood observation.
- News can recommend macro-event and volatility literacy.
- Portfolio can recommend concentration, correlation, and diversification.
- Algo can recommend overfitting, drawdown, and backtest quality.
- History can identify repeated learning gaps.
- M8 Assistant can explain approved content and route to a lesson.

These connections use stable concept keys and immutable evidence references.
They do not carry trading instructions and do not write to Analysis or
DetectionHistory.

## Legacy course migration

The existing courses are content inventory, not discarded work. Each course is
audited and decomposed into concepts and competencies. Every unit is marked as:

- Retain
- Rewrite
- Split into micro lessons
- Merge with duplicate material
- Update sources
- Archive

The legacy catalogue UI does not define the future information architecture.

## Phase preservation

### Phase 1 — Foundation

Technical stability, product contract, quality gate, and FINM8 boundary.

### Phase 2 — Learning domain

Concept graph, learning stages, lesson series, content contracts, competencies,
paths, assessments, mastery, XP, challenges, streaks, and badges. No UI redesign.

### Phase 3 — Lesson player

Reusable player for approved content blocks, practical tasks, and optional
FINM8 entry context.

### Phase 4 — Progression engine

Attempts, mastery calculation, review scheduling, XP, challenges, streaks, and
badge awarding. Education-only persistence.

### Phase 5 — Learn experience

Learn home, onboarding, placement, paths, skill map, daily mission, review, and
badge collection using the FINM8 design language.

### Phase 6 — Flagship bridge

Feature-flagged FINM8 Learn route and one read-only contextual entry. Expand only
after safety, analytics, navigation, and rollback validation.

## First release and scale

The first release remains intentionally focused: one placement check, one
Turkish path, 20 to 25 strong micro lessons, practical assessment, mastery, and
three to five meaningful badges.

The contracts are designed for the larger curriculum from the start, so the
MVP validates the engine without limiting the future product.

