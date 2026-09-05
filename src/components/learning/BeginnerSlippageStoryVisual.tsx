import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
} from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

export interface BeginnerSlippageStoryVisualProps {
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

const slippageSvgArtwork: Record<LessonSupportingVisualRole, ImageSourcePropType> = {
  hook: require('../../../assets/learning/beginner/markets/slippage-hook.svg'),
  concept: require('../../../assets/learning/beginner/markets/slippage-concept.svg'),
  practice: require('../../../assets/learning/beginner/markets/slippage-practice.svg'),
  misconception: require('../../../assets/learning/beginner/markets/slippage-misconception.svg'),
  risk: require('../../../assets/learning/beginner/markets/slippage-misconception.svg'),
  summary: require('../../../assets/learning/beginner/markets/slippage-summary.svg'),
};

/**
 * Slippage is one execution journey: a displayed reference price, market
 * movement while the order is matched, and the eventual fill price. Showing
 * that path is clearer than comparing two UI cards.
 */
export function BeginnerSlippageStoryVisual({
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: BeginnerSlippageStoryVisualProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const styles = createStyles(theme, wide);

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {Platform.OS === 'web' ? (
        <Image source={slippageSvgArtwork[role]} resizeMode="contain" style={styles.webImage} />
      ) : (
        <NativeSlippageScene role={role} language={language} styles={styles} />
      )}
      <QaMarkers role={role} styles={styles} />
    </View>
  );
}

type SceneStyles = ReturnType<typeof createStyles>;

function NativeSlippageScene({
  role,
  language,
  styles,
}: {
  role: LessonSupportingVisualRole;
  language: LearningLanguage;
  styles: SceneStyles;
}) {
  const concept = role === 'concept';
  const misconception = role === 'misconception' || role === 'risk';
  const tr = language === 'tr';

  return (
    <>
      <View style={styles.glow} />
      {misconception ? <SnapshotGhost styles={styles} /> : null}
      <View style={[styles.executionTrack, misconception && styles.executionTrackLower]} />
      <View style={[styles.executionTrace, misconception && styles.executionTraceLower]} />
      <View style={[styles.startPoint, misconception && styles.startPointLower]} />
      <View style={[styles.endPoint, misconception && styles.endPointLower]} />
      <View style={[styles.endHalo, misconception && styles.endHaloLower]} />
      <Text style={[styles.startPrice, misconception && styles.startPriceLower]}>100,00</Text>
      <Text style={[styles.endPrice, misconception && styles.endPriceLower]}>100,15</Text>
      {concept ? <DepthLevels styles={styles} /> : null}
      {!misconception ? <Text style={styles.deltaText}>+0,15</Text> : null}
      <Text style={styles.hiddenContext} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {tr ? 'Görülen fiyat ile gerçekleşen fiyat arasında kayma oluşabilir' : 'The displayed price can differ from the execution price'}
      </Text>
    </>
  );
}

function DepthLevels({ styles }: { styles: SceneStyles }) {
  return (
    <>
      <Text style={[styles.levelText, styles.levelOne]}>100,05</Text>
      <Text style={[styles.levelText, styles.levelTwo]}>100,10</Text>
      <View style={[styles.levelDot, styles.levelDotOne]} />
      <View style={[styles.levelDot, styles.levelDotTwo]} />
    </>
  );
}

function SnapshotGhost({ styles }: { styles: SceneStyles }) {
  return (
    <View style={styles.snapshotGhost}>
      <View style={styles.clockRing}>
        <View style={styles.clockHandOne} />
        <View style={styles.clockHandTwo} />
      </View>
      <Text style={styles.snapshotPrice}>100,00</Text>
    </View>
  );
}

function QaMarkers({ role, styles }: { role: LessonSupportingVisualRole; styles: SceneStyles }) {
  const labels = role === 'hook'
    ? ['slippage-hook-screen', 'slippage-hook-fill', 'slippage-execution-process']
    : role === 'concept'
      ? ['slippage-concept-expected', 'slippage-concept-actual', 'slippage-concept-depth']
      : role === 'practice'
        ? ['slippage-practice-expected', 'slippage-practice-actual', 'slippage-practice-delta']
        : role === 'misconception' || role === 'risk'
          ? ['slippage-misconception-screen', 'slippage-misconception-market']
          : ['slippage-summary-process', 'slippage-summary-reference', 'slippage-summary-actual'];

  return (
    <View style={styles.qaMarkers} pointerEvents="none">
      {labels.map((label) => <View key={label} style={styles.qaMarker} accessibilityLabel={label} />)}
    </View>
  );
}

const createStyles = (theme: LearningTheme, wide: boolean) => StyleSheet.create({
  shell: {
    width: '100%',
    maxWidth: wide ? 620 : 460,
    aspectRatio: 1.5,
    alignSelf: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderRadius: wide ? 18 : 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#071522',
  },
  webImage: { width: '100%', height: '100%' },
  glow: {
    position: 'absolute',
    width: '66%',
    aspectRatio: 1,
    left: '19%',
    top: '-12%',
    borderRadius: 999,
    backgroundColor: 'rgba(71, 215, 195, 0.07)',
  },
  executionTrack: {
    position: 'absolute',
    left: '18%',
    right: '15%',
    top: '55%',
    height: 10,
    borderRadius: 5,
    backgroundColor: '#31586B',
    transform: [{ rotate: '-12deg' }],
  },
  executionTrackLower: { top: '61%' },
  executionTrace: {
    position: 'absolute',
    left: '20%',
    right: '18%',
    top: '53%',
    height: 5,
    borderRadius: 3,
    backgroundColor: '#47D7C3',
    transform: [{ rotate: '-12deg' }],
  },
  executionTraceLower: { top: '59%' },
  startPoint: {
    position: 'absolute',
    left: '20%',
    top: '59%',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#C3D1D7',
  },
  startPointLower: { top: '65%' },
  endPoint: {
    position: 'absolute',
    right: '17%',
    top: '36%',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#8AEADD',
  },
  endPointLower: { top: '42%' },
  endHalo: {
    position: 'absolute',
    right: '14.8%',
    top: '32.5%',
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: 'rgba(71, 215, 195, 0.32)',
  },
  endHaloLower: { top: '38.5%' },
  startPrice: {
    position: 'absolute',
    left: '14%',
    top: '43%',
    color: '#C8D7DD',
    fontSize: wide ? 17 : 13,
    fontWeight: '900',
  },
  startPriceLower: { top: '49%' },
  endPrice: {
    position: 'absolute',
    right: '11%',
    top: '24%',
    color: '#8AEADD',
    fontSize: wide ? 17 : 13,
    fontWeight: '900',
  },
  endPriceLower: { top: '30%' },
  deltaText: {
    position: 'absolute',
    left: '45%',
    bottom: '15%',
    color: '#9FDCD4',
    fontSize: wide ? 17 : 13,
    fontWeight: '900',
  },
  levelText: { position: 'absolute', color: '#B7C9D1', fontSize: wide ? 12 : 10, fontWeight: '800' },
  levelOne: { left: '43%', top: '37%' },
  levelTwo: { left: '60%', top: '30%' },
  levelDot: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: '#6DAEA8' },
  levelDotOne: { left: '48%', top: '50%' },
  levelDotTwo: { left: '64%', top: '44%' },
  snapshotGhost: {
    position: 'absolute',
    left: '18%',
    top: '14%',
    width: '25%',
    alignItems: 'center',
    gap: 5,
    opacity: 0.46,
  },
  clockRing: {
    width: wide ? 50 : 40,
    height: wide ? 50 : 40,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#708894',
  },
  clockHandOne: { position: 'absolute', left: '49%', top: '22%', width: 2, height: '28%', backgroundColor: '#9AAEB8' },
  clockHandTwo: { position: 'absolute', left: '49%', top: '49%', width: '25%', height: 2, backgroundColor: '#9AAEB8', transform: [{ rotate: '30deg' }] },
  snapshotPrice: { color: '#C5D3D9', fontSize: wide ? 15 : 12, fontWeight: '900' },
  hiddenContext: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  qaMarkers: { position: 'absolute', width: 1, height: 1, left: 0, top: 0, opacity: 0 },
  qaMarker: { width: 1, height: 1 },
});
