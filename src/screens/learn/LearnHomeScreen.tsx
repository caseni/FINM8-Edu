import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LearningModuleCard, LearningPreferencesCard } from '../../components/learning';
import { MICRO_LESSON_CATALOG } from '../../domain/learning/catalog';
import { getCurrentQuizLearningGainSummary } from '../../domain/learning/currentQuizLearningGain';
import { CURRENT_QUIZ_TRACKS, getCurrentQuizReadiness } from '../../domain/learning/currentQuizReadiness';
import { getCurrentQuizReviewRecommendation } from '../../domain/learning/currentQuizReview';
import { INITIAL_BADGES } from '../../domain/learning/examples/badges';
import { BEHAVIOR_EVIDENCE_CHALLENGE, CHART_LITERACY_CHALLENGE, MARKET_FOUNDATIONS_CHALLENGE, MARKET_STRUCTURE_CHALLENGE, RISK_MANAGEMENT_CHALLENGE } from '../../domain/learning/examples/wave1/challenges';
import { WAVE1_BEHAVIOR_EVIDENCE_LESSONS } from '../../domain/learning/examples/wave1/behaviorEvidenceLessons';
import { WAVE1_CHART_LITERACY_CORE_LESSONS, WAVE1_MARKET_STRUCTURE_LESSONS } from '../../domain/learning/examples/wave1/levelledLessonGroups';
import { WAVE1_MARKET_FOUNDATION_LESSONS } from '../../domain/learning/examples/wave1/marketFoundationsLessons';
import { WAVE1_RISK_MANAGEMENT_LESSONS } from '../../domain/learning/examples/wave1/riskManagementLessons';
import { WAVE1_CONTENT_SUMMARY } from '../../domain/learning/examples/wave1MarketLiteracyPath';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import { getGoalReason, LEARNING_GOAL_LABELS, LEARNING_STAGE_LABELS, selectGoalForSkill } from '../../domain/learning/personalization';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import { useLearningUiStore } from '../../store/useLearningUiStore';
import type { RootStackParamList } from '../../types/navigation';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function LearnHomeScreen() {
  const navigation = useNavigation<Navigation>();
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';
  const profile = useLearningProgressStore((state) => state.profile);
  const totalXp = useLearningProgressStore((state) => state.totalXp);
  const level = useLearningProgressStore((state) => state.level);
  const completedLessonIds = useLearningProgressStore((state) => state.completedLessonIds);
  const completedChallengeIds = useLearningProgressStore((state) => state.completedChallengeIds);
  const streak = useLearningProgressStore((state) => state.streak);
  const badgeAwards = useLearningProgressStore((state) => state.badgeAwards);
  const masteryBySkill = useLearningProgressStore((state) => state.masteryBySkill);
  const quizScores = useLearningProgressStore((state) => state.quizScores);
  const lessonCheckpoints = useLearningProgressStore((state) => state.lessonCheckpoints);
  const currentQuizAnswerEvidence = useLearningProgressStore((state) => state.currentQuizAnswerEvidence);
  const currentQuizReviewCompletions = useLearningProgressStore((state) => state.currentQuizReviewCompletions);
  const presentationMode = useLearningUiStore((state) => state.presentationMode);
  const setPresentationMode = useLearningUiStore((state) => state.setPresentationMode);
  const foundationNextLesson = WAVE1_MARKET_FOUNDATION_LESSONS.find(
    (lesson) => !completedLessonIds.includes(lesson.id)
  );
  const marketChallengeCompleted = completedChallengeIds.includes(MARKET_FOUNDATIONS_CHALLENGE.id);
  const chartNextLesson = marketChallengeCompleted
    ? WAVE1_CHART_LITERACY_CORE_LESSONS.find((lesson) => !completedLessonIds.includes(lesson.id))
    : undefined;
  const chartChallengeCompleted = completedChallengeIds.includes(CHART_LITERACY_CHALLENGE.id);
  const marketStructureNextLesson = chartChallengeCompleted
    ? WAVE1_MARKET_STRUCTURE_LESSONS.find((lesson) => !completedLessonIds.includes(lesson.id))
    : undefined;
  const marketStructureChallengeCompleted = completedChallengeIds.includes(MARKET_STRUCTURE_CHALLENGE.id);
  const riskNextLesson = marketStructureChallengeCompleted
    ? WAVE1_RISK_MANAGEMENT_LESSONS.find((lesson) => !completedLessonIds.includes(lesson.id))
    : undefined;
  const riskChallengeCompleted = completedChallengeIds.includes(RISK_MANAGEMENT_CHALLENGE.id);
  const behaviorNextLesson = riskChallengeCompleted
    ? WAVE1_BEHAVIOR_EVIDENCE_LESSONS.find((lesson) => !completedLessonIds.includes(lesson.id))
    : undefined;
  const behaviorChallengeCompleted = completedChallengeIds.includes(BEHAVIOR_EVIDENCE_CHALLENGE.id);
  const mission = foundationNextLesson
    ? { kind: 'lesson' as const, lesson: foundationNextLesson }
    : !marketChallengeCompleted
      ? { kind: 'challenge' as const, challenge: MARKET_FOUNDATIONS_CHALLENGE }
      : chartNextLesson
        ? { kind: 'lesson' as const, lesson: chartNextLesson }
        : !chartChallengeCompleted
          ? { kind: 'challenge' as const, challenge: CHART_LITERACY_CHALLENGE }
          : marketStructureNextLesson
            ? { kind: 'lesson' as const, lesson: marketStructureNextLesson }
            : !marketStructureChallengeCompleted
              ? { kind: 'challenge' as const, challenge: MARKET_STRUCTURE_CHALLENGE }
              : riskNextLesson
                ? { kind: 'lesson' as const, lesson: riskNextLesson }
                : !riskChallengeCompleted
                  ? { kind: 'challenge' as const, challenge: RISK_MANAGEMENT_CHALLENGE }
                  : behaviorNextLesson
                    ? { kind: 'lesson' as const, lesson: behaviorNextLesson }
                    : !behaviorChallengeCompleted
                      ? { kind: 'challenge' as const, challenge: BEHAVIOR_EVIDENCE_CHALLENGE }
                      : { kind: 'lesson' as const, lesson: WAVE1_MARKET_FOUNDATION_LESSONS[0] };
  const lessonCompleted = mission.kind === 'lesson' && completedLessonIds.includes(mission.lesson.id);
  const activeMastery =
    (riskChallengeCompleted ? masteryBySkill['skill.behavior-evidence'] : undefined) ??
    (marketStructureChallengeCompleted ? masteryBySkill['skill.risk-management'] : undefined) ??
    (chartChallengeCompleted ? masteryBySkill['skill.market-structure'] : undefined) ??
    (marketChallengeCompleted ? masteryBySkill['skill.chart-literacy'] : undefined) ??
    masteryBySkill['skill.market-foundations'];
  const activeQuizAttempts = activeMastery?.quizAttempts ?? 0;
  const activeQuizScore = Math.round(activeMastery?.score ?? 0);
  const wave1CompletedCount = completedLessonIds.filter((lessonId) =>
    WAVE1_LESSON_IDS.has(lessonId)
  ).length;
  const chartLiteracyUnlocked = marketChallengeCompleted;
  const marketStructureUnlocked = chartChallengeCompleted;
  const riskManagementUnlocked = marketStructureChallengeCompleted;
  const behaviorEvidenceUnlocked = riskChallengeCompleted;
  const activeModuleNumber = !marketChallengeCompleted
    ? 1
    : !chartChallengeCompleted
      ? 2
      : !marketStructureChallengeCompleted
        ? 3
        : !riskChallengeCompleted
          ? 4
          : 5;
  const completedModuleCount = [
    marketChallengeCompleted,
    chartChallengeCompleted,
    marketStructureChallengeCompleted,
    riskChallengeCompleted,
    behaviorChallengeCompleted,
  ].filter(Boolean).length;
  const [expandedModule, setExpandedModule] = useState(activeModuleNumber);
  const [preferencesExpanded, setPreferencesExpanded] = useState(false);
  useEffect(() => setExpandedModule(activeModuleNumber), [activeModuleNumber]);
  const dueMasteries = Object.values(masteryBySkill).filter(
    (mastery) => mastery.reviewDueAt && new Date(mastery.reviewDueAt) <= new Date()
  ).sort((a, b) => a.score - b.score);
  const reviewDue = dueMasteries.length;
  const reviewLesson = dueMasteries
    .map((mastery) => MICRO_LESSON_CATALOG
      .filter((lesson) => lesson.skillId === mastery.skillId && completedLessonIds.includes(lesson.id))
      .sort((a, b) => (quizScores[a.quiz.id] ?? 0) - (quizScores[b.quiz.id] ?? 0))[0])
    .find((lesson) => lesson !== undefined);
  const missionCheckpoint = mission.kind === 'lesson' ? lessonCheckpoints[mission.lesson.id] : undefined;
  const missionGoal = selectGoalForSkill(
    profile.goals,
    mission.kind === 'lesson' ? mission.lesson.skillId : mission.challenge.skillIds[0]
  );
  const goalReason = selectLocalizedText(getGoalReason(missionGoal), language);
  const currentQuizReadiness = getCurrentQuizReadiness({
    completedLessonIds,
    completedChallengeIds,
    selectedStage: profile.selectedStage,
    presentationMode,
  });
  const currentQuizProgress =
    currentQuizReadiness.unlockedTrackIds.length === 0
      ? (currentQuizReadiness.completedDailyPrerequisites /
          currentQuizReadiness.dailyPrerequisiteCount) *
        20
      : (currentQuizReadiness.unlockedTrackIds.length / CURRENT_QUIZ_TRACKS.length) *
        100;
  const currentQuizLearningGain = getCurrentQuizLearningGainSummary(
    currentQuizAnswerEvidence
  );
  const currentQuizReview = getCurrentQuizReviewRecommendation(
    currentQuizLearningGain,
    completedLessonIds,
    currentQuizReviewCompletions
  );

  const openLesson = (lessonId: string) => {
    const checkpoint = lessonCheckpoints[lessonId];
    if (checkpoint?.stage === 'task') {
      navigation.navigate('PracticalTask', { lessonId });
      return;
    }
    if (checkpoint?.stage === 'quiz') {
      navigation.navigate('LessonQuiz', { lessonId });
      return;
    }
    navigation.navigate('MicroLesson', { lessonId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>FINM8</Text>
            <Text style={styles.title}>M8 Learn</Text>
            <Text style={styles.subtitle}>
              {language === 'tr'
                ? 'Öğren, uygula, kanıtla.'
                : 'Learn, practice, prove it.'}
            </Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelLabel}>{language === 'tr' ? 'XP SEVİYE' : 'XP LEVEL'}</Text>
            <Text style={styles.levelValue}>{level}</Text>
          </View>
        </View>

        {!profile.onboardingCompletedAt ? (
          <Pressable style={styles.onboardingCard} onPress={() => navigation.navigate('LearningOnboarding')}>
            <Text style={styles.cardEyebrow}>{language === 'tr' ? 'İLK ADIM' : 'FIRST STEP'}</Text>
            <Text style={styles.cardTitle}>
              {language === 'tr' ? 'Öğrenme profilini oluştur' : 'Create your learning profile'}
            </Text>
            <Text style={styles.cardBody}>
              {language === 'tr'
                ? 'Seviyeni ve hedeflerini seç; ders sırası aynı kalır.'
                : 'Choose your level and goals; the lesson order stays the same.'}
            </Text>
          </Pressable>
        ) : null}

        <Text style={styles.sectionTitle}>{language === 'tr' ? 'Bugünün görevi' : "Today's mission"}</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.missionCard}
          onPress={() => mission.kind === 'lesson'
            ? openLesson(mission.lesson.id)
            : navigation.navigate('LearningChallenge', { challengeId: mission.challenge.id })}
        >
          <View style={styles.missionTop}>
            <Text style={styles.missionTag}>{missionCheckpoint ? (language === 'tr' ? 'KALDIĞIN YER' : 'RESUME') : 'M8 LEARN'}</Text>
            <Text style={styles.missionTime}>
              {missionCheckpoint?.stage === 'task'
                ? language === 'tr' ? 'Görev' : 'Task'
                : missionCheckpoint?.stage === 'quiz'
                  ? 'Quiz'
                  : mission.kind === 'lesson'
                    ? `${mission.lesson.estimatedMinutes} ${language === 'tr' ? 'dk' : 'min'}`
                    : 'Final'}
            </Text>
          </View>
          <Text style={styles.missionTitle}>{selectLocalizedText(mission.kind === 'lesson' ? mission.lesson.title : mission.challenge.title, language)}</Text>
          <Text style={styles.missionBody}>
            {selectLocalizedText(mission.kind === 'lesson' ? mission.lesson.learningObjective : mission.challenge.description, language)}
          </Text>
          {mission.kind === 'lesson' && profile.onboardingCompletedAt ? (
            <View style={styles.guidancePanel}>
              <Text style={styles.guidanceLabel}>{selectLocalizedText(LEARNING_GOAL_LABELS[missionGoal], language)} · {language === 'tr' ? 'SENİN İÇİN' : 'FOR YOU'}</Text>
              <Text style={styles.guidanceText}>{goalReason}</Text>
            </View>
          ) : null}
          <View style={styles.missionFooter}>
            <Text style={styles.xpReward}>+{mission.kind === 'lesson' ? 90 : mission.challenge.xpReward} XP</Text>
            <Text style={styles.startText}>
              {lessonCompleted
                ? language === 'tr' ? 'Tekrar et →' : 'Review →'
                : missionCheckpoint
                  ? language === 'tr' ? 'Devam et →' : 'Continue →'
                  : language === 'tr' ? 'Başla →' : 'Start →'}
            </Text>
          </View>
        </Pressable>

        <View style={styles.statsRow}>
          <Stat value={`${totalXp}`} label="XP" />
          <Stat value={language === 'tr' ? `${streak.currentDays} gün` : `${streak.currentDays}`} label={language === 'tr' ? 'Seri' : 'Day streak'} />
          <Stat value={`${badgeAwards.length}`} label={language === 'tr' ? 'Rozet' : 'Badges'} />
        </View>

        <View style={styles.skillCard}>
          <View style={styles.skillTop}>
            <View>
              <Text style={styles.sectionLabel}>{language === 'tr' ? 'QUIZ PERFORMANSIN' : 'QUIZ PERFORMANCE'}</Text>
              <Text style={styles.skillTitle}>
                {riskChallengeCompleted
                  ? language === 'tr' ? 'Davranış ve kanıt' : 'Behavior and evidence'
                  : marketStructureChallengeCompleted
                    ? language === 'tr' ? 'Risk yönetimi' : 'Risk management'
                    : chartChallengeCompleted
                      ? language === 'tr' ? 'Piyasa yapısı' : 'Market structure'
                      : marketChallengeCompleted
                        ? language === 'tr' ? 'Grafik okuryazarlığı' : 'Chart literacy'
                        : language === 'tr' ? 'Piyasa temelleri' : 'Market foundations'}
              </Text>
            </View>
            <Text style={styles.skillScore}>{activeQuizAttempts > 0 ? `${activeQuizScore}%` : '—'}</Text>
          </View>
          <View
            style={styles.skillTrack}
            accessibilityRole="progressbar"
            accessibilityLabel={language === 'tr' ? 'Quiz performansı' : 'Quiz performance'}
            accessibilityValue={{ min: 0, max: 100, now: activeQuizAttempts > 0 ? activeQuizScore : 0 }}
          >
            <View style={[styles.skillFill, { width: `${activeQuizAttempts > 0 ? activeQuizScore : 0}%` }]} />
          </View>
          <Text style={styles.skillMeta}>
            {activeQuizAttempts === 0
              ? language === 'tr' ? 'İlk quizden sonra burada görünür.' : 'Appears here after your first quiz.'
              : reviewDue > 0
                ? language === 'tr' ? 'Quiz sonuçlarından hesaplanır · Kısa tekrar hazır.' : 'Calculated from quiz results · A short review is ready.'
                : language === 'tr' ? 'Quiz sonuçlarından hesaplanır ve yeni quizlerle güncellenir.' : 'Calculated from quiz results and updated with new quizzes.'}
          </Text>
        </View>

        {profile.onboardingCompletedAt ? (
          <LearningPreferencesCard
            profile={profile}
            presentationMode={presentationMode}
            language={language}
            expanded={preferencesExpanded}
            onToggle={() => setPreferencesExpanded((current) => !current)}
            onEditProfile={() => navigation.navigate('LearningOnboarding')}
            onModeChange={setPresentationMode}
          />
        ) : null}

        {reviewLesson ? (
          <Pressable accessibilityRole="button" onPress={() => navigation.navigate('LessonQuiz', { lessonId: reviewLesson.id, spacedReview: true })} style={styles.spacedReviewCard}>
            <View style={styles.reviewClock}><Text style={styles.reviewClockText}>↻</Text></View>
            <View style={styles.pathContent}>
              <Text style={styles.cardEyebrow}>{language === 'tr' ? 'TEKRAR ZAMANI' : 'REVIEW DUE'}</Text>
              <Text style={styles.pathTitle}>{selectLocalizedText(reviewLesson.title, language)}</Text>
              <Text style={styles.pathBody}>{language === 'tr' ? 'Kısa bir aktif tekrar bilgiyi kalıcılaştırır.' : 'A short active review helps make learning stick.'}</Text>
            </View>
            <Text style={styles.startText}>{language === 'tr' ? 'Başla ›' : 'Start ›'}</Text>
          </Pressable>
        ) : null}

        {currentQuizReview && !reviewLesson ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              language === 'tr'
                ? `Bugünkü kısa tekrar: ${selectLocalizedText(currentQuizReview.lessonTitle, language)}`
                : `Today's short review: ${selectLocalizedText(currentQuizReview.lessonTitle, language)}`
            }
            onPress={() =>
              navigation.navigate('MicroLesson', {
                lessonId: currentQuizReview.lessonId,
                currentQuizReview: {
                  conceptKey: currentQuizReview.conceptKey,
                  reviewedEvidenceThroughAt:
                    currentQuizReview.evidenceThroughAt,
                },
              })
            }
            style={styles.currentQuizReviewCard}
          >
            <View style={styles.currentQuizReviewMark}>
              <Text style={styles.currentQuizReviewMarkText}>↺</Text>
            </View>
            <View style={styles.pathContent}>
              <Text style={styles.currentQuizReviewEyebrow}>
                {language === 'tr' ? 'BUGÜNKÜ KISA TEKRAR' : "TODAY'S SHORT REVIEW"}
              </Text>
              <Text style={styles.pathTitle}>
                {selectLocalizedText(currentQuizReview.lessonTitle, language)}
              </Text>
              <Text style={styles.pathBody}>
                {selectLocalizedText(currentQuizReview.guidance, language)}
              </Text>
              <Text style={styles.currentQuizReviewMeta}>
                {language === 'tr'
                  ? `${currentQuizReview.estimatedMinutes} dk`
                  : `${currentQuizReview.estimatedMinutes} min`}
              </Text>
            </View>
            <Text style={styles.startText}>
              {language === 'tr' ? 'Aç ›' : 'Open ›'}
            </Text>
          </Pressable>
        ) : null}

        <View style={styles.currentQuizCard}>
          <View style={styles.currentQuizTop}>
            <View style={styles.currentQuizMark}>
              <Text style={styles.currentQuizMarkText}>Q</Text>
            </View>
            <View style={styles.pathContent}>
              <Text style={styles.currentQuizEyebrow}>
                {language === 'tr' ? 'YAKINDA · GÜNCEL ÖĞRENME' : 'COMING SOON · CURRENT LEARNING'}
              </Text>
              <Text style={styles.currentQuizTitle}>
                {language === 'tr' ? 'Günün Güncel Piyasa Quizi' : "Today's Current Market Quiz"}
              </Text>
            </View>
            <View style={styles.currentQuizCount}>
              <Text style={styles.currentQuizCountValue}>
                {currentQuizReadiness.unlockedTrackIds.length}/5
              </Text>
              <Text style={styles.currentQuizCountLabel}>
                {language === 'tr' ? 'HAZIR' : 'READY'}
              </Text>
            </View>
          </View>

          <Text style={styles.currentQuizBody}>
            {language === 'tr'
              ? 'Tamamladığın derslere göre güncel piyasa olaylarını kısa sorularla yorumlayacaksın.'
              : 'You will use short questions to interpret current market events with concepts from completed lessons.'}
          </Text>

          <View style={styles.currentQuizProgressTrack}>
            <View
              style={[
                styles.currentQuizProgressFill,
                { width: `${currentQuizProgress}%` },
              ]}
            />
          </View>

          <Text style={styles.currentQuizEyebrow}>
            {language === 'tr' ? 'AÇILMASI İÇİN' : 'TO UNLOCK'}
          </Text>
          <Text style={styles.currentQuizRequirement}>
            {selectLocalizedText(currentQuizReadiness.nextRequirement, language)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>{language === 'tr' ? 'Öğrenme yolları' : 'Learning paths'}</Text>
        <View
          style={styles.pathNavigator}
          accessibilityRole="progressbar"
          accessibilityLabel={language === 'tr' ? 'Öğrenme yolu ilerlemesi' : 'Learning path progress'}
          accessibilityValue={{ min: 0, max: 5, now: completedModuleCount }}
        >
          <View style={styles.pathNavigatorTop}>
            <Text style={styles.pathNavigatorLabel}>{language === 'tr' ? 'YOL HARİTASI' : 'PATH MAP'}</Text>
            <Text style={styles.pathNavigatorMeta}>
              {language === 'tr'
                ? `${completedModuleCount}/5 modül tamamlandı`
                : `${completedModuleCount}/5 modules completed`}
            </Text>
          </View>
          <View style={styles.pathSteps}>
            {[1, 2, 3, 4, 5].map((step) => {
              const complete = step <= completedModuleCount;
              const active = step === activeModuleNumber && !complete;
              return (
                <View key={step} style={styles.pathStepWrap}>
                  <View style={[styles.pathStep, complete && styles.pathStepComplete, active && styles.pathStepActive]}>
                    <Text style={[styles.pathStepText, (complete || active) && styles.pathStepTextActive]}>
                      {complete ? '✓' : step}
                    </Text>
                  </View>
                  {step < 5 ? <View style={[styles.pathConnector, step <= completedModuleCount && styles.pathConnectorComplete]} /> : null}
                </View>
              );
            })}
          </View>
          <Text style={styles.pathNavigatorHint}>
            {language === 'tr'
              ? `Şimdi: Modül ${activeModuleNumber} — aşağıdan dersini seç veya bugünün görevine devam et.`
              : `Now: Module ${activeModuleNumber} — choose a lesson below or continue today's mission.`}
          </Text>
        </View>

        {[
          {
            number: 1,
            title: language === 'tr' ? 'Piyasa Temelleri' : 'Market Foundations',
            description: language === 'tr' ? 'Fiyatın nasıl oluştuğunu, piyasadaki alım-satım yoğunluğunu ve emirlerin nasıl çalıştığını öğren.' : 'Learn how prices form, how buying and selling interact, and how orders work.',
            lessons: WAVE1_MARKET_FOUNDATION_LESSONS,
            challenge: MARKET_FOUNDATIONS_CHALLENGE,
            unlocked: true,
            completed: marketChallengeCompleted,
          },
          {
            number: 2,
            title: language === 'tr' ? 'Grafik Okuryazarlığı' : 'Chart Literacy',
            description: language === 'tr' ? 'Mumları, zaman dilimlerini, trendi ve destek/direnci birlikte okumayı öğren.' : 'Learn to read candles, timeframes, trends, and support/resistance together.',
            lessons: WAVE1_CHART_LITERACY_CORE_LESSONS,
            challenge: CHART_LITERACY_CHALLENGE,
            unlocked: chartLiteracyUnlocked,
            completed: chartChallengeCompleted,
          },
          {
            number: 3,
            title: language === 'tr' ? 'Piyasa Yapısı' : 'Market Structure',
            description: language === 'tr' ? 'Önemli tepe ve dipleri tanı; fiyat hareketinin yapıyı gerçekten değiştirip değiştirmediğini ayır.' : 'Identify important highs and lows and judge whether price has truly changed structure.',
            lessons: WAVE1_MARKET_STRUCTURE_LESSONS,
            challenge: MARKET_STRUCTURE_CHALLENGE,
            unlocked: marketStructureUnlocked,
            completed: marketStructureChallengeCompleted,
          },
          {
            number: 4,
            title: language === 'tr' ? 'Risk Yönetimi' : 'Risk Management',
            description: language === 'tr' ? 'Fiyat hareketi değişirken ne kadar risk aldığını ve işlem büyüklüğünü yönet.' : 'Manage how much you risk and how large a position you take as price movement changes.',
            lessons: WAVE1_RISK_MANAGEMENT_LESSONS,
            challenge: RISK_MANAGEMENT_CHALLENGE,
            unlocked: riskManagementUnlocked,
            completed: riskChallengeCompleted,
          },
          {
            number: 5,
            title: language === 'tr' ? 'Davranış ve Kanıt' : 'Behavior and Evidence',
            description: language === 'tr' ? 'Karar hatalarını fark et, veri kalitesini sorgula.' : 'Recognize decision errors and question evidence quality.',
            lessons: WAVE1_BEHAVIOR_EVIDENCE_LESSONS,
            challenge: BEHAVIOR_EVIDENCE_CHALLENGE,
            unlocked: behaviorEvidenceUnlocked,
            completed: behaviorChallengeCompleted,
          },
        ].map((module) => (
          <LearningModuleCard
            key={module.number}
            number={module.number}
            title={module.title}
            description={module.description}
            lessons={module.lessons}
            challenge={module.challenge}
            completedLessonIds={completedLessonIds}
            challengeCompleted={module.completed}
            unlocked={module.unlocked}
            expanded={expandedModule === module.number}
            activeLessonId={mission.kind === 'lesson' ? mission.lesson.id : undefined}
            language={language}
            onToggle={() => setExpandedModule((current) => current === module.number ? 0 : module.number)}
            onOpenLesson={openLesson}
            onOpenChallenge={(challengeId) => navigation.navigate('LearningChallenge', { challengeId })}
          />
        ))}

        {__DEV__ ? (
          <Pressable accessibilityRole="button" onPress={() => navigation.navigate('LearningReview')} style={styles.reviewCard}>
            <View style={styles.reviewMark}><Text style={styles.reviewMarkText}>R</Text></View>
            <View style={styles.pathContent}>
              <Text style={styles.pathTitle}>{language === 'tr' ? 'Review Merkezi' : 'Review Center'}</Text>
              <Text style={styles.pathBody}>{language === 'tr' ? 'Tüm slayt, görev, quiz ve bölüm sonu uygulaması ekranlarını ilerlemeyi değiştirmeden incele.' : 'Inspect every slide, task, quiz, and module wrap-up without changing progress.'}</Text>
            </View>
            <Text style={styles.archiveLink}>›</Text>
          </Pressable>
        ) : null}

        <Text style={styles.sectionTitle}>{language === 'tr' ? 'Rozet koleksiyonu' : 'Badge collection'}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeRow}>
          {INITIAL_BADGES.map((badge) => {
            const earned = badgeAwards.some((award) => award.badgeId === badge.id);
            return (
              <View key={badge.id} style={[styles.badgeCard, earned && styles.badgeCardEarned]}>
                <View style={styles.badgeTop}>
                  <Text style={styles.badgeIcon}>{earned ? '◆' : '◇'}</Text>
                  <Text style={[styles.badgeState, earned && styles.badgeStateEarned]}>
                    {earned
                      ? language === 'tr' ? 'KAZANILDI' : 'EARNED'
                      : language === 'tr' ? 'KAZANMAK İÇİN' : 'TO EARN'}
                  </Text>
                </View>
                <Text numberOfLines={2} style={styles.badgeTitle}>{selectLocalizedText(badge.title, language)}</Text>
                {!earned ? (
                  <Text numberOfLines={2} style={styles.badgeHowTo}>
                    {selectLocalizedText(badge.description, language)}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </ScrollView>

        {__DEV__ ? (
          <View style={styles.archiveRow}>
            <View style={styles.pathContent}>
              <Text style={styles.pathTitle}>{language === 'tr' ? 'Eski kurs arşivi' : 'Legacy course archive'}</Text>
              <Text style={styles.pathBody}>{language === 'tr' ? 'Yalnız geliştirme ortamında görünür.' : 'Visible only in development.'}</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('LegacyCatalog')}>
              <Text style={styles.archiveLink}>{language === 'tr' ? 'Aç' : 'Open'}</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F' },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center', padding: 20, gap: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  brand: { color: '#2DD4BF', fontSize: 12, letterSpacing: 2, fontWeight: '900' },
  title: { color: '#F8FAFC', fontSize: 34, fontWeight: '900' },
  subtitle: { color: '#9FB0C3', fontSize: 15, marginTop: 4 },
  levelBadge: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#102033', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#294057' },
  levelLabel: { color: '#9FB0C3', fontSize: 9, fontWeight: '800' },
  levelValue: { color: '#2DD4BF', fontSize: 24, fontWeight: '900' },
  onboardingCard: { backgroundColor: '#123B42', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#2DD4BF', gap: 7 },
  cardEyebrow: { color: '#5EEAD4', fontSize: 11, fontWeight: '900' },
  cardTitle: { color: '#F8FAFC', fontSize: 21, fontWeight: '800' },
  cardBody: { color: '#B8D6D5', fontSize: 14, lineHeight: 20 },
  sectionLabel: { color: '#F8FAFC', fontSize: 12, fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, backgroundColor: '#102033', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#1F3449' },
  statValue: { color: '#F8FAFC', fontSize: 22, fontWeight: '900' },
  statLabel: { color: '#8094A8', fontSize: 11, marginTop: 3 },
  skillCard: { gap: 12, padding: 18, backgroundColor: '#0C1928', borderRadius: 18, borderWidth: 1, borderColor: '#1F3449' },
  skillTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  skillTitle: { color: '#F8FAFC', fontSize: 17, fontWeight: '800', marginTop: 4 },
  skillScore: { color: '#2DD4BF', fontSize: 24, fontWeight: '900' },
  skillTrack: { height: 9, borderRadius: 9, overflow: 'hidden', backgroundColor: '#172F46' },
  skillFill: { height: 9, borderRadius: 9, backgroundColor: '#2DD4BF' },
  skillMeta: { color: '#8094A8', fontSize: 12 },
  sectionTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '800', marginTop: 4 },
  missionCard: { padding: 20, borderRadius: 22, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057', gap: 12 },
  missionTop: { flexDirection: 'row', justifyContent: 'space-between' },
  missionTag: { color: '#2DD4BF', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  missionTime: { color: '#9FB0C3', fontSize: 12 },
  missionTitle: { color: '#F8FAFC', fontSize: 23, lineHeight: 30, fontWeight: '900' },
  missionBody: { color: '#9FB0C3', fontSize: 14, lineHeight: 21 },
  guidancePanel: { padding: 14, borderRadius: 14, backgroundColor: '#0C1928', borderWidth: 1, borderColor: '#1F3449', gap: 5 },
  guidanceLabel: { color: '#2DD4BF', fontSize: 10, letterSpacing: 1, fontWeight: '900' },
  guidanceText: { color: '#F8FAFC', fontSize: 13, lineHeight: 19, fontWeight: '700' },
  missionFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  xpReward: { color: '#FBBF24', fontWeight: '800' },
  startText: { color: '#2DD4BF', fontWeight: '800' },
  pathCard: { flexDirection: 'row', padding: 18, gap: 14, borderRadius: 18, backgroundColor: '#102033', borderWidth: 1, borderColor: '#1F3449' },
  pathIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: '#172F46', alignItems: 'center', justifyContent: 'center' },
  pathIconText: { color: '#2DD4BF', fontWeight: '900' },
  pathContent: { flex: 1, gap: 4 },
  pathTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '800' },
  pathBody: { color: '#9FB0C3', fontSize: 13, lineHeight: 18 },
  pathStatus: { color: '#FBBF24', fontSize: 11, marginTop: 4 },
  pathProgress: { color: '#2DD4BF', fontSize: 12, fontWeight: '800', marginTop: 4 },
  pathNavigator: { padding: 18, borderRadius: 18, backgroundColor: '#0C1928', borderWidth: 1, borderColor: '#1F3449', gap: 13 },
  pathNavigatorTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  pathNavigatorLabel: { color: '#F8FAFC', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  pathNavigatorMeta: { color: '#9FB0C3', fontSize: 12, fontWeight: '700' },
  pathSteps: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pathStepWrap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  pathStep: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#172F46', borderWidth: 1, borderColor: '#294057' },
  pathStepComplete: { backgroundColor: '#123B42', borderColor: '#2DD4BF' },
  pathStepActive: { backgroundColor: '#2DD4BF', borderColor: '#5EEAD4' },
  pathStepText: { color: '#8094A8', fontSize: 12, fontWeight: '900' },
  pathStepTextActive: { color: '#07111F' },
  pathConnector: { flex: 1, height: 3, backgroundColor: '#172F46' },
  pathConnectorComplete: { backgroundColor: '#2DD4BF' },
  pathNavigatorHint: { color: '#9FB0C3', fontSize: 12, lineHeight: 18 },
  moduleCard: { gap: 10, padding: 18, borderRadius: 18, backgroundColor: '#0C1928', borderWidth: 1, borderColor: '#1F3449' },
  moduleLocked: { opacity: 0.65 },
  lockedText: { color: '#FBBF24', fontSize: 12, lineHeight: 18 },
  lessonRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#172F46' },
  lessonNumber: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 11, backgroundColor: '#172F46' },
  lessonNumberDone: { backgroundColor: '#123B42' },
  lessonNumberText: { color: '#2DD4BF', fontWeight: '900', fontSize: 12 },
  lessonTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '700' },
  challengeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4, padding: 14, borderRadius: 15, backgroundColor: '#123B42', borderWidth: 1, borderColor: '#2DD4BF' },
  challengeCardLocked: { opacity: 0.55, backgroundColor: '#102033', borderColor: '#294057' },
  challengeIcon: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#172F46' },
  challengeIconText: { color: '#FBBF24', fontSize: 20, fontWeight: '900' },
  challengeTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: '900' },
  badgeRow: { gap: 10, paddingRight: 20 },
  badgeCard: { width: 176, minHeight: 118, padding: 14, borderRadius: 18, backgroundColor: '#0C1928', borderWidth: 1, borderColor: '#1F3449', gap: 6 },
  badgeCardEarned: { borderColor: '#2DD4BF', backgroundColor: '#123B42' },
  badgeTop: { minHeight: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  badgeIcon: { color: '#FBBF24', fontSize: 22 },
  badgeTitle: { color: '#F8FAFC', fontSize: 14, lineHeight: 18, fontWeight: '800' },
  badgeState: { color: '#8094A8', fontSize: 9, lineHeight: 12, fontWeight: '900', letterSpacing: 0.5 },
  badgeStateEarned: { color: '#5EEAD4' },
  badgeHowTo: { color: '#9FB0C3', fontSize: 11, lineHeight: 15 },
  archiveRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, borderRadius: 18, backgroundColor: '#0C1928' },
  archiveLink: { color: '#2DD4BF', fontWeight: '800' },
  reviewCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 18, backgroundColor: '#101D2C', borderWidth: 1, borderColor: '#294057' },
  reviewMark: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#172F46' },
  reviewMarkText: { color: '#2DD4BF', fontSize: 14, fontWeight: '900' },
  spacedReviewCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 18, backgroundColor: '#171F2A', borderWidth: 1, borderColor: '#6B5A2B' },
  reviewClock: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2A2618' },
  currentQuizReviewCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 18, backgroundColor: '#102A2D', borderWidth: 1, borderColor: '#2F766F' },
  currentQuizReviewMark: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#153E3D' },
  currentQuizReviewMarkText: { color: '#5EEAD4', fontSize: 23, fontWeight: '900' },
  currentQuizReviewEyebrow: { color: '#5EEAD4', fontSize: 10, lineHeight: 14, fontWeight: '900', letterSpacing: 0.7 },
  currentQuizReviewMeta: { color: '#8FC4C5', fontSize: 11, lineHeight: 16, fontWeight: '700', marginTop: 2 },
  currentQuizCard: { padding: 18, borderRadius: 20, backgroundColor: '#0D2630', borderWidth: 1, borderColor: '#1F5961', gap: 13 },
  currentQuizTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  currentQuizMark: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#153E46' },
  currentQuizMarkText: { color: '#5EEAD4', fontSize: 18, fontWeight: '900' },
  currentQuizEyebrow: { color: '#5EEAD4', fontSize: 10, lineHeight: 14, fontWeight: '900', letterSpacing: 0.7 },
  currentQuizTitle: { color: '#F8FAFC', fontSize: 18, lineHeight: 24, fontWeight: '900', marginTop: 2 },
  currentQuizCount: { minWidth: 48, alignItems: 'center', paddingVertical: 7, paddingHorizontal: 8, borderRadius: 12, backgroundColor: '#102F37' },
  currentQuizCountValue: { color: '#F8FAFC', fontSize: 15, fontWeight: '900' },
  currentQuizCountLabel: { color: '#8FC4C5', fontSize: 8, fontWeight: '900', marginTop: 1 },
  currentQuizBody: { color: '#C3DCDD', fontSize: 14, lineHeight: 20 },
  currentQuizProgressTrack: { height: 7, borderRadius: 999, overflow: 'hidden', backgroundColor: '#173942' },
  currentQuizProgressFill: { height: '100%', borderRadius: 999, backgroundColor: '#2DD4BF' },
  currentQuizRequirement: { color: '#F8FAFC', fontSize: 13, lineHeight: 19, fontWeight: '800' },
  currentQuizGainPanel: { gap: 9, padding: 12, borderRadius: 14, backgroundColor: '#102F37' },
  currentQuizGainLabel: { color: '#8FC4C5', fontSize: 9, lineHeight: 13, fontWeight: '900', letterSpacing: 0.6 },
  currentQuizGainRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  currentQuizGainChip: { paddingVertical: 6, paddingHorizontal: 9, borderRadius: 999, backgroundColor: '#153E46', borderWidth: 1, borderColor: '#1F5961' },
  currentQuizGainChipText: { color: '#D9F4F0', fontSize: 11, lineHeight: 15, fontWeight: '700' },
  currentQuizGainHint: { color: '#9CCBCC', fontSize: 11, lineHeight: 16 },
  currentQuizSafety: { color: '#8FC4C5', fontSize: 12, lineHeight: 18 },
  reviewClockText: { color: '#FBBF24', fontSize: 24, fontWeight: '900' },
});

const WAVE1_LESSON_IDS = new Set([
  ...WAVE1_MARKET_FOUNDATION_LESSONS.map((lesson) => lesson.id),
  ...WAVE1_CHART_LITERACY_CORE_LESSONS.map((lesson) => lesson.id),
  ...WAVE1_MARKET_STRUCTURE_LESSONS.map((lesson) => lesson.id),
  ...WAVE1_RISK_MANAGEMENT_LESSONS.map((lesson) => lesson.id),
  ...WAVE1_BEHAVIOR_EVIDENCE_LESSONS.map((lesson) => lesson.id),
]);