import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type Topic = 'exchange' | 'index' | 'etf' | 'bond' | 'forex' | 'commodity';

const exchangeHookImage = require('../../../assets/learning/academy/markets/markets-exchange-hook.jpg');

export interface AcademyMarketsStoryVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('borsa-ve-islem-yeri-nedir')) return 'exchange';
  if (assetRef.includes('borsa-endeksi-ne-anlatir')) return 'index';
  if (assetRef.includes('etf-nedir-nasil-calisir')) return 'etf';
  if (assetRef.includes('tahvil-fiyati-ve-getirisi')) return 'bond';
  if (assetRef.includes('forex-piyasasi-nasil-calisir')) return 'forex';
  if (assetRef.includes('emtia-piyasalari-nasil-calisir')) return 'commodity';
  return undefined;
}

export function isAcademyMarketsStoryAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function AcademyMarketsStoryVisual({
  assetRef,
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: AcademyMarketsStoryVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const tr = language === 'tr';

  if (topic === 'exchange' && role === 'hook') {
    return (
      <View style={styles.photoShell} accessibilityRole="image" accessibilityLabel={alt}>
        <Image source={exchangeHookImage} resizeMode="cover" style={styles.photo} />
      </View>
    );
  }

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {topic === 'exchange' ? <ExchangeStory role={role} tr={tr} styles={styles} /> : null}
      {topic === 'index' ? <IndexStory role={role} tr={tr} styles={styles} /> : null}
      {topic === 'etf' ? <EtfStory role={role} tr={tr} styles={styles} /> : null}
      {topic === 'bond' ? <BondStory role={role} tr={tr} styles={styles} /> : null}
      {topic === 'forex' ? <ForexStory role={role} tr={tr} styles={styles} /> : null}
      {topic === 'commodity' ? <CommodityStory role={role} tr={tr} styles={styles} /> : null}
    </View>
  );
}

type StoryProps = {
  role: LessonSupportingVisualRole;
  tr: boolean;
  styles: ReturnType<typeof createStyles>;
};

function Heading({ title, detail, styles }: { title: string; detail?: string; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.heading}>
      <Text style={styles.headingTitle}>{title}</Text>
      {detail ? <Text style={styles.headingDetail}>{detail}</Text> : null}
    </View>
  );
}

function SimpleCard({ label, value, styles, accent = false }: { label: string; value?: string; styles: ReturnType<typeof createStyles>; accent?: boolean }) {
  return (
    <View style={[styles.simpleCard, accent && styles.simpleCardAccent]}>
      <Text style={[styles.cardLabel, accent && styles.accentText]}>{label}</Text>
      {value ? <Text style={styles.cardValue}>{value}</Text> : null}
    </View>
  );
}

function Arrow({ styles, text = '→' }: { styles: ReturnType<typeof createStyles>; text?: string }) {
  return <Text style={styles.arrow}>{text}</Text>;
}

function ExchangeStory({ role, tr, styles }: StoryProps) {
  const title = role === 'hook'
    ? tr ? 'Emrin nereye gider?' : 'Where does your order go?'
    : role === 'misconception'
      ? tr ? 'Borsa fiyat etiketi yazmaz' : 'An exchange does not write the price tag'
      : role === 'summary'
        ? tr ? 'Borsa = buluşma yeri' : 'Exchange = meeting place'
        : tr ? 'Alıcı ve satıcı aynı pazarda buluşur' : 'Buyer and seller meet in one market';
  const detail = role === 'practice'
    ? tr ? 'Piyasaların saatleri ve kuralları farklı olabilir.' : 'Markets can have different hours and rules.'
    : tr ? 'Fiyat, uygun emirler eşleştiğinde oluşur.' : 'Price forms when compatible orders match.';

  return (
    <View style={styles.story}>
      <Heading title={title} detail={detail} styles={styles} />
      {role === 'practice' ? (
        <View style={styles.dualPanel}>
          <SimpleCard label={tr ? 'PİYASA A' : 'MARKET A'} value={tr ? 'Belirli saatler' : 'Defined hours'} styles={styles} />
          <SimpleCard label={tr ? 'PİYASA B' : 'MARKET B'} value={tr ? 'Farklı kurallar' : 'Different rules'} styles={styles} accent />
        </View>
      ) : role === 'misconception' ? (
        <View style={styles.centerStack}>
          <Text style={styles.largeMuted}>99</Text>
          <Text style={styles.meetSymbol}>↕</Text>
          <View style={styles.marketHub}><Text style={styles.marketHubText}>{tr ? 'EMİRLER' : 'ORDERS'}</Text></View>
          <Text style={styles.meetSymbol}>↕</Text>
          <Text style={styles.largeMuted}>101</Text>
        </View>
      ) : (
        <View style={styles.flowRow}>
          <SimpleCard label={tr ? 'ALICI' : 'BUYER'} value={tr ? 'alış emri' : 'buy order'} styles={styles} />
          <Arrow styles={styles} />
          <View style={styles.marketHub}><Text style={styles.marketHubText}>{tr ? 'BORSA' : 'EXCHANGE'}</Text></View>
          <Arrow styles={styles} text="←" />
          <SimpleCard label={tr ? 'SATICI' : 'SELLER'} value={tr ? 'satış emri' : 'sell order'} styles={styles} />
        </View>
      )}
    </View>
  );
}

