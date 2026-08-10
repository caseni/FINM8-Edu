import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import type { LearningChallenge, MicroLesson } from '../../domain/learning/types';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

interface LearningModuleCardProps {
  number: number;
  title: string;
  description: string;
  lessons: readonly MicroLesson[];
  challenge: LearningChallenge;
  completedLessonIds: readonly string[];
  challengeCompleted: boolean;
  unlocked: boolean;
  expanded: boolean;
  activeLessonId?: string;
  language: LearningLanguage;
  onToggle: () => void;
  onOpenLesson: (lessonId: string) => void;
  onOpenChallenge: (challengeId: string) => void;
  theme?: LearningTheme;
}

function selectLessonListTitle(lesson: MicroLesson, language: LearningLanguage): string {
  if (lesson.id === 'lesson.market.liquidity.001') {
    return language === 'tr'
      ? 'Likidite · Alıp satmak ne kadar kolay?'
      : 'Liquidity · How easy is it to buy or sell?';
  }

  if (lesson.id === 'lesson.market.bid-ask.001') {
    return language === 'tr'
      ? 'Alış (bid), satış (ask) ve aradaki fark (spread)'
      : 'Buy (bid), sell (ask), and the gap (spread)';
  }

  if (lesson.id === 'lesson.market.order-types.001') {
    return language === 'tr'
      ? 'Emir türleri · Piyasa, limit ve stop'
      : 'Order types · Market, limit, and stop';
  }

  if (lesson.id === 'lesson.risk.volatility.001') {
    return language === 'tr'
      ? 'Volatilite · Fiyat ne kadar sert dalgalanıyor?'
      : 'Volatility · How widely is price moving?';
  }

  if (lesson.id === 'lesson.behavior.fomo.001') {
    return language === 'tr'
      ? 'FOMO · Fırsatı kaçırma korkusu kararını nasıl bozar?'
      : 'FOMO · How can fear of missing out distort a decision?';
  }

  return selectLocalizedText(lesson.title, language);
}

