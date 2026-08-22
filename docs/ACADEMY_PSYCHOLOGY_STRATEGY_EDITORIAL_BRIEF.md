# FINM8 EDU — Academy Editorial Image Briefs

## Market Psychology foundation hooks

General rules:
- Standalone educational asset only; never render a FINM8 UI mockup inside the image.
- No generic worried trader, brain, lightning, maze, mountain, shield, or motivational metaphor.
- Teach the decision error through observable choices, references, probabilities, sequences, or rule changes.
- Minimal labels; app copy remains the primary explanation.
- Restrained but varied palettes; no neon/cyberpunk treatment.

### `kayip-korkusu-karari-nasil-bozar`
Asset: `assets/learning/academy/market-psychology/psychology-loss-aversion-hook.*`
Teach: equal-sized gain and loss can carry unequal decision weight; show the loss side pulling a predefined rule away from neutral process. Avoid sad/happy faces as the main explanation.

### `ilk-fiyata-capalanmak`
Asset: `assets/learning/academy/market-psychology/psychology-anchoring-hook.*`
Teach: old reference 100 and current price 80 are not themselves evidence of value; visually separate the old anchor from current evidence.

### `son-olay-her-sey-midir`
Asset: `assets/learning/academy/market-psychology/psychology-recency-hook.*`
Teach: a few recent observations dominate attention while a longer sample still exists; recent data is important but not automatically representative.

### `asiri-guven-nasil-fark-edilir`
Asset: `assets/learning/academy/market-psychology/psychology-overconfidence-hook.*`
Teach: confidence rises after a short winning streak while the objective risk rule should stay unchanged. Do not depict confidence as a superhero metaphor.

### `revenge-trading-nedir`
Asset: `assets/learning/academy/market-psychology/psychology-revenge-trading-hook.*`
Teach: loss -> urgency to recover -> larger/faster re-entry -> rising risk versus a separate pause/reset path. The loop itself is the lesson.

### `iyi-sonuc-iyi-karar-midir`
Asset: `assets/learning/academy/market-psychology/psychology-outcome-bias-hook.*`
Teach: four combinations of process quality and outcome quality; a good outcome can come from poor process and a bad outcome can come from good process.

## Strategy foundation hooks

General rules:
- Show decision architecture, not decorative charts.
- Real market structures may be used where the concept depends on price behavior.
- Strategy images should explain what is measured, what rule changes, and what trade-off exists.
- Do not imply certainty, guaranteed return, or a universal best strategy.

### `strateji-amaci-ve-zaman-ufku`
Asset: `assets/learning/academy/strategy/strategy-horizon-objective-hook.*`
Teach: short, medium, and long horizons map to different evidence, decision cadence, invalidation, and risk limits. Same chart does not imply same decision framework.

### `trend-following-nasil-dusunur`
Asset: `assets/learning/academy/strategy/strategy-trend-following-hook.*`
Teach: participation in an established directional move versus repeated small whipsaws in a choppy range; no need to predict exact tops/bottoms.

### `mean-reversion-ne-varsayar`
Asset: `assets/learning/academy/strategy/strategy-mean-reversion-hook.*`
Teach: one deviation returns toward a valid reference while another continues away after a regime change; distance from an average is not a guarantee of reversion.

### `breakout-stratejisi-ne-yapar`
Asset: `assets/learning/academy/strategy/strategy-breakout-hook.*`
Teach: transform a breakout event into a rule flow: confirmation -> entry -> invalidation -> bounded risk. The visual must distinguish event from strategy.

### `momentum-stratejisi-ne-yapar`
Asset: `assets/learning/academy/strategy/strategy-momentum-hook.*`
Teach: performance persistence measured through a defined lookback/universe, then filtered by rebalance and risk rules; not blind price chasing.

### `swing-ve-position-farki`
Asset: `assets/learning/academy/strategy/strategy-swing-position-hook.*`
Teach: swing and position differ by horizon, evidence frequency, tolerated fluctuation, invalidation, and risk architecture—not simply number of days held.

## Integration contract

For every asset above:
1. Generate/export the standalone image file only.
2. Add it under the exact planned path/prefix.
3. Add an exact `slug + hook` entry to `AcademyEditorialImageVisual.tsx`.
4. Choose `contain` for information-dense explanatory diagrams; use `cover` only for scene/editorial artwork that tolerates cropping.
5. Keep lesson copy shorter when the image already explains the mechanism.
6. Quality must pass `editorialImageCoverage.mjs` and `academyEditorialBatchAudit.mjs` before the item can move from `planned` to `integrated`.
