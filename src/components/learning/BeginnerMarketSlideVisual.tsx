import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type Topic = 'price' | 'instruments' | 'liquidity' | 'quotes' | 'orders' | 'slippage';

export interface BeginnerMarketSlideVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('fiyat-piyasada-nasil-olusur')) return 'price';
  if (assetRef.includes('piyasa-araclari-ayni-degildir')) return 'instruments';
  if (assetRef.includes('likidite-neden-onemlidir')) return 'liquidity';
  if (assetRef.includes('bid-ask-spread-nedir')) return 'quotes';
  if (assetRef.includes('piyasa-limit-stop-emirleri')) return 'orders';
  if (assetRef.includes('gerceklesme-fiyati-kayma')) return 'slippage';
  return undefined;
}

export function isBeginnerMarketSlideAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function BeginnerMarketSlideVisual({
  assetRef,
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: BeginnerMarketSlideVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {topic === 'price' ? <PriceScene tr={tr} role={role} styles={styles} /> : null}
      {topic === 'instruments' ? <InstrumentScene tr={tr} role={role} styles={styles} /> : null}
      {topic === 'liquidity' ? <LiquidityScene tr={tr} role={role} styles={styles} /> : null}
      {topic === 'quotes' ? <QuoteScene tr={tr} role={role} styles={styles} /> : null}
      {topic === 'orders' ? <OrderScene tr={tr} role={role} styles={styles} /> : null}
      {topic === 'slippage' ? <SlippageScene tr={tr} role={role} styles={styles} /> : null}
    </View>
  );
}

type SceneProps = {
  tr: boolean;
  role: LessonSupportingVisualRole;
  styles: ReturnType<typeof createStyles>;
};

