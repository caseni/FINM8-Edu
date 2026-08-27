import React from 'react';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { selectAudienceCopy, type LearningLanguage } from '../../domain/learning/presentation';
import type { ContentBlock, PresentationMode } from '../../domain/learning/types';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import { LessonBlockRenderer } from './LessonBlockRenderer';
import { LessonSupportingVisual, type LessonSupportingVisualRole } from './LessonSupportingVisual';

type VisualBlock = Extract<ContentBlock, { kind: 'visual' }>;

const LEARNING_FONT_FAMILY = Platform.select({
  web: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  default: undefined,
});

interface SupportingVisual {
  readonly assetRef: string;
  readonly alt: string;
}

export interface PremiumLessonBlockRendererProps {
  block: ContentBlock;
  language: LearningLanguage;
  presentationMode: PresentationMode;
  theme?: LearningTheme;
  renderVisual?: (block: VisualBlock) => React.ReactNode;
  supportingVisual?: SupportingVisual;
}

type LessonExample = {
  readonly match: string;
  readonly tr: string;
  readonly en: string;
};

const BEGINNER_EXAMPLES: readonly LessonExample[] = [
  {
    match: 'enflasyon-satin-alma-gucu',
    tr: 'Geçen yıl aynı bütçeyle 5 temel ürün alabiliyorken bugün 4 ürün alabiliyorsan, para miktarın değişmese bile satın alma gücün azalmıştır.',
    en: 'If the same budget bought five basic items last year but buys four today, your purchasing power has fallen even though the amount of money is unchanged.',
  },
  {
    match: 'faiz-orani-ne-anlatir',
    tr: '100.000 TL kredi için faiz yükseldiğinde, aynı vade ve diğer koşullar sabitken toplam geri ödeme genellikle artar. Faiz, borçlanmanın fiyatı gibi düşünülebilir.',
    en: 'For a TRY 100,000 loan, a higher rate generally means a higher total repayment when the term and other conditions stay the same. Interest can be thought of as the price of borrowing.',
  },
  {
    match: 'merkez-bankasi-ne-yapar',
    tr: 'Merkez bankası marketteki ekmek fiyatını tek tek belirlemez; faiz ve para koşullarını etkileyerek kredi, harcama ve fiyatlama davranışlarının genel ortamını değiştirir.',
    en: 'A central bank does not set the price of bread item by item; by influencing interest rates and monetary conditions it changes the wider environment for credit, spending, and pricing.',
  },
  {
    match: 'faiz-karari-ekonomiye-nasil-yansir',
    tr: 'Bir faiz kararı bugün açıklansa bile konut kredileri, şirket yatırımları ve tüketici harcamaları aynı dakika değişmez. Etki haftalar ve aylar boyunca farklı kanallardan yayılabilir.',
    en: 'Even if a rate decision is announced today, mortgages, business investment, and consumer spending do not all change instantly. The effect can spread through different channels over weeks and months.',
  },
  {
    match: 'gsyh-buyume-ne-anlatir',
    tr: 'Bir ekonomide üretim ve hizmetlerin toplamı geçen döneme göre artıyorsa büyüme vardır; fakat bu tek başına herkesin gelirinin aynı oranda arttığı anlamına gelmez.',
    en: 'If total production and services rise from the previous period, the economy has grown; that does not mean every person’s income rose by the same rate.',
  },
  {
    match: 'ekonomik-dongu-resesyon',
    tr: 'Talep zayıfladığında şirketler daha az satış yapabilir, işe alımlar yavaşlayabilir ve yatırım ertelenebilir. Ekonomik döngü bu değişimlerin birlikte nasıl hareket ettiğini anlatır.',
    en: 'When demand weakens, companies may sell less, hiring can slow, and investment can be postponed. The business cycle describes how these changes can move together.',
  },
  {
    match: 'fiyat-piyasada-nasil-olusur',
    tr: 'Bir alıcı 100 TL ödemeye, bir satıcı da 100 TL’ye satmaya razı olduğunda işlem 100 TL’den gerçekleşebilir. Sonraki alıcı 101 TL ödemeye razıysa yeni eşleşme daha yukarıda oluşabilir.',
    en: 'If a buyer is willing to pay 100 and a seller accepts 100, a trade can happen at 100. If the next buyer is willing to pay 101, the next match can form higher.',
  },
  {
    match: 'piyasa-araclari-ayni-degildir',
    tr: 'Bir BIST hissesini almak şirkete ortaklık anlamına gelir; altın almak ise şirkete ortak olmak değil, farklı bir varlık türüne maruz kalmaktır.',
    en: 'Buying a listed company share means owning part of a company; buying gold is exposure to a different asset type, not company ownership.',
  },
  {
    match: 'likidite-neden-onemlidir',
    tr: 'Çok işlem gören bir hissede küçük bir satış emri genellikle fiyatı az etkiler. Alıcının az olduğu bir üründe aynı satış emri fiyatı daha fazla oynatabilir.',
    en: 'In a heavily traded share, a small sell order usually has limited price impact. In a thin market, the same sell order can move price much more.',
  },
  {
    match: 'bid-ask-spread-nedir',
    tr: 'Alış 99,90 TL ve satış 100,10 TL ise aradaki 0,20 TL spread’dir. Hemen almak isteyen kişi satış tarafına, hemen satmak isteyen kişi alış tarafına yaklaşır.',
    en: 'If the bid is 99.90 and the ask is 100.10, the 0.20 difference is the spread. A buyer wanting immediate execution moves toward the ask; an immediate seller moves toward the bid.',
  },
  {
    match: 'piyasa-limit-stop-emirleri',
    tr: 'Bir hisse 100 TL civarındayken 100 TL’nin üstünden almak istemiyorsan limit emir fiyat sınırı koyar. Piyasa emri ise fiyat sınırından çok hızlı gerçekleşmeye öncelik verir.',
    en: 'If a share is around 100 and you do not want to buy above 100, a limit order sets a price ceiling. A market order prioritizes quick execution over a strict price limit.',
  },
  {
    match: 'gerceklesme-fiyati-kayma',
    tr: 'Ekranda 100,00 TL görürken hızlı piyasada emrin 100,15 TL’den gerçekleşebilir. Aradaki 0,15 TL fark kaymadır; ekrandaki fiyat gerçekleşme garantisi değildir.',
    en: 'You may see 100.00 on screen but execute at 100.15 in a fast market. The 0.15 difference is slippage; the displayed price is not an execution guarantee.',
  },
  {
    match: 'bir-mum-bize-ne-soyler',
    tr: 'Bir günlük mum 100’den açılıp 106’yı görüp 102’den kapandıysa, yalnız kapanışı değil gün içindeki en yüksek ve en düşük seviyeleri de tek bakışta okuyabilirsin.',
    en: 'If a daily candle opens at 100, trades as high as 106, and closes at 102, you can read more than the close: the day’s high and low are visible too.',
  },
  {
    match: 'zaman-dilimi-neyi-degistirir',
    tr: '15 dakikalık grafikte düşüş gibi görünen birkaç mum, günlük grafikte güçlü bir yükselişin küçük geri çekilmesi olabilir. Zaman dilimi bağlamı değiştirir.',
    en: 'A few falling candles on a 15-minute chart may be only a small pullback inside a strong daily uptrend. Timeframe changes context.',
  },
  {
    match: 'trend-yon-mu-yapi-mi',
    tr: 'Fiyat 100 → 108 → 104 → 112 şeklinde ilerliyorsa yalnız “yukarı gidiyor” demek yerine daha yüksek tepe ve dip yapısına bakmak trendi daha sağlam okutur.',
    en: 'If price moves 100 → 108 → 104 → 112, looking at higher highs and higher lows gives a stronger trend read than simply saying “it is going up.”',
  },
  {
    match: 'destek-direnc-bolgedir',
    tr: 'Fiyat birkaç kez 99–101 aralığında tepki verdiyse bunu tam 100,00 çizgisi yerine yaklaşık bir bölge olarak düşünmek daha gerçekçidir.',
    en: 'If price reacts several times around 99–101, treating it as a zone rather than an exact 100.00 line is usually more realistic.',
  },
  {
    match: 'momentum-ne-anlatir',
    tr: 'Fiyat yükselmeye devam ederken her yeni yükseliş daha küçük ve yavaş oluyorsa yön hâlâ yukarı olabilir ama momentum zayıflıyor olabilir.',
    en: 'Price can still be rising while each new push becomes smaller and slower; direction may remain up even as momentum weakens.',
  },
  {
    match: 'hareketli-ortalama-ne-yapar',
    tr: '20 günlük ortalama son 20 kapanışı yumuşatır. Bugünkü ani hareketi gecikmeli yansıttığı için hareketli ortalama fiyatı tahmin eden bir çizgi değil, geçmişi özetleyen bir filtredir.',
    en: 'A 20-day average smooths the last 20 closes. Because it reacts with a lag, it is a filter summarizing past price, not a line that predicts the next price.',
  },
  {
    match: 'risk-belirsizlik-kayip',
    tr: '10.000 TL’lik bir işlemde “ne kadar kazanırım?” kadar “yanlışsam ne kadar kaybederim?” sorusu da kararın parçasıdır. Risk, yalnız kötü sonuç değil belirsiz sonuç aralığıdır.',
    en: 'In a TRY 10,000 trade, “how much can I lose if I am wrong?” matters as much as “how much can I make?” Risk is uncertainty around outcomes, not just a bad outcome.',
  },
  {
    match: 'volatilite-once-risktir',
    tr: 'Bir varlık normalde günde %1 hareket ederken başka biri %5 oynuyorsa, aynı büyüklükte pozisyon ikinci varlıkta çok daha büyük parasal dalgalanma yaratabilir.',
    en: 'If one asset typically moves 1% a day and another 5%, the same position size can create much larger money swings in the second asset.',
  },
  {
    match: 'pozisyon-buyuklugu-once-gelir',
    tr: 'Portföyün 100.000 TL ve bir işlemde en fazla 1.000 TL kaybetmek istiyorsan, stop mesafesi büyüdükçe alabileceğin pozisyon miktarı küçülmelidir.',
    en: 'If your portfolio is TRY 100,000 and you want to risk at most TRY 1,000 on one trade, a wider stop distance should mean a smaller position size.',
  },
  {
    match: 'risk-getiri-tek-basina-yetmez',
    tr: '1 TL risk edip 3 TL hedeflemek kulağa iyi gelebilir; fakat hedefe ulaşma olasılığı çok düşükse yalnız 1:3 oranına bakmak karar vermek için yeterli değildir.',
    en: 'Risking 1 to target 3 can sound attractive, but if the probability of reaching the target is very low, the 1:3 ratio alone is not enough for a decision.',
  },
  {
    match: 'stop-emri-garanti-midir',
    tr: 'Stop seviyen 95 TL olsa bile sert bir haber sonrası ilk ulaşılabilir işlem 93 TL’de oluşabilir. Stop tetikler; gerçekleşme fiyatını her koşulda garanti etmez.',
    en: 'Even with a stop at 95, a sharp news move may make the first available execution 93. A stop triggers an order; it does not guarantee the exact fill price in every condition.',
  },
  {
    match: 'cok-varlik-cesitlendirme-degildir',
    tr: 'Beş farklı banka hissesi almak beş ayrı isim taşır ama hepsi aynı sektör riskine bağlı olabilir. Çeşitlendirme, isim sayısından çok risk kaynaklarını ayırmakla ilgilidir.',
    en: 'Owning five different bank shares gives you five names, but they can still share the same sector risk. Diversification is about separating risk sources, not just counting holdings.',
  },
];

