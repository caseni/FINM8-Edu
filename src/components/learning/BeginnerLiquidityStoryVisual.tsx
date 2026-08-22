import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

export interface BeginnerLiquidityStoryVisualProps {
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

export function BeginnerLiquidityStoryVisual({
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: BeginnerLiquidityStoryVisualProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const narrow = width < 380;
  const styles = createStyles(theme, wide, narrow);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {role === 'hook' ? (
        <HookScene tr={tr} styles={styles} />
      ) : role === 'practice' ? (
        <PracticeScene tr={tr} styles={styles} />
      ) : role === 'misconception' ? (
        <MisconceptionScene tr={tr} styles={styles} />
      ) : role === 'summary' ? (
        <SummaryScene tr={tr} styles={styles} />
      ) : (
        <ConceptScene tr={tr} styles={styles} />
      )}
    </View>
  );
}

function SceneHeading({
  styles,
  title,
  body,
}: {
  styles: ReturnType<typeof createStyles>;
  title: string;
  body?: string;
}) {
  return (
    <View style={styles.heading}>
      <Text style={styles.headingTitle}>{title}</Text>
      {body ? <Text style={styles.headingBody}>{body}</Text> : null}
    </View>
  );
}

function Participants({
  count,
  active,
  styles,
}: {
  count: number;
  active?: boolean;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.participants}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={[styles.participant, active && index % 3 === 0 && styles.participantActive]} />
      ))}
    </View>
  );
}

function SellerOrder({ tr, styles }: { tr: boolean; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.orderPill}>
      <Text style={styles.orderLabel}>{tr ? 'AYNI SATIŞ' : 'SAME SALE'}</Text>
      <Text style={styles.orderValue}>{tr ? '4 BİRİM' : '4 UNITS'}</Text>
    </View>
  );
}

function MarketCard({
  tr,
  liquid,
  styles,
}: {
  tr: boolean;
  liquid: boolean;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View
      style={[styles.marketCard, liquid ? styles.marketCardLiquid : styles.marketCardThin]}
      accessibilityLabel={liquid ? 'likidite-senaryo-kalabalik' : 'likidite-senaryo-sig'}
    >
      <Text style={[styles.marketEyebrow, liquid ? styles.goodText : styles.riskText]}>
        {liquid ? (tr ? 'ÇOK ALICI' : 'MANY BUYERS') : (tr ? 'AZ ALICI' : 'FEW BUYERS')}
      </Text>
      <Participants count={liquid ? 12 : 3} active={liquid} styles={styles} />
      <View style={styles.priceImpactRow}>
        <Text style={styles.priceFrom}>100</Text>
        <Text style={styles.arrow}>→</Text>
        <Text style={[styles.priceTo, liquid ? styles.goodText : styles.riskText]}>
          {liquid ? '99,9' : '98,8'}
        </Text>
      </View>
      <View style={[styles.impactBar, liquid ? styles.impactSmall : styles.impactLarge]} />
      <Text style={styles.cardHint}>
        {liquid ? (tr ? 'Daha az fiyat etkisi' : 'Less price impact') : (tr ? 'Daha fazla fiyat etkisi' : 'More price impact')}
      </Text>
    </View>
  );
}

function HookScene({ tr, styles }: { tr: boolean; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.scene}>
      <SceneHeading
        styles={styles}
        title={tr ? 'Ekranda 100 görmen, hepsini 100’den satabileceğin anlamına gelmez.' : 'Seeing 100 on screen does not mean you can sell everything at 100.'}
      />
      <SellerOrder tr={tr} styles={styles} />
      <View style={styles.compareRow}>
        <MarketCard tr={tr} liquid styles={styles} />
        <MarketCard tr={tr} liquid={false} styles={styles} />
      </View>
    </View>
  );
}

function ConceptScene({ tr, styles }: { tr: boolean; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.scene}>
      <SceneHeading
        styles={styles}
        title={tr ? 'Likidite, emrinin karşı tarafta ne kadar kolay karşılandığını anlatır.' : 'Liquidity shows how easily the other side can absorb your order.'}
        body={tr ? 'Aynı miktar, farklı piyasa derinliğinde farklı fiyat etkisi yaratabilir.' : 'The same amount can create different price impact at different market depth.'}
      />
      <View style={styles.compareRow}>
        <DepthCard tr={tr} liquid styles={styles} />
        <DepthCard tr={tr} liquid={false} styles={styles} />
      </View>
    </View>
  );
}

