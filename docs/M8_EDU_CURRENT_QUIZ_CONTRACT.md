# M8 EDU Current Quiz Contract

## Purpose

The current quiz connects approved curriculum concepts with timestamped market
events. It measures whether a learner can apply what they have learned; it does
not predict price, recommend an action, or infer an investment personality.

## Progressive eligibility

1. Completing the first three Market Foundations lessons makes the learner
   eligible for Today's 3 Questions.
2. Completing the Market Mechanics Challenge adds current market-context
   questions.
3. Completing the Chart Detective Challenge adds timestamped mini-chart
   questions.
4. Completing the Risk Guardian Challenge adds volatility, sizing, and
   uncertainty scenarios.
5. Completing the Behavior and Evidence Challenge adds multi-evidence scenarios
   that compare news, charts, data quality, freshness, and risk.

A learner must never lose points for a concept that has not been introduced.
Locked tracks may be shown as future milestones but cannot be included in an
attempt.

## Difficulty and access

- Foundation, intermediate, and advanced difficulty follow the learner's
  selected learning stage and demonstrated evidence.
- Normal and Pro are presentation/access modes, not learner ability labels.
- Core daily questions, explanations, and basic weak-concept guidance remain
  free.
- Pro may add more scenarios, deeper source comparison, and extended summaries,
  but cannot change canonical answers or block essential literacy.

## Evidence from answers

Questions may contribute evidence only to declared dimensions:

- concept application;
- chart interpretation;
- observation versus interpretation separation;
- source and data freshness;
- risk and uncertainty awareness;
- delayed retention.

One answer is not enough to label a learner. Guidance requires repeated evidence
from different questions and dates. The system must not derive income, risk
appetite, investment preference, financial status, or psychological diagnoses
from quiz answers.

### Minimum evidence threshold

A dimension may show a directional learning summary only after all three
conditions are met:

- at least four accepted answers;
- at least three distinct questions;
- evidence from at least two distinct UTC learning days.

For the same question on the same day, only the latest answer counts. Until the
threshold is met, the product says only that evidence is being collected and
does not show an accuracy label, strength, or weak-topic judgment.

After the threshold:

- below 60% produces a short-review recommendation;
- 60–79% is shown as developing;
- 80% or above is shown as consistent.

These are learning-evidence states, not permanent ability or personality labels.
Every summary remains reversible as new evidence arrives.

### Learner benefit

Repeated evidence can power:

- a strong and developing skill map;
- a short explanation for missed concepts;
- one priority micro-review recommendation;
- weekly progress summaries;
- spaced review for concepts that were not retained.

The free experience keeps the basic summary and weak-concept guidance. Pro may
show longer time windows, source comparison, and deeper explanations without
changing the canonical answer or the evidence threshold.

### Today's short review

The home screen may show one priority short-review card only when:

- the learning dimension passes the repeated-evidence threshold and is below
  60%;
- the specific concept independently passes the same four-answer,
  three-question, two-day threshold and is below 60%;
- the learner has already completed a micro-lesson whose canonical concept key
  exactly matches that weak concept.

The card opens that completed micro-lesson. It must not choose a lesson from a
broad dimension alone, recommend an unseen concept, write XP or mastery, or
compete with an already due spaced-review task. When no exact eligible lesson
exists, no current-quiz short-review card is shown.

Opening the lesson is not completion. The learner must reach the final takeaway
and explicitly complete the review. The completion records the exact concept,
lesson, and latest accepted answer timestamp covered by that review; it does not
award XP, update mastery, or alter the spaced-review schedule. Evidence already
covered by a completion cannot immediately recreate the same card. New accepted
evidence after that timestamp may make the recommendation eligible again if the
concept still satisfies the repeated-evidence and below-60% rules.

## Content lifecycle

Every published current question requires:

- source identity and direct evidence references;
- observation/publishing timestamps;
- market and timeframe scope where applicable;
- an expiry or revalidation time;
- curriculum concept keys and prerequisite lesson ids;
- canonical answer and explanation;
- owner/editor approval and content version;
- a non-advisory safety check.

Expired questions are archived and excluded from new attempts. AI may draft
questions from approved evidence, but it cannot publish them autonomously.

## Runtime boundary

The first implementation is preview-only. It computes curriculum readiness and
shows future tracks without retrieving live data, generating questions, awarding
XP, or writing mastery. Provider activation requires a separately reviewed
phase with timestamped sources, validation, expiry, and owner-controlled
publication.
