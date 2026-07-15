# M8 EDU Visual and Motion Contract

## Decision

Visuals are part of the teaching model, not decoration. M8 EDU uses a hybrid
system:

- deterministic code-native diagrams for financial structures and evidence;
- short, optional motion to reveal relationships or sequence;
- static illustration only for conceptual or emotional context;
- real timestamped FINM8 snapshots only after the Phase 6 read-only bridge.

AI-generated imagery must never be presented as a real market chart, source, or
proof.

## Where motion helps

- Candle: reveal open, high, low, and close.
- Timeframes: aggregate the same movement into different scales.
- Trend: reveal the swing sequence instead of highlighting one candle.
- Support/resistance: show reactions across a zone, not a perfect line.
- BOS/CHoCH: animate the observed structural level and confirming move.
- Volatility: compare outcome ranges at the same position size.
- Position sizing: show how exposure changes account impact.
- Diversification: contrast asset count with shared risk factors.

## Rules

1. Normal presentation teaches one idea per visual and shows at most 3–4
   essential labels at once.
2. Plain-language terms appear before abbreviations. Pro presentation may add a
   second layer of detail, but never changes the underlying meaning.
3. Unrelated indicators, overlays, prices, and decorative market noise are not
   added to beginner visuals.
4. Motion reveals one relationship, cause, or sequence; it never exists only to
   decorate the screen.
5. Motion lasts roughly 0.6–2.5 seconds and can be replayed.
6. The lesson remains understandable when motion is disabled.
7. Reduced-motion accessibility is respected.
8. No flashing, autoplay loops, confetti storms, or reward animation tied to
   trading frequency, profit, leverage, or risk-taking.
9. Every visual has Turkish alt text and an English fallback.
10. Diagram colors are not the only carrier of meaning; shape, position, labels,
    or line styles carry the same distinction.
11. Visual examples are schematic and clearly labeled until grounded snapshots
   are available.
12. The visual registry resolves stable `edu://` asset references so lesson
   content does not depend on a specific rendering library.

## Beginner comprehension gate

Every Normal visual must pass a five-second check: a new learner can state the
single idea being taught without reading the full lesson. If not, the visual is
split into smaller steps. Complex concepts such as BOS and CHoCH are introduced
as separate observations before they are compared. Accuracy is never traded for
visual simplicity; omitted detail must be non-essential to the current learning
objective.

## Production path

The first implementation uses React Native views and the built-in animation
system, avoiding a new runtime dependency. Later, complex chart overlays can use
the flagship chart renderer behind the same asset-reference boundary.
