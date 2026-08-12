import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type Topic = 'inflation' | 'rates' | 'centralBank' | 'policy' | 'growth' | 'cycle';

type Props = {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
};

type SceneProps = {
  tr: boolean;
  role: LessonSupportingVisualRole;
  styles: ReturnType<typeof createStyles>;
};

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('enflasyon-satin-alma-gucu')) return 'inflation';
  if (assetRef.includes('faiz-orani-ne-anlatir')) return 'rates';
  if (assetRef.includes('merkez-bankasi-ne-yapar')) return 'centralBank';
  if (assetRef.includes('faiz-karari-ekonomiye-nasil-yansir')) return 'policy';
  if (assetRef.includes('gsyh-buyume-ne-anlatir')) return 'growth';
  if (assetRef.includes('ekonomik-dongu-resesyon')) return 'cycle';
  return undefined;
}

export function isBeginnerEconomyStoryAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function BeginnerEconomyStoryVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: Props) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const sceneProps = { tr: language === 'tr', role, styles };

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {topic === 'inflation' ? <InflationStory {...sceneProps} /> : null}
      {topic === 'rates' ? <RatesStory {...sceneProps} /> : null}
      {topic === 'centralBank' ? <CentralBankStory {...sceneProps} /> : null}
      {topic === 'policy' ? <PolicyStory {...sceneProps} /> : null}
      {topic === 'growth' ? <GrowthStory {...sceneProps} /> : null}
      {topic === 'cycle' ? <CycleStory {...sceneProps} /> : null}
    </View>
  );
}

function Heading({ title, body, styles }: { title: string; body?: string; styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.heading}><Text style={styles.title}>{title}</Text>{body ? <Text style={styles.body}>{body}</Text> : null}</View>;
}

function Card({ label, value, tone = 'normal', styles }: { label: string; value: string; tone?: 'normal' | 'good' | 'warn'; styles: ReturnType<typeof createStyles> }) {
  return <View style={[styles.card, tone === 'good' && styles.cardGood, tone === 'warn' && styles.cardWarn]}><Text style={styles.cardLabel}>{label}</Text><Text style={[styles.cardValue, tone === 'good' && styles.good, tone === 'warn' && styles.warn]}>{value}</Text></View>;
}

function Arrow({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.arrow}><View style={styles.arrowTip} /></View>;
}

function Basket({ count, styles }: { count: number; styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.basket}><View style={styles.handle} /><View style={styles.goods}>{Array.from({ length: count }).map((_, index) => <View key={index} style={[styles.goodDot, index % 2 ? styles.goodDotB : styles.goodDotA]} />)}</View><View style={styles.basketBody} /></View>;
}

function Bank({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.bank}><View style={styles.bankRoof} /><View style={styles.bankHall}>{[0, 1, 2, 3].map((item) => <View key={item} style={styles.bankColumn} />)}</View><View style={styles.bankBase} /></View>;
}

function Node({ label, strong = false, styles }: { label: string; strong?: boolean; styles: ReturnType<typeof createStyles> }) {
  return <View style={[styles.node, strong && styles.nodeStrong]}><View style={[styles.nodeDot, strong && styles.nodeDotStrong]} /><Text style={styles.nodeText}>{label}</Text></View>;
}

function Pill({ label, styles }: { label: string; styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.pill}><Text style={styles.pillText}>{label}</Text></View>;
}

function Bars({ labels, widths, styles }: { labels: string[]; widths: number[]; styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.bars}>{labels.map((label, index) => <View key={label} style={styles.barRow}><Text style={styles.barLabel}>{label}</Text><View style={styles.barTrack}><View style={[styles.barFill, { width: `${widths[index]}%` }]} /></View></View>)}</View>;
}

function InflationStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') return <><Heading title={tr ? '100 TL aynı, sepet neden küçüldü?' : 'Same TRY 100, why did the basket shrink?'} styles={styles} /><View style={styles.row}><Card label={tr ? 'BÜTÇE' : 'BUDGET'} value="100 TL" styles={styles} /><Arrow styles={styles} /><Basket count={3} styles={styles} /></View></>;
  if (role === 'concept') return <><Heading title={tr ? 'Satın alma gücü = paranın alabildiği şeyler' : 'Purchasing power = what your money can buy'} styles={styles} /><View style={styles.row}><View style={styles.center}><Text style={styles.mini}>{tr ? 'ÖNCE' : 'BEFORE'}</Text><Basket count={6} styles={styles} /></View><Arrow styles={styles} /><View style={styles.center}><Text style={styles.mini}>{tr ? 'SONRA' : 'AFTER'}</Text><Basket count={3} styles={styles} /></View></View></>;
  if (role === 'practice') return <><Heading title={tr ? 'Aynı bütçe, daha az ürün' : 'Same budget, fewer goods'} body={tr ? '5 üründen 3 ürüne düşmek satın alma gücündeki azalmayı görünür kılar.' : 'Moving from five goods to three makes lower purchasing power visible.'} styles={styles} /><View style={styles.row}><Card label={tr ? 'ÖNCE' : 'BEFORE'} value="5 ürün" tone="good" styles={styles} /><Card label={tr ? 'SONRA' : 'AFTER'} value="3 ürün" tone="warn" styles={styles} /></View></>;
  if (role === 'misconception' || role === 'risk') return <><Heading title={tr ? 'Tek ürünün fiyatı ≠ genel fiyatlar' : 'One product price ≠ overall prices'} styles={styles} /><View style={styles.row}><Card label={tr ? 'TEK ÜRÜN' : 'ONE ITEM'} value="↑" tone="warn" styles={styles} /><Text style={styles.neq}>≠</Text><Card label={tr ? 'GENİŞ SEPET' : 'WIDER BASKET'} value="çok ürün" styles={styles} /></View></>;
  return <><Heading title={tr ? 'Fiyatlar genel olarak artarsa aynı para daha az şey alabilir' : 'If prices rise broadly, the same money can buy less'} styles={styles} /><View style={styles.row}><Card label={tr ? 'PARA' : 'MONEY'} value="100 TL" styles={styles} /><Arrow styles={styles} /><Card label={tr ? 'ALIM GÜCÜ' : 'BUYING POWER'} value="↓" tone="warn" styles={styles} /></View></>;
}

function RatesStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') return <><Heading title={tr ? 'Aynı borç, neden farklı geri ödeme?' : 'Same debt, why a different repayment?'} styles={styles} /><View style={styles.row}><Card label={tr ? 'DÜŞÜK FAİZ' : 'LOWER RATE'} value="₺₺" tone="good" styles={styles} /><Card label={tr ? 'YÜKSEK FAİZ' : 'HIGHER RATE'} value="₺₺₺₺" tone="warn" styles={styles} /></View></>;
  if (role === 'concept') return <><Heading title={tr ? 'Faiz yükselirse borçlanma maliyeti artabilir' : 'Higher rates can increase borrowing cost'} styles={styles} /><View style={styles.flow}><Node label={tr ? 'Faiz ↑' : 'Rate ↑'} strong styles={styles} /><Arrow styles={styles} /><Node label={tr ? 'Borç maliyeti ↑' : 'Borrowing cost ↑'} styles={styles} /></View></>;
  if (role === 'practice') return <><Heading title={tr ? 'Gerçek kredi koşulu birden fazla şeye bağlıdır' : 'Actual loan terms depend on more than one thing'} styles={styles} /><View style={styles.pills}><Pill label={tr ? 'FAİZ' : 'RATE'} styles={styles} /><Pill label={tr ? 'SÜRE' : 'TERM'} styles={styles} /><Pill label={tr ? 'RİSK' : 'RISK'} styles={styles} /></View></>;
  if (role === 'misconception' || role === 'risk') return <><Heading title={tr ? 'Her kredi aynı faizle verilmez' : 'Not every loan has the same rate'} styles={styles} /><View style={styles.row}><Card label={tr ? 'KREDİ A' : 'LOAN A'} value="%?" styles={styles} /><Text style={styles.neq}>≠</Text><Card label={tr ? 'KREDİ B' : 'LOAN B'} value="%?" styles={styles} /></View></>;
  return <><Heading title={tr ? 'Faiz, parayı borç almanın maliyetini etkiler' : 'Interest affects the cost of borrowing money'} styles={styles} /><View style={styles.row}><Card label={tr ? 'FAİZ' : 'RATE'} value="↑" styles={styles} /><Arrow styles={styles} /><Card label={tr ? 'MALİYET' : 'COST'} value="↑" tone="warn" styles={styles} /></View></>;
}

function CentralBankStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') return <><Heading title={tr ? 'Merkez bankası neden önemlidir?' : 'Why does the central bank matter?'} styles={styles} /><View style={styles.center}><Bank styles={styles} /><View style={styles.pills}><Pill label={tr ? 'FAİZ' : 'RATES'} styles={styles} /><Pill label={tr ? 'PARA KOŞULLARI' : 'MONEY CONDITIONS'} styles={styles} /></View></View></>;
  if (role === 'concept') return <><Heading title={tr ? 'Merkez bankası ekonomik koşulları etkiler' : 'The central bank influences economic conditions'} styles={styles} /><View style={styles.flow}><Bank styles={styles} /><Arrow styles={styles} /><Node label={tr ? 'Faiz ve kredi koşulları' : 'Rate and credit conditions'} strong styles={styles} /></View></>;
  if (role === 'practice') return <><Heading title={tr ? 'Kararın etkisi ekonomiye yayılabilir' : 'A decision can spread through the economy'} styles={styles} /><View style={styles.flow}><Node label={tr ? 'Karar' : 'Decision'} strong styles={styles} /><Arrow styles={styles} /><Node label={tr ? 'Kredi' : 'Credit'} styles={styles} /><Arrow styles={styles} /><Node label={tr ? 'Harcama' : 'Spending'} styles={styles} /></View></>;
  if (role === 'misconception' || role === 'risk') return <><Heading title={tr ? 'Merkez bankası her etiketteki fiyatı belirlemez' : 'The central bank does not set every price tag'} styles={styles} /><View style={styles.row}><Bank styles={styles} /><Text style={styles.neq}>≠</Text><View style={styles.priceGrid}>{[0, 1, 2, 3].map((item) => <View key={item} style={styles.priceTag}><Text style={styles.priceText}>₺</Text></View>)}</View></View></>;
  return <><Heading title={tr ? 'Merkez bankası tek tek fiyatları değil, ekonomik koşulları etkiler' : 'The central bank influences conditions, not individual prices'} styles={styles} /><View style={styles.flow}><Bank styles={styles} /><Arrow styles={styles} /><Card label={tr ? 'KOŞULLAR' : 'CONDITIONS'} value="↕" styles={styles} /></View></>;
}

function PolicyStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') return <><Heading title={tr ? 'Faiz kararı neden anında her şeyi değiştirmez?' : 'Why does a rate decision not change everything instantly?'} styles={styles} /><View style={styles.row}><Card label={tr ? 'BUGÜN' : 'TODAY'} value={tr ? 'Karar' : 'Decision'} styles={styles} /><View style={styles.dots}><View style={styles.dot} /><View style={styles.dot} /><View style={styles.dot} /></View><Card label={tr ? 'ZAMANLA' : 'OVER TIME'} value={tr ? 'Etki' : 'Effect'} styles={styles} /></View></>;
  if (role === 'concept') return <><Heading title={tr ? 'Etki bir zincir üzerinden yayılır' : 'The effect spreads through a chain'} styles={styles} /><View style={styles.flow}><Node label={tr ? 'Faiz' : 'Rate'} strong styles={styles} /><Arrow styles={styles} /><Node label={tr ? 'Kredi' : 'Credit'} styles={styles} /><Arrow styles={styles} /><Node label={tr ? 'Harcama' : 'Spending'} styles={styles} /></View></>;
  if (role === 'practice') return <><Heading title={tr ? 'Sırayı takip et' : 'Follow the sequence'} styles={styles} /><View style={styles.row}><Card label="1" value={tr ? 'Faiz' : 'Rate'} styles={styles} /><Card label="2" value={tr ? 'Kredi' : 'Credit'} styles={styles} /><Card label="3" value={tr ? 'Harcama' : 'Spending'} styles={styles} /></View></>;
  if (role === 'misconception' || role === 'risk') return <><Heading title={tr ? 'Faiz kararı bir aç/kapa düğmesi değildir' : 'A rate decision is not an on/off switch'} styles={styles} /><View style={styles.row}><Card label={tr ? 'KARAR' : 'DECISION'} value="şimdi" styles={styles} /><Text style={styles.neq}>≠</Text><Card label={tr ? 'TAM ETKİ' : 'FULL EFFECT'} value={tr ? 'anında' : 'instant'} tone="warn" styles={styles} /></View></>;
  return <><Heading title={tr ? 'Faiz kararı ekonomiye zaman içinde yayılır' : 'A rate decision spreads through the economy over time'} styles={styles} /><View style={styles.flow}><Node label={tr ? 'Faiz' : 'Rate'} strong styles={styles} /><Arrow styles={styles} /><Node label={tr ? 'Kredi' : 'Credit'} styles={styles} /><Arrow styles={styles} /><Node label={tr ? 'Harcama' : 'Spending'} styles={styles} /></View></>;
}

function GrowthStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') return <><Heading title={tr ? '“Ekonomi büyüdü” derken ne büyüdü?' : 'What grew when “the economy grew”?' } styles={styles} /><View style={styles.pills}><Pill label={tr ? 'MALLAR' : 'GOODS'} styles={styles} /><Pill label={tr ? 'ÜRETİM' : 'OUTPUT'} styles={styles} /><Pill label={tr ? 'HİZMETLER' : 'SERVICES'} styles={styles} /></View></>;
  if (role === 'concept') return <><Heading title={tr ? 'Büyüme, toplam ekonomik faaliyetin artmasıdır' : 'Growth is an increase in total economic activity'} styles={styles} /><View style={styles.flow}><Node label={tr ? 'Mal' : 'Goods'} styles={styles} /><Text style={styles.plus}>+</Text><Node label={tr ? 'Hizmet' : 'Services'} styles={styles} /><Arrow styles={styles} /><Card label={tr ? 'TOPLAM' : 'TOTAL'} value="↑" tone="good" styles={styles} /></View></>;
  if (role === 'practice') return <><Heading title={tr ? 'Toplam faaliyet artmış mı?' : 'Did total activity increase?'} styles={styles} /><View style={styles.row}><Card label={tr ? 'ÖNCE' : 'BEFORE'} value="100" styles={styles} /><Arrow styles={styles} /><Card label={tr ? 'SONRA' : 'AFTER'} value="105" tone="good" styles={styles} /></View></>;
  if (role === 'misconception' || role === 'risk') return <><Heading title={tr ? 'Ekonomi büyüdü ≠ herkes aynı ölçüde zenginleşti' : 'Economy grew ≠ everyone became equally richer'} styles={styles} /><View style={styles.row}><Card label={tr ? 'TOPLAM FAALİYET' : 'TOTAL ACTIVITY'} value="↑" tone="good" styles={styles} /><Text style={styles.neq}>≠</Text><Card label={tr ? 'HERKESİN GELİRİ' : 'EVERYONE’S INCOME'} value="aynı?" styles={styles} /></View></>;
  return <><Heading title={tr ? 'Ekonomik büyüme, üretilen toplam değerin artmasıdır' : 'Economic growth means more total value is produced'} styles={styles} /><View style={styles.row}><Card label={tr ? 'TOPLAM ÜRETİM' : 'TOTAL OUTPUT'} value="↑" tone="good" styles={styles} /></View></>;
}

