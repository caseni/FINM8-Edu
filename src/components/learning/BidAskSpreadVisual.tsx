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
          <Text style={styles.title}>{tr ? 'Aynı anda iki fiyat vardır' : 'Two prices exist at the same time'}</Text>
          <Text style={styles.subtitle}>
            {tr ? 'Satmak istediğinde Bid · Almak istediğinde Ask' : 'Bid when selling · Ask when buying'}
          </Text>
        </View>

        <View style={styles.quoteRow}>
          <View style={[styles.quoteCard, styles.bidCard]}>
            <Text style={[styles.quoteEyebrow, styles.bidText]}>BID</Text>
            <Text style={styles.quotePrice}>99</Text>
            <Text style={styles.quoteLabel}>
              {tr ? 'En iyi alış teklifi' : 'Best buy offer'}
            </Text>
            <View style={[styles.actionPill, styles.bidPill]}>
              <Text style={[styles.actionText, styles.bidText]}>
                {tr ? 'ŞİMDİ SAT → 99' : 'SELL NOW → 99'}
              </Text>
            </View>
          </View>

          <View style={styles.spreadColumn}>
            <Text style={styles.spreadEyebrow}>SPREAD</Text>
            <Text style={styles.spreadValue}>2</Text>
            <View style={styles.spreadTrack}>
              <View style={styles.spreadDot} />
              <View style={styles.spreadLine} />
              <View style={styles.spreadDot} />
            </View>
            <Text style={styles.spreadFormula}>101 − 99</Text>
          </View>

          <View style={[styles.quoteCard, styles.askCard]}>
            <Text style={[styles.quoteEyebrow, styles.askText]}>ASK</Text>
            <Text style={styles.quotePrice}>101</Text>
            <Text style={styles.quoteLabel}>
              {tr ? 'En iyi satış teklifi' : 'Best sell offer'}
            </Text>
            <View style={[styles.actionPill, styles.askPill]}>
              <Text style={[styles.actionText, styles.askText]}>
                {tr ? 'ŞİMDİ AL → 101' : 'BUY NOW → 101'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.lastTradeCard}>
          <View style={styles.lastTradeCopy}>
            <Text style={styles.lastTradeEyebrow}>{tr ? 'SON İŞLEM' : 'LAST TRADE'}</Text>
            <Text style={styles.lastTradeText}>
              {tr ? 'Gerçekleşmiş önceki eşleşme; bid veya ask değildir.' : 'A previous completed match; it is not the bid or ask.'}
            </Text>
          </View>
          <Text style={styles.lastTradePrice}>100</Text>
        </View>

        <View style={styles.costRow}>
          <Text style={styles.costMark}>↔</Text>
          <Text style={styles.costText}>
            {tr
              ? 'Spread, işlemin görünür maliyetlerinden biridir.'
              : 'Spread is one visible cost of trading.'}
          </Text>
        </View>

        <Text style={styles.boundary}>
          {tr
            ? 'Emir büyüklüğü mevcut derinliği aşarsa gerçekleşme en iyi bid/ask seviyesinden uzaklaşabilir.'
            : 'If order size exceeds available depth, execution can move away from the best bid or ask.'}
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
      minHeight: 306,
      overflow: 'hidden',
      borderRadius: theme.radius.large,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    canvas: {
      minHeight: 258,
      padding: theme.spacing.md,
      justifyContent: 'center',
      gap: 10,
    },
    header: { alignItems: 'center', gap: 3 },
    title: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: '900',
      textAlign: 'center',
    },
    subtitle: {
      color: theme.colors.textMuted,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '700',
      textAlign: 'center',
    },
    quoteRow: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: 7,
    },
    quoteCard: {
      flex: 1,
      minHeight: 122,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      paddingHorizontal: 7,
      paddingVertical: 9,
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
    },
    bidCard: { borderColor: 'rgba(45,212,191,0.34)' },
    askCard: { borderColor: 'rgba(248,113,113,0.32)' },
    quoteEyebrow: { fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
    bidText: { color: theme.colors.primary },
    askText: { color: theme.colors.risk },
    quotePrice: { color: theme.colors.text, fontSize: 25, fontWeight: '900' },
    quoteLabel: {
      minHeight: 26,
      color: theme.colors.textMuted,
      fontSize: 8,
      lineHeight: 12,
      fontWeight: '700',
      textAlign: 'center',
    },
    actionPill: {
      marginTop: 2,
      paddingHorizontal: 7,
      paddingVertical: 5,
      borderRadius: 999,
      borderWidth: 1,
    },
    bidPill: {
      backgroundColor: 'rgba(45,212,191,0.08)',
      borderColor: 'rgba(45,212,191,0.30)',
    },
    askPill: {
      backgroundColor: 'rgba(248,113,113,0.07)',
      borderColor: 'rgba(248,113,113,0.28)',
    },
    actionText: { fontSize: 8, fontWeight: '900', letterSpacing: 0.25 },
    spreadColumn: {
      width: 72,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      paddingHorizontal: 4,
    },
    spreadEyebrow: {
      color: theme.colors.warning,
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 0.55,
    },
    spreadValue: { color: theme.colors.text, fontSize: 20, fontWeight: '900' },
    spreadTrack: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    spreadDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: theme.colors.warning,
    },
    spreadLine: {
      flex: 1,
      height: 1,
      backgroundColor: 'rgba(251,191,36,0.46)',
    },
    spreadFormula: { color: theme.colors.textMuted, fontSize: 8, fontWeight: '800' },
    lastTradeCard: {
      minHeight: 55,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    lastTradeCopy: { flex: 1, gap: 2 },
    lastTradeEyebrow: {
      color: theme.colors.text,
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 0.55,
    },
    lastTradeText: {
      color: theme.colors.textMuted,
      fontSize: 8,
      lineHeight: 12,
      fontWeight: '700',
    },
    lastTradePrice: { color: theme.colors.textMuted, fontSize: 18, fontWeight: '900' },
    costRow: {
      minHeight: 31,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingHorizontal: 9,
      borderRadius: 9,
      backgroundColor: 'rgba(251,191,36,0.06)',
      borderWidth: 1,
      borderColor: 'rgba(251,191,36,0.18)',
    },
    costMark: { color: theme.colors.warning, fontSize: 13, fontWeight: '900' },
    costText: { color: theme.colors.textMuted, fontSize: 9, lineHeight: 13, fontWeight: '700' },
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
