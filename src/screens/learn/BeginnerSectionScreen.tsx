import React, { useMemo } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BEGINNER_SECTION_IDS, BEGINNER_SECTIONS } from '../../domain/learning/beginnerJourney';
import { MICRO_LESSON_CATALOG } from '../../domain/learning/catalog';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import type { RootStackParamList } from '../../types/navigation';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'BeginnerSection'>;
type ScreenRoute = RouteProp<RootStackParamList, 'BeginnerSection'>;

function sectionHero(sectionId: keyof typeof BEGINNER_SECTIONS, language: LearningLanguage): string {
  if (sectionId === 'charts') {
    return language === 'tr' ? 'Grafiğe bakınca ne gördüğünü anlamaya başla.' : 'Start understanding what you see on a chart.';
  }
  if (sectionId === 'risk') {
    return language === 'tr' ? 'Kazançtan önce neyi koruduğunu öğren.' : 'Learn what you are protecting before chasing returns.';
  }
  if (sectionId === 'markets') {
    return language === 'tr' ? 'Fiyatın ve işlemin arkasındaki mantığı gör.' : 'See the logic behind prices and trades.';
  }
  return language === 'tr' ? 'Paranın günlük hayattaki etkisini anlayarak başla.' : 'Start with how money affects everyday life.';
}

function sectionOutcome(sectionId: keyof typeof BEGINNER_SECTIONS, language: LearningLanguage): string {
  if (sectionId === 'money_economy') {
    return language === 'tr'
      ? 'Satın alma gücü, faiz ve ekonomik yavaşlama gibi temel fikirleri günlük örneklerde ayırt edebileceksin.'
      : 'You will recognize ideas such as purchasing power, interest, and economic slowdowns in everyday examples.';
  }
  if (sectionId === 'markets') {
    return language === 'tr'
      ? 'Fiyatın nasıl oluştuğunu, ne aldığını, alış-satış farkını ve işlem fiyatının neden değişebildiğini ayırt edebileceksin.'
      : 'You will recognize how price forms, what you are buying, the buy-sell gap, and why execution price can differ.';
  }
  if (sectionId === 'charts') {
    return language === 'tr'
      ? 'Zaman dilimini, genel yönü, tepki bölgelerini ve yardımcı çizgilerin sınırlarını temel düzeyde okuyabileceksin.'
      : 'You will read timeframes, broader direction, reaction areas, and the limits of helper lines at a basic level.';
  }
  return language === 'tr'
    ? 'Riski kayıptan önce fark etmeyi, miktarın etkisini ve kontrollü çıkışın temelini ayırt edebileceksin.'
    : 'You will recognize risk before loss, the effect of position size, and the basics of controlled exits.';
}

