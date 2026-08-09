import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import { scoreQuiz, type QuizResult, type QuizSubmission } from '../../domain/learning/progressionEngine';
import type { LocalizedText, Quiz } from '../../domain/learning/types';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import { BidAskSpreadVisual } from './BidAskSpreadVisual';
import { BreakOfStructureVisual } from './BreakOfStructureVisual';
import { CandleAnatomyVisual } from './CandleAnatomyVisual';
import { ChangeOfCharacterVisual } from './ChangeOfCharacterVisual';
import { ConfirmationBiasVisual } from './ConfirmationBiasVisual';
import { DecisionJournalVisual } from './DecisionJournalVisual';
import { DiversificationVisual } from './DiversificationVisual';
import { FomoDecisionVisual } from './FomoDecisionVisual';
import { LearningVisual } from './LearningVisual';
import { LiquidityImpactVisual } from './LiquidityImpactVisual';
import { OrderTypesVisual } from './OrderTypesVisual';
import { OvertradingDecisionVisual } from './OvertradingDecisionVisual';
import { PositionSizingVisual } from './PositionSizingVisual';
import { PriceFormationVisual } from './PriceFormationVisual';
import { RiskBasicsVisual } from './RiskBasicsVisual';
import { RiskRewardVisual } from './RiskRewardVisual';
import { SlippageExecutionVisual } from './SlippageExecutionVisual';
import { StopOrderVisual } from './StopOrderVisual';
import { SupportResistanceZoneVisual } from './SupportResistanceZoneVisual';
import { TimeframeContextVisual } from './TimeframeContextVisual';
import { TrendStructureVisual } from './TrendStructureVisual';
import { VolatilityRangeVisual } from './VolatilityRangeVisual';

export interface QuizPlayerProps {
  quiz: Quiz;
  language: LearningLanguage;
  theme?: LearningTheme;
  onComplete: (result: QuizResult, submissions: readonly QuizSubmission[]) => void;
  eyebrow?: LocalizedText;
}

