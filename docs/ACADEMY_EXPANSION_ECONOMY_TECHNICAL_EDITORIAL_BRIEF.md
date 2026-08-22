# FINM8 EDU — Academy Expansion Editorial Briefs: Economy + Technical

Standalone educational image assets only. Never create a FINM8 UI mockup, dashboard screenshot, IDE/code scene, or generic finance wallpaper inside the asset. Use app copy for long explanations; keep image labels minimal.

## Economy expansion hooks

### `issizlik-verisi-ne-anlatir`
Asset: `assets/learning/academy/economy-expansion/economy-labor-market-hook.*`
Teach: split working-age population into employed, unemployed/actively seeking, and outside labor force. Show why unemployment can fall while participation/employment also changes.

### `maliye-politikasi-nedir`
Asset: `assets/learning/academy/economy-expansion/economy-fiscal-policy-hook.*`
Teach: taxes and government spending flow into household/business demand through separate channels. Do not depict fiscal policy as a generic government-building icon.

### `doviz-kuru-neden-degisir`
Asset: `assets/learning/academy/economy-expansion/economy-exchange-rate-hook.*`
Teach: an exchange rate is a relative price between two currencies influenced by rates, inflation expectations, trade/capital flows, and risk—not one single cause.

### `verimlilik-neden-onemlidir`
Asset: `assets/learning/academy/economy-expansion/economy-productivity-hook.*`
Teach: same labor/time/input producing more output through better process, capital, technology, or skills. Separate productivity growth from simply working longer.

### `ekonomik-veri-nasil-okunur`
Asset: `assets/learning/academy/economy-expansion/economy-indicators-hook.*`
Teach: actual value versus expectation versus previous/revised value, plus trend/context. One headline number should not visually dominate the whole evidence set.

### `reel-ve-nominal-farki`
Asset: `assets/learning/academy/economy-expansion/economy-real-nominal-hook.*`
Teach: nominal growth/value minus the effect of price-level change yields a real purchasing-power/output comparison. Same nominal increase can mean different real outcomes under different inflation.

## Technical expansion hooks

### `rsi-ne-anlatir-ne-anlatmaz`
Asset: `assets/learning/academy/technical-expansion/technical-rsi-hook.*`
Teach: price trend can continue while RSI remains above 70; thresholds summarize recent momentum and do not automatically order a reversal.

### `macd-ne-gosterir`
Asset: `assets/learning/academy/technical-expansion/technical-macd-hook.*`
Teach: two moving-average relationships, signal line, and histogram beneath price. Show lag and frequent crossovers in a range versus cleaner behavior in a trend.

### `coklu-zaman-dilimi-nasil-kullanilir`
Asset: `assets/learning/academy/technical-expansion/technical-multi-timeframe-hook.*`
Teach: the same price series at daily and intraday scales; a lower-timeframe decline can be a pullback inside a higher-timeframe uptrend. Assign distinct roles to each timeframe.

### `formasyonlar-neden-kesin-degildir`
Asset: `assets/learning/academy/technical-expansion/technical-patterns-hook.*`
Teach: the same recognizable pattern branching into continuation, failure, and range outcomes. Pattern recognition is conditional evidence, not deterministic geometry.

### `confluence-nedir`
Asset: `assets/learning/academy/technical-expansion/technical-confluence-hook.*`
Teach: combine genuinely different evidence sources while visually grouping correlated indicators derived from the same price data so they are not double-counted.

### `indikatorlerin-sinirlari`
Asset: `assets/learning/academy/technical-expansion/technical-indicator-limits-hook.*`
Teach: indicators are transformations of historical price/volume inputs with lag, parameter dependence, and regime sensitivity. Multiple indicators can still share the same underlying information.

## Integration rules

- Default to `contain` for explanatory diagrams/charts; use `cover` only where cropping cannot remove teaching information.
- Use realistic market structures for technical topics, but keep examples generic and educational rather than signal-like.
- Add physical asset + exact `slug + hook` registry mapping together.
- Do not mark `integrated` before `editorialImageCoverage.mjs` and `academyExpansionEditorialBatchAudit.mjs` both pass.
