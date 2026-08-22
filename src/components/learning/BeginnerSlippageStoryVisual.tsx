import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

export interface BeginnerSlippageStoryVisualProps {
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

type Styles = ReturnType<typeof createStyles>;

export function BeginnerSlippageStoryVisual({
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: BeginnerSlippageStoryVisualProps) {
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
  return (
    <View style={styles.heading}>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
    </View>
  );
}

function PriceCard({
  label,
  price,
  tone,
  accessibilityLabel,
  styles,
}: {
  label: string;
  price: string;
  tone: 'reference' | 'actual';
  accessibilityLabel: string;
  styles: Styles;
}) {
  return (
    <View
      style={[styles.priceCard, tone === 'actual' ? styles.actualCard : styles.referenceCard]}
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={styles.cardEyebrow}>{label}</Text>
      <Text style={[styles.price, tone === 'actual' ? styles.actualPrice : styles.referencePrice]}>{price}</Text>
    </View>
  );
}

function ExecutionBridge({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.executionBridge} accessibilityLabel="slippage-execution-process">
      <View style={styles.bridgeLine} />
      <View style={styles.bridgeNodes}>
        <View style={styles.bridgeNode} />
        <View style={styles.bridgeNode} />
        <View style={styles.bridgeNodeActive} />
      </View>
      <Text style={styles.bridgeText}>{tr ? 'Emir piyasada karşılanıyor' : 'Order is being matched'}</Text>
    </View>
  );
}

function Hook({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.scene}>
      <Heading
        title={tr ? 'Gördüğün fiyat ile aldığın fiyat neden farklı olabilir?' : 'Why can the price you see differ from the price you get?'}
        styles={styles}
      />
      <View style={styles.flowRow}>
        <PriceCard
          label={tr ? 'EKRANDA' : 'ON SCREEN'}
          price="100,00"
          tone="reference"
          accessibilityLabel="slippage-hook-screen"
          styles={styles}
        />
        <ExecutionBridge tr={tr} styles={styles} />
        <PriceCard
          label={tr ? 'GERÇEKLEŞEN' : 'FILLED'}
          price="100,15"
          tone="actual"
          accessibilityLabel="slippage-hook-fill"
          styles={styles}
        />
      </View>
      <Text style={styles.note}>{tr ? 'Ekrandaki fiyat bir referanstır; emir gerçekleşene kadar piyasa değişebilir.' : 'The screen price is a reference; the market can change before your order fills.'}</Text>
    </View>
  );
}

function Concept({ tr, styles }: { tr: boolean; styles: Styles }) {
  const levels = ['100,00', '100,05', '100,10', '100,15'];
  return (
    <View style={styles.scene}>
      <Heading
        title={tr ? 'Kayma, beklenen fiyat ile gerçekleşen fiyat arasındaki farktır.' : 'Slippage is the difference between the expected and actual execution price.'}
        styles={styles}
      />
      <View style={styles.conceptRow}>
        <PriceCard
          label={tr ? 'BEKLENEN' : 'EXPECTED'}
          price="100,00"
          tone="reference"
          accessibilityLabel="slippage-concept-expected"
          styles={styles}
        />
        <View style={styles.depthCard} accessibilityLabel="slippage-concept-depth">
          <Text style={styles.cardEyebrow}>{tr ? 'MEVCUT FİYAT SEVİYELERİ' : 'AVAILABLE PRICE LEVELS'}</Text>
          <View style={styles.depthStack}>
            {levels.map((level, index) => (
              <View key={level} style={styles.depthRow}>
                <Text style={styles.depthPrice}>{level}</Text>
                <View style={styles.depthTrack}>
                  <View style={[styles.depthFill, { width: `${88 - index * 18}%` }]} />
                </View>
              </View>
            ))}
          </View>
        </View>
        <PriceCard
          label={tr ? 'GERÇEKLEŞEN' : 'ACTUAL'}
          price="100,15"
          tone="actual"
          accessibilityLabel="slippage-concept-actual"
          styles={styles}
        />
      </View>
      <View style={styles.deltaPill}><Text style={styles.deltaText}>{tr ? 'KAYMA = +0,15' : 'SLIPPAGE = +0.15'}</Text></View>
    </View>
  );
}

