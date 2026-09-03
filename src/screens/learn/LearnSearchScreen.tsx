import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LearnHubNav } from '../../components/learning/LearnHubNav';
import { ACADEMY_TRACK_IDS, ACADEMY_TRACKS } from '../../domain/learning/academyTracks';
import { BEGINNER_SECTION_IDS, BEGINNER_SECTIONS } from '../../domain/learning/beginnerJourney';
import { MICRO_LESSON_CATALOG } from '../../domain/learning/catalog';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import { useLanguageStore } from '../../store/useLanguageStore';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'LearnSearch'>;

const BEGINNER_LESSON_IDS = new Set(
  BEGINNER_SECTION_IDS.flatMap((sectionId) => [...BEGINNER_SECTIONS[sectionId].lessonIds])
);

const QUICK_TOPICS = {
  tr: ['Faiz', 'Likidite', 'Trend', 'Risk', 'ETF', 'Bilanço'],
  en: ['Interest', 'Liquidity', 'Trend', 'Risk', 'ETF', 'Balance sheet'],
} as const;

const SEARCH_STOP_WORDS = {
  tr: new Set(['nedir', 'ne', 'nasıl', 'neden', 'bir', 've', 'ile', 'mi', 'mı', 'mu', 'mü']),
  en: new Set(['what', 'is', 'are', 'how', 'why', 'the', 'a', 'an', 'and', 'of', 'to']),
} as const;

