import type { LocalizedText } from './types';
import { ECONOMY_EXPANSION_LESSONS } from './examples/academy/economyExpansionLessons';
import { ECONOMY_FOUNDATION_LESSONS } from './examples/academy/economyFoundationsLessons';
import { FINANCIAL_MARKETS_EXPANSION_LESSONS } from './examples/academy/financialMarketsExpansionLessons';
import { FINANCIAL_MARKETS_FOUNDATION_LESSONS } from './examples/academy/financialMarketsFoundationLessons';
import { FUNDAMENTAL_ANALYSIS_EXPANSION_LESSONS } from './examples/academy/fundamentalAnalysisExpansionLessons';
import { FUNDAMENTAL_ANALYSIS_FOUNDATION_LESSONS } from './examples/academy/fundamentalAnalysisFoundationLessons';
import { RISK_PORTFOLIO_FOUNDATION_LESSONS } from './examples/academy/riskPortfolioFoundationLessons';
import { TECHNICAL_ANALYSIS_EXPANSION_LESSONS } from './examples/academy/technicalAnalysisExpansionLessons';
import { TECHNICAL_ANALYSIS_FOUNDATION_LESSONS } from './examples/academy/technicalAnalysisFoundationLessons';

export const ACADEMY_TRACK_IDS = [
  'economy', 'financial_markets', 'technical_analysis', 'fundamental_analysis', 'risk_portfolio',
  'market_psychology', 'strategies', 'algo_quant', 'smc_ict', 'asset_schools',
] as const;

export type AcademyTrackId = (typeof ACADEMY_TRACK_IDS)[number];
export type AcademyTrackStatus = 'active' | 'planned';

export interface AcademyTrackDefinition {
  readonly id: AcademyTrackId;
  readonly order: number;
  readonly title: LocalizedText;
  readonly description: LocalizedText;
  readonly status: AcademyTrackStatus;
  readonly lessonIds: readonly string[];
}

