import { bosMicroLesson } from './examples/bosLesson';
import { WAVE1_MARKET_FOUNDATION_LESSONS } from './examples/wave1/marketFoundationsLessons';
import type { MicroLesson } from './types';

export const MICRO_LESSON_CATALOG: readonly MicroLesson[] = [
  ...WAVE1_MARKET_FOUNDATION_LESSONS,
  bosMicroLesson,
];

export function getMicroLessonById(lessonId: string): MicroLesson | undefined {
  return MICRO_LESSON_CATALOG.find((lesson) => lesson.id === lessonId);
}
