import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

interface RiskBasicsVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

type RiskConceptTone = 'uncertainty' | 'risk' | 'loss';

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
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          {tr ? 'AYNI ŞEY DEĞİLLER' : 'THEY ARE NOT THE SAME'}
        </Text>
        <Text style={styles.title}>
          {tr
            ? 'Karar anından gerçekleşen sonuca üç farklı kavram'
            : 'Three different concepts from decision time to realized outcome'}
        </Text>
      </View>

      <View style={styles.flow}>
        <RiskConceptCard
          marker="?"
          title={tr ? 'BELİRSİZLİK' : 'UNCERTAINTY'}
          prompt={tr ? 'Ne bilmiyoruz?' : 'What is unknown?'}
          detail={
            tr
              ? 'Olası sonuçları veya olasılıklarını tam bilmiyoruz.'
              : 'Outcomes or their probabilities are not fully known.'
          }
          tone="uncertainty"
          styles={styles}
        />

        <View style={styles.connector}>
          <Text style={styles.connectorText}>↓</Text>
          <Text style={styles.connectorLabel}>
            {tr ? 'KARAR ANI' : 'DECISION TIME'}
          </Text>
        </View>

        <RiskConceptCard
          marker="!"
          title={tr ? 'RİSK' : 'RISK'}
          prompt={tr ? 'Ne olabilir?' : 'What can happen?'}
          detail={
            tr
              ? 'Olumsuz finansal sonuç ihtimali henüz kayıp oluşmadan vardır.'
              : 'An adverse financial outcome is possible before any loss occurs.'
          }
          tone="risk"
          styles={styles}
        />

        <View style={styles.connector}>
          <Text style={styles.connectorText}>↓</Text>
          <Text style={styles.connectorLabel}>
            {tr ? 'SONUÇ GERÇEKLEŞİRSE' : 'IF THE OUTCOME OCCURS'}
          </Text>
        </View>

        <RiskConceptCard
          marker="−"
          title={tr ? 'KAYIP' : 'LOSS'}
          prompt={tr ? 'Ne oldu?' : 'What happened?'}
          detail={
            tr
              ? 'Olumsuz sonuç gerçekleşti ve artık potansiyel değil, gerçekleşmiş sonuçtur.'
              : 'The adverse outcome occurred and is now realized rather than potential.'
          }
          tone="loss"
          styles={styles}
        />
      </View>

      <View style={styles.boundary}>
        <Text style={styles.boundaryText}>
          {tr
            ? 'Henüz kayıp yokken risk olabilir. Risk yönetimi tüm kayıpları garantiyle yok etmez.'
            : 'Risk can exist before any loss. Risk management cannot guarantee that every loss is eliminated.'}
        </Text>
      </View>

      <Text numberOfLines={2} style={styles.alt}>
        {alt}
      </Text>
    </View>
  );
}

function RiskConceptCard({
  marker,
  title,
  prompt,
  detail,
  tone,
  styles,
}: {
  marker: string;
  title: string;
  prompt: string;
  detail: string;
  tone: RiskConceptTone;
  styles: ReturnType<typeof createStyles>;
}) {
  const toneStyles =
    tone === 'uncertainty'
      ? [styles.cardUncertainty, styles.markerUncertainty]
      : tone === 'risk'
        ? [styles.cardRisk, styles.markerRisk]
        : [styles.cardLoss, styles.markerLoss];

  return (
    <View style={[styles.card, toneStyles[0]]}>
      <View style={[styles.marker, toneStyles[1]]}>
        <Text style={styles.markerText}>{marker}</Text>
      </View>
      <View style={styles.cardCopy}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardPrompt}>{prompt}</Text>
        </View>
        <Text style={styles.cardDetail}>{detail}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      overflow: 'hidden',
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.radius.large,
    },
    header: {
      gap: 4,
      padding: theme.spacing.md,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
    },
    eyebrow: {
      color: theme.colors.primary,
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 0.8,
    },
    title: {
      color: theme.colors.text,
      fontSize: 15,
      lineHeight: 21,
      fontWeight: '800',
    },
    flow: {
      gap: 4,
      padding: theme.spacing.md,
    },
    card: {
      minHeight: 62,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 10,
      borderRadius: theme.radius.medium,
      borderWidth: 1,
      backgroundColor: theme.colors.surfaceMuted,
    },
    cardUncertainty: {
      borderColor: 'rgba(251,191,36,0.34)',
    },
    cardRisk: {
      borderColor: 'rgba(45,212,191,0.38)',
    },
    cardLoss: {
      borderColor: 'rgba(251,113,133,0.38)',
    },
    marker: {
      width: 34,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 17,
    },
    markerUncertainty: {
      backgroundColor: 'rgba(251,191,36,0.16)',
    },
    markerRisk: {
      backgroundColor: 'rgba(45,212,191,0.15)',
    },
    markerLoss: {
      backgroundColor: 'rgba(251,113,133,0.15)',
    },
    markerText: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: '900',
    },
    cardCopy: {
      flex: 1,
      gap: 4,
    },
    cardTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    cardTitle: {
      color: theme.colors.text,
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 0.6,
    },
    cardPrompt: {
      color: theme.colors.textMuted,
      fontSize: 9,
      fontWeight: '800',
    },
    cardDetail: {
      color: theme.colors.textMuted,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '600',
    },
    connector: {
      minHeight: 22,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
    },
    connectorText: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: '900',
    },
    connectorLabel: {
      color: theme.colors.textMuted,
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 0.5,
    },
    boundary: {
      marginHorizontal: theme.spacing.md,
      padding: 8,
      borderRadius: theme.radius.small,
      backgroundColor: 'rgba(251,191,36,0.07)',
      borderWidth: 1,
      borderColor: 'rgba(251,191,36,0.22)',
    },
    boundaryText: {
      color: theme.colors.warning,
      fontSize: 9,
      lineHeight: 14,
      fontWeight: '800',
      textAlign: 'center',
    },
    alt: {
      color: theme.colors.textMuted,
      fontSize: 10,
      lineHeight: 14,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
    },
  });
