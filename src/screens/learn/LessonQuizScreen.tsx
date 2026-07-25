import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LearningFlowHeader, QuizPlayer } from '../../components/learning';
import { getMicroLessonById } from '../../domain/learning/catalog';
import { INITIAL_BADGES } from '../../domain/learning/examples/badges';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import type { QuizResult, QuizSubmission } from '../../domain/learning/progressionEngine';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'LessonQuiz'>;

export function LessonQuizScreen({ route, navigation }: Props) {
  const lesson = getMicroLessonById(route.params.lessonId);
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';
  const submitQuiz = useLearningProgressStore((state) => state.submitQuiz);
  const submitReview = useLearningProgressStore((state) => state.submitReview);
  const completeLesson = useLearningProgressStore((state) => state.completeLesson);
  const saveLessonCheckpoint = useLearningProgressStore((state) => state.saveLessonCheckpoint);
  const tryAwardBadge = useLearningProgressStore((state) => state.tryAwardBadge);
  const [result, setResult] = useState<QuizResult>();
  const [completedSubmissions, setCompletedSubmissions] = useState<readonly QuizSubmission[]>([]);
  const [newBadgeTitle, setNewBadgeTitle] = useState<string>();
  const isSpacedReview = route.params.spacedReview === true;

  useEffect(() => {
    if (lesson && !route.params.review && !isSpacedReview) saveLessonCheckpoint(lesson.id, 'quiz');
  }, [isSpacedReview, lesson, route.params.review, saveLessonCheckpoint]);

  if (!lesson) return <SafeAreaView style={styles.safeArea}><Text style={styles.title}>Ders bulunamadı.</Text></SafeAreaView>;

  if (result) {
    const selectedOptions = new Map(
      completedSubmissions.map((submission) => [
        submission.questionId,
        submission.selectedOptionId,
      ])
    );
    const missedQuestions = lesson.quiz.questions.flatMap((question, index) => {
      const selectedOptionId = selectedOptions.get(question.id);
      if (selectedOptionId === question.correctOptionId) return [];
      return [{
        question,
        questionNumber: index + 1,
        selectedOption: question.options.find((option) => option.id === selectedOptionId),
        correctOption: question.options.find((option) => option.id === question.correctOptionId),
      }];
    });

    return (
      <SafeAreaView style={styles.safeArea}>
        <LearningFlowHeader
          language={language}
          stage={3}
          onExit={() => route.params.review ? navigation.goBack() : navigation.popToTop()}
        />
        <ScrollView contentContainerStyle={styles.resultWrap}>
          <View style={styles.resultCard}>
            <Text style={styles.resultEyebrow}>{language === 'tr' ? 'DERS AKIŞI · 3/3' : 'LEARNING FLOW · 3/3'}</Text>
            <Text style={styles.resultEmoji}>{result.passed ? '✓' : '↻'}</Text>
            <Text style={styles.title}>{result.passed ? (isSpacedReview ? (language === 'tr' ? 'Tekrar tamamlandı' : 'Review completed') : (language === 'tr' ? 'Quiz tamamlandı' : 'Quiz completed')) : (language === 'tr' ? 'Kısa bir tekrar iyi olur' : 'A short review will help')}</Text>
            <Text style={styles.score}>%{result.score}</Text>
            <Text style={styles.body}>{result.correctAnswers}/{result.totalQuestions} {language === 'tr' ? 'doğru cevap' : 'correct answers'}</Text>
            {newBadgeTitle ? <Text style={styles.badgeNotice}>◆ {language === 'tr' ? 'Yeni badge' : 'New badge'}: {newBadgeTitle}</Text> : null}
          </View>
          {missedQuestions.length > 0 ? (
            <View
              accessibilityRole="summary"
              style={styles.reviewSection}
            >
              <View style={styles.reviewHeading}>
                <Text style={styles.reviewEyebrow}>
                  {language === 'tr' ? 'ÖĞRENME ÖZETİ' : 'LEARNING SUMMARY'}
                </Text>
                <Text style={styles.reviewTitle}>
                  {language === 'tr'
                    ? `${missedQuestions.length} kavramı güçlendir`
                    : `Strengthen ${missedQuestions.length} ${missedQuestions.length === 1 ? 'concept' : 'concepts'}`}
                </Text>
                <Text style={styles.reviewIntro}>
                  {language === 'tr'
                    ? 'Yalnız kaçırdığın noktaları gösteriyoruz. Açıklamayı oku, sonra yeniden deneyebilirsin.'
                    : 'Only missed points are shown. Read the explanation, then try again when ready.'}
                </Text>
              </View>
              {missedQuestions.map(({ question, questionNumber, selectedOption, correctOption }) => (
                <View key={question.id} style={styles.reviewCard}>
                  <Text style={styles.reviewQuestionNumber}>
                    {language === 'tr' ? `SORU ${questionNumber}` : `QUESTION ${questionNumber}`}
                  </Text>
                  <Text style={styles.reviewQuestion}>
                    {selectLocalizedText(question.prompt, language)}
                  </Text>
                  <View style={styles.answerRow}>
                    <Text style={styles.answerLabel}>
                      {language === 'tr' ? 'Senin cevabın' : 'Your answer'}
                    </Text>
                    <Text style={styles.incorrectAnswer}>
                      {selectedOption
                        ? selectLocalizedText(selectedOption.label, language)
                        : language === 'tr' ? 'Cevap verilmedi' : 'No answer'}
                    </Text>
                  </View>
                  <View style={styles.answerRow}>
                    <Text style={styles.answerLabel}>
                      {language === 'tr' ? 'Doğru kavram' : 'Correct concept'}
                    </Text>
                    <Text style={styles.correctAnswer}>
                      {correctOption
                        ? selectLocalizedText(correctOption.label, language)
                        : '—'}
                    </Text>
                  </View>
                  <View style={styles.whyBox}>
                    <Text style={styles.whyLabel}>
                      {language === 'tr' ? 'NEDEN?' : 'WHY?'}
                    </Text>
                    <Text style={styles.whyText}>
                      {selectLocalizedText(question.explanation, language)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View accessibilityRole="summary" style={styles.perfectNotice}>
              <Text style={styles.perfectTitle}>
                {language === 'tr' ? 'Tüm kavramlar doğru' : 'All concepts correct'}
              </Text>
              <Text style={styles.perfectText}>
                {language === 'tr'
                  ? 'Bu quizde tekrar gerektiren bir cevap yok.'
                  : 'There are no answers to review in this quiz.'}
              </Text>
            </View>
          )}
        </ScrollView>
        <View style={styles.resultFooter}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={result.passed
              ? route.params.review
                ? language === 'tr' ? 'Review merkezine dön' : 'Return to review center'
                : language === 'tr' ? 'M8 Learn’e dön' : 'Return to M8 Learn'
              : isSpacedReview
                ? language === 'tr' ? 'Tekrarı yeniden dene' : 'Retry the review'
                : language === 'tr' ? 'Quiz’i tekrar dene' : 'Retry the quiz'}
            style={styles.button}
            onPress={() => result.passed
              ? (route.params.review ? navigation.goBack() : navigation.popToTop())
              : setResult(undefined)}
          >
            <Text style={styles.buttonText}>
              {result.passed
                ? route.params.review
                  ? language === 'tr' ? 'Review merkezine dön' : 'Return to review center'
                  : language === 'tr' ? 'M8 Learn’e dön' : 'Return to M8 Learn'
                : isSpacedReview
                  ? language === 'tr' ? 'Tekrarı yeniden dene' : 'Retry the review'
                  : language === 'tr' ? 'Quiz’i tekrar dene' : 'Retry the quiz'}
            </Text>
          </Pressable>
          {!result.passed ? (
            <Pressable accessibilityRole="button" style={styles.secondaryButton} onPress={() => route.params.review ? navigation.goBack() : navigation.popToTop()}>
              <Text style={styles.secondaryButtonText}>{route.params.review ? (language === 'tr' ? 'Review merkezine dön' : 'Return to review center') : (language === 'tr' ? 'Öğrenme yoluna dön' : 'Return to learning path')}</Text>
            </Pressable>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LearningFlowHeader
        language={language}
        stage={3}
        onExit={() => route.params.review ? navigation.goBack() : navigation.popToTop()}
      />
      <QuizPlayer
        quiz={lesson.quiz}
        language={language}
        eyebrow={isSpacedReview ? { tr: 'AKTİF TEKRAR', en: 'ACTIVE REVIEW' } : undefined}
        onComplete={(_previewResult, submissions) => {
          setCompletedSubmissions(submissions);
          if (route.params.review) {
            setResult(_previewResult);
            return;
          }
          const now = new Date().toISOString();
          const storedResult = isSpacedReview
            ? submitReview(lesson, submissions, now)
            : submitQuiz(lesson, submissions, now);
          if (storedResult.passed && !isSpacedReview) {
            completeLesson(lesson, now);
          }
          if (storedResult.passed) {
            const awarded = INITIAL_BADGES.filter((badge) =>
              tryAwardBadge(badge, now)
            );
            if (awarded.length > 0) {
              setNewBadgeTitle(awarded.map((badge) => selectLocalizedText(badge.title, language)).join(' · '));
            }
          }
          setResult(storedResult);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F' },
  resultWrap: { flexGrow: 1, justifyContent: 'center', width: '100%', padding: 16 },
  resultCard: { alignSelf: 'center', width: '100%', maxWidth: 520, padding: 24, borderRadius: 24, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057', alignItems: 'center', gap: 12 },
  resultEyebrow: { color: '#2DD4BF', fontSize: 12, fontWeight: '900', letterSpacing: 0.7 },
  resultEmoji: { color: '#2DD4BF', fontSize: 44, fontWeight: '900' },
  title: { color: '#F8FAFC', fontSize: 25, fontWeight: '900', textAlign: 'center' },
  score: { color: '#2DD4BF', fontSize: 42, fontWeight: '900' },
  body: { color: '#9FB0C3', fontSize: 15 },
  badgeNotice: { color: '#FBBF24', fontSize: 15, fontWeight: '800', textAlign: 'center' },
  reviewSection: { alignSelf: 'center', width: '100%', maxWidth: 520, gap: 12 },
  reviewHeading: { paddingHorizontal: 4, gap: 5 },
  reviewEyebrow: { color: '#FBBF24', fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  reviewTitle: { color: '#F8FAFC', fontSize: 21, lineHeight: 27, fontWeight: '900' },
  reviewIntro: { color: '#9FB0C3', fontSize: 14, lineHeight: 20 },
  reviewCard: { padding: 18, borderRadius: 18, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057', gap: 12 },
  reviewQuestionNumber: { color: '#FBBF24', fontSize: 11, fontWeight: '900', letterSpacing: 0.7 },
  reviewQuestion: { color: '#F8FAFC', fontSize: 17, lineHeight: 24, fontWeight: '800' },
  answerRow: { gap: 4 },
  answerLabel: { color: '#8094A8', fontSize: 11, fontWeight: '800' },
  incorrectAnswer: { color: '#FDA4AF', fontSize: 14, lineHeight: 20, fontWeight: '700' },
  correctAnswer: { color: '#6EE7B7', fontSize: 14, lineHeight: 20, fontWeight: '800' },
  whyBox: { padding: 13, borderRadius: 12, backgroundColor: '#0C1928', borderLeftWidth: 3, borderLeftColor: '#2DD4BF', gap: 5 },
  whyLabel: { color: '#2DD4BF', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  whyText: { color: '#D8E2EC', fontSize: 14, lineHeight: 21 },
  perfectNotice: { alignSelf: 'center', width: '100%', maxWidth: 520, padding: 18, borderRadius: 18, backgroundColor: '#123B42', borderWidth: 1, borderColor: '#2DD4BF', gap: 5 },
  perfectTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '900' },
  perfectText: { color: '#B8D6D5', fontSize: 14, lineHeight: 20 },
  resultFooter: { paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#1F3449', backgroundColor: '#07111F', gap: 2 },
  button: { alignSelf: 'center', width: '100%', maxWidth: 520, minHeight: 52, alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 14, backgroundColor: '#2DD4BF' },
  buttonText: { color: '#042F2E', fontWeight: '900' },
  secondaryButton: { alignSelf: 'center', width: '100%', maxWidth: 520, minHeight: 44, alignItems: 'center', justifyContent: 'center', padding: 12 },
  secondaryButtonText: { color: '#9FB0C3', fontSize: 14, fontWeight: '700' },
});
