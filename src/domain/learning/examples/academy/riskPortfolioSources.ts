import type { ContentSource } from '../../types';

const reviewedAt = '2026-08-11T19:15:00+03:00';

export const RISK_PORTFOLIO_SOURCES: Readonly<Record<string, ContentSource>> = {
  diversification: {
    id: 'source.investor-gov.diversification-risk',
    title: 'Diversification, portfolio risk, and investor education foundations',
    publisher: 'U.S. Securities and Exchange Commission / Investor.gov',
    reviewedAt,
  },
  leverage: {
    id: 'source.finra.margin-leverage-risk',
    title: 'Margin, leverage, and amplified-loss investor education foundations',
    publisher: 'FINRA Investor Education',
    reviewedAt,
  },
  methodology: {
    id: 'source.finm8.risk-portfolio-methodology',
    title: 'FINM8 Risk and Portfolio Methodology',
    publisher: 'FINM8',
    reviewedAt,
  },
};
