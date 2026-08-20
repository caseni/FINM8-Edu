import React, { useMemo, useRef, useState } from 'react';
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
  const scrollViewRef = useRef<ScrollView>(null);
  const trackOffsetsRef = useRef<Partial<Record<AcademyTrackId, number>>>({});

  const lessonsById = useMemo(
    () => new Map(MICRO_LESSON_CATALOG.map((lesson) => [lesson.id, lesson] as const)),
    []
  );
  const beginnerLessonIds = BEGINNER_SECTION_IDS.flatMap((sectionId) => BEGINNER_SECTIONS[sectionId].lessonIds);
  const beginnerComplete = beginnerLessonIds.length > 0 && beginnerLessonIds.every((lessonId) => completedLessonIds.includes(lessonId));
  const activeAcademyTrackIds = ACADEMY_TRACK_IDS.filter((trackId) => ACADEMY_TRACKS[trackId].status === 'active');
  const academyLessonIds = activeAcademyTrackIds.flatMap((trackId) => [...ACADEMY_TRACKS[trackId].lessonIds]);
  const academyCompletedLessonCount = academyLessonIds.filter((lessonId) => completedLessonIds.includes(lessonId)).length;
  const academyCompletedTrackCount = activeAcademyTrackIds.filter((trackId) =>
    ACADEMY_TRACKS[trackId].lessonIds.length > 0
    && ACADEMY_TRACKS[trackId].lessonIds.every((lessonId) => completedLessonIds.includes(lessonId))
  ).length;
  const academyComplete = academyLessonIds.length > 0 && academyCompletedLessonCount === academyLessonIds.length;
  const academyResumeCheckpoint = Object.values(lessonCheckpoints)
    .filter((checkpoint) => (
      academyLessonIds.includes(checkpoint.lessonId)
      && !completedLessonIds.includes(checkpoint.lessonId)
    ))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0];
  const academyResumeLesson = academyResumeCheckpoint
    ? lessonsById.get(academyResumeCheckpoint.lessonId)
    : undefined;
  const academyResumeTrack = academyResumeLesson
    ? activeAcademyTrackIds
      .map((trackId) => ACADEMY_TRACKS[trackId])
      .find((track) => track.lessonIds.includes(academyResumeLesson.id))
    : undefined;
  const academyResumeActionLabel = academyResumeCheckpoint?.stage === 'task'
    ? language === 'tr' ? 'Göreve devam et' : 'Resume task'
    : academyResumeCheckpoint?.stage === 'quiz'
      ? language === 'tr' ? 'Quiz’e devam et' : 'Resume quiz'
      : language === 'tr' ? 'Derse devam et' : 'Resume lesson';

  const openStarterTrack = (trackId: AcademyTrackId) => {
    setExpandedTrackId(trackId);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const targetOffset = trackOffsetsRef.current[trackId];
        if (targetOffset !== undefined) {
          scrollViewRef.current?.scrollTo({ y: Math.max(0, targetOffset - 12), animated: true });
        }
      });
    });
  };

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
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.content}>
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
            {academyComplete
              ? language === 'tr' ? 'ACADEMY TAMAM' : 'ACADEMY COMPLETE'
              : beginnerComplete
                ? language === 'tr' ? 'TEMEL TAMAM' : 'FOUNDATION COMPLETE'
                : language === 'tr' ? 'CORE’UN ÜZERİNE İNŞA ET' : 'BUILD BEYOND CORE'}
          </Text>
          <Text style={styles.heroTitle}>
            {academyComplete
              ? language === 'tr' ? 'İleri öğrenme yolunu tamamladın.' : 'You completed the advanced learning path.'
              : beginnerComplete
                ? language === 'tr' ? 'Şimdi yalnız ilgini seç.' : 'Now choose only what interests you.'
                : language === 'tr' ? 'Finansı konu konu derinleştir.' : 'Go deeper, one subject at a time.'}
          </Text>
          <Text style={styles.heroBody}>
            {academyComplete
              ? language === 'tr'
                ? 'Academy’deki on okulun tüm derslerini tamamladın. İstersen tamamlanan okulları yeniden açıp belirli konulara dönebilir veya tekrarlarını sürdürebilirsin.'
                : 'You completed every lesson across all ten Academy schools. You can reopen completed schools to revisit specific topics or keep using your reviews.'
              : beginnerComplete
                ? language === 'tr'
                  ? 'Dört temel alanı tamamladın. Burada her şeyi yapmak zorunda değilsin; merak ettiğin tek bir alandan devam etmen yeterli.'
                  : 'You completed the four foundation areas. You do not need to do everything here; continuing with one subject that interests you is enough.'
                : language === 'tr'
                  ? 'Core günlük öğrenme yolun olarak kalır. Academy’de ekonomi, finansal piyasalar, teknik ve temel analiz, psikoloji ve sistematik yaklaşımları istediğin sırayla derinleştirebilirsin.'
                  : 'Core remains your daily learning path. Academy lets you go deeper into economics, financial markets, technical and fundamental analysis, psychology, and systematic approaches.'}
          </Text>
          {academyComplete ? (
            <Text style={styles.heroCompletionMeta}>
              {academyCompletedLessonCount}/{academyLessonIds.length} {language === 'tr' ? 'ders' : 'lessons'} · {academyCompletedTrackCount}/{activeAcademyTrackIds.length} {language === 'tr' ? 'okul' : 'schools'}
            </Text>
          ) : null}
        </View>

        {academyResumeLesson && academyResumeTrack && academyResumeCheckpoint ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${academyResumeActionLabel}: ${selectLocalizedText(academyResumeLesson.title, language)} · ${selectLocalizedText(academyResumeTrack.title, language)}`}
            onPress={() => openLesson(academyResumeLesson.id)}
            style={({ pressed }) => [styles.academyResumeCard, pressed && styles.academyResumeCardPressed]}
          >
            <View style={styles.academyResumeCopy}>
              <Text style={styles.academyResumeEyebrow}>
                {language === 'tr' ? 'KALDIĞIN YER' : 'CONTINUE HERE'}
              </Text>
              <Text style={styles.academyResumeTrack}>
                {selectLocalizedText(academyResumeTrack.title, language)}
              </Text>
              <Text style={styles.academyResumeTitle}>
                {selectLocalizedText(academyResumeLesson.title, language)}
              </Text>
              <Text style={styles.academyResumeAction}>{academyResumeActionLabel}</Text>
            </View>
            <Text style={styles.academyResumeArrow}>›</Text>
          </Pressable>
        ) : null}

        {beginnerComplete && !academyComplete ? (
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
                    accessibilityLabel={`${STARTER_TRACK_LABELS[trackId][language]}: ${selectLocalizedText(track.title, language)}`}
                    accessibilityHint={language === 'tr' ? 'İlgili Academy okulunu açar ve ekrana getirir' : 'Opens the matching Academy school and brings it into view'}
                    onPress={() => openStarterTrack(trackId)}
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
          <Text style={styles.sectionTitle}>
            {academyComplete
              ? language === 'tr' ? 'Tamamladığın okullar' : 'Completed schools'
              : language === 'tr'
                ? beginnerComplete ? 'Tüm ileri alanlar' : 'İlgini seç'
                : beginnerComplete ? 'All deeper subjects' : 'Choose your subject'}
          </Text>
          <Text style={styles.sectionBody}>
            {academyComplete
              ? language === 'tr'
                ? 'On okulun tamamı bitti. İstediğin okulu yeniden açıp belirli bir derse veya konuya dönebilirsin.'
                : 'All ten schools are complete. Reopen any school whenever you want to revisit a lesson or topic.'
              : language === 'tr'
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
          const trackComplete = active && lessons.length > 0 && completedCount === lessons.length;
          const progress = lessons.length > 0 ? completedCount / lessons.length : 0;
          const expanded = active && expandedTrackId === track.id;
          const trackTitle = selectLocalizedText(track.title, language);
          const firstLayerLessons = lessons.slice(0, 6);
          const deeperLessons = lessons.slice(6);
          const resumeLesson = lessons.find((lesson) => (
            !completedLessonIds.includes(lesson.id) && Boolean(lessonCheckpoints[lesson.id])
          ));
          const nextLesson = resumeLesson ?? lessons.find((lesson) => !completedLessonIds.includes(lesson.id));
          const nextCheckpoint = nextLesson ? lessonCheckpoints[nextLesson.id] : undefined;
          const nextActionLabel = nextCheckpoint?.stage === 'task'
            ? language === 'tr' ? 'Göreve devam et' : 'Resume task'
            : nextCheckpoint?.stage === 'quiz'
              ? language === 'tr' ? 'Quiz’e devam et' : 'Resume quiz'
              : nextCheckpoint?.stage === 'lesson'
                ? language === 'tr' ? 'Derse devam et' : 'Resume lesson'
                : language === 'tr' ? 'Derse başla' : 'Start lesson';

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
            <View
              key={track.id}
              onLayout={(event) => {
                trackOffsetsRef.current[track.id] = event.nativeEvent.layout.y;
              }}
              style={[styles.trackCard, !active && styles.trackCardPlanned]}
            >
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
                        ? trackComplete
                          ? language === 'tr' ? 'TAMAMLANDI' : 'COMPLETE'
                          : language === 'tr' ? 'AKTİF' : 'ACTIVE'
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
                            : trackComplete
                              ? language === 'tr' ? 'Tamamlanan dersleri gör' : 'View completed lessons'
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
                  {nextLesson ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${nextActionLabel}: ${selectLocalizedText(nextLesson.title, language)}`}
                      onPress={() => openLesson(nextLesson.id)}
                      style={({ pressed }) => [styles.nextLessonCard, pressed && styles.nextLessonCardPressed]}
                    >
                      <View style={styles.nextLessonCopy}>
                        <Text style={styles.nextLessonEyebrow}>
                          {resumeLesson
                            ? language === 'tr' ? 'KALDIĞIN YER' : 'CONTINUE HERE'
                            : language === 'tr' ? 'SIRADAKİ DERS' : 'NEXT LESSON'}
                        </Text>
                        <Text style={styles.nextLessonTitle}>
                          {selectLocalizedText(nextLesson.title, language)}
                        </Text>
                        <Text style={styles.nextLessonMeta}>{nextActionLabel}</Text>
                      </View>
                      <Text style={styles.nextLessonArrow}>›</Text>
                    </Pressable>
                  ) : (
                    <View style={styles.trackCompleteCard}>
                      <Text style={styles.trackCompleteEyebrow}>
                        {language === 'tr' ? 'OKUL TAMAMLANDI' : 'SCHOOL COMPLETE'}
                      </Text>
                      <Text style={styles.trackCompleteText}>
                        {language === 'tr'
                          ? 'Bu alandaki tüm dersleri tamamladın. Academy doğrusal değil; istersen başka bir alana geçebilirsin.'
                          : 'You completed every lesson in this subject. Academy is not linear; explore another subject whenever you want.'}
                      </Text>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={language === 'tr' ? 'Diğer Academy alanlarına göz at' : 'Explore other Academy subjects'}
                        onPress={() => setExpandedTrackId(null)}
                        style={({ pressed }) => [styles.trackCompleteAction, pressed && styles.trackCompleteActionPressed]}
                      >
                        <Text style={styles.trackCompleteActionText}>
                          {language === 'tr' ? 'Diğer alanlara göz at' : 'Explore other subjects'}
                        </Text>
                        <Text style={styles.trackCompleteActionArrow}>›</Text>
                      </Pressable>
                    </View>
                  )}
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
  heroCompletionMeta: { color: '#5EEAD4', fontSize: 12, lineHeight: 18, fontWeight: '900' },
  academyResumeCard: { minHeight: 104, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 17, borderRadius: 20, borderWidth: 1, borderColor: '#2E706D', backgroundColor: '#0B252D' },
  academyResumeCardPressed: { backgroundColor: '#12343D' },
  academyResumeCopy: { flex: 1, gap: 3 },
  academyResumeEyebrow: { color: '#5EEAD4', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  academyResumeTrack: { color: '#91B9BA', fontSize: 11, lineHeight: 16, fontWeight: '800' },
  academyResumeTitle: { color: '#F8FAFC', fontSize: 16, lineHeight: 22, fontWeight: '900' },
  academyResumeAction: { color: '#5EEAD4', fontSize: 12, lineHeight: 17, fontWeight: '900' },
  academyResumeArrow: { color: '#5EEAD4', fontSize: 28, fontWeight: '600' },
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
  nextLessonCard: { minHeight: 86, flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14, marginBottom: 5, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#2E706D', backgroundColor: '#0D2B33' },
  nextLessonCardPressed: { backgroundColor: '#123840' },
  nextLessonCopy: { flex: 1, gap: 4 },
  nextLessonEyebrow: { color: '#5EEAD4', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  nextLessonTitle: { color: '#F8FAFC', fontSize: 15, lineHeight: 20, fontWeight: '900' },
  nextLessonMeta: { color: '#9BC7C6', fontSize: 11, fontWeight: '800' },
  nextLessonArrow: { color: '#5EEAD4', fontSize: 26, fontWeight: '600' },
  trackCompleteCard: { gap: 8, marginTop: 14, marginBottom: 5, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#2E706D', backgroundColor: '#0B252D' },
  trackCompleteEyebrow: { color: '#5EEAD4', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  trackCompleteText: { color: '#B8D6D5', fontSize: 13, lineHeight: 18, fontWeight: '700' },
  trackCompleteAction: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 2, paddingHorizontal: 13, borderRadius: 13, borderWidth: 1, borderColor: '#2E706D', backgroundColor: '#0D3037' },
  trackCompleteActionPressed: { backgroundColor: '#123B42' },
  trackCompleteActionText: { color: '#5EEAD4', fontSize: 12, fontWeight: '900' },
  trackCompleteActionArrow: { color: '#5EEAD4', fontSize: 21, fontWeight: '700' },
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
