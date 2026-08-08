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
    ? 'Çok sayıda varlığın tek başına çeşitlendirme anlamına gelmediğini gösteren şema'
    : 'Diagram showing that holding many assets does not by itself mean diversification';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Çok varlık, tek başına çeşitlendirme değildir' : 'Many assets alone do not mean diversification'}
          </Text>
          <Text style={styles.subtitle}>
            {tr ? 'Sayıdan çok, varlıkların neye bağlı olduğuna bak.' : 'Look beyond the count to what the assets depend on.'}
          </Text>
        </View>

        <View style={styles.comparison}>
          <BasketCard
            styles={styles}
            label={tr ? 'SEPET A' : 'BASKET A'}
            sourceMode="shared"
            sourceLabel={tr ? 'ORTAK ETKİ' : 'SHARED DRIVER'}
          />
          <BasketCard
            styles={styles}
            label={tr ? 'SEPET B' : 'BASKET B'}
            sourceMode="separate"
            sourceLabel={tr ? 'FARKLI ETKİLER' : 'DIFFERENT DRIVERS'}
          />
        </View>

        <View style={styles.takeaway}>
          <Text style={styles.takeawayMark}>≠</Text>
          <Text style={styles.takeawayText}>
            {tr
              ? 'Varlık sayısı arttı diye risk otomatik olarak iyi dağılmış olmaz.'
              : 'Adding more assets does not automatically mean risk is well spread.'}
          </Text>
        </View>

        <View style={styles.boundary}>
          <Text style={styles.boundaryText}>
            {tr
              ? 'Çeşitlendirme kayıp ihtimalini tamamen ortadan kaldırmaz.'
              : 'Diversification does not remove the possibility of loss.'}
          </Text>
        </View>
      </View>
    </View>
  );
}

function BasketCard({
  styles,
  label,
  sourceMode,
  sourceLabel,
}: {
  styles: ReturnType<typeof createStyles>;
  label: string;
  sourceMode: 'shared' | 'separate';
  sourceLabel: string;
}) {
  const shared = sourceMode === 'shared';

  return (
    <View style={styles.basketCard}>
      <Text style={styles.basketLabel}>{label}</Text>

      <View style={styles.assetRow}>
        <AssetDot styles={styles} text="A" />
        <AssetDot styles={styles} text="B" />
        <AssetDot styles={styles} text="C" />
      </View>

      <Text style={styles.arrow}>↓</Text>

      {shared ? (
        <View style={styles.sharedSource}>
          <Text style={styles.sourceText}>{sourceLabel}</Text>
        </View>
      ) : (
        <View style={styles.separateSources}>
          <View style={styles.smallSource}><Text style={styles.smallSourceText}>1</Text></View>
          <View style={styles.smallSource}><Text style={styles.smallSourceText}>2</Text></View>
          <View style={styles.smallSource}><Text style={styles.smallSourceText}>3</Text></View>
          <Text style={styles.separateLabel}>{sourceLabel}</Text>
        </View>
      )}
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
    comparison: {
      flexDirection: 'row',
      gap: 10,
    },
    basketCard: {
      flex: 1,
      minHeight: 142,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceMuted,
    },
    basketLabel: {
      color: theme.colors.textMuted,
      fontSize: 9,
      lineHeight: 12,
      fontWeight: '900',
      letterSpacing: 0.55,
    },
    assetRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 7,
    },
    assetDot: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 15,
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.30)',
      backgroundColor: 'rgba(45,212,191,0.06)',
    },
    assetText: {
      color: theme.colors.text,
      fontSize: 10,
      fontWeight: '900',
    },
    arrow: {
      color: theme.colors.textMuted,
      fontSize: 13,
      lineHeight: 14,
      fontWeight: '900',
    },
    sharedSource: {
      minWidth: 96,
      minHeight: 34,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'rgba(251,191,36,0.28)',
      backgroundColor: 'rgba(251,191,36,0.05)',
    },
    sourceText: {
      color: theme.colors.warning,
      fontSize: 9,
      lineHeight: 12,
      fontWeight: '900',
      textAlign: 'center',
    },
    separateSources: {
      alignItems: 'center',
      gap: 5,
    },
    smallSource: {
      display: 'none',
      width: 22,
      height: 22,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 11,
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.28)',
      backgroundColor: 'rgba(45,212,191,0.05)',
    },
    smallSourceText: {
      color: theme.colors.primary,
      fontSize: 8,
      fontWeight: '900',
    },
    separateLabel: {
      minWidth: 96,
      minHeight: 34,
      color: theme.colors.primary,
      fontSize: 9,
      lineHeight: 34,
      fontWeight: '900',
      textAlign: 'center',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.28)',
      backgroundColor: 'rgba(45,212,191,0.05)',
      overflow: 'hidden',
    },
    takeaway: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 11,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(251,191,36,0.22)',
      backgroundColor: 'rgba(251,191,36,0.04)',
    },
    takeawayMark: {
      width: 24,
      color: theme.colors.warning,
      fontSize: 22,
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
    boundary: {
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    boundaryText: {
      color: theme.colors.textMuted,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '700',
      textAlign: 'center',
    },
  });
