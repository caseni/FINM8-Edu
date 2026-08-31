import React, { useMemo } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
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
    return language === 'tr' ? 'Önce grafikte ne gördüğünü anla.' : 'Understand what you are seeing on the chart first.';
  }
  if (sectionId === 'risk') {
    return language === 'tr' ? 'Önce neyi korumaya çalıştığını anla.' : 'Understand what you are trying to protect first.';
  }
  return language === 'tr' ? 'Önce günlük hayatta ne olduğunu anla.' : 'Understand what it means in everyday life first.';
}

function sectionOutcome(sectionId: keyof typeof BEGINNER_SECTIONS, language: LearningLanguage): string {
  if (sectionId === 'money_economy') {
    return language === 'tr'
      ? 'Bu bölümün sonunda satın alma gücü, faiz ve ekonomik yavaşlama gibi temel fikirleri günlük örneklerle ayırt edebilmen yeterli.'
      : 'By the end, it is enough to recognize ideas such as purchasing power, interest, and economic slowdowns through everyday examples.';
  }
  if (sectionId === 'markets') {
    return language === 'tr'
      ? 'Bu bölümün sonunda fiyatın nasıl oluştuğunu, ne aldığını, alış-satış farkını ve işlem fiyatının neden değişebildiğini ayırt edebilmen yeterli.'
      : 'By the end, it is enough to recognize how price forms, what you are buying, the buy-sell gap, and why execution price can differ.';
  }
  if (sectionId === 'charts') {
    return language === 'tr'
      ? 'Bu bölümün sonunda grafiğin geçmiş fiyat kaydı olduğunu; zaman ölçeği, genel yön, tepki bölgesi ve yardımcı çizgilerin ne anlattığını temel düzeyde okuyabilmen yeterli.'
      : 'By the end, it is enough to read a chart as a record of past prices and recognize time scale, broader direction, reaction areas, and helper lines at a basic level.';
  }
  return language === 'tr'
    ? 'Bu bölümün sonunda riski kayıptan önce düşünmeyi ve daha kontrollü karar vermenin temelini ayırt edebilmen yeterli.'
    : 'By the end, it is enough to recognize the basics of thinking about risk before loss and making more controlled decisions.';
}

