import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LearningModuleCard } from '../../components/learning';
import { MICRO_LESSON_CATALOG } from '../../domain/learning/catalog';
import { INITIAL_BADGES } from '../../domain/learning/examples/badges';
import { BEHAVIOR_EVIDENCE_CHALLENGE, CHART_LITERACY_CHALLENGE, MARKET_FOUNDATIONS_CHALLENGE, RISK_MANAGEMENT_CHALLENGE } from '../../domain/learning/examples/wave1/challenges';
import { WAVE1_BEHAVIOR_EVIDENCE_LESSONS } from '../../domain/learning/examples/wave1/behaviorEvidenceLessons';
import { WAVE1_CHART_LITERACY_LESSONS } from '../../domain/learning/examples/wave1/chartLiteracyLessons';
import { WAVE1_MARKET_FOUNDATION_LESSONS } from '../../domain/learning/examples/wave1/marketFoundationsLessons';
import { WAVE1_RISK_MANAGEMENT_LESSONS } from '../../domain/learning/examples/wave1/riskManagementLessons';
import { WAVE1_CONTENT_SUMMARY } from '../../domain/learning/examples/wave1MarketLiteracyPath';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import { getGoalReason, getProfileGuidance, LEARNING_GOAL_LABELS, LEARNING_STAGE_LABELS, selectGoalForSkill } from '../../domain/learning/personalization';
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
  const presentationMode = useLearningUiStore((state) => state.presentationMode);
  const setPresentationMode = useLearningUiStore((state) => state.setPresentationMode);
  const foundationNextLesson = WAVE1_MARKET_FOUNDATION_LESSONS.find(
    (lesson) => !completedLessonIds.includes(lesson.id)
  );
  const marketChallengeCompleted = completedChallengeIds.includes(MARKET_FOUNDATIONS_CHALLENGE.id);
  const chartNextLesson = marketChallengeCompleted
    ? WAVE1_CHART_LITERACY_LESSONS.find((lesson) => !completedLessonIds.includes(lesson.id))
    : undefined;
  const chartChallengeCompleted = completedChallengeIds.includes(CHART_LITERACY_CHALLENGE.id);
  const riskNextLesson = chartChallengeCompleted
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
    (chartChallengeCompleted ? masteryBySkill['skill.risk-management'] : undefined) ??
    (marketChallengeCompleted ? masteryBySkill['skill.chart-literacy'] : undefined) ??
    masteryBySkill['skill.market-foundations'] ??
    masteryBySkill['skill.market-structure'];
  const wave1CompletedCount = completedLessonIds.filter((lessonId) =>
    WAVE1_LESSON_IDS.has(lessonId)
  ).length;
  const chartLiteracyUnlocked = marketChallengeCompleted;
  const riskManagementUnlocked = chartChallengeCompleted;
  const behaviorEvidenceUnlocked = riskChallengeCompleted;
  const activeModuleNumber = !marketChallengeCompleted
    ? 1
    : !chartChallengeCompleted
      ? 2
      : !riskChallengeCompleted
        ? 3
        : 4;
  const [expandedModule, setExpandedModule] = useState(activeModuleNumber);
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
  const profileGuidance = selectLocalizedText(getProfileGuidance(profile.selectedStage), language);
  const missionGoal = selectGoalForSkill(
    profile.goals,
    mission.kind === 'lesson' ? mission.lesson.skillId : 'skill.market-foundations'
  );
  const goalReason = selectLocalizedText(getGoalReason(missionGoal), language);

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
            <Text style={styles.levelLabel}>{language === 'tr' ? 'SEVİYE' : 'LEVEL'}</Text>
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
                ? 'Normal/Pro anlatımından bağımsız seviyeni ve hedeflerini kaydet.'
                : 'Save your level and goals independently from Normal/Pro presentation.'}
            </Text>
          </Pressable>
        ) : null}

        {profile.onboardingCompletedAt ? (
          <Pressable accessibilityRole="button" onPress={() => navigation.navigate('LearningOnboarding')} style={styles.profileCard}>
            <View style={styles.profileTop}>
              <View>
                <Text style={styles.cardEyebrow}>{language === 'tr' ? 'ÖĞRENME PROFİLİN' : 'YOUR LEARNING PROFILE'}</Text>
                <Text style={styles.profileStage}>{selectLocalizedText(LEARNING_STAGE_LABELS[profile.selectedStage], language)}</Text>
              </View>
              <Text style={styles.profileEdit}>{language === 'tr' ? 'Düzenle' : 'Edit'}</Text>
            </View>
            <View style={styles.profileGoals}>
              {profile.goals.slice(0, 3).map((goal) => (
                <View key={goal} style={styles.profileGoalChip}>
                  <Text style={styles.profileGoalText}>{selectLocalizedText(LEARNING_GOAL_LABELS[goal], language)}</Text>
                </View>
              ))}
              {profile.goals.length > 3 ? <Text style={styles.moreGoals}>+{profile.goals.length - 3}</Text> : null}
            </View>
            <Text style={styles.profileNote}>{language === 'tr' ? 'Temel yol sırası sabit; rehberlik hedeflerine göre uyarlanır.' : 'The foundation path order stays fixed; guidance adapts to your goals.'}</Text>
          </Pressable>
        ) : null}

        <View style={styles.modeRow}>
          <View>
            <Text style={styles.sectionLabel}>{language === 'tr' ? 'ANLATIM' : 'PRESENTATION'}</Text>
            <Text style={styles.modeHint}>{language === 'tr' ? 'Eğitim seviyesi değildir' : 'Not your learning level'}</Text>
          </View>
          <View style={styles.segmented}>
            {(['normal', 'pro'] as const).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => setPresentationMode(mode)}
                style={[styles.segment, presentationMode === mode && styles.segmentActive]}
              >
                <Text style={[styles.segmentText, presentationMode === mode && styles.segmentTextActive]}>
                  {mode === 'normal' ? 'Normal' : 'Pro'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat value={`${totalXp}`} label="XP" />
          <Stat value={`${streak.currentDays}`} label={language === 'tr' ? 'Gün seri' : 'Day streak'} />
          <Stat value={`${badgeAwards.length}`} label={language === 'tr' ? 'Badge' : 'Badges'} />
        </View>

        <View style={styles.skillCard}>
          <View style={styles.skillTop}>
            <View>
              <Text style={styles.sectionLabel}>{language === 'tr' ? 'BECERİ HARİTASI' : 'SKILL MAP'}</Text>
              <Text style={styles.skillTitle}>{riskChallengeCompleted ? (language === 'tr' ? 'Davranış ve kanıt' : 'Behavior and evidence') : chartChallengeCompleted ? (language === 'tr' ? 'Risk yönetimi' : 'Risk management') : marketChallengeCompleted ? (language === 'tr' ? 'Grafik okuryazarlığı' : 'Chart literacy') : (language === 'tr' ? 'Piyasa temelleri' : 'Market foundations')}</Text>
            </View>
            <Text style={styles.skillScore}>{Math.round(activeMastery?.score ?? 0)}%</Text>
          </View>
          <View style={styles.skillTrack}>
            <View style={[styles.skillFill, { width: `${activeMastery?.score ?? 0}%` }]} />
          </View>
          <Text style={styles.skillMeta}>
            {reviewDue > 0
              ? language === 'tr' ? `${reviewDue} tekrar görevi hazır` : `${reviewDue} review task ready`
              : language === 'tr' ? 'Yeni kanıtlarla gelişir' : 'Improves with new evidence'}
          </Text>
        </View>

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

        <Text style={styles.sectionTitle}>{language === 'tr' ? 'Bugünün görevi' : "Today's mission"}</Text>
        <Pressable
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
              <Text style={styles.guidanceHint}>{profileGuidance}</Text>
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

        <Text style={styles.sectionTitle}>{language === 'tr' ? 'Öğrenme yolları' : 'Learning paths'}</Text>
        <View style={styles.pathCard}>
          <View style={styles.pathIcon}><Text style={styles.pathIconText}>01</Text></View>
          <View style={styles.pathContent}>
            <Text style={styles.pathTitle}>{language === 'tr' ? 'Piyasa Okuryazarlığı' : 'Market Literacy'}</Text>
            <Text style={styles.pathBody}>
              {language === 'tr'
                ? 'Piyasa temelleri, grafik okuma, risk ve davranış.'
                : 'Market foundations, chart literacy, risk, and behavior.'}
            </Text>
            <Text style={styles.pathStatus}>{language === 'tr' ? '4 modül · Tamamen ücretsiz' : '4 modules · Completely free'}</Text>
            <Text style={styles.pathProgress}>
              {wave1CompletedCount}/{WAVE1_CONTENT_SUMMARY.lessonCount} {language === 'tr' ? 'ders •' : 'lessons •'} {WAVE1_CONTENT_SUMMARY.estimatedMinutes} dk
            </Text>
          </View>
        </View>

        {[
          {
            number: 1,
            title: language === 'tr' ? 'Piyasa Temelleri' : 'Market Foundations',
            description: language === 'tr' ? 'Fiyat, likidite, spread ve emirlerin çalışma mantığı.' : 'How price, liquidity, spread, and orders work.',
            lessons: WAVE1_MARKET_FOUNDATION_LESSONS,
            challenge: MARKET_FOUNDATIONS_CHALLENGE,
            unlocked: true,
            completed: marketChallengeCompleted,
            unlockMessage: '',
          },
          {
            number: 2,
            title: language === 'tr' ? 'Grafik Okuryazarlığı' : 'Chart Literacy',
            description: language === 'tr' ? 'Mum, zaman dilimi, trend ve yapıyı sade kanıtlarla oku.' : 'Read candles, timeframes, trends, and structure through clear evidence.',
            lessons: WAVE1_CHART_LITERACY_LESSONS,
            challenge: CHART_LITERACY_CHALLENGE,
            unlocked: chartLiteracyUnlocked,
            completed: chartChallengeCompleted,
            unlockMessage: language === 'tr' ? 'Piyasa Mekaniği Challenge tamamlandığında açılır.' : 'Unlocks after the Market Mechanics Challenge.',
          },
          {
            number: 3,
            title: language === 'tr' ? 'Risk Yönetimi' : 'Risk Management',
            description: language === 'tr' ? 'Belirsizlik, volatilite ve boyutlandırmayı birlikte yönet.' : 'Manage uncertainty, volatility, and sizing together.',
            lessons: WAVE1_RISK_MANAGEMENT_LESSONS,
            challenge: RISK_MANAGEMENT_CHALLENGE,
            unlocked: riskManagementUnlocked,
            completed: riskChallengeCompleted,
            unlockMessage: language === 'tr' ? 'Grafik Dedektifi Challenge tamamlandığında açılır.' : 'Unlocks after the Chart Detective Challenge.',
          },
          {
            number: 4,
            title: language === 'tr' ? 'Davranış ve Kanıt' : 'Behavior and Evidence',
            description: language === 'tr' ? 'Karar hatalarını fark et, veri kalitesini sorgula.' : 'Recognize decision errors and question evidence quality.',
            lessons: WAVE1_BEHAVIOR_EVIDENCE_LESSONS,
            challenge: BEHAVIOR_EVIDENCE_CHALLENGE,
            unlocked: behaviorEvidenceUnlocked,
            completed: behaviorChallengeCompleted,
            unlockMessage: language === 'tr' ? 'Risk Koruyucusu Challenge tamamlandığında açılır.' : 'Unlocks after the Risk Guardian Challenge.',
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
            unlockMessage={module.unlockMessage}
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
              <Text style={styles.pathBody}>{language === 'tr' ? 'Tüm slayt, görev, quiz ve challenge ekranlarını ilerlemeyi değiştirmeden incele.' : 'Inspect every slide, task, quiz, and challenge without changing progress.'}</Text>
            </View>
            <Text style={styles.archiveLink}>›</Text>
          </Pressable>
        ) : null}

        <Text style={styles.sectionTitle}>{language === 'tr' ? 'Badge koleksiyonu' : 'Badge collection'}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeRow}>
          {INITIAL_BADGES.map((badge) => {
            const earned = badgeAwards.some((award) => award.badgeId === badge.id);
            return (
              <View key={badge.id} style={[styles.badgeCard, earned && styles.badgeCardEarned]}>
                <Text style={styles.badgeIcon}>{earned ? '◆' : '◇'}</Text>
                <Text style={styles.badgeTitle}>{selectLocalizedText(badge.title, language)}</Text>
                <Text style={styles.badgeState}>{earned ? (language === 'tr' ? 'Kazanıldı' : 'Earned') : (language === 'tr' ? 'Kilitli' : 'Locked')}</Text>
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
  profileCard: { padding: 18, borderRadius: 18, backgroundColor: '#0C1928', borderWidth: 1, borderColor: '#1F3449', gap: 12 },
  profileTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  profileStage: { color: '#F8FAFC', fontSize: 17, fontWeight: '900', marginTop: 4 },
  profileEdit: { color: '#2DD4BF', fontSize: 12, fontWeight: '900' },
  profileGoals: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 7 },
  profileGoalChip: { paddingVertical: 7, paddingHorizontal: 10, borderRadius: 99, backgroundColor: '#172F46' },
  profileGoalText: { color: '#B8D6D5', fontSize: 11, fontWeight: '700' },
  moreGoals: { color: '#8094A8', fontSize: 11, fontWeight: '800' },
  profileNote: { color: '#8094A8', fontSize: 12, lineHeight: 17 },
  cardEyebrow: { color: '#5EEAD4', fontSize: 11, fontWeight: '900' },
  cardTitle: { color: '#F8FAFC', fontSize: 21, fontWeight: '800' },
  cardBody: { color: '#B8D6D5', fontSize: 14, lineHeight: 20 },
  modeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLabel: { color: '#F8FAFC', fontSize: 12, fontWeight: '800' },
  modeHint: { color: '#6F8499', fontSize: 11, marginTop: 2 },
  segmented: { flexDirection: 'row', backgroundColor: '#102033', padding: 4, borderRadius: 12 },
  segment: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 9 },
  segmentActive: { backgroundColor: '#2DD4BF' },
  segmentText: { color: '#9FB0C3', fontWeight: '700', fontSize: 13 },
  segmentTextActive: { color: '#042F2E' },
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
  guidanceHint: { color: '#9FB0C3', fontSize: 12, lineHeight: 18 },
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
  badgeCard: { width: 150, minHeight: 130, padding: 16, borderRadius: 18, backgroundColor: '#0C1928', borderWidth: 1, borderColor: '#1F3449', gap: 8 },
  badgeCardEarned: { borderColor: '#2DD4BF', backgroundColor: '#123B42' },
  badgeIcon: { color: '#FBBF24', fontSize: 27 },
  badgeTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '800' },
  badgeState: { color: '#8094A8', fontSize: 11 },
  archiveRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, borderRadius: 18, backgroundColor: '#0C1928' },
  archiveLink: { color: '#2DD4BF', fontWeight: '800' },
  reviewCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 18, backgroundColor: '#101D2C', borderWidth: 1, borderColor: '#294057' },
  reviewMark: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#172F46' },
  reviewMarkText: { color: '#2DD4BF', fontSize: 14, fontWeight: '900' },
  spacedReviewCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 18, backgroundColor: '#171F2A', borderWidth: 1, borderColor: '#6B5A2B' },
  reviewClock: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2A2618' },
  reviewClockText: { color: '#FBBF24', fontSize: 24, fontWeight: '900' },
});

const WAVE1_LESSON_IDS = new Set([
  ...WAVE1_MARKET_FOUNDATION_LESSONS.map((lesson) => lesson.id),
  ...WAVE1_CHART_LITERACY_LESSONS.map((lesson) => lesson.id),
  ...WAVE1_RISK_MANAGEMENT_LESSONS.map((lesson) => lesson.id),
  ...WAVE1_BEHAVIOR_EVIDENCE_LESSONS.map((lesson) => lesson.id),
]);
