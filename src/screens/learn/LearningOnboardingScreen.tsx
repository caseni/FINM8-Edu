import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
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
        <Text style={styles.eyebrow}>M8 LEARN</Text>
        <Text style={styles.title}>{language === 'tr' ? 'Öğrenme profilini oluştur' : 'Create your learning profile'}</Text>
        <Text style={styles.body}>{language === 'tr' ? 'Seviyeni ve hedeflerini seç. Ders sırası aynı kalır; öneriler sana göre uyarlanır. Normal/Pro yalnız anlatım tarzını değiştirir.' : 'Choose your level and goals. Lesson order stays the same, while recommendations adapt to you. Normal/Pro changes only the presentation style.'}</Text>

        <View style={styles.stepHeader} accessibilityRole="progressbar" accessibilityLabel={language === 'tr' ? 'Profil oluşturma adımları' : 'Profile setup steps'} accessibilityValue={{ min: 0, max: 2, now: 2 }}>
          <View style={styles.stepItem}>
            <View style={styles.stepMarker}><Text style={styles.stepMarkerText}>1</Text></View>
            <Text style={styles.stepText}>{language === 'tr' ? 'Seviye' : 'Level'}</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={styles.stepMarker}><Text style={styles.stepMarkerText}>2</Text></View>
            <Text style={styles.stepText}>{language === 'tr' ? 'Hedefler' : 'Goals'}</Text>
          </View>
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F' },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 24, paddingBottom: 18, gap: 18 },
  eyebrow: { color: '#2DD4BF', fontSize: 12, letterSpacing: 2, fontWeight: '900' },
  title: { color: '#F8FAFC', fontSize: 32, fontWeight: '900' },
  body: { color: '#9FB0C3', fontSize: 15, lineHeight: 22 },
  options: { gap: 10 },
  option: { padding: 18, borderRadius: 18, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057', gap: 4 },
  optionActive: { borderColor: '#2DD4BF', borderWidth: 2, backgroundColor: '#123B42' },
  optionTitle: { color: '#F8FAFC', fontSize: 17, fontWeight: '800' },
  optionBody: { color: '#9FB0C3', fontSize: 13, lineHeight: 19 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepMarker: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#123B42', borderWidth: 1, borderColor: '#2DD4BF' },
  stepMarkerText: { color: '#5EEAD4', fontSize: 11, fontWeight: '900' },
  stepText: { color: '#B8D6D5', fontSize: 12, fontWeight: '800' },
  stepLine: { flex: 1, height: 2, marginHorizontal: 10, backgroundColor: '#2DD4BF' },
  sectionHeading: { gap: 5, marginTop: 4 },
  sectionKicker: { color: '#5EEAD4', fontSize: 10, letterSpacing: 0.8, fontWeight: '900' },
  sectionTitle: { color: '#F8FAFC', fontSize: 19, fontWeight: '800' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minHeight: 44, justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 99, borderWidth: 1, borderColor: '#294057', backgroundColor: '#102033' },
  chipActive: { borderColor: '#2DD4BF', backgroundColor: '#123B42' },
  chipText: { color: '#9FB0C3', fontWeight: '700' },
  chipTextActive: { color: '#5EEAD4' },
  footer: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16, backgroundColor: '#07111F', borderTopWidth: 1, borderTopColor: '#1F3449', gap: 8 },
  footerHint: { color: '#9FB0C3', fontSize: 12, textAlign: 'center' },
  button: { minHeight: 52, alignItems: 'center', justifyContent: 'center', padding: 17, borderRadius: 15, backgroundColor: '#2DD4BF' },
  buttonText: { color: '#042F2E', fontSize: 16, fontWeight: '900' },
  disabled: { opacity: 0.35 },
});
