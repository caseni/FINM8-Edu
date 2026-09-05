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

type Topic = 'inflation' | 'rates' | 'centralBank' | 'policy' | 'growth' | 'cycle';
type Props = { assetRef: string; alt: string; language: LearningLanguage; role: LessonSupportingVisualRole; theme?: LearningTheme };
type Styles = ReturnType<typeof createStyles>;
type SceneProps = { tr: boolean; role: LessonSupportingVisualRole; styles: Styles };
type ArtworkSet = Record<LessonSupportingVisualRole, ImageSourcePropType>;

const economySvgArtwork: Partial<Record<Topic, ArtworkSet>> = {
  inflation: {
    hook: require('../../../assets/learning/beginner/economy/inflation-hook.svg'),
    concept: require('../../../assets/learning/beginner/economy/inflation-concept.svg'),
    practice: require('../../../assets/learning/beginner/economy/inflation-practice.svg'),
    misconception: require('../../../assets/learning/beginner/economy/inflation-misconception.svg'),
    risk: require('../../../assets/learning/beginner/economy/inflation-misconception.svg'),
    summary: require('../../../assets/learning/beginner/economy/inflation-summary.svg'),
  },
  rates: {
    hook: require('../../../assets/learning/beginner/economy/rates-hook.svg'),
    concept: require('../../../assets/learning/beginner/economy/rates-concept.svg'),
    practice: require('../../../assets/learning/beginner/economy/rates-practice.svg'),
    misconception: require('../../../assets/learning/beginner/economy/rates-misconception.svg'),
    risk: require('../../../assets/learning/beginner/economy/rates-misconception.svg'),
    summary: require('../../../assets/learning/beginner/economy/rates-summary.svg'),
  },
};

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('enflasyon-satin-alma-gucu')) return 'inflation';
  if (assetRef.includes('faiz-orani-ne-anlatir')) return 'rates';
  if (assetRef.includes('merkez-bankasi-ne-yapar')) return 'centralBank';
  if (assetRef.includes('faiz-karari-ekonomiye-nasil-yansir')) return 'policy';
  if (assetRef.includes('gsyh-buyume-ne-anlatir')) return 'growth';
  if (assetRef.includes('ekonomik-dongu-resesyon')) return 'cycle';
  return undefined;
}

function topicKey(topic: Topic): string { return topic === 'centralBank' ? 'central-bank' : topic; }
function roleKey(role: LessonSupportingVisualRole): Exclude<LessonSupportingVisualRole, 'risk'> { return role === 'risk' ? 'misconception' : role; }
export function isBeginnerEconomyStoryAsset(assetRef: string): boolean { return Boolean(topicForAsset(assetRef)); }

export function BeginnerEconomyStoryVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: Props) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const phone = width < 420;
  const styles = createStyles(theme, wide, phone);
  const tr = language === 'tr';
  const semanticRole = roleKey(role);
  const webArtwork = economySvgArtwork[topic]?.[role];
  const useSvg = Platform.OS === 'web' && Boolean(webArtwork);

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.glow} />
      <View style={[styles.board, useSvg && styles.svgBoard]} accessibilityLabel={`economy-${topicKey(topic)}-${semanticRole}-board`}>
        {useSvg && webArtwork ? <Image source={webArtwork} resizeMode="contain" style={styles.webArtwork} /> : null}
        {!useSvg && topic === 'inflation' ? <InflationScene tr={tr} role={role} styles={styles} /> : null}
        {!useSvg && topic === 'rates' ? <RatesScene tr={tr} role={role} styles={styles} /> : null}
        {topic === 'centralBank' ? <CentralBankScene tr={tr} role={role} styles={styles} /> : null}
        {topic === 'policy' ? <PolicyScene tr={tr} role={role} styles={styles} /> : null}
        {topic === 'growth' ? <GrowthScene tr={tr} role={role} styles={styles} /> : null}
        {topic === 'cycle' ? <CycleScene tr={tr} role={role} styles={styles} /> : null}
      </View>
    </View>
  );
}

