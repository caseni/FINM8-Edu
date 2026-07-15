import type { CurriculumDomainId } from '../curriculum';
import type { LearningStage } from '../types';

export type LegacyMigrationAction =
  | 'retain_and_update'
  | 'split_and_rewrite'
  | 'merge_duplicates'
  | 'advanced_safety_review'
  | 'archive';

export interface LegacyCourseInventoryItem {
  readonly legacyCourseId: number;
  readonly titleTr: string;
  readonly declaredLessonCount: number;
  readonly actualLessonTitleCount: number;
  readonly moduleCount: number;
  readonly targetDomains: readonly CurriculumDomainId[];
  readonly targetStages: readonly LearningStage[];
  readonly migrationWave: 1 | 2 | 3;
  readonly primaryAction: LegacyMigrationAction;
}

/**
 * The legacy catalogue is source inventory. Counts intentionally preserve the
 * mismatches discovered during audit so migration cannot silently lose content.
 */
export const LEGACY_COURSE_INVENTORY: readonly LegacyCourseInventoryItem[] = [
  {
    legacyCourseId: 1,
    titleTr: 'Kişisel Finans',
    declaredLessonCount: 12,
    actualLessonTitleCount: 15,
    moduleCount: 5,
    targetDomains: ['financial_literacy', 'investing'],
    targetStages: ['foundation'],
    migrationWave: 2,
    primaryAction: 'split_and_rewrite',
  },
  {
    legacyCourseId: 2,
    titleTr: 'Finansal Piyasalar',
    declaredLessonCount: 18,
    actualLessonTitleCount: 17,
    moduleCount: 5,
    targetDomains: ['market_foundations', 'risk_management'],
    targetStages: ['foundation', 'intermediate'],
    migrationWave: 1,
    primaryAction: 'split_and_rewrite',
  },
  {
    legacyCourseId: 3,
    titleTr: 'Temel Ekonomi',
    declaredLessonCount: 15,
    actualLessonTitleCount: 18,
    moduleCount: 5,
    targetDomains: ['economics', 'news_macro'],
    targetStages: ['foundation', 'intermediate'],
    migrationWave: 2,
    primaryAction: 'split_and_rewrite',
  },
  {
    legacyCourseId: 4,
    titleTr: 'Temel Analiz',
    declaredLessonCount: 20,
    actualLessonTitleCount: 20,
    moduleCount: 5,
    targetDomains: ['fundamental_analysis', 'investing'],
    targetStages: ['foundation', 'intermediate', 'advanced'],
    migrationWave: 2,
    primaryAction: 'split_and_rewrite',
  },
  {
    legacyCourseId: 5,
    titleTr: 'Teknik Analiz',
    declaredLessonCount: 25,
    actualLessonTitleCount: 25,
    moduleCount: 6,
    targetDomains: ['chart_literacy', 'technical_analysis'],
    targetStages: ['foundation', 'intermediate', 'advanced'],
    migrationWave: 1,
    primaryAction: 'split_and_rewrite',
  },
  {
    legacyCourseId: 6,
    titleTr: 'Türev Piyasalar',
    declaredLessonCount: 22,
    actualLessonTitleCount: 22,
    moduleCount: 6,
    targetDomains: ['market_foundations', 'risk_management'],
    targetStages: ['advanced'],
    migrationWave: 3,
    primaryAction: 'advanced_safety_review',
  },
  {
    legacyCourseId: 7,
    titleTr: 'Risk Yönetimi',
    declaredLessonCount: 16,
    actualLessonTitleCount: 20,
    moduleCount: 6,
    targetDomains: ['risk_management', 'portfolio_management'],
    targetStages: ['foundation', 'intermediate', 'advanced'],
    migrationWave: 1,
    primaryAction: 'merge_duplicates',
  },
  {
    legacyCourseId: 8,
    titleTr: 'İşlem Psikolojisi',
    declaredLessonCount: 14,
    actualLessonTitleCount: 18,
    moduleCount: 5,
    targetDomains: ['behavior_psychology'],
    targetStages: ['foundation', 'intermediate'],
    migrationWave: 1,
    primaryAction: 'split_and_rewrite',
  },
  {
    legacyCourseId: 9,
    titleTr: 'Algoritmik İşlemler',
    declaredLessonCount: 28,
    actualLessonTitleCount: 23,
    moduleCount: 6,
    targetDomains: ['algorithmic_trading', 'probability_data'],
    targetStages: ['advanced'],
    migrationWave: 3,
    primaryAction: 'advanced_safety_review',
  },
] as const;

export const LEGACY_DECLARED_LESSON_TOTAL = 170;
export const LEGACY_ACTUAL_LESSON_TITLE_TOTAL = 178;

