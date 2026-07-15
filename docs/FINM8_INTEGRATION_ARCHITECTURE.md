# FINM8 Integration Architecture

## Decision

M8 EDU will appear inside the FINM8 product in two complementary ways:

1. A dedicated **Learn** module for structured paths, progress, review, and badges.
2. Contextual **Learn this** entry points inside Analyze and later News, Portfolio, Algo, and M8 Assistant.

A separate education-only application or WebView is not the production target.

## Current FINM8 shell

The flagship application already owns the shared product shell:

- Root authentication and app providers
- Theme and design tokens
- Turkish and English-first localization
- Normal and Pro presentation modes
- React Query and persisted stores
- Top-level Analyze, History, Scanner, and Settings navigation

M8 EDU must adapt to this shell. It must not bring a second navigation container, theme provider, language store, authentication system, or API client into the flagship application.

## Repository boundary

During the current M8 EDU phases:

- `FINM8-Edu` remains the isolated incubation repository for the learning domain, content model, lesson player, quiz engine, mastery rules, and badges.
- `AnalyseAgentFinal` remains focused on the flagship analysis MVP and its active evidence/history roadmap.
- No education code is copied into the 6,000+ line Analyze screen during the incubation phases.
- No education change may mutate analysis truth, DetectionHistory, outcome records, scoring, or provider behavior.

Before production integration, the reusable education domain will move behind a stable internal module boundary such as `src/modules/education` or a private shared package. The legacy standalone app shell will not be embedded.

## Target FINM8 navigation

The final product must not add every future capability as an equal permanent tab.

Recommended responsive shell:

### Primary product surfaces

- Analyze
- Scanner / Radar
- Learn
- Portfolio
- More

### More

- News
- Algo
- History
- Settings

### Persistent assistant

M8 Assistant is a contextual copilot surface, drawer, or floating action. It is not only a settings page and should not compete with every product module as a permanent tab.

Desktop may expose more items in the top navigation when space allows. Mobile should preserve a maximum of five primary destinations.

The first education integration only adds a feature-flagged `Learn` route. It does not redesign the entire flagship navigation.

## Learning surfaces

### Dedicated Learn module

The Learn home owns:

- Today's short lesson
- Continue learning
- Skill map
- Review due
- Learning paths
- Badges
- Learning generated from recent FINM8 contexts

### Contextual learning

FINM8 surfaces can recommend a lesson without embedding lesson logic.

Examples:

- BOS or CHoCH observation -> market structure lesson
- FVG or order block observation -> imbalance or reaction-zone lesson
- High volatility or fragile risk -> volatility and position-risk lesson
- Mixed timeframes -> multi-timeframe alignment lesson
- Stale or partial data -> evidence quality and freshness lesson
- News event risk -> macro-event and volatility lesson
- Portfolio concentration -> diversification lesson
- Algo backtest result -> overfitting and drawdown lesson

## Integration contract

Flagship modules communicate with M8 EDU through a small, read-only context contract.

```ts
export type Finm8SourceModule =
  | 'analyze'
  | 'scanner'
  | 'history'
  | 'news'
  | 'portfolio'
  | 'algo'
  | 'assistant';

export type LearningConceptKey =
  | 'market.structure.bos'
  | 'market.structure.choch'
  | 'market.structure.support_resistance'
  | 'market.structure.fvg'
  | 'market.structure.order_block'
  | 'market.structure.liquidity'
  | 'market.timeframe.alignment'
  | 'risk.volatility'
  | 'risk.position_sizing'
  | 'risk.risk_reward'
  | 'evidence.freshness'
  | 'evidence.data_quality'
  | 'fundamental.basics'
  | 'onchain.basics'
  | 'behavior.fomo'
  | 'behavior.overtrading';

export interface LearningEntryContext {
  conceptKey: LearningConceptKey;
  sourceModule: Finm8SourceModule;
  audienceMode: 'normal' | 'pro';
  language: 'tr' | 'en';
  symbol?: string;
  market?: string;
  timeframe?: string;
  analysisId?: string;
  snapshotVersion?: string;
  evidenceRefs?: string[];
  observedAt?: string;
}
```

