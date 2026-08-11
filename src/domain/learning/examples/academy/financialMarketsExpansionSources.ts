import type { ContentSource } from '../../types';

const reviewedAt = '2026-08-11T13:30:00+03:00';

export const FINANCIAL_MARKETS_EXPANSION_SOURCES: Readonly<Record<string, ContentSource>> = {
  crypto: {
    id: 'source.finra.crypto-assets-basics',
    title: 'Crypto assets and market risks',
    publisher: 'FINRA',
    reviewedAt,
  },
  sessions: {
    id: 'source.nyse.trading-hours-basics',
    title: 'Trading sessions and market hours',
    publisher: 'New York Stock Exchange',
    reviewedAt,
  },
  volume: {
    id: 'source.finra.trading-volume-basics',
    title: 'Trading volume and market activity',
    publisher: 'FINRA',
    reviewedAt,
  },
  liquidityProviders: {
    id: 'source.sec.market-makers-basics',
    title: 'Market makers and liquidity provision',
    publisher: 'U.S. Securities and Exchange Commission',
    reviewedAt,
  },
  primarySecondary: {
    id: 'source.investorgov.primary-secondary-markets',
    title: 'Primary and secondary securities markets',
    publisher: 'Investor.gov — U.S. Securities and Exchange Commission',
    reviewedAt,
  },
  derivatives: {
    id: 'source.cftc.derivatives-basics',
    title: 'Futures, options, and derivatives foundations',
    publisher: 'U.S. Commodity Futures Trading Commission',
    reviewedAt,
  },
};
