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

export interface BeginnerOrderTypesStoryVisualProps {
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

const orderTypesSvgArtwork: Record<LessonSupportingVisualRole, ImageSourcePropType> = {
  hook: require('../../../assets/learning/beginner/markets/order-types-hook.svg'),
  concept: require('../../../assets/learning/beginner/markets/order-types-concept.svg'),
  practice: require('../../../assets/learning/beginner/markets/order-types-practice.svg'),
  misconception: require('../../../assets/learning/beginner/markets/order-types-misconception.svg'),
  risk: require('../../../assets/learning/beginner/markets/order-types-misconception.svg'),
  summary: require('../../../assets/learning/beginner/markets/order-types-summary.svg'),
};

/**
 * Market, limit and stop orders share one price rail. This avoids presenting
 * three UI cards as if they were the concept: the learner sees action now,
 * a price boundary and a trigger as different behaviors on the same market.
 */
export function BeginnerOrderTypesStoryVisual({
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: BeginnerOrderTypesStoryVisualProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const styles = createStyles(theme, wide);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
        <Image source={orderTypesSvgArtwork[role]} resizeMode="contain" style={styles.webImage} />
      </View>
    );
  }

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <NativeOrderTypesScene role={role} language={language} styles={styles} />
    </View>
  );
}

type SceneStyles = ReturnType<typeof createStyles>;

function NativeOrderTypesScene({
  role,
  language,
  styles,
}: {
  role: LessonSupportingVisualRole;
  language: LearningLanguage;
  styles: SceneStyles;
}) {
  const misconception = role === 'misconception' || role === 'risk';
  const tr = language === 'tr';

  return (
    <>
      <View style={styles.glow} />
      <View style={styles.axis} />
      {misconception ? (
        <MisconceptionRail tr={tr} styles={styles} />
      ) : (
        <StandardRail role={role} tr={tr} styles={styles} />
      )}
      <Text style={styles.hiddenContext} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {tr ? 'Piyasa, limit ve stop emirleri aynı fiyat ekseninde farklı davranır' : 'Market, limit and stop orders behave differently on the same price rail'}
      </Text>
    </>
  );
}

function StandardRail({ role, tr, styles }: { role: LessonSupportingVisualRole; tr: boolean; styles: SceneStyles }) {
  const practice = role === 'practice';
  return (
    <>
      {practice ? (
        <>
          <Text style={[styles.axisPrice, styles.price102]}>102</Text>
          <Text style={[styles.axisPrice, styles.price100]}>100</Text>
          <Text style={[styles.axisPrice, styles.price98]}>98</Text>
          <Text style={[styles.axisPrice, styles.price95]}>95</Text>
        </>
      ) : null}
      <View style={styles.marketLine} accessibilityLabel="order-market-path">
        <View style={styles.marketDot} />
        <View style={styles.marketArrowStem} />
        <View style={styles.marketArrowHead} />
        <Text style={[styles.cueLabel, styles.marketLabel]}>{tr ? 'PİYASA' : 'MARKET'}</Text>
      </View>
      <View style={styles.limitLine} accessibilityLabel={practice ? 'order-practice-limit' : 'order-limit-boundary'}>
        <View style={styles.limitGate} />
        <Text style={[styles.cueLabel, styles.limitLabel]}>LIMIT</Text>
      </View>
      <View style={styles.stopLine} accessibilityLabel={practice ? 'order-practice-stop' : 'order-stop-trigger'}>
        <View style={styles.stopRing}><View style={styles.stopCore} /></View>
        <Text style={[styles.cueLabel, styles.stopLabel]}>STOP</Text>
      </View>
      {role === 'concept' ? (
        <>
          <View accessibilityLabel="order-concept-market" style={styles.accessibilityPoint} />
          <View accessibilityLabel="order-concept-limit" style={styles.accessibilityPoint} />
          <View accessibilityLabel="order-concept-stop" style={styles.accessibilityPoint} />
        </>
      ) : null}
    </>
  );
}

