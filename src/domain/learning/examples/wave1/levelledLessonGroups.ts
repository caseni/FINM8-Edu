import { microLessonSchema } from '../../schemas';
import type { MicroLesson } from '../../types';
import { WAVE1_CHART_LITERACY_LESSONS } from './chartLiteracyLessons';

const CORE_CHART_LESSON_IDS = [
  'lesson.chart.candles.001',
  'lesson.chart.timeframes.001',
  'lesson.chart.trend.001',
  'lesson.chart.support-resistance.001',
] as const;

const MARKET_STRUCTURE_LESSON_IDS = [
  'lesson.market-structure.bos.001',
  'lesson.market-structure.choch.001',
] as const;

function requireLessons(
  ids: readonly string[],
  source: readonly MicroLesson[]
): MicroLesson[] {
  return ids.map((id) => {
    const lesson = source.find((candidate) => candidate.id === id);
    if (!lesson) {
      throw new Error(`Wave 1 levelled lesson group is missing: ${id}`);
    }
    return lesson;
  });
}

export const WAVE1_CHART_LITERACY_CORE_LESSONS: readonly MicroLesson[] =
  requireLessons(CORE_CHART_LESSON_IDS, WAVE1_CHART_LITERACY_LESSONS);

export const WAVE1_MARKET_STRUCTURE_LESSONS: readonly MicroLesson[] =
  requireLessons(MARKET_STRUCTURE_LESSON_IDS, WAVE1_CHART_LITERACY_LESSONS).map(
    (lesson) =>
      lesson.id === 'lesson.market-structure.bos.001'
        ? microLessonSchema.parse({ ...lesson, learningStage: 'intermediate' })
        : lesson
  );

export const WAVE1_LEVELLED_STRUCTURE = {
  chartLiteracy: {
    trackId: 'foundations',
    lessonIds: CORE_CHART_LESSON_IDS,
  },
  marketStructure: {
    trackId: 'market_structure',
    lessonIds: MARKET_STRUCTURE_LESSON_IDS,
    prerequisiteLessonId: 'lesson.chart.support-resistance.001',
  },
  smcIct: {
    trackId: 'smc_ict',
    lessonIds: [] as readonly string[],
    prerequisiteLessonIds: MARKET_STRUCTURE_LESSON_IDS,
    status: 'planned' as const,
  },
} as const;
