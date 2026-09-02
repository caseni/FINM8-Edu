import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
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
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const completionLocked = useRef(false);
  const scrollRef = useRef<ScrollView | null>(null);
  const styles = useMemo(() => createStyles(theme, wide), [theme, wide]);
  const choices = task.choices ?? [];
  const expected = [...task.expectedEvidence].sort();
  const actual = [...selected].sort();
  const passed = actual.length === expected.length && actual.every((value, index) => value === expected[index]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (checked) {
        scrollRef.current?.scrollToEnd({ animated: true });
      } else {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      }
    }, 90);
    return () => clearTimeout(timer);
  }, [checked]);

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
  const feedbackAccessibilityLabel = passed
    ? language === 'tr'
      ? `Doğru. Seçimin senaryodaki kanıtlarla uyumlu. ${takeawayText}`
      : `Correct. Your selection matches the evidence in the scenario. ${takeawayText}`
    : language === 'tr'
      ? `Henüz değil. Senaryodaki ipuçlarını birlikte değerlendir. İpucu: ${takeawayText}`
      : `Not yet. Evaluate the clues in the scenario together. Hint: ${takeawayText}`;

  return (
    <View style={styles.shell}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.eyebrow}>
            {eyebrow
              ? selectLocalizedText(eyebrow, language)
              : language === 'tr' ? 'KISA UYGULAMA' : 'QUICK PRACTICE'}
          </Text>
          <Text style={styles.prompt}>{selectAudienceCopy(task.prompt, presentationMode, language)}</Text>

          {!checked ? (
            <View style={styles.recallPanel} accessibilityRole="summary">
              <View style={styles.recallAccent} />
              <View style={styles.recallCopy}>
                <Text style={styles.recallTitle}>{language === 'tr' ? 'ÖNCE SEN ÇÖZ' : 'SOLVE IT FIRST'}</Text>
                <Text style={styles.recallText}>
                  {language === 'tr'
                    ? 'Cevabı kendin seç. Görsel açıklama, kontrol ettikten sonra açılacak.'
                    : 'Choose your answer first. The visual explanation opens after you check it.'}
                </Text>
              </View>
            </View>
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
            <View style={styles.feedbackGroup}>
              <View
                style={[styles.feedbackCard, passed ? styles.feedbackPassed : styles.feedbackRetry]}
                accessibilityRole="summary"
                accessibilityLabel={feedbackAccessibilityLabel}
                accessibilityLiveRegion="polite"
              >
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
              {reinforcementVisual ? (
                <View style={styles.feedbackVisual}>
                  <LessonSupportingVisual
                    assetRef={reinforcementVisual.assetRef}
                    alt={selectLocalizedText(reinforcementVisual.alt, language)}
                    language={language}
                    role="summary"
                    theme={theme}
                  />
                </View>
              ) : null}
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

const createStyles = (theme: LearningTheme, wide: boolean) => StyleSheet.create({
  shell: { flex: 1, width: '100%', backgroundColor: theme.colors.background },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: wide ? 28 : theme.spacing.md,
    paddingTop: wide ? 28 : 18,
    paddingBottom: wide ? 42 : 30,
  },
  container: {
    width: '100%',
    maxWidth: wide ? 860 : 720,
    alignSelf: 'center',
    gap: wide ? 20 : 16,
  },
  eyebrow: { color: theme.colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 0.95 },
  prompt: { maxWidth: 760, color: theme.colors.text, fontSize: wide ? 30 : 24, lineHeight: wide ? 39 : 32, fontWeight: '900' },
  recallPanel: {
    minHeight: wide ? 60 : 54,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 11,
    paddingVertical: 4,
  },
  recallAccent: { width: 3, borderRadius: 2, backgroundColor: theme.colors.primary },
  recallCopy: { flex: 1, justifyContent: 'center', gap: 3 },
  recallTitle: { color: theme.colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  recallText: { maxWidth: 640, color: theme.colors.textMuted, fontSize: wide ? 12 : 11, lineHeight: wide ? 18 : 17 },
  helper: { color: theme.colors.textMuted, fontSize: 10, lineHeight: 15, fontWeight: '700' },
  choices: { gap: 9 },
  choice: {
    minHeight: wide ? 64 : 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: wide ? 16 : 14,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  choiceSelected: { borderColor: theme.colors.primary, backgroundColor: theme.colors.surfaceMuted },
  choiceCorrect: { borderColor: theme.colors.success, backgroundColor: theme.colors.surfaceMuted },
  choiceWrong: { borderColor: theme.colors.risk, backgroundColor: theme.colors.surfaceMuted },
  choiceMark: { width: 22, color: theme.colors.textMuted, fontSize: 16, fontWeight: '900' },
  choiceMarkCorrect: { color: theme.colors.success },
  choiceMarkWrong: { color: theme.colors.risk },
  choiceText: { flex: 1, color: theme.colors.text, fontSize: wide ? 15 : 14, lineHeight: wide ? 22 : 20, fontWeight: '700' },
  feedbackGroup: { flexDirection: wide ? 'row' : 'column', alignItems: wide ? 'stretch' : undefined, gap: 14 },
  feedbackCard: { flex: wide ? 0.92 : undefined, justifyContent: 'center', gap: 7, padding: wide ? 20 : 16, borderRadius: 18, borderWidth: 1, backgroundColor: theme.colors.surface },
  feedbackPassed: { borderColor: theme.colors.success },
  feedbackRetry: { borderColor: theme.colors.warning },
  feedbackTitle: { fontSize: wide ? 15 : 14, lineHeight: wide ? 21 : 20, fontWeight: '900' },
  feedbackTitlePassed: { color: theme.colors.success },
  feedbackTitleRetry: { color: theme.colors.warning },
  feedbackText: { color: theme.colors.text, fontSize: wide ? 14 : 13, lineHeight: wide ? 21 : 19, fontWeight: '500' },
  feedbackVisual: { flex: wide ? 1.08 : undefined, width: wide ? undefined : '100%' },
  footer: { paddingHorizontal: wide ? 28 : theme.spacing.md, paddingVertical: 10, borderTopWidth: 1, borderTopColor: theme.colors.border, backgroundColor: theme.colors.background },
  button: { alignSelf: 'center', width: '100%', maxWidth: wide ? 860 : 720, minHeight: 52, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, borderRadius: 14, backgroundColor: theme.colors.primary },
  buttonText: { color: theme.colors.primaryText, fontSize: 14, fontWeight: '900' },
  disabled: { opacity: 0.4 },
});
