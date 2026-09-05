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
 * "many buyers / few buyers" cards. Web can display the SVG master directly.
 * Native keeps the same visual language with lightweight React Native shapes so
 * the lesson does not depend on an additional SVG runtime package.
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
  const participants = sparse ? 3 : role === 'hook' ? 8 : role === 'summary' ? 7 : 9;
  const quoteValues = sparse
    ? ['99', '103']
    : role === 'concept'
      ? ['99', '101']
      : role === 'practice'
        ? ['99,8', '99,9', '100', '100,1']
        : ['99', '100', '101'];

  return (
    <>
      <View style={styles.glow} />
      {sparse ? <HistoryBackdrop styles={styles} /> : null}
      {role === 'summary' ? <RippleField styles={styles} /> : <MarketLane role={role} styles={styles} />}
      <Seller styles={styles} />
      <View style={styles.participantRow}>
        {Array.from({ length: participants }).map((_, index) => (
          <Participant key={index} active={!sparse && index % 3 === 0} styles={styles} />
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
      {role === 'summary' ? (
        <View style={styles.orderDrop}>
          <Text style={styles.orderDropText}>+</Text>
        </View>
      ) : null}
      <Text style={styles.hiddenContext} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {tr ? 'Likidite piyasa sahnesi' : 'Liquidity market scene'}
      </Text>
    </>
  );
}

function Seller({ styles }: { styles: SceneStyles }) {
  return (
    <View style={styles.seller}>
      <View style={styles.sellerHead} />
      <View style={styles.sellerBody} />
      <View style={styles.sellerArm} />
      <View style={[styles.sellerLeg, styles.sellerLegLeft]} />
      <View style={[styles.sellerLeg, styles.sellerLegRight]} />
    </View>
  );
}

function Participant({ active, styles }: { active: boolean; styles: SceneStyles }) {
  return (
    <View style={styles.participantWrap}>
      <View style={[styles.participantHead, active && styles.participantHeadActive]} />
      <View style={[styles.participantBody, active && styles.participantBodyActive]} />
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
  seller: { position: 'absolute', left: '14%', bottom: '22%', width: 54, height: 112 },
  sellerHead: { position: 'absolute', width: 24, height: 24, left: 14, top: 0, borderRadius: 12, backgroundColor: '#D9C3A7' },
  sellerBody: { position: 'absolute', width: 42, height: 58, left: 5, top: 26, borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, borderWidth: 2, borderColor: '#47D7C3', backgroundColor: '#124C4D' },
  sellerArm: { position: 'absolute', width: 48, height: 8, left: 34, top: 45, borderRadius: 4, backgroundColor: '#D9C3A7', transform: [{ rotate: '30deg' }] },
  sellerLeg: { position: 'absolute', width: 9, height: 35, bottom: 0, borderRadius: 6, backgroundColor: '#55758A' },
  sellerLegLeft: { left: 13, transform: [{ rotate: '4deg' }] },
  sellerLegRight: { left: 31, transform: [{ rotate: '-4deg' }] },
  participantRow: { position: 'absolute', left: '31%', right: '10%', bottom: '23%', minHeight: 52, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  participantWrap: { width: 22, height: 46, alignItems: 'center' },
  participantHead: { width: 11, height: 11, borderRadius: 6, backgroundColor: '#66869A' },
  participantHeadActive: { backgroundColor: '#A9DED8' },
  participantBody: { width: 20, height: 28, marginTop: 3, borderTopLeftRadius: 9, borderTopRightRadius: 9, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderWidth: 1, borderColor: '#294A5D', backgroundColor: '#173244' },
  participantBodyActive: { borderColor: '#3CAFA4', backgroundColor: '#16464B' },
  quoteRow: { position: 'absolute', left: '30%', right: '12%', top: '19%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  quoteChip: { minWidth: 42, height: 27, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#31586B', backgroundColor: '#0C2534', opacity: 0.74 },
  quoteChipActive: { borderColor: '#47D7C3', backgroundColor: '#0E2E39', opacity: 1 },
  quoteText: { color: '#D6E7ED', fontSize: wide ? 12 : 10, fontWeight: '800' },
  historyBackdrop: { position: 'absolute', left: '15%', right: '15%', top: '10%', height: '42%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingHorizontal: 12, paddingBottom: 12, borderRadius: 18, borderWidth: 1, borderColor: '#294A5D', backgroundColor: 'rgba(16, 44, 61, 0.34)' },
  historyBar: { width: '8%', maxWidth: 28, borderRadius: 7, backgroundColor: '#45687B', opacity: 0.34 },
  rippleField: { position: 'absolute', width: '62%', aspectRatio: 1.85, left: '19%', top: '31%', alignItems: 'center', justifyContent: 'center' },
  ripple: { position: 'absolute', borderWidth: 2, borderColor: '#2E6D75', borderRadius: 999 },
  rippleOuter: { width: '100%', height: '82%' },
  rippleMiddle: { width: '72%', height: '60%' },
  rippleInner: { width: '43%', height: '37%', borderColor: '#47D7C3' },
  rippleCenter: { width: 13, height: 13, borderRadius: 7, backgroundColor: '#8AEADD' },
  orderDrop: { position: 'absolute', width: 44, height: 44, left: '45%', top: '13%', alignItems: 'center', justifyContent: 'center', borderRadius: 22, borderWidth: 2, borderColor: '#47D7C3', backgroundColor: '#0E3B3F' },
  orderDropText: { color: '#8AEADD', fontSize: 26, lineHeight: 28, fontWeight: '500' },
  hiddenContext: { position: 'absolute', opacity: 0, width: 1, height: 1 },
});
