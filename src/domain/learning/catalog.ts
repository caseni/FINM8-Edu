import { bosMicroLesson } from './examples/bosLesson';
import type { MicroLesson } from './types';

export const MICRO_LESSON_CATALOG: readonly MicroLesson[] = [bosMicroLesson];

export function getMicroLessonById(lessonId: string): MicroLesson | undefined {
  return MICRO_LESSON_CATALOG.find((lesson) => lesson.id === lessonId);
}

