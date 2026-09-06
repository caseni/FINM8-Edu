import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type Topic =
  | 'etf'
  | 'bond'
  | 'forex'
  | 'commodity'
  | 'correlation'
  | 'drawdown'
  | 'leverage'
  | 'concentration'
  | 'riskBudget'
  | 'construction';

export interface AcademyPremiumHookVisualProps {
  assetRef: string;
  alt: string;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('etf-nedir-nasil-calisir')) return 'etf';
  if (assetRef.includes('tahvil-fiyati-ve-getirisi')) return 'bond';
  if (assetRef.includes('forex-piyasasi-nasil-calisir')) return 'forex';
  if (assetRef.includes('emtia-piyasalari-nasil-calisir')) return 'commodity';
  if (assetRef.includes('korelasyon-ne-anlatir')) return 'correlation';
  if (assetRef.includes('drawdown-nedir')) return 'drawdown';
  if (assetRef.includes('kaldirac-riski-nasil-buyutur')) return 'leverage';
  if (assetRef.includes('yogunlasma-riski-nedir')) return 'concentration';
  if (assetRef.includes('risk-butcesi-nedir')) return 'riskBudget';
  if (assetRef.includes('portfoy-nasil-kurulur')) return 'construction';
  return undefined;
}

export function isAcademyPremiumHookAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function AcademyPremiumHookVisual({
  assetRef,
  alt,
  theme = defaultLearningTheme,
}: AcademyPremiumHookVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.ambientOne} />
      <View style={styles.ambientTwo} />
      {topic === 'etf' ? <EtfHero styles={styles} /> : null}
      {topic === 'bond' ? <BondHero styles={styles} /> : null}
      {topic === 'forex' ? <ForexHero styles={styles} /> : null}
      {topic === 'commodity' ? <CommodityHero styles={styles} /> : null}
      {topic === 'correlation' ? <CorrelationHero styles={styles} /> : null}
      {topic === 'drawdown' ? <DrawdownHero styles={styles} /> : null}
      {topic === 'leverage' ? <LeverageHero styles={styles} /> : null}
      {topic === 'concentration' ? <ConcentrationHero styles={styles} /> : null}
      {topic === 'riskBudget' ? <RiskBudgetHero styles={styles} /> : null}
      {topic === 'construction' ? <ConstructionHero styles={styles} /> : null}
    </View>
  );
}

type S = ReturnType<typeof createStyles>;

function EtfHero({ styles }: { styles: S }) {
  return (
    <View style={styles.centerStage}>
      <View style={styles.etfStack}>
        <View style={[styles.stackSheet, styles.stackSheetBack]} />
        <View style={[styles.stackSheet, styles.stackSheetMid]} />
        <View style={styles.etfFront}><Text style={styles.etfLabel}>ETF</Text></View>
      </View>
      <Text style={styles.mainArrow}>→</Text>
      <View style={styles.basket}>
        <View style={styles.basketRow}><AssetGlyph kind="circle" styles={styles} /><AssetGlyph kind="bars" styles={styles} /></View>
        <View style={styles.basketRow}><AssetGlyph kind="diamond" styles={styles} /><AssetGlyph kind="line" styles={styles} /></View>
      </View>
    </View>
  );
}

function AssetGlyph({ kind, styles }: { kind: 'circle' | 'bars' | 'diamond' | 'line'; styles: S }) {
  return (
    <View style={styles.assetGlyph}>
      {kind === 'circle' ? <View style={styles.glyphCircle} /> : null}
      {kind === 'bars' ? <View style={styles.glyphBars}><View style={[styles.glyphBar, { height: 16 }]} /><View style={[styles.glyphBar, { height: 28 }]} /><View style={[styles.glyphBar, { height: 22 }]} /></View> : null}
      {kind === 'diamond' ? <View style={styles.glyphDiamond} /> : null}
      {kind === 'line' ? <View style={styles.glyphLine}><View style={styles.glyphLineDot} /><View style={[styles.glyphLineDot, { top: 4, left: 17 }]} /><View style={[styles.glyphLineDot, { top: -4, left: 34 }]} /></View> : null}
    </View>
  );
}