function IndexStory({ role, tr, styles }: StoryProps) {
  const title = role === 'hook'
    ? tr ? 'Endeks yükselirken bir hisse düşebilir' : 'One stock can fall while the index rises'
    : role === 'summary'
      ? tr ? 'Endeks = grubun özeti' : 'Index = group summary'
      : role === 'misconception'
        ? tr ? 'Endeks ↑, herkes ↑ demek değildir' : 'Index ↑ does not mean everyone ↑'
        : tr ? 'Birçok şirket, tek özet' : 'Many companies, one summary';

  return (
    <View style={styles.story}>
      <Heading title={title} detail={tr ? 'Grubun üyeleri aynı yönde gitmek zorunda değildir.' : 'Members of the group do not have to move in the same direction.'} styles={styles} />
      <View style={styles.indexScene}>
        <View style={styles.indexMembers}>
          <IndexMember label="A" direction="↑" positive styles={styles} />
          <IndexMember label="B" direction={role === 'concept' ? '↑' : '↓'} positive={role === 'concept'} styles={styles} />
          <IndexMember label="C" direction="↑" positive styles={styles} />
        </View>
        <Arrow styles={styles} />
        <View style={styles.indexSummary}>
          <Text style={styles.indexSummaryLabel}>{tr ? 'ENDEKS' : 'INDEX'}</Text>
          <Text style={styles.indexSummaryValue}>↑</Text>
        </View>
      </View>
    </View>
  );
}

function IndexMember({ label, direction, positive, styles }: { label: string; direction: string; positive: boolean; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.indexMember}>
      <Text style={styles.indexMemberLabel}>{label}</Text>
      <Text style={[styles.indexDirection, positive ? styles.positive : styles.negative]}>{direction}</Text>
    </View>
  );
}

function EtfStory({ role, tr, styles }: StoryProps) {
  const title = role === 'hook'
    ? tr ? 'Tek pay, bir sepet' : 'One share, one basket'
    : role === 'practice'
      ? tr ? 'ETF’lerin içi aynı değildir' : 'ETFs do not all hold the same things'
      : role === 'misconception'
        ? tr ? 'ETF etiketi = güvenli demek değildir' : 'The ETF label does not mean safe'
        : role === 'summary'
          ? tr ? 'Önce paketin içine bak' : 'Look inside the package first'
          : tr ? 'ETF, bir varlık sepetine erişim sağlayabilir' : 'An ETF can provide access to a basket';

  return (
    <View style={styles.story}>
      <Heading title={title} detail={tr ? 'Risk, içindeki varlıklara bağlıdır.' : 'Risk depends on what is inside.'} styles={styles} />
      {role === 'practice' ? (
        <View style={styles.dualPanel}>
          <View style={styles.basketPanel}>
            <Text style={styles.basketTitle}>ETF A</Text>
            <View style={styles.basketDots}><Dot styles={styles} /><Dot styles={styles} /><Dot styles={styles} /><Dot styles={styles} /></View>
            <Text style={styles.basketCaption}>{tr ? 'geniş sepet' : 'broad basket'}</Text>
          </View>
          <View style={styles.basketPanel}>
            <Text style={styles.basketTitle}>ETF B</Text>
            <View style={styles.basketDots}><Dot styles={styles} /><Dot styles={styles} /></View>
            <Text style={styles.basketCaption}>{tr ? 'dar alan' : 'narrow focus'}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.etfScene}>
          <View style={styles.etfShare}><Text style={styles.etfShareText}>ETF</Text></View>
          <Arrow styles={styles} />
          <View style={styles.assetBasket}>
            <View style={styles.assetRow}><AssetToken label={tr ? 'ŞİRKET' : 'COMPANY'} styles={styles} /><AssetToken label={tr ? 'TAHVİL' : 'BOND'} styles={styles} /></View>
            <View style={styles.assetRow}><AssetToken label={tr ? 'ALTIN' : 'GOLD'} styles={styles} /><AssetToken label={tr ? 'SEKTÖR' : 'SECTOR'} styles={styles} /></View>
          </View>
        </View>
      )}
    </View>
  );
}

