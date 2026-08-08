import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface TimeframeContextVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function TimeframeContextVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: TimeframeContextVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Aynı piyasa, farklı görünüm' : 'Same market, different view'}
          </Text>
          <Text style={styles.subtitle}>
            {tr ? 'Zaman dilimi değişince baktığın ölçek değişir.' : 'Changing the timeframe changes the scale you see.'}
          </Text>
        </View>

        <View style={styles.cards}>
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.timeLabel}>{tr ? '15 DK' : '15 MIN'}</Text>
              <Text style={styles.moveDown}>↘</Text>
            </View>
            <Text style={styles.cardTitle}>{tr ? 'Kısa geri çekilme' : 'Short pullback'}</Text>
            <Text style={styles.cardText}>
              {tr ? 'Kısa görünümde fiyat düşüyor olabilir.' : 'Price may be falling in the short view.'}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.timeLabel}>{tr ? '1 GÜN' : '1 DAY'}</Text>
              <Text style={styles.moveUp}>↗</Text>
            </View>
            <Text style={styles.cardTitle}>{tr ? 'Daha geniş yapı' : 'Broader structure'}</Text>
            <Text style={styles.cardText}>
              {tr ? 'Daha geniş görünüm hâlâ yukarı yönlü olabilir.' : 'The broader view may still be upward.'}
            </Text>
          </View>
        </View>

        <View style={styles.coreCard}>
          <Text style={styles.coreEyebrow}>{tr ? 'AKLINDA KALSIN' : 'REMEMBER'}</Text>
          <Text style={styles.coreText}>
            {tr ? 'İkisi aynı anda doğru olabilir.' : 'Both can be true at the same time.'}
          </Text>
        </View>

        <Text style={styles.boundary}>
          {tr
            ? 'Bir zaman dilimindeki yorumu diğerine otomatik olarak kopyalama.'
            : 'Do not automatically copy a view from one timeframe to another.'}
        </Text>
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
      minHeight: 322,
      overflow: 'hidden',
      borderRadius: theme.radius.large,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    canvas: {
      padding: theme.spacing.md,
      gap: 12,
    },
    header: {
      alignItems: 'center',
      gap: 4,
    },
    title: {
      color: theme.colors.text,
      fontSize: 17,
      lineHeight: 23,
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
    cards: {
      gap: 9,
    },
    card: {
      minHeight: 82,
      gap: 4,
      padding: 12,
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    timeLabel: {
      color: theme.colors.primary,
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 0.55,
    },
    moveDown: {
      color: theme.colors.risk,
      fontSize: 20,
      lineHeight: 22,
      fontWeight: '900',
    },
    moveUp: {
      color: theme.colors.success,
      fontSize: 20,
      lineHeight: 22,
      fontWeight: '900',
    },
    cardTitle: {
      color: theme.colors.text,
      fontSize: 14,
      lineHeight: 19,
      fontWeight: '900',
    },
    cardText: {
      color: theme.colors.textMuted,
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '700',
    },
    coreCard: {
      gap: 3,
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderRadius: 10,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    coreEyebrow: {
      color: theme.colors.primary,
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.55,
    },
    coreText: {
      color: theme.colors.text,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '900',
    },
    boundary: {
      color: theme.colors.textMuted,
      fontSize: 10,
      lineHeight: 15,
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
    alt: {
      color: theme.colors.textMuted,
      fontSize: 11,
      lineHeight: 15,
    },
  });
