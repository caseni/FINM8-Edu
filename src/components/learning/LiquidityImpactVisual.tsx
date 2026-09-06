import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface LiquidityImpactVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function LiquidityImpactVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: LiquidityImpactVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Likidite = alıp satmak ne kadar kolay?' : 'Liquidity = how easy is it to buy or sell?'}
          </Text>
          <Text style={styles.subtitle}>
            {tr ? 'Aynı satış, iki farklı piyasada farklı sonuçlanabilir.' : 'The same sale can behave differently in two markets.'}
          </Text>
        </View>

        <View style={styles.orderPill}>
          <Text style={styles.orderLabel}>{tr ? 'SATMAK İSTEDİĞİN' : 'YOU WANT TO SELL'}</Text>
          <Text style={styles.orderValue}>{tr ? '4 BİRİM' : '4 UNITS'}</Text>
        </View>

        <View style={styles.compareRow}>
          <SimpleLiquidityCard
            styles={styles}
            tone="easy"
            eyebrow={tr ? 'DAHA KOLAY' : 'EASIER'}
            title={tr ? 'Yeterli alıcı var' : 'Enough buyers'}
            dots="● ● ● ●"
            result={tr ? 'Fiyat az değişebilir' : 'Price may move less'}
          />
          <SimpleLiquidityCard
            styles={styles}
            tone="hard"
            eyebrow={tr ? 'DAHA ZOR' : 'HARDER'}
            title={tr ? 'Alıcı daha az' : 'Fewer buyers'}
            dots="● · · ·"
            result={tr ? 'Fiyat daha çok değişebilir' : 'Price may move more'}
          />
        </View>

        <View style={styles.coreCard}>
          <Text style={styles.coreEyebrow}>{tr ? 'AKLINDA KALSIN' : 'REMEMBER'}</Text>
          <Text style={styles.coreText}>
            {tr ? 'Likidite yüksekse alıp satmak genellikle daha kolaydır.' : 'Higher liquidity generally makes buying and selling easier.'}
          </Text>
        </View>

        <Text style={styles.boundary}>
          {tr
            ? 'Ekrandaki fiyat, istediğin miktarın tamamını o fiyattan satabileceğini garanti etmez.'
            : 'The displayed price does not guarantee that your full amount can be sold at that price.'}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function SimpleLiquidityCard({
  styles,
  tone,
  eyebrow,
  title,
  dots,
  result,
}: {
  styles: ReturnType<typeof createStyles>;
  tone: 'easy' | 'hard';
  eyebrow: string;
  title: string;
  dots: string;
  result: string;
}) {
  const easy = tone === 'easy';

  return (
    <View style={[styles.card, easy ? styles.easyCard : styles.hardCard]}>
      <Text style={[styles.cardEyebrow, easy ? styles.easyText : styles.hardText]}>{eyebrow}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={[styles.dots, easy ? styles.easyText : styles.hardText]}>{dots}</Text>
      <Text style={styles.result}>{result}</Text>
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
      padding: theme.spacing.md,
      gap: 12,
    },
    header: { alignItems: 'center', gap: 4 },
    title: {
      color: theme.colors.text,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '900',
      textAlign: 'center',
    },
    subtitle: {
      color: theme.colors.textMuted,
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '700',
      textAlign: 'center',
    },
    orderPill: {
      minHeight: 42,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    orderLabel: {
      color: theme.colors.textMuted,
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.5,
    },
    orderValue: { color: theme.colors.text, fontSize: 14, fontWeight: '900' },
    compareRow: { flexDirection: 'row', gap: 9 },
    card: {
      flex: 1,
      minHeight: 125,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      padding: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
    },
    easyCard: { borderColor: 'rgba(45,212,191,0.32)' },
    hardCard: { borderColor: 'rgba(248,113,113,0.30)' },
    cardEyebrow: { fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    cardTitle: { color: theme.colors.text, fontSize: 13, lineHeight: 18, fontWeight: '900', textAlign: 'center' },
    dots: { fontSize: 18, fontWeight: '900', letterSpacing: 2 },
    result: { color: theme.colors.textMuted, fontSize: 10, lineHeight: 14, fontWeight: '700', textAlign: 'center' },
    easyText: { color: theme.colors.primary },
    hardText: { color: theme.colors.risk },
    coreCard: {
      gap: 3,
      padding: 10,
      borderRadius: 10,
      backgroundColor: 'rgba(45,212,191,0.08)',
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.28)',
    },
    coreEyebrow: { color: theme.colors.primary, fontSize: 8, fontWeight: '900', letterSpacing: 0.55 },
    coreText: { color: theme.colors.text, fontSize: 12, lineHeight: 17, fontWeight: '800' },
    boundary: {
      color: theme.colors.textMuted,
      fontSize: 10,
      lineHeight: 14,
      textAlign: 'center',
    },
    footer: {
      minHeight: 44,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    alt: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 15 },
  });
