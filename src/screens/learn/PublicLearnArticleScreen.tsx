import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ACADEMY_TRACK_IDS, ACADEMY_TRACKS } from '../../domain/learning/academyTracks';
import { getMicroLessonBySlug } from '../../domain/learning/catalog';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import { LEARNING_STAGE_LABELS } from '../../domain/learning/personalization';
import type { ContentBlock } from '../../domain/learning/types';
import { LessonBlockRenderer } from '../../components/learning/LessonBlockRenderer';
import { useLanguageStore } from '../../store/useLanguageStore';
import type { RootStackParamList } from '../../types/navigation';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'PublicLearn'>;
type PublicLearnRoute = RouteProp<RootStackParamList, 'PublicLearn'>;

function trackForLesson(lessonId: string, language: LearningLanguage): string {
  const trackId = ACADEMY_TRACK_IDS.find((id) => ACADEMY_TRACKS[id].lessonIds.includes(lessonId));
  if (!trackId) return language === 'tr' ? 'FINM8 Core' : 'FINM8 Core';
  return selectLocalizedText(ACADEMY_TRACKS[trackId].title, language);
}

function publicBlocks(blocks: readonly ContentBlock[]): readonly ContentBlock[] {
  return [...blocks]
    .filter((block) => block.audience === 'all' || block.audience === 'normal')
    .sort((left, right) => left.order - right.order);
}

