import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { bosMicroLesson } from '../../domain/learning/examples/bosLesson';
import { INITIAL_BADGES } from '../../domain/learning/examples/badges';
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
  const streak = useLearningProgressStore((state) => state.streak);
  const badgeAwards = useLearningProgressStore((state) => state.badgeAwards);
  const masteryBySkill = useLearningProgressStore((state) => state.masteryBySkill);
  const presentationMode = useLearningUiStore((state) => state.presentationMode);
  const setPresentationMode = useLearningUiStore((state) => state.setPresentationMode);
  const lessonCompleted = completedLessonIds.includes(bosMicroLesson.id);
  const marketStructureMastery = masteryBySkill['skill.market-structure'];
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
              <Text style={styles.skillTitle}>{language === 'tr' ? 'Piyasa yapısı' : 'Market structure'}</Text>
            </View>
            <Text style={styles.skillScore}>{Math.round(marketStructureMastery?.score ?? 0)}%</Text>
          </View>
          <View style={styles.skillTrack}>
            <View style={[styles.skillFill, { width: `${marketStructureMastery?.score ?? 0}%` }]} />
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
          onPress={() => navigation.navigate('MicroLesson', { lessonId: bosMicroLesson.id })}
        >
          <View style={styles.missionTop}>
            <Text style={styles.missionTag}>MARKET STRUCTURE</Text>
            <Text style={styles.missionTime}>{bosMicroLesson.estimatedMinutes} dk</Text>
          </View>
          <Text style={styles.missionTitle}>{selectLocalizedText(bosMicroLesson.title, language)}</Text>
          <Text style={styles.missionBody}>
            {selectLocalizedText(bosMicroLesson.learningObjective, language)}
          </Text>
          <View style={styles.missionFooter}>
            <Text style={styles.xpReward}>+90 XP</Text>
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
          </View>
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
  badgeRow: { gap: 10, paddingRight: 20 },
  badgeCard: { width: 150, minHeight: 130, padding: 16, borderRadius: 18, backgroundColor: '#0C1928', borderWidth: 1, borderColor: '#1F3449', gap: 8 },
  badgeCardEarned: { borderColor: '#2DD4BF', backgroundColor: '#123B42' },
  badgeIcon: { color: '#FBBF24', fontSize: 27 },
  badgeTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '800' },
  badgeState: { color: '#8094A8', fontSize: 11 },
  archiveRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, borderRadius: 18, backgroundColor: '#0C1928' },
  archiveLink: { color: '#2DD4BF', fontWeight: '800' },
});
