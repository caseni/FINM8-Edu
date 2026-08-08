import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface TrendStructureVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

type TrendTone = 'up' | 'down' | 'sideways';

export function TrendStructureVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: TrendStructureVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{tr ? 'TRENDİ OKUMAK' : 'READING TREND'}</Text>
          <Text style={styles.title}>
            {tr ? 'Trend = fiyatın zaman içindeki genel yapısı' : 'Trend = the broader price structure over time'}
          </Text>
          <Text style={styles.subtitle}>
            {tr ? 'Tek bir muma değil, hareketlerin birlikte nasıl ilerlediğine bak.' : 'Look at how moves progress together, not at one candle.'}
          </Text>
        </View>

        <View style={styles.cards}>
          <TrendCard
            styles={styles}
            tone="up"
            symbol="↗"
            title={tr ? 'YÜKSELİŞ' : 'UPWARD'}
            copy={tr ? 'Tepeler ve dipler giderek yükseliyor.' : 'Highs and lows are generally moving higher.'}
          />
          <TrendCard
            styles={styles}
            tone="down"
            symbol="↘"
            title={tr ? 'DÜŞÜŞ' : 'DOWNWARD'}
            copy={tr ? 'Tepeler ve dipler giderek düşüyor.' : 'Highs and lows are generally moving lower.'}
          />
          <TrendCard
            styles={styles}
            tone="sideways"
            symbol="↔"
            title={tr ? 'YATAY' : 'SIDEWAYS'}
            copy={tr ? 'Belirgin ilerleme yok; fiyat benzer alanlarda gidip geliyor.' : 'There is no clear progress; price moves around similar areas.'}
          />
        </View>

        <View style={styles.boundary}>
          <Text style={styles.boundaryMark}>≠</Text>
          <Text style={styles.boundaryText}>
            {tr ? 'Tek yeşil mum = yükseliş trendi değildir.' : 'One green candle does not equal an uptrend.'}
          </Text>
        </View>

        <Text style={styles.contextNote}>
          {tr ? 'Trend yorumu her zaman seçtiğin zaman dilimine aittir.' : 'A trend reading always belongs to the timeframe you selected.'}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function TrendCard({
  styles,
  tone,
  symbol,
  title,
  copy,
}: {
  styles: ReturnType<typeof createStyles>;
  tone: TrendTone;
  symbol: string;
  title: string;
  copy: string;
}) {
  const accent =
    tone === 'up' ? styles.upText : tone === 'down' ? styles.downText : styles.sidewaysText;
  const card =
    tone === 'up' ? styles.upCard : tone === 'down' ? styles.downCard : styles.sidewaysCard;

  return (
    <View style={[styles.card, card]}>
      <Text style={[styles.symbol, accent]}>{symbol}</Text>
      <View style={styles.cardCopy}>
        <Text style={[styles.cardTitle, accent]}>{title}</Text>
        <Text style={styles.cardText}>{copy}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      minHeight: 330,
      overflow: 'hidden',
      borderRadius: theme.radius.large,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    canvas: {
      minHeight: 282,
      padding: theme.spacing.md,
      justifyContent: 'center',
      gap: 11,
    },
    header: {
      alignItems: 'center',
      gap: 3,
    },
    eyebrow: {
      color: theme.colors.primary,
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 0.7,
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
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '700',
      textAlign: 'center',
    },
    cards: {
      gap: 7,
    },
    card: {
      minHeight: 58,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 11,
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderRadius: 11,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
    },
    upCard: {
      borderColor: 'rgba(45,212,191,0.30)',
    },
    downCard: {
      borderColor: 'rgba(248,113,113,0.26)',
    },
    sidewaysCard: {
      borderColor: 'rgba(159,176,195,0.22)',
    },
    symbol: {
      width: 32,
      fontSize: 25,
      lineHeight: 30,
      fontWeight: '900',
      textAlign: 'center',
    },
    cardCopy: {
      flex: 1,
      gap: 2,
    },
    cardTitle: {
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.55,
    },
    cardText: {
      color: theme.colors.text,
      fontSize: 11,
      lineHeight: 15,
      fontWeight: '800',
    },
    upText: {
      color: theme.colors.primary,
    },
    downText: {
      color: theme.colors.risk,
    },
    sidewaysText: {
      color: theme.colors.textMuted,
    },
    boundary: {
      minHeight: 40,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 10,
      backgroundColor: 'rgba(45,212,191,0.06)',
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.20)',
    },
    boundaryMark: {
      color: theme.colors.primary,
      fontSize: 20,
      fontWeight: '900',
    },
    boundaryText: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '800',
    },
    contextNote: {
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
    alt: {
      color: theme.colors.textMuted,
      fontSize: 11,
      lineHeight: 15,
    },
  });
