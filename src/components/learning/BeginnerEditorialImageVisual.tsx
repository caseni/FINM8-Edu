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
  {
    match: 'piyasa-araclari-ayni-degildir',
    role: 'hook',
    source: require('../../../assets/learning/beginner/markets/asset-classes-hook.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'piyasa-araclari-ayni-degildir',
    role: 'concept',
    source: require('../../../assets/learning/beginner/markets/asset-classes-concept.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'piyasa-araclari-ayni-degildir',
    role: 'misconception',
    source: require('../../../assets/learning/beginner/markets/asset-classes-misconception.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'piyasa-araclari-ayni-degildir',
    role: 'summary',
    source: require('../../../assets/learning/beginner/markets/asset-classes-summary.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'likidite-neden-onemlidir',
    role: 'hook',
    source: require('../../../assets/learning/beginner/markets/liquidity-hook.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'likidite-neden-onemlidir',
    role: 'concept',
    source: require('../../../assets/learning/beginner/markets/liquidity-concept.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'likidite-neden-onemlidir',
    role: 'practice',
    source: require('../../../assets/learning/beginner/markets/liquidity-practice.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'likidite-neden-onemlidir',
    role: 'misconception',
    source: require('../../../assets/learning/beginner/markets/liquidity-misconception.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'likidite-neden-onemlidir',
    role: 'summary',
    source: require('../../../assets/learning/beginner/markets/liquidity-summary.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'bid-ask-spread-nedir',
    role: 'hook',
    source: require('../../../assets/learning/beginner/markets/bid-ask-hook.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'bid-ask-spread-nedir',
    role: 'concept',
    source: require('../../../assets/learning/beginner/markets/bid-ask-concept.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'bid-ask-spread-nedir',
    role: 'practice',
    source: require('../../../assets/learning/beginner/markets/bid-ask-practice.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'bid-ask-spread-nedir',
    role: 'misconception',
    source: require('../../../assets/learning/beginner/markets/bid-ask-misconception.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'bid-ask-spread-nedir',
    role: 'summary',
    source: require('../../../assets/learning/beginner/markets/bid-ask-summary.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'piyasa-limit-stop-emirleri',
    role: 'hook',
    source: require('../../../assets/learning/beginner/markets/order-types-hook.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'piyasa-limit-stop-emirleri',
    role: 'concept',
    source: require('../../../assets/learning/beginner/markets/order-types-concept.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'piyasa-limit-stop-emirleri',
    role: 'practice',
    source: require('../../../assets/learning/beginner/markets/order-types-practice.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'piyasa-limit-stop-emirleri',
    role: 'misconception',
    source: require('../../../assets/learning/beginner/markets/order-types-misconception.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'piyasa-limit-stop-emirleri',
    role: 'summary',
    source: require('../../../assets/learning/beginner/markets/order-types-summary.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'gerceklesme-fiyati-kayma',
    role: 'hook',
    source: require('../../../assets/learning/beginner/markets/slippage-hook.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'gerceklesme-fiyati-kayma',
    role: 'concept',
    source: require('../../../assets/learning/beginner/markets/slippage-concept.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'gerceklesme-fiyati-kayma',
    role: 'practice',
    source: require('../../../assets/learning/beginner/markets/slippage-practice.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'gerceklesme-fiyati-kayma',
    role: 'misconception',
    source: require('../../../assets/learning/beginner/markets/slippage-misconception.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'gerceklesme-fiyati-kayma',
    role: 'summary',
    source: require('../../../assets/learning/beginner/markets/slippage-summary.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'enflasyon-satin-alma-gucu',
    role: 'hook',
    source: require('../../../assets/learning/beginner/economy/inflation-purchasing-power-hook.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'enflasyon-satin-alma-gucu',
    role: 'concept',
    source: require('../../../assets/learning/beginner/economy/inflation-purchasing-power-concept.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'enflasyon-satin-alma-gucu',
    role: 'practice',
    source: require('../../../assets/learning/beginner/economy/inflation-purchasing-power-practice.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'enflasyon-satin-alma-gucu',
    role: 'misconception',
    source: require('../../../assets/learning/beginner/economy/inflation-purchasing-power-misconception.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'enflasyon-satin-alma-gucu',
    role: 'summary',
    source: require('../../../assets/learning/beginner/economy/inflation-purchasing-power-summary.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'faiz-orani-ne-anlatir',
    role: 'hook',
    source: require('../../../assets/learning/beginner/economy/interest-rate-hook.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'faiz-orani-ne-anlatir',
    role: 'concept',
    source: require('../../../assets/learning/beginner/economy/interest-rate-concept.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'faiz-orani-ne-anlatir',
    role: 'practice',
    source: require('../../../assets/learning/beginner/economy/interest-rate-practice.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'faiz-orani-ne-anlatir',
    role: 'summary',
    source: require('../../../assets/learning/beginner/economy/interest-rate-summary.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'merkez-bankasi-ne-yapar',
    role: 'hook',
    source: require('../../../assets/learning/beginner/economy/central-bank-hook.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'merkez-bankasi-ne-yapar',
    role: 'concept',
    source: require('../../../assets/learning/beginner/economy/central-bank-concept.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'merkez-bankasi-ne-yapar',
    role: 'misconception',
    source: require('../../../assets/learning/beginner/economy/central-bank-misconception.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'merkez-bankasi-ne-yapar',
    role: 'summary',
    source: require('../../../assets/learning/beginner/economy/central-bank-summary.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'faiz-karari-ekonomiye-nasil-yansir',
    role: 'hook',
    source: require('../../../assets/learning/beginner/economy/rate-transmission-hook.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'faiz-karari-ekonomiye-nasil-yansir',
    role: 'concept',
    source: require('../../../assets/learning/beginner/economy/rate-transmission-concept.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'faiz-karari-ekonomiye-nasil-yansir',
    role: 'practice',
    source: require('../../../assets/learning/beginner/economy/rate-transmission-practice.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'faiz-karari-ekonomiye-nasil-yansir',
    role: 'summary',
    source: require('../../../assets/learning/beginner/economy/rate-transmission-summary.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'gsyh-buyume-ne-anlatir',
    role: 'hook',
    source: require('../../../assets/learning/beginner/economy/gdp-growth-hook.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'gsyh-buyume-ne-anlatir',
    role: 'concept',
    source: require('../../../assets/learning/beginner/economy/gdp-growth-concept.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'gsyh-buyume-ne-anlatir',
    role: 'misconception',
    source: require('../../../assets/learning/beginner/economy/gdp-growth-misconception.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'gsyh-buyume-ne-anlatir',
    role: 'summary',
    source: require('../../../assets/learning/beginner/economy/gdp-growth-summary.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'ekonomik-dongu-resesyon',
    role: 'hook',
    source: require('../../../assets/learning/beginner/economy/business-cycle-hook.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'ekonomik-dongu-resesyon',
    role: 'concept',
    source: require('../../../assets/learning/beginner/economy/business-cycle-concept.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'ekonomik-dongu-resesyon',
    role: 'practice',
    source: require('../../../assets/learning/beginner/economy/business-cycle-practice.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'ekonomik-dongu-resesyon',
    role: 'misconception',
    source: require('../../../assets/learning/beginner/economy/business-cycle-misconception.webp'),
    aspectRatio: 1.5,
    compactAspectRatio: 1.5,
    resizeMode: 'contain',
    desktopMaxWidth: 620,
    compactMaxWidth: 460,
  },
  {
    match: 'ekonomik-dongu-resesyon',
    role: 'summary',
    source: require('../../../assets/learning/beginner/economy/business-cycle-summary.webp'),
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

export function beginnerEditorialImageSource(
  assetRef: string,
  role: LessonSupportingVisualRole
): ImageSourcePropType | undefined {
  return entryFor(assetRef, role)?.source;
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