function InflationScene({ tr, role, styles }: SceneProps) {
  const r = roleKey(role);
  if (r === 'misconception') return <View style={styles.scene}><View style={styles.itemFocus}><View style={styles.singleItem} /><Text style={styles.valueText}>↑</Text></View><Text style={styles.notEqual}>≠</Text><View style={styles.broadBasket}><Goods count={6} styles={styles} /><Text style={styles.micro}>{tr ? 'GENİŞ SEPET' : 'WIDER BASKET'}</Text></View></View>;
  const beforeCount = r === 'practice' ? 5 : 6;
  return <View style={styles.scene}><View style={styles.moneyToken}><Text style={styles.moneyText}>100 TL</Text></View><View style={styles.longArrow}><View style={styles.longArrowLine} /><Text style={styles.longArrowHead}>›</Text></View><View style={styles.basketPair}>{r === 'hook' ? null : <Basket count={beforeCount} label={tr ? 'ÖNCE' : 'BEFORE'} styles={styles} />}<Basket count={3} label={r === 'hook' ? (tr ? 'BUGÜN' : 'TODAY') : (tr ? 'SONRA' : 'AFTER')} styles={styles} accent /></View></View>;
}

function RatesScene({ tr, role, styles }: SceneProps) {
  const r = roleKey(role);
  if (r === 'practice') return <View style={styles.sceneVertical}><View style={styles.factorOrbit}><Factor label={tr ? 'FAİZ' : 'RATE'} active styles={styles} /><Factor label={tr ? 'SÜRE' : 'TERM'} styles={styles} /><Factor label={tr ? 'RİSK' : 'RISK'} styles={styles} /></View><View style={styles.centerDot} /></View>;
  if (r === 'misconception') return <View style={styles.scene}><LoanMark label="A" value="% ?" styles={styles} /><View style={styles.splitMark}><View style={styles.splitLine} /><View style={styles.splitLine} /></View><LoanMark label="B" value="% ?" styles={styles} accent /></View>;
  return <View style={styles.scene}><View style={styles.rateGauge}><Text style={styles.micro}>{tr ? 'FAİZ' : 'RATE'}</Text><Text style={styles.bigArrow}>↑</Text></View><View style={styles.longArrow}><View style={styles.longArrowLine} /><Text style={styles.longArrowHead}>›</Text></View><View style={styles.coinStack}>{[0, 1, 2, 3].map((item) => <View key={item} style={[styles.coinBar, { width: `${62 + item * 10}%` }]} />)}<Text style={styles.micro}>{tr ? 'BORÇ MALİYETİ' : 'BORROWING COST'}</Text></View></View>;
}

function CentralBankScene({ tr, role, styles }: SceneProps) {
  const r = roleKey(role);
  return <View style={styles.scene}><Bank styles={styles} /><View style={styles.influenceField}><View style={styles.influenceLine} /><View style={styles.influenceLine} /><View style={styles.influenceLine} /></View><View style={styles.influenceTargets}><Target label={tr ? 'FAİZ' : 'RATE'} styles={styles} /><Target label={tr ? 'KREDİ' : 'CREDIT'} styles={styles} /><Target label={r === 'misconception' ? (tr ? 'KOŞULLAR' : 'CONDITIONS') : (tr ? 'HARCAMA' : 'SPENDING')} styles={styles} muted={r === 'misconception'} /></View>{r === 'misconception' ? <Text style={styles.notEqualSmall}>≠ {tr ? 'TEK TEK FİYAT' : 'EACH PRICE'}</Text> : null}</View>;
}

function PolicyScene({ tr, role, styles }: SceneProps) {
  const r = roleKey(role);
  return <View style={styles.timelineScene}><TimelinePoint index="1" label={tr ? 'KARAR' : 'DECISION'} active styles={styles} /><TimelineConnector dotted={r === 'misconception'} styles={styles} /><TimelinePoint index="2" label={tr ? 'KREDİ' : 'CREDIT'} styles={styles} /><TimelineConnector styles={styles} /><TimelinePoint index="3" label={tr ? 'HARCAMA' : 'SPENDING'} styles={styles} />{r === 'hook' || r === 'misconception' ? <Text style={styles.timeHint}>{tr ? 'ZAMANLA →' : 'OVER TIME →'}</Text> : null}</View>;
}

