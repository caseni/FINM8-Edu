export const LEARNING_CONCEPT_KEYS = [
  'market.structure.bos',
  'market.structure.choch',
  'market.structure.support_resistance',
  'market.structure.fvg',
  'market.structure.order_block',
  'market.structure.liquidity',
  'market.timeframe.alignment',
  'risk.volatility',
  'risk.position_sizing',
  'risk.risk_reward',
  'evidence.freshness',
  'evidence.data_quality',
  'fundamental.basics',
  'onchain.basics',
  'behavior.fomo',
  'behavior.overtrading',
] as const;

export type LearningConceptKey = (typeof LEARNING_CONCEPT_KEYS)[number];

export type LearningConceptCategory =
  | 'market_structure'
  | 'risk'
  | 'evidence'
  | 'fundamental'
  | 'onchain'
  | 'behavior';

export interface LearningConceptDefinition {
  readonly key: LearningConceptKey;
  readonly category: LearningConceptCategory;
  readonly titleTr: string;
  readonly titleEn: string;
}

/**
 * Stable concept identities shared by lessons and future FINM8 entry points.
 * UI copy may change; these keys must not.
 */
export const LEARNING_CONCEPTS: Readonly<
  Record<LearningConceptKey, LearningConceptDefinition>
> = {
  'market.structure.bos': {
    key: 'market.structure.bos',
    category: 'market_structure',
    titleTr: 'Yapı kırılımı (BOS)',
    titleEn: 'Break of structure (BOS)',
  },
  'market.structure.choch': {
    key: 'market.structure.choch',
    category: 'market_structure',
    titleTr: 'Karakter değişimi (CHoCH)',
    titleEn: 'Change of character (CHoCH)',
  },
  'market.structure.support_resistance': {
    key: 'market.structure.support_resistance',
    category: 'market_structure',
    titleTr: 'Destek ve direnç',
    titleEn: 'Support and resistance',
  },
  'market.structure.fvg': {
    key: 'market.structure.fvg',
    category: 'market_structure',
    titleTr: 'Adil değer boşluğu (FVG)',
    titleEn: 'Fair value gap (FVG)',
  },
  'market.structure.order_block': {
    key: 'market.structure.order_block',
    category: 'market_structure',
    titleTr: 'Emir bloğu',
    titleEn: 'Order block',
  },
  'market.structure.liquidity': {
    key: 'market.structure.liquidity',
    category: 'market_structure',
    titleTr: 'Likidite',
    titleEn: 'Liquidity',
  },
  'market.timeframe.alignment': {
    key: 'market.timeframe.alignment',
    category: 'market_structure',
    titleTr: 'Zaman dilimi uyumu',
    titleEn: 'Timeframe alignment',
  },
  'risk.volatility': {
    key: 'risk.volatility',
    category: 'risk',
    titleTr: 'Volatilite riski',
    titleEn: 'Volatility risk',
  },
  'risk.position_sizing': {
    key: 'risk.position_sizing',
    category: 'risk',
    titleTr: 'Pozisyon büyüklüğü',
    titleEn: 'Position sizing',
  },
  'risk.risk_reward': {
    key: 'risk.risk_reward',
    category: 'risk',
    titleTr: 'Risk/getiri oranı',
    titleEn: 'Risk/reward ratio',
  },
  'evidence.freshness': {
    key: 'evidence.freshness',
    category: 'evidence',
    titleTr: 'Veri güncelliği',
    titleEn: 'Evidence freshness',
  },
  'evidence.data_quality': {
    key: 'evidence.data_quality',
    category: 'evidence',
    titleTr: 'Veri kalitesi',
    titleEn: 'Data quality',
  },
  'fundamental.basics': {
    key: 'fundamental.basics',
    category: 'fundamental',
    titleTr: 'Temel analiz başlangıcı',
    titleEn: 'Fundamental analysis basics',
  },
  'onchain.basics': {
    key: 'onchain.basics',
    category: 'onchain',
    titleTr: 'On-chain veri başlangıcı',
    titleEn: 'On-chain data basics',
  },
  'behavior.fomo': {
    key: 'behavior.fomo',
    category: 'behavior',
    titleTr: 'Fırsatı kaçırma korkusu (FOMO)',
    titleEn: 'Fear of missing out (FOMO)',
  },
  'behavior.overtrading': {
    key: 'behavior.overtrading',
    category: 'behavior',
    titleTr: 'Aşırı işlem',
    titleEn: 'Overtrading',
  },
};

