import type { ContentSource } from '../../types';

const reviewedAt = '2026-07-15T20:30:00+03:00';

export const BEHAVIOR_EVIDENCE_SOURCES: Readonly<Record<string, ContentSource>> = {
  investorRisk: {
    id: 'source.investor-gov.risk',
    title: 'What is Risk?',
    publisher: 'Investor.gov — U.S. Securities and Exchange Commission',
    url: 'https://www.investor.gov/introduction-investing/investing-basics/what-risk',
    reviewedAt,
  },
  behavior: {
    id: 'source.finm8.methodology.behavior',
    title: 'FINM8 Decision Behavior Methodology',
    publisher: 'FINM8',
    reviewedAt,
  },
  evidence: {
    id: 'source.finm8.methodology.evidence',
    title: 'FINM8 Evidence Quality and Freshness Methodology',
    publisher: 'FINM8',
    reviewedAt,
  },
};
