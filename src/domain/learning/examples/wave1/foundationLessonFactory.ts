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
    alt: 'Alıcı ve satıcının aynı fiyatta eşleşerek işlem oluşturduğunu gösteren sade şema',
    altEn: 'Simple diagram showing a buyer and seller matching at the same price to create a trade',
  },
  'market.basics.instruments': {
    assetRef: 'edu://wave1/piyasa-araclari-ayni-degildir',
    alt: 'Hisse, tahvil, döviz ve emtianın neyi temsil ettiğini karşılaştıran dört sade kart',
    altEn: 'Four simple cards comparing what stocks, bonds, currencies, and commodities represent',
  },
  'market.structure.liquidity': {
    assetRef: 'edu://wave1/likidite-neden-onemlidir',
    alt: 'Aynı satış miktarını alıcının yeterli veya az olduğu iki piyasada karşılaştıran sade görsel',
    altEn: 'Simple visual comparing the same sale size in markets with enough buyers and fewer buyers',
  },
  'market.microstructure.bid_ask': {
    assetRef: 'edu://wave1/bid-ask-spread-nedir',
    alt: 'Bid 99, ask 101 ve aradaki 2 birim spreadi gösteren fiyat ekranı',
    altEn: 'Quote screen showing bid 99, ask 101, and the 2-point spread between them',
  },
  'market.execution.order_types': {
    assetRef: 'edu://wave1/piyasa-limit-stop-emirleri',
    alt: 'Piyasa, limit ve stop emirlerinin gerçekleşme, fiyat sınırı ve tetikleme önceliklerini karşılaştıran sade kartlar',
    altEn: 'Simple cards comparing execution, price-limit, and trigger priorities for market, limit, and stop orders',
  },
  'market.execution.slippage': {
    assetRef: 'edu://wave1/gerceklesme-fiyati-kayma',
    alt: 'Ekranda görülen 100 fiyatı ile 100,3 gerçekleşme fiyatı arasındaki 0,3 kaymayı gösteren sade şema',
    altEn: 'Simple diagram showing 0.3 slippage between a displayed price of 100 and an execution price of 100.3',
  },
  'market.chart.candles': {
    assetRef: 'edu://wave1/bir-mum-bize-ne-soyler',
    alt: 'Gövde ve üst alt fitilleriyle bir mumun başlangıç, bitiş ve uç noktalarını gösteren sade şema',
    altEn: 'Simple candlestick diagram showing the body, upper and lower wicks, start, finish, and extremes',
  },
  'market.chart.timeframes': {
    assetRef: 'edu://wave1/zaman-dilimi-neyi-degistirir',
    alt: '15 dakikalık kısa geri çekilme ile günlük daha geniş yapının aynı anda görülebileceğini karşılaştıran iki kart',
    altEn: 'Two cards comparing a 15-minute pullback with a broader daily structure that can exist at the same time',
  },
  'market.trend.basics': {
    assetRef: 'edu://wave1/trend-yon-mu-yapi-mi',
    alt: 'Yükseliş, düşüş ve yatay fiyat yapısını karşılaştıran üç sade kart',
    altEn: 'Three simple cards comparing upward, downward, and sideways price structure',
  },
  'market.structure.support_resistance': {
    assetRef: 'edu://wave1/destek-direnc-cizgi-degildir',
    alt: 'Birden fazla tepkinin destek ve direnç alanlarında toplanabileceğini gösteren sade fiyat şeması',
    altEn: 'Simple price diagram showing multiple reactions clustering around support and resistance areas',
  },
  'market.structure.choch': {
    assetRef: 'edu://charts/choch-001',
    alt: 'Korunan dip kaybını ve olası karakter değişimini gösteren şema',
    altEn: 'Diagram showing a protected-low loss and a possible change of character',
  },
  'risk.basics': {
    assetRef: 'edu://wave1/risk-belirsizlik-kayip',
    alt: 'Karar anındaki belirsiz olası sonuçlardan daha sonra gerçekleşen sonuca giden akışı gösteren sade şema',
    altEn: 'Simple flow showing uncertain possible outcomes at decision time and the realized outcome later',
  },
  'risk.volatility': {
    assetRef: 'edu://wave1/volatilite-once-risktir',
    alt: 'Dar ve geniş fiyat hareket aralıklarını yan yana karşılaştıran sade şema',
    altEn: 'Simple diagram comparing narrow and wide price movement ranges side by side',
  },
  'risk.position_sizing': {
    assetRef: 'edu://wave1/pozisyon-buyuklugu-once-gelir',
    alt: 'Daha küçük ve daha büyük pozisyonların aynı fiyat hareketinde hesap etkisini karşılaştıran sade şema',
    altEn: 'Simple diagram comparing how smaller and larger positions affect an account under the same price move',
  },
  'risk.risk_reward': {
    assetRef: 'edu://wave1/risk-getiri-tek-basina-yetmez',
    alt: '1:5 risk getiri oranının tek başına karar kalitesini veya kazancı garanti etmediğini gösteren sade şema',
    altEn: 'Simple diagram showing that a 1:5 risk-reward ratio alone does not guarantee decision quality or profit',
  },
  'risk.stop_orders': {
    assetRef: 'edu://wave1/stop-emri-garanti-midir',
    alt: 'Fiyat hareketinden stop seviyesine ve ardından çıkış sürecine ilerleyen sade şema',
    altEn: 'Simple diagram moving from price movement to a stop level and then an exit process',
  },
  'portfolio.diversification': {
    assetRef: 'edu://wave1/cok-varlik-cesitlendirme-degildir',
    alt: 'Bir sepetteki birden fazla varlığın birlikte etkilenip etkilenmediğini sorgulayan sade şema',
    altEn: 'Simple diagram asking whether multiple assets in one basket are affected together',
  },
  'behavior.fomo': {
    assetRef: 'edu://wave1/fomo-karari-nasil-bozar',
    alt: 'Yükselen fiyat ve sosyal baskı karşısında dürtüsel karar ile duraklatılmış kontrol akışını karşılaştıran şema',
    altEn: 'Diagram comparing an impulsive decision under rising price and social pressure with a paused control flow',
  },
  'behavior.overtrading': {
    assetRef: 'edu://wave1/asiri-islem-nasil-fark-edilir',
    alt: 'Kayıp sonrası dürtüsel tekrar giriş döngüsü ile kontrollü karar döngüsünü karşılaştıran şema',
    altEn: 'Diagram comparing an impulsive re-entry loop after a loss with a controlled decision loop',
  },
  'behavior.confirmation_bias': {
    assetRef: 'edu://wave1/sadece-hakli-cikaran-kanit',
    alt: 'Tek taraflı kanıt arama ile görüşü çürütebilecek kanıtı da aramayı karşılaştıran şema',
    altEn: 'Diagram comparing one-sided evidence seeking with also looking for evidence that could disprove a view',
  },
  'evidence.data_quality': {
    assetRef: 'edu://wave1/her-veri-ayni-kalitede-degildir',
    alt: 'Kaynak, zaman, kapsam ve bağlam kontrolleriyle daha güçlü ve daha zayıf veriyi karşılaştıran şema',
    altEn: 'Diagram comparing stronger and weaker data using source, time, coverage, and context checks',
  },
  'evidence.freshness': {
    assetRef: 'edu://wave1/dogru-veri-ne-zaman-eskir',
    alt: 'Daha önce doğru olan verinin yeni bir olaydan sonra yeniden kontrol edilmesi gerektiğini gösteren zaman akışı',
    altEn: 'Timeline showing that previously correct information may need to be checked again after a new event',
  },
  'behavior.decision_journal': {
    assetRef: 'edu://wave1/sonucu-degil-karari-kaydet',
    alt: 'Gözlem, yorum, fikri değiştirecek koşul ve sonucu ayrı adımlarda gösteren sade karar günlüğü akışı',
    altEn: 'Simple decision-journal flow separating observation, interpretation, what would change the view, and the later result',
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
  traderTip?: string;
  traderTipEn?: string;
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
    ...(spec.traderTip
      ? [
          {
            id: `${spec.id}.trader-tip`,
            order: 3,
            audience: 'all' as const,
            kind: 'callout' as const,
            tone: 'evidence' as const,
            copy: audienceCopy(
              `TRADER PRATİK NOTU · ${spec.traderTip}`,
              spec.traderTipEn ? `TRADER PRACTICAL NOTE · ${spec.traderTipEn}` : undefined,
            ),
          },
        ]
      : []),
    {
      id: `${spec.id}.misconception`,
      order: spec.traderTip ? 4 : 3,
      audience: 'all',
      kind: 'misconception',
      copy: audienceCopy(spec.misconception, spec.misconceptionEn),
    },
    {
      id: `${spec.id}.safety`,
      order: spec.traderTip ? 5 : 4,
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
