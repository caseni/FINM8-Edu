import type { z } from 'zod';
import type {
  audienceCopySchema,
  competencySchema,
  contentBlockSchema,
  contentSourceSchema,
  contentVersionSchema,
  finm8SourceModuleSchema,
  learningBadgeSchema,
  learningEntryContextSchema,
  learningProfileSchema,
  learningStageSchema,
  lessonBlueprintSchema,
  lessonSeriesSchema,
  learningModuleSchema,
  learningPathSchema,
  localizedTextSchema,
  masterySchema,
  marketScopeSchema,
  microLessonSchema,
  practicalTaskSchema,
  presentationModeSchema,
  questionSchema,
  quizSchema,
  skillSchema,
} from './schemas';
import type {
  badgeAwardSchema,
  learnerProgressSnapshotSchema,
  learningChallengeSchema,
  learningStreakSchema,
  xpEventSchema,
} from './progressionSchemas';

export type LocalizedText = z.infer<typeof localizedTextSchema>;
export type AudienceCopy = z.infer<typeof audienceCopySchema>;
export type LearningStage = z.infer<typeof learningStageSchema>;
export type PresentationMode = z.infer<typeof presentationModeSchema>;
export type MarketScope = z.infer<typeof marketScopeSchema>;
export type Finm8SourceModule = z.infer<typeof finm8SourceModuleSchema>;
export type LearningEntryContext = z.infer<typeof learningEntryContextSchema>;
export type ContentBlock = z.infer<typeof contentBlockSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Quiz = z.infer<typeof quizSchema>;
export type PracticalTask = z.infer<typeof practicalTaskSchema>;
export type ContentSource = z.infer<typeof contentSourceSchema>;
export type ContentVersion = z.infer<typeof contentVersionSchema>;
export type MicroLesson = z.infer<typeof microLessonSchema>;
export type LessonSeries = z.infer<typeof lessonSeriesSchema>;
export type LessonBlueprint = z.infer<typeof lessonBlueprintSchema>;
export type LearningModule = z.infer<typeof learningModuleSchema>;
export type LearningPath = z.infer<typeof learningPathSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Competency = z.infer<typeof competencySchema>;
export type Mastery = z.infer<typeof masterySchema>;
export type LearningBadge = z.infer<typeof learningBadgeSchema>;
export type LearningProfile = z.infer<typeof learningProfileSchema>;

export type LessonJourneyStage = 'lesson' | 'task' | 'quiz';

export interface LessonCheckpoint {
  readonly lessonId: string;
  readonly stage: LessonJourneyStage;
  readonly stepIndex: number;
  readonly updatedAt: string;
}
export type XpEvent = z.infer<typeof xpEventSchema>;
export type LearningChallenge = z.infer<typeof learningChallengeSchema>;
export type BadgeAward = z.infer<typeof badgeAwardSchema>;
export type LearningStreak = z.infer<typeof learningStreakSchema>;
export type LearnerProgressSnapshot = z.infer<
  typeof learnerProgressSnapshotSchema
>;

export type { LearningConceptKey } from './concepts';
