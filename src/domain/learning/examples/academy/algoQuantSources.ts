import type { ContentSource } from '../../types';

const reviewedAt = '2026-08-11T20:53:00+03:00';

export const ALGO_QUANT_SOURCES: Readonly<Record<string, ContentSource>> = {
  methodology: {
    id: 'source.finm8.algo-quant-methodology',
    title: 'FINM8 Algorithmic Trading and Quant Research Methodology',
    publisher: 'FINM8',
    reviewedAt,
  },
  validation: {
    id: 'source.finm8.quant-validation-methodology',
    title: 'FINM8 Backtest Validation, Bias, and Robustness Methodology',
    publisher: 'FINM8',
    reviewedAt,
  },
};
