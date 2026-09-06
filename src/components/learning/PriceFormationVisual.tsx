import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface PriceFormationVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function PriceFormationVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: PriceFormationVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Fiyat, alıcı ve satıcı buluşunca oluşur' : 'Price forms when a buyer and seller meet'}
          </Text>
          <Text style={styles.subtitle}>
            {tr ? 'Aynı fiyatta anlaşırlar → işlem gerçekleşir' : 'They agree on the same price → a trade happens'}
          </Text>
        </View>

        <View style={styles.matchRow}>
          <SimpleSide
            styles={styles}
            label={tr ? 'ALICI' : 'BUYER'}
            note={tr ? '100 ödemeye razı' : 'willing to pay 100'}
            tone="buy"
          />

          <Text style={styles.plus}>+</Text>

          <SimpleSide
            styles={styles}
            label={tr ? 'SATICI' : 'SELLER'}
            note={tr ? '100 kabul ediyor' : 'accepts 100'}
            tone="sell"
          />
        </View>

        <Text style={styles.arrow}>↓</Text>

        <View style={styles.tradeCard}>
          <Text style={styles.tradeEyebrow}>{tr ? 'İŞLEM GERÇEKLEŞİR' : 'TRADE HAPPENS'}</Text>
          <Text style={styles.tradePrice}>100</Text>
          <Text style={styles.tradeNote}>
            {tr ? 'Ekrandaki son fiyat, bu son eşleşmeyi gösterir.' : 'The last price on screen shows this latest match.'}
          </Text>
        </View>

        <View style={styles.nextCard}>
          <Text style={styles.nextText}>
            {tr
              ? 'Yeni alıcılar veya satıcılar farklı fiyatlar isterse sonraki fiyat değişebilir.'
              : 'If new buyers or sellers want different prices, the next price can change.'}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function SimpleSide({
  styles,
  label,
  note,
  tone,
}: {
  styles: ReturnType<typeof createStyles>;
  label: string;
  note: string;
  tone: 'buy' | 'sell';
}) {
  const buy = tone === 'buy';
  return (
    <View style={[styles.sideCard, buy ? styles.buyCard : styles.sellCard]}>
      <Text style={[styles.sideLabel, buy ? styles.buyText : styles.sellText]}>{label}</Text>
      <Text style={styles.sidePrice}>100</Text>
      <Text style={styles.sideNote}>{note}</Text>
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
      minHeight: 250,
      padding: theme.spacing.md,
      justifyContent: 'center',
      gap: 10,
    },
    header: { alignItems: 'center', gap: 4 },
    title: {
      color: theme.colors.text,
      fontSize: 16,
      lineHeight: 21,
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
    matchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    sideCard: {
      flex: 1,
      minHeight: 86,
      maxWidth: 190,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      padding: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
    },
    buyCard: { borderColor: 'rgba(45,212,191,0.36)' },
    sellCard: { borderColor: 'rgba(248,113,113,0.34)' },
    sideLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 0.7 },
    buyText: { color: theme.colors.primary },
    sellText: { color: theme.colors.risk },
    sidePrice: { color: theme.colors.text, fontSize: 22, fontWeight: '900' },
    sideNote: {
      color: theme.colors.textMuted,
      fontSize: 9,
      lineHeight: 13,
      fontWeight: '700',
      textAlign: 'center',
    },
    plus: { color: theme.colors.textMuted, fontSize: 20, fontWeight: '900' },
    arrow: {
      color: theme.colors.primary,
      fontSize: 20,
      lineHeight: 20,
      fontWeight: '900',
      textAlign: 'center',
    },
    tradeCard: {
      alignItems: 'center',
      gap: 2,
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderRadius: 12,
      backgroundColor: 'rgba(45,212,191,0.09)',
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.40)',
    },
    tradeEyebrow: {
      color: theme.colors.primary,
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.7,
    },
    tradePrice: { color: theme.colors.text, fontSize: 24, fontWeight: '900' },
    tradeNote: {
      color: theme.colors.textMuted,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '700',
      textAlign: 'center',
    },
    nextCard: {
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 9,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    nextText: {
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