function BondHero({ styles }: { styles: S }) {
  return (
    <View style={styles.bondStage}>
      <View style={styles.personNode}><View style={styles.personHead} /><View style={styles.personBody} /></View>
      <View style={styles.bondFlowColumn}><Text style={styles.flowArrow}>→</Text><View style={styles.flowDots}><View style={styles.flowDot} /><View style={styles.flowDot} /><View style={styles.flowDot} /></View><Text style={styles.flowArrow}>←</Text></View>
      <View style={styles.document}>
        <View style={styles.docSeal} />
        <View style={styles.docLineLong} /><View style={styles.docLine} /><View style={styles.docLine} />
        <View style={styles.docBottom}><View style={styles.docChip} /><View style={styles.docChip} /></View>
      </View>
    </View>
  );
}

function ForexHero({ styles }: { styles: S }) {
  return (
    <View style={styles.fxStage}>
      <View style={styles.fxCard}><Text style={styles.fxCode}>EUR</Text><Text style={styles.fxValue}>1.00</Text></View>
      <View style={styles.fxMiddle}><Text style={styles.fxSwap}>⇄</Text><View style={styles.fxPulse}><View style={[styles.fxPulseBar, { height: 16 }]} /><View style={[styles.fxPulseBar, { height: 30 }]} /><View style={[styles.fxPulseBar, { height: 22 }]} /><View style={[styles.fxPulseBar, { height: 38 }]} /></View></View>
      <View style={[styles.fxCard, styles.fxCardAccent]}><Text style={styles.fxCode}>USD</Text><Text style={styles.fxValue}>1.10</Text></View>
    </View>
  );
}

function CommodityHero({ styles }: { styles: S }) {
  return (
    <View style={styles.commodityStage}>
      <View style={styles.commodityPedestal}><View style={styles.goldBar}><View style={styles.goldInset} /></View></View>
      <View style={styles.commodityPedestal}><View style={styles.oilBarrel}><View style={styles.oilBand} /><View style={styles.oilBand} /></View></View>
      <View style={styles.commodityPedestal}><View style={styles.wheat}><View style={styles.wheatStem} /><View style={[styles.grain, styles.grainOne]} /><View style={[styles.grain, styles.grainTwo]} /><View style={[styles.grain, styles.grainThree]} /><View style={[styles.grain, styles.grainFour]} /></View></View>
    </View>
  );
}

function CorrelationHero({ styles }: { styles: S }) {
  return (
    <View style={styles.chartStage}>
      <View style={styles.chartGrid} />
      <View style={[styles.pathSegment, { width: '27%', transform: [{ rotate: '-18deg' }], left: '8%', top: '54%' }]} />
      <View style={[styles.pathSegment, { width: '24%', transform: [{ rotate: '22deg' }], left: '31%', top: '49%' }]} />
      <View style={[styles.pathSegment, { width: '25%', transform: [{ rotate: '-19deg' }], left: '50%', top: '42%' }]} />
      <View style={[styles.pathSegment, { width: '21%', transform: [{ rotate: '-10deg' }], left: '72%', top: '31%' }]} />
      <View style={[styles.pathSegment, styles.pathSecond, { width: '27%', transform: [{ rotate: '-18deg' }], left: '8%', top: '70%' }]} />
      <View style={[styles.pathSegment, styles.pathSecond, { width: '24%', transform: [{ rotate: '22deg' }], left: '31%', top: '65%' }]} />
      <View style={[styles.pathSegment, styles.pathSecond, { width: '25%', transform: [{ rotate: '-19deg' }], left: '50%', top: '58%' }]} />
      <View style={[styles.pathSegment, styles.pathSecond, { width: '21%', transform: [{ rotate: '-10deg' }], left: '72%', top: '47%' }]} />
    </View>
  );
}

