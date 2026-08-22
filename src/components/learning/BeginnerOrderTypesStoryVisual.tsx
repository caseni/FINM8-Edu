import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

export interface BeginnerOrderTypesStoryVisualProps {
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

type Styles = ReturnType<typeof createStyles>;

export function BeginnerOrderTypesStoryVisual({
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: BeginnerOrderTypesStoryVisualProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const narrow = width < 380;
  const styles = createStyles(theme, wide, narrow);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {role === 'hook' ? <Hook tr={tr} styles={styles} />
        : role === 'practice' ? <Practice tr={tr} styles={styles} />
          : role === 'misconception' ? <Misconception tr={tr} styles={styles} />
            : role === 'summary' ? <Summary tr={tr} styles={styles} />
              : <Concept tr={tr} styles={styles} />}
    </View>
  );
}

function Heading({ title, body, styles }: { title: string; body?: string; styles: Styles }) {
  return <View style={styles.heading}><Text style={styles.title}>{title}</Text>{body ? <Text style={styles.body}>{body}</Text> : null}</View>;
}

function MarketPath({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.marketPath} accessibilityLabel="order-market-path">
      <Text style={styles.pathLabel}>{tr ? 'PİYASA' : 'MARKET'}</Text>
      <View style={styles.fastArrow}><View style={styles.fastLine} /><Text style={styles.fastArrowHead}>›</Text></View>
      <View style={styles.fillDot} />
      <Text style={styles.micro}>{tr ? 'Şimdi gerçekleşmeye çalış' : 'Try to execute now'}</Text>
    </View>
  );
}

function LimitGate({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.limitScene} accessibilityLabel="order-limit-boundary">
      <Text style={styles.pathLabel}>{tr ? 'LİMİT' : 'LIMIT'}</Text>
      <View style={styles.limitTrack}><View style={styles.limitGate} /><View style={styles.orderDot} /></View>
      <Text style={styles.micro}>{tr ? 'Fiyat sınırı koy' : 'Set a price boundary'}</Text>
    </View>
  );
}

function StopTrigger({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.stopScene} accessibilityLabel="order-stop-trigger">
      <Text style={styles.pathLabel}>{tr ? 'STOP' : 'STOP'}</Text>
      <View style={styles.stopTrack}><View style={styles.triggerLine} /><View style={styles.sleepDot} /></View>
      <Text style={styles.micro}>{tr ? 'Seviyeyi bekle, sonra aktif ol' : 'Wait for a level, then activate'}</Text>
    </View>
  );
}

function Hook({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.scene}>
      <Heading title={tr ? 'Emir türü seçerken aslında hangi önceliği seçiyorsun?' : 'What priority are you really choosing with an order type?'} styles={styles} />
      <View style={styles.threeLane}>
        <MarketPath tr={tr} styles={styles} />
        <LimitGate tr={tr} styles={styles} />
        <StopTrigger tr={tr} styles={styles} />
      </View>
    </View>
  );
}

function Concept({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.scene}>
      <Heading title={tr ? 'Hız, fiyat sınırı ve tetikleyici aynı şey değildir.' : 'Speed, a price boundary, and a trigger are different choices.'} styles={styles} />
      <View style={styles.conceptFlow}>
        <View style={[styles.conceptNode, styles.marketNode]} accessibilityLabel="order-concept-market"><Text style={styles.nodeTitle}>{tr ? 'PİYASA' : 'MARKET'}</Text><Text style={styles.nodeMain}>{tr ? 'Gerçekleşme önceliği' : 'Execution priority'}</Text></View>
        <View style={[styles.conceptNode, styles.limitNode]} accessibilityLabel="order-concept-limit"><Text style={styles.nodeTitle}>{tr ? 'LİMİT' : 'LIMIT'}</Text><Text style={styles.nodeMain}>{tr ? 'Fiyat kontrolü' : 'Price control'}</Text></View>
        <View style={[styles.conceptNode, styles.stopNode]} accessibilityLabel="order-concept-stop"><Text style={styles.nodeTitle}>STOP</Text><Text style={styles.nodeMain}>{tr ? 'Önce tetikleyici' : 'Trigger first'}</Text></View>
      </View>
      <Text style={styles.note}>{tr ? 'Hiçbiri aynı anda hem kesin fiyatı hem kesin gerçekleşmeyi garanti etmez.' : 'None guarantees both an exact price and certain execution at the same time.'}</Text>
    </View>
  );
}

