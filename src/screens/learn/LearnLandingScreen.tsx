import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BEGINNER_SECTION_IDS, BEGINNER_SECTIONS } from '../../domain/learning/beginnerJourney';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import type { RootStackParamList } from '../../types/navigation';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function LearnLandingScreen() {
  const navigation = useNavigation<Navigation>();
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';
  const completedLessonIds = useLearningProgressStore((state) => state.completedLessonIds);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brandBlock}>
          <Text style={styles.brand}>FINM8 EDU</Text>
          <Text style={styles.title}>{language === 'tr' ? 'Öğrenmeye Başla' : 'Start Learning'}</Text>
          <Text style={styles.subtitle}>
            {language === 'tr'
              ? 'Hiç bilmesen de olur. Finansın temelini günlük hayattan başlayarak adım adım öğren.'
              : 'You do not need prior knowledge. Learn finance step by step, starting from everyday life.'}
          </Text>
        </View>

        <View style={styles.promiseCard}>
          <Text style={styles.promiseTitle}>{language === 'tr' ? 'Burada amaç terim ezberlemek değil.' : 'The goal here is not to memorize terms.'}</Text>
          <Text style={styles.promiseBody}>
            {language === 'tr'
              ? 'Önce ne olduğunu anlayacaksın. Adını ve ileri detayını daha sonra öğreneceksin.'
              : 'You will understand what something means first. The name and deeper detail come later.'}
          </Text>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>{language === 'tr' ? 'Dört adımda temel okuryazarlık' : 'Four steps to basic financial literacy'}</Text>
          <Text style={styles.sectionBody}>
            {language === 'tr'
              ? 'İlk iki bölüm hazır. Grafik ve risk bölümlerini de aynı sade standartla sırayla yeniliyoruz.'
              : 'The first two sections are ready. Charts and risk are being rebuilt to the same simple standard.'}
          </Text>
        </View>

        <View style={styles.sectionList}>
          {BEGINNER_SECTION_IDS.map((sectionId) => {
            const section = BEGINNER_SECTIONS[sectionId];
            const active = section.status === 'active';
            const completedCount = section.lessonIds.filter((lessonId) => completedLessonIds.includes(lessonId)).length;
            const progress = section.lessonIds.length ? completedCount / section.lessonIds.length : 0;

            return (
              <Pressable
                key={section.id}
                accessibilityRole={active ? 'button' : undefined}
                accessibilityState={active ? undefined : { disabled: true }}
                disabled={!active}
                onPress={() => navigation.navigate('BeginnerSection', { sectionId: section.id })}
                style={({ pressed }) => [
                  styles.sectionCard,
                  active && styles.sectionCardActive,
                  !active && styles.sectionCardNext,
                  pressed && active && styles.sectionCardPressed,
                ]}
              >
                <View style={[styles.sectionNumber, active && styles.sectionNumberActive]}>
                  <Text style={styles.sectionNumberText}>{String(section.order).padStart(2, '0')}</Text>
                </View>
                <View style={styles.sectionCopy}>
                  <View style={styles.sectionTitleRow}>
                    <Text style={styles.cardTitle}>{selectLocalizedText(section.title, language)}</Text>
                    <Text style={[styles.status, active ? styles.statusActive : styles.statusNext]}>
                      {active
                        ? language === 'tr' ? 'BAŞLA' : 'START'
                        : language === 'tr' ? 'SIRADA' : 'NEXT'}
                    </Text>
                  </View>
                  <Text style={styles.cardDescription}>{selectLocalizedText(section.description, language)}</Text>
                  {active ? (
                    <>
                      <View style={styles.progressMeta}>
                        <Text style={styles.progressText}>{completedCount}/{section.lessonIds.length} {language === 'tr' ? 'ders' : 'lessons'}</Text>
                        <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
                      </View>
                      <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress * 100}%` }]} /></View>
                    </>
                  ) : null}
                </View>
                <Text style={[styles.openText, !active && styles.openTextMuted]}>{active ? '›' : '—'}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.bottomCard}>
          <View style={styles.bottomCopy}>
            <Text style={styles.bottomTitle}>{language === 'tr' ? 'Zaten temelin varsa' : 'If you already know the basics'}</Text>
            <Text style={styles.bottomBody}>
              {language === 'tr'
                ? 'İleri konu kütüphanesi duruyor; fakat yeni başlayanların önüne artık koymuyoruz.'
                : 'The advanced topic library remains available, but it is no longer placed in front of beginners.'}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Academy')}
            style={({ pressed }) => [styles.advancedButton, pressed && styles.advancedButtonPressed]}
          >
            <Text style={styles.advancedButtonText}>{language === 'tr' ? 'İleri konular' : 'Advanced topics'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#06111F' },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 20, gap: 18, paddingBottom: 44 },
  brandBlock: { gap: 7, paddingTop: 8 },
  brand: { color: '#37D9C7', fontSize: 11, fontWeight: '900', letterSpacing: 2.4 },
  title: { color: '#F8FAFC', fontSize: 34, lineHeight: 40, fontWeight: '900' },
  subtitle: { maxWidth: 580, color: '#A7B8C8', fontSize: 16, lineHeight: 24 },
  promiseCard: { gap: 6, padding: 17, borderRadius: 18, backgroundColor: '#0A2630', borderWidth: 1, borderColor: '#225D65' },
  promiseTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: '900' },
  promiseBody: { color: '#A8C5C5', fontSize: 13, lineHeight: 19 },
  sectionHeading: { gap: 5, marginTop: 2 },
  sectionTitle: { color: '#F8FAFC', fontSize: 21, lineHeight: 27, fontWeight: '900' },
  sectionBody: { color: '#8094A8', fontSize: 13, lineHeight: 19 },
  sectionList: { gap: 12 },
  sectionCard: { minHeight: 134, flexDirection: 'row', alignItems: 'flex-start', gap: 13, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#243C52', backgroundColor: '#0A1928' },
  sectionCardActive: { borderColor: '#2E706D', backgroundColor: '#0B202B' },
  sectionCardNext: { opacity: 0.6 },
  sectionCardPressed: { backgroundColor: '#102B35' },
  sectionNumber: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 14, borderWidth: 1, borderColor: '#2A465C', backgroundColor: '#102133' },
  sectionNumberActive: { borderColor: '#2E8177', backgroundColor: '#103C3E' },
  sectionNumberText: { color: '#67E9D7', fontSize: 11, fontWeight: '900' },
  sectionCopy: { flex: 1, gap: 8 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { flex: 1, color: '#F8FAFC', fontSize: 18, lineHeight: 23, fontWeight: '900' },
  status: { fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  statusActive: { color: '#5EEAD4' },
  statusNext: { color: '#71869A' },
  cardDescription: { color: '#A3B4C4', fontSize: 13, lineHeight: 19 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 1 },
  progressText: { color: '#8FC8C3', fontSize: 10, fontWeight: '800' },
  progressTrack: { height: 5, overflow: 'hidden', borderRadius: 999, backgroundColor: '#173249' },
  progressFill: { height: 5, borderRadius: 999, backgroundColor: '#31D1BF' },
  openText: { alignSelf: 'center', color: '#31D1BF', fontSize: 26 },
  openTextMuted: { color: '#53697C' },
  bottomCard: { gap: 13, padding: 17, borderRadius: 18, backgroundColor: '#0A1725', borderWidth: 1, borderColor: '#1D3449' },
  bottomCopy: { gap: 5 },
  bottomTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '900' },
  bottomBody: { color: '#8FA2B4', fontSize: 12, lineHeight: 18 },
  advancedButton: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center', paddingHorizontal: 16, borderRadius: 13, borderWidth: 1, borderColor: '#2C5267', backgroundColor: '#102033' },
  advancedButtonPressed: { opacity: 0.72 },
  advancedButtonText: { color: '#C8D5E0', fontSize: 12, fontWeight: '800' },
});
