# FINM8 EDU — Academy Real Editorial Image Rollout

This document tracks the migration from code-rendered Academy visuals to **standalone editorial image assets rendered inside the real lesson slides**.

## What counts as complete

A lesson is not real-image migrated merely because it has a React Native visual component. A real-image integration requires all of the following:

1. A standalone image exists under `assets/learning/academy/...`.
2. The image teaches or clarifies the exact lesson role; it is not a screenshot of the FINM8 interface.
3. `AcademyEditorialImageVisual.tsx` maps the physical asset to the exact Academy lesson slug + role.
4. The interactive lesson renders the image through the shared supporting-visual path.
5. Quality verifies that the asset is not orphaned and that the mapped slug exists in the canonical 120-lesson Academy catalog.
6. Visual QA verifies crop, legibility and balance in the actual mobile/desktop lesson surface.

## Current physical real-image inventory

Eight Academy lessons currently have a physical real editorial hook asset and an active registry mapping.

### Piyasaları Anla

- `borsa-ve-islem-yeri-nedir` → hook → `assets/learning/academy/markets/markets-exchange-hook.jpg`
- `borsa-endeksi-ne-anlatir` → hook → `assets/learning/academy/markets/markets-index-hook.jpg`

### Şirketleri Anla

- `finansal-tablolar-birlikte-ne-anlatir` → hook → `assets/learning/academy/fundamental/fundamental-statements-profit-cash-hook.webp`
- `gelir-tablosu-nasil-okunur` → hook → `assets/learning/academy/fundamental/fundamental-income-sales-costs-hook.webp`
- `bilanco-ne-anlatir` → hook → `assets/learning/academy/fundamental/fundamental-balance-sheet-hook.jpg`
- `nakit-akisi-neden-farklidir` → hook → `assets/learning/academy/fundamental/fundamental-cash-flow-hook.jpg`
- `marjlar-ne-anlatir` → hook → `assets/learning/academy/fundamental/fundamental-profitability-hook.jpg`
- `borc-ve-likidite-nasil-okunur` → hook → `assets/learning/academy/fundamental/fundamental-debt-liquidity-hook.jpg`

Current real-image lesson coverage: **8 / 120 Academy lessons**.

## Immediate migration queue

Continue `Piyasaları Anla` before opening another visual family.

1. `etf-nedir-nasil-calisir`
   - first role: hook
   - visual job: show one ETF unit as access to a real basket of different underlying exposures; avoid a toy icon grid.
   - preferred asset: `assets/learning/academy/markets/markets-etf-hook.webp`

2. `tahvil-fiyati-ve-getirisi`
   - first role: hook
   - visual job: make the lending relationship obvious and visually establish that market price can move even when contractual payments are defined.
   - preferred asset: `assets/learning/academy/markets/markets-bond-hook.webp`

3. `forex-piyasasi-nasil-calisir`
   - first role: hook
   - visual job: show a currency pair as a relative price between two currencies, not as two decorative coins.
   - preferred asset: `assets/learning/academy/markets/markets-forex-hook.webp`

4. `emtia-piyasalari-nasil-calisir`
   - first role: hook
   - visual job: show physically distinct commodity exposures and the idea that supply/demand conditions differ by commodity; avoid a simple gold/oil/wheat icon row.
   - preferred asset: `assets/learning/academy/markets/markets-commodity-hook.webp`

After these four hooks are integrated and visually verified, evaluate whether concept/misconception images add teaching value before adding more roles. Do not automatically produce five images per lesson.

## School rollout order

1. Piyasaları Anla — finish current foundation hook family first.
2. Şirketleri Anla — preserve the six existing physical hooks; extend only where a concept or misconception genuinely benefits from a separate image.
3. Risk ve Portföy — prioritize position sizing, correlation/diversification and drawdown relationships over decorative risk imagery.
4. Grafikleri Derinleştir — use recognizable market structures, restrained candle colors and real chart logic.
5. Ekonomiyi Anla — use editorial economic scenes and simple explanatory mechanisms rather than abstract arrows.
6. Karar Psikolojisi — use believable decision situations rather than glowing brains or generic emotion art.
7. Yöntemler ve Planlar.
8. Sistematik ve Sayısal Yaklaşımlar.
9. İleri Grafik Yaklaşımları.
10. Varlık Türlerini Anla.

## Visual-language constraints

- FINM8 UI remains dark; individual image palettes may vary by subject.
- Avoid excessive neon, generic glow and repeated teal-everywhere compositions.
- Images may be realistic/editorial, restrained illustration, finance-specific diagram or chart depending on the teaching problem.
- Do not bake slide titles, paragraphs, buttons or navigation into the image.
- App copy owns labels and explanations unless a tiny in-image notation is essential to the diagram itself.
- Do not use decorative roads, mountains, rivers, city skylines or unrelated offices to symbolize abstract finance concepts.
- Market charts must preserve believable candle/price relationships.
- Code-rendered Academy visuals remain fallback only until a better physical editorial asset is integrated.

## CI rule

`scripts/editorialImageCoverage.mjs` now enforces Academy physical-asset integrity:

- every physical image under `assets/learning/academy` must be registered to a slide role;
- every Academy registry mapping must point to a real Academy asset;
- every Academy registry slug must exist in the canonical 120-lesson Academy catalog;
- duplicate lesson/role mappings fail Quality.

This prevents the exact failure mode where artwork is created or uploaded but never actually appears in the intended lesson slide.
