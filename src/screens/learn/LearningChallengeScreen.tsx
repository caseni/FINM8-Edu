import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PracticalTaskPlayer, QuizPlayer } from '../../components/learning';
import { INITIAL_BADGES } from '../../domain/learning/examples/badges';
import { getLearningChallengeById } from '../../domain/learning/examples/wave1/challenges';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import type { Quiz } from '../../domain/learning/types';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import { useLearningUiStore } from '../../store/useLearningUiStore';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'LearningChallenge'>;
type Stage = 'intro' | 'task' | 'quiz' | 'result';

export function LearningChallengeScreen({ route, navigation }: Props) {
  const challenge = getLearningChallengeById(route.params.challengeId);
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';
  const presentationMode = useLearningUiStore((state) => state.presentationMode);
  const completedLessonIds = useLearningProgressStore((state) => state.completedLessonIds);
  const completeChallenge = useLearningProgressStore((state) => state.completeChallenge);
  const tryAwardBadge = useLearningProgressStore((state) => state.tryAwardBadge);
  const [stage, setStage] = useState<Stage>('intro');
  const [taskIndex, setTaskIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [newBadgeTitle, setNewBadgeTitle] = useState<string>();
  const quiz = useMemo<Quiz | undefined>(() => challenge ? ({
    id: `${challenge.id}.quiz`,
    passingScore: challenge.passingScore,
    questions: challenge.questions,
  }) : undefined, [challenge]);

  if (!challenge || !quiz) {
    return <SafeAreaView style={styles.safeArea}><Text style={styles.error}>Challenge bulunamadı.</Text></SafeAreaView>;
  }

  const missingLessonCount = challenge.prerequisiteLessonIds.filter(
    (lessonId) => !completedLessonIds.includes(lessonId)
  ).length;

  const finishQuiz = (resultScore: number, resultPassed: boolean) => {
    setScore(resultScore);
    setPassed(resultPassed);
    if (resultPassed) {
      const now = new Date().toISOString();
      completeChallenge(challenge.id, now);
      const badge = INITIAL_BADGES.find((candidate) => candidate.id === challenge.badgeId);
      if (badge && tryAwardBadge(badge, now)) {
        setNewBadgeTitle(selectLocalizedText(badge.title, language));
      }
    }
    setStage('result');
  };

  if (stage === 'task') {
    const task = challenge.practicalTasks[taskIndex];
    const isLastTask = taskIndex === challenge.practicalTasks.length - 1;
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.progress}>UYGULAMA {taskIndex + 1}/{challenge.practicalTasks.length}</Text>
          <PracticalTaskPlayer
            key={task.id}
            task={task}
            language={language}
            presentationMode={presentationMode}
            eyebrow={{ tr: 'CHALLENGE UYGULAMASI', en: 'CHALLENGE TASK' }}
            completionLabel={{
              tr: isLastTask ? 'Final quizine geç' : 'Sonraki uygulamaya geç',
              en: isLastTask ? 'Continue to final quiz' : 'Continue to next task',
            }}
            onComplete={(taskPassed) => {
              if (!taskPassed) return;
              if (isLastTask) setStage('quiz');
              else setTaskIndex((current) => current + 1);
            }}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (stage === 'quiz') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.progress}>FİNAL QUIZ • {quiz.questions.length} SORU</Text>
          <QuizPlayer quiz={quiz} language={language} onComplete={(result) => finishQuiz(result.score, result.passed)} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (stage === 'result') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.resultCard}>
          <Text style={styles.resultIcon}>{passed ? '◆' : '↻'}</Text>
          <Text style={styles.title}>{passed ? (language === 'tr' ? 'Challenge tamamlandı' : 'Challenge completed') : (language === 'tr' ? 'Bir tekrar daha güçlendirecek' : 'One more review will strengthen it')}</Text>
          <Text style={styles.score}>%{score}</Text>
          <Text style={styles.body}>{passed ? (language === 'tr' ? `+${challenge.xpReward} XP kazandın.` : `You earned +${challenge.xpReward} XP.`) : (language === 'tr' ? `Geçme eşiği %${challenge.passingScore}. Açıklamaları kullanıp tekrar dene.` : `Passing score is ${challenge.passingScore}%. Review the explanations and try again.`)}</Text>
          {newBadgeTitle ? <Text style={styles.badgeNotice}>◆ {newBadgeTitle}</Text> : null}
          <Pressable style={styles.primaryButton} onPress={() => passed ? navigation.popToTop() : setStage('intro')}>
            <Text style={styles.primaryButtonText}>{passed ? (language === 'tr' ? 'M8 Learn’e dön' : 'Return to M8 Learn') : (language === 'tr' ? 'Tekrar dene' : 'Retry')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.introContent}>
        <Text style={styles.eyebrow}>MODÜL FINAL CHALLENGE</Text>
        <Text style={styles.title}>{selectLocalizedText(challenge.title, language)}</Text>
        <Text style={styles.body}>{selectLocalizedText(challenge.description, language)}</Text>
        <View style={styles.summaryCard}>
          <Summary value={`${challenge.practicalTasks.length}`} label={language === 'tr' ? 'uygulama' : 'tasks'} />
          <Summary value={`${quiz.questions.length}`} label={language === 'tr' ? 'soru' : 'questions'} />
          <Summary value={`${challenge.passingScore}%`} label={language === 'tr' ? 'başarı eşiği' : 'pass score'} />
        </View>
        {missingLessonCount > 0 ? (
          <View style={styles.lockedNotice}>
            <Text style={styles.noticeTitle}>{language === 'tr' ? 'Challenge henüz kilitli' : 'Challenge is locked'}</Text>
            <Text style={styles.noticeText}>{language === 'tr' ? `${missingLessonCount} ön koşul dersi daha tamamlanmalı.` : `${missingLessonCount} prerequisite lessons remain.`}</Text>
          </View>
        ) : (
          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>{language === 'tr' ? 'Ezber değil, kanıt' : 'Evidence, not memorization'}</Text>
            <Text style={styles.noticeText}>{language === 'tr' ? 'Uygulama görevlerini çöz; ardından kavramları birlikte değerlendir.' : 'Solve the applied tasks, then evaluate the concepts together.'}</Text>
          </View>
        )}
        <Pressable disabled={missingLessonCount > 0} style={[styles.primaryButton, missingLessonCount > 0 && styles.disabled]} onPress={() => { setTaskIndex(0); setStage('task'); }}>
          <Text style={styles.primaryButtonText}>{language === 'tr' ? 'Challenge’ı başlat' : 'Start challenge'}</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}><Text style={styles.secondaryButtonText}>{language === 'tr' ? 'Modüle dön' : 'Return to module'}</Text></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Summary({ value, label }: { value: string; label: string }) {
  return <View style={styles.summaryItem}><Text style={styles.summaryValue}>{value}</Text><Text style={styles.summaryLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F' },
  error: { color: '#F8FAFC', padding: 24 },
  content: { flexGrow: 1, justifyContent: 'center', width: '100%', maxWidth: 820, alignSelf: 'center', padding: 20, gap: 12 },
  introContent: { flexGrow: 1, justifyContent: 'center', width: '100%', maxWidth: 620, alignSelf: 'center', padding: 24, gap: 18 },
  progress: { color: '#2DD4BF', fontSize: 11, fontWeight: '900', letterSpacing: 1.2, textAlign: 'center' },
  eyebrow: { color: '#2DD4BF', fontSize: 12, fontWeight: '900', letterSpacing: 1.3, textAlign: 'center' },
  title: { color: '#F8FAFC', fontSize: 30, lineHeight: 38, fontWeight: '900', textAlign: 'center' },
  body: { color: '#9FB0C3', fontSize: 16, lineHeight: 24, textAlign: 'center' },
  summaryCard: { flexDirection: 'row', padding: 16, borderRadius: 18, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057' },
  summaryItem: { flex: 1, alignItems: 'center', gap: 4 },
  summaryValue: { color: '#F8FAFC', fontSize: 22, fontWeight: '900' },
  summaryLabel: { color: '#8094A8', fontSize: 11, textAlign: 'center' },
  notice: { padding: 18, borderRadius: 18, backgroundColor: '#123B42', borderWidth: 1, borderColor: '#2DD4BF', gap: 6 },
  lockedNotice: { padding: 18, borderRadius: 18, backgroundColor: '#2B1F2C', borderWidth: 1, borderColor: '#FB7185', gap: 6 },
  noticeTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '900' },
  noticeText: { color: '#B8D6D5', fontSize: 14, lineHeight: 21 },
  primaryButton: { width: '100%', alignItems: 'center', padding: 16, borderRadius: 14, backgroundColor: '#2DD4BF' },
  primaryButtonText: { color: '#042F2E', fontSize: 16, fontWeight: '900' },
  secondaryButton: { alignItems: 'center', padding: 12 },
  secondaryButtonText: { color: '#9FB0C3', fontSize: 14, fontWeight: '700' },
  disabled: { opacity: 0.35 },
  resultCard: { alignSelf: 'center', width: '90%', maxWidth: 560, margin: 24, padding: 28, borderRadius: 24, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057', alignItems: 'center', gap: 14 },
  resultIcon: { color: '#FBBF24', fontSize: 44, fontWeight: '900' },
  score: { color: '#2DD4BF', fontSize: 44, fontWeight: '900' },
  badgeNotice: { color: '#FBBF24', fontSize: 16, fontWeight: '900', textAlign: 'center' },
});