function GrowthScene({ tr, role, styles }: SceneProps) {
  const r = roleKey(role);
  if (r === 'misconception') return <View style={styles.scene}><View style={styles.activityMark}><Text style={styles.bigValue}>↑</Text><Text style={styles.micro}>{tr ? 'TOPLAM FAALİYET' : 'TOTAL ACTIVITY'}</Text></View><Text style={styles.notEqual}>≠</Text><View style={styles.peopleIncomeMark}><Text style={styles.bigValue}>?</Text><Text style={styles.micro}>{tr ? 'HERKESİN GELİRİ' : 'EVERYONE’S INCOME'}</Text></View></View>;
  return <View style={styles.growthScene}><ProductionCluster styles={styles} /><View style={styles.longArrow}><View style={styles.longArrowLine} /><Text style={styles.longArrowHead}>›</Text></View><View style={styles.growthMeter}><Text style={styles.smallValue}>100</Text><View style={styles.growthTrack}><View style={styles.growthFill} /></View><Text style={styles.bigValue}>{r === 'practice' ? '105' : '↑'}</Text></View></View>;
}

function CycleScene({ tr, role, styles }: SceneProps) {
  const r = roleKey(role);
  const values = r === 'misconception' ? [72, 69, 28] : r === 'practice' ? [52, 44, 36] : [70, 52, 34];
  const labels = tr ? ['HARCAMA', 'ÜRETİM', 'İŞE ALIM'] : ['SPENDING', 'OUTPUT', 'HIRING'];
  return <View style={styles.cycleScene}>{labels.map((label, index) => <View key={label} style={styles.cycleRow}><Text style={styles.cycleLabel}>{label}</Text><View style={styles.cycleTrack}><View style={[styles.cycleFill, { width: `${values[index]}%` }]} /></View></View>)}{r === 'misconception' ? <Text style={styles.oneDataHint}>{tr ? 'TEK ZAYIF VERİ  ≠  GENİŞ YAVAŞLAMA' : 'ONE WEAK POINT  ≠  BROAD SLOWDOWN'}</Text> : null}</View>;
}

function Goods({ count, styles }: { count: number; styles: Styles }) { return <View style={styles.goods}>{Array.from({ length: count }).map((_, index) => <View key={index} style={[styles.goodDot, index % 2 ? styles.goodDotMuted : styles.goodDotAccent]} />)}</View>; }
function Basket({ count, label, styles, accent = false }: { count: number; label: string; styles: Styles; accent?: boolean }) { return <View style={styles.basketScene}><Text style={[styles.micro, accent && styles.microAccent]}>{label}</Text><Goods count={count} styles={styles} /><View style={[styles.basket, accent && styles.basketAccent]}><View style={styles.basketLine} /><View style={styles.basketLine} /></View></View>; }
function Factor({ label, active = false, styles }: { label: string; active?: boolean; styles: Styles }) { return <View style={[styles.factor, active && styles.factorActive]}><View style={[styles.factorDot, active && styles.factorDotActive]} /><Text style={styles.micro}>{label}</Text></View>; }
function LoanMark({ label, value, accent = false, styles }: { label: string; value: string; accent?: boolean; styles: Styles }) { return <View style={styles.loanMark}><Text style={styles.micro}>{label}</Text><Text style={[styles.bigValue, accent && styles.accentText]}>{value}</Text></View>; }
function Bank({ styles }: { styles: Styles }) { return <View style={styles.bank}><View style={styles.bankRoof} /><View style={styles.bankHall}>{[0, 1, 2, 3].map((item) => <View key={item} style={styles.bankColumn} />)}</View><View style={styles.bankBase} /></View>; }
function Target({ label, muted = false, styles }: { label: string; muted?: boolean; styles: Styles }) { return <View style={[styles.target, muted && styles.targetMuted]}><View style={styles.targetDot} /><Text style={styles.micro}>{label}</Text></View>; }
function TimelinePoint({ index, label, active = false, styles }: { index: string; label: string; active?: boolean; styles: Styles }) { return <View style={styles.timelinePoint}><View style={[styles.timelineDot, active && styles.timelineDotActive]}><Text style={styles.timelineIndex}>{index}</Text></View><Text style={styles.micro}>{label}</Text></View>; }
function TimelineConnector({ dotted = false, styles }: { dotted?: boolean; styles: Styles }) { return <View style={[styles.timelineConnector, dotted && styles.timelineConnectorDotted]} />; }
function ProductionCluster({ styles }: { styles: Styles }) { return <View style={styles.productionCluster}><View style={styles.factoryBase}><View style={styles.factoryChimney} /><View style={styles.factoryWindow} /><View style={styles.factoryWindow} /></View><View style={styles.serviceDot} /><View style={[styles.serviceDot, styles.serviceDotSecond]} /></View>; }

