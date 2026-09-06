# FINM8 EDU — Academy Expansion Editorial Briefs: Strategy + Quant

Standalone educational assets only. No FINM8 UI mockup, dashboard screenshot, IDE scene, generic trading wallpaper, or visual implying guaranteed performance.

## Strategy expansion hooks

### `strateji-hipotezi-nedir`
Asset: `assets/learning/academy/strategy-expansion/strategy-hypothesis-hook.*`
Teach: condition -> mechanism -> expected behavior -> evidence that would weaken the hypothesis. A post-hoc story must be visually separated from a falsifiable claim.

### `giris-cikis-invalidation-kurallari`
Asset: `assets/learning/academy/strategy-expansion/strategy-rules-hook.*`
Teach: entry, risk boundary, thesis invalidation, and exit are separate gates answering different questions. Do not collapse them into one signal.

### `strateji-rejime-uyar-mi`
Asset: `assets/learning/academy/strategy-expansion/strategy-regime-fit-hook.*`
Teach: one strategy under trend, range, high-volatility, and low-liquidity contexts; performance/risk behavior changes while regime labels remain uncertain and rule-based.

### `turnover-ve-maliyet`
Asset: `assets/learning/academy/strategy-expansion/strategy-costs-turnover-hook.*`
Teach: equal gross edge with low versus high turnover, then subtract spread/fees/slippage to show different net results.

### `strateji-cesitlendirmesi`
Asset: `assets/learning/academy/strategy-expansion/strategy-diversification-hook.*`
Teach: differently named strategies can share one common trend/momentum/liquidity factor. Contrast name diversity with true return/risk-driver diversity.

### `stratejiyi-ne-zaman-review-etmeli`
Asset: `assets/learning/academy/strategy-expansion/strategy-review-hook.*`
Teach: planned review cadence checks hypothesis, execution drift, costs, and regime behavior. One win/loss should not automatically trigger rule changes.

## Systematic / Quant expansion hooks

### `overfitting-nedir`
Asset: `assets/learning/academy/algo-quant-expansion/quant-overfitting-hook.*`
Teach: simple model follows durable structure while overfit model bends around historical noise; great in-sample fit can deteriorate out-of-sample.

### `look-ahead-bias-nedir`
Asset: `assets/learning/academy/algo-quant-expansion/quant-lookahead-hook.*`
Teach: timeline of information availability where future data leaks backward into a decision time. Signal and fill timing must be realistic.

### `survivorship-bias-nedir`
Asset: `assets/learning/academy/algo-quant-expansion/quant-survivorship-hook.*`
Teach: a historical universe begins with many assets; failures/delistings disappear from a survivor-only sample, making results look artificially strong.

### `data-leakage-nedir`
Asset: `assets/learning/academy/algo-quant-expansion/quant-data-leakage-hook.*`
Teach: strict train/test boundary versus contaminated preprocessing/feature construction that allows evaluation information into training.

### `robustness-nasil-test-edilir`
Asset: `assets/learning/academy/algo-quant-expansion/quant-robustness-hook.*`
Teach: broad stable parameter plateau versus one fragile spike; include nearby parameters, subperiods, and cost assumptions as perturbations.

### `otomasyonun-sinirlari`
Asset: `assets/learning/academy/algo-quant-expansion/quant-automation-limits-hook.*`
Teach: automated rule engine surrounded by data, code, execution, connectivity, and regime failure modes plus monitoring/limits/kill-switch controls. Automation executes errors consistently too.

## Integration rules

- Prefer `contain` for rule-flow, statistical, and validation diagrams.
- Quant visuals must show uncertainty and validation boundaries; never show a smooth equity curve as proof of quality by itself.
- Strategy visuals must make rule architecture visible and avoid buy/sell recommendation framing.
- Use exact batch filename + exact `slug + hook` mapping.
- Status stays `planned` until the physical asset is in repo and all editorial audits pass.