function Practice({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.scene}>
      <Heading
        title={tr ? 'Basit örnek: ekranda 100,00 görüyorsun, işlem 100,15 oluyor.' : 'Simple example: you see 100.00, but the trade fills at 100.15.'}
        styles={styles}
      />
      <View style={styles.practiceRow}>
        <PriceCard
          label={tr ? 'GÖRDÜĞÜN' : 'YOU SAW'}
          price="100,00"
          tone="reference"
          accessibilityLabel="slippage-practice-expected"
          styles={styles}
        />
        <View style={styles.deltaCenter} accessibilityLabel="slippage-practice-delta">
          <Text style={styles.deltaArrow}>→</Text>
          <Text style={styles.deltaLarge}>+0,15</Text>
          <Text style={styles.micro}>{tr ? 'fiyat farkı' : 'price difference'}</Text>
        </View>
        <PriceCard
          label={tr ? 'ALDIĞIN' : 'YOU GOT'}
          price="100,15"
          tone="actual"
          accessibilityLabel="slippage-practice-actual"
          styles={styles}
        />
      </View>
      <Text style={styles.note}>{tr ? 'Fark küçük olabilir; hızlı veya sığ piyasada büyüyebilir.' : 'The difference may be small; it can grow in a fast or thin market.'}</Text>
    </View>
  );
}

function Misconception({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.scene}>
      <Heading
        title={tr ? '“Butona bastığım anda 100,00 kilitlendi” doğru değildir.' : '“The moment I clicked, 100.00 was locked in” is not correct.'}
        styles={styles}
      />
      <View style={styles.twoPanel}>
        <View style={styles.snapshotPanel} accessibilityLabel="slippage-misconception-screen">
          <Text style={styles.cardEyebrow}>{tr ? 'FİYAT GÖRÜNTÜSÜ' : 'PRICE SNAPSHOT'}</Text>
          <Text style={styles.snapshotPrice}>100,00</Text>
          <Text style={styles.micro}>{tr ? 'Geçmişte gerçekleşmiş son işlem' : 'The latest completed trade'}</Text>
        </View>
        <View style={styles.marketPanel} accessibilityLabel="slippage-misconception-market">
          <Text style={styles.cardEyebrow}>{tr ? 'EMİR GERÇEKLEŞİRKEN' : 'WHILE YOUR ORDER EXECUTES'}</Text>
          <View style={styles.movingLevels}>
            <View style={styles.levelChip}><Text style={styles.levelText}>100,05</Text></View>
            <View style={styles.levelChip}><Text style={styles.levelText}>100,10</Text></View>
            <View style={[styles.levelChip, styles.levelChipActive]}><Text style={styles.levelText}>100,15</Text></View>
          </View>
          <Text style={styles.micro}>{tr ? 'Fiyat ve mevcut likidite değişebilir' : 'Price and available liquidity can change'}</Text>
        </View>
      </View>
    </View>
  );
}

function Summary({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.scene}>
      <Heading title={tr ? 'Kaymayı tek bakışta hatırla' : 'Remember slippage at a glance'} styles={styles} />
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem} accessibilityLabel="slippage-summary-reference">
          <Text style={styles.summaryLabel}>{tr ? 'REFERANS' : 'REFERENCE'}</Text>
          <Text style={styles.summaryPrice}>100,00</Text>
        </View>
        <Text style={styles.summaryArrow}>→</Text>
        <View style={styles.summaryProcess} accessibilityLabel="slippage-summary-process">
          <View style={styles.summaryProcessLine} />
          <View style={styles.summaryProcessDot} />
          <Text style={styles.micro}>{tr ? 'emir + likidite + hareket' : 'order + liquidity + movement'}</Text>
        </View>
        <Text style={styles.summaryArrow}>→</Text>
        <View style={[styles.summaryItem, styles.summaryItemActual]} accessibilityLabel="slippage-summary-actual">
          <Text style={styles.summaryLabel}>{tr ? 'GERÇEKLEŞEN' : 'ACTUAL'}</Text>
          <Text style={styles.summaryPrice}>100,15</Text>
        </View>
      </View>
      <View style={styles.rule}><Text style={styles.ruleText}>{tr ? 'Görülen fiyat gerçekleşme garantisi değildir.' : 'The displayed price is not an execution guarantee.'}</Text></View>
    </View>
  );
}

