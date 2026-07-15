import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import type { LearningChallenge, MicroLesson, PresentationMode } from '../../domain/learning/types';
import { WAVE1_BEHAVIOR_EVIDENCE_LESSONS } from '../../domain/learning/examples/wave1/behaviorEvidenceLessons';
import { WAVE1_CHART_LITERACY_LESSONS } from '../../domain/learning/examples/wave1/chartLiteracyLessons';
import { WAVE1_MARKET_FOUNDATION_LESSONS } from '../../domain/learning/examples/wave1/marketFoundationsLessons';
import { WAVE1_RISK_MANAGEMENT_LESSONS } from '../../domain/learning/examples/wave1/riskManagementLessons';
import { BEHAVIOR_EVIDENCE_CHALLENGE, CHART_LITERACY_CHALLENGE, MARKET_FOUNDATIONS_CHALLENGE, RISK_MANAGEMENT_CHALLENGE } from '../../domain/learning/examples/wave1/challenges';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useLearningUiStore } from '../../store/useLearningUiStore';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'LearningReview'>;

const reviewModules: readonly {
  number: number;
  title: { tr: string; en: string };
  lessons: readonly MicroLesson[];
  challenge: LearningChallenge;
}[] = [
  { number: 1, title: { tr: 'Piyasa Temelleri', en: 'Market Foundations' }, lessons: WAVE1_MARKET_FOUNDATION_LESSONS, challenge: MARKET_FOUNDATIONS_CHALLENGE },
  { number: 2, title: { tr: 'Grafik Okuryazarlığı', en: 'Chart Literacy' }, lessons: WAVE1_CHART_LITERACY_LESSONS, challenge: CHART_LITERACY_CHALLENGE },
  { number: 3, title: { tr: 'Risk Yönetimi', en: 'Risk Management' }, lessons: WAVE1_RISK_MANAGEMENT_LESSONS, challenge: RISK_MANAGEMENT_CHALLENGE },
  { number: 4, title: { tr: 'Davranış ve Kanıt', en: 'Behavior and Evidence' }, lessons: WAVE1_BEHAVIOR_EVIDENCE_LESSONS, challenge: BEHAVIOR_EVIDENCE_CHALLENGE },
];

