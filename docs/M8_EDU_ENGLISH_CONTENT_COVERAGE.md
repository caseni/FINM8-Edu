# M8 EDU English Content Coverage

Turkish remains the canonical launch language. English lesson content is enabled
only when the full learning object is translated and passes the same learner-copy
quality gates:

- lesson title and objective;
- all lesson blocks, including Pro copy when present;
- visual alt text and captions;
- practical task prompt and choices;
- quiz prompts, options, and explanations;
- takeaway and risk disclaimer.

`getEnglishCoverageReport()` reports complete and incomplete lessons so the UI
or editorial review cannot mistake partial localization for completed content.

## Current executable coverage

The current catalog reports complete English coverage for all 147 executable
lessons.

The active Beginner journey is **26 of 26 English-complete**:

- 2 Prelude lessons;
- 6 Money / Economy lessons;
- 7 Market lessons;
- 4 Chart literacy lessons;
- 7 Risk & Decision lessons, including FOMO.

The Beginner quality gate now checks Turkish and English independently for the
same copy budgets:

- objective <= 16 words;
- hook <= 14 words;
- explanation <= 40 words;
- misconception <= 24 words;
- takeaway <= 12 words.

English coverage is therefore not only a field-presence check. A Beginner lesson
must be complete, financially equivalent to the Turkish meaning, and inside the
same stage-appropriate clarity limits before the executable quality gate passes.
