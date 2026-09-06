import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import type { LearningProfile, LearningStage, LocalizedText } from '../../domain/learning/types';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import { LEARNING_GOAL_LABELS } from '../../domain/learning/personalization';
import { useLanguageStore } from '../../store/useLanguageStore';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'LearningOnboarding'>;
type Goal = LearningProfile['goals'][number];

const stages: { id: LearningStage; title: LocalizedText; body: LocalizedText }[] = [
  { id: 'foundation', title: { tr: 'Temelden başla', en: 'Start from the foundation' }, body: { tr: 'Kavramları sade dille ve görsellerle öğren.', en: 'Learn concepts through plain language and visuals.' } },
  { id: 'intermediate', title: { tr: 'Piyasaları biliyorum', en: 'I know the markets' }, body: { tr: 'Bir fikri doğrulayan işaretlere, yanlış sinyallere ve uygulamaya odaklan.', en: 'Focus on evidence that supports an idea, false signals, and practice.' } },
  { id: 'advanced', title: { tr: 'İleri seviye çalışıyorum', en: 'I study at an advanced level' }, body: { tr: 'Bir fikrin ne zaman geçersiz sayıldığını ve farklı bağlamları birlikte değerlendirmeyi derinleştir.', en: 'Deepen how you judge when an idea is invalid and how different contexts fit together.' } },
];

const goals = (Object.keys(LEARNING_GOAL_LABELS) as Goal[]).map((id) => ({
  id,
  title: LEARNING_GOAL_LABELS[id],
}));

