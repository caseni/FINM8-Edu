import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
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
type Styles = ReturnType<typeof createStyles>;

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('enflasyon-satin-alma-gucu')) return 'inflation';
  if (assetRef.includes('faiz-orani-ne-anlatir')) return 'rates';
  if (assetRef.includes('merkez-bankasi-ne-yapar')) return 'centralBank';
  if (assetRef.includes('faiz-karari-ekonomiye-nasil-yansir')) return 'policy';
  if (assetRef.includes('gsyh-buyume-ne-anlatir')) return 'growth';
  if (assetRef.includes('ekonomik-dongu-resesyon')) return 'cycle';
  return undefined;
}

function topicKey(topic: Topic): string {
  return topic === 'centralBank' ? 'central-bank' : topic;
}

function roleKey(role: LessonSupportingVisualRole): string {
  return role === 'risk' ? 'misconception' : role;
}

export function isBeginnerEconomyStoryAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function BeginnerEconomyStoryVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: Props) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;

  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const phone = width < 420;
  const styles = createStyles(theme, wide, phone, role === 'practice');
  const tr = language === 'tr';
  const data = sceneFor(topic, role, tr);
  const semanticRole = roleKey(role);

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.heading}>
        <Text style={styles.title}>{data.title}</Text>
        {data.body ? <Text style={styles.body}>{data.body}</Text> : null}
      </View>
      <View
        style={styles.board}
        accessibilityLabel={`economy-${topicKey(topic)}-${semanticRole}-board`}
      >
        <SceneGraphic scene={data} styles={styles} tr={tr} />
      </View>
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
    if (r === 'misconception') return { title: tr ? 'Ekonomi büyüdü ≠ herkes aynı ölçüde zenginleşti' : 'Economy grew ≠ everyone became equally richer', mode: 'compare', labels: [tr ? 'TOPLAM FAALİYET' : 'TOTAL ACTIVITY', tr ? 'HERKESİN GELİRİ' : 'EVERYONE’S INCOME'], values: ['↑', tr ? 'aynı?' : 'same?'] };
    return { title: tr ? 'Büyüme, üretilen toplam değerin artmasıdır' : 'Growth means more total value is produced', mode: 'flow', labels: [tr ? 'EKONOMİK FAALİYET' : 'ECONOMIC ACTIVITY', tr ? 'TOPLAM DEĞER' : 'TOTAL VALUE'], values: ['', '↑'] };
  }

  const cycleLabels = tr ? ['HARCAMA', 'ÜRETİM', 'İŞE ALIM'] : ['SPENDING', 'OUTPUT', 'HIRING'];
  if (r === 'hook') return { title: tr ? 'Birden fazla alan aynı anda zayıflarsa?' : 'What if several areas weaken together?', mode: 'bars', labels: cycleLabels, values: ['72', '52', '34'] };
  if (r === 'concept') return { title: tr ? 'Daha az harcama zincirleme yavaşlama yaratabilir' : 'Lower spending can create a chain of slower activity', mode: 'flow', labels: [tr ? 'HARCAMA ↓' : 'SPENDING ↓', tr ? 'SATIŞ ↓' : 'SALES ↓', tr ? 'ÜRETİM ↓' : 'OUTPUT ↓'] };
  if (r === 'practice') return { title: tr ? 'Geniş yavaşlama birden fazla yerde görünür' : 'Broad slowdown appears in several places', mode: 'pills', labels: cycleLabels.map((label) => `${label} ↓`) };
  if (r === 'misconception') return { title: tr ? 'Tek kötü veri ≠ resesyon' : 'One weak data point ≠ recession', mode: 'compare', labels: [tr ? 'TEK VERİ' : 'ONE DATA POINT', tr ? 'GENİŞ + SÜREN ZAYIFLIK' : 'BROAD + LASTING WEAKNESS'], values: ['↓', '?'] };
  return { title: tr ? 'Ekonomi bazen hızlanır, bazen yavaşlar' : 'The economy sometimes speeds up and sometimes slows down', mode: 'bars', labels: cycleLabels, values: ['68', '48', '30'] };
}