export function LearningReviewScreen({ navigation }: Props) {
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';
  const presentationMode = useLearningUiStore((state) => state.presentationMode);
  const setPresentationMode = useLearningUiStore((state) => state.setPresentationMode);
  const [expandedModule, setExpandedModule] = useState(1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <View style={styles.headingCopy}>
            <Text style={styles.eyebrow}>M8 LEARN · DEV</Text>
            <Text style={styles.title}>{language === 'tr' ? 'Review Merkezi' : 'Review Center'}</Text>
          </View>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>{language === 'tr' ? 'Güvenli önizleme' : 'Safe preview'}</Text>
          <Text style={styles.noticeText}>{language === 'tr' ? 'Buradan açılan ekranlar XP, badge veya gerçek ilerleme kaydetmez. Bu merkez yalnız geliştirme sürümünde görünür.' : 'Screens opened here do not save XP, badges, or real progress. This center is visible only in development.'}</Text>
        </View>

        <View style={styles.modeRow}>
          <View style={styles.headingCopy}>
            <Text style={styles.modeTitle}>{language === 'tr' ? 'Anlatım dili' : 'Presentation language'}</Text>
            <Text style={styles.modeHint}>{language === 'tr' ? 'Normal ve Pro aynı gerçeği farklı yoğunlukta anlatır.' : 'Normal and Pro explain the same truth at different density.'}</Text>
          </View>
          <View style={styles.segmented}>
            {(['normal', 'pro'] as const).map((mode: PresentationMode) => (
              <Pressable key={mode} onPress={() => setPresentationMode(mode)} style={[styles.segment, presentationMode === mode && styles.segmentActive]}>
                <Text style={[styles.segmentText, presentationMode === mode && styles.segmentTextActive]}>{mode === 'normal' ? 'Normal' : 'Pro'}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {reviewModules.map((module) => {
          const expanded = expandedModule === module.number;
          return (
            <View key={module.number} style={styles.moduleCard}>
              <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={() => setExpandedModule(expanded ? 0 : module.number)} style={styles.moduleHeader}>
                <View style={styles.moduleNumber}><Text style={styles.moduleNumberText}>{String(module.number).padStart(2, '0')}</Text></View>
                <View style={styles.headingCopy}>
                  <Text style={styles.moduleTitle}>{selectLocalizedText(module.title, language)}</Text>
                  <Text style={styles.moduleMeta}>{module.lessons.length} {language === 'tr' ? 'ders · 1 challenge' : 'lessons · 1 challenge'}</Text>
                </View>
                <Text style={styles.expandText}>{expanded ? '−' : '+'}</Text>
              </Pressable>

              {expanded ? (
                <View style={styles.lessonList}>
                  {module.lessons.map((lesson, index) => (
                    <View key={lesson.id} style={styles.lessonRow}>
                      <View style={styles.lessonNumber}><Text style={styles.lessonNumberText}>{index + 1}</Text></View>
                      <View style={styles.lessonCopy}>
                        <Text style={styles.lessonTitle}>{selectLocalizedText(lesson.title, language)}</Text>
                        <Text style={styles.lessonMeta}>{lesson.learningStage} · {lesson.estimatedMinutes} {language === 'tr' ? 'dk' : 'min'}</Text>
                        <View style={styles.actions}>
                          <ReviewAction label={language === 'tr' ? 'Slayt' : 'Slides'} onPress={() => navigation.navigate('MicroLesson', { lessonId: lesson.id, review: true })} />
                          <ReviewAction label={language === 'tr' ? 'Görev' : 'Task'} onPress={() => navigation.navigate('PracticalTask', { lessonId: lesson.id, review: true })} />
                          <ReviewAction label="Quiz" onPress={() => navigation.navigate('LessonQuiz', { lessonId: lesson.id, review: true })} />
                        </View>
                      </View>
                    </View>
                  ))}
                  <Pressable accessibilityRole="button" onPress={() => navigation.navigate('LearningChallenge', { challengeId: module.challenge.id, review: true })} style={styles.challengeButton}>
                    <Text style={styles.challengeMark}>◆</Text>
                    <View style={styles.headingCopy}>
                      <Text style={styles.challengeTitle}>{selectLocalizedText(module.challenge.title, language)}</Text>
                      <Text style={styles.lessonMeta}>{language === 'tr' ? 'Challenge önizlemesini aç' : 'Open challenge preview'}</Text>
                    </View>
                    <Text style={styles.actionText}>›</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function ReviewAction({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.actionButton}><Text style={styles.actionText}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F' },
  content: { width: '100%', maxWidth: 860, alignSelf: 'center', padding: 20, gap: 16 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057' },
  backText: { color: '#F8FAFC', fontSize: 30, lineHeight: 32 },
  headingCopy: { flex: 1, gap: 3 },
  eyebrow: { color: '#2DD4BF', fontSize: 11, letterSpacing: 1.5, fontWeight: '900' },
  title: { color: '#F8FAFC', fontSize: 30, fontWeight: '900' },
  notice: { padding: 16, borderRadius: 16, backgroundColor: '#123B42', borderWidth: 1, borderColor: '#2DD4BF', gap: 5 },
  noticeTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: '900' },
  noticeText: { color: '#B8D6D5', fontSize: 13, lineHeight: 19 },
  modeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, backgroundColor: '#0C1928', borderWidth: 1, borderColor: '#1F3449' },
  modeTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '800' },
  modeHint: { color: '#8094A8', fontSize: 11, lineHeight: 16 },
  segmented: { flexDirection: 'row', padding: 4, borderRadius: 12, backgroundColor: '#102033' },
  segment: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 9 },
  segmentActive: { backgroundColor: '#2DD4BF' },
  segmentText: { color: '#9FB0C3', fontSize: 12, fontWeight: '800' },
  segmentTextActive: { color: '#042F2E' },
  moduleCard: { overflow: 'hidden', borderRadius: 18, backgroundColor: '#0C1928', borderWidth: 1, borderColor: '#1F3449' },
  moduleHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  moduleNumber: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#172F46' },
  moduleNumberText: { color: '#2DD4BF', fontSize: 12, fontWeight: '900' },
  moduleTitle: { color: '#F8FAFC', fontSize: 17, fontWeight: '900' },
  moduleMeta: { color: '#8094A8', fontSize: 11 },
  expandText: { color: '#2DD4BF', fontSize: 22 },
  lessonList: { paddingHorizontal: 16, paddingBottom: 16 },
  lessonRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 13, borderTopWidth: 1, borderTopColor: '#1F3449' },
  lessonNumber: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#172F46' },
  lessonNumberText: { color: '#2DD4BF', fontSize: 11, fontWeight: '900' },
  lessonCopy: { flex: 1, gap: 4 },
  lessonTitle: { color: '#F8FAFC', fontSize: 14, lineHeight: 19, fontWeight: '700' },
  lessonMeta: { color: '#8094A8', fontSize: 11 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 5 },
  actionButton: { paddingVertical: 7, paddingHorizontal: 11, borderRadius: 9, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057' },
  actionText: { color: '#2DD4BF', fontSize: 11, fontWeight: '900' },
  challengeButton: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8, padding: 14, borderRadius: 14, backgroundColor: '#123B42', borderWidth: 1, borderColor: '#2DD4BF' },
  challengeMark: { color: '#FBBF24', fontSize: 19 },
  challengeTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '900' },
});