const createStyles = (theme: LearningTheme, wide: boolean, phone: boolean) => StyleSheet.create({
  shell: { width: '100%', maxWidth: wide ? 680 : undefined, alignSelf: 'center', minHeight: wide ? 300 : phone ? 238 : 262, justifyContent: 'center', padding: wide ? 20 : phone ? 10 : 14, borderRadius: wide ? 18 : 16, borderWidth: 1, borderColor: '#29465A', backgroundColor: '#071522', overflow: 'hidden', position: 'relative' },
  glow: { position: 'absolute', width: wide ? 330 : 240, height: wide ? 330 : 240, borderRadius: 999, backgroundColor: '#0B333A', opacity: 0.28, alignSelf: 'center' },
  board: { width: '100%', minHeight: wide ? 238 : phone ? 188 : 210, justifyContent: 'center', zIndex: 2 },
  svgBoard: { aspectRatio: 1.5, minHeight: 0 }, webArtwork: { width: '100%', height: '100%' },
  scene: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: wide ? 18 : phone ? 9 : 13 }, sceneVertical: { width: '100%', minHeight: wide ? 210 : phone ? 170 : 190, alignItems: 'center', justifyContent: 'center', gap: 12 },
  micro: { color: '#91A7B4', fontSize: wide ? 10 : phone ? 8 : 9, lineHeight: wide ? 14 : phone ? 11 : 13, fontWeight: '900', textAlign: 'center', letterSpacing: 0.35 }, microAccent: { color: '#7FDCCE' },
  valueText: { color: '#E6EEF3', fontSize: wide ? 26 : phone ? 19 : 22, fontWeight: '900' }, bigValue: { color: '#E6EEF3', fontSize: wide ? 30 : phone ? 21 : 25, fontWeight: '900', textAlign: 'center' }, smallValue: { color: '#9AB0BC', fontSize: wide ? 12 : phone ? 9 : 10, fontWeight: '900' }, accentText: { color: '#69D8CA' }, notEqual: { color: '#68BEB4', fontSize: wide ? 34 : phone ? 24 : 28, fontWeight: '900' }, notEqualSmall: { position: 'absolute', right: phone ? 2 : 10, bottom: phone ? 0 : 4, color: '#A98A78', fontSize: phone ? 8 : 9, fontWeight: '900' },
  moneyToken: { width: wide ? 118 : phone ? 84 : 100, height: wide ? 118 : phone ? 84 : 100, borderRadius: 999, borderWidth: 2, borderColor: '#3B7D76', backgroundColor: '#0D3135', alignItems: 'center', justifyContent: 'center' }, moneyText: { color: '#D9EFEC', fontSize: wide ? 19 : phone ? 13 : 16, fontWeight: '900' },
  longArrow: { width: wide ? 92 : phone ? 55 : 72, flexDirection: 'row', alignItems: 'center' }, longArrowLine: { flex: 1, height: 3, borderRadius: 99, backgroundColor: '#3C7176' }, longArrowHead: { marginLeft: -2, color: '#5BBEB3', fontSize: wide ? 28 : phone ? 20 : 24, lineHeight: wide ? 30 : 22 },
  basketPair: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: wide ? 18 : phone ? 8 : 12 }, basketScene: { flex: 1, minWidth: 0, minHeight: wide ? 160 : phone ? 124 : 142, alignItems: 'center', justifyContent: 'center', gap: phone ? 7 : 9 }, goods: { width: wide ? 118 : phone ? 78 : 94, minHeight: wide ? 65 : phone ? 45 : 54, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: phone ? 5 : 7 }, goodDot: { width: wide ? 21 : phone ? 15 : 18, height: wide ? 21 : phone ? 15 : 18, borderRadius: 5 }, goodDotAccent: { backgroundColor: '#54CCBE' }, goodDotMuted: { backgroundColor: '#6F8796' }, basket: { width: wide ? 126 : phone ? 86 : 104, height: wide ? 38 : phone ? 26 : 32, borderWidth: 2, borderTopWidth: 0, borderColor: '#567485', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, justifyContent: 'space-evenly' }, basketAccent: { borderColor: '#3E9C91' }, basketLine: { width: '76%', height: 2, alignSelf: 'center', backgroundColor: '#567485' }, itemFocus: { width: wide ? 130 : phone ? 92 : 110, minHeight: wide ? 145 : phone ? 112 : 128, alignItems: 'center', justifyContent: 'center', gap: 10 }, singleItem: { width: wide ? 58 : phone ? 42 : 50, height: wide ? 58 : phone ? 42 : 50, borderRadius: 12, backgroundColor: '#54CCBE' }, broadBasket: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', gap: 8 },
  rateGauge: { width: wide ? 130 : phone ? 92 : 110, alignItems: 'center', justifyContent: 'center', gap: 4 }, bigArrow: { color: '#60D1C3', fontSize: wide ? 62 : phone ? 44 : 52, lineHeight: wide ? 66 : phone ? 48 : 56, fontWeight: '800' }, coinStack: { width: wide ? 170 : phone ? 112 : 140, minHeight: wide ? 138 : phone ? 105 : 122, alignItems: 'center', justifyContent: 'center', gap: phone ? 6 : 8 }, coinBar: { height: wide ? 13 : phone ? 9 : 11, borderRadius: 999, backgroundColor: '#5C8791' }, factorOrbit: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }, factor: { width: wide ? 120 : phone ? 86 : 100, alignItems: 'center', justifyContent: 'center', gap: 7 }, factorActive: { transform: [{ scale: 1.08 }] }, factorDot: { width: wide ? 38 : phone ? 28 : 32, height: wide ? 38 : phone ? 28 : 32, borderRadius: 99, borderWidth: 2, borderColor: '#607784', backgroundColor: '#102431' }, factorDotActive: { borderColor: '#4CB6AA', backgroundColor: '#0D3437' }, centerDot: { width: 8, height: 8, borderRadius: 99, backgroundColor: '#54CCBE' }, loanMark: { width: wide ? 150 : phone ? 105 : 125, alignItems: 'center', justifyContent: 'center', gap: 7 }, splitMark: { width: wide ? 85 : phone ? 54 : 68, gap: 12 }, splitLine: { width: '100%', height: 2, backgroundColor: '#496B78', transform: [{ rotate: '-10deg' }] },
  bank: { width: wide ? 175 : phone ? 112 : 140, alignItems: 'center' }, bankRoof: { width: '100%', height: 0, borderLeftWidth: wide ? 87 : phone ? 56 : 70, borderRightWidth: wide ? 87 : phone ? 56 : 70, borderBottomWidth: wide ? 40 : phone ? 26 : 32, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#41667A' }, bankHall: { width: '82%', height: wide ? 76 : phone ? 50 : 62, flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 7, backgroundColor: '#102431' }, bankColumn: { width: wide ? 14 : phone ? 9 : 11, borderRadius: 3, backgroundColor: '#648595' }, bankBase: { width: '96%', height: wide ? 11 : 8, borderRadius: 4, backgroundColor: '#41667A' }, influenceField: { width: wide ? 80 : phone ? 45 : 60, gap: 14 }, influenceLine: { width: '100%', height: 2, borderRadius: 99, backgroundColor: '#47717A' }, influenceTargets: { gap: phone ? 8 : 10 }, target: { flexDirection: 'row', alignItems: 'center', gap: 7 }, targetMuted: { opacity: 0.65 }, targetDot: { width: wide ? 17 : phone ? 12 : 14, height: wide ? 17 : phone ? 12 : 14, borderRadius: 99, backgroundColor: '#55CDBF' },
  timelineScene: { width: '100%', minHeight: wide ? 205 : phone ? 165 : 184, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative' }, timelinePoint: { width: wide ? 120 : phone ? 82 : 100, alignItems: 'center', gap: 8 }, timelineDot: { width: wide ? 58 : phone ? 42 : 50, height: wide ? 58 : phone ? 42 : 50, borderRadius: 99, borderWidth: 2, borderColor: '#526C79', backgroundColor: '#102431', alignItems: 'center', justifyContent: 'center' }, timelineDotActive: { borderColor: '#4CB6AA', backgroundColor: '#0D3437' }, timelineIndex: { color: '#DCE8EC', fontSize: wide ? 18 : phone ? 13 : 15, fontWeight: '900' }, timelineConnector: { width: wide ? 95 : phone ? 48 : 66, height: 3, borderRadius: 99, backgroundColor: '#436D75' }, timelineConnectorDotted: { opacity: 0.45 }, timeHint: { position: 'absolute', right: phone ? 5 : 18, bottom: phone ? 5 : 10, color: '#799AA7', fontSize: phone ? 8 : 9, fontWeight: '900' },
  growthScene: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: wide ? 18 : phone ? 9 : 13 }, productionCluster: { width: wide ? 160 : phone ? 105 : 130, height: wide ? 140 : phone ? 102 : 120, position: 'relative', alignItems: 'center', justifyContent: 'center' }, factoryBase: { width: wide ? 110 : phone ? 72 : 90, height: wide ? 70 : phone ? 48 : 58, backgroundColor: '#385B6F', borderRadius: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }, factoryChimney: { position: 'absolute', width: wide ? 22 : phone ? 15 : 18, height: wide ? 48 : phone ? 32 : 40, top: wide ? -38 : phone ? -25 : -31, left: 12, backgroundColor: '#52798A', borderRadius: 4 }, factoryWindow: { width: wide ? 22 : phone ? 14 : 18, height: wide ? 20 : phone ? 13 : 16, borderRadius: 3, backgroundColor: '#91B2BE' }, serviceDot: { position: 'absolute', right: 5, top: 13, width: wide ? 28 : phone ? 18 : 23, height: wide ? 28 : phone ? 18 : 23, borderRadius: 99, backgroundColor: '#54CCBE' }, serviceDotSecond: { right: 35, top: 4, backgroundColor: '#718E9A' }, growthMeter: { width: wide ? 180 : phone ? 115 : 145, alignItems: 'center', gap: 8 }, growthTrack: { width: '100%', height: wide ? 15 : phone ? 10 : 12, borderRadius: 99, backgroundColor: '#203B4A', overflow: 'hidden' }, growthFill: { width: '78%', height: '100%', borderRadius: 99, backgroundColor: '#4CCABA' }, activityMark: { width: wide ? 170 : phone ? 112 : 138, alignItems: 'center', gap: 7 }, peopleIncomeMark: { width: wide ? 170 : phone ? 112 : 138, alignItems: 'center', gap: 7 },
  cycleScene: { width: '100%', minHeight: wide ? 205 : phone ? 165 : 185, justifyContent: 'center', gap: wide ? 17 : phone ? 12 : 14, position: 'relative' }, cycleRow: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: phone ? 8 : 12 }, cycleLabel: { width: wide ? 120 : phone ? 76 : 98, color: '#91A7B4', fontSize: wide ? 10 : phone ? 8 : 9, fontWeight: '900' }, cycleTrack: { flex: 1, height: wide ? 13 : phone ? 9 : 11, borderRadius: 99, backgroundColor: '#203B4A', overflow: 'hidden' }, cycleFill: { height: '100%', borderRadius: 99, backgroundColor: '#4CCABA' }, oneDataHint: { alignSelf: 'center', color: '#A98A78', fontSize: phone ? 8 : 9, fontWeight: '900', marginTop: 4, textAlign: 'center' },
});