function Dot({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.dot} />;
}

function AssetToken({ label, styles }: { label: string; styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.assetToken}><Text style={styles.assetTokenText}>{label}</Text></View>;
}

function BondStory({ role, tr, styles }: StoryProps) {
  const title = role === 'hook'
    ? tr ? 'Tahvil = borç verme ilişkisi' : 'Bond = lending relationship'
    : role === 'practice'
      ? tr ? 'Piyasa faizi değişirse eski tahvilin fiyatı da değişebilir' : 'If market rates change, an older bond price can change too'
      : role === 'misconception'
        ? tr ? 'Sabit ödeme ≠ sabit piyasa fiyatı' : 'Fixed payments ≠ fixed market price'
        : role === 'summary'
          ? tr ? 'Borç verirsin, ödeme beklersin' : 'You lend and expect payments'
          : tr ? 'Devlet veya şirket borçlanır' : 'A government or company borrows';

  return (
    <View style={styles.story}>
      <Heading title={title} detail={tr ? 'Tahvilin fiyatı piyasada yine hareket edebilir.' : 'A bond’s market price can still move.'} styles={styles} />
      {role === 'practice' ? (
        <View style={styles.rateScene}>
          <SimpleCard label={tr ? 'YENİ FAİZLER' : 'NEW RATES'} value="↑" styles={styles} accent />
          <Arrow styles={styles} />
          <SimpleCard label={tr ? 'ESKİ TAHVİL FİYATI' : 'OLDER BOND PRICE'} value="↓" styles={styles} />
        </View>
      ) : (
        <View style={styles.bondFlow}>
          <SimpleCard label={tr ? 'YATIRIMCI' : 'INVESTOR'} styles={styles} />
          <View style={styles.verticalFlow}><Text style={styles.flowLabel}>{tr ? 'borç' : 'loan'}</Text><Text style={styles.flowArrow}>→</Text></View>
          <SimpleCard label={tr ? 'DEVLET / ŞİRKET' : 'GOVERNMENT / COMPANY'} styles={styles} accent />
          <View style={styles.verticalFlow}><Text style={styles.flowLabel}>{tr ? 'ödemeler' : 'payments'}</Text><Text style={styles.flowArrow}>←</Text></View>
        </View>
      )}
    </View>
  );
}

function ForexStory({ role, tr, styles }: StoryProps) {
  const title = role === 'hook'
    ? 'EUR / USD = ?'
    : role === 'misconception'
      ? tr ? '“Euro yükseldi” — neye göre?' : '“The euro rose” — against what?'
      : role === 'summary'
        ? tr ? 'Kur = iki para arasındaki oran' : 'Exchange rate = relationship between two currencies'
        : tr ? 'Bir para, diğerine göre değerlenir' : 'One currency is valued relative to another';

  return (
    <View style={styles.story}>
      <Heading title={title} detail={tr ? 'Kur tek bir paranın mutlak değeri değildir.' : 'An exchange rate is not one currency’s absolute value.'} styles={styles} />
      <View style={styles.fxScene}>
        <View style={styles.currencyBlock}><Text style={styles.currencyAmount}>1</Text><Text style={styles.currencyCode}>EUR</Text></View>
        <Text style={styles.fxEquals}>≈</Text>
        <View style={[styles.currencyBlock, styles.currencyBlockAccent]}><Text style={styles.currencyAmount}>1.10</Text><Text style={styles.currencyCode}>USD</Text></View>
      </View>
      {role === 'practice' ? <Text style={styles.fxNote}>EUR/USD ↑  ·  {tr ? 'EUR, USD’ye göre güçlenir' : 'EUR strengthens vs USD'}</Text> : null}
    </View>
  );
}

