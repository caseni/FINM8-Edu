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

export interface BeginnerLiquidityStoryVisualProps {
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

const liquiditySvgArtwork: Record<LessonSupportingVisualRole, ImageSourcePropType> = {
  hook: require('../../../assets/learning/beginner/markets/liquidity-hook.svg'),
  concept: require('../../../assets/learning/beginner/markets/liquidity-concept.svg'),
  practice: require('../../../assets/learning/beginner/markets/liquidity-practice.svg'),
  misconception: require('../../../assets/learning/beginner/markets/liquidity-misconception.svg'),
  risk: require('../../../assets/learning/beginner/markets/liquidity-misconception.svg'),
  summary: require('../../../assets/learning/beginner/markets/liquidity-summary.svg'),
};

/**
 * Liquidity is taught as one continuous market scene, never as side-by-side
 * "many buyers / few buyers" cards. Human figures are deliberately avoided:
 * order flow, price points and market depth carry the teaching meaning instead.
 * Web can display the SVG master directly. Native keeps the same language with
 * lightweight React Native shapes so no additional SVG runtime is required.
 */
export function BeginnerLiquidityStoryVisual({
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: BeginnerLiquidityStoryVisualProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const styles = createStyles(theme, wide);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webShell} accessibilityRole="image" accessibilityLabel={alt}>
        <Image source={liquiditySvgArtwork[role]} resizeMode="contain" style={styles.webImage} />
      </View>
    );
  }

  return (
    <View style={styles.nativeShell} accessibilityRole="image" accessibilityLabel={alt}>
      <NativeLiquidityScene role={role} language={language} styles={styles} />
    </View>
  );
}

type SceneStyles = ReturnType<typeof createStyles>;

type SceneProps = {
  role: LessonSupportingVisualRole;
  language: LearningLanguage;
  styles: SceneStyles;
};

function NativeLiquidityScene({ role, language, styles }: SceneProps) {
  const tr = language === 'tr';
  const sparse = role === 'misconception' || role === 'risk';
  const nodes = sparse ? 3 : role === 'hook' ? 5 : role === 'summary' ? 5 : 6;
  const quoteValues = sparse
    ? ['99', '103']
    : role === 'concept'
      ? ['99', '100', '101']
      : role === 'practice'
        ? ['99,8', '99,9', '100', '100,1']
        : ['99', '100', '101'];

  return (
    <>
      <View style={styles.glow} />
      {sparse ? <HistoryBackdrop styles={styles} /> : null}
      {role === 'summary' ? <RippleField styles={styles} /> : <MarketLane role={role} styles={styles} />}
      <OrderToken role={role} styles={styles} />
      <View style={[styles.nodeRow, sparse && styles.nodeRowSparse]}>
        {Array.from({ length: nodes }).map((_, index) => (
          <MarketNode
            key={index}
            active={!sparse && index === Math.floor(nodes / 2)}
            muted={sparse && index > 0}
            styles={styles}
          />
        ))}
      </View>
      <View style={styles.quoteRow}>
        {quoteValues.map((value, index) => (
          <View
            key={`${role}-${value}`}
            style={[styles.quoteChip, index === Math.floor(quoteValues.length / 2) && styles.quoteChipActive]}
          >
            <Text style={styles.quoteText}>{value}</Text>
          </View>
        ))}
      </View>
      {role === 'summary' ? <View style={styles.summaryPulse} /> : null}
      <Text style={styles.hiddenContext} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {tr ? 'Likidite piyasa sahnesi' : 'Liquidity market scene'}
      </Text>
    </>
  );
}

function OrderToken({ role, styles }: { role: LessonSupportingVisualRole; styles: SceneStyles }) {
  const summary = role === 'summary';
  return (
    <View style={[styles.orderToken, summary && styles.orderTokenSummary]}>
      <View style={styles.orderArrowStem} />
      <View style={styles.orderArrowHead} />
    </View>
  );
}

function MarketNode({
  active,
  muted,
  styles,
}: {
  active: boolean;
  muted: boolean;
  styles: SceneStyles;
}) {
  return (
    <View style={[styles.marketNode, active && styles.marketNodeActive, muted && styles.marketNodeMuted]}>
      <View style={[styles.marketNodeCore, active && styles.marketNodeCoreActive]} />
    </View>
  );
}

function MarketLane({ role, styles }: { role: LessonSupportingVisualRole; styles: SceneStyles }) {
  return (
    <>
      <View style={[styles.marketLane, role === 'practice' && styles.marketLanePractice]} />
      <View style={[styles.marketLaneLine, role === 'practice' && styles.marketLaneLinePractice]} />
      {role === 'practice' ? <View style={styles.executionDot} /> : null}
    </>
  );
}

function HistoryBackdrop({ styles }: { styles: SceneStyles }) {
  const heights = [34, 56, 44, 72, 60, 82, 66];
  return (
    <View style={styles.historyBackdrop}>
      {heights.map((height, index) => (
        <View key={index} style={[styles.historyBar, { height }]} />
      ))}
    </View>
  );
}

