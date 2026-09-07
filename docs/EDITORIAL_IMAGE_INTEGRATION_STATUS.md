# FINM8 EDU — Real Editorial Image Integration Status

This file tracks **real generated image assets rendered inside the interactive lesson UI**.
Code-drawn visual components are temporary fallback only and do not count as completed editorial-image integration.

## Non-negotiable workflow

1. Read the lesson objective, explanation, misconception, practice context and takeaway.
2. Decide what the image should teach. Do not generate an app screen or decorative background.
3. Generate a standalone lesson asset.
4. Store it under `assets/learning/...`.
5. Register the asset by exact lesson + role (`hook`, `concept`, `practice`, `misconception`, `risk`, `summary`).
6. Adjust slide copy only when necessary so it complements the image instead of repeating it.
7. Render the interactive lesson in mobile and desktop Visual QA.
8. Keep the asset only if it is legible, correctly cropped, contextually accurate and visually balanced.

## Visual language

- FINM8 dark UI is the container; the artwork itself does **not** need one identical palette.
- Avoid excessive neon/glow.
- Prefer restrained, premium editorial illustration, realistic objects/scenes, finance-specific diagrams and clear market structures.
- Use `contain` for diagrams/infographics that must not be cropped.
- Use `cover` only for editorial/photo-like scenes where cropping is safe.
- Do not bake the application UI into an image.
- Do not turn every image into the same template.
- Some images should explain information not already written in the slide; some can be primarily visual.
- A role may intentionally remain example-only when an extra image would repeat information or make the lesson heavier.

## Current measurable coverage

The executable rollout plan covers **24/24 beginner lessons**. Current real-asset state after Beginner Economy migration:

- beginner real-image mappings: **55**
- Academy real-image mappings: **8**
- total real-image mappings: **63**
- beginner lessons with at least one real image: **12/24**
- Academy lessons with at least one real image: **8/120**
- active lessons with at least one real image: **20/144**
- beginner planned real-image roles physically integrated: **55/115**

The remaining code-drawn visuals are fallback, not completion evidence.

## Completed real-image integrations

### Beginner — Piyasalar Nasıl Çalışır? — 6/6 lessons

#### `fiyat-piyasada-nasil-olusur`

- hook → `assets/learning/beginner/markets/price-formation-hook.webp`
- concept → `assets/learning/beginner/markets/price-formation-concept.webp`
- practice → `assets/learning/beginner/markets/price-formation-practice.webp`
- misconception → `assets/learning/beginner/markets/price-formation-misconception.webp`
- summary → `assets/learning/beginner/markets/price-formation-summary.webp`

Status: **5/5 planned physical roles integrated.**

#### `piyasa-araclari-ayni-degildir`

- hook → `assets/learning/beginner/markets/asset-classes-hook.webp`
- concept → `assets/learning/beginner/markets/asset-classes-concept.webp`
- practice → intentionally example-only; no physical image
- misconception → `assets/learning/beginner/markets/asset-classes-misconception.webp`
- summary → `assets/learning/beginner/markets/asset-classes-summary.webp`

Status: **4/4 planned physical roles integrated; practice intentionally remains example-only.**

#### `likidite-neden-onemlidir`

- hook → `assets/learning/beginner/markets/liquidity-hook.webp`
- concept → `assets/learning/beginner/markets/liquidity-concept.webp`
- practice → `assets/learning/beginner/markets/liquidity-practice.webp`
- misconception → `assets/learning/beginner/markets/liquidity-misconception.webp`
- summary → `assets/learning/beginner/markets/liquidity-summary.webp`

Status: **5/5 planned physical roles integrated.**

#### `bid-ask-spread-nedir`

- hook → `assets/learning/beginner/markets/bid-ask-hook.webp`
- concept → `assets/learning/beginner/markets/bid-ask-concept.webp`
- practice → `assets/learning/beginner/markets/bid-ask-practice.webp`
- misconception → `assets/learning/beginner/markets/bid-ask-misconception.webp`
- summary → `assets/learning/beginner/markets/bid-ask-summary.webp`

Status: **5/5 planned physical roles integrated.**

#### `piyasa-limit-stop-emirleri`

- hook → `assets/learning/beginner/markets/order-types-hook.webp`
- concept → `assets/learning/beginner/markets/order-types-concept.webp`
- practice → `assets/learning/beginner/markets/order-types-practice.webp`
- misconception → `assets/learning/beginner/markets/order-types-misconception.webp`
- summary → `assets/learning/beginner/markets/order-types-summary.webp`

Status: **5/5 planned physical roles integrated.**

#### `gerceklesme-fiyati-kayma`

- hook → `assets/learning/beginner/markets/slippage-hook.webp`
- concept → `assets/learning/beginner/markets/slippage-concept.webp`
- practice → `assets/learning/beginner/markets/slippage-practice.webp`
- misconception → `assets/learning/beginner/markets/slippage-misconception.webp`
- summary → `assets/learning/beginner/markets/slippage-summary.webp`

Status: **5/5 planned physical roles integrated.**

### Beginner — Para ve Ekonomi — 6/6 lessons

#### `enflasyon-satin-alma-gucu`

- hook → `assets/learning/beginner/economy/inflation-purchasing-power-hook.webp`
- concept → `assets/learning/beginner/economy/inflation-purchasing-power-concept.webp`
- practice → `assets/learning/beginner/economy/inflation-purchasing-power-practice.webp`
- misconception → `assets/learning/beginner/economy/inflation-purchasing-power-misconception.webp`
- summary → `assets/learning/beginner/economy/inflation-purchasing-power-summary.webp`

Status: **5/5 planned physical roles integrated.**

#### `faiz-orani-ne-anlatir`

