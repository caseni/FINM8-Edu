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
  readonly coverageIssues: readonly string[];
  readonly issues: readonly AcademyExpansionAssessmentIssue[];
}

const EXPECTED_EXPANSION_LESSONS = 60;
const EXPECTED_EXPANSION_QUESTIONS = 180;

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
  /her zaman;\s*koşullar ve istisnalar değişse bile sonucun aynı olacağını varsaymak/i,
  /always;\s*assume the same outcome regardless of conditions or exceptions/i,
  /asla;\s*koşullar değişse bile bunun gerçekleşemeyeceğini varsaymak/i,
  /never;\s*assume it cannot occur even when conditions change/i,
];

const BINARY_PREFIX = /^(Hayır|Evet|Her zaman|Asla|No|Yes|Always|Never)[;:,]\s*(.+)$/i;

function comparable(value: string): string {
  return value.trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '').toLocaleLowerCase('tr-TR');
}

function tokens(value: string): readonly string[] {
  return comparable(value)
    .replace(/[^\p{L}\p{N}%]+/gu, ' ')
    .split(' ')
    .filter((token) => token.length > 2);
}

function isMaterialNearEcho(answer: string, explanation: string): boolean {
  const answerTokens = new Set(tokens(answer));
  const explanationTokens = new Set(tokens(explanation));
  if (answerTokens.size < 6 || explanationTokens.size < 6) return false;

  let shared = 0;
  for (const token of answerTokens) {
    if (explanationTokens.has(token)) shared += 1;
  }

  const smaller = Math.min(answerTokens.size, explanationTokens.size);
  const larger = Math.max(answerTokens.size, explanationTokens.size);
  return shared / smaller >= 0.9 && smaller / larger >= 0.75;
}

function repeatsExplanation(label: string, explanation: string): boolean {
  const match = BINARY_PREFIX.exec(label.trim());
  const candidates = match ? [match[2], label] : [label];
  return candidates.some(
    (candidate) =>
      comparable(candidate) === comparable(explanation) || isMaterialNearEcho(candidate, explanation),
  );
}

function isPlaceholder(value: string): boolean {
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value));
}

export function getAcademyExpansionAssessmentReport(): AcademyExpansionAssessmentReport {
  const catalogById = new Map(MICRO_LESSON_CATALOG.map((lesson) => [lesson.id, lesson]));
  const coverageIssues: string[] = [];
  const issues: AcademyExpansionAssessmentIssue[] = [];
  let expansionLessonCount = 0;
  let questionCount = 0;

  for (const trackId of ACADEMY_TRACK_IDS) {
    for (const stub of EXPANSION_LESSONS[trackId]) {
      const lesson = catalogById.get(stub.id);
      if (!lesson) {
        coverageIssues.push(`${trackId} ${stub.id}: rendered expansion lesson missing from catalog`);
        continue;
      }
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
            if (repeatsExplanation(label, explanation)) {
              issues.push({
                trackId,
                lessonId: lesson.id,
                targetId: question.id,
                optionId: correct.id,
                reason: 'explanation_echo',
                detail: `correct option materially repeats the ${language} explanation`,
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

  if (expansionLessonCount !== EXPECTED_EXPANSION_LESSONS) {
    coverageIssues.push(
      `expected ${EXPECTED_EXPANSION_LESSONS} rendered expansion lessons, found ${expansionLessonCount}`,
    );
  }
  if (questionCount !== EXPECTED_EXPANSION_QUESTIONS) {
    coverageIssues.push(
      `expected ${EXPECTED_EXPANSION_QUESTIONS} expansion quiz questions, found ${questionCount}`,
    );
  }

  return { expansionLessonCount, questionCount, coverageIssues, issues };
}
