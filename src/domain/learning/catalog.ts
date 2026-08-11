import { normalizeAssessmentSignalQuality } from './assessmentSignalQuality';
import { normalizeAlgoQuantAssessmentQuality } from './examples/academy/algoQuantAssessmentQuality';
import { ALGO_QUANT_EXPANSION_LESSONS } from './examples/academy/algoQuantExpansionLessons';
import { ALGO_QUANT_FOUNDATION_LESSONS } from './examples/academy/algoQuantFoundationLessons';
import { normalizeAssetSchoolAssessmentQuality } from './examples/academy/assetSchoolAssessmentQuality';
import { ASSET_SCHOOL_EXPANSION_LESSONS } from './examples/academy/assetSchoolExpansionLessons';
import { ASSET_SCHOOL_FOUNDATION_LESSONS } from './examples/academy/assetSchoolFoundationLessons';
import { ECONOMY_EXPANSION_LESSONS } from './examples/academy/economyExpansionLessons';
import { ECONOMY_FOUNDATION_LESSONS } from './examples/academy/economyFoundationsLessons';
import { FINANCIAL_MARKETS_EXPANSION_LESSONS } from './examples/academy/financialMarketsExpansionLessons';
import { FINANCIAL_MARKETS_FOUNDATION_LESSONS } from './examples/academy/financialMarketsFoundationLessons';
import { FUNDAMENTAL_ANALYSIS_EXPANSION_LESSONS } from './examples/academy/fundamentalAnalysisExpansionLessons';
import { FUNDAMENTAL_ANALYSIS_FOUNDATION_LESSONS } from './examples/academy/fundamentalAnalysisFoundationLessons';
import { normalizeMarketPsychologyAssessmentQuality } from './examples/academy/marketPsychologyAssessmentQuality';
import { MARKET_PSYCHOLOGY_EXPANSION_LESSONS } from './examples/academy/marketPsychologyExpansionLessons';
import { MARKET_PSYCHOLOGY_FOUNDATION_LESSONS } from './examples/academy/marketPsychologyFoundationLessons';
import { normalizeRiskPortfolioAssessmentQuality } from './examples/academy/riskPortfolioAssessmentQuality';
import { RISK_PORTFOLIO_EXPANSION_LESSONS } from './examples/academy/riskPortfolioExpansionLessons';
import { RISK_PORTFOLIO_FOUNDATION_LESSONS } from './examples/academy/riskPortfolioFoundationLessons';
import { normalizeSmcIctAssessmentQuality } from './examples/academy/smcIctAssessmentQuality';
import { SMC_ICT_EXPANSION_LESSONS } from './examples/academy/smcIctExpansionLessons';
import { SMC_ICT_FOUNDATION_LESSONS } from './examples/academy/smcIctFoundationLessons';
import { normalizeStrategyAssessmentQuality } from './examples/academy/strategyAssessmentQuality';
import { STRATEGY_EXPANSION_LESSONS } from './examples/academy/strategyExpansionLessons';
import { STRATEGY_FOUNDATION_LESSONS } from './examples/academy/strategyFoundationLessons';
import { TECHNICAL_ANALYSIS_EXPANSION_LESSONS } from './examples/academy/technicalAnalysisExpansionLessons';
import { TECHNICAL_ANALYSIS_FOUNDATION_LESSONS } from './examples/academy/technicalAnalysisFoundationLessons';
import { WAVE1_MARKET_FOUNDATION_LESSONS } from './examples/wave1/marketFoundationsLessons';
import { normalizeMarketFoundationAssessmentQuality } from './examples/wave1/marketFoundationAssessmentQuality';
import { normalizeChartFoundationAssessmentQuality } from './examples/wave1/chartFoundationAssessmentQuality';
import { normalizeRiskAssessmentQuality } from './examples/wave1/riskAssessmentQuality';
import { normalizeBehaviorEvidenceAssessmentQuality } from './examples/wave1/behaviorEvidenceAssessmentQuality';
import { WAVE1_CHART_LITERACY_CORE_LESSONS, WAVE1_MARKET_STRUCTURE_LESSONS } from './examples/wave1/levelledLessonGroups';
import { WAVE1_RISK_MANAGEMENT_LESSONS } from './examples/wave1/riskManagementLessons';
import { WAVE1_BEHAVIOR_EVIDENCE_LESSONS } from './examples/wave1/behaviorEvidenceLessons';
import type { MicroLesson } from './types';
import { validateLearningCatalog } from './catalogIntegrity';

