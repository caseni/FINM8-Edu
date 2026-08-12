import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type Topic = 'inflation' | 'rates' | 'centralBank' | 'policy' | 'growth' | 'cycle';
type Mode = 'basket' | 'compare' | 'flow' | 'pills' | 'bank' | 'timeline' | 'bars';
type Scene = { title: string; body?: string; mode: Mode; labels: string[]; values?: string[] };

type Props = {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
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
  const tr = language === 'tr';
  const styles = createStyles(theme);
  const data = sceneFor(topic, role, tr);

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.heading}>
        <Text style={styles.title}>{data.title}</Text>
        {data.body ? <Text style={styles.body}>{data.body}</Text> : null}
      </View>
      <SceneGraphic scene={data} styles={styles} tr={tr} />
    </View>
  );
}

function sceneFor(topic: Topic, role: LessonSupportingVisualRole, tr: boolean): Scene {
  const r = role === 'risk' ? 'misconception' : role;

  if (topic === 'inflation') {
    if (r === 'hook') return { title: tr ? '100 TL aynı, sepet neden küçüldü?' : 'Same TRY 100, why did the basket shrink?', mode: 'basket', labels: [tr ? 'BÜTÇE' : 'BUDGET', tr ? 'SEPET' : 'BASKET'], values: ['100 TL', '3'] };
    if (r === 'concept') return { title: tr ? 'Satın alma gücü, paranın alabildiği şeylerdir' : 'Purchasing power is what your money can buy', mode: 'basket', labels: [tr ? 'ÖNCE' : 'BEFORE', tr ? 'SONRA' : 'AFTER'], values: ['6', '3'] };
    if (r === 'practice') return { title: tr ? 'Aynı bütçe, farklı ürün sayısı' : 'Same budget, different number of goods', body: tr ? 'Fiyatlar genel olarak yükselince aynı para daha az ürün doldurabilir.' : 'When prices rise broadly, the same money can fill less of the basket.', mode: 'compare', labels: [tr ? 'ÖNCE' : 'BEFORE', tr ? 'SONRA' : 'AFTER'], values: ['5 ürün', '3 ürün'] };
    if (r === 'misconception') return { title: tr ? 'Tek ürünün pahalanması, genel fiyat artışı değildir' : 'One product rising is not broad inflation', mode: 'compare', labels: [tr ? 'TEK ÜRÜN' : 'ONE ITEM', tr ? 'GENİŞ SEPET' : 'WIDER BASKET'], values: ['↑', '≠'] };
    return { title: tr ? 'Fiyatlar genel artarsa aynı para daha az şey alabilir' : 'If prices rise broadly, the same money can buy less', mode: 'flow', labels: [tr ? 'PARA' : 'MONEY', tr ? 'ALIM GÜCÜ' : 'BUYING POWER'], values: ['100 TL', '↓'] };
  }

  if (topic === 'rates') {
    if (r === 'hook') return { title: tr ? 'Aynı borç, neden farklı geri ödeme?' : 'Same debt, why a different repayment?', mode: 'compare', labels: [tr ? 'DÜŞÜK FAİZ' : 'LOWER RATE', tr ? 'YÜKSEK FAİZ' : 'HIGHER RATE'], values: ['₺₺', '₺₺₺₺'] };
    if (r === 'concept') return { title: tr ? 'Faiz yükselirse borçlanma maliyeti artabilir' : 'Higher rates can increase borrowing cost', mode: 'flow', labels: [tr ? 'FAİZ' : 'RATE', tr ? 'BORÇ MALİYETİ' : 'BORROWING COST'], values: ['↑', '↑'] };
    if (r === 'practice') return { title: tr ? 'Gerçek kredi koşulu birden fazla şeye bağlıdır' : 'Actual loan terms depend on more than one thing', mode: 'pills', labels: [tr ? 'FAİZ' : 'RATE', tr ? 'SÜRE' : 'TERM', tr ? 'RİSK' : 'RISK'] };
    if (r === 'misconception') return { title: tr ? 'Her kredi aynı faizle verilmez' : 'Not every loan has the same rate', mode: 'compare', labels: [tr ? 'KREDİ A' : 'LOAN A', tr ? 'KREDİ B' : 'LOAN B'], values: ['%?', '%?'] };
    return { title: tr ? 'Faiz, parayı borç almanın maliyetini etkiler' : 'Interest affects the cost of borrowing money', mode: 'flow', labels: [tr ? 'FAİZ' : 'RATE', tr ? 'MALİYET' : 'COST'], values: ['↑', '↑'] };
  }

  if (topic === 'centralBank') {
    if (r === 'hook') return { title: tr ? 'Merkez bankası neden önemlidir?' : 'Why does the central bank matter?', mode: 'bank', labels: [tr ? 'FAİZ' : 'RATES', tr ? 'PARA KOŞULLARI' : 'MONEY CONDITIONS'] };
    if (r === 'concept') return { title: tr ? 'Merkez bankası ekonomik koşulları etkiler' : 'The central bank influences economic conditions', mode: 'flow', labels: [tr ? 'MERKEZ BANKASI' : 'CENTRAL BANK', tr ? 'FAİZ / KREDİ' : 'RATES / CREDIT'] };
    if (r === 'practice') return { title: tr ? 'Kararın etkisi ekonomiye yayılabilir' : 'A decision can spread through the economy', mode: 'flow', labels: [tr ? 'KARAR' : 'DECISION', tr ? 'KREDİ' : 'CREDIT', tr ? 'HARCAMA' : 'SPENDING'] };
    if (r === 'misconception') return { title: tr ? 'Merkez bankası her fiyat etiketini belirlemez' : 'The central bank does not set every price tag', mode: 'bank', labels: [tr ? 'KOŞULLAR' : 'CONDITIONS', tr ? 'TEK TEK FİYATLAR DEĞİL' : 'NOT EACH PRICE'] };
    return { title: tr ? 'Tek tek fiyatları değil, ekonomik koşulları etkiler' : 'It influences conditions, not individual prices', mode: 'flow', labels: [tr ? 'MERKEZ BANKASI' : 'CENTRAL BANK', tr ? 'EKONOMİK KOŞULLAR' : 'ECONOMIC CONDITIONS'] };
  }

  if (topic === 'policy') {
    if (r === 'hook') return { title: tr ? 'Faiz kararı neden anında her şeyi değiştirmez?' : 'Why does a rate decision not change everything instantly?', mode: 'timeline', labels: [tr ? 'BUGÜN' : 'TODAY', tr ? 'ZAMANLA' : 'OVER TIME'], values: [tr ? 'Karar' : 'Decision', tr ? 'Etki' : 'Effect'] };
    if (r === 'concept') return { title: tr ? 'Etki bir zincir üzerinden yayılır' : 'The effect spreads through a chain', mode: 'flow', labels: [tr ? 'FAİZ' : 'RATE', tr ? 'KREDİ' : 'CREDIT', tr ? 'HARCAMA' : 'SPENDING'] };
    if (r === 'practice') return { title: tr ? 'Sırayı takip et' : 'Follow the sequence', mode: 'compare', labels: ['1 · ' + (tr ? 'Faiz' : 'Rate'), '2 · ' + (tr ? 'Kredi' : 'Credit'), '3 · ' + (tr ? 'Harcama' : 'Spending')] };
    if (r === 'misconception') return { title: tr ? 'Faiz kararı bir aç/kapa düğmesi değildir' : 'A rate decision is not an on/off switch', mode: 'compare', labels: [tr ? 'KARAR' : 'DECISION', tr ? 'TAM ETKİ' : 'FULL EFFECT'], values: [tr ? 'şimdi' : 'now', tr ? 'anında değil' : 'not instant'] };
    return { title: tr ? 'Faiz kararı ekonomiye zaman içinde yayılır' : 'A rate decision spreads through the economy over time', mode: 'flow', labels: [tr ? 'FAİZ' : 'RATE', tr ? 'KREDİ' : 'CREDIT', tr ? 'HARCAMA' : 'SPENDING'] };
  }

  if (topic === 'growth') {
    if (r === 'hook') return { title: tr ? '“Ekonomi büyüdü” derken ne büyüdü?' : 'What grew when the economy grew?', mode: 'pills', labels: [tr ? 'MALLAR' : 'GOODS', tr ? 'ÜRETİM' : 'OUTPUT', tr ? 'HİZMETLER' : 'SERVICES'] };
    if (r === 'concept') return { title: tr ? 'Büyüme, toplam ekonomik faaliyetin artmasıdır' : 'Growth is an increase in total economic activity', mode: 'flow', labels: [tr ? 'MAL + HİZMET' : 'GOODS + SERVICES', tr ? 'TOPLAM DEĞER' : 'TOTAL VALUE'], values: ['', '↑'] };
    if (r === 'practice') return { title: tr ? 'Toplam faaliyet artmış mı?' : 'Did total activity increase?', mode: 'compare', labels: [tr ? 'ÖNCE' : 'BEFORE', tr ? 'SONRA' : 'AFTER'], values: ['100', '105'] };
    if (r === 'misconception') return { title: tr ? 'Ekonomi büyüdü ≠ herkes aynı ölçüde zenginleşti' : 'Economy grew ≠ everyone became equally richer', mode: 'compare', labels: [tr ? 'TOPLAM FAALİYET' : 'TOTAL ACTIVITY', tr ? 'HERKESİN GELİRİ' : 'EVERYONE’S INCOME'], values: ['↑', 'aynı?'] };
    return { title: tr ? 'Büyüme, üretilen toplam değerin artmasıdır' : 'Growth means more total value is produced', mode: 'flow', labels: [tr ? 'EKONOMİK FAALİYET' : 'ECONOMIC ACTIVITY', tr ? 'TOPLAM DEĞER' : 'TOTAL VALUE'], values: ['', '↑'] };
  }

  const cycleLabels = tr ? ['HARCAMA', 'ÜRETİM', 'İŞE ALIM'] : ['SPENDING', 'OUTPUT', 'HIRING'];
  if (r === 'hook') return { title: tr ? 'Birden fazla alan aynı anda zayıflarsa?' : 'What if several areas weaken together?', mode: 'bars', labels: cycleLabels, values: ['72', '52', '34'] };
  if (r === 'concept') return { title: tr ? 'Daha az harcama zincirleme yavaşlama yaratabilir' : 'Lower spending can create a chain of slower activity', mode: 'flow', labels: [tr ? 'HARCAMA ↓' : 'SPENDING ↓', tr ? 'SATIŞ ↓' : 'SALES ↓', tr ? 'ÜRETİM ↓' : 'OUTPUT ↓'] };
  if (r === 'practice') return { title: tr ? 'Geniş yavaşlama birden fazla yerde görünür' : 'Broad slowdown appears in several places', mode: 'pills', labels: cycleLabels.map((label) => `${label} ↓`) };
  if (r === 'misconception') return { title: tr ? 'Tek kötü veri ≠ resesyon' : 'One weak data point ≠ recession', mode: 'compare', labels: [tr ? 'TEK VERİ' : 'ONE DATA POINT', tr ? 'GENİŞ + SÜREN ZAYIFLIK' : 'BROAD + LASTING WEAKNESS'], values: ['↓', '?'] };
  return { title: tr ? 'Ekonomi bazen hızlanır, bazen yavaşlar' : 'The economy sometimes speeds up and sometimes slows down', mode: 'bars', labels: cycleLabels, values: ['68', '48', '30'] };
}