function Practice({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.scene}>
      <Heading title={tr ? 'Fiyat 100 iken iki farklı talimat düşün.' : 'At a price of 100, compare two different instructions.'} styles={styles} />
      <View style={styles.practiceBoard}>
        <View style={styles.priceAxis}><Text style={styles.axisPrice}>102</Text><Text style={styles.axisPrice}>100</Text><Text style={styles.axisPrice}>98</Text><Text style={styles.axisPrice}>95</Text></View>
        <View style={styles.axisTrack}>
          <View style={[styles.currentLine, { top: '29%' }]}><Text style={styles.currentTag}>{tr ? 'ŞİMDİ 100' : 'NOW 100'}</Text></View>
          <View style={[styles.limitPracticeLine, { top: '60%' }]} accessibilityLabel="order-practice-limit"><Text style={styles.levelTag}>{tr ? 'LİMİT 98' : 'LIMIT 98'}</Text></View>
          <View style={[styles.stopPracticeLine, { top: '83%' }]} accessibilityLabel="order-practice-stop"><Text style={styles.levelTag}>STOP 95</Text></View>
        </View>
      </View>
      <Text style={styles.note}>{tr ? 'Limit bir sınırdır; stop ise o seviyeye gelince devreye giren tetikleyicidir.' : 'A limit is a boundary; a stop is a trigger that activates when its level is reached.'}</Text>
    </View>
  );
}

function Misconception({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.scene}>
      <Heading title={tr ? 'İki yaygın garanti yanılgısı' : 'Two common guarantee mistakes'} styles={styles} />
      <View style={styles.twoPanel}>
        <View style={styles.misPanel} accessibilityLabel="order-limit-no-fill">
          <Text style={styles.nodeTitle}>{tr ? 'LİMİT' : 'LIMIT'}</Text>
          <View style={styles.unfilledTrack}><View style={styles.limitGate} /><View style={styles.orderDotFar} /></View>
          <Text style={styles.nodeMain}>{tr ? 'Fiyat gelmezse gerçekleşmeyebilir' : 'May not execute if price never reaches it'}</Text>
        </View>
        <View style={styles.misPanel} accessibilityLabel="order-stop-not-exact-fill">
          <Text style={styles.nodeTitle}>STOP</Text>
          <View style={styles.stopJump}><Text style={styles.stopLevel}>95</Text><Text style={styles.jumpArrow}>↓</Text><Text style={styles.fillLevel}>94,4</Text></View>
          <Text style={styles.nodeMain}>{tr ? 'Tetik fiyatı kesin dolum fiyatı değildir' : 'Trigger price is not an exact fill guarantee'}</Text>
        </View>
      </View>
    </View>
  );
}

function Summary({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.scene}>
      <Heading title={tr ? 'Tek bakışta emir türleri' : 'Order types at a glance'} styles={styles} />
      <View style={styles.summaryFlow}>
        <View style={styles.summaryItem}><Text style={styles.summarySymbol}>→</Text><Text style={styles.summaryName}>{tr ? 'PİYASA' : 'MARKET'}</Text><Text style={styles.micro}>{tr ? 'Şimdi' : 'Now'}</Text></View>
        <View style={styles.summaryItem}><View style={styles.summaryGate} /><Text style={styles.summaryName}>{tr ? 'LİMİT' : 'LIMIT'}</Text><Text style={styles.micro}>{tr ? 'Sınır' : 'Boundary'}</Text></View>
        <View style={styles.summaryItem}><View style={styles.summaryTrigger} /><Text style={styles.summaryName}>STOP</Text><Text style={styles.micro}>{tr ? 'Tetikle' : 'Trigger'}</Text></View>
      </View>
      <View style={styles.rule}><Text style={styles.ruleText}>{tr ? 'Emir türü = hangi koşulu önceliklendirdiğinin kararı.' : 'Order type = a choice about which condition you prioritize.'}</Text></View>
    </View>
  );
}

