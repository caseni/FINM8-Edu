export type CodeInfographicRole =
  | 'hook'
  | 'concept'
  | 'practice'
  | 'misconception'
  | 'summary';

export type CodeInfographicMechanism =
  | 'comparison'
  | 'matching'
  | 'cause_effect'
  | 'sequence'
  | 'tradeoff'
  | 'before_after';

export interface BeginnerCodeInfographicSpec {
  readonly lessonId: string;
  readonly teachingGoal: { readonly tr: string; readonly en: string };
  readonly mechanism: CodeInfographicMechanism;
  readonly roles: readonly CodeInfographicRole[];
  readonly mobileStrategy: 'two_by_two' | 'stacked' | 'single_focus' | 'sequence';
  readonly textBudget: {
    readonly headingWords: number;
    readonly cardWords: number;
    readonly ruleWords: number;
  };
  readonly reviewQuestions: readonly string[];
}

export const BEGINNER_MARKET_CODE_INFOGRAPHIC_SPECS: readonly BeginnerCodeInfographicSpec[] = [
  {
    lessonId: 'lesson.market.price-formation.001',
    teachingGoal: {
      tr: 'Alıcı ve satıcı aynı fiyatta buluşunca işlemin oluştuğunu göster.',
      en: 'Show that a trade forms when buyer and seller meet at the same price.',
    },
    mechanism: 'matching',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'single_focus',
    textBudget: { headingWords: 7, cardWords: 6, ruleWords: 10 },
    reviewQuestions: ['İlişki tek bakışta anlaşılıyor mu?', 'Metin olmadan da ana fikir seçilebiliyor mu?'],
  },
  {
    lessonId: 'lesson.market.instruments.001',
    teachingGoal: {
      tr: 'Dört aracın dört farklı şeyi temsil ettiğini tek bakışta göster.',
      en: 'Show at a glance that four instruments represent four different things.',
    },
    mechanism: 'comparison',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'two_by_two',
    textBudget: { headingWords: 6, cardWords: 5, ruleWords: 0 },
    reviewQuestions: ['Her kart neyi temsil ettiğini söylüyor mu?', 'Özet görsel slide cümlesini tekrar ediyor mu?'],
  },
  {
    lessonId: 'lesson.market.liquidity.001',
    teachingGoal: {
      tr: 'Kalabalık ve sığ piyasada işlem kolaylığının nasıl değiştiğini karşılaştır.',
      en: 'Compare how trading ease changes between active and thin markets.',
    },
    mechanism: 'comparison',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'stacked',
    textBudget: { headingWords: 7, cardWords: 6, ruleWords: 10 },
    reviewQuestions: ['İki durum görsel olarak gerçekten farklı mı?', 'Dekor yerine işlem kolaylığı mı anlatılıyor?'],
  },
  {
    lessonId: 'lesson.market.bid-ask.001',
    teachingGoal: {
      tr: 'Alış ve satış teklifleri arasındaki farkı görsel olarak ayır.',
      en: 'Visually separate the buy offer from the sell offer and their gap.',
    },
    mechanism: 'comparison',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'single_focus',
    textBudget: { headingWords: 7, cardWords: 5, ruleWords: 10 },
    reviewQuestions: ['Alış ve satış tarafları karışıyor mu?', 'Spread mesafesi görünür mü?'],
  },
  {
    lessonId: 'lesson.market.order-types.001',
    teachingGoal: {
      tr: 'Piyasa, limit ve stop emrinin neyi kontrol ettiğini karşılaştır.',
      en: 'Compare what market, limit, and stop orders control.',
    },
    mechanism: 'tradeoff',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'stacked',
    textBudget: { headingWords: 7, cardWords: 6, ruleWords: 10 },
    reviewQuestions: ['Hız ve fiyat kontrolü ayrımı görünür mü?', 'Üç emir aynı ikon ailesine indirgenmiş mi?'],
  },
  {
    lessonId: 'lesson.market.slippage.001',
    teachingGoal: {
      tr: 'Görülen fiyat ile gerçekleşen fiyat arasındaki farkın nasıl oluştuğunu göster.',
      en: 'Show how the displayed price can differ from the execution price.',
    },
    mechanism: 'sequence',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'sequence',
    textBudget: { headingWords: 7, cardWords: 6, ruleWords: 10 },
    reviewQuestions: ['100 → 100,3 akışı tek bakışta okunuyor mu?', 'Görsel hareket nedenini anlatıyor mu?'],
  },
] as const;

export const BEGINNER_MARKET_CODE_INFOGRAPHIC_SPEC_BY_LESSON_ID = new Map(
  BEGINNER_MARKET_CODE_INFOGRAPHIC_SPECS.map((spec) => [spec.lessonId, spec] as const),
);