function SceneGraphic({ scene, styles, tr }: { scene: Scene; styles: ReturnType<typeof createStyles>; tr: boolean }) {
  if (scene.mode === 'basket') {
    const first = Number(scene.values?.[0]);
    const second = Number(scene.values?.[1]);
    const firstIsBasket = Number.isFinite(first);
    return <View style={styles.row}>{firstIsBasket ? <Basket count={first} styles={styles} /> : <Card label={scene.labels[0]} value={scene.values?.[0] ?? ''} styles={styles} />}<Arrow styles={styles} /><View style={styles.center}><Text style={styles.mini}>{scene.labels[1]}</Text><Basket count={Number.isFinite(second) ? second : 3} styles={styles} /></View></View>;
  }

  if (scene.mode === 'bank') {
    return <View style={styles.center}><Bank styles={styles} /><View style={styles.pills}>{scene.labels.map((label) => <Pill key={label} label={label} styles={styles} />)}</View></View>;
  }

  if (scene.mode === 'pills') {
    return <View style={styles.pills}>{scene.labels.map((label) => <Pill key={label} label={label} styles={styles} />)}</View>;
  }

  if (scene.mode === 'bars') {
    return <View style={styles.bars}>{scene.labels.map((label, index) => <View key={label} style={styles.barRow}><Text style={styles.barLabel}>{label}</Text><View style={styles.barTrack}><View style={[styles.barFill, { width: `${Number(scene.values?.[index] ?? 50)}%` }]} /></View></View>)}</View>;
  }

  if (scene.mode === 'timeline') {
    return <View style={styles.row}><Card label={scene.labels[0]} value={scene.values?.[0] ?? ''} styles={styles} /><View style={styles.dots}><View style={styles.dot} /><View style={styles.dot} /><View style={styles.dot} /></View><Card label={scene.labels[1]} value={scene.values?.[1] ?? ''} styles={styles} /></View>;
  }

  if (scene.mode === 'flow') {
    return <View style={styles.flow}>{scene.labels.map((label, index) => <React.Fragment key={`${label}.${index}`}><Node label={label} value={scene.values?.[index]} strong={index === 0} styles={styles} />{index < scene.labels.length - 1 ? <Arrow styles={styles} /> : null}</React.Fragment>)}</View>;
  }

  return <View style={styles.row}>{scene.labels.map((label, index) => <Card key={`${label}.${index}`} label={label} value={scene.values?.[index] ?? (tr ? 'BAĞLAM' : 'CONTEXT')} tone={index === scene.labels.length - 1 ? 'warn' : 'normal'} styles={styles} />)}</View>;
}

