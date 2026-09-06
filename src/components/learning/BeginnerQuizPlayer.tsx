import React, { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import { scoreQuiz, type QuizResult, type QuizSubmission } from '../../domain/learning/progressionEngine';
import type { LocalizedText, Quiz } from '../../domain/learning/types';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import { LessonSupportingVisual } from './LessonSupportingVisual';

export interface BeginnerQuizPlayerProps {
  quiz: Quiz;
  language: LearningLanguage;
  reinforcementVisual?: { assetRef: string; alt: LocalizedText };
  theme?: LearningTheme;
  onComplete: (result: QuizResult, submissions: readonly QuizSubmission[]) => void;
  eyebrow?: LocalizedText;
}

export function BeginnerQuizPlayer({ quiz, language, reinforcementVisual, theme = defaultLearningTheme, onComplete, eyebrow }: BeginnerQuizPlayerProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string>();
  const [revealed, setRevealed] = useState(false);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const advancingRef = useRef(false);
  const styles = useMemo(() => createStyles(theme, wide), [theme, wide]);
  const question = quiz.questions[questionIndex];
  const displayedOptions = useMemo(() => {
    const options = [...question.options];
    if (options.length < 2) return options;

    let hash = 0;
    for (const character of question.id) {
      hash = ((hash * 31) + character.charCodeAt(0)) >>> 0;
    }
    const targetCorrectIndex = (hash + questionIndex) % options.length;
    const authoredCorrectIndex = options.findIndex((option) => option.id === question.correctOptionId);
    if (authoredCorrectIndex < 0) return options;

    const leftShift = (authoredCorrectIndex - targetCorrectIndex + options.length) % options.length;
    return [...options.slice(leftShift), ...options.slice(0, leftShift)];
  }, [question, questionIndex]);
  const selectedIsCorrect = selectedOptionId === question.correctOptionId;
  const selectedOption = question.options.find((option) => option.id === selectedOptionId);
  const correctOption = question.options.find((option) => option.id === question.correctOptionId);
  const visual = question.visual ?? reinforcementVisual;
  const explanation = selectLocalizedText(question.explanation, language);
  const feedbackAccessibilityLabel = selectedIsCorrect
    ? language === 'tr'
      ? `Doğru. Neden: ${explanation}`
      : `Correct. Why: ${explanation}`
    : language === 'tr'
      ? `Bu kez değil. Senin seçimin: ${selectedOption ? selectLocalizedText(selectedOption.label, language) : '—'}. Doğru cevap: ${correctOption ? selectLocalizedText(correctOption.label, language) : '—'}. Neden: ${explanation}`
      : `Not this time. Your answer: ${selectedOption ? selectLocalizedText(selectedOption.label, language) : '—'}. Correct answer: ${correctOption ? selectLocalizedText(correctOption.label, language) : '—'}. Why: ${explanation}`;

  const reveal = () => {
    if (!selectedOptionId) return;
    setRevealed(true);
  };

  const next = () => {
    if (!selectedOptionId || advancingRef.current) return;
    advancingRef.current = true;
    const nextSubmissions = [...submissions, { questionId: question.id, selectedOptionId }];
    if (questionIndex === quiz.questions.length - 1) {
      onComplete(scoreQuiz(quiz, nextSubmissions), nextSubmissions);
      return;
    }
    setSubmissions(nextSubmissions);
    setQuestionIndex((current) => current + 1);
    setSelectedOptionId(undefined);
    setRevealed(false);
    advancingRef.current = false;
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
            <Text style={styles.progress}>{questionIndex + 1}/{quiz.questions.length}</Text>
          </View>

          <Text style={styles.question}>{selectLocalizedText(question.prompt, language)}</Text>

          <View style={styles.options}>
            {displayedOptions.map((option) => {
              const selected = option.id === selectedOptionId;
              const correct = revealed && option.id === question.correctOptionId;
              const incorrect = revealed && selected && !correct;
              const optionLabel = selectLocalizedText(option.label, language);
              return (
                <Pressable
                  role="radio"
                  aria-label={optionLabel}
                  aria-checked={selected}
                  aria-disabled={revealed}
                  accessibilityRole="radio"
                  accessibilityLabel={optionLabel}
                  accessibilityState={{ checked: selected, disabled: revealed }}
                  disabled={revealed}
                  key={option.id}
                  onPress={() => setSelectedOptionId(option.id)}
                  style={[styles.option, selected && styles.optionSelected, correct && styles.optionCorrect, incorrect && styles.optionWrong]}
                >
                  <Text style={[styles.optionMark, correct && styles.markCorrect, incorrect && styles.markWrong]}>{correct ? '✓' : incorrect ? '×' : selected ? '●' : '○'}</Text>
                  <Text style={styles.optionText}>{optionLabel}</Text>
                </Pressable>
              );
            })}
          </View>

          {revealed ? (
            <View style={styles.feedbackGroup}>
              <View
                style={[styles.explanationCard, selectedIsCorrect ? styles.explanationCorrect : styles.explanationWrong]}
                role="status"
                aria-label={feedbackAccessibilityLabel}
                aria-live="polite"
                accessibilityRole="summary"
                accessibilityLabel={feedbackAccessibilityLabel}
                accessibilityLiveRegion="polite"
              >
                <Text style={[styles.explanationTitle, selectedIsCorrect ? styles.titleCorrect : styles.titleWrong]}>
                  {selectedIsCorrect ? language === 'tr' ? '✓ Doğru' : '✓ Correct' : language === 'tr' ? 'Bu kez değil' : 'Not this time'}
                </Text>
                {!selectedIsCorrect && selectedOption ? (
                  <Text style={styles.explanationLine}>{language === 'tr' ? 'Senin seçimin: ' : 'Your answer: '}<Text style={styles.explanationStrong}>{selectLocalizedText(selectedOption.label, language)}</Text></Text>
                ) : null}
                {!selectedIsCorrect && correctOption ? (
                  <Text style={styles.explanationLine}>{language === 'tr' ? 'Doğru cevap: ' : 'Correct answer: '}<Text style={styles.explanationStrong}>{selectLocalizedText(correctOption.label, language)}</Text></Text>
                ) : null}
                <Text style={styles.explanationWhy}>{language === 'tr' ? 'Neden: ' : 'Why: '}{explanation}</Text>
              </View>
              {visual ? (
                <View style={styles.feedbackVisual}>
                  <LessonSupportingVisual
                    assetRef={visual.assetRef}
                    alt={selectLocalizedText(visual.alt, language)}
                    language={language}
                    role="concept"
                    theme={theme}
                  />
                </View>
              ) : null}
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

const createStyles = (theme: LearningTheme, wide: boolean) => StyleSheet.create({
  shell: { flex: 1, width: '100%', backgroundColor: theme.colors.background },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: wide ? 28 : theme.spacing.md,
    paddingTop: wide ? 28 : 18,
    paddingBottom: wide ? 42 : 28,
  },
  container: {
    width: '100%',
    maxWidth: wide ? 860 : 720,
    alignSelf: 'center',
    gap: wide ? 20 : 16,
  },
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: theme.colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 0.95 },
  progress: { color: theme.colors.textMuted, fontSize: 11, fontWeight: '900' },
  question: { maxWidth: 760, color: theme.colors.text, fontSize: wide ? 30 : 24, lineHeight: wide ? 39 : 32, fontWeight: '900' },
  options: { gap: 9 },
  option: {
    minHeight: wide ? 64 : 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: wide ? 16 : 14,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  optionSelected: { borderColor: theme.colors.primary, backgroundColor: theme.colors.surfaceMuted },
  optionCorrect: { borderColor: theme.colors.success, backgroundColor: theme.colors.surfaceMuted },
  optionWrong: { borderColor: theme.colors.risk, backgroundColor: theme.colors.surfaceMuted },
  optionMark: { width: 22, color: theme.colors.textMuted, fontSize: 16, fontWeight: '900' },
  markCorrect: { color: theme.colors.success },
  markWrong: { color: theme.colors.risk },
  optionText: { flex: 1, color: theme.colors.text, fontSize: wide ? 15 : 14, lineHeight: wide ? 22 : 20, fontWeight: '700' },
  feedbackGroup: { flexDirection: wide ? 'row' : 'column', alignItems: wide ? 'stretch' : undefined, gap: 14 },
  explanationCard: { flex: wide ? 0.92 : undefined, justifyContent: 'center', gap: 7, padding: wide ? 20 : 16, borderRadius: 18, borderWidth: 1, backgroundColor: theme.colors.surface },
  explanationCorrect: { borderColor: theme.colors.success },
  explanationWrong: { borderColor: theme.colors.warning },
  explanationTitle: { fontSize: wide ? 15 : 14, fontWeight: '900' },
  titleCorrect: { color: theme.colors.success },
  titleWrong: { color: theme.colors.warning },
  explanationLine: { color: theme.colors.textMuted, fontSize: wide ? 13 : 12, lineHeight: wide ? 20 : 18 },
  explanationStrong: { color: theme.colors.text, fontWeight: '800' },
  explanationWhy: { color: theme.colors.text, fontSize: wide ? 14 : 13, lineHeight: wide ? 21 : 19, fontWeight: '500' },
  feedbackVisual: { flex: wide ? 1.08 : undefined, width: wide ? undefined : '100%' },
  footer: { paddingHorizontal: wide ? 28 : theme.spacing.md, paddingVertical: 10, borderTopWidth: 1, borderTopColor: theme.colors.border, backgroundColor: theme.colors.background },
  button: { alignSelf: 'center', width: '100%', maxWidth: wide ? 860 : 720, minHeight: 52, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, borderRadius: 14, backgroundColor: theme.colors.primary },
  buttonText: { color: theme.colors.primaryText, fontSize: 14, fontWeight: '900' },
  disabled: { opacity: 0.4 },
});