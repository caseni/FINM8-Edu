import { z } from 'zod';
import { learningConceptKeySchema } from './schemas';
import {
  CURRENT_QUIZ_EVIDENCE_DIMENSIONS,
  CURRENT_QUIZ_TRACKS,
  type CurrentQuizEvidenceDimension,
  type CurrentQuizTrackId,
} from './currentQuizReadiness';
import type { LearningConceptKey, LocalizedText } from './types';

const currentQuizTrackIdSchema = z.enum([
  'daily_basics',
  'market_context',
  'chart_context',
  'risk_context',
  'multi_evidence',
]);

const currentQuizEvidenceDimensionSchema = z.enum(
  CURRENT_QUIZ_EVIDENCE_DIMENSIONS
);

/**
 * A privacy-safe learning event. It records only declared curriculum evidence;
 * it must not contain portfolio, income, profit/loss, or personality fields.
 */
export const currentQuizAnswerEvidenceSchema = z
  .object({
    id: z.string().trim().min(1).max(160),
    questionId: z.string().trim().min(1).max(120),
    trackId: currentQuizTrackIdSchema,
    conceptKey: learningConceptKeySchema,
    evidenceDimensions: z
      .array(currentQuizEvidenceDimensionSchema)
      .min(1)
      .max(CURRENT_QUIZ_EVIDENCE_DIMENSIONS.length),
    correct: z.boolean(),
    answeredAt: z.string().datetime({ offset: true }),
    contentVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    evidenceRefs: z.array(z.string().trim().min(1).max(120)).min(1).max(12),
  })
  .strict();

export type CurrentQuizAnswerEvidence = z.infer<
  typeof currentQuizAnswerEvidenceSchema
>;

export type CurrentQuizDimensionStatus =
  | 'collecting'
  | 'review_recommended'
  | 'developing'
  | 'consistent';

export interface CurrentQuizDimensionSummary {
  readonly dimension: CurrentQuizEvidenceDimension;
  readonly status: CurrentQuizDimensionStatus;
  readonly sufficientEvidence: boolean;
  readonly accuracy?: number;
  readonly latestAcceptedAnswerAt?: string;
  readonly answerCount: number;
  readonly distinctQuestionCount: number;
  readonly distinctDayCount: number;
  readonly remainingAnswerCount: number;
  readonly remainingQuestionCount: number;
  readonly remainingDayCount: number;
}

export interface CurrentQuizConceptSummary {
  readonly conceptKey: LearningConceptKey;
  readonly status: CurrentQuizDimensionStatus;
  readonly sufficientEvidence: boolean;
  readonly accuracy?: number;
  readonly latestAcceptedAnswerAt?: string;
  readonly answerCount: number;
  readonly distinctQuestionCount: number;
  readonly distinctDayCount: number;
  readonly remainingAnswerCount: number;
  readonly remainingQuestionCount: number;
  readonly remainingDayCount: number;
}

export interface CurrentQuizLearningGainSummary {
  readonly evidenceStatus: 'collecting' | 'repeat_evidence_available';
  readonly acceptedAnswerCount: number;
  readonly dimensions: readonly CurrentQuizDimensionSummary[];
  readonly concepts: readonly CurrentQuizConceptSummary[];
  readonly consistentDimensionIds: readonly CurrentQuizEvidenceDimension[];
  readonly reviewDimensionIds: readonly CurrentQuizEvidenceDimension[];
  readonly reviewConceptKeys: readonly LearningConceptKey[];
  readonly priorityReviewDimensionId?: CurrentQuizEvidenceDimension;
  readonly priorityReviewConceptKey?: LearningConceptKey;
}

export const CURRENT_QUIZ_GAIN_THRESHOLDS = {
  minimumAnswers: 4,
  minimumDistinctQuestions: 3,
  minimumDistinctDays: 2,
  reviewBelow: 60,
  consistentAtOrAbove: 80,
} as const;

export const CURRENT_QUIZ_STATUS_LABELS: Readonly<
  Record<CurrentQuizDimensionStatus, LocalizedText>
