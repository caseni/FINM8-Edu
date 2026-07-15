import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PracticalTaskPlayer, QuizPlayer } from '../../components/learning';
import { INITIAL_BADGES } from '../../domain/learning/examples/badges';
import { MARKET_FOUNDATIONS_CHALLENGE } from '../../domain/learning/examples/wave1/challenges';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import type { Quiz } from '../../domain/learning/types';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import { useLearningUiStore } from '../../store/useLearningUiStore';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MarketFoundationsChallenge'>;
type Stage = 'intro' | 'task-1' | 'task-2' | 'quiz' | 'result';

export function MarketFoundationsChallengeScreen({ navigation }: Props) {
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';
  const presentationMode = useLearningUiStore((state) => state.presentationMode);
  const completeChallenge = useLearningProgressStore((state) => state.completeChallenge);
  const tryAwardBadge = useLearningProgressStore((state) => state.tryAwardBadge);
  const [stage, setStage] = useState<Stage>('intro');
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [newBadgeTitle, setNewBadgeTitle] = useState<string>();
  const quiz = useMemo<Quiz>(() => ({
    id: `${MARKET_FOUNDATIONS_CHALLENGE.id}.quiz`,
    passingScore: MARKET_FOUNDATIONS_CHALLENGE.passingScore,
    questions: MARKET_FOUNDATIONS_CHALLENGE.questions,
  }), []);

  const finishQuiz = (resultScore: number, resultPassed: boolean) => {
    setScore(resultScore);
    setPassed(resultPassed);
    if (resultPassed) {
      const now = new Date().toISOString();
      completeChallenge(MARKET_FOUNDATIONS_CHALLENGE.id, now);
      const badge = INITIAL_BADGES.find((candidate) =>
        candidate.id === MARKET_FOUNDATIONS_CHALLENGE.badgeId
      );
      if (badge && tryAwardBadge(badge, now)) {
        setNewBadgeTitle(selectLocalizedText(badge.title, language));
      }
    }
    setStage('result');
  };

  if (stage === 'task-1' || stage === 'task-2') {
    const taskIndex = stage === 'task-1' ? 0 : 1;
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.progress}>UYGULAMA {taskIndex + 1}/2</Text>
          <PracticalTaskPlayer
            key={MARKET_FOUNDATIONS_CHALLENGE.practicalTasks[taskIndex].id}
            task={MARKET_FOUNDATIONS_CHALLENGE.practicalTasks[taskIndex]}
            language={language}
            presentationMode={presentationMode}
            eyebrow={{ tr: 'CHALLENGE UYGULAMASI', en: 'CHALLENGE TASK' }}
            completionLabel={{
              tr: taskIndex === 0 ? 'İkinci uygulamaya geç' : 'Final quizine geç',
              en: taskIndex === 0 ? 'Continue to task two' : 'Continue to final quiz',
            }}
            onComplete={(taskPassed) => {
              if (!taskPassed) return;
              setStage(taskIndex === 0 ? 'task-2' : 'quiz');
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
          <Text style={styles.progress}>FİNAL QUIZ • 6 SORU</Text>
          <QuizPlayer
            quiz={quiz}
            language={language}
            onComplete={(result) => finishQuiz(result.score, result.passed)}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (stage === 'result') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.resultCard}>
          <Text style={styles.resultIcon}>{passed ? '◆' : '↻'}</Text>
          <Text style={styles.title}>
            {passed
              ? language === 'tr' ? 'Piyasa mekaniği kanıtlandı' : 'Market mechanics proved'
              : language === 'tr' ? 'Bir tekrar daha güçlendirecek' : 'One more review will strengthen it'}
          </Text>
          <Text style={styles.score}>%{score}</Text>
          <Text style={styles.body}>
            {passed
              ? language === 'tr' ? '+100 XP kazandın.' : 'You earned +100 XP.'
              : language === 'tr' ? 'Geçme eşiği %75. Yanıt açıklamalarını kullanıp tekrar dene.' : 'Passing score is 75%. Review the explanations and try again.'}
          </Text>
          {newBadgeTitle ? <Text style={styles.badgeNotice}>◆ {newBadgeTitle}</Text> : null}
          <Pressable
            style={styles.primaryButton}
            onPress={() => passed ? navigation.popToTop() : setStage('intro')}
          >
            <Text style={styles.primaryButtonText}>
              {passed
                ? language === 'tr' ? 'M8 Learn’e dön' : 'Return to M8 Learn'
                : language === 'tr' ? 'Challenge’ı tekrar dene' : 'Retry challenge'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.introContent}>
        <Text style={styles.eyebrow}>MODÜL 1 • FINAL CHALLENGE</Text>
        <Text style={styles.title}>{selectLocalizedText(MARKET_FOUNDATIONS_CHALLENGE.title, language)}</Text>
        <Text style={styles.body}>{selectLocalizedText(MARKET_FOUNDATIONS_CHALLENGE.description, language)}</Text>
        <View style={styles.summaryCard}>
          <Summary value="2" label={language === 'tr' ? 'uygulama' : 'tasks'} />
          <Summary value="6" label={language === 'tr' ? 'soru' : 'questions'} />
          <Summary value="75%" label={language === 'tr' ? 'başarı eşiği' : 'pass score'} />
        </View>
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>{language === 'tr' ? 'Ezber değil, kanıt' : 'Evidence, not memorization'}</Text>
          <Text style={styles.noticeText}>
            {language === 'tr'
              ? 'Likidite ve emir senaryolarını çöz; ardından kavramları birlikte değerlendir.'
              : 'Solve liquidity and order scenarios, then evaluate the concepts together.'}
          </Text>
        </View>
        <Pressable style={styles.primaryButton} onPress={() => setStage('task-1')}>
          <Text style={styles.primaryButtonText}>{language === 'tr' ? 'Challenge’ı başlat' : 'Start challenge'}</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>{language === 'tr' ? 'Modüle dön' : 'Return to module'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Summary({ value, label }: { value: string; label: string }) {
  return <View style={styles.summaryItem}><Text style={styles.summaryValue}>{value}</Text><Text style={styles.summaryLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F' },
  content: { flexGrow: 1, justifyContent: 'center', width: '100%', maxWidth: 820, alignSelf: 'center', padding: 20, gap: 12 },
  introContent: { flexGrow: 1, justifyContent: 'center', width: '100%', maxWidth: 620, alignSelf: 'center', padding: 24, gap: 18 },
  progress: { color: '#2DD4BF', fontSize: 11, fontWeight: '900', letterSpacing: 1.2, textAlign: 'center' },
  eyebrow: { color: '#2DD4BF', fontSize: 12, fontWeight: '900', letterSpacing: 1.3 },
  title: { color: '#F8FAFC', fontSize: 30, lineHeight: 38, fontWeight: '900', textAlign: 'center' },
  body: { color: '#9FB0C3', fontSize: 16, lineHeight: 24, textAlign: 'center' },
  summaryCard: { flexDirection: 'row', padding: 16, borderRadius: 18, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057' },
  summaryItem: { flex: 1, alignItems: 'center', gap: 4 },
  summaryValue: { color: '#F8FAFC', fontSize: 22, fontWeight: '900' },
  summaryLabel: { color: '#8094A8', fontSize: 11, textAlign: 'center' },
  notice: { padding: 18, borderRadius: 18, backgroundColor: '#123B42', borderWidth: 1, borderColor: '#2DD4BF', gap: 6 },
  noticeTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '900' },
  noticeText: { color: '#B8D6D5', fontSize: 14, lineHeight: 21 },
  primaryButton: { width: '100%', alignItems: 'center', padding: 16, borderRadius: 14, backgroundColor: '#2DD4BF' },
  primaryButtonText: { color: '#042F2E', fontSize: 16, fontWeight: '900' },
  secondaryButton: { alignItems: 'center', padding: 12 },
  secondaryButtonText: { color: '#9FB0C3', fontSize: 14, fontWeight: '700' },
  resultCard: { alignSelf: 'center', width: '90%', maxWidth: 560, margin: 24, padding: 28, borderRadius: 24, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057', alignItems: 'center', gap: 14 },
  resultIcon: { color: '#FBBF24', fontSize: 44, fontWeight: '900' },
  score: { color: '#2DD4BF', fontSize: 44, fontWeight: '900' },
  badgeNotice: { color: '#FBBF24', fontSize: 16, fontWeight: '900', textAlign: 'center' },
});
