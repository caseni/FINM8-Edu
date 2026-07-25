import type { LearningConceptKey } from '../../concepts';
import { microLessonSchema } from '../../schemas';
import type { ContentSource, LearningStage, MicroLesson, PracticalTask } from '../../types';

interface ChoiceSpec {
  id: string;
  label: string;
  labelEn?: string;
}

interface QuestionSpec {
  prompt: string;
  promptEn?: string;
  choices: readonly ChoiceSpec[];
  correctId: string;
  explanation: string;
  explanationEn?: string;
  visual?: {
    assetRef: string;
    alt: string;
    altEn?: string;
  };
}

const FIRST_QUESTION_VISUALS: Partial<Record<LearningConceptKey, { assetRef: string; alt: string; altEn: string }>> = {
  'market.basics.price_formation': {
    assetRef: 'edu://wave1/fiyat-piyasada-nasil-olusur',
    alt: 'Alış ve satış tekliflerinin eşleşerek son fiyatı oluşturduğunu gösteren emir defteri şeması',
    altEn: 'Order-book diagram showing buy and sell offers matching to form the last price',
  },
  'market.basics.instruments': {
    assetRef: 'edu://wave1/piyasa-araclari-ayni-degildir',
    alt: 'Hisse, tahvil, döviz ve emtianın temsil ettiği farklı hakları karşılaştıran kartlar',
    altEn: 'Cards comparing the different claims represented by stocks, bonds, currencies, and commodities',
  },
  'market.structure.liquidity': {
    assetRef: 'edu://wave1/likidite-neden-onemlidir',
    alt: 'Derin ve sığ emir defterlerinde aynı emrin farklı fiyat etkisini karşılaştıran şema',
    altEn: 'Diagram comparing the price impact of the same order in deep and shallow order books',
  },
  'market.microstructure.bid_ask': {
    assetRef: 'edu://wave1/bid-ask-spread-nedir',
    alt: 'Bid 99, ask 101 ve aradaki 2 birim spreadi gösteren fiyat ekranı',
    altEn: 'Quote screen showing bid 99, ask 101, and the 2-point spread between them',
  },
  'market.execution.order_types': {
    assetRef: 'edu://wave1/piyasa-limit-stop-emirleri',
    alt: 'Piyasa, limit ve stop emirlerinin farklı kontrol biçimlerini karşılaştıran şema',
    altEn: 'Diagram comparing the different controls provided by market, limit, and stop orders',
  },
  'market.execution.slippage': {
    assetRef: 'edu://wave1/gerceklesme-fiyati-kayma',
    alt: 'Bir emrin farklı fiyat seviyelerinde gerçekleşerek ortalama fiyatı değiştirdiğini gösteren şema',
    altEn: 'Diagram showing an order filling across price levels and changing the average execution price',
  },
  'market.chart.candles': {
    assetRef: 'edu://wave1/bir-mum-bize-ne-soyler',
    alt: 'Açılış, kapanış, en yüksek ve en düşük fiyatları etiketlenmiş mum grafiği',
    altEn: 'Candlestick chart labelled with open, close, high, and low prices',
  },
  'market.chart.timeframes': {
    assetRef: 'edu://wave1/zaman-dilimi-neyi-degistirir',
    alt: 'Aynı hareketi farklı zaman dilimlerinde gösteren mum grafiği',
    altEn: 'Candlestick chart showing the same movement across timeframes',
  },
  'market.trend.basics': {
    assetRef: 'edu://wave1/trend-yon-mu-yapi-mi',
    alt: 'Yüksek dipler ve yüksek tepelerle yükseliş yapısı şeması',
    altEn: 'Upward structure diagram with higher lows and higher highs',
  },
  'market.structure.support_resistance': {
    assetRef: 'edu://wave1/destek-direnc-cizgi-degildir',
    alt: 'Destek ve direnç bölgelerini gösteren sade fiyat şeması',
    altEn: 'Simple price diagram showing support and resistance zones',
  },
  'market.structure.choch': {
    assetRef: 'edu://charts/choch-001',
    alt: 'Korunan dip kaybını ve olası karakter değişimini gösteren şema',
    altEn: 'Diagram showing a protected-low loss and a possible change of character',
  },
  'risk.basics': {
    assetRef: 'edu://wave1/risk-belirsizlik-kayip',
    alt: 'Olası sonuç aralığını ve olumsuz sonucun kesin olmadığını gösteren risk şeması',
    altEn: 'Risk diagram showing a range of possible outcomes and that an adverse outcome is not certain',
  },
  'risk.volatility': {
    assetRef: 'edu://wave1/volatilite-once-risktir',
    alt: 'Aynı başlangıç noktasından düşük ve yüksek dalgalanmalı iki fiyat yolunu karşılaştıran şema',
    altEn: 'Diagram comparing low- and high-volatility price paths from the same starting point',
  },
  'risk.position_sizing': {
    assetRef: 'edu://wave1/pozisyon-buyuklugu-once-gelir',
    alt: 'Aynı risk limiti altında dar ve geniş risk mesafelerinde değişen pozisyon miktarını gösteren şema',
    altEn: 'Diagram showing position size changing with tight and wide risk distances under the same risk limit',
  },
  'risk.risk_reward': {
    assetRef: 'edu://wave1/risk-getiri-tek-basina-yetmez',
    alt: 'Bir birim olası kayıp ve iki birim hedefi, olasılığın ayrıca değerlendirilmesi gerektiği notuyla gösteren şema',
    altEn: 'Diagram showing one unit of potential loss and two units of target, with a note that probability needs separate assessment',
  },
  'risk.stop_orders': {
    assetRef: 'edu://wave1/stop-emri-garanti-midir',
    alt: 'Hızlı hareketin stop seviyesini geçerek farklı bir gerçekleşme fiyatına yol açabildiğini gösteren şema',
    altEn: 'Diagram showing that a fast move can cross a stop level and lead to a different fill price',
  },
  'portfolio.diversification': {
    assetRef: 'edu://wave1/cok-varlik-cesitlendirme-degildir',
    alt: 'Aynı faktöre bağlı sepet ile farklı risk kaynaklarına yayılan sepeti karşılaştıran şema',
    altEn: 'Diagram comparing a same-factor basket with a basket spread across different risk sources',
  },
  'behavior.fomo': {
    assetRef: 'edu://wave1/fomo-karari-nasil-bozar',
    alt: 'Yükselen fiyat ve sosyal baskı karşısında duraklatılmış karar kontrolünü gösteren şema',
    altEn: 'Diagram showing a paused decision check against rising price and social pressure',
  },
  'behavior.overtrading': {
    assetRef: 'edu://wave1/asiri-islem-nasil-fark-edilir',
    alt: 'Planlı birkaç karar ile artan plansız işlem sayısını karşılaştıran şema',
    altEn: 'Diagram comparing a few planned decisions with a growing count of unplanned trades',
  },
  'behavior.confirmation_bias': {
    assetRef: 'edu://wave1/sadece-hakli-cikaran-kanit',
    alt: 'Bir görüşü destekleyen ve zorlayan kanıtların birlikte aranmasını gösteren şema',
    altEn: 'Diagram showing evidence that supports and challenges a view being sought together',
  },
  'evidence.data_quality': {
    assetRef: 'edu://wave1/her-veri-ayni-kalitede-degildir',
    alt: 'Kaynak, bağlam ve eksik veri için farklı güven düzeylerini gösteren şema',
    altEn: 'Diagram showing different confidence levels for source, context, and missing data',
  },
  'evidence.freshness': {
    assetRef: 'edu://wave1/dogru-veri-ne-zaman-eskir',
    alt: 'Gözlem zamanı, şimdi ve yeniden doğrulama ihtiyacını gösteren zaman çizelgesi',
    altEn: 'Timeline showing observation time, now, and the need to re-check information',
  },
  'behavior.decision_journal': {
    assetRef: 'edu://wave1/sonucu-degil-karari-kaydet',
    alt: 'Kanıt, risk ve geçersizlik koşulunu ayıran karar günlüğü kontrol listesi',
    altEn: 'Decision-journal checklist separating evidence, risk, and invalidation conditions',
  },
};