const MICRO_LESSON_CANDIDATES: readonly MicroLesson[] = [
  ...WAVE1_MARKET_FOUNDATION_LESSONS.map(normalizeMarketFoundationAssessmentQuality),
  ...WAVE1_CHART_LITERACY_CORE_LESSONS.map(normalizeChartFoundationAssessmentQuality),
  ...WAVE1_MARKET_STRUCTURE_LESSONS,
  ...WAVE1_RISK_MANAGEMENT_LESSONS.map(normalizeRiskAssessmentQuality),
  ...WAVE1_BEHAVIOR_EVIDENCE_LESSONS.map(normalizeBehaviorEvidenceAssessmentQuality),
  ...ECONOMY_FOUNDATION_LESSONS,
  ...ECONOMY_EXPANSION_LESSONS,
  ...FINANCIAL_MARKETS_FOUNDATION_LESSONS,
  ...FINANCIAL_MARKETS_EXPANSION_LESSONS,
  ...TECHNICAL_ANALYSIS_FOUNDATION_LESSONS,
  ...TECHNICAL_ANALYSIS_EXPANSION_LESSONS,
  ...FUNDAMENTAL_ANALYSIS_FOUNDATION_LESSONS,
  ...FUNDAMENTAL_ANALYSIS_EXPANSION_LESSONS,
  ...RISK_PORTFOLIO_FOUNDATION_LESSONS.map(normalizeRiskPortfolioAssessmentQuality),
  ...RISK_PORTFOLIO_EXPANSION_LESSONS.map(normalizeRiskPortfolioAssessmentQuality),
  ...MARKET_PSYCHOLOGY_FOUNDATION_LESSONS.map(normalizeMarketPsychologyAssessmentQuality),
  ...MARKET_PSYCHOLOGY_EXPANSION_LESSONS.map(normalizeMarketPsychologyAssessmentQuality),
  ...STRATEGY_FOUNDATION_LESSONS.map(normalizeStrategyAssessmentQuality),
  ...STRATEGY_EXPANSION_LESSONS.map(normalizeStrategyAssessmentQuality),
  ...ALGO_QUANT_FOUNDATION_LESSONS.map(normalizeAlgoQuantAssessmentQuality),
  ...ALGO_QUANT_EXPANSION_LESSONS.map(normalizeAlgoQuantAssessmentQuality),
  ...SMC_ICT_FOUNDATION_LESSONS.map(normalizeSmcIctAssessmentQuality),
  ...SMC_ICT_EXPANSION_LESSONS.map(normalizeSmcIctAssessmentQuality),
  ...ASSET_SCHOOL_FOUNDATION_LESSONS.map(normalizeAssetSchoolAssessmentQuality),
  ...ASSET_SCHOOL_EXPANSION_LESSONS.map(normalizeAssetSchoolAssessmentQuality),
];

export const MICRO_LESSON_CATALOG: readonly MicroLesson[] =
  MICRO_LESSON_CANDIDATES.map(normalizeAssessmentSignalQuality);

export function getMicroLessonById(lessonId: string): MicroLesson | undefined {
  return MICRO_LESSON_CATALOG.find((lesson) => lesson.id === lessonId);
}

export const MICRO_LESSON_CATALOG_INTEGRITY = validateLearningCatalog(MICRO_LESSON_CATALOG);