export function QuizPlayer({
  quiz,
  language,
  theme = defaultLearningTheme,
  onComplete,
  eyebrow,
}: QuizPlayerProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string>();
  const [revealed, setRevealed] = useState(false);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const advancingRef = useRef(false);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const question = quiz.questions[questionIndex];
  const selectedIsCorrect = selectedOptionId === question.correctOptionId;
  const isPriceFormationVisual =
    question.visual?.assetRef.includes('fiyat-piyasada-nasil-olusur') ?? false;
  const isLiquidityImpactVisual =
    question.visual?.assetRef.includes('likidite-neden-onemlidir') ?? false;
  const isBidAskSpreadVisual =
    question.visual?.assetRef.includes('bid-ask-spread-nedir') ?? false;
  const isOrderTypesVisual =
    question.visual?.assetRef.includes('piyasa-limit-stop-emirleri') ?? false;
  const isSlippageExecutionVisual =
    question.visual?.assetRef.includes('gerceklesme-fiyati-kayma') ?? false;
  const isTimeframeContextVisual =
    question.visual?.assetRef.includes('timeframes') ||
    question.visual?.assetRef.includes('zaman-dilimi') ||
    false;
  const isTrendStructureVisual =
    question.visual?.assetRef.includes('trend-yon-mu-yapi-mi') ||
    question.visual?.assetRef.includes('trend-structure') ||
    false;
  const isSupportResistanceZoneVisual =
    question.visual?.assetRef.includes('destek-direnc-bolgedir') ||
    question.visual?.assetRef.includes('support-resistance-zone') ||
    false;
  const isBreakOfStructureVisual =
    question.visual?.assetRef.includes('bos-starter') ?? false;
  const isChangeOfCharacterVisual =
    question.visual?.assetRef.includes('choch') ?? false;
  const isVolatilityRangeVisual =
    question.visual?.assetRef.includes('volatilite-once-risktir') ||
    question.visual?.assetRef.includes('volatility-range') ||
    false;
  const isPositionSizingVisual =
    question.visual?.assetRef.includes('pozisyon-buyuklugu-once-gelir') ?? false;
  const isRiskRewardVisual =
    question.visual?.assetRef.includes('risk-getiri-tek-basina-yetmez') ?? false;
  const isStopOrderVisual =
    question.visual?.assetRef.includes('stop-emri-garanti-midir') ?? false;
  const isDiversificationVisual =
    question.visual?.assetRef.includes('cok-varlik-cesitlendirme-degildir') ?? false;
  const isFomoDecisionVisual =
    question.visual?.assetRef.includes('fomo-karari-nasil-bozar') ?? false;
  const isOvertradingDecisionVisual =
    question.visual?.assetRef.includes('asiri-islem-nasil-fark-edilir') ?? false;
  const isConfirmationBiasVisual =
    question.visual?.assetRef.includes('sadece-hakli-cikaran-kanit') ?? false;
  const isDecisionJournalVisual =
    question.visual?.assetRef.includes('sonucu-degil-karari-kaydet') ?? false;
  const isRiskBasicsVisual =
    question.visual?.assetRef.includes('risk-belirsizlik-kayip') ?? false;
  const isCandleAnatomyVisual =
    question.visual?.assetRef.includes('bir-mum') ||
    question.visual?.assetRef.includes('candle-ohlc') ||
    false;
  const isConceptVisual =
    isPriceFormationVisual ||
    isLiquidityImpactVisual ||
    isBidAskSpreadVisual ||
    isOrderTypesVisual ||
    isSlippageExecutionVisual ||
    isTimeframeContextVisual ||
    isTrendStructureVisual ||
    isSupportResistanceZoneVisual ||
    isBreakOfStructureVisual ||
    isChangeOfCharacterVisual ||
    isVolatilityRangeVisual ||
    isPositionSizingVisual ||
    isRiskRewardVisual ||
    isStopOrderVisual ||
    isDiversificationVisual ||
    isFomoDecisionVisual ||
    isOvertradingDecisionVisual ||
    isConfirmationBiasVisual ||
    isDecisionJournalVisual ||
    isRiskBasicsVisual ||
    isCandleAnatomyVisual;

  useEffect(() => {
    advancingRef.current = false;
  }, [questionIndex]);

  const reveal = () => {
    if (!selectedOptionId) return;
    setRevealed(true);
  };

  const next = () => {
    if (!selectedOptionId || advancingRef.current) return;
    advancingRef.current = true;
    const nextSubmissions = [
      ...submissions,
      { questionId: question.id, selectedOptionId },
    ];
    if (questionIndex === quiz.questions.length - 1) {
      onComplete(scoreQuiz(quiz, nextSubmissions), nextSubmissions);
      return;
    }
    setSubmissions(nextSubmissions);
    setQuestionIndex((current) => current + 1);
    setSelectedOptionId(undefined);
    setRevealed(false);
  };

  const actionLabel = revealed
    ? questionIndex === quiz.questions.length - 1
      ? language === 'tr' ? 'Sonucu gör' : 'See result'
      : language === 'tr' ? 'Sonraki soru' : 'Next question'
    : language === 'tr' ? 'Cevabı kontrol et' : 'Check answer';

  return (
    <View style={styles.shell}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
      <View style={styles.progressRow}>
        <Text style={styles.eyebrow}>{eyebrow ? selectLocalizedText(eyebrow, language) : language === 'tr' ? 'MİNİ QUIZ' : 'MINI QUIZ'}</Text>
        <Text style={styles.progress}>
          {questionIndex + 1}/{quiz.questions.length}
        </Text>
      </View>
      <Text style={styles.question}>{selectLocalizedText(question.prompt, language)}</Text>
      {revealed && question.visual ? (
        <View style={styles.visualWrap}>
          <Text style={styles.visualEyebrow}>
            {isConceptVisual
              ? language === 'tr' ? 'GÖRSELİ İNCELE' : 'READ THE VISUAL'
              : language === 'tr' ? 'GRAFİĞİ İNCELE' : 'READ THE CHART'}
          </Text>
          {isPriceFormationVisual ? (
            <PriceFormationVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isLiquidityImpactVisual ? (
            <LiquidityImpactVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isBidAskSpreadVisual ? (
            <BidAskSpreadVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isOrderTypesVisual ? (
            <OrderTypesVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isSlippageExecutionVisual ? (
            <SlippageExecutionVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isTimeframeContextVisual ? (
            <TimeframeContextVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isTrendStructureVisual ? (
            <TrendStructureVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isSupportResistanceZoneVisual ? (
            <SupportResistanceZoneVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isBreakOfStructureVisual ? (
            <BreakOfStructureVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isChangeOfCharacterVisual ? (
            <ChangeOfCharacterVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isVolatilityRangeVisual ? (
            <VolatilityRangeVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isPositionSizingVisual ? (
            <PositionSizingVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isRiskRewardVisual ? (
            <RiskRewardVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isStopOrderVisual ? (
            <StopOrderVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isDiversificationVisual ? (
            <DiversificationVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isFomoDecisionVisual ? (
            <FomoDecisionVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isOvertradingDecisionVisual ? (
            <OvertradingDecisionVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isConfirmationBiasVisual ? (
            <ConfirmationBiasVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isDecisionJournalVisual ? (
            <DecisionJournalVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isRiskBasicsVisual ? (
            <RiskBasicsVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : isCandleAnatomyVisual ? (
            <CandleAnatomyVisual
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          ) : (
            <LearningVisual
              assetRef={question.visual.assetRef}
              alt={selectLocalizedText(question.visual.alt, language)}
              language={language}
              theme={theme}
            />
          )}
        </View>
      ) : null}
      <View style={styles.options}>
        {question.options.map((option) => {
          const selected = option.id === selectedOptionId;
          const correct = revealed && option.id === question.correctOptionId;
          const incorrect = revealed && selected && !correct;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: revealed, selected }}
              disabled={revealed}
              key={option.id}
              onPress={() => setSelectedOptionId(option.id)}
              style={[
                styles.option,
                selected && styles.selectedOption,
                correct && styles.correctOption,
                incorrect && styles.incorrectOption,
              ]}
            >
              <View style={styles.optionContent}>
                <Text style={[styles.optionMark, correct && styles.correctMark, incorrect && styles.incorrectMark]}>
                  {correct ? '✓' : incorrect ? '×' : selected ? '●' : '○'}
                </Text>
                <Text style={styles.optionText}>{selectLocalizedText(option.label, language)}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      {revealed ? (
        <View style={[styles.explanation, selectedIsCorrect ? styles.explanationCorrect : styles.explanationIncorrect]}>
          <Text style={[styles.feedbackTitle, selectedIsCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect]}>
            {selectedIsCorrect
              ? language === 'tr' ? '✓ Doğru' : '✓ Correct'
              : language === 'tr' ? '× Henüz değil' : '× Not yet'}
          </Text>
          <Text style={styles.explanationText}>
            {selectLocalizedText(question.explanation, language)}
          </Text>
        </View>
      ) : null}
        </View>
      </ScrollView>
      <View style={styles.footer}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
        accessibilityState={{ disabled: !selectedOptionId }}
        disabled={!selectedOptionId}
        onPress={revealed ? next : reveal}
        style={[styles.button, !selectedOptionId && styles.disabled]}
      >
        <Text style={styles.buttonText}>{actionLabel}</Text>
      </Pressable>
      </View>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: { flex: 1, width: '100%' },
    scrollContent: { flexGrow: 1, width: '100%', padding: theme.spacing.md },
    container: {
      width: '100%',
      maxWidth: 760,
      alignSelf: 'center',
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.radius.large,
    },
    progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
    eyebrow: { color: theme.colors.primary, fontSize: 12, fontWeight: '800' },
    progress: { color: theme.colors.textMuted, fontSize: 13 },
    question: { color: theme.colors.text, fontSize: 24, lineHeight: 32, fontWeight: '800' },
    visualWrap: { gap: theme.spacing.xs },
    visualEyebrow: { color: theme.colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 0.7 },
    options: { gap: theme.spacing.sm },
    option: {
      minHeight: 52,
      padding: theme.spacing.md,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.radius.medium,
      backgroundColor: theme.colors.surfaceMuted,
    },
    optionContent: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm },
    optionMark: { width: 20, color: theme.colors.textMuted, fontSize: 16, lineHeight: 23, fontWeight: '900' },
    correctMark: { color: theme.colors.success },
    incorrectMark: { color: theme.colors.risk },
    selectedOption: { borderColor: theme.colors.primary, borderWidth: 2 },
    correctOption: { borderColor: theme.colors.success, borderWidth: 2 },
    incorrectOption: { borderColor: theme.colors.risk, borderWidth: 2 },
    optionText: { color: theme.colors.text, fontSize: 16, lineHeight: 23 },
    explanation: {
      padding: theme.spacing.md,
      borderLeftColor: theme.colors.primary,
      borderLeftWidth: 4,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.small,
      gap: theme.spacing.sm,
    },
    explanationCorrect: { borderLeftColor: theme.colors.success },
    explanationIncorrect: { borderLeftColor: theme.colors.warning },
    feedbackTitle: { fontSize: 14, fontWeight: '900' },
    feedbackCorrect: { color: theme.colors.success },
    feedbackIncorrect: { color: theme.colors.warning },
    explanationText: { color: theme.colors.text, fontSize: 15, lineHeight: 22 },
    footer: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopColor: theme.colors.border, borderTopWidth: 1, backgroundColor: theme.colors.background },
    button: {
      minHeight: 52,
      width: '100%',
      maxWidth: 760,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.radius.medium,
      backgroundColor: theme.colors.primary,
    },
    buttonText: { color: theme.colors.primaryText, fontSize: 16, fontWeight: '800' },
    disabled: { opacity: 0.35 },
  });