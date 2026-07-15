import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import type { LearningProfile, LearningStage } from '../../domain/learning/types';
import type { LocalizedText } from '../../domain/learning/types';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import { useLanguageStore } from '../../store/useLanguageStore';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'LearningOnboarding'>;
type Goal = LearningProfile['goals'][number];

const stages: { id: LearningStage; title: LocalizedText; body: LocalizedText }[] = [
  { id: 'foundation', title: { tr: 'Temelden başla', en: 'Start from the foundation' }, body: { tr: 'Kavramları sade dille ve görsellerle öğren.', en: 'Learn concepts through plain language and visuals.' } },
  { id: 'intermediate', title: { tr: 'Piyasaları biliyorum', en: 'I know the markets' }, body: { tr: 'Teyitler, yanlış sinyaller ve uygulamaya odaklan.', en: 'Focus on confirmation, false signals, and practice.' } },
  { id: 'advanced', title: { tr: 'İleri seviye çalışıyorum', en: 'I study at an advanced level' }, body: { tr: 'Kanıt, invalidasyon ve çoklu bağlamı derinleştir.', en: 'Deepen evidence, invalidation, and multi-context reasoning.' } },
];

const goals: { id: Goal; title: LocalizedText }[] = [
  { id: 'financial_literacy', title: { tr: 'Finansal okuryazarlık', en: 'Financial literacy' } },
  { id: 'investing', title: { tr: 'Yatırım', en: 'Investing' } },
  { id: 'trading', title: { tr: 'Trading', en: 'Trading' } },
  { id: 'risk_management', title: { tr: 'Risk yönetimi', en: 'Risk management' } },
  { id: 'portfolio_management', title: { tr: 'Portföy', en: 'Portfolio' } },
  { id: 'data_literacy', title: { tr: 'Veri okuryazarlığı', en: 'Data literacy' } },
];

export function LearningOnboardingScreen({ navigation }: Props) {
  const profile = useLearningProgressStore((state) => state.profile);
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';
  const setProfile = useLearningProgressStore((state) => state.setProfile);
  const [stage, setStage] = useState<LearningStage>(profile.selectedStage);
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>(profile.goals);

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
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>M8 LEARN</Text>
        <Text style={styles.title}>{language === 'tr' ? 'Öğrenme profilini oluştur' : 'Create your learning profile'}</Text>
        <Text style={styles.body}>{language === 'tr' ? 'Bu seçim Normal/Pro anlatımından bağımsızdır. Temel yol sırasını değiştirmez; seviyeni ve hedeflerini kaydeder.' : 'This is independent from Normal/Pro presentation. It does not change the foundation path order; it records your level and goals.'}</Text>
        <View style={styles.options}>
          {stages.map((item) => (
            <Pressable key={item.id} onPress={() => setStage(item.id)} style={[styles.option, stage === item.id && styles.optionActive]}>
              <Text style={styles.optionTitle}>{selectLocalizedText(item.title, language)}</Text>
              <Text style={styles.optionBody}>{selectLocalizedText(item.body, language)}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.sectionTitle}>{language === 'tr' ? 'Neleri geliştirmek istiyorsun?' : 'What do you want to improve?'}</Text>
        <View style={styles.chips}>
          {goals.map((goal) => {
            const selected = selectedGoals.includes(goal.id);
            return <Pressable key={goal.id} onPress={() => toggleGoal(goal.id)} style={[styles.chip, selected && styles.chipActive]}><Text style={[styles.chipText, selected && styles.chipTextActive]}>{selectLocalizedText(goal.title, language)}</Text></Pressable>;
          })}
        </View>
        <Pressable disabled={selectedGoals.length === 0} onPress={complete} style={[styles.button, selectedGoals.length === 0 && styles.disabled]}>
          <Text style={styles.buttonText}>{language === 'tr' ? 'Profilimi kaydet' : 'Save my profile'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F' },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 24, gap: 18 },
  eyebrow: { color: '#2DD4BF', fontSize: 12, letterSpacing: 2, fontWeight: '900' },
  title: { color: '#F8FAFC', fontSize: 32, fontWeight: '900' },
  body: { color: '#9FB0C3', fontSize: 15, lineHeight: 22 },
  options: { gap: 10 },
  option: { padding: 18, borderRadius: 18, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057', gap: 4 },
  optionActive: { borderColor: '#2DD4BF', borderWidth: 2, backgroundColor: '#123B42' },
  optionTitle: { color: '#F8FAFC', fontSize: 17, fontWeight: '800' },
  optionBody: { color: '#9FB0C3', fontSize: 13, lineHeight: 19 },
  sectionTitle: { color: '#F8FAFC', fontSize: 19, fontWeight: '800', marginTop: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 99, borderWidth: 1, borderColor: '#294057', backgroundColor: '#102033' },
  chipActive: { borderColor: '#2DD4BF', backgroundColor: '#123B42' },
  chipText: { color: '#9FB0C3', fontWeight: '700' },
  chipTextActive: { color: '#5EEAD4' },
  button: { marginTop: 14, alignItems: 'center', padding: 17, borderRadius: 15, backgroundColor: '#2DD4BF' },
  buttonText: { color: '#042F2E', fontSize: 16, fontWeight: '900' },
  disabled: { opacity: 0.35 },
});