export interface FoundationLessonSpec {
  id: string;
  slug: string;
  conceptKey: LearningConceptKey;
  skillId: string;
  competencyId: string;
  title: string;
  titleEn?: string;
  objective: string;
  objectiveEn?: string;
  minutes: number;
  learningStage?: LearningStage;
  hook: string;
  hookEn?: string;
  explanation: string;
  explanationEn?: string;
  proExplanation?: string;
  proExplanationEn?: string;
  misconception: string;
  misconceptionEn?: string;
  takeaway: string;
  takeawayEn?: string;
  prerequisiteConceptKeys: readonly LearningConceptKey[];
  relatedConceptKeys: readonly LearningConceptKey[];
  visualAlt?: string;
  visualAltEn?: string;
  taskPrompt: string;
  taskPromptEn?: string;
  taskKind?: PracticalTask['kind'];
  taskAssetRef?: string;
  taskChoices: readonly ChoiceSpec[];
  taskCorrectIds: readonly string[];
  questions: readonly [QuestionSpec, QuestionSpec, QuestionSpec];
  sources: readonly ContentSource[];
}

function localized(tr: string, en?: string) {
  return en ? { tr, en } : { tr };
}

function audienceCopy(tr: string, en?: string) {
  return { normal: localized(tr, en) };
}

