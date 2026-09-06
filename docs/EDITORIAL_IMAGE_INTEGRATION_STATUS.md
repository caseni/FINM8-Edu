# FINM8 EDU — Real Editorial Image Integration Status

This file tracks **real generated image assets rendered inside the interactive lesson UI**.
Code-drawn visual components are temporary fallback only and do not count as completed editorial-image integration.

## Non-negotiable workflow

1. Read the lesson objective, explanation, misconception, practice context and takeaway.
2. Decide what the image should teach. Do not generate an app screen or decorative background.
3. Generate a standalone lesson asset.
4. Store it under `assets/learning/...`.
5. Register the asset by exact lesson + role (`hook`, `concept`, `practice`, `misconception`, `risk`, `summary`).
6. Adjust the slide copy so it complements the image instead of repeating it.
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

The executable rollout plan covers **24/24 beginner lessons**. Current real-asset state:

- beginner real-image mappings: **5**
- Academy real-image mappings: **8**
- total real-image mappings: **13**
- beginner lessons with at least one real image: **1/24**
- Academy lessons with at least one real image: **8/120**
- active lessons with at least one real image: **9/144**
- beginner planned real-image roles physically integrated: **5/115**

The remaining code-drawn visuals are fallback, not completion evidence.

## Completed real-image integrations

### Beginner — Piyasalar Nasıl Çalışır?

**Fiyat piyasada nasıl oluşur?**

- hook → `assets/learning/beginner/markets/price-formation-hook.webp`
- concept → `assets/learning/beginner/markets/price-formation-concept.webp`
- practice → `assets/learning/beginner/markets/price-formation-practice.webp`
- misconception → `assets/learning/beginner/markets/price-formation-misconception.webp`
- summary → `assets/learning/beginner/markets/price-formation-summary.webp`

Status: **5/5 planned real-image roles integrated and rendered in the interactive lesson.**

### Academy — existing generated hook assets

- `borsa-ve-islem-yeri-nedir` → hook
- `borsa-endeksi-ne-anlatir` → hook
- `finansal-tablolar-birlikte-ne-anlatir` → hook
- `gelir-tablosu-nasil-okunur` → hook
- `bilanco-ne-anlatir` → hook
- `nakit-akisi-neden-farklidir` → hook
- `marjlar-ne-anlatir` → hook
- `borc-ve-likidite-nasil-okunur` → hook

Status: **8 Academy real-image mappings already active.**

## Next exact integration — `piyasa-araclari-ayni-degildir`

This lesson deliberately uses **four image roles, not five**.

### hook

Expected asset:

`assets/learning/beginner/markets/asset-classes-hook.webp`

Teaching job: distinguish stock, bond, FX and commodity at a glance without turning the image into a text-heavy table.

### concept

Expected asset:

`assets/learning/beginner/markets/asset-classes-concept.webp`

Teaching job: show what the learner is economically buying:

- stock → ownership in a company
- bond → lending to an issuer
- FX → relative value between two currencies
- commodity → exposure to a physical/raw product

The slide copy should stay shorter than the image explanation rather than repeat every visual detail.

### practice — example only

No real image is required for this role.

Existing practical example:

> Buying a BIST share means company ownership; buying gold is exposure to another asset type, not company ownership.

This is intentionally kept as a short real-world example so the lesson does not become an icon grid on every step.

### misconception

Expected asset:

`assets/learning/beginner/markets/asset-classes-misconception.webp`

Teaching job: visually demonstrate **similar-looking charts ≠ same instrument / same risk**.

### summary

Expected asset:

`assets/learning/beginner/markets/asset-classes-summary.webp`

Teaching job: a calm four-part memory visual with almost no explanatory text baked into the artwork.

The lesson stays `planned` until all four files physically exist, are registered in `BeginnerEditorialImageVisual.tsx`, render in the interactive lesson and pass Visual QA. Do not add static `require()` entries before the files exist.

## Remaining Piyasalar queue

After asset classes:

1. `likidite-neden-onemlidir` — hook / concept / practice / misconception / summary
2. `bid-ask-spread-nedir` — hook / concept / practice / misconception / summary
3. `piyasa-limit-stop-emirleri` — hook / concept / practice / misconception / summary
4. `gerceklesme-fiyati-kayma` — hook / concept / practice / misconception / summary

Each asset is produced as a standalone teaching image, added to the repository, then registered to the exact lesson role. No UI screenshot/mockup is an accepted lesson asset.

## Remaining beginner rollout

The canonical role plan for all 24 beginner lessons is in:

`docs/BEGINNER_EDITORIAL_IMAGE_PLAN.json`

After Piyasalar:

1. Para ve Ekonomi — 6 lessons
2. Grafikleri Korkmadan Oku — 6 lessons
3. Riskten Korun — 6 lessons

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

`scripts/editorialImageCoverage.mjs` now verifies:

- every registered real editorial image points to a physical repository asset,
- no lesson/role pair is registered twice,
- the beginner rollout plan declares exactly 24 lessons,
- rollout lesson slugs are unique,
- roles and statuses use supported values,
- a lesson marked `integrated` cannot be missing a planned real-image role,
- beginner real-image mappings cannot exist outside the declared rollout plan.

The Quality workflow runs this audit on every PR update.

## Definition of done

A lesson is not considered visually migrated merely because it has a visual component. It is considered editorial-image integrated when the intended standalone image asset is physically present in the repository, mapped to the correct lesson/role, rendered inside the interactive slide and verified in Visual QA.
