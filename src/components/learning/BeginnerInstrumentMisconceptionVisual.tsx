import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface BeginnerInstrumentMisconceptionVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function BeginnerInstrumentMisconceptionVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: BeginnerInstrumentMisconceptionVisualProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const narrow = width < 420;
  const styles = createStyles(theme, wide, narrow);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <Text style={styles.title}>
        {tr ? 'Grafik benzerliği, ürünlerin aynı olduğu anlamına gelmez.' : 'Similar charts do not mean the products are the same.'}
      </Text>

      <View style={styles.compareRow}>
        <ProductChart
          styles={styles}
          label={tr ? 'HİSSE' : 'STOCK'}
          meaning={tr ? 'Şirkette ortaklık' : 'Company ownership'}
          kind="stock"
        />
        <View style={styles.notEqual}><Text style={styles.notEqualText}>≠</Text></View>
        <ProductChart
          styles={styles}
          label={tr ? 'ALTIN' : 'GOLD'}
          meaning={tr ? 'Emtia maruziyeti' : 'Commodity exposure'}
          kind="gold"
        />
      </View>

      <View style={styles.rule}>
        <Text style={styles.ruleText}>
          {tr ? 'Önce ürünün ne olduğunu bil; sonra grafiğini yorumla.' : 'Know what the product is first; then interpret its chart.'}
        </Text>
      </View>
    </View>
  );
}

function ProductChart({
  styles,
  label,
  meaning,
  kind,
}: {
  styles: ReturnType<typeof createStyles>;
  label: string;
  meaning: string;
  kind: 'stock' | 'gold';
}) {
  const bars = [18, 29, 22, 36, 27, 39];
  return (
    <View style={styles.card} accessibilityLabel={`instrument-misconception-${kind}`}>
      <View style={styles.chart}>
        {bars.map((height, index) => (
          <View key={index} style={[styles.bar, { height }]} />
        ))}
      </View>
      <View style={styles.identityRow}>
        {kind === 'stock' ? <CompanyIcon styles={styles} /> : <GoldIcon styles={styles} />}
        <View style={styles.copy}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.meaning}>{meaning}</Text>
        </View>
      </View>
    </View>
  );
}

function CompanyIcon({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.companyIcon}>
      <View style={styles.companyRoof} />
      <View style={styles.companyBody}>
        <View style={styles.windowRow}><View style={styles.window} /><View style={styles.window} /></View>
        <View style={styles.windowRow}><View style={styles.window} /><View style={styles.window} /></View>
      </View>
    </View>
  );
}

function GoldIcon({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.goldIcon}>
      <View style={styles.goldBar} />
      <View style={[styles.goldBar, styles.goldBarShift]} />
    </View>
  );
}

const createStyles = (theme: LearningTheme, wide: boolean, narrow: boolean) => StyleSheet.create({
  shell: {
    width: '100%',
    minHeight: wide ? 300 : narrow ? 230 : 250,
    justifyContent: 'center',
    gap: wide ? 18 : narrow ? 11 : 13,
    padding: wide ? 20 : narrow ? 12 : 14,
    overflow: 'hidden',
    borderRadius: wide ? 18 : 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#081726',
  },
  title: {
    color: theme.colors.text,
    fontSize: wide ? 20 : narrow ? 15 : 16,
    lineHeight: wide ? 28 : narrow ? 21 : 23,
    fontWeight: '900',
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: narrow ? 6 : 9,
  },
  card: {
    flex: 1,
    minWidth: 0,
    minHeight: wide ? 168 : narrow ? 128 : 140,
    justifyContent: 'center',
    gap: narrow ? 8 : 10,
    padding: narrow ? 8 : 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2D485D',
    backgroundColor: '#0E2131',
  },
  chart: {
    height: wide ? 60 : narrow ? 43 : 48,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: narrow ? 3 : 4,
    paddingHorizontal: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#294253',
  },
  bar: {
    width: wide ? 8 : narrow ? 5 : 6,
    maxHeight: '100%',
    borderRadius: 2,
    backgroundColor: '#4A9D94',
  },
  identityRow: {
    minWidth: 0,
    flexDirection: narrow ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: narrow ? 5 : 8,
  },
  copy: {
    minWidth: 0,
    flexShrink: 1,
    alignItems: narrow ? 'center' : 'flex-start',
    gap: 2,
  },
  label: {
    color: theme.colors.text,
    fontSize: wide ? 11 : narrow ? 9 : 10,
    lineHeight: 14,
    fontWeight: '900',
  },
  meaning: {
    color: theme.colors.textMuted,
    fontSize: wide ? 10 : narrow ? 8 : 9,
    lineHeight: wide ? 14 : 12,
    textAlign: narrow ? 'center' : 'left',
  },
  notEqual: {
    width: narrow ? 20 : 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notEqualText: {
    color: theme.colors.primary,
    fontSize: narrow ? 19 : 24,
    fontWeight: '900',
  },
  rule: {
    paddingHorizontal: wide ? 16 : 11,
    paddingVertical: wide ? 11 : 9,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#2C706B',
    backgroundColor: '#0D3034',
  },
  ruleText: {
    color: '#D7ECE8',
    fontSize: wide ? 12 : narrow ? 10 : 11,
    lineHeight: wide ? 18 : narrow ? 14 : 16,
    textAlign: 'center',
    fontWeight: '700',
  },
  companyIcon: { width: narrow ? 34 : 40, height: narrow ? 34 : 40, alignItems: 'center', justifyContent: 'center' },
  companyRoof: { width: 0, height: 0, borderLeftWidth: narrow ? 13 : 16, borderRightWidth: narrow ? 13 : 16, borderBottomWidth: narrow ? 8 : 10, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#7894A6' },
  companyBody: { width: narrow ? 25 : 30, height: narrow ? 18 : 22, padding: 4, gap: 2, backgroundColor: '#405E72' },
  windowRow: { flexDirection: 'row', justifyContent: 'space-between' },
  window: { width: narrow ? 5 : 6, height: 4, borderRadius: 1, backgroundColor: '#B5CBD4' },
  goldIcon: { width: narrow ? 34 : 40, height: narrow ? 34 : 40, alignItems: 'center', justifyContent: 'center' },
  goldBar: { width: narrow ? 30 : 35, height: narrow ? 10 : 12, borderRadius: 3, backgroundColor: '#9D7738', transform: [{ skewX: '-12deg' }] },
  goldBarShift: { marginTop: -2, marginLeft: 4, backgroundColor: '#B58A42' },
});