- hook → `assets/learning/beginner/economy/interest-rate-hook.webp`
- concept → `assets/learning/beginner/economy/interest-rate-concept.webp`
- practice → `assets/learning/beginner/economy/interest-rate-practice.webp`
- misconception → intentionally example-only; no physical image
- summary → `assets/learning/beginner/economy/interest-rate-summary.webp`

Status: **4/4 planned physical roles integrated; misconception intentionally remains example-only.**

#### `merkez-bankasi-ne-yapar`

- hook → `assets/learning/beginner/economy/central-bank-hook.webp`
- concept → `assets/learning/beginner/economy/central-bank-concept.webp`
- practice → intentionally example-only; no physical image
- misconception → `assets/learning/beginner/economy/central-bank-misconception.webp`
- summary → `assets/learning/beginner/economy/central-bank-summary.webp`

Status: **4/4 planned physical roles integrated; practice intentionally remains example-only.**

#### `faiz-karari-ekonomiye-nasil-yansir`

- hook → `assets/learning/beginner/economy/rate-transmission-hook.webp`
- concept → `assets/learning/beginner/economy/rate-transmission-concept.webp`
- practice → `assets/learning/beginner/economy/rate-transmission-practice.webp`
- misconception → intentionally example-only; no physical image
- summary → `assets/learning/beginner/economy/rate-transmission-summary.webp`

Status: **4/4 planned physical roles integrated; misconception intentionally remains example-only.**

#### `gsyh-buyume-ne-anlatir`

- hook → `assets/learning/beginner/economy/gdp-growth-hook.webp`
- concept → `assets/learning/beginner/economy/gdp-growth-concept.webp`
- practice → intentionally example-only; no physical image
- misconception → `assets/learning/beginner/economy/gdp-growth-misconception.webp`
- summary → `assets/learning/beginner/economy/gdp-growth-summary.webp`

Status: **4/4 planned physical roles integrated; practice intentionally remains example-only.**

#### `ekonomik-dongu-resesyon`

- hook → `assets/learning/beginner/economy/business-cycle-hook.webp`
- concept → `assets/learning/beginner/economy/business-cycle-concept.webp`
- practice → `assets/learning/beginner/economy/business-cycle-practice.webp`
- misconception → `assets/learning/beginner/economy/business-cycle-misconception.webp`
- summary → `assets/learning/beginner/economy/business-cycle-summary.webp`

Status: **5/5 planned physical roles integrated.**

These lessons render inside `BeginnerEconomyStoryVisual`, which now checks the shared `BeginnerEditorialImageVisual` registry first and falls back to the pre-existing SVG (web) / hand-drawn native scene only for the four intentionally example-only roles above. The same lesson records are also used by the Academy "Ekonomiyi Anla" track (`ECONOMY_FOUNDATION_LESSONS`), so these five roles per lesson render there too outside the `hook` step, which keeps its separate `AcademyEconomyPremiumHookVisual`.

### Academy — existing generated hook assets

- `borsa-ve-islem-yeri-nedir` → hook
- `borsa-endeksi-ne-anlatir` → hook
- `finansal-tablolar-birlikte-ne-anlatir` → hook
- `gelir-tablosu-nasil-okunur` → hook
- `bilanco-ne-anlatir` → hook
- `nakit-akisi-neden-farklidir` → hook
- `marjlar-ne-anlatir` → hook
- `borc-ve-likidite-nasil-okunur` → hook

Status: **8 Academy real-image mappings active.**

## Next beginner rollout

The canonical role plan for all 24 beginner lessons is in:

`docs/BEGINNER_EDITORIAL_IMAGE_PLAN.json`

With Beginner Markets and Beginner Economy complete, continue in this order:

1. Grafikleri Korkmadan Oku — 6 lessons
2. Riskten Korun — 6 lessons

For every lesson, choose images by teaching role rather than forcing five identical-looking assets.

## Academy after beginner

Continue school by school. Existing real hook assets stay in place; replace code-drawn fallback steps with standalone generated assets only when the new asset teaches the lesson more clearly.

Recommended school order:

1. Piyasaları Anla
2. Şirketleri Anla
3. Grafikleri Derinleştir
4. Risk ve Portföy
5. Ekonomiyi Anla
6. Karar Psikolojisi
7. Yöntemler ve Planlar
8. Sistematik ve Sayısal Yaklaşımlar
9. İleri Grafik Yaklaşımları
10. Varlık Türlerini Anla

## CI protection

`scripts/editorialImageCoverage.mjs` verifies:

- every registered real editorial image points to a physical repository asset,
- no lesson/role pair is registered twice,
- the beginner rollout plan declares exactly 24 lessons,
- rollout lesson slugs are unique,
- roles and statuses use supported values,
- a lesson marked `integrated` cannot be missing a planned real-image role,
- beginner real-image mappings cannot exist outside the declared rollout plan.

The Quality workflow runs this audit on every PR update.

`beginnerResponsiveEditorialQa.mjs` traverses all six Beginner Markets lessons at 360 × 800, 390 × 844 and 1440 × 900. It checks visual sizing, horizontal overflow, 3:2 editorial-image geometry, legacy fallback leakage and the intentionally text-led asset-classes practice role.

`beginnerEconomyResponsiveQa.mjs` traverses all six Beginner Economy lessons at the same three viewports. It checks visual sizing, horizontal overflow and the `economy-<topic>-<role>-board` semantic board for every step, so it validates whichever content that board holds — the new physical editorial images for registered roles, and the text-led example-only fallback for the four intentionally example-only roles.

## Definition of done

A lesson is not considered visually migrated merely because it has a visual component. It is considered editorial-image integrated when the intended standalone image asset is physically present in the repository, mapped to the correct lesson/role, rendered inside the interactive slide and verified in Visual QA.
