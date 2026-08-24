import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type Topic = 'zones' | 'momentum' | 'average';
type Props = { assetRef: string; alt: string; language: LearningLanguage; role: LessonSupportingVisualRole; theme?: LearningTheme };
type Styles = ReturnType<typeof createStyles>;
type StoryProps = { tr: boolean; role: LessonSupportingVisualRole; styles: Styles };

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('destek-direnc-bolgedir')) return 'zones';
  if (assetRef.includes('momentum-ne-anlatir')) return 'momentum';
  if (assetRef.includes('hareketli-ortalama-ne-yapar')) return 'average';
  return undefined;
}

export function isBeginnerAppliedChartStoryAsset(assetRef: string): boolean { return Boolean(topicForAsset(assetRef)); }

export function BeginnerAppliedChartStoryVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: Props) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const phone = width < 420;
  const styles = createStyles(theme, wide, phone);
  const tr = language === 'tr';
  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {topic === 'zones' ? <ZoneStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'momentum' ? <MomentumStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'average' ? <AverageStory tr={tr} role={role} styles={styles} /> : null}
    </View>
  );
}

function Heading({ title, body, styles }: { title: string; body?: string; styles: Styles }) {
  return <View style={styles.heading}><Text style={styles.title}>{title}</Text>{body ? <Text style={styles.body}>{body}</Text> : null}</View>;
}

function Path({ values, muted = false, styles }: { values: readonly number[]; muted?: boolean; styles: Styles }) {
  return <View style={styles.path}>{values.map((height, index) => <View key={`${height}-${index}`} style={styles.pathSlot}><View style={[styles.pathBar, { height }, muted && styles.pathBarMuted]} /></View>)}</View>;
}

function ZoneChart({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.zoneChart} accessibilityLabel="chart-zone-map">
      <View style={styles.resistanceBand}><Text style={styles.bandLabel}>{tr ? 'DİRENÇ BÖLGESİ' : 'RESISTANCE ZONE'}</Text></View>
      <Path values={[34, 64, 44, 67, 40, 62, 36]} styles={styles} />
      <View style={styles.supportBand}><Text style={styles.bandLabel}>{tr ? 'DESTEK BÖLGESİ' : 'SUPPORT ZONE'}</Text></View>
    </View>
  );
}

function ZoneStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') return <View style={styles.scene}><Heading styles={styles} title={tr ? 'Fiyat bazı alanlara geldiğinde tekrar tekrar tepki verebilir.' : 'Price can react repeatedly around familiar areas.'} /><ZoneChart tr={tr} styles={styles} /></View>;
  if (role === 'concept') return (
    <View style={styles.scene}>
      <Heading styles={styles} title={tr ? 'Destek ve direnç tek bir kusursuz çizgi değil, yaklaşık tepki bölgeleridir.' : 'Support and resistance are approximate reaction zones, not perfect single lines.'} />
      <View style={styles.lineVsZone}>
        <View style={styles.wrongLineCard} accessibilityLabel="chart-zone-single-line"><Text style={styles.eyebrow}>{tr ? 'TEK ÇİZGİ' : 'SINGLE LINE'}</Text><View style={styles.hardLine} /></View>
        <Text style={styles.notEqual}>≠</Text>
        <View style={styles.zoneCard} accessibilityLabel="chart-zone-reaction-area"><Text style={styles.eyebrow}>{tr ? 'TEPKİ BÖLGESİ' : 'REACTION AREA'}</Text><View style={styles.softBand} /></View>
      </View>
    </View>
  );
  if (role === 'practice') return (
    <View style={styles.scene}>
      <Heading styles={styles} title={tr ? 'Aynı bölgede birden fazla tepki görmek, bölgenin neden dikkat çektiğini gösterir.' : 'Multiple reactions around one area show why the zone matters.'} />
      <View style={styles.reactionBoard} accessibilityLabel="chart-zone-repeated-reactions">
        <View style={styles.reactionBand} />
        <Path values={[28, 53, 33, 57, 31, 55, 30, 61]} styles={styles} />
        <View style={styles.touchRow}>{[1, 2, 3].map((n) => <View key={n} style={styles.touchDot}><Text style={styles.touchText}>{n}</Text></View>)}</View>
      </View>
    </View>
  );
  if (role === 'misconception') return (
    <View style={styles.scene}>
      <Heading styles={styles} title={tr ? 'Bir bölge duvar değildir; fiyat bölgeden geçebilir.' : 'A zone is not a wall; price can move through it.'} />
      <View style={styles.twoPanel}>
        <View style={styles.wallCard} accessibilityLabel="chart-zone-hard-wall"><Text style={styles.eyebrow}>{tr ? 'YANLIŞ' : 'WRONG'}</Text><View style={styles.wallGraphic}><View style={styles.wall} /><View style={styles.blockedDot} /></View><Text style={styles.caption}>{tr ? '“Kesin geçemez”' : '“Cannot pass”'}</Text></View>
        <View style={styles.softZoneCard} accessibilityLabel="chart-zone-soft-reaction"><Text style={styles.eyebrow}>{tr ? 'DAHA DOĞRU' : 'BETTER'}</Text><View style={styles.passGraphic}><View style={styles.passBand} /><View style={styles.passDot} /></View><Text style={styles.caption}>{tr ? '“Tepki ihtimali artabilir”' : '“Reaction may be more likely”'}</Text></View>
      </View>
    </View>
  );
  return <View style={styles.scene}><Heading styles={styles} title={tr ? 'Destek ve direnç = geçmişte tepki görülen yaklaşık bölgeler.' : 'Support and resistance = approximate areas where price reacted before.'} /><View style={styles.zoneSummary}><View style={styles.summaryResistance}><Text style={styles.summaryLabel}>{tr ? 'DİRENÇ' : 'RESISTANCE'}</Text></View><View style={styles.summaryGap} /><View style={styles.summarySupport}><Text style={styles.summaryLabel}>{tr ? 'DESTEK' : 'SUPPORT'}</Text></View></View></View>;
}

function MomentumPair({ tr, styles }: { tr: boolean; styles: Styles }) {
  return <View style={styles.twoPanel}><View style={styles.momentumCard} accessibilityLabel="chart-momentum-fast"><Text style={styles.eyebrow}>{tr ? 'HIZLI' : 'FAST'}</Text><Path values={[18, 34, 52, 70, 86]} styles={styles} /></View><View style={styles.momentumCard} accessibilityLabel="chart-momentum-slow"><Text style={styles.eyebrow}>{tr ? 'YAVAŞ' : 'SLOW'}</Text><Path values={[25, 31, 37, 43, 49]} styles={styles} /></View></View>;
}

function MomentumStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') return <View style={styles.scene}><Heading styles={styles} title={tr ? 'İki hareket aynı yönde olabilir ama aynı güçte olmayabilir.' : 'Two moves can go in the same direction without having the same strength.'} /><MomentumPair tr={tr} styles={styles} /></View>;
  if (role === 'concept') return (
    <View style={styles.scene}>
      <Heading styles={styles} title={tr ? 'Momentum, fiyat hareketinin hızını ve ısrarını anlatır.' : 'Momentum describes the speed and persistence of a price move.'} />
      <View style={styles.meterCard} accessibilityLabel="chart-momentum-meter"><Text style={styles.eyebrow}>{tr ? 'HAREKETİN GÜCÜ / HIZI' : 'MOVE STRENGTH / SPEED'}</Text><View style={styles.meterTrack}><View style={styles.meterFill} /></View><View style={styles.meterLabels}><Text style={styles.micro}>{tr ? 'YAVAŞ' : 'SLOW'}</Text><Text style={styles.micro}>{tr ? 'HIZLI' : 'FAST'}</Text></View></View>
    </View>
  );
  if (role === 'practice') return (
    <View style={styles.scene}>
      <Heading styles={styles} title={tr ? 'Fiyat yükselmeye devam ederken adımlar küçülüyorsa momentum zayıflıyor olabilir.' : 'If price keeps rising while each step gets smaller, momentum may be fading.'} />
      <View style={styles.fadeBoard} accessibilityLabel="chart-momentum-fading"><Path values={[22, 43, 59, 70, 77, 81]} styles={styles} /><View style={styles.fadeArrow}><Text style={styles.fadeText}>{tr ? 'ADIMLAR KÜÇÜLÜYOR →' : 'STEPS SHRINK →'}</Text></View></View>
    </View>
  );
  if (role === 'misconception') return (
    <View style={styles.scene}>
      <Heading styles={styles} title={tr ? 'Güçlü momentum, hareketin sonsuza kadar süreceğini garanti etmez.' : 'Strong momentum does not guarantee that a move will continue forever.'} />
      <View style={styles.futureCompare}>
        <View style={styles.fastNow} accessibilityLabel="chart-momentum-strong-now"><Text style={styles.eyebrow}>{tr ? 'ŞİMDİ GÜÇLÜ' : 'STRONG NOW'}</Text><Path values={[22, 45, 68, 87]} styles={styles} /></View>
        <Text style={styles.futureArrow}>›</Text>
        <View style={styles.futureUnknown} accessibilityLabel="chart-momentum-unknown-future"><Text style={styles.eyebrow}>{tr ? 'SONRA' : 'NEXT'}</Text><Text style={styles.question}>?</Text></View>
      </View>
    </View>
  );
  return <View style={styles.scene}><Heading styles={styles} title={tr ? 'Momentum = hareketin gücü ve hızı; gelecek yönünün garantisi değil.' : 'Momentum = strength and speed of movement, not a guarantee of future direction.'} /><View style={styles.momentumSummary}><Text style={styles.speedWord}>HIZ</Text><Text style={styles.plus}>+</Text><Text style={styles.speedWord}>{tr ? 'ISRAR' : 'PERSISTENCE'}</Text><Text style={styles.notEqual}>≠</Text><Text style={styles.question}>?</Text></View></View>;
}

function AverageStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') return (
    <View style={styles.scene}>
      <Heading styles={styles} title={tr ? 'Hareketli ortalama, dalgalı geçmiş fiyatları daha sakin bir çizgide özetler.' : 'A moving average summarizes noisy past prices with a smoother line.'} />
      <View style={styles.averageChart} accessibilityLabel="chart-average-past-and-smooth"><Path values={[28, 57, 39, 66, 48, 74, 58]} styles={styles} /><View style={styles.smoothTrack}><View style={styles.smoothA} /><View style={styles.smoothB} /><View style={styles.smoothC} /></View></View>
    </View>
  );
  if (role === 'concept') return (
    <View style={styles.scene}>
      <Heading styles={styles} title={tr ? 'Ortalama çizgisi geçmiş fiyatlardan hesaplanır.' : 'The average line is calculated from past prices.'} />
      <View style={styles.averageFormula} accessibilityLabel="chart-average-formula"><View style={styles.numberRow}>{['98', '101', '100', '103'].map((v) => <View key={v} style={styles.numberChip}><Text style={styles.number}>{v}</Text></View>)}</View><Text style={styles.formulaArrow}>→</Text><View style={styles.averageResult}><Text style={styles.eyebrow}>{tr ? 'ORTALAMA' : 'AVERAGE'}</Text><Text style={styles.averageValue}>100,5</Text></View></View>
    </View>
  );
  if (role === 'practice') return (
    <View style={styles.scene}>
      <Heading styles={styles} title={tr ? 'Kısa ortalama fiyata daha hızlı, uzun ortalama daha yavaş tepki verir.' : 'A short average reacts faster to price; a long average reacts more slowly.'} />
      <View style={styles.twoPanel}>
        <View style={styles.avgCompareCard} accessibilityLabel="chart-average-short"><Text style={styles.eyebrow}>{tr ? 'KISA ORTALAMA' : 'SHORT AVERAGE'}</Text><View style={styles.jaggedLine}><View style={styles.jagA} /><View style={styles.jagB} /><View style={styles.jagC} /></View><Text style={styles.caption}>{tr ? 'Daha hızlı tepki' : 'Faster reaction'}</Text></View>
        <View style={styles.avgCompareCard} accessibilityLabel="chart-average-long"><Text style={styles.eyebrow}>{tr ? 'UZUN ORTALAMA' : 'LONG AVERAGE'}</Text><View style={styles.longLine} /><Text style={styles.caption}>{tr ? 'Daha yumuşak tepki' : 'Smoother reaction'}</Text></View>
      </View>
    </View>
  );
  if (role === 'misconception') return (
    <View style={styles.scene}>
      <Heading styles={styles} title={tr ? 'Fiyat ortalamayı geçti diye gelecek kesinleşmez.' : 'Crossing the average does not make the future certain.'} />
      <View style={styles.futureCompare}>
        <View style={styles.crossCard} accessibilityLabel="chart-average-cross"><Text style={styles.eyebrow}>{tr ? 'KESİŞİM OLDU' : 'CROSS HAPPENED'}</Text><View style={styles.crossStage}><View style={styles.crossAverage} /><View style={styles.crossPrice} /><View style={styles.crossDot} /></View></View>
        <Text style={styles.futureArrow}>›</Text>
        <View style={styles.futureUnknown} accessibilityLabel="chart-average-unknown-future"><Text style={styles.eyebrow}>{tr ? 'GELECEK' : 'FUTURE'}</Text><Text style={styles.question}>?</Text></View>
      </View>
    </View>
  );
  return <View style={styles.scene}><Heading styles={styles} title={tr ? 'Hareketli ortalama geçmişi sadeleştirir; geleceği bilmez.' : 'A moving average simplifies the past; it does not know the future.'} /><View style={styles.averageSummary}><View style={styles.pastSummary}><Text style={styles.eyebrow}>{tr ? 'GEÇMİŞ FİYATLAR' : 'PAST PRICES'}</Text><Path values={[25, 49, 35, 56, 44]} muted styles={styles} /></View><Text style={styles.formulaArrow}>→</Text><View style={styles.smoothSummary}><Text style={styles.eyebrow}>{tr ? 'YUMUŞAK ÖZET' : 'SMOOTH SUMMARY'}</Text><View style={styles.longLine} /></View></View></View>;
}

