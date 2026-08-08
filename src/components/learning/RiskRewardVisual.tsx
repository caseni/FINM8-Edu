import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface RiskRewardVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function RiskRewardVisual({
  language,
  theme = defaultLearningTheme,
}: RiskRewardVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';
  const accessibilityLabel = tr
    ? 'Risk getiri oranının tek başına karar kalitesini göstermediğini anlatan şema'
    : 'Diagram showing that a risk reward ratio alone does not determine decision quality';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Büyük oran tek başına iyi karar değildir' : 'A large ratio alone does not make a good decision'}
          </Text>
          <Text style={styles.subtitle}>
            {tr
              ? 'Risk / getiri oranı planın yalnız bir parçasıdır.'
              : 'Risk / reward ratio is only one part of a plan.'}
          </Text>
        </View>

        <View style={styles.ratioCard}>
          <Text style={styles.ratioEyebrow}>{tr ? 'KAĞIT ÜZERİNDE' : 'ON PAPER'}</Text>
          <Text style={styles.ratioValue}>1 : 5</Text>
          <Text style={styles.ratioText}>
            {tr ? 'Çekici görünebilir' : 'It can look attractive'}
          </Text>
        </View>

        <View style={styles.flowRow}>
          <View style={styles.flowItem}>
            <Text style={styles.flowValue}>1 : 5</Text>
            <Text style={styles.flowLabel}>{tr ? 'ORAN' : 'RATIO'}</Text>
          </View>

          <Text style={styles.arrow}>→</Text>

          <View style={styles.questionCircle}>
            <Text style={styles.questionMark}>?</Text>
          </View>

          <Text style={styles.arrow}>→</Text>

          <View style={styles.flowItem}>
            <Text style={styles.flowValue}>{tr ? 'KARAR' : 'DECISION'}</Text>
            <Text style={styles.flowLabel}>{tr ? 'EK KANIT GEREKİR' : 'NEEDS MORE EVIDENCE'}</Text>
          </View>
        </View>

        <View style={styles.takeaway}>
          <Text style={styles.takeawayMark}>≠</Text>
          <Text style={styles.takeawayText}>
            {tr
              ? 'Yüksek oran, yüksek kaliteli karar veya kazanç garantisi değildir.'
              : 'A high ratio is not a guarantee of decision quality or profit.'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      minHeight: 310,
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
      fontSize: 12,
      lineHeight: 17,
      fontWeight: '700',
      textAlign: 'center',
    },
    ratioCard: {
      alignItems: 'center',
      gap: 3,
      padding: 15,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.24)',
      backgroundColor: 'rgba(45,212,191,0.05)',
    },
    ratioEyebrow: {
      color: theme.colors.primary,
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.7,
    },
    ratioValue: {
      color: theme.colors.text,
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '900',
    },
    ratioText: {
      color: theme.colors.textMuted,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '700',
    },
    flowRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceMuted,
    },
    flowItem: {
      flex: 1,
      alignItems: 'center',
      gap: 3,
    },
    flowValue: {
      color: theme.colors.text,
      fontSize: 11,
      lineHeight: 15,
      fontWeight: '900',
      textAlign: 'center',
    },
    flowLabel: {
      color: theme.colors.textMuted,
      fontSize: 8,
      lineHeight: 11,
      fontWeight: '900',
      letterSpacing: 0.4,
      textAlign: 'center',
    },
    arrow: {
      color: theme.colors.textMuted,
      fontSize: 14,
      fontWeight: '900',
    },
    questionCircle: {
      width: 34,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 17,
      borderWidth: 1,
      borderColor: 'rgba(251,191,36,0.30)',
      backgroundColor: 'rgba(251,191,36,0.08)',
    },
    questionMark: {
      color: theme.colors.warning,
      fontSize: 18,
      lineHeight: 21,
      fontWeight: '900',
    },
    takeaway: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 11,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(251,113,133,0.22)',
      backgroundColor: 'rgba(251,113,133,0.04)',
    },
    takeawayMark: {
      width: 24,
      color: theme.colors.risk,
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
  });