export function createFoundationLesson(spec: FoundationLessonSpec): MicroLesson {
  const firstQuestionVisual = FIRST_QUESTION_VISUALS[spec.conceptKey];
  const contentBlocks: MicroLesson['contentBlocks'] = [
    {
      id: `${spec.id}.prompt`,
      order: 0,
      audience: 'all',
      kind: 'prompt',
      copy: audienceCopy(spec.hook, spec.hookEn),
    },
    {
      id: `${spec.id}.explanation`,
      order: 1,
      audience: 'all',
      kind: 'explanation',
      copy: {
        normal: localized(spec.explanation, spec.explanationEn),
        ...(spec.proExplanation
          ? { pro: localized(spec.proExplanation, spec.proExplanationEn) }
          : {}),
      },
    },
    ...(spec.visualAlt
      ? [
          {
            id: `${spec.id}.visual`,
            order: 2,
            audience: 'all' as const,
            kind: 'visual' as const,
            assetRef: `edu://wave1/${spec.slug}`,
            alt: localized(spec.visualAlt, spec.visualAltEn),
          },
        ]
      : []),
    {
      id: `${spec.id}.misconception`,
      order: 3,
      audience: 'all',
      kind: 'misconception',
      copy: audienceCopy(spec.misconception, spec.misconceptionEn),
    },
    {
      id: `${spec.id}.safety`,
      order: 4,
      audience: 'all',
      kind: 'callout',
      tone: 'risk',
      copy: {
        normal: {
          tr: 'Bu bilgi bir işlemi önermez; karar öncesi ürün, piyasa ve gerçekleşme riskleri ayrıca değerlendirilmelidir.',
          en: 'This information does not recommend a trade; product, market, and execution risks should be assessed before any decision.',
        },
      },
    },
  ];

  return microLessonSchema.parse({
    id: spec.id,
    slug: spec.slug,
    seriesId: `series.${spec.conceptKey}`,
    conceptKey: spec.conceptKey,
    skillId: spec.skillId,
    competencyIds: [spec.competencyId],
    title: localized(spec.title, spec.titleEn),
    learningObjective: localized(spec.objective, spec.objectiveEn),
    estimatedMinutes: spec.minutes,
    learningStage: spec.learningStage ?? 'foundation',
    accessTier: 'free',
    marketScopes: ['general'],
    prerequisiteConceptKeys: spec.prerequisiteConceptKeys,
    relatedConceptKeys: spec.relatedConceptKeys,
    contentBlocks,
    practicalTask: {
      id: `task.${spec.slug}.001`,
      kind: spec.taskKind ?? 'scenario_choice',
      conceptKey: spec.conceptKey,
      prompt: audienceCopy(spec.taskPrompt, spec.taskPromptEn),
      ...(spec.taskAssetRef ? { assetRef: spec.taskAssetRef } : {}),
      choices: spec.taskChoices.map((choice) => ({
        id: choice.id,
        label: localized(choice.label, choice.labelEn),
      })),
      evaluationRule: 'exact',
      expectedEvidence: spec.taskCorrectIds,
    },
    quiz: {
      id: `quiz.${spec.slug}.001`,
      passingScore: 67,
      questions: spec.questions.map((question, index) => ({
        id: `question.${spec.slug}.${index + 1}`,
        kind: 'single_choice',
        conceptKey: spec.conceptKey,
        prompt: localized(question.prompt, question.promptEn),
        ...(question.visual || (index === 0 && firstQuestionVisual)
          ? {
              visual: {
                assetRef: question.visual?.assetRef ?? firstQuestionVisual!.assetRef,
                alt: localized(
                  question.visual?.alt ?? firstQuestionVisual!.alt,
                  question.visual?.altEn ?? firstQuestionVisual!.altEn,
                ),
              },
            }
          : {}),
        options: question.choices.map((choice) => ({
          id: choice.id,
          label: localized(choice.label, choice.labelEn),
        })),
        correctOptionId: question.correctId,
        explanation: localized(question.explanation, question.explanationEn),
      })),
    },
    takeaway: localized(spec.takeaway, spec.takeawayEn),
    sources: spec.sources,
    contentVersion: {
      version: '0.1.0',
      status: 'draft',
      canonicalLanguage: 'tr',
      authoredAt: '2026-07-15T18:00:00+03:00',
      riskDisclaimer: {
        tr: 'Bu içerik eğitim amaçlıdır ve yatırım tavsiyesi değildir.',
        en: 'This content is educational and is not investment advice.',
      },
    },
  });
}
