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


export const BEGINNER_ECONOMY_CODE_INFOGRAPHIC_SPECS: readonly BeginnerCodeInfographicSpec[] = [
  {
    lessonId: 'lesson.economy.inflation.001',
    teachingGoal: { tr: 'Aynı paranın zamanla daha az ürün alabildiğini göster.', en: 'Show that the same money can buy fewer goods over time.' },
    mechanism: 'before_after',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'stacked',
    textBudget: { headingWords: 7, cardWords: 5, ruleWords: 0 },
    reviewQuestions: ['Aynı bütçe iki durumda açıkça karşılaştırılıyor mu?', 'Sepet farkı metinsiz anlaşılabiliyor mu?'],
  },
  {
    lessonId: 'lesson.economy.interest-rates.001',
    teachingGoal: { tr: 'Faiz yükselince borç maliyetinin artabildiğini göster.', en: 'Show that borrowing cost can rise when interest rises.' },
    mechanism: 'cause_effect',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'stacked',
    textBudget: { headingWords: 7, cardWords: 5, ruleWords: 0 },
    reviewQuestions: ['Faiz ile maliyet arasındaki yön açık mı?', 'Kredi kartları gereksiz metin taşıyor mu?'],
  },
  {
    lessonId: 'lesson.economy.central-banks.001',
    teachingGoal: { tr: 'Merkez bankasının tek tek fiyatları değil ekonomik koşulları etkilediğini göster.', en: 'Show that a central bank influences conditions rather than individual prices.' },
    mechanism: 'cause_effect',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'single_focus',
    textBudget: { headingWords: 7, cardWords: 5, ruleWords: 0 },
    reviewQuestions: ['Merkez bankası ile kredi/faiz koşulları ilişkisi görünür mü?', 'Görsel fiyat belirleme yanılgısını güçlendiriyor mu?'],
  },
  {
    lessonId: 'lesson.economy.monetary-policy.001',
    teachingGoal: { tr: 'Faiz kararının ekonomiye bir zincir üzerinden yayıldığını göster.', en: 'Show that a rate decision spreads through the economy as a chain.' },
    mechanism: 'sequence',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'sequence',
    textBudget: { headingWords: 7, cardWords: 5, ruleWords: 0 },
    reviewQuestions: ['Faiz → kredi → harcama sırası açık mı?', 'Zaman etkisi görselde hissediliyor mu?'],
  },
  {
    lessonId: 'lesson.economy.growth.001',
    teachingGoal: { tr: 'Ekonomik büyümeyi daha fazla toplam üretim olarak göster.', en: 'Show economic growth as more total output.' },
    mechanism: 'before_after',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'stacked',
    textBudget: { headingWords: 7, cardWords: 5, ruleWords: 0 },
    reviewQuestions: ['Büyüme borsa yükselişiyle karışıyor mu?', 'Toplam üretim fikri tek bakışta seçiliyor mu?'],
  },
  {
    lessonId: 'lesson.economy.business-cycle.001',
    teachingGoal: { tr: 'Harcama, üretim ve işe alım birlikte zayıflayınca yavaşlamayı göster.', en: 'Show slowdown when spending, production, and hiring weaken together.' },
    mechanism: 'cause_effect',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'stacked',
    textBudget: { headingWords: 7, cardWords: 5, ruleWords: 0 },
    reviewQuestions: ['Birden fazla alanın birlikte zayıfladığı görülüyor mu?', 'Tek veri = resesyon yanılgısı önleniyor mu?'],
  },
] as const;


