import React, { useMemo } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ACADEMY_TRACK_IDS, ACADEMY_TRACKS } from '../../domain/learning/academyTracks';
import { MICRO_LESSON_CATALOG } from '../../domain/learning/catalog';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import type { MicroLesson } from '../../domain/learning/types';
import { useLanguageStore } from '../../store/useLanguageStore';
import type { RootStackParamList } from '../../types/navigation';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'PublicLearnIndex'>;

interface PublicSection {
  readonly id: string;
  readonly order: number;
  readonly title: string;
  readonly description: string;
  readonly lessons: readonly MicroLesson[];
}

export function PublicLearnIndexScreen() {
  const navigation = useNavigation<Navigation>();
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';

  const sections = useMemo<readonly PublicSection[]>(() => {
    const lessonsById = new Map(MICRO_LESSON_CATALOG.map((lesson) => [lesson.id, lesson] as const));
    const academyLessonIds = new Set(
      ACADEMY_TRACK_IDS.flatMap((trackId) => [...ACADEMY_TRACKS[trackId].lessonIds])
    );
    const coreLessons = MICRO_LESSON_CATALOG.filter((lesson) => !academyLessonIds.has(lesson.id));

    return [
      {
        id: 'core',
        order: 0,
        title: 'FINM8 Core',
        description: language === 'tr'
          ? 'Fiyat, grafik, risk ve karar kalitesini oluşturan temel öğrenme yolu.'
          : 'The foundation path for price, charts, risk, and decision quality.',
        lessons: coreLessons,
      },
      ...ACADEMY_TRACK_IDS.map((trackId) => {
        const track = ACADEMY_TRACKS[trackId];
        return {
          id: track.id,
          order: track.order,
          title: selectLocalizedText(track.title, language),
          description: selectLocalizedText(track.description, language),
          lessons: track.lessonIds
            .map((lessonId) => lessonsById.get(lessonId))
            .filter((lesson): lesson is MicroLesson => Boolean(lesson)),
        };
      }),
    ];
  }, [language]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={language === 'tr' ? 'M8 Learn ana ekranına dön' : 'Return to M8 Learn home'}
            onPress={() => navigation.navigate('Home')}
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <View style={styles.headingCopy}>
            <Text style={styles.brand}>FINM8</Text>
            <Text style={styles.heading}>Learn</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>{language === 'tr' ? 'ÜCRETSİZ · GÖRSEL · KISA' : 'FREE · VISUAL · SHORT'}</Text>
          <Text style={styles.heroTitle}>
            {language === 'tr'
              ? 'Finansı aradığın sorudan başlayarak öğren.'
              : 'Learn finance starting from the question you searched for.'}
          </Text>
          <Text style={styles.heroBody}>
            {language === 'tr'
              ? '144 mikro ders; ekonomi, piyasalar, grafikler, temel analiz, risk, psikoloji, strateji, quant ve varlık sınıfları. Her konu sade anlatım, görsel ve kısa kontrol sorusuyla başlar.'
              : '144 micro-lessons across economics, markets, charts, fundamentals, risk, psychology, strategy, quant, and asset classes. Each topic starts with a simple explanation, a visual, and a quick check.'}
          </Text>
          <View style={styles.heroStats}>
            <View style={styles.stat}><Text style={styles.statValue}>144</Text><Text style={styles.statLabel}>{language === 'tr' ? 'mikro ders' : 'micro-lessons'}</Text></View>
            <View style={styles.stat}><Text style={styles.statValue}>3–6</Text><Text style={styles.statLabel}>{language === 'tr' ? 'dakika' : 'minutes'}</Text></View>
            <View style={styles.stat}><Text style={styles.statValue}>11</Text><Text style={styles.statLabel}>{language === 'tr' ? 'öğrenme alanı' : 'learning areas'}</Text></View>
          </View>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>{language === 'tr' ? 'Sinyal değil, karar kalitesi.' : 'Decision quality, not signals.'}</Text>
          <Text style={styles.noteBody}>
            {language === 'tr'
              ? 'Public Learn yatırım tavsiyesi vermez. Amaç kavramı anlamak, sınırını görmek ve sonra interaktif derste pratik etmektir.'
              : 'Public Learn does not provide investment advice. The goal is to understand the concept, see its limits, and then practice it in the interactive lesson.'}
          </Text>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>{language === 'tr' ? 'Bir konu seç' : 'Choose a subject'}</Text>
          <Text style={styles.sectionBody}>
            {language === 'tr'
              ? 'Her alandan birkaç başlangıç dersi burada. Tüm içerik aynı FINM8 EDU kataloğundan gelir.'
              : 'A few starting lessons from each area are shown here. All content comes from the same FINM8 EDU catalog.'}
          </Text>
        </View>

        {sections.map((section) => (
          <View key={section.id} style={styles.trackCard}>
            <View style={styles.trackHeader}>
              <View style={styles.trackNumber}>
                <Text style={styles.trackNumberText}>{String(section.order).padStart(2, '0')}</Text>
              </View>
              <View style={styles.trackCopy}>
                <Text style={styles.trackTitle}>{section.title}</Text>
                <Text style={styles.trackDescription}>{section.description}</Text>
                <Text style={styles.trackCount}>{section.lessons.length} {language === 'tr' ? 'ders' : 'lessons'}</Text>
              </View>
            </View>
            <View style={styles.lessonList}>
              {section.lessons.slice(0, 4).map((lesson, index) => (
                <Pressable
                  key={lesson.id}
                  accessibilityRole="link"
                  accessibilityLabel={selectLocalizedText(lesson.title, language)}
                  onPress={() => navigation.navigate('PublicLearn', { slug: lesson.slug })}
                  style={({ pressed }) => [styles.lessonRow, pressed && styles.lessonRowPressed]}
                >
                  <View style={styles.lessonMarker}><Text style={styles.lessonMarkerText}>{index + 1}</Text></View>
                  <View style={styles.lessonCopy}>
                    <Text style={styles.lessonTitle}>{selectLocalizedText(lesson.title, language)}</Text>
                    <Text style={styles.lessonMeta}>{lesson.estimatedMinutes} {language === 'tr' ? 'dk · ücretsiz özet + mini test' : 'min · free summary + mini check'}</Text>
                  </View>
                  <Text style={styles.openText}>›</Text>
                </Pressable>
              ))}
              {section.lessons.length > 4 ? (
                <Text style={styles.moreText}>
                  +{section.lessons.length - 4} {language === 'tr' ? 'ders daha Public Learn exportunda ve Academy’de mevcut' : 'more lessons available in the Public Learn export and Academy'}
                </Text>
              ) : null}
            </View>
          </View>
        ))}

        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>{language === 'tr' ? 'Konu konu gezmek yerine bir öğrenme yolu ister misin?' : 'Prefer a guided path instead of browsing topics?'}</Text>
          <Text style={styles.noteBody}>
            {language === 'tr'
              ? 'Core günlük temel yolun; Academy ise istediğin alanda derinleşme katmanın.'
              : 'Core is your daily foundation path; Academy is your subject-based deep-dive layer.'}
          </Text>
          <View style={styles.ctaActions}>
            <Pressable onPress={() => navigation.navigate('Home')} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Core</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Academy')} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Academy</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F' },
  content: { width: '100%', maxWidth: 920, alignSelf: 'center', padding: 20, gap: 18, paddingBottom: 48 },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057' },
  backText: { color: '#F8FAFC', fontSize: 30, lineHeight: 32 },
  headingCopy: { flex: 1 },
  brand: { color: '#2DD4BF', fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  heading: { color: '#F8FAFC', fontSize: 30, lineHeight: 36, fontWeight: '900' },
  hero: { gap: 11, padding: 22, borderRadius: 24, backgroundColor: '#0D2630', borderWidth: 1, borderColor: '#1F5961' },
  heroEyebrow: { color: '#5EEAD4', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  heroTitle: { color: '#F8FAFC', fontSize: 28, lineHeight: 36, fontWeight: '900' },
  heroBody: { color: '#B8D6D5', fontSize: 15, lineHeight: 23 },
  heroStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  stat: { minWidth: 116, flex: 1, gap: 2, padding: 12, borderRadius: 14, backgroundColor: '#0A1E28', borderWidth: 1, borderColor: '#1D4850' },
  statValue: { color: '#5EEAD4', fontSize: 20, fontWeight: '900' },
  statLabel: { color: '#8FA4B8', fontSize: 10, fontWeight: '700' },
  noteCard: { gap: 5, padding: 16, borderRadius: 17, backgroundColor: '#101D2C', borderWidth: 1, borderColor: '#1F3449' },
  noteTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: '900' },
  noteBody: { color: '#9FB0C3', fontSize: 13, lineHeight: 20 },
  sectionHeading: { gap: 5 },
  sectionTitle: { color: '#F8FAFC', fontSize: 21, fontWeight: '900' },
  sectionBody: { color: '#8FA4B8', fontSize: 13, lineHeight: 19 },
  trackCard: { overflow: 'hidden', borderRadius: 20, borderWidth: 1, borderColor: '#294057', backgroundColor: '#0C1928' },
  trackHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16 },
  trackNumber: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 14, borderWidth: 1, borderColor: '#2F766F', backgroundColor: '#123B42' },
  trackNumberText: { color: '#5EEAD4', fontSize: 11, fontWeight: '900' },
  trackCopy: { flex: 1, gap: 6 },
  trackTitle: { color: '#F8FAFC', fontSize: 18, lineHeight: 24, fontWeight: '900' },
  trackDescription: { color: '#9FB0C3', fontSize: 12, lineHeight: 18 },
  trackCount: { color: '#5EEAD4', fontSize: 10, fontWeight: '800' },
  lessonList: { paddingHorizontal: 16, paddingBottom: 14 },
  lessonRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#172F46' },
  lessonRowPressed: { opacity: 0.72 },
  lessonMarker: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057' },
  lessonMarkerText: { color: '#5EEAD4', fontSize: 10, fontWeight: '900' },
  lessonCopy: { flex: 1, gap: 3 },
  lessonTitle: { color: '#F8FAFC', fontSize: 14, lineHeight: 19, fontWeight: '800' },
  lessonMeta: { color: '#8094A8', fontSize: 10, lineHeight: 14 },
  openText: { color: '#2DD4BF', fontSize: 22 },
  moreText: { color: '#72879A', fontSize: 10, lineHeight: 15, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#172F46' },
  ctaCard: { gap: 8, padding: 20, borderRadius: 20, backgroundColor: '#102B30', borderWidth: 1, borderColor: '#28655F' },
  ctaTitle: { color: '#F8FAFC', fontSize: 19, lineHeight: 26, fontWeight: '900' },
  ctaActions: { flexDirection: 'row', gap: 10, marginTop: 3 },
  primaryButton: { flex: 1, minHeight: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#2DD4BF' },
  primaryButtonText: { color: '#042F2E', fontSize: 14, fontWeight: '900' },
  secondaryButton: { flex: 1, minHeight: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057' },
  secondaryButtonText: { color: '#F8FAFC', fontSize: 14, fontWeight: '900' },
});
