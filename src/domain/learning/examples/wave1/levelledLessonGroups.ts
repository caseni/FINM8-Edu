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

function normalizeCoreChartLesson(lesson: MicroLesson): MicroLesson {
  if (
    lesson.id !== 'lesson.chart.trend.001' &&
    lesson.id !== 'lesson.chart.support-resistance.001'
  ) {
    return lesson;
  }

  const contentBlocks = lesson.contentBlocks.map((block) => {
    if (
      lesson.id === 'lesson.chart.trend.001' &&
      block.id === 'lesson.chart.trend.001.trader-tip' &&
      block.kind === 'callout'
    ) {
      return {
        ...block,
        copy: {
          normal: {
            tr: 'TRADER PRATİK NOTU · Ana yapıyı daha geniş zaman diliminde, kısa vadeli hareketi daha küçük zaman diliminde ayır. Fiyatın çok yükselmiş olması tek başına düşüş kanıtı değildir.',
            en: 'TRADER PRACTICAL NOTE · Separate the main structure on a broader timeframe from short-term movement on a smaller one. Price having risen a lot is not, by itself, evidence of a decline.',
          },
        },
      };
    }

    if (
      lesson.id === 'lesson.chart.support-resistance.001' &&
      block.id === 'lesson.chart.support-resistance.001.trader-tip' &&
      block.kind === 'callout'
    ) {
      return {
        ...block,
        copy: {
          normal: {
            tr: 'TRADER PRATİK NOTU · Destek ve direnci tek çizgi yerine tepki alanı olarak düşün. Daha kısa zaman dilimi alanı netleştirebilir; çok test edilmesi tek başına daha güçlü olduğu anlamına gelmez.',
            en: 'TRADER PRACTICAL NOTE · Treat support and resistance as reaction areas rather than one exact line. A shorter timeframe can refine the area; many tests alone do not make it stronger.',
          },
        },
      };
    }

    return block;
  });

  return microLessonSchema.parse({ ...lesson, contentBlocks });
}

function normalizeMarketStructureLesson(lesson: MicroLesson): MicroLesson {
  const titledLesson = withPlainLanguageStructureTitle(lesson);

  if (titledLesson.id === 'lesson.market-structure.bos.001') {
    const contentBlocks = titledLesson.contentBlocks.map((block) => {
      if (block.id === 'bos.prompt' && block.kind === 'prompt') {
        return {
          ...block,
          copy: {
            normal: {
              tr: 'Fiyat önemli bir tepenin veya dibin ötesine geçtiğinde yapı her zaman kırılmış olur mu?',
              en: 'When price moves beyond an important high or low, is structure always broken?',
            },
          },
        };
      }

      if (block.id === 'bos.explanation' && block.kind === 'explanation') {
        return {
          ...block,
          copy: {
            ...block.copy,
            normal: {
              tr: 'BOS (yapı kırılımı), fiyatın yapıyı belirleyen önemli bir tepe veya dip seviyesini gerçekten aşmasıdır. Rastgele küçük bir taşma ya da tek fitil tek başına yeterli değildir.',
              en: 'A BOS (break of structure) is when price truly moves beyond an important high or low that defines the current structure. A small random overshoot or a single wick is not enough by itself.',
            },
          },
        };
      }

      if (block.id === 'bos.trader-tip' && block.kind === 'callout') {
        return {
          ...block,
          copy: {
            normal: {
              tr: 'TRADER PRATİK NOTU · Her küçük tepe veya dip aşımını BOS sayma. Önce kırılan seviyenin ana yapıda gerçekten önemli olup olmadığına bak; aksi halde küçük hareketleri büyük yapı değişimi sanabilirsin.',
              en: 'TRADER PRACTICAL NOTE · Do not label every small high or low break as a BOS. First check whether the broken level truly matters in the main structure; otherwise minor moves can look like major structural change.',
            },
          },
        };
      }

      return block;
    });

    return microLessonSchema.parse({ ...titledLesson, contentBlocks });
  }

  if (titledLesson.id !== 'lesson.market-structure.choch.001') return titledLesson;

  const contentBlocks = titledLesson.contentBlocks.map((block) => {
    if (
      block.id === 'lesson.market-structure.choch.001.prompt' &&
      block.kind === 'prompt'
    ) {
      return {
        ...block,
        copy: {
          normal: {
            tr: 'Yükselişi taşıyan önemli bir dip ilk kez kırılırsa trend kesin dönmüş müdür?',
            en: 'If an important low supporting an uptrend breaks for the first time, has the trend definitely reversed?',
          },
        },
      };
    }

    if (
      block.id === 'lesson.market-structure.choch.001.explanation' &&
      block.kind === 'explanation'
    ) {
      return {
        ...block,
        copy: {
          ...block.copy,
          normal: {
            tr: 'CHoCH (karakter değişimi), mevcut fiyat yapısının değişmeye başlayabileceğini gösteren erken bir işarettir. Örneğin yükselişi koruyan önemli bir dip kaybedilirse yapı zayıflıyor olabilir. Bu, trendin kesin döndüğü anlamına gelmez.',
            en: 'A CHoCH (change of character) is an early sign that the current price structure may be starting to change. For example, if an important low that had been supporting an uptrend is lost, the structure may be weakening. This does not mean the trend has definitely reversed.',
          },
          pro: {
            tr: 'CHoCH değerlendirmesinde kırılan seviyenin önemi, kapanış teyidi ve zaman dilimi bağlamı birlikte incelenir. Kullanılan yönteme göre eşik ve etiket değişebilir. Yeni yönde devam kanıtı gelmeden kesin trend dönüşü olarak etiketlenmemelidir.',
            en: 'CHoCH assessment considers the importance of the broken level, close confirmation, and timeframe context together. Thresholds and labels can vary by methodology. It should not be labelled a certain trend reversal before continuation evidence appears in the new direction.',
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
        tr: 'TRADER PRATİK NOTU · İlk CHoCH’u kesin trend dönüşü sayma. Küçük iç yapı değişebilirken daha geniş yapı korunabilir; yeni yönde devam kanıtı beklemek yorumu daha sağlam kılar.',
        en: 'TRADER PRACTICAL NOTE · Do not treat the first CHoCH as a certain trend reversal. Smaller internal structure can change while the broader structure still holds, so waiting for continuation evidence makes the interpretation more robust.',
      },
    },
  });

  return microLessonSchema.parse({ ...titledLesson, contentBlocks });
}

export const WAVE1_CHART_LITERACY_CORE_LESSONS: readonly MicroLesson[] =
  requireLessons(CORE_CHART_LESSON_IDS, WAVE1_CHART_LITERACY_LESSONS).map(
    normalizeCoreChartLesson
  );

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