function SceneGraphic({ scene, styles, tr }: { scene: Scene; styles: Styles; tr: boolean }) {
  if (scene.mode === 'basket') {
    const first = Number(scene.values?.[0]);
    const second = Number(scene.values?.[1]);
    const firstIsBasket = Number.isFinite(first);
    return (
      <View style={styles.row}>
        {firstIsBasket
          ? <Basket count={first} label={scene.labels[0]} styles={styles} />
          : <Card label={scene.labels[0]} value={scene.values?.[0] ?? ''} styles={styles} />}
        <Arrow styles={styles} />
        <Basket count={Number.isFinite(second) ? second : 3} label={scene.labels[1]} styles={styles} />
      </View>
    );
  }

  if (scene.mode === 'bank') {
    return (
      <View style={styles.bankScene}>
        <Bank styles={styles} />
        <View style={styles.pills}>{scene.labels.map((label) => <Pill key={label} label={label} styles={styles} />)}</View>
      </View>
    );
  }

  if (scene.mode === 'pills') {
    return <View style={styles.pills}>{scene.labels.map((label, index) => <Pill key={`${label}.${index}`} label={label} styles={styles} strong={index === 0} />)}</View>;
  }

  if (scene.mode === 'bars') {
    return (
      <View style={styles.bars}>
        {scene.labels.map((label, index) => (
          <View key={label} style={styles.barRow}>
            <Text style={styles.barLabel}>{label}</Text>
            <View style={styles.barTrack}><View style={[styles.barFill, { width: `${Number(scene.values?.[index] ?? 50)}%` }]} /></View>
          </View>
        ))}
      </View>
    );
  }

  if (scene.mode === 'timeline') {
    return (
      <View style={styles.row}>
        <Card label={scene.labels[0]} value={scene.values?.[0] ?? ''} styles={styles} />
        <View style={styles.dots}><View style={styles.dot} /><View style={styles.dot} /><View style={styles.dot} /></View>
        <Card label={scene.labels[1]} value={scene.values?.[1] ?? ''} styles={styles} accent />
      </View>
    );
  }

  if (scene.mode === 'flow') {
    return (
      <View style={styles.flow}>
        {scene.labels.map((label, index) => (
          <React.Fragment key={`${label}.${index}`}>
            <Node label={label} value={scene.values?.[index]} strong={index === 0} styles={styles} />
            {index < scene.labels.length - 1 ? <Arrow styles={styles} /> : null}
          </React.Fragment>
        ))}
      </View>
    );
  }

  return (
    <View style={scene.labels.length > 2 ? styles.compareGrid : styles.row}>
      {scene.labels.map((label, index) => (
        <Card
          key={`${label}.${index}`}
          label={label}
          value={scene.values?.[index] ?? (scene.labels.length > 2 ? `${index + 1}` : tr ? 'BAĞLAM' : 'CONTEXT')}
          styles={styles}
          accent={index === scene.labels.length - 1}
          compact={scene.labels.length > 2}
        />
      ))}
    </View>
  );
}

function Card({ label, value, styles, accent = false, compact = false }: { label: string; value: string; styles: Styles; accent?: boolean; compact?: boolean }) {
  return (
    <View style={[styles.card, accent && styles.cardAccent, compact && styles.compactCard]}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={[styles.cardValue, accent && styles.accentText]}>{value}</Text>
    </View>
  );
}

function Arrow({ styles }: { styles: Styles }) {
  return <Text style={styles.arrow}>→</Text>;
}

function Basket({ count, label, styles }: { count: number; label: string; styles: Styles }) {
  return (
    <View style={styles.basketScene}>
      <Text style={styles.mini}>{label}</Text>
      <View style={styles.goods}>
        {Array.from({ length: Math.max(1, Math.min(count, 6)) }).map((_, index) => (
          <View key={index} style={[styles.goodDot, index % 2 ? styles.goodDotB : styles.goodDotA]} />
        ))}
      </View>
      <View style={styles.basket}><View style={styles.basketLine} /><View style={styles.basketLine} /></View>
    </View>
  );
}

function Bank({ styles }: { styles: Styles }) {
  return (
    <View style={styles.bank}>
      <View style={styles.bankRoof} />
      <View style={styles.bankHall}>{[0, 1, 2, 3].map((item) => <View key={item} style={styles.bankColumn} />)}</View>
      <View style={styles.bankBase} />
    </View>
  );
}

