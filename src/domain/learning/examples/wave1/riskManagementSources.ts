import type { ContentSource } from '../../types';

const reviewedAt = '2026-07-15T20:00:00+03:00';

export const RISK_MANAGEMENT_SOURCES: Readonly<Record<string, ContentSource>> = {
  investorRisk: {
    id: 'source.investor-gov.risk',
    title: 'What is Risk?',
    publisher: 'Investor.gov — U.S. Securities and Exchange Commission',
    url: 'https://www.investor.gov/introduction-investing/investing-basics/what-risk',
    reviewedAt,
  },
  finraRisk: {
    id: 'source.finra.risk',
    title: 'Risk',
    publisher: 'Financial Industry Regulatory Authority (FINRA)',
    url: 'https://www.finra.org/investors/investing/investing-basics/risk',
    reviewedAt,
  },
  diversification: {
    id: 'source.investor-gov.diversification',
    title: 'Diversification',
    publisher: 'Investor.gov — U.S. Securities and Exchange Commission',
    url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/diversification',
    reviewedAt,
  },
  orderTypes: {
    id: 'source.investor-gov.order-types',
    title: 'Types of Orders',
    publisher: 'Investor.gov — U.S. Securities and Exchange Commission',
    url: 'https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders',
    reviewedAt,
  },
  methodology: {
    id: 'source.finm8.methodology.risk',
    title: 'FINM8 Risk Education Methodology',
    publisher: 'FINM8',
    reviewedAt,
  },
};