export function LearningModuleCard({
  number,
  title,
  description,
  lessons,
  challenge,
  completedLessonIds,
  challengeCompleted,
  unlocked,
  expanded,
  activeLessonId,
  language,
  onToggle,
  onOpenLesson,
  onOpenChallenge,
  theme = defaultLearningTheme,
}: LearningModuleCardProps) {
  const styles = createStyles(theme);
  const completedCount = lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
  const lessonsCompleted = completedCount === lessons.length;
  const progress = lessons.length === 0 ? 0 : completedCount / lessons.length;
  const status = challengeCompleted
    ? language === 'tr' ? 'Tamamlandı' : 'Completed'
    : unlocked
      ? language === 'tr' ? 'Aktif' : 'Active'
      : language === 'tr' ? 'Kilitli' : 'Locked';

  return (
    <View style={[styles.card, !unlocked && styles.cardLocked]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !unlocked, expanded }}
        disabled={!unlocked}
        onPress={onToggle}
        style={styles.header}
      >
        <View style={[styles.number, challengeCompleted && styles.numberComplete]}>
          <Text style={styles.numberText}>{challengeCompleted ? '✓' : String(number).padStart(2, '0')}</Text>
        </View>
        <View style={styles.headerCopy}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            {unlocked ? <Text style={styles.expandText}>{expanded ? '−' : '+'}</Text> : null}
          </View>
          {!expanded ? <Text style={styles.description}>{description}</Text> : null}
          <View style={styles.progressMeta}>
            <Text style={styles.progressText}>{completedCount}/{lessons.length} {language === 'tr' ? 'ders' : 'lessons'}</Text>
            <Text style={[styles.statusText, challengeCompleted && styles.statusCompleteText]}>{status}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      </Pressable>

      {!unlocked ? (
        <Text style={styles.unlockMessage}>
          {language === 'tr'
            ? 'Önceki modülün bölüm sonu uygulaması tamamlanınca açılır.'
            : 'Unlocks after the previous module wrap-up is completed.'}
        </Text>
      ) : null}

      {unlocked && expanded ? (
        <View style={styles.details}>
          {lessons.map((lesson, index) => {
            const completed = completedLessonIds.includes(lesson.id);
            const active = lesson.id === activeLessonId;
            return (
              <Pressable
                accessibilityRole="button"
                key={lesson.id}
                onPress={() => onOpenLesson(lesson.id)}
                style={[styles.lessonRow, active && styles.lessonRowActive]}
              >
                <View style={[styles.lessonMarker, completed && styles.lessonMarkerComplete, active && styles.lessonMarkerActive]}>
                  <Text style={styles.lessonMarkerText}>{completed ? '✓' : index + 1}</Text>
                </View>
                <View style={styles.lessonCopy}>
                  <Text style={styles.lessonTitle}>{selectLessonListTitle(lesson, language)}</Text>
                  <Text style={styles.lessonMeta}>{lesson.estimatedMinutes} {language === 'tr' ? 'dk' : 'min'}</Text>
                </View>
                <Text style={styles.openText}>{active ? (language === 'tr' ? 'Devam' : 'Continue') : '›'}</Text>
              </Pressable>
            );
          })}

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !lessonsCompleted }}
            disabled={!lessonsCompleted}
            onPress={() => onOpenChallenge(challenge.id)}
            style={[styles.challenge, !lessonsCompleted && styles.challengeLocked]}
          >
            <View style={styles.challengeMark}><Text style={styles.challengeMarkText}>◆</Text></View>
            <View style={styles.lessonCopy}>
              <Text style={styles.challengeTitle}>{selectLocalizedText(challenge.title, language)}</Text>
              <Text style={styles.lessonMeta}>
                {lessonsCompleted
                  ? language === 'tr'
                    ? `${challenge.practicalTasks.length} uygulama · ${challenge.questions.length} soru`
                    : `${challenge.practicalTasks.length} tasks · ${challenge.questions.length} questions`
                  : language === 'tr' ? 'Tüm derslerden sonra açılır' : 'Unlocks after every lesson'}
              </Text>
            </View>
            <Text style={styles.openText}>{challengeCompleted ? '✓' : lessonsCompleted ? '›' : '—'}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  card: { overflow: 'hidden', borderRadius: theme.radius.large, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
  cardLocked: { opacity: 0.72 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md, padding: theme.spacing.md },
  number: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surfaceMuted, borderWidth: 1, borderColor: theme.colors.border },
  numberComplete: { backgroundColor: '#123B42', borderColor: theme.colors.success },
  numberText: { color: theme.colors.primary, fontSize: 12, fontWeight: '900' },
  headerCopy: { flex: 1, gap: 6 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm },
  title: { flex: 1, color: theme.colors.text, fontSize: 17, fontWeight: '900' },
  description: { color: theme.colors.textMuted, fontSize: 13, lineHeight: 18 },
  progressMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm },
  progressText: { color: theme.colors.textMuted, fontSize: 11, fontWeight: '700' },
  statusText: { color: theme.colors.primary, fontSize: 10, fontWeight: '900' },
  statusCompleteText: { color: theme.colors.success },
  expandText: { color: theme.colors.primary, fontSize: 20, lineHeight: 20, fontWeight: '500' },
  progressTrack: { height: 5, overflow: 'hidden', borderRadius: 5, backgroundColor: theme.colors.background },
  progressFill: { height: 5, borderRadius: 5, backgroundColor: theme.colors.primary },
  unlockMessage: { marginHorizontal: theme.spacing.md, marginBottom: theme.spacing.md, color: theme.colors.warning, fontSize: 12, lineHeight: 18 },
  details: { paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.md },
  lessonRow: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: theme.colors.border },
  lessonRowActive: { marginHorizontal: -6, paddingHorizontal: 6, borderRadius: theme.radius.medium, backgroundColor: theme.colors.surfaceMuted },
  lessonMarker: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border },
  lessonMarkerComplete: { backgroundColor: '#123B42', borderColor: theme.colors.success },
  lessonMarkerActive: { borderColor: theme.colors.primary, borderWidth: 2 },
  lessonMarkerText: { color: theme.colors.primary, fontSize: 11, fontWeight: '900' },
  lessonCopy: { flex: 1, gap: 3 },
  lessonTitle: { color: theme.colors.text, fontSize: 14, lineHeight: 19, fontWeight: '700' },
  lessonMeta: { color: theme.colors.textMuted, fontSize: 11 },
  openText: { color: theme.colors.primary, fontSize: 13, fontWeight: '900' },
  challenge: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8, padding: 12, borderRadius: theme.radius.medium, backgroundColor: '#123B42', borderWidth: 1, borderColor: theme.colors.primary },
  challengeLocked: { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border, opacity: 0.7 },
  challengeMark: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background },
  challengeMarkText: { color: theme.colors.warning, fontSize: 16 },
  challengeTitle: { color: theme.colors.text, fontSize: 14, fontWeight: '900' },
});
