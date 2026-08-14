import React from 'react';
import { StyleSheet, View } from 'react-native';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type Topic = 'breakout' | 'falseBreakout' | 'pullback' | 'range' | 'momentum' | 'movingAverage';

export interface AcademyTechnicalPremiumHookVisualProps {
  assetRef: string;
  alt: string;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('breakout-ne-zaman-anlamli')) return 'breakout';
  if (assetRef.includes('false-breakout-nasil-okunur')) return 'falseBreakout';
  if (assetRef.includes('pullback-trend-donusu-degildir')) return 'pullback';
  if (assetRef.includes('range-konsolidasyon-nasil-okunur')) return 'range';
  if (assetRef.includes('momentum-ne-anlatir')) return 'momentum';
  if (assetRef.includes('hareketli-ortalama-ne-yapar')) return 'movingAverage';
  return undefined;
}

export function isAcademyTechnicalPremiumHookAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function AcademyTechnicalPremiumHookVisual({
  assetRef,
  alt,
  theme = defaultLearningTheme,
}: AcademyTechnicalPremiumHookVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.gridHorizontalOne} />
      <View style={styles.gridHorizontalTwo} />
      <View style={styles.gridVerticalOne} />
      <View style={styles.gridVerticalTwo} />
      {topic === 'breakout' ? <BreakoutHero styles={styles} /> : null}
      {topic === 'falseBreakout' ? <FalseBreakoutHero styles={styles} /> : null}
      {topic === 'pullback' ? <PullbackHero styles={styles} /> : null}
      {topic === 'range' ? <RangeHero styles={styles} /> : null}
      {topic === 'momentum' ? <MomentumHero styles={styles} /> : null}
      {topic === 'movingAverage' ? <MovingAverageHero styles={styles} /> : null}
    </View>
  );
}

type S = ReturnType<typeof createStyles>;

function Segment({ styles, left, top, width, rotate, accent = false, muted = false }: { styles: S; left: `${number}%`; top: `${number}%`; width: `${number}%`; rotate: number; accent?: boolean; muted?: boolean }) {
  return <View style={[styles.segment, accent && styles.segmentAccent, muted && styles.segmentMuted, { left, top, width, transform: [{ rotate: `${rotate}deg` }] }]} />;
}

function Dot({ styles, left, top, accent = false, warn = false }: { styles: S; left: `${number}%`; top: `${number}%`; accent?: boolean; warn?: boolean }) {
  return <View style={[styles.dot, accent && styles.dotAccent, warn && styles.dotWarn, { left, top }]} />;
}

function BreakoutHero({ styles }: { styles: S }) {
  return (
    <View style={styles.stage}>
      <View style={[styles.zone, styles.zoneResistance, { top: '38%' }]} />
      <Segment styles={styles} left="8%" top="68%" width="23%" rotate={-18} />
      <Segment styles={styles} left="28%" top="61%" width="19%" rotate={14} />
      <Segment styles={styles} left="44%" top="55%" width="24%" rotate={-31} accent />
      <Segment styles={styles} left="64%" top="35%" width="17%" rotate={-8} accent />
      <Segment styles={styles} left="78%" top="31%" width="13%" rotate={-5} accent />
      <Dot styles={styles} left="66%" top="34%" accent />
      <Dot styles={styles} left="79%" top="30%" accent />
      <Dot styles={styles} left="89%" top="28%" accent />
      <View style={styles.acceptanceBand} />
    </View>
  );
}

function FalseBreakoutHero({ styles }: { styles: S }) {
  return (
    <View style={styles.stage}>
      <View style={[styles.zone, styles.zoneResistance, { top: '40%' }]} />
      <Segment styles={styles} left="8%" top="69%" width="24%" rotate={-17} />
      <Segment styles={styles} left="29%" top="61%" width="21%" rotate={12} />
      <Segment styles={styles} left="46%" top="54%" width="22%" rotate={-34} accent />
      <Dot styles={styles} left="64%" top="32%" accent />
      <Segment styles={styles} left="62%" top="33%" width="19%" rotate={38} muted />
      <Segment styles={styles} left="77%" top="49%" width="15%" rotate={18} muted />
      <Dot styles={styles} left="79%" top="49%" warn />
      <View style={styles.returnMarker} />
    </View>
  );
}

