import type { LearningStage, LocalizedText } from './types';

export const LEARNING_TRACK_IDS = [
  'foundations',
  'market_structure',
  'smc_ict',
  'advanced_application',
] as const;

export type LearningTrackId = (typeof LEARNING_TRACK_IDS)[number];
export type LearningTrackStatus = 'active' | 'planned';

export interface LearningTrackDefinition {
  readonly id: LearningTrackId;
  readonly order: number;
  readonly title: LocalizedText;
  readonly description: LocalizedText;
  readonly stage: LearningStage;
  readonly status: LearningTrackStatus;
  readonly prerequisiteTrackIds: readonly LearningTrackId[];
}

export const LEARNING_TRACKS: Readonly<Record<LearningTrackId, LearningTrackDefinition>> = {
  foundations: {
    id: 'foundations',
    order: 1,
    title: { tr: 'Temel Piyasa Okuryazarlığı', en: 'Market Literacy Foundations' },
    description: {
      tr: 'Fiyat, mum, zaman dilimi, trend, destek/direnç, emir ve temel risk kavramlarını sade biçimde öğren.',
      en: 'Learn price, candles, timeframes, trend, support/resistance, orders, and basic risk in a simple progression.',
    },
    stage: 'foundation',
    status: 'active',
    prerequisiteTrackIds: [],
  },
  market_structure: {
    id: 'market_structure',
    order: 2,
    title: { tr: 'Piyasa Yapısı', en: 'Market Structure' },
    description: {
      tr: 'Anlamlı salınımları, yapısal seviyeleri, BOS ve CHoCH kavramlarını temel grafik bilgisinin üzerine kur.',
      en: 'Build meaningful swings, structural levels, BOS, and CHoCH on top of core chart literacy.',
    },
    stage: 'intermediate',
    status: 'active',
    prerequisiteTrackIds: ['foundations'],
  },
  smc_ict: {
    id: 'smc_ict',
    order: 3,
    title: { tr: 'SMC / ICT Kavramları', en: 'SMC / ICT Concepts' },
    description: {
      tr: 'Liquidity sweep, displacement, FVG, order block, mitigation ve benzeri metodolojiye bağlı kavramları ayrı bir ileri seviye çatı altında öğren.',
      en: 'Learn methodology-dependent concepts such as liquidity sweeps, displacement, FVGs, order blocks, and mitigation in a separate advanced track.',
    },
    stage: 'advanced',
    status: 'planned',
    prerequisiteTrackIds: ['market_structure'],
  },
  advanced_application: {
    id: 'advanced_application',
    order: 4,
    title: { tr: 'İleri Uygulama ve Birleştirme', en: 'Advanced Application and Confluence' },
    description: {
      tr: 'Zaman dilimi, yapı, likidite, risk ve farklı kanıtları tek sinyale indirgemeden birlikte değerlendir.',
      en: 'Combine timeframe, structure, liquidity, risk, and multiple evidence sources without reducing them to one signal.',
    },
    stage: 'advanced',
    status: 'planned',
    prerequisiteTrackIds: ['market_structure', 'smc_ict'],
  },
};

export const SMC_ICT_PLANNED_TOPICS = [
  'liquidity_sweep',
  'liquidity_grab',
  'inducement',
  'displacement',
  'fair_value_gap',
  'order_block',
  'mitigation',
  'premium_discount',
  'market_structure_shift',
] as const;

export const SMC_ICT_METHODOLOGY_NOTE: LocalizedText = {
  tr: 'SMC/ICT terimleri kullanılan metodolojiye göre farklı tanımlanabilir. FINM8 bu kavramları evrensel piyasa gerçekleri veya tek başına işlem sinyalleri olarak sunmaz.',
  en: 'SMC/ICT terms can be defined differently across methodologies. FINM8 does not present them as universal market truths or standalone trade signals.',
};
