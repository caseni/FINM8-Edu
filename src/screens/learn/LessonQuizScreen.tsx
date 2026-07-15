import React, { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { QuizPlayer } from '../../components/learning';
import { getMicroLessonById } from '../../domain/learning/catalog';
import { INITIAL_BADGES } from '../../domain/learning/examples/badges';
import type { LearningLanguage } from '../../domain/learning/presentation';
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
  const tryAwardBadge = useLearningProgressStore((state) => state.tryAwardBadge);
  const [result, setResult] = useState<QuizResult>();
  const [newBadgeTitle, setNewBadgeTitle] = useState<string>();

  if (!lesson) return <SafeAreaView style={styles.safeArea}><Text style={styles.title}>Ders bulunamadı.</Text></SafeAreaView>;

  if (result) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.resultCard}>
          <Text style={styles.resultEmoji}>{result.passed ? '✓' : '↻'}</Text>
          <Text style={styles.title}>{result.passed ? 'Quiz tamamlandı' : 'Kısa bir tekrar iyi olur'}</Text>
          <Text style={styles.score}>%{result.score}</Text>
          <Text style={styles.body}>{result.correctAnswers}/{result.totalQuestions} doğru cevap</Text>
          {newBadgeTitle ? <Text style={styles.badgeNotice}>◆ Yeni badge: {newBadgeTitle}</Text> : null}
          <Pressable style={styles.button} onPress={() => navigation.popToTop()}><Text style={styles.buttonText}>M8 Learn’e dön</Text></Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.quizWrap}>
        <QuizPlayer
          quiz={lesson.quiz}
          language={language}
          onComplete={(_previewResult, submissions) => {
            const storedResult = submitQuiz(lesson, submissions, new Date().toISOString());
            if (storedResult.passed) {
              const awarded = INITIAL_BADGES.find((badge) =>
                tryAwardBadge(badge, new Date().toISOString())
              );
              if (awarded) setNewBadgeTitle(awarded.title.tr);
            }
            setResult(storedResult);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F', justifyContent: 'center' },
  quizWrap: { padding: 20 },
  resultCard: { alignSelf: 'center', width: '90%', maxWidth: 520, padding: 28, borderRadius: 24, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057', alignItems: 'center', gap: 12 },
  resultEmoji: { color: '#2DD4BF', fontSize: 44, fontWeight: '900' },
  title: { color: '#F8FAFC', fontSize: 25, fontWeight: '900', textAlign: 'center' },
  score: { color: '#2DD4BF', fontSize: 42, fontWeight: '900' },
  body: { color: '#9FB0C3', fontSize: 15 },
  badgeNotice: { color: '#FBBF24', fontSize: 15, fontWeight: '800', textAlign: 'center' },
  button: { marginTop: 10, width: '100%', alignItems: 'center', padding: 16, borderRadius: 14, backgroundColor: '#2DD4BF' },
  buttonText: { color: '#042F2E', fontWeight: '900' },
});