function CycleStory({ tr, role, styles }: SceneProps) {
  const labels = tr ? ['Harcama', 'Üretim', 'İşe alım'] : ['Spending', 'Output', 'Hiring'];
  if (role === 'hook') return <><Heading title={tr ? 'Birden fazla alan aynı anda zayıflarsa?' : 'What if several areas weaken together?'} styles={styles} /><Bars labels={labels} widths={[72, 52, 34]} styles={styles} /></>;
  if (role === 'concept') return <><Heading title={tr ? 'Daha az harcama zincirleme yavaşlama yaratabilir' : 'Lower spending can create a chain of slower activity'} styles={styles} /><View style={styles.flow}><Node label={tr ? 'Harcama ↓' : 'Spending ↓'} strong styles={styles} /><Arrow styles={styles} /><Node label={tr ? 'Satış ↓' : 'Sales ↓'} styles={styles} /><Arrow styles={styles} /><Node label={tr ? 'Üretim ↓' : 'Output ↓'} styles={styles} /></View></>;
  if (role === 'practice') return <><Heading title={tr ? 'Geniş yavaşlama birden fazla yerde görünür' : 'Broad slowdown shows up in several places'} styles={styles} /><View style={styles.pills}><Pill label={tr ? 'HARCAMA ↓' : 'SPENDING ↓'} styles={styles} /><Pill label={tr ? 'ÜRETİM ↓' : 'OUTPUT ↓'} styles={styles} /><Pill label={tr ? 'İŞE ALIM ↓' : 'HIRING ↓'} styles={styles} /></View></>;
  if (role === 'misconception' || role === 'risk') return <><Heading title={tr ? 'Tek kötü veri ≠ resesyon' : 'One weak data point ≠ recession'} styles={styles} /><View style={styles.row}><Card label={tr ? 'TEK VERİ' : 'ONE DATA POINT'} value="↓" tone="warn" styles={styles} /><Text style={styles.neq}>≠</Text><Card label={tr ? 'GENİŞ + SÜREN ZAYIFLIK' : 'BROAD + LASTING WEAKNESS'} value="?" styles={styles} /></View></>;
  return <><Heading title={tr ? 'Ekonomi bazen hızlanır, bazen yavaşlar' : 'The economy sometimes speeds up and sometimes slows down'} styles={styles} /><Bars labels={labels} widths={[68, 48, 30]} styles={styles} /></>;
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 250, justifyContent: 'center', padding: 18, gap: 18, borderRadius: 22, borderWidth: 1, borderColor: '#29465A', backgroundColor: '#071522' },
  heading: { gap: 5 },
  title: { color: theme.colors.textPrimary, fontSize: 19, lineHeight: 25, fontWeight: '900' },
  body: { color: '#A6B8C7', fontSize: 13, lineHeight: 19, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 11 },
  center: { alignItems: 'center', gap: 8 },
  mini: { color: '#6BDCCD', fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  card: { flex: 1, minHeight: 78, justifyContent: 'center', padding: 12, gap: 6, borderRadius: 15, borderWidth: 1, borderColor: '#29495C', backgroundColor: '#0B1C2A' },
  cardGood: { borderColor: '#2A6C64', backgroundColor: '#0B292C' },
  cardWarn: { borderColor: '#684544', backgroundColor: '#251A1D' },
  cardLabel: { color: '#8498A9', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  cardValue: { color: '#E6EEF5', fontSize: 17, lineHeight: 21, fontWeight: '900' },
  good: { color: '#59D8C7' },
  warn: { color: '#E8A18E' },
  neq: { color: '#8297A8', fontSize: 23, fontWeight: '900' },
  plus: { color: '#8297A8', fontSize: 20, fontWeight: '900' },
  arrow: { width: 30, height: 2, backgroundColor: '#3C6F7A', position: 'relative' },
  arrowTip: { position: 'absolute', right: 0, top: -4, width: 9, height: 9, borderTopWidth: 2, borderRightWidth: 2, borderColor: '#3C6F7A', transform: [{ rotate: '45deg' }] },
  basket: { width: 86, height: 68, alignItems: 'center', justifyContent: 'flex-end' },
  handle: { position: 'absolute', top: 6, width: 48, height: 28, borderWidth: 3, borderColor: '#7892A1', borderBottomWidth: 0, borderTopLeftRadius: 22, borderTopRightRadius: 22 },
  goods: { position: 'absolute', top: 18, width: 62, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4 },
  goodDot: { width: 10, height: 10, borderRadius: 5 },
  goodDotA: { backgroundColor: '#D49A70' },
  goodDotB: { backgroundColor: '#64A797' },
  basketBody: { width: 76, height: 36, borderWidth: 2, borderColor: '#718A9A', borderRadius: 8, backgroundColor: '#102637' },
  bank: { minWidth: 88, alignItems: 'center' },
  bankRoof: { width: 78, height: 0, borderLeftWidth: 39, borderRightWidth: 39, borderBottomWidth: 18, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#416B77' },
  bankHall: { width: 78, height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#102834', borderLeftWidth: 2, borderRightWidth: 2, borderColor: '#416B77' },
  bankColumn: { width: 7, height: 31, borderRadius: 3, backgroundColor: '#7999A5' },
  bankBase: { width: 90, height: 7, borderRadius: 4, backgroundColor: '#345966' },
  flow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  node: { flex: 1, minHeight: 68, padding: 8, alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 14, borderWidth: 1, borderColor: '#29495B', backgroundColor: '#0A1C2A' },
  nodeStrong: { borderColor: '#2B756C', backgroundColor: '#0A292D' },
  nodeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#728B9A' },
  nodeDotStrong: { backgroundColor: '#45D5C2' },
  nodeText: { color: '#C7D4DE', fontSize: 10, lineHeight: 14, textAlign: 'center', fontWeight: '800' },
  pills: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  pill: { minWidth: 82, paddingVertical: 11, paddingHorizontal: 12, alignItems: 'center', borderRadius: 999, borderWidth: 1, borderColor: '#2B5965', backgroundColor: '#0A262D' },
  pillText: { color: '#6FE3D4', fontSize: 9, fontWeight: '900', letterSpacing: 0.4 },
  priceGrid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
  priceTag: { width: 42, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#40586A', backgroundColor: '#172534' },
  priceText: { color: '#AEBCC7', fontSize: 15, fontWeight: '900' },
  dots: { flexDirection: 'row', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3E6D78' },
  bars: { gap: 13 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barLabel: { width: 66, color: '#A1B3C1', fontSize: 10, fontWeight: '800' },
  barTrack: { flex: 1, height: 10, borderRadius: 999, backgroundColor: '#152D3D', overflow: 'hidden' },
  barFill: { height: 10, borderRadius: 999, backgroundColor: '#3FC9B8' },
});