function DrawdownHero({ styles }: { styles: S }) {
  return (
    <View style={styles.chartStage}>
      <View style={styles.chartGrid} />
      <View style={[styles.drawLine, { width: '30%', transform: [{ rotate: '-18deg' }], left: '8%', top: '34%' }]} />
      <View style={[styles.drawLine, styles.drawLineWarn, { width: '38%', transform: [{ rotate: '43deg' }], left: '31%', top: '48%' }]} />
      <View style={[styles.drawLine, { width: '36%', transform: [{ rotate: '-43deg' }], left: '58%', top: '48%' }]} />
      <View style={styles.drawSpan}><View style={styles.drawSpanTop} /><View style={styles.drawSpanBottom} /></View>
    </View>
  );
}

function LeverageHero({ styles }: { styles: S }) {
  return (
    <View style={styles.leverageStage}>
      <View style={styles.leverageCard}><Text style={styles.multiplier}>1×</Text><View style={styles.leverageBars}><View style={[styles.leverageBar, { height: 32 }]} /><View style={[styles.leverageBar, { height: 48 }]} /><View style={[styles.leverageBar, { height: 40 }]} /></View></View>
      <Text style={styles.mainArrow}>→</Text>
      <View style={[styles.leverageCard, styles.leverageCardAccent]}><Text style={styles.multiplier}>3×</Text><View style={styles.leverageBars}><View style={[styles.leverageBar, styles.leverageBarAccent, { height: 58 }]} /><View style={[styles.leverageBar, styles.leverageBarAccent, { height: 92 }]} /><View style={[styles.leverageBar, styles.leverageBarAccent, { height: 72 }]} /></View></View>
    </View>
  );
}

function ConcentrationHero({ styles }: { styles: S }) {
  return (
    <View style={styles.concentrationStage}>
      <View style={styles.holdingCloud}>{[0,1,2,3,4,5].map((i) => <View key={i} style={[styles.holdingDot, i % 2 === 0 && styles.holdingDotAccent]} />)}</View>
      <View style={styles.funnelStem} />
      <View style={styles.sharedRisk}><View style={styles.sharedRiskInner} /></View>
    </View>
  );
}

function RiskBudgetHero({ styles }: { styles: S }) {
  return (
    <View style={styles.budgetStage}>
      <View style={styles.budgetTrack}><View style={[styles.budgetPart, { width: '50%' }]}><Text style={styles.budgetNumber}>50</Text></View><View style={[styles.budgetPart, styles.budgetPartMuted, { width: '50%' }]}><Text style={styles.budgetNumber}>50</Text></View></View>
      <Text style={styles.budgetArrow}>↓</Text>
      <View style={styles.budgetTrack}><View style={[styles.budgetPart, styles.budgetPartWarn, { width: '75%' }]}><Text style={styles.budgetNumber}>75</Text></View><View style={[styles.budgetPart, styles.budgetPartMuted, { width: '25%' }]}><Text style={styles.budgetNumber}>25</Text></View></View>
    </View>
  );
}

