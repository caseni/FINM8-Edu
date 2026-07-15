import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';

interface LearningFlowHeaderProps {
  language: LearningLanguage;
  stage: 2 | 3;
  onExit: () => void;
}

const STAGE_LABELS = {
  2: { tr: 'Görev', en: 'Task' },
  3: { tr: 'Quiz', en: 'Quiz' },
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
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(stage / 3) * 100}%` }]} />
        </View>
        <Text style={styles.stageText}>{stage}/3 · {label}</Text>
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
  stageText: { minWidth: 76, color: '#9FB0C3', fontSize: 12, fontWeight: '800', textAlign: 'right' },
  pressed: { opacity: 0.7 },
});
