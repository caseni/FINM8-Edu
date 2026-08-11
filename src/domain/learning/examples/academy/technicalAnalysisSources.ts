import type { ContentSource } from '../../types';

const reviewedAt = '2026-08-11T13:45:00+03:00';

export const TECHNICAL_ANALYSIS_SOURCES: Readonly<Record<string, ContentSource>> = {
  charting: {
    id: 'source.cme.technical-analysis-foundations',
    title: 'Technical analysis and chart-reading foundations',
    publisher: 'CME Group Education',
    reviewedAt,
  },
  indicators: {
    id: 'source.cme.technical-indicators-foundations',
    title: 'Technical indicators and moving averages',
    publisher: 'CME Group Education',
    reviewedAt,
  },
  methodology: {
    id: 'source.finm8.technical-analysis-methodology',
    title: 'FINM8 Technical Analysis Methodology',
    publisher: 'FINM8',
    reviewedAt,
  },
};
