import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLanguageStore } from '../../store/useLanguageStore';
import type { RootStackParamList } from '../../types/navigation';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
export type LearnHubTab = 'home' | 'search' | 'academy';

interface LearnHubNavProps {
  active: LearnHubTab;
}

export function LearnHubNav({ active }: LearnHubNavProps) {
  const navigation = useNavigation<Navigation>();
  const { width } = useWindowDimensions();
  const language = useLanguageStore((state) => state.language) === 'en' ? 'en' : 'tr';

  if (width >= 820) return null;

  const items: readonly {
    key: LearnHubTab;
    label: { tr: string; en: string };
    route: 'Home' | 'LearnSearch' | 'Academy';
  }[] = [
    { key: 'home', label: { tr: 'Öğren', en: 'Learn' }, route: 'Home' },
    { key: 'search', label: { tr: 'Ara', en: 'Search' }, route: 'LearnSearch' },
    { key: 'academy', label: { tr: 'Academy', en: 'Academy' }, route: 'Academy' },
  ];

  return (
    <View
      role="tablist"
      aria-label={language === 'tr' ? 'FINM8 EDU ana gezinme' : 'FINM8 EDU main navigation'}
      accessibilityRole="tablist"
      accessibilityLabel={language === 'tr' ? 'FINM8 EDU ana gezinme' : 'FINM8 EDU main navigation'}
      style={styles.shell}
    >
      {items.map((item) => {
        const selected = item.key === active;
        return (
          <Pressable
            key={item.key}
            role="tab"
            aria-label={item.label[language]}
            aria-selected={selected}
            accessibilityRole="tab"
            accessibilityLabel={item.label[language]}
            accessibilityState={{ selected }}
            onPress={() => {
              if (selected) return;
              if (item.key === 'home') {
                navigation.popToTop();
                return;
              }
              navigation.navigate(item.route);
            }}
            style={({ pressed }) => [styles.item, selected && styles.itemActive, pressed && !selected && styles.itemPressed]}
          >
            <View style={[styles.dot, selected && styles.dotActive]} />
            <Text style={[styles.label, selected && styles.labelActive]}>{item.label[language]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 8,
    zIndex: 30,
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 4,
    padding: 5,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#284456',
    backgroundColor: '#091824',
  },
  item: {
    flex: 1,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 13,
  },
  itemActive: { backgroundColor: '#0D3035' },
  itemPressed: { backgroundColor: '#0D2530' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#476071' },
  dotActive: { width: 16, backgroundColor: '#55DDCC' },
  label: { color: '#7F94A4', fontSize: 10, lineHeight: 13, fontWeight: '800' },
  labelActive: { color: '#C5E7E2', fontWeight: '900' },
});
