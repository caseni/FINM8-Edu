import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type CoreChartTopic = 'candle' | 'timeframe' | 'trend';
type Props = { assetRef: string; alt: string; language: LearningLanguage; role: LessonSupportingVisualRole; theme?: LearningTheme };
type Styles = ReturnType<typeof createStyles>;
type StoryProps = { tr: boolean; role: LessonSupportingVisualRole; styles: Styles };

function topicForAsset(assetRef: string): CoreChartTopic | undefined {
  if (assetRef.includes('bir-mum-bize-ne-soyler')) return 'candle';
  if (assetRef.includes('zaman-dilimi-neyi-degistirir')) return 'timeframe';
  if (assetRef.includes('trend-yon-mu-yapi-mi')) return 'trend';
  return undefined;
}

export function isBeginnerCoreChartStoryAsset(assetRef: string): boolean { return Boolean(topicForAsset(assetRef)); }

export function BeginnerCoreChartStoryVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: Props) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const phone = width < 420;
  const styles = createStyles(theme, wide, phone);
  const tr = language === 'tr';
  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {topic === 'candle' ? <CandleStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'timeframe' ? <TimeframeStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'trend' ? <TrendStory tr={tr} role={role} styles={styles} /> : null}
    </View>
  );
}

function Heading({ title, body, styles }: { title: string; body?: string; styles: Styles }) {
  return <View style={styles.heading}><Text style={styles.title}>{title}</Text>{body ? <Text style={styles.body}>{body}</Text> : null}</View>;
}

function MiniCandle({ up = true, tall = false, styles }: { up?: boolean; tall?: boolean; styles: Styles }) {
  return <View style={[styles.miniCandleWrap, tall && styles.miniCandleWrapTall]}><View style={styles.miniWick} /><View style={[styles.miniBody, up ? styles.candleUp : styles.candleDown, tall && styles.miniBodyTall]} /><View style={styles.miniWick} /></View>;
}

function OhlcStudy({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.ohlcCard} accessibilityLabel="chart-candle-ohlc">
      <View style={styles.ohlcLabelsLeft}><Text style={styles.ohlcLabel}>{tr ? 'EN YÜKSEK' : 'HIGH'}</Text><Text style={styles.ohlcLabel}>{tr ? 'KAPANIŞ' : 'CLOSE'}</Text></View>
      <View style={styles.largeCandleStage}><View style={styles.largeWick} /><View style={styles.largeBody} /><View style={styles.largeWick} /></View>
      <View style={styles.ohlcLabelsRight}><Text style={styles.ohlcLabel}>{tr ? 'AÇILIŞ' : 'OPEN'}</Text><Text style={styles.ohlcLabel}>{tr ? 'EN DÜŞÜK' : 'LOW'}</Text></View>
    </View>
  );
}

function PriceRow({ label, value, accent = false, styles }: { label: string; value: string; accent?: boolean; styles: Styles }) {
  return <View style={[styles.priceRow, accent && styles.priceRowAccent]}><Text style={styles.priceRowLabel}>{label}</Text><Text style={styles.priceRowValue}>{value}</Text></View>;
}

function CandleStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') {
    return <View style={styles.scene}><Heading styles={styles} title={tr ? 'Grafikteki her mum, bir zaman parçasının fiyat hikâyesidir.' : 'Each candle tells the price story of one slice of time.'} body={tr ? 'Tek renk değil; nerede başladı, nereye kadar gitti ve nerede bittiğini gösterir.' : 'It shows where price started, how far it travelled, and where it finished.'} /><View style={styles.candleTimeline} accessibilityLabel="chart-candle-timeline">{[true, true, false, true, false, true, true].map((up, index) => <MiniCandle key={index} up={up} styles={styles} />)}</View><View style={styles.timeStrip}><Text style={styles.micro}>{tr ? 'ÖNCE' : 'EARLIER'}</Text><View style={styles.timeLine} /><Text style={styles.micro}>{tr ? 'ŞİMDİ' : 'NOW'}</Text></View></View>;
  }
  if (role === 'concept') {
    return <View style={styles.scene}><Heading styles={styles} title={tr ? 'Bir mumda dört temel fiyat vardır.' : 'A candle contains four core prices.'} /><OhlcStudy tr={tr} styles={styles} /><Text style={styles.note}>{tr ? 'Fitil aralığı gösterir; gövde açılış ile kapanış arasındaki alanı gösterir.' : 'The wick shows the range; the body shows the distance between open and close.'}</Text></View>;
  }
  if (role === 'practice') {
    return (
      <View style={styles.scene}>
        <Heading styles={styles} title={tr ? 'Örnek: açılış 100, en yüksek 106, en düşük 98, kapanış 104.' : 'Example: open 100, high 106, low 98, close 104.'} />
        <View style={styles.practiceOhlc}>
          <View style={styles.practicePriceColumn} accessibilityLabel="chart-candle-practice-prices"><PriceRow label={tr ? 'Yüksek' : 'High'} value="106" styles={styles} /><PriceRow label={tr ? 'Kapanış' : 'Close'} value="104" accent styles={styles} /><PriceRow label={tr ? 'Açılış' : 'Open'} value="100" styles={styles} /><PriceRow label={tr ? 'Düşük' : 'Low'} value="98" styles={styles} /></View>
          <View style={styles.practiceCandleCard} accessibilityLabel="chart-candle-practice-candle"><MiniCandle up tall styles={styles} /><Text style={styles.micro}>{tr ? '1 ZAMAN PARÇASI' : '1 TIME SLICE'}</Text></View>
        </View>
      </View>
    );
  }
  if (role === 'misconception') {
    return (
      <View style={styles.scene}>
        <Heading styles={styles} title={tr ? 'Yeşil mum, bir sonraki mumun da yeşil olacağını söylemez.' : 'A green candle does not predict that the next candle will also be green.'} />
        <View style={styles.futureCompare}>
          <View style={styles.finishedCard} accessibilityLabel="chart-candle-finished"><Text style={styles.eyebrow}>{tr ? 'OLUŞMUŞ VERİ' : 'COMPLETED DATA'}</Text><MiniCandle up tall styles={styles} /></View>
          <View style={styles.unknownCard} accessibilityLabel="chart-candle-unknown"><Text style={styles.eyebrow}>{tr ? 'GELECEK' : 'FUTURE'}</Text><Text style={styles.question}>?</Text></View>
          <View pointerEvents="none" style={styles.notEqualBadge}><Text style={styles.notEqualBadgeText}>≠</Text></View>
        </View>
        <Text style={styles.note}>{tr ? 'Mum geçmiş fiyat hareketini özetler; gelecek için garanti vermez.' : 'A candle summarizes past price movement; it does not guarantee the future.'}</Text>
      </View>
    );
  }
  return <View style={styles.scene}><View style={styles.fourPointSummary}>{[[tr ? 'AÇILIŞ' : 'OPEN', '1'], [tr ? 'YÜKSEK' : 'HIGH', '2'], [tr ? 'DÜŞÜK' : 'LOW', '3'], [tr ? 'KAPANIŞ' : 'CLOSE', '4']].map(([label, index]) => <View key={label} style={styles.summaryChip}><Text style={styles.summaryNumber}>{index}</Text><Text style={styles.summaryLabel}>{label}</Text></View>)}</View></View>;
}

function PathBars({ values, down = false, styles }: { values: readonly number[]; down?: boolean; styles: Styles }) {
  return <View style={styles.pathBars}>{values.map((height, index) => <View key={`${height}-${index}`} style={styles.pathSlot}><View style={[styles.pathBar, { height }, down && styles.pathBarDown]} /></View>)}</View>;
}

function TimeframeStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') return <View style={styles.scene}><Heading styles={styles} title={tr ? 'Aynı piyasa, farklı zaman diliminde farklı görünebilir.' : 'The same market can look different on different timeframes.'} /><View style={styles.twoPanel}><View style={styles.comparePanel} accessibilityLabel="chart-timeframe-close"><Text style={styles.eyebrow}>15 DK</Text><PathBars values={[60, 52, 45, 38, 31]} down styles={styles} /><Text style={styles.resultBad}>{tr ? 'Kısa düşüş' : 'Short decline'}</Text></View><View style={styles.comparePanel} accessibilityLabel="chart-timeframe-broad"><Text style={styles.eyebrow}>{tr ? '1 GÜN' : '1 DAY'}</Text><PathBars values={[25, 34, 43, 52, 62]} styles={styles} /><Text style={styles.resultGood}>{tr ? 'Geniş yükseliş' : 'Broad rise'}</Text></View></View></View>;
  if (role === 'concept') return <View style={styles.scene}><Heading styles={styles} title={tr ? 'Zaman dilimi, bir mumun ne kadar süreyi özetlediğini belirler.' : 'The timeframe defines how much time one candle summarizes.'} /><View style={styles.aggregateRow} accessibilityLabel="chart-timeframe-aggregate"><View style={styles.smallCandles}>{[true, false, true, true].map((up, index) => <MiniCandle key={index} up={up} styles={styles} />)}</View><Text style={styles.aggregateArrow}>›</Text><View style={styles.aggregateResult}><MiniCandle up tall styles={styles} /><Text style={styles.aggregateText}>4 × 15 dk = 1 saat</Text></View></View></View>;
  if (role === 'practice') return <View style={styles.scene}><Heading styles={styles} title={tr ? '15 dakikada düşüş görürken günlük grafikte yükseliş yapısı sürebilir.' : 'You can see a decline on 15 minutes while the daily structure is still rising.'} /><View style={styles.twoPanel}><View style={[styles.comparePanel, styles.warningPanel]} accessibilityLabel="chart-timeframe-practice-short"><Text style={styles.eyebrow}>15 DK</Text><PathBars values={[62, 55, 49, 41, 35]} down styles={styles} /></View><View style={[styles.comparePanel, styles.accentPanel]} accessibilityLabel="chart-timeframe-practice-long"><Text style={styles.eyebrow}>{tr ? 'GÜNLÜK' : 'DAILY'}</Text><PathBars values={[25, 33, 42, 50, 61]} styles={styles} /></View></View><Text style={styles.note}>{tr ? 'İki gözlem aynı anda doğru olabilir; çünkü baktığın ölçek farklıdır.' : 'Both observations can be true because the scale is different.'}</Text></View>;
  if (role === 'misconception') return <View style={styles.scene}><Heading styles={styles} title={tr ? 'Kısa vadeli kırmızı görüntü, büyük resmi otomatik silmez.' : 'A red short-term view does not automatically erase the bigger picture.'} /><View style={styles.scaleStack}><View style={styles.broadScale} accessibilityLabel="chart-timeframe-bigger-picture"><Text style={styles.eyebrow}>{tr ? 'BÜYÜK RESİM' : 'BIGGER PICTURE'}</Text><PathBars values={[24, 33, 41, 50, 59, 68]} styles={styles} /></View><View style={styles.zoomWindow} accessibilityLabel="chart-timeframe-zoom-window"><Text style={styles.eyebrow}>{tr ? 'YAKIN PLAN' : 'ZOOMED VIEW'}</Text><PathBars values={[58, 49, 42, 35]} down styles={styles} /></View></View></View>;
  return <View style={styles.scene}><View style={styles.scaleSummary}>{['15 DK', '1 SAAT', tr ? '1 GÜN' : '1 DAY'].map((label, index) => <View key={label} style={[styles.scaleChip, index === 2 && styles.scaleChipAccent]}><Text style={styles.scaleIndex}>{index + 1}</Text><Text style={styles.summaryLabel}>{label}</Text></View>)}</View></View>;
}

function TrendStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') return <View style={styles.scene}><Heading styles={styles} title={tr ? 'Trend, tek bir mumun rengi değil; fiyatın oluşturduğu yapıdır.' : 'Trend is not the color of one candle; it is the structure price creates.'} /><View style={styles.oneVsStructure}><View style={styles.singleMove} accessibilityLabel="chart-trend-single-candle"><Text style={styles.eyebrow}>{tr ? 'TEK MUM' : 'ONE CANDLE'}</Text><MiniCandle up tall styles={styles} /></View><Text style={styles.notEqual}>≠</Text><View style={styles.structurePanel} accessibilityLabel="chart-trend-structure"><Text style={styles.eyebrow}>{tr ? 'TEPE + DİP YAPISI' : 'HIGH + LOW STRUCTURE'}</Text><PathBars values={[25, 48, 35, 60, 47, 72]} styles={styles} /></View></View></View>;
  if (role === 'concept') return <View style={styles.scene}><Heading styles={styles} title={tr ? 'Üç temel yapı: yükselen, düşen ve yatay.' : 'Three basic structures: rising, falling, and sideways.'} /><View style={styles.trendTriplet}><TrendCard label={tr ? 'YÜKSELEN' : 'RISING'} values={[22, 32, 42, 52, 64]} type="up" styles={styles} /><TrendCard label={tr ? 'DÜŞEN' : 'FALLING'} values={[64, 54, 44, 34, 24]} type="down" styles={styles} /><TrendCard label={tr ? 'YATAY' : 'SIDEWAYS'} values={[42, 48, 39, 46, 43]} type="side" styles={styles} /></View></View>;
  if (role === 'practice') return <View style={styles.scene}><Heading styles={styles} title={tr ? 'Yükselen trendde tepeler ve dipler birlikte yukarı taşınır.' : 'In a rising trend, both highs and lows move upward.'} /><View style={styles.swingBoard} accessibilityLabel="chart-trend-practice-structure"><PathBars values={[24, 49, 34, 61, 46, 73]} styles={styles} /><View style={styles.swingLabels}><Text style={styles.swingLabel}>D1</Text><Text style={styles.swingLabel}>T1</Text><Text style={styles.swingLabel}>D2 ↑</Text><Text style={styles.swingLabel}>T2 ↑</Text></View></View><Text style={styles.note}>{tr ? 'Sadece son harekete değil, art arda oluşan tepe ve diplerin konumuna bak.' : 'Look at the sequence of highs and lows, not only the latest move.'}</Text></View>;
  if (role === 'misconception') return <View style={styles.scene}><Heading styles={styles} title={tr ? 'Bir yeşil mum, düşen trendi tek başına yükselen trende çevirmez.' : 'One green candle does not turn a falling trend into a rising trend by itself.'} /><View style={styles.trendMisconception}><View style={styles.fallingContext} accessibilityLabel="chart-trend-falling-context"><PathBars values={[67, 58, 49, 40, 31]} down styles={styles} /></View><View style={styles.bounceCard} accessibilityLabel="chart-trend-single-bounce"><Text style={styles.eyebrow}>{tr ? 'TEK TEPKİ' : 'ONE BOUNCE'}</Text><MiniCandle up tall styles={styles} /></View></View><Text style={styles.note}>{tr ? 'Trend değişimi için yapının değiştiğine dair daha fazla kanıt gerekir.' : 'A trend change needs more evidence that the structure has changed.'}</Text></View>;
  return <View style={styles.scene}><View style={styles.structureSummary}><View style={styles.structureSummaryItem}><Text style={styles.structureArrow}>↗</Text><Text style={styles.summaryLabel}>{tr ? 'YÜKSELEN' : 'RISING'}</Text></View><View style={styles.structureSummaryItem}><Text style={styles.structureArrow}>↘</Text><Text style={styles.summaryLabel}>{tr ? 'DÜŞEN' : 'FALLING'}</Text></View><View style={styles.structureSummaryItem}><Text style={styles.structureArrow}>→</Text><Text style={styles.summaryLabel}>{tr ? 'YATAY' : 'SIDEWAYS'}</Text></View></View></View>;
}

