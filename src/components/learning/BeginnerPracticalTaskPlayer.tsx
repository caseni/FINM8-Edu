import React, { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  selectAudienceCopy,
  selectLocalizedText,
  type LearningLanguage,
} from '../../domain/learning/presentation';
import type { LocalizedText, PracticalTask, PresentationMode } from '../../domain/learning/types';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import { LessonSupportingVisual } from './LessonSupportingVisual';

export interface BeginnerPracticalTaskPlayerProps {
  task: PracticalTask;
  language: LearningLanguage;
  presentationMode: PresentationMode;
  takeaway: LocalizedText;
  reinforcementVisual?: { assetRef: string; alt: LocalizedText };
  theme?: LearningTheme;
  onComplete: (passed: boolean, selectedEvidence: readonly string[]) => void;
  completionLabel?: LocalizedText;
  eyebrow?: LocalizedText;
}

export function BeginnerPracticalTaskPlayer({
  task,
  language,
  presentationMode,
  takeaway,
  reinforcementVisual,
  theme = defaultLearningTheme,
  onComplete,
  completionLabel,
  eyebrow,
}: BeginnerPracticalTaskPlayerProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const completionLocked = useRef(false);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const choices = task.choices ?? [];
  const expected = [...task.expectedEvidence].sort();
  const actual = [...selected].sort();
  const passed = actual.length === expected.length && actual.every((value, index) => value === expected[index]);

  const toggle = (choiceId: string) => {
    if (checked) return;
    setSelected((current) => current.includes(choiceId)
      ? current.filter((item) => item !== choiceId)
      : [...current, choiceId]);
  };

  const action = () => {
    if (completionLocked.current) return;
    if (!checked) {
      setChecked(true);
      return;
    }
    if (passed) {
      completionLocked.current = true;
      onComplete(true, selected);
      return;
    }
    setSelected([]);
    setChecked(false);
  };

  const actionLabel = !checked
    ? language === 'tr' ? 'Kontrol et' : 'Check'
    : passed
      ? completionLabel
        ? selectLocalizedText(completionLabel, language)
        : language === 'tr' ? 'Quiz’e geç' : 'Continue to quiz'
      : language === 'tr' ? 'Tekrar dene' : 'Try again';

  const takeawayText = selectLocalizedText(takeaway, language);

  return (
    <View style={styles.shell}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.eyebrow}>
            {eyebrow
              ? selectLocalizedText(eyebrow, language)
              : language === 'tr' ? 'KISA UYGULAMA' : 'QUICK PRACTICE'}
          </Text>
          <Text style={styles.prompt}>{selectAudienceCopy(task.prompt, presentationMode, language)}</Text>

          {!checked ? (
            <View style={styles.recallPanel} accessibilityRole="summary">
              <Text style={styles.recallMark}>?</Text>
              <View style={styles.recallCopy}>
                <Text style={styles.recallTitle}>{language === 'tr' ? 'KENDİN DÜŞÜN' : 'THINK IT THROUGH'}</Text>
                <Text style={styles.recallText}>
                  {language === 'tr'
                    ? 'Dersin cevabını burada göstermiyoruz. Senaryoyu okuyup en güçlü seçeneği kendin işaretle.'
                    : 'The lesson answer is hidden here. Read the scenario and choose the strongest option yourself.'}
                </Text>
              </View>
            </View>
          ) : reinforcementVisual ? (
            <LessonSupportingVisual
              assetRef={reinforcementVisual.assetRef}
              alt={selectLocalizedText(reinforcementVisual.alt, language)}
              language={language}
              role="summary"
              theme={theme}
            />
          ) : null}

          <Text style={styles.helper}>
            {task.expectedEvidence.length === 1
              ? language === 'tr' ? '1 doğru seçeneği işaretle.' : 'Choose 1 correct answer.'
              : language === 'tr'
                ? `${task.expectedEvidence.length} doğru seçeneği işaretle.`
                : `Choose ${task.expectedEvidence.length} correct answers.`}
          </Text>

          <View style={styles.choices}>
            {choices.map((choice) => {
              const isSelected = selected.includes(choice.id);
              const isExpected = checked && task.expectedEvidence.includes(choice.id);
              const isWrong = checked && isSelected && !isExpected;
              const choiceLabel = selectLocalizedText(choice.label, language);
              return (
                <Pressable
                  role="checkbox"
                  aria-label={choiceLabel}
                  aria-checked={isSelected}
                  aria-disabled={checked}
                  accessibilityRole="checkbox"
                  accessibilityLabel={choiceLabel}
                  accessibilityState={{ disabled: checked, checked: isSelected }}
                  key={choice.id}
                  onPress={() => toggle(choice.id)}
                  style={[
                    styles.choice,
                    isSelected && styles.choiceSelected,
                    isExpected && styles.choiceCorrect,
                    isWrong && styles.choiceWrong,
                  ]}
                >
                  <Text style={[styles.choiceMark, isExpected && styles.choiceMarkCorrect, isWrong && styles.choiceMarkWrong]}>
                    {isExpected ? '✓' : isWrong ? '×' : isSelected ? '●' : '○'}
                  </Text>
                  <Text style={styles.choiceText}>{choiceLabel}</Text>
                </Pressable>
              );
            })}
          </View>

          {checked ? (
            <View style={[styles.feedbackCard, passed ? styles.feedbackPassed : styles.feedbackRetry]} accessibilityRole="summary">
              <Text style={[styles.feedbackTitle, passed ? styles.feedbackTitlePassed : styles.feedbackTitleRetry]}>
                {passed
                  ? language === 'tr' ? 'Doğru. Seçimin senaryodaki kanıtlarla uyumlu.' : 'Correct. Your selection matches the evidence in the scenario.'
                  : language === 'tr' ? 'Henüz değil. Senaryodaki ipuçlarını birlikte değerlendir.' : 'Not yet. Evaluate the clues in the scenario together.'}
              </Text>
              <Text style={styles.feedbackText}>
                {passed
                  ? takeawayText
                  : language === 'tr'
                    ? `İpucu: ${takeawayText}`
                    : `Hint: ${takeawayText}`}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          accessibilityState={{ disabled: selected.length === 0 }}
          disabled={selected.length === 0}
          onPress={action}
          style={[styles.button, selected.length === 0 && styles.disabled]}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { flex: 1, width: '100%' },
  scrollContent: { flexGrow: 1, width: '100%', padding: theme.spacing.md },
  container: { width: '100%', maxWidth: 760, alignSelf: 'center', gap: theme.spacing.md, padding: theme.spacing.lg, backgroundColor: theme.colors.surface, borderRadius: theme.radius.large, borderWidth: 1, borderColor: theme.colors.border },
  eyebrow: { color: theme.colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  prompt: { color: theme.colors.text, fontSize: 23, lineHeight: 31, fontWeight: '800' },
  recallPanel: { minHeight: 112, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, padding: theme.spacing.lg, backgroundColor: theme.colors.background, borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.primary },
  recallMark: { width: 44, color: theme.colors.primary, fontSize: 38, lineHeight: 44, fontWeight: '900', textAlign: 'center' },
  recallCopy: { flex: 1, gap: 5 },
  recallTitle: { color: theme.colors.text, fontSize: 12, fontWeight: '900', letterSpacing: 0.6 },
  recallText: { color: theme.colors.textMuted, fontSize: 13, lineHeight: 19 },
  helper: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '700' },
  choices: { gap: theme.spacing.sm },
  choice: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, padding: theme.spacing.md, borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
  choiceSelected: { borderColor: theme.colors.primary, backgroundColor: theme.colors.surfaceMuted },
  choiceCorrect: { borderColor: theme.colors.success, backgroundColor: theme.colors.surfaceMuted },
  choiceWrong: { borderColor: theme.colors.risk, backgroundColor: theme.colors.surfaceMuted },
  choiceMark: { width: 22, color: theme.colors.textMuted, fontSize: 16, fontWeight: '900' },
  choiceMarkCorrect: { color: theme.colors.success },
  choiceMarkWrong: { color: theme.colors.risk },
  choiceText: { flex: 1, color: theme.colors.text, fontSize: 15, lineHeight: 21, fontWeight: '700' },
  feedbackCard: { gap: 5, padding: theme.spacing.md, borderRadius: theme.radius.medium, borderWidth: 1, backgroundColor: theme.colors.surfaceMuted },
  feedbackPassed: { borderColor: theme.colors.success },
  feedbackRetry: { borderColor: theme.colors.warning },
  feedbackTitle: { fontSize: 14, fontWeight: '900' },
  feedbackTitlePassed: { color: theme.colors.success },
  feedbackTitleRetry: { color: theme.colors.warning },
  feedbackText: { color: theme.colors.text, fontSize: 14, lineHeight: 20, fontWeight: '600' },
  footer: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border, backgroundColor: theme.colors.background },
  button: { alignSelf: 'center', width: '100%', maxWidth: 760, minHeight: 52, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.md, borderRadius: theme.radius.medium, backgroundColor: theme.colors.primary },
  buttonText: { color: theme.colors.primaryText, fontSize: 15, fontWeight: '900' },
  disabled: { opacity: 0.4 },
});