import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface CandleAnatomyVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function CandleAnatomyVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: CandleAnatomyVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>{tr ? 'Bir mum = dört fiyat' : 'One candle = four prices'}</Text>
          <Text style={styles.subtitle}>
            {tr ? 'Seçilen dönemin OHLC kaydı' : 'OHLC record for the selected period'}
          </Text>
        </View>

        <View style={styles.chartCard}>
          <PriceLevel
            styles={styles}
            label={tr ? 'EN YÜKSEK' : 'HIGH'}
            price="108"
            tone="high"
          />
          <PriceLevel
            styles={styles}
            label={tr ? 'KAPANIŞ' : 'CLOSE'}
            price="105"
            tone="close"
          />
          <PriceLevel
            styles={styles}
            label={tr ? 'AÇILIŞ' : 'OPEN'}
            price="101"
            tone="open"
          />
          <PriceLevel
            styles={styles}
            label={tr ? 'EN DÜŞÜK' : 'LOW'}
            price="98"
            tone="low"
          />

          <View style={styles.candleStage} pointerEvents="none">
            <View style={styles.upperWick} />
            <View style={styles.body} />
            <View style={styles.lowerWick} />
            <View style={styles.highDot} />
            <View style={styles.lowDot} />
          </View>
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendCard}>
            <View style={styles.bodySwatch} />
            <View style={styles.legendCopy}>
              <Text style={styles.legendTitle}>{tr ? 'GÖVDE' : 'BODY'}</Text>
              <Text style={styles.legendText}>
                {tr ? 'Açılış ↔ kapanış' : 'Open ↔ close'}
              </Text>
            </View>
          </View>
          <View style={styles.legendCard}>
            <View style={styles.wickSwatch} />
            <View style={styles.legendCopy}>
              <Text style={styles.legendTitle}>{tr ? 'FİTİLLER' : 'WICKS'}</Text>
              <Text style={styles.legendText}>
                {tr ? 'Dönem içi uçlar' : 'Period extremes'}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.boundary}>
          {tr
            ? 'Mum seçilen dönemi kaydeder; sonraki hareketi garanti etmez.'
            : 'A candle records the selected period; it does not guarantee the next move.'}
        </Text>
      </View>
      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function PriceLevel({
  styles,
  label,
  price,
  tone,
}: {
  styles: ReturnType<typeof createStyles>;
  label: string;
  price: string;
  tone: 'high' | 'close' | 'open' | 'low';
}) {
  const toneStyle =
    tone === 'high'
      ? styles.levelHigh
      : tone === 'close'
        ? styles.levelClose
        : tone === 'open'
          ? styles.levelOpen
          : styles.levelLow;

  return (
    <View style={styles.levelRow}>
      <View style={styles.levelCopy}>
        <Text style={[styles.levelLabel, toneStyle]}>{label}</Text>
        <Text style={styles.levelPrice}>{price}</Text>
      </View>
      <View style={[styles.levelLine, toneStyle]} />
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      minHeight: 300,
      overflow: 'hidden',
      borderRadius: theme.radius.large,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    canvas: {
      minHeight: 252,
      padding: theme.spacing.md,
      justifyContent: 'center',
      gap: 9,
    },
    header: { alignItems: 'center', gap: 3 },
    title: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: '900',
      textAlign: 'center',
    },
    subtitle: {
      color: theme.colors.textMuted,
      fontSize: 10,
      fontWeight: '700',
      textAlign: 'center',
    },
    chartCard: {
      minHeight: 132,
      position: 'relative',
      justifyContent: 'space-between',
      paddingVertical: 9,
      paddingHorizontal: 8,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    levelRow: {
      minHeight: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      zIndex: 2,
    },
    levelCopy: {
      width: 83,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 5,
    },
    levelLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 0.45 },
    levelPrice: { color: theme.colors.text, fontSize: 10, fontWeight: '900' },
    levelLine: { flex: 1, borderTopWidth: 1 },
    levelHigh: { color: theme.colors.warning, borderColor: 'rgba(251,191,36,0.40)' },
    levelClose: { color: theme.colors.success, borderColor: 'rgba(52,211,153,0.34)' },
    levelOpen: { color: theme.colors.primary, borderColor: 'rgba(45,212,191,0.32)' },
    levelLow: { color: theme.colors.warning, borderColor: 'rgba(251,191,36,0.40)' },
    candleStage: {
      position: 'absolute',
      top: 12,
      bottom: 12,
      left: '68%',
      width: 42,
      alignItems: 'center',
    },
    upperWick: {
      position: 'absolute',
      top: 0,
      width: 2,
      height: 34,
      borderRadius: 1,
      backgroundColor: 'rgba(159,176,195,0.78)',
    },
    body: {
      position: 'absolute',
      top: 34,
      width: 24,
      height: 44,
      borderRadius: 4,
      backgroundColor: 'rgba(52,211,153,0.64)',
      borderWidth: 1,
      borderColor: 'rgba(94,234,212,0.78)',
    },
    lowerWick: {
      position: 'absolute',
      top: 78,
      width: 2,
      height: 34,
      borderRadius: 1,
      backgroundColor: 'rgba(159,176,195,0.78)',
    },
    highDot: {
      position: 'absolute',
      top: -2,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.warning,
    },
    lowDot: {
      position: 'absolute',
      bottom: -2,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.warning,
    },
    legendRow: { flexDirection: 'row', gap: 8 },
    legendCard: {
      flex: 1,
      minHeight: 42,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 9,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    bodySwatch: {
      width: 13,
      height: 24,
      borderRadius: 3,
      backgroundColor: 'rgba(52,211,153,0.58)',
      borderWidth: 1,
      borderColor: 'rgba(94,234,212,0.70)',
    },
    wickSwatch: {
      width: 2,
      height: 28,
      marginHorizontal: 6,
      borderRadius: 1,
      backgroundColor: 'rgba(159,176,195,0.76)',
    },
    legendCopy: { flex: 1, gap: 1 },
    legendTitle: { color: theme.colors.text, fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
    legendText: { color: theme.colors.textMuted, fontSize: 9, fontWeight: '700' },
    boundary: {
      color: theme.colors.textMuted,
      fontSize: 9,
      lineHeight: 13,
      textAlign: 'center',
    },
    footer: {
      minHeight: 44,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    alt: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 15 },
  });
