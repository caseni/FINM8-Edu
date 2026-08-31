import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type InstrumentKind = 'stock' | 'bond' | 'fx' | 'commodity';

type Instrument = {
  kind: InstrumentKind;
  tr: string;
  en: string;
  trMeaning: string;
  enMeaning: string;
};

const INSTRUMENTS: readonly Instrument[] = [
  { kind: 'stock', tr: 'HİSSE', en: 'STOCK', trMeaning: 'Şirkete ortaklık', enMeaning: 'Company ownership' },
  { kind: 'bond', tr: 'TAHVİL', en: 'BOND', trMeaning: 'Kuruma borç', enMeaning: 'Lending to an issuer' },
  { kind: 'fx', tr: 'DÖVİZ', en: 'FX', trMeaning: 'İki paranın değeri', enMeaning: 'Value of two currencies' },
  { kind: 'commodity', tr: 'EMTİA', en: 'COMMODITY', trMeaning: 'Altın, petrol vb.', enMeaning: 'Gold, oil, etc.' },
] as const;

export interface BeginnerInstrumentStoryVisualProps {
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

export function BeginnerInstrumentStoryVisual({
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: BeginnerInstrumentStoryVisualProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const narrow = width < 380;
  const styles = createStyles(theme, wide, narrow);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {role === 'hook' ? (
        <HookScene tr={tr} styles={styles} />
      ) : role === 'practice' ? (
        <PracticeScene tr={tr} styles={styles} />
      ) : role === 'misconception' ? (
        <MisconceptionScene tr={tr} styles={styles} />
      ) : role === 'summary' ? (
        <SummaryScene tr={tr} styles={styles} />
      ) : (
        <ConceptScene tr={tr} styles={styles} />
      )}
    </View>
  );
}

function localized(item: Instrument, tr: boolean) {
  return {
    title: tr ? item.tr : item.en,
    meaning: tr ? item.trMeaning : item.enMeaning,
  };
}

function InstrumentIcon({ kind, styles }: { kind: InstrumentKind; styles: ReturnType<typeof createStyles> }) {
  if (kind === 'stock') {
    return (
      <View style={styles.iconBox}>
        <View style={styles.buildingRoof} />
        <View style={styles.buildingBody}>
          <View style={styles.windowRow}><View style={styles.window} /><View style={styles.window} /></View>
          <View style={styles.windowRow}><View style={styles.window} /><View style={styles.window} /></View>
        </View>
      </View>
    );
  }

  if (kind === 'bond') {
    return (
      <View style={styles.iconBox}>
        <View style={styles.paper}>
          <View style={styles.paperLine} />
          <View style={styles.paperLineShort} />
          <View style={styles.paperSeal} />
        </View>
      </View>
    );
  }

  if (kind === 'fx') {
    return (
      <View style={[styles.iconBox, styles.coinPair]}>
        <View style={styles.coin}><Text style={styles.coinText}>₺</Text></View>
        <View style={styles.coin}><Text style={styles.coinText}>$</Text></View>
      </View>
    );
  }

  return (
    <View style={styles.iconBox}>
      <View style={styles.goldBar} />
      <View style={[styles.goldBar, styles.goldBarShift]} />
    </View>
  );
}

function SceneHeading({
  title,
  body,
  styles,
}: {
  title: string;
  body?: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.heading}>
      <Text style={styles.headingTitle}>{title}</Text>
      {body ? <Text style={styles.headingBody}>{body}</Text> : null}
    </View>
  );
}

function HookScene({ tr, styles }: { tr: boolean; styles: ReturnType<typeof createStyles> }) {
  const stock = localized(INSTRUMENTS[0], tr);
  const commodity = localized(INSTRUMENTS[3], tr);
  return (
    <View style={styles.scene}>
      <View style={styles.compareRow}>
        <View style={styles.largeCard}>
          <InstrumentIcon kind="stock" styles={styles} />
          <Text style={styles.cardTitle}>{stock.title}</Text>
          <Text style={styles.cardMeaning}>{stock.meaning}</Text>
        </View>
        <View style={styles.notEqual}><Text style={styles.notEqualText}>≠</Text></View>
        <View style={styles.largeCard}>
          <InstrumentIcon kind="commodity" styles={styles} />
          <Text style={styles.cardTitle}>{commodity.title}</Text>
          <Text style={styles.cardMeaning}>{commodity.meaning}</Text>
        </View>
      </View>
    </View>
  );
}

