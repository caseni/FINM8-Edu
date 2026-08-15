import React, { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string>();
  const [revealed, setRevealed] = useState(false);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const advancingRef = useRef(false);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const question = quiz.questions[questionIndex];
  const selectedIsCorrect = selectedOptionId === question.correctOptionId;
  const selectedOption = question.options.find((option) => option.id === selectedOptionId);
  const correctOption = question.options.find((option) => option.id === question.correctOptionId);
  const visual = question.visual ?? reinforcementVisual;

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
            {question.options.map((option) => {
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
            <View style={[styles.explanationCard, selectedIsCorrect ? styles.explanationCorrect : styles.explanationWrong]} accessibilityRole="summary">
              <Text style={[styles.explanationTitle, selectedIsCorrect ? styles.titleCorrect : styles.titleWrong]}>
                {selectedIsCorrect ? language === 'tr' ? '✓ Doğru' : '✓ Correct' : language === 'tr' ? 'Bu kez değil' : 'Not this time'}
              </Text>
              {!selectedIsCorrect && selectedOption ? (
                <Text style={styles.explanationLine}>{language === 'tr' ? 'Senin seçimin: ' : 'Your answer: '}<Text style={styles.explanationStrong}>{selectLocalizedText(selectedOption.label, language)}</Text></Text>
              ) : null}
              {!selectedIsCorrect && correctOption ? (
                <Text style={styles.explanationLine}>{language === 'tr' ? 'Doğru cevap: ' : 'Correct answer: '}<Text style={styles.explanationStrong}>{selectLocalizedText(correctOption.label, language)}</Text></Text>
              ) : null}
              <Text style={styles.explanationWhy}>{language === 'tr' ? 'Neden: ' : 'Why: '}{selectLocalizedText(question.explanation, language)}</Text>
            </View>
          ) : null}

          {revealed && visual ? (
            <LessonSupportingVisual assetRef={visual.assetRef} alt={selectLocalizedText(visual.alt, language)} language={language} role="concept" theme={theme} />
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

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { flex: 1, width: '100%' },
  scrollContent: { flexGrow: 1, width: '100%', padding: theme.spacing.md },
  container: { width: '100%', maxWidth: 760, alignSelf: 'center', gap: theme.spacing.md, padding: theme.spacing.lg, backgroundColor: theme.colors.surface, borderRadius: theme.radius.large, borderWidth: 1, borderColor: theme.colors.border },
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: theme.colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  progress: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '800' },
  question: { color: theme.colors.text, fontSize: 23, lineHeight: 31, fontWeight: '800' },
  options: { gap: theme.spacing.sm },
  option: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, padding: theme.spacing.md, borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
  optionSelected: { borderColor: theme.colors.primary, backgroundColor: theme.colors.surfaceMuted },
  optionCorrect: { borderColor: theme.colors.success, backgroundColor: theme.colors.surfaceMuted },
  optionWrong: { borderColor: theme.colors.risk, backgroundColor: theme.colors.surfaceMuted },
  optionMark: { width: 22, color: theme.colors.textMuted, fontSize: 16, fontWeight: '900' },
  markCorrect: { color: theme.colors.success },
  markWrong: { color: theme.colors.risk },
  optionText: { flex: 1, color: theme.colors.text, fontSize: 15, lineHeight: 21, fontWeight: '700' },
  explanationCard: { gap: 7, padding: theme.spacing.md, borderRadius: theme.radius.medium, borderWidth: 1, backgroundColor: theme.colors.surfaceMuted },
  explanationCorrect: { borderColor: theme.colors.success },
  explanationWrong: { borderColor: theme.colors.warning },
  explanationTitle: { fontSize: 14, fontWeight: '900' },
  titleCorrect: { color: theme.colors.success },
  titleWrong: { color: theme.colors.warning },
  explanationLine: { color: theme.colors.textMuted, fontSize: 13, lineHeight: 19 },
  explanationStrong: { color: theme.colors.text, fontWeight: '800' },
  explanationWhy: { color: theme.colors.text, fontSize: 14, lineHeight: 20, fontWeight: '600' },
  footer: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border, backgroundColor: theme.colors.background },
  button: { alignSelf: 'center', width: '100%', maxWidth: 760, minHeight: 52, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.md, borderRadius: theme.radius.medium, backgroundColor: theme.colors.primary },
  buttonText: { color: theme.colors.primaryText, fontSize: 15, fontWeight: '900' },
  disabled: { opacity: 0.4 },
});