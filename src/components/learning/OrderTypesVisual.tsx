import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface OrderTypesVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function OrderTypesVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: OrderTypesVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Üç emir, üç farklı amaç' : 'Three orders, three different goals'}
          </Text>
          <Text style={styles.subtitle}>
            {tr ? 'Önce neyi kontrol etmek istediğini bil.' : 'First know what you want to control.'}
          </Text>
        </View>

        <View style={styles.cards}>
          <SimpleOrderCard
            styles={styles}
            tone="primary"
            label={tr ? 'PİYASA' : 'MARKET'}
            icon="→"
            meaning={tr ? 'Hemen gerçekleşmeyi dene' : 'Try to execute now'}
            warning={tr ? 'Fiyat garanti değil' : 'Price is not guaranteed'}
          />
          <SimpleOrderCard
            styles={styles}
            tone="success"
            label={tr ? 'LİMİT' : 'LIMIT'}
            icon="≤"
            meaning={tr ? 'Fiyatı sınırla' : 'Set a price limit'}
            warning={tr ? 'Hiç gerçekleşmeyebilir' : 'It may not execute'}
          />
          <SimpleOrderCard
            styles={styles}
            tone="warning"
            label="STOP"
            icon="⚡"
            meaning={tr ? 'Seviyede tetikle' : 'Trigger at a level'}
            warning={tr ? 'Stop fiyatı kesin işlem fiyatı değil' : 'Stop price is not a guaranteed fill price'}
          />
        </View>

        <View style={styles.rememberCard}>
          <Text style={styles.rememberEyebrow}>{tr ? 'AKLINDA KALSIN' : 'REMEMBER'}</Text>
          <Text style={styles.rememberText}>
            {tr
              ? 'Hız, fiyat kontrolü ve tetikleme aynı şey değildir.'
              : 'Speed, price control, and triggering are not the same thing.'}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function SimpleOrderCard({
  styles,
  tone,
  label,
  icon,
  meaning,
  warning,
}: {
  styles: ReturnType<typeof createStyles>;
  tone: 'primary' | 'success' | 'warning';
  label: string;
  icon: string;
  meaning: string;
  warning: string;
}) {
  const accent =
    tone === 'success'
      ? styles.successText
      : tone === 'warning'
        ? styles.warningText
        : styles.primaryText;
  const card =
    tone === 'success'
      ? styles.successCard
      : tone === 'warning'
        ? styles.warningCard
        : styles.primaryCard;

  return (
    <View style={[styles.orderCard, card]}>
      <View style={styles.cardTop}>
        <Text style={[styles.cardLabel, accent]}>{label}</Text>
        <Text style={[styles.icon, accent]}>{icon}</Text>
      </View>
      <Text style={styles.meaning}>{meaning}</Text>
      <Text style={styles.warning}>⚠ {warning}</Text>
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
      gap: 12,
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
    cards: { flexDirection: 'row', gap: 8 },
    orderCard: {
      flex: 1,
      minHeight: 132,
      justifyContent: 'center',
      gap: 9,
      padding: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
    },
    primaryCard: { borderColor: 'rgba(45,212,191,0.34)' },
    successCard: { borderColor: 'rgba(74,222,128,0.30)' },
    warningCard: { borderColor: 'rgba(250,204,21,0.30)' },
    cardTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
    },
    cardLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
    icon: { fontSize: 18, lineHeight: 20, fontWeight: '900' },
    primaryText: { color: theme.colors.primary },
    successText: { color: theme.colors.success },
    warningText: { color: theme.colors.warning },
    meaning: {
      color: theme.colors.text,
      fontSize: 12,
      lineHeight: 17,
      fontWeight: '900',
    },
    warning: {
      color: theme.colors.textMuted,
      fontSize: 9,
      lineHeight: 13,
      fontWeight: '700',
    },
    rememberCard: {
      gap: 3,
      paddingHorizontal: 11,
      paddingVertical: 9,
      borderRadius: 10,
      backgroundColor: 'rgba(45,212,191,0.07)',
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.24)',
    },
    rememberEyebrow: {
      color: theme.colors.primary,
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 0.55,
    },
    rememberText: {
      color: theme.colors.text,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '800',
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
