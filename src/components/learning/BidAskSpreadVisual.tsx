import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface BidAskSpreadVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function BidAskSpreadVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: BidAskSpreadVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Alıcı ve satıcı aynı fiyatı istemeyebilir' : 'Buyer and seller may want different prices'}
          </Text>
          <Text style={styles.subtitle}>
            {tr ? 'Bid = alıcının teklifi · Ask = satıcının istediği fiyat' : 'Bid = buyer offer · Ask = seller asking price'}
          </Text>
        </View>

        <View style={styles.quoteRow}>
          <View style={[styles.quoteCard, styles.bidCard]}>
            <Text style={[styles.quoteEyebrow, styles.bidText]}>{tr ? 'ALICI (BID)' : 'BUYER (BID)'}</Text>
            <Text style={styles.quotePrice}>99</Text>
            <Text style={styles.quoteLabel}>{tr ? '“99 öderim”' : '“I will pay 99”'}</Text>
          </View>

          <View style={[styles.quoteCard, styles.askCard]}>
            <Text style={[styles.quoteEyebrow, styles.askText]}>{tr ? 'SATICI (ASK)' : 'SELLER (ASK)'}</Text>
            <Text style={styles.quotePrice}>101</Text>
            <Text style={styles.quoteLabel}>{tr ? '“101’e satarım”' : '“I will sell at 101”'}</Text>
          </View>
        </View>

        <View style={styles.spreadCard}>
          <Text style={styles.spreadEyebrow}>{tr ? 'ARADAKİ FARK' : 'THE GAP'}</Text>
          <Text style={styles.spreadMath}>101 − 99 = 2</Text>
          <Text style={styles.spreadLabel}>{tr ? 'Bu farka spread denir.' : 'This gap is called the spread.'}</Text>
        </View>

        <View style={styles.coreCard}>
          <Text style={styles.coreEyebrow}>{tr ? 'AKLINDA KALSIN' : 'REMEMBER'}</Text>
          <Text style={styles.coreText}>
            {tr ? 'Bid = alış teklifi · Ask = satış teklifi · Spread = aradaki fark' : 'Bid = buy offer · Ask = sell offer · Spread = the difference'}
          </Text>
        </View>

        <Text style={styles.boundary}>
          {tr
            ? 'Spread, işlem maliyetinin görünen parçalarından biridir.'
            : 'The spread is one visible part of transaction cost.'}
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
      minHeight: 300,
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
    quoteRow: {
      flexDirection: 'row',
      gap: 9,
    },
    quoteCard: {
      flex: 1,
      minHeight: 112,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      padding: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
    },
    bidCard: { borderColor: 'rgba(45,212,191,0.32)' },
    askCard: { borderColor: 'rgba(248,113,113,0.30)' },
    quoteEyebrow: { fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
    bidText: { color: theme.colors.primary },
    askText: { color: theme.colors.risk },
    quotePrice: { color: theme.colors.text, fontSize: 28, fontWeight: '900' },
    quoteLabel: {
      color: theme.colors.textMuted,
      fontSize: 11,
      lineHeight: 15,
      fontWeight: '700',
      textAlign: 'center',
    },
    spreadCard: {
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 11,
      backgroundColor: 'rgba(251,191,36,0.06)',
      borderWidth: 1,
      borderColor: 'rgba(251,191,36,0.22)',
    },
    spreadEyebrow: {
      color: theme.colors.warning,
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.55,
    },
    spreadMath: { color: theme.colors.text, fontSize: 20, fontWeight: '900' },
    spreadLabel: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 15, fontWeight: '700' },
    coreCard: {
      gap: 3,
      paddingHorizontal: 11,
      paddingVertical: 9,
      borderRadius: 10,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    coreEyebrow: { color: theme.colors.primary, fontSize: 8, fontWeight: '900', letterSpacing: 0.55 },
    coreText: { color: theme.colors.text, fontSize: 11, lineHeight: 16, fontWeight: '800' },
    boundary: {
      color: theme.colors.textMuted,
      fontSize: 9,
      lineHeight: 13,
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
