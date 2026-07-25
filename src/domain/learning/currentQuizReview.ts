import { z } from 'zod';
import { MICRO_LESSON_CATALOG } from './catalog';
import {
  CURRENT_QUIZ_REVIEW_GUIDANCE,
  type CurrentQuizLearningGainSummary,
} from './currentQuizLearningGain';
import { learningConceptKeySchema } from './schemas';
import type {
  LearningConceptKey,
  LocalizedText,
  MicroLesson,
} from './types';

export interface CurrentQuizReviewRecommendation {
  readonly conceptKey: LearningConceptKey;
  readonly lessonId: string;
  readonly lessonTitle: LocalizedText;
  readonly estimatedMinutes: number;
  readonly accuracy: number;
  readonly acceptedAnswerCount: number;
  readonly evidenceThroughAt: string;
  readonly guidance: LocalizedText;
}

export const currentQuizReviewCompletionSchema = z
  .object({
    id: z.string().trim().min(1).max(320),
    conceptKey: learningConceptKeySchema,
    lessonId: z.string().trim().min(1).max(120),
    reviewedEvidenceThroughAt: z.string().datetime({ offset: true }),
    completedAt: z.string().datetime({ offset: true }),
  })
  .strict()
  .superRefine((completion, context) => {
    if (
      Date.parse(completion.reviewedEvidenceThroughAt) >
      Date.parse(completion.completedAt)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['reviewedEvidenceThroughAt'],
        message: 'Reviewed evidence cannot be newer than the review completion.',
      });
    }
  });

export type CurrentQuizReviewCompletion = z.infer<
  typeof currentQuizReviewCompletionSchema
>;

export function createCurrentQuizReviewCompletion(input: {
  conceptKey: LearningConceptKey;
  lessonId: string;
  reviewedEvidenceThroughAt: string;
  completedAt: string;
}): CurrentQuizReviewCompletion {
  return currentQuizReviewCompletionSchema.parse({
    id: [
      'current-quiz-review',
      input.conceptKey,
      input.lessonId,
      input.reviewedEvidenceThroughAt,
    ].join(':'),
    ...input,
  });
}

const DEFAULT_REVIEW_GUIDANCE: LocalizedText = {
  tr: 'Kavramı kısa bir mikro dersle yeniden hatırla.',
  en: 'Recall the concept with a short micro-lesson.',
};

/**
 * Maps repeated weak concept evidence to one previously completed lesson.
 *
 * A dimension-level weakness is intentionally not enough: the gain engine must
 * also identify a concept that independently passed the repeated-evidence
 * threshold. This avoids sending a learner to an arbitrary lesson.
 */
export function getCurrentQuizReviewRecommendation(
  summary: CurrentQuizLearningGainSummary,
  completedLessonIds: readonly string[],
  reviewCompletions: readonly CurrentQuizReviewCompletion[] = [],
  catalog: readonly MicroLesson[] = MICRO_LESSON_CATALOG
): CurrentQuizReviewRecommendation | undefined {
  const conceptKey = summary.priorityReviewConceptKey;
  const priorityDimensionId = summary.priorityReviewDimensionId;
  if (!conceptKey || !priorityDimensionId) return undefined;

  const conceptSummary = summary.concepts.find(
    (item) =>
      item.conceptKey === conceptKey &&
      item.status === 'review_recommended' &&
      item.sufficientEvidence &&
      item.accuracy !== undefined &&
      item.latestAcceptedAnswerAt !== undefined
  );
  if (
    !conceptSummary ||
    conceptSummary.accuracy === undefined ||
    !conceptSummary.latestAcceptedAnswerAt
  ) {
    return undefined;
  }

  const completed = new Set(completedLessonIds);
  const lesson = catalog.find(
    (item) =>
      item.conceptKey === conceptKey &&
      completed.has(item.id)
  );
  if (!lesson) return undefined;

  const parsedCompletions = reviewCompletions.map((completion) =>
    currentQuizReviewCompletionSchema.parse(completion)
  );
  const alreadyReviewed = parsedCompletions.some(
    (completion) =>
      completion.conceptKey === conceptKey &&
      completion.lessonId === lesson.id &&
      Date.parse(completion.reviewedEvidenceThroughAt) >=
        Date.parse(conceptSummary.latestAcceptedAnswerAt as string)
  );
  if (alreadyReviewed) return undefined;

  const guidance =
    CURRENT_QUIZ_REVIEW_GUIDANCE[priorityDimensionId] ??
    DEFAULT_REVIEW_GUIDANCE;

  return {
    conceptKey,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    estimatedMinutes: lesson.estimatedMinutes,
    accuracy: conceptSummary.accuracy,
    acceptedAnswerCount: conceptSummary.answerCount,
    evidenceThroughAt: conceptSummary.latestAcceptedAnswerAt,
    guidance,
  };
}
