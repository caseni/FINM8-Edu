import type { ContentSource } from '../../types';

const reviewedAt = '2026-08-11T19:45:00+03:00';

export const STRATEGY_SOURCES: Readonly<Record<string, ContentSource>> = {
  methodology: {
    id: 'source.finm8.strategy-methodology',
    title: 'FINM8 Strategy Design and Decision Methodology',
    publisher: 'FINM8',
    reviewedAt,
  },
  risk: {
    id: 'source.finm8.strategy-risk-methodology',
    title: 'FINM8 Strategy Risk, Regime, and Cost Methodology',
    publisher: 'FINM8',
    reviewedAt,
  },
};
