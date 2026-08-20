import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  selectAudienceCopy,
  selectLocalizedText,
  type LearningLanguage,
} from '../../domain/learning/presentation';
import type {
  ContentBlock,
  LearningEntryContext,
  MicroLesson,
  LocalizedText,
  PresentationMode,
} from '../../domain/learning/types';
import {
  defaultLearningTheme,
  type LearningTheme,
} from '../../theme/learningTheme';
import { LEARNING_STAGE_LABELS } from '../../domain/learning/personalization';
import { PremiumLessonBlockRenderer } from './PremiumLessonBlockRenderer';
import { LessonSupportingVisual } from './LessonSupportingVisual';

type VisualBlock = Extract<ContentBlock, { kind: 'visual' }>;
type RiskCalloutBlock = Extract<ContentBlock, { kind: 'callout' }>;

export interface LessonPlayerProps {
  lesson: MicroLesson;
  language: LearningLanguage;
  presentationMode: PresentationMode;
  entryContext?: LearningEntryContext;
  theme?: LearningTheme;
  renderVisual?: (block: VisualBlock) => React.ReactNode;
  onExit?: () => void;
  onStartAssessment: (lesson: MicroLesson) => void;
  assessmentLabel?: LocalizedText;
  initialStepIndex?: number;
  onStepChange?: (stepIndex: number) => void;
}

