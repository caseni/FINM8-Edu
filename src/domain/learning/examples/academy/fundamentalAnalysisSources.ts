import type { ContentSource } from '../../types';

const reviewedAt = '2026-08-11T15:25:00+03:00';

export const FUNDAMENTAL_ANALYSIS_SOURCES: Readonly<Record<string, ContentSource>> = {
  statements: {
    id: 'source.sec.financial-statements-basics',
    title: 'Financial Statements and Company Filings — investor education foundations',
    publisher: 'U.S. Securities and Exchange Commission / Investor.gov',
    reviewedAt,
  },
  accounting: {
    id: 'source.sec.accounting-company-reports',
    title: 'Company reports, accounting measures, and disclosure foundations',
    publisher: 'U.S. Securities and Exchange Commission / Investor.gov',
    reviewedAt,
  },
  methodology: {
    id: 'source.finm8.fundamental-analysis-methodology',
    title: 'FINM8 Fundamental Analysis Methodology',
    publisher: 'FINM8',
    reviewedAt,
  },
};
