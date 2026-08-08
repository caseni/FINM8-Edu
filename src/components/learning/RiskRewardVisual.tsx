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
  alt,
  language,
  theme = defaultLearningTheme,
}: RiskRewardVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Risk / getiri oranı tek başına karar değildir' : 'Risk / reward ratio is not a decision by itself'}
          </Text>
          <Text style={styles.subtitle}>
            {tr ? 'Oran sonuç büyüklüğünü karşılaştırır · olasılığı söylemez' : 'The ratio compares outcome sizes · it does not tell probability'}
          </Text>
        </View>

        <View style={styles.ratioCard}>
          <Text style={styles.ratioEyebrow}>{tr ? 'KAĞIT ÜZERİNDE' : 'ON PAPER'}</Text>
          <View style={styles.ratioRow}>
            <View style={[styles.ratioSide, styles.riskSide]}>
              <Text style={styles.riskLabel}>{tr ? 'OLASI KAYIP' : 'POSSIBLE LOSS'}</Text>
              <Text style={styles.riskValue}>−1R</Text>
            </View>
            <View style={styles.ratioCenter}>
              <Text style={styles.ratioValue}>1 : 5</Text>
              <Text style={styles.ratioNote}>{tr ? 'büyük görünüyor' : 'looks attractive'}</Text>
            </View>
            <View style={[styles.ratioSide, styles.rewardSide]}>
              <Text style={styles.rewardLabel}>{tr ? 'HEDEF' : 'TARGET'}</Text>
              <Text style={styles.rewardValue}>+5R</Text>
            </View>
          </View>
        </View>

        <View style={styles.missingHeader}>
          <Text style={styles.missingTitle}>{tr ? 'Ama iki bilgi hâlâ eksik' : 'But two inputs are still missing'}</Text>
        </View>

        <View style={styles.checkRow}>
          <View style={styles.checkCard}>
            <Text style={styles.checkMark}>?</Text>
            <Text style={styles.checkTitle}>{tr ? 'OLASILIK' : 'PROBABILITY'}</Text>
            <Text style={styles.checkText}>
              {tr ? 'Hedefe ulaşma ihtimalini oran tek başına göstermez.' : 'The ratio alone does not show the chance of reaching the target.'}
            </Text>
          </View>
          <View style={styles.checkCard}>
            <Text style={styles.checkMark}>?</Text>
            <Text style={styles.checkTitle}>{tr ? 'MALİYET' : 'COSTS'}</Text>
            <Text style={styles.checkText}>
              {tr ? 'Spread, komisyon ve kayma gerçekleşen sonucu değiştirebilir.' : 'Spread, fees, and slippage can change the realized result.'}
            </Text>
          </View>
        </View>

        <View style={styles.practiceCard}>
          <Text style={styles.practiceEyebrow}>{tr ? 'TRADER PRATİK' : 'TRADER PRACTICAL'}</Text>
          <Text style={styles.practiceText}>
            {tr
              ? 'Hedefi sırf oran büyüsün diye uzağa taşımak planı otomatik iyileştirmez; hedefin kanıtı ve ulaşılabilirliği ayrıca değerlendirilir.'
              : 'Moving a target farther away just to enlarge the ratio does not automatically improve the plan; evidence and attainability still need assessment.'}
          </Text>
        </View>

        <View style={styles.boundaryCard}>
          <Text style={styles.boundaryMark}>≠</Text>
          <Text style={styles.boundaryText}>
            {tr ? 'Yüksek oran = yüksek kaliteli karar değildir' : 'High ratio = high-quality decision is false'}
          </Text>
        </View>

        <Text style={styles.exampleNote}>
          {tr ? '1:5 yalnız eğitim örneğidir; öneri veya başarı garantisi değildir.' : '1:5 is illustrative only; it is not a recommendation or a guarantee of success.'}
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
      minHeight: 430,
      overflow: 'hidden',
      borderRadius: theme.radius.large,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    canvas: { padding: theme.spacing.md, gap: 12 },
    header: { gap: 4, alignItems: 'center', paddingHorizontal: 4 },
    title: { color: theme.colors.text, fontSize: 16, lineHeight: 22, fontWeight: '900', textAlign: 'center' },
    subtitle: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
    ratioCard: { gap: 8, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
    ratioEyebrow: { color: theme.colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 0.55, textAlign: 'center' },
    ratioRow: { flexDirection: 'row', alignItems: 'stretch', gap: 8 },
    ratioSide: { flex: 1, minHeight: 74, alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 10, borderWidth: 1 },
    riskSide: { backgroundColor: 'rgba(251,113,133,0.08)', borderColor: 'rgba(251,113,133,0.32)' },
    rewardSide: { backgroundColor: 'rgba(52,211,153,0.08)', borderColor: 'rgba(52,211,153,0.32)' },
    riskLabel: { color: theme.colors.risk, fontSize: 8, fontWeight: '900', letterSpacing: 0.35 },
    rewardLabel: { color: theme.colors.success, fontSize: 8, fontWeight: '900', letterSpacing: 0.35 },
    riskValue: { color: theme.colors.risk, fontSize: 18, fontWeight: '900' },
    rewardValue: { color: theme.colors.success, fontSize: 18, fontWeight: '900' },
    ratioCenter: { width: 88, alignItems: 'center', justifyContent: 'center', gap: 2 },
    ratioValue: { color: theme.colors.text, fontSize: 22, fontWeight: '900' },
    ratioNote: { color: theme.colors.textMuted, fontSize: 8, textAlign: 'center' },
    missingHeader: { alignItems: 'center' },
    missingTitle: { color: theme.colors.warning, fontSize: 11, fontWeight: '900' },
    checkRow: { flexDirection: 'row', gap: 9 },
    checkCard: { flex: 1, minHeight: 112, gap: 5, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(251,191,36,0.26)', backgroundColor: 'rgba(251,191,36,0.05)' },
    checkMark: { color: theme.colors.warning, fontSize: 20, lineHeight: 22, fontWeight: '900' },
    checkTitle: { color: theme.colors.text, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
    checkText: { color: theme.colors.textMuted, fontSize: 9, lineHeight: 14, fontWeight: '700' },
    practiceCard: { gap: 4, padding: 11, borderRadius: 12, borderLeftWidth: 3, borderLeftColor: theme.colors.primary, backgroundColor: 'rgba(45,212,191,0.06)' },
    practiceEyebrow: { color: theme.colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    practiceText: { color: theme.colors.text, fontSize: 10, lineHeight: 15, fontWeight: '700' },
    boundaryCard: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 10, borderRadius: 11, borderWidth: 1, borderColor: 'rgba(251,113,133,0.26)', backgroundColor: 'rgba(251,113,133,0.05)' },
    boundaryMark: { width: 24, color: theme.colors.risk, fontSize: 22, fontWeight: '900', textAlign: 'center' },
    boundaryText: { flex: 1, color: theme.colors.text, fontSize: 10, lineHeight: 15, fontWeight: '900' },
    exampleNote: { color: theme.colors.textMuted, fontSize: 9, lineHeight: 13, textAlign: 'center' },
    footer: { minHeight: 44, justifyContent: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border },
    alt: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 15 },
  });
