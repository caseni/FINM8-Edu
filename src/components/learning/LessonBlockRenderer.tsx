import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  selectAudienceCopy,
  selectLocalizedText,
  type LearningLanguage,
} from '../../domain/learning/presentation';
import type {
  ContentBlock,
  PresentationMode,
} from '../../domain/learning/types';
import {
  defaultLearningTheme,
  type LearningTheme,
} from '../../theme/learningTheme';
import { LearningVisual } from './LearningVisual';

type VisualBlock = Extract<ContentBlock, { kind: 'visual' }>;
type CandlePoint = {
  low: number;
  high: number;
  open: number;
  close: number;
};

const TIMEFRAME_15M: readonly CandlePoint[] = [
  { low: 30, high: 58, open: 48, close: 53 },
  { low: 34, high: 64, open: 52, close: 58 },
  { low: 39, high: 67, open: 57, close: 61 },
  { low: 37, high: 62, open: 59, close: 47 },
  { low: 31, high: 54, open: 48, close: 39 },
  { low: 25, high: 47, open: 39, close: 32 },
  { low: 21, high: 43, open: 32, close: 28 },
  { low: 24, high: 49, open: 29, close: 42 },
];

const TIMEFRAME_1H: readonly CandlePoint[] = [
  { low: 27, high: 58, open: 39, close: 53 },
  { low: 35, high: 68, open: 52, close: 61 },
  { low: 25, high: 61, open: 59, close: 34 },
  { low: 21, high: 51, open: 33, close: 43 },
];

const TIMEFRAME_1D: readonly CandlePoint[] = [
  { low: 18, high: 52, open: 28, close: 45 },
  { low: 30, high: 66, open: 43, close: 58 },
  { low: 39, high: 73, open: 56, close: 65 },
];

export interface LessonBlockRendererProps {
  block: ContentBlock;
  language: LearningLanguage;
  presentationMode: PresentationMode;
  theme?: LearningTheme;
  renderVisual?: (block: VisualBlock) => React.ReactNode;
}

