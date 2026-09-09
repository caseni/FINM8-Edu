import type { LocalizedText } from './types';

export const BEGINNER_PRELUDE_LESSON_IDS = [
  'lesson.foundation.investing-vs-trading.001',
  'lesson.foundation.goal-horizon-risk.001',
] as const;

export const BEGINNER_SECTION_IDS = [
  'money_economy',
  'markets',
  'charts',
  'risk',
] as const;

export type BeginnerSectionId = (typeof BEGINNER_SECTION_IDS)[number];

export interface BeginnerSectionDefinition {
  readonly id: BeginnerSectionId;
  readonly order: number;
  readonly title: LocalizedText;
  readonly description: LocalizedText;
  readonly status: 'active' | 'next';
  readonly lessonIds: readonly string[];
}

export const BEGINNER_SECTIONS: Readonly<Record<BeginnerSectionId, BeginnerSectionDefinition>> = {
  money_economy: {
    id: 'money_economy',
    order: 1,
    title: { tr: 'Para ve Ekonomi', en: 'Money and the Economy' },
    description: {
      tr: 'Paranın neden daha az şey alabildiğini, faizi ve ekonominin neden bazen hızlanıp yavaşladığını öğren.',
      en: 'Learn why money can buy less, what interest affects, and why the economy sometimes speeds up or slows down.',
    },
    status: 'active',
    lessonIds: [
      'lesson.economy.inflation.001',
      'lesson.economy.interest-rates.001',
      'lesson.economy.central-banks.001',
      'lesson.economy.monetary-policy.001',
      'lesson.economy.growth.001',
      'lesson.economy.business-cycle.001',
    ],
  },
  markets: {
    id: 'markets',
    order: 2,
    title: { tr: 'Piyasalar Nasıl Çalışır?', en: 'How Do Markets Work?' },
    description: {
      tr: 'Fiyatın nasıl oluştuğunu, ne aldığını, endeks ile ETF farkını ve işlemlerin nasıl gerçekleştiğini sade örneklerle öğren.',
      en: 'Learn with simple examples how prices form, what you are buying, how an index differs from an ETF, and how trades are executed.',
    },
    status: 'active',
    lessonIds: [
      'lesson.market.price-formation.001',
      'lesson.market.instruments.001',
      'lesson.market.index-etf.001',
      'lesson.market.liquidity.001',
      'lesson.market.bid-ask.001',
      'lesson.market.order-types.001',
      'lesson.market.slippage.001',
    ],
  },
  charts: {
    id: 'charts',
    order: 3,
    title: { tr: 'Grafikleri Korkmadan Oku', en: 'Read Charts Without Fear' },
    description: {
      tr: 'Grafiğin neyi kaydettiğini, farklı zaman ölçeklerini, genel yönü ve tepki bölgelerini sade örneklerle öğren.',
      en: 'Learn with simple examples what a chart records, different time scales, broader direction, and reaction areas.',
    },
    status: 'active',
    lessonIds: [
      'lesson.chart.candles.001',
      'lesson.chart.timeframes.001',
      'lesson.chart.trend.001',
      'lesson.chart.support-resistance.001',
    ],
  },
  risk: {
    id: 'risk',
    order: 4,
    title: { tr: 'Risk ve Karar', en: 'Risk and Decisions' },
    description: {
      tr: 'Riski kayıptan önce fark etmeyi, miktarın etkisini, çıkış planının sınırlarını, çeşitlendirmeyi ve duygusal karar baskısını sade örneklerle öğren.',
      en: 'Learn with simple examples how to recognize risk before loss, understand the impact of size, the limits of exit plans, diversification, and emotional pressure on decisions.',
    },
    status: 'active',
    lessonIds: [
      'lesson.risk.uncertainty.001',
      'lesson.risk.volatility.001',
      'lesson.risk.position-sizing.001',
      'lesson.risk.reward.001',
      'lesson.risk.stop-orders.001',
      'lesson.portfolio.diversification.001',
      'lesson.behavior.fomo.001',
    ],
  },
};

export const BEGINNER_LESSON_IDS = [
  ...BEGINNER_PRELUDE_LESSON_IDS,
  ...BEGINNER_SECTION_IDS.flatMap((sectionId) => BEGINNER_SECTIONS[sectionId].lessonIds),
] as const;
