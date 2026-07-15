import { z } from 'zod';
import {
  learningStageSchema,
  localizedTextSchema,
  masterySchema,
  practicalTaskSchema,
  questionSchema,
} from './schemas';

const idSchema = z.string().trim().min(1).max(120);

/** XP rewards verified learning actions, never trading frequency or profit. */
export const xpEventSchema = z
  .object({
    id: idSchema,
    userId: idSchema,
    reason: z.enum([
      'lesson_completed',
      'quiz_passed',
      'practical_task_passed',
      'review_completed',
      'challenge_completed',
    ]),
    points: z.number().int().positive().max(1000),
    sourceId: idSchema,
    idempotencyKey: idSchema,
    awardedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export const learningChallengeSchema = z
  .object({
    id: idSchema,
    title: localizedTextSchema,
    description: localizedTextSchema,
    stage: learningStageSchema,
    skillIds: z.array(idSchema).min(1),
    prerequisiteLessonIds: z.array(idSchema),
    questions: z.array(questionSchema).max(12),
    practicalTasks: z.array(practicalTaskSchema).min(1).max(8),
    passingScore: z.number().int().min(0).max(100),
    xpReward: z.number().int().nonnegative().max(1000),
    badgeId: idSchema.optional(),
  })
  .strict();

export const badgeAwardSchema = z
  .object({
    id: idSchema,
    userId: idSchema,
    badgeId: idSchema,
    badgeDefinitionVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    evidenceRefs: z.array(idSchema).min(1).max(100),
    awardedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export const learningStreakSchema = z
  .object({
    userId: idSchema,
    currentDays: z.number().int().nonnegative(),
    longestDays: z.number().int().nonnegative(),
    graceCredits: z.number().int().nonnegative().max(5),
    lastLearningDate: z.string().date().optional(),
  })
  .strict();

export const learnerProgressSnapshotSchema = z
  .object({
    userId: idSchema,
    totalXp: z.number().int().nonnegative(),
    level: z.number().int().positive(),
    mastery: z.array(masterySchema),
    earnedBadgeIds: z.array(idSchema),
    completedChallengeIds: z.array(idSchema),
    streak: learningStreakSchema,
    updatedAt: z.string().datetime({ offset: true }),
  })
  .strict();

