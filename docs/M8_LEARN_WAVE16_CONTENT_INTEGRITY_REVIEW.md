# M8 Learn — Wave 16 content integrity review

Original review: 2026-07-21  
Beginner refresh: 2026-09-10  
Current scope: 26 Beginner lessons, practical tasks, quizzes, prerequisites, source metadata, and bilingual clarity gates.

## Editorial outcome

- Turkish remains the canonical launch language while content status is `draft`.
- The active Beginner path now contains 26 lessons: two Prelude lessons, six Money/Economy, seven Markets, four Chart literacy, and seven Risk & Decision lessons.
- The Prelude establishes investing-versus-short-term-trading context plus goal, time-horizon, and risk-fit thinking before the four main sections.
- A Beginner Index/ETF distinction is added to Markets without replacing the deeper Academy index and ETF lessons.
- FOMO is activated as the final Beginner behavior lesson so the path ends with decision-process risk rather than another technical indicator.
- Momentum and Moving Average are removed from the active Beginner journey and remain available in Academy Technical Analysis.
- All 26 active Beginner lessons have complete Turkish and English learner-facing objects under the executable coverage report.
- Beginner copy budgets are checked independently in Turkish and English: objective <= 16 words, hook <= 14, explanation <= 40, misconception <= 24, takeaway <= 12.
- Volatility is taught as movement magnitude rather than as a direction or opportunity label.
- Support and resistance are presented as contextual reaction areas rather than guaranteed walls or exact predictive prices.
- Risk/reward is separated from probability, and stop trigger level is separated from guaranteed fill price.
- Diversification is framed around different risk sources rather than raw holding count.
- Crisis correlation language says correlations can increase rather than claiming they always converge.
- CHoCH explicitly notes that labels and thresholds vary by methodology in the later Academy material.

## Executable integrity gate

Every production build validates:

- unique lesson, slug, task, quiz, and question identifiers;
- reachable prerequisite concepts;
- unique content-block ordering;
- practical-task evidence that points to real choices;
- quiz answers that point to real options and valid passing scores;
- non-empty, parseable source metadata;
- complete English learning-object coverage;
- the active Beginner journey shape: 2 Prelude + 6/7/4/7 main-section lessons = 26 total;
- Turkish and English Beginner clarity budgets;
- Beginner explanation/takeaway and misconception/takeaway repetition limits;
- machine-readable teaching briefs for active Beginner fallback infographics.

A structural inconsistency throws during catalog initialization or the content-quality audit and fails the build instead of silently reaching users.

## Sources rechecked or retained

- U.S. SEC Investor.gov — Introduction to Investing
- U.S. SEC Investor.gov — Asset Allocation and Diversification
- U.S. SEC Investor.gov — Gauge Your Risk Tolerance
- U.S. SEC Investor.gov — What is Risk?
- U.S. SEC Investor.gov — Types of Orders
- U.S. SEC Investor.gov — Index Funds / Exchange-Traded Funds
- U.S. SEC Investor.gov — Liquidity / Marketability
- CME Group Education — Technical Analysis materials

## Publication boundary

This refresh establishes the executable 26-lesson Beginner curriculum and closes the current structural, bilingual-coverage, and learner-copy quality blockers. It does not by itself approve visual craft quality. Content remains subject to final exact-head CI, independent content review, and the separate human visual-quality gate before publication approval.