function RippleField({ styles }: { styles: SceneStyles }) {
  return (
    <View style={styles.rippleField}>
      <View style={[styles.ripple, styles.rippleOuter]} />
      <View style={[styles.ripple, styles.rippleMiddle]} />
      <View style={[styles.ripple, styles.rippleInner]} />
      <View style={styles.rippleCenter} />
    </View>
  );
}

const createStyles = (theme: LearningTheme, wide: boolean) => StyleSheet.create({
  webShell: {
    width: '100%',
    maxWidth: wide ? 620 : 460,
    aspectRatio: 1.5,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: wide ? 18 : 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#071522',
  },
  webImage: { width: '100%', height: '100%' },
  nativeShell: {
    width: '100%',
    maxWidth: wide ? 620 : 460,
    aspectRatio: 1.5,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: wide ? 18 : 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#071522',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: '62%',
    aspectRatio: 1,
    borderRadius: 999,
    left: '28%',
    top: '-10%',
    backgroundColor: 'rgba(71, 215, 195, 0.08)',
  },
  marketLane: {
    position: 'absolute',
    width: '82%',
    height: '24%',
    left: '9%',
    bottom: '18%',
    borderRadius: 999,
    backgroundColor: '#123849',
    transform: [{ rotate: '-5deg' }],
  },
  marketLanePractice: { transform: [{ rotate: '-9deg' }] },
  marketLaneLine: {
    position: 'absolute',
    width: '78%',
    height: 3,
    left: '11%',
    bottom: '31%',
    borderRadius: 999,
    backgroundColor: '#47D7C3',
    opacity: 0.76,
    transform: [{ rotate: '-5deg' }],
  },
  marketLaneLinePractice: { transform: [{ rotate: '-9deg' }] },
  executionDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    right: '10%',
    top: '30%',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#47D7C3',
    backgroundColor: '#8AEADD',
  },
  orderToken: {
    position: 'absolute',
    left: '13%',
    bottom: '23%',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#47D7C3',
    backgroundColor: '#0E3B3F',
  },
  orderTokenSummary: { left: '44%', top: '13%', bottom: undefined },
  orderArrowStem: { width: 20, height: 4, borderRadius: 2, backgroundColor: '#8AEADD' },
  orderArrowHead: {
    position: 'absolute',
    right: 11,
    width: 10,
    height: 10,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#8AEADD',
    transform: [{ rotate: '45deg' }],
  },
  nodeRow: {
    position: 'absolute',
    left: '31%',
    right: '10%',
    bottom: '27%',
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nodeRowSparse: { left: '43%', right: '18%' },
  marketNode: {
    width: 34,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#31586B',
    backgroundColor: '#102C3B',
  },
  marketNodeActive: {
    width: 42,
    height: 20,
    borderRadius: 10,
    borderColor: '#47D7C3',
    backgroundColor: '#12464B',
  },
  marketNodeMuted: { opacity: 0.46 },
  marketNodeCore: { width: 10, height: 4, borderRadius: 2, backgroundColor: '#66869A' },
  marketNodeCoreActive: { width: 16, backgroundColor: '#8AEADD' },
  quoteRow: {
    position: 'absolute',
    left: '30%',
    right: '12%',
    top: '19%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  quoteChip: {
    minWidth: 42,
    height: 27,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#31586B',
    backgroundColor: '#0C2534',
    opacity: 0.74,
  },
  quoteChipActive: { borderColor: '#47D7C3', backgroundColor: '#0E2E39', opacity: 1 },
  quoteText: { color: '#D6E7ED', fontSize: wide ? 12 : 10, fontWeight: '800' },
  historyBackdrop: {
    position: 'absolute',
    left: '15%',
    right: '15%',
    top: '10%',
    height: '42%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#294A5D',
    backgroundColor: 'rgba(16, 44, 61, 0.34)',
  },
  historyBar: { width: '8%', maxWidth: 28, borderRadius: 7, backgroundColor: '#45687B', opacity: 0.34 },
  rippleField: {
    position: 'absolute',
    width: '62%',
    aspectRatio: 1.85,
    left: '19%',
    top: '31%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: { position: 'absolute', borderWidth: 2, borderColor: '#2E6D75', borderRadius: 999 },
  rippleOuter: { width: '100%', height: '82%' },
  rippleMiddle: { width: '72%', height: '60%' },
  rippleInner: { width: '43%', height: '37%', borderColor: '#47D7C3' },
  rippleCenter: { width: 13, height: 13, borderRadius: 7, backgroundColor: '#8AEADD' },
  summaryPulse: {
    position: 'absolute',
    width: 54,
    height: 54,
    left: '43.7%',
    top: '46%',
    borderRadius: 27,
    borderWidth: 1,
    borderColor: 'rgba(71, 215, 195, 0.35)',
  },
  hiddenContext: { position: 'absolute', opacity: 0, width: 1, height: 1 },
});