function PullbackHero({ styles }: { styles: S }) {
  return (
    <View style={styles.stage}>
      <View style={[styles.zone, styles.zoneSupport, { top: '64%' }]} />
      <Segment styles={styles} left="8%" top="72%" width="20%" rotate={-24} />
      <Segment styles={styles} left="25%" top="61%" width="19%" rotate={14} />
      <Segment styles={styles} left="41%" top="56%" width="22%" rotate={-25} accent />
      <Segment styles={styles} left="59%" top="45%" width="16%" rotate={24} muted />
      <Segment styles={styles} left="72%" top="49%" width="20%" rotate={-25} accent />
      <Dot styles={styles} left="61%" top="46%" />
      <Dot styles={styles} left="74%" top="50%" accent />
      <View style={styles.protectedLow} />
    </View>
  );
}

function RangeHero({ styles }: { styles: S }) {
  return (
    <View style={styles.stage}>
      <View style={[styles.zone, styles.zoneResistance, { top: '25%' }]} />
      <View style={[styles.zone, styles.zoneSupport, { top: '72%' }]} />
      <Segment styles={styles} left="8%" top="65%" width="18%" rotate={-31} />
      <Segment styles={styles} left="23%" top="50%" width="19%" rotate={27} />
      <Segment styles={styles} left="39%" top="59%" width="18%" rotate={-29} />
      <Segment styles={styles} left="54%" top="45%" width="18%" rotate={25} />
      <Segment styles={styles} left="69%" top="53%" width="19%" rotate={-28} accent />
      <Dot styles={styles} left="24%" top="39%" />
      <Dot styles={styles} left="41%" top="61%" />
      <Dot styles={styles} left="56%" top="35%" />
      <Dot styles={styles} left="72%" top="56%" />
    </View>
  );
}

function MomentumHero({ styles }: { styles: S }) {
  return (
    <View style={styles.stage}>
      <View style={styles.momentumLaneTop}>
        <Segment styles={styles} left="10%" top="59%" width="22%" rotate={-29} accent />
        <Segment styles={styles} left="28%" top="43%" width="22%" rotate={-28} accent />
        <Segment styles={styles} left="46%" top="28%" width="22%" rotate={-27} accent />
        <Segment styles={styles} left="64%" top="14%" width="22%" rotate={-25} accent />
      </View>
      <View style={styles.momentumLaneBottom}>
        <Segment styles={styles} left="10%" top="65%" width="22%" rotate={-18} muted />
        <Segment styles={styles} left="29%" top="56%" width="22%" rotate={-15} muted />
        <Segment styles={styles} left="48%" top="49%" width="22%" rotate={-11} muted />
        <Segment styles={styles} left="67%" top="45%" width="18%" rotate={-7} muted />
      </View>
      <View style={styles.speedMarkerFast}><View style={styles.speedTick} /><View style={styles.speedTick} /><View style={styles.speedTick} /></View>
      <View style={styles.speedMarkerSlow}><View style={styles.speedTickMuted} /><View style={styles.speedTickMuted} /></View>
    </View>
  );
}

