import { microLessonSchema } from './schemas';
import type { MicroLesson } from './types';

export function normalizeBeginnerChartTaskQuality(lesson: MicroLesson): MicroLesson {
  if (lesson.id !== 'lesson.chart.candles.001') return lesson;

  return microLessonSchema.parse({
    ...lesson,
    practicalTask: {
      ...lesson.practicalTask,
      prompt: {
        normal: {
          tr: 'Bir mumun üst ve alt uçları neyi gösterir?',
          en: 'What do the top and bottom tips of a candlestick show?',
        },
      },
    },
  });
}
