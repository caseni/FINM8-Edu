import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';

interface LearningFlowHeaderProps {
  language: LearningLanguage;
  stage: 2 | 3;
  onExit: () => void;
}

const STAGE_LABELS = {
  2: { tr: 'GÖREV', en: 'TASK' },
  3: { tr: 'QUIZ', en: 'QUIZ' },
} as const;

export function LearningFlowHeader({ language, stage, onExit }: LearningFlowHeaderProps) {
  const label = STAGE_LABELS[stage][language];

  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={language === 'tr' ? 'Öğrenme akışından çık' : 'Exit learning flow'}
        onPress={onExit}
        style={({ pressed }) => [styles.exitButton, pressed && styles.pressed]}
      >
        <Text style={styles.exitText}>×</Text>
      </Pressable>
      <View style={styles.progressGroup}>
        <View
          accessibilityRole="progressbar"
          accessibilityLabel={language === 'tr' ? 'Öğrenme akışı ilerlemesi' : 'Learning flow progress'}
          accessibilityValue={{ min: 1, max: 3, now: stage }}
          style={styles.progressTrack}
        >
          <View style={[styles.progressFill, { width: `${(stage / 3) * 100}%` }]} />
        </View>
        <Text style={styles.stageText}>{label} · {stage}/3</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1F3449', backgroundColor: '#07111F' },
  exitButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  exitText: { color: '#9FB0C3', fontSize: 28, lineHeight: 31 },
  progressGroup: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressTrack: { flex: 1, height: 8, overflow: 'hidden', borderRadius: 8, backgroundColor: '#172F46' },
  progressFill: { height: 8, borderRadius: 8, backgroundColor: '#2DD4BF' },
  stageText: { minWidth: 88, color: '#2DD4BF', fontSize: 11, fontWeight: '900', letterSpacing: 0.6, textAlign: 'right' },
  pressed: { opacity: 0.7 },
});
