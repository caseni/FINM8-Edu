import type { LocalizedText } from './types';
import { ALGO_QUANT_EXPANSION_LESSONS } from './examples/academy/algoQuantExpansionLessons';
import { ALGO_QUANT_FOUNDATION_LESSONS } from './examples/academy/algoQuantFoundationLessons';
import { ASSET_SCHOOL_EXPANSION_LESSONS } from './examples/academy/assetSchoolExpansionLessons';
import { ASSET_SCHOOL_FOUNDATION_LESSONS } from './examples/academy/assetSchoolFoundationLessons';
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
import { SMC_ICT_EXPANSION_LESSONS } from './examples/academy/smcIctExpansionLessons';
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
  economy: {
    id: 'economy', order: 1,
    title: { tr: 'Ekonomiyi Anla', en: 'Understand the Economy' },
    description: { tr: 'Para, faiz ve ekonomik değişimlerin günlük hayatı ve piyasaları nasıl etkilediğini adım adım derinleştir.', en: 'Go deeper into how money, interest rates, and economic changes affect everyday life and markets.' },
    status: 'active', lessonIds: [...ECONOMY_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...ECONOMY_EXPANSION_LESSONS.map((lesson) => lesson.id)],
  },
  financial_markets: {
    id: 'financial_markets', order: 2,
    title: { tr: 'Piyasaları Anla', en: 'Understand Markets' },
    description: { tr: 'Borsa, fon, tahvil, döviz, emtia ve kripto gibi piyasaların nasıl çalıştığını ürün ürün öğren.', en: 'Learn how exchanges, funds, bonds, currencies, commodities, and crypto markets work, one product at a time.' },
    status: 'active', lessonIds: [...FINANCIAL_MARKETS_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...FINANCIAL_MARKETS_EXPANSION_LESSONS.map((lesson) => lesson.id)],
  },
  technical_analysis: {
    id: 'technical_analysis', order: 3,
    title: { tr: 'Grafikleri Derinleştir', en: 'Go Deeper Into Charts' },
    description: { tr: 'Seviyelerin, geri çekilmelerin, göstergelerin ve farklı zaman ölçeklerinin grafikte ne anlattığını adım adım derinleştir.', en: 'Go deeper into what levels, pullbacks, indicators, and different time scales can tell you on a chart.' },
    status: 'active', lessonIds: [...TECHNICAL_ANALYSIS_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...TECHNICAL_ANALYSIS_EXPANSION_LESSONS.map((lesson) => lesson.id)],
  },
  fundamental_analysis: {
    id: 'fundamental_analysis', order: 4,
    title: { tr: 'Şirketleri Anla', en: 'Understand Companies' },
    description: { tr: 'Bir şirketin satışını, kârını, borcunu, nakdini ve değerini nasıl okuyacağını adım adım öğren.', en: 'Learn step by step how to read a company’s sales, profit, debt, cash, and value.' },
    status: 'active', lessonIds: [...FUNDAMENTAL_ANALYSIS_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...FUNDAMENTAL_ANALYSIS_EXPANSION_LESSONS.map((lesson) => lesson.id)],
  },
  risk_portfolio: {
    id: 'risk_portfolio', order: 5,
    title: { tr: 'Risk ve Portföy', en: 'Risk and Portfolio' },
    description: { tr: 'Yatırımların birlikte nasıl risk taşıdığını, kayıpları sınırlamayı ve portföyü daha dayanıklı kurmayı öğren.', en: 'Learn how investments carry risk together, how to limit losses, and how to build a more resilient portfolio.' },
    status: 'active', lessonIds: [...RISK_PORTFOLIO_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...RISK_PORTFOLIO_EXPANSION_LESSONS.map((lesson) => lesson.id)],
  },
  market_psychology: {
    id: 'market_psychology', order: 6,
    title: { tr: 'Karar Psikolojisi', en: 'Decision Psychology' },
    description: { tr: 'Korku, acele, aşırı güven ve geçmiş kararlara takılmanın finansal kararlarını nasıl etkileyebileceğini fark et.', en: 'Notice how fear, urgency, overconfidence, and attachment to past decisions can affect financial choices.' },
    status: 'active', lessonIds: [...MARKET_PSYCHOLOGY_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...MARKET_PSYCHOLOGY_EXPANSION_LESSONS.map((lesson) => lesson.id)],
  },
  strategies: {
    id: 'strategies', order: 7,
    title: { tr: 'Yöntemler ve Planlar', en: 'Methods and Plans' },
    description: { tr: 'Farklı yatırım yöntemlerinin hangi koşulda neyi amaçladığını, nasıl kurallara bağlandığını ve nerede zorlandığını öğren.', en: 'Learn what different investment methods try to do, how they use rules, and where they can struggle.' },
    status: 'active', lessonIds: [...STRATEGY_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...STRATEGY_EXPANSION_LESSONS.map((lesson) => lesson.id)],
  },
  algo_quant: {
    id: 'algo_quant', order: 8,
    title: { tr: 'Sistematik ve Sayısal Yaklaşımlar', en: 'Systematic and Quantitative Methods' },
    description: { tr: 'Kurallı fikirleri geçmiş veride test etmeyi, sonuçların ne kadar güvenilir olduğunu ve otomasyonun sınırlarını öğren.', en: 'Learn how rule-based ideas are tested on historical data, how reliable results may be, and where automation has limits.' },
    status: 'active', lessonIds: [...ALGO_QUANT_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...ALGO_QUANT_EXPANSION_LESSONS.map((lesson) => lesson.id)],
  },
  smc_ict: {
    id: 'smc_ict', order: 9,
    title: { tr: 'İleri Grafik Yaklaşımları', en: 'Advanced Chart Approaches' },
    description: { tr: 'SMC / ICT gibi ileri grafik yaklaşımlarındaki kavramları kesin gerçek veya sinyal gibi görmeden, yöntem ve sınırlarıyla birlikte incele.', en: 'Explore concepts used in advanced chart approaches such as SMC / ICT without treating them as certain truths or signals.' },
    status: 'active', lessonIds: [...SMC_ICT_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...SMC_ICT_EXPANSION_LESSONS.map((lesson) => lesson.id)],
  },
  asset_schools: {
    id: 'asset_schools', order: 10,
    title: { tr: 'Varlık Türlerini Anla', en: 'Understand Asset Types' },
    description: { tr: 'Hisse, ETF, döviz, emtia ve kriptonun kendine özgü çalışma ve risk farklarını karşılaştırarak öğren.', en: 'Compare the unique mechanics and risks of stocks, ETFs, currencies, commodities, and crypto.' },
    status: 'active', lessonIds: [...ASSET_SCHOOL_FOUNDATION_LESSONS.map((lesson) => lesson.id), ...ASSET_SCHOOL_EXPANSION_LESSONS.map((lesson) => lesson.id)],
  },
};

export const ACTIVE_ACADEMY_TRACKS = ACADEMY_TRACK_IDS.map((id) => ACADEMY_TRACKS[id]).filter((track) => track.status === 'active');
