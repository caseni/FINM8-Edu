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

export interface BeginnerBidAskStoryVisualProps {
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

const bidAskSvgArtwork: Record<LessonSupportingVisualRole, ImageSourcePropType> = {
  hook: require('../../../assets/learning/beginner/markets/bid-ask-hook.svg'),
  concept: require('../../../assets/learning/beginner/markets/bid-ask-concept.svg'),
  practice: require('../../../assets/learning/beginner/markets/bid-ask-practice.svg'),
  misconception: require('../../../assets/learning/beginner/markets/bid-ask-misconception.svg'),
  risk: require('../../../assets/learning/beginner/markets/bid-ask-misconception.svg'),
  summary: require('../../../assets/learning/beginner/markets/bid-ask-summary.svg'),
};

/**
 * Bid/ask is taught on one continuous price rail. The visual avoids buyer /
 * seller character cards and repeated explanatory headings: the two quotes,
 * their gap and the order direction carry the lesson meaning.
 */
export function BeginnerBidAskStoryVisual({
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: BeginnerBidAskStoryVisualProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const styles = createStyles(theme, wide);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
        <Image source={bidAskSvgArtwork[role]} resizeMode="contain" style={styles.webImage} />
      </View>
    );
  }

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <NativeBidAskScene role={role} language={language} styles={styles} />
    </View>
  );
}

type SceneStyles = ReturnType<typeof createStyles>;

type SceneProps = {
  role: LessonSupportingVisualRole;
  language: LearningLanguage;
  styles: SceneStyles;
};

function NativeBidAskScene({ role, language, styles }: SceneProps) {
  const misconception = role === 'misconception' || role === 'risk';
  const practice = role === 'practice';

  return (
    <>
      <View style={styles.glow} />
      {misconception ? <LastTradeMarker styles={styles} /> : null}
      <View style={[styles.rail, misconception && styles.railLower]} />
      <View style={[styles.railLine, misconception && styles.railLineLower]} />
      <QuoteMarker side="bid" styles={styles} lower={misconception} />
      <QuoteMarker side="ask" styles={styles} lower={misconception} />
      <SpreadGap styles={styles} lower={misconception} />
      {practice ? <OrderRoutes styles={styles} /> : null}
      <Text style={styles.hiddenContext} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {language === 'tr' ? 'Alış satış fiyatı ve spread sahnesi' : 'Bid ask and spread scene'}
      </Text>
    </>
  );
}

function QuoteMarker({ side, styles, lower }: { side: 'bid' | 'ask'; styles: SceneStyles; lower: boolean }) {
  const bid = side === 'bid';
  return (
    <View style={[styles.quoteMarker, bid ? styles.bidMarker : styles.askMarker, lower && styles.quoteMarkerLower]}>
      <Text style={[styles.quoteName, bid ? styles.bidText : styles.askText]}>{bid ? 'BID' : 'ASK'}</Text>
      <Text style={styles.quotePrice}>{bid ? '99,90' : '100,10'}</Text>
      <View style={[styles.quoteDot, bid ? styles.bidDot : styles.askDot]} />
    </View>
  );
}

function SpreadGap({ styles, lower }: { styles: SceneStyles; lower: boolean }) {
  return (
    <View style={[styles.spread, lower && styles.spreadLower]}>
      <View style={styles.spreadDash} />
      <Text style={styles.spreadValue}>0,20</Text>
    </View>
  );
}

function OrderRoutes({ styles }: { styles: SceneStyles }) {
  return (
    <View style={styles.orderRoutes}>
      <View style={styles.orderOrigin} />
      <View style={[styles.routeLine, styles.routeLeft]} />
      <View style={[styles.routeLine, styles.routeRight]} />
      <Text style={[styles.routeArrow, styles.routeArrowLeft]}>←</Text>
      <Text style={[styles.routeArrow, styles.routeArrowRight]}>→</Text>
    </View>
  );
}