function DepthCard({
  tr,
  liquid,
  styles,
}: {
  tr: boolean;
  liquid: boolean;
  styles: ReturnType<typeof createStyles>;
}) {
  const levels = liquid
    ? [{ price: '100,0', width: '92%' }, { price: '99,9', width: '78%' }, { price: '99,8', width: '70%' }]
    : [{ price: '100,0', width: '34%' }, { price: '99,4', width: '24%' }, { price: '98,8', width: '18%' }];

  return (
    <View style={[styles.depthCard, liquid ? styles.marketCardLiquid : styles.marketCardThin]}>
      <Text style={[styles.marketEyebrow, liquid ? styles.goodText : styles.riskText]}>
        {liquid ? (tr ? 'DERİN PİYASA' : 'DEEP MARKET') : (tr ? 'SIĞ PİYASA' : 'THIN MARKET')}
      </Text>
      <View style={styles.depthStack}>
        {levels.map((level) => (
          <View key={level.price} style={styles.depthRow}>
            <Text style={styles.depthPrice}>{level.price}</Text>
            <View style={styles.depthTrack}>
              <View style={[styles.depthFill, liquid ? styles.depthFillLiquid : styles.depthFillThin, { width: level.width }]} />
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.cardHint}>
        {liquid ? (tr ? 'Emir yakın fiyatlarda karşılanır' : 'Order is absorbed near the price') : (tr ? 'Emir daha aşağı fiyatlara taşar' : 'Order reaches worse prices')}
      </Text>
    </View>
  );
}

function PracticeScene({ tr, styles }: { tr: boolean; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.scene}>
      <SceneHeading
        styles={styles}
        title={tr ? 'Likidite işlem büyüklüğüne de bağlıdır.' : 'Liquidity also depends on order size.'}
        body={tr ? 'Aynı piyasa küçük emri rahat karşılayıp büyük emirde zorlanabilir.' : 'The same market can absorb a small order easily but struggle with a larger one.'}
      />
      <View style={styles.compareRow}>
        <SizeCard tr={tr} large={false} styles={styles} />
        <SizeCard tr={tr} large styles={styles} />
      </View>
    </View>
  );
}

function SizeCard({
  tr,
  large,
  styles,
}: {
  tr: boolean;
  large: boolean;
  styles: ReturnType<typeof createStyles>;
}) {
  const blocks = large ? 8 : 2;
  return (
    <View
      style={[styles.sizeCard, large ? styles.marketCardThin : styles.marketCardLiquid]}
      accessibilityLabel={large ? 'likidite-buyuk-emir' : 'likidite-kucuk-emir'}
    >
      <Text style={styles.marketEyebrow}>{large ? (tr ? 'BÜYÜK EMİR' : 'LARGE ORDER') : (tr ? 'KÜÇÜK EMİR' : 'SMALL ORDER')}</Text>
      <View style={styles.orderBlocks}>
        {Array.from({ length: blocks }).map((_, index) => <View key={index} style={styles.orderBlock} />)}
      </View>
      <View style={styles.priceImpactRow}>
        <Text style={styles.priceFrom}>100</Text>
        <Text style={styles.arrow}>→</Text>
        <Text style={[styles.priceTo, large ? styles.riskText : styles.goodText]}>{large ? '98,9' : '99,9'}</Text>
      </View>
      <Text style={styles.cardHint}>{large ? (tr ? 'Daha fazla fiyat etkisi' : 'More price impact') : (tr ? 'Az fiyat etkisi' : 'Low price impact')}</Text>
    </View>
  );
}

function MisconceptionScene({ tr, styles }: { tr: boolean; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.scene}>
      <SceneHeading
        styles={styles}
        title={tr ? 'Yüksek hacim, şu anda her miktar için yüksek likidite garantisi değildir.' : 'High volume does not guarantee high liquidity for every size right now.'}
      />
      <View style={styles.misconceptionRow}>
        <View style={styles.volumeCard}>
          <Text style={styles.marketEyebrow}>{tr ? 'GÜNLÜK HACİM' : 'DAILY VOLUME'}</Text>
          <View style={styles.volumeBars}>
            {[30, 48, 66, 44, 72, 58].map((height, index) => <View key={index} style={[styles.volumeBar, { height }]} />)}
          </View>
          <Text style={styles.volumeValue}>{tr ? 'YÜKSEK' : 'HIGH'}</Text>
        </View>
        <View style={styles.notEqual}><Text style={styles.notEqualText}>≠</Text></View>
        <View style={styles.nowCard}>
          <Text style={styles.marketEyebrow}>{tr ? 'ŞİMDİKİ KARŞI TARAF' : 'OTHER SIDE NOW'}</Text>
          <Participants count={3} styles={styles} />
          <Text style={styles.riskText}>{tr ? 'SIĞ OLABİLİR' : 'CAN BE THIN'}</Text>
        </View>
      </View>
    </View>
  );
}