function ConceptScene({ tr, styles }: { tr: boolean; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.scene}>
      <SceneHeading
        styles={styles}
        title={tr ? 'Her araç neyi temsil eder?' : 'What does each instrument represent?'}
      />
      <View style={styles.grid}>
        {INSTRUMENTS.map((item) => {
          const copy = localized(item, tr);
          return (
            <View key={item.kind} style={styles.instrumentCard}>
              <InstrumentIcon kind={item.kind} styles={styles} />
              <View style={styles.cardCopy}>
                <Text style={styles.cardTitle}>{copy.title}</Text>
                <Text style={styles.cardMeaning}>{copy.meaning}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function PracticeScene({ tr, styles }: { tr: boolean; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.scene}>
      <SceneHeading
        styles={styles}
        title={tr ? '“Şirkete ortak olmak” hangisi?' : 'Which one means owning part of a company?'}
        body={tr ? 'Tanımı ürün adıyla eşleştir.' : 'Match the meaning to the instrument.'}
      />
      <View style={styles.grid}>
        {INSTRUMENTS.map((item) => {
          const copy = localized(item, tr);
          const active = item.kind === 'stock';
          return (
            <View key={item.kind} style={[styles.instrumentCard, active && styles.activeCard]}>
              <InstrumentIcon kind={item.kind} styles={styles} />
              <View style={styles.cardCopy}>
                <Text style={styles.cardTitle}>{copy.title}</Text>
                <Text style={[styles.cardMeaning, active && styles.activeMeaning]}>
                  {active ? copy.meaning : '—'}
                </Text>
              </View>
              {active ? <View style={styles.answerPill}><Text style={styles.answerPillText}>✓</Text></View> : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

function MisconceptionScene({ tr, styles }: { tr: boolean; styles: ReturnType<typeof createStyles> }) {
  const bars = [18, 30, 22, 38, 29];
  return (
    <View style={styles.scene}>
      <SceneHeading
        styles={styles}
        title={tr ? 'Aynı grafik, aynı ürün demek değildir.' : 'A similar chart does not mean the same product.'}
      />
      <View style={styles.grid}>
        {INSTRUMENTS.map((item) => {
          const copy = localized(item, tr);
          return (
            <View key={item.kind} style={styles.chartCard}>
              <View style={styles.chartTopRow}>
                <InstrumentIcon kind={item.kind} styles={styles} />
                <Text style={styles.cardTitle}>{copy.title}</Text>
              </View>
              <View style={styles.miniChart}>
                {bars.map((height, index) => (
                  <View key={`${item.kind}-${index}`} style={[styles.chartBar, { height }]} />
                ))}
              </View>
              <Text numberOfLines={2} style={styles.chartMeaning}>{copy.meaning}</Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.footerHint}>{tr ? 'Grafikten önce ürünün ne olduğunu bil.' : 'Know what the product is before reading its chart.'}</Text>
    </View>
  );
}

function SummaryScene({ tr, styles }: { tr: boolean; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.scene}>
      <View style={styles.summaryRow}>
        {INSTRUMENTS.map((item) => {
          const copy = localized(item, tr);
          return (
            <View key={item.kind} style={styles.summaryItem}>
              <InstrumentIcon kind={item.kind} styles={styles} />
              <Text style={styles.summaryLabel}>{copy.title}</Text>
              <Text style={styles.summaryMeaning}>{copy.meaning}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (theme: LearningTheme, wide: boolean, narrow: boolean) => StyleSheet.create({
  shell: {
    width: '100%',
    minHeight: wide ? 310 : narrow ? 250 : 270,
    justifyContent: 'center',
    padding: wide ? 20 : narrow ? 12 : 14,
    overflow: 'hidden',
    borderRadius: wide ? 18 : 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#081726',
  },
  scene: { width: '100%', gap: wide ? 17 : narrow ? 11 : 13 },
  heading: { gap: 5 },
  headingTitle: {
    color: theme.colors.text,
    fontSize: wide ? 20 : narrow ? 15 : 17,
    lineHeight: wide ? 28 : narrow ? 21 : 24,
    fontWeight: '900',
  },
  headingBody: { color: theme.colors.textMuted, fontSize: wide ? 12 : 10, lineHeight: wide ? 18 : 15 },
  compareRow: { flexDirection: 'row', alignItems: 'stretch', gap: narrow ? 6 : 9 },
  largeCard: {
    flex: 1,
    minWidth: 0,
    minHeight: wide ? 178 : narrow ? 126 : 145,
    alignItems: 'center',
    justifyContent: 'center',
    gap: narrow ? 5 : 7,
    padding: narrow ? 8 : 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2D485D',
    backgroundColor: '#0E2131',
  },
  notEqual: { width: narrow ? 20 : 28, alignItems: 'center', justifyContent: 'center' },
  notEqualText: { color: theme.colors.primary, fontSize: narrow ? 19 : 24, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: narrow ? 7 : 9 },
  instrumentCard: {
    width: narrow ? '48.1%' : '48.4%',
    minHeight: wide ? 126 : narrow ? 94 : 106,
    position: 'relative',
    flexDirection: wide ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wide ? 11 : narrow ? 5 : 7,
    padding: wide ? 12 : narrow ? 7 : 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2D485D',
    backgroundColor: '#0E2131',
  },
  activeCard: { borderColor: '#2F8A7F', backgroundColor: '#0D3336' },
  activeMeaning: { color: '#CFEDE8' },
  cardCopy: { flexShrink: 1, minWidth: 0, alignItems: wide ? 'flex-start' : 'center', gap: 3 },
  cardTitle: { color: theme.colors.text, fontSize: wide ? 11 : narrow ? 9 : 10, lineHeight: wide ? 15 : 13, fontWeight: '900', textAlign: 'center' },
  cardMeaning: { color: theme.colors.textMuted, fontSize: wide ? 11 : narrow ? 9 : 10, lineHeight: wide ? 16 : narrow ? 13 : 14, textAlign: 'center' },
  answerPill: { position: 'absolute', right: 8, top: 8, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2D8A7E' },
  answerPillText: { color: '#F5FFFD', fontSize: 11, fontWeight: '900' },
  iconBox: { width: narrow ? 42 : 48, height: narrow ? 42 : 48, alignItems: 'center', justifyContent: 'center' },
  buildingRoof: { width: 0, height: 0, borderLeftWidth: narrow ? 18 : 21, borderRightWidth: narrow ? 18 : 21, borderBottomWidth: narrow ? 10 : 12, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#7695A8' },
  buildingBody: { width: narrow ? 32 : 38, height: narrow ? 25 : 29, padding: 5, gap: 3, backgroundColor: '#3E5C70' },
  windowRow: { flexDirection: 'row', justifyContent: 'space-between' },
  window: { width: narrow ? 6 : 7, height: 5, borderRadius: 1.5, backgroundColor: '#B5CBD4' },
  paper: { width: narrow ? 31 : 36, height: narrow ? 39 : 44, padding: narrow ? 7 : 8, gap: 5, borderRadius: 5, backgroundColor: '#D2DCE2' },
  paperLine: { height: 3, borderRadius: 2, backgroundColor: '#648095' },
  paperLineShort: { width: '64%', height: 3, borderRadius: 2, backgroundColor: '#8298A8' },
  paperSeal: { width: 9, height: 9, borderRadius: 5, alignSelf: 'flex-end', backgroundColor: '#4C817D' },
  coinPair: { flexDirection: 'row', gap: 3 },
  coin: { width: narrow ? 24 : 27, height: narrow ? 24 : 27, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#4C747D', backgroundColor: '#183943' },
  coinText: { color: '#E6EEF2', fontSize: narrow ? 11 : 12, fontWeight: '900' },
  goldBar: { width: narrow ? 38 : 43, height: narrow ? 13 : 15, borderRadius: 4, backgroundColor: '#9D7738', transform: [{ skewX: '-12deg' }] },
  goldBarShift: { marginTop: -3, marginLeft: 5, backgroundColor: '#B58A42' },
  footerHint: { color: theme.colors.textMuted, fontSize: wide ? 11 : 10, lineHeight: wide ? 16 : 14, textAlign: 'center' },
  chartCard: {
    width: narrow ? '48.1%' : '48.4%',
    minHeight: wide ? 138 : narrow ? 112 : 122,
    gap: narrow ? 7 : 9,
    padding: narrow ? 8 : 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2D485D',
    backgroundColor: '#0E2131',
  },
  chartTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  miniChart: { height: 40, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: narrow ? 3 : 4 },
  chartBar: { width: narrow ? 5 : 6, borderRadius: 2, backgroundColor: '#4AB7AA' },
  chartMeaning: { color: theme.colors.textMuted, fontSize: narrow ? 8 : 9, lineHeight: narrow ? 11 : 12, textAlign: 'center' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: narrow ? 4 : 7 },
  summaryItem: {
    flex: 1,
    minWidth: 0,
    minHeight: wide ? 128 : narrow ? 96 : 108,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: narrow ? 5 : 8,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#2D485D',
    backgroundColor: '#0E2131',
  },
  summaryLabel: { color: theme.colors.text, fontSize: wide ? 10 : narrow ? 8 : 9, fontWeight: '900', textAlign: 'center' },
  summaryMeaning: { color: theme.colors.textMuted, fontSize: wide ? 10 : narrow ? 8 : 9, lineHeight: wide ? 14 : narrow ? 11 : 13, textAlign: 'center' },
});
