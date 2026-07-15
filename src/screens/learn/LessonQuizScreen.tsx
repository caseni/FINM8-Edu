import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LearningFlowHeader, QuizPlayer } from '../../components/learning';
import { getMicroLessonById } from '../../domain/learning/catalog';
import { INITIAL_BADGES } from '../../domain/learning/examples/badges';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import type { QuizResult } from '../../domain/learning/progressionEngine';
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
  const [newBadgeTitle, setNewBadgeTitle] = useState<string>();
  const isSpacedReview = route.params.spacedReview === true;

  useEffect(() => {
    if (lesson && !route.params.review && !isSpacedReview) saveLessonCheckpoint(lesson.id, 'quiz');
  }, [isSpacedReview, lesson, route.params.review, saveLessonCheckpoint]);

  if (!lesson) return <SafeAreaView style={styles.safeArea}><Text style={styles.title}>Ders bulunamadı.</Text></SafeAreaView>;

  if (result) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.resultWrap}>
          <View style={styles.resultCard}>
          <Text style={styles.resultEmoji}>{result.passed ? '✓' : '↻'}</Text>
          <Text style={styles.title}>{result.passed ? (isSpacedReview ? (language === 'tr' ? 'Tekrar tamamlandı' : 'Review completed') : (language === 'tr' ? 'Quiz tamamlandı' : 'Quiz completed')) : (language === 'tr' ? 'Kısa bir tekrar iyi olur' : 'A short review will help')}</Text>
          <Text style={styles.score}>%{result.score}</Text>
          <Text style={styles.body}>{result.correctAnswers}/{result.totalQuestions} {language === 'tr' ? 'doğru cevap' : 'correct answers'}</Text>
          {newBadgeTitle ? <Text style={styles.badgeNotice}>◆ {language === 'tr' ? 'Yeni badge' : 'New badge'}: {newBadgeTitle}</Text> : null}
          <Pressable
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
            <Pressable style={styles.secondaryButton} onPress={() => route.params.review ? navigation.goBack() : navigation.popToTop()}>
              <Text style={styles.secondaryButtonText}>{route.params.review ? (language === 'tr' ? 'Review merkezine dön' : 'Return to review center') : (language === 'tr' ? 'Öğrenme yoluna dön' : 'Return to learning path')}</Text>
            </Pressable>
          ) : null}
          </View>
        </ScrollView>
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
      <ScrollView contentContainerStyle={styles.quizWrap} keyboardShouldPersistTaps="handled">
        <QuizPlayer
          quiz={lesson.quiz}
          language={language}
          eyebrow={isSpacedReview ? { tr: 'AKTİF TEKRAR', en: 'ACTIVE REVIEW' } : undefined}
          onComplete={(_previewResult, submissions) => {
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F', justifyContent: 'center' },
  quizWrap: { flexGrow: 1, justifyContent: 'center', width: '100%', padding: 16 },
  resultWrap: { flexGrow: 1, justifyContent: 'center', width: '100%', padding: 16 },
  resultCard: { alignSelf: 'center', width: '100%', maxWidth: 520, padding: 24, borderRadius: 24, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057', alignItems: 'center', gap: 12 },
  resultEmoji: { color: '#2DD4BF', fontSize: 44, fontWeight: '900' },
  title: { color: '#F8FAFC', fontSize: 25, fontWeight: '900', textAlign: 'center' },
  score: { color: '#2DD4BF', fontSize: 42, fontWeight: '900' },
  body: { color: '#9FB0C3', fontSize: 15 },
  badgeNotice: { color: '#FBBF24', fontSize: 15, fontWeight: '800', textAlign: 'center' },
  button: { marginTop: 10, width: '100%', alignItems: 'center', padding: 16, borderRadius: 14, backgroundColor: '#2DD4BF' },
  buttonText: { color: '#042F2E', fontWeight: '900' },
  secondaryButton: { width: '100%', alignItems: 'center', padding: 12 },
  secondaryButtonText: { color: '#9FB0C3', fontSize: 14, fontWeight: '700' },
});
