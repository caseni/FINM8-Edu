import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import { scoreQuiz, type QuizResult, type QuizSubmission } from '../../domain/learning/progressionEngine';
import type { Quiz } from '../../domain/learning/types';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface QuizPlayerProps {
  quiz: Quiz;
  language: LearningLanguage;
  theme?: LearningTheme;
  onComplete: (result: QuizResult, submissions: readonly QuizSubmission[]) => void;
}

export function QuizPlayer({
  quiz,
  language,
  theme = defaultLearningTheme,
  onComplete,
}: QuizPlayerProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string>();
  const [revealed, setRevealed] = useState(false);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const question = quiz.questions[questionIndex];
  const selectedIsCorrect = selectedOptionId === question.correctOptionId;

  const reveal = () => {
    if (!selectedOptionId) return;
    setRevealed(true);
  };

  const next = () => {
    if (!selectedOptionId) return;
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

  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        <Text style={styles.eyebrow}>{language === 'tr' ? 'MİNİ QUIZ' : 'MINI QUIZ'}</Text>
        <Text style={styles.progress}>
          {questionIndex + 1}/{quiz.questions.length}
        </Text>
      </View>
      <Text style={styles.question}>{selectLocalizedText(question.prompt, language)}</Text>
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
      <Pressable
        accessibilityRole="button"
        disabled={!selectedOptionId}
        onPress={revealed ? next : reveal}
        style={[styles.button, !selectedOptionId && styles.disabled]}
      >
        <Text style={styles.buttonText}>
          {revealed
            ? questionIndex === quiz.questions.length - 1
              ? language === 'tr'
                ? 'Sonucu gör'
                : 'See result'
              : language === 'tr'
                ? 'Sonraki soru'
                : 'Next question'
            : language === 'tr'
              ? 'Cevabı kontrol et'
              : 'Check answer'}
        </Text>
      </Pressable>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
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
    options: { gap: theme.spacing.sm },
    option: {
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
    button: {
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.radius.medium,
      backgroundColor: theme.colors.primary,
    },
    buttonText: { color: theme.colors.primaryText, fontSize: 16, fontWeight: '800' },
    disabled: { opacity: 0.35 },
  });
