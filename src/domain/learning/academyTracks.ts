import type { LocalizedText } from './types';
import { ALGO_QUANT_EXPANSION_LESSONS } from './examples/academy/algoQuantExpansionLessons';
import { ALGO_QUANT_FOUNDATION_LESSONS } from './examples/academy/algoQuantFoundationLessons';
import { ECONOMY_EXPANSION_LESSONS } from './examples/academy/economyExpansionLessons';
import { ECONOMY_FOUNDATION_LESSONS } from './examples/academy/economyFoundationsLessons';
import { FINANCIAL_MARKETS_EXPANSION_LESSONS } from './examples/academy/financialMarketsExpansionLessons';
import { FINANCIAL_MARKETS_FOUNDATION_LESSONS } from './examples/academy/financialMarketsFoundationLessons';
import { FUNDAMENTAL_ANALYSIS_EXPANSION_LESSONS } from './examples/academy/fundamentalAnalysisExpansionLessons';
import { FUNDAMENTAL_ANALYSIS_FOUNDATION_LESSONS } from './examples/academy/fundamentalAnalysisFoundationLessons';
import { MARKET_PSYCHOLOGY_EXPANSION_LESSONS } from './examples/academy/marketPsychologyExpansionLessons';
import { MARKET_PSYCHOLOGY_FOUNDATION_LESSONS } from './examples/academy/marketPsychologyFoundationLessons';
import { RISK_PORTFOLIO_EXPANSION_LESSONS } from './examples/academy/riskPortfolioExpansionLessons';
import { RISK_PORTFOLIO_FOUNDATION_LESSONS } from './examples/academy/riskPortfolioFoundationLessons';
import { SMC_ICT_FOUNDATION_LESSONS } from './examples/academy/smcIctFoundationLessons';
import { STRATEGY_EXPANSION_LESSONS } from './examples/academy/strategyExpansionLessons';
import { STRATEGY_FOUNDATION_LESSONS } from './examples/academy/strategyFoundationLessons';
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
  economy: { id: 'economy', order: 1, title: { tr: 'Temel Ekonomi', en: 'Economics Foundations' }, description: { tr: 'Enflasyon, faiz, merkez bankaları, büyüme, işgücü, maliye politikası, döviz kuru, verimlilik ve ekonomik verileri piyasa bağlamıyla sade öğren.', en: 'Learn inflation, rates, central banks, growth, labor markets, fiscal policy, exchange rates, productivity, and economic data in a simple market-relevant progression.' }, status: 'active', lessonIds: [...ECONOMY_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...ECONOMY_EXPANSION_LESSONS.map((lesson) => lesson.id)] },
  financial_markets: { id: 'financial_markets', order: 2, title: { tr: 'Finansal Piyasalar', en: 'Financial Markets' }, description: { tr: 'Borsa, endeks, ETF, tahvil, forex, emtia, kripto, seanslar, hacim, piyasa altyapısı ve türevleri ürünlerin gerçekten nasıl çalıştığını anlayacak kadar derinleştir.', en: 'Go deeper into exchanges, indices, ETFs, bonds, FX, commodities, crypto, sessions, volume, market infrastructure, and derivatives so you understand how markets actually work.' }, status: 'active', lessonIds: [...FINANCIAL_MARKETS_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...FINANCIAL_MARKETS_EXPANSION_LESSONS.map((lesson) => lesson.id)] },
  technical_analysis: { id: 'technical_analysis', order: 3, title: { tr: 'Teknik Analiz', en: 'Technical Analysis' }, description: { tr: 'Core grafik bilgisini breakout, pullback, range, momentum, hareketli ortalama, RSI, MACD, çoklu zaman dilimi, formasyon, confluence ve indikatör sınırlarıyla genişlet.', en: 'Extend Core chart literacy with breakouts, pullbacks, ranges, momentum, moving averages, RSI, MACD, multi-timeframe analysis, patterns, confluence, and indicator limits.' }, status: 'active', lessonIds: [...TECHNICAL_ANALYSIS_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...TECHNICAL_ANALYSIS_EXPANSION_LESSONS.map((lesson) => lesson.id)] },
  fundamental_analysis: { id: 'fundamental_analysis', order: 4, title: { tr: 'Temel Analiz', en: 'Fundamental Analysis' }, description: { tr: 'Finansal tablolar, nakit, marj, borç, büyüme kalitesi, hisse başına metrikler, çarpanlar, DCF, peer karşılaştırması ve temel analizin sınırlarını birlikte öğren.', en: 'Learn financial statements, cash, margins, debt, growth quality, per-share metrics, multiples, DCF, peer comparison, and the limits of fundamental analysis together.' }, status: 'active', lessonIds: [...FUNDAMENTAL_ANALYSIS_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...FUNDAMENTAL_ANALYSIS_EXPANSION_LESSONS.map((lesson) => lesson.id)] },
  risk_portfolio: { id: 'risk_portfolio', order: 5, title: { tr: 'Risk ve Portföy', en: 'Risk and Portfolio' }, description: { tr: 'Core risk bilgisini korelasyon, drawdown, kaldıraç, yoğunlaşma, risk bütçesi, risk faktörleri, yeniden dengeleme, likidite, tail risk, stres testleri ve toparlanma matematiğiyle derinleştir.', en: 'Deepen Core risk knowledge with correlation, drawdown, leverage, concentration, risk budgets, risk factors, rebalancing, liquidity, tail risk, stress testing, and recovery math.' }, status: 'active', lessonIds: [...RISK_PORTFOLIO_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...RISK_PORTFOLIO_EXPANSION_LESSONS.map((lesson) => lesson.id)] },
  market_psychology: { id: 'market_psychology', order: 6, title: { tr: 'Piyasa Psikolojisi', en: 'Market Psychology' }, description: { tr: 'Core’daki FOMO, aşırı işlem, confirmation bias ve karar günlüğünün üzerine; kayıptan kaçınma, çapalama, recency, aşırı güven, revenge trading, sonuç yanlılığı, disposition effect, sürü davranışı, batık maliyet, availability bias, action bias ve pre-commitment öğren.', en: 'Build on Core FOMO, overtrading, confirmation bias, and decision journaling with loss aversion, anchoring, recency, overconfidence, revenge trading, outcome bias, the disposition effect, herd behavior, sunk costs, availability bias, action bias, and pre-commitment.' }, status: 'active', lessonIds: [...MARKET_PSYCHOLOGY_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...MARKET_PSYCHOLOGY_EXPANSION_LESSONS.map((lesson) => lesson.id)] },
  strategies: { id: 'strategies', order: 7, title: { tr: 'Stratejiler', en: 'Strategies' }, description: { tr: 'Amaç ve zaman ufkundan başlayarak trend following, mean reversion, breakout, momentum, swing/position, hipotez, kurallar, rejim uyumu, maliyet, strateji çeşitlendirmesi ve review disiplinini sinyal değil yöntem olarak öğren.', en: 'Learn strategy as a method rather than a signal: objective and horizon, trend following, mean reversion, breakout, momentum, swing/position, hypotheses, rules, regime fit, costs, diversification, and review discipline.' }, status: 'active', lessonIds: [...STRATEGY_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...STRATEGY_EXPANSION_LESSONS.map((lesson) => lesson.id)] },
  algo_quant: { id: 'algo_quant', order: 8, title: { tr: 'Algoritmik Trade ve Quant', en: 'Algorithmic Trading and Quant' }, description: { tr: 'Olasılık ve expectancy’den başlayarak backtest, out-of-sample, maliyet, overfitting, look-ahead, survivorship, data leakage, robustness ve otomasyon kontrollerini sistematik araştırma disiplini olarak öğren.', en: 'Learn systematic research from probability and expectancy through backtesting, out-of-sample validation, costs, overfitting, look-ahead, survivorship, data leakage, robustness, and automation controls.' }, status: 'active', lessonIds: [...ALGO_QUANT_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...ALGO_QUANT_EXPANSION_LESSONS.map((lesson) => lesson.id)] },
  smc_ict: { id: 'smc_ict', order: 9, title: { tr: 'SMC / ICT · İleri', en: 'SMC / ICT · Advanced' }, description: { tr: 'SMC/ICT etiketlerini evrensel gerçek veya sinyal gibi sunmadan; metodoloji sınırı, liquidity sweep/grab, inducement, displacement ve FVG bağlamıyla öğren.', en: 'Learn SMC/ICT without treating its labels as universal truths or signals: methodology boundaries, liquidity sweep/grab, inducement, displacement, and FVG context.' }, status: 'active', lessonIds: [...SMC_ICT_FOUNDATION_LESSONS.map((lesson) => lesson.id)] },
  asset_schools: { id: 'asset_schools', order: 10, title: { tr: 'Varlık Okulları', en: 'Asset Schools' }, description: { tr: 'Hisse, kripto, forex, emtia ve ETF için ortak temellerin üzerine varlığa özgü öğrenme yolları kur.', en: 'Build asset-specific learning paths for equities, crypto, FX, commodities, and ETFs on top of shared foundations.' }, status: 'planned', lessonIds: [] },
};

export const ACTIVE_ACADEMY_TRACKS = ACADEMY_TRACK_IDS.map((id) => ACADEMY_TRACKS[id]).filter((track) => track.status === 'active');