The contract carries references and context, not trading instructions or mutable analysis objects.

## Concept mapping

A dedicated pure bridge maps canonical FINM8 evidence to learning concepts:

```text
Canonical analysis snapshot
        |
        v
AnalysisLearningBridge
        |
        +--> concept keys
        +--> lesson recommendations
        +--> contextual entry payload
```

Rules:

- Mapping is deterministic and testable.
- Mapping never changes the analysis result.
- Mapping does not write to DetectionHistory.
- Missing or uncertain evidence must fail closed and avoid an overconfident recommendation.
- Lesson text must not be generated from raw alert strings.
- Concept keys remain stable even when UI copy changes.

The existing chart overlay help surface is the safest first contextual entry point. Its Normal and Pro explanations can later link to approved micro lessons through concept keys.

## Normal and Pro behavior

Normal and Pro use the same canonical lesson and concept identity.

Normal mode changes:

- Plain-language title and explanation
- Fewer technical details
- More visual guidance
- One practical takeaway

Pro mode changes:

- Technical terminology
- Evidence and invalidation detail
- Multi-timeframe nuance
- Advanced practical task

Progress must not split into separate Normal and Pro courses.

## Data ownership

### FINM8 core owns

- User identity
- Analysis and evidence snapshots
- History and outcomes
- Market context
- Subscription entitlement
- Shared language and presentation preference

### M8 EDU owns

- Learning paths
- Micro lessons and content versions
- Questions and practical tasks
- Attempts
- Concept mastery
- Review schedule
- Badges
- Education safety metadata

Education may reference FINM8 evidence by immutable identifiers. It must not duplicate the core truth as editable education data.

## Free and paid behavior

Core literacy remains free:

- Structured micro lessons
- Core quizzes
- Basic skill map and progress
- Badges
- Basic contextual explanations

Pro or Advisor may add:

- Personalized plans
- History-based review
- Advanced chart tasks
- Deeper outcome scenarios
- Extended grounded tutoring

A paid entitlement changes depth and personalization, not the truth of the underlying explanation.

## Phase preservation

The existing M8 EDU phases remain intact.

### Phase 1 — Foundation

Completed:

- Build stabilization
- Product contract
- Quality gate
- Integration architecture

### Phase 2 — Learning domain

Add:

- LearningPath
- Module
- MicroLesson
- ContentBlock
- Quiz and Question
- PracticalTask
- Skill and Mastery
- Badge
- ContentVersion and Source
- LearningEntryContext and concept taxonomy

This phase remains inside `FINM8-Edu`.

### Phase 3 — Lesson player

The player accepts an optional `LearningEntryContext` but also works standalone. It uses a theme adapter so it can later render with FINM8 tokens.

### Phase 4 — Quiz, mastery, progress, badges

Education progress remains isolated from Analysis and DetectionHistory. Local mock persistence is acceptable until the internal education API is introduced.

### Phase 5 — Learn home

Build the dedicated Learn surface. Use FINM8 information architecture and design tokens; do not preserve the legacy course catalogue UI.

### Phase 6 — Flagship bridge

Only after the education engine is stable:

- Add a feature-flagged Learn route to the flagship shell
- Add the pure AnalysisLearningBridge
- Link one approved concept from the overlay help surface
- Validate navigation, context, safety, analytics, and rollback
- Expand to more analysis concepts incrementally

## First vertical integration slice

The safest initial slice is:

1. Concept: `market.structure.bos`
2. Source: chart overlay help
3. Entry: “Learn BOS in 3 minutes”
4. Destination: one approved micro lesson
5. Assessment: three questions and one chart-identification task
6. Progress: education store only
7. Flag: off by default in the flagship app

No live analysis logic, score, provider, history, or outcome behavior changes in this slice.

## Future module compatibility

The same pattern applies to future modules:

```text
Analyze   -> concept/evidence context -> Learn
News      -> event/context concept    -> Learn
Portfolio -> risk/exposure concept    -> Learn
Algo      -> strategy/outcome concept -> Learn
Assistant -> grounded explanation     -> Learn
```

This keeps FINM8 as one coherent intelligence and learning platform rather than a collection of disconnected applications.
