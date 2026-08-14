# FINM8 EDU — Editorial Image System

## Purpose

FINM8 EDU visuals are teaching assets, not decorative backgrounds. Every visual must make the lesson easier to understand before the learner reads the full explanation.

The system supports a hybrid visual language:

- realistic editorial scenes for everyday economics, companies, products and physical market context;
- restrained chart imagery for price structure, trend, volatility, support/resistance and execution concepts;
- premium 2.5D / editorial illustration only when a real scene would be less clear;
- code-drawn diagrams remain a fallback, not the preferred final presentation for a lesson that deserves a bespoke image.

## Visual routing contract

Each lesson visual is resolved with two inputs:

1. `assetRef` — stable lesson/visual identity;
2. `role` — the teaching job of the current slide.

Supported roles:

- `hook`
- `concept`
- `practice`
- `misconception`
- `risk`
- `summary`

Premium Academy images are registered centrally in `AcademyEditorialImageVisual.tsx`.

When an editorial image exists for the current `assetRef + role`, it wins automatically. If no image is registered, the existing lesson-specific story visual remains the fallback.

This means a new image should not require a new rendering branch inside `LessonSupportingVisual.tsx`.

## Naming convention

Store generated Academy images under:

`assets/learning/academy/<school>/`

Use:

`<school>-<topic>-<role>.<jpg|webp>`

Examples:

- `markets-etf-hook.webp`
- `markets-bond-concept.webp`
- `fundamental-cash-flow-hook.jpg`
- `risk-diversification-practice.webp`

Prefer WebP when image quality remains visually equivalent and bundle size is materially smaller.

## Composition standard

Default lesson image ratio: **16:9**.

Mobile requirements:

- one dominant idea;
- no tiny text baked into the image;
- no dense legends;
- no ornamental data;
- no UI controls inside artwork;
- important objects remain readable when the image is displayed at phone width.

The app owns titles, explanations, labels and quiz feedback. The artwork should not repeat the slide copy.

## FINM8 visual language

- dark navy / graphite environment;
- restrained cyan/teal as the primary teaching accent;
- muted coral for negative/down movement when market direction must be shown;
- limited violet only when a second contrasting state is genuinely useful;
- low glare and controlled highlights;
- realistic materials and depth instead of icon-pack aesthetics;
- avoid neon-heavy gaming imagery;
- avoid random financial-office backgrounds;
- avoid generic curves or decorative graphs with no teaching meaning.

Images do not all need to be night scenes. Natural daylight, store lighting, industrial daylight or neutral studio light should be used when it better explains the topic.

## Teaching test

Before an image is accepted, answer one question:

> What should the learner understand from this image before reading the paragraph?

If there is no clear answer, the image should not be used.

Examples:

- inflation → same money, visibly smaller basket of goods;
- higher borrowing cost → same purchase, heavier repayment burden;
- liquidity → crowded active market versus thin empty market;
- trend → successive higher highs and higher lows;
- volatility → narrow calm movement versus wide violent movement;
- profit vs cash → business activity continues while cash available remains limited;
- balance sheet → resources on one side and obligations on the other;
- ETF → one tradable wrapper containing a visible basket of exposures.

## Production workflow

1. Identify the lesson and slide role.
2. Write the one-sentence visual teaching goal.
3. Choose the correct medium: realistic scene, chart, 2.5D editorial illustration or fallback diagram.
4. Generate/select the artwork in the FINM8 palette.
5. Export at 16:9 with no baked-in explanatory paragraph.
6. Save it under the canonical Academy asset path.
7. Register the static image in `AcademyEditorialImageVisual.tsx` for the matching `assetRef + role`.
8. Run Quality, Bundle Runtime Diagnostic and Visual QA.
9. Reject the image if it is beautiful but does not teach the concept.

## Current migration strategy

Do not replace every diagram at once.

Priority order:

1. Academy hook slides that still feel empty or template-like;
2. concepts where a real scene or strong chart teaches materially better than the fallback;
3. practice/misconception slides that benefit from a contrasting second image;
4. summary slides only when a second bespoke image adds learning value.

This keeps bundle growth controlled and avoids creating visual noise simply to increase image count.