function normalize(value: string, language: LearningLanguage) {
  return value
    .toLocaleLowerCase(language === 'tr' ? 'tr-TR' : 'en-US')
    .replace(/[^a-z0-9çğıöşü\s-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function queryTokens(value: string, language: LearningLanguage) {
  const tokens = normalize(value, language)
    .split(' ')
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && !SEARCH_STOP_WORDS[language].has(token));
  return tokens.length > 0 ? tokens : [normalize(value, language)].filter(Boolean);
}

export function LearnSearchScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 820;
  const styles = createStyles(wide);
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';
  const [query, setQuery] = useState('');
  const normalizedQuery = normalize(query, language);

  const results = useMemo(() => {
    if (normalizedQuery.length < 2) return [];
    const tokens = queryTokens(normalizedQuery, language);
    return MICRO_LESSON_CATALOG
      .map((lesson) => {
        const title = selectLocalizedText(lesson.title, language);
        const objective = selectLocalizedText(lesson.learningObjective, language);
        const takeaway = selectLocalizedText(lesson.takeaway, language);
        const titleNorm = normalize(title, language);
        const bodyNorm = normalize(`${objective} ${takeaway}`, language);
        const titleTokenHits = tokens.filter((token) => titleNorm.includes(token)).length;
        const bodyTokenHits = tokens.filter((token) => bodyNorm.includes(token)).length;
        const score =
          (titleNorm.startsWith(normalizedQuery) ? 20 : 0)
          + (titleNorm.includes(normalizedQuery) ? 12 : 0)
          + (bodyNorm.includes(normalizedQuery) ? 6 : 0)
          + (titleTokenHits * 4)
          + (bodyTokenHits * 2);
        return { lesson, title, objective, score };
      })
      .filter((item) => item.score > 0)
      .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
      .slice(0, 30);
  }, [language, normalizedQuery]);

  const sourceLabel = (lessonId: string) => {
    if (BEGINNER_LESSON_IDS.has(lessonId)) {
      const section = BEGINNER_SECTION_IDS
        .map((sectionId) => BEGINNER_SECTIONS[sectionId])
        .find((item) => item.lessonIds.includes(lessonId));
      return section ? selectLocalizedText(section.title, language) : language === 'tr' ? 'Temel' : 'Foundation';
    }
    const track = ACADEMY_TRACK_IDS
      .map((trackId) => ACADEMY_TRACKS[trackId])
      .find((item) => item.lessonIds.includes(lessonId));
    return track ? selectLocalizedText(track.title, language) : 'Academy';
  };

  const openLesson = (lessonId: string) => {
    navigation.navigate('MicroLesson', {
      lessonId,
      source: BEGINNER_LESSON_IDS.has(lessonId) ? 'beginner' : 'academy',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={language === 'tr' ? 'Öğrenme ekranına dön' : 'Return to learning'}
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <View style={styles.headingCopy}>
            <Text style={styles.brand}>FINM8 EDU</Text>
            <Text style={styles.title}>{language === 'tr' ? 'Konu ara' : 'Search topics'}</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>
            {language === 'tr'
              ? `${MICRO_LESSON_CATALOG.length} DERS İÇİNDE ARA`
              : `SEARCH ${MICRO_LESSON_CATALOG.length} LESSONS`}
          </Text>
          <Text style={styles.heroTitle}>
            {language === 'tr' ? 'Merak ettiğin kavrama doğrudan git.' : 'Go straight to the concept you are curious about.'}
          </Text>
          <Text style={styles.heroBody}>
            {language === 'tr'
              ? '“Spread nedir?”, “faiz”, “trend” veya “ETF” gibi bir konu yaz. İlgili temel ve Academy derslerini birlikte bulacağız.'
              : 'Try “spread”, “interest”, “trend”, or “ETF”. We will search both Foundation and Academy lessons.'}
          </Text>
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            accessibilityLabel={language === 'tr' ? 'Finans konusu ara' : 'Search a finance topic'}
            autoCapitalize="none"
            autoCorrect={false}
            value={query}
            onChangeText={setQuery}
            placeholder={language === 'tr' ? 'Örn. likidite, faiz, bilanço...' : 'E.g. liquidity, interest, balance sheet...'}
            placeholderTextColor="#61788B"
            style={styles.input}
          />
          {query.length > 0 ? (
            <Pressable accessibilityRole="button" accessibilityLabel={language === 'tr' ? 'Aramayı temizle' : 'Clear search'} onPress={() => setQuery('')} style={styles.clearButton}>
              <Text style={styles.clearText}>×</Text>
            </Pressable>
          ) : null}
        </View>

        {normalizedQuery.length < 2 ? (
          <View style={styles.quickArea}>
            <Text style={styles.sectionEyebrow}>{language === 'tr' ? 'HIZLI KONULAR' : 'QUICK TOPICS'}</Text>
            <View style={styles.quickRow}>
              {QUICK_TOPICS[language].map((topic) => (
                <Pressable
                  key={topic}
                  accessibilityRole="button"
                  accessibilityLabel={topic}
                  onPress={() => setQuery(topic)}
                  style={({ pressed }) => [styles.quickChip, pressed && styles.quickChipPressed]}
                >
                  <Text style={styles.quickChipText}>{topic}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.resultsArea}>
            <View style={styles.resultsHeading}>
              <Text style={styles.sectionEyebrow}>{language === 'tr' ? 'SONUÇLAR' : 'RESULTS'}</Text>
              <Text style={styles.resultsCount}>{results.length} {language === 'tr' ? 'ders' : 'lessons'}</Text>
            </View>
            {results.length > 0 ? (
              <View style={styles.resultList}>
                {results.map(({ lesson, title, objective }, index) => (
                  <Pressable
                    key={lesson.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${title}. ${sourceLabel(lesson.id)}.`}
                    onPress={() => openLesson(lesson.id)}
                    style={({ pressed }) => [styles.resultRow, index > 0 && styles.resultRowBorder, pressed && styles.resultRowPressed]}
                  >
                    <View style={styles.resultCopy}>
                      <Text style={styles.resultSource}>{sourceLabel(lesson.id)}</Text>
                      <Text style={styles.resultTitle}>{title}</Text>
                      <Text style={styles.resultObjective} numberOfLines={2}>{objective}</Text>
                    </View>
                    <View style={styles.resultMeta}>
                      <Text style={styles.resultMinutes}>{lesson.estimatedMinutes} {language === 'tr' ? 'dk' : 'min'}</Text>
                      <Text style={styles.resultArrow}>›</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>{language === 'tr' ? 'Bu ifadeyle ders bulamadık.' : 'No lesson matched that phrase.'}</Text>
                <Text style={styles.emptyBody}>
                  {language === 'tr'
                    ? 'Daha kısa bir kavram dene: “faiz”, “risk”, “trend”, “tahvil” gibi.'
                    : 'Try a shorter concept such as “interest”, “risk”, “trend”, or “bond”.'}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <LearnHubNav active="search" />
    </SafeAreaView>
  );
}

const createStyles = (wide: boolean) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#06111F' },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: wide ? 28 : 18, paddingTop: 18, paddingBottom: wide ? 50 : 104, gap: 18 },
  topBar: { minHeight: 46, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 13, borderWidth: 1, borderColor: '#253D51', backgroundColor: '#0A1928' },
  backText: { color: '#E6EFF3', fontSize: 29, lineHeight: 30 },
  headingCopy: { flex: 1, gap: 1 },
  brand: { color: '#48DCCB', fontSize: 9, fontWeight: '900', letterSpacing: 1.9 },
  title: { color: '#F8FAFC', fontSize: 23, lineHeight: 29, fontWeight: '900' },
  pressed: { opacity: 0.72 },
  hero: { gap: 7, paddingVertical: wide ? 10 : 4 },
  heroEyebrow: { color: '#4FD7C6', fontSize: 9, fontWeight: '900', letterSpacing: 0.9 },
  heroTitle: { maxWidth: 660, color: '#F8FAFC', fontSize: wide ? 30 : 24, lineHeight: wide ? 38 : 31, fontWeight: '900' },
  heroBody: { maxWidth: 720, color: '#879CAB', fontSize: wide ? 13 : 12, lineHeight: wide ? 20 : 18 },
  searchWrap: { minHeight: 56, flexDirection: 'row', alignItems: 'center', borderRadius: 17, borderWidth: 1, borderColor: '#2A5960', backgroundColor: '#0A222B', overflow: 'hidden' },
  input: { flex: 1, minHeight: 54, paddingHorizontal: 16, color: '#F5F8FA', fontSize: 15 },
  clearButton: { width: 48, minHeight: 54, alignItems: 'center', justifyContent: 'center' },
  clearText: { color: '#8198A8', fontSize: 24, lineHeight: 25 },
  quickArea: { gap: 10 },
  sectionEyebrow: { color: '#4ACBBA', fontSize: 9, fontWeight: '900', letterSpacing: 0.85 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickChip: { minHeight: 38, justifyContent: 'center', paddingHorizontal: 13, borderRadius: 999, borderWidth: 1, borderColor: '#274557', backgroundColor: '#0A1928' },
  quickChipPressed: { backgroundColor: '#0E2932' },
  quickChipText: { color: '#A6BBC6', fontSize: 11, fontWeight: '800' },
  resultsArea: { gap: 10 },
  resultsHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resultsCount: { color: '#748A9A', fontSize: 10, fontWeight: '800' },
  resultList: { overflow: 'hidden', borderRadius: 19, borderWidth: 1, borderColor: '#20384B', backgroundColor: '#091724' },
  resultRow: { minHeight: wide ? 94 : 88, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: wide ? 17 : 14, paddingVertical: 12 },
  resultRowBorder: { borderTopWidth: 1, borderTopColor: '#172C3D' },
  resultRowPressed: { backgroundColor: '#0D232E' },
  resultCopy: { flex: 1, gap: 3 },
  resultSource: { color: '#4DCCBC', fontSize: 8, lineHeight: 11, fontWeight: '900', letterSpacing: 0.55 },
  resultTitle: { color: '#F4F8FA', fontSize: wide ? 15 : 14, lineHeight: 20, fontWeight: '900' },
  resultObjective: { color: '#7F94A4', fontSize: 10, lineHeight: 15 },
  resultMeta: { alignItems: 'flex-end', gap: 7 },
  resultMinutes: { color: '#708695', fontSize: 9, fontWeight: '800' },
  resultArrow: { color: '#4ED5C5', fontSize: 21, lineHeight: 22 },
  emptyState: { gap: 5, padding: 17, borderRadius: 17, borderWidth: 1, borderColor: '#21394C', backgroundColor: '#091824' },
  emptyTitle: { color: '#E9F0F4', fontSize: 14, fontWeight: '900' },
  emptyBody: { color: '#7D93A2', fontSize: 11, lineHeight: 17 },
});
