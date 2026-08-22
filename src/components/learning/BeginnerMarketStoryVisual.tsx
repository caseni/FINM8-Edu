import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { BeginnerEditorialImageVisual, hasBeginnerEditorialImage } from './BeginnerEditorialImageVisual';
import {
  BeginnerMarketStoryVisual as BeginnerMarketStoryVisualLegacy,
  isBeginnerMarketStoryAsset,
} from './BeginnerMarketStoryVisualLegacy';

export { isBeginnerMarketStoryAsset };

type Props = React.ComponentProps<typeof BeginnerMarketStoryVisualLegacy>;

export function BeginnerMarketStoryVisual(props: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;

  if (hasBeginnerEditorialImage(props.assetRef, props.role)) {
    return (
      <BeginnerEditorialImageVisual
        assetRef={props.assetRef}
        alt={props.alt}
        role={props.role}
        theme={props.theme}
      />
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
