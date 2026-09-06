import { ACADEMY_TRACK_IDS } from './academyTracks';
import { MICRO_LESSON_CATALOG } from './catalog';
import { ALGO_QUANT_FOUNDATION_LESSONS } from './examples/academy/algoQuantFoundationLessons';
import { ASSET_SCHOOL_FOUNDATION_LESSONS } from './examples/academy/assetSchoolFoundationLessons';
import { ECONOMY_FOUNDATION_LESSONS } from './examples/academy/economyFoundationsLessons';
import { FINANCIAL_MARKETS_FOUNDATION_LESSONS } from './examples/academy/financialMarketsFoundationLessons';
import { FUNDAMENTAL_ANALYSIS_FOUNDATION_LESSONS } from './examples/academy/fundamentalAnalysisFoundationLessons';
import { MARKET_PSYCHOLOGY_FOUNDATION_LESSONS } from './examples/academy/marketPsychologyFoundationLessons';
import { RISK_PORTFOLIO_FOUNDATION_LESSONS } from './examples/academy/riskPortfolioFoundationLessons';
import { SMC_ICT_FOUNDATION_LESSONS } from './examples/academy/smcIctFoundationLessons';
import { STRATEGY_FOUNDATION_LESSONS } from './examples/academy/strategyFoundationLessons';
import { TECHNICAL_ANALYSIS_FOUNDATION_LESSONS } from './examples/academy/technicalAnalysisFoundationLessons';
import type { AcademyTrackId } from './academyTracks';
import type { MicroLesson } from './types';

/**
 * Regression guard for two assessment failure modes that reached Academy foundation
 * lessons through generic normalizer templating.
 *
 * `explanation_echo`: the correct option label repeats the question explanation verbatim.
 * The option then stands out as the only reasoned sentence among throwaway alternatives,
 * and the explanation shown after answering adds nothing the learner has not just read.
 *
 * `placeholder_option`: generic substitution copy reached a live option or task choice.
 * That copy carries pronouns ("bu unsur", "bu ilişki") with no antecedent in the stem and
 * a grammatical form that does not answer the question being asked.
 *
 * Scope is Academy foundation only, matching the layer this guard protects.
 */

export type AcademyFoundationAssessmentReason = 'explanation_echo' | 'placeholder_option';

export interface AcademyFoundationAssessmentIssue {
  readonly trackId: AcademyTrackId;
  readonly lessonId: string;
  readonly targetId: string;
  readonly optionId: string;
  readonly reason: AcademyFoundationAssessmentReason;
  readonly detail: string;
}

export interface AcademyFoundationAssessmentReport {
  readonly foundationLessonCount: number;
  readonly questionCount: number;
  readonly issues: readonly AcademyFoundationAssessmentIssue[];
}

const FOUNDATION_LESSONS: Readonly<Record<AcademyTrackId, readonly MicroLesson[]>> = {
  economy: ECONOMY_FOUNDATION_LESSONS,
  financial_markets: FINANCIAL_MARKETS_FOUNDATION_LESSONS,
  technical_analysis: TECHNICAL_ANALYSIS_FOUNDATION_LESSONS,
  fundamental_analysis: FUNDAMENTAL_ANALYSIS_FOUNDATION_LESSONS,
  risk_portfolio: RISK_PORTFOLIO_FOUNDATION_LESSONS,
  market_psychology: MARKET_PSYCHOLOGY_FOUNDATION_LESSONS,
  strategies: STRATEGY_FOUNDATION_LESSONS,
  algo_quant: ALGO_QUANT_FOUNDATION_LESSONS,
  smc_ict: SMC_ICT_FOUNDATION_LESSONS,
  asset_schools: ASSET_SCHOOL_FOUNDATION_LESSONS,
};

/** Generic substitution copy that must never reach a learner-visible option. */
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

export function getAcademyFoundationAssessmentReport(): AcademyFoundationAssessmentReport {
  const catalogById = new Map(MICRO_LESSON_CATALOG.map((lesson) => [lesson.id, lesson]));
  const issues: AcademyFoundationAssessmentIssue[] = [];
  let foundationLessonCount = 0;
  let questionCount = 0;

  for (const trackId of ACADEMY_TRACK_IDS) {
    for (const stub of FOUNDATION_LESSONS[trackId]) {
      const lesson = catalogById.get(stub.id);
      if (!lesson) continue;
      foundationLessonCount += 1;

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

  return { foundationLessonCount, questionCount, issues };
}
