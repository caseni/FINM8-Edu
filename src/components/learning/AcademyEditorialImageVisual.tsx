import React from 'react';
import { Image, type ImageSourcePropType, StyleSheet, View } from 'react-native';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

/**
 * Central registry for premium editorial images used by Academy lessons.
 *
 * New generated artwork should be added here instead of being wired directly
 * inside individual lesson visual components. Matching stays lesson-specific,
 * while role keeps the same lesson free to use a different image for hook,
 * practice, misconception, risk or summary later.
 */
type AcademyEditorialImageEntry = {
  match: string;
  role: LessonSupportingVisualRole;
  source: ImageSourcePropType;
  aspectRatio?: number;
  overlayOpacity?: number;
};

const academyEditorialImages: readonly AcademyEditorialImageEntry[] = [
  {
    match: 'borsa-ve-islem-yeri-nedir',
    role: 'hook',
    source: require('../../../assets/learning/academy/markets/markets-exchange-hook.jpg'),
    aspectRatio: 16 / 9,
    overlayOpacity: 0.06,
  },
  {
    match: 'borsa-endeksi-ne-anlatir',
    role: 'hook',
    source: require('../../../assets/learning/academy/markets/markets-index-hook.jpg'),
    aspectRatio: 16 / 9,
    overlayOpacity: 0.05,
  },
  {
    match: 'finansal-tablolar-birlikte-ne-anlatir',
    role: 'hook',
    source: require('../../../assets/learning/academy/fundamental/fundamental-statements-profit-cash-hook.webp'),
    aspectRatio: 16 / 9,
    overlayOpacity: 0.04,
  },
  {
    match: 'gelir-tablosu-nasil-okunur',
    role: 'hook',
    source: require('../../../assets/learning/academy/fundamental/fundamental-income-sales-costs-hook.webp'),
    aspectRatio: 16 / 9,
    overlayOpacity: 0.04,
  },
  {
    match: 'bilanco-ne-anlatir',
    role: 'hook',
    source: require('../../../assets/learning/academy/fundamental/fundamental-balance-sheet-hook.jpg'),
    aspectRatio: 16 / 9,
    overlayOpacity: 0.05,
  },
  {
    match: 'nakit-akisi-neden-farklidir',
    role: 'hook',
    source: require('../../../assets/learning/academy/fundamental/fundamental-cash-flow-hook.jpg'),
    aspectRatio: 16 / 9,
    overlayOpacity: 0.05,
  },
  {
    match: 'marjlar-ne-anlatir',
    role: 'hook',
    source: require('../../../assets/learning/academy/fundamental/fundamental-profitability-hook.jpg'),
    aspectRatio: 16 / 9,
    overlayOpacity: 0.05,
  },
  {
    match: 'borc-ve-likidite-nasil-okunur',
    role: 'hook',
    source: require('../../../assets/learning/academy/fundamental/fundamental-debt-liquidity-hook.jpg'),
    aspectRatio: 16 / 9,
    overlayOpacity: 0.05,
  },
] as const;

function entryFor(assetRef: string, role: LessonSupportingVisualRole): AcademyEditorialImageEntry | undefined {
  return academyEditorialImages.find((entry) => entry.role === role && assetRef.includes(entry.match));
}

export function hasAcademyEditorialImage(assetRef: string, role: LessonSupportingVisualRole): boolean {
  return Boolean(entryFor(assetRef, role));
}

export interface AcademyEditorialImageVisualProps {
  assetRef: string;
  alt: string;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

export function AcademyEditorialImageVisual({
  assetRef,
  alt,
  role,
  theme = defaultLearningTheme,
}: AcademyEditorialImageVisualProps) {
  const entry = entryFor(assetRef, role);
  if (!entry) return null;

  const styles = createStyles(theme);
  return (
    <View
      style={[styles.shell, { aspectRatio: entry.aspectRatio ?? 16 / 9 }]}
      accessibilityRole="image"
      accessibilityLabel={alt}
    >
      <Image source={entry.source} resizeMode="cover" style={styles.image} />
      {entry.overlayOpacity ? (
        <View pointerEvents="none" style={[styles.overlay, { opacity: entry.overlayOpacity }]} />
      ) : null}
    </View>
  );
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#020814',
  },
});