export function LearningOnboardingScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 820;
  const styles = createStyles(wide);
  const profile = useLearningProgressStore((state) => state.profile);
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';
  const setProfile = useLearningProgressStore((state) => state.setProfile);
  const [stage, setStage] = useState<LearningStage>(profile.selectedStage);
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>(profile.goals);
  const editing = Boolean(profile.onboardingCompletedAt);

  const toggleGoal = (goal: Goal) =>
    setSelectedGoals((current) =>
      current.includes(goal) ? current.filter((item) => item !== goal) : [...current, goal]
    );

  const exit = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.replace('Home');
  };

  const complete = () => {
    if (selectedGoals.length === 0) return;
    setProfile({
      ...profile,
      selectedStage: stage,
      goals: selectedGoals,
      onboardingCompletedAt: new Date().toISOString(),
    });
    if (editing) navigation.goBack();
    else navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={language === 'tr' ? 'Öğrenme ekranına dön' : 'Return to learning'}
            onPress={exit}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <View style={styles.headingCopy}>
            <Text style={styles.eyebrow}>FINM8 EDU</Text>
            <Text style={styles.topTitle}>{editing ? (language === 'tr' ? 'Öğrenme tercihlerin' : 'Learning preferences') : (language === 'tr' ? 'Sana göre ayarla' : 'Personalize your learning')}</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>{language === 'tr' ? 'Nereden başlayacağını birlikte seçelim.' : 'Let’s choose the right starting point.'}</Text>
          <Text style={styles.body}>{language === 'tr' ? 'Seviyeni ve ne öğrenmek istediğini söyle. İçerik aynı kalır; öneriler ve başlangıç noktası sana göre düzenlenir.' : 'Tell us your level and what you want to learn. The content stays the same; recommendations and starting points adapt to you.'}</Text>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionKicker}>{language === 'tr' ? '1 / 2 · ÖĞRENME SEVİYESİ' : '1 / 2 · LEARNING LEVEL'}</Text>
          <Text style={styles.sectionTitle}>{language === 'tr' ? 'Kendine en yakın başlangıç noktasını seç' : 'Choose the starting point that fits you best'}</Text>
        </View>
        <View style={styles.options}>
          {stages.map((item) => (
            <Pressable accessibilityRole="button" accessibilityState={{ selected: stage === item.id }} key={item.id} onPress={() => setStage(item.id)} style={[styles.option, stage === item.id && styles.optionActive]}>
              <Text style={styles.optionTitle}>{selectLocalizedText(item.title, language)}</Text>
              <Text style={styles.optionBody}>{selectLocalizedText(item.body, language)}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionKicker}>{language === 'tr' ? '2 / 2 · HEDEFLERİN' : '2 / 2 · YOUR GOALS'}</Text>
          <Text style={styles.sectionTitle}>{language === 'tr' ? 'Neleri geliştirmek istiyorsun?' : 'What do you want to improve?'}</Text>
        </View>
        <View style={styles.chips}>
          {goals.map((goal) => {
            const selected = selectedGoals.includes(goal.id);
            return <Pressable accessibilityRole="button" accessibilityState={{ selected }} key={goal.id} onPress={() => toggleGoal(goal.id)} style={[styles.chip, selected && styles.chipActive]}><Text style={[styles.chipText, selected && styles.chipTextActive]}>{selectLocalizedText(goal.title, language)}</Text></Pressable>;
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerHint}>{selectedGoals.length === 0 ? (language === 'tr' ? 'Devam etmek için en az bir hedef seç.' : 'Choose at least one goal to continue.') : (language === 'tr' ? `${selectedGoals.length} hedef seçildi` : `${selectedGoals.length} goal${selectedGoals.length === 1 ? '' : 's'} selected`)}</Text>
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: selectedGoals.length === 0 }} disabled={selectedGoals.length === 0} onPress={complete} style={[styles.button, selectedGoals.length === 0 && styles.disabled]}>
          <Text style={styles.buttonText}>{editing ? (language === 'tr' ? 'Değişiklikleri kaydet' : 'Save changes') : (language === 'tr' ? 'Profilimi kaydet' : 'Save my profile')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (wide: boolean) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F' },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: wide ? 28 : 18, paddingTop: 18, paddingBottom: 18, gap: wide ? 22 : 17 },
  topBar: { minHeight: 46, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 13, borderWidth: 1, borderColor: '#253D51', backgroundColor: '#0A1928' },
  backText: { color: '#E6EFF3', fontSize: 29, lineHeight: 30 },
  headingCopy: { flex: 1, gap: 1 },
  eyebrow: { color: '#49D9C8', fontSize: 9, letterSpacing: 1.8, fontWeight: '900' },
  topTitle: { color: '#F5F8FA', fontSize: 20, lineHeight: 25, fontWeight: '900' },
  pressed: { opacity: 0.72 },
  hero: { gap: 7, paddingVertical: wide ? 8 : 3 },
  title: { maxWidth: 660, color: '#F8FAFC', fontSize: wide ? 31 : 25, lineHeight: wide ? 39 : 32, fontWeight: '900' },
  body: { maxWidth: 720, color: '#8FA4B4', fontSize: wide ? 13 : 12, lineHeight: wide ? 20 : 18 },
  sectionHeading: { gap: 4, marginTop: 2 },
  sectionKicker: { color: '#4ED5C5', fontSize: 9, letterSpacing: 0.8, fontWeight: '900' },
  sectionTitle: { color: '#F5F8FA', fontSize: wide ? 20 : 18, lineHeight: 24, fontWeight: '900' },
  options: { flexDirection: wide ? 'row' : 'column', gap: 9 },
  option: { flex: wide ? 1 : undefined, minHeight: wide ? 126 : 92, justifyContent: 'center', padding: 15, borderRadius: 17, backgroundColor: '#0A1928', borderWidth: 1, borderColor: '#263F54', gap: 5 },
  optionActive: { borderColor: '#36BFB0', backgroundColor: '#0D2B31' },
  optionTitle: { color: '#F3F7F9', fontSize: 15, lineHeight: 20, fontWeight: '900' },
  optionBody: { color: '#8298A8', fontSize: 10, lineHeight: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minHeight: 42, justifyContent: 'center', paddingVertical: 9, paddingHorizontal: 13, borderRadius: 999, borderWidth: 1, borderColor: '#294057', backgroundColor: '#0A1928' },
  chipActive: { borderColor: '#2FBCAE', backgroundColor: '#0D3035' },
  chipText: { color: '#91A5B4', fontSize: 11, fontWeight: '700' },
  chipTextActive: { color: '#65E7D7', fontWeight: '900' },
  footer: { width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: wide ? 28 : 18, paddingTop: 10, paddingBottom: 14, backgroundColor: '#07111F', borderTopWidth: 1, borderTopColor: '#1F3449', gap: 7 },
  footerHint: { color: '#8297A7', fontSize: 10, textAlign: 'center' },
  button: { alignSelf: 'center', width: '100%', maxWidth: 844, minHeight: 52, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, borderRadius: 14, backgroundColor: '#2DD4BF' },
  buttonText: { color: '#042F2E', fontSize: 14, fontWeight: '900' },
  disabled: { opacity: 0.35 },
});