function LastTradeMarker({ styles }: { styles: SceneStyles }) {
  return (
    <View style={styles.lastTrade}>
      <View style={styles.clockRing}>
        <View style={styles.clockHandOne} />
        <View style={styles.clockHandTwo} />
      </View>
      <Text style={styles.lastTradePrice}>100,00</Text>
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
    width: '62%',
    aspectRatio: 1,
    left: '19%',
    top: '-6%',
    borderRadius: 999,
    backgroundColor: 'rgba(71, 215, 195, 0.07)',
  },
  rail: {
    position: 'absolute',
    left: '16%',
    right: '16%',
    top: '54%',
    height: '18%',
    borderRadius: 999,
    backgroundColor: '#173B4C',
    opacity: 0.8,
  },
  railLower: { top: '67%' },
  railLine: {
    position: 'absolute',
    left: '19%',
    right: '19%',
    top: '63%',
    height: 3,
    borderRadius: 999,
    backgroundColor: '#31586B',
  },
  railLineLower: { top: '76%' },
  quoteMarker: {
    position: 'absolute',
    top: '31%',
    width: '28%',
    alignItems: 'center',
    gap: 4,
  },
  quoteMarkerLower: { top: '47%' },
  bidMarker: { left: '21%' },
  askMarker: { right: '21%' },
  quoteName: { fontSize: wide ? 13 : 11, lineHeight: wide ? 18 : 15, fontWeight: '900', letterSpacing: 0.6 },
  quotePrice: { color: '#E7F2F4', fontSize: wide ? 22 : 18, lineHeight: wide ? 27 : 23, fontWeight: '900' },
  bidText: { color: '#77CFC3' },
  askText: { color: '#D3A18E' },
  quoteDot: { marginTop: wide ? 28 : 20, width: wide ? 22 : 18, height: wide ? 22 : 18, borderRadius: 999, borderWidth: 3 },
  bidDot: { backgroundColor: '#0F4948', borderColor: '#47D7C3' },
  askDot: { backgroundColor: '#3A292D', borderColor: '#C78E79' },
  spread: {
    position: 'absolute',
    left: '43%',
    width: '14%',
    top: '58%',
    alignItems: 'center',
    gap: 7,
  },
  spreadLower: { top: '71%' },
  spreadDash: { width: '100%', borderTopWidth: 2, borderStyle: 'dashed', borderColor: '#78909E', opacity: 0.7 },
  spreadValue: { color: '#C9DBE1', fontSize: wide ? 13 : 11, fontWeight: '800' },
  orderRoutes: {
    position: 'absolute',
    left: '28%',
    right: '28%',
    top: '18%',
    height: '36%',
  },
  orderOrigin: {
    position: 'absolute',
    left: '47%',
    top: 0,
    width: wide ? 24 : 20,
    height: wide ? 24 : 20,
    borderRadius: 999,
    backgroundColor: '#8EA2AD',
  },
  routeLine: { position: 'absolute', top: '52%', width: '42%', height: 3, backgroundColor: '#6F8997', borderRadius: 999 },
  routeLeft: { left: '8%', transform: [{ rotate: '-24deg' }] },
  routeRight: { right: '8%', transform: [{ rotate: '24deg' }] },
  routeArrow: { position: 'absolute', color: '#AFC5CE', fontSize: wide ? 22 : 18, fontWeight: '900' },
  routeArrowLeft: { left: '4%', bottom: '2%' },
  routeArrowRight: { right: '4%', bottom: '2%' },
  lastTrade: {
    position: 'absolute',
    top: '12%',
    left: '40%',
    width: '20%',
    alignItems: 'center',
    gap: 7,
    opacity: 0.5,
  },
  clockRing: {
    width: wide ? 50 : 42,
    height: wide ? 50 : 42,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#718894',
    backgroundColor: '#102331',
  },
  clockHandOne: { position: 'absolute', width: 2, height: '26%', left: '49%', top: '24%', backgroundColor: '#A7BAC3' },
  clockHandTwo: { position: 'absolute', width: '25%', height: 2, left: '49%', top: '49%', backgroundColor: '#A7BAC3', transform: [{ rotate: '28deg' }] },
  lastTradePrice: { color: '#A7BAC3', fontSize: wide ? 18 : 15, fontWeight: '800' },
  hiddenContext: { position: 'absolute', width: 1, height: 1, opacity: 0 },
});