> = {
  collecting: {
    tr: 'Kanıt birikiyor',
    en: 'Collecting evidence',
  },
  review_recommended: {
    tr: 'Kısa tekrar öneriliyor',
    en: 'Short review recommended',
  },
  developing: {
    tr: 'Gelişiyor',
    en: 'Developing',
  },
  consistent: {
    tr: 'Tutarlı',
    en: 'Consistent',
  },
};

export const CURRENT_QUIZ_REVIEW_GUIDANCE: Readonly<
  Record<CurrentQuizEvidenceDimension, LocalizedText>
> = {
  concept_application: {
    tr: 'Kavramı farklı güncel örneklerle yeniden uygula.',
    en: 'Apply the concept again with different current examples.',
  },
  chart_interpretation: {
    tr: 'Mini grafikte yalnız görülebilen yapıyı önce işaretle.',
    en: 'First mark only the structure visible on the mini chart.',
  },
  observation_interpretation_separation: {
    tr: 'Gözlemi, yorumdan ve olası sonuçtan ayrı yaz.',
    en: 'State the observation separately from interpretation and possible outcome.',
  },
  source_and_freshness: {
    tr: 'Kaynak, yayın zamanı ve veri zamanını birlikte kontrol et.',
    en: 'Check the source, publication time, and data timestamp together.',
  },
  risk_and_uncertainty: {
    tr: 'Kesin sonuç yerine belirsizliği ve eksik kanıtı belirt.',
    en: 'State uncertainty and missing evidence instead of a certain outcome.',
  },
  delayed_retention: {
    tr: 'Kavramı kısa aralıklı tekrarlarla yeniden hatırla.',
    en: 'Recall the concept again through short spaced reviews.',
  },
};

function utcLearningDay(answeredAt: string): string {
  return answeredAt.slice(0, 10);
}

/**
 * Keeps only the latest answer for the same question on the same UTC day.
 * Repeating one item in one sitting therefore cannot inflate evidence volume.
 */
function deduplicateSameDayQuestionAttempts(
  evidence: readonly CurrentQuizAnswerEvidence[]
): CurrentQuizAnswerEvidence[] {
  const latestByQuestionAndDay = new Map<string, CurrentQuizAnswerEvidence>();

  evidence.forEach((item) => {
    const key = `${item.questionId}:${utcLearningDay(item.answeredAt)}`;
    const existing = latestByQuestionAndDay.get(key);
    if (!existing || item.answeredAt > existing.answeredAt) {
      latestByQuestionAndDay.set(key, item);
    }
  });

  return [...latestByQuestionAndDay.values()].sort((a, b) =>
    a.answeredAt.localeCompare(b.answeredAt)
  );
}

function summarizeDimension(
  dimension: CurrentQuizEvidenceDimension,
  evidence: readonly CurrentQuizAnswerEvidence[]
): CurrentQuizDimensionSummary {
  const relevant = evidence.filter((item) =>
    item.evidenceDimensions.includes(dimension)
  );
  return {
    dimension,
    ...summarizeEvidence(relevant),
  };
}

function summarizeConcept(
  conceptKey: LearningConceptKey,
  evidence: readonly CurrentQuizAnswerEvidence[]
): CurrentQuizConceptSummary {
  const relevant = evidence.filter((item) => item.conceptKey === conceptKey);
  return {
    conceptKey,
    ...summarizeEvidence(relevant),
  };
}

