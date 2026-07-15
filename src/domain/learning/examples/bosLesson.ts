import { microLessonSchema } from '../schemas';
import type { MicroLesson } from '../types';

const bosLessonDraft = {
  id: 'lesson.market-structure.bos.001',
  slug: 'yapi-kirilimi-bos',
  seriesId: 'series.market-structure.bos',
  conceptKey: 'market.structure.bos',
  skillId: 'skill.market-structure',
  competencyIds: ['competency.identify-bos.foundation'],
  title: {
    tr: 'BOS: Yapı ne zaman gerçekten kırılır?',
    en: 'BOS: When does market structure really break?',
  },
  learningObjective: {
    tr: 'Kullanıcı, yapı kırılımını sıradan bir fiyat taşmasından ayırabilir.',
    en: 'The learner can distinguish a break of structure from a simple price overshoot.',
  },
  estimatedMinutes: 3,
  learningStage: 'foundation',
  accessTier: 'free',
  marketScopes: ['general'],
  prerequisiteConceptKeys: ['market.structure.support_resistance'],
  relatedConceptKeys: [
    'market.structure.choch',
    'market.structure.liquidity',
  ],
  contentBlocks: [
    {
      id: 'bos.prompt',
      order: 0,
      audience: 'all',
      kind: 'prompt',
      copy: {
        normal: {
          tr: 'Fiyat önceki tepenin üstüne çıktığında her zaman yapı kırılmış olur mu?',
          en: 'Is structure always broken when price moves above the previous high?',
        },
      },
    },
    {
      id: 'bos.explanation',
      order: 1,
      audience: 'all',
      kind: 'explanation',
      copy: {
        normal: {
          tr: 'BOS, mevcut yönü destekleyen anlamlı bir yapısal seviyenin kırılmasıdır. Tek bir iğne veya çok kısa taşma tek başına yeterli kanıt değildir.',
          en: 'A BOS is a break of a meaningful structural level that supports the current direction. A single wick or brief overshoot is not enough evidence by itself.',
        },
        pro: {
          tr: 'BOS değerlendirmesinde salınım seviyesinin önemi, kapanış teyidi, momentum ve zaman dilimi bağlamı birlikte incelenir.',
          en: 'BOS assessment combines swing significance, close confirmation, momentum, and timeframe context.',
        },
      },
    },
    {
      id: 'bos.misconception',
      order: 2,
      audience: 'all',
      kind: 'misconception',
      copy: {
        normal: {
          tr: 'Yaygın hata: Seviyenin üzerindeki her hareketi kesin trend devamı olarak görmek.',
          en: 'Common mistake: treating every move beyond a level as certain trend continuation.',
        },
      },
    },
    {
      id: 'bos.risk',
      order: 3,
      audience: 'all',
      kind: 'callout',
      tone: 'risk',
      copy: {
        normal: {
          tr: 'BOS bir gözlemdir; tek başına alım veya satım talimatı değildir.',
          en: 'BOS is an observation, not a buy or sell instruction by itself.',
        },
      },
    },
  ],
  practicalTask: {
    id: 'task.bos.001',
    kind: 'chart_identification',
    conceptKey: 'market.structure.bos',
    prompt: {
      normal: {
        tr: 'Örnek grafikte anlamlı tepeyi ve kırılım kapanışını işaretle.',
        en: 'Mark the meaningful high and the confirming break close on the example chart.',
      },
    },
    assetRef: 'edu://charts/bos-starter-001',
    evaluationRule: 'exact',
    expectedEvidence: ['structural-high', 'confirming-close'],
  },
  quiz: {
    id: 'quiz.bos.001',
    passingScore: 67,
    questions: [
      {
        id: 'question.bos.001',
        kind: 'single_choice',
        conceptKey: 'market.structure.bos',
        prompt: { tr: 'BOS için en anlamlı kanıt hangisidir?' },
        options: [
          { id: 'a', label: { tr: 'Rastgele küçük bir fiyat hareketi' } },
          {
            id: 'b',
            label: { tr: 'Anlamlı yapısal seviyenin bağlamla birlikte kırılması' },
          },
          { id: 'c', label: { tr: 'Sadece işlem hacminin artması' } },
        ],
        correctOptionId: 'b',
        explanation: {
          tr: 'BOS, anlamlı bir yapısal seviye ve kırılım bağlamı gerektirir.',
        },
      },
      {
        id: 'question.bos.002',
        kind: 'true_false',
        conceptKey: 'market.structure.bos',
        prompt: { tr: 'Tek bir fitil her zaman BOS kanıtıdır.' },
        options: [
          { id: 'true', label: { tr: 'Doğru' } },
          { id: 'false', label: { tr: 'Yanlış' } },
        ],
        correctOptionId: 'false',
        explanation: {
          tr: 'Fitil bir taşma olabilir; seviye, kapanış ve bağlam birlikte değerlendirilir.',
        },
      },
      {
        id: 'question.bos.003',
        kind: 'true_false',
        conceptKey: 'market.structure.bos',
        prompt: { tr: 'BOS tek başına işlem talimatı değildir.' },
        options: [
          { id: 'true', label: { tr: 'Doğru' } },
          { id: 'false', label: { tr: 'Yanlış' } },
        ],
        correctOptionId: 'true',
        explanation: {
          tr: 'BOS bir piyasa gözlemidir; risk ve diğer kanıtlar ayrıca değerlendirilir.',
        },
      },
    ],
  },
  takeaway: {
    tr: 'BOS, anlamlı bir seviyenin bağlamla desteklenen kırılımıdır; kesinlik veya işlem emri değildir.',
    en: 'A BOS is a context-supported break of a meaningful level, not certainty or a trade instruction.',
  },
  sources: [
    {
      id: 'source.finm8.methodology.market-structure',
      title: 'FINM8 Market Structure Methodology',
      publisher: 'FINM8',
      reviewedAt: '2026-07-15T00:00:00+03:00',
    },
  ],
  contentVersion: {
    version: '0.1.0',
    status: 'draft',
    canonicalLanguage: 'tr',
    authoredAt: '2026-07-15T00:00:00+03:00',
    riskDisclaimer: {
      tr: 'Bu içerik eğitim amaçlıdır ve yatırım tavsiyesi değildir.',
      en: 'This content is educational and is not investment advice.',
    },
  },
} satisfies MicroLesson;

/** Draft fixture proving the Phase 2 contract; it is not published content. */
export const bosMicroLesson = microLessonSchema.parse(bosLessonDraft);
