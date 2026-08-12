import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ACADEMY_TRACK_IDS, ACADEMY_TRACKS, type AcademyTrackId } from '../../domain/learning/academyTracks';
import { BEGINNER_SECTION_IDS, BEGINNER_SECTIONS } from '../../domain/learning/beginnerJourney';
import { MICRO_LESSON_CATALOG } from '../../domain/learning/catalog';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import type { RootStackParamList } from '../../types/navigation';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Academy'>;

const STARTER_TRACK_IDS: readonly AcademyTrackId[] = [
  'financial_markets',
  'technical_analysis',
  'fundamental_analysis',
  'risk_portfolio',
];

const STARTER_TRACK_LABELS: Readonly<Record<AcademyTrackId, { tr: string; en: string }>> = {
  economy: { tr: 'Ekonomiyi derinleştir', en: 'Go deeper into economics' },
  financial_markets: { tr: 'Piyasaları daha iyi anla', en: 'Understand markets better' },
  technical_analysis: { tr: 'Grafikleri derinleştir', en: 'Go deeper into charts' },
  fundamental_analysis: { tr: 'Şirketleri anlamaya başla', en: 'Start understanding companies' },
  risk_portfolio: { tr: 'Risk ve portföyü güçlendir', en: 'Strengthen risk and portfolio skills' },
  market_psychology: { tr: 'Davranışlarını daha iyi anla', en: 'Understand behavior better' },
  strategies: { tr: 'Yöntemleri karşılaştır', en: 'Compare methods' },
  algo_quant: { tr: 'Sistematik düşünmeyi öğren', en: 'Learn systematic thinking' },
  smc_ict: { tr: 'İleri teknik dili incele', en: 'Explore advanced technical language' },
  asset_schools: { tr: 'Varlık türlerinde derinleş', en: 'Go deeper by asset class' },
};

