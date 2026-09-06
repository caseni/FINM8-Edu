import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface PositionSizingVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function PositionSizingVisual({
  language,
  theme = defaultLearningTheme,
}: PositionSizingVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';
  const accessibilityLabel = tr
    ? 'Küçük ve büyük pozisyon büyüklüklerini karşılaştıran sade eğitim şeması'
    : 'Simple training diagram comparing smaller and larger position sizes';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Pozisyon büyüklüğü: ne kadar büyük?' : 'Position size: how large is the position?'}
          </Text>
          <Text style={styles.subtitle}>
            {tr
              ? 'Aynı piyasa fikri, farklı büyüklükte farklı sonuçlar doğurabilir.'
              : 'The same market idea can lead to different outcomes at different sizes.'}
          </Text>
        </View>

        <View style={styles.comparison}>
          <SizeCard
            styles={styles}
            tone="small"
            title={tr ? 'DAHA KÜÇÜK POZİSYON' : 'SMALLER POSITION'}
            blocks={2}
          />
          <SizeCard
            styles={styles}
            tone="large"
            title={tr ? 'DAHA BÜYÜK POZİSYON' : 'LARGER POSITION'}
            blocks={5}
          />
        </View>

        <View style={styles.takeaway}>
          <Text style={styles.takeawayMark}>↕</Text>
          <Text style={styles.takeawayText}>
            {tr
              ? 'Büyüklük arttıkça aynı fiyat hareketinin hesabındaki etkisi de değişir.'
              : 'As size increases, the same price move affects the account differently.'}
          </Text>
        </View>

        <View style={styles.boundary}>
          <Text style={styles.boundaryText}>
            {tr
              ? 'Daha büyük pozisyon, daha iyi işlem demek değildir.'
              : 'A larger position does not mean a better trade.'}
          </Text>
        </View>
      </View>
    </View>
  );
}

function SizeCard({
  styles,
  tone,
  title,
  blocks,
}: {
  styles: ReturnType<typeof createStyles>;
  tone: 'small' | 'large';
  title: string;
  blocks: number;
}) {
  const large = tone === 'large';

  return (
    <View style={[styles.sizeCard, large ? styles.largeCard : styles.smallCard]}>
      <Text style={[styles.cardTitle, large ? styles.largeText : styles.smallText]}>{title}</Text>
      <View style={styles.positionStage}>
        <View style={styles.referenceLine} />
        <View style={styles.blockRow}>
          {Array.from({ length: blocks }).map((_, index) => (
            <View
              key={`${tone}.${index}`}
              style={[styles.positionBlock, large ? styles.largeBlock : styles.smallBlock]}
            />
          ))}
        </View>
      </View>
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
      padding: theme.spacing.md,
      gap: 14,
    },
    header: {
      gap: 4,
      alignItems: 'center',
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
    comparison: {
      flexDirection: 'row',
      gap: 10,
    },
    sizeCard: {
      flex: 1,
      gap: 10,
      padding: 12,
      borderRadius: 13,
      borderWidth: 1,
      backgroundColor: theme.colors.surfaceMuted,
    },
    smallCard: {
      borderColor: 'rgba(45,212,191,0.24)',
    },
    largeCard: {
      borderColor: 'rgba(251,191,36,0.24)',
    },
    cardTitle: {
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '900',
      letterSpacing: 0.5,
      textAlign: 'center',
    },
    smallText: {
      color: theme.colors.primary,
    },
    largeText: {
      color: theme.colors.warning,
    },
    positionStage: {
      height: 92,
      position: 'relative',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: 10,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 14,
    },
    referenceLine: {
      position: 'absolute',
      left: 12,
      right: 12,
      top: '50%',
      height: 1,
      backgroundColor: theme.colors.border,
    },
    blockRow: {
      minHeight: 42,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
    },
    positionBlock: {
      width: 14,
      height: 34,
      borderRadius: 4,
      borderWidth: 1,
    },
    smallBlock: {
      backgroundColor: 'rgba(45,212,191,0.13)',
      borderColor: 'rgba(45,212,191,0.34)',
    },
    largeBlock: {
      backgroundColor: 'rgba(251,191,36,0.12)',
      borderColor: 'rgba(251,191,36,0.34)',
    },
    takeaway: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 11,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(159,176,195,0.18)',
      backgroundColor: 'rgba(159,176,195,0.04)',
    },
    takeawayMark: {
      width: 24,
      color: theme.colors.textMuted,
      fontSize: 21,
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
