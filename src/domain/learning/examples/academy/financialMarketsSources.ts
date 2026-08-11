import type { ContentSource } from '../../types';

const reviewedAt = '2026-08-11T13:00:00+03:00';

export const FINANCIAL_MARKETS_SOURCES: Readonly<Record<string, ContentSource>> = {
  exchanges: {
    id: 'source.sec.market-structure-basics',
    title: 'Securities markets and trading venues',
    publisher: 'U.S. Securities and Exchange Commission',
    reviewedAt,
  },
  indices: {
    id: 'source.investorgov.index-basics',
    title: 'Market indexes and index investing foundations',
    publisher: 'Investor.gov — U.S. Securities and Exchange Commission',
    reviewedAt,
  },
  etf: {
    id: 'source.sec.etf-basics',
    title: 'Exchange-traded funds: investor foundations',
    publisher: 'U.S. Securities and Exchange Commission',
    reviewedAt,
  },
  bonds: {
    id: 'source.finra.bond-basics',
    title: 'Bond and fixed-income foundations',
    publisher: 'FINRA',
    reviewedAt,
  },
  forex: {
    id: 'source.cftc.forex-basics',
    title: 'Foreign exchange market foundations',
    publisher: 'U.S. Commodity Futures Trading Commission',
    reviewedAt,
  },
  commodities: {
    id: 'source.cftc.commodity-markets',
    title: 'Commodity markets and futures foundations',
    publisher: 'U.S. Commodity Futures Trading Commission',
    reviewedAt,
  },
};