function CommodityStory({ role, tr, styles }: StoryProps) {
  const title = role === 'hook'
    ? tr ? 'Altın, petrol, buğday: ortak nokta ne?' : 'Gold, oil, wheat: what do they share?'
    : role === 'misconception'
      ? tr ? 'Hepsi emtia, ama aynı şekilde davranmaz' : 'All are commodities, but they do not behave the same'
      : role === 'summary'
        ? tr ? 'Emtia = ticareti yapılan temel ürün' : 'Commodity = basic traded good'
        : tr ? 'Gerçek ürün, kendi arz ve talebi' : 'Real goods, their own supply and demand';

  return (
    <View style={styles.story}>
      <Heading title={title} detail={tr ? 'Her ürünün fiyatını etkileyen koşullar farklı olabilir.' : 'Different conditions can drive each product’s price.'} styles={styles} />
      <View style={styles.commodityRow}>
        <View style={styles.commodityItem}><GoldBar styles={styles} /><Text style={styles.commodityLabel}>{tr ? 'ALTIN' : 'GOLD'}</Text></View>
        <View style={styles.commodityItem}><OilBarrel styles={styles} /><Text style={styles.commodityLabel}>{tr ? 'PETROL' : 'OIL'}</Text></View>
        <View style={styles.commodityItem}><Wheat styles={styles} /><Text style={styles.commodityLabel}>{tr ? 'BUĞDAY' : 'WHEAT'}</Text></View>
      </View>
      {role === 'practice' ? <Text style={styles.commodityNote}>{tr ? 'Arz · Talep · Üretim · Stok' : 'Supply · Demand · Production · Inventory'}</Text> : null}
    </View>
  );
}

function GoldBar({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.goldBar}><View style={styles.goldInset} /></View>;
}

function OilBarrel({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.oilBarrel}><View style={styles.barrelBand} /><View style={styles.barrelBand} /></View>;
}

