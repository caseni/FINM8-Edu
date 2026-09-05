import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { BeginnerBidAskStoryVisual } from './BeginnerBidAskStoryVisual';
import { BeginnerEditorialImageVisual, hasBeginnerEditorialImage } from './BeginnerEditorialImageVisual';
import { BeginnerInstrumentMisconceptionVisual } from './BeginnerInstrumentMisconceptionVisual';
import { BeginnerInstrumentStoryVisual } from './BeginnerInstrumentStoryVisual';
import { BeginnerLiquidityStoryVisual } from './BeginnerLiquidityStoryVisual';
import { BeginnerOrderTypesStoryVisual } from './BeginnerOrderTypesStoryVisual';
import { BeginnerSlippageStoryVisual } from './BeginnerSlippageStoryVisual';
import {
  BeginnerMarketStoryVisual as BeginnerMarketStoryVisualLegacy,
  isBeginnerMarketStoryAsset,
} from './BeginnerMarketStoryVisualLegacy';

export { isBeginnerMarketStoryAsset };

type Props = React.ComponentProps<typeof BeginnerMarketStoryVisualLegacy>;

function ResponsiveVisualFrame({ wide, children }: { wide: boolean; children: React.ReactNode }) {
  return (
    <View
      style={{
        width: '100%',
        maxWidth: wide ? 680 : undefined,
        alignSelf: 'center',
      }}
    >
      {children}
    </View>
  );
}

export function BeginnerMarketStoryVisual(props: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;

  if (!props.assetRef.includes('fiyat-piyasada-nasil-olusur') && hasBeginnerEditorialImage(props.assetRef, props.role)) {
    return (
      <BeginnerEditorialImageVisual
        assetRef={props.assetRef}
        alt={props.alt}
        role={props.role}
        theme={props.theme}
      />
    );
  }

  if (props.assetRef.includes('piyasa-araclari-ayni-degildir')) {
    if (props.role === 'practice') return null;
    if (props.role === 'misconception') {
      return (
        <ResponsiveVisualFrame wide={wide}>
          <BeginnerInstrumentMisconceptionVisual
            alt={props.alt}
            language={props.language}
            theme={props.theme}
          />
        </ResponsiveVisualFrame>
      );
    }

    return (
      <ResponsiveVisualFrame wide={wide}>
        <BeginnerInstrumentStoryVisual
          alt={props.alt}
          language={props.language}
          role={props.role}
          theme={props.theme}
        />
      </ResponsiveVisualFrame>
    );
  }

  if (props.assetRef.includes('likidite-neden-onemlidir')) {
    return (
      <ResponsiveVisualFrame wide={wide}>
        <BeginnerLiquidityStoryVisual
          alt={props.alt}
          language={props.language}
          role={props.role}
          theme={props.theme}
        />
      </ResponsiveVisualFrame>
    );
  }

  if (props.assetRef.includes('bid-ask-spread-nedir')) {
    return (
      <ResponsiveVisualFrame wide={wide}>
        <BeginnerBidAskStoryVisual
          alt={props.alt}
          language={props.language}
          role={props.role}
          theme={props.theme}
        />
      </ResponsiveVisualFrame>
    );
  }

  if (props.assetRef.includes('piyasa-limit-stop-emirleri')) {
    return (
      <ResponsiveVisualFrame wide={wide}>
        <BeginnerOrderTypesStoryVisual
          alt={props.alt}
          language={props.language}
          role={props.role}
          theme={props.theme}
        />
      </ResponsiveVisualFrame>
    );
  }

  if (props.assetRef.includes('gerceklesme-fiyati-kayma')) {
    return (
      <ResponsiveVisualFrame wide={wide}>
        <BeginnerSlippageStoryVisual
          alt={props.alt}
          language={props.language}
          role={props.role}
          theme={props.theme}
        />
      </ResponsiveVisualFrame>
    );
  }

  return (
    <View
      style={{
        width: '100%',
        maxWidth: wide ? (props.role === 'practice' ? 680 : 540) : undefined,
        alignSelf: 'center',
      }}
    >
      <BeginnerMarketStoryVisualLegacy {...props} />
    </View>
  );
}