function TrendCard({ label, values, type, styles }: { label: string; values: readonly number[]; type: 'up' | 'down' | 'side'; styles: Styles }) {
  const accessibilityLabel = type === 'up' ? 'chart-trend-rising' : type === 'down' ? 'chart-trend-falling' : 'chart-trend-sideways';
  return <View style={[styles.trendCard, type === 'up' && styles.trendCardAccent]} accessibilityLabel={accessibilityLabel}><PathBars values={values} down={type === 'down'} styles={styles} /><Text style={styles.trendCardLabel}>{label}</Text></View>;
}

const createStyles = (theme: LearningTheme, wide: boolean, phone: boolean) => StyleSheet.create({
  shell: { width: '100%', maxWidth: wide ? 680 : undefined, alignSelf: 'center', minHeight: wide ? 300 : phone ? 246 : 270, justifyContent: 'center', padding: wide ? 20 : phone ? 8 : 14, borderRadius: wide ? 18 : 16, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: '#081726', overflow: 'hidden' },
  scene: { width: '100%', gap: wide ? 17 : phone ? 10 : 13 },
  heading: { gap: 4 },
  title: { color: theme.colors.text, fontSize: wide ? 20 : phone ? 15 : 17, lineHeight: wide ? 28 : phone ? 21 : 24, fontWeight: '900' },
  body: { color: theme.colors.textMuted, fontSize: wide ? 12 : phone ? 9 : 10, lineHeight: wide ? 18 : phone ? 13 : 15 },
  eyebrow: { color: theme.colors.textMuted, fontSize: phone ? 7 : 8, fontWeight: '900', letterSpacing: 0.45, textAlign: 'center' },
  micro: { color: theme.colors.textMuted, fontSize: phone ? 7 : 8, lineHeight: phone ? 10 : 12, textAlign: 'center' },
  note: { color: theme.colors.textMuted, fontSize: wide ? 11 : phone ? 9 : 10, lineHeight: wide ? 16 : phone ? 13 : 14, textAlign: 'center' },
  miniCandleWrap: { width: phone ? 17 : 22, alignItems: 'center' },
  miniCandleWrapTall: { width: phone ? 24 : 30 },
  miniWick: { width: 2, height: phone ? 9 : 11, backgroundColor: '#8097A4' },
  miniBody: { width: phone ? 11 : 14, height: phone ? 25 : 31, borderRadius: 3 },
  miniBodyTall: { width: phone ? 16 : 19, height: phone ? 48 : 58 },
  candleUp: { backgroundColor: '#4FA69B' },
  candleDown: { backgroundColor: '#A76561' },
  candleTimeline: { minHeight: wide ? 145 : phone ? 103 : 118, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: phone ? 8 : 14, borderRadius: 14, borderWidth: 1, borderColor: '#355064', backgroundColor: '#0D2130' },
  timeStrip: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timeLine: { flex: 1, height: 1, backgroundColor: '#456071' },
  ohlcCard: { minHeight: wide ? 190 : phone ? 150 : 166, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 12 : 20, padding: phone ? 10 : 14, borderRadius: 14, borderWidth: 1, borderColor: '#36596A', backgroundColor: '#0E2331' },
  ohlcLabelsLeft: { flex: 1, height: phone ? 112 : 130, justifyContent: 'space-between', alignItems: 'flex-end' },
  ohlcLabelsRight: { flex: 1, height: phone ? 112 : 130, justifyContent: 'space-around', alignItems: 'flex-start' },
  ohlcLabel: { color: '#B7C8D0', fontSize: phone ? 8 : 9, fontWeight: '900' },
  largeCandleStage: { width: phone ? 44 : 54, alignItems: 'center' },
  largeWick: { width: 3, height: phone ? 28 : 35, backgroundColor: '#8DA0AA' },
  largeBody: { width: phone ? 27 : 34, height: phone ? 57 : 68, borderRadius: 5, backgroundColor: '#4FA69B' },
  practiceOhlc: { flexDirection: 'row', gap: phone ? 8 : 12, alignItems: 'stretch' },
  practicePriceColumn: { flex: 1, gap: phone ? 4 : 6 },
  priceRow: { flex: 1, minHeight: phone ? 28 : 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: phone ? 8 : 10, borderRadius: 9, backgroundColor: '#102432' },
  priceRowAccent: { borderWidth: 1, borderColor: '#397A72', backgroundColor: '#0D2C31' },
  priceRowLabel: { color: theme.colors.textMuted, fontSize: phone ? 8 : 9, fontWeight: '700' },
  priceRowValue: { color: theme.colors.text, fontSize: phone ? 10 : 12, fontWeight: '900' },
  practiceCandleCard: { width: phone ? 92 : 118, minHeight: phone ? 132 : 152, alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 13, borderWidth: 1, borderColor: '#3D5968', backgroundColor: '#102431' },
  futureCompare: { position: 'relative', flexDirection: 'row', alignItems: 'stretch', gap: phone ? 6 : 10 },
  finishedCard: { flex: 1, minWidth: 0, minHeight: phone ? 123 : 142, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 13, borderWidth: 1, borderColor: '#377269', backgroundColor: '#0D2B31' },
  unknownCard: { flex: 1, minWidth: 0, minHeight: phone ? 123 : 142, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 13, borderWidth: 1, borderStyle: 'dashed', borderColor: '#596873', backgroundColor: '#111E29' },
  notEqualBadge: { position: 'absolute', left: '50%', top: '50%', width: phone ? 24 : 30, height: phone ? 24 : 30, marginLeft: phone ? -12 : -15, marginTop: phone ? -12 : -15, zIndex: 3, alignItems: 'center', justifyContent: 'center', borderRadius: 15, borderWidth: 1, borderColor: '#435966', backgroundColor: '#081726' },
  notEqualBadgeText: { color: '#9CAEB7', fontSize: phone ? 14 : 18, fontWeight: '900' },
  notEqual: { color: '#8FA2AD', fontSize: phone ? 20 : 26, fontWeight: '900' },
  question: { color: '#AEBFC7', fontSize: phone ? 34 : 42, fontWeight: '900' },
  fourPointSummary: { flexDirection: 'row', gap: phone ? 5 : 8 },
  summaryChip: { flex: 1, minWidth: 0, minHeight: wide ? 116 : phone ? 87 : 100, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 12, borderWidth: 1, borderColor: '#3A5262', backgroundColor: '#102331' },
  summaryNumber: { color: '#73C1B7', fontSize: phone ? 17 : 21, fontWeight: '900' },
  summaryLabel: { color: theme.colors.text, fontSize: phone ? 7 : 8, fontWeight: '900', textAlign: 'center' },
  pathBars: { flex: 1, minHeight: phone ? 72 : 88, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', gap: 4 },
  pathSlot: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'flex-end' },
  pathBar: { width: '70%', maxWidth: 22, minWidth: 6, borderRadius: 4, backgroundColor: '#4FA69B' },
  pathBarDown: { backgroundColor: '#A76561' },
  twoPanel: { flexDirection: 'row', gap: phone ? 7 : 10 },
  comparePanel: { flex: 1, minWidth: 0, minHeight: wide ? 168 : phone ? 126 : 144, gap: 6, padding: phone ? 8 : 10, borderRadius: 13, borderWidth: 1, borderColor: '#3D5666', backgroundColor: '#102331' },
  warningPanel: { borderColor: '#6D5350', backgroundColor: '#241D22' },
  accentPanel: { borderColor: '#39766E', backgroundColor: '#0D2A30' },
  resultBad: { color: '#D49A94', fontSize: phone ? 8 : 9, fontWeight: '900', textAlign: 'center' },
  resultGood: { color: '#83C8BF', fontSize: phone ? 8 : 9, fontWeight: '900', textAlign: 'center' },
  aggregateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 8 : 14, minHeight: wide ? 180 : phone ? 142 : 158, borderRadius: 14, borderWidth: 1, borderColor: '#3B5667', backgroundColor: '#0E2130', padding: phone ? 8 : 12 },
  smallCandles: { flexDirection: 'row', gap: phone ? 5 : 7, alignItems: 'center' },
  aggregateArrow: { color: '#6A8897', fontSize: phone ? 28 : 36, fontWeight: '900' },
  aggregateResult: { alignItems: 'center', gap: 6 },
  aggregateText: { color: '#C8D5DA', fontSize: phone ? 8 : 10, fontWeight: '900' },
  scaleStack: { minHeight: wide ? 180 : phone ? 142 : 158, position: 'relative', justifyContent: 'center' },
  broadScale: { minHeight: phone ? 122 : 138, padding: phone ? 8 : 10, borderRadius: 13, borderWidth: 1, borderColor: '#387269', backgroundColor: '#0C2930' },
  zoomWindow: { position: 'absolute', right: phone ? 8 : 16, bottom: phone ? 8 : 12, width: phone ? '48%' : '42%', minHeight: phone ? 76 : 88, padding: 7, borderRadius: 11, borderWidth: 1, borderColor: '#765957', backgroundColor: '#211B20' },
  scaleSummary: { flexDirection: 'row', gap: phone ? 6 : 8 },
  scaleChip: { flex: 1, minWidth: 0, minHeight: wide ? 118 : phone ? 92 : 104, alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 13, borderWidth: 1, borderColor: '#3D5362', backgroundColor: '#102331' },
  scaleChipAccent: { borderColor: '#3B766F', backgroundColor: '#0D2B31' },
  scaleIndex: { color: '#75BDB4', fontSize: phone ? 20 : 24, fontWeight: '900' },
  oneVsStructure: { flexDirection: 'row', alignItems: 'center', gap: phone ? 8 : 12 },
  singleMove: { width: phone ? 90 : 112, minHeight: wide ? 168 : phone ? 126 : 144, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 13, borderWidth: 1, borderColor: '#3A6D66', backgroundColor: '#0D2A30' },
  structurePanel: { flex: 1, minWidth: 0, minHeight: wide ? 168 : phone ? 126 : 144, gap: 7, padding: phone ? 8 : 10, borderRadius: 13, borderWidth: 1, borderColor: '#405868', backgroundColor: '#102331' },
  trendTriplet: { flexDirection: 'row', gap: phone ? 5 : 8 },
  trendCard: { flex: 1, minWidth: 0, minHeight: wide ? 160 : phone ? 120 : 138, padding: phone ? 6 : 8, gap: 6, borderRadius: 12, borderWidth: 1, borderColor: '#4A5964', backgroundColor: '#102331' },
  trendCardAccent: { borderColor: '#39766F', backgroundColor: '#0D2B31' },
  trendCardLabel: { color: theme.colors.text, fontSize: phone ? 7 : 8, fontWeight: '900', textAlign: 'center' },
  swingBoard: { minHeight: wide ? 186 : phone ? 146 : 164, padding: phone ? 8 : 11, gap: 8, borderRadius: 14, borderWidth: 1, borderColor: '#3D5868', backgroundColor: '#0E2230' },
  swingLabels: { flexDirection: 'row', justifyContent: 'space-around' },
  swingLabel: { color: '#8FC9C2', fontSize: phone ? 7 : 8, fontWeight: '900' },
  trendMisconception: { flexDirection: 'row', gap: phone ? 8 : 10 },
  fallingContext: { flex: 1, minWidth: 0, minHeight: wide ? 155 : phone ? 118 : 136, padding: phone ? 8 : 10, borderRadius: 13, borderWidth: 1, borderColor: '#735957', backgroundColor: '#211B20' },
  bounceCard: { width: phone ? 92 : 114, minHeight: wide ? 155 : phone ? 118 : 136, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 13, borderWidth: 1, borderColor: '#3C746B', backgroundColor: '#0D2A30' },
  structureSummary: { flexDirection: 'row', gap: phone ? 6 : 8 },
  structureSummaryItem: { flex: 1, minWidth: 0, minHeight: wide ? 120 : phone ? 92 : 106, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 12, borderWidth: 1, borderColor: '#3E5463', backgroundColor: '#102331' },
  structureArrow: { color: '#6BB8AE', fontSize: phone ? 24 : 30, fontWeight: '900' },
});