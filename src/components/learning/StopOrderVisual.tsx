import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface StopOrderVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function StopOrderVisual({
  language,
  theme = defaultLearningTheme,
}: StopOrderVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';
  const accessibilityLabel = tr
    ? 'Fiyat hareketinden stop seviyesine ve çıkış sürecine ilerleyen sade şema'
    : 'Simple diagram moving from price movement to a stop level and then an exit process';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Stop, çıkışı önceden planlamaya yardım eder' : 'A stop helps plan an exit in advance'}
          </Text>
          <Text style={styles.subtitle}>
            {tr
              ? 'Belirlenen seviyeye gelindiğinde çıkış süreci başlar.'
              : 'When the chosen level is reached, the exit process begins.'}
          </Text>
        </View>

        <View style={styles.flowCard}>
          <FlowStep
            styles={styles}
            symbol="↕"
            label={tr ? 'FİYAT HAREKETİ' : 'PRICE MOVE'}
            note={tr ? 'Fiyat değişir' : 'Price moves'}
          />
          <Text style={styles.arrow}>→</Text>
          <FlowStep
            styles={styles}
            symbol="•"
            label={tr ? 'STOP SEVİYESİ' : 'STOP LEVEL'}
            note={tr ? 'Önceden belirlenir' : 'Chosen in advance'}
            tone="stop"
          />
          <Text style={styles.arrow}>→</Text>
          <FlowStep
            styles={styles}
            symbol="↗"
            label={tr ? 'ÇIKIŞ SÜRECİ' : 'EXIT PROCESS'}
            note={tr ? 'İşlem çıkışa yönelir' : 'The trade moves toward exit'}
          />
        </View>

        <View style={styles.takeaway}>
          <Text style={styles.takeawayMark}>!</Text>
          <View style={styles.takeawayCopy}>
            <Text style={styles.takeawayTitle}>
              {tr ? 'Stop bir planlama aracıdır' : 'A stop is a planning tool'}
            </Text>
            <Text style={styles.takeawayText}>
              {tr
                ? 'Gerçek sonuç, o andaki piyasa koşullarından etkilenebilir.'
                : 'The actual outcome can still be affected by market conditions at that moment.'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function FlowStep({
  styles,
  symbol,
  label,
  note,
  tone = 'plain',
}: {
  styles: ReturnType<typeof createStyles>;
  symbol: string;
  label: string;
  note: string;
  tone?: 'plain' | 'stop';
}) {
  return (
    <View style={[styles.step, tone === 'stop' && styles.stopStep]}>
      <View style={[styles.symbolWrap, tone === 'stop' && styles.stopSymbolWrap]}>
        <Text style={[styles.symbol, tone === 'stop' && styles.stopSymbol]}>{symbol}</Text>
      </View>
      <Text style={styles.stepLabel}>{label}</Text>
      <Text style={styles.stepNote}>{note}</Text>
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
      gap: 16,
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
    flowCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      padding: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceMuted,
    },
    step: {
      flex: 1,
      alignItems: 'center',
      gap: 5,
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderRadius: 10,
    },
    stopStep: {
      backgroundColor: 'rgba(251,191,36,0.05)',
      borderWidth: 1,
      borderColor: 'rgba(251,191,36,0.24)',
    },
    symbolWrap: {
      width: 34,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 17,
      backgroundColor: 'rgba(159,176,195,0.08)',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    stopSymbolWrap: {
      backgroundColor: 'rgba(251,191,36,0.08)',
      borderColor: 'rgba(251,191,36,0.30)',
    },
    symbol: {
      color: theme.colors.textMuted,
      fontSize: 17,
      lineHeight: 20,
      fontWeight: '900',
    },
    stopSymbol: {
      color: theme.colors.warning,
    },
    stepLabel: {
      color: theme.colors.text,
      fontSize: 9,
      lineHeight: 12,
      fontWeight: '900',
      letterSpacing: 0.45,
      textAlign: 'center',
    },
    stepNote: {
      color: theme.colors.textMuted,
      fontSize: 9,
      lineHeight: 13,
      fontWeight: '700',
      textAlign: 'center',
    },
    arrow: {
      color: theme.colors.textMuted,
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '900',
    },
    takeaway: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 11,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(251,113,133,0.20)',
      backgroundColor: 'rgba(251,113,133,0.04)',
    },
    takeawayMark: {
      width: 24,
      color: theme.colors.risk,
      fontSize: 20,
      lineHeight: 23,
      fontWeight: '900',
      textAlign: 'center',
    },
    takeawayCopy: {
      flex: 1,
      gap: 2,
    },
    takeawayTitle: {
      color: theme.colors.text,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '900',
    },
    takeawayText: {
      color: theme.colors.textMuted,
      fontSize: 10,
      lineHeight: 15,
      fontWeight: '700',
    },
  });
