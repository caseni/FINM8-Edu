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
  alt: _alt,
  language,
  theme = defaultLearningTheme,
}: VolatilityRangeVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';
  const visualDescription = tr
    ? 'Aynı süre içinde dar ve geniş fiyat hareket aralıklarını karşılaştıran ve volatilitenin yönü değil hareket büyüklüğünü anlattığını gösteren sade eğitim görseli'
    : 'Simple learning visual comparing narrow and wide price movement ranges over the same period and showing that volatility describes movement size rather than direction';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={visualDescription}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Volatilite: fiyat ne kadar hareketli?' : 'Volatility: how much does price move?'}
          </Text>
          <Text style={styles.subtitle}>
            {tr
              ? 'Aynı sürede fiyat dar veya geniş bir aralıkta hareket edebilir.'
              : 'Over the same period, price can move within a narrow or wide range.'}
          </Text>
        </View>

        <View style={styles.comparison}>
          <MovementCard
            styles={styles}
            tone="narrow"
            title={tr ? 'DAR HAREKET' : 'NARROW MOVE'}
            note={tr ? 'Fiyat daha küçük bir aralıkta kalıyor' : 'Price stays within a smaller range'}
          />
          <MovementCard
            styles={styles}
            tone="wide"
            title={tr ? 'GENİŞ HAREKET' : 'WIDE MOVE'}
            note={tr ? 'Fiyat daha büyük bir aralıkta dolaşıyor' : 'Price moves through a larger range'}
          />
        </View>

        <View style={styles.takeaway}>
          <Text style={styles.takeawayMark}>↕</Text>
          <Text style={styles.takeawayText}>
            {tr
              ? 'Volatilite hareketin büyüklüğünü anlatır; yönü söylemez.'
              : 'Volatility describes the size of movement; it does not tell direction.'}
          </Text>
        </View>
      </View>
    </View>
  );
}

function MovementCard({
  styles,
  tone,
  title,
  note,
}: {
  styles: ReturnType<typeof createStyles>;
  tone: 'narrow' | 'wide';
  title: string;
  note: string;
}) {
  const wide = tone === 'wide';

  return (
    <View style={[styles.movementCard, wide ? styles.wideCard : styles.narrowCard]}>
      <Text style={[styles.cardTitle, wide ? styles.wideText : styles.narrowText]}>{title}</Text>

      <View style={styles.rangeFrame}>
        <View style={styles.centerLine} />
        <View
          style={[
            styles.rangeBand,
            wide ? styles.wideBand : styles.narrowBand,
            wide ? styles.wideRange : styles.narrowRange,
          ]}
        >
          <View style={[styles.rangeDot, wide ? styles.wideDot : styles.narrowDot]} />
        </View>
      </View>

      <Text style={styles.cardNote}>{note}</Text>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      minHeight: 320,
      overflow: 'hidden',
      borderRadius: theme.radius.large,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    canvas: {
      flex: 1,
      justifyContent: 'center',
      padding: theme.spacing.md,
      gap: 14,
    },
    header: {
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
    },
    title: {
      color: theme.colors.text,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '900',
      textAlign: 'center',
    },
    subtitle: {
      color: theme.colors.textMuted,
      fontSize: 12,
      lineHeight: 17,
      fontWeight: '700',
      textAlign: 'center',
    },
    comparison: {
      flexDirection: 'row',
      gap: 10,
    },
    movementCard: {
      flex: 1,
      gap: 10,
      padding: 12,
      borderRadius: 13,
      borderWidth: 1,
      backgroundColor: theme.colors.surfaceMuted,
    },
    narrowCard: {
      borderColor: 'rgba(45,212,191,0.24)',
    },
    wideCard: {
      borderColor: 'rgba(251,191,36,0.24)',
    },
    cardTitle: {
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '900',
      letterSpacing: 0.6,
      textAlign: 'center',
    },
    narrowText: {
      color: theme.colors.primary,
    },
    wideText: {
      color: theme.colors.warning,
    },
    rangeFrame: {
      height: 92,
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: 10,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    centerLine: {
      position: 'absolute',
      left: 12,
      right: 12,
      top: '50%',
      height: 1,
      backgroundColor: theme.colors.border,
    },
    rangeBand: {
      width: 34,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 17,
      borderWidth: 1,
    },
    narrowRange: {
      height: 34,
    },
    wideRange: {
      height: 72,
    },
    narrowBand: {
      backgroundColor: 'rgba(45,212,191,0.10)',
      borderColor: 'rgba(45,212,191,0.28)',
    },
    wideBand: {
      backgroundColor: 'rgba(251,191,36,0.09)',
      borderColor: 'rgba(251,191,36,0.28)',
    },
    rangeDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    narrowDot: {
      backgroundColor: theme.colors.primary,
    },
    wideDot: {
      backgroundColor: theme.colors.warning,
    },
    cardNote: {
      color: theme.colors.text,
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '800',
      textAlign: 'center',
    },
    takeaway: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 11,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(159,176,195,0.18)',
      backgroundColor: 'rgba(159,176,195,0.04)',
    },
    takeawayMark: {
      width: 24,
      color: theme.colors.textMuted,
      fontSize: 21,
      lineHeight: 25,
      fontWeight: '900',
      textAlign: 'center',
    },
    takeawayText: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '800',
    },
  });
