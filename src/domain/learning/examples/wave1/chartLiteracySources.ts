import type { ContentSource } from '../../types';

const reviewedAt = '2026-07-15T19:30:00+03:00';

export const CHART_LITERACY_SOURCES: Readonly<Record<string, ContentSource>> = {
  cmeTechnicalAnalysis: {
    id: 'source.cme.technical-analysis',
    title: 'Technical Analysis Course Overview',
    publisher: 'CME Group Education',
    url: 'https://www.cmegroup.com/education/courses/technical-analysis',
    reviewedAt,
  },
  chartLiteracy: {
    id: 'source.finm8.methodology.chart-literacy',
    title: 'FINM8 Chart Literacy Methodology',
    publisher: 'FINM8',
    reviewedAt,
  },
  timeframes: {
    id: 'source.finm8.methodology.timeframes',
    title: 'FINM8 Timeframe Semantics',
    publisher: 'FINM8',
    reviewedAt,
  },
  trend: {
    id: 'source.finm8.methodology.trend',
    title: 'FINM8 Trend Context Methodology',
    publisher: 'FINM8',
    reviewedAt,
  },
  supportResistance: {
    id: 'source.finm8.methodology.support-resistance',
    title: 'FINM8 Support and Resistance Methodology',
    publisher: 'FINM8',
    reviewedAt,
  },
  marketStructure: {
    id: 'source.finm8.methodology.market-structure',
    title: 'FINM8 Market Structure Methodology',
    publisher: 'FINM8',
    reviewedAt,
  },
};
