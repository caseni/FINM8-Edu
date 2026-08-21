import React from 'react';
import { BeginnerEditorialImageVisual, hasBeginnerEditorialImage } from './BeginnerEditorialImageVisual';
import {
  BeginnerMarketStoryVisual as BeginnerMarketStoryVisualLegacy,
  isBeginnerMarketStoryAsset,
} from './BeginnerMarketStoryVisualLegacy';

export { isBeginnerMarketStoryAsset };

type Props = React.ComponentProps<typeof BeginnerMarketStoryVisualLegacy>;

export function BeginnerMarketStoryVisual(props: Props) {
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

  return <BeginnerMarketStoryVisualLegacy {...props} />;
}