export function LessonPlayer({
  lesson,
  language,
  presentationMode,
  entryContext,
  theme = defaultLearningTheme,
  renderVisual,
  onExit,
  onStartAssessment,
  assessmentLabel,
  initialStepIndex = 0,
  onStepChange,
}: LessonPlayerProps) {
  const { width } = useWindowDimensions();
  const styles = createStyles(theme, width >= 900);
  const visibleBlocks = useMemo(
    () =>
      lesson.contentBlocks
        .filter(
          (block) =>
            block.audience === 'all' || block.audience === presentationMode
        )
        .sort((a, b) => a.order - b.order),
    [lesson.contentBlocks, presentationMode]
  );
  const safetyBlock = useMemo(
    () =>
      visibleBlocks.find(
        (block): block is RiskCalloutBlock =>
          block.kind === 'callout' &&
          block.tone === 'risk' &&
          block.id.endsWith('.safety')
      ),
    [visibleBlocks]
  );
  const lessonVisual = useMemo(() => {
    const contentVisual = lesson.contentBlocks.find(
      (block): block is VisualBlock => block.kind === 'visual'
    );
    if (contentVisual) {
      return {
        assetRef: contentVisual.assetRef,
        alt: selectLocalizedText(contentVisual.alt, language),
      };
    }

    const questionVisual = lesson.quiz.questions.find(
      (question) => question.visual
    )?.visual;
    if (!questionVisual) return undefined;

    return {
      assetRef: questionVisual.assetRef,
      alt: selectLocalizedText(questionVisual.alt, language),
    };
  }, [language, lesson.contentBlocks, lesson.quiz.questions]);
  const blocks = useMemo(
    () => visibleBlocks.filter((block) => block !== safetyBlock),
    [safetyBlock, visibleBlocks]
  );
  const [stepIndex, setStepIndex] = useState(() =>
    Math.max(0, Math.min(initialStepIndex, blocks.length))
  );
  const scrollRef = useRef<ScrollView>(null);
  const isTakeaway = stepIndex === blocks.length;
  const currentBlock = isTakeaway ? undefined : blocks[stepIndex];
  const isVisualOnlyStep = currentBlock?.kind === 'visual';
  const totalSteps = blocks.length + 1;
  const progress = (stepIndex + 1) / totalSteps;

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [stepIndex]);

  const next = () => {
    if (isTakeaway) {
      onStartAssessment(lesson);
      return;
    }
    setStepIndex((current) => {
      const nextStep = Math.min(current + 1, blocks.length);
      onStepChange?.(nextStep);
      return nextStep;
    });
  };

  const back = () => setStepIndex((current) => {
    const nextStep = Math.max(0, current - 1);
    onStepChange?.(nextStep);
    return nextStep;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={language === 'tr' ? 'Dersten çık' : 'Exit lesson'}
          onPress={onExit}
          style={styles.exitButton}
        >
          <Text style={styles.exitText}>×</Text>
        </Pressable>
        <View style={styles.progressGroup}>
          <View style={styles.progressCopy}>
            <Text style={styles.flowLabel}>{language === 'tr' ? 'DERS' : 'LESSON'}</Text>
            <Text style={styles.stepText}>
              {language === 'tr'
                ? `Adım ${stepIndex + 1}/${totalSteps}`
                : `Step ${stepIndex + 1}/${totalSteps}`}
            </Text>
          </View>
          <View
            accessibilityRole="progressbar"
            accessibilityLabel={language === 'tr' ? 'Ders ilerlemesi' : 'Lesson progress'}
            accessibilityValue={{ min: 0, max: totalSteps, now: stepIndex + 1 }}
            style={styles.progressTrack}
          >
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        <View style={styles.metaRow}>
          <Text style={styles.duration}>{selectLocalizedText(LEARNING_STAGE_LABELS[lesson.learningStage], language)}</Text>
          <Text style={styles.duration}>{lesson.estimatedMinutes} {language === 'tr' ? 'dk' : 'min'}</Text>
          {entryContext ? (
            <Text style={styles.contextLabel}>{entryContext.sourceModule}</Text>
          ) : null}
        </View>
        <Text style={styles.lessonTitle}>
          {selectLocalizedText(lesson.title, language)}
        </Text>

        <View style={[styles.slide, isVisualOnlyStep && styles.visualSlide]}>
          {isTakeaway ? (
            <View style={styles.takeaway}>
              <Text style={styles.takeawayEyebrow}>
                {language === 'tr' ? 'AKLINDA KALSIN' : 'KEY TAKEAWAY'}
              </Text>
              <Text style={styles.takeawayText}>
                {selectLocalizedText(lesson.takeaway, language)}
              </Text>
              {lessonVisual ? (
                <View style={styles.takeawayVisual}>
                  <LessonSupportingVisual
                    assetRef={lessonVisual.assetRef}
                    alt={lessonVisual.alt}
                    language={language}
                    role="summary"
                    theme={theme}
                  />
                </View>
              ) : null}
              {safetyBlock ? (
                <View
                  accessibilityLabel={language === 'tr' ? 'Güvenlik notu' : 'Safety note'}
                  style={styles.compactSafety}
                >
                  <Text style={styles.compactSafetyLabel}>
                    {language === 'tr' ? 'DİKKAT' : 'WATCH OUT'}
                  </Text>
                  <Text style={styles.compactSafetyText}>
                    {selectAudienceCopy(safetyBlock.copy, presentationMode, language)}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : currentBlock ? (
            <PremiumLessonBlockRenderer
              block={currentBlock}
              language={language}
              presentationMode={presentationMode}
              theme={theme}
              renderVisual={renderVisual}
              supportingVisual={lessonVisual}
            />
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerActions}>
          {stepIndex > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={language === 'tr' ? 'Önceki adıma dön' : 'Go back to the previous step'}
              onPress={back}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryText}>
                {language === 'tr' ? 'Geri' : 'Back'}
              </Text>
            </Pressable>
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isTakeaway
                ? assessmentLabel
                  ? selectLocalizedText(assessmentLabel, language)
                  : language === 'tr'
                    ? 'Göreve geç'
                    : 'Start assessment'
                : language === 'tr'
                  ? 'Sonraki adıma geç'
                  : 'Continue to the next step'
            }
            onPress={next}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryText}>
              {isTakeaway
                ? assessmentLabel
                  ? selectLocalizedText(assessmentLabel, language)
                  : language === 'tr'
                    ? 'Göreve geç'
                    : 'Start assessment'
                : language === 'tr'
                  ? 'Devam'
                  : 'Continue'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: LearningTheme, wide: boolean) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingHorizontal: wide ? 22 : theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
    },
    exitButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    exitText: { color: theme.colors.textMuted, fontSize: 28 },
    progressGroup: { flex: 1, gap: theme.spacing.xs },
    progressCopy: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: theme.spacing.sm },
    flowLabel: { color: theme.colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
    progressTrack: {
      flex: 1,
      height: 5,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.small,
    },
    progressFill: { height: 5, backgroundColor: theme.colors.primary },
    stepText: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '700' },
    content: {
      flexGrow: 1,
      width: '100%',
      maxWidth: wide ? 860 : 760,
      alignSelf: 'center',
      paddingHorizontal: wide ? 24 : theme.spacing.md,
      paddingTop: wide ? 18 : theme.spacing.sm,
      paddingBottom: theme.spacing.md,
      gap: wide ? 12 : theme.spacing.sm,
    },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    duration: { color: theme.colors.textMuted, fontSize: wide ? 13 : 12 },
    contextLabel: { color: theme.colors.textMuted, fontSize: wide ? 13 : 12 },
    lessonTitle: { color: theme.colors.text, fontSize: wide ? 24 : 21, lineHeight: wide ? 32 : 28, fontWeight: '900' },
    slide: {
      width: '100%',
      justifyContent: 'flex-start',
      padding: wide ? 22 : theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.radius.large,
    },
    visualSlide: { justifyContent: 'flex-start' },
    takeaway: { gap: wide ? 18 : theme.spacing.md },
    takeawayEyebrow: { color: theme.colors.primary, fontSize: 11, lineHeight: 15, fontWeight: '900', letterSpacing: 0.8 },
    takeawayText: { color: theme.colors.text, fontSize: wide ? 28 : 23, fontWeight: '900', lineHeight: wide ? 38 : 31 },
    takeawayVisual: { marginTop: 2 },
    compactSafety: {
      gap: theme.spacing.xs,
      marginTop: 2,
      paddingTop: theme.spacing.sm,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
    },
    compactSafetyLabel: {
      color: theme.colors.risk,
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 0.8,
    },
    compactSafetyText: {
      color: theme.colors.textMuted,
      fontSize: wide ? 14 : 13,
      lineHeight: wide ? 21 : 19,
    },
    footer: {
      paddingHorizontal: wide ? 22 : theme.spacing.md,
      paddingVertical: wide ? 12 : theme.spacing.md,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
      backgroundColor: theme.colors.background,
    },
    footerActions: {
      width: '100%',
      maxWidth: wide ? 860 : 760,
      alignSelf: 'center',
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    primaryButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.medium,
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      minHeight: 52,
    },
    primaryText: { color: theme.colors.primaryText, fontWeight: '900', fontSize: 16 },
    secondaryButton: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.medium,
      borderColor: theme.colors.border,
      borderWidth: 1,
      padding: theme.spacing.md,
      minWidth: 100,
      minHeight: 52,
    },
    secondaryText: { color: theme.colors.text, fontWeight: '800' },
  });
