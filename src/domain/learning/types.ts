import type { z } from 'zod';
import type {
  audienceCopySchema,
  contentBlockSchema,
  contentSourceSchema,
  contentVersionSchema,
  finm8SourceModuleSchema,
  learningBadgeSchema,
  learningEntryContextSchema,
  learningModuleSchema,
  learningPathSchema,
  localizedTextSchema,
  masterySchema,
  microLessonSchema,
  practicalTaskSchema,
  questionSchema,
  quizSchema,
  skillSchema,
} from './schemas';

export type LocalizedText = z.infer<typeof localizedTextSchema>;
export type AudienceCopy = z.infer<typeof audienceCopySchema>;
export type Finm8SourceModule = z.infer<typeof finm8SourceModuleSchema>;
export type LearningEntryContext = z.infer<typeof learningEntryContextSchema>;
export type ContentBlock = z.infer<typeof contentBlockSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Quiz = z.infer<typeof quizSchema>;
export type PracticalTask = z.infer<typeof practicalTaskSchema>;
export type ContentSource = z.infer<typeof contentSourceSchema>;
export type ContentVersion = z.infer<typeof contentVersionSchema>;
export type MicroLesson = z.infer<typeof microLessonSchema>;
export type LearningModule = z.infer<typeof learningModuleSchema>;
export type LearningPath = z.infer<typeof learningPathSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Mastery = z.infer<typeof masterySchema>;
export type LearningBadge = z.infer<typeof learningBadgeSchema>;

export type { LearningConceptKey } from './concepts';

