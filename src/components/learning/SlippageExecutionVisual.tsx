import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface SlippageExecutionVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function SlippageExecutionVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: SlippageExecutionVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Gördüğün fiyat, işlem fiyatı olmayabilir' : 'The price you see may not be your execution price'}
          </Text>
          <Text style={styles.subtitle}>
            {tr ? 'Ekrandaki fiyat bir referanstır; piyasa değişebilir.' : 'The displayed price is a reference; the market can change.'}
          </Text>
        </View>

        <View style={styles.flowRow}>
          <View style={styles.priceCard}>
            <Text style={styles.cardEyebrow}>{tr ? 'EKRANDA GÖRDÜN' : 'YOU SAW'}</Text>
            <Text style={styles.price}>100</Text>
          </View>

          <Text style={styles.arrow}>→</Text>

          <View style={[styles.priceCard, styles.executionCard]}>
            <Text style={styles.executionEyebrow}>{tr ? 'İŞLEM GERÇEKLEŞTİ' : 'TRADE EXECUTED'}</Text>
            <Text style={styles.price}>100,3</Text>
          </View>
        </View>

        <View style={styles.coreCard}>
          <Text style={styles.coreEyebrow}>{tr ? 'ARADAKİ FARK' : 'THE DIFFERENCE'}</Text>
          <Text style={styles.coreValue}>0,3</Text>
          <Text style={styles.coreText}>
            {tr ? 'Bu farka fiyat kayması (slippage) denir.' : 'This difference is called slippage.'}
          </Text>
        </View>

        <View style={styles.boundary}>
          <Text style={styles.boundaryText}>
            {tr
              ? 'Kayma her işlemde olmak zorunda değildir; önemli olan ekrandaki fiyatın garanti olmadığını bilmektir.'
              : 'Slippage does not have to happen on every trade; the key point is that the displayed price is not guaranteed.'}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
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
      gap: 13,
    },
    header: { alignItems: 'center', gap: 4 },
    title: {
      color: theme.colors.text,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '900',
      textAlign: 'center',
    },
    subtitle: {
      color: theme.colors.textMuted,
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '700',
      textAlign: 'center',
    },
    flowRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
    },
    priceCard: {
      flex: 1,
      minHeight: 98,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      padding: 12,
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    executionCard: {
      backgroundColor: 'rgba(250,204,21,0.05)',
      borderColor: 'rgba(250,204,21,0.25)',
    },
    cardEyebrow: {
      color: theme.colors.textMuted,
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.55,
      textAlign: 'center',
    },
    executionEyebrow: {
      color: theme.colors.warning,
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.55,
      textAlign: 'center',
    },
    price: {
      color: theme.colors.text,
      fontSize: 27,
      lineHeight: 31,
      fontWeight: '900',
    },
    arrow: {
      color: theme.colors.primary,
      fontSize: 20,
      fontWeight: '900',
    },
    coreCard: {
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 11,
      backgroundColor: 'rgba(45,212,191,0.06)',
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.22)',
    },
    coreEyebrow: {
      color: theme.colors.primary,
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.55,
    },
    coreValue: {
      color: theme.colors.text,
      fontSize: 20,
      lineHeight: 24,
      fontWeight: '900',
    },
    coreText: {
      color: theme.colors.text,
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '800',
      textAlign: 'center',
    },
    boundary: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: 'rgba(159,176,195,0.04)',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    boundaryText: {
      color: theme.colors.textMuted,
      fontSize: 10,
      lineHeight: 15,
      fontWeight: '700',
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
