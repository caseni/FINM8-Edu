import type { ContentSource } from '../../types';

const reviewedAt = '2026-08-11T20:53:00+03:00';

export const ASSET_SCHOOL_SOURCES: Readonly<Record<string, ContentSource>> = {
  crossMarket: { id: 'source.finm8.asset-specific-methodology', title: 'FINM8 Cross-Asset Market Structure and Risk Methodology', publisher: 'FINM8', reviewedAt },
  equities: { id: 'source.sec.equity-corporate-actions', title: 'Equity securities, corporate actions, and investor information', publisher: 'U.S. Securities and Exchange Commission', reviewedAt },
  etf: { id: 'source.sec.etf-structure-risks', title: 'ETF structure, NAV, tracking, leveraged and inverse fund risks', publisher: 'U.S. Securities and Exchange Commission', reviewedAt },
  forex: { id: 'source.cftc.forex-risk-mechanics', title: 'Foreign exchange market mechanics and trading risks', publisher: 'U.S. Commodity Futures Trading Commission', reviewedAt },
  commodities: { id: 'source.cftc.futures-term-structure', title: 'Commodity futures, contract structure, and market risks', publisher: 'U.S. Commodity Futures Trading Commission', reviewedAt },
  crypto: { id: 'source.finra.crypto-market-risks', title: 'Crypto assets, trading venues, custody, and market risks', publisher: 'FINRA', reviewedAt },
  onchain: { id: 'source.finm8.onchain-evidence-methodology', title: 'FINM8 On-chain Evidence and Attribution Methodology', publisher: 'FINM8', reviewedAt },
};
