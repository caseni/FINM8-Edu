import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface BeginnerInstrumentMeaningMapProps {
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function BeginnerInstrumentMeaningMap({
  language,
  theme = defaultLearningTheme,
}: BeginnerInstrumentMeaningMapProps) {
  const { width } = useWindowDimensions();
  const compact = width < 900;
  const styles = createStyles(theme, compact);
  const tr = language === 'tr';
  const items = [
    { title: tr ? 'HİSSE' : 'STOCK', meaning: tr ? 'Şirkette ortaklık' : 'Company ownership' },
    { title: tr ? 'TAHVİL' : 'BOND', meaning: tr ? 'Bir kuruma borç verme' : 'Lending to an issuer' },
    { title: tr ? 'DÖVİZ' : 'FX', meaning: tr ? 'İki paranın göreli değeri' : 'Relative value of two currencies' },
    { title: tr ? 'EMTİA' : 'COMMODITY', meaning: tr ? 'Altın, petrol gibi ürünler' : 'Products such as gold or oil' },
  ] as const;

  return (
    <View style={styles.grid} accessibilityRole="summary">
      {items.map((item) => (
        <View key={item.title} style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meaning}>{item.meaning}</Text>
        </View>
      ))}
    </View>
  );
}

const createStyles = (theme: LearningTheme, compact: boolean) => StyleSheet.create({
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: compact ? 8 : 10,
  },
  card: {
    width: compact ? '48.5%' : '48%',
    minHeight: compact ? 72 : 82,
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: compact ? 11 : 13,
    paddingVertical: compact ? 10 : 12,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted,
  },
  title: {
    color: theme.colors.primary,
    fontSize: compact ? 10 : 11,
    lineHeight: compact ? 14 : 15,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  meaning: {
    color: theme.colors.text,
    fontSize: compact ? 13 : 14,
    lineHeight: compact ? 18 : 20,
    fontWeight: '700',
  },
});
