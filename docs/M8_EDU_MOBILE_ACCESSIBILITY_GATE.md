# M8 EDU Mobile Accessibility Gate

## Small-screen behavior

- Lesson, practical task, quiz, challenge, and result content must remain
  vertically scrollable when it exceeds the viewport.
- Cards use full available width with a readable maximum width on larger
  screens.
- Horizontal control rows may wrap instead of shrinking text below a readable
  size or pushing actions off screen.

## Touch and state

- Primary controls target a minimum height of 52 points.
- Compact choices and segmented controls target at least 44 points.
- Selectable controls expose selected state; disabled controls expose disabled
  state.
- Correctness and selection never rely on color alone.

## Large text

- Result screens and assessment players scroll rather than clip when system text
  scaling increases content height.
- Labels may wrap; essential actions remain reachable.
- The learning meaning is preserved without requiring a specific screen width.

## Review requirement

Every visual review includes at least one narrow phone viewport and one large
text pass before production release. Static code checks in this wave reduce
known overflow risks but do not replace the product-owner visual review.