function MisconceptionRail({ tr, styles }: { tr: boolean; styles: SceneStyles }) {
  return (
    <>
      <View style={styles.limitMythLine} accessibilityLabel="order-limit-no-fill">
        <View style={styles.limitGate} />
        <View style={styles.unfilledDot} />
        <Text style={[styles.cueLabel, styles.limitMythLabel]}>LIMIT 98</Text>
      </View>
      <View style={styles.stopMythLine} accessibilityLabel="order-stop-not-exact-fill">
        <View style={styles.stopRing}><View style={styles.stopCore} /></View>
        <Text style={[styles.cueLabel, styles.stopMythLabel]}>STOP 95</Text>
      </View>
      <View style={styles.jumpStem} />
      <View style={styles.jumpHead} />
      <View style={styles.actualFillDot} />
      <Text style={styles.actualFillText}>94,4</Text>
      <Text style={styles.mythHint}>{tr ? 'Sınır ≠ gerçekleşme garantisi' : 'Boundary ≠ fill guarantee'}</Text>
    </>
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
    left: '22%',
    top: '-10%',
    borderRadius: 999,
    backgroundColor: 'rgba(71, 215, 195, 0.07)',
  },
  axis: {
    position: 'absolute',
    left: '31%',
    top: '16%',
    bottom: '17%',
    width: 5,
    borderRadius: 3,
    backgroundColor: '#31586B',
  },
  marketLine: {
    position: 'absolute',
    left: '14%',
    right: '18%',
    top: '34%',
    height: 38,
  },
  marketDot: {
    position: 'absolute',
    left: '25%',
    top: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#8AEADD',
  },
  marketArrowStem: {
    position: 'absolute',
    left: 0,
    width: '24%',
    top: 17,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#47D7C3',
  },
  marketArrowHead: {
    position: 'absolute',
    left: '20%',
    top: 9,
    width: 16,
    height: 16,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#47D7C3',
    transform: [{ rotate: '45deg' }],
  },
  limitLine: {
    position: 'absolute',
    left: '31%',
    right: '14%',
    top: '57%',
    height: 52,
    borderTopWidth: 5,
    borderColor: '#7897A9',
  },
  limitGate: {
    position: 'absolute',
    left: '52%',
    top: -16,
    width: 10,
    height: 34,
    borderRadius: 5,
    backgroundColor: '#B7CBD5',
  },
  stopLine: {
    position: 'absolute',
    left: '31%',
    right: '14%',
    top: '73%',
    height: 52,
    borderTopWidth: 5,
    borderStyle: 'dashed',
    borderColor: '#B48663',
  },
  stopRing: {
    position: 'absolute',
    left: '68%',
    top: -13,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#D5B497',
  },
  stopCore: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D5B497' },
  cueLabel: { position: 'absolute', fontSize: wide ? 14 : 11, fontWeight: '900', letterSpacing: 0.4 },
  marketLabel: { left: '35%', top: 7, color: '#8AEADD' },
  limitLabel: { left: '10%', top: -29, color: '#C5D5DC' },
  stopLabel: { left: '10%', top: -29, color: '#D5B497' },
  axisPrice: { position: 'absolute', left: '22%', color: '#B9CCD5', fontSize: wide ? 13 : 10, fontWeight: '800' },
  price102: { top: '21%' },
  price100: { top: '33%' },
  price98: { top: '56%' },
  price95: { top: '72%' },
  accessibilityPoint: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  limitMythLine: {
    position: 'absolute',
    left: '31%',
    right: '14%',
    top: '43%',
    height: 52,
    borderTopWidth: 5,
    borderColor: '#47D7C3',
  },
  limitMythLabel: { left: '12%', top: -30, color: '#8AEADD' },
  unfilledDot: {
    position: 'absolute',
    left: '30%',
    top: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#8AEADD',
    opacity: 0.38,
  },
  stopMythLine: {
    position: 'absolute',
    left: '31%',
    right: '14%',
    top: '64%',
    height: 52,
    borderTopWidth: 5,
    borderStyle: 'dashed',
    borderColor: '#B48663',
  },
  stopMythLabel: { left: '12%', top: -30, color: '#D5B497' },
  jumpStem: {
    position: 'absolute',
    left: '72%',
    top: '68%',
    width: 5,
    height: '12%',
    borderRadius: 3,
    backgroundColor: '#D16870',
  },
  jumpHead: {
    position: 'absolute',
    left: '70.6%',
    top: '77%',
    width: 15,
    height: 15,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#D16870',
    transform: [{ rotate: '45deg' }],
  },
  actualFillDot: {
    position: 'absolute',
    left: '70.3%',
    top: '83%',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D88B7C',
  },
  actualFillText: {
    position: 'absolute',
    left: '76%',
    top: '81%',
    color: '#D88B7C',
    fontSize: wide ? 14 : 11,
    fontWeight: '900',
  },
  mythHint: {
    position: 'absolute',
    left: '38%',
    bottom: '7%',
    color: theme.colors.textMuted,
    fontSize: wide ? 11 : 9,
    fontWeight: '700',
  },
  hiddenContext: { position: 'absolute', width: 1, height: 1, opacity: 0 },
});