export function BeginnerSectionScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<ScreenRoute>();
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
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <View style={styles.headingCopy}>
            <Text style={styles.brand}>FINM8 EDU</Text>
            <Text style={styles.title}>{sectionTitle}</Text>
          </View>
        </View>

        <View style={styles.hero} accessibilityRole="summary" accessibilityLabel={sectionProgressAccessibilityLabel}>
          <Text style={styles.heroEyebrow}>{language === 'tr' ? 'BAŞLANGIÇ · 6 KISA DERS' : 'BEGINNER · 6 SHORT LESSONS'}</Text>
          <Text style={styles.heroTitle}>{sectionComplete
            ? language === 'tr' ? 'Bu bölümü tamamladın.' : 'You completed this section.'
            : sectionHero(section.id, language)}
          </Text>
          <Text style={styles.heroBody}>{selectLocalizedText(section.description, language)}</Text>
          <View style={styles.progressMeta}>
            <Text style={styles.progressText}>{completedCount}/{lessons.length} {language === 'tr' ? 'ders tamamlandı' : 'lessons completed'}</Text>
            <Text style={styles.progressText}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress * 100}%` }]} /></View>
        </View>

        {!sectionComplete ? (
          <View style={styles.ruleCard}>
            <Text style={styles.ruleTitle}>{language === 'tr' ? 'Bu bölümde kural basit:' : 'The rule in this section is simple:'}</Text>
            <Text style={styles.ruleBody}>
              {language === 'tr'
                ? 'Önce anlamı gör. Terimin adını sonra öğren. Her ders tek ana fikre odaklanır.'
                : 'See the meaning first. Learn the term second. Each lesson focuses on one main idea.'}
            </Text>
          </View>
        ) : null}

        <View style={styles.lessonList}>
          {lessons.map((lesson, index) => {
            const completed = completedLessonIds.includes(lesson.id);
            const checkpoint = lessonCheckpoints[lesson.id];
            const resume = checkpoint && !completed;
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
                style={({ pressed }) => [styles.lessonCard, completed && styles.lessonCardComplete, pressed && styles.lessonCardPressed]}
              >
                <View style={[styles.lessonNumber, completed && styles.lessonNumberComplete]}>
                  <Text style={styles.lessonNumberText}>{completed ? '✓' : index + 1}</Text>
                </View>
                <View style={styles.lessonCopy}>
                  <Text style={styles.lessonTitle}>{lessonTitle}</Text>
                  <Text style={styles.lessonMeta}>{lessonState}</Text>
                </View>
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
            <Text style={styles.completionEyebrow}>{language === 'tr' ? 'BÖLÜM TAMAMLANDI' : 'SECTION COMPLETE'}</Text>
            <Text style={styles.completionTitle}>
              {nextSection
                ? language === 'tr' ? 'Hazırsan sıradaki adıma geç.' : 'Move to the next step when you are ready.'
                : language === 'tr' ? 'Temel yolun burada tamamlandı.' : 'Your foundation path is complete.'}
            </Text>
            <Text style={styles.completionBody}>
              {nextSection
                ? language === 'tr'
                  ? `Sıradaki bölüm: ${nextSection.title.tr}. Burada da aynı sade öğrenme dili devam edecek.`
                  : `Next section: ${nextSection.title.en}. The same simple learning language continues there.`
                : language === 'tr'
                  ? 'Şimdi yalnız ilgini çeken ileri alanda derinleşebilirsin. Hepsini yapmak zorunda değilsin.'
                  : 'Now go deeper only in an advanced subject that interests you. You do not need to do everything.'}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={nextSection
                ? language === 'tr' ? `Sıradaki bölüme geç: ${nextSection.title.tr}` : `Continue to next section: ${nextSection.title.en}`
                : language === 'tr' ? 'İleri öğrenme yollarını gör' : 'See deeper learning paths'}
              onPress={continueAfterSection}
              style={({ pressed }) => [styles.nextButton, pressed && styles.nextButtonPressed]}
            >
              <Text style={styles.nextButtonText}>
                {nextSection
                  ? language === 'tr' ? 'Sıradaki bölüme geç' : 'Continue to next section'
                  : language === 'tr' ? 'İleri yolları gör' : 'See deeper paths'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.footerNote}>
            <Text style={styles.footerTitle}>{language === 'tr' ? 'Ezber yok.' : 'No memorization.'}</Text>
            <Text style={styles.footerBody}>{sectionOutcome(section.id, language)}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#06111F' },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 20, gap: 16, paddingBottom: 42 },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#0D1E2E', borderWidth: 1, borderColor: '#274055' },
  backText: { color: '#F8FAFC', fontSize: 30, lineHeight: 32 },
  headingCopy: { flex: 1 },
  brand: { color: '#39D8C6', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#F8FAFC', fontSize: 27, lineHeight: 33, fontWeight: '900' },
  hero: { gap: 9, padding: 20, borderRadius: 22, backgroundColor: '#0A2630', borderWidth: 1, borderColor: '#22606A' },
  heroEyebrow: { color: '#5EEAD4', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  heroTitle: { color: '#F8FAFC', fontSize: 23, lineHeight: 30, fontWeight: '900' },
  heroBody: { color: '#B7C9D7', fontSize: 14, lineHeight: 21 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  progressText: { color: '#8FC8C3', fontSize: 11, fontWeight: '800' },
  progressTrack: { height: 6, overflow: 'hidden', borderRadius: 999, backgroundColor: '#163249' },
  progressFill: { height: 6, borderRadius: 999, backgroundColor: '#31D1BF' },
  ruleCard: { gap: 5, padding: 15, borderRadius: 16, backgroundColor: '#0B1A28', borderWidth: 1, borderColor: '#1D354A' },
  ruleTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '900' },
  ruleBody: { color: '#9FB0C3', fontSize: 12, lineHeight: 18 },
  lessonList: { gap: 10 },
  lessonCard: { minHeight: 78, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, backgroundColor: '#0B1B2B', borderWidth: 1, borderColor: '#29445B' },
  lessonCardComplete: { borderColor: '#2B5C58', backgroundColor: '#0A2026' },
  lessonCardPressed: { backgroundColor: '#102437' },
  lessonNumber: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2D6170', backgroundColor: '#113644' },
  lessonNumberComplete: { borderColor: '#31D1BF', backgroundColor: '#113D3A' },
  lessonNumberText: { color: '#5EEAD4', fontSize: 12, fontWeight: '900' },
  lessonCopy: { flex: 1, gap: 4 },
  lessonTitle: { color: '#F8FAFC', fontSize: 16, lineHeight: 21, fontWeight: '800' },
  lessonMeta: { color: '#8297AA', fontSize: 11, lineHeight: 15 },
  openText: { color: '#31D1BF', fontSize: 24 },
  completionCard: { gap: 8, padding: 18, borderRadius: 18, borderWidth: 1, borderColor: '#34796F', backgroundColor: '#0A292B' },
  completionEyebrow: { color: '#5EEAD4', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  completionTitle: { color: '#F8FAFC', fontSize: 18, lineHeight: 24, fontWeight: '900' },
  completionBody: { color: '#ABC3C8', fontSize: 12, lineHeight: 18 },
  nextButton: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center', paddingHorizontal: 16, borderRadius: 13, backgroundColor: '#31D1BF' },
  nextButtonPressed: { opacity: 0.78 },
  nextButtonText: { color: '#05211F', fontSize: 12, fontWeight: '900' },
  footerNote: { gap: 5, padding: 17, borderRadius: 17, borderWidth: 1, borderColor: '#1E4550', backgroundColor: '#0A2228' },
  footerTitle: { color: '#5EEAD4', fontSize: 14, fontWeight: '900' },
  footerBody: { color: '#9DB2BF', fontSize: 12, lineHeight: 18 },
});
