import type { ContentSource } from '../../types';

const reviewedAt = '2026-07-15T18:00:00+03:00';

export const WAVE1_SOURCES: Readonly<Record<string, ContentSource>> = {
  markets: {
    id: 'source.investor-gov.markets',
    title: 'How Stock Markets Work',
    publisher: 'Investor.gov — U.S. Securities and Exchange Commission',
    url: 'https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work',
    reviewedAt,
  },
  products: {
    id: 'source.investor-gov.products',
    title: 'Investment Products',
    publisher: 'Investor.gov — U.S. Securities and Exchange Commission',
    url: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products',
    reviewedAt,
  },
  liquidity: {
    id: 'source.investor-gov.liquidity',
    title: 'Liquidity (or Marketability)',
    publisher: 'Investor.gov — U.S. Securities and Exchange Commission',
    url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/liquidity-or-marketability',
    reviewedAt,
  },
  bidAsk: {
    id: 'source.investor-gov.bid-ask',
    title: 'Bid Price / Ask Price',
    publisher: 'Investor.gov — U.S. Securities and Exchange Commission',
    url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/bid-price',
    reviewedAt,
  },
  investorOrders: {
    id: 'source.investor-gov.order-types',
    title: 'Types of Orders',
    publisher: 'Investor.gov — U.S. Securities and Exchange Commission',
    url: 'https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders',
    reviewedAt,
  },
  finraOrders: {
    id: 'source.finra.order-types',
    title: 'Order Types',
    publisher: 'Financial Industry Regulatory Authority (FINRA)',
    url: 'https://www.finra.org/investors/investing/investment-products/stocks/order-types',
    reviewedAt,
  },
};