function Node({ label, value, strong = false, styles }: { label: string; value?: string; strong?: boolean; styles: Styles }) {
  return (
    <View style={[styles.node, strong && styles.nodeStrong]}>
      <View style={[styles.nodeDot, strong && styles.nodeDotStrong]} />
      <Text style={styles.nodeText}>{label}</Text>
      {value ? <Text style={styles.nodeValue}>{value}</Text> : null}
    </View>
  );
}

function Pill({ label, styles, strong = false }: { label: string; styles: Styles; strong?: boolean }) {
  return <View style={[styles.pill, strong && styles.pillStrong]}><Text style={styles.pillText}>{label}</Text></View>;
}

const createStyles = (theme: LearningTheme, wide: boolean, phone: boolean, practice: boolean) => StyleSheet.create({
  shell: {
    width: '100%',
    maxWidth: wide ? 680 : undefined,
    alignSelf: 'center',
    minHeight: wide ? 300 : practice ? (phone ? 300 : 325) : phone ? 242 : 266,
    justifyContent: 'center',
    padding: wide ? 20 : phone ? 10 : 14,
    gap: wide ? 18 : phone ? 10 : 14,
    borderRadius: wide ? 18 : 16,
    borderWidth: 1,
    borderColor: '#29465A',
    backgroundColor: '#071522',
    overflow: 'hidden',
  },
  heading: { width: '100%', gap: phone ? 3 : 5 },
  title: { color: theme.colors.text, fontSize: wide ? 20 : phone ? 15 : 17, lineHeight: wide ? 27 : phone ? 20 : 23, fontWeight: '900' },
  body: { color: '#A6B8C7', fontSize: wide ? 12 : phone ? 9 : 11, lineHeight: wide ? 18 : phone ? 13 : 16, fontWeight: '600' },
  board: { width: '100%', minHeight: wide ? 175 : phone ? 132 : 150, justifyContent: 'center' },
  row: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 6 : 10 },
  compareGrid: { width: '100%', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center', gap: phone ? 5 : 8 },
  card: { flex: 1, minWidth: 0, minHeight: wide ? 118 : phone ? 92 : 104, justifyContent: 'center', alignItems: 'center', padding: phone ? 7 : 11, gap: phone ? 5 : 7, borderRadius: 13, borderWidth: 1, borderColor: '#29495C', backgroundColor: '#0B1C2A' },
  compactCard: { minHeight: wide ? 112 : phone ? 88 : 100, paddingHorizontal: phone ? 4 : 7 },
  cardAccent: { borderColor: '#2D766F', backgroundColor: '#0D2D32' },
  cardLabel: { color: '#8498A9', fontSize: wide ? 9 : phone ? 7 : 8, lineHeight: wide ? 13 : phone ? 10 : 11, fontWeight: '900', letterSpacing: 0.35, textAlign: 'center' },
  cardValue: { color: '#E6EEF5', fontSize: wide ? 20 : phone ? 14 : 17, lineHeight: wide ? 25 : phone ? 18 : 21, fontWeight: '900', textAlign: 'center' },
  accentText: { color: '#67DCCD' },
  mini: { color: '#6BDCCD', fontSize: wide ? 10 : phone ? 8 : 9, fontWeight: '900', letterSpacing: 0.5 },
  arrow: { color: '#4D8990', fontSize: wide ? 24 : phone ? 16 : 20, lineHeight: wide ? 28 : phone ? 20 : 24, fontWeight: '900' },

  basketScene: { flex: 1, minWidth: 0, minHeight: wide ? 122 : phone ? 94 : 108, alignItems: 'center', justifyContent: 'center', gap: phone ? 5 : 7, borderRadius: 13, borderWidth: 1, borderColor: '#29495C', backgroundColor: '#0B1C2A' },
  goods: { width: wide ? 106 : phone ? 76 : 90, minHeight: wide ? 54 : phone ? 39 : 47, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: phone ? 4 : 5 },
  goodDot: { width: wide ? 20 : phone ? 14 : 17, height: wide ? 20 : phone ? 14 : 17, borderRadius: 5 },
  goodDotA: { backgroundColor: '#55CDBF' },
  goodDotB: { backgroundColor: '#768E9C' },
  basket: { width: wide ? 112 : phone ? 80 : 94, height: wide ? 34 : phone ? 24 : 29, borderWidth: 2, borderTopWidth: 0, borderColor: '#557485', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, justifyContent: 'space-evenly' },
  basketLine: { width: '76%', height: 2, alignSelf: 'center', backgroundColor: '#557485' },

  bankScene: { width: '100%', minHeight: wide ? 170 : phone ? 130 : 148, alignItems: 'center', justifyContent: 'center', gap: phone ? 8 : 11 },
  bank: { width: wide ? 170 : phone ? 112 : 138, alignItems: 'center' },
  bankRoof: { width: '100%', height: 0, borderLeftWidth: wide ? 85 : phone ? 56 : 69, borderRightWidth: wide ? 85 : phone ? 56 : 69, borderBottomWidth: wide ? 38 : phone ? 25 : 31, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#36566A' },
  bankHall: { width: '82%', height: wide ? 72 : phone ? 48 : 59, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'stretch', paddingVertical: phone ? 5 : 7, backgroundColor: '#102432' },
  bankColumn: { width: wide ? 14 : phone ? 9 : 11, borderRadius: 3, backgroundColor: '#5B7A8A' },
  bankBase: { width: '96%', height: wide ? 11 : 8, borderRadius: 4, backgroundColor: '#36566A' },

  flow: { width: '100%', minHeight: wide ? 145 : phone ? 110 : 126, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 4 : 7 },
  node: { flex: 1, minWidth: 0, maxWidth: wide ? 170 : undefined, minHeight: wide ? 104 : phone ? 80 : 92, padding: phone ? 5 : 8, borderRadius: 13, borderWidth: 1, borderColor: '#2C4B5E', backgroundColor: '#0B1C2A', alignItems: 'center', justifyContent: 'center', gap: phone ? 4 : 6 },
  nodeStrong: { borderColor: '#2D766F', backgroundColor: '#0D2D32' },
  nodeDot: { width: wide ? 16 : phone ? 11 : 13, height: wide ? 16 : phone ? 11 : 13, borderRadius: 99, backgroundColor: '#6F8796' },
  nodeDotStrong: { backgroundColor: '#59D5C6' },
  nodeText: { color: '#9EB0BD', fontSize: wide ? 9 : phone ? 7 : 8, lineHeight: wide ? 13 : phone ? 10 : 11, fontWeight: '900', textAlign: 'center' },
  nodeValue: { color: '#E8EFF3', fontSize: wide ? 20 : phone ? 14 : 17, fontWeight: '900' },

  pills: { width: '100%', minHeight: wide ? 120 : phone ? 92 : 105, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: phone ? 6 : 9 },
  pill: { minWidth: wide ? 130 : phone ? 88 : 105, minHeight: wide ? 56 : phone ? 43 : 50, paddingHorizontal: phone ? 7 : 10, borderRadius: 13, borderWidth: 1, borderColor: '#304C5E', backgroundColor: '#0D1F2D', alignItems: 'center', justifyContent: 'center' },
  pillStrong: { borderColor: '#2D766F', backgroundColor: '#0D2D32' },
  pillText: { color: '#B7C5CD', fontSize: wide ? 10 : phone ? 8 : 9, lineHeight: wide ? 14 : phone ? 11 : 13, fontWeight: '900', textAlign: 'center' },

  bars: { width: '100%', minHeight: wide ? 155 : phone ? 118 : 138, padding: phone ? 9 : 12, borderRadius: 13, borderWidth: 1, borderColor: '#29495C', backgroundColor: '#0B1C2A', justifyContent: 'center', gap: phone ? 10 : 13 },
  barRow: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: phone ? 7 : 10 },
  barLabel: { width: wide ? 110 : phone ? 70 : 88, color: '#92A6B4', fontSize: wide ? 9 : phone ? 7 : 8, fontWeight: '900' },
  barTrack: { flex: 1, height: wide ? 12 : phone ? 9 : 10, borderRadius: 99, backgroundColor: '#203747', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 99, backgroundColor: '#4CCABA' },

  dots: { width: wide ? 70 : phone ? 42 : 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dot: { width: wide ? 8 : phone ? 6 : 7, height: wide ? 8 : phone ? 6 : 7, borderRadius: 99, backgroundColor: '#4D8990' },
});