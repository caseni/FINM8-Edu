import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface DecisionJournalVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function DecisionJournalVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: DecisionJournalVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';
  const steps = tr
    ? [
        ['1', 'GÖZLEM', 'Ne gördüm?'],
        ['2', 'YORUM', 'Ne düşündüm?'],
        ['3', 'DEĞİŞİM', 'Ne olursa fikrim değişir?'],
        ['4', 'SONUÇ', 'Sonra ne oldu?'],
      ]
    : [
        ['1', 'OBSERVE', 'What did I see?'],
        ['2', 'INTERPRET', 'What did I think?'],
        ['3', 'CHANGE', 'What would change my view?'],
        ['4', 'RESULT', 'What happened later?'],
      ];

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>{tr ? 'Sonucu değil, karar sürecini kaydet' : 'Record the decision process, not only the result'}</Text>
          <Text style={styles.subtitle}>{tr ? 'İyi sonuç ≠ otomatik iyi karar' : 'Good result ≠ automatically good decision'}</Text>
        </View>

        <View style={styles.steps}>
          {steps.map(([number, label, question], index) => (
            <React.Fragment key={number}>
              <View style={styles.step}>
                <Text style={styles.number}>{number}</Text>
                <View style={styles.stepCopy}>
                  <Text style={styles.label}>{label}</Text>
                  <Text style={styles.question}>{question}</Text>
                </View>
              </View>
              {index < steps.length - 1 ? <Text style={styles.arrow}>↓</Text> : null}
            </React.Fragment>
          ))}
        </View>

        <View style={styles.practicalCard}>
          <Text style={styles.practicalEyebrow}>{tr ? 'TRADER PRATİK' : 'TRADER PRACTICAL'}</Text>
          <Text style={styles.practicalText}>
            {tr
              ? 'İlk üç adımı karar anında yaz. Sonuç belli olduktan sonra eski gerekçeyi değiştirme; sonucu ayrı ekle.'
              : 'Write the first three steps at decision time. After the result is known, do not rewrite the old reasoning; add the result separately.'}
          </Text>
        </View>

        <View style={styles.boundaryCard}>
          <Text style={styles.boundaryMark}>!</Text>
          <Text style={styles.boundaryText}>
            {tr
              ? 'Kârlı bir sonuç zayıf bir süreci, zararlı bir sonuç da iyi bir süreci tek başına kanıtlamaz.'
              : 'A profitable result does not by itself prove a strong process, and a loss does not by itself prove a poor process.'}
          </Text>
        </View>
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
    header: { alignItems: 'center', gap: 4, paddingHorizontal: 4 },
    title: { color: theme.colors.text, fontSize: 16, lineHeight: 22, fontWeight: '900', textAlign: 'center' },
    subtitle: { color: theme.colors.warning, fontSize: 11, lineHeight: 16, fontWeight: '800', textAlign: 'center' },
    steps: { gap: 2 },
    step: {
      minHeight: 54,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 10,
      borderRadius: 11,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceMuted,
    },
    number: {
      width: 28,
      height: 28,
      borderRadius: 14,
      overflow: 'hidden',
      backgroundColor: theme.colors.primary,
      color: theme.colors.primaryText,
      fontSize: 12,
      lineHeight: 28,
      fontWeight: '900',
      textAlign: 'center',
    },
    stepCopy: { flex: 1, gap: 2 },
    label: { color: theme.colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    question: { color: theme.colors.text, fontSize: 12, lineHeight: 17, fontWeight: '800' },
    arrow: { color: theme.colors.textMuted, fontSize: 12, lineHeight: 12, fontWeight: '900', textAlign: 'center' },
    practicalCard: { gap: 4, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(45,212,191,0.25)', backgroundColor: 'rgba(45,212,191,0.05)' },
    practicalEyebrow: { color: theme.colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    practicalText: { color: theme.colors.text, fontSize: 10, lineHeight: 15, fontWeight: '700' },
    boundaryCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
    boundaryMark: { width: 18, color: theme.colors.warning, fontSize: 17, lineHeight: 20, fontWeight: '900' },
    boundaryText: { flex: 1, color: theme.colors.textMuted, fontSize: 10, lineHeight: 15, fontWeight: '700' },
    footer: { minHeight: 44, justifyContent: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border },
    alt: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 15 },
  });