function Card({ label, value, tone = 'normal', styles }: { label: string; value: string; tone?: 'normal' | 'warn'; styles: ReturnType<typeof createStyles> }) {
  return <View style={[styles.card, tone === 'warn' && styles.cardWarn]}><Text style={styles.cardLabel}>{label}</Text><Text style={[styles.cardValue, tone === 'warn' && styles.warn]}>{value}</Text></View>;
}

function Arrow({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.arrow}><View style={styles.arrowTip} /></View>;
}

function Basket({ count, styles }: { count: number; styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.center}><View style={styles.goods}>{Array.from({ length: Math.max(1, Math.min(count, 6)) }).map((_, index) => <View key={index} style={[styles.goodDot, index % 2 ? styles.goodDotB : styles.goodDotA]} />)}</View><View style={styles.basket}><View style={styles.basketLine} /><View style={styles.basketLine} /></View></View>;
}

function Bank({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.bank}><View style={styles.bankRoof} /><View style={styles.bankHall}>{[0, 1, 2, 3].map((item) => <View key={item} style={styles.bankColumn} />)}</View><View style={styles.bankBase} /></View>;
}

function Node({ label, value, strong = false, styles }: { label: string; value?: string; strong?: boolean; styles: ReturnType<typeof createStyles> }) {
  return <View style={[styles.node, strong && styles.nodeStrong]}><View style={[styles.nodeDot, strong && styles.nodeDotStrong]} /><Text style={styles.nodeText}>{label}</Text>{value ? <Text style={styles.nodeValue}>{value}</Text> : null}</View>;
}

