import type { MicroLesson } from './types';

const ORDER_TYPES_LESSON_ID = 'lesson.market.order-types.001';

export function ensureBeginnerMarketVisualStep(lesson: MicroLesson): MicroLesson {
  if (lesson.id !== ORDER_TYPES_LESSON_ID) return lesson;
  if (lesson.contentBlocks.some((block) => block.kind === 'visual')) return lesson;

  const visualBlock: MicroLesson['contentBlocks'][number] = {
    id: `${lesson.id}.visual`,
    order: 2,
    audience: 'all',
    kind: 'visual',
    assetRef: 'edu://wave1/piyasa-limit-stop-emirleri',
    alt: {
      tr: 'Hemen işlem, fiyat sınırı ve tetik bekleme seçeneklerini sade biçimde karşılaştıran emir görseli',
      en: 'Simple order visual comparing trading now, setting a price boundary, and waiting for a trigger',
    },
  };

  return {
    ...lesson,
    contentBlocks: [...lesson.contentBlocks, visualBlock].sort((left, right) => left.order - right.order),
  };
}