function SceneHeader({ styles, title, subtitle }: { styles: ReturnType<typeof createStyles>; title: string; subtitle?: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function PriceScene({ tr, role, styles }: SceneProps) {
  const title = role === 'misconception'
    ? tr ? 'Fiyatı tek bir taraf seçmez' : 'One side does not choose the price'
    : role === 'summary'
      ? tr ? 'İki taraf aynı noktada buluşur' : 'Two sides meet at one point'
      : tr ? 'Alıcı ve satıcı buluşunca işlem olur' : 'A trade happens when buyer and seller meet';

  return (
    <View style={styles.scene}>
      <SceneHeader styles={styles} title={title} />
      <View style={styles.marketRow}>
        <View style={[styles.personCard, styles.buyerCard]}>
          <View style={styles.avatarShape}><View style={styles.avatarHead} /><View style={styles.avatarBody} /></View>
          <Text style={styles.smallLabel}>{tr ? 'ALICI' : 'BUYER'}</Text>
          <Text style={styles.bigValue}>100</Text>
        </View>
        <View style={styles.meetingColumn}>
          <View style={styles.meetingLine} />
          <View style={styles.meetingDot} />
          <Text style={styles.meetingText}>{tr ? 'İŞLEM' : 'TRADE'}</Text>
        </View>
        <View style={[styles.personCard, styles.sellerCard]}>
          <View style={styles.avatarShape}><View style={styles.avatarHead} /><View style={styles.avatarBody} /></View>
          <Text style={styles.smallLabel}>{tr ? 'SATICI' : 'SELLER'}</Text>
          <Text style={styles.bigValue}>100</Text>
        </View>
      </View>
    </View>
  );
}

function InstrumentScene({ tr, role, styles }: SceneProps) {
  return (
    <View style={styles.scene}>
      <SceneHeader
        styles={styles}
        title={role === 'misconception' ? (tr ? 'Benzer grafik, aynı ürün demek değildir' : 'Similar charts do not mean the same product') : (tr ? 'Aldığın şeyin anlamı değişir' : 'What you buy can mean different things')}
        subtitle={tr ? 'Önce neyi temsil ettiğini bil.' : 'Know what it represents first.'}
      />
      <View style={styles.instrumentGrid}>
        <View style={styles.instrumentCard}>
          <View style={styles.companyBuilding}><View style={styles.companyRoof} /><View style={styles.companyBody}><View style={styles.windowRow}><View style={styles.window} /><View style={styles.window} /></View><View style={styles.windowRow}><View style={styles.window} /><View style={styles.window} /></View></View></View>
          <Text style={styles.instrumentTitle}>{tr ? 'HİSSE' : 'STOCK'}</Text>
          <Text style={styles.instrumentSub}>{tr ? 'Şirkete ortaklık' : 'Company ownership'}</Text>
        </View>
        <View style={styles.instrumentCard}>
          <View style={styles.document}><View style={styles.documentLine} /><View style={styles.documentLineShort} /></View>
          <Text style={styles.instrumentTitle}>{tr ? 'TAHVİL' : 'BOND'}</Text>
          <Text style={styles.instrumentSub}>{tr ? 'Borç verme' : 'Lending'}</Text>
        </View>
        <View style={styles.instrumentCard}>
          <View style={styles.currencyPair}><View style={styles.coin}><Text style={styles.coinText}>₺</Text></View><View style={styles.coin}><Text style={styles.coinText}>$</Text></View></View>
          <Text style={styles.instrumentTitle}>{tr ? 'DÖVİZ' : 'FX'}</Text>
          <Text style={styles.instrumentSub}>{tr ? 'İki paranın değeri' : 'Two currencies'}</Text>
        </View>
        <View style={styles.instrumentCard}>
          <View style={styles.goldBar}><View style={styles.goldTop} /><View style={styles.goldFace} /></View>
          <Text style={styles.instrumentTitle}>{tr ? 'EMTİA' : 'COMMODITY'}</Text>
          <Text style={styles.instrumentSub}>{tr ? 'Altın, petrol…' : 'Gold, oil…'}</Text>
        </View>
      </View>
    </View>
  );
}

function LiquidityScene({ tr, role, styles }: SceneProps) {
  return (
    <View style={styles.scene}>
      <SceneHeader
        styles={styles}
        title={role === 'misconception' ? (tr ? 'Kalabalık görünmek yetmez' : 'Looking busy is not enough') : (tr ? 'Karşı taraf çoksa işlem daha kolaydır' : 'More people on the other side makes trading easier')}
      />
      <View style={styles.compareRow}>
        <View style={[styles.liquidityPanel, styles.liquidPanel]}>
          <View style={styles.dotCloud}>
            {Array.from({ length: 14 }).map((_, index) => <View key={`deep-${index}`} style={[styles.marketDot, index % 3 === 0 && styles.marketDotAccent]} />)}
          </View>
          <Text style={styles.compareTitle}>{tr ? 'ÇOK ALICI / SATICI' : 'MANY BUYERS / SELLERS'}</Text>
          <Text style={styles.compareResult}>{tr ? 'Daha kolay' : 'Easier'}</Text>
        </View>
        <View style={styles.liquidityPanel}>
          <View style={styles.dotCloudSparse}>
            {Array.from({ length: 4 }).map((_, index) => <View key={`thin-${index}`} style={[styles.marketDot, index === 0 && styles.marketDotAccent]} />)}
          </View>
          <Text style={styles.compareTitle}>{tr ? 'AZ ALICI / SATICI' : 'FEW BUYERS / SELLERS'}</Text>
          <Text style={styles.compareResultMuted}>{tr ? 'Daha zor' : 'Harder'}</Text>
        </View>
      </View>
    </View>
  );
}

function QuoteScene({ tr, role, styles }: SceneProps) {
  return (
    <View style={styles.scene}>
      <SceneHeader
        styles={styles}
        title={role === 'summary' ? (tr ? 'İki teklif arasındaki fark = spread' : 'Gap between two offers = spread') : (tr ? 'Aynı varlık, iki farklı teklif' : 'Same asset, two different offers')}
      />
      <View style={styles.quoteStage}>
        <View style={styles.quoteCard}>
          <Text style={styles.quoteLabel}>{tr ? 'ALICI TEKLİFİ' : 'BUYER OFFER'}</Text>
          <Text style={styles.quoteValue}>99</Text>
        </View>
        <View style={styles.spreadColumn}>
          <View style={styles.spreadLine} />
          <Text style={styles.spreadValue}>2</Text>
          <Text style={styles.spreadLabel}>SPREAD</Text>
        </View>
        <View style={styles.quoteCard}>
          <Text style={styles.quoteLabel}>{tr ? 'SATICI TEKLİFİ' : 'SELLER OFFER'}</Text>
          <Text style={styles.quoteValue}>101</Text>
        </View>
      </View>
    </View>
  );
}

function OrderScene({ tr, role, styles }: SceneProps) {
  const cards = [
    { title: tr ? 'ŞİMDİ' : 'NOW', sub: tr ? 'Hız öncelikli' : 'Speed first', mark: '→' },
    { title: tr ? 'FİYAT SINIRI' : 'PRICE LIMIT', sub: tr ? 'Sınır koy' : 'Set a boundary', mark: '|' },
    { title: tr ? 'TETİK' : 'TRIGGER', sub: tr ? 'Seviyeyi bekle' : 'Wait for a level', mark: '○' },
  ];
  return (
    <View style={styles.scene}>
      <SceneHeader
        styles={styles}
        title={role === 'misconception' ? (tr ? 'Tek emir her şeyi garanti etmez' : 'One order cannot guarantee everything') : (tr ? 'Emir türü neyi önemsediğini seçer' : 'Order type chooses what you prioritize')}
      />
      <View style={styles.orderRow}>
        {cards.map((card, index) => (
          <View key={card.title} style={[styles.orderCard, index === 1 && styles.orderCardAccent]}>
            <View style={styles.orderMark}><Text style={styles.orderMarkText}>{card.mark}</Text></View>
            <Text style={styles.orderTitle}>{card.title}</Text>
            <Text style={styles.orderSub}>{card.sub}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function SlippageScene({ tr, role, styles }: SceneProps) {
  return (
    <View style={styles.scene}>
      <SceneHeader
        styles={styles}
        title={role === 'misconception' ? (tr ? 'Ekrandaki fiyat kilitlenmez' : 'The screen price does not lock') : (tr ? 'Gördüğün fiyat ile işlem fiyatın farklı olabilir' : 'The price you see can differ from your trade price')}
      />
      <View style={styles.slippageStage}>
        <View style={styles.slippageCard}>
          <Text style={styles.smallLabel}>{tr ? 'EKRANDA' : 'ON SCREEN'}</Text>
          <Text style={styles.slippageValue}>100</Text>
        </View>
        <View style={styles.motionTrack}>
          <View style={styles.motionDot} />
          <View style={styles.motionLine} />
          <View style={styles.motionArrow}><Text style={styles.motionArrowText}>›</Text></View>
        </View>
        <View style={[styles.slippageCard, styles.slippageCardAccent]}>
          <Text style={styles.smallLabel}>{tr ? 'GERÇEKLEŞEN' : 'EXECUTED'}</Text>
          <Text style={styles.slippageValue}>100,3</Text>
        </View>
      </View>
      <Text style={styles.slippageHint}>{tr ? 'Piyasa senin emrin gelene kadar hareket edebilir.' : 'The market can move before your order executes.'}</Text>
    </View>
  );
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: {
    width: '100%',
    minHeight: 250,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#27465C',
    backgroundColor: '#081726',
    padding: 16,
    overflow: 'hidden',
  },
  scene: { flex: 1, gap: 16, justifyContent: 'center' },
  header: { gap: 5 },
  headerTitle: { color: theme.colors.text, fontSize: 18, lineHeight: 24, fontWeight: '900' },
  headerSubtitle: { color: '#8FA4B8', fontSize: 12, lineHeight: 17 },
  marketRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  personCard: { flex: 1, minHeight: 128, alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 16, borderWidth: 1, borderColor: '#30566A', backgroundColor: '#0E2637' },
  buyerCard: { borderColor: '#267A73', backgroundColor: '#0C2F35' },
  sellerCard: { borderColor: '#4A5E73' },
  avatarShape: { width: 40, height: 46, alignItems: 'center' },
  avatarHead: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#C7D6E1' },
  avatarBody: { width: 36, height: 24, marginTop: 4, borderTopLeftRadius: 15, borderTopRightRadius: 15, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, backgroundColor: '#6F8DA3' },
  smallLabel: { color: '#8FA4B8', fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  bigValue: { color: '#F8FAFC', fontSize: 24, fontWeight: '900' },
  meetingColumn: { width: 54, height: 112, alignItems: 'center', justifyContent: 'center' },
  meetingLine: { position: 'absolute', width: 1, height: 82, backgroundColor: '#2A6470' },
  meetingDot: { width: 17, height: 17, borderRadius: 9, backgroundColor: '#39D8C6', borderWidth: 4, borderColor: '#10363D' },
  meetingText: { marginTop: 52, color: '#5EEAD4', fontSize: 9, fontWeight: '900' },
  instrumentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  instrumentCard: { width: '48.5%', minHeight: 126, alignItems: 'center', justifyContent: 'center', gap: 6, padding: 10, borderRadius: 15, borderWidth: 1, borderColor: '#2A465C', backgroundColor: '#0E2031' },
  instrumentTitle: { color: '#EAF3F8', fontSize: 11, fontWeight: '900' },
  instrumentSub: { color: '#8298AA', fontSize: 10, textAlign: 'center' },
  companyBuilding: { width: 48, alignItems: 'center' },
  companyRoof: { width: 0, height: 0, borderLeftWidth: 24, borderRightWidth: 24, borderBottomWidth: 14, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#6C8BA0' },
  companyBody: { width: 42, height: 34, gap: 5, padding: 7, backgroundColor: '#334F65' },
  windowRow: { flexDirection: 'row', justifyContent: 'space-between' },
  window: { width: 8, height: 6, borderRadius: 2, backgroundColor: '#9BC0C8' },
  document: { width: 42, height: 52, padding: 10, gap: 8, borderRadius: 5, backgroundColor: '#C9D7E1' },
  documentLine: { height: 3, borderRadius: 2, backgroundColor: '#4E6A80' },
  documentLineShort: { width: '70%', height: 3, borderRadius: 2, backgroundColor: '#6C8799' },
  currencyPair: { flexDirection: 'row', gap: 6 },
  coin: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#4D7A83', backgroundColor: '#183944' },
  coinText: { color: '#DDE8ED', fontSize: 15, fontWeight: '900' },
  goldBar: { width: 54, height: 40, alignItems: 'center' },
  goldTop: { width: 38, height: 13, borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: '#B69048', transform: [{ skewX: '-18deg' }] },
  goldFace: { width: 46, height: 22, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, backgroundColor: '#8D6B31' },
  compareRow: { flexDirection: 'row', gap: 10 },
  liquidityPanel: { flex: 1, minHeight: 168, justifyContent: 'space-between', padding: 13, borderRadius: 16, borderWidth: 1, borderColor: '#31495E', backgroundColor: '#0D1E2D' },
  liquidPanel: { borderColor: '#28736D', backgroundColor: '#0D2A31' },
  dotCloud: { minHeight: 82, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: 7 },
  dotCloudSparse: { minHeight: 82, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  marketDot: { width: 15, height: 15, borderRadius: 8, backgroundColor: '#6B8295' },
  marketDotAccent: { backgroundColor: '#3CD8C6' },
  compareTitle: { color: '#9FB0C0', fontSize: 9, lineHeight: 13, fontWeight: '900', textAlign: 'center' },
  compareResult: { color: '#5EEAD4', fontSize: 15, fontWeight: '900', textAlign: 'center' },
  compareResultMuted: { color: '#C0CDD7', fontSize: 15, fontWeight: '900', textAlign: 'center' },
  quoteStage: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  quoteCard: { flex: 1, minHeight: 138, alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 16, borderWidth: 1, borderColor: '#31546A', backgroundColor: '#0F2435' },
  quoteLabel: { color: '#8FA4B8', fontSize: 9, fontWeight: '900', textAlign: 'center' },
  quoteValue: { color: '#F8FAFC', fontSize: 30, fontWeight: '900' },
  spreadColumn: { width: 56, alignItems: 'center', justifyContent: 'center', gap: 4 },
  spreadLine: { width: 38, height: 2, backgroundColor: '#38D6C3' },
  spreadValue: { color: '#5EEAD4', fontSize: 19, fontWeight: '900' },
  spreadLabel: { color: '#7393A5', fontSize: 7, fontWeight: '900', letterSpacing: 0.4 },
  orderRow: { flexDirection: 'row', gap: 7 },
  orderCard: { flex: 1, minHeight: 150, alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 7, borderRadius: 15, borderWidth: 1, borderColor: '#31495E', backgroundColor: '#0E2030' },
  orderCardAccent: { borderColor: '#2F746E', backgroundColor: '#0E2B31' },
  orderMark: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#17384A' },
  orderMarkText: { color: '#63E4D1', fontSize: 22, fontWeight: '800' },
  orderTitle: { color: '#EAF3F8', fontSize: 9, lineHeight: 12, fontWeight: '900', textAlign: 'center' },
  orderSub: { color: '#8499AA', fontSize: 9, lineHeight: 12, textAlign: 'center' },
  slippageStage: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  slippageCard: { flex: 1, minHeight: 130, alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 16, borderWidth: 1, borderColor: '#315066', backgroundColor: '#0E2132' },
  slippageCardAccent: { borderColor: '#2F716B', backgroundColor: '#0D2B30' },
  slippageValue: { color: '#F8FAFC', fontSize: 28, fontWeight: '900' },
  motionTrack: { width: 56, height: 36, flexDirection: 'row', alignItems: 'center' },
  motionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6D8293' },
  motionLine: { flex: 1, height: 2, backgroundColor: '#2D7A75' },
  motionArrow: { width: 19, height: 19, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2D7A75' },
  motionArrowText: { marginTop: -2, color: '#E8FFFC', fontSize: 18, fontWeight: '900' },
  slippageHint: { color: '#8297AA', fontSize: 10, lineHeight: 15, textAlign: 'center' },
});
