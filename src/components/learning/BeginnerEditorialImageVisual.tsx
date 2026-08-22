import React from 'react';
import { Image, type ImageResizeMode, type ImageSourcePropType, StyleSheet, View } from 'react-native';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type BeginnerEditorialImageEntry = {
  match: string;
  role: LessonSupportingVisualRole;
  source: ImageSourcePropType;
  aspectRatio?: number;
  resizeMode?: ImageResizeMode;
  backgroundColor?: string;
  maxWidth?: number;
};

/**
 * Registry for real generated beginner artwork.
 *
 * The interactive lesson UI stays in React Native. Generated images live as
 * standalone assets and are mapped here to the exact lesson + teaching role.
 * Different roles may deliberately use different palettes, compositions and
 * aspect ratios; they are not forced into one visual template.
 */
const beginnerEditorialImages: readonly BeginnerEditorialImageEntry[] = [
  {
    match: 'fiyat-piyasada-nasil-olusur',
    role: 'hook',
    source: require('../../../assets/learning/beginner/markets/price-formation-hook.webp'),
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  {
    match: 'fiyat-piyasada-nasil-olusur',
    role: 'concept',
    source: require('../../../assets/learning/beginner/markets/price-formation-concept.webp'),
    aspectRatio: 1,
    resizeMode: 'contain',
    backgroundColor: '#F5F1E8',
  },
  {
    match: 'fiyat-piyasada-nasil-olusur',
    role: 'practice',
    source: require('../../../assets/learning/beginner/markets/price-formation-practice.webp'),
    aspectRatio: 1,
    resizeMode: 'contain',
    backgroundColor: '#F4EFE4',
    maxWidth: 590,
  },
  {
    match: 'fiyat-piyasada-nasil-olusur',
    role: 'misconception',
    source: require('../../../assets/learning/beginner/markets/price-formation-misconception.webp'),
    aspectRatio: 1,
    resizeMode: 'contain',
    backgroundColor: '#F5F1E8',
  },
  {
    match: 'fiyat-piyasada-nasil-olusur',
    role: 'summary',
    source: require('../../../assets/learning/beginner/markets/price-formation-summary.webp'),
    aspectRatio: 1,
    resizeMode: 'contain',
    maxWidth: 500,
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
    <View
      style={[
        styles.shell,
        {
          aspectRatio: entry.aspectRatio ?? 1,
          backgroundColor: entry.backgroundColor ?? '#071521',
          maxWidth: entry.maxWidth,
        },
      ]}
      accessibilityRole="image"
      accessibilityLabel={alt}
    >
      <Image
        source={entry.source}
        resizeMode={entry.resizeMode ?? 'contain'}
        style={styles.image}
      />
    </View>
  );
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: {
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
