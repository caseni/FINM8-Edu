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
              { top: 55 },
              { top: 30 },
              { top: 42, label: 'HL' },
              { top: 14, label: 'HH' },
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
              { top: 14 },
              { top: 40 },
              { top: 30, label: 'LH' },
              { top: 58, label: 'LL' },
            ]}
            arrows={['↘', '↗', '↘']}
          />
          <StructureCard
            styles={styles}
            tone="sideways"
            title={tr ? 'YATAY' : 'SIDEWAYS'}
            summary={tr ? 'Belirgin ilerleme yok' : 'No clear progress'}
            detail={tr ? 'Tepeler ve dipler aynı alan içinde kalır' : 'Highs and lows stay in a similar area'}
            points={[
              { top: 44 },
              { top: 22 },
              { top: 45 },
              { top: 23 },
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
                ? 'Son mumun rengi tek başına trendi belirlemez; salınım dizisine ve zaman dilimine bakılır.'
                : 'The last candle color alone does not define a trend; read the swing sequence and timeframe.'}
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
      <Text style={[styles.cardTitle, accent]}>{title}</Text>
      <View style={styles.graph}>
        {points.map((point, index) => (
          <React.Fragment key={`${title}.${index}`}>
            <View style={styles.pointSlot}>
              <View style={[styles.point, dot, { top: point.top }]} />
              {point.label ? (
                <Text style={[styles.pointLabel, accent, { top: Math.max(0, point.top - 12) }]}>{point.label}</Text>
              ) : null}
            </View>
            {index < arrows.length ? (
              <Text style={[styles.arrow, accent]}>{arrows[index]}</Text>
            ) : null}
          </React.Fragment>
        ))}
      </View>
      <Text style={styles.summary}>{summary}</Text>
      <Text style={styles.detail}>{detail}</Text>
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
      gap: 12,
    },
    header: { alignItems: 'center', gap: 3 },
    title: {
      color: theme.colors.text,
      fontSize: 15,
      lineHeight: 20,
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
    cards: { flexDirection: 'row', gap: 7 },
    card: {
      flex: 1,
      minHeight: 166,
      padding: 9,
      gap: 6,
      borderRadius: 11,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
    },
    upCard: { borderColor: 'rgba(45,212,191,0.34)' },
    downCard: { borderColor: 'rgba(248,113,113,0.24)' },
    sidewaysCard: { borderColor: 'rgba(159,176,195,0.22)' },
    cardTitle: { fontSize: 8, lineHeight: 11, fontWeight: '900', letterSpacing: 0.55 },
    upText: { color: theme.colors.primary },
    downText: { color: theme.colors.risk },
    sidewaysText: { color: theme.colors.textMuted },
    graph: {
      minHeight: 76,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    pointSlot: { width: 18, height: 76, position: 'relative' },
    point: {
      position: 'absolute',
      left: 5,
      width: 8,
      height: 8,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.28)',
    },
    upDot: { backgroundColor: theme.colors.primary },
    downDot: { backgroundColor: theme.colors.risk },
    sidewaysDot: { backgroundColor: theme.colors.textMuted },
    pointLabel: {
      position: 'absolute',
      left: -1,
      width: 20,
      textAlign: 'center',
      fontSize: 7,
      lineHeight: 10,
      fontWeight: '900',
    },
    arrow: {
      width: 13,
      marginTop: 29,
      textAlign: 'center',
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '900',
    },
    summary: { color: theme.colors.text, fontSize: 9, lineHeight: 12, fontWeight: '900' },
    detail: { color: theme.colors.textMuted, fontSize: 7, lineHeight: 10, fontWeight: '700' },
    boundary: {
      minHeight: 58,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: 'rgba(45,212,191,0.06)',
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.20)',
    },
    boundaryMark: { color: theme.colors.primary, fontSize: 22, fontWeight: '900' },
    boundaryCopy: { flex: 1, gap: 1 },
    boundaryTitle: { color: theme.colors.text, fontSize: 9, lineHeight: 12, fontWeight: '900' },
    boundaryText: { color: theme.colors.textMuted, fontSize: 8, lineHeight: 11, fontWeight: '700' },
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