function SummaryScene({ tr, styles }: { tr: boolean; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.scene}>
      <SceneHeading
        styles={styles}
        title={tr ? 'Likiditeyi tek bakışta böyle düşün.' : 'Think of liquidity this way.'}
      />
      <View style={styles.compareRow}>
        <View style={[styles.summaryCard, styles.marketCardLiquid]}>
          <Participants count={10} active styles={styles} />
          <Text style={styles.summaryTitle}>{tr ? 'ÇOK KARŞI TARAF' : 'MANY COUNTERPARTIES'}</Text>
          <View style={styles.impactSmall} />
          <Text style={styles.cardHint}>{tr ? 'Daha kolay işlem' : 'Easier trading'}</Text>
        </View>
        <View style={[styles.summaryCard, styles.marketCardThin]}>
          <Participants count={3} styles={styles} />
          <Text style={styles.summaryTitle}>{tr ? 'AZ KARŞI TARAF' : 'FEW COUNTERPARTIES'}</Text>
          <View style={styles.impactLarge} />
          <Text style={styles.cardHint}>{tr ? 'Daha zor işlem' : 'Harder trading'}</Text>
        </View>
      </View>
      <View style={styles.memoryRule}>
        <Text style={styles.memoryRuleText}>{tr ? 'Kolay işlem + düşük fiyat etkisi = daha yüksek likidite' : 'Easier trading + lower price impact = higher liquidity'}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: LearningTheme, wide: boolean, narrow: boolean) => StyleSheet.create({
  shell: {
    width: '100%',
    minHeight: wide ? 310 : narrow ? 252 : 270,
    justifyContent: 'center',
    padding: wide ? 20 : narrow ? 12 : 14,
    overflow: 'hidden',
    borderRadius: wide ? 18 : 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#081726',
  },
  scene: { width: '100%', gap: wide ? 17 : narrow ? 11 : 13 },
  heading: { gap: 5 },
  headingTitle: { color: theme.colors.text, fontSize: wide ? 20 : narrow ? 15 : 17, lineHeight: wide ? 28 : narrow ? 21 : 24, fontWeight: '900' },
  headingBody: { color: theme.colors.textMuted, fontSize: wide ? 12 : 10, lineHeight: wide ? 18 : 15 },
  orderPill: { minHeight: narrow ? 34 : 38, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingHorizontal: narrow ? 10 : 12, borderRadius: 10, borderWidth: 1, borderColor: '#355064', backgroundColor: '#102434' },
  orderLabel: { color: theme.colors.textMuted, fontSize: narrow ? 8 : 9, fontWeight: '900', letterSpacing: 0.6 },
  orderValue: { color: theme.colors.text, fontSize: narrow ? 12 : 14, fontWeight: '900' },
  compareRow: { flexDirection: 'row', alignItems: 'stretch', gap: narrow ? 7 : 9 },
  marketCard: { flex: 1, minWidth: 0, minHeight: wide ? 168 : narrow ? 126 : 142, alignItems: 'center', justifyContent: 'center', gap: narrow ? 6 : 8, padding: narrow ? 8 : 10, borderRadius: 14, borderWidth: 1 },
  marketCardLiquid: { borderColor: '#2E716B', backgroundColor: '#0C2B31' },
  marketCardThin: { borderColor: '#5C4B50', backgroundColor: '#211D29' },
  marketEyebrow: { color: theme.colors.textMuted, fontSize: narrow ? 8 : 9, lineHeight: 12, fontWeight: '900', letterSpacing: 0.55, textAlign: 'center' },
  participants: { minHeight: narrow ? 42 : 48, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: narrow ? 4 : 5 },
  participant: { width: narrow ? 9 : 11, height: narrow ? 9 : 11, borderRadius: 6, backgroundColor: '#718798' },
  participantActive: { backgroundColor: '#4BAA9F' },
  priceImpactRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: narrow ? 4 : 6 },
  priceFrom: { color: '#D6E0E6', fontSize: narrow ? 12 : 14, fontWeight: '900' },
  priceTo: { fontSize: narrow ? 12 : 14, fontWeight: '900' },
  arrow: { color: '#708797', fontSize: narrow ? 12 : 14, fontWeight: '900' },
  goodText: { color: '#63C5B8' },
  riskText: { color: '#C98D7D', fontSize: narrow ? 9 : 10, lineHeight: 14, fontWeight: '900', textAlign: 'center' },
  impactBar: { height: 5, borderRadius: 3 },
  impactSmall: { width: narrow ? 34 : 42, height: 5, borderRadius: 3, backgroundColor: '#55AA9F' },
  impactLarge: { width: narrow ? 76 : 92, height: 5, borderRadius: 3, backgroundColor: '#A66F62' },
  cardHint: { color: theme.colors.textMuted, fontSize: narrow ? 8 : 9, lineHeight: narrow ? 11 : 13, textAlign: 'center' },
  depthCard: { flex: 1, minWidth: 0, minHeight: wide ? 180 : narrow ? 140 : 154, gap: narrow ? 8 : 10, padding: narrow ? 8 : 10, borderRadius: 14, borderWidth: 1 },
  depthStack: { gap: narrow ? 6 : 7 },
  depthRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  depthPrice: { width: narrow ? 31 : 36, color: '#C7D3DB', fontSize: narrow ? 8 : 9, fontWeight: '800' },
  depthTrack: { flex: 1, height: narrow ? 13 : 15, overflow: 'hidden', borderRadius: 5, backgroundColor: '#142A39' },
  depthFill: { height: '100%', borderRadius: 5 },
  depthFillLiquid: { backgroundColor: '#3E817A' },
  depthFillThin: { backgroundColor: '#805A54' },
  sizeCard: { flex: 1, minWidth: 0, minHeight: wide ? 174 : narrow ? 132 : 146, alignItems: 'center', justifyContent: 'center', gap: narrow ? 7 : 9, padding: narrow ? 8 : 10, borderRadius: 14, borderWidth: 1 },
  orderBlocks: { minHeight: narrow ? 40 : 46, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: 4 },
  orderBlock: { width: narrow ? 13 : 15, height: narrow ? 13 : 15, borderRadius: 3, backgroundColor: '#7890A1' },
  misconceptionRow: { minHeight: wide ? 176 : narrow ? 136 : 150, flexDirection: 'row', alignItems: 'stretch', gap: narrow ? 6 : 8 },
  volumeCard: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', gap: 7, padding: narrow ? 8 : 10, borderRadius: 14, borderWidth: 1, borderColor: '#385166', backgroundColor: '#0F2232' },
  volumeBars: { height: narrow ? 58 : 72, flexDirection: 'row', alignItems: 'flex-end', gap: narrow ? 3 : 4 },
  volumeBar: { width: narrow ? 6 : 8, maxHeight: '100%', borderRadius: 3, backgroundColor: '#4C8E87' },
  volumeValue: { color: '#65BEB2', fontSize: narrow ? 9 : 10, fontWeight: '900' },
  notEqual: { width: narrow ? 20 : 28, alignItems: 'center', justifyContent: 'center' },
  notEqualText: { color: theme.colors.primary, fontSize: narrow ? 19 : 24, fontWeight: '900' },
  nowCard: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', gap: 9, padding: narrow ? 8 : 10, borderRadius: 14, borderWidth: 1, borderColor: '#5C4B50', backgroundColor: '#211D29' },
  summaryCard: { flex: 1, minWidth: 0, minHeight: wide ? 158 : narrow ? 120 : 134, alignItems: 'center', justifyContent: 'center', gap: narrow ? 7 : 9, padding: narrow ? 8 : 10, borderRadius: 14, borderWidth: 1 },
  summaryTitle: { color: theme.colors.text, fontSize: narrow ? 8 : 9, lineHeight: 12, fontWeight: '900', textAlign: 'center' },
  memoryRule: { paddingHorizontal: wide ? 16 : 12, paddingVertical: wide ? 12 : 10, borderRadius: 12, borderWidth: 1, borderColor: '#2E716B', backgroundColor: '#0D3034' },
  memoryRuleText: { color: '#D4E9E5', fontSize: wide ? 12 : narrow ? 10 : 11, lineHeight: wide ? 18 : narrow ? 14 : 16, textAlign: 'center', fontWeight: '700' },
});
