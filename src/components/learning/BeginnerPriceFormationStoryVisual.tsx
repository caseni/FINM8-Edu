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

export interface BeginnerPriceFormationStoryVisualProps {
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

const priceFormationSvgArtwork: Record<LessonSupportingVisualRole, ImageSourcePropType> = {
  hook: require('../../../assets/learning/beginner/markets/price-formation-hook.svg'),
  concept: require('../../../assets/learning/beginner/markets/price-formation-concept.svg'),
  practice: require('../../../assets/learning/beginner/markets/price-formation-practice.svg'),
  misconception: require('../../../assets/learning/beginner/markets/price-formation-misconception.svg'),
  risk: require('../../../assets/learning/beginner/markets/price-formation-misconception.svg'),
  summary: require('../../../assets/learning/beginner/markets/price-formation-summary.svg'),
};

/**
 * Price formation is intentionally explained with offers, flow and a meeting
 * price rather than a crowded market illustration. The SVG masters are 3:2;
 * native mirrors the same abstract language without an SVG runtime dependency.
 */
export function BeginnerPriceFormationStoryVisual({
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: BeginnerPriceFormationStoryVisualProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const styles = createStyles(theme, wide);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
        <Image source={priceFormationSvgArtwork[role]} resizeMode="contain" style={styles.webImage} />
      </View>
    );
  }

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <NativePriceFormationScene role={role} language={language} styles={styles} />
    </View>
  );
}

type SceneStyles = ReturnType<typeof createStyles>;

function NativePriceFormationScene({
  role,
  language,
  styles,
}: {
  role: LessonSupportingVisualRole;
  language: LearningLanguage;
  styles: SceneStyles;
}) {
  const misconception = role === 'misconception' || role === 'risk';
  const practice = role === 'practice';
  const leftQuote = practice ? '99' : '98';
  const rightQuote = practice ? '101' : '102';

  return (
    <>
      <View style={styles.glow} />
      {misconception ? <FixedPriceMyth styles={styles} /> : null}
      <View style={[styles.flowLeft, misconception && styles.flowLeftShort]} />
      <View style={styles.flowRight} />
      <View style={styles.arrowLeft} />
      <View style={styles.arrowRight} />
      <View style={styles.priceCore}>
        <View style={styles.priceCoreRing} />
        <Text style={styles.priceText}>100</Text>
      </View>
      <View style={styles.leftQuote}>
        <Text style={styles.quoteText}>{leftQuote}</Text>
      </View>
      <View style={styles.rightQuote}>
        <Text style={styles.quoteText}>{rightQuote}</Text>
      </View>
      {practice ? (
        <>
          <View style={styles.practiceQuoteLeft}>
            <Text style={styles.quoteText}>100</Text>
          </View>
          <View style={styles.practiceQuoteRight}>
            <Text style={styles.quoteText}>100</Text>
          </View>
        </>
      ) : null}
      <Text style={styles.hiddenContext} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {language === 'tr' ? 'Alıcı ve satıcı teklifleri bir işlem fiyatında buluşur' : 'Buyer and seller offers meet at a transaction price'}
      </Text>
    </>
  );
}

function FixedPriceMyth({ styles }: { styles: SceneStyles }) {
  return (
    <View style={styles.fixedMyth}>
      <View style={styles.fixedGrid}>
        <View style={styles.fixedGridLineH} />
        <View style={styles.fixedGridLineV} />
      </View>
      <View style={[styles.crossLine, styles.crossLineA]} />
      <View style={[styles.crossLine, styles.crossLineB]} />
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
    borderRadius: wide ? 18 : 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#071522',
    position: 'relative',
  },
  webImage: { width: '100%', height: '100%' },
  glow: {
    position: 'absolute',
    width: '66%',
    aspectRatio: 1,
    borderRadius: 999,
    left: '17%',
    top: '-12%',
    backgroundColor: 'rgba(71, 215, 195, 0.08)',
  },
  flowLeft: {
    position: 'absolute',
    width: '31%',
    height: 6,
    left: '15%',
    top: '54%',
    borderRadius: 3,
    backgroundColor: '#47D7C3',
    transform: [{ rotate: '-8deg' }],
  },
  flowLeftShort: { width: '20%', left: '25%' },
  flowRight: {
    position: 'absolute',
    width: '31%',
    height: 6,
    right: '15%',
    top: '54%',
    borderRadius: 3,
    backgroundColor: '#7897A9',
    transform: [{ rotate: '8deg' }],
  },
  arrowLeft: {
    position: 'absolute',
    left: '43%',
    top: '51.2%',
    width: 15,
    height: 15,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#47D7C3',
    transform: [{ rotate: '45deg' }],
  },
  arrowRight: {
    position: 'absolute',
    right: '43%',
    top: '51.2%',
    width: 15,
    height: 15,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#9FB6C3',
    transform: [{ rotate: '45deg' }],
  },
  priceCore: {
    position: 'absolute',
    width: wide ? 116 : 92,
    height: wide ? 116 : 92,
    left: '50%',
    top: '51%',
    marginLeft: wide ? -58 : -46,
    marginTop: wide ? -58 : -46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 3,
    borderColor: '#47D7C3',
    backgroundColor: '#0D2F3A',
  },
  priceCoreRing: {
    position: 'absolute',
    width: '76%',
    height: '76%',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(71, 215, 195, 0.55)',
  },
  priceText: { color: '#EAF5F7', fontSize: wide ? 28 : 22, fontWeight: '900' },
  leftQuote: {
    position: 'absolute',
    left: '18%',
    top: '28%',
    minWidth: 58,
    height: 34,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#31586B',
    backgroundColor: '#0C2534',
  },
  rightQuote: {
    position: 'absolute',
    right: '18%',
    top: '28%',
    minWidth: 58,
    height: 34,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#31586B',
    backgroundColor: '#0C2534',
  },
  practiceQuoteLeft: {
    position: 'absolute',
    left: '34%',
    top: '22%',
    minWidth: 58,
    height: 34,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3CAFA4',
    backgroundColor: '#0E2E39',
  },
  practiceQuoteRight: {
    position: 'absolute',
    right: '34%',
    top: '22%',
    minWidth: 58,
    height: 34,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3CAFA4',
    backgroundColor: '#0E2E39',
  },
  quoteText: { color: '#D7E7EC', fontSize: wide ? 14 : 12, fontWeight: '800' },
  fixedMyth: {
    position: 'absolute',
    left: '10%',
    top: '26%',
    width: wide ? 108 : 86,
    height: wide ? 108 : 86,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#31586B',
    backgroundColor: '#0D2635',
    opacity: 0.78,
  },
  fixedGrid: { position: 'absolute', left: '18%', right: '18%', top: '18%', bottom: '18%' },
  fixedGridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '48%',
    height: 2,
    backgroundColor: '#31586B',
  },
  fixedGridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '48%',
    width: 2,
    backgroundColor: '#31586B',
  },
  crossLine: {
    position: 'absolute',
    width: '120%',
    height: 4,
    left: '-10%',
    top: '48%',
    borderRadius: 2,
    backgroundColor: '#D16870',
  },
  crossLineA: { transform: [{ rotate: '45deg' }] },
  crossLineB: { transform: [{ rotate: '-45deg' }] },
  hiddenContext: { position: 'absolute', opacity: 0, width: 1, height: 1 },
});
