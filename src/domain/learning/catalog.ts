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

export const MICRO_LESSON_CATALOG: readonly MicroLesson[] = [
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
  ...RISK_PORTFOLIO_FOUNDATION_LESSONS,
  ...RISK_PORTFOLIO_EXPANSION_LESSONS,
  ...MARKET_PSYCHOLOGY_FOUNDATION_LESSONS,
  ...MARKET_PSYCHOLOGY_EXPANSION_LESSONS,
  ...STRATEGY_FOUNDATION_LESSONS,
  ...STRATEGY_EXPANSION_LESSONS,
  ...ALGO_QUANT_FOUNDATION_LESSONS,
  ...ALGO_QUANT_EXPANSION_LESSONS,
  ...SMC_ICT_FOUNDATION_LESSONS,
  ...SMC_ICT_EXPANSION_LESSONS,
  ...ASSET_SCHOOL_FOUNDATION_LESSONS,
  ...ASSET_SCHOOL_EXPANSION_LESSONS,
];

export function getMicroLessonById(lessonId: string): MicroLesson | undefined {
  return MICRO_LESSON_CATALOG.find((lesson) => lesson.id === lessonId);
}

export const MICRO_LESSON_CATALOG_INTEGRITY = validateLearningCatalog(MICRO_LESSON_CATALOG);
