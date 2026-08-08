import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface TrendStructureVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

type Tone = 'up' | 'down' | 'sideways';

type PointSpec = {
  top: number;
  label?: string;
};

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
          <Text style={styles.title}>
            {tr ? 'Trend = bir mum değil, salınım dizisi' : 'Trend = a swing sequence, not one candle'}
          </Text>
          <Text style={styles.subtitle}>
            {tr ? 'Tepeler ve dipler zaman içinde nasıl ilerliyor?' : 'How do highs and lows progress over time?'}
          </Text>
        </View>

        <View style={styles.cards}>
          <StructureCard
            styles={styles}
            tone="up"
            title={tr ? 'YÜKSELİŞ' : 'UPWARD'}
            summary={tr ? 'Tepeler ↑ · Dipler ↑' : 'Highs ↑ · Lows ↑'}
            detail={tr ? 'HH = daha yüksek tepe · HL = daha yüksek dip' : 'HH = higher high · HL = higher low'}
            points={[
              { top: 50 },
              { top: 26 },
              { top: 38, label: 'HL' },
              { top: 10, label: 'HH' },
            ]}
            arrows={['↗', '↘', '↗']}
          />
          <StructureCard
            styles={styles}
            tone="down"
            title={tr ? 'DÜŞÜŞ' : 'DOWNWARD'}
            summary={tr ? 'Tepeler ↓ · Dipler ↓' : 'Highs ↓ · Lows ↓'}
            detail={tr ? 'LH = daha düşük tepe · LL = daha düşük dip' : 'LH = lower high · LL = lower low'}
            points={[
              { top: 10 },
              { top: 36 },
              { top: 26, label: 'LH' },
              { top: 52, label: 'LL' },
            ]}
            arrows={['↘', '↗', '↘']}
          />
          <StructureCard
            styles={styles}
            tone="sideways"
            title={tr ? 'YATAY' : 'SIDEWAYS'}
            summary={tr ? 'Belirgin ilerleme yok' : 'No clear progress'}
            detail={tr ? 'Tepeler ve dipler benzer alanlarda kalır' : 'Highs and lows stay in similar areas'}
            points={[
              { top: 38 },
              { top: 18 },
              { top: 39 },
              { top: 19 },
            ]}
            arrows={['↗', '↘', '↗']}
          />
        </View>

        <View style={styles.boundary}>
          <Text style={styles.boundaryMark}>≠</Text>
          <View style={styles.boundaryCopy}>
            <Text style={styles.boundaryTitle}>
              {tr ? 'Tek mum = trend değil' : 'One candle ≠ a trend'}
            </Text>
            <Text style={styles.boundaryText}>
              {tr
                ? 'Son mumun rengi tek başına trendi belirlemez. Salınım dizisine ve zaman dilimine bakılır.'
                : 'The last candle color alone does not define a trend. Read the swing sequence and timeframe.'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function StructureCard({
  styles,
  tone,
  title,
  summary,
  detail,
  points,
  arrows,
}: {
  styles: ReturnType<typeof createStyles>;
  tone: Tone;
  title: string;
  summary: string;
  detail: string;
  points: readonly PointSpec[];
  arrows: readonly string[];
}) {
  const accent = tone === 'up' ? styles.upText : tone === 'down' ? styles.downText : styles.sidewaysText;
  const card = tone === 'up' ? styles.upCard : tone === 'down' ? styles.downCard : styles.sidewaysCard;
  const dot = tone === 'up' ? styles.upDot : tone === 'down' ? styles.downDot : styles.sidewaysDot;

  return (
    <View style={[styles.card, card]}>
      <View style={styles.cardCopy}>
        <Text style={[styles.cardTitle, accent]}>{title}</Text>
        <Text style={styles.summary}>{summary}</Text>
        <Text style={styles.detail}>{detail}</Text>
      </View>
      <View style={styles.graph}>
        {points.map((point, index) => (
          <React.Fragment key={`${title}.${index}`}>
            <View style={styles.pointSlot}>
              <View style={[styles.point, dot, { top: point.top }]} />
              {point.label ? (
                <Text style={[styles.pointLabel, accent, { top: Math.max(0, point.top - 14) }]}>{point.label}</Text>
              ) : null}
            </View>
            {index < arrows.length ? (
              <Text style={[styles.arrow, accent]}>{arrows[index]}</Text>
            ) : null}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      minHeight: 442,
      overflow: 'hidden',
      borderRadius: theme.radius.large,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    canvas: {
      minHeight: 394,
      padding: theme.spacing.md,
      justifyContent: 'center',
      gap: 11,
    },
    header: { alignItems: 'center', gap: 3 },
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
      lineHeight: 15,
      fontWeight: '700',
      textAlign: 'center',
    },
    cards: { gap: 8 },
    card: {
      minHeight: 92,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 11,
      paddingVertical: 9,
      borderRadius: 11,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
    },
    upCard: { borderColor: 'rgba(45,212,191,0.34)' },
    downCard: { borderColor: 'rgba(248,113,113,0.24)' },
    sidewaysCard: { borderColor: 'rgba(159,176,195,0.22)' },
    cardCopy: { width: 138, gap: 3 },
    cardTitle: { fontSize: 9, lineHeight: 12, fontWeight: '900', letterSpacing: 0.55 },
    upText: { color: theme.colors.primary },
    downText: { color: theme.colors.risk },
    sidewaysText: { color: theme.colors.textMuted },
    summary: { color: theme.colors.text, fontSize: 11, lineHeight: 15, fontWeight: '900' },
    detail: { color: theme.colors.textMuted, fontSize: 9, lineHeight: 13, fontWeight: '700' },
    graph: {
      flex: 1,
      minHeight: 66,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    pointSlot: { flex: 1, maxWidth: 34, height: 66, position: 'relative' },
    point: {
      position: 'absolute',
      alignSelf: 'center',
      width: 9,
      height: 9,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.28)',
    },
    upDot: { backgroundColor: theme.colors.primary },
    downDot: { backgroundColor: theme.colors.risk },
    sidewaysDot: { backgroundColor: theme.colors.textMuted },
    pointLabel: {
      position: 'absolute',
      alignSelf: 'center',
      width: 28,
      textAlign: 'center',
      fontSize: 8,
      lineHeight: 11,
      fontWeight: '900',
    },
    arrow: {
      width: 18,
      marginTop: 25,
      textAlign: 'center',
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '900',
    },
    boundary: {
      minHeight: 62,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 11,
      paddingVertical: 9,
      borderRadius: 10,
      backgroundColor: 'rgba(45,212,191,0.06)',
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.20)',
    },
    boundaryMark: { color: theme.colors.primary, fontSize: 23, fontWeight: '900' },
    boundaryCopy: { flex: 1, gap: 2 },
    boundaryTitle: { color: theme.colors.text, fontSize: 10, lineHeight: 14, fontWeight: '900' },
    boundaryText: { color: theme.colors.textMuted, fontSize: 9, lineHeight: 13, fontWeight: '700' },
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
