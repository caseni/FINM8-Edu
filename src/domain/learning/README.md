# Learning domain

This directory is the UI-independent M8 EDU core. It can be developed and
validated inside `FINM8-Edu` without changing the flagship analysis module.

## Boundaries

- `concepts.ts` owns stable concept identities. UI labels must never be used as
  integration keys.
- `schemas.ts` validates content, paths, assessments, mastery, badges, and the
  read-only FINM8 entry context at runtime.
- `types.ts` derives TypeScript types from those schemas so runtime and compile
  time contracts cannot drift.
- `examples/` contains draft fixtures for contract validation. Fixtures are not
  approved or published lessons.

Turkish is required as the canonical language. English is optional until the
Turkish content has been reviewed. Normal and Pro are presentation variants of
the same lesson; they do not create separate progress records.

The domain does not import React Native, navigation, analysis state,
DetectionHistory, market providers, or FINM8 scoring code.