const createStyles = (theme: LearningTheme, wide: boolean, narrow: boolean) => StyleSheet.create({
  shell: { width: '100%', minHeight: wide ? 300 : narrow ? 242 : 260, justifyContent: 'center', padding: wide ? 20 : narrow ? 10 : 14, borderRadius: wide ? 18 : 16, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: '#081726', overflow: 'hidden' },
  scene: { width: '100%', gap: wide ? 17 : narrow ? 10 : 12 },
  heading: { gap: 5 },
  title: { color: theme.colors.text, fontSize: wide ? 20 : narrow ? 15 : 17, lineHeight: wide ? 28 : narrow ? 21 : 24, fontWeight: '900' },
  body: { color: theme.colors.textMuted, fontSize: wide ? 12 : 10, lineHeight: 15 },
  threeLane: { flexDirection: 'row', gap: narrow ? 6 : 8, alignItems: 'stretch' },
  marketPath: { flex: 1, minWidth: 0, minHeight: wide ? 150 : narrow ? 112 : 126, alignItems: 'center', justifyContent: 'center', gap: 7, padding: narrow ? 7 : 9, borderRadius: 28, borderWidth: 1, borderColor: '#2E716B', backgroundColor: '#0C2B31' },
  limitScene: { flex: 1, minWidth: 0, minHeight: wide ? 150 : narrow ? 112 : 126, alignItems: 'center', justifyContent: 'center', gap: 7, padding: narrow ? 7 : 9, borderRadius: 12, borderWidth: 1, borderColor: '#586B78', backgroundColor: '#102331' },
  stopScene: { flex: 1, minWidth: 0, minHeight: wide ? 150 : narrow ? 112 : 126, alignItems: 'center', justifyContent: 'center', gap: 7, padding: narrow ? 7 : 9, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: '#7C6655', backgroundColor: '#241F22' },
  pathLabel: { color: theme.colors.text, fontSize: narrow ? 8 : 9, fontWeight: '900', letterSpacing: 0.5 },
  micro: { color: theme.colors.textMuted, fontSize: narrow ? 7 : 8, lineHeight: narrow ? 10 : 12, textAlign: 'center' },
  fastArrow: { height: 25, flexDirection: 'row', alignItems: 'center' },
  fastLine: { width: narrow ? 30 : 38, height: 3, borderRadius: 2, backgroundColor: '#59B3A8' },
  fastArrowHead: { marginLeft: -2, color: '#59B3A8', fontSize: 28, lineHeight: 28 },
  fillDot: { width: 13, height: 13, borderRadius: 7, backgroundColor: '#7FD0C5' },
  limitTrack: { width: '80%', height: 38, position: 'relative', justifyContent: 'center' },
  limitGate: { position: 'absolute', left: '48%', width: 4, height: 34, borderRadius: 2, backgroundColor: '#91A7B3' },
  orderDot: { position: 'absolute', left: '20%', width: 13, height: 13, borderRadius: 7, backgroundColor: '#4DA498' },
  stopTrack: { width: '80%', height: 38, position: 'relative', justifyContent: 'center' },
  triggerLine: { position: 'absolute', left: '48%', width: 3, height: 34, borderRadius: 2, backgroundColor: '#B78F67' },
  sleepDot: { position: 'absolute', left: '20%', width: 13, height: 13, borderRadius: 7, borderWidth: 2, borderColor: '#9C8170' },
  conceptFlow: { flexDirection: 'row', gap: narrow ? 6 : 8 },
  conceptNode: { flex: 1, minWidth: 0, minHeight: wide ? 130 : narrow ? 94 : 108, alignItems: 'center', justifyContent: 'center', gap: 6, padding: narrow ? 7 : 9, borderRadius: 13, borderWidth: 1 },
  marketNode: { borderColor: '#2E716B', backgroundColor: '#0C2B31' },
  limitNode: { borderColor: '#566A78', backgroundColor: '#102331' },
  stopNode: { borderColor: '#7C6655', backgroundColor: '#241F22' },
  nodeTitle: { color: theme.colors.text, fontSize: narrow ? 8 : 9, fontWeight: '900', letterSpacing: 0.45, textAlign: 'center' },
  nodeMain: { color: theme.colors.textMuted, fontSize: wide ? 10 : narrow ? 8 : 9, lineHeight: wide ? 14 : 12, textAlign: 'center', fontWeight: '700' },
  note: { color: theme.colors.textMuted, fontSize: wide ? 11 : narrow ? 9 : 10, lineHeight: wide ? 16 : narrow ? 13 : 14, textAlign: 'center' },
  practiceBoard: { minHeight: wide ? 180 : narrow ? 144 : 156, flexDirection: 'row', padding: narrow ? 8 : 10, borderRadius: 14, borderWidth: 1, borderColor: '#344D5E', backgroundColor: '#0E2130' },
  priceAxis: { width: narrow ? 34 : 42, justifyContent: 'space-between', paddingVertical: 2 },
  axisPrice: { color: theme.colors.textMuted, fontSize: narrow ? 8 : 9, fontWeight: '800' },
  axisTrack: { flex: 1, position: 'relative', borderLeftWidth: 1, borderLeftColor: '#385061' },
  currentLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#7290A1' },
  currentTag: { position: 'absolute', right: 0, top: -13, color: '#B8CAD3', fontSize: narrow ? 7 : 8, fontWeight: '900' },
  limitPracticeLine: { position: 'absolute', left: 0, right: 0, height: 3, backgroundColor: '#5BAA9F' },
  stopPracticeLine: { position: 'absolute', left: 0, right: 0, height: 3, backgroundColor: '#B48663' },
  levelTag: { position: 'absolute', right: 0, top: -14, color: theme.colors.text, fontSize: narrow ? 7 : 8, fontWeight: '900' },
  twoPanel: { flexDirection: 'row', gap: narrow ? 6 : 9 },
  misPanel: { flex: 1, minWidth: 0, minHeight: wide ? 158 : narrow ? 120 : 134, alignItems: 'center', justifyContent: 'center', gap: 9, padding: narrow ? 8 : 10, borderRadius: 14, borderWidth: 1, borderColor: '#4C5965', backgroundColor: '#11202D' },
  unfilledTrack: { width: '78%', height: 42, position: 'relative', justifyContent: 'center' },
  orderDotFar: { position: 'absolute', left: '8%', width: 13, height: 13, borderRadius: 7, backgroundColor: '#5BAA9F' },
  stopJump: { flexDirection: 'row', alignItems: 'center', gap: narrow ? 5 : 7 },
  stopLevel: { color: '#BFA58E', fontSize: narrow ? 12 : 14, fontWeight: '900' },
  jumpArrow: { color: '#8195A1', fontSize: narrow ? 15 : 18, fontWeight: '900' },
  fillLevel: { color: '#D1947F', fontSize: narrow ? 12 : 14, fontWeight: '900' },
  summaryFlow: { flexDirection: 'row', gap: narrow ? 6 : 8 },
  summaryItem: { flex: 1, minWidth: 0, minHeight: wide ? 126 : narrow ? 94 : 106, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 13, borderWidth: 1, borderColor: '#3D5362', backgroundColor: '#102331' },
  summarySymbol: { color: '#64BAAF', fontSize: narrow ? 24 : 29, fontWeight: '900' },
  summaryGate: { width: 4, height: narrow ? 28 : 34, borderRadius: 2, backgroundColor: '#91A7B3' },
  summaryTrigger: { width: narrow ? 28 : 34, height: 4, borderRadius: 2, backgroundColor: '#B48663' },
  summaryName: { color: theme.colors.text, fontSize: narrow ? 8 : 9, fontWeight: '900' },
  rule: { paddingHorizontal: 12, paddingVertical: narrow ? 8 : 10, borderRadius: 11, borderWidth: 1, borderColor: '#315A61', backgroundColor: '#0D2933' },
  ruleText: { color: '#D7E4E8', fontSize: wide ? 12 : narrow ? 10 : 11, lineHeight: wide ? 18 : narrow ? 14 : 16, textAlign: 'center', fontWeight: '700' },
});