function Wheat({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.wheatWrap}>
      <View style={styles.wheatStem} />
      <View style={[styles.grain, styles.grainOne]} />
      <View style={[styles.grain, styles.grainTwo]} />
      <View style={[styles.grain, styles.grainThree]} />
      <View style={[styles.grain, styles.grainFour]} />
    </View>
  );
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  photoShell: { width: '100%', aspectRatio: 16 / 9, overflow: 'hidden', borderRadius: 20, borderWidth: 1, borderColor: '#24465C', backgroundColor: '#06111B' },
  photo: { width: '100%', height: '100%' },
  shell: { width: '100%', minHeight: 238, borderRadius: 20, borderWidth: 1, borderColor: '#24465C', backgroundColor: '#081725', padding: 16, justifyContent: 'center' },
  story: { gap: 18 },
  heading: { gap: 5 },
  headingTitle: { color: theme.colors.text, fontSize: 18, lineHeight: 23, fontWeight: '900' },
  headingDetail: { color: '#93A9B8', fontSize: 12, lineHeight: 17 },
  flowRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  simpleCard: { flex: 1, minHeight: 72, maxWidth: 112, borderRadius: 15, borderWidth: 1, borderColor: '#294A60', backgroundColor: '#102235', padding: 10, alignItems: 'center', justifyContent: 'center', gap: 4 },
  simpleCardAccent: { borderColor: '#2C8076', backgroundColor: '#0D3538' },
  cardLabel: { color: '#D9E5EC', fontSize: 10, fontWeight: '900', textAlign: 'center' },
  cardValue: { color: '#8FA6B8', fontSize: 10, lineHeight: 14, textAlign: 'center' },
  accentText: { color: '#5EEAD4' },
  arrow: { color: '#55D8C8', fontSize: 21, fontWeight: '900' },
  marketHub: { minWidth: 72, minHeight: 72, borderRadius: 36, borderWidth: 1, borderColor: '#2F8B7E', backgroundColor: '#103B3C', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  marketHubText: { color: '#70F0DD', fontSize: 10, fontWeight: '900', textAlign: 'center' },
  dualPanel: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  centerStack: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  largeMuted: { color: '#7790A3', fontSize: 20, fontWeight: '900' },
  meetSymbol: { color: '#4DCDBD', fontSize: 18, fontWeight: '900' },
  indexScene: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  indexMembers: { flexDirection: 'row', gap: 7 },
  indexMember: { width: 48, height: 72, borderRadius: 13, borderWidth: 1, borderColor: '#294A60', backgroundColor: '#102235', alignItems: 'center', justifyContent: 'center', gap: 4 },
  indexMemberLabel: { color: '#91A7B9', fontSize: 10, fontWeight: '900' },
  indexDirection: { fontSize: 20, fontWeight: '900' },
  positive: { color: '#55D8C8' },
  negative: { color: '#E5A261' },
  indexSummary: { width: 76, height: 76, borderRadius: 18, borderWidth: 1, borderColor: '#2E8277', backgroundColor: '#0D3538', alignItems: 'center', justifyContent: 'center' },
  indexSummaryLabel: { color: '#A7C9C5', fontSize: 9, fontWeight: '900' },
  indexSummaryValue: { color: '#5EEAD4', fontSize: 25, fontWeight: '900' },
  etfScene: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  etfShare: { width: 74, height: 74, borderRadius: 18, borderWidth: 1, borderColor: '#2E8277', backgroundColor: '#0D3538', alignItems: 'center', justifyContent: 'center' },
  etfShareText: { color: '#6DEAD8', fontSize: 18, fontWeight: '900' },
  assetBasket: { gap: 7, padding: 10, borderRadius: 16, borderWidth: 1, borderColor: '#2A465B', backgroundColor: '#0E2030' },
  assetRow: { flexDirection: 'row', gap: 7 },
  assetToken: { width: 64, minHeight: 36, borderRadius: 10, backgroundColor: '#152A3D', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  assetTokenText: { color: '#AFC0CC', fontSize: 8, fontWeight: '900', textAlign: 'center' },
  basketPanel: { flex: 1, minHeight: 104, borderRadius: 16, borderWidth: 1, borderColor: '#294A60', backgroundColor: '#102235', padding: 12, gap: 8 },
  basketTitle: { color: '#E2EBF1', fontSize: 12, fontWeight: '900' },
  basketDots: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dot: { width: 18, height: 18, borderRadius: 6, backgroundColor: '#2B6D6A' },
  basketCaption: { color: '#8FA6B8', fontSize: 10, fontWeight: '700' },
  rateScene: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  bondFlow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  verticalFlow: { alignItems: 'center', gap: 1 },
  flowLabel: { color: '#8298A9', fontSize: 8, fontWeight: '800' },
  flowArrow: { color: '#55D8C8', fontSize: 18, fontWeight: '900' },
  fxScene: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  currencyBlock: { minWidth: 104, minHeight: 84, borderRadius: 17, borderWidth: 1, borderColor: '#294A60', backgroundColor: '#102235', alignItems: 'center', justifyContent: 'center', gap: 2 },
  currencyBlockAccent: { borderColor: '#2E8277', backgroundColor: '#0D3538' },
  currencyAmount: { color: '#F3F7FA', fontSize: 24, fontWeight: '900' },
  currencyCode: { color: '#7CCDC4', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  fxEquals: { color: '#7790A3', fontSize: 20, fontWeight: '900' },
  fxNote: { color: '#A5BBB9', fontSize: 11, lineHeight: 16, textAlign: 'center', fontWeight: '700' },
  commodityRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', gap: 10 },
  commodityItem: { flex: 1, minHeight: 105, alignItems: 'center', justifyContent: 'flex-end', gap: 10 },
  commodityLabel: { color: '#A8BBC8', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  commodityNote: { color: '#89A7B4', fontSize: 10, textAlign: 'center', fontWeight: '800' },
  goldBar: { width: 58, height: 38, borderRadius: 8, backgroundColor: '#9A7C41', borderWidth: 1, borderColor: '#C5A85F', transform: [{ skewX: '-8deg' }], padding: 6 },
  goldInset: { flex: 1, borderRadius: 4, borderWidth: 1, borderColor: '#CDB36D' },
  oilBarrel: { width: 48, height: 65, borderRadius: 13, backgroundColor: '#345163', borderWidth: 1, borderColor: '#668196', justifyContent: 'space-around', paddingVertical: 8 },
  barrelBand: { height: 4, backgroundColor: '#88A0B1' },
  wheatWrap: { width: 50, height: 72, position: 'relative', alignItems: 'center', justifyContent: 'flex-end' },
  wheatStem: { width: 3, height: 60, borderRadius: 2, backgroundColor: '#9A8B57' },
  grain: { position: 'absolute', width: 12, height: 7, borderRadius: 6, backgroundColor: '#B6A268' },
  grainOne: { top: 8, left: 11, transform: [{ rotate: '-28deg' }] },
  grainTwo: { top: 20, right: 10, transform: [{ rotate: '28deg' }] },
  grainThree: { top: 32, left: 10, transform: [{ rotate: '-28deg' }] },
  grainFour: { top: 44, right: 10, transform: [{ rotate: '28deg' }] },
});