function ConstructionHero({ styles }: { styles: S }) {
  return (
    <View style={styles.planStage}>
      <View style={[styles.planNode, styles.planNodeAccent]}><View style={styles.targetOuter}><View style={styles.targetInner} /></View></View>
      <Text style={styles.planArrow}>→</Text>
      <View style={styles.planNode}><View style={styles.clockFace}><View style={styles.clockHandOne} /><View style={styles.clockHandTwo} /></View></View>
      <Text style={styles.planArrow}>→</Text>
      <View style={styles.planNode}><View style={styles.splitIcon}><View style={styles.splitTop} /><View style={styles.splitLeft} /><View style={styles.splitRight} /></View></View>
      <Text style={styles.planArrow}>→</Text>
      <View style={styles.planNode}><View style={styles.reviewRing}><View style={styles.reviewGap} /></View></View>
    </View>
  );
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { width: '100%', minHeight: 300, overflow: 'hidden', borderRadius: 22, borderWidth: 1, borderColor: '#244B61', backgroundColor: '#071521', padding: 18, justifyContent: 'center' },
  ambientOne: { position: 'absolute', width: 220, height: 220, borderRadius: 110, borderWidth: 1, borderColor: '#12364A', right: -90, top: -100 },
  ambientTwo: { position: 'absolute', width: 150, height: 150, borderRadius: 75, borderWidth: 1, borderColor: '#113043', left: -74, bottom: -84 },
  centerStage: { minHeight: 230, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 },
  mainArrow: { color: '#54D8C6', fontSize: 28, fontWeight: '900' },
  etfStack: { width: 104, height: 116, alignItems: 'center', justifyContent: 'center' },
  stackSheet: { position: 'absolute', width: 74, height: 88, borderRadius: 16, borderWidth: 1, borderColor: '#2B5368', backgroundColor: '#102638' },
  stackSheetBack: { transform: [{ rotate: '-13deg' }], left: 3, top: 8 },
  stackSheetMid: { transform: [{ rotate: '11deg' }], right: 3, top: 8, backgroundColor: '#0D2D35', borderColor: '#2C706B' },
  etfFront: { width: 82, height: 96, borderRadius: 18, borderWidth: 1, borderColor: '#2F9788', backgroundColor: '#0B3938', alignItems: 'center', justifyContent: 'center' },
  etfLabel: { color: '#72F1DE', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  basket: { width: 150, minHeight: 146, borderRadius: 24, borderWidth: 1, borderColor: '#315268', backgroundColor: '#0C2030', padding: 12, gap: 10, justifyContent: 'center' },
  basketRow: { flexDirection: 'row', gap: 10 },
  assetGlyph: { flex: 1, minHeight: 54, borderRadius: 14, backgroundColor: '#142C3F', alignItems: 'center', justifyContent: 'center' },
  glyphCircle: { width: 25, height: 25, borderRadius: 13, borderWidth: 5, borderColor: '#63DACB' },
  glyphBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 32 },
  glyphBar: { width: 6, borderRadius: 3, backgroundColor: '#7CA0B6' },
  glyphDiamond: { width: 24, height: 24, borderRadius: 4, backgroundColor: '#806E4D', transform: [{ rotate: '45deg' }] },
  glyphLine: { width: 52, height: 34, position: 'relative', borderBottomWidth: 2, borderBottomColor: '#4ECDBD', transform: [{ rotate: '-12deg' }] },
  glyphLineDot: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: '#60E3D1', bottom: -5, left: 2 },
  bondStage: { minHeight: 230, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', gap: 12 },
  personNode: { width: 76, height: 112, alignItems: 'center', justifyContent: 'center' },
  personHead: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#50758A' },
  personBody: { marginTop: 8, width: 62, height: 48, borderTopLeftRadius: 30, borderTopRightRadius: 30, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, backgroundColor: '#173146', borderWidth: 1, borderColor: '#355A70' },
  bondFlowColumn: { alignItems: 'center', gap: 7 },
  flowArrow: { color: '#55D9C7', fontSize: 26, fontWeight: '900' },
  flowDots: { flexDirection: 'row', gap: 6 },
  flowDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#7C6E50', borderWidth: 1, borderColor: '#B39A65' },
  document: { width: 150, height: 172, borderRadius: 16, borderWidth: 1, borderColor: '#4E6A78', backgroundColor: '#D9E0E1', padding: 16, alignItems: 'center' },
  docSeal: { width: 34, height: 34, borderRadius: 17, borderWidth: 4, borderColor: '#566C72', marginBottom: 18 },
  docLineLong: { width: '78%', height: 7, borderRadius: 4, backgroundColor: '#70838A', marginBottom: 10 },
  docLine: { width: '58%', height: 5, borderRadius: 3, backgroundColor: '#90A0A4', marginBottom: 8 },
  docBottom: { marginTop: 'auto', width: '100%', flexDirection: 'row', justifyContent: 'space-between' },
  docChip: { width: 46, height: 22, borderRadius: 6, backgroundColor: '#B4C0C2' },
  fxStage: { minHeight: 230, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  fxCard: { width: 112, height: 142, borderRadius: 24, borderWidth: 1, borderColor: '#355B72', backgroundColor: '#10273A', alignItems: 'center', justifyContent: 'center', gap: 8 },
  fxCardAccent: { borderColor: '#2C8C7E', backgroundColor: '#0D3738' },
  fxCode: { color: '#9BB5C5', fontSize: 13, fontWeight: '900', letterSpacing: 1.3 },
  fxValue: { color: theme.colors.text, fontSize: 25, fontWeight: '900' },
  fxMiddle: { alignItems: 'center', gap: 18 },
  fxSwap: { color: '#60E3D1', fontSize: 32, fontWeight: '900' },
  fxPulse: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 42 },
  fxPulseBar: { width: 5, borderRadius: 3, backgroundColor: '#557D92' },
  commodityStage: { minHeight: 230, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', gap: 14, paddingHorizontal: 8 },
  commodityPedestal: { flex: 1, minHeight: 160, borderRadius: 22, borderWidth: 1, borderColor: '#294A60', backgroundColor: '#0C2030', alignItems: 'center', justifyContent: 'center' },
  goldBar: { width: 76, height: 52, borderRadius: 10, backgroundColor: '#8C7040', borderWidth: 1, borderColor: '#C5A55E', transform: [{ skewX: '-8deg' }], padding: 8 },
  goldInset: { flex: 1, borderRadius: 5, borderWidth: 1, borderColor: '#CBB16A' },
  oilBarrel: { width: 64, height: 94, borderRadius: 18, backgroundColor: '#314B5C', borderWidth: 1, borderColor: '#6A8190', justifyContent: 'space-around', paddingVertical: 13 },
  oilBand: { height: 5, backgroundColor: '#8195A1' },
  wheat: { width: 65, height: 112, position: 'relative', alignItems: 'center', justifyContent: 'flex-end' },
  wheatStem: { width: 4, height: 94, borderRadius: 2, backgroundColor: '#8E8157' },
  grain: { position: 'absolute', width: 17, height: 10, borderRadius: 7, backgroundColor: '#B4A168' },
  grainOne: { top: 12, left: 13, transform: [{ rotate: '-28deg' }] },
  grainTwo: { top: 31, right: 12, transform: [{ rotate: '28deg' }] },
  grainThree: { top: 51, left: 12, transform: [{ rotate: '-28deg' }] },
  grainFour: { top: 72, right: 12, transform: [{ rotate: '28deg' }] },
  chartStage: { minHeight: 230, position: 'relative', borderRadius: 20, borderWidth: 1, borderColor: '#274A5E', backgroundColor: '#0A1D2B', overflow: 'hidden' },
  chartGrid: { position: 'absolute', left: 22, right: 22, top: 22, bottom: 22, borderLeftWidth: 1, borderBottomWidth: 1, borderColor: '#1B3C50' },
  pathSegment: { position: 'absolute', height: 4, borderRadius: 2, backgroundColor: '#57DDCB' },
  pathSecond: { backgroundColor: '#7995A6' },
  drawLine: { position: 'absolute', height: 5, borderRadius: 3, backgroundColor: '#57DDCB' },
  drawLineWarn: { backgroundColor: '#C39163' },
  drawSpan: { position: 'absolute', width: 34, height: 104, borderLeftWidth: 2, borderLeftColor: '#D3A26F', left: '52%', top: '34%' },
  drawSpanTop: { position: 'absolute', top: 0, left: -7, width: 14, height: 2, backgroundColor: '#D3A26F' },
  drawSpanBottom: { position: 'absolute', bottom: 0, left: -7, width: 14, height: 2, backgroundColor: '#D3A26F' },
  leverageStage: { minHeight: 230, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
  leverageCard: { width: 120, height: 166, borderRadius: 22, borderWidth: 1, borderColor: '#34566C', backgroundColor: '#102638', padding: 14, alignItems: 'center', justifyContent: 'space-between' },
  leverageCardAccent: { borderColor: '#397B71', backgroundColor: '#0D3435' },
  multiplier: { color: theme.colors.text, fontSize: 22, fontWeight: '900' },
  leverageBars: { height: 104, flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  leverageBar: { width: 15, borderRadius: 6, backgroundColor: '#6E899A' },
  leverageBarAccent: { backgroundColor: '#58D8C7' },
  concentrationStage: { minHeight: 230, alignItems: 'center', justifyContent: 'center' },
  holdingCloud: { width: 236, flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center' },
  holdingDot: { width: 58, height: 58, borderRadius: 18, borderWidth: 1, borderColor: '#35576C', backgroundColor: '#142B3D' },
  holdingDotAccent: { borderColor: '#34786E', backgroundColor: '#103334' },
  funnelStem: { width: 3, height: 36, backgroundColor: '#4FCFBE', marginVertical: 5 },
  sharedRisk: { width: 96, height: 58, borderRadius: 29, borderWidth: 1, borderColor: '#946F4B', backgroundColor: '#2B231B', alignItems: 'center', justifyContent: 'center' },
  sharedRiskInner: { width: 54, height: 8, borderRadius: 4, backgroundColor: '#C18B59' },
  budgetStage: { minHeight: 230, justifyContent: 'center', gap: 16, paddingHorizontal: 8 },
  budgetTrack: { width: '100%', height: 70, flexDirection: 'row', borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#31546A' },
  budgetPart: { height: '100%', backgroundColor: '#14514D', alignItems: 'center', justifyContent: 'center' },
  budgetPartMuted: { backgroundColor: '#1A3042' },
  budgetPartWarn: { backgroundColor: '#6B4931' },
  budgetNumber: { color: '#E8EFF3', fontSize: 19, fontWeight: '900' },
  budgetArrow: { color: '#58D8C7', fontSize: 24, fontWeight: '900', textAlign: 'center' },
  planStage: { minHeight: 230, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  planNode: { width: 58, height: 74, borderRadius: 18, borderWidth: 1, borderColor: '#35566A', backgroundColor: '#102638', alignItems: 'center', justifyContent: 'center' },
  planNodeAccent: { borderColor: '#2E887B', backgroundColor: '#0D3637' },
  planArrow: { color: '#4FCFBE', fontSize: 18, fontWeight: '900' },
  targetOuter: { width: 34, height: 34, borderRadius: 17, borderWidth: 4, borderColor: '#65DCCC', alignItems: 'center', justifyContent: 'center' },
  targetInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#65DCCC' },
  clockFace: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: '#87A0AE', position: 'relative' },
  clockHandOne: { position: 'absolute', width: 2, height: 12, backgroundColor: '#87A0AE', left: 17, top: 5 },
  clockHandTwo: { position: 'absolute', width: 10, height: 2, backgroundColor: '#87A0AE', left: 17, top: 16, transform: [{ rotate: '28deg' }] },
  splitIcon: { width: 38, height: 38, position: 'relative' },
  splitTop: { position: 'absolute', width: 14, height: 14, borderRadius: 7, backgroundColor: '#7795A6', left: 12, top: 0 },
  splitLeft: { position: 'absolute', width: 14, height: 14, borderRadius: 7, backgroundColor: '#57D4C3', left: 0, bottom: 0 },
  splitRight: { position: 'absolute', width: 14, height: 14, borderRadius: 7, backgroundColor: '#7795A6', right: 0, bottom: 0 },
  reviewRing: { width: 38, height: 38, borderRadius: 19, borderWidth: 4, borderColor: '#7492A3', position: 'relative' },
  reviewGap: { position: 'absolute', width: 12, height: 12, backgroundColor: '#102638', right: -6, top: -5 },
});
