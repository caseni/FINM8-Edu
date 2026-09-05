import React from 'react';
import {
  Image,
  type ImageResizeMode,
  type ImageSourcePropType,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type BeginnerEditorialImageEntry = {
  match: string;
  role: LessonSupportingVisualRole;
  source: ImageSourcePropType;
  aspectRatio?: number;
  compactAspectRatio?: number;
  resizeMode?: ImageResizeMode;
  backgroundColor?: string;
  desktopMaxWidth?: number;
  compactMaxWidth?: number;
};

/**
 * Registry for generated beginner artwork.
 *
 * Editorial artwork must never be cropped or stretched to fill the lesson frame.
 * Every asset keeps its source ratio and is rendered with `contain`. Scene-style
 * SVG lessons that need a native fallback live in their dedicated visual
 * component instead of this raster registry.
 */
const beginnerEditorialImages: readonly BeginnerEditorialImageEntry[] = [
  {
    match: 'fiyat-piyasada-nasil-olusur',
    role: 'hook',
    source: require('../../../assets/learning/beginner/markets/price-formation-hook.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'fiyat-piyasada-nasil-olusur',
    role: 'concept',
    source: require('../../../assets/learning/beginner/markets/price-formation-concept.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'fiyat-piyasada-nasil-olusur',
    role: 'practice',
    source: require('../../../assets/learning/beginner/markets/price-formation-practice.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'fiyat-piyasada-nasil-olusur',
    role: 'misconception',
    source: require('../../../assets/learning/beginner/markets/price-formation-misconception.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'fiyat-piyasada-nasil-olusur',
    role: 'summary',
    source: require('../../../assets/learning/beginner/markets/price-formation-summary.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
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
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const entry = entryFor(assetRef, role);
  if (!entry) return null;

  const styles = createStyles(theme, wide);
  const aspectRatio = wide
    ? entry.aspectRatio ?? 1
    : entry.compactAspectRatio ?? entry.aspectRatio ?? 1;
  const maxWidth = wide ? entry.desktopMaxWidth : entry.compactMaxWidth;

  return (
    <View
      style={[
        styles.shell,
        {
          aspectRatio,
          backgroundColor: entry.backgroundColor ?? '#071522',
          maxWidth,
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

const createStyles = (theme: LearningTheme, wide: boolean) => StyleSheet.create({
  shell: {
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: wide ? 18 : 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
