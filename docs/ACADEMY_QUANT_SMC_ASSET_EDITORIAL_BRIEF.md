# FINM8 EDU — Quant, SMC/ICT and Asset-School Editorial Briefs

All items below are standalone educational assets. Do not generate a FINM8 screen, card layout, IDE view, dashboard mockup, or decorative finance wallpaper inside the asset.

## Systematic / Quantitative foundation hooks

### `olaslikla-dusunmek`
Asset: `assets/learning/academy/algo-quant/quant-probability-hook.*`
Teach: one decision branches into several possible outcomes with different weights. The most likely outcome is not certainty; a low-probability outcome is not impossible.

### `expectancy-nedir`
Asset: `assets/learning/academy/algo-quant/quant-expectancy-hook.*`
Teach: win probability × average win versus loss probability × average loss. Make the combined distribution more important than the next individual trade.

### `win-rate-payoff-dengesi`
Asset: `assets/learning/academy/algo-quant/quant-winrate-payoff-hook.*`
Teach: compare a high-win-rate system with tiny wins / rare large losses against a lower-win-rate system with stronger payoff. Do not imply that one win-rate percentage alone measures quality.

### `backtest-ne-soyler`
Asset: `assets/learning/academy/algo-quant/quant-backtest-hook.*`
Teach: historical data -> predefined rule engine -> simulated trades -> result report, with assumptions visibly separating historical evidence from future certainty.

### `orneklem-ve-out-of-sample`
Asset: `assets/learning/academy/algo-quant/quant-out-of-sample-hook.*`
Teach: split a timeline into research/tuning data and untouched validation data; repeated peeking at the holdout should visibly contaminate independence.

### `backtestte-islem-maliyetleri`
Asset: `assets/learning/academy/algo-quant/quant-transaction-costs-hook.*`
Teach: gross edge minus fees, spread, slippage, and market impact equals implementable net edge; high turnover repeats small costs.

## SMC / ICT foundation hooks

General rule: visuals must separate observable price behavior from methodology labels and must never present institutional intent, manipulation, or future direction as proven facts.

### `smc-ict-dili-neden-metodolojiye-bagli`
Asset: `assets/learning/academy/smc-ict/smc-methodology-hook.*`
Teach: the same observable chart structure can receive different labels under different frameworks. Shared observation should remain visually distinct from the label.

### `liquidity-sweep-nedir`
Asset: `assets/learning/academy/smc-ict/smc-liquidity-sweep-hook.*`
Teach: price trades beyond a clearly defined prior high/low and then returns inside. Show the observed path, not a guaranteed reversal or manipulation story.

### `liquidity-grab-ve-sweep-farki`
Asset: `assets/learning/academy/smc-ict/smc-grab-sweep-hook.*`
Teach: compare a sharp brief breach with a broader excursion around the same reference, while making clear that the distinction only exists if criteria are defined beforehand.

### `inducement-ne-anlatir`
Asset: `assets/learning/academy/smc-ict/smc-inducement-hook.*`
Teach: identify an intermediate structural/liquidity reference before a larger area, while explicitly separating the observable level from any claim that market participants intentionally trapped someone.

### `displacement-nasil-okunur`
Asset: `assets/learning/academy/smc-ict/smc-displacement-hook.*`
Teach: ordinary volatility versus rapid range expansion that also has structural consequence and follow-through. A visually large candle by itself is insufficient.

### `fvg-smc-baglaminda-nasil-okunur`
Asset: `assets/learning/academy/smc-ict/smc-fvg-hook.*`
Teach: a three-candle imbalance area produced during rapid repricing, plus a second path showing that price can continue without returning to fill it.

## Asset Types foundation hooks

### `ayni-grafik-farkli-piyasa`
Asset: `assets/learning/academy/asset-schools/asset-cross-market-hook.*`
Teach: place one similar chart structure above different market-mechanics layers for equity, ETF, FX, commodity, and crypto. The same chart does not imply identical hours, carry, settlement, contract, custody, or counterparty risk.

### `hisselerde-corporate-actions`
Asset: `assets/learning/academy/asset-schools/asset-corporate-actions-hook.*`
Teach: split, dividend, and share issuance affect raw price, adjusted price, and share count differently. Mechanical price change must be separated from economic value change.

### `hisselerde-earnings-gap-riski`
Asset: `assets/learning/academy/asset-schools/asset-earnings-gap-hook.*`
Teach: previous close, planned stop, earnings/event, and next-session gap opening. The stop can trigger without filling at the planned level.

### `etf-nav-ve-tracking-farki`
Asset: `assets/learning/academy/asset-schools/asset-etf-nav-tracking-hook.*`
Teach: benchmark, NAV, and ETF market price are related but not identical; visually show temporary premium/discount and longer-run tracking difference.

### `kaldiracli-ve-ters-etf-gunluk-reset`
Asset: `assets/learning/academy/asset-schools/asset-leveraged-etf-hook.*`
Teach: a two-day path where an index returns to its starting level while a daily-reset leveraged ETF ends elsewhere because percentage returns compound.

### `fx-carry-ve-rollover`
Asset: `assets/learning/academy/asset-schools/asset-fx-carry-hook.*`
Teach: separate spot P&L from overnight carry/rollover and transaction cost. A flat exchange rate does not necessarily mean zero holding result.

## Rendering / integration rules

- Information-dense mechanisms default to `contain`; scene/editorial artwork may use `cover` only when cropping does not remove teaching information.
- Keep critical information away from image edges.
- Prefer 4:3 or 16:9 for Academy hook assets; do not force every image into a square.
- App UI owns long explanations and accessibility text. Image labels should be short and only when they directly clarify the mechanism.
- Every asset must use the exact batch filename prefix and must be registered as the exact `slug + hook` mapping in `AcademyEditorialImageVisual.tsx` before status changes to `integrated`.
- `editorialImageCoverage.mjs` and `academyEditorialBatchAudit.mjs` must both pass.
