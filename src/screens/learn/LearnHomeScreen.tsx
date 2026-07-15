import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { INITIAL_BADGES } from '../../domain/learning/examples/badges';
import { BEHAVIOR_EVIDENCE_CHALLENGE, CHART_LITERACY_CHALLENGE, MARKET_FOUNDATIONS_CHALLENGE, RISK_MANAGEMENT_CHALLENGE } from '../../domain/learning/examples/wave1/challenges';
import { WAVE1_BEHAVIOR_EVIDENCE_LESSONS } from '../../domain/learning/examples/wave1/behaviorEvidenceLessons';
import { WAVE1_CHART_LITERACY_LESSONS } from '../../domain/learning/examples/wave1/chartLiteracyLessons';
import { WAVE1_MARKET_FOUNDATION_LESSONS } from '../../domain/learning/examples/wave1/marketFoundationsLessons';
import { WAVE1_RISK_MANAGEMENT_LESSONS } from '../../domain/learning/examples/wave1/riskManagementLessons';
import { WAVE1_CONTENT_SUMMARY } from '../../domain/learning/examples/wave1MarketLiteracyPath';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
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
  const marketFoundationsCompletedCount = WAVE1_MARKET_FOUNDATION_LESSONS.filter(
    (lesson) => completedLessonIds.includes(lesson.id)
  ).length;
  const marketFoundationsUnlocked =
    marketFoundationsCompletedCount === WAVE1_MARKET_FOUNDATION_LESSONS.length;
  const chartLiteracyCompletedCount = WAVE1_CHART_LITERACY_LESSONS.filter(
    (lesson) => completedLessonIds.includes(lesson.id)
  ).length;
  const chartLiteracyUnlocked = marketChallengeCompleted;
  const chartChallengeUnlocked =
    chartLiteracyCompletedCount === WAVE1_CHART_LITERACY_LESSONS.length;
  const riskManagementCompletedCount = WAVE1_RISK_MANAGEMENT_LESSONS.filter(
    (lesson) => completedLessonIds.includes(lesson.id)
  ).length;
  const riskManagementUnlocked = chartChallengeCompleted;
  const riskChallengeUnlocked =
    riskManagementCompletedCount === WAVE1_RISK_MANAGEMENT_LESSONS.length;
  const behaviorEvidenceCompletedCount = WAVE1_BEHAVIOR_EVIDENCE_LESSONS.filter(
    (lesson) => completedLessonIds.includes(lesson.id)
  ).length;
  const behaviorEvidenceUnlocked = riskChallengeCompleted;
  const behaviorChallengeUnlocked =
    behaviorEvidenceCompletedCount === WAVE1_BEHAVIOR_EVIDENCE_LESSONS.length;
  const reviewDue = Object.values(masteryBySkill).filter(
    (mastery) => mastery.reviewDueAt && new Date(mastery.reviewDueAt) <= new Date()
  ).length;

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
              {language === 'tr' ? 'Eğitim seviyeni ve hedefini seç' : 'Choose your learning level and goal'}
            </Text>
            <Text style={styles.cardBody}>
              {language === 'tr'
                ? 'Normal/Pro anlatımından bağımsız kişisel eğitim yolunu oluştur.'
                : 'Create a learning path independent from Normal/Pro presentation.'}
            </Text>
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

        <Text style={styles.sectionTitle}>{language === 'tr' ? 'Bugünün görevi' : "Today's mission"}</Text>
        <Pressable
          style={styles.missionCard}
          onPress={() => mission.kind === 'lesson'
            ? navigation.navigate('MicroLesson', { lessonId: mission.lesson.id })
            : navigation.navigate('LearningChallenge', { challengeId: mission.challenge.id })}
        >
          <View style={styles.missionTop}>
            <Text style={styles.missionTag}>M8 LEARN</Text>
            <Text style={styles.missionTime}>{mission.kind === 'lesson' ? `${mission.lesson.estimatedMinutes} dk` : 'Final'}</Text>
          </View>
          <Text style={styles.missionTitle}>{selectLocalizedText(mission.kind === 'lesson' ? mission.lesson.title : mission.challenge.title, language)}</Text>
          <Text style={styles.missionBody}>
            {selectLocalizedText(mission.kind === 'lesson' ? mission.lesson.learningObjective : mission.challenge.description, language)}
          </Text>
          <View style={styles.missionFooter}>
            <Text style={styles.xpReward}>+{mission.kind === 'lesson' ? 90 : mission.challenge.xpReward} XP</Text>
            <Text style={styles.startText}>
              {lessonCompleted
                ? language === 'tr' ? 'Tekrar et →' : 'Review →'
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
            <Text style={styles.pathStatus}>{language === 'tr' ? 'İlk yol • Taslak içerik' : 'First path • Draft content'}</Text>
            <Text style={styles.pathProgress}>
              {wave1CompletedCount}/{WAVE1_CONTENT_SUMMARY.lessonCount} {language === 'tr' ? 'ders •' : 'lessons •'} {WAVE1_CONTENT_SUMMARY.estimatedMinutes} dk
            </Text>
          </View>
        </View>

        <View style={styles.moduleCard}>
          <Text style={styles.sectionLabel}>{language === 'tr' ? 'MODÜL 1' : 'MODULE 1'}</Text>
          <Text style={styles.pathTitle}>{language === 'tr' ? 'Piyasa Temelleri' : 'Market Foundations'}</Text>
          {WAVE1_MARKET_FOUNDATION_LESSONS.map((lesson, index) => {
            const completed = completedLessonIds.includes(lesson.id);
            return (
              <Pressable key={lesson.id} onPress={() => navigation.navigate('MicroLesson', { lessonId: lesson.id })} style={styles.lessonRow}>
                <View style={[styles.lessonNumber, completed && styles.lessonNumberDone]}>
                  <Text style={styles.lessonNumberText}>{completed ? '✓' : index + 1}</Text>
                </View>
                <View style={styles.pathContent}>
                  <Text style={styles.lessonTitle}>{selectLocalizedText(lesson.title, language)}</Text>
                  <Text style={styles.skillMeta}>{lesson.estimatedMinutes} dk • +90 XP</Text>
                </View>
                <Text style={styles.archiveLink}>→</Text>
              </Pressable>
            );
          })}
          <Pressable
            disabled={!marketFoundationsUnlocked}
            onPress={() => navigation.navigate('LearningChallenge', { challengeId: MARKET_FOUNDATIONS_CHALLENGE.id })}
            style={[
              styles.challengeCard,
              !marketFoundationsUnlocked && styles.challengeCardLocked,
            ]}
          >
            <View style={styles.challengeIcon}>
              <Text style={styles.challengeIconText}>{marketFoundationsUnlocked ? '◆' : '◇'}</Text>
            </View>
            <View style={styles.pathContent}>
              <Text style={styles.challengeTitle}>
                {language === 'tr' ? 'Piyasa Mekaniği Challenge' : 'Market Mechanics Challenge'}
              </Text>
              <Text style={styles.skillMeta}>
                {marketFoundationsUnlocked
                  ? language === 'tr' ? '2 uygulama + 6 soru • +100 XP' : '2 tasks + 6 questions • +100 XP'
                  : language === 'tr'
                    ? `${marketFoundationsCompletedCount}/6 ders tamamlandı`
                    : `${marketFoundationsCompletedCount}/6 lessons completed`}
              </Text>
            </View>
            <Text style={styles.archiveLink}>{marketFoundationsUnlocked ? '→' : '🔒'}</Text>
          </Pressable>
        </View>

        <View style={[styles.moduleCard, !chartLiteracyUnlocked && styles.moduleLocked]}>
          <Text style={styles.sectionLabel}>{language === 'tr' ? 'MODÜL 2' : 'MODULE 2'}</Text>
          <Text style={styles.pathTitle}>{language === 'tr' ? 'Grafik Okuryazarlığı' : 'Chart Literacy'}</Text>
          {!chartLiteracyUnlocked ? (
            <Text style={styles.lockedText}>{language === 'tr' ? 'Piyasa Mekaniği Challenge tamamlandığında açılır.' : 'Unlocks after the Market Mechanics Challenge.'}</Text>
          ) : null}
          {WAVE1_CHART_LITERACY_LESSONS.map((lesson, index) => {
            const completed = completedLessonIds.includes(lesson.id);
            return (
              <Pressable disabled={!chartLiteracyUnlocked} key={lesson.id} onPress={() => navigation.navigate('MicroLesson', { lessonId: lesson.id })} style={styles.lessonRow}>
                <View style={[styles.lessonNumber, completed && styles.lessonNumberDone]}>
                  <Text style={styles.lessonNumberText}>{completed ? '✓' : index + 1}</Text>
                </View>
                <View style={styles.pathContent}>
                  <Text style={styles.lessonTitle}>{selectLocalizedText(lesson.title, language)}</Text>
                  <Text style={styles.skillMeta}>{lesson.estimatedMinutes} dk • +90 XP</Text>
                </View>
                <Text style={styles.archiveLink}>{chartLiteracyUnlocked ? '→' : '🔒'}</Text>
              </Pressable>
            );
          })}
          <Pressable
            disabled={!chartChallengeUnlocked}
            onPress={() => navigation.navigate('LearningChallenge', { challengeId: CHART_LITERACY_CHALLENGE.id })}
            style={[styles.challengeCard, !chartChallengeUnlocked && styles.challengeCardLocked]}
          >
            <View style={styles.challengeIcon}><Text style={styles.challengeIconText}>{chartChallengeUnlocked ? '◆' : '◇'}</Text></View>
            <View style={styles.pathContent}>
              <Text style={styles.challengeTitle}>{language === 'tr' ? 'Grafik Dedektifi Challenge' : 'Chart Detective Challenge'}</Text>
              <Text style={styles.skillMeta}>{chartChallengeUnlocked ? (language === 'tr' ? '2 uygulama + 6 soru • +100 XP' : '2 tasks + 6 questions • +100 XP') : (language === 'tr' ? `${chartLiteracyCompletedCount}/6 ders tamamlandı` : `${chartLiteracyCompletedCount}/6 lessons completed`)}</Text>
            </View>
            <Text style={styles.archiveLink}>{chartChallengeUnlocked ? '→' : '🔒'}</Text>
          </Pressable>
        </View>

        <View style={[styles.moduleCard, !riskManagementUnlocked && styles.moduleLocked]}>
          <Text style={styles.sectionLabel}>{language === 'tr' ? 'MODÜL 3' : 'MODULE 3'}</Text>
          <Text style={styles.pathTitle}>{language === 'tr' ? 'Risk Yönetimi' : 'Risk Management'}</Text>
          {!riskManagementUnlocked ? <Text style={styles.lockedText}>{language === 'tr' ? 'Grafik Dedektifi Challenge tamamlandığında açılır.' : 'Unlocks after the Chart Detective Challenge.'}</Text> : null}
          {WAVE1_RISK_MANAGEMENT_LESSONS.map((lesson, index) => {
            const completed = completedLessonIds.includes(lesson.id);
            return (
              <Pressable disabled={!riskManagementUnlocked} key={lesson.id} onPress={() => navigation.navigate('MicroLesson', { lessonId: lesson.id })} style={styles.lessonRow}>
                <View style={[styles.lessonNumber, completed && styles.lessonNumberDone]}><Text style={styles.lessonNumberText}>{completed ? '✓' : index + 1}</Text></View>
                <View style={styles.pathContent}><Text style={styles.lessonTitle}>{selectLocalizedText(lesson.title, language)}</Text><Text style={styles.skillMeta}>{lesson.estimatedMinutes} dk • +90 XP</Text></View>
                <Text style={styles.archiveLink}>{riskManagementUnlocked ? '→' : '🔒'}</Text>
              </Pressable>
            );
          })}
          <Pressable disabled={!riskChallengeUnlocked} onPress={() => navigation.navigate('LearningChallenge', { challengeId: RISK_MANAGEMENT_CHALLENGE.id })} style={[styles.challengeCard, !riskChallengeUnlocked && styles.challengeCardLocked]}>
            <View style={styles.challengeIcon}><Text style={styles.challengeIconText}>{riskChallengeUnlocked ? '◆' : '◇'}</Text></View>
            <View style={styles.pathContent}><Text style={styles.challengeTitle}>{language === 'tr' ? 'Risk Koruyucusu Challenge' : 'Risk Guardian Challenge'}</Text><Text style={styles.skillMeta}>{riskChallengeUnlocked ? (language === 'tr' ? '2 uygulama + 6 soru • +100 XP' : '2 tasks + 6 questions • +100 XP') : (language === 'tr' ? `${riskManagementCompletedCount}/6 ders tamamlandı` : `${riskManagementCompletedCount}/6 lessons completed`)}</Text></View>
            <Text style={styles.archiveLink}>{riskChallengeUnlocked ? '→' : '🔒'}</Text>
          </Pressable>
        </View>

        <View style={[styles.moduleCard, !behaviorEvidenceUnlocked && styles.moduleLocked]}>
          <Text style={styles.sectionLabel}>{language === 'tr' ? 'MODÜL 4' : 'MODULE 4'}</Text>
          <Text style={styles.pathTitle}>{language === 'tr' ? 'Davranış ve Kanıt' : 'Behavior and Evidence'}</Text>
          {!behaviorEvidenceUnlocked ? <Text style={styles.lockedText}>{language === 'tr' ? 'Risk Koruyucusu Challenge tamamlandığında açılır.' : 'Unlocks after the Risk Guardian Challenge.'}</Text> : null}
          {WAVE1_BEHAVIOR_EVIDENCE_LESSONS.map((lesson, index) => {
            const completed = completedLessonIds.includes(lesson.id);
            return (
              <Pressable disabled={!behaviorEvidenceUnlocked} key={lesson.id} onPress={() => navigation.navigate('MicroLesson', { lessonId: lesson.id })} style={styles.lessonRow}>
                <View style={[styles.lessonNumber, completed && styles.lessonNumberDone]}><Text style={styles.lessonNumberText}>{completed ? '✓' : index + 1}</Text></View>
                <View style={styles.pathContent}><Text style={styles.lessonTitle}>{selectLocalizedText(lesson.title, language)}</Text><Text style={styles.skillMeta}>{lesson.estimatedMinutes} dk • +90 XP</Text></View>
                <Text style={styles.archiveLink}>{behaviorEvidenceUnlocked ? '→' : '🔒'}</Text>
              </Pressable>
            );
          })}
          <Pressable disabled={!behaviorChallengeUnlocked} onPress={() => navigation.navigate('LearningChallenge', { challengeId: BEHAVIOR_EVIDENCE_CHALLENGE.id })} style={[styles.challengeCard, !behaviorChallengeUnlocked && styles.challengeCardLocked]}>
            <View style={styles.challengeIcon}><Text style={styles.challengeIconText}>{behaviorChallengeUnlocked ? '◆' : '◇'}</Text></View>
            <View style={styles.pathContent}><Text style={styles.challengeTitle}>{language === 'tr' ? 'Kanıt Dedektifi Challenge' : 'Evidence Detective Challenge'}</Text><Text style={styles.skillMeta}>{behaviorChallengeUnlocked ? (language === 'tr' ? '2 uygulama + 6 soru • +100 XP' : '2 tasks + 6 questions • +100 XP') : (language === 'tr' ? `${behaviorEvidenceCompletedCount}/6 ders tamamlandı` : `${behaviorEvidenceCompletedCount}/6 lessons completed`)}</Text></View>
            <Text style={styles.archiveLink}>{behaviorChallengeUnlocked ? '→' : '🔒'}</Text>
          </Pressable>
        </View>

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

        <View style={styles.archiveRow}>
          <View style={styles.pathContent}>
            <Text style={styles.pathTitle}>{language === 'tr' ? 'Eski kurs arşivi' : 'Legacy course archive'}</Text>
            <Text style={styles.pathBody}>{language === 'tr' ? 'Dönüşüm sırasında kaynak olarak korunuyor.' : 'Preserved as source material during migration.'}</Text>
          </View>
          <Pressable onPress={() => navigation.navigate('LegacyCatalog')}>
            <Text style={styles.archiveLink}>{language === 'tr' ? 'Aç' : 'Open'}</Text>
          </Pressable>
        </View>
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
});

const WAVE1_LESSON_IDS = new Set([
  ...WAVE1_MARKET_FOUNDATION_LESSONS.map((lesson) => lesson.id),
  ...WAVE1_CHART_LITERACY_LESSONS.map((lesson) => lesson.id),
  ...WAVE1_RISK_MANAGEMENT_LESSONS.map((lesson) => lesson.id),
  ...WAVE1_BEHAVIOR_EVIDENCE_LESSONS.map((lesson) => lesson.id),
]);
