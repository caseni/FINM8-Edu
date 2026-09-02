import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
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
  const { width } = useWindowDimensions();
  const wide = width >= 820;
  const styles = createStyles(wide);
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
  const openedFromAcademy = route.params.source === 'academy' || previousRoute?.name === 'Academy';

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

  const returnToAcademy = () => {
    if (previousRoute?.name === 'Academy' && navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Academy');
  };

  const returnToLearningEntry = openedFromAcademy ? returnToAcademy : returnToEntry;

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
  const completedAcademyTrack = Boolean(
    academyTrack &&
    academyLessonIndex >= 0 &&
    academyLessonIndex === academyTrack.lessonIds.length - 1
  );
  const academyTrackTitle = academyTrack ? selectLocalizedText(academyTrack.title, language) : undefined;

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
    const showAcademyTrackCompletion = Boolean(
      result.passed &&
      completedAcademyTrack &&
      !route.params.review &&
      !isSpacedReview
    );
    const lessonTitle = selectLocalizedText(lesson.title, language);
    const resultAccessibilityLabel = showAcademyTrackCompletion && academyTrackTitle
      ? language === 'tr'
        ? `${academyTrackTitle} okulu tamamlandı. 12/12 ders. Quiz skoru yüzde ${result.score}.`
        : `${academyTrackTitle} school complete. 12 of 12 lessons. Quiz score ${result.score} percent.`
      : result.passed
        ? isSpacedReview
          ? language === 'tr'
            ? `${lessonTitle}. Tekrar tamamlandı. Skor yüzde ${result.score}. ${result.correctAnswers}/${result.totalQuestions} doğru cevap.`
            : `${lessonTitle}. Review completed. Score ${result.score} percent. ${result.correctAnswers} of ${result.totalQuestions} correct.`
          : language === 'tr'
            ? `${lessonTitle}. Quiz tamamlandı. Skor yüzde ${result.score}. ${result.correctAnswers}/${result.totalQuestions} doğru cevap.`
            : `${lessonTitle}. Quiz completed. Score ${result.score} percent. ${result.correctAnswers} of ${result.totalQuestions} correct.`
        : isSpacedReview
          ? language === 'tr'
            ? `${lessonTitle}. Tekrar henüz tamamlanmadı. Skor yüzde ${result.score}. ${result.correctAnswers}/${result.totalQuestions} doğru cevap. Geçme eşiği yüzde ${lesson.quiz.passingScore}.`
            : `${lessonTitle}. Review not passed yet. Score ${result.score} percent. ${result.correctAnswers} of ${result.totalQuestions} correct. Passing score ${lesson.quiz.passingScore} percent.`
          : language === 'tr'
            ? `${lessonTitle}. Quiz henüz tamamlanmadı. Skor yüzde ${result.score}. ${result.correctAnswers}/${result.totalQuestions} doğru cevap. Geçme eşiği yüzde ${lesson.quiz.passingScore}.`
            : `${lessonTitle}. Quiz not passed yet. Score ${result.score} percent. ${result.correctAnswers} of ${result.totalQuestions} correct. Passing score ${lesson.quiz.passingScore} percent.`;
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
      returnToLearningEntry();
    };

    return (
      <SafeAreaView style={styles.safeArea}>
        <LearningFlowHeader
          language={language}
          stage={3}
          onExit={returnToLearningEntry}
        />
        <ScrollView contentContainerStyle={styles.resultWrap}>
          <View
            style={styles.resultCard}
            accessibilityRole="summary"
            accessibilityLabel={resultAccessibilityLabel}
            accessibilityLiveRegion="polite"
          >
            <View style={styles.resultStatus}>
              <Text style={styles.resultEyebrow}>
                {showAcademyTrackCompletion
                  ? language === 'tr' ? 'OKUL TAMAMLANDI' : 'SCHOOL COMPLETE'
                  : language === 'tr' ? 'DERS AKIŞI · 3/3' : 'LEARNING FLOW · 3/3'}
              </Text>
              <View style={[styles.resultIcon, !result.passed && styles.resultIconRetry]}>
                <Text style={styles.resultEmoji}>{result.passed ? '✓' : '↻'}</Text>
              </View>
            </View>
            <View style={styles.resultCopy}>
              <Text style={styles.title}>
                {showAcademyTrackCompletion
                  ? language === 'tr' ? 'Okulu tamamladın' : 'You completed the school'
                  : result.passed
                    ? isSpacedReview
                      ? language === 'tr' ? 'Tekrar tamamlandı' : 'Review completed'
                      : language === 'tr' ? 'Quiz tamamlandı' : 'Quiz completed'
                    : language === 'tr' ? 'Kısa bir tekrar iyi olur' : 'A short review will help'}
              </Text>
              <Text style={styles.body}>
                {showAcademyTrackCompletion && academyTrackTitle
                  ? `${academyTrackTitle} · ${academyTrack?.lessonIds.length ?? 12}/12 ${language === 'tr' ? 'ders' : 'lessons'}`
                  : `${result.correctAnswers}/${result.totalQuestions} ${language === 'tr' ? 'doğru cevap' : 'correct answers'}`}
              </Text>
              {newBadgeTitle ? <Text style={styles.badgeNotice}>◆ {language === 'tr' ? 'Yeni badge' : 'New badge'}: {newBadgeTitle}</Text> : null}
            </View>
            <View style={styles.scoreBlock}>
              <Text style={styles.score}>%{result.score}</Text>
              <Text style={styles.scoreLabel}>{language === 'tr' ? 'skor' : 'score'}</Text>
            </View>
          </View>
          <View accessibilityRole="summary" style={styles.takeawayCard}>
            <Text style={styles.takeawayEyebrow}>
              {language === 'tr' ? 'AKLINDA KALSIN' : 'REMEMBER THIS'}
            </Text>
            <Text style={styles.takeawayText}>
              {selectLocalizedText(lesson.takeaway, language)}
            </Text>
            {showAcademyTrackCompletion ? (
              <Text style={styles.takeawayHint}>
                {language === 'tr'
                  ? 'Bu okulun 12 dersini tamamladın. Academy’ye dönüp başka bir alana geçebilir veya bu konulara daha sonra tekrar dönebilirsin.'
                  : 'You completed all 12 lessons in this school. Return to Academy to explore another subject or revisit these topics later.'}
              </Text>
            ) : result.passed && reachedAcademyFoundationBoundary ? (
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
              onPress={returnToLearningEntry}
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
        onExit={returnToLearningEntry}
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

const createStyles = (wide: boolean) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F' },
  resultWrap: { flexGrow: 1, justifyContent: 'center', width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: wide ? 28 : 16, paddingVertical: wide ? 28 : 18, gap: 12 },
  resultCard: { width: '100%', flexDirection: wide ? 'row' : 'column', alignItems: wide ? 'center' : 'stretch', gap: wide ? 20 : 14, padding: wide ? 22 : 18, borderRadius: 22, backgroundColor: '#0B1C2A', borderWidth: 1, borderColor: '#294057' },
  resultStatus: { flexDirection: wide ? 'column' : 'row', alignItems: 'center', justifyContent: wide ? 'center' : 'space-between', gap: 9 },
  resultEyebrow: { color: '#55DCCB', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  resultIcon: { width: wide ? 48 : 42, height: wide ? 48 : 42, alignItems: 'center', justifyContent: 'center', borderRadius: 15, borderWidth: 1, borderColor: '#32786F', backgroundColor: '#103633' },
  resultIconRetry: { borderColor: '#755E42', backgroundColor: '#2B241D' },
  resultEmoji: { color: '#5EEAD4', fontSize: wide ? 25 : 22, lineHeight: wide ? 28 : 25, fontWeight: '900' },
  resultCopy: { flex: 1, gap: 5 },
  title: { color: '#F8FAFC', fontSize: wide ? 23 : 21, lineHeight: wide ? 29 : 27, fontWeight: '900' },
  body: { color: '#90A5B5', fontSize: wide ? 13 : 12, lineHeight: wide ? 19 : 18 },
  badgeNotice: { color: '#FBBF24', fontSize: 11, lineHeight: 16, fontWeight: '800' },
  scoreBlock: { minWidth: wide ? 112 : undefined, alignItems: wide ? 'flex-end' : 'flex-start', gap: 1 },
  score: { color: '#5EEAD4', fontSize: wide ? 38 : 33, lineHeight: wide ? 43 : 38, fontWeight: '900' },
  scoreLabel: { color: '#74899A', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  takeawayCard: { width: '100%', paddingHorizontal: wide ? 4 : 2, paddingVertical: 10, gap: 6 },
  takeawayEyebrow: { color: '#4CCFBE', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  takeawayText: { maxWidth: 760, color: '#EEF4F6', fontSize: wide ? 16 : 15, lineHeight: wide ? 23 : 22, fontWeight: '800' },
  takeawayHint: { maxWidth: 760, color: '#8197A8', fontSize: 11, lineHeight: 17 },
  resultFooter: { paddingHorizontal: wide ? 28 : 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#1F3449', backgroundColor: '#07111F', gap: 2 },
  button: { alignSelf: 'center', width: '100%', maxWidth: 844, minHeight: 52, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, borderRadius: 14, backgroundColor: '#2DD4BF' },
  buttonText: { color: '#042F2E', fontSize: 14, fontWeight: '900' },
  secondaryButton: { alignSelf: 'center', width: '100%', maxWidth: 844, minHeight: 44, alignItems: 'center', justifyContent: 'center', padding: 12 },
  secondaryButtonText: { color: '#9FB0C3', fontSize: 13, fontWeight: '700' },
});
