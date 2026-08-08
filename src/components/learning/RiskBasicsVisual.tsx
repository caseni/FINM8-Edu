import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

interface RiskBasicsVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function RiskBasicsVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: RiskBasicsVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={alt}
      style={styles.shell}
    >
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Önce ihtimaller, sonra sonuç' : 'Possibilities first, outcome later'}
          </Text>
          <Text style={styles.subtitle}>
            {tr
              ? 'Karar verirken ne olacağını henüz kesin bilmiyoruz.'
              : 'When a decision is made, the outcome is not known yet.'}
          </Text>
        </View>

        <View style={styles.flow}>
          <Step
            styles={styles}
            marker="?"
            title={tr ? 'KARAR ANI' : 'DECISION TIME'}
            text={tr ? 'Sonuç henüz belli değil' : 'The outcome is not known yet'}
          />

          <Text style={styles.arrow}>→</Text>

          <View style={styles.outcomesCard}>
            <Text style={styles.stepTitle}>{tr ? 'OLASI SONUÇLAR' : 'POSSIBLE OUTCOMES'}</Text>
            <View style={styles.outcomesRow}>
              <View style={styles.outcomeItem}>
                <Text style={styles.positiveMark}>+</Text>
                <Text style={styles.outcomeText}>{tr ? 'Olumlu olabilir' : 'Could be positive'}</Text>
              </View>
              <View style={styles.outcomeItem}>
                <Text style={styles.negativeMark}>−</Text>
                <Text style={styles.outcomeText}>{tr ? 'Olumsuz olabilir' : 'Could be negative'}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.arrow}>→</Text>

          <Step
            styles={styles}
            marker="✓"
            title={tr ? 'GERÇEKLEŞEN SONUÇ' : 'REALIZED OUTCOME'}
            text={tr ? 'Artık ne olduğunu biliyoruz' : 'Now we know what happened'}
          />
        </View>

        <View style={styles.boundary}>
          <Text style={styles.boundaryText}>
            {tr
              ? 'Olumsuz sonuç gerçekten gerçekleşirse bu artık kayıptır.'
              : 'If the adverse outcome actually occurs, it is now a loss.'}
          </Text>
        </View>
      </View>
    </View>
  );
}

function Step({
  styles,
  marker,
  title,
  text,
}: {
  styles: ReturnType<typeof createStyles>;
  marker: string;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.stepCard}>
      <View style={styles.marker}>
        <Text style={styles.markerText}>{marker}</Text>
      </View>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      minHeight: 310,
      overflow: 'hidden',
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.radius.large,
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
    flow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    stepCard: {
      flex: 1,
      minHeight: 126,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      padding: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceMuted,
    },
    marker: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      backgroundColor: 'rgba(45,212,191,0.10)',
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.22)',
    },
    markerText: {
      color: theme.colors.primary,
      fontSize: 16,
      lineHeight: 20,
      fontWeight: '900',
    },
    stepTitle: {
      color: theme.colors.text,
      fontSize: 9,
      lineHeight: 13,
      fontWeight: '900',
      letterSpacing: 0.45,
      textAlign: 'center',
    },
    stepText: {
      color: theme.colors.textMuted,
      fontSize: 10,
      lineHeight: 15,
      fontWeight: '700',
      textAlign: 'center',
    },
    arrow: {
      color: theme.colors.textMuted,
      fontSize: 15,
      fontWeight: '900',
    },
    outcomesCard: {
      flex: 1.2,
      minHeight: 126,
      justifyContent: 'center',
      gap: 10,
      padding: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(251,191,36,0.22)',
      backgroundColor: theme.colors.surfaceMuted,
    },
    outcomesRow: {
      gap: 7,
    },
    outcomeItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 4,
    },
    positiveMark: {
      width: 18,
      color: theme.colors.success,
      fontSize: 16,
      fontWeight: '900',
      textAlign: 'center',
    },
    negativeMark: {
      width: 18,
      color: theme.colors.risk,
      fontSize: 16,
      fontWeight: '900',
      textAlign: 'center',
    },
    outcomeText: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '800',
    },
    boundary: {
      padding: 10,
      borderRadius: 11,
      borderWidth: 1,
      borderColor: 'rgba(251,113,133,0.20)',
      backgroundColor: 'rgba(251,113,133,0.04)',
    },
    boundaryText: {
      color: theme.colors.textMuted,
      fontSize: 10,
      lineHeight: 15,
      fontWeight: '800',
      textAlign: 'center',
    },
  });
