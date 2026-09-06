# FINM8 EDU — Academy Expansion Editorial Briefs: Markets + Fundamental

These are standalone educational assets for the real lesson renderer. Never generate a FINM8 UI mockup, dashboard screenshot, IDE/code scene, or decorative market wallpaper inside the asset.

## Markets expansion hooks

### `kripto-piyasasi-nasil-farklidir`
Asset: `assets/learning/academy/markets-expansion/markets-crypto-hook.*`
Teach: one crypto asset across multiple venues with different liquidity/price conditions; separate spot/perpetual product mechanics and custody/venue risk. 24/7 does not mean uniform liquidity.

### `piyasa-seanslari-neden-onemlidir`
Asset: `assets/learning/academy/markets-expansion/markets-sessions-hook.*`
Teach: a time-of-day strip where participation, spread, and depth change through sessions/overlaps. Open market does not mean constant execution quality.

### `islem-hacmi-ne-anlatir`
Asset: `assets/learning/academy/markets-expansion/markets-volume-hook.*`
Teach: high volume can occur with different price direction and different liquidity/depth. Volume = activity, not automatic direction or liquidity quality.

### `market-maker-ne-yapar`
Asset: `assets/learning/academy/markets-expansion/markets-market-maker-hook.*`
Teach: a two-sided order book where a liquidity provider posts bid/ask inventory while managing risk. Do not imply one actor controls market direction.

### `birincil-ve-ikincil-piyasa`
Asset: `assets/learning/academy/markets-expansion/markets-primary-secondary-hook.*`
Teach: issuer -> initial investors/capital raising versus later investor-to-investor trading. Clearly show where money goes in each stage.

### `turev-urun-nedir`
Asset: `assets/learning/academy/markets-expansion/markets-derivatives-hook.*`
Teach: underlying reference branching into futures/options contracts with separate maturity/margin/rights-obligations. Derivative is linked to but not identical to the underlying.

## Fundamental expansion hooks

### `buyume-kalitesi-nasil-okunur`
Asset: `assets/learning/academy/fundamental-expansion/fundamental-growth-quality-hook.*`
Teach: two companies with the same headline growth rate but different drivers: volume/pricing/acquisition plus different margin and cash conversion quality.

### `hisse-basina-metrikler-neden-onemlidir`
Asset: `assets/learning/academy/fundamental-expansion/fundamental-per-share-hook.*`
Teach: the same or growing total earnings divided across changing share counts; make dilution/per-share economics visible.

### `degerleme-carpanlari-nasil-okunur`
Asset: `assets/learning/academy/fundamental-expansion/fundamental-valuation-multiples-hook.*`
Teach: P/E and EV/EBITDA as ratios tied to different financial bases; a lower multiple is not automatically cheaper without growth/risk/quality context.

### `dcf-mantigi-nedir`
Asset: `assets/learning/academy/fundamental-expansion/fundamental-dcf-hook.*`
Teach: future cash flows shrinking back to present value through discounting, plus a visible sensitivity range rather than one certain target price.

### `benzer-sirket-karsilastirmasi-nasil-yapilir`
Asset: `assets/learning/academy/fundamental-expansion/fundamental-peer-comparison-hook.*`
Teach: same-sector companies filtered by business model, growth, margin, debt, geography/capital needs before direct multiple comparison.

### `temel-analizin-sinirlari`
Asset: `assets/learning/academy/fundamental-expansion/fundamental-analysis-limits-hook.*`
Teach: historical statements + uncertain forecasts + assumption-sensitive valuation leading to a value range, not guaranteed future direction. Separate company quality from investment price.

## Integration rules

- Use `contain` when the image carries explanatory structure; use `cover` only when cropping cannot remove teaching information.
- Keep critical information inside safe margins.
- Minimal labels only; lesson UI owns long copy and accessibility text.
- Add the physical asset under the exact planned filename and add the exact `slug + hook` mapping to `AcademyEditorialImageVisual.tsx` in the same branch change.
- Do not mark an item `integrated` until both `editorialImageCoverage.mjs` and `academyExpansionEditorialBatchAudit.mjs` pass.