export function AcademyHomeScreen() {
  const navigation = useNavigation<Navigation>();
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';
  const completedLessonIds = useLearningProgressStore((state) => state.completedLessonIds);
  const lessonCheckpoints = useLearningProgressStore((state) => state.lessonCheckpoints);
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>(null);

  const lessonsById = useMemo(
    () => new Map(MICRO_LESSON_CATALOG.map((lesson) => [lesson.id, lesson] as const)),
    []
  );
  const beginnerLessonIds = BEGINNER_SECTION_IDS.flatMap((sectionId) => BEGINNER_SECTIONS[sectionId].lessonIds);
  const beginnerComplete = beginnerLessonIds.length > 0 && beginnerLessonIds.every((lessonId) => completedLessonIds.includes(lessonId));

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
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={language === 'tr' ? 'M8 Learn ana ekranına dön' : 'Return to M8 Learn home'}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <View style={styles.headingCopy}>
            <Text style={styles.brand}>FINM8</Text>
            <Text style={styles.title}>Academy</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>
            {beginnerComplete
              ? language === 'tr' ? 'TEMEL TAMAM' : 'FOUNDATION COMPLETE'
              : language === 'tr' ? 'CORE’UN ÜZERİNE İNŞA ET' : 'BUILD BEYOND CORE'}
          </Text>
          <Text style={styles.heroTitle}>
            {beginnerComplete
              ? language === 'tr' ? 'Şimdi yalnız ilgini seç.' : 'Now choose only what interests you.'
              : language === 'tr' ? 'Finansı konu konu derinleştir.' : 'Go deeper, one subject at a time.'}
          </Text>
          <Text style={styles.heroBody}>
            {beginnerComplete
              ? language === 'tr'
                ? 'Dört temel alanı tamamladın. Burada her şeyi yapmak zorunda değilsin; merak ettiğin tek bir alandan devam etmen yeterli.'
                : 'You completed the four foundation areas. You do not need to do everything here; continuing with one subject that interests you is enough.'
              : language === 'tr'
                ? 'Core günlük öğrenme yolun olarak kalır. Academy’de ekonomi, finansal piyasalar, teknik ve temel analiz, psikoloji ve sistematik yaklaşımları istediğin sırayla derinleştirebilirsin.'
                : 'Core remains your daily learning path. Academy lets you go deeper into economics, financial markets, technical and fundamental analysis, psychology, and systematic approaches.'}
          </Text>
        </View>

        {beginnerComplete ? (
          <View style={styles.starterGuide}>
            <Text style={styles.starterEyebrow}>{language === 'tr' ? 'NEREDEN DEVAM EDEBİLİRSİN?' : 'WHERE CAN YOU GO NEXT?'}</Text>
            <Text style={styles.starterTitle}>{language === 'tr' ? 'Dört sade seçenekten birini seç.' : 'Choose one of four simple directions.'}</Text>
            <Text style={styles.starterBody}>
              {language === 'tr'
                ? 'Bir seçim diğerlerini kapatmaz. Yalnız şu anda en çok merak ettiğin konuya gir.'
                : 'One choice does not lock the others. Start with the subject you are most curious about right now.'}
            </Text>
            <View style={styles.starterOptions}>
              {STARTER_TRACK_IDS.map((trackId) => {
                const track = ACADEMY_TRACKS[trackId];
                return (
                  <Pressable
                    key={trackId}
                    accessibilityRole="button"
                    onPress={() => setExpandedTrackId(trackId)}
                    style={({ pressed }) => [styles.starterOption, pressed && styles.starterOptionPressed]}
                  >
                    <View style={styles.starterOptionCopy}>
                      <Text style={styles.starterOptionTitle}>{STARTER_TRACK_LABELS[trackId][language]}</Text>
                      <Text style={styles.starterOptionMeta}>{selectLocalizedText(track.title, language)}</Text>
                    </View>
                    <Text style={styles.starterOptionArrow}>›</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>{language === 'tr' ? (beginnerComplete ? 'Tüm ileri alanlar' : 'İlgini seç') : (beginnerComplete ? 'All deeper subjects' : 'Choose your subject')}</Text>
          <Text style={styles.sectionBody}>
            {language === 'tr'
              ? beginnerComplete
                ? 'Yukarıdaki dört yoldan başlayabilir veya aşağıdaki diğer ileri alanlara göz atabilirsin.'
                : 'Bir okulu aç, derslerini incele. Hepsini aynı anda bitirmen gerekmez.'
              : beginnerComplete
                ? 'Start with one of the four directions above, or explore the other advanced subjects below.'
                : 'Open one school to explore its lessons. You do not need to complete everything at once.'}
          </Text>
        </View>

        {ACADEMY_TRACK_IDS.map((trackId) => {
          const track = ACADEMY_TRACKS[trackId];
          const lessons = track.lessonIds
            .map((lessonId) => lessonsById.get(lessonId))
            .filter((lesson) => lesson !== undefined);
          const completedCount = lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
          const active = track.status === 'active';
          const progress = lessons.length > 0 ? completedCount / lessons.length : 0;
          const expanded = active && expandedTrackId === track.id;
          const trackTitle = selectLocalizedText(track.title, language);
          const firstLayerLessons = lessons.slice(0, 6);
          const deeperLessons = lessons.slice(6);

          const renderLessonRows = (group: typeof lessons, offset: number) => group.map((lesson, groupIndex) => {
            const completed = completedLessonIds.includes(lesson.id);
            const checkpoint = lessonCheckpoints[lesson.id];
            const resumeLabel = checkpoint?.stage === 'task'
              ? language === 'tr' ? 'Devam · Görev' : 'Resume · Task'
              : checkpoint?.stage === 'quiz'
                ? language === 'tr' ? 'Devam · Quiz' : 'Resume · Quiz'
                : checkpoint?.stage === 'lesson'
                  ? language === 'tr' ? 'Devam · Ders' : 'Resume · Lesson'
                  : undefined;
            return (
              <Pressable
                key={lesson.id}
                accessibilityRole="button"
                accessibilityLabel={
                  resumeLabel
                    ? `${selectLocalizedText(lesson.title, language)} · ${resumeLabel}`
                    : selectLocalizedText(lesson.title, language)
                }
                onPress={() => openLesson(lesson.id)}
                style={({ pressed }) => [styles.lessonRow, pressed && styles.lessonRowPressed]}
              >
                <View style={[styles.lessonMarker, completed && styles.lessonMarkerComplete]}>
                  <Text style={styles.lessonMarkerText}>{completed ? '✓' : offset + groupIndex + 1}</Text>
                </View>
                <View style={styles.lessonCopy}>
                  <Text style={styles.lessonTitle}>{selectLocalizedText(lesson.title, language)}</Text>
                  <Text style={[styles.lessonMeta, resumeLabel && styles.lessonMetaResume]}>
                    {resumeLabel ?? `${lesson.estimatedMinutes} ${language === 'tr' ? 'dk' : 'min'}`}
                  </Text>
                </View>
                <Text style={styles.openText}>›</Text>
              </Pressable>
            );
          });

          return (
            <View key={track.id} style={[styles.trackCard, !active && styles.trackCardPlanned]}>
              <Pressable
                accessibilityRole={active ? 'button' : undefined}
                accessibilityLabel={
                  active
                    ? language === 'tr'
                      ? `${trackTitle} derslerini ${expanded ? 'kapat' : 'aç'}`
                      : `${expanded ? 'Collapse' : 'Open'} ${trackTitle} lessons`
                    : undefined
                }
                accessibilityState={active ? { expanded } : { disabled: true }}
                disabled={!active}
                onPress={() => setExpandedTrackId((current) => current === track.id ? null : track.id)}
                style={({ pressed }) => [
                  styles.trackHeader,
                  active && styles.trackHeaderInteractive,
                  pressed && active && styles.trackHeaderPressed,
                ]}
              >
                <View style={[styles.trackNumber, active && styles.trackNumberActive]}>
                  <Text style={styles.trackNumberText}>{String(track.order).padStart(2, '0')}</Text>
                </View>
                <View style={styles.trackCopy}>
                  <View style={styles.trackTitleRow}>
                    <Text style={styles.trackTitle}>{trackTitle}</Text>
                    <Text style={[styles.trackStatus, active ? styles.trackStatusActive : styles.trackStatusPlanned]}>
                      {active
                        ? language === 'tr' ? 'AKTİF' : 'ACTIVE'
                        : language === 'tr' ? 'YAKINDA' : 'PLANNED'}
                    </Text>
                  </View>
                  <Text style={styles.trackDescription}>{selectLocalizedText(track.description, language)}</Text>
                  {active ? (
                    <>
                      <View style={styles.progressMeta}>
                        <Text style={styles.progressText}>
                          {completedCount}/{lessons.length} {language === 'tr' ? 'ders' : 'lessons'}
                        </Text>
                        <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
                      </View>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                      </View>
                      <View style={styles.trackToggleRow}>
                        <Text style={styles.trackToggleText}>
                          {expanded
                            ? language === 'tr' ? 'Dersleri kapat' : 'Hide lessons'
                            : language === 'tr' ? 'Dersleri gör' : 'View lessons'}
                        </Text>
                        <Text style={styles.trackToggleIcon}>{expanded ? '⌃' : '⌄'}</Text>
                      </View>
                    </>
                  ) : null}
                </View>
              </Pressable>

              {expanded ? (
                <View style={styles.lessonList}>
                  <View style={styles.lessonGroupHeader}>
                    <Text style={styles.lessonGroupEyebrow}>{language === 'tr' ? 'ÖNCE BUNLARLA BAŞLA' : 'START HERE FIRST'}</Text>
                    <Text style={styles.lessonGroupDetail}>
                      {language === 'tr'
                        ? 'İlk 6 ders temel fikri sade biçimde kurar.'
                        : 'The first 6 lessons build the core idea in plain language.'}
                    </Text>
                  </View>
                  {renderLessonRows(firstLayerLessons, 0)}
                  {deeperLessons.length > 0 ? (
                    <>
                      <View style={[styles.lessonGroupHeader, styles.lessonGroupAdvanced]}>
                        <Text style={styles.lessonGroupEyebrowMuted}>{language === 'tr' ? 'SONRA DERİNLEŞ' : 'GO DEEPER LATER'}</Text>
                        <Text style={styles.lessonGroupDetail}>
                          {language === 'tr'
                            ? 'Hazır olduğunda daha teknik ayrıntılara geç. Bu bölüm zorunlu değil.'
                            : 'Move into more technical detail when you are ready. This layer is optional.'}
                        </Text>
                      </View>
                      {renderLessonRows(deeperLessons, firstLayerLessons.length)}
                    </>
                  ) : null}
                </View>
              ) : null}
            </View>
          );
        })}

        <View style={styles.footerNote}>
          <Text style={styles.footerTitle}>{language === 'tr' ? 'Tek motor, çok öğrenme yolu' : 'One engine, many learning paths'}</Text>
          <Text style={styles.footerBody}>
            {language === 'tr'
              ? 'Aynı quiz, tekrar, mastery ve görsel öğrenme altyapısı Academy derslerinde de kullanılır. Core ilerlemen ayrı kalır.'
              : 'Academy reuses the same quiz, review, mastery, and visual-learning engine while keeping Core progress separate.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F' },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center', padding: 20, gap: 18, paddingBottom: 36 },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057' },
  backText: { color: '#F8FAFC', fontSize: 30, lineHeight: 32, fontWeight: '500' },
  headingCopy: { flex: 1 },
  brand: { color: '#2DD4BF', fontSize: 11, letterSpacing: 2, fontWeight: '900' },
  title: { color: '#F8FAFC', fontSize: 30, lineHeight: 36, fontWeight: '900' },
  hero: { gap: 8, padding: 20, borderRadius: 22, backgroundColor: '#0D2630', borderWidth: 1, borderColor: '#1F5961' },
  heroEyebrow: { color: '#5EEAD4', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  heroTitle: { color: '#F8FAFC', fontSize: 23, lineHeight: 30, fontWeight: '900' },
  heroBody: { color: '#B8D6D5', fontSize: 14, lineHeight: 21 },
  starterGuide: { gap: 8, padding: 18, borderRadius: 20, borderWidth: 1, borderColor: '#2B5F63', backgroundColor: '#0A2028' },
  starterEyebrow: { color: '#5EEAD4', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  starterTitle: { color: '#F8FAFC', fontSize: 18, lineHeight: 24, fontWeight: '900' },
  starterBody: { color: '#9FB6C1', fontSize: 12, lineHeight: 18 },
  starterOptions: { gap: 8, marginTop: 2 },
  starterOption: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 13, paddingVertical: 10, borderRadius: 14, backgroundColor: '#0D2933', borderWidth: 1, borderColor: '#28515A' },
  starterOptionPressed: { backgroundColor: '#12343D' },
  starterOptionCopy: { flex: 1, gap: 2 },
  starterOptionTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '800' },
  starterOptionMeta: { color: '#83A5B1', fontSize: 10, fontWeight: '700' },
  starterOptionArrow: { color: '#5EEAD4', fontSize: 22 },
  sectionHeading: { gap: 5, marginTop: 2 },
  sectionTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '800' },
  sectionBody: { color: '#8FA4B8', fontSize: 13, lineHeight: 19 },
  trackCard: { overflow: 'hidden', borderRadius: 20, borderWidth: 1, borderColor: '#294057', backgroundColor: '#0C1928' },
  trackCardPlanned: { opacity: 0.72 },
  trackHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16 },
  trackHeaderInteractive: { minHeight: 142 },
  trackHeaderPressed: { backgroundColor: '#102033' },
  trackNumber: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 14, borderWidth: 1, borderColor: '#294057', backgroundColor: '#102033' },
  trackNumberActive: { borderColor: '#2F766F', backgroundColor: '#123B42' },
  trackNumberText: { color: '#5EEAD4', fontSize: 11, fontWeight: '900' },
  trackCopy: { flex: 1, gap: 7 },
  trackTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  trackTitle: { flex: 1, color: '#F8FAFC', fontSize: 17, lineHeight: 22, fontWeight: '900' },
  trackStatus: { fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
  trackStatusActive: { color: '#5EEAD4' },
  trackStatusPlanned: { color: '#8094A8' },
  trackDescription: { color: '#9FB0C3', fontSize: 13, lineHeight: 19 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 2 },
  progressText: { color: '#8FC4C5', fontSize: 11, fontWeight: '700' },
  progressTrack: { height: 5, overflow: 'hidden', borderRadius: 999, backgroundColor: '#172F46' },
  progressFill: { height: 5, borderRadius: 999, backgroundColor: '#2DD4BF' },
  trackToggleRow: { minHeight: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 1 },
  trackToggleText: { color: '#5EEAD4', fontSize: 12, fontWeight: '800' },
  trackToggleIcon: { color: '#5EEAD4', fontSize: 17, fontWeight: '800' },
  lessonList: { paddingHorizontal: 16, paddingBottom: 14 },
  lessonGroupHeader: { gap: 3, paddingTop: 13, paddingBottom: 8 },
  lessonGroupAdvanced: { marginTop: 8, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#21394D' },
  lessonGroupEyebrow: { color: '#5EEAD4', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  lessonGroupEyebrowMuted: { color: '#8FA4B8', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  lessonGroupDetail: { color: '#8197A9', fontSize: 11, lineHeight: 16 },
  lessonRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, borderTopWidth: 1, borderTopColor: '#172F46' },
  lessonRowPressed: { opacity: 0.74 },
  lessonMarker: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057' },
  lessonMarkerComplete: { backgroundColor: '#123B42', borderColor: '#2DD4BF' },
  lessonMarkerText: { color: '#5EEAD4', fontSize: 10, fontWeight: '900' },
  lessonCopy: { flex: 1, gap: 3 },
  lessonTitle: { color: '#F8FAFC', fontSize: 14, lineHeight: 19, fontWeight: '700' },
  lessonMeta: { color: '#8094A8', fontSize: 11 },
  lessonMetaResume: { color: '#5EEAD4', fontWeight: '800' },
  openText: { color: '#2DD4BF', fontSize: 22, fontWeight: '500' },
  footerNote: { gap: 5, padding: 16, borderRadius: 16, backgroundColor: '#101D2C', borderWidth: 1, borderColor: '#1F3449' },
  footerTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '900' },
  footerBody: { color: '#9FB0C3', fontSize: 12, lineHeight: 18 },
});
