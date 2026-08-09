import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { selectLocalizedText } from '../../domain/learning/presentation';
import { LEARNING_GOAL_LABELS, LEARNING_STAGE_LABELS } from '../../domain/learning/personalization';
import type { LearningProfile, PresentationMode } from '../../domain/learning/types';

interface LearningPreferencesCardProps {
  profile: LearningProfile;
  presentationMode: PresentationMode;
  language: LearningLanguage;
  expanded: boolean;
  onToggle: () => void;
  onEditProfile: () => void;
  onModeChange: (mode: PresentationMode) => void;
}

export function LearningPreferencesCard({
  profile,
  presentationMode,
  language,
  expanded,
  onToggle,
  onEditProfile,
  onModeChange,
}: LearningPreferencesCardProps) {
  const stageLabel = selectLocalizedText(LEARNING_STAGE_LABELS[profile.selectedStage], language);
  const primaryGoal = profile.goals[0]
    ? selectLocalizedText(LEARNING_GOAL_LABELS[profile.goals[0]], language)
    : language === 'tr' ? 'Hedef seçilmedi' : 'No goal selected';

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={language === 'tr' ? 'Öğrenme ayarlarını aç veya kapat' : 'Expand or collapse learning settings'}
        onPress={onToggle}
        style={({ pressed }) => [styles.summary, pressed && styles.pressed]}
      >
        <View style={styles.summaryCopy}>
          <Text style={styles.eyebrow}>{language === 'tr' ? 'ÖĞRENME AYARLARI' : 'LEARNING SETTINGS'}</Text>
          <Text style={styles.title}>{stageLabel}</Text>
          <Text numberOfLines={1} style={styles.subtitle}>{primaryGoal}</Text>
        </View>
        <View style={styles.summaryMeta}>
          <View style={styles.modePill}>
            <Text style={styles.modePillText}>{presentationMode === 'normal' ? 'Normal' : 'Pro'}</Text>
          </View>
          <Text style={styles.chevron}>{expanded ? '−' : '+'}</Text>
        </View>
      </Pressable>

      {expanded ? (
        <View style={styles.details}>
          <View style={styles.goalRow}>
            {profile.goals.map((goal) => (
              <View key={goal} style={styles.goalChip}>
                <Text style={styles.goalText}>{selectLocalizedText(LEARNING_GOAL_LABELS[goal], language)}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.note}>
            {language === 'tr'
              ? 'Ders sırası sabit kalır; öneriler hedeflerine göre değişir.'
              : 'Lesson order stays the same; recommendations adapt to your goals.'}
          </Text>

          <View style={styles.modeHeader}>
            <View>
              <Text style={styles.label}>{language === 'tr' ? 'ANLATIM TARZI' : 'PRESENTATION STYLE'}</Text>
              <Text style={styles.hint}>{language === 'tr' ? 'Ders seviyeni değiştirmez' : 'Does not change your lesson level'}</Text>
            </View>
            <View style={styles.segmented}>
              {(['normal', 'pro'] as const).map((mode) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: presentationMode === mode }}
                  key={mode}
                  onPress={() => onModeChange(mode)}
                  style={({ pressed }) => [
                    styles.segment,
                    presentationMode === mode && styles.segmentActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.segmentText, presentationMode === mode && styles.segmentTextActive]}>
                    {mode === 'normal' ? 'Normal' : 'Pro'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onEditProfile}
            style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
          >
            <Text style={styles.editButtonText}>{language === 'tr' ? 'Profili düzenle' : 'Edit profile'}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, backgroundColor: '#0C1928', borderWidth: 1, borderColor: '#1F3449', overflow: 'hidden' },
  summary: { minHeight: 72, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  summaryCopy: { flex: 1, gap: 2 },
  eyebrow: { color: '#5EEAD4', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  title: { color: '#F8FAFC', fontSize: 16, fontWeight: '900' },
  subtitle: { color: '#8094A8', fontSize: 12 },
  summaryMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modePill: { minHeight: 32, justifyContent: 'center', paddingHorizontal: 11, borderRadius: 99, backgroundColor: '#123B42' },
  modePillText: { color: '#5EEAD4', fontSize: 12, fontWeight: '900' },
  chevron: { width: 32, textAlign: 'center', color: '#2DD4BF', fontSize: 25, lineHeight: 30, fontWeight: '500' },
  details: { padding: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#1F3449', gap: 14 },
  goalRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  goalChip: { paddingVertical: 7, paddingHorizontal: 10, borderRadius: 99, backgroundColor: '#172F46' },
  goalText: { color: '#B8D6D5', fontSize: 11, fontWeight: '700' },
  note: { color: '#8094A8', fontSize: 12, lineHeight: 17 },
  modeHeader: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  label: { color: '#F8FAFC', fontSize: 12, fontWeight: '800' },
  hint: { color: '#6F8499', fontSize: 11, marginTop: 2 },
  segmented: { flexDirection: 'row', backgroundColor: '#102033', padding: 4, borderRadius: 12 },
  segment: { minHeight: 44, minWidth: 74, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14, borderRadius: 9 },
  segmentActive: { backgroundColor: '#2DD4BF' },
  segmentText: { color: '#9FB0C3', fontSize: 13, fontWeight: '700' },
  segmentTextActive: { color: '#042F2E' },
  editButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 13, borderWidth: 1, borderColor: '#2DD4BF' },
  editButtonText: { color: '#5EEAD4', fontSize: 14, fontWeight: '900' },
  pressed: { opacity: 0.72 },
});
