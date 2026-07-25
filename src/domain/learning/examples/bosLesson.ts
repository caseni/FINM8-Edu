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
      id: 'bos.visual',
      order: 2,
      audience: 'all',
      kind: 'visual',
      assetRef: 'edu://charts/bos-starter-001',
      alt: {
        tr: 'Önceki tepe ve teyit kapanışını gösteren sade BOS grafiği',
        en: 'Simple BOS chart showing the previous high and confirming close',
      },
      caption: {
        normal: {
          tr: 'Önemli olan yalnızca seviyenin aşılması değil, kırılımın bağlamıdır.',
          en: 'What matters is not only crossing the level, but the context of the break.',
        },
      },
    },
    {
      id: 'bos.misconception',
      order: 3,
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
      order: 4,
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
    choices: [
      { id: 'structural-high', label: { tr: 'Önceki anlamlı tepe', en: 'Previous meaningful high' } },
      { id: 'random-wick', label: { tr: 'Rastgele bir fitil', en: 'A random wick' } },
      { id: 'confirming-close', label: { tr: 'Kırılımı teyit eden kapanış', en: 'The confirming break close' } },
      { id: 'middle-range', label: { tr: 'Aralığın orta noktası', en: 'The middle of the range' } },
    ],
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
        prompt: { tr: 'BOS için en anlamlı kanıt hangisidir?', en: 'Which is the most meaningful evidence for a BOS?' },
        visual: {
          assetRef: 'edu://charts/bos-starter-001',
          alt: {
            tr: 'Önceki tepeyi ve seviyenin üzerinde teyit kapanışını gösteren sade BOS grafiği',
            en: 'Simple BOS chart showing the previous high and a confirming close above the level',
          },
        },
        options: [
          { id: 'a', label: { tr: 'Rastgele küçük bir fiyat hareketi', en: 'A random small price move' } },
          {
            id: 'b',
            label: { tr: 'Anlamlı yapısal seviyenin bağlamla birlikte kırılması', en: 'A meaningful structural level breaking together with its context' },
          },
          { id: 'c', label: { tr: 'Sadece işlem hacminin artması', en: 'An increase in volume alone' } },
        ],
        correctOptionId: 'b',
        explanation: {
          tr: 'BOS, anlamlı bir yapısal seviye ve kırılım bağlamı gerektirir.',
          en: 'A BOS requires a meaningful structural level and the context of its break.',
        },
      },
      {
        id: 'question.bos.002',
        kind: 'true_false',
        conceptKey: 'market.structure.bos',
        prompt: { tr: 'Tek bir fitil her zaman BOS kanıtıdır.', en: 'A single wick is always evidence of a BOS.' },
        options: [
          { id: 'true', label: { tr: 'Doğru', en: 'True' } },
          { id: 'false', label: { tr: 'Yanlış', en: 'False' } },
        ],
        correctOptionId: 'false',
        explanation: {
          tr: 'Fitil bir taşma olabilir; seviye, kapanış ve bağlam birlikte değerlendirilir.',
          en: 'A wick can be an overshoot; the level, close, and context are assessed together.',
        },
      },
      {
        id: 'question.bos.003',
        kind: 'true_false',
        conceptKey: 'market.structure.bos',
        prompt: { tr: 'BOS tek başına işlem talimatı değildir.', en: 'A BOS is not a trade instruction by itself.' },
        options: [
          { id: 'true', label: { tr: 'Doğru', en: 'True' } },
          { id: 'false', label: { tr: 'Yanlış', en: 'False' } },
        ],
        correctOptionId: 'true',
        explanation: {
          tr: 'BOS bir piyasa gözlemidir; risk ve diğer kanıtlar ayrıca değerlendirilir.',
          en: 'A BOS is a market observation; risk and other evidence are assessed separately.',
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