const createStyles = (theme: LearningTheme, wide: boolean, narrow: boolean) => StyleSheet.create({
  shell: {
    width: '100%',
    minHeight: wide ? 300 : narrow ? 238 : 256,
    justifyContent: 'center',
    padding: wide ? 20 : narrow ? 12 : 14,
    borderRadius: wide ? 18 : 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#081726',
    overflow: 'hidden',
  },
  scene: { width: '100%', gap: wide ? 17 : narrow ? 10 : 12 },
  heading: { gap: 5 },
  title: { color: theme.colors.text, fontSize: wide ? 20 : narrow ? 15 : 17, lineHeight: wide ? 28 : narrow ? 21 : 24, fontWeight: '900' },
  body: { color: theme.colors.textMuted, fontSize: wide ? 12 : 10, lineHeight: 15 },
  flowRow: { flexDirection: 'row', alignItems: 'center', gap: narrow ? 6 : 8 },
  priceCard: {
    flex: 1,
    minWidth: 0,
    minHeight: wide ? 130 : narrow ? 94 : 106,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: narrow ? 7 : 9,
    borderRadius: 13,
    borderWidth: 1,
  },
  referenceCard: { borderColor: '#486275', backgroundColor: '#102331' },
  actualCard: { borderColor: '#2F8278', backgroundColor: '#0D3034' },
  cardEyebrow: { color: theme.colors.textMuted, fontSize: narrow ? 7 : 8, fontWeight: '900', letterSpacing: 0.45, textAlign: 'center' },
  price: { fontSize: wide ? 24 : narrow ? 17 : 20, lineHeight: wide ? 30 : narrow ? 22 : 26, fontWeight: '900' },
  referencePrice: { color: '#C4D3DA' },
  actualPrice: { color: '#80D0C4' },
  executionBridge: { width: wide ? 180 : narrow ? 82 : 100, minWidth: 0, alignItems: 'center', gap: 5 },
  bridgeLine: { width: '88%', height: 2, borderRadius: 2, backgroundColor: '#496677' },
  bridgeNodes: { marginTop: -11, width: '88%', flexDirection: 'row', justifyContent: 'space-between' },
  bridgeNode: { width: 8, height: 8, borderRadius: 4, borderWidth: 2, borderColor: '#698494', backgroundColor: '#081726' },
  bridgeNodeActive: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#59B5A8' },
  bridgeText: { color: theme.colors.textMuted, fontSize: narrow ? 7 : 8, lineHeight: narrow ? 10 : 12, textAlign: 'center' },
  note: { color: theme.colors.textMuted, fontSize: wide ? 11 : narrow ? 9 : 10, lineHeight: wide ? 16 : narrow ? 13 : 14, textAlign: 'center' },
  conceptRow: { flexDirection: 'row', alignItems: 'stretch', gap: narrow ? 6 : 8 },
  depthCard: {
    flex: wide ? 1.4 : 1.2,
    minWidth: 0,
    minHeight: wide ? 148 : narrow ? 112 : 124,
    justifyContent: 'center',
    gap: 9,
    padding: narrow ? 8 : 10,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#3C5668',
    backgroundColor: '#0E2130',
  },
  depthStack: { gap: narrow ? 5 : 6 },
  depthRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  depthPrice: { width: narrow ? 34 : 42, color: '#AFC0C8', fontSize: narrow ? 7 : 8, fontWeight: '800' },
  depthTrack: { flex: 1, height: narrow ? 7 : 8, borderRadius: 4, backgroundColor: '#1A3445', overflow: 'hidden' },
  depthFill: { height: '100%', borderRadius: 4, backgroundColor: '#4C8E88' },
  deltaPill: { alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: '#3B8179', backgroundColor: '#0D3034' },
  deltaText: { color: '#9BD8D0', fontSize: narrow ? 9 : 10, fontWeight: '900', letterSpacing: 0.35 },
  practiceRow: { flexDirection: 'row', alignItems: 'center', gap: narrow ? 6 : 8 },
  deltaCenter: { width: wide ? 160 : narrow ? 76 : 92, alignItems: 'center', justifyContent: 'center', gap: 2 },
  deltaArrow: { color: '#71909F', fontSize: narrow ? 20 : 24, lineHeight: narrow ? 22 : 28, fontWeight: '900' },
  deltaLarge: { color: '#80D0C4', fontSize: wide ? 18 : narrow ? 12 : 14, fontWeight: '900' },
  micro: { color: theme.colors.textMuted, fontSize: narrow ? 7 : 8, lineHeight: narrow ? 10 : 12, textAlign: 'center' },
  twoPanel: { flexDirection: 'row', gap: narrow ? 7 : 9 },
  snapshotPanel: {
    flex: 1,
    minWidth: 0,
    minHeight: wide ? 148 : narrow ? 108 : 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    padding: narrow ? 8 : 10,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#506879',
    backgroundColor: '#102331',
  },
  snapshotPrice: { color: '#D2DEE3', fontSize: wide ? 25 : narrow ? 18 : 21, fontWeight: '900' },
  marketPanel: {
    flex: 1,
    minWidth: 0,
    minHeight: wide ? 148 : narrow ? 108 : 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: narrow ? 8 : 10,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#7B6553',
    backgroundColor: '#211D21',
  },
  movingLevels: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: narrow ? 4 : 6, flexWrap: 'wrap' },
  levelChip: { paddingHorizontal: narrow ? 5 : 7, paddingVertical: 5, borderRadius: 7, borderWidth: 1, borderColor: '#5D7180', backgroundColor: '#132735' },
  levelChipActive: { borderColor: '#438F85', backgroundColor: '#113438' },
  levelText: { color: '#C6D5DB', fontSize: narrow ? 7 : 8, fontWeight: '900' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: narrow ? 5 : 8 },
  summaryItem: { flex: 1, minWidth: 0, minHeight: wide ? 112 : narrow ? 80 : 92, alignItems: 'center', justifyContent: 'center', gap: 5, padding: narrow ? 7 : 9, borderRadius: 12, borderWidth: 1, borderColor: '#506879', backgroundColor: '#102331' },
  summaryItemActual: { borderColor: '#39867D', backgroundColor: '#0D3034' },
  summaryLabel: { color: theme.colors.textMuted, fontSize: narrow ? 7 : 8, fontWeight: '900', letterSpacing: 0.4 },
  summaryPrice: { color: theme.colors.text, fontSize: wide ? 18 : narrow ? 13 : 15, fontWeight: '900' },
  summaryArrow: { color: '#668392', fontSize: narrow ? 16 : 20, fontWeight: '900' },
  summaryProcess: { width: wide ? 170 : narrow ? 76 : 92, alignItems: 'center', justifyContent: 'center', gap: 5 },
  summaryProcessLine: { width: '86%', height: 2, borderRadius: 1, backgroundColor: '#496677' },
  summaryProcessDot: { marginTop: -10, width: 9, height: 9, borderRadius: 5, backgroundColor: '#59B5A8' },
  rule: { padding: narrow ? 8 : 10, borderRadius: 10, borderWidth: 1, borderColor: '#2C766E', backgroundColor: '#0D2D31' },
  ruleText: { color: '#D6E9E6', fontSize: wide ? 11 : narrow ? 9 : 10, lineHeight: wide ? 16 : narrow ? 13 : 14, textAlign: 'center', fontWeight: '800' },
});