export function PublicLearnArticleScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<PublicLearnRoute>();
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';
  const lesson = getMicroLessonBySlug(route.params.slug);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setSelectedOptionId(null);
    setRevealed(false);
  }, [lesson?.id]);

  useEffect(() => {
    if (!lesson || typeof document === 'undefined') return;
    const title = selectLocalizedText(lesson.title, language);
    const description = selectLocalizedText(lesson.learningObjective, language);
    document.title = `${title} · FINM8 Learn`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
  }, [language, lesson]);

  const blocks = useMemo(() => lesson ? publicBlocks(lesson.contentBlocks) : [], [lesson]);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <Text style={styles.brand}>FINM8 LEARN</Text>
          <Text style={styles.notFoundTitle}>{language === 'tr' ? 'Bu ders bulunamadı.' : 'This lesson was not found.'}</Text>
          <Text style={styles.bodyMuted}>
            {language === 'tr'
              ? 'Bağlantı değişmiş olabilir. Public Learn kataloğuna dönüp başka bir konu seçebilirsin.'
              : 'The link may have changed. Return to the public Learn catalog and choose another topic.'}
          </Text>
          <Pressable onPress={() => navigation.navigate('PublicLearnIndex')} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{language === 'tr' ? 'Public Learn’e dön' : 'Back to Public Learn'}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const question = lesson.quiz.questions[0];
  const selectedIsCorrect = selectedOptionId === question.correctOptionId;
  const trackTitle = trackForLesson(lesson.id, language);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={language === 'tr' ? 'Public Learn kataloğuna dön' : 'Return to Public Learn catalog'}
            onPress={() => navigation.navigate('PublicLearnIndex')}
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <View style={styles.topCopy}>
            <Text style={styles.brand}>FINM8 LEARN</Text>
            <Text style={styles.topHint}>{language === 'tr' ? 'Ücretsiz finans eğitimi' : 'Free finance education'}</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.metaRow}>
            <Text style={styles.pill}>{trackTitle}</Text>
            <Text style={styles.metaText}>{selectLocalizedText(LEARNING_STAGE_LABELS[lesson.learningStage], language)}</Text>
            <Text style={styles.metaText}>{lesson.estimatedMinutes} {language === 'tr' ? 'dk' : 'min'}</Text>
          </View>
          <Text style={styles.title}>{selectLocalizedText(lesson.title, language)}</Text>
          <Text style={styles.objective}>{selectLocalizedText(lesson.learningObjective, language)}</Text>
          <Text style={styles.educationNote}>
            {language === 'tr'
              ? 'Eğitim içeriğidir; yatırım tavsiyesi veya al/sat sinyali değildir.'
              : 'Educational content only; not investment advice or a buy/sell signal.'}
          </Text>
        </View>

        <View style={styles.articleCard}>
          {blocks.map((block, index) => (
            <View key={block.id} style={[styles.articleBlock, index > 0 && styles.articleDivider]}>
              <LessonBlockRenderer
                block={block}
                language={language}
                presentationMode="normal"
              />
            </View>
          ))}
        </View>

        <View style={styles.takeawayCard}>
          <Text style={styles.eyebrow}>{language === 'tr' ? 'AKLINDA KALSIN' : 'KEY TAKEAWAY'}</Text>
          <Text style={styles.takeaway}>{selectLocalizedText(lesson.takeaway, language)}</Text>
        </View>

        <View style={styles.quizCard}>
          <Text style={styles.eyebrow}>{language === 'tr' ? '1 SORUDA KENDİNİ KONTROL ET' : 'CHECK YOURSELF IN 1 QUESTION'}</Text>
          <Text style={styles.quizPrompt}>{selectLocalizedText(question.prompt, language)}</Text>
          <View style={styles.optionList}>
            {question.options.map((option) => {
              const selected = selectedOptionId === option.id;
              const correct = revealed && option.id === question.correctOptionId;
              const wrong = revealed && selected && !correct;
              return (
                <Pressable
                  key={option.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected, disabled: revealed }}
                  disabled={revealed}
                  onPress={() => setSelectedOptionId(option.id)}
                  style={({ pressed }) => [
                    styles.option,
                    selected && styles.optionSelected,
                    correct && styles.optionCorrect,
                    wrong && styles.optionWrong,
                    pressed && !revealed && styles.optionPressed,
                  ]}
                >
                  <Text style={styles.optionText}>{selectLocalizedText(option.label, language)}</Text>
                </Pressable>
              );
            })}
          </View>
          {!revealed ? (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !selectedOptionId }}
              disabled={!selectedOptionId}
              onPress={() => setRevealed(true)}
              style={[styles.checkButton, !selectedOptionId && styles.checkButtonDisabled]}
            >
              <Text style={styles.checkButtonText}>{language === 'tr' ? 'Cevabı kontrol et' : 'Check answer'}</Text>
            </Pressable>
          ) : (
            <View style={[styles.feedback, selectedIsCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
              <Text style={styles.feedbackTitle}>
                {selectedIsCorrect
                  ? language === 'tr' ? 'Doğru.' : 'Correct.'
                  : language === 'tr' ? 'Tekrar düşün.' : 'Think again.'}
              </Text>
              <Text style={styles.feedbackBody}>{selectLocalizedText(question.explanation, language)}</Text>
            </View>
          )}
        </View>

        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>{language === 'tr' ? 'Konuyu gerçekten oturtmak ister misin?' : 'Want to make the concept stick?'}</Text>
          <Text style={styles.bodyMuted}>
            {language === 'tr'
              ? 'Aynı dersin görsel adımlarını tamamla, pratik görevi çöz ve 3 soruluk quiz ile pekiştir.'
              : 'Complete the visual lesson steps, solve the practical task, and reinforce it with the 3-question quiz.'}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('MicroLesson', { lessonId: lesson.id })}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>{language === 'tr' ? 'Ücretsiz derse devam et' : 'Continue to the free lesson'}</Text>
          </Pressable>
        </View>

        <View style={styles.sourcesCard}>
          <Text style={styles.sourcesTitle}>{language === 'tr' ? 'Kaynaklar' : 'Sources'}</Text>
          {lesson.sources.map((source) => (
            <View key={source.id} style={styles.sourceRow}>
              <Text style={styles.sourceTitle}>{source.title}</Text>
              <Text style={styles.sourcePublisher}>{source.publisher}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F' },
  content: { width: '100%', maxWidth: 860, alignSelf: 'center', padding: 20, gap: 18, paddingBottom: 48 },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057' },
  backText: { color: '#F8FAFC', fontSize: 30, lineHeight: 32 },
  topCopy: { flex: 1 },
  brand: { color: '#2DD4BF', fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  topHint: { color: '#8094A8', fontSize: 11, marginTop: 2 },
  hero: { gap: 10, padding: 22, borderRadius: 24, backgroundColor: '#0D2630', borderWidth: 1, borderColor: '#1F5961' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  pill: { color: '#5EEAD4', fontSize: 10, fontWeight: '900', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999, backgroundColor: '#123B42' },
  metaText: { color: '#8FA4B8', fontSize: 11, fontWeight: '700' },
  title: { color: '#F8FAFC', fontSize: 30, lineHeight: 38, fontWeight: '900' },
  objective: { color: '#C6D4E1', fontSize: 16, lineHeight: 24 },
  educationNote: { color: '#7FA8A5', fontSize: 11, lineHeight: 16, fontWeight: '700' },
  articleCard: { overflow: 'hidden', borderRadius: 22, backgroundColor: '#0C1928', borderWidth: 1, borderColor: '#294057' },
  articleBlock: { padding: 18 },
  articleDivider: { borderTopWidth: 1, borderTopColor: '#172F46' },
  takeawayCard: { gap: 8, padding: 20, borderRadius: 20, backgroundColor: '#102B30', borderWidth: 1, borderColor: '#28655F' },
  eyebrow: { color: '#5EEAD4', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  takeaway: { color: '#F8FAFC', fontSize: 21, lineHeight: 29, fontWeight: '900' },
  quizCard: { gap: 12, padding: 20, borderRadius: 20, backgroundColor: '#0C1928', borderWidth: 1, borderColor: '#294057' },
  quizPrompt: { color: '#F8FAFC', fontSize: 19, lineHeight: 27, fontWeight: '800' },
  optionList: { gap: 9 },
  option: { minHeight: 52, justifyContent: 'center', paddingHorizontal: 14, paddingVertical: 11, borderRadius: 14, borderWidth: 1, borderColor: '#294057', backgroundColor: '#102033' },
  optionSelected: { borderColor: '#2DD4BF', backgroundColor: '#123B42' },
  optionCorrect: { borderColor: '#34D399', backgroundColor: '#12382F' },
  optionWrong: { borderColor: '#F59E0B', backgroundColor: '#3A2710' },
  optionPressed: { opacity: 0.76 },
  optionText: { color: '#E7EEF5', fontSize: 14, lineHeight: 20, fontWeight: '700' },
  checkButton: { minHeight: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#2DD4BF', paddingHorizontal: 16 },
  checkButtonDisabled: { opacity: 0.38 },
  checkButtonText: { color: '#042F2E', fontSize: 14, fontWeight: '900' },
  feedback: { gap: 5, padding: 14, borderRadius: 14, borderWidth: 1 },
  feedbackCorrect: { backgroundColor: '#12382F', borderColor: '#2F766F' },
  feedbackWrong: { backgroundColor: '#3A2710', borderColor: '#8A5A18' },
  feedbackTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '900' },
  feedbackBody: { color: '#C6D4E1', fontSize: 13, lineHeight: 19 },
  ctaCard: { gap: 9, padding: 20, borderRadius: 20, backgroundColor: '#101D2C', borderWidth: 1, borderColor: '#1F3449' },
  ctaTitle: { color: '#F8FAFC', fontSize: 19, lineHeight: 26, fontWeight: '900' },
  bodyMuted: { color: '#9FB0C3', fontSize: 13, lineHeight: 20 },
  primaryButton: { minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#2DD4BF', paddingHorizontal: 18, paddingVertical: 13, marginTop: 3 },
  primaryButtonText: { color: '#042F2E', fontSize: 14, fontWeight: '900' },
  sourcesCard: { gap: 10, padding: 18, borderRadius: 18, backgroundColor: '#0A1624', borderWidth: 1, borderColor: '#1F3449' },
  sourcesTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: '900' },
  sourceRow: { gap: 2, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#172F46' },
  sourceTitle: { color: '#C6D4E1', fontSize: 12, lineHeight: 17, fontWeight: '700' },
  sourcePublisher: { color: '#72879A', fontSize: 11 },
  notFound: { width: '100%', maxWidth: 520, alignSelf: 'center', justifyContent: 'center', flex: 1, gap: 12, padding: 24 },
  notFoundTitle: { color: '#F8FAFC', fontSize: 26, lineHeight: 34, fontWeight: '900' },
});
