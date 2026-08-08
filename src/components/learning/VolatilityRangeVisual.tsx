import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface VolatilityRangeVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function VolatilityRangeVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: VolatilityRangeVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Volatilite = hareket genişliği' : 'Volatility = movement range'}
          </Text>
          <Text style={styles.subtitle}>
            {tr
              ? 'Aynı başlangıç noktası · aynı pozisyon büyüklüğü'
              : 'Same starting point · same position size'}
          </Text>
        </View>

        <View style={styles.comparison}>
          <RangeCard
            styles={styles}
            tone="low"
            title={tr ? 'DAHA DÜŞÜK VOLATİLİTE' : 'LOWER VOLATILITY'}
            range="98 — 102"
            movement={tr ? 'Dar hareket aralığı' : 'Narrow movement range'}
            bars={[32, 46, 39, 51, 43]}
          />
          <RangeCard
            styles={styles}
            tone="high"
            title={tr ? 'DAHA YÜKSEK VOLATİLİTE' : 'HIGHER VOLATILITY'}
            range="92 — 108"
            movement={tr ? 'Geniş hareket aralığı' : 'Wide movement range'}
            bars={[18, 76, 31, 88, 24]}
          />
        </View>

        <View style={styles.startRow}>
          <View style={styles.startDot} />
          <Text style={styles.startText}>
            {tr ? 'İkisi de 100’den başladı' : 'Both started at 100'}
          </Text>
        </View>

        <View style={styles.impactCard}>
          <Text style={styles.impactEyebrow}>{tr ? 'AYNI POZİSYON' : 'SAME POSITION'}</Text>
          <View style={styles.impactRow}>
            <View style={styles.impactItem}>
              <Text style={styles.impactSmall}>↕</Text>
              <Text style={styles.impactText}>{tr ? 'Dar fiyat hareketi' : 'Narrow price movement'}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.impactResult}>{tr ? 'Daha küçük parasal dalgalanma' : 'Smaller cash fluctuation'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.impactRow}>
            <View style={styles.impactItem}>
              <Text style={styles.impactLarge}>↕</Text>
              <Text style={styles.impactText}>{tr ? 'Geniş fiyat hareketi' : 'Wide price movement'}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.impactResult}>{tr ? 'Daha büyük parasal dalgalanma' : 'Larger cash fluctuation'}</Text>
          </View>
        </View>

        <View style={styles.directionCard}>
          <Text style={styles.directionMark}>↕</Text>
          <View style={styles.directionCopy}>
            <Text style={styles.directionTitle}>{tr ? 'Yön söylemez' : 'It does not tell direction'}</Text>
            <Text style={styles.directionText}>
              {tr
                ? 'Yüksek volatilite hem yukarı hem aşağı daha geniş hareket anlamına gelebilir.'
                : 'High volatility can mean wider movement both upward and downward.'}
            </Text>
          </View>
        </View>

        <Text style={styles.exampleNote}>{tr ? 'Rakamlar yalnız örnektir.' : 'Numbers are illustrative only.'}</Text>
      </View>
      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function RangeCard({
  styles,
  tone,
  title,
  range,
  movement,
  bars,
}: {
  styles: ReturnType<typeof createStyles>;
  tone: 'low' | 'high';
  title: string;
  range: string;
  movement: string;
  bars: readonly number[];
}) {
  const high = tone === 'high';
  return (
    <View style={[styles.rangeCard, high ? styles.highCard : styles.lowCard]}>
      <Text style={[styles.rangeTitle, high ? styles.highText : styles.lowText]}>{title}</Text>
      <Text style={styles.rangeNumber}>{range}</Text>
      <View style={styles.rangeChart}>
        <View style={styles.midLine} />
        {bars.map((height, index) => (
          <View key={`${tone}.${index}`} style={styles.barSlot}>
            <View
              style={[
                styles.rangeBar,
                high ? styles.highBar : styles.lowBar,
                { height },
              ]}
            />
          </View>
        ))}
      </View>
      <Text style={styles.rangeMovement}>{movement}</Text>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      minHeight: 420,
      overflow: 'hidden',
      borderRadius: theme.radius.large,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    canvas: { padding: theme.spacing.md, gap: 12 },
    header: { gap: 4, alignItems: 'center', paddingHorizontal: 4 },
    title: { color: theme.colors.text, fontSize: 16, lineHeight: 22, fontWeight: '900', textAlign: 'center' },
    subtitle: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
    comparison: { flexDirection: 'row', gap: 10 },
    rangeCard: { flex: 1, gap: 7, padding: 11, borderRadius: 12, borderWidth: 1, backgroundColor: theme.colors.surfaceMuted },
    lowCard: { borderColor: 'rgba(45,212,191,0.28)' },
    highCard: { borderColor: 'rgba(251,113,133,0.30)' },
    rangeTitle: { fontSize: 9, lineHeight: 13, fontWeight: '900', letterSpacing: 0.35 },
    lowText: { color: theme.colors.primary },
    highText: { color: theme.colors.risk },
    rangeNumber: { color: theme.colors.text, fontSize: 15, fontWeight: '900' },
    rangeChart: { height: 96, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 3, position: 'relative', overflow: 'hidden', borderRadius: 8, backgroundColor: theme.colors.background },
    midLine: { position: 'absolute', left: 0, right: 0, top: 47, height: 1, backgroundColor: theme.colors.border },
    barSlot: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' },
    rangeBar: { width: 9, minHeight: 12, borderRadius: 5 },
    lowBar: { backgroundColor: 'rgba(45,212,191,0.64)' },
    highBar: { backgroundColor: 'rgba(251,113,133,0.62)' },
    rangeMovement: { color: theme.colors.textMuted, fontSize: 10, lineHeight: 14, fontWeight: '700' },
    startRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7 },
    startDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: theme.colors.warning },
    startText: { color: theme.colors.textMuted, fontSize: 10, fontWeight: '800' },
    impactCard: { gap: 8, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
    impactEyebrow: { color: theme.colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    impactRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
    impactItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
    impactSmall: { width: 18, color: theme.colors.primary, fontSize: 15, fontWeight: '900' },
    impactLarge: { width: 18, color: theme.colors.risk, fontSize: 22, fontWeight: '900' },
    impactText: { flex: 1, color: theme.colors.text, fontSize: 10, lineHeight: 14, fontWeight: '800' },
    arrow: { color: theme.colors.textMuted, fontSize: 14, fontWeight: '900' },
    impactResult: { flex: 1.15, color: theme.colors.text, fontSize: 10, lineHeight: 14, fontWeight: '800' },
    divider: { height: 1, backgroundColor: theme.colors.border },
    directionCard: { flexDirection: 'row', gap: 10, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(251,191,36,0.23)', backgroundColor: 'rgba(251,191,36,0.05)' },
    directionMark: { width: 24, color: theme.colors.warning, fontSize: 22, lineHeight: 26, fontWeight: '900' },
    directionCopy: { flex: 1, gap: 2 },
    directionTitle: { color: theme.colors.text, fontSize: 11, lineHeight: 15, fontWeight: '900' },
    directionText: { color: theme.colors.textMuted, fontSize: 10, lineHeight: 15, fontWeight: '700' },
    exampleNote: { color: theme.colors.textMuted, fontSize: 9, textAlign: 'center' },
    footer: { minHeight: 44, justifyContent: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border },
    alt: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 15 },
  });
