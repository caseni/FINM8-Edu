import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LearningLanguageSwitch } from '../../components/learning/LearningLanguageSwitch';
import { BEGINNER_SECTION_IDS, BEGINNER_SECTIONS, type BeginnerSectionId } from '../../domain/learning/beginnerJourney';
import { MICRO_LESSON_CATALOG } from '../../domain/learning/catalog';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import type { RootStackParamList } from '../../types/navigation';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const SECTION_SHORT_LABELS: Record<BeginnerSectionId, { tr: string; en: string }> = {
  money_economy: { tr: 'Para · faiz · ekonomi', en: 'Money · rates · economy' },
  markets: { tr: 'Fiyat · ürün · emir', en: 'Price · assets · orders' },
  charts: { tr: 'Mum · trend · bölgeler', en: 'Candles · trend · zones' },
  risk: { tr: 'Miktar · çıkış · çeşitlendirme', en: 'Size · exits · diversification' },
};

export function LearnLandingScreen() {
  const navigation = useNavigation<Navigation>();
  const { width } = useWindowDimensions();
  const wide = width >= 820;
  const styles = createStyles(wide);
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';
  const completedLessonIds = useLearningProgressStore((state) => state.completedLessonIds);
  const lessonCheckpoints = useLearningProgressStore((state) => state.lessonCheckpoints);
  const profile = useLearningProgressStore((state) => state.profile);

  const beginnerLessonIds = BEGINNER_SECTION_IDS.flatMap((sectionId) => BEGINNER_SECTIONS[sectionId].lessonIds);
  const completedBeginnerCount = beginnerLessonIds.filter((lessonId) => completedLessonIds.includes(lessonId)).length;
  const beginnerComplete = beginnerLessonIds.length > 0 && completedBeginnerCount === beginnerLessonIds.length;
  const beginnerProgress = beginnerLessonIds.length ? completedBeginnerCount / beginnerLessonIds.length : 0;
  const nextLessonId = beginnerLessonIds.find((lessonId) => !completedLessonIds.includes(lessonId));
  const nextLesson = nextLessonId ? MICRO_LESSON_CATALOG.find((lesson) => lesson.id === nextLessonId) : undefined;
  const nextSection = nextLessonId
    ? BEGINNER_SECTION_IDS.map((sectionId) => BEGINNER_SECTIONS[sectionId]).find((section) => section.lessonIds.includes(nextLessonId))
    : undefined;
  const checkpoint = nextLessonId ? lessonCheckpoints[nextLessonId] : undefined;
  const profileReady = Boolean(profile.onboardingCompletedAt);

  const openNext = () => {
    if (!nextLessonId) {
      navigation.navigate('Academy');
      return;
    }
    if (checkpoint?.stage === 'task') {
      navigation.navigate('PracticalTask', { lessonId: nextLessonId, source: 'beginner' });
      return;
    }
    if (checkpoint?.stage === 'quiz') {
      navigation.navigate('LessonQuiz', { lessonId: nextLessonId, source: 'beginner' });
      return;
    }
    navigation.navigate('MicroLesson', { lessonId: nextLessonId, source: 'beginner' });
  };

  const nextActionLabel = beginnerComplete
    ? language === 'tr' ? 'İleri öğrenme yoluna geç' : 'Choose a deeper learning path'
    : checkpoint?.stage === 'task'
      ? language === 'tr' ? 'Göreve devam et' : 'Continue task'
      : checkpoint?.stage === 'quiz'
        ? language === 'tr' ? 'Quiz’e devam et' : 'Continue quiz'
        : completedBeginnerCount > 0
          ? language === 'tr' ? 'Kaldığın yerden devam et' : 'Continue where you left off'
          : language === 'tr' ? 'İlk derse başla' : 'Start your first lesson';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <View style={styles.brandWrap}>
            <Text style={styles.brand}>FINM8 EDU</Text>
            <Text style={styles.brandNote}>{language === 'tr' ? 'Finansı gerçekten anlayarak öğren.' : 'Learn finance by actually understanding it.'}</Text>
          </View>
          <View style={styles.topActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={language === 'tr' ? 'Öğrenme tercihlerini aç' : 'Open learning preferences'}
              onPress={() => navigation.navigate('LearningOnboarding')}
              style={({ pressed }) => [styles.profileButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.profileButtonText}>{profileReady ? (language === 'tr' ? 'Tercihler' : 'Preferences') : (language === 'tr' ? 'Sana göre ayarla' : 'Personalize')}</Text>
            </Pressable>
            <LearningLanguageSwitch />
          </View>
        </View>

        <View
          style={styles.hero}
          accessibilityRole={beginnerComplete ? 'summary' : undefined}
          accessibilityLabel={beginnerComplete
            ? language === 'tr'
              ? 'Temel okuryazarlık yolu tamamlandı. 24/24 ders tamamlandı.'
              : 'Foundation literacy path complete. 24 of 24 lessons completed.'
            : undefined}
        >
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>{language === 'tr' ? 'BUGÜN 5 DAKİKA' : '5 MINUTES TODAY'}</Text>
            <Text style={styles.title}>
              {beginnerComplete
                ? language === 'tr' ? 'Temeli tamamladın. Şimdi istediğin konuda derinleş.' : 'Your foundation is complete. Go deeper where you want.'
                : completedBeginnerCount > 0
                  ? language === 'tr' ? 'Kaldığın yer hazır.' : 'Your next step is ready.'
                  : language === 'tr' ? 'Öğrenmeye Başla' : 'Start Learning'}
            </Text>
            <Text style={styles.subtitle}>
              {beginnerComplete
                ? language === 'tr'
                  ? 'Para, piyasa, grafik ve risk temelini bitirdin. Bundan sonra yolunu ilgine göre seçebilirsin.'
                  : 'You finished the foundations of money, markets, charts, and risk. Choose what to deepen next.'
                : nextLesson && nextSection
                  ? language === 'tr'
                    ? `${selectLocalizedText(nextSection.title, language)} · ${selectLocalizedText(nextLesson.title, language)}`
                    : `${selectLocalizedText(nextSection.title, language)} · ${selectLocalizedText(nextLesson.title, language)}`
                  : language === 'tr'
                    ? 'Hiç bilmesen de olur. Finansın temelini adım adım öğreneceksin.'
                    : 'You do not need prior knowledge. Learn finance step by step.'}
            </Text>
            {!beginnerComplete && nextLesson ? (
              <View style={styles.heroMetaRow}>
                <View style={styles.metaPill}><Text style={styles.metaPillText}>{nextLesson.estimatedMinutes} {language === 'tr' ? 'dk' : 'min'}</Text></View>
                <View style={styles.metaPill}><Text style={styles.metaPillText}>{completedBeginnerCount}/24 {language === 'tr' ? 'ders' : 'lessons'}</Text></View>
                {checkpoint?.stage ? <View style={styles.metaPillStrong}><Text style={styles.metaPillStrongText}>{checkpoint.stage === 'task' ? (language === 'tr' ? 'GÖREV' : 'TASK') : checkpoint.stage === 'quiz' ? 'QUIZ' : (language === 'tr' ? 'DERS' : 'LESSON')}</Text></View> : null}
              </View>
            ) : null}
          </View>

          <View style={styles.heroActionPane}>
            <View style={styles.overallProgress}>
              <View style={styles.progressTop}>
                <Text style={styles.progressLabel}>{language === 'tr' ? 'Temel yol' : 'Foundation path'}</Text>
                <Text style={styles.progressValue}>{Math.round(beginnerProgress * 100)}%</Text>
              </View>
              <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${beginnerProgress * 100}%` }]} /></View>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={nextActionLabel}
              onPress={openNext}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.primaryButtonText}>{nextActionLabel}</Text>
              <Text style={styles.primaryButtonArrow}>›</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={language === 'tr' ? 'İleri konuları aç' : 'Open advanced topics'}
              onPress={() => navigation.navigate('Academy')}
              style={({ pressed }) => [styles.linkButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.linkButtonText}>{language === 'tr' ? 'İleri konular' : 'Advanced topics'}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.promiseRow}>
          <View style={styles.promiseMark}><Text style={styles.promiseMarkText}>01</Text></View>
          <View style={styles.promiseCopy}>
            <Text style={styles.promiseTitle}>{language === 'tr' ? 'Önce anla, sonra terimi öğren.' : 'Understand first, learn the term second.'}</Text>
            <Text style={styles.promiseBody}>
              {language === 'tr'
                ? 'Kısa açıklama, konuya özel görsel, mini uygulama ve quiz aynı akışta.'
                : 'Short explanation, topic-specific visual, mini practice, and quiz in one flow.'}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionKicker}>{language === 'tr' ? 'ÖĞRENME YOLUN' : 'YOUR LEARNING PATH'}</Text>
            <Text style={styles.sectionTitle}>{language === 'tr' ? 'Dört adımda temel okuryazarlık' : 'Four steps to basic financial literacy'}</Text>
          </View>
          <Text style={styles.sectionBody}>{language === 'tr' ? '24 kısa ders · kendi hızında ilerle' : '24 short lessons · learn at your pace'}</Text>
        </View>

        <View style={styles.sectionList}>
          {BEGINNER_SECTION_IDS.map((sectionId) => {
            const section = BEGINNER_SECTIONS[sectionId];
            const active = section.status === 'active';
            const completedCount = section.lessonIds.filter((lessonId) => completedLessonIds.includes(lessonId)).length;
            const progress = section.lessonIds.length ? completedCount / section.lessonIds.length : 0;
            const progressPercent = Math.round(progress * 100);
            const completed = completedCount === section.lessonIds.length;
            const started = completedCount > 0;
            const status = completed
              ? language === 'tr' ? 'TAMAMLANDI' : 'COMPLETE'
              : started
                ? language === 'tr' ? 'DEVAM' : 'CONTINUE'
                : language === 'tr' ? 'BAŞLA' : 'START';
            const sectionTitle = selectLocalizedText(section.title, language);
            const sectionAccessibilityLabel = language === 'tr'
              ? `${sectionTitle}. ${status}. ${completedCount}/${section.lessonIds.length} ders, yüzde ${progressPercent}.`
              : `${sectionTitle}. ${status}. ${completedCount} of ${section.lessonIds.length} lessons, ${progressPercent} percent.`;

            return (
              <Pressable
                key={section.id}
                accessibilityRole="button"
                accessibilityLabel={sectionAccessibilityLabel}
                accessibilityState={active ? undefined : { disabled: true }}
                disabled={!active}
                onPress={() => navigation.navigate('BeginnerSection', { sectionId: section.id })}
                style={({ pressed }) => [styles.sectionCard, completed && styles.sectionCardComplete, !active && styles.sectionCardDisabled, pressed && active && styles.sectionCardPressed]}
              >
                <View style={styles.cardTop}>
                  <View style={[styles.sectionNumber, completed && styles.sectionNumberComplete]}>
                    <Text style={styles.sectionNumberText}>{completed ? '✓' : String(section.order).padStart(2, '0')}</Text>
                  </View>
                  <Text style={[styles.status, completed && styles.statusComplete]}>{status}</Text>
                </View>
                <View style={styles.sectionCopy}>
                  <Text style={styles.cardTitle}>{sectionTitle}</Text>
                  <Text style={styles.cardDescription}>{SECTION_SHORT_LABELS[sectionId][language]}</Text>
                </View>
                <View style={styles.cardProgressRow}>
                  <Text style={styles.cardProgressText}>{completedCount}/{section.lessonIds.length}</Text>
                  <View style={styles.cardProgressTrack}><View style={[styles.cardProgressFill, { width: `${progress * 100}%` }]} /></View>
                  <Text style={styles.openText}>›</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.academyCard}>
          <View style={styles.academyCopy}>
            <Text style={styles.academyEyebrow}>ACADEMY</Text>
            <Text style={styles.academyTitle}>{language === 'tr' ? 'Bir konuyu zaten biliyor musun?' : 'Already know the basics?'}</Text>
            <Text style={styles.academyBody}>
              {language === 'tr'
                ? 'Ekonomi, piyasalar, grafikler, şirketler, risk ve daha fazlasında doğrudan istediğin alana gir.'
                : 'Jump directly into economics, markets, charts, companies, risk, and more.'}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={language === 'tr' ? 'İleri konuları aç' : 'Open advanced topics'}
            onPress={() => navigation.navigate('Academy')}
            style={({ pressed }) => [styles.academyButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.academyButtonText}>{language === 'tr' ? 'Academy’yi aç' : 'Open Academy'}</Text>
            <Text style={styles.academyButtonArrow}>›</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (wide: boolean) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#06111F' },
  content: { width: '100%', maxWidth: 980, alignSelf: 'center', paddingHorizontal: wide ? 28 : 18, paddingTop: 18, paddingBottom: 52, gap: wide ? 24 : 18 },
  topBar: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14 },
  brandWrap: { flex: 1, gap: 3 },
  brand: { color: '#55E7D4', fontSize: 11, fontWeight: '900', letterSpacing: 2.5 },
  brandNote: { color: '#70869A', fontSize: wide ? 11 : 10, lineHeight: 15 },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  profileButton: { minHeight: 36, justifyContent: 'center', paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#29485B', backgroundColor: '#0A1928' },
  profileButtonText: { color: '#B9CBD5', fontSize: 10, fontWeight: '800' },

  hero: { flexDirection: wide ? 'row' : 'column', gap: wide ? 28 : 18, padding: wide ? 28 : 20, borderRadius: 26, borderWidth: 1, borderColor: '#286761', backgroundColor: '#0A2329' },
  heroCopy: { flex: wide ? 1.22 : undefined, gap: 9 },
  heroEyebrow: { color: '#5EEAD4', fontSize: 10, fontWeight: '900', letterSpacing: 1.05 },
  title: { maxWidth: 620, color: '#F8FAFC', fontSize: wide ? 38 : 30, lineHeight: wide ? 45 : 37, fontWeight: '900' },
  subtitle: { maxWidth: 650, color: '#AEC1CC', fontSize: wide ? 15 : 14, lineHeight: wide ? 23 : 21 },
  heroMetaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 2 },
  metaPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#102F37' },
  metaPillText: { color: '#95ADB8', fontSize: 9, fontWeight: '800' },
  metaPillStrong: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#123F3C', borderWidth: 1, borderColor: '#2B756D' },
  metaPillStrongText: { color: '#72E8D8', fontSize: 9, fontWeight: '900' },
  heroActionPane: { flex: wide ? 0.78 : undefined, minWidth: wide ? 270 : undefined, justifyContent: 'center', gap: 12 },
  overallProgress: { gap: 7 },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { color: '#8EA5B3', fontSize: 10, fontWeight: '800' },
  progressValue: { color: '#E6F4F2', fontSize: 11, fontWeight: '900' },
  progressTrack: { height: 6, overflow: 'hidden', borderRadius: 999, backgroundColor: '#18333C' },
  progressFill: { height: 6, borderRadius: 999, backgroundColor: '#43D7C5' },
  primaryButton: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: 17, borderRadius: 15, backgroundColor: '#46D8C6' },
  primaryButtonText: { flex: 1, color: '#05221F', fontSize: 13, fontWeight: '900' },
  primaryButtonArrow: { color: '#05221F', fontSize: 25, lineHeight: 25 },
  linkButton: { minHeight: 42, alignItems: 'center', justifyContent: 'center' },
  linkButtonText: { color: '#A2BAC2', fontSize: 11, fontWeight: '800' },
  buttonPressed: { opacity: 0.72 },

  promiseRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: wide ? 4 : 2 },
  promiseMark: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0D2933', borderWidth: 1, borderColor: '#235563' },
  promiseMarkText: { color: '#54DCCC', fontSize: 9, fontWeight: '900' },
  promiseCopy: { flex: 1, gap: 3 },
  promiseTitle: { color: '#EAF1F5', fontSize: 13, fontWeight: '900' },
  promiseBody: { color: '#8098A8', fontSize: 11, lineHeight: 16 },

  sectionHeading: { flexDirection: wide ? 'row' : 'column', alignItems: wide ? 'flex-end' : 'flex-start', justifyContent: 'space-between', gap: 6, marginTop: 3 },
  sectionKicker: { color: '#4ECFC0', fontSize: 9, fontWeight: '900', letterSpacing: 0.95, marginBottom: 4 },
  sectionTitle: { color: '#F8FAFC', fontSize: wide ? 24 : 21, lineHeight: wide ? 30 : 27, fontWeight: '900' },
  sectionBody: { color: '#758B9D', fontSize: 11, lineHeight: 16 },
  sectionList: { flexDirection: wide ? 'row' : 'column', flexWrap: wide ? 'wrap' : 'nowrap', gap: 12 },
  sectionCard: { width: wide ? '49%' : '100%', minHeight: wide ? 154 : 132, justifyContent: 'space-between', gap: 12, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#203A4E', backgroundColor: '#091827' },
  sectionCardComplete: { borderColor: '#2D6965', backgroundColor: '#0A2027' },
  sectionCardPressed: { backgroundColor: '#102632' },
  sectionCardDisabled: { opacity: 0.55 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionNumber: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#102435', borderWidth: 1, borderColor: '#2B4A5E' },
  sectionNumberComplete: { backgroundColor: '#103A38', borderColor: '#317D74' },
  sectionNumberText: { color: '#65E7D6', fontSize: 10, fontWeight: '900' },
  status: { color: '#7890A2', fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
  statusComplete: { color: '#67E7D7' },
  sectionCopy: { gap: 4 },
  cardTitle: { color: '#F5F8FA', fontSize: wide ? 18 : 17, lineHeight: 23, fontWeight: '900' },
  cardDescription: { color: '#8DA2B2', fontSize: 11, lineHeight: 16 },
  cardProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  cardProgressText: { width: 28, color: '#86A0AD', fontSize: 9, fontWeight: '800' },
  cardProgressTrack: { flex: 1, height: 4, overflow: 'hidden', borderRadius: 999, backgroundColor: '#173044' },
  cardProgressFill: { height: 4, borderRadius: 999, backgroundColor: '#3ED1BF' },
  openText: { color: '#4ED7C7', fontSize: 23, lineHeight: 23 },

  academyCard: { flexDirection: wide ? 'row' : 'column', alignItems: wide ? 'center' : 'stretch', justifyContent: 'space-between', gap: 18, padding: wide ? 22 : 18, borderRadius: 22, borderWidth: 1, borderColor: '#273D52', backgroundColor: '#091724' },
  academyCopy: { flex: 1, gap: 5 },
  academyEyebrow: { color: '#8C9EAF', fontSize: 9, fontWeight: '900', letterSpacing: 1.15 },
  academyTitle: { color: '#F2F6F9', fontSize: 17, lineHeight: 22, fontWeight: '900' },
  academyBody: { maxWidth: 650, color: '#8499A9', fontSize: 11, lineHeight: 17 },
  academyButton: { minHeight: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14, paddingHorizontal: 15, borderRadius: 14, borderWidth: 1, borderColor: '#2A5E62', backgroundColor: '#0D2B31' },
  academyButtonText: { color: '#BDE3DE', fontSize: 11, fontWeight: '900' },
  academyButtonArrow: { color: '#58DCCA', fontSize: 22, lineHeight: 22 },
});