function MovingAverageHero({ styles }: { styles: S }) {
  return (
    <View style={styles.stage}>
      <Segment styles={styles} left="6%" top="65%" width="13%" rotate={-18} muted />
      <Segment styles={styles} left="17%" top="61%" width="13%" rotate={28} muted />
      <Segment styles={styles} left="28%" top="68%" width="13%" rotate={-42} muted />
      <Segment styles={styles} left="38%" top="53%" width="13%" rotate={24} muted />
      <Segment styles={styles} left="49%" top="58%" width="13%" rotate={-35} muted />
      <Segment styles={styles} left="60%" top="45%" width="13%" rotate={22} muted />
      <Segment styles={styles} left="71%" top="49%" width="13%" rotate={-30} muted />
      <Segment styles={styles} left="82%" top="38%" width="10%" rotate={-8} muted />
      <View style={styles.averageTrack}>
        <View style={[styles.averageSegment, { left: '5%', top: '65%', width: '20%', transform: [{ rotate: '-8deg' }] }]} />
        <View style={[styles.averageSegment, { left: '23%', top: '61%', width: '20%', transform: [{ rotate: '-12deg' }] }]} />
        <View style={[styles.averageSegment, { left: '41%', top: '55%', width: '20%', transform: [{ rotate: '-14deg' }] }]} />
        <View style={[styles.averageSegment, { left: '59%', top: '48%', width: '20%', transform: [{ rotate: '-15deg' }] }]} />
        <View style={[styles.averageSegment, { left: '77%', top: '40%', width: '15%', transform: [{ rotate: '-12deg' }] }]} />
      </View>
    </View>
  );
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { width: '100%', minHeight: 300, overflow: 'hidden', borderRadius: 22, borderWidth: 1, borderColor: '#244B61', backgroundColor: '#071521', padding: 16 },
  stage: { flex: 1, minHeight: 266, position: 'relative', overflow: 'hidden', borderRadius: 18, backgroundColor: '#091B29', borderWidth: 1, borderColor: '#1D4054' },
  gridHorizontalOne: { position: 'absolute', left: 16, right: 16, top: '34%', height: 1, backgroundColor: '#102E40' },
  gridHorizontalTwo: { position: 'absolute', left: 16, right: 16, top: '67%', height: 1, backgroundColor: '#102E40' },
  gridVerticalOne: { position: 'absolute', top: 16, bottom: 16, left: '36%', width: 1, backgroundColor: '#102E40' },
  gridVerticalTwo: { position: 'absolute', top: 16, bottom: 16, left: '69%', width: 1, backgroundColor: '#102E40' },
  segment: { position: 'absolute', height: 5, borderRadius: 3, backgroundColor: '#6D8798' },
  segmentAccent: { backgroundColor: '#58DDCB' },
  segmentMuted: { backgroundColor: '#7891A0' },
  dot: { position: 'absolute', width: 11, height: 11, marginLeft: -5, marginTop: -5, borderRadius: 6, backgroundColor: '#90A6B4', borderWidth: 2, borderColor: '#0A1C29' },
  dotAccent: { backgroundColor: '#61E2D0' },
  dotWarn: { backgroundColor: '#C99465' },
  zone: { position: 'absolute', left: '6%', right: '6%', height: 22, borderRadius: 7, borderWidth: 1 },
  zoneResistance: { backgroundColor: '#30281F', borderColor: '#7E6545' },
  zoneSupport: { backgroundColor: '#0C3436', borderColor: '#2E716B' },
  acceptanceBand: { position: 'absolute', right: '8%', top: '18%', width: '30%', height: 48, borderRadius: 14, borderWidth: 1, borderColor: '#2C7E74', backgroundColor: '#0C3536', opacity: 0.72 },
  returnMarker: { position: 'absolute', right: '9%', top: '48%', width: 62, height: 62, borderRadius: 31, borderWidth: 2, borderColor: '#9A7150', opacity: 0.7 },
  protectedLow: { position: 'absolute', left: '54%', top: '64%', width: 94, height: 2, backgroundColor: '#55D5C4', opacity: 0.75 },
  momentumLaneTop: { position: 'absolute', left: 0, right: 0, top: 18, height: 105 },
  momentumLaneBottom: { position: 'absolute', left: 0, right: 0, bottom: 15, height: 105 },
  speedMarkerFast: { position: 'absolute', right: 18, top: 36, flexDirection: 'row', gap: 5 },
  speedMarkerSlow: { position: 'absolute', right: 18, bottom: 42, flexDirection: 'row', gap: 6 },
  speedTick: { width: 5, height: 28, borderRadius: 3, backgroundColor: '#58DDCB' },
  speedTickMuted: { width: 5, height: 18, borderRadius: 3, backgroundColor: '#7891A0' },
  averageTrack: { ...StyleSheet.absoluteFillObject },
  averageSegment: { position: 'absolute', height: 6, borderRadius: 3, backgroundColor: '#58DDCB' },
});
