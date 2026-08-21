import React from 'react';
import { Image, type ImageSourcePropType, StyleSheet, View } from 'react-native';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type BeginnerEditorialImageEntry = {
  match: string;
  role: LessonSupportingVisualRole;
  source: ImageSourcePropType;
};

const beginnerEditorialImages: readonly BeginnerEditorialImageEntry[] = [
  {
    match: 'fiyat-piyasada-nasil-olusur',
    role: 'hook',
    source: require('../../../assets/learning/beginner/markets/price-formation-hook.webp'),
  },
  {
    match: 'fiyat-piyasada-nasil-olusur',
    role: 'concept',
    source: require('../../../assets/learning/beginner/markets/price-formation-concept.webp'),
  },
  {
    match: 'fiyat-piyasada-nasil-olusur',
    role: 'practice',
    source: require('../../../assets/learning/beginner/markets/price-formation-practice.webp'),
  },
  {
    match: 'fiyat-piyasada-nasil-olusur',
    role: 'misconception',
    source: require('../../../assets/learning/beginner/markets/price-formation-misconception.webp'),
  },
  {
    match: 'fiyat-piyasada-nasil-olusur',
    role: 'summary',
    source: require('../../../assets/learning/beginner/markets/price-formation-summary.webp'),
  },
] as const;

function entryFor(assetRef: string, role: LessonSupportingVisualRole): BeginnerEditorialImageEntry | undefined {
  return beginnerEditorialImages.find((entry) => entry.role === role && assetRef.includes(entry.match));
}

export function hasBeginnerEditorialImage(assetRef: string, role: LessonSupportingVisualRole): boolean {
  return Boolean(entryFor(assetRef, role));
}

export interface BeginnerEditorialImageVisualProps {
  assetRef: string;
  alt: string;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

export function BeginnerEditorialImageVisual({
  assetRef,
  alt,
  role,
  theme = defaultLearningTheme,
}: BeginnerEditorialImageVisualProps) {
  const entry = entryFor(assetRef, role);
  if (!entry) return null;

  const styles = createStyles(theme);
  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <Image source={entry.source} resizeMode="contain" style={styles.image} />
    </View>
  );
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: {
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#071521',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
