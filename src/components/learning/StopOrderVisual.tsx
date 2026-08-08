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
  alt,
  language,
  theme = defaultLearningTheme,
}: StopOrderVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>{tr ? 'Stop = tetikleyici, fiyat garantisi değil' : 'Stop = trigger, not a price guarantee'}</Text>
          <Text style={styles.subtitle}>
            {tr ? 'Stop seviyesi ile gerçekleşme fiyatını ayır.' : 'Separate the stop level from the execution price.'}
          </Text>
        </View>

        <View style={styles.sequenceCard}>
          <Step styles={styles} label={tr ? 'GİRİŞ' : 'ENTRY'} value="100.0" />
          <Text style={styles.arrow}>↓</Text>
          <Step styles={styles} label="STOP" value="98.0" tone="trigger" note={tr ? 'tetiklenir' : 'triggers'} />
          <Text style={styles.fastMove}>{tr ? 'HIZLI HAREKET  ↓' : 'FAST MOVE  ↓'}</Text>
          <Step styles={styles} label={tr ? 'GERÇEKLEŞME' : 'FILL'} value="97.4" tone="risk" note={tr ? 'farklı olabilir' : 'can differ'} />
          <Text style={styles.example}>{tr ? 'Rakamlar yalnız örnektir.' : 'Numbers are illustrative only.'}</Text>
        </View>

        <View style={styles.compareRow}>
          <View style={[styles.compareCard, styles.stopCard]}>
            <Text style={styles.compareTitle}>{tr ? 'STANDART STOP' : 'STANDARD STOP'}</Text>
            <Text style={styles.flow}>STOP → {tr ? 'PİYASA EMRİ' : 'MARKET ORDER'}</Text>
            <Text style={styles.good}>{tr ? 'Çıkış önceliği' : 'Execution priority'}</Text>
            <Text style={styles.risk}>{tr ? 'Fiyat garanti değil' : 'Price not guaranteed'}</Text>
          </View>
          <View style={[styles.compareCard, styles.limitCard]}>
            <Text style={styles.compareTitle}>STOP-LIMIT</Text>
            <Text style={styles.flow}>STOP → {tr ? 'LİMİT EMRİ' : 'LIMIT ORDER'}</Text>
            <Text style={styles.good}>{tr ? 'Fiyat sınırı' : 'Price boundary'}</Text>
            <Text style={styles.risk}>{tr ? 'Gerçekleşmeme riski' : 'Non-fill risk'}</Text>
          </View>
        </View>

        <View style={styles.traderNote}>
          <Text style={styles.noteEyebrow}>{tr ? 'TRADER PRATİK' : 'TRADER PRACTICE'}</Text>
          <Text style={styles.noteText}>
            {tr
              ? 'Stopu sırf kayıp küçük görünsün diye rastgele yaklaştırma. Önce fikrinin geçersiz olduğu mantıklı seviyeyi düşün; normal fiyat gürültüsüyle kolay tetiklenen stop planı bozabilir.'
              : 'Do not move a stop randomly closer just to make the planned loss look smaller. First identify a logical invalidation level; a stop easily triggered by normal price noise can undermine the plan.'}
          </Text>
        </View>

        <View style={styles.boundary}>
          <Text style={styles.boundaryMark}>!</Text>
          <Text style={styles.boundaryText}>
            {tr
              ? 'Gap, hızlı hareket ve düşük likidite gerçek kaybı planlanandan büyütebilir.'
              : 'Gaps, fast moves, and low liquidity can make the realized loss larger than planned.'}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function Step({
  styles,
  label,
  value,
  tone = 'plain',
  note,
}: {
  styles: ReturnType<typeof createStyles>;
  label: string;
  value: string;
  tone?: 'plain' | 'trigger' | 'risk';
  note?: string;
}) {
  return (
    <View style={[styles.step, tone === 'trigger' && styles.stepTrigger, tone === 'risk' && styles.stepRisk]}>
      <Text style={styles.stepLabel}>{label}</Text>
      <Text style={styles.stepValue}>{value}</Text>
      {note ? <Text style={[styles.stepNote, tone === 'trigger' && styles.triggerText, tone === 'risk' && styles.riskText]}>{note}</Text> : null}
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
    header: { alignItems: 'center', gap: 4, paddingHorizontal: 4 },
    title: { color: theme.colors.text, fontSize: 16, lineHeight: 22, fontWeight: '900', textAlign: 'center' },
    subtitle: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
    sequenceCard: { alignItems: 'center', gap: 4, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
    step: { width: '100%', minHeight: 34, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 9, borderRadius: 8, backgroundColor: 'rgba(159,176,195,0.07)' },
    stepTrigger: { borderWidth: 1, borderColor: 'rgba(251,191,36,0.34)', backgroundColor: 'rgba(251,191,36,0.06)' },
    stepRisk: { borderWidth: 1, borderColor: 'rgba(251,113,133,0.34)', backgroundColor: 'rgba(251,113,133,0.07)' },
    stepLabel: { width: 78, color: theme.colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 0.45 },
    stepValue: { color: theme.colors.text, fontSize: 14, fontWeight: '900' },
    stepNote: { marginLeft: 'auto', color: theme.colors.textMuted, fontSize: 9, fontWeight: '800' },
    triggerText: { color: theme.colors.warning },
    riskText: { color: theme.colors.risk },
    arrow: { color: theme.colors.textMuted, fontSize: 12, lineHeight: 12, fontWeight: '900' },
    fastMove: { color: theme.colors.risk, fontSize: 9, fontWeight: '900', letterSpacing: 0.45 },
    example: { color: theme.colors.textMuted, fontSize: 9 },
    compareRow: { flexDirection: 'row', gap: 10 },
    compareCard: { flex: 1, gap: 5, padding: 10, borderRadius: 12, borderWidth: 1, backgroundColor: theme.colors.surfaceMuted },
    stopCard: { borderColor: 'rgba(45,212,191,0.28)' },
    limitCard: { borderColor: 'rgba(251,191,36,0.30)' },
    compareTitle: { color: theme.colors.text, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    flow: { color: theme.colors.textMuted, fontSize: 9, lineHeight: 13, fontWeight: '800' },
    good: { color: theme.colors.success, fontSize: 9, lineHeight: 13, fontWeight: '800' },
    risk: { color: theme.colors.risk, fontSize: 9, lineHeight: 13, fontWeight: '800' },
    traderNote: { gap: 4, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(45,212,191,0.26)', backgroundColor: 'rgba(45,212,191,0.05)' },
    noteEyebrow: { color: theme.colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
    noteText: { color: theme.colors.text, fontSize: 10, lineHeight: 15, fontWeight: '700' },
    boundary: { flexDirection: 'row', gap: 9, alignItems: 'flex-start', padding: 10, borderRadius: 11, backgroundColor: 'rgba(251,113,133,0.06)' },
    boundaryMark: { width: 18, color: theme.colors.risk, fontSize: 15, fontWeight: '900' },
    boundaryText: { flex: 1, color: theme.colors.textMuted, fontSize: 10, lineHeight: 15, fontWeight: '700' },
    footer: { minHeight: 44, justifyContent: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border },
    alt: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 15 },
  });
