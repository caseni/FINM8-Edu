import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  selectAudienceCopy,
  selectLocalizedText,
  type LearningLanguage,
} from '../../domain/learning/presentation';
import type { PracticalTask, PresentationMode } from '../../domain/learning/types';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface PracticalTaskPlayerProps {
  task: PracticalTask;
  language: LearningLanguage;
  presentationMode: PresentationMode;
  theme?: LearningTheme;
  onComplete: (passed: boolean, selectedEvidence: readonly string[]) => void;
}

export function PracticalTaskPlayer({
  task,
  language,
  presentationMode,
  theme = defaultLearningTheme,
  onComplete,
}: PracticalTaskPlayerProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const choices = task.choices ?? [];
  const expected = [...task.expectedEvidence].sort();
  const actual = [...selected].sort();
  const passed =
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index]);

  const toggle = (choiceId: string) => {
    if (checked) return;
    setSelected((current) =>
      current.includes(choiceId)
        ? current.filter((item) => item !== choiceId)
        : [...current, choiceId]
    );
  };

  const action = () => {
    if (!checked) {
      setChecked(true);
      return;
    }
    if (passed) {
      onComplete(true, selected);
      return;
    }
    setSelected([]);
    setChecked(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>
        {language === 'tr' ? 'GRAFİK GÖREVİ' : 'CHART TASK'}
      </Text>
      <Text style={styles.prompt}>
        {selectAudienceCopy(task.prompt, presentationMode, language)}
      </Text>
      <View style={styles.chart}>
        <View style={styles.levelLine} />
        <View style={[styles.candle, styles.candleOne]} />
        <View style={[styles.candle, styles.candleTwo]} />
        <View style={[styles.candle, styles.candleThree]} />
        <View style={[styles.candle, styles.candleFour]} />
        <Text style={styles.chartLabel}>
          {language === 'tr' ? 'Eğitim amaçlı şematik grafik' : 'Schematic training chart'}
        </Text>
      </View>
      <Text style={styles.helper}>
        {language === 'tr'
          ? 'İki doğru kanıtı seç.'
          : 'Select the two correct pieces of evidence.'}
      </Text>
      <View style={styles.choices}>
        {choices.map((choice) => {
          const isSelected = selected.includes(choice.id);
          const isExpected = checked && task.expectedEvidence.includes(choice.id);
          const isWrong = checked && isSelected && !isExpected;
          return (
            <Pressable
              key={choice.id}
              onPress={() => toggle(choice.id)}
              style={[
                styles.choice,
                isSelected && styles.choiceSelected,
                isExpected && styles.choiceCorrect,
                isWrong && styles.choiceWrong,
              ]}
            >
              <Text style={styles.choiceText}>
                {selectLocalizedText(choice.label, language)}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {checked ? (
        <Text style={[styles.feedback, passed ? styles.feedbackPassed : styles.feedbackRetry]}>
          {passed
            ? language === 'tr' ? 'Doğru. Yapısal seviye ve teyit kapanışı birlikte değerlendirildi.' : 'Correct. Structural level and confirming close were evaluated together.'
            : language === 'tr' ? 'Henüz değil. Seviyeyi ve teyit kapanışını birlikte düşün.' : 'Not yet. Consider the level and confirming close together.'}
        </Text>
      ) : null}
      <Pressable
        disabled={selected.length === 0}
        onPress={action}
        style={[styles.button, selected.length === 0 && styles.disabled]}
      >
        <Text style={styles.buttonText}>
          {!checked
            ? language === 'tr' ? 'Kontrol et' : 'Check'
            : passed
              ? language === 'tr' ? 'Quiz’e geç' : 'Continue to quiz'
              : language === 'tr' ? 'Tekrar dene' : 'Try again'}
        </Text>
      </Pressable>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    container: { width: '100%', maxWidth: 760, alignSelf: 'center', gap: theme.spacing.md, padding: theme.spacing.lg, backgroundColor: theme.colors.surface, borderRadius: theme.radius.large, borderWidth: 1, borderColor: theme.colors.border },
    eyebrow: { color: theme.colors.primary, fontSize: 12, fontWeight: '900' },
    prompt: { color: theme.colors.text, fontSize: 23, lineHeight: 31, fontWeight: '800' },
    chart: { height: 190, overflow: 'hidden', backgroundColor: theme.colors.background, borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border },
    levelLine: { position: 'absolute', left: 20, right: 20, top: 62, height: 2, backgroundColor: theme.colors.warning },
    candle: { position: 'absolute', width: 18, borderRadius: 3, backgroundColor: theme.colors.primary },
    candleOne: { left: '16%', bottom: 30, height: 52 },
    candleTwo: { left: '36%', bottom: 52, height: 76 },
    candleThree: { left: '57%', bottom: 44, height: 64 },
    candleFour: { left: '77%', bottom: 70, height: 92 },
    chartLabel: { position: 'absolute', left: 12, bottom: 8, color: theme.colors.textMuted, fontSize: 10 },
    helper: { color: theme.colors.textMuted, fontSize: 13 },
    choices: { gap: theme.spacing.sm },
    choice: { padding: theme.spacing.md, borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
    choiceSelected: { borderColor: theme.colors.primary, borderWidth: 2 },
    choiceCorrect: { borderColor: theme.colors.success, borderWidth: 2 },
    choiceWrong: { borderColor: theme.colors.risk, borderWidth: 2 },
    choiceText: { color: theme.colors.text, fontSize: 15, fontWeight: '700' },
    feedback: { fontSize: 14, lineHeight: 20, fontWeight: '700' },
    feedbackPassed: { color: theme.colors.success },
    feedbackRetry: { color: theme.colors.warning },
    button: { alignItems: 'center', padding: theme.spacing.md, borderRadius: theme.radius.medium, backgroundColor: theme.colors.primary },
    buttonText: { color: theme.colors.primaryText, fontSize: 16, fontWeight: '900' },
    disabled: { opacity: 0.35 },
  });

