import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LearningFlowHeader, QuizPlayer } from '../../components/learning';
import { BeginnerQuizPlayer } from '../../components/learning/BeginnerQuizPlayer';
import { ACADEMY_TRACK_IDS, ACADEMY_TRACKS } from '../../domain/learning/academyTracks';
import { BEGINNER_SECTIONS } from '../../domain/learning/beginnerJourney';
import { getMicroLessonById } from '../../domain/learning/catalog';
import { INITIAL_BADGES } from '../../domain/learning/examples/badges';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import type { QuizResult } from '../../domain/learning/progressionEngine';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'LessonQuiz'>;

const BEGINNER_LESSON_IDS = new Set(
  Object.values(BEGINNER_SECTIONS).flatMap((section) => [...section.lessonIds])
);

const ACADEMY_FOUNDATION_LESSON_COUNT = 6;

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
  const navigationState = navigation.getState();
  const previousRoute = navigationState.routes[navigationState.index - 1];
  const openedFromAcademy = previousRoute?.name === 'Academy';

  useEffect(() => {
    if (lesson && !route.params.review && !isSpacedReview) saveLessonCheckpoint(lesson.id, 'quiz');
  }, [isSpacedReview, lesson, route.params.review, saveLessonCheckpoint]);

  const returnToEntry = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Home');
  };

  if (!lesson) return <SafeAreaView style={styles.safeArea}><Text style={styles.title}>Ders bulunamadı.</Text></SafeAreaView>;

  const beginner = BEGINNER_LESSON_IDS.has(lesson.id);
  const reinforcementBlock = lesson.contentBlocks.find((block) => block.kind === 'visual');
  const academyTrack = openedFromAcademy
    ? ACADEMY_TRACK_IDS.map((trackId) => ACADEMY_TRACKS[trackId]).find((track) => track.lessonIds.includes(lesson.id))
    : undefined;
  const academyLessonIndex = academyTrack ? academyTrack.lessonIds.indexOf(lesson.id) : -1;
  const nextAcademyLessonId = academyTrack && academyLessonIndex >= 0
    ? academyTrack.lessonIds[academyLessonIndex + 1]
    : undefined;
  const reachedAcademyFoundationBoundary = academyLessonIndex === ACADEMY_FOUNDATION_LESSON_COUNT - 1;

  const handleComplete = (_previewResult: QuizResult, submissions: readonly { questionId: string; selectedOptionId: string }[]) => {
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
      const awarded = INITIAL_BADGES.filter((badge) => tryAwardBadge(badge, now));
      if (awarded.length > 0) {
        setNewBadgeTitle(awarded.map((badge) => selectLocalizedText(badge.title, language)).join(' · '));
      }
    }
    setResult(storedResult);
  };

  if (result) {
    const canContinueAcademy = Boolean(
      result.passed &&
      openedFromAcademy &&
      !route.params.review &&
      !isSpacedReview &&
      nextAcademyLessonId &&
      !reachedAcademyFoundationBoundary
    );
    const primaryLabel = result.passed
      ? route.params.review
        ? language === 'tr' ? 'Review merkezine dön' : 'Return to review center'
        : canContinueAcademy
          ? language === 'tr' ? 'Sıradaki derse geç' : 'Continue to next lesson'
          : openedFromAcademy
            ? language === 'tr' ? 'Academy’ye dön' : 'Return to Academy'
            : language === 'tr' ? 'Öğrenme alanına dön' : 'Return to learning'
      : isSpacedReview
        ? language === 'tr' ? 'Tekrarı yeniden dene' : 'Retry the review'
        : language === 'tr' ? 'Quiz’i tekrar dene' : 'Retry the quiz';
    const secondaryLabel = result.passed && canContinueAcademy
      ? language === 'tr' ? 'Academy’ye dön' : 'Return to Academy'
      : route.params.review
        ? language === 'tr' ? 'Review merkezine dön' : 'Return to review center'
        : openedFromAcademy
          ? language === 'tr' ? 'Academy’ye dön' : 'Return to Academy'
          : language === 'tr' ? 'Öğrenme yoluna dön' : 'Return to learning path';

    const handlePrimary = () => {
      if (!result.passed) {
        setResult(undefined);
        return;
      }
      if (canContinueAcademy && nextAcademyLessonId) {
        navigation.replace('MicroLesson', { lessonId: nextAcademyLessonId, source: 'academy' });
        return;
      }
      returnToEntry();
    };

    return (
      <SafeAreaView style={styles.safeArea}>
        <LearningFlowHeader
          language={language}
          stage={3}
          onExit={returnToEntry}
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
          <View accessibilityRole="summary" style={styles.takeawayCard}>
            <Text style={styles.takeawayEyebrow}>
              {language === 'tr' ? 'AKLINDA KALSIN' : 'REMEMBER THIS'}
            </Text>
            <Text style={styles.takeawayText}>
              {selectLocalizedText(lesson.takeaway, language)}
            </Text>
            {result.passed && reachedAcademyFoundationBoundary ? (
              <Text style={styles.takeawayHint}>
                {language === 'tr'
                  ? 'Bu okulun temel 6 dersini tamamladın. Daha teknik ikinci katman isteğe bağlı; Academy’ye dönüp hazır olduğunda devam edebilirsin.'
                  : 'You completed this school’s six foundation lessons. The more technical second layer is optional; return to Academy and continue when you are ready.'}
              </Text>
            ) : !result.passed ? (
              <Text style={styles.takeawayHint}>
                {isSpacedReview
                  ? language === 'tr' ? 'Bu ana fikri hatırla, sonra tekrarı yeniden dene.' : 'Keep this main idea in mind, then retry the review.'
                  : language === 'tr' ? 'Bu ana fikri hatırla, sonra quiz’i yeniden dene.' : 'Keep this main idea in mind, then retry the quiz.'}
              </Text>
            ) : null}
          </View>
        </ScrollView>
        <View style={styles.resultFooter}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={primaryLabel}
            style={styles.button}
            onPress={handlePrimary}
          >
            <Text style={styles.buttonText}>{primaryLabel}</Text>
          </Pressable>
          {(!result.passed || canContinueAcademy) ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={secondaryLabel}
              style={styles.secondaryButton}
              onPress={returnToEntry}
            >
              <Text style={styles.secondaryButtonText}>{secondaryLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }

  const eyebrow = isSpacedReview ? { tr: 'AKTİF TEKRAR', en: 'ACTIVE REVIEW' } as const : undefined;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LearningFlowHeader
        language={language}
        stage={3}
        onExit={returnToEntry}
      />
      {beginner ? (
        <BeginnerQuizPlayer
          quiz={lesson.quiz}
          language={language}
          eyebrow={eyebrow}
          reinforcementVisual={reinforcementBlock && reinforcementBlock.kind === 'visual'
            ? { assetRef: reinforcementBlock.assetRef, alt: reinforcementBlock.alt }
            : undefined}
          onComplete={handleComplete}
        />
      ) : (
        <QuizPlayer
          quiz={lesson.quiz}
          language={language}
          eyebrow={eyebrow}
          onComplete={handleComplete}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F' },
  resultWrap: { flexGrow: 1, justifyContent: 'center', width: '100%', padding: 16, gap: 12 },
  resultCard: { alignSelf: 'center', width: '100%', maxWidth: 520, padding: 24, borderRadius: 24, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057', alignItems: 'center', gap: 12 },
  resultEyebrow: { color: '#2DD4BF', fontSize: 12, fontWeight: '900', letterSpacing: 0.7 },
  resultEmoji: { color: '#2DD4BF', fontSize: 44, fontWeight: '900' },
  title: { color: '#F8FAFC', fontSize: 25, fontWeight: '900', textAlign: 'center' },
  score: { color: '#2DD4BF', fontSize: 42, fontWeight: '900' },
  body: { color: '#9FB0C3', fontSize: 15 },
  badgeNotice: { color: '#FBBF24', fontSize: 15, fontWeight: '800', textAlign: 'center' },
  takeawayCard: { alignSelf: 'center', width: '100%', maxWidth: 520, padding: 18, borderRadius: 18, backgroundColor: '#0C1928', borderWidth: 1, borderColor: '#294057', gap: 7 },
  takeawayEyebrow: { color: '#2DD4BF', fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  takeawayText: { color: '#F8FAFC', fontSize: 16, lineHeight: 23, fontWeight: '700' },
  takeawayHint: { color: '#9FB0C3', fontSize: 14, lineHeight: 20 },
  resultFooter: { paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#1F3449', backgroundColor: '#07111F', gap: 2 },
  button: { alignSelf: 'center', width: '100%', maxWidth: 520, minHeight: 52, alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 14, backgroundColor: '#2DD4BF' },
  buttonText: { color: '#042F2E', fontWeight: '900' },
  secondaryButton: { alignSelf: 'center', width: '100%', maxWidth: 520, minHeight: 44, alignItems: 'center', justifyContent: 'center', padding: 12 },
  secondaryButtonText: { color: '#9FB0C3', fontSize: 14, fontWeight: '700' },
});
