import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { selectAudienceCopy, type LearningLanguage } from '../../domain/learning/presentation';
import type { ContentBlock, PresentationMode } from '../../domain/learning/types';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import { LessonBlockRenderer } from './LessonBlockRenderer';
import { LessonSupportingVisual, type LessonSupportingVisualRole } from './LessonSupportingVisual';
import { PremiumLessonBlockRenderer } from './PremiumLessonBlockRenderer';

type VisualBlock = Extract<ContentBlock, { kind: 'visual' }>;

const LEARNING_FONT_FAMILY = Platform.select({
  web: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  default: undefined,
});

interface SupportingVisual {
  readonly assetRef: string;
  readonly alt: string;
}

export interface DesktopPremiumLessonBlockRendererProps {
  block: ContentBlock;
  language: LearningLanguage;
  presentationMode: PresentationMode;
  theme?: LearningTheme;
  renderVisual?: (block: VisualBlock) => React.ReactNode;
  supportingVisual?: SupportingVisual;
}

function roleForBlock(block: Exclude<ContentBlock, VisualBlock>): LessonSupportingVisualRole {
  if (block.kind === 'prompt') return 'hook';
  if (block.kind === 'misconception') return 'misconception';
  if (block.kind === 'callout') {
    if (block.tone === 'risk') return 'risk';
    if (block.tone === 'evidence') return 'practice';
  }
  return 'concept';
}

function labelForBlock(block: Exclude<ContentBlock, VisualBlock>, language: LearningLanguage): string | undefined {
  const tr = language === 'tr';
  if (block.kind === 'prompt') return tr ? 'BİR DÜŞÜN' : 'THINK FIRST';
  if (block.kind === 'explanation') return tr ? 'KISA MANTIK' : 'CORE IDEA';
  if (block.kind === 'misconception') return tr ? 'YAYGIN HATA' : 'COMMON MISTAKE';
  if (block.kind === 'callout' && block.tone === 'risk') return tr ? 'DİKKAT' : 'WATCH OUT';
  if (block.kind === 'callout' && block.tone === 'evidence') return tr ? 'PRATİK NOT' : 'PRACTICAL NOTE';
  return undefined;
}

function conciseDesktopExample(assetRef: string, language: LearningLanguage): string | undefined {
  if (!assetRef.includes('fiyat-piyasada-nasil-olusur')) return undefined;
  return language === 'tr'
    ? 'Alıcı ve satıcı 100 TL’de buluşursa işlem 100 TL’den gerçekleşir.'
    : 'If buyer and seller meet at 100, the trade can execute at 100.';
}

export function DesktopPremiumLessonBlockRenderer({
  block,
  language,
  presentationMode,
  theme = defaultLearningTheme,
  renderVisual,
  supportingVisual,
}: DesktopPremiumLessonBlockRendererProps) {
  const styles = createStyles(theme);

  if (block.kind === 'visual') {
    const conciseExample = conciseDesktopExample(block.assetRef, language);
    if (conciseExample) {
      return (
        <View style={styles.visualStep}>
          <LessonBlockRenderer
            block={block}
            language={language}
            presentationMode={presentationMode}
            theme={theme}
            renderVisual={renderVisual}
            supportingVisual={supportingVisual}
          />
          <View style={styles.exampleCard}>
            <Text style={styles.exampleEyebrow}>{language === 'tr' ? 'MİNİ ÖRNEK' : 'MINI EXAMPLE'}</Text>
            <Text style={styles.exampleText}>{conciseExample}</Text>
          </View>
        </View>
      );
    }

    return (
      <PremiumLessonBlockRenderer
        block={block}
        language={language}
        presentationMode={presentationMode}
        theme={theme}
        renderVisual={renderVisual}
        supportingVisual={supportingVisual}
      />
    );
  }

  const role = roleForBlock(block);
  const label = labelForBlock(block, language);
  const showVisual = Boolean(supportingVisual);
  const toneStyle = block.kind === 'misconception'
    ? styles.warningCopy
    : block.kind === 'callout' && block.tone === 'risk'
      ? styles.riskCopy
      : block.kind === 'callout' && block.tone === 'evidence'
        ? styles.evidenceCopy
        : undefined;

  if (block.kind === 'bullet_list') {
    return (
      <View style={[styles.row, !showVisual && styles.singleColumn]}>
        <View style={styles.copyPane}>
          {block.title ? (
            <Text style={styles.sectionTitle}>
              {selectAudienceCopy(block.title, presentationMode, language)}
            </Text>
          ) : null}
          <View style={styles.bulletList}>
            {block.items.map((item, index) => (
              <View key={`${block.id}.${index}`} style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.body}>{selectAudienceCopy(item, presentationMode, language)}</Text>
              </View>
            ))}
          </View>
        </View>
        {supportingVisual ? (
          <View style={styles.visualPane}>
            <LessonSupportingVisual
              assetRef={supportingVisual.assetRef}
              alt={supportingVisual.alt}
              language={language}
              role={role}
              theme={theme}
            />
          </View>
        ) : null}
      </View>
    );
  }

  const copy = selectAudienceCopy(block.copy, presentationMode, language);

  return (
    <View style={[styles.row, !showVisual && styles.singleColumn]}>
      <View style={[styles.copyPane, toneStyle]}>
        {label ? (
          <Text style={[
            styles.eyebrow,
            role === 'misconception' && styles.eyebrowWarning,
            role === 'risk' && styles.eyebrowRisk,
            role === 'practice' && styles.eyebrowPractice,
          ]}>
            {label}
          </Text>
        ) : null}
        <Text style={block.kind === 'prompt' ? styles.prompt : styles.body}>{copy}</Text>
      </View>
      {supportingVisual ? (
        <View style={styles.visualPane}>
          <LessonSupportingVisual
            assetRef={supportingVisual.assetRef}
            alt={supportingVisual.alt}
            language={language}
            role={role}
            theme={theme}
          />
        </View>
      ) : null}
    </View>
  );
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 20,
  },
  singleColumn: {
    flexDirection: 'column',
  },
  copyPane: {
    flex: 0.96,
    minWidth: 0,
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 2,
  },
  visualPane: {
    flex: 1.04,
    minWidth: 0,
    justifyContent: 'center',
  },
  visualStep: { gap: 12 },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '900',
    letterSpacing: 0.9,
  },
  eyebrowWarning: { color: theme.colors.warning },
  eyebrowRisk: { color: theme.colors.risk },
  eyebrowPractice: { color: theme.colors.success },
  prompt: {
    color: theme.colors.text,
    fontFamily: LEARNING_FONT_FAMILY,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  body: {
    color: theme.colors.text,
    fontFamily: LEARNING_FONT_FAMILY,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
  },
  sectionTitle: {
    color: theme.colors.text,
    fontFamily: LEARNING_FONT_FAMILY,
    fontSize: 21,
    lineHeight: 28,
    fontWeight: '700',
  },
  bulletList: { gap: 12 },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    width: 7,
    height: 7,
    marginTop: 12,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  exampleCard: {
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted,
  },
  exampleEyebrow: {
    color: theme.colors.primary,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  exampleText: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
  },
  warningCopy: {
    padding: 14,
    borderRadius: theme.radius.medium,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.warning,
    backgroundColor: theme.colors.surfaceMuted,
  },
  riskCopy: {
    padding: 14,
    borderRadius: theme.radius.medium,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.risk,
    backgroundColor: theme.colors.surfaceMuted,
  },
  evidenceCopy: {
    padding: 14,
    borderRadius: theme.radius.medium,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.success,
    backgroundColor: theme.colors.surfaceMuted,
  },
});