const createStyles = (theme: LearningTheme, wide: boolean, phone: boolean) => StyleSheet.create({
  shell: { width: '100%', maxWidth: wide ? 680 : undefined, alignSelf: 'center', minHeight: wide ? 300 : phone ? 246 : 270, justifyContent: 'center', padding: wide ? 20 : phone ? 10 : 14, borderRadius: wide ? 18 : 16, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: '#081726', overflow: 'hidden' },
  scene: { width: '100%', gap: wide ? 17 : phone ? 10 : 13 },
  heading: { gap: 4 },
  title: { color: theme.colors.text, fontSize: wide ? 20 : phone ? 15 : 17, lineHeight: wide ? 28 : phone ? 21 : 24, fontWeight: '900' },
  body: { color: theme.colors.textMuted, fontSize: wide ? 12 : phone ? 9 : 10, lineHeight: wide ? 18 : phone ? 13 : 15 },
  eyebrow: { color: theme.colors.textMuted, fontSize: phone ? 7 : 8, fontWeight: '900', letterSpacing: 0.45, textAlign: 'center' },
  micro: { color: theme.colors.textMuted, fontSize: phone ? 7 : 8, fontWeight: '800' },
  caption: { color: theme.colors.textMuted, fontSize: phone ? 8 : 9, lineHeight: phone ? 11 : 13, textAlign: 'center', fontWeight: '700' },
  notEqual: { color: '#8FA2AD', fontSize: phone ? 20 : 25, fontWeight: '900' },
  question: { color: '#C7D3D9', fontSize: phone ? 30 : 38, fontWeight: '900' },
  path: { flex: 1, minHeight: phone ? 78 : 96, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', gap: 4 },
  pathSlot: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'flex-end' },
  pathBar: { width: '70%', minWidth: 6, maxWidth: 24, borderRadius: 4, backgroundColor: '#4FA69B' },
  pathBarMuted: { backgroundColor: '#647C8B' },
  twoPanel: { flexDirection: 'row', gap: phone ? 7 : 10 },

  zoneChart: { minHeight: wide ? 190 : phone ? 148 : 168, position: 'relative', justifyContent: 'center', paddingHorizontal: phone ? 8 : 12, paddingVertical: phone ? 13 : 16, borderRadius: 14, borderWidth: 1, borderColor: '#3C5668', backgroundColor: '#0E2130', overflow: 'hidden' },
  resistanceBand: { position: 'absolute', left: 8, right: 8, top: phone ? 22 : 28, height: phone ? 32 : 38, justifyContent: 'center', paddingHorizontal: 7, borderRadius: 7, backgroundColor: '#4F3A3E55' },
  supportBand: { position: 'absolute', left: 8, right: 8, bottom: phone ? 18 : 24, height: phone ? 32 : 38, justifyContent: 'center', paddingHorizontal: 7, borderRadius: 7, backgroundColor: '#245F5A55' },
  bandLabel: { color: '#B4C4CB', fontSize: phone ? 7 : 8, fontWeight: '900' },
  lineVsZone: { flexDirection: 'row', alignItems: 'center', gap: phone ? 8 : 12 },
  wrongLineCard: { flex: 1, minWidth: 0, minHeight: wide ? 150 : phone ? 116 : 132, alignItems: 'center', justifyContent: 'center', gap: 15, borderRadius: 13, borderWidth: 1, borderColor: '#655256', backgroundColor: '#211C21' },
  zoneCard: { flex: 1, minWidth: 0, minHeight: wide ? 150 : phone ? 116 : 132, alignItems: 'center', justifyContent: 'center', gap: 15, borderRadius: 13, borderWidth: 1, borderColor: '#39746C', backgroundColor: '#0D2930' },
  hardLine: { width: '75%', height: 3, backgroundColor: '#B08A84' },
  softBand: { width: '75%', height: phone ? 30 : 36, borderRadius: 7, backgroundColor: '#39756C66' },
  reactionBoard: { minHeight: wide ? 190 : phone ? 150 : 170, position: 'relative', padding: phone ? 10 : 13, borderRadius: 14, borderWidth: 1, borderColor: '#3B5968', backgroundColor: '#0E2230', overflow: 'hidden' },
  reactionBand: { position: 'absolute', left: 10, right: 10, bottom: phone ? 35 : 42, height: phone ? 32 : 38, borderRadius: 7, backgroundColor: '#36766D55' },
  touchRow: { position: 'absolute', left: '24%', right: '20%', bottom: phone ? 44 : 52, flexDirection: 'row', justifyContent: 'space-between' },
  touchDot: { width: phone ? 18 : 22, height: phone ? 18 : 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: '#65B9AE' },
  touchText: { color: '#092129', fontSize: phone ? 7 : 8, fontWeight: '900' },
  wallCard: { flex: 1, minWidth: 0, minHeight: wide ? 155 : phone ? 120 : 138, alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 13, borderWidth: 1, borderColor: '#6B5357', backgroundColor: '#211D22' },
  softZoneCard: { flex: 1, minWidth: 0, minHeight: wide ? 155 : phone ? 120 : 138, alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 13, borderWidth: 1, borderColor: '#39756D', backgroundColor: '#0D2930' },
  wallGraphic: { width: '68%', height: 42, position: 'relative' },
  wall: { position: 'absolute', left: '48%', top: 0, bottom: 0, width: 5, borderRadius: 2, backgroundColor: '#A97772' },
  blockedDot: { position: 'absolute', left: '20%', top: 14, width: 14, height: 14, borderRadius: 7, backgroundColor: '#C49A94' },
  passGraphic: { width: '68%', height: 42, position: 'relative' },
  passBand: { position: 'absolute', left: '38%', width: '25%', top: 0, bottom: 0, borderRadius: 6, backgroundColor: '#39756D66' },
  passDot: { position: 'absolute', left: '68%', top: 14, width: 14, height: 14, borderRadius: 7, backgroundColor: '#72C6BC' },
  zoneSummary: { minHeight: wide ? 150 : phone ? 118 : 136, justifyContent: 'space-between', padding: phone ? 10 : 14, borderRadius: 14, borderWidth: 1, borderColor: '#3C5667', backgroundColor: '#0E2130' },
  summaryResistance: { height: phone ? 36 : 42, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: '#4E373D77' },
  summarySupport: { height: phone ? 36 : 42, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: '#2A665F77' },
  summaryGap: { flex: 1 },
  summaryLabel: { color: '#C4D1D7', fontSize: phone ? 8 : 9, fontWeight: '900' },

  momentumCard: { flex: 1, minWidth: 0, minHeight: wide ? 165 : phone ? 126 : 145, padding: phone ? 8 : 10, gap: 7, borderRadius: 13, borderWidth: 1, borderColor: '#3D5868', backgroundColor: '#102331' },
  meterCard: { minHeight: wide ? 160 : phone ? 124 : 142, alignItems: 'center', justifyContent: 'center', gap: 14, padding: phone ? 12 : 16, borderRadius: 14, borderWidth: 1, borderColor: '#3B5868', backgroundColor: '#0E2230' },
  meterTrack: { width: '86%', height: phone ? 13 : 16, borderRadius: 8, backgroundColor: '#1D3747', overflow: 'hidden' },
  meterFill: { width: '72%', height: '100%', borderRadius: 8, backgroundColor: '#55AFA4' },
  meterLabels: { width: '86%', flexDirection: 'row', justifyContent: 'space-between' },
  fadeBoard: { minHeight: wide ? 180 : phone ? 142 : 160, padding: phone ? 9 : 12, gap: 8, borderRadius: 14, borderWidth: 1, borderColor: '#3B5868', backgroundColor: '#0E2230' },
  fadeArrow: { alignItems: 'flex-end' },
  fadeText: { color: '#91BEB9', fontSize: phone ? 7 : 8, fontWeight: '900' },
  futureCompare: { flexDirection: 'row', alignItems: 'center', gap: phone ? 6 : 12, position: 'relative' },
  fastNow: { flex: 1, minWidth: 0, minHeight: wide ? 150 : phone ? 116 : 132, gap: 7, padding: phone ? 8 : 10, borderRadius: 13, borderWidth: 1, borderColor: '#39766E', backgroundColor: '#0D2A30' },
  futureArrow: { color: '#718895', fontSize: phone ? 22 : 32, fontWeight: '900', position: phone ? 'absolute' : 'relative', left: phone ? '72%' : undefined, zIndex: phone ? 2 : undefined },
  futureUnknown: { width: phone ? 82 : 116, minHeight: wide ? 150 : phone ? 116 : 132, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 13, borderWidth: 1, borderStyle: 'dashed', borderColor: '#596873', backgroundColor: '#111E29' },
  momentumSummary: { minHeight: wide ? 140 : phone ? 110 : 126, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 7 : 10, borderRadius: 14, borderWidth: 1, borderColor: '#3D5666', backgroundColor: '#0E2230' },
  speedWord: { color: '#82C7BF', fontSize: phone ? 11 : 14, fontWeight: '900' },
  plus: { color: '#8195A0', fontSize: phone ? 14 : 18, fontWeight: '900' },

  averageChart: { minHeight: wide ? 185 : phone ? 145 : 165, position: 'relative', padding: phone ? 9 : 12, borderRadius: 14, borderWidth: 1, borderColor: '#3D5666', backgroundColor: '#0E2230' },
  smoothTrack: { position: 'absolute', left: '10%', right: '10%', top: '48%', height: 34 },
  smoothA: { position: 'absolute', left: 0, top: 17, width: '34%', height: 4, borderRadius: 3, backgroundColor: '#B19A73', transform: [{ rotate: '-6deg' }] },
  smoothB: { position: 'absolute', left: '32%', top: 12, width: '35%', height: 4, borderRadius: 3, backgroundColor: '#B19A73', transform: [{ rotate: '3deg' }] },
  smoothC: { position: 'absolute', right: 0, top: 9, width: '35%', height: 4, borderRadius: 3, backgroundColor: '#B19A73', transform: [{ rotate: '-4deg' }] },
  averageFormula: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 8 : 12, minHeight: wide ? 170 : phone ? 132 : 150, padding: phone ? 8 : 12, borderRadius: 14, borderWidth: 1, borderColor: '#3D5666', backgroundColor: '#0E2230' },
  numberRow: { flex: 1, minWidth: 0, flexDirection: 'row', gap: phone ? 4 : 6 },
  numberChip: { flex: 1, minWidth: 0, height: phone ? 38 : 46, alignItems: 'center', justifyContent: 'center', borderRadius: 9, borderWidth: 1, borderColor: '#415866', backgroundColor: '#102432' },
  number: { color: '#C6D3D9', fontSize: phone ? 10 : 12, fontWeight: '900' },
  formulaArrow: { color: '#718A96', fontSize: phone ? 20 : 26, fontWeight: '900' },
  averageResult: { width: phone ? 83 : 110, minHeight: phone ? 70 : 82, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 12, borderWidth: 1, borderColor: '#876F4F', backgroundColor: '#29241F' },
  averageValue: { color: '#D8C29B', fontSize: phone ? 17 : 21, fontWeight: '900' },
  avgCompareCard: { flex: 1, minWidth: 0, minHeight: wide ? 155 : phone ? 120 : 138, alignItems: 'center', justifyContent: 'center', gap: 12, padding: phone ? 8 : 10, borderRadius: 13, borderWidth: 1, borderColor: '#465865', backgroundColor: '#102331' },
  jaggedLine: { width: '78%', height: 46, position: 'relative' },
  jagA: { position: 'absolute', left: 0, top: 23, width: '36%', height: 4, backgroundColor: '#B69A6C', transform: [{ rotate: '-17deg' }] },
  jagB: { position: 'absolute', left: '31%', top: 18, width: '38%', height: 4, backgroundColor: '#B69A6C', transform: [{ rotate: '14deg' }] },
  jagC: { position: 'absolute', right: 0, top: 16, width: '37%', height: 4, backgroundColor: '#B69A6C', transform: [{ rotate: '-10deg' }] },
  longLine: { width: '78%', height: 4, borderRadius: 3, backgroundColor: '#B69A6C', transform: [{ rotate: '-4deg' }] },
  crossCard: { flex: 1, minWidth: 0, minHeight: wide ? 150 : phone ? 116 : 132, gap: 9, padding: phone ? 8 : 10, borderRadius: 13, borderWidth: 1, borderColor: '#7A6448', backgroundColor: '#29231E' },
  crossStage: { flex: 1, minHeight: phone ? 70 : 84, position: 'relative' },
  crossAverage: { position: 'absolute', left: '12%', right: '10%', top: '55%', height: 3, backgroundColor: '#B59A6E', transform: [{ rotate: '-3deg' }] },
  crossPrice: { position: 'absolute', left: '17%', top: '28%', width: '67%', height: 3, backgroundColor: '#5FB6AC', transform: [{ rotate: '17deg' }] },
  crossDot: { position: 'absolute', left: '52%', top: '45%', width: 11, height: 11, borderRadius: 6, backgroundColor: '#D3B47D' },
  averageSummary: { flexDirection: 'row', alignItems: 'center', gap: phone ? 8 : 12 },
  pastSummary: { flex: 1, minWidth: 0, minHeight: wide ? 150 : phone ? 116 : 132, gap: 7, padding: phone ? 8 : 10, borderRadius: 13, borderWidth: 1, borderColor: '#465866', backgroundColor: '#102331' },
  smoothSummary: { flex: 1, minWidth: 0, minHeight: wide ? 150 : phone ? 116 : 132, alignItems: 'center', justifyContent: 'center', gap: 15, borderRadius: 13, borderWidth: 1, borderColor: '#7A6448', backgroundColor: '#29231E' },
});