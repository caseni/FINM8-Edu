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
            {tr ? 'Aynı emir, farklı fiyat etkisi' : 'Same order, different price impact'}
          </Text>
          <Text style={styles.subtitle}>
            {tr
              ? 'Likidite yalnız hacim değil · derinlik + spread + gerçekleşebilirlik'
              : 'Liquidity is not just volume · depth + spread + executability'}
          </Text>
        </View>

        <View style={styles.orderPill}>
          <Text style={styles.orderEyebrow}>{tr ? 'AYNI SATIŞ EMRİ' : 'SAME SELL ORDER'}</Text>
          <Text style={styles.orderSize}>{tr ? '4 BİRİM' : '4 UNITS'}</Text>
        </View>

        <DepthCard
          styles={styles}
          title={tr ? 'DERİN PİYASA' : 'DEEP MARKET'}
          detail={tr ? 'Karşı emir yoğun' : 'More opposing depth'}
          badge={tr ? 'DAR SPREAD' : 'TIGHT SPREAD'}
          levels={[
            { price: '100.0', size: '6', fill: '4 / 6', active: true },
            { price: '99.8', size: '8' },
            { price: '99.6', size: '10' },
          ]}
          resultLabel={tr ? 'ORT. GERÇEKLEŞME' : 'AVG. EXECUTION'}
          resultPrice="100.0"
          impact={tr ? 'Küçük fiyat etkisi' : 'Smaller price impact'}
          tone="deep"
        />

        <DepthCard
          styles={styles}
          title={tr ? 'SIĞ PİYASA' : 'SHALLOW MARKET'}
          detail={tr ? 'Karşı emir az' : 'Less opposing depth'}
          badge={tr ? 'GENİŞ SPREAD' : 'WIDE SPREAD'}
          levels={[
            { price: '100.0', size: '1', fill: '1 / 1', active: true },
            { price: '99.8', size: '1', fill: '1 / 1', active: true },
            { price: '99.6', size: '1', fill: '1 / 1', active: true },
            { price: '99.4', size: '1', fill: '1 / 1', active: true },
          ]}
          resultLabel={tr ? 'ORT. GERÇEKLEŞME' : 'AVG. EXECUTION'}
          resultPrice="99.7"
          impact={tr ? 'Daha büyük fiyat etkisi' : 'Larger price impact'}
          tone="shallow"
        />

        <Text style={styles.boundary}>
          {tr
            ? 'Ekrandaki tek fiyat, istediğin büyüklüğün o fiyattan tamamen gerçekleşeceğini garanti etmez.'
            : 'One displayed price does not guarantee that your full order size can execute there.'}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

interface Level {
  price: string;
  size: string;
  fill?: string;
  active?: boolean;
}

