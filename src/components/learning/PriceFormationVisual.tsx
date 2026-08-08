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
            {tr ? 'Fiyat, eşleşen emirden doğar' : 'Price forms from a matched order'}
          </Text>
          <Text style={styles.subtitle}>
            {tr ? 'Alıcı ne öder? · Satıcı ne kabul eder?' : 'What will a buyer pay? · What will a seller accept?'}
          </Text>
        </View>

        <View style={styles.bookRow}>
          <OrderBookSide
            styles={styles}
            title={tr ? 'ALICILAR' : 'BUYERS'}
            caption={tr ? 'ödemeye razı' : 'willing to pay'}
            levels={['99.6', '99.8', '100.0']}
            matchIndex={2}
            tone="buy"
          />
          <OrderBookSide
            styles={styles}
            title={tr ? 'SATICILAR' : 'SELLERS'}
            caption={tr ? 'kabul etmeye razı' : 'willing to accept'}
            levels={['100.4', '100.2', '100.0']}
            matchIndex={2}
            tone="sell"
          />
        </View>

        <View style={styles.matchFlow}>
          <Text style={styles.flowArrow}>↘</Text>
          <View style={styles.matchCard}>
            <Text style={styles.matchEyebrow}>{tr ? 'EŞLEŞME' : 'MATCH'}</Text>
            <Text style={styles.matchPrice}>100.0</Text>
            <Text style={styles.matchNote}>
              {tr ? 'alış 100.0 = satış 100.0' : 'buy 100.0 = sell 100.0'}
            </Text>
          </View>
          <Text style={styles.flowArrow}>↙</Text>
        </View>

        <View style={styles.lastTradeCard}>
          <View>
            <Text style={styles.lastTradeLabel}>{tr ? 'SON İŞLEM' : 'LAST TRADE'}</Text>
            <Text style={styles.lastTradeNote}>
              {tr ? 'gerçekleşmiş son eşleşme' : 'latest completed match'}
            </Text>
          </View>
          <Text style={styles.lastTradePrice}>100.0</Text>
        </View>

        <Text style={styles.boundary}>
          {tr
            ? 'Yeni emirler geldikçe denge değişebilir; son fiyat sonraki fiyatı garanti etmez.'
            : 'New orders can change the balance; the last price does not guarantee the next price.'}
        </Text>
      </View>
      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function OrderBookSide({
  styles,
  title,
  caption,
  levels,
  matchIndex,
  tone,
}: {
  styles: ReturnType<typeof createStyles>;
  title: string;
  caption: string;
  levels: readonly string[];
  matchIndex: number;
  tone: 'buy' | 'sell';
}) {
  const buy = tone === 'buy';
  return (
    <View style={[styles.bookCard, buy ? styles.buyCard : styles.sellCard]}>
      <View style={styles.bookHeader}>
        <Text style={[styles.bookTitle, buy ? styles.buyText : styles.sellText]}>{title}</Text>
        <Text style={styles.bookCaption}>{caption}</Text>
      </View>
      <View style={styles.levels}>
        {levels.map((level, index) => {
          const matched = index === matchIndex;
          return (
            <View
              key={`${title}.${level}`}
              style={[
                styles.level,
                matched && styles.levelMatched,
                matched && (buy ? styles.levelMatchedBuy : styles.levelMatchedSell),
              ]}
            >
              <Text style={styles.levelLabel}>{matched ? (buy ? 'BID' : 'ASK') : '•'}</Text>
              <Text style={[styles.levelPrice, matched && styles.levelPriceMatched]}>{level}</Text>
            </View>
          );
        })}
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
      gap: 9,
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
    bookRow: { flexDirection: 'row', gap: 8 },
    bookCard: {
      flex: 1,
      gap: 7,
      padding: 9,
      borderRadius: 11,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
    },
    buyCard: { borderColor: 'rgba(45,212,191,0.34)' },
    sellCard: { borderColor: 'rgba(248,113,113,0.32)' },
    bookHeader: { gap: 1 },
    bookTitle: { fontSize: 9, fontWeight: '900', letterSpacing: 0.65 },
    bookCaption: { color: theme.colors.textMuted, fontSize: 8, lineHeight: 11, fontWeight: '700' },
    buyText: { color: theme.colors.primary },
    sellText: { color: theme.colors.risk },
    levels: { gap: 4 },
    level: {
      minHeight: 25,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 5,
      paddingHorizontal: 7,
      borderRadius: 7,
      backgroundColor: 'rgba(159,176,195,0.06)',
      borderWidth: 1,
      borderColor: 'rgba(159,176,195,0.10)',
    },
    levelMatched: { borderWidth: 1 },
    levelMatchedBuy: {
      backgroundColor: 'rgba(45,212,191,0.10)',
      borderColor: 'rgba(45,212,191,0.42)',
    },
    levelMatchedSell: {
      backgroundColor: 'rgba(248,113,113,0.08)',
      borderColor: 'rgba(248,113,113,0.38)',
    },
    levelLabel: { color: theme.colors.textMuted, fontSize: 8, fontWeight: '900' },
    levelPrice: { color: theme.colors.textMuted, fontSize: 10, fontWeight: '800' },
    levelPriceMatched: { color: theme.colors.text, fontSize: 11, fontWeight: '900' },
    matchFlow: {
      minHeight: 54,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    flowArrow: { color: theme.colors.primary, fontSize: 17, fontWeight: '900' },
    matchCard: {
      minWidth: 132,
      alignItems: 'center',
      gap: 1,
      paddingHorizontal: 13,
      paddingVertical: 7,
      borderRadius: 11,
      backgroundColor: 'rgba(45,212,191,0.09)',
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.38)',
    },
    matchEyebrow: { color: theme.colors.primary, fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
    matchPrice: { color: theme.colors.text, fontSize: 18, fontWeight: '900' },
    matchNote: { color: theme.colors.textMuted, fontSize: 8, fontWeight: '700' },
    lastTradeCard: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 10,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    lastTradeLabel: { color: theme.colors.text, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    lastTradeNote: { color: theme.colors.textMuted, fontSize: 8, lineHeight: 11, fontWeight: '700' },
    lastTradePrice: { color: theme.colors.primary, fontSize: 18, fontWeight: '900' },
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