function roleForBlock(block: Exclude<ContentBlock, VisualBlock>): LessonSupportingVisualRole {
  if (block.kind === 'prompt') return 'hook';
  if (block.kind === 'misconception') return 'misconception';
  if (block.kind === 'callout') {
    if (block.tone === 'risk') return 'risk';
    if (block.tone === 'evidence') return 'practice';
  }
  return 'concept';
}

function labelForBlock(block: Exclude<ContentBlock, VisualBlock>, language: LearningLanguage): string | undefined {
  const tr = language === 'tr';
  if (block.kind === 'prompt') return tr ? 'BİR DÜŞÜN' : 'THINK FIRST';
  if (block.kind === 'explanation') return tr ? 'KISA MANTIK' : 'CORE IDEA';
  if (block.kind === 'misconception') return tr ? 'YAYGIN HATA' : 'COMMON MISTAKE';
  if (block.kind === 'callout' && block.tone === 'risk') return tr ? 'DİKKAT' : 'WATCH OUT';
  if (block.kind === 'callout' && block.tone === 'evidence') return tr ? 'PRATİK NOT' : 'PRACTICAL NOTE';
  return undefined;
}

function exampleForAsset(assetRef: string, language: LearningLanguage): string | undefined {
  const match = BEGINNER_EXAMPLES.find((entry) => assetRef.includes(entry.match));
  return match ? match[language] : undefined;
}

