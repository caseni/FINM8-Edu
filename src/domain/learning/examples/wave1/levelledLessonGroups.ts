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

function withPlainLanguageStructureTitle(lesson: MicroLesson): MicroLesson {
  if (lesson.id === 'lesson.market-structure.bos.001') {
    return microLessonSchema.parse({
      ...lesson,
      title: {
        tr: 'BOS (Yapı Kırılımı): Ne zaman gerçekten kırılır?',
        en: 'BOS (Break of Structure): When is structure truly broken?',
      },
    });
  }

  if (lesson.id === 'lesson.market-structure.choch.001') {
    return microLessonSchema.parse({
      ...lesson,
      title: {
        tr: 'CHoCH (Karakter Değişimi): Değişim ihtimali nasıl okunur?',
        en: 'CHoCH (Change of Character): How do we read a possible change?',
      },
    });
  }

  return lesson;
}

function normalizeMarketStructureLesson(lesson: MicroLesson): MicroLesson {
  const titledLesson = withPlainLanguageStructureTitle(lesson);
  if (titledLesson.id !== 'lesson.market-structure.choch.001') return titledLesson;

  const contentBlocks = titledLesson.contentBlocks.map((block) => {
    if (
      block.id === 'lesson.market-structure.choch.001.explanation' &&
      block.kind === 'explanation'
    ) {
      return {
        ...block,
        copy: {
          ...block.copy,
          pro: {
            tr: 'CHoCH değerlendirmesinde karşı yönlü yapısal ihlal, swing seviyesinin önemi, kapanış teyidi ve zaman dilimi bağlamı birlikte incelenir. Yeni yönde devam kanıtı gelmeden kesin trend dönüşü olarak etiketlenmemelidir.',
            en: 'CHoCH assessment combines a counter-direction structural violation, swing significance, close confirmation, and timeframe context. It should not be labelled a certain trend reversal before continuation evidence appears in the new direction.',
          },
        },
      };
    }

    if (block.id === 'lesson.market-structure.choch.001.misconception') {
      return { ...block, order: 4 };
    }

    if (block.id === 'lesson.market-structure.choch.001.safety') {
      return { ...block, order: 5 };
    }

    return block;
  });

  contentBlocks.push({
    id: 'lesson.market-structure.choch.001.trader-tip',
    order: 3,
    audience: 'all',
    kind: 'callout',
    tone: 'evidence',
    copy: {
      normal: {
        tr: 'TRADER PRATİK NOTU · CHoCH gördüğünde ilk refleksin “trend döndü” demek olmasın. Önce kırılan seviyenin o zaman diliminde gerçekten korunan anlamlı swing olup olmadığını ve kapanışın seviyenin ötesinde kalıp kalmadığını kontrol et; ardından yeni yönde devam yapısı oluşup oluşmadığını izle. Küçük iç yapıdaki CHoCH, daha geniş yapının döndüğü anlamına gelmez.',
        en: 'TRADER PRACTICAL NOTE · Do not treat the first CHoCH as proof that the trend has reversed. First check whether the broken level was truly a meaningful protected swing on that timeframe and whether the close remained beyond it; then watch for continuation structure in the new direction. A CHoCH in small internal structure does not mean the broader structure has reversed.',
      },
    },
  });

  return microLessonSchema.parse({ ...titledLesson, contentBlocks });
}

export const WAVE1_CHART_LITERACY_CORE_LESSONS: readonly MicroLesson[] =
  requireLessons(CORE_CHART_LESSON_IDS, WAVE1_CHART_LITERACY_LESSONS);

export const WAVE1_MARKET_STRUCTURE_LESSONS: readonly MicroLesson[] =
  requireLessons(MARKET_STRUCTURE_LESSON_IDS, WAVE1_CHART_LITERACY_LESSONS).map(
    normalizeMarketStructureLesson
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
