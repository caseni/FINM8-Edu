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
import { CandleAnatomyVisual } from './CandleAnatomyVisual';
import { LearningVisual } from './LearningVisual';
import { RiskBasicsVisual } from './RiskBasicsVisual';

type VisualBlock = Extract<ContentBlock, { kind: 'visual' }>;

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
    const isRiskBasicsVisual = block.assetRef.includes('risk-belirsizlik-kayip');
    const isCandleAnatomyVisual =
      block.assetRef.includes('bir-mum') || block.assetRef.includes('candle-ohlc');

    return (
      <View style={styles.block}>
        {renderVisual ? (
          renderVisual(block)
        ) : isRiskBasicsVisual ? (
          <RiskBasicsVisual alt={alt} language={language} theme={theme} />
        ) : isCandleAnatomyVisual ? (
          <CandleAnatomyVisual alt={alt} language={language} theme={theme} />
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
  });
