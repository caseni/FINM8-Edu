import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface ConfirmationBiasVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function ConfirmationBiasVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: ConfirmationBiasVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>{tr ? 'Görüşünü değil, kanıtı test et' : 'Test the evidence, not your view'}</Text>
          <Text style={styles.subtitle}>
            {tr ? 'Tek yönlü kanıt güveni şişirebilir.' : 'One-sided evidence can inflate confidence.'}
          </Text>
        </View>

        <View style={styles.comparison}>
          <View style={[styles.evidenceCard, styles.biasedCard]}>
            <Text style={[styles.cardEyebrow, styles.riskText]}>{tr ? 'TEK TARAFLI ARAMA' : 'ONE-SIDED SEARCH'}</Text>
            <EvidenceRow styles={styles} tone="support" text={tr ? 'Beni destekleyen haber' : 'News that supports me'} />
            <EvidenceRow styles={styles} tone="support" text={tr ? 'Beni destekleyen yorum' : 'Comment that supports me'} />
            <EvidenceRow styles={styles} tone="muted" text={tr ? 'Karşı kanıtı geç' : 'Skip counter-evidence'} />
            <Text style={styles.cardResult}>{tr ? '“Haklıyım” hissi büyür' : '“I am right” feeling grows'}</Text>
          </View>

          <View style={[styles.evidenceCard, styles.balancedCard]}>
            <Text style={[styles.cardEyebrow, styles.goodText]}>{tr ? 'İKİ TARAFLI TEST' : 'TWO-SIDED TEST'}</Text>
            <EvidenceRow styles={styles} tone="support" text={tr ? 'Neyi destekliyor?' : 'What supports it?'} />
            <EvidenceRow styles={styles} tone="challenge" text={tr ? 'Neyi çürütebilir?' : 'What could disprove it?'} />
            <EvidenceRow styles={styles} tone="challenge" text={tr ? 'Geçersizlik koşulu ne?' : 'What invalidates it?'} />
            <Text style={styles.cardResultStrong}>{tr ? 'Görüş gerçekten test edilir' : 'The view is actually tested'}</Text>
          </View>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionEyebrow}>{tr ? '5 SANİYELİK KONTROL' : '5-SECOND CHECK'}</Text>
          <Text style={styles.question}>{tr ? '“Beni hangi kanıt yanlış çıkarır?”' : '“What evidence would prove me wrong?”'}</Text>
        </View>

        <View style={styles.practicalCard}>
          <Text style={styles.practicalEyebrow}>{tr ? 'TRADER PRATİK' : 'TRADER PRACTICAL'}</Text>
          <Text style={styles.practicalText}>
            {tr
              ? 'Bir tez kurduktan sonra özellikle tersini gösterebilecek veriyi ara. Aynı bilgiyi tekrarlayan çok hesap, bağımsız doğrulama sayılmaz.'
              : 'After forming a thesis, deliberately look for data that could challenge it. Many accounts repeating the same information are not independent confirmation.'}
          </Text>
        </View>

        <View style={styles.boundaryCard}>
          <Text style={styles.boundaryMark}>!</Text>
          <Text style={styles.boundaryText}>
            {tr
              ? 'Karşı kanıt aramak otomatik olarak ters görüşe geçmek değildir; kararın gerçekten sınanmasını sağlar.'
              : 'Seeking counter-evidence does not mean automatically taking the opposite view; it makes the decision genuinely testable.'}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function EvidenceRow({
  styles,
  tone,
  text,
}: {
  styles: ReturnType<typeof createStyles>;
  tone: 'support' | 'challenge' | 'muted';
  text: string;
}) {
  const mark = tone === 'support' ? '✓' : tone === 'challenge' ? '?' : '×';
  return (
    <View style={styles.evidenceRow}>
      <Text style={[
        styles.evidenceMark,
        tone === 'support' ? styles.supportMark : tone === 'challenge' ? styles.challengeMark : styles.mutedMark,
      ]}>{mark}</Text>
      <Text style={styles.evidenceText}>{text}</Text>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      minHeight: 410,
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
    evidenceCard: { flex: 1, gap: 7, padding: 10, borderRadius: 12, borderWidth: 1, backgroundColor: theme.colors.surfaceMuted },
    biasedCard: { borderColor: 'rgba(251,113,133,0.30)' },
    balancedCard: { borderColor: 'rgba(45,212,191,0.30)' },
    cardEyebrow: { minHeight: 26, fontSize: 9, lineHeight: 13, fontWeight: '900', letterSpacing: 0.35, textAlign: 'center' },
    riskText: { color: theme.colors.risk },
    goodText: { color: theme.colors.primary },
    evidenceRow: { minHeight: 30, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 7, borderRadius: 8, backgroundColor: theme.colors.background },
    evidenceMark: { width: 18, fontSize: 12, lineHeight: 18, fontWeight: '900', textAlign: 'center' },
    supportMark: { color: theme.colors.success },
    challengeMark: { color: theme.colors.warning },
    mutedMark: { color: theme.colors.risk },
    evidenceText: { flex: 1, color: theme.colors.text, fontSize: 9, lineHeight: 13, fontWeight: '700' },
    cardResult: { minHeight: 28, color: theme.colors.risk, fontSize: 9, lineHeight: 13, fontWeight: '900', textAlign: 'center' },
    cardResultStrong: { minHeight: 28, color: theme.colors.primary, fontSize: 9, lineHeight: 13, fontWeight: '900', textAlign: 'center' },
    questionCard: { gap: 5, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(251,191,36,0.28)', backgroundColor: 'rgba(251,191,36,0.05)' },
    questionEyebrow: { color: theme.colors.warning, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    question: { color: theme.colors.text, fontSize: 14, lineHeight: 20, fontWeight: '900', textAlign: 'center' },
    practicalCard: { gap: 4, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(45,212,191,0.25)', backgroundColor: 'rgba(45,212,191,0.05)' },
    practicalEyebrow: { color: theme.colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    practicalText: { color: theme.colors.text, fontSize: 10, lineHeight: 15, fontWeight: '700' },
    boundaryCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
    boundaryMark: { width: 18, color: theme.colors.warning, fontSize: 17, lineHeight: 20, fontWeight: '900' },
    boundaryText: { flex: 1, color: theme.colors.textMuted, fontSize: 10, lineHeight: 15, fontWeight: '700' },
    footer: { minHeight: 44, justifyContent: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border },
    alt: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 15 },
  });
