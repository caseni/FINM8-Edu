import type { ContentSource } from '../../types';

const reviewedAt = '2026-08-11T13:00:00+03:00';

export const ECONOMY_EXPANSION_SOURCES: Readonly<Record<string, ContentSource>> = {
  labor: {
    id: 'source.ilo.labor-market-basics',
    title: 'Labour market and unemployment foundations',
    publisher: 'International Labour Organization',
    reviewedAt,
  },
  fiscal: {
    id: 'source.imf.fiscal-policy-basics',
    title: 'Fiscal policy foundations',
    publisher: 'International Monetary Fund',
    reviewedAt,
  },
  exchangeRates: {
    id: 'source.imf.exchange-rate-basics',
    title: 'Exchange rates and the macroeconomy',
    publisher: 'International Monetary Fund',
    reviewedAt,
  },
  productivity: {
    id: 'source.oecd.productivity-basics',
    title: 'Productivity and long-term economic growth',
    publisher: 'Organisation for Economic Co-operation and Development',
    reviewedAt,
  },
  indicators: {
    id: 'source.oecd.economic-indicators',
    title: 'Reading economic indicators',
    publisher: 'Organisation for Economic Co-operation and Development',
    reviewedAt,
  },
  realNominal: {
    id: 'source.bea.real-nominal-basics',
    title: 'Real and nominal economic measures',
    publisher: 'U.S. Bureau of Economic Analysis',
    reviewedAt,
  },
};
