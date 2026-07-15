import { WAVE1_MARKET_FOUNDATION_LESSONS } from './examples/wave1/marketFoundationsLessons';
import { WAVE1_CHART_LITERACY_LESSONS } from './examples/wave1/chartLiteracyLessons';
import { WAVE1_RISK_MANAGEMENT_LESSONS } from './examples/wave1/riskManagementLessons';
import { WAVE1_BEHAVIOR_EVIDENCE_LESSONS } from './examples/wave1/behaviorEvidenceLessons';
import type { MicroLesson } from './types';

export const MICRO_LESSON_CATALOG: readonly MicroLesson[] = [
  ...WAVE1_MARKET_FOUNDATION_LESSONS,
  ...WAVE1_CHART_LITERACY_LESSONS,
  ...WAVE1_RISK_MANAGEMENT_LESSONS,
  ...WAVE1_BEHAVIOR_EVIDENCE_LESSONS,
];

export function getMicroLessonById(lessonId: string): MicroLesson | undefined {
  return MICRO_LESSON_CATALOG.find((lesson) => lesson.id === lessonId);
}
