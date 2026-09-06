import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type Topic = 'inflation' | 'rates' | 'centralBank' | 'monetaryPolicy' | 'growth' | 'cycle';
export interface AcademyEconomyPremiumHookVisualProps { assetRef: string; alt: string; theme?: LearningTheme; }
type S = ReturnType<typeof createStyles>;

function topicFor(assetRef: string): Topic | undefined {
  if (assetRef.includes('enflasyon-satin-alma-gucu')) return 'inflation';
  if (assetRef.includes('faiz-orani-ne-anlatir')) return 'rates';
  if (assetRef.includes('merkez-bankasi-ne-yapar')) return 'centralBank';
  if (assetRef.includes('faiz-karari-ekonomiye-nasil-yansir')) return 'monetaryPolicy';
  if (assetRef.includes('gsyh-buyume-ne-anlatir')) return 'growth';
  if (assetRef.includes('ekonomik-dongu-resesyon')) return 'cycle';
  return undefined;
}

function topicKey(topic: Topic): string {
  return topic === 'centralBank' ? 'central-bank' : topic === 'monetaryPolicy' ? 'monetary-policy' : topic;
}

export function isAcademyEconomyPremiumHookAsset(assetRef: string) {
  return Boolean(topicFor(assetRef));
}

export function AcademyEconomyPremiumHookVisual({ assetRef, alt, theme = defaultLearningTheme }: AcademyEconomyPremiumHookVisualProps) {
  const topic = topicFor(assetRef);
  if (!topic) return null;
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const phone = width < 420;
  const s = createStyles(theme, wide, phone);

  return (
    <View style={s.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={s.gridH1} /><View style={s.gridH2} /><View style={s.gridV1} /><View style={s.gridV2} />
      <View style={s.stage} accessibilityLabel={`academy-economy-hook-${topicKey(topic)}`}>
        {topic === 'inflation' ? <Inflation s={s} /> : null}
        {topic === 'rates' ? <Rates s={s} /> : null}
        {topic === 'centralBank' ? <CentralBank s={s} /> : null}
        {topic === 'monetaryPolicy' ? <Policy s={s} /> : null}
        {topic === 'growth' ? <Growth s={s} /> : null}
        {topic === 'cycle' ? <Cycle s={s} /> : null}
      </View>
    </View>
  );
}

function Inflation({ s }: { s: S }) {
  return (
    <View style={s.sceneRow}>
      <View style={s.moneyToken}><Text style={s.moneyText}>100</Text><Text style={s.moneyUnit}>TL</Text></View>
      <View style={s.connector}><View style={s.connectorLine} /><Text style={s.connectorGlyph}>→</Text></View>
      <Basket s={s} count={5} label="5" />
      <View style={s.divider} />
      <Basket s={s} count={3} label="3" warning />
      <View style={s.riseArrow}><View style={s.riseLine} /><View style={s.riseHead} /></View>
    </View>
  );
}

function Basket({ s, count, label, warning = false }: { s: S; count: number; label: string; warning?: boolean }) {
  return (
    <View style={s.basketScene}>
      <View style={s.goods}>{Array.from({ length: count }).map((_, i) => <View key={i} style={[s.good, i % 2 ? s.goodMuted : warning ? s.goodWarn : s.goodAccent]} />)}</View>
      <View style={[s.basket, warning && s.basketWarn]}><View style={s.basketHandle} /><View style={s.basketBar} /><View style={s.basketBar} /></View>
      <Text style={[s.metric, warning && s.metricWarn]}>{label}</Text>
    </View>
  );
}

function Rates({ s }: { s: S }) {
  return (
    <View style={s.sceneRow}>
      <LoanCard s={s} coins={2} label="DÜŞÜK" />
      <View style={s.connector}><View style={s.connectorLineWarn} /><Text style={[s.connectorGlyph, s.warnText]}>→</Text></View>
      <LoanCard s={s} coins={4} label="YÜKSEK" warning />
      <View style={s.rateRise}><View style={s.riseLine} /><View style={s.riseHead} /></View>
    </View>
  );
}

function LoanCard({ s, coins, label, warning = false }: { s: S; coins: number; label: string; warning?: boolean }) {
  return (
    <View style={[s.loanCard, warning && s.loanCardWarn]}>
      <Text style={s.microLabel}>{label}</Text>
      <View style={s.loanPrincipal} />
      <View style={s.coinRow}>{Array.from({ length: coins }).map((_, i) => <View key={i} style={[s.coin, warning && i > 1 && s.coinWarn]} />)}</View>
    </View>
  );
}

function CentralBank({ s }: { s: S }) {
  return (
    <View style={s.bankScene}>
      <Bank s={s} />
      <Channel s={s} pos={s.channelNW} glyph="%" />
      <Channel s={s} pos={s.channelNE} glyph="▤" />
      <Channel s={s} pos={s.channelSW} glyph="▥" />
      <Channel s={s} pos={s.channelSE} glyph="▣" accent />
      <View style={[s.bankLink, s.linkNW]} /><View style={[s.bankLink, s.linkNE]} />
      <View style={[s.bankLink, s.linkSW]} /><View style={[s.bankLink, s.linkSE, s.bankLinkAccent]} />
    </View>
  );
}

function Bank({ s }: { s: S }) {
  return (
    <View style={s.bank}>
      <View style={s.bankRoof} />
      <View style={s.bankBody}>{[0, 1, 2, 3].map((i) => <View key={i} style={s.bankColumn} />)}</View>
      <View style={s.bankBase} />
    </View>
  );
}

function Channel({ s, pos, glyph, accent = false }: { s: S; pos: object; glyph: string; accent?: boolean }) {
  return <View style={[s.channel, pos, accent && s.channelAccent]}><Text style={[s.channelGlyph, accent && s.accentText]}>{glyph}</Text></View>;
}

function Policy({ s }: { s: S }) {
  const nodes = [
    { glyph: '%', label: 'FAİZ' },
    { glyph: '▤', label: 'KREDİ' },
    { glyph: '▥', label: 'HARCAMA' },
    { glyph: '▣', label: 'EKONOMİ' },
  ];
  return (
    <View style={s.policyScene}>
      <View style={s.policyFlow}>
        {nodes.map((node, index) => (
          <React.Fragment key={node.label}>
            <View style={[s.flowNode, index === nodes.length - 1 && s.flowNodeAccent]}>
              <Text style={[s.flowGlyph, index === nodes.length - 1 && s.accentText]}>{node.glyph}</Text>
              <Text style={s.flowLabel}>{node.label}</Text>
            </View>
            {index < nodes.length - 1 ? <View style={s.flowConnector}><View style={s.flowLine} /><Text style={s.flowArrow}>›</Text></View> : null}
          </React.Fragment>
        ))}
      </View>
      <View style={s.timeTrail}>{[0, 1, 2, 3, 4].map((i) => <View key={i} style={[s.timeDot, { opacity: 0.35 + i * 0.13 }]} />)}</View>
    </View>
  );
}

function Growth({ s }: { s: S }) {
  const heights = ['35%', '52%', '72%', '92%'] as const;
  return (
    <View style={s.growthScene}>
      <View style={s.growthBars}>{heights.map((height, i) => <View key={i} style={[s.growthBar, { height }, i === 3 && s.growthBarAccent]} />)}</View>
      <View style={s.growthConnector}><View style={s.growthLine} /><View style={s.growthHead} /></View>
      <View style={s.sectors}>{[0, 1, 2].map((i) => <View key={i} style={[s.sector, i === 1 && s.sectorAccent]}><View style={[s.sectorCore, i === 1 && s.sectorCoreAccent]} /></View>)}</View>
    </View>
  );
}

function Cycle({ s }: { s: S }) {
  const heights = ['35%', '68%', '46%', '78%', '42%', '64%'] as const;
  return (
    <View style={s.cycleScene}>
      <View style={s.cycleBase} />
      <View style={s.cycleBars}>{heights.map((height, i) => <View key={i} style={[s.cycleBar, { height }, i === 1 || i === 3 ? s.cycleBarAccent : i === 4 ? s.cycleBarWarn : null]} />)}</View>
      <View style={s.cycleDots}>{heights.map((_, i) => <View key={i} style={[s.phaseDot, i === 1 || i === 3 ? s.phaseDotAccent : i === 4 ? s.phaseDotWarn : null]} />)}</View>
      <View style={s.recovery}><View style={s.recoveryLine} /><View style={s.recoveryHead} /></View>
    </View>
  );
}

const createStyles = (theme: LearningTheme, wide: boolean, phone: boolean) => StyleSheet.create({
  shell: { width: '100%', maxWidth: wide ? 680 : undefined, alignSelf: 'center', minHeight: wide ? 320 : phone ? 244 : 280, overflow: 'hidden', borderRadius: wide ? 22 : 17, borderWidth: 1, borderColor: '#244B61', backgroundColor: '#071521', padding: wide ? 16 : phone ? 9 : 12, position: 'relative' },
  stage: { width: '100%', flex: 1, minHeight: wide ? 286 : phone ? 224 : 254, position: 'relative', overflow: 'hidden', borderRadius: wide ? 18 : 14, backgroundColor: '#091B29', borderWidth: 1, borderColor: '#1D4054' },
  gridH1: { position: 'absolute', left: 10, right: 10, top: '34%', height: 1, backgroundColor: '#102E40' },
  gridH2: { position: 'absolute', left: 10, right: 10, top: '67%', height: 1, backgroundColor: '#102E40' },
  gridV1: { position: 'absolute', top: 10, bottom: 10, left: '36%', width: 1, backgroundColor: '#102E40' },
  gridV2: { position: 'absolute', top: 10, bottom: 10, left: '69%', width: 1, backgroundColor: '#102E40' },
  sceneRow: { width: '100%', height: '100%', minHeight: wide ? 286 : phone ? 224 : 254, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: wide ? 12 : phone ? 5 : 8, paddingHorizontal: wide ? 18 : phone ? 8 : 12 },
  moneyToken: { width: wide ? 78 : phone ? 54 : 65, height: wide ? 78 : phone ? 54 : 65, borderRadius: 99, borderWidth: 2, borderColor: '#2E756D', backgroundColor: '#0E3334', alignItems: 'center', justifyContent: 'center' },
  moneyText: { color: '#E5F0F1', fontSize: wide ? 20 : phone ? 14 : 17, lineHeight: wide ? 22 : phone ? 16 : 19, fontWeight: '900' },
  moneyUnit: { color: '#55D0BF', fontSize: wide ? 9 : phone ? 7 : 8, fontWeight: '900' },
  connector: { width: wide ? 52 : phone ? 29 : 40, height: 24, alignItems: 'center', justifyContent: 'center' },
  connectorLine: { position: 'absolute', width: '90%', height: 3, borderRadius: 2, backgroundColor: '#55D0BF' },
  connectorLineWarn: { position: 'absolute', width: '90%', height: 3, borderRadius: 2, backgroundColor: '#A87551' },
  connectorGlyph: { position: 'absolute', right: -1, color: '#55D0BF', fontSize: wide ? 20 : phone ? 14 : 17, fontWeight: '900' },
  basketScene: { width: wide ? 120 : phone ? 73 : 92, minHeight: wide ? 150 : phone ? 112 : 132, alignItems: 'center', justifyContent: 'center', gap: phone ? 4 : 6 },
  goods: { width: '82%', minHeight: wide ? 52 : phone ? 36 : 44, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: phone ? 4 : 5 },
  good: { width: wide ? 19 : phone ? 13 : 16, height: wide ? 19 : phone ? 13 : 16, borderRadius: 5 },
  goodAccent: { backgroundColor: '#55D0BF' }, goodMuted: { backgroundColor: '#6F8898' }, goodWarn: { backgroundColor: '#A87551' },
  basket: { width: wide ? 94 : phone ? 61 : 76, height: wide ? 60 : phone ? 42 : 50, borderWidth: 3, borderTopWidth: 0, borderColor: '#688595', borderBottomLeftRadius: 18, borderBottomRightRadius: 18, justifyContent: 'center', gap: phone ? 6 : 8, paddingHorizontal: phone ? 8 : 11, position: 'relative' },
  basketWarn: { borderColor: '#86644B' },
  basketHandle: { position: 'absolute', alignSelf: 'center', top: wide ? -32 : phone ? -23 : -27, width: '74%', height: wide ? 36 : phone ? 26 : 31, borderTopLeftRadius: 30, borderTopRightRadius: 30, borderWidth: 3, borderBottomWidth: 0, borderColor: '#627F90' },
  basketBar: { width: '100%', height: 2, backgroundColor: '#5D7989' },
  metric: { color: '#65D6C8', fontSize: wide ? 14 : phone ? 10 : 12, fontWeight: '900' }, metricWarn: { color: '#C18B62' },
  divider: { width: 1, height: '60%', backgroundColor: '#315063' },
  riseArrow: { position: 'absolute', right: phone ? '4%' : '6%', top: phone ? '9%' : '11%', width: wide ? 64 : phone ? 40 : 52, height: wide ? 44 : phone ? 30 : 36 },
  riseLine: { position: 'absolute', left: 0, bottom: 5, width: '82%', height: wide ? 5 : 4, borderRadius: 3, backgroundColor: '#A87551', transform: [{ rotate: '-32deg' }] },
  riseHead: { position: 'absolute', right: 0, top: 0, width: wide ? 15 : phone ? 10 : 12, height: wide ? 15 : phone ? 10 : 12, borderTopWidth: 3, borderRightWidth: 3, borderColor: '#A87551' },
  warnText: { color: '#C18B62' },
  loanCard: { width: wide ? 150 : phone ? 105 : 128, minHeight: wide ? 142 : phone ? 104 : 122, borderRadius: wide ? 20 : 15, borderWidth: 1, borderColor: '#35566A', backgroundColor: '#102638', padding: wide ? 15 : phone ? 9 : 12, justifyContent: 'space-between', gap: phone ? 8 : 10 },
  loanCardWarn: { borderColor: '#7A5B42', backgroundColor: '#241D18' },
  microLabel: { color: '#849AAA', fontSize: wide ? 9 : phone ? 7 : 8, fontWeight: '900', letterSpacing: 0.4 },
  loanPrincipal: { width: '70%', height: wide ? 11 : phone ? 8 : 10, borderRadius: 6, backgroundColor: '#668394' },
  coinRow: { flexDirection: 'row', flexWrap: 'wrap', gap: phone ? 5 : 7 },
  coin: { width: wide ? 27 : phone ? 19 : 23, height: wide ? 27 : phone ? 19 : 23, borderRadius: 99, backgroundColor: '#6C8999', borderWidth: 1, borderColor: '#8CA2AF' }, coinWarn: { backgroundColor: '#A87551', borderColor: '#C18B62' },
  rateRise: { position: 'absolute', right: phone ? '7%' : '9%', top: phone ? '10%' : '12%', width: wide ? 58 : phone ? 38 : 48, height: wide ? 40 : phone ? 28 : 34 },
  bankScene: { width: '100%', height: '100%', minHeight: wide ? 286 : phone ? 224 : 254, position: 'relative' },
  bank: { position: 'absolute', left: '34%', top: phone ? '30%' : '26%', width: '32%', height: '48%', alignItems: 'center', justifyContent: 'center' },
  bankRoof: { width: wide ? 128 : phone ? 82 : 102, height: 0, borderLeftWidth: wide ? 64 : phone ? 41 : 51, borderRightWidth: wide ? 64 : phone ? 41 : 51, borderBottomWidth: wide ? 35 : phone ? 23 : 29, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#607E8F' },
  bankBody: { width: wide ? 114 : phone ? 74 : 92, height: wide ? 76 : phone ? 49 : 62, backgroundColor: '#102638', borderLeftWidth: 3, borderRightWidth: 3, borderColor: '#607E8F', flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: phone ? 6 : 9, paddingTop: phone ? 6 : 9 },
  bankColumn: { width: wide ? 10 : phone ? 7 : 8, height: '82%', backgroundColor: '#607E8F', borderRadius: 3 },
  bankBase: { width: wide ? 136 : phone ? 88 : 109, height: wide ? 10 : 7, borderRadius: 5, backgroundColor: '#607E8F' },
  channel: { position: 'absolute', width: wide ? 61 : phone ? 43 : 51, height: wide ? 61 : phone ? 43 : 51, borderRadius: wide ? 18 : 14, borderWidth: 1, borderColor: '#35566A', backgroundColor: '#102638', alignItems: 'center', justifyContent: 'center' },
  channelAccent: { borderColor: '#2E756D', backgroundColor: '#0E3334' },
  channelGlyph: { color: '#7895A4', fontSize: wide ? 23 : phone ? 16 : 19, fontWeight: '900' }, accentText: { color: '#55D0BF' },
  channelNW: { left: '8%', top: '15%' }, channelNE: { right: '8%', top: '15%' }, channelSW: { left: '9%', bottom: '12%' }, channelSE: { right: '9%', bottom: '12%' },
  bankLink: { position: 'absolute', width: '17%', height: phone ? 2 : 3, backgroundColor: '#4E6C7D' }, bankLinkAccent: { backgroundColor: '#55D0BF' },
  linkNW: { left: '24%', top: '31%', transform: [{ rotate: '28deg' }] }, linkNE: { right: '24%', top: '31%', transform: [{ rotate: '-28deg' }] }, linkSW: { left: '24%', bottom: '28%', transform: [{ rotate: '-28deg' }] }, linkSE: { right: '24%', bottom: '28%', transform: [{ rotate: '28deg' }] },
  policyScene: { width: '100%', height: '100%', minHeight: wide ? 286 : phone ? 224 : 254, justifyContent: 'center', gap: wide ? 28 : phone ? 18 : 22, paddingHorizontal: wide ? 20 : phone ? 9 : 14 },
  policyFlow: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  flowNode: { width: wide ? 88 : phone ? 59 : 70, minHeight: wide ? 92 : phone ? 68 : 80, borderRadius: wide ? 18 : 14, borderWidth: 1, borderColor: '#35566A', backgroundColor: '#102638', alignItems: 'center', justifyContent: 'center', gap: phone ? 4 : 6 }, flowNodeAccent: { borderColor: '#2E756D', backgroundColor: '#0E3334' },
  flowGlyph: { color: '#7895A4', fontSize: wide ? 23 : phone ? 16 : 19, fontWeight: '900' }, flowLabel: { color: '#849AAA', fontSize: wide ? 8 : phone ? 6 : 7, fontWeight: '900', textAlign: 'center' },
  flowConnector: { flex: 1, maxWidth: wide ? 38 : phone ? 20 : 28, height: 18, alignItems: 'center', justifyContent: 'center' }, flowLine: { width: '100%', height: 3, borderRadius: 2, backgroundColor: '#4FCBBA' }, flowArrow: { position: 'absolute', right: -2, color: '#4FCBBA', fontSize: wide ? 23 : phone ? 16 : 19, fontWeight: '900' },
  timeTrail: { width: '54%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-around' }, timeDot: { width: wide ? 11 : phone ? 8 : 9, height: wide ? 11 : phone ? 8 : 9, borderRadius: 99, backgroundColor: '#55D0BF' },
  growthScene: { width: '100%', height: '100%', minHeight: wide ? 286 : phone ? 224 : 254, flexDirection: 'row', alignItems: 'center', paddingHorizontal: wide ? 28 : phone ? 12 : 18 },
  growthBars: { width: '43%', height: wide ? 172 : phone ? 125 : 148, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', borderBottomWidth: 1, borderColor: '#35566A' },
  growthBar: { width: wide ? 31 : phone ? 20 : 25, borderTopLeftRadius: 7, borderTopRightRadius: 7, backgroundColor: '#607D8E' }, growthBarAccent: { backgroundColor: '#55D0BF' },
  growthConnector: { width: '18%', height: wide ? 70 : phone ? 48 : 58, position: 'relative' }, growthLine: { position: 'absolute', left: 0, bottom: '25%', width: '90%', height: 4, borderRadius: 2, backgroundColor: '#55D0BF', transform: [{ rotate: '-34deg' }] }, growthHead: { position: 'absolute', right: 0, top: '14%', width: wide ? 14 : phone ? 10 : 12, height: wide ? 14 : phone ? 10 : 12, borderTopWidth: 3, borderRightWidth: 3, borderColor: '#55D0BF' },
  sectors: { width: '34%', gap: phone ? 8 : 11, alignItems: 'center' }, sector: { width: wide ? 90 : phone ? 62 : 74, height: wide ? 45 : phone ? 32 : 38, borderRadius: 12, borderWidth: 1, borderColor: '#35566A', backgroundColor: '#102638', alignItems: 'center', justifyContent: 'center' }, sectorAccent: { borderColor: '#2E756D', backgroundColor: '#0E3334' }, sectorCore: { width: '45%', height: phone ? 8 : 10, borderRadius: 6, backgroundColor: '#738F9F' }, sectorCoreAccent: { backgroundColor: '#55D0BF' },
  cycleScene: { width: '100%', height: '100%', minHeight: wide ? 286 : phone ? 224 : 254, position: 'relative', justifyContent: 'center', paddingHorizontal: wide ? 28 : phone ? 12 : 18 },
  cycleBase: { position: 'absolute', left: '7%', right: '7%', bottom: '20%', height: 1, backgroundColor: '#35566A' },
  cycleBars: { width: '100%', height: wide ? 172 : phone ? 126 : 148, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around' }, cycleBar: { width: wide ? 45 : phone ? 28 : 36, borderTopLeftRadius: 9, borderTopRightRadius: 9, backgroundColor: '#526F80' }, cycleBarAccent: { backgroundColor: '#2E756D' }, cycleBarWarn: { backgroundColor: '#8A644B' },
  cycleDots: { position: 'absolute', left: '10%', right: '10%', bottom: phone ? '15%' : '14%', flexDirection: 'row', justifyContent: 'space-around' }, phaseDot: { width: wide ? 11 : phone ? 8 : 9, height: wide ? 11 : phone ? 8 : 9, borderRadius: 99, backgroundColor: '#7690A0' }, phaseDotAccent: { backgroundColor: '#55D0BF' }, phaseDotWarn: { backgroundColor: '#B17A53' },
  recovery: { position: 'absolute', right: '7%', top: '13%', width: wide ? 75 : phone ? 48 : 60, height: wide ? 50 : phone ? 34 : 42 }, recoveryLine: { position: 'absolute', left: 0, bottom: 5, width: '84%', height: 4, borderRadius: 2, backgroundColor: '#55D0BF', transform: [{ rotate: '-32deg' }] }, recoveryHead: { position: 'absolute', right: 0, top: 0, width: wide ? 14 : phone ? 10 : 12, height: wide ? 14 : phone ? 10 : 12, borderTopWidth: 3, borderRightWidth: 3, borderColor: '#55D0BF' },
});