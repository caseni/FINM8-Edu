import { z } from 'zod';
import { LEARNING_CONCEPT_KEYS } from './concepts';

const idSchema = z.string().trim().min(1).max(120);
const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const learningConceptKeySchema = z.enum(LEARNING_CONCEPT_KEYS);

export const learningStageSchema = z.enum([
  'foundation',
  'intermediate',
  'advanced',
]);

export const presentationModeSchema = z.enum(['normal', 'pro']);

export const marketScopeSchema = z.enum([
  'general',
  'equities',
  'crypto',
  'forex',
  'commodities',
  'fixed_income',
]);

export const localizedTextSchema = z
  .object({
    tr: z.string().trim().min(1),
    en: z.string().trim().min(1).optional(),
  })
  .strict();

export const audienceCopySchema = z
  .object({
    normal: localizedTextSchema,
    pro: localizedTextSchema.optional(),
  })
  .strict();

export const finm8SourceModuleSchema = z.enum([
  'analyze',
  'scanner',
  'history',
  'news',
  'portfolio',
  'algo',
  'assistant',
]);

export const learningEntryContextSchema = z
  .object({
    conceptKey: learningConceptKeySchema,
    sourceModule: finm8SourceModuleSchema,
    audienceMode: presentationModeSchema,
    language: z.enum(['tr', 'en']),
    symbol: z.string().trim().min(1).max(40).optional(),
    market: z.string().trim().min(1).max(80).optional(),
    timeframe: z.string().trim().min(1).max(20).optional(),
    analysisId: idSchema.optional(),
    snapshotVersion: z.string().trim().min(1).max(80).optional(),
    evidenceRefs: z.array(idSchema).max(30).optional(),
    observedAt: z.string().datetime({ offset: true }).optional(),
  })
  .strict();

const contentBlockBase = {
  id: idSchema,
  order: z.number().int().nonnegative(),
  audience: z.enum(['all', 'normal', 'pro']),
};

export const contentBlockSchema = z.discriminatedUnion('kind', [
  z
    .object({
      ...contentBlockBase,
      kind: z.literal('prompt'),
      copy: audienceCopySchema,
    })
    .strict(),
  z
    .object({
      ...contentBlockBase,
      kind: z.literal('explanation'),
      copy: audienceCopySchema,
    })
    .strict(),
  z
    .object({
      ...contentBlockBase,
      kind: z.literal('bullet_list'),
      title: audienceCopySchema.optional(),
      items: z.array(audienceCopySchema).min(1).max(8),
    })
    .strict(),
  z
    .object({
      ...contentBlockBase,
      kind: z.literal('visual'),
      assetRef: z.string().trim().min(1),
      alt: localizedTextSchema,
      caption: audienceCopySchema.optional(),
      evidenceRef: idSchema.optional(),
    })
    .strict(),
  z
    .object({
      ...contentBlockBase,
      kind: z.literal('misconception'),
      copy: audienceCopySchema,
    })
    .strict(),
  z
    .object({
      ...contentBlockBase,
      kind: z.literal('callout'),
      tone: z.enum(['note', 'risk', 'evidence']),
      copy: audienceCopySchema,
    })
    .strict(),
]);

export const questionOptionSchema = z
  .object({
    id: idSchema,
    label: localizedTextSchema,
  })
  .strict();

export const questionSchema = z
  .object({
    id: idSchema,
    kind: z.enum(['single_choice', 'true_false']),
    conceptKey: learningConceptKeySchema,
    prompt: localizedTextSchema,
    options: z.array(questionOptionSchema).min(2).max(5),
    correctOptionId: idSchema,
    explanation: localizedTextSchema,
  })
  .strict()
  .superRefine((question, ctx) => {
    const optionIds = question.options.map((option) => option.id);
    if (new Set(optionIds).size !== optionIds.length) {
      ctx.addIssue({
        code: 'custom',
        message: 'Question option ids must be unique.',
        path: ['options'],
      });
    }
    if (!optionIds.includes(question.correctOptionId)) {
      ctx.addIssue({
        code: 'custom',
        message: 'correctOptionId must reference an existing option.',
        path: ['correctOptionId'],
      });
    }
  });

export const quizSchema = z
  .object({
    id: idSchema,
    passingScore: z.number().int().min(0).max(100),
    questions: z.array(questionSchema).min(2).max(4),
  })
  .strict();

export const practicalTaskSchema = z
  .object({
    id: idSchema,
    kind: z.enum(['chart_identification', 'scenario_choice', 'reflection']),
    conceptKey: learningConceptKeySchema,
    prompt: audienceCopySchema,
    assetRef: z.string().trim().min(1).optional(),
    evaluationRule: z.enum(['exact', 'rubric', 'self_check']),
    expectedEvidence: z.array(z.string().trim().min(1)).min(1).max(6),
  })
  .strict();

export const contentSourceSchema = z
  .object({
    id: idSchema,
    title: z.string().trim().min(1),
    publisher: z.string().trim().min(1),
    url: z.string().url().optional(),
    publishedAt: z.string().datetime({ offset: true }).optional(),
    reviewedAt: z.string().datetime({ offset: true }),
    evidenceRef: idSchema.optional(),
  })
  .strict();

export const contentVersionSchema = z
  .object({
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    status: z.enum(['draft', 'in_review', 'approved', 'archived']),
    canonicalLanguage: z.literal('tr'),
    authoredAt: z.string().datetime({ offset: true }),
    reviewedAt: z.string().datetime({ offset: true }).optional(),
    reviewerId: idSchema.optional(),
    riskDisclaimer: localizedTextSchema,
  })
  .strict()
  .superRefine((version, ctx) => {
    if (
      version.status === 'approved' &&
      (!version.reviewedAt || !version.reviewerId)
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Approved content requires reviewedAt and reviewerId.',
      });
    }
  });

export const microLessonSchema = z
  .object({
    id: idSchema,
    slug: slugSchema,
    seriesId: idSchema,
    conceptKey: learningConceptKeySchema,
    skillId: idSchema,
    competencyIds: z.array(idSchema).min(1).max(8),
    title: localizedTextSchema,
    learningObjective: localizedTextSchema,
    estimatedMinutes: z.number().int().min(3).max(6),
    learningStage: learningStageSchema,
    accessTier: z.enum(['free', 'pro']),
    marketScopes: z.array(marketScopeSchema).min(1),
    prerequisiteConceptKeys: z.array(learningConceptKeySchema),
    relatedConceptKeys: z.array(learningConceptKeySchema),
    contentBlocks: z.array(contentBlockSchema).min(3).max(12),
    practicalTask: practicalTaskSchema,
    quiz: quizSchema,
    takeaway: localizedTextSchema,
    sources: z.array(contentSourceSchema).min(1).max(12),
    contentVersion: contentVersionSchema,
  })
  .strict();

export const lessonSeriesSchema = z
  .object({
    id: idSchema,
    conceptKey: learningConceptKeySchema,
    title: localizedTextSchema,
    description: localizedTextSchema,
    lessonIds: z.array(idSchema).min(1),
    availableStages: z.array(learningStageSchema).min(1),
  })
  .strict();

export const learningModuleSchema = z
  .object({
    id: idSchema,
    title: localizedTextSchema,
    description: localizedTextSchema,
    order: z.number().int().nonnegative(),
    lessonIds: z.array(idSchema).min(1),
    prerequisiteModuleIds: z.array(idSchema),
  })
  .strict();

export const learningPathSchema = z
  .object({
    id: idSchema,
    slug: slugSchema,
    title: localizedTextSchema,
    description: localizedTextSchema,
    startingStage: learningStageSchema,
    goals: z
      .array(
        z.enum([
          'financial_literacy',
          'investing',
          'trading',
          'risk_management',
          'portfolio_management',
          'data_literacy',
        ])
      )
      .min(1),
    status: z.enum(['draft', 'published', 'archived']),
    moduleIds: z.array(idSchema).min(1),
    estimatedMinutes: z.number().int().positive(),
  })
  .strict();

export const skillSchema = z
  .object({
    id: idSchema,
    title: localizedTextSchema,
    description: localizedTextSchema,
    conceptKeys: z.array(learningConceptKeySchema).min(1),
  })
  .strict();

export const competencySchema = z
  .object({
    id: idSchema,
    title: localizedTextSchema,
    description: localizedTextSchema,
    conceptKey: learningConceptKeySchema,
    stage: learningStageSchema,
    evidenceKinds: z
      .array(z.enum(['quiz', 'practical_task', 'challenge']))
      .min(1),
  })
  .strict();

export const masterySchema = z
  .object({
    userId: idSchema,
    skillId: idSchema,
    status: z.enum([
      'unseen',
      'introduced',
      'practicing',
      'competent',
      'mastered',
    ]),
    score: z.number().min(0).max(100),
    lessonCompletions: z.number().int().nonnegative(),
    quizAttempts: z.number().int().nonnegative(),
    practicalAttempts: z.number().int().nonnegative(),
    lastAssessedAt: z.string().datetime({ offset: true }).optional(),
    reviewDueAt: z.string().datetime({ offset: true }).optional(),
  })
  .strict();

export const badgeRequirementSchema = z
  .object({
    kind: z.enum([
      'lesson_completion',
      'quiz_accuracy',
      'practical_task',
      'mastery',
      'challenge_completion',
    ]),
    targetId: idSchema,
    threshold: z.number().nonnegative(),
  })
  .strict();

export const learningBadgeSchema = z
  .object({
    id: idSchema,
    title: localizedTextSchema,
    description: localizedTextSchema,
    credentialType: z.literal('learning_achievement'),
    definitionVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    requirements: z.array(badgeRequirementSchema).min(1),
    disclaimer: localizedTextSchema,
  })
  .strict();

export const learningProfileSchema = z
  .object({
    userId: idSchema,
    selectedStage: learningStageSchema,
    goals: z
      .array(
        z.enum([
          'financial_literacy',
          'investing',
          'trading',
          'risk_management',
          'portfolio_management',
          'data_literacy',
        ])
      )
      .min(1),
    preferredMarketScopes: z.array(marketScopeSchema).min(1),
    onboardingCompletedAt: z.string().datetime({ offset: true }).optional(),
    placementCompletedAt: z.string().datetime({ offset: true }).optional(),
  })
  .strict();

export function parseMicroLesson(input: unknown) {
  return microLessonSchema.parse(input);
}

export function parseLearningEntryContext(input: unknown) {
  return learningEntryContextSchema.parse(input);
}
