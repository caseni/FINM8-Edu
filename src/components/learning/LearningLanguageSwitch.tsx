import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguageStore } from '../../store/useLanguageStore';

type SupportedLearningLanguage = 'tr' | 'en';

const OPTIONS: readonly { id: SupportedLearningLanguage; short: string; tr: string; en: string }[] = [
  { id: 'tr', short: 'TR', tr: 'Türkçe', en: 'Turkish' },
  { id: 'en', short: 'EN', tr: 'İngilizce', en: 'English' },
];

export function LearningLanguageSwitch() {
  const rawLanguage = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const language: SupportedLearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';

  return (
    <View
      accessibilityRole="toolbar"
      accessibilityLabel={language === 'tr' ? 'Öğrenme dili' : 'Learning language'}
      style={styles.switch}
    >
      {OPTIONS.map((option) => {
        const selected = option.id === language;
        const name = option[language];
        return (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            accessibilityLabel={language === 'tr' ? `${name} dilini seç` : `Select ${name}`}
            accessibilityState={{ selected }}
            onPress={() => void setLanguage(option.id)}
            style={({ pressed }) => [
              styles.option,
              selected && styles.optionSelected,
              pressed && styles.optionPressed,
            ]}
          >
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
              {option.short}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  switch: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#294057',
    backgroundColor: '#0A1928',
  },
  option: {
    minWidth: 42,
    minHeight: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 9,
    borderRadius: 9,
  },
  optionSelected: {
    backgroundColor: '#123B42',
    borderWidth: 1,
    borderColor: '#2E8177',
  },
  optionPressed: { opacity: 0.72 },
  optionText: {
    color: '#71869A',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  optionTextSelected: { color: '#5EEAD4' },
});
