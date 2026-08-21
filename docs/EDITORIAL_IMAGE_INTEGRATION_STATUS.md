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

## Completed real-image integrations

### Beginner — Piyasalar Nasıl Çalışır?

**Fiyat piyasada nasıl oluşur?**

- hook → `price-formation-hook.webp`
- concept → `price-formation-concept.webp`
- practice → `price-formation-practice.webp`
- misconception → `price-formation-misconception.webp`
- summary → `price-formation-summary.webp`

Status: **5/5 roles integrated and rendered in the interactive lesson.**

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

## Sequential rollout queue

### Beginner first

1. `piyasa-araclari-ayni-degildir`
2. `likidite-neden-onemlidir`
3. `bid-ask-spread-nedir`
4. `piyasa-limit-stop-emirleri`
5. `gerceklesme-fiyati-kayma`
6. Para ve Ekonomi — 6 lessons
7. Grafikleri Korkmadan Oku — 6 lessons
8. Riskten Korun — 6 lessons

For every lesson, choose images by teaching role rather than forcing five identical-looking assets.

### Academy after beginner

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

`scripts/editorialImageCoverage.mjs` verifies that every registered real editorial image points to a real repository asset and that a lesson/role pair is not registered twice.

The Quality workflow runs this audit on every PR update.

## Definition of done

A lesson is not considered visually migrated merely because it has a visual component. It is considered editorial-image integrated when the intended standalone image asset is physically present in the repository, mapped to the correct lesson/role, rendered inside the interactive slide and verified in Visual QA.
