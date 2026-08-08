import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface OvertradingDecisionVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function OvertradingDecisionVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: OvertradingDecisionVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Aşırı işlem = sayıdan çok süreç sorunu' : 'Overtrading = a process problem, not just a count'}
          </Text>
          <Text style={styles.subtitle}>
            {tr
              ? 'Asıl işaret: kararların plan, kanıt ve risk sınırından kopması'
              : 'The key sign: decisions drift away from plan, evidence, and risk limits'}
          </Text>
        </View>

        <View style={styles.comparison}>
          <DecisionCard
            styles={styles}
            tone="risk"
            eyebrow={tr ? 'DÜRTÜSEL DÖNGÜ' : 'IMPULSE LOOP'}
            steps={tr
              ? ['Kayıp / aciliyet', 'Hemen tekrar giriş', 'Kriteri değiştir']
              : ['Loss / urgency', 'Re-enter immediately', 'Change the criteria']}
            result={tr ? 'Maliyet + hata maruziyeti artabilir' : 'Costs + error exposure can rise'}
          />
          <DecisionCard
            styles={styles}
            tone="controlled"
            eyebrow={tr ? 'KONTROLLÜ DÖNGÜ' : 'CONTROLLED LOOP'}
            steps={tr
              ? ['Dur', 'Aynı planı kontrol et', 'Kanıt varsa karar ver']
              : ['Pause', 'Check the same plan', 'Act only with evidence']}
            result={tr ? 'Karar kalitesi görünür kalır' : 'Decision quality stays visible'}
          />
        </View>

        <View style={styles.quickCheck}>
          <Text style={styles.quickEyebrow}>{tr ? '5 SANİYELİK KONTROL' : '5-SECOND CHECK'}</Text>
          <View style={styles.quickRow}>
            <CheckPill styles={styles} label={tr ? 'PLAN?' : 'PLAN?'} />
            <Text style={styles.arrow}>→</Text>
            <CheckPill styles={styles} label={tr ? 'KANIT?' : 'EVIDENCE?'} />
            <Text style={styles.arrow}>→</Text>
            <CheckPill styles={styles} label={tr ? 'RİSK?' : 'RISK?'} />
          </View>
        </View>

        <View style={styles.traderCard}>
          <Text style={styles.traderEyebrow}>{tr ? 'TRADER PRATİK' : 'TRADER PRACTICAL'}</Text>
          <Text style={styles.traderText}>
            {tr
              ? 'Kayıptan hemen sonra “geri alma” isteği veya art arda zayıf kanıtlı girişler oluşuyorsa kısa bir ara verip önceden yazılmış kriterlere dönmek yardımcı olabilir. İşlem sayısı tek başına sorun değildir.'
              : 'If a loss creates an urge to “win it back” or weak-evidence entries start repeating, a short pause and a return to pre-written criteria can help. Trade count alone is not the problem.'}
          </Text>
        </View>

        <View style={styles.boundaryCard}>
          <Text style={styles.boundaryMark}>!</Text>
          <Text style={styles.boundaryText}>
            {tr
              ? 'Az işlem otomatik olarak iyi, çok işlem otomatik olarak kötü değildir. Ölçüt; plan, kanıt, risk sınırı ve maliyetle uyumdur.'
              : 'Fewer trades are not automatically good and more trades are not automatically bad. The test is alignment with plan, evidence, risk limits, and costs.'}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function DecisionCard({
  styles,
  tone,
  eyebrow,
  steps,
  result,
}: {
  styles: ReturnType<typeof createStyles>;
  tone: 'risk' | 'controlled';
  eyebrow: string;
  steps: readonly string[];
  result: string;
}) {
  const risk = tone === 'risk';
  return (
    <View style={[styles.card, risk ? styles.cardRisk : styles.cardControlled]}>
      <Text style={[styles.cardEyebrow, risk ? styles.riskText : styles.goodText]}>{eyebrow}</Text>
      <View style={styles.steps}>
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <View style={styles.stepRow}>
              <View style={[styles.stepDot, risk ? styles.stepDotRisk : styles.stepDotGood]} />
              <Text style={styles.stepText}>{step}</Text>
            </View>
            {index < steps.length - 1 ? <Text style={styles.downArrow}>↓</Text> : null}
          </React.Fragment>
        ))}
      </View>
      <View style={[styles.resultPill, risk ? styles.resultRisk : styles.resultGood]}>
        <Text style={[styles.resultText, risk ? styles.riskText : styles.goodText]}>{result}</Text>
      </View>
    </View>
  );
}

