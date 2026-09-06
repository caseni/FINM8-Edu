import { ACADEMY_TRACK_IDS } from './academyTracks';
import { MICRO_LESSON_CATALOG } from './catalog';
import { ALGO_QUANT_EXPANSION_LESSONS } from './examples/academy/algoQuantExpansionLessons';
import { ASSET_SCHOOL_EXPANSION_LESSONS } from './examples/academy/assetSchoolExpansionLessons';
import { ECONOMY_EXPANSION_LESSONS } from './examples/academy/economyExpansionLessons';
import { FINANCIAL_MARKETS_EXPANSION_LESSONS } from './examples/academy/financialMarketsExpansionLessons';
import { FUNDAMENTAL_ANALYSIS_EXPANSION_LESSONS } from './examples/academy/fundamentalAnalysisExpansionLessons';
import { MARKET_PSYCHOLOGY_EXPANSION_LESSONS } from './examples/academy/marketPsychologyExpansionLessons';
import { RISK_PORTFOLIO_EXPANSION_LESSONS } from './examples/academy/riskPortfolioExpansionLessons';
import { SMC_ICT_EXPANSION_LESSONS } from './examples/academy/smcIctExpansionLessons';
import { STRATEGY_EXPANSION_LESSONS } from './examples/academy/strategyExpansionLessons';
import { TECHNICAL_ANALYSIS_EXPANSION_LESSONS } from './examples/academy/technicalAnalysisExpansionLessons';
import type { AcademyTrackId } from './academyTracks';
import type { MicroLesson } from './types';

export type AcademyExpansionAssessmentReason = 'explanation_echo' | 'placeholder_option';

export interface AcademyExpansionAssessmentIssue {
  readonly trackId: AcademyTrackId;
  readonly lessonId: string;
  readonly targetId: string;
  readonly optionId: string;
  readonly reason: AcademyExpansionAssessmentReason;
  readonly detail: string;
}

export interface AcademyExpansionAssessmentReport {
  readonly expansionLessonCount: number;
  readonly questionCount: number;
  readonly issues: readonly AcademyExpansionAssessmentIssue[];
}

const EXPANSION_LESSONS: Readonly<Record<AcademyTrackId, readonly MicroLesson[]>> = {
  economy: ECONOMY_EXPANSION_LESSONS,
  financial_markets: FINANCIAL_MARKETS_EXPANSION_LESSONS,
  technical_analysis: TECHNICAL_ANALYSIS_EXPANSION_LESSONS,
  fundamental_analysis: FUNDAMENTAL_ANALYSIS_EXPANSION_LESSONS,
  risk_portfolio: RISK_PORTFOLIO_EXPANSION_LESSONS,
  market_psychology: MARKET_PSYCHOLOGY_EXPANSION_LESSONS,
  strategies: STRATEGY_EXPANSION_LESSONS,
  algo_quant: ALGO_QUANT_EXPANSION_LESSONS,
  smc_ict: SMC_ICT_EXPANSION_LESSONS,
  asset_schools: ASSET_SCHOOL_EXPANSION_LESSONS,
};

const PLACEHOLDER_PATTERNS: readonly RegExp[] = [
  /marka görünümünü ekonomik veya teknik mekanizmadan/i,
  /branding appearance as more important than the economic or technical mechanism/i,
  /bu unsurun sonuç veya yorum üzerinde anlamlı etkisi/i,
  /assume this factor has no meaningful effect on the outcome/i,
  /bu ilişkiyi bağlamdan bağımsız ve kesin bir kural/i,
  /treat the relationship as a certain rule regardless of context/i,
  /yüzeysel görsel biçimi kavramın ana nedeni/i,
  /superficial visual appearance as the main cause/i,
];

const BINARY_PREFIX = /^(Hayır|Evet|Her zaman|Asla|No|Yes|Always|Never)[;:,]\s*(.+)$/i;

function comparable(value: string): string {
  return value.trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '').toLocaleLowerCase('tr-TR');
}

function isPlaceholder(value: string): boolean {
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value));
}

export function getAcademyExpansionAssessmentReport(): AcademyExpansionAssessmentReport {
  const catalogById = new Map(MICRO_LESSON_CATALOG.map((lesson) => [lesson.id, lesson]));
  const issues: AcademyExpansionAssessmentIssue[] = [];
  let expansionLessonCount = 0;
  let questionCount = 0;

  for (const trackId of ACADEMY_TRACK_IDS) {
    for (const stub of EXPANSION_LESSONS[trackId]) {
      const lesson = catalogById.get(stub.id);
      if (!lesson) continue;
      expansionLessonCount += 1;

      for (const question of lesson.quiz.questions) {
        questionCount += 1;
        const correct = question.options.find((option) => option.id === question.correctOptionId);

        if (correct) {
          for (const [language, label, explanation] of [
            ['tr', correct.label.tr, question.explanation.tr],
            ['en', correct.label.en, question.explanation.en],
          ] as const) {
            if (!label || !explanation) continue;
            const match = BINARY_PREFIX.exec(label.trim());
            if (match && comparable(match[2]) === comparable(explanation)) {
              issues.push({
                trackId,
                lessonId: lesson.id,
                targetId: question.id,
                optionId: correct.id,
                reason: 'explanation_echo',
                detail: `correct option repeats the ${language} explanation verbatim`,
              });
            }
          }
        }

        for (const option of question.options) {
          if (isPlaceholder(option.label.tr) || isPlaceholder(option.label.en ?? '')) {
            issues.push({
              trackId,
              lessonId: lesson.id,
              targetId: question.id,
              optionId: option.id,
              reason: 'placeholder_option',
              detail: 'generic substitution copy is visible as a quiz option',
            });
          }
        }
      }

      for (const choice of lesson.practicalTask.choices ?? []) {
        if (isPlaceholder(choice.label.tr) || isPlaceholder(choice.label.en ?? '')) {
          issues.push({
            trackId,
            lessonId: lesson.id,
            targetId: lesson.practicalTask.id,
            optionId: choice.id,
            reason: 'placeholder_option',
            detail: 'generic substitution copy is visible as a practical-task choice',
          });
        }
      }
    }
  }

  return { expansionLessonCount, questionCount, issues };
}