export function PremiumLessonBlockRenderer({
  block,
  language,
  presentationMode,
  theme = defaultLearningTheme,
  renderVisual,
  supportingVisual,
}: PremiumLessonBlockRendererProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const styles = createStyles(theme, wide);

  if (block.kind === 'visual') {
    const example = exampleForAsset(block.assetRef, language);
    return (
      <View style={styles.visualStep}>
        <LessonBlockRenderer
          block={block}
          language={language}
          presentationMode={presentationMode}
          theme={theme}
          renderVisual={renderVisual}
          supportingVisual={supportingVisual}
        />
        {example ? (
          <View style={styles.exampleCard}>
            <Text style={styles.exampleEyebrow}>{language === 'tr' ? 'MİNİ ÖRNEK' : 'MINI EXAMPLE'}</Text>
            <Text style={styles.exampleText}>{example}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  if (block.kind === 'bullet_list') {
    return (
      <View style={styles.block}>
        {block.title ? <Text style={styles.sectionTitle}>{selectAudienceCopy(block.title, presentationMode, language)}</Text> : null}
        <View style={styles.bulletList}>
          {block.items.map((item, index) => (
            <View key={`${block.id}.${index}`} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.body}>{selectAudienceCopy(item, presentationMode, language)}</Text>
            </View>
          ))}
        </View>
        {supportingVisual ? (
          <LessonSupportingVisual assetRef={supportingVisual.assetRef} alt={supportingVisual.alt} language={language} role={roleForBlock(block)} theme={theme} />
        ) : null}
      </View>
    );
  }

  const copy = selectAudienceCopy(block.copy, presentationMode, language);
  const label = labelForBlock(block, language);
  const role = roleForBlock(block);
  const toneStyle = block.kind === 'misconception'
    ? styles.warningCard
    : block.kind === 'callout' && block.tone === 'risk'
      ? styles.riskCard
      : block.kind === 'callout' && block.tone === 'evidence'
        ? styles.evidenceCard
        : undefined;

  return (
    <View style={[styles.block, toneStyle]}>
      {label ? (
        <Text style={[
          styles.eyebrow,
          role === 'misconception' && styles.eyebrowWarning,
          role === 'risk' && styles.eyebrowRisk,
          role === 'practice' && styles.eyebrowPractice,
        ]}>{label}</Text>
      ) : null}
      <Text style={block.kind === 'prompt' ? styles.prompt : styles.body}>{copy}</Text>
      {supportingVisual ? (
        <View style={styles.visualFrame}>
          <LessonSupportingVisual
            assetRef={supportingVisual.assetRef}
            alt={supportingVisual.alt}
            language={language}
            role={role}
            theme={theme}
          />
        </View>
      ) : null}
    </View>
  );
}

const createStyles = (theme: LearningTheme, wide: boolean) => StyleSheet.create({
  block: { gap: wide ? 13 : 11 },
  visualStep: { gap: 10 },
  eyebrow: { color: theme.colors.primary, fontSize: 11, lineHeight: 15, fontWeight: '900', letterSpacing: 0.9 },
  eyebrowWarning: { color: theme.colors.warning },
  eyebrowRisk: { color: theme.colors.risk },
  eyebrowPractice: { color: theme.colors.success },
  prompt: {
    color: theme.colors.text,
    fontFamily: LEARNING_FONT_FAMILY,
    fontSize: wide ? 28 : 22,
    lineHeight: wide ? 36 : 29,
    fontWeight: '800',
    letterSpacing: -0.25,
  },
  body: {
    color: theme.colors.text,
    fontFamily: LEARNING_FONT_FAMILY,
    fontSize: wide ? 18 : 16,
    lineHeight: wide ? 28 : 24,
    fontWeight: '400',
  },
  sectionTitle: { color: theme.colors.text, fontFamily: LEARNING_FONT_FAMILY, fontSize: wide ? 21 : 18, lineHeight: wide ? 28 : 25, fontWeight: '700' },
  bulletList: { gap: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bulletDot: { width: 7, height: 7, marginTop: wide ? 12 : 10, borderRadius: 4, backgroundColor: theme.colors.primary },
  visualFrame: { marginTop: 2 },
  warningCard: {
    padding: wide ? 16 : 14,
    borderRadius: theme.radius.medium,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.warning,
    backgroundColor: theme.colors.surfaceMuted,
  },
  riskCard: {
    padding: wide ? 16 : 14,
    borderRadius: theme.radius.medium,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.risk,
    backgroundColor: theme.colors.surfaceMuted,
  },
  evidenceCard: {
    padding: wide ? 16 : 14,
    borderRadius: theme.radius.medium,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.success,
    backgroundColor: theme.colors.surfaceMuted,
  },
  exampleCard: {
    gap: 7,
    paddingHorizontal: wide ? 15 : 13,
    paddingVertical: wide ? 12 : 11,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted,
  },
  exampleEyebrow: { color: theme.colors.primary, fontSize: 10, lineHeight: 14, fontWeight: '900', letterSpacing: 0.8 },
  exampleText: { color: theme.colors.text, fontFamily: LEARNING_FONT_FAMILY, fontSize: wide ? 16 : 14, lineHeight: wide ? 23 : 21, fontWeight: '500' },
});