export const BEGINNER_CHART_CODE_INFOGRAPHIC_SPECS: readonly BeginnerCodeInfographicSpec[] = [
  {
    lessonId: 'lesson.chart.candles.001',
    teachingGoal: { tr: 'Bir mumun tek zaman parçasındaki dört fiyatı özetlediğini göster.', en: 'Show that one candle summarizes four prices in one time period.' },
    mechanism: 'matching',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'single_focus',
    textBudget: { headingWords: 7, cardWords: 5, ruleWords: 0 },
    reviewQuestions: ['Açılış, kapanış, yüksek ve düşük tek bakışta ayrılıyor mu?', 'Mum geleceği tahmin ediyor gibi görünüyor mu?'],
  },
  {
    lessonId: 'lesson.chart.timeframes.001',
    teachingGoal: { tr: 'Aynı hareketin farklı zaman ölçeklerinde farklı görünebildiğini göster.', en: 'Show how the same move can look different across timeframes.' },
    mechanism: 'comparison',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'two_by_two',
    textBudget: { headingWords: 7, cardWords: 5, ruleWords: 0 },
    reviewQuestions: ['Yakın ve geniş görünüm aynı piyasanın iki ölçeği olarak okunuyor mu?', 'Ölçek farkı renk dışında da görünür mü?'],
  },
  {
    lessonId: 'lesson.chart.trend.001',
    teachingGoal: { tr: 'Trendin tek mumdan değil ardışık tepe ve diplerden oluştuğunu göster.', en: 'Show that trend comes from successive highs and lows, not one candle.' },
    mechanism: 'sequence',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'stacked',
    textBudget: { headingWords: 7, cardWords: 5, ruleWords: 0 },
    reviewQuestions: ['Tek mum ile genel yapı görsel olarak ayrılıyor mu?', 'Yükselen, düşen ve yatay yapı kolay seçiliyor mu?'],
  },
  {
    lessonId: 'lesson.chart.support-resistance.001',
    teachingGoal: { tr: 'Destek ve direncin kesin çizgi değil tepki bölgesi olduğunu göster.', en: 'Show support and resistance as reaction zones rather than exact lines.' },
    mechanism: 'comparison',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'stacked',
    textBudget: { headingWords: 7, cardWords: 5, ruleWords: 0 },
    reviewQuestions: ['Bölge fikri çizgiden daha baskın mı?', 'Görsel kesin duvar algısı yaratıyor mu?'],
  },
  {
    lessonId: 'lesson.technical.momentum.001',
    teachingGoal: { tr: 'Aynı yöndeki hareketlerin farklı hız ve güçte olabildiğini göster.', en: 'Show that moves in the same direction can have different speed and strength.' },
    mechanism: 'comparison',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'two_by_two',
    textBudget: { headingWords: 7, cardWords: 5, ruleWords: 0 },
    reviewQuestions: ['Hız farkı fiyat yönünden bağımsız okunuyor mu?', 'Görsel momentumun gelecek garantisi olduğu izlenimini veriyor mu?'],
  },
  {
    lessonId: 'lesson.technical.moving-average.001',
    teachingGoal: { tr: 'Hareketli ortalamanın geçmiş fiyatları yumuşak bir çizgide özetlediğini göster.', en: 'Show that a moving average smooths past prices into one line.' },
    mechanism: 'before_after',
    roles: ['hook', 'concept', 'practice', 'misconception', 'summary'],
    mobileStrategy: 'stacked',
    textBudget: { headingWords: 7, cardWords: 5, ruleWords: 0 },
    reviewQuestions: ['Geçmiş fiyat → yumuşak çizgi ilişkisi açık mı?', 'Çizgi geleceği bilen sinyal gibi sunuluyor mu?'],
  },
] as const;

export const BEGINNER_MARKET_CODE_INFOGRAPHIC_SPEC_BY_LESSON_ID = new Map(
  BEGINNER_MARKET_CODE_INFOGRAPHIC_SPECS.map((spec) => [spec.lessonId, spec] as const),
);

export const BEGINNER_CODE_INFOGRAPHIC_SPEC_BY_LESSON_ID = new Map(
  [
    ...BEGINNER_MARKET_CODE_INFOGRAPHIC_SPECS,
    ...BEGINNER_ECONOMY_CODE_INFOGRAPHIC_SPECS,
    ...BEGINNER_CHART_CODE_INFOGRAPHIC_SPECS,
  ].map((spec) => [spec.lessonId, spec] as const),
);
