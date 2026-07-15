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
  unlockMessage: string;
  expanded: boolean;
  activeLessonId?: string;
  language: LearningLanguage;
  onToggle: () => void;
  onOpenLesson: (lessonId: string) => void;
  onOpenChallenge: (challengeId: string) => void;
  theme?: LearningTheme;
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
  unlockMessage,
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
            <View style={[styles.statusPill, challengeCompleted && styles.statusComplete]}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.progressMeta}>
            <Text style={styles.progressText}>{completedCount}/{lessons.length} {language === 'tr' ? 'ders' : 'lessons'}</Text>
            {unlocked ? <Text style={styles.expandText}>{expanded ? '−' : '+'}</Text> : null}
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      </Pressable>

      {!unlocked ? <Text style={styles.unlockMessage}>{unlockMessage}</Text> : null}

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
                  <Text style={styles.lessonTitle}>{selectLocalizedText(lesson.title, language)}</Text>
                  <Text style={styles.lessonMeta}>{lesson.estimatedMinutes} {language === 'tr' ? 'dk' : 'min'} · +90 XP</Text>
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
                  ? language === 'tr' ? '2 uygulama · 6 soru · +100 XP' : '2 tasks · 6 questions · +100 XP'
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
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md, padding: theme.spacing.lg },
  number: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surfaceMuted, borderWidth: 1, borderColor: theme.colors.border },
  numberComplete: { backgroundColor: '#123B42', borderColor: theme.colors.success },
  numberText: { color: theme.colors.primary, fontSize: 13, fontWeight: '900' },
  headerCopy: { flex: 1, gap: 7 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm },
  title: { flex: 1, color: theme.colors.text, fontSize: 18, fontWeight: '900' },
  statusPill: { paddingVertical: 5, paddingHorizontal: 9, borderRadius: 99, backgroundColor: theme.colors.surfaceMuted },
  statusComplete: { backgroundColor: '#123B42' },
  statusText: { color: theme.colors.textMuted, fontSize: 10, fontWeight: '800' },
  description: { color: theme.colors.textMuted, fontSize: 13, lineHeight: 19 },
  progressMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressText: { color: theme.colors.textMuted, fontSize: 11, fontWeight: '700' },
  expandText: { color: theme.colors.primary, fontSize: 20, lineHeight: 20, fontWeight: '500' },
  progressTrack: { height: 6, overflow: 'hidden', borderRadius: 6, backgroundColor: theme.colors.background },
  progressFill: { height: 6, borderRadius: 6, backgroundColor: theme.colors.primary },
  unlockMessage: { marginHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg, color: theme.colors.warning, fontSize: 12, lineHeight: 18 },
  details: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.lg },
  lessonRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: theme.colors.border },
  lessonRowActive: { marginHorizontal: -8, paddingHorizontal: 8, borderRadius: theme.radius.medium, backgroundColor: theme.colors.surfaceMuted },
  lessonMarker: { width: 32, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border },
  lessonMarkerComplete: { backgroundColor: '#123B42', borderColor: theme.colors.success },
  lessonMarkerActive: { borderColor: theme.colors.primary, borderWidth: 2 },
  lessonMarkerText: { color: theme.colors.primary, fontSize: 11, fontWeight: '900' },
  lessonCopy: { flex: 1, gap: 4 },
  lessonTitle: { color: theme.colors.text, fontSize: 14, lineHeight: 19, fontWeight: '700' },
  lessonMeta: { color: theme.colors.textMuted, fontSize: 11 },
  openText: { color: theme.colors.primary, fontSize: 13, fontWeight: '900' },
  challenge: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8, padding: 14, borderRadius: theme.radius.medium, backgroundColor: '#123B42', borderWidth: 1, borderColor: theme.colors.primary },
  challengeLocked: { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border, opacity: 0.7 },
  challengeMark: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background },
  challengeMarkText: { color: theme.colors.warning, fontSize: 17 },
  challengeTitle: { color: theme.colors.text, fontSize: 14, fontWeight: '900' },
});
