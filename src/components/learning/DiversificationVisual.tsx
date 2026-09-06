import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface DiversificationVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function DiversificationVisual({
  language,
  theme = defaultLearningTheme,
}: DiversificationVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';
  const accessibilityLabel = tr
    ? 'Çok sayıda varlığın tek başına çeşitlendirme anlamına gelmediğini gösteren nötr şema'
    : 'Neutral diagram showing that holding many assets does not by itself mean diversification';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Çok varlık ≠ otomatik çeşitlendirme' : 'Many assets ≠ automatic diversification'}
          </Text>
          <Text style={styles.subtitle}>
            {tr ? 'Önemli olan yalnız kaç tane olduğu değildir.' : 'The count alone is not what matters.'}
          </Text>
        </View>

        <View style={styles.basketCard}>
          <Text style={styles.basketLabel}>{tr ? 'BİR SEPET' : 'ONE BASKET'}</Text>

          <View style={styles.assetRow}>
            <AssetDot styles={styles} text="A" />
            <AssetDot styles={styles} text="B" />
            <AssetDot styles={styles} text="C" />
            <AssetDot styles={styles} text="D" />
          </View>

          <Text style={styles.arrow}>↓</Text>

          <View style={styles.questionCard}>
            <Text style={styles.questionMark}>?</Text>
            <Text style={styles.questionText}>
              {tr ? 'Birlikte mi etkileniyorlar?' : 'Are they affected together?'}
            </Text>
          </View>
        </View>

        <View style={styles.takeaway}>
          <Text style={styles.takeawayText}>
            {tr
              ? 'Varlıkların birbirine ne kadar bağlı olduğunu da düşün.'
              : 'Also consider how closely the assets are connected.'}
          </Text>
        </View>

        <Text style={styles.boundaryText}>
          {tr
            ? 'Çeşitlendirme kayıp ihtimalini tamamen ortadan kaldırmaz.'
            : 'Diversification does not remove the possibility of loss.'}
        </Text>
      </View>
    </View>
  );
}

function AssetDot({
  styles,
  text,
}: {
  styles: ReturnType<typeof createStyles>;
  text: string;
}) {
  return (
    <View style={styles.assetDot}>
      <Text style={styles.assetText}>{text}</Text>
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
      flex: 1,
      justifyContent: 'center',
      gap: 14,
      padding: theme.spacing.md,
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
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '700',
      textAlign: 'center',
    },
    basketCard: {
      alignItems: 'center',
      gap: 9,
      padding: 15,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceMuted,
    },
    basketLabel: {
      color: theme.colors.textMuted,
      fontSize: 9,
      lineHeight: 12,
      fontWeight: '900',
      letterSpacing: 0.6,
    },
    assetRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
    },
    assetDot: {
      width: 34,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 17,
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.28)',
      backgroundColor: 'rgba(45,212,191,0.05)',
    },
    assetText: {
      color: theme.colors.text,
      fontSize: 10,
      fontWeight: '900',
    },
    arrow: {
      color: theme.colors.textMuted,
      fontSize: 14,
      lineHeight: 15,
      fontWeight: '900',
    },
    questionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      minHeight: 42,
      paddingHorizontal: 13,
      borderRadius: 11,
      borderWidth: 1,
      borderColor: 'rgba(251,191,36,0.24)',
      backgroundColor: 'rgba(251,191,36,0.05)',
    },
    questionMark: {
      color: theme.colors.warning,
      fontSize: 19,
      lineHeight: 22,
      fontWeight: '900',
    },
    questionText: {
      color: theme.colors.text,
      fontSize: 11,
      lineHeight: 15,
      fontWeight: '800',
      textAlign: 'center',
    },
    takeaway: {
      alignItems: 'center',
      padding: 10,
      borderRadius: 11,
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.20)',
      backgroundColor: 'rgba(45,212,191,0.04)',
    },
    takeawayText: {
      color: theme.colors.text,
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '800',
      textAlign: 'center',
    },
    boundaryText: {
      color: theme.colors.textMuted,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '700',
      textAlign: 'center',
      paddingHorizontal: 8,
    },
  });