export const ACADEMY_TRACKS: Readonly<Record<AcademyTrackId, AcademyTrackDefinition>> = {
  economy: {
    id: 'economy', order: 1, title: { tr: 'Temel Ekonomi', en: 'Economics Foundations' },
    description: { tr: 'Enflasyon, faiz, merkez bankaları, büyüme, işgücü, maliye politikası, döviz kuru, verimlilik ve ekonomik verileri piyasa bağlamıyla sade öğren.', en: 'Learn inflation, rates, central banks, growth, labor markets, fiscal policy, exchange rates, productivity, and economic data in a simple market-relevant progression.' },
    status: 'active', lessonIds: [...ECONOMY_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...ECONOMY_EXPANSION_LESSONS.map((lesson) => lesson.id)],
  },
  financial_markets: {
    id: 'financial_markets', order: 2, title: { tr: 'Finansal Piyasalar', en: 'Financial Markets' },
    description: { tr: 'Borsa, endeks, ETF, tahvil, forex, emtia, kripto, seanslar, hacim, piyasa altyapısı ve türevleri ürünlerin gerçekten nasıl çalıştığını anlayacak kadar derinleştir.', en: 'Go deeper into exchanges, indices, ETFs, bonds, FX, commodities, crypto, sessions, volume, market infrastructure, and derivatives so you understand how markets actually work.' },
    status: 'active', lessonIds: [...FINANCIAL_MARKETS_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...FINANCIAL_MARKETS_EXPANSION_LESSONS.map((lesson) => lesson.id)],
  },
  technical_analysis: {
    id: 'technical_analysis', order: 3, title: { tr: 'Teknik Analiz', en: 'Technical Analysis' },
    description: { tr: 'Core grafik bilgisini breakout, pullback, range, momentum, hareketli ortalama, RSI, MACD, çoklu zaman dilimi, formasyon, confluence ve indikatör sınırlarıyla genişlet.', en: 'Extend Core chart literacy with breakouts, pullbacks, ranges, momentum, moving averages, RSI, MACD, multi-timeframe analysis, patterns, confluence, and indicator limits.' },
    status: 'active', lessonIds: [...TECHNICAL_ANALYSIS_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...TECHNICAL_ANALYSIS_EXPANSION_LESSONS.map((lesson) => lesson.id)],
  },
  fundamental_analysis: {
    id: 'fundamental_analysis', order: 4, title: { tr: 'Temel Analiz', en: 'Fundamental Analysis' },
    description: { tr: 'Finansal tablolar, nakit, marj, borç, büyüme kalitesi, hisse başına metrikler, çarpanlar, DCF, peer karşılaştırması ve temel analizin sınırlarını birlikte öğren.', en: 'Learn financial statements, cash, margins, debt, growth quality, per-share metrics, multiples, DCF, peer comparison, and the limits of fundamental analysis together.' },
    status: 'active', lessonIds: [...FUNDAMENTAL_ANALYSIS_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...FUNDAMENTAL_ANALYSIS_EXPANSION_LESSONS.map((lesson) => lesson.id)],
  },
  risk_portfolio: {
    id: 'risk_portfolio', order: 5, title: { tr: 'Risk ve Portföy', en: 'Risk and Portfolio' },
    description: { tr: 'Core risk bilgisini korelasyon, drawdown, kaldıraç, yoğunlaşma, risk bütçesi ve portföy oluşturma mantığıyla derinleştir.', en: 'Deepen Core risk knowledge with correlation, drawdown, leverage, concentration, risk budgeting, and portfolio construction.' },
    status: 'active', lessonIds: RISK_PORTFOLIO_FOUNDATION_LESSONS.map((lesson) => lesson.id),
  },
  market_psychology: { id: 'market_psychology', order: 6, title: { tr: 'Piyasa Psikolojisi', en: 'Market Psychology' }, description: { tr: 'FOMO ve aşırı işlemin ötesinde loss aversion, anchoring, recency, aşırı güven ve sonuç yanlılığını öğren.', en: 'Go beyond FOMO and overtrading into loss aversion, anchoring, recency, overconfidence, and outcome bias.' }, status: 'planned', lessonIds: [] },
  strategies: { id: 'strategies', order: 7, title: { tr: 'Stratejiler', en: 'Strategies' }, description: { tr: 'Trend following, mean reversion, breakout, swing ve benzeri yaklaşımları sinyal değil, yöntem ve trade-off olarak öğren.', en: 'Learn trend following, mean reversion, breakouts, swing approaches, and their trade-offs rather than treating them as signals.' }, status: 'planned', lessonIds: [] },
  algo_quant: { id: 'algo_quant', order: 8, title: { tr: 'Algoritmik Trade ve Quant', en: 'Algorithmic Trading and Quant' }, description: { tr: 'Kural tabanlı strateji, expectancy, backtest, overfitting, veri sızıntısı, maliyet ve dayanıklılık kavramlarını öğren.', en: 'Learn rules-based strategies, expectancy, backtesting, overfitting, leakage, costs, and robustness.' }, status: 'planned', lessonIds: [] },
  smc_ict: { id: 'smc_ict', order: 9, title: { tr: 'SMC / ICT · İleri', en: 'SMC / ICT · Advanced' }, description: { tr: 'Liquidity sweep, displacement, FVG, order block, mitigation ve benzeri metodolojiye bağlı kavramları ileri seviye olarak ele al.', en: 'Study methodology-dependent concepts such as liquidity sweeps, displacement, FVGs, order blocks, and mitigation at an advanced level.' }, status: 'planned', lessonIds: [] },
  asset_schools: { id: 'asset_schools', order: 10, title: { tr: 'Varlık Okulları', en: 'Asset Schools' }, description: { tr: 'Hisse, kripto, forex, emtia ve ETF için ortak temellerin üzerine varlığa özgü öğrenme yolları kur.', en: 'Build asset-specific learning paths for equities, crypto, FX, commodities, and ETFs on top of shared foundations.' }, status: 'planned', lessonIds: [] },
};

export const ACTIVE_ACADEMY_TRACKS = ACADEMY_TRACK_IDS.map((id) => ACADEMY_TRACKS[id]).filter((track) => track.status === 'active');