function DepthCard({
  styles,
  title,
  detail,
  badge,
  levels,
  resultLabel,
  resultPrice,
  impact,
  tone,
}: {
  styles: ReturnType<typeof createStyles>;
  title: string;
  detail: string;
  badge: string;
  levels: readonly Level[];
  resultLabel: string;
  resultPrice: string;
  impact: string;
  tone: 'deep' | 'shallow';
}) {
  const deep = tone === 'deep';

  return (
    <View style={[styles.depthCard, deep ? styles.deepCard : styles.shallowCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.headerCopy}>
          <Text style={[styles.cardTitle, deep ? styles.deepText : styles.shallowText]}>
            {title}
          </Text>
          <Text style={styles.cardDetail}>{detail}</Text>
        </View>
        <View style={[styles.badge, deep ? styles.deepBadge : styles.shallowBadge]}>
          <Text style={[styles.badgeText, deep ? styles.deepText : styles.shallowText]}>
            {badge}
          </Text>
        </View>
      </View>

      <View style={styles.bookHeader}>
        <Text style={styles.columnLabel}>BID</Text>
        <Text style={styles.columnLabel}>SIZE</Text>
        <Text style={styles.columnLabel}>FILL</Text>
      </View>

      <View style={styles.levels}>
        {levels.map((level) => (
          <View
            key={`${title}.${level.price}`}
            style={[
              styles.levelRow,
              level.active && (deep ? styles.deepLevelActive : styles.shallowLevelActive),
            ]}
          >
            <Text style={[styles.price, level.active && styles.activePrice]}>{level.price}</Text>
            <View style={styles.depthTrack}>
              <View
                style={[
                  styles.depthFill,
                  deep ? styles.deepDepthFill : styles.shallowDepthFill,
                  { width: Math.min(Number(level.size) * 9, 92) },
                ]}
              />
            </View>
            <Text style={styles.size}>{level.fill ?? level.size}</Text>
          </View>
        ))}
      </View>

      <View style={styles.resultRow}>
        <View style={styles.resultCopy}>
          <Text style={styles.resultLabel}>{resultLabel}</Text>
          <Text style={styles.impact}>{impact}</Text>
        </View>
        <Text style={[styles.resultPrice, deep ? styles.deepText : styles.shallowText]}>
          {resultPrice}
        </Text>
      </View>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      minHeight: 420,
      overflow: 'hidden',
      borderRadius: theme.radius.large,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    canvas: {
      padding: theme.spacing.md,
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
      fontSize: 9,
      lineHeight: 13,
      fontWeight: '700',
      textAlign: 'center',
    },
    orderPill: {
      minHeight: 38,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      paddingHorizontal: 10,
      borderRadius: 10,
      backgroundColor: 'rgba(45,212,191,0.08)',
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.30)',
    },
    orderEyebrow: {
      color: theme.colors.primary,
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 0.55,
    },
    orderSize: { color: theme.colors.text, fontSize: 12, fontWeight: '900' },
    depthCard: {
      gap: 7,
      padding: 9,
      borderRadius: 11,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
    },
    deepCard: { borderColor: 'rgba(45,212,191,0.30)' },
    shallowCard: { borderColor: 'rgba(248,113,113,0.30)' },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    headerCopy: { flex: 1, gap: 1 },
    cardTitle: { fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    cardDetail: { color: theme.colors.textMuted, fontSize: 8, lineHeight: 11, fontWeight: '700' },
    badge: {
      paddingHorizontal: 7,
      paddingVertical: 4,
      borderRadius: 999,
      borderWidth: 1,
    },
    deepBadge: {
      backgroundColor: 'rgba(45,212,191,0.08)',
      borderColor: 'rgba(45,212,191,0.28)',
    },
    shallowBadge: {
      backgroundColor: 'rgba(248,113,113,0.07)',
      borderColor: 'rgba(248,113,113,0.26)',
    },
    badgeText: { fontSize: 7, fontWeight: '900', letterSpacing: 0.4 },
    deepText: { color: theme.colors.primary },
    shallowText: { color: theme.colors.risk },
    bookHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 7,
    },
    columnLabel: {
      width: '30%',
      color: theme.colors.textMuted,
      fontSize: 7,
      fontWeight: '900',
      letterSpacing: 0.45,
    },
    levels: { gap: 4 },
    levelRow: {
      minHeight: 25,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 7,
      borderRadius: 7,
      borderWidth: 1,
      borderColor: 'rgba(159,176,195,0.10)',
      backgroundColor: 'rgba(159,176,195,0.04)',
    },
    deepLevelActive: {
      backgroundColor: 'rgba(45,212,191,0.08)',
      borderColor: 'rgba(45,212,191,0.30)',
    },
    shallowLevelActive: {
      backgroundColor: 'rgba(248,113,113,0.06)',
      borderColor: 'rgba(248,113,113,0.24)',
    },
    price: {
      width: 45,
      color: theme.colors.textMuted,
      fontSize: 9,
      fontWeight: '800',
    },
    activePrice: { color: theme.colors.text, fontWeight: '900' },
    depthTrack: {
      flex: 1,
      height: 5,
      overflow: 'hidden',
      borderRadius: 999,
      backgroundColor: 'rgba(159,176,195,0.10)',
    },
    depthFill: { height: '100%', borderRadius: 999 },
    deepDepthFill: { backgroundColor: 'rgba(45,212,191,0.40)' },
    shallowDepthFill: { backgroundColor: 'rgba(248,113,113,0.32)' },
    size: {
      width: 43,
      color: theme.colors.textMuted,
      fontSize: 8,
      fontWeight: '800',
      textAlign: 'right',
    },
    resultRow: {
      minHeight: 42,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 9,
      backgroundColor: 'rgba(159,176,195,0.05)',
      borderWidth: 1,
      borderColor: 'rgba(159,176,195,0.10)',
    },
    resultCopy: { flex: 1, gap: 1 },
    resultLabel: { color: theme.colors.text, fontSize: 8, fontWeight: '900', letterSpacing: 0.45 },
    impact: { color: theme.colors.textMuted, fontSize: 8, lineHeight: 11, fontWeight: '700' },
    resultPrice: { fontSize: 17, fontWeight: '900' },
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