function Pill({ label, styles }: { label: string; styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.pill}><Text style={styles.pillText}>{label}</Text></View>;
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 250, justifyContent: 'center', padding: 18, gap: 18, borderRadius: 22, borderWidth: 1, borderColor: '#29465A', backgroundColor: '#071522' },
  heading: { gap: 5 },
  title: { color: theme.colors.text, fontSize: 19, lineHeight: 25, fontWeight: '900' },
  body: { color: '#A6B8C7', fontSize: 13, lineHeight: 19, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  center: { alignItems: 'center', justifyContent: 'center', gap: 7 },
  mini: { color: '#6BDCCD', fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
  card: { flex: 1, minHeight: 78, justifyContent: 'center', padding: 12, gap: 6, borderRadius: 15, borderWidth: 1, borderColor: '#29495C', backgroundColor: '#0B1C2A' },
  cardWarn: { borderColor: '#684544', backgroundColor: '#251A1D' },
  cardLabel: { color: '#8498A9', fontSize: 9, fontWeight: '900', letterSpacing: 0.4 },
  cardValue: { color: '#E6EEF5', fontSize: 16, lineHeight: 20, fontWeight: '900' },
  warn: { color: '#E8A18E' },
  arrow: { width: 28, height: 2, backgroundColor: '#3C6F7A', position: 'relative' },
  arrowTip: { position: 'absolute', right: 0, top: -4, width: 9, height: 9, borderTopWidth: 2, borderRightWidth: 2, borderColor: '#3C6F7A', transform: [{ rotate: '45deg' }] },
  goods: { minHeight: 28, maxWidth: 88, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4 },
  goodDot: { width: 12, height: 12, borderRadius: 6 },
  goodDotA: { backgroundColor: '#D49A70' },
  goodDotB: { backgroundColor: '#64A797' },
  basket: { width: 82, height: 35, padding: 8, justifyContent: 'space-evenly', borderRadius: 8, borderWidth: 2, borderColor: '#718A9A', backgroundColor: '#102637' },
  basketLine: { height: 2, borderRadius: 2, backgroundColor: '#506B7B' },
  bank: { minWidth: 88, alignItems: 'center' },
  bankRoof: { width: 78, height: 0, borderLeftWidth: 39, borderRightWidth: 39, borderBottomWidth: 18, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#416B77' },
  bankHall: { width: 78, height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#102834', borderLeftWidth: 2, borderRightWidth: 2, borderColor: '#416B77' },
  bankColumn: { width: 7, height: 31, borderRadius: 3, backgroundColor: '#7999A5' },
  bankBase: { width: 90, height: 7, borderRadius: 4, backgroundColor: '#345966' },
  flow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  node: { flex: 1, minHeight: 68, padding: 8, alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 14, borderWidth: 1, borderColor: '#29495B', backgroundColor: '#0A1C2A' },
  nodeStrong: { borderColor: '#2B756C', backgroundColor: '#0A292D' },
  nodeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#728B9A' },
  nodeDotStrong: { backgroundColor: '#45D5C2' },
  nodeText: { color: '#C7D4DE', fontSize: 9, lineHeight: 13, textAlign: 'center', fontWeight: '800' },
  nodeValue: { color: '#62DCCA', fontSize: 14, fontWeight: '900' },
  pills: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  pill: { minWidth: 82, paddingVertical: 11, paddingHorizontal: 12, alignItems: 'center', borderRadius: 999, borderWidth: 1, borderColor: '#2B5965', backgroundColor: '#0A262D' },
  pillText: { color: '#6FE3D4', fontSize: 9, fontWeight: '900', letterSpacing: 0.3 },
  bars: { gap: 13 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barLabel: { width: 70, color: '#A1B3C1', fontSize: 9, fontWeight: '800' },
  barTrack: { flex: 1, height: 10, borderRadius: 999, backgroundColor: '#152D3D', overflow: 'hidden' },
  barFill: { height: 10, borderRadius: 999, backgroundColor: '#3FC9B8' },
  dots: { flexDirection: 'row', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3E6D78' },
});
