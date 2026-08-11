export const LEARNING_CONCEPT_KEYS = [
  'market.basics.price_formation',
  'market.basics.instruments',
  'market.microstructure.bid_ask',
  'market.execution.order_types',
  'market.execution.slippage',
  'market.chart.timeframes',
  'market.chart.candles',
  'market.trend.basics',
  'market.structure.bos',
  'market.structure.choch',
  'market.structure.support_resistance',
  'market.structure.fvg',
  'market.structure.order_block',
  'market.structure.liquidity',
  'market.timeframe.alignment',
  'risk.volatility',
  'risk.basics',
  'risk.position_sizing',
  'risk.risk_reward',
  'risk.stop_orders',
  'portfolio.diversification',
  'evidence.freshness',
  'evidence.data_quality',
  'economy.inflation',
  'economy.interest_rates',
  'economy.central_banks',
  'economy.monetary_policy',
  'economy.growth',
  'economy.business_cycle',
  'economy.labor_market',
  'economy.fiscal_policy',
  'economy.exchange_rates',
  'economy.productivity',
  'economy.indicators',
  'economy.real_nominal',
  'fundamental.basics',
  'onchain.basics',
  'behavior.fomo',
  'behavior.confirmation_bias',
  'behavior.decision_journal',
  'behavior.overtrading',
] as const;

export type LearningConceptKey = (typeof LEARNING_CONCEPT_KEYS)[number];

export type LearningConceptCategory =
  | 'market_foundations'
  | 'market_execution'
  | 'chart_literacy'
  | 'market_structure'
  | 'risk'
  | 'portfolio'
  | 'evidence'
  | 'economy'
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
  'market.basics.price_formation': {
    key: 'market.basics.price_formation',
    category: 'market_foundations',
    titleTr: 'Piyasada fiyatın oluşumu',
    titleEn: 'How market prices form',
  },
  'market.basics.instruments': {
    key: 'market.basics.instruments',
    category: 'market_foundations',
    titleTr: 'Piyasa ve araç türleri',
    titleEn: 'Market and instrument types',
  },
  'market.microstructure.bid_ask': {
    key: 'market.microstructure.bid_ask',
    category: 'market_execution',
    titleTr: 'Alış, satış ve spread',
    titleEn: 'Bid, ask, and spread',
  },
  'market.execution.order_types': {
    key: 'market.execution.order_types',
    category: 'market_execution',
    titleTr: 'Emir türleri',
    titleEn: 'Order types',
  },
  'market.execution.slippage': {
    key: 'market.execution.slippage',
    category: 'market_execution',
    titleTr: 'Gerçekleşme fiyatı ve kayma',
    titleEn: 'Execution price and slippage',
  },
  'market.chart.timeframes': {
    key: 'market.chart.timeframes',
    category: 'chart_literacy',
    titleTr: 'Grafik zaman dilimleri',
    titleEn: 'Chart timeframes',
  },
  'market.chart.candles': {
    key: 'market.chart.candles',
    category: 'chart_literacy',
    titleTr: 'Mum grafikleri',
    titleEn: 'Candlestick charts',
  },
  'market.trend.basics': {
    key: 'market.trend.basics',
    category: 'chart_literacy',
    titleTr: 'Trend temelleri',
    titleEn: 'Trend foundations',
  },
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
  'risk.basics': {
    key: 'risk.basics',
    category: 'risk',
    titleTr: 'Risk ve belirsizlik',
    titleEn: 'Risk and uncertainty',
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
  'risk.stop_orders': {
    key: 'risk.stop_orders',
    category: 'risk',
    titleTr: 'Stop emirleri ve sınırlamaları',
    titleEn: 'Stop orders and limitations',
  },
  'portfolio.diversification': {
    key: 'portfolio.diversification',
    category: 'portfolio',
    titleTr: 'Çeşitlendirme',
    titleEn: 'Diversification',
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
  'economy.inflation': {
    key: 'economy.inflation',
    category: 'economy',
    titleTr: 'Enflasyon ve satın alma gücü',
    titleEn: 'Inflation and purchasing power',
  },
  'economy.interest_rates': {
    key: 'economy.interest_rates',
    category: 'economy',
    titleTr: 'Faiz oranlarının temel mantığı',
    titleEn: 'Interest-rate foundations',
  },
  'economy.central_banks': {
    key: 'economy.central_banks',
    category: 'economy',
    titleTr: 'Merkez bankalarının rolü',
    titleEn: 'The role of central banks',
  },
  'economy.monetary_policy': {
    key: 'economy.monetary_policy',
    category: 'economy',
    titleTr: 'Para politikası aktarım mekanizması',
    titleEn: 'Monetary-policy transmission',
  },
  'economy.growth': {
    key: 'economy.growth',
    category: 'economy',
    titleTr: 'Ekonomik büyüme ve GSYH',
    titleEn: 'Economic growth and GDP',
  },
  'economy.business_cycle': {
    key: 'economy.business_cycle',
    category: 'economy',
    titleTr: 'Ekonomik döngü ve resesyon',
    titleEn: 'Business cycles and recession',
  },
  'economy.labor_market': {
    key: 'economy.labor_market',
    category: 'economy',
    titleTr: 'İşgücü piyasası ve işsizlik',
    titleEn: 'Labor markets and unemployment',
  },
  'economy.fiscal_policy': {
    key: 'economy.fiscal_policy',
    category: 'economy',
    titleTr: 'Maliye politikası',
    titleEn: 'Fiscal policy',
  },
  'economy.exchange_rates': {
    key: 'economy.exchange_rates',
    category: 'economy',
    titleTr: 'Döviz kuru ve para değeri',
    titleEn: 'Exchange rates and currency value',
  },
  'economy.productivity': {
    key: 'economy.productivity',
    category: 'economy',
    titleTr: 'Verimlilik ve uzun vadeli büyüme',
    titleEn: 'Productivity and long-run growth',
  },
  'economy.indicators': {
    key: 'economy.indicators',
    category: 'economy',
    titleTr: 'Ekonomik veriyi doğru okuma',
    titleEn: 'Reading economic indicators',
  },
  'economy.real_nominal': {
    key: 'economy.real_nominal',
    category: 'economy',
    titleTr: 'Reel ve nominal değerler',
    titleEn: 'Real and nominal values',
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
  'behavior.confirmation_bias': {
    key: 'behavior.confirmation_bias',
    category: 'behavior',
    titleTr: 'Onaylama yanlılığı',
    titleEn: 'Confirmation bias',
  },
  'behavior.decision_journal': {
    key: 'behavior.decision_journal',
    category: 'behavior',
    titleTr: 'Karar günlüğü',
    titleEn: 'Decision journal',
  },
  'behavior.overtrading': {
    key: 'behavior.overtrading',
    category: 'behavior',
    titleTr: 'Aşırı işlem',
    titleEn: 'Overtrading',
  },
};
