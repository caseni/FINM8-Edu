import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
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
import { BeginnerInstrumentExplanationStep } from './BeginnerInstrumentExplanationStep';
import { DesktopPremiumLessonBlockRenderer } from './DesktopPremiumLessonBlockRenderer';
import { PremiumLessonBlockRenderer } from './PremiumLessonBlockRenderer';
import { LessonSupportingVisual } from './LessonSupportingVisual';

type VisualBlock = Extract<ContentBlock, { kind: 'visual' }>;
type RiskCalloutBlock = Extract<ContentBlock, { kind: 'callout' }>;

const LEARNING_FONT_FAMILY = Platform.select({
  web: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  default: undefined,
});

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
  const wide = width >= 900;
  const narrow = width < 380;
  const styles = createStyles(theme, wide, narrow);
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
  const isInstrumentExplanation = Boolean(
    currentBlock?.kind === 'explanation'
      && lessonVisual?.assetRef.includes('piyasa-araclari-ayni-degildir')
  );
  const totalSteps = blocks.length + 1;
  const progress = (stepIndex + 1) / totalSteps;
  const lessonTitle = selectLocalizedText(lesson.title, language);
  const lessonTitleSeparator = /[.!?]$/.test(lessonTitle.trim()) ? ' ' : '. ';
  const stepAccessibilityLabel = language === 'tr'
    ? `${lessonTitle}${lessonTitleSeparator}Adım ${stepIndex + 1}/${totalSteps}.`
    : `${lessonTitle}${lessonTitleSeparator}Step ${stepIndex + 1} of ${totalSteps}.`;

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
            <Text
              accessible={true}
              role="status"
              aria-label={stepAccessibilityLabel}
              aria-live="polite"
              accessibilityRole="summary"
              accessibilityLabel={stepAccessibilityLabel}
              accessibilityLiveRegion="polite"
              style={styles.stepText}
            >
              {language === 'tr'
                ? `Adım ${stepIndex + 1}/${totalSteps}`
                : `Step ${stepIndex + 1}/${totalSteps}`}
            </Text>
          </View>
          <View
            role="progressbar"
            aria-label={language === 'tr' ? 'Ders ilerlemesi' : 'Lesson progress'}
            aria-valuemin={0}
            aria-valuemax={totalSteps}
            aria-valuenow={stepIndex + 1}
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
        <View style={styles.lessonIntro}>
          <Text style={styles.lessonTitle}>{lessonTitle}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.duration}>{selectLocalizedText(LEARNING_STAGE_LABELS[lesson.learningStage], language)}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.duration}>{lesson.estimatedMinutes} {language === 'tr' ? 'dk' : 'min'}</Text>
            {entryContext ? (
              <>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.contextLabel}>{entryContext.sourceModule}</Text>
              </>
            ) : null}
          </View>
        </View>

        <View style={[styles.slide, isVisualOnlyStep && styles.visualSlide, isTakeaway && styles.takeawaySlide]}>
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
                  accessibilityLabel={language === 'tr' ? 'Eğitim notu' : 'Educational note'}
                  style={styles.compactSafety}
                >
                  <Text style={styles.compactSafetyLabel}>
                    {language === 'tr' ? 'EĞİTİM NOTU' : 'EDUCATIONAL NOTE'}
                  </Text>
                  <Text style={styles.compactSafetyText}>
                    {selectLocalizedText(lesson.contentVersion.riskDisclaimer, language)}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : currentBlock ? (
            isInstrumentExplanation && lessonVisual ? (
              <BeginnerInstrumentExplanationStep
                language={language}
                assetRef={lessonVisual.assetRef}
                alt={lessonVisual.alt}
                theme={theme}
              />
            ) : wide ? (
              <DesktopPremiumLessonBlockRenderer
                block={currentBlock}
                language={language}
                presentationMode={presentationMode}
                theme={theme}
                renderVisual={renderVisual}
                supportingVisual={lessonVisual}
              />
            ) : (
              <PremiumLessonBlockRenderer
                block={currentBlock}
                language={language}
                presentationMode={presentationMode}
                theme={theme}
                renderVisual={renderVisual}
                supportingVisual={lessonVisual}
              />
            )
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

const createStyles = (theme: LearningTheme, wide: boolean, narrow: boolean) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: narrow ? 10 : theme.spacing.md,
      paddingHorizontal: wide ? 22 : narrow ? 12 : theme.spacing.md,
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
      maxWidth: wide ? 980 : 720,
      alignSelf: 'center',
      paddingHorizontal: wide ? 22 : narrow ? 12 : theme.spacing.md,
      paddingTop: wide ? 14 : theme.spacing.sm,
      paddingBottom: theme.spacing.md,
      gap: wide ? 10 : theme.spacing.sm,
    },
    lessonIntro: { gap: wide ? 5 : 4, paddingHorizontal: wide ? 2 : 0 },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: wide ? 6 : 5 },
    duration: { color: theme.colors.textMuted, fontSize: wide ? 11 : 10, fontWeight: '700' },
    metaDot: { color: theme.colors.textMuted, fontSize: wide ? 10 : 9, opacity: 0.65 },
    contextLabel: { color: theme.colors.textMuted, fontSize: wide ? 11 : 10, fontWeight: '700' },
    lessonTitle: { maxWidth: 820, color: theme.colors.text, fontFamily: LEARNING_FONT_FAMILY, fontSize: wide ? 25 : narrow ? 20 : 21, lineHeight: wide ? 32 : narrow ? 27 : 28, fontWeight: '900', letterSpacing: -0.35 },
    slide: {
      flexGrow: wide ? 0 : 1,
      width: '100%',
      justifyContent: wide ? 'flex-start' : 'center',
      paddingVertical: wide ? 8 : 4,
      paddingHorizontal: 0,
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    visualSlide: { justifyContent: wide ? 'flex-start' : 'center' },
    takeawaySlide: { justifyContent: 'flex-start' },
    takeaway: { flexGrow: wide ? 0 : 1, gap: wide ? 14 : 12, paddingHorizontal: wide ? 2 : 0 },
    takeawayEyebrow: { color: theme.colors.primary, fontSize: wide ? 12 : 11, lineHeight: 16, fontWeight: '900', letterSpacing: 0.8 },
    takeawayText: { color: theme.colors.text, fontFamily: LEARNING_FONT_FAMILY, fontSize: wide ? 27 : narrow ? 21 : 22, fontWeight: '800', lineHeight: wide ? 35 : narrow ? 29 : 30, letterSpacing: -0.25 },
    takeawayVisual: { flexGrow: wide ? 0 : 1, justifyContent: wide ? 'flex-start' : 'center', marginTop: 2 },
    compactSafety: {
      gap: wide ? 7 : 3,
      marginTop: 2,
      paddingTop: wide ? 12 : 8,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
    },
    compactSafetyLabel: {
      color: theme.colors.textMuted,
      fontSize: wide ? 10 : 9,
      fontWeight: '900',
      letterSpacing: 0.8,
    },
    compactSafetyText: {
      color: theme.colors.textMuted,
      fontSize: wide ? 14 : 12,
      lineHeight: wide ? 21 : 17,
    },
    footer: {
      paddingHorizontal: wide ? 28 : narrow ? 12 : theme.spacing.md,
      paddingVertical: wide ? 12 : narrow ? 10 : 12,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
      backgroundColor: theme.colors.background,
    },
    footerActions: {
      width: '100%',
      maxWidth: wide ? 980 : 720,
      alignSelf: 'center',
      flexDirection: 'row',
      gap: narrow ? 8 : theme.spacing.md,
    },
    primaryButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.medium,
      backgroundColor: theme.colors.primary,
      padding: narrow ? 11 : theme.spacing.md,
      minHeight: 52,
    },
    primaryText: { color: theme.colors.primaryText, fontFamily: LEARNING_FONT_FAMILY, fontWeight: '800', fontSize: narrow ? 15 : 16 },
    secondaryButton: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.medium,
      borderColor: theme.colors.border,
      borderWidth: 1,
      padding: narrow ? 10 : theme.spacing.md,
      minWidth: narrow ? 86 : 100,
      minHeight: 52,
    },
    secondaryText: { color: theme.colors.text, fontFamily: LEARNING_FONT_FAMILY, fontWeight: '700' },
  });