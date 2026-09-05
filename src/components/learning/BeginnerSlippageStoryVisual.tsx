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

const artwork: Record<LessonSupportingVisualRole, ImageSourcePropType> = {
  hook: require('../../../assets/learning/beginner/markets/slippage-hook.svg'),
  concept: require('../../../assets/learning/beginner/markets/slippage-concept.svg'),
  practice: require('../../../assets/learning/beginner/markets/slippage-practice.svg'),
  misconception: require('../../../assets/learning/beginner/markets/slippage-misconception.svg'),
  risk: require('../../../assets/learning/beginner/markets/slippage-misconception.svg'),
  summary: require('../../../assets/learning/beginner/markets/slippage-summary.svg'),
};

/**
 * Slippage is one execution journey: displayed reference price -> matching
 * path -> actual fill. The visual intentionally contains no hidden legacy
 * comparison cards or QA-only accessibility markers.
 */
export function BeginnerSlippageStoryVisual({
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: BeginnerSlippageStoryVisualProps) {
  const { width } = useWindowDimensions();
  const compact = width < 520;
  const styles = createStyles(theme, compact);

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {Platform.OS === 'web' ? (
        <Image source={artwork[role]} resizeMode="contain" style={styles.image} accessible={false} />
      ) : (
        <NativeSlippageScene role={role} language={language} styles={styles} />
      )}
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
    <View style={styles.stage}>
      {misconception ? <View style={styles.snapshot}><Text style={styles.snapshotText}>100,00</Text></View> : null}
      <View style={[styles.track, misconception && styles.trackLower]} />
      <View style={[styles.trace, misconception && styles.traceLower]} />
      <View style={[styles.start, misconception && styles.startLower]} />
      <View style={[styles.end, misconception && styles.endLower]} />
      <Text style={[styles.startPrice, misconception && styles.startPriceLower]}>100,00</Text>
      <Text style={[styles.endPrice, misconception && styles.endPriceLower]}>100,15</Text>
      {concept ? (
        <View style={styles.depth}>
          <Text style={styles.depthText}>100,05</Text>
          <Text style={styles.depthText}>100,10</Text>
        </View>
      ) : null}
      {!misconception ? <Text style={styles.delta}>+0,15</Text> : null}
      <Text style={styles.hiddenContext} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {tr
          ? 'Görülen fiyat ile gerçekleşen fiyat arasında kayma oluşabilir'
          : 'The displayed price can differ from the execution price'}
      </Text>
    </View>
  );
}

const createStyles = (theme: LearningTheme, compact: boolean) => StyleSheet.create({
  shell: {
    width: '100%',
    maxWidth: 620,
    aspectRatio: 1.5,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: compact ? 16 : 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#071522',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  stage: { width: '90%', height: '82%', position: 'relative' },
  track: {
    position: 'absolute', left: '13%', right: '10%', top: '55%', height: 10,
    borderRadius: 5, backgroundColor: '#31586B', transform: [{ rotate: '-12deg' }],
  },
  trackLower: { top: '62%' },
  trace: {
    position: 'absolute', left: '15%', right: '13%', top: '53%', height: 5,
    borderRadius: 3, backgroundColor: '#47D7C3', transform: [{ rotate: '-12deg' }],
  },
  traceLower: { top: '60%' },
  start: {
    position: 'absolute', left: '15%', top: '59%', width: compact ? 17 : 21,
    height: compact ? 17 : 21, borderRadius: 99, backgroundColor: '#C3D1D7',
  },
  startLower: { top: '66%' },
  end: {
    position: 'absolute', right: '12%', top: '35%', width: compact ? 19 : 23,
    height: compact ? 19 : 23, borderRadius: 99, backgroundColor: '#8AEADD',
    borderWidth: 4, borderColor: 'rgba(71,215,195,0.24)',
  },
  endLower: { top: '42%' },
  startPrice: {
    position: 'absolute', left: '8%', top: '42%', color: '#C8D7DD',
    fontSize: compact ? 12 : 16, fontWeight: '900',
  },
  startPriceLower: { top: '49%' },
  endPrice: {
    position: 'absolute', right: '6%', top: '22%', color: '#8AEADD',
    fontSize: compact ? 12 : 16, fontWeight: '900',
  },
  endPriceLower: { top: '29%' },
  delta: {
    position: 'absolute', left: '45%', bottom: '10%', color: '#9FDCD4',
    fontSize: compact ? 12 : 16, fontWeight: '900',
  },
  depth: {
    position: 'absolute', left: '42%', top: '25%', gap: compact ? 10 : 14,
  },
  depthText: { color: '#B7C9D1', fontSize: compact ? 10 : 12, fontWeight: '800' },
  snapshot: {
    position: 'absolute', left: '10%', top: '12%', width: '28%', height: compact ? 46 : 58,
    borderRadius: 16, borderWidth: 1, borderColor: '#4D6674', backgroundColor: '#102431',
    alignItems: 'center', justifyContent: 'center', opacity: 0.52,
  },
  snapshotText: { color: '#C5D3D9', fontSize: compact ? 12 : 15, fontWeight: '900' },
  hiddenContext: { position: 'absolute', width: 1, height: 1, opacity: 0 },
});