export function LessonBlockRenderer({
  block,
  language,
  presentationMode,
  theme = defaultLearningTheme,
  renderVisual,
}: LessonBlockRendererProps) {
  const styles = createStyles(theme);

  if (block.kind === 'bullet_list') {
    return (
      <View style={styles.block}>
        {block.title ? (
          <Text style={styles.title}>
            {selectAudienceCopy(block.title, presentationMode, language)}
          </Text>
        ) : null}
        {block.items.map((item, index) => (
          <View key={`${block.id}.${index}`} style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.body}>
              {selectAudienceCopy(item, presentationMode, language)}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  if (block.kind === 'visual') {
    const alt = selectLocalizedText(block.alt, language);
    const isTimeframeVisual =
      block.assetRef.includes('zaman-dilimi') ||
      block.assetRef.includes('timeframes');

    return (
      <View style={styles.block}>
        {renderVisual ? (
          renderVisual(block)
        ) : isTimeframeVisual ? (
          <TimeframeLessonVisual
            alt={alt}
            language={language}
            styles={styles}
          />
        ) : (
          <LearningVisual
            assetRef={block.assetRef}
            alt={alt}
            language={language}
            theme={theme}
          />
        )}
        {block.caption ? (
          <Text style={styles.caption}>
            {selectAudienceCopy(block.caption, presentationMode, language)}
          </Text>
        ) : null}
      </View>
    );
  }

  const copy = selectAudienceCopy(block.copy, presentationMode, language);
  const toneStyle =
    block.kind === 'misconception'
      ? styles.misconception
      : block.kind === 'callout'
        ? block.tone === 'risk'
          ? styles.risk
          : block.tone === 'evidence'
            ? styles.evidence
            : styles.note
        : undefined;

  return (
    <View style={[styles.block, toneStyle]}>
      {block.kind === 'prompt' ? (
        <Text style={styles.prompt}>{copy}</Text>
      ) : (
        <Text style={styles.body}>{copy}</Text>
      )}
    </View>
  );
}

function TimeframeLessonVisual({
  alt,
  language,
  styles,
}: {
  alt: string;
  language: LearningLanguage;
  styles: ReturnType<typeof createStyles>;
}) {
  const tr = language === 'tr';

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={alt}
      style={styles.timeframeShell}
    >
      <View style={styles.timeframeHeader}>
        <Text style={styles.timeframeEyebrow}>
          {tr ? 'AYNI PİYASA · FARKLI ÖLÇEK' : 'SAME MARKET · DIFFERENT SCALE'}
        </Text>
        <Text style={styles.timeframeTitle}>
          {tr
            ? 'Kısa geri çekilme, geniş yapıyı tek başına bozmaz'
            : 'A short pullback does not break the broader structure by itself'}
        </Text>
      </View>

      <View style={styles.timeframeRows}>
        <TimeframeStrip
          candles={TIMEFRAME_15M}
          label="15m"
          note={tr ? 'Kısa vadeli geri çekilme' : 'Short-term pullback'}
          styles={styles}
        />
        <TimeframeStrip
          candles={TIMEFRAME_1H}
          label="1h"
          note={tr ? 'Ara ölçekte geçiş' : 'Mid-scale transition'}
          styles={styles}
        />
        <TimeframeStrip
          candles={TIMEFRAME_1D}
          label="1D"
          note={tr ? 'Geniş yükseliş yapısı' : 'Broader upward structure'}
          structureTag="HH / HL"
          styles={styles}
        />
      </View>

      <View style={styles.timeframeFooter}>
        <Text style={styles.timeframeFooterText}>{alt}</Text>
        <Text style={styles.timeframeBoundary}>
          {tr
            ? 'Zaman dilimleri çelişebilir; biri otomatik olarak doğru veya üstün değildir.'
            : 'Timeframes can conflict; one is not automatically correct or superior.'}
        </Text>
      </View>
    </View>
  );
}

function TimeframeStrip({
  candles,
  label,
  note,
  structureTag,
  styles,
}: {
  candles: readonly CandlePoint[];
  label: string;
  note: string;
  structureTag?: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.timeframeCard}>
      <View style={styles.timeframeRowHeader}>
        <Text style={styles.timeframeBadge}>{label}</Text>
        <Text style={styles.timeframeNote}>{note}</Text>
        {structureTag ? (
          <Text style={styles.timeframeStructureTag}>{structureTag}</Text>
        ) : null}
      </View>
      <View style={styles.timeframeChart}>
        <View style={styles.timeframeGridLine} />
        {candles.map((candle, index) => {
          const bullish = candle.close >= candle.open;
          const bodyBottom = Math.min(candle.open, candle.close);
          const bodyHeight = Math.max(5, Math.abs(candle.close - candle.open));

          return (
            <View key={`${label}.${index}`} style={styles.timeframeCandleSlot}>
              <View
                style={[
                  styles.timeframeWick,
                  {
                    bottom: candle.low,
                    height: candle.high - candle.low,
                  },
                ]}
              />
              <View
                style={[
                  styles.timeframeCandleBody,
                  bullish
                    ? styles.timeframeCandleUp
                    : styles.timeframeCandleDown,
                  {
                    bottom: bodyBottom,
                    height: bodyHeight,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    block: { gap: theme.spacing.md },
    title: { color: theme.colors.text, fontSize: 20, fontWeight: '700' },
    prompt: {
      color: theme.colors.text,
      fontSize: 28,
      fontWeight: '800',
      lineHeight: 36,
    },
    body: { color: theme.colors.text, fontSize: 18, lineHeight: 28, flex: 1 },
    caption: { color: theme.colors.textMuted, fontSize: 14, lineHeight: 20 },
    bulletRow: { flexDirection: 'row', gap: theme.spacing.sm },
    bullet: { color: theme.colors.primary, fontSize: 20, fontWeight: '800' },
    misconception: {
      backgroundColor: theme.colors.surfaceMuted,
      borderLeftColor: theme.colors.warning,
      borderLeftWidth: 4,
      borderRadius: theme.radius.medium,
      padding: theme.spacing.md,
    },
    risk: {
      backgroundColor: theme.colors.surfaceMuted,
      borderLeftColor: theme.colors.risk,
      borderLeftWidth: 4,
      borderRadius: theme.radius.medium,
      padding: theme.spacing.md,
    },
    evidence: {
      backgroundColor: theme.colors.surfaceMuted,
      borderLeftColor: theme.colors.success,
      borderLeftWidth: 4,
      borderRadius: theme.radius.medium,
      padding: theme.spacing.md,
    },
    note: {
      backgroundColor: theme.colors.surfaceMuted,
      borderLeftColor: theme.colors.primary,
      borderLeftWidth: 4,
      borderRadius: theme.radius.medium,
      padding: theme.spacing.md,
    },
    timeframeShell: {
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.radius.large,
    },
    timeframeHeader: {
      gap: 6,
      padding: theme.spacing.md,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
    },
    timeframeEyebrow: {
      color: theme.colors.primary,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.8,
    },
    timeframeTitle: {
      color: theme.colors.text,
      fontSize: 17,
      lineHeight: 23,
      fontWeight: '800',
    },
    timeframeRows: {
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
    },
    timeframeCard: {
      gap: 8,
      padding: 10,
      backgroundColor: theme.colors.surfaceMuted,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.radius.medium,
    },
    timeframeRowHeader: {
      minHeight: 22,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    timeframeBadge: {
      minWidth: 34,
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: '900',
      letterSpacing: 0.5,
    },
    timeframeNote: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 12,
      fontWeight: '700',
    },
    timeframeStructureTag: {
      color: theme.colors.success,
      fontSize: 11,
      fontWeight: '900',
    },
    timeframeChart: {
      height: 82,
      flexDirection: 'row',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: theme.radius.small,
    },
    timeframeGridLine: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 38,
      height: 1,
      backgroundColor: theme.colors.border,
      opacity: 0.65,
    },
    timeframeCandleSlot: {
      flex: 1,
      position: 'relative',
      alignItems: 'center',
    },
    timeframeWick: {
      position: 'absolute',
      width: 1,
      backgroundColor: theme.colors.textMuted,
      opacity: 0.7,
    },
    timeframeCandleBody: {
      position: 'absolute',
      width: '48%',
      minWidth: 5,
      maxWidth: 12,
      borderRadius: 2,
    },
    timeframeCandleUp: {
      backgroundColor: theme.colors.success,
      opacity: 0.82,
    },
    timeframeCandleDown: {
      backgroundColor: theme.colors.risk,
      opacity: 0.78,
    },
    timeframeFooter: {
      gap: 5,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },
    timeframeFooterText: {
      color: theme.colors.textMuted,
      fontSize: 12,
      lineHeight: 17,
    },
    timeframeBoundary: {
      color: theme.colors.warning,
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '700',
    },
  });