function CheckPill({ styles, label }: { styles: ReturnType<typeof createStyles>; label: string }) {
  return (
    <View style={styles.checkPill}>
      <Text style={styles.checkText}>{label}</Text>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      minHeight: 420,
      overflow: 'hidden',
      borderRadius: theme.radius.large,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    canvas: { padding: theme.spacing.md, gap: 12 },
    header: { alignItems: 'center', gap: 4, paddingHorizontal: 4 },
    title: { color: theme.colors.text, fontSize: 16, lineHeight: 22, fontWeight: '900', textAlign: 'center' },
    subtitle: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
    comparison: { flexDirection: 'row', gap: 10 },
    card: { flex: 1, gap: 8, padding: 10, borderRadius: 12, borderWidth: 1, backgroundColor: theme.colors.surfaceMuted },
    cardRisk: { borderColor: 'rgba(251,113,133,0.30)' },
    cardControlled: { borderColor: 'rgba(45,212,191,0.30)' },
    cardEyebrow: { minHeight: 25, fontSize: 9, lineHeight: 13, fontWeight: '900', letterSpacing: 0.4, textAlign: 'center' },
    riskText: { color: theme.colors.risk },
    goodText: { color: theme.colors.primary },
    steps: { gap: 2 },
    stepRow: { minHeight: 28, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 7, borderRadius: 7, backgroundColor: theme.colors.background },
    stepDot: { width: 7, height: 7, borderRadius: 4 },
    stepDotRisk: { backgroundColor: theme.colors.risk },
    stepDotGood: { backgroundColor: theme.colors.primary },
    stepText: { flex: 1, color: theme.colors.text, fontSize: 9, lineHeight: 13, fontWeight: '800' },
    downArrow: { color: theme.colors.textMuted, fontSize: 10, lineHeight: 10, fontWeight: '900', textAlign: 'center' },
    resultPill: { minHeight: 35, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, borderRadius: 8, borderWidth: 1 },
    resultRisk: { borderColor: 'rgba(251,113,133,0.32)', backgroundColor: 'rgba(251,113,133,0.06)' },
    resultGood: { borderColor: 'rgba(45,212,191,0.32)', backgroundColor: 'rgba(45,212,191,0.06)' },
    resultText: { fontSize: 8, lineHeight: 12, fontWeight: '900', textAlign: 'center' },
    quickCheck: { gap: 7, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
    quickEyebrow: { color: theme.colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    quickRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
    checkPill: { flex: 1, minHeight: 31, alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(45,212,191,0.30)', backgroundColor: 'rgba(45,212,191,0.05)' },
    checkText: { color: theme.colors.text, fontSize: 9, fontWeight: '900', letterSpacing: 0.35 },
    arrow: { color: theme.colors.textMuted, fontSize: 11, fontWeight: '900' },
    traderCard: { gap: 4, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(45,212,191,0.25)', backgroundColor: 'rgba(45,212,191,0.05)' },
    traderEyebrow: { color: theme.colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    traderText: { color: theme.colors.text, fontSize: 10, lineHeight: 15, fontWeight: '700' },
    boundaryCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(251,191,36,0.24)', backgroundColor: 'rgba(251,191,36,0.05)' },
    boundaryMark: { width: 18, color: theme.colors.warning, fontSize: 17, lineHeight: 20, fontWeight: '900' },
    boundaryText: { flex: 1, color: theme.colors.textMuted, fontSize: 10, lineHeight: 15, fontWeight: '700' },
    footer: { minHeight: 44, justifyContent: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border },
    alt: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 15 },
  });