function summarizeEvidence(
  relevant: readonly CurrentQuizAnswerEvidence[]
): Omit<CurrentQuizDimensionSummary, 'dimension'> {
  const distinctQuestionCount = new Set(
    relevant.map((item) => item.questionId)
  ).size;
  const distinctDayCount = new Set(
    relevant.map((item) => utcLearningDay(item.answeredAt))
  ).size;
  const sufficientEvidence =
    relevant.length >= CURRENT_QUIZ_GAIN_THRESHOLDS.minimumAnswers &&
    distinctQuestionCount >=
      CURRENT_QUIZ_GAIN_THRESHOLDS.minimumDistinctQuestions &&
    distinctDayCount >= CURRENT_QUIZ_GAIN_THRESHOLDS.minimumDistinctDays;
  const accuracy =
    relevant.length > 0
      ? Math.round(
          (relevant.filter((item) => item.correct).length / relevant.length) *
            100
        )
      : undefined;

  let status: CurrentQuizDimensionStatus = 'collecting';
  if (sufficientEvidence && accuracy !== undefined) {
    status =
      accuracy < CURRENT_QUIZ_GAIN_THRESHOLDS.reviewBelow
        ? 'review_recommended'
        : accuracy >= CURRENT_QUIZ_GAIN_THRESHOLDS.consistentAtOrAbove
          ? 'consistent'
          : 'developing';
  }

  return {
    status,
    sufficientEvidence,
    accuracy: sufficientEvidence ? accuracy : undefined,
    latestAcceptedAnswerAt: relevant.at(-1)?.answeredAt,
    answerCount: relevant.length,
    distinctQuestionCount,
    distinctDayCount,
    remainingAnswerCount: Math.max(
      0,
      CURRENT_QUIZ_GAIN_THRESHOLDS.minimumAnswers - relevant.length
    ),
    remainingQuestionCount: Math.max(
      0,
      CURRENT_QUIZ_GAIN_THRESHOLDS.minimumDistinctQuestions -
        distinctQuestionCount
    ),
    remainingDayCount: Math.max(
      0,
      CURRENT_QUIZ_GAIN_THRESHOLDS.minimumDistinctDays - distinctDayCount
    ),
  };
}

export function getCurrentQuizLearningGainSummary(
  input: readonly CurrentQuizAnswerEvidence[]
): CurrentQuizLearningGainSummary {
  const parsed = input.map((item) => currentQuizAnswerEvidenceSchema.parse(item));
  const uniqueById = [
    ...new Map(parsed.map((item) => [item.id, item])).values(),
  ];
  const acceptedEvidence = deduplicateSameDayQuestionAttempts(uniqueById);
  const dimensions = CURRENT_QUIZ_EVIDENCE_DIMENSIONS.map((dimension) =>
    summarizeDimension(dimension, acceptedEvidence)
  );
  const concepts = [
    ...new Set(acceptedEvidence.map((item) => item.conceptKey)),
  ].map((conceptKey) => summarizeConcept(conceptKey, acceptedEvidence));
  const consistentDimensionIds = dimensions
    .filter((item) => item.status === 'consistent')
    .map((item) => item.dimension);
  const reviewDimensions = dimensions
    .filter(
      (
        item
      ): item is CurrentQuizDimensionSummary & { readonly accuracy: number } =>
        item.status === 'review_recommended' && item.accuracy !== undefined
    )
    .sort((a, b) => a.accuracy - b.accuracy);
  const reviewConcepts = concepts
    .filter(
      (
        item
      ): item is CurrentQuizConceptSummary & { readonly accuracy: number } =>
        item.status === 'review_recommended' && item.accuracy !== undefined
    )
    .sort(
      (a, b) =>
        a.accuracy - b.accuracy ||
        b.answerCount - a.answerCount ||
        a.conceptKey.localeCompare(b.conceptKey)
    );

  return {
    evidenceStatus:
      dimensions.some((item) => item.sufficientEvidence) ||
      concepts.some((item) => item.sufficientEvidence)
      ? 'repeat_evidence_available'
      : 'collecting',
    acceptedAnswerCount: acceptedEvidence.length,
    dimensions,
    concepts,
    consistentDimensionIds,
    reviewDimensionIds: reviewDimensions.map((item) => item.dimension),
    reviewConceptKeys: reviewConcepts.map((item) => item.conceptKey),
    priorityReviewDimensionId: reviewDimensions[0]?.dimension,
    priorityReviewConceptKey: reviewConcepts[0]?.conceptKey,
  };
}

/**
 * Returns only the dimensions belonging to tracks the learner has unlocked.
 * This powers the preview without inventing answers or learning scores.
 */
export function getCurrentQuizPreviewDimensions(
  unlockedTrackIds: readonly CurrentQuizTrackId[]
): readonly CurrentQuizEvidenceDimension[] {
  const unlocked = new Set(unlockedTrackIds);
  const available = new Set(
    CURRENT_QUIZ_TRACKS.filter((track) => unlocked.has(track.id)).flatMap(
      (track) => track.evidenceDimensions
    )
  );

  return CURRENT_QUIZ_EVIDENCE_DIMENSIONS.filter((dimension) =>
    available.has(dimension)
  );
}
