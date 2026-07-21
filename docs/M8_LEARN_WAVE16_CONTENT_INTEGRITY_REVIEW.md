# M8 Learn — Wave 16 content integrity review

Reviewed: 2026-07-21  
Scope: 24 Wave 1 lessons, practical tasks, quizzes, prerequisites, and source metadata.

## Editorial outcome

- Turkish remains the canonical editorial language while content status is `draft`.
- All 24 lessons require a complete English editorial pass. The interface may currently fall back to Turkish when English copy is absent; this is tracked explicitly and must not be mistaken for completed localization.
- Volatility is now taught as movement magnitude rather than as a direction or opportunity label.
- Support and resistance are no longer presented through the absolute claim that they can never be lines. The lesson teaches contextual price references and explains why a zone is often the more realistic representation.
- Crisis correlation language now says correlations can increase, rather than claiming they always converge.
- CHoCH explicitly notes that labels and thresholds vary by methodology.

## Executable integrity gate

Every production build now validates:

- unique lesson, slug, task, quiz, and question identifiers;
- reachable prerequisite concepts;
- unique content-block ordering;
- practical-task evidence that points to real choices;
- quiz answers that point to real options and valid passing scores;
- non-empty, parseable source metadata;
- an explicit list of lessons still missing complete English editorial coverage.

A structural inconsistency throws during catalog initialization and fails the build instead of silently reaching users.

## Sources rechecked

- U.S. SEC Investor.gov — What is Risk?
- U.S. SEC Investor.gov — Types of Orders
- U.S. SEC Investor.gov — Asset Allocation and Diversification
- U.S. SEC Investor.gov — Liquidity / Marketability
- CME Group Education — Technical Analysis materials

## Publication boundary

This review improves terminology and internal consistency; it is not the final publication approval. Content stays `draft` until a finance/editorial reviewer approves the Turkish canonical copy and the English coverage list reaches zero.