export function BeginnerSectionScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<ScreenRoute>();
  const { width } = useWindowDimensions();
  const wide = width >= 820;
  const styles = createStyles(wide);
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';
  const completedLessonIds = useLearningProgressStore((state) => state.completedLessonIds);
  const lessonCheckpoints = useLearningProgressStore((state) => state.lessonCheckpoints);
  const section = BEGINNER_SECTIONS[route.params.sectionId];

  const lessonsById = useMemo(
    () => new Map(MICRO_LESSON_CATALOG.map((lesson) => [lesson.id, lesson] as const)),
    []
  );
  const lessons = section.lessonIds
    .map((lessonId) => lessonsById.get(lessonId))
    .filter((lesson) => lesson !== undefined);
  const completedCount = lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
  const progress = lessons.length ? completedCount / lessons.length : 0;
  const progressPercent = Math.round(progress * 100);
  const sectionComplete = lessons.length > 0 && completedCount === lessons.length;
  const sectionIndex = BEGINNER_SECTION_IDS.indexOf(section.id);
  const nextSectionId = sectionIndex >= 0 && sectionIndex < BEGINNER_SECTION_IDS.length - 1
    ? BEGINNER_SECTION_IDS[sectionIndex + 1]
    : undefined;
  const nextSection = nextSectionId ? BEGINNER_SECTIONS[nextSectionId] : undefined;
  const sectionTitle = selectLocalizedText(section.title, language);
  const sectionProgressAccessibilityLabel = language === 'tr'
    ? `${sectionTitle}. ${completedCount}/${lessons.length} ders tamamlandı, yüzde ${progressPercent}.`
    : `${sectionTitle}. ${completedCount} of ${lessons.length} lessons completed, ${progressPercent} percent.`;

  const inProgressLesson = lessons.find((lesson) => (
    !completedLessonIds.includes(lesson.id) && Boolean(lessonCheckpoints[lesson.id])
  ));
  const nextLesson = inProgressLesson ?? lessons.find((lesson) => !completedLessonIds.includes(lesson.id));
  const nextCheckpoint = nextLesson ? lessonCheckpoints[nextLesson.id] : undefined;
  const nextLessonTitle = nextLesson ? selectLocalizedText(nextLesson.title, language) : undefined;
  const nextActionLabel = nextCheckpoint?.stage === 'task'
    ? language === 'tr' ? 'Göreve devam et' : 'Continue task'
    : nextCheckpoint?.stage === 'quiz'
      ? language === 'tr' ? 'Quiz’e devam et' : 'Continue quiz'
      : completedCount > 0
        ? language === 'tr' ? 'Sıradaki derse geç' : 'Continue to next lesson'
        : language === 'tr' ? 'İlk derse başla' : 'Start the first lesson';

  const openLesson = (lessonId: string) => {
    const checkpoint = lessonCheckpoints[lessonId];
    if (checkpoint?.stage === 'task') {
      navigation.navigate('PracticalTask', { lessonId, source: 'beginner' });
      return;
    }
    if (checkpoint?.stage === 'quiz') {
      navigation.navigate('LessonQuiz', { lessonId, source: 'beginner' });
      return;
    }
    navigation.navigate('MicroLesson', { lessonId, source: 'beginner' });
  };

  const continueAfterSection = () => {
    if (nextSectionId) {
      navigation.replace('BeginnerSection', { sectionId: nextSectionId });
      return;
    }
    navigation.navigate('Academy');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={language === 'tr' ? 'Öğrenmeye Başla ekranına dön' : 'Return to the beginner learning screen'}
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <View style={styles.headingCopy}>
            <Text style={styles.brand}>FINM8 EDU</Text>
            <Text style={styles.title}>{sectionTitle}</Text>
          </View>
          <Text style={styles.topProgress}>{completedCount}/{lessons.length}</Text>
        </View>

        <View style={styles.hero} accessibilityRole="summary" accessibilityLabel={sectionProgressAccessibilityLabel}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>{language === 'tr' ? 'BAŞLANGIÇ · 6 KISA DERS' : 'BEGINNER · 6 SHORT LESSONS'}</Text>
            <Text style={styles.heroTitle}>
              {sectionComplete
                ? language === 'tr' ? 'Bu bölümü tamamladın.' : 'You completed this section.'
                : sectionHero(section.id, language)}
            </Text>
            <Text style={styles.heroBody}>{selectLocalizedText(section.description, language)}</Text>
          </View>
          <View style={styles.heroProgressPane}>
            <View style={styles.progressHeadline}>
              <Text style={styles.progressBig}>{completedCount}</Text>
              <Text style={styles.progressOf}>/ {lessons.length}</Text>
            </View>
            <Text style={styles.progressCaption}>{language === 'tr' ? 'ders tamamlandı' : 'lessons complete'}</Text>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress * 100}%` }]} /></View>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>
        </View>

        {!sectionComplete && nextLesson && nextLessonTitle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={nextActionLabel}
            onPress={() => openLesson(nextLesson.id)}
            style={({ pressed }) => [styles.nextLessonCard, pressed && styles.nextLessonCardPressed]}
          >
            <View style={styles.nextLessonCopy}>
              <Text style={styles.nextLessonEyebrow}>{inProgressLesson ? (language === 'tr' ? 'KALDIĞIN YER' : 'CONTINUE HERE') : (language === 'tr' ? 'SIRADAKİ' : 'UP NEXT')}</Text>
              <Text style={styles.nextLessonTitle}>{nextLessonTitle}</Text>
              <Text style={styles.nextLessonMeta}>
                {nextActionLabel} · {nextLesson.estimatedMinutes} {language === 'tr' ? 'dk' : 'min'}
              </Text>
            </View>
            <View style={styles.nextLessonArrowWrap}><Text style={styles.nextLessonArrow}>›</Text></View>
          </Pressable>
        ) : null}

        {!sectionComplete ? (
          <View style={styles.learningRhythm}>
            <Text style={styles.learningRhythmLabel}>{language === 'tr' ? 'HER DERS' : 'EVERY LESSON'}</Text>
            <Text style={styles.learningRhythmText}>
              {language === 'tr'
                ? '1 ana fikir  ·  konuya özel görsel  ·  mini uygulama  ·  quiz'
                : '1 core idea  ·  topic visual  ·  mini practice  ·  quiz'}
            </Text>
          </View>
        ) : null}

        <View style={styles.lessonHeading}>
          <View>
            <Text style={styles.lessonHeadingEyebrow}>{language === 'tr' ? 'DERSLER' : 'LESSONS'}</Text>
            <Text style={styles.lessonHeadingTitle}>{language === 'tr' ? 'Adım adım ilerle' : 'Move step by step'}</Text>
          </View>
          <Text style={styles.lessonHeadingMeta}>{language === 'tr' ? 'İstediğin zaman geri dönebilirsin' : 'Come back anytime'}</Text>
        </View>

        <View style={styles.lessonList}>
          {lessons.map((lesson, index) => {
            const completed = completedLessonIds.includes(lesson.id);
            const checkpoint = lessonCheckpoints[lesson.id];
            const resume = checkpoint && !completed;
            const isNext = nextLesson?.id === lesson.id && !completed;
            const lessonTitle = selectLocalizedText(lesson.title, language);
            const lessonState = resume
              ? language === 'tr' ? 'Kaldığın yerden devam et' : 'Continue where you left off'
              : completed
                ? language === 'tr' ? 'Tamamlandı' : 'Complete'
                : `${lesson.estimatedMinutes} ${language === 'tr' ? 'dk' : 'min'}`;
            return (
              <Pressable
                key={lesson.id}
                testID={`beginner-lesson-${lesson.id}`}
                accessibilityRole="button"
                accessibilityLabel={`${lessonTitle}. ${lessonState}.`}
                onPress={() => openLesson(lesson.id)}
                style={({ pressed }) => [
                  styles.lessonRow,
                  index > 0 && styles.lessonRowBorder,
                  completed && styles.lessonRowComplete,
                  isNext && styles.lessonRowNext,
                  pressed && styles.lessonRowPressed,
                ]}
              >
                <View style={[styles.lessonNumber, completed && styles.lessonNumberComplete, isNext && styles.lessonNumberNext]}>
                  <Text style={styles.lessonNumberText}>{completed ? '✓' : index + 1}</Text>
                </View>
                <View style={styles.lessonCopy}>
                  <Text style={styles.lessonTitle}>{lessonTitle}</Text>
                  <Text style={[styles.lessonMeta, resume && styles.lessonMetaResume]}>{lessonState}</Text>
                </View>
                {isNext ? <Text style={styles.nextTag}>{language === 'tr' ? 'SIRADA' : 'NEXT'}</Text> : null}
                <Text style={styles.openText}>›</Text>
              </Pressable>
            );
          })}
        </View>

        {sectionComplete ? (
          <View
            style={styles.completionCard}
            accessibilityRole="summary"
            accessibilityLabel={language === 'tr'
              ? `${sectionTitle} bölümü tamamlandı. 6/6 ders.`
              : `${sectionTitle} section complete. 6 of 6 lessons.`}
          >
            <View style={styles.completionCopy}>
              <Text style={styles.completionEyebrow}>{language === 'tr' ? 'BÖLÜM TAMAMLANDI' : 'SECTION COMPLETE'}</Text>
              <Text style={styles.completionTitle}>
                {nextSection
                  ? language === 'tr' ? 'Hazırsan sıradaki adıma geç.' : 'Move to the next step when you are ready.'
                  : language === 'tr' ? 'Temel yolun burada tamamlandı.' : 'Your foundation path is complete.'}
              </Text>
              <Text style={styles.completionBody}>
                {nextSection
                  ? language === 'tr'
                    ? `Sıradaki bölüm: ${nextSection.title.tr}.`
                    : `Next section: ${nextSection.title.en}.`
                  : language === 'tr'
                    ? 'Şimdi ilgini çeken ileri alanda derinleşebilirsin.'
                    : 'Now go deeper in an advanced subject that interests you.'}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={nextSection
                ? language === 'tr' ? `Sıradaki bölüme geç: ${nextSection.title.tr}` : `Continue to next section: ${nextSection.title.en}`
                : language === 'tr' ? 'İleri öğrenme yollarını gör' : 'See deeper learning paths'}
              onPress={continueAfterSection}
              style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}
            >
              <Text style={styles.nextButtonText}>
                {nextSection
                  ? language === 'tr' ? 'Sıradaki bölüm' : 'Next section'
                  : language === 'tr' ? 'Academy’ye geç' : 'Go to Academy'}
              </Text>
              <Text style={styles.nextButtonArrow}>›</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.outcome}>
            <Text style={styles.outcomeEyebrow}>{language === 'tr' ? 'BU BÖLÜMDEN SONRA' : 'AFTER THIS SECTION'}</Text>
            <Text style={styles.outcomeText}>{sectionOutcome(section.id, language)}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (wide: boolean) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#06111F' },
  content: { width: '100%', maxWidth: 980, alignSelf: 'center', paddingHorizontal: wide ? 28 : 18, paddingTop: 18, gap: wide ? 22 : 16, paddingBottom: 50 },
  topBar: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: '#0A1928', borderWidth: 1, borderColor: '#253D51' },
  backText: { color: '#DDE8EE', fontSize: 29, lineHeight: 30 },
  headingCopy: { flex: 1, gap: 1 },
  brand: { color: '#48DCCB', fontSize: 9, fontWeight: '900', letterSpacing: 1.9 },
  title: { color: '#F8FAFC', fontSize: wide ? 25 : 22, lineHeight: wide ? 31 : 28, fontWeight: '900' },
  topProgress: { color: '#8298A8', fontSize: 11, fontWeight: '900' },
  pressed: { opacity: 0.72 },

  hero: { flexDirection: wide ? 'row' : 'column', gap: wide ? 28 : 16, padding: wide ? 25 : 19, borderRadius: 24, backgroundColor: '#0A222A', borderWidth: 1, borderColor: '#255A60' },
  heroCopy: { flex: wide ? 1.3 : undefined, gap: 8 },
  heroEyebrow: { color: '#59E2D1', fontSize: 9, fontWeight: '900', letterSpacing: 0.9 },
  heroTitle: { maxWidth: 620, color: '#F8FAFC', fontSize: wide ? 29 : 23, lineHeight: wide ? 36 : 30, fontWeight: '900' },
  heroBody: { maxWidth: 660, color: '#9FB5C1', fontSize: wide ? 13 : 12, lineHeight: wide ? 20 : 18 },
  heroProgressPane: { minWidth: wide ? 190 : undefined, justifyContent: 'center', gap: 6, paddingTop: wide ? 0 : 3 },
  progressHeadline: { flexDirection: 'row', alignItems: 'baseline' },
  progressBig: { color: '#ECF7F5', fontSize: wide ? 34 : 27, lineHeight: wide ? 39 : 32, fontWeight: '900' },
  progressOf: { color: '#79909F', fontSize: 14, fontWeight: '800' },
  progressCaption: { color: '#79909F', fontSize: 9, fontWeight: '800' },
  progressTrack: { height: 5, overflow: 'hidden', borderRadius: 999, backgroundColor: '#19343E', marginTop: 3 },
  progressFill: { height: 5, borderRadius: 999, backgroundColor: '#46D9C7' },
  progressPercent: { alignSelf: 'flex-end', color: '#8CB2B2', fontSize: 9, fontWeight: '900' },

  nextLessonCard: { minHeight: wide ? 106 : 96, flexDirection: 'row', alignItems: 'center', gap: 14, padding: wide ? 18 : 15, borderRadius: 20, borderWidth: 1, borderColor: '#34756E', backgroundColor: '#0B292D' },
  nextLessonCardPressed: { backgroundColor: '#10353A' },
  nextLessonCopy: { flex: 1, gap: 4 },
  nextLessonEyebrow: { color: '#63E8D7', fontSize: 9, fontWeight: '900', letterSpacing: 0.85 },
  nextLessonTitle: { color: '#F7FAFB', fontSize: wide ? 18 : 16, lineHeight: wide ? 24 : 22, fontWeight: '900' },
  nextLessonMeta: { color: '#94AFB6', fontSize: 10, lineHeight: 15, fontWeight: '700' },
  nextLessonArrowWrap: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: '#123B3C' },
  nextLessonArrow: { color: '#65E7D7', fontSize: 26, lineHeight: 27 },

  learningRhythm: { flexDirection: wide ? 'row' : 'column', alignItems: wide ? 'center' : 'flex-start', gap: wide ? 12 : 4, paddingHorizontal: 3 },
  learningRhythmLabel: { color: '#4FCFBE', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  learningRhythmText: { color: '#768C9C', fontSize: 10, lineHeight: 15, fontWeight: '700' },

  lessonHeading: { flexDirection: wide ? 'row' : 'column', alignItems: wide ? 'flex-end' : 'flex-start', justifyContent: 'space-between', gap: 5, marginTop: 2 },
  lessonHeadingEyebrow: { color: '#4ACBBA', fontSize: 9, fontWeight: '900', letterSpacing: 0.85, marginBottom: 3 },
  lessonHeadingTitle: { color: '#F5F8FA', fontSize: wide ? 21 : 19, lineHeight: 26, fontWeight: '900' },
  lessonHeadingMeta: { color: '#708596', fontSize: 10, lineHeight: 15 },

  lessonList: { overflow: 'hidden', borderRadius: 20, borderWidth: 1, borderColor: '#20384B', backgroundColor: '#091724' },
  lessonRow: { minHeight: wide ? 72 : 68, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: wide ? 17 : 13, paddingVertical: 10 },
  lessonRowBorder: { borderTopWidth: 1, borderTopColor: '#172C3D' },
  lessonRowComplete: { backgroundColor: '#0A1D23' },
  lessonRowNext: { backgroundColor: '#0C252C' },
  lessonRowPressed: { opacity: 0.72 },
  lessonNumber: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#294A5E', backgroundColor: '#102333' },
  lessonNumberComplete: { borderColor: '#31766F', backgroundColor: '#113632' },
  lessonNumberNext: { borderColor: '#3F8E83', backgroundColor: '#123C3A' },
  lessonNumberText: { color: '#61E2D1', fontSize: 10, fontWeight: '900' },
  lessonCopy: { flex: 1, gap: 3 },
  lessonTitle: { color: '#F3F7F9', fontSize: wide ? 14 : 13, lineHeight: 19, fontWeight: '800' },
  lessonMeta: { color: '#758A9B', fontSize: 9, lineHeight: 13 },
  lessonMetaResume: { color: '#62DCCA', fontWeight: '800' },
  nextTag: { color: '#5DDBCB', fontSize: 8, fontWeight: '900', letterSpacing: 0.6 },
  openText: { color: '#45CDBD', fontSize: 21, lineHeight: 22 },

  completionCard: { flexDirection: wide ? 'row' : 'column', alignItems: wide ? 'center' : 'stretch', justifyContent: 'space-between', gap: 16, padding: 18, borderRadius: 20, borderWidth: 1, borderColor: '#34756E', backgroundColor: '#0A272B' },
  completionCopy: { flex: 1, gap: 5 },
  completionEyebrow: { color: '#5EEAD4', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  completionTitle: { color: '#F8FAFC', fontSize: 17, lineHeight: 22, fontWeight: '900' },
  completionBody: { color: '#9DB8BC', fontSize: 11, lineHeight: 17 },
  nextButton: { minHeight: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: 15, borderRadius: 14, backgroundColor: '#45D7C5' },
  nextButtonText: { color: '#05211F', fontSize: 11, fontWeight: '900' },
  nextButtonArrow: { color: '#05211F', fontSize: 22, lineHeight: 22 },

  outcome: { gap: 4, paddingHorizontal: 3 },
  outcomeEyebrow: { color: '#4ACAB9', fontSize: 8, fontWeight: '900', letterSpacing: 0.75 },
  outcomeText: { maxWidth: 760, color: '#7F96A5', fontSize: 10, lineHeight: 16 },
});
