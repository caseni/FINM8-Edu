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
  const narrow = width < 380;
  const styles = createStyles(theme, compact, narrow);
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
        <View
          key={item.title}
          style={styles.card}
          accessibilityLabel={`${item.title}: ${item.meaning}`}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meaning}>{item.meaning}</Text>
        </View>
      ))}
    </View>
  );
}

const createStyles = (theme: LearningTheme, compact: boolean, narrow: boolean) => StyleSheet.create({
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: compact ? (narrow ? 7 : 8) : 10,
  },
  card: {
    width: narrow ? '48.2%' : compact ? '48.5%' : '48%',
    minHeight: narrow ? 68 : compact ? 72 : 82,
    justifyContent: 'center',
    gap: narrow ? 4 : 5,
    paddingHorizontal: narrow ? 9 : compact ? 11 : 13,
    paddingVertical: narrow ? 9 : compact ? 10 : 12,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted,
  },
  title: {
    color: theme.colors.primary,
    fontSize: narrow ? 9 : compact ? 10 : 11,
    lineHeight: narrow ? 13 : compact ? 14 : 15,
    fontWeight: '900',
    letterSpacing: narrow ? 0.45 : 0.6,
  },
  meaning: {
    color: theme.colors.text,
    fontSize: narrow ? 12 : compact ? 13 : 14,
    lineHeight: narrow ? 17 : compact ? 18 : 20,
    fontWeight: '700',
  },
});
