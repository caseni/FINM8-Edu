# M8 Learn — Mobile-first home contract

The learning home is designed first for a narrow phone viewport. Desktop remains supported, but it must not determine information priority.

## Required hierarchy

1. The active daily mission is the first primary learning action after the header and any required onboarding step.
2. Only one primary call to action competes for attention in the first viewport.
3. Progress statistics, skill state, preferences, paths, and badge collection remain secondary.
4. A due spaced-review task stays visible, but does not displace the current mission.

## Preferences

- Learning stage, goals, and Normal/Pro presentation live in one compact disclosure card.
- The collapsed state always exposes the current stage, primary goal, and presentation mode.
- Normal/Pro is explicitly described as presentation density, not learning level.
- Profile editing remains reachable from the expanded card.

## Mobile interaction gate

- Primary actions target at least 52 pt where practical; compact controls target at least 44 pt.
- Interactive state is available to accessibility services (`button`, `selected`, `expanded`).
- Rows wrap rather than clip on narrow screens.
- Long content scrolls; no critical control depends on hover.
- Motion must respect reduced-motion settings and may only clarify sequence or relationship.

## Review gate

Before release, review on at least one narrow iOS-sized viewport and one narrow Android-sized viewport. Confirm that the daily mission, its context, and its action can be understood without opening settings or scanning gamification data.
