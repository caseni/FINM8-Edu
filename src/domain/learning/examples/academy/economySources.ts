import type { ContentSource } from '../../types';

const reviewedAt = '2026-08-11T13:00:00+03:00';

export const ECONOMY_SOURCES: Readonly<Record<string, ContentSource>> = {
  inflation: {
    id: 'source.ecb.inflation-basics',
    title: 'Inflation basics and price stability',
    publisher: 'European Central Bank',
    reviewedAt,
  },
  rates: {
    id: 'source.bankofengland.interest-rates',
    title: 'Interest rates and how they affect the economy',
    publisher: 'Bank of England',
    reviewedAt,
  },
  centralBanks: {
    id: 'source.federalreserve.central-bank-role',
    title: 'Central banking and monetary policy foundations',
    publisher: 'Board of Governors of the Federal Reserve System',
    reviewedAt,
  },
  monetaryPolicy: {
    id: 'source.federalreserve.monetary-policy-transmission',
    title: 'Monetary policy goals and transmission',
    publisher: 'Board of Governors of the Federal Reserve System',
    reviewedAt,
  },
  gdp: {
    id: 'source.bea.gdp-basics',
    title: 'Gross Domestic Product and economic activity',
    publisher: 'U.S. Bureau of Economic Analysis',
    reviewedAt,
  },
  businessCycle: {
    id: 'source.nber.business-cycle',
    title: 'Business cycle expansions and contractions',
    publisher: 'National Bureau of Economic Research',
    reviewedAt,
  },
};
