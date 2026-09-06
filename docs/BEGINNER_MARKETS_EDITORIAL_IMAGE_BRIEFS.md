# FINM8 EDU — Beginner Markets Real-Image Briefs

These briefs are for **standalone educational assets only**. They are not app-screen prompts, UI mockups or presentation screenshots.

Global rules:

- Artwork must teach the lesson, not merely decorate it.
- FINM8 UI remains dark; artwork palette may vary by concept.
- Avoid excessive neon, glow, cyberpunk lighting and identical palettes across every asset.
- Keep baked-in text minimal. The app owns titles, explanations and warnings.
- Prefer recognizable financial objects and market relationships over abstract arrows.
- Diagrams that must remain fully visible use `contain`; editorial scenes may use `cover` when cropping is safe.
- Do not force an image into a role that is clearer as a short real-world example.

## 1. `piyasa-araclari-ayni-degildir`

### hook → `asset-classes-hook.webp`

Purpose: make the learner instantly feel that four market instruments represent different economic things.

Composition: four clearly distinct subjects in one calm editorial scene — a company ownership/share symbol, a bond/debt certificate relationship, two currencies as a relative pair, and a tangible commodity such as gold/oil. Avoid four identical UI cards. Use different material cues so the categories feel genuinely different.

Suggested palette: restrained mixed palette — muted green for equity, slate/blue for bond, warm amber for FX, earthy gold/copper for commodity. No neon.

### concept → `asset-classes-concept.webp`

Purpose: explain **what is economically being bought** without repeating a paragraph.

Composition: four visual relationships rather than four labels: investor ↔ company ownership; investor → issuer as lending; currency A ⇄ currency B; investor ↔ physical/raw product exposure. Small symbols are acceptable; avoid long text blocks.

### practice

No image. Use the existing short BIST-share-versus-gold example.

### misconception → `asset-classes-misconception.webp`

Purpose: explain that similar-looking price charts do not make two instruments economically identical.

Composition: two visually similar price paths at top, then reveal different underlying objects beneath them (for example a company share versus gold/commodity). The important teaching relationship is **same-looking chart ≠ same product / same risk**.

### summary → `asset-classes-summary.webp`

Purpose: memory anchor.

Composition: quiet four-object arrangement with very little or no baked-in explanatory copy. Recognizable stock/company, bond/debt, FX pair and commodity cues. Simpler than the concept asset.

---

## 2. `likidite-neden-onemlidir`

### hook → `liquidity-hook.webp`

Purpose: show why the displayed price does not automatically mean a learner can sell a meaningful amount there.

Composition: same seller / same amount facing two market situations: one with many willing counterparties and one with very few. The difference should be visible through market participation, not through abstract decoration.

### concept → `liquidity-concept.webp`

Purpose: teach that liquidity is ease of trading near the desired price.

Composition: two simple depth situations. In the liquid side, a sale is absorbed with little price movement; in the thin side, the same sale reaches progressively worse prices. Keep it beginner-friendly; no dense order-book table.

### practice → `liquidity-practice.webp`

Purpose: add information not fully stated in the copy.

Composition: compare a small order and a larger order in the same market to show that liquidity depends on trade size too. This should teach that a market can feel liquid for a small order but not for a large one.

### misconception → `liquidity-misconception.webp`

Purpose: show **high volume ≠ guaranteed liquidity at every moment and size**.

Composition: a busy-volume cue contrasted with a thin current executable side. Avoid text-heavy metrics.

### summary → `liquidity-summary.webp`

Purpose: memory anchor — many counterparties / little impact versus few counterparties / larger impact.

---

## 3. `bid-ask-spread-nedir`

### hook → `bid-ask-hook.webp`

Purpose: visually answer why a position can appear slightly negative immediately after entry.

Composition: buyer and seller standing on opposite sides of a small price gap. Keep actual numbers minimal and readable if used.

### concept → `bid-ask-concept.webp`

Purpose: explain bid, ask and spread without a technical order-book screen.

Composition: buyer willingness on one side, seller willingness on the other, with the distance between them clearly represented as spread.

### practice → `bid-ask-practice.webp`

Purpose: support the existing 99.90 / 100.10 example.

Composition: a clean price relationship where immediate buyer reaches the ask and immediate seller reaches the bid. The visual should make the execution direction obvious.

### misconception → `bid-ask-misconception.webp`

Purpose: show that the last traded price is not automatically the price available to both sides now.

Composition: last-trade marker separated from current buyer/seller quotes.

### summary → `bid-ask-summary.webp`

Purpose: one-glance memory cue: bid | gap | ask.

---

## 4. `piyasa-limit-stop-emirleri`

### hook → `order-types-hook.webp`

Purpose: show that three order types answer three different questions: speed, price boundary, trigger.

Composition: three recognizable action situations, not three identical cards. Market = immediate path, limit = boundary/gate, stop = dormant trigger activated by a level.

### concept → `order-types-concept.webp`

Purpose: explain the trade-off: market prioritizes execution, limit prioritizes price control, stop waits for a trigger before becoming active.

### practice → `order-types-practice.webp`

Purpose: support a simple 100 TL scenario with a visible limit boundary and a separate trigger level.

### misconception → `order-types-misconception.webp`

Purpose: show that a limit order does not guarantee execution and a stop does not guarantee the exact fill price.

### summary → `order-types-summary.webp`

Purpose: compact memory anchor: execute now / price boundary / trigger first.

---

## 5. `gerceklesme-fiyati-kayma`

### hook → `slippage-hook.webp`

Purpose: show that the price seen on screen and the price actually received can differ during movement.

Composition: visible quote at one moment followed by execution at a nearby but different price as the market moves. Avoid speed-line neon effects.

### concept → `slippage-concept.webp`

Purpose: explain slippage as the difference between expected/displayed price and actual execution price, caused by available liquidity and changing prices.

### practice → `slippage-practice.webp`

Purpose: support the existing 100.00 → 100.15 example in a clean, beginner-readable way.

### misconception → `slippage-misconception.webp`

Purpose: show **screen price ≠ execution guarantee**, especially in fast or thin markets.

### summary → `slippage-summary.webp`

Purpose: quiet one-glance relationship: expected price → execution process → actual price.

## Integration rule

A brief is not completion. A role becomes complete only when the generated file:

1. physically exists under the planned `assets/learning/beginner/markets/` filename,
2. is registered by exact lesson + role in `BeginnerEditorialImageVisual.tsx`,
3. renders inside the real interactive lesson,
4. passes Quality + mobile/desktop Visual QA.
