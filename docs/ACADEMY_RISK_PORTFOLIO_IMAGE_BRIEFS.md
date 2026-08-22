# Academy — Risk & Portfolio Editorial Image Briefs

These briefs define the first **standalone hook image** for the six Risk & Portfolio foundation lessons. They are teaching assets, not FINM8 interface screenshots.

## Shared rules

- Use believable financial relationships, not generic symbols of danger.
- No mountains, roads, shields, glowing brains, treasure chests or decorative arrows.
- No full mobile app UI inside the artwork.
- Keep embedded text minimal. The lesson UI owns the explanation.
- Dark FINM8-compatible output is preferred, but each lesson may have its own restrained accent palette.
- Use `contain` when the full relationship must remain visible; use `cover` only when cropping is safe.

## 1. `korelasyon-ne-anlatir`

Planned asset: `assets/learning/academy/risk-portfolio/risk-correlation-hook.webp`

**Teaching job:** make it immediately clear that two assets may move together in one period and diverge in another, so correlation is a tendency rather than a permanent law.

Recommended composition:

- one horizontal time structure split into two regimes;
- two distinct price/return paths;
- in the first regime the paths broadly co-move;
- in the second they separate or move differently;
- visually preserve that these are observations, not a causal arrow from one asset to the other.

Avoid: two identical sine waves, static “+1 / -1” textbook-only art, causal arrows.

## 2. `drawdown-nedir`

Planned asset: `assets/learning/academy/risk-portfolio/risk-drawdown-hook.webp`

**Teaching job:** show drawdown as the fall from a previous portfolio peak to a later trough, not simply “the portfolio is down today.”

Recommended composition:

- a clean portfolio-value path rising to a clear peak;
- a later trough below that peak;
- the peak-to-trough distance visually emphasized;
- optionally show recovery beginning after the trough, without turning it into a performance dashboard.

Avoid: red warning triangles, collapsing cliffs, generic loss icons.

## 3. `kaldirac-riski-nasil-buyutur`

Planned asset: `assets/learning/academy/risk-portfolio/risk-leverage-hook.webp`

**Teaching job:** explain why the same underlying market move can create a much larger account impact when exposure is larger than capital.

Recommended composition:

- two accounts with the same capital base;
- account A carries ordinary exposure;
- account B carries visibly larger market exposure;
- the same market move is applied to both;
- the resulting account impact is clearly larger in the leveraged case.

Avoid: a literal mechanical lever lifting money, rockets, casino imagery.

## 4. `yogunlasma-riski-nedir`

Planned asset: `assets/learning/academy/risk-portfolio/risk-concentration-hook.webp`

**Teaching job:** show that many holdings can still depend on one underlying risk source.

Recommended composition:

- one portfolio containing several different company/asset units;
- most units visibly connect to the same sector/factor source;
- beside it, a second arrangement distributes exposure across genuinely different risk sources;
- emphasize dependency structure rather than just holding count.

Avoid: a simple “10 icons versus 3 icons” comparison with no shared-factor logic.

## 5. `risk-butcesi-nedir`

Planned asset: `assets/learning/academy/risk-portfolio/risk-budget-hook.webp`

**Teaching job:** show that equal capital allocation does not necessarily create equal risk contribution.

Recommended composition:

- two assets each receive an equal capital share;
- one asset has visibly larger volatility/risk contribution;
- the total-risk contribution beneath them is unequal;
- keep the relation intuitive without requiring formulas.

Avoid: ordinary household-budget imagery, envelopes of cash, spending categories.

## 6. `portfoy-nasil-kurulur`

Planned asset: `assets/learning/academy/risk-portfolio/risk-portfolio-construction-hook.webp`

**Teaching job:** show that portfolio construction is a system of objectives, constraints, weights and risk relationships—not simply choosing favorite assets.

Recommended composition:

- compact left-to-right or center-out flow;
- objective / horizon / liquidity constraints feed into a set of candidate assets;
- asset weights and risk relationships form the portfolio;
- monitoring/rebalancing appears as a restrained continuation cue;
- the final image should feel like a premium editorial systems diagram, not a software flowchart.

Avoid: decorative pie chart only, random asset logos, “best stocks” imagery.

## Integration rule

When each asset is physically added to the repository:

1. add its static `require(...)` and exact `{ match, role: 'hook', source }` entry to `AcademyEditorialImageVisual.tsx`;
2. use `resizeMode: 'contain'` if the explanatory relationship must remain uncropped;
3. mark the matching batch item `integrated` in `ACADEMY_EDITORIAL_IMAGE_BATCHES.json`;
4. Quality must pass the physical filename + registry + canonical slug checks;
5. inspect the actual lesson screenshot in Visual QA before treating the asset as accepted.
