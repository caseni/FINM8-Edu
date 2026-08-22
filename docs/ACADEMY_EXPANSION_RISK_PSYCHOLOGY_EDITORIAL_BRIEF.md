# FINM8 EDU — Academy Expansion Editorial Briefs: Risk + Psychology

Standalone educational image assets only. No FINM8 UI mockup, dashboard screenshot, IDE/code scene, generic shield, mountain, road, brain, or emotional-trader poster. Teach the mechanism directly.

## Risk & Portfolio expansion hooks

### `portfoy-risk-faktorleri`
Asset: `assets/learning/academy/risk-portfolio-expansion/risk-factors-hook.*`
Teach: different products connect to shared rate, growth, FX, credit, and volatility factors. Product-label diversity is not automatically factor diversity.

### `yeniden-dengeleme-neden-yapilir`
Asset: `assets/learning/academy/risk-portfolio-expansion/risk-rebalancing-hook.*`
Teach: target weights drift after unequal returns, then move back toward predefined weights through controlled rebalancing. Include tolerance/cost concept rather than implying constant trading.

### `likidite-riski-ne-zaman-buyur`
Asset: `assets/learning/academy/risk-portfolio-expansion/risk-liquidity-hook.*`
Teach: the same position size exits differently in deep versus shallow order books; connect size, spread, depth, and price impact.

### `tail-risk-nedir`
Asset: `assets/learning/academy/risk-portfolio-expansion/risk-tail-hook.*`
Teach: frequent normal outcomes concentrated near the center plus rare high-impact tail outcomes. Rare must not visually equal irrelevant.

### `stres-testi-ne-ise-yarar`
Asset: `assets/learning/academy/risk-portfolio-expansion/risk-stress-test-hook.*`
Teach: a portfolio exposed to a small set of explicit scenarios—rate shock, volatility jump, liquidity withdrawal, FX move—showing which holdings/risk factors transmit the shock.

### `buyuk-kayip-neden-zor-toparlanir`
Asset: `assets/learning/academy/risk-portfolio-expansion/risk-loss-recovery-hook.*`
Teach: value 100 -> 80 (-20%) requires +25% to return to 100; larger loss/recovery asymmetry should be visually obvious without heavy text.

## Market Psychology expansion hooks

### `kazanan-erken-kaybeden-gec`
Asset: `assets/learning/academy/market-psychology-expansion/psychology-disposition-hook.*`
Teach: one profitable position closed early despite intact thesis, one losing position held despite invalidation, beside a neutral thesis/risk-based exit process.

### `kalabalik-hakli-midir`
Asset: `assets/learning/academy/market-psychology-expansion/psychology-herd-hook.*`
Teach: crowd behavior can be one information input but must not replace independent evidence. Avoid cartoon crowds as the entire explanation; show evidence path versus imitation path.

### `batik-maliyet-karari`
Asset: `assets/learning/academy/market-psychology-expansion/psychology-sunk-cost-hook.*`
Teach: past unrecoverable cost is separated from today's forward-looking expected value, risk, and alternatives. Past spend informs learning but does not force continuation.

### `akla-gelen-en-onemli-mi`
Asset: `assets/learning/academy/market-psychology-expansion/psychology-availability-hook.*`
Teach: one vivid recent event receives disproportionate attention compared with a wider base-rate sample. Salience and probability must be distinct.

### `bir-sey-yapmak-zorunda-misin`
Asset: `assets/learning/academy/market-psychology-expansion/psychology-action-bias-hook.*`
Teach: low-quality opportunity set branching into unnecessary trade versus deliberate no-trade decision. Waiting is an active risk decision, not failure.

### `karari-onceden-kurmak`
Asset: `assets/learning/academy/market-psychology-expansion/psychology-precommitment-hook.*`
Teach: calm-state rules—risk limit, invalidation, cooling-off, entry checklist—are set before pressure and then constrain a later emotional decision point.

## Integration rules

- Avoid expressive faces as the sole psychology teaching device; the decision structure must remain understandable without them.
- Risk visuals should expose position/factor mechanics, not decorative protection metaphors.
- Use exact batch filename and exact `slug + hook` mapping.
- `contain` is preferred for mechanism diagrams.
- Status remains `planned` until physical asset + registry mapping + both editorial audits pass